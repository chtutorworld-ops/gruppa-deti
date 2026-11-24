// API домашних заданий: ответы и аудио учеников хранятся в Cloudflare KV.
// Ключа учителя нет: кабинеты учителя, записи учеников и запись голоса открываются по ссылке.
// Всё остальное (уроки, тренажёр) отдаётся как обычные файлы из ./public.
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};
const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { 'Content-Type': 'application/json; charset=utf-8', ...CORS } });
const okId = (s) => typeof s === 'string' && /^[a-z0-9-]{1,40}$/i.test(s);
const okItem = (s) => typeof s === 'string' && /^[a-z0-9_-]{1,30}$/i.test(s);

// Список сдавших хранится в ключе `${hw}:idx`, чтобы кабинет учителя не тратил
// дневной лимит операций list в KV (на бесплатном тарифе их 1000 в сутки).
// Полный list делаем не чаще раза в 10 минут — он подхватывает то, что могло потеряться.
const FULL_EVERY = 10 * 60 * 1000;
const readIdx = async (env, hw) => JSON.parse((await env.DZ.get(`${hw}:idx`)) || '{"sids":[],"aud":{}}');
const writeIdx = async (env, hw, idx) => { try { await env.DZ.put(`${hw}:idx`, JSON.stringify(idx)); } catch (e) { /* лимит 1 запись/с на ключ: следующий полный list всё догонит */ } };
async function fullIdx(env, hw) {
  const idx = { sids: [], aud: {}, full: Date.now() };
  let cur;
  do { const r = await env.DZ.list({ prefix: `${hw}:sub:`, cursor: cur }); for (const k of r.keys) idx.sids.push(k.name.split(':')[2]); cur = r.list_complete ? null : r.cursor; } while (cur);
  cur = undefined;
  do { const r = await env.DZ.list({ prefix: `${hw}:aud:`, cursor: cur }); for (const k of r.keys) { const [, , sid, item] = k.name.split(':'); (idx.aud[sid] = idx.aud[sid] || {})[item] = k.metadata || {}; } cur = r.list_complete ? null : r.cursor; } while (cur);
  await writeIdx(env, hw, idx);
  return idx;
}

// Через VPN режутся отправки больше ~4 КБ, поэтому страница шлёт находку кусочками (/chunk),
// а потом просит собрать её (/commit). Всё хранится в SQLite этого объекта:
// лимиты там 100 000 записанных строк в сутки, а не 1000, как у KV.
export class NhStore {
  constructor(state, env) {
    this.env = env;
    this.sql = state.storage.sql;
    this.sql.exec(`CREATE TABLE IF NOT EXISTS tmp (k TEXT PRIMARY KEY, t TEXT, ts INTEGER);
      CREATE TABLE IF NOT EXISTS item (id TEXT PRIMARY KEY, body TEXT, ord INTEGER);
      CREATE TABLE IF NOT EXISTS img (id TEXT PRIMARY KEY, type TEXT, v TEXT, data BLOB);
      CREATE TABLE IF NOT EXISTS meta (k TEXT PRIMARY KEY, v TEXT);`);
  }
  one(q, ...a) { const r = this.sql.exec(q, ...a).toArray(); return r[0]; }
  // Один раз переносим старые находки из KV (только чтение KV, записей не тратит).
  async migrate() {
    if (this.one("SELECT v FROM meta WHERE k='kv'")) return;
    const idx = JSON.parse((await this.env.DZ.get('nh:idx')) || '[]');
    let ord = 0;
    for (const id of idx) {
      const body = await this.env.DZ.get(`nh:item:${id}`);
      if (body) this.sql.exec('INSERT OR REPLACE INTO item (id, body, ord) VALUES (?, ?, ?)', id, body, ord++);
      const { value, metadata } = await this.env.DZ.getWithMetadata(`nh:img:${id}`, 'arrayBuffer');
      if (value) this.sql.exec('INSERT OR REPLACE INTO img (id, type, v, data) VALUES (?, ?, ?, ?)', id, (metadata && metadata.type) || 'image/jpeg', (metadata && metadata.v) || '', value);
    }
    this.sql.exec("INSERT OR REPLACE INTO meta (k, v) VALUES ('kv', ?)", String(Date.now()));
  }
  async fetch(req) {
    const url = new URL(req.url), p = url.pathname, q = url.searchParams;
    try {
      await this.migrate();
      const okNh = (s) => typeof s === 'string' && /^[a-z0-9-]{1,40}$/i.test(s);
      const okNum = (s, max) => /^\d{1,6}$/.test(s || '') && +s <= max;
      const id = q.get('id');
      if (p === '/api/nh/chunk' && req.method === 'POST') {
        const v = q.get('v'), n = q.get('n');
        if (!okNh(id) || !okNh(v) || !okNum(n, 2000)) return json({ error: 'bad' }, 400);
        const t = await req.text();
        if (t.length > 8000) return json({ error: 'size' }, 413);
        this.sql.exec('INSERT OR REPLACE INTO tmp (k, t, ts) VALUES (?, ?, ?)', `${id}:${v}:${n}`, t, Date.now());
        return json({ ok: true });
      }
      if (p === '/api/nh/commit' && req.method === 'POST') {
        const v = q.get('v'), count = q.get('count'), what = q.get('what') === 'img' ? 'img' : 'item';
        if (!okNh(id) || !okNh(v) || !okNum(count, 2000) || +count < 1) return json({ error: 'bad' }, 400);
        const parts = [];
        for (let n = 0; n < +count; n++) {
          const r = this.one('SELECT t FROM tmp WHERE k = ?', `${id}:${v}:${n}`);
          if (!r) return json({ error: 'missing', n }, 409);
          parts.push(r.t);
        }
        const s = parts.join('');
        if (what === 'img') {
          const m = /^data:(image\/[a-z+]+);base64,(.+)$/.exec(s);
          if (!m) return json({ error: 'bad img' }, 400);
          const bin = Uint8Array.from(atob(m[2]), (c) => c.charCodeAt(0));
          if (bin.byteLength > 1_900_000) return json({ error: 'size' }, 413);
          this.sql.exec('INSERT OR REPLACE INTO img (id, type, v, data) VALUES (?, ?, ?, ?)', id, m[1], v, bin.buffer);
        } else {
          const item = JSON.parse(s);
          item.id = id; item.saved = Date.now();
          const out = JSON.stringify(item);
          if (new TextEncoder().encode(out).length > 1_900_000) return json({ error: 'size' }, 413);
          const old = this.one('SELECT ord FROM item WHERE id = ?', id);
          const ord = old ? old.ord : ((this.one('SELECT MAX(ord) AS m FROM item') || {}).m ?? -1) + 1;
          this.sql.exec('INSERT OR REPLACE INTO item (id, body, ord) VALUES (?, ?, ?)', id, out, ord);
        }
        this.sql.exec('DELETE FROM tmp WHERE k LIKE ? OR ts < ?', `${id}:${v}:%`, Date.now() - 86400000);
        return json({ ok: true });
      }
      if (p === '/api/nh/del' && req.method === 'POST') {
        if (!okNh(id)) return json({ error: 'bad' }, 400);
        this.sql.exec('DELETE FROM item WHERE id = ?', id);
        this.sql.exec('DELETE FROM img WHERE id = ?', id);
        return json({ ok: true });
      }
      if (p === '/api/nh/all') {
        const items = this.sql.exec('SELECT body FROM item ORDER BY ord').toArray().map((r) => JSON.parse(r.body));
        return new Response(JSON.stringify({ items }), { headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...CORS } });
      }
      if (p === '/api/nh/img') {
        if (!okNh(id)) return json({ error: 'bad' }, 400);
        const r = this.one('SELECT type, data FROM img WHERE id = ?', id);
        if (!r) return json({ error: 'none' }, 404);
        return new Response(r.data, { headers: { 'Content-Type': r.type || 'image/jpeg', 'Cache-Control': 'public, max-age=31536000', ...CORS } });
      }
      return json({ error: 'not found' }, 404);
    } catch (e) {
      return json({ error: String(e && e.message || e) }, 500);
    }
  }
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (!url.pathname.startsWith('/api/')) return env.ASSETS.fetch(req);
    if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });
    const p = url.pathname, q = url.searchParams;
    try {
      // Ученик сохраняет часть задания
      if (p === '/api/dz/save' && req.method === 'POST') {
        const b = await req.json();
        if (!okId(b.hw) || !okId(b.sid) || !okItem(b.part)) return json({ error: 'bad' }, 400);
        const name = String(b.name || '').slice(0, 60).trim();
        const key = `${b.hw}:sub:${b.sid}`;
        const cur = JSON.parse((await env.DZ.get(key)) || '{}');
        cur.sid = b.sid; cur.name = name || cur.name || '?'; cur.parts = cur.parts || {};
        cur.parts[b.part] = { ...(b.data || {}), ts: Date.now() };
        cur.updated = Date.now(); cur.ua = (req.headers.get('User-Agent') || '').slice(0, 120);
        const s = JSON.stringify(cur);
        if (s.length > 60000) return json({ error: 'too big' }, 413);
        await env.DZ.put(key, s);
        const idx = await readIdx(env, b.hw);
        if (!idx.sids.includes(b.sid)) { idx.sids.push(b.sid); await writeIdx(env, b.hw, idx); }
        return json({ ok: true });
      }
      // Ученик отправляет аудиозапись
      if (p === '/api/dz/audio' && req.method === 'POST') {
        const hw = q.get('hw'), sid = q.get('sid'), item = q.get('item');
        if (!okId(hw) || !okId(sid) || !okItem(item)) return json({ error: 'bad' }, 400);
        const buf = await req.arrayBuffer();
        if (buf.byteLength < 200 || buf.byteLength > 3_000_000) return json({ error: 'size' }, 413);
        const type = (req.headers.get('Content-Type') || 'audio/webm').slice(0, 60);
        const meta = { type, size: buf.byteLength, ts: Date.now() };
        await env.DZ.put(`${hw}:aud:${sid}:${item}`, buf, { metadata: meta });
        const idx = await readIdx(env, hw);
        (idx.aud[sid] = idx.aud[sid] || {})[item] = meta;
        await writeIdx(env, hw, idx);
        return json({ ok: true });
      }
      // Учитель: список всех сдавших
      if (p === '/api/dz/list') {
        const hw = q.get('hw'); if (!okId(hw)) return json({ error: 'bad' }, 400);
        let idx = await readIdx(env, hw);
        if (!idx.full || Date.now() - idx.full > FULL_EVERY) { try { idx = await fullIdx(env, hw); } catch (e) { /* лимит list исчерпан: отдаём то, что есть в индексе, и пробуем снова через 10 минут */ idx.full = Date.now(); await writeIdx(env, hw, idx); } }
        const subs = (await Promise.all(idx.sids.map((sid) => env.DZ.get(`${hw}:sub:${sid}`)))).filter(Boolean).map((v) => JSON.parse(v));
        const aud = idx.aud;
        return json({ subs, aud });
      }
      // Слайд «Наши имена»: только имена тех, кто прописал своё имя (без результатов)
      if (p === '/api/dz/board') {
        const hw = q.get('hw'); if (!okId(hw)) return json({ error: 'bad' }, 400);
        const idx = await readIdx(env, hw);
        const subs = (await Promise.all(idx.sids.map((sid) => env.DZ.get(`${hw}:sub:${sid}`)))).filter(Boolean).map((v) => JSON.parse(v));
        const names = [...new Set(subs.map((x) => x.parts && x.parts.name && x.parts.name.done && x.parts.name.me).filter((x) => typeof x === 'string'))];
        return json({ names });
      }
      // Учитель: прослушать запись
      if (p === '/api/dz/play') {
        const { value, metadata } = await env.DZ.getWithMetadata(`${q.get('hw')}:aud:${q.get('sid')}:${q.get('item')}`, 'arrayBuffer');
        if (!value) return json({ error: 'none' }, 404);
        return new Response(value, { headers: { 'Content-Type': (metadata && metadata.type) || 'audio/webm', ...CORS } });
      }
      // Проверка связи (страница zapis/proverka.html): принимает тело и возвращает его размер, в KV ничего не пишет
      if (p === '/api/ping') {
        const n = req.method === 'POST' ? (await req.arrayBuffer()).byteLength : 0;
        return json({ ok: true, n, m: req.method });
      }
      // Голос учителя: эталонные записи слогов
      // один слог (ba1, b0) или слово/фраза из 2–6 слогов с номерами тонов (da3gu3, wo3jiao4ma3ke3)
      const okV = (s) => typeof s === 'string' && (/^[a-z]{1,6}[0-4]$/.test(s) || /^(?:[a-z]{1,6}[0-4]){2,6}$/.test(s));
      if (p === '/api/voice/put' && req.method === 'POST') {
        const id = q.get('id'); if (!okV(id)) return json({ error: 'bad' }, 400);
        const buf = await req.arrayBuffer();
        if (buf.byteLength < 500 || buf.byteLength > 2_000_000) return json({ error: 'size' }, 413);
        // Страница записи шлёт text/plain (простой запрос без preflight — так надёжнее в Safari), тип звука — в ?type=
        const hdr = req.headers.get('Content-Type') || '';
        const vtype = (hdr && !/^text\//.test(hdr) ? hdr : (q.get('type') || 'audio/wav')).slice(0, 60);
        await env.DZ.put(`voice:${id}`, buf, { metadata: { type: vtype, size: buf.byteLength, ts: Date.now() } });
        return json({ ok: true });
      }
      if (p === '/api/voice/del' && req.method === 'POST') {
        const id = q.get('id'); if (!okV(id)) return json({ error: 'bad' }, 400);
        await env.DZ.delete(`voice:${id}`); return json({ ok: true });
      }
      if (p === '/api/voice/list') {
        const out = []; let cur;
        do { const r = await env.DZ.list({ prefix: 'voice:', cursor: cur }); for (const k of r.keys) out.push({ id: k.name.slice(6), ...(k.metadata || {}) }); cur = r.list_complete ? null : r.cursor; } while (cur);
        return json({ items: out });
      }
      if (p === '/api/voice/get') {
        const id = q.get('id'); if (!okV(id)) return json({ error: 'bad' }, 400);
        const { value, metadata } = await env.DZ.getWithMetadata(`voice:${id}`, 'arrayBuffer');
        if (!value) return json({ error: 'none' }, 404);
        return new Response(value, { headers: { 'Content-Type': (metadata && metadata.type && !/^text\//.test(metadata.type) && metadata.type) || 'audio/wav', 'Cache-Control': 'no-store', ...CORS } });
      }
      // Копилка UI-находок (site/nahodki/) живёт в Durable Object NhStore (база SQLite).
      // Раньше она лежала в KV, но у KV на бесплатном тарифе всего 1000 записей в сутки
      // на весь аккаунт, и одна находка тратила десятки записей (кусочки + сборка).
      if (p.startsWith('/api/nh/')) {
        return env.NH.get(env.NH.idFromName('main')).fetch(req);
      }
      return json({ error: 'not found' }, 404);
    } catch (e) {
      return json({ error: String(e && e.message || e) }, 500);
    }
  },
};
