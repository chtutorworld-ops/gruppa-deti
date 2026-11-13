/* ДЗ 8 · Иероглифный ниндзя на сцене 1280×720 (весь экран, как крот).
   Вверх летят ТОЛЬКО наши иероглифы: 你 我 好 叫 妈 爸. Наверху приказ — что рубить.
   Нажми на иероглиф или проведи по нему пальцем. Нужный — очки, чужой — минус жизнь. */
(function(){
  const POOL = ['你','我','好','叫','妈','爸'];
  const HZI = {'你':['nǐ','ты'],'我':['wǒ','я'],'好':['hǎo','хорошо'],'叫':['jiào','зваться'],'妈':['mā','мама'],'爸':['bà','папа']};
  // приказ: текст на экране, русская озвучка (site/audio/ru/<id>.mp3), какие иероглифы правильные
  const ORD = [
    {t:'Руби: «мама»', a:'nj0', ok:'妈'},
    {t:'Руби: «папа»', a:'nj1', ok:'爸'},
    {t:'Руби всё с ключом <i>女</i> «женщина»', a:'nj2', ok:'妈好'},
    {t:'Руби: <b>wǒ</b> — «я»', a:'nj3', ok:'我'},
    {t:'Руби: ключ <i>口</i> «рот»', a:'nj4', ok:'叫'},
    {t:'Руби: «ты»', a:'nj5', ok:'你'},
    {t:'Руби: звучит <b>ma</b>', a:'nj6', ok:'妈'},
    {t:'Руби: звучит <b>ba</b>', a:'nj7', ok:'爸'},
    {t:'Руби: «хорошо»', a:'nj8', ok:'好'},
    {t:'Руби: «зваться»', a:'nj9', ok:'叫'}];
  const DUR = 75, W = 1280, H = 720;
  const css = `
.g-ninja8{background:radial-gradient(ellipse at 50% 120%,#3B2F7A 0,#1A1050 50%,#0B0726 100%);user-select:none;-webkit-user-select:none;touch-action:none}
.g-ninja8 canvas{position:absolute;left:0;top:0;width:1280px;height:720px}
.g-ninja8 .nj-hud{position:absolute;left:24px;right:24px;top:18px;display:flex;justify-content:space-between;align-items:center;color:#fff;font:900 30px Nunito,var(--sans);z-index:3;pointer-events:none;text-shadow:0 2px 6px rgba(0,0,0,.5)}
.g-ninja8 .nj-ord{position:absolute;left:50%;top:78px;transform:translateX(-50%);z-index:3;display:flex;align-items:center;gap:14px;padding:12px 26px;border-radius:22px;background:rgba(255,255,255,.16);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);color:#FFE59A;font:900 36px Nunito,var(--sans);white-space:nowrap}
.g-ninja8 .nj-ord i{font-style:normal;font-family:'LXGW WenKai GB','Noto Sans SC',sans-serif;font-size:44px;color:#fff}
.g-ninja8 .nj-ord b{color:#fff}
.g-ninja8 .nj-say{border:0;background:rgba(255,255,255,.25);border-radius:14px;font-size:28px;padding:4px 12px;cursor:pointer}
.g-ninja8 .nj-fb{position:absolute;left:50%;bottom:22px;transform:translateX(-50%);z-index:3;padding:10px 26px;border-radius:99px;font:800 28px var(--sans);color:#fff;background:rgba(0,0,0,.35);white-space:nowrap;pointer-events:none;opacity:0;transition:opacity .2s}
.g-ninja8 .nj-fb.on{opacity:1}.g-ninja8 .nj-fb.ok{background:rgba(31,167,122,.85)}.g-ninja8 .nj-fb.no{background:rgba(240,64,122,.85)}
.g-ninja8 .nj-fb span{font-family:'LXGW WenKai GB','Noto Sans SC',sans-serif;font-size:36px;font-weight:400}
.g-ninja8 .nj-scr{position:absolute;inset:0;z-index:8;display:grid;place-items:center;background:rgba(11,7,38,.55)}
.g-ninja8 .nj-scr.hide{display:none}
.g-ninja8 .nj-pan{width:820px;text-align:center;color:#fff;padding:36px 48px;border-radius:34px;background:linear-gradient(180deg,rgba(90,29,87,.92),rgba(18,11,58,.95));box-shadow:0 30px 80px rgba(0,0,0,.45)}
.g-ninja8 .nj-pan img{height:150px;margin:-10px 0 4px}
.g-ninja8 .nj-pan h2{margin:0 0 10px;font:900 52px Nunito,var(--sans);color:#FFE59A}
.g-ninja8 .nj-pan p{margin:8px 0;font:600 25px/1.4 var(--sans);color:#DCD6FF}
.g-ninja8 .nj-pan .hz{font-family:'LXGW WenKai GB','Noto Sans SC',sans-serif;font-size:46px;color:#fff;letter-spacing:.12em}
.g-ninja8 .nj-go{margin-top:18px;border:0;cursor:pointer;font:900 32px Nunito,var(--sans);color:#2B1460;padding:18px 60px;border-radius:99px;background:linear-gradient(135deg,#FFE59A,#FFB84D);box-shadow:0 12px 30px rgba(255,184,77,.4)}
.g-ninja8 .nj-cd{font:900 160px Nunito,var(--sans);color:#FFE59A}
.g-ninja8 .nj-big{font:900 84px Nunito,var(--sans);color:#FFE59A;margin:6px 0}
.g-ninja8.quake{animation:njq .4s}
@keyframes njq{25%{transform:translateX(-10px)}50%{transform:translateX(10px)}75%{transform:translateX(-5px)}}`;

  KAT.register({
    id: 'ninja8', title: 'Иероглифный ниндзя', css,
    audio: [],
    mount(stage, K){
      const root = document.createElement('div');
      root.style.cssText = 'position:absolute;inset:0';
      root.innerHTML = `<canvas width="1920" height="1080"></canvas>
        <div class="nj-hud"><span class="nj-pts">⭐ 0</span><span class="nj-cmb"></span><span class="nj-lv">❤️❤️❤️❤️❤️</span></div>
        <div class="nj-ord" style="display:none"></div><div class="nj-fb"></div>
        <div class="nj-scr nj-start"><div class="nj-pan"><img src="img/ninja-a.png" alt="" onerror="this.remove()"><h2>Иероглифный ниндзя</h2>
          <p>Вверх летят наши иероглифы: <span class="hz">你我好叫妈爸</span></p>
          <p>Наверху — <b>приказ</b>: что рубить. <b>Нажми</b> на иероглиф или <b>проведи</b> по нему пальцем!</p>
          <p>Нужный — очки ⭐. Чужой — минус жизнь ❤️ (их 5). Приказ меняется каждые 5 ударов.</p>
          <button class="nj-go" type="button">⚔️ В бой!</button></div></div>
        <div class="nj-scr nj-cdn hide"><div class="nj-cd">3</div></div>
        <div class="nj-scr nj-end hide"></div>`;
      stage.appendChild(root);
      const $ = s => root.querySelector(s);
      const cv = $('canvas'), cx = cv.getContext('2d'); cx.setTransform(1.5, 0, 0, 1.5, 0, 0);
      const IMG = {}; ['a', 'b'].forEach(k => { const i = new Image(); i.onload = () => { IMG[k] = i; }; i.src = 'img/ninja-' + k + '.png'; });
      let state = 'start', raf = 0, t0 = 0, last = 0, timers = [];
      let items, halves, parts, trail, pts, cmb, lives, good, bad, ordI, ordCut, spawnT, slashT, miss, orders, ord, ending;
      const later = (f, ms) => { const id = setTimeout(f, ms); timers.push(id); return id; };
      const say = id => { if (window.KRU) window.KRU(id); };
      const isOk = c => ord.ok.includes(c);
      const setOrd = () => { ord = orders[ordI % orders.length]; const o = $('.nj-ord'); o.style.display = 'flex'; o.innerHTML = `<span>${ord.t}</span><button class="nj-say" type="button" title="Послушать">🔊</button>`; o.querySelector('.nj-say').onclick = e => { e.stopPropagation(); say(ord.a); }; say(ord.a); };
      const hud = () => { $('.nj-pts').textContent = '⭐ ' + pts; $('.nj-cmb').textContent = cmb >= 4 ? '🔥 ×2' : ''; $('.nj-lv').textContent = '❤️'.repeat(Math.max(0, lives)) + '🖤'.repeat(5 - Math.max(0, lives)); };
      let fbT = 0;
      const fb = (cls, html) => { const f = $('.nj-fb'); f.className = 'nj-fb on ' + cls; f.innerHTML = html; clearTimeout(fbT); fbT = later(() => f.classList.remove('on'), 1300); };
      const R = 58;
      const spawn = () => { const okL = POOL.filter(isOk), noL = POOL.filter(c => !isOk(c)); const want = Math.random() < .45; const L = want ? okL : noL; const c = L[Math.random() * L.length | 0];
        const x = W * .15 + Math.random() * W * .7; items.push({c, x, y: H + 60, vx: (W / 2 - x) * .18 + (Math.random() - .5) * 40, vy: -Math.sqrt(2 * H * .5 * H * (.62 + Math.random() * .25)), rot: 0, vr: (Math.random() - .5) * 2}); };
      const burst = (x, y, col, n) => { for (let k = 0; k < n; k++) { const a = Math.random() * Math.PI * 2, v = 120 + Math.random() * 360; parts.push({x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 100, life: .7 + Math.random() * .4, col}); } };
      const cut = (it, ang) => { it.dead = true; const ok = isOk(it.c); [-1, 1].forEach(sd => halves.push({c: it.c, x: it.x, y: it.y, vx: it.vx * .4 + Math.cos(ang + Math.PI / 2) * sd * 200, vy: it.vy * .3 - 80, rot: it.rot, vr: sd * 3, ang, side: sd, life: 1.2, ok}));
        slashT = .25;
        if (ok) { cmb++; good++; pts += cmb >= 4 ? 2 : 1; ordCut++; burst(it.x, it.y, '#FFD36B', 24); K.sfx('coin'); fb('ok', `✓ <span>${it.c}</span> ${HZI[it.c][0]} — «${HZI[it.c][1]}»`); if (ordCut >= 5) { ordCut = 0; ordI++; setOrd(); } }
        else { cmb = 0; bad++; lives--; miss.push(it.c); burst(it.x, it.y, '#FF5C8A', 18); K.sfx('no'); stage.classList.remove('quake'); void stage.offsetWidth; stage.classList.add('quake');
          fb('no', `Ой! <span>${it.c}</span> — это «${HZI[it.c][1]}», не по приказу`); }
        hud(); if (lives <= 0) stop(); };
      let down = false, lp = null;
      const xy = e => { const p = K.toXY(stage, e); return {x: p[0], y: p[1]}; };
      cv.addEventListener('pointerdown', e => { if (state !== 'play') return; e.preventDefault(); down = true; lp = xy(e); trail.length = 0; trail.push({...lp, t: performance.now()}); try { cv.setPointerCapture(e.pointerId); } catch (_) {}
        let best = null, bd = 1e9; items.forEach(it => { if (it.dead) return; const d = (it.x - lp.x) ** 2 + (it.y - lp.y) ** 2; if (d < (R * 1.3) ** 2 && d < bd) { bd = d; best = it; } }); if (best) cut(best, -0.6); });
      cv.addEventListener('pointermove', e => { if (!down || state !== 'play') return; const p = xy(e); trail.push({...p, t: performance.now()});
        items.forEach(it => { if (it.dead) return; const dx = p.x - lp.x, dy = p.y - lp.y, L = dx * dx + dy * dy || 1; let u = ((it.x - lp.x) * dx + (it.y - lp.y) * dy) / L; u = Math.max(0, Math.min(1, u)); const qx = lp.x + u * dx, qy = lp.y + u * dy; if ((qx - it.x) ** 2 + (qy - it.y) ** 2 < R * R && L > 40) cut(it, Math.atan2(dy, dx)); }); lp = p; });
      const up = () => { down = false; }; cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
      const HZF = "'LXGW WenKai GB','Noto Sans SC','PingFang SC','Microsoft YaHei',sans-serif";
      function frame(ts){
        if (state === 'dead') return;
        if (!t0) { t0 = ts; last = ts; }
        const dt = Math.min(.05, (ts - last) / 1000); last = ts; const el = (ts - t0) / 1000;
        if (state === 'play') { spawnT -= dt; if (spawnT <= 0) { spawn(); if (Math.random() < .35) spawn(); spawnT = Math.max(1, 1.8 - el * .01); } if (el >= DUR) stop(); }
        const g = H * .5;
        items.forEach(it => { it.vy += g * dt; it.x += it.vx * dt; it.y += it.vy * dt; it.rot += it.vr * dt; if (it.y > H + 90 && it.vy > 0) it.dead = true; });
        for (let k = items.length - 1; k >= 0; k--) if (items[k].dead) items.splice(k, 1);
        halves.forEach(h => { h.vy += g * dt; h.x += h.vx * dt; h.y += h.vy * dt; h.rot += h.vr * dt; h.life -= dt; }); for (let k = halves.length - 1; k >= 0; k--) if (halves[k].life <= 0 || halves[k].y > H + 120) halves.splice(k, 1);
        parts.forEach(p => { p.vy += 500 * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt; }); for (let k = parts.length - 1; k >= 0; k--) if (parts[k].life <= 0) parts.splice(k, 1);
        const now = performance.now(); while (trail.length && now - trail[0].t > 160) trail.shift();
        cx.clearRect(0, 0, W, H);
        const ni = IMG[slashT > 0 ? 'b' : 'a'] || IMG.a; slashT = Math.max(0, slashT - dt); const nh = 190;
        if (ni) { const nw = nh * ni.width / ni.height; cx.globalAlpha = .95; cx.drawImage(ni, W / 2 - nw / 2, H - nh - 6, nw, nh); cx.globalAlpha = 1; }
        else { cx.font = `${nh * .7}px serif`; cx.textAlign = 'center'; cx.textBaseline = 'bottom'; cx.fillText('🥷', W / 2, H - 8); }
        cx.textAlign = 'center'; cx.textBaseline = 'middle'; const hz = `${R * 1.25}px ${HZF}`;
        items.forEach(it => { cx.save(); cx.translate(it.x, it.y); cx.rotate(it.rot * .3); cx.beginPath(); cx.arc(0, 0, R, 0, Math.PI * 2); const gr = cx.createRadialGradient(-R * .3, -R * .3, 2, 0, 0, R); gr.addColorStop(0, '#FFF8E1'); gr.addColorStop(1, '#F5C24B'); cx.fillStyle = gr; cx.shadowColor = 'rgba(255,210,100,.7)'; cx.shadowBlur = 22; cx.fill(); cx.shadowBlur = 0; cx.fillStyle = '#2B1460'; cx.font = hz; cx.fillText(it.c, 0, 3); cx.restore(); });
        halves.forEach(h => { cx.save(); cx.globalAlpha = Math.max(0, Math.min(1, h.life)); cx.translate(h.x, h.y); cx.rotate(h.rot * .3); cx.save(); cx.rotate(h.ang); cx.beginPath(); cx.rect(-110, h.side > 0 ? 0 : -110, 220, 110); cx.restore(); cx.clip(); cx.beginPath(); cx.arc(0, 0, R, 0, Math.PI * 2); cx.fillStyle = h.ok ? '#B8F5DC' : '#FFC2D1'; cx.fill(); cx.fillStyle = '#2B1460'; cx.font = hz; cx.fillText(h.c, 0, 3); cx.restore(); });
        parts.forEach(p => { cx.globalAlpha = Math.max(0, p.life); cx.fillStyle = p.col; cx.beginPath(); cx.arc(p.x, p.y, 5, 0, Math.PI * 2); cx.fill(); }); cx.globalAlpha = 1;
        if (trail.length > 1) { cx.lineCap = 'round'; for (let k = 1; k < trail.length; k++) { const a = k / trail.length; cx.strokeStyle = `rgba(190,230,255,${a})`; cx.lineWidth = 3 + a * 12; cx.shadowColor = '#8FD3FF'; cx.shadowBlur = 14; cx.beginPath(); cx.moveTo(trail[k - 1].x, trail[k - 1].y); cx.lineTo(trail[k].x, trail[k].y); cx.stroke(); } cx.shadowBlur = 0; }
        if (state === 'play') { cx.fillStyle = 'rgba(255,255,255,.6)'; cx.fillRect(0, H - 6, W * (1 - el / DUR), 6); }
        if (state === 'over' && !items.length && !halves.length && !parts.length) return finish();
        raf = requestAnimationFrame(frame);
      }
      function start(){
        K.ac(); K.sfx('whoosh');
        items = []; halves = []; parts = []; trail = []; pts = 0; cmb = 0; lives = 5; good = 0; bad = 0; ordI = 0; ordCut = 0; spawnT = 0; slashT = 0; miss = []; ending = false;
        orders = K.shuffle(ORD); ord = orders[0]; hud();
        $('.nj-start').classList.add('hide'); $('.nj-end').classList.add('hide');
        const cd = $('.nj-cdn'); cd.classList.remove('hide'); let n = 3;
        const tick = () => { if (state === 'dead') return; if (n > 0) { cd.firstElementChild.textContent = n; K.sfx('tick'); n--; later(tick, 750); } else { cd.classList.add('hide'); state = 'play'; t0 = 0; setOrd(); raf = requestAnimationFrame(frame); } };
        state = 'count'; tick();
      }
      function stop(){ if (state !== 'play') return; state = 'over'; items.forEach(it => it.vy = Math.max(it.vy, 0)); }
      function finish(){
        cancelAnimationFrame(raf); raf = 0; state = 'end'; $('.nj-ord').style.display = 'none'; K.sfx('win');
        const um = [...new Set(miss)];
        if (KAT.onResult) KAT.onResult('ninja8', {right: good, of: good + bad || 1, score: pts, wrong: bad, miss: um});
        const e = $('.nj-end'); e.classList.remove('hide');
        e.innerHTML = `<div class="nj-pan"><h2>${lives > 0 ? 'Время вышло!' : 'Ниндзя устал'}</h2><div class="nj-big">⭐ ${pts}</div>
          <p>Нужных ударов: <b>${good}</b> · по чужим: <b>${bad}</b></p>
          ${um.length ? `<p>Можно повторить для закрепления: ${um.map(c => `<span class="hz">${c}</span> «${HZI[c][1]}»`).join(' · ')}</p>` : '<p>Ни одного чужого удара! 🏆</p>'}
          <button class="nj-go" type="button">↺ Ещё раз</button></div>`;
        e.querySelector('.nj-go').onclick = start;
      }
      $('.nj-go').onclick = start;
      return {
        destroy(){ state = 'dead'; cancelAnimationFrame(raf); timers.forEach(clearTimeout); root.remove(); },
        _dbg: () => ({state, good, bad, lives, n: items ? items.length : 0, ord: ord && ord.ok, it: (items || []).filter(i => !i.dead && i.y > 120 && i.y < 640 && i.x > 80 && i.x < 1200).map(i => ({c: i.c, x: i.x, y: i.y, ok: isOk(i.c)}))}),
        _cut: (want) => { const it = (items || []).find(i => !i.dead && (want ? isOk(i.c) : !isOk(i.c))); if (it) { cut(it, -0.6); return it.c; } return null; },
        _end: () => { if (state === 'play') { t0 = performance.now() - DUR * 1000; } }
      };
    }
  });
})();
