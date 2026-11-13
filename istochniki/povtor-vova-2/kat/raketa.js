/* Повторение 2 · «Звуковая ракета» на сцене 1280×720 (весь экран, как крот и ниндзя).
   Звучит слог — и одновременно справа вылетает стена с 4 воротами. На воротах — линия тона или буква инициали.
   Нажми на ворота (или на их ряд) — ракета перелетает туда. Попал в нужные — очки, нет — ракета трясётся, показываем правильные.
   16 ворот: через раз тон и инициаль (b–p, d–t, g–k, n–l, f–h). Классы — только с приставкой zr- (не пересекаются с оформлением страниц). */
(function(){
  const W = 1280, H = 720, LANES = [210, 340, 470, 600], RX = 190, ROUNDS = 16;
  const TP = {1: [[0, 5], [1, 5]], 2: [[0, 3], [1, 5]], 3: [[0, 2], [.42, 1], [.58, 1], [1, 4]], 4: [[0, 5], [1, 1]]};
  const TCOL = {1: '#36E3A6', 2: '#FFC447', 3: '#B3A6FF', 4: '#FF6E9C'};
  const TSH = {1: 'ровно', 2: 'вверх', 3: 'ямка', 4: 'вниз'};
  const T4 = ['ma', 'ba', 'da', 'di', 'ti', 'pi', 'mi', 'fu', 'du', 'tu', 'hu', 'lu', 'bi', 'pu'];
  const IP = [['b', 'p'], ['d', 't'], ['g', 'k'], ['n', 'l'], ['f', 'h']];
  const RU = {b: 'б', p: 'п', d: 'д', t: 'т', g: 'г', k: 'к', n: 'н', l: 'л', f: 'ф', h: 'х', m: 'м'};
  const ASP = {p: 1, t: 1, k: 1};
  const FINS = ['a', 'o', 'e', 'i', 'u'];
  const V = {a: 'āáǎà', o: 'ōóǒò', e: 'ēéěè', i: 'īíǐì', u: 'ūúǔù'};
  const mk = (b, t) => { let k = b.search(/a|e/); if (k < 0) k = b.indexOf('ou'); if (k < 0) { for (let j = b.length - 1; j >= 0; j--) if ('aeiou'.includes(b[j])) { k = j; break; } } return b.slice(0, k) + V[b[k]][t - 1] + b.slice(k + 1); };
  const vr = (b, t) => window.SYL && SYL.variant(b, t);
  const tones = b => [1, 2, 3, 4].filter(t => vr(b, t));
  // слоги для инициалей: обе буквы пары есть с этой финалью
  const iniPool = () => { const L = []; IP.forEach(pr => FINS.forEach(f => { if (pr.every(x => tones(x + f).length)) pr.forEach(x => L.push({x, f, pr})); })); return L; };
  const tonePool = () => T4.filter(b => tones(b).length === 4);
  const allChars = () => { const c = new Set(); tonePool().forEach(b => [1, 2, 3, 4].forEach(t => c.add(vr(b, t).c))); iniPool().forEach(o => tones(o.x + o.f).forEach(t => c.add(vr(o.x + o.f, t).c))); return [...c]; };
  const css = `
.g-raketa{background:#070B2A;user-select:none;-webkit-user-select:none;touch-action:none;font-family:Manrope,system-ui,sans-serif}
.g-raketa canvas{position:absolute;left:0;top:0;width:1280px;height:720px}
.g-raketa .zr-hud{position:absolute;left:24px;right:24px;top:16px;display:flex;align-items:center;gap:24px;color:#fff;font:900 30px Nunito,Manrope,sans-serif;z-index:3;text-shadow:0 2px 6px rgba(0,0,0,.5);pointer-events:none}
.g-raketa .zr-hud .zr-sp{flex:1}
.g-raketa .zr-say{pointer-events:auto;border:0;cursor:pointer;width:84px;height:64px;border-radius:20px;background:rgba(255,255,255,.18);font-size:34px;color:#fff;box-shadow:inset 0 0 0 2px rgba(255,255,255,.35);margin-right:64px}
.g-raketa .zr-say.zr-on{background:rgba(54,227,166,.45)}
.g-raketa .zr-task{position:absolute;left:50%;top:84px;transform:translateX(-50%);z-index:3;padding:8px 24px;border-radius:99px;background:rgba(255,255,255,.14);color:#E6E2FF;font:800 24px Manrope,sans-serif;white-space:nowrap;pointer-events:none}
.g-raketa .zr-fb{position:absolute;left:50%;bottom:20px;transform:translateX(-50%);z-index:3;padding:10px 28px;border-radius:99px;font:800 28px Manrope,sans-serif;color:#fff;background:rgba(0,0,0,.4);white-space:nowrap;pointer-events:none;opacity:0;transition:opacity .2s}
.g-raketa .zr-fb.zr-show{opacity:1}.g-raketa .zr-fb.zr-good{background:rgba(31,167,122,.9)}.g-raketa .zr-fb.zr-bad{background:rgba(240,64,122,.9)}
.g-raketa .zr-fb b{font-family:Nunito,sans-serif;font-weight:900}
.g-raketa .zr-scr{position:absolute;inset:0;z-index:8;display:grid;place-items:center;background:rgba(7,11,42,.6)}
.g-raketa .zr-hide{display:none}
.g-raketa .zr-pan{width:860px;text-align:center;color:#fff;padding:34px 48px;border-radius:34px;background:linear-gradient(180deg,rgba(43,50,140,.95),rgba(14,12,58,.97));box-shadow:0 30px 80px rgba(0,0,0,.5)}
.g-raketa .zr-pan h2{margin:0 0 10px;font:900 54px Nunito,sans-serif;color:#FFE59A}
.g-raketa .zr-pan p{margin:8px 0;font:600 25px/1.4 Manrope,sans-serif;color:#DCD6FF}
.g-raketa .zr-pan p b{color:#fff}
.g-raketa .zr-go{margin-top:18px;border:0;cursor:pointer;font:900 34px Nunito,sans-serif;color:#1C1460;padding:18px 64px;border-radius:99px;background:linear-gradient(135deg,#FFE59A,#FFB84D);box-shadow:0 12px 30px rgba(255,184,77,.4)}
.g-raketa .zr-cd{font:900 170px Nunito,sans-serif;color:#FFE59A}
.g-raketa .zr-big{font:900 86px Nunito,sans-serif;color:#FFE59A;margin:6px 0}
.g-raketa .zr-miss{font:900 28px Nunito,sans-serif;color:#fff}
.g-raketa.zr-quake{animation:zrq .45s}
@keyframes zrq{20%{transform:translate(-12px,4px)}40%{transform:translate(10px,-6px)}60%{transform:translate(-6px,3px)}80%{transform:translate(4px,0)}}`;

  KAT.register({
    id: 'raketa', title: 'Звуковая ракета', css,
    get audio(){ try { return allChars(); } catch (e) { return []; } },
    mount(stage, K){
      const root = document.createElement('div');
      root.style.cssText = 'position:absolute;inset:0';
      root.innerHTML = `<canvas width="1920" height="1080"></canvas>
        <div class="zr-hud"><span class="zr-rd">🚀 1 / ${ROUNDS}</span><span class="zr-pts">⭐ 0</span><span class="zr-st"></span><span class="zr-sp"></span><button class="zr-say" type="button" title="Послушать ещё раз">🔊</button></div>
        <div class="zr-task zr-hide"></div><div class="zr-fb"></div>
        <div class="zr-scr zr-start"><div class="zr-pan"><h2>🚀 Звуковая ракета</h2>
          <p>Звучит слог — и летят <b>4 ворот</b>. На воротах — <b>линия тона</b> или <b>буква</b>.</p>
          <p><b>Нажми на нужные ворота</b> — ракета перелетит туда. Можно нажимать сколько хочешь, пока ворота не подлетели.</p>
          <p>16 ворот. Кнопка 🔊 наверху — послушать ещё раз.</p>
          <button class="zr-go" type="button">🚀 Полетели!</button></div></div>
        <div class="zr-scr zr-cdn zr-hide"><div class="zr-cd">3</div></div>
        <div class="zr-scr zr-end zr-hide"></div>`;
      stage.appendChild(root);
      const $ = s => root.querySelector(s);
      const cv = $('canvas'), cx = cv.getContext('2d'); cx.setTransform(1.5, 0, 0, 1.5, 0, 0);
      let state = 'start', raf = 0, last = 0, timers = [];
      let rounds, ri, wall, lane, ry, pts, streak, right, wrong, miss, res, parts, stars, fbT = 0, gap = 0, quake = 0, flame = 0;
      const later = (f, ms) => { const id = setTimeout(f, ms); timers.push(id); return id; };
      // звёзды: 3 слоя
      stars = []; for (let k = 0; k < 140; k++) stars.push({x: Math.random() * W, y: Math.random() * H, z: [.3, .6, 1][k % 3], r: Math.random() * 1.6 + .4});
      const say = () => { const r = rounds && rounds[ri]; if (!r) return; const b = $('.zr-say'); b.classList.add('zr-on'); K.say(r.c).then(() => b.classList.remove('zr-on')); };
      $('.zr-say').addEventListener('pointerdown', e => { e.stopPropagation(); });
      $('.zr-say').onclick = e => { e.stopPropagation(); say(); };
      const fb = (cls, html) => { const f = $('.zr-fb'); f.className = 'zr-fb zr-show ' + cls; f.innerHTML = html; clearTimeout(fbT); fbT = later(() => f.classList.remove('zr-show'), 1700); };
      const hud = () => { $('.zr-rd').textContent = `🚀 ${Math.min(ri + 1, ROUNDS)} / ${ROUNDS}`; $('.zr-pts').textContent = '⭐ ' + pts; $('.zr-st').textContent = streak >= 3 ? '🔥 ×' + streak : ''; };
      function makeRounds(){
        const TP0 = K.shuffle(tonePool()), IPL = iniPool(), L = [];
        const tq = K.shuffle([1, 2, 3, 4, 1, 2, 3, 4]);
        for (let k = 0; k < ROUNDS; k++) {
          if (k % 2 === 0) { const t = tq[k / 2], b = TP0[(k / 2) % TP0.length], s = mk(b, t);
            L.push({kind: 'tone', s, c: vr(b, t).c, opts: K.shuffle([1, 2, 3, 4]).map(String), ok: String(t), t}); }
          else { const o = K.pick(IPL), b = o.x + o.f, t = K.pick(tones(b)), s = mk(b, t);
            const others = K.shuffle(IP.filter(p => p !== o.pr).flat()).slice(0, 2);
            L.push({kind: 'ini', s, c: vr(b, t).c, opts: K.shuffle([o.pr[0], o.pr[1], ...others]), ok: o.x, x: o.x, f: o.f}); }
        }
        return L;
      }
      const okLane = () => wall ? wall.r.opts.indexOf(wall.r.ok) : -1;
      function spawn(){
        if (ri >= ROUNDS) return over();
        const r = rounds[ri]; const spd = 300 + ri * 14;      // пикс/с: ~4 с до ракеты в начале, ~2,4 с в конце
        wall = {r, x: W + 80, spd, done: false, hit: -1};
        $('.zr-task').classList.remove('zr-hide');
        $('.zr-task').innerHTML = r.kind === 'tone' ? '🎵 Какой <b>тон</b>? Лети в ворота с такой линией' : '🔤 Какое <b>начало</b> слога? Лети в ворота с этой буквой';
        hud(); say();   // ворота появляются вместе со звуком
      }
      function judge(){
        const r = wall.r, ok = lane === okLane(); wall.done = true; wall.hit = lane;
        res.push({q: r.s, kind: r.kind, a: r.opts[lane], r: r.ok, ok});
        if (ok) { right++; streak++; pts += 10 + (streak >= 3 ? 5 : 0); K.sfx('coin'); burst(RX + 40, ry, '#FFE59A', 26);
          fb('zr-good', r.kind === 'tone' ? `✓ <b>${r.s}</b> — ${r.t}-й тон, ${TSH[r.t]}` : `✓ <b>${r.s}</b> — начало <b>${r.x}</b> «${RU[r.x]}»${ASP[r.x] ? ' 💨' : ''}`); }
        else { wrong++; streak = 0; miss.push(r.s); K.sfx('boom'); burst(RX + 30, ry, '#FF6E9C', 22); quake = .45;
          stage.classList.remove('zr-quake'); void stage.offsetWidth; stage.classList.add('zr-quake');
          fb('zr-bad', r.kind === 'tone' ? `Это <b>${r.s}</b> — ${r.t}-й тон, ${TSH[r.t]}` : `Это <b>${r.s}</b> — начало <b>${r.x}</b> «${RU[r.x]}»${ASP[r.x] ? ', с выдохом 💨' : ''}`); }
        hud();
        ri++; gap = 1.25;   // следующая стена — через паузу, вместе со своим звуком
      }
      parts = [];
      const burst = (x, y, col, n) => { for (let k = 0; k < n; k++) { const a = Math.random() * Math.PI * 2, v = 120 + Math.random() * 380; parts.push({x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: .6 + Math.random() * .5, col}); } };
      const toLane = y => { let b = 0, d = 1e9; LANES.forEach((ly, k) => { const dd = Math.abs(ly - y); if (dd < d) { d = dd; b = k; } }); return b; };
      cv.addEventListener('pointerdown', e => { if (state !== 'play') return; e.preventDefault(); const p = K.toXY(stage, e); if (p[1] < 130) return; lane = toLane(p[1]); K.sfx('whoosh'); });
      const onKey = e => { if (state !== 'play') return; if (e.key === 'ArrowUp') { lane = Math.max(0, lane - 1); e.preventDefault(); } if (e.key === 'ArrowDown') { lane = Math.min(3, lane + 1); e.preventDefault(); } if (/^[1-4]$/.test(e.key)) lane = +e.key - 1; };
      addEventListener('keydown', onKey);
      function drawCurve(t, x, y, w, h, col){
        cx.beginPath(); TP[t].forEach((p, i) => { const px = x - w / 2 + p[0] * w, py = y + h / 2 - (p[1] - 1) * h / 4; i ? cx.lineTo(px, py) : cx.moveTo(px, py); });
        cx.strokeStyle = col; cx.lineWidth = 9; cx.lineCap = 'round'; cx.lineJoin = 'round'; cx.stroke(); }
      function drawRocket(x, y, tilt){
        cx.save(); cx.translate(x, y); cx.rotate(tilt);
        const f = 26 + Math.sin(flame * 40) * 8;   // пламя
        const g = cx.createLinearGradient(-60 - f, 0, -40, 0); g.addColorStop(0, 'rgba(255,90,60,0)'); g.addColorStop(.5, '#FF8A3D'); g.addColorStop(1, '#FFE59A');
        cx.fillStyle = g; cx.beginPath(); cx.moveTo(-40, -14); cx.quadraticCurveTo(-60 - f, 0, -40, 14); cx.closePath(); cx.fill();
        cx.fillStyle = '#FF5C8A'; cx.beginPath(); cx.moveTo(-34, -18); cx.lineTo(-52, -40); cx.lineTo(-10, -20); cx.closePath(); cx.fill();
        cx.beginPath(); cx.moveTo(-34, 18); cx.lineTo(-52, 40); cx.lineTo(-10, 20); cx.closePath(); cx.fill();
        const bg = cx.createLinearGradient(0, -24, 0, 24); bg.addColorStop(0, '#FFFFFF'); bg.addColorStop(1, '#C9D0EE');
        cx.fillStyle = bg; cx.beginPath(); cx.moveTo(-42, -22); cx.lineTo(28, -22); cx.quadraticCurveTo(70, -10, 78, 0); cx.quadraticCurveTo(70, 10, 28, 22); cx.lineTo(-42, 22); cx.closePath(); cx.fill();
        cx.fillStyle = '#5B6BD8'; cx.beginPath(); cx.arc(18, 0, 11, 0, Math.PI * 2); cx.fill(); cx.fillStyle = '#9FE8FF'; cx.beginPath(); cx.arc(16, -2, 6, 0, Math.PI * 2); cx.fill();
        cx.restore(); }
      function frame(ts){
        if (state === 'dead') return;
        const dt = Math.min(.05, (ts - (last || ts)) / 1000); last = ts; flame += dt;
        // фон: туманность и звёзды
        const bg = cx.createRadialGradient(W * .7, H * .4, 40, W * .6, H * .5, W * .8); bg.addColorStop(0, '#3B2F8A'); bg.addColorStop(.5, '#151457'); bg.addColorStop(1, '#070B2A');
        cx.fillStyle = bg; cx.fillRect(0, 0, W, H);
        const sp = state === 'play' ? 1 : .3;
        stars.forEach(s => { s.x -= s.z * 160 * dt * sp; if (s.x < 0) { s.x = W; s.y = Math.random() * H; } cx.globalAlpha = .4 + s.z * .6; cx.fillStyle = '#fff'; cx.beginPath(); cx.arc(s.x, s.y, s.r * s.z * 1.6, 0, Math.PI * 2); cx.fill(); });
        cx.globalAlpha = 1;
        // планета
        const pg = cx.createRadialGradient(1120, 640, 10, 1150, 680, 230); pg.addColorStop(0, '#FF8FB5'); pg.addColorStop(1, 'rgba(120,60,200,0)'); cx.fillStyle = pg; cx.beginPath(); cx.arc(1150, 690, 230, 0, Math.PI * 2); cx.fill();
        // дорожки
        LANES.forEach((y, k) => { cx.strokeStyle = k === lane ? 'rgba(255,229,154,.35)' : 'rgba(255,255,255,.08)'; cx.lineWidth = k === lane ? 4 : 2; cx.setLineDash([14, 18]); cx.beginPath(); cx.moveTo(60, y); cx.lineTo(W - 20, y); cx.stroke(); });
        cx.setLineDash([]);
        if (state === 'play') {
          if (wall && !wall.done) { wall.x -= wall.spd * dt; if (wall.x <= RX + 50) judge(); }
          else if (wall && wall.done) { wall.x -= wall.spd * 1.6 * dt; }
          if (gap > 0) { gap -= dt; if (gap <= 0) spawn(); }
        }
        // стена с воротами
        if (wall && wall.x > -120) { const r = wall.r, okL = okLane();
          const wg = cx.createLinearGradient(wall.x - 60, 0, wall.x + 60, 0); wg.addColorStop(0, 'rgba(120,140,255,0)'); wg.addColorStop(.5, 'rgba(120,140,255,.25)'); wg.addColorStop(1, 'rgba(120,140,255,0)');
          cx.fillStyle = wg; cx.fillRect(wall.x - 60, 140, 120, 540);
          LANES.forEach((y, k) => { const lab = r.opts[k]; const reveal = wall.done && k === okL; const col = r.kind === 'tone' ? TCOL[lab] : '#8FD3FF';
            cx.save(); cx.shadowColor = reveal ? '#FFE59A' : col; cx.shadowBlur = reveal ? 36 : 18;
            cx.fillStyle = 'rgba(10,14,60,.85)'; cx.beginPath(); cx.arc(wall.x, y, 58, 0, Math.PI * 2); cx.fill();
            cx.lineWidth = reveal ? 10 : 7; cx.strokeStyle = reveal ? '#FFE59A' : col; cx.stroke(); cx.restore();
            if (r.kind === 'tone') { drawCurve(+lab, wall.x, y, 64, 44, col); cx.fillStyle = 'rgba(255,255,255,.7)'; cx.font = '900 20px Nunito,sans-serif'; cx.textAlign = 'center'; cx.textBaseline = 'middle'; cx.fillText(lab, wall.x + 44, y - 40); }
            else { cx.fillStyle = '#fff'; cx.font = '900 54px Nunito,sans-serif'; cx.textAlign = 'center'; cx.textBaseline = 'middle'; cx.fillText(lab, wall.x, y - 6); cx.font = '800 20px Manrope,sans-serif'; cx.fillStyle = '#BFE9FF'; cx.fillText('«' + RU[lab] + '»' + (ASP[lab] ? ' 💨' : ''), wall.x, y + 32); }
            if (wall.done && k === wall.hit && k !== okL) { cx.strokeStyle = '#FF6E9C'; cx.lineWidth = 8; cx.beginPath(); cx.moveTo(wall.x - 30, y - 30); cx.lineTo(wall.x + 30, y + 30); cx.moveTo(wall.x + 30, y - 30); cx.lineTo(wall.x - 30, y + 30); cx.stroke(); }
          }); }
        // ракета
        const ty = LANES[lane]; const prevY = ry; ry += (ty - ry) * Math.min(1, dt * 10); const tilt = Math.max(-.5, Math.min(.5, (ry - prevY) * .05));
        let qx = 0; if (quake > 0) { quake -= dt; qx = (Math.random() - .5) * 16; }
        drawRocket(RX + qx, ry, tilt);
        parts.forEach(p => { p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= .97; p.vy *= .97; p.life -= dt; }); for (let k = parts.length - 1; k >= 0; k--) if (parts[k].life <= 0) parts.splice(k, 1);
        parts.forEach(p => { cx.globalAlpha = Math.max(0, p.life); cx.fillStyle = p.col; cx.beginPath(); cx.arc(p.x, p.y, 5, 0, Math.PI * 2); cx.fill(); }); cx.globalAlpha = 1;
        if (state === 'play') { cx.fillStyle = 'rgba(255,255,255,.55)'; cx.fillRect(0, H - 6, W * ri / ROUNDS, 6); }
        raf = requestAnimationFrame(frame);
      }
      function start(){
        K.ac(); K.sfx('whoosh');
        rounds = makeRounds(); ri = 0; wall = null; lane = 1; ry = LANES[1]; pts = 0; streak = 0; right = 0; wrong = 0; miss = []; res = []; parts = []; gap = 0;
        hud(); $('.zr-start').classList.add('zr-hide'); $('.zr-end').classList.add('zr-hide');
        const cd = $('.zr-cdn'); cd.classList.remove('zr-hide'); let n = 3;
        const tick = () => { if (state === 'dead') return; if (n > 0) { cd.firstElementChild.textContent = n; K.sfx('tick'); n--; later(tick, 700); } else { cd.classList.add('zr-hide'); state = 'play'; spawn(); } };
        state = 'count'; tick();
      }
      function over(){
        state = 'end'; $('.zr-task').classList.add('zr-hide'); K.sfx('win'); wall = null;
        const um = [...new Set(miss)];
        if (KAT.onResult) KAT.onResult('raketa', {right, of: ROUNDS, score: pts, wrong, miss: um, res});
        const e = $('.zr-end'); e.classList.remove('zr-hide');
        e.innerHTML = `<div class="zr-pan"><h2>${right === ROUNDS ? 'Идеальный полёт! 🏆' : 'Посадка!'}</h2><div class="zr-big">⭐ ${pts}</div>
          <p>Верных ворот: <b>${right} из ${ROUNDS}</b></p>
          ${um.length ? `<p>Можно повторить для закрепления: <span class="zr-miss">${um.join(' · ')}</span></p>` : '<p>Ни одной ошибки! Ты настоящий космонавт 🚀</p>'}
          <button class="zr-go" type="button">↺ Ещё раз</button></div>`;
        e.querySelector('.zr-go').onclick = start;
      }
      $('.zr-start .zr-go').onclick = start;
      lane = 1; ry = LANES[1]; raf = requestAnimationFrame(frame);
      return {
        destroy(){ state = 'dead'; cancelAnimationFrame(raf); timers.forEach(clearTimeout); removeEventListener('keydown', onKey); root.remove(); },
        _dbg: () => ({state, ri, right, wrong, lane, okLane: okLane(), wallX: wall ? Math.round(wall.x) : null, done: wall ? wall.done : null, kind: wall ? wall.r.kind : null}),
        _lane: () => LANES,
        _fast: () => { if (wall && !wall.done) wall.x = RX + 120; if (gap > 0) gap = .01; }
      };
    }
  });
})();
