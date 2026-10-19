// API домашних заданий: ответы и аудио учеников хранятся в Cloudflare KV.
// Всё остальное (уроки, тренажёр) отдаётся как обычные файлы из ./public.
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};
const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { 'Content-Type': 'application/json; charset=utf-8', ...CORS } });
const okId = (s) => typeof s === 'string' && /^[a-z0-9-]{1,40}$/i.test(s);
const okItem = (s) => typeof s === 'string' && /^[a-z0-9_-]{1,30}$/i.test(s);

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
        return json({ ok: true });
      }
      // Ученик отправляет аудиозапись
      if (p === '/api/dz/audio' && req.method === 'POST') {
        const hw = q.get('hw'), sid = q.get('sid'), item = q.get('item');
        if (!okId(hw) || !okId(sid) || !okItem(item)) return json({ error: 'bad' }, 400);
        const buf = await req.arrayBuffer();
        if (buf.byteLength < 200 || buf.byteLength > 3_000_000) return json({ error: 'size' }, 413);
        const type = (req.headers.get('Content-Type') || 'audio/webm').slice(0, 60);
        await env.DZ.put(`${hw}:aud:${sid}:${item}`, buf, { metadata: { type, size: buf.byteLength, ts: Date.now() } });
        return json({ ok: true });
      }
      // Учитель: список всех сдавших
      if (p === '/api/dz/list') {
        if (q.get('key') !== env.TEACHER_KEY) return json({ error: 'key' }, 403);
        const hw = q.get('hw'); if (!okId(hw)) return json({ error: 'bad' }, 400);
        const subs = [], aud = {};
        let cur;
        do { const r = await env.DZ.list({ prefix: `${hw}:sub:`, cursor: cur }); for (const k of r.keys) { const v = await env.DZ.get(k.name); if (v) subs.push(JSON.parse(v)); } cur = r.list_complete ? null : r.cursor; } while (cur);
        cur = undefined;
        do { const r = await env.DZ.list({ prefix: `${hw}:aud:`, cursor: cur }); for (const k of r.keys) { const [, , sid, item] = k.name.split(':'); (aud[sid] = aud[sid] || {})[item] = k.metadata || {}; } cur = r.list_complete ? null : r.cursor; } while (cur);
        return json({ subs, aud });
      }
      // Учитель: прослушать запись
      if (p === '/api/dz/play') {
        if (q.get('key') !== env.TEACHER_KEY) return json({ error: 'key' }, 403);
        const { value, metadata } = await env.DZ.getWithMetadata(`${q.get('hw')}:aud:${q.get('sid')}:${q.get('item')}`, 'arrayBuffer');
        if (!value) return json({ error: 'none' }, 404);
        return new Response(value, { headers: { 'Content-Type': (metadata && metadata.type) || 'audio/webm', ...CORS } });
      }
      return json({ error: 'not found' }, 404);
    } catch (e) {
      return json({ error: String(e && e.message || e) }, 500);
    }
  },
};
