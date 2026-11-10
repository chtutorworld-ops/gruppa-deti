/* Тоновые ворота: значок → цифра. Летит фонарик со слогом, ребёнок отправляет его в ворота с номером тона. */
(function(){
  const BASES = ['ma','ba','bi','pi','mi','fu','da','di','ti','tu','hu','shi','zhi','chu','shu','ke'];
  const V = {a:'āáǎà', e:'ēéěè', i:'īíǐì', o:'ōóǒò', u:'ūúǔù'};
  const mk = (b, t) => { let k = b.search(/a|e/); if (k < 0) k = b.indexOf('ou'); if (k < 0) { for (let j = b.length - 1; j >= 0; j--) if ('aeiou'.includes(b[j])) { k = j; break; } } return b.slice(0, k) + V[b[k]][t - 1] + b.slice(k + 1); };
  const chr = (b, t) => { const v = window.SYL && SYL.variant(b, t); return v ? v.c : ''; };
  const AUD = []; BASES.forEach(b => [1,2,3,4].forEach(t => { const c = chr(b, t); if (c) AUD.push(c); }));
  const TC = ['', '#1FA77A', '#E8910C', '#6A5BFF', '#F0407A'];
  const GX = [190, 490, 790, 1090], GY = 560;
  const N = 16;
  const css = `
.g-vorota{background:url(img/fon-land.webp) 50% 100%/cover,#C8B8F5;user-select:none;-webkit-user-select:none;overflow:hidden}
.g-vorota .vr-sky{position:absolute;inset:0;background:linear-gradient(180deg,rgba(60,40,140,.25),rgba(255,255,255,0) 40%)}
.g-vorota .vr-hud{position:absolute;left:76px;right:30px;top:20px;display:flex;justify-content:space-between;font:900 30px Nunito,sans-serif;color:#2B1F6E;z-index:6;pointer-events:none}
.g-vorota .vr-hud span{padding:8px 20px;border-radius:30px;background:rgba(255,255,255,.7);backdrop-filter:blur(6px)}
.g-vorota .vr-tip{position:absolute;left:50%;top:22px;transform:translateX(-50%);padding:8px 22px;border-radius:30px;background:rgba(43,31,110,.75);color:#fff;font:800 24px Manrope,sans-serif;z-index:6;white-space:nowrap;pointer-events:none}
.g-vorota .gt{position:absolute;top:${GY - 150}px;width:250px;height:300px;margin-left:-125px;cursor:pointer;touch-action:manipulation;z-index:3}
.g-vorota .gt .rf{position:absolute;left:-6px;right:-6px;top:0;height:58px;background:linear-gradient(180deg,#2E3F5C,#16233A);clip-path:polygon(0 70%,8% 20%,50% 0,92% 20%,100% 70%,90% 100%,10% 100%);box-shadow:0 4px 0 #D9A441}
.g-vorota .gt .rf::after{content:'';position:absolute;left:8%;right:8%;bottom:6px;height:6px;background:#E8B44C}
.g-vorota .gt .bm{position:absolute;left:12px;right:12px;top:56px;height:22px;background:linear-gradient(180deg,#C4302B,#8E1F1C);border-radius:4px}
.g-vorota .gt .pl{position:absolute;top:56px;bottom:0;width:30px;background:linear-gradient(90deg,#8E1F1C,#D2382F 45%,#8E1F1C);border-radius:6px 6px 0 0}
.g-vorota .gt .pl.l{left:24px}.g-vorota .gt .pl.r{right:24px}
.g-vorota .gt .nm{position:absolute;left:50%;top:84px;transform:translateX(-50%);width:110px;height:110px;border-radius:50%;display:grid;place-items:center;font:900 76px Nunito,sans-serif;color:#fff;background:var(--tc);box-shadow:0 0 0 6px #F6D27A,0 10px 24px rgba(0,0,0,.35);transition:transform .2s}
.g-vorota .gt .gin{position:absolute;left:54px;right:54px;top:78px;bottom:0;background:radial-gradient(ellipse at 50% 100%,rgba(255,240,200,.65),rgba(255,240,200,0) 70%);opacity:0;transition:opacity .2s}
.g-vorota .gt:hover .nm{transform:translateX(-50%) scale(1.06)}
.g-vorota .gt.ok .gin{opacity:1}.g-vorota .gt.ok .nm{transform:translateX(-50%) scale(1.2);box-shadow:0 0 0 6px #fff,0 0 50px #fff}
.g-vorota .gt.no .nm{animation:gtsh .4s}
.g-vorota .gt.show .nm{animation:gtbl .5s 3 alternate}
@keyframes gtsh{25%{transform:translateX(calc(-50% - 12px))}75%{transform:translateX(calc(-50% + 12px))}}
@keyframes gtbl{to{transform:translateX(-50%) scale(1.25);box-shadow:0 0 0 8px #fff,0 0 60px #fff}}
.g-vorota .ln{position:absolute;left:640px;top:0;width:150px;height:170px;margin:-85px 0 0 -75px;z-index:4;pointer-events:none}
.g-vorota .ln .lb{position:absolute;left:8px;right:8px;top:22px;bottom:18px;border-radius:46% 46% 40% 40%;background:radial-gradient(ellipse at 50% 40%,#FFE7A3 0,#FF7A3D 45%,#C42A1E 100%);box-shadow:0 0 40px rgba(255,140,60,.9),inset 0 -10px 20px rgba(120,10,0,.4)}
.g-vorota .ln .lb::before{content:'';position:absolute;inset:0;border-radius:inherit;background:repeating-linear-gradient(90deg,transparent 0 22px,rgba(120,20,0,.25) 22px 25px)}
.g-vorota .ln .cp{position:absolute;left:38px;right:38px;height:18px;background:#E8B44C;border-radius:6px}.g-vorota .ln .cp.t{top:10px}.g-vorota .ln .cp.b{bottom:8px}
.g-vorota .ln .sy{position:absolute;left:-30px;right:-30px;top:58px;text-align:center;font:900 54px Nunito,sans-serif;color:#fff;text-shadow:0 3px 0 #7A1A10,0 0 14px #7A1A10}
.g-vorota .ln.fly{transition:left .35s ease-in,top .35s ease-in,transform .35s}
.g-vorota .ln.hit{transform:scale(.3);opacity:0;transition:transform .3s .3s,opacity .3s .3s,left .35s ease-in,top .35s ease-in}
.g-vorota .ln.bad .lb{background:radial-gradient(ellipse,#bbb 0,#666 70%);box-shadow:none}
.g-vorota .ln.bad{animation:lnbad .5s .3s forwards}
@keyframes lnbad{to{transform:translateY(80px) rotate(30deg);opacity:0}}
.g-vorota .fw{position:absolute;width:12px;height:12px;border-radius:50%;z-index:5;pointer-events:none;animation:fwk .8s ease-out forwards}
@keyframes fwk{to{transform:translate(var(--dx),var(--dy));opacity:0}}
.g-vorota .fx{position:absolute;font:900 34px Nunito,sans-serif;color:#fff;text-shadow:0 0 10px #1FA77A,0 2px 0 #14674A;pointer-events:none;animation:vfx 1s forwards;z-index:6;white-space:nowrap}
.g-vorota .fx.no{text-shadow:0 0 10px #F0407A,0 2px 0 #9A1F45}
@keyframes vfx{to{transform:translateY(-60px);opacity:0}}
.g-vorota .vr-ov{position:absolute;inset:0;z-index:20;display:grid;place-items:center;background:rgba(43,31,110,.45);backdrop-filter:blur(3px)}
.g-vorota .vr-card{width:760px;padding:34px 40px;border-radius:34px;text-align:center;background:rgba(255,255,255,.92);box-shadow:0 30px 70px rgba(40,20,100,.35)}
.g-vorota .vr-card h2{font:900 56px Nunito,sans-serif;color:#2B1F6E;margin:0}
.g-vorota .vr-card p{font:700 25px/1.4 Manrope,sans-serif;color:#3D3570;margin:14px 0 0}
.g-vorota .vr-card .tl{display:flex;justify-content:center;gap:14px;margin-top:18px}
.g-vorota .vr-card .tl span{display:grid;place-items:center;width:120px;height:110px;border-radius:24px;font:900 28px Nunito,sans-serif;color:#fff}.g-vorota .vr-card .tl b{font-size:48px;line-height:1}
.g-vorota .vr-go{margin-top:24px;padding:20px 54px;border:0;border-radius:24px;font:900 32px Nunito,sans-serif;color:#fff;background:linear-gradient(135deg,#F0407A,#6A5BFF);box-shadow:0 10px 30px rgba(106,91,255,.4);cursor:pointer}
.g-vorota .vr-res{font:900 80px Nunito,sans-serif;color:#6A5BFF;margin-top:6px}
`;
  function mount(stage, K){
    stage.innerHTML = `<div class="vr-sky"></div><div class="vr-hud"><span>🏮 <b id="vrn">0</b>/${N}</span><span>⭐ <b id="vrs">0</b></span></div><div class="vr-tip">Отправь фонарик в ворота его тона!</div>
      ${[1,2,3,4].map((t, i) => `<div class="gt" data-t="${t}" style="left:${GX[i]}px;--tc:${TC[t]}"><div class="gin"></div><div class="pl l"></div><div class="pl r"></div><div class="bm"></div><div class="rf"></div><div class="nm">${t}</div></div>`).join('')}
      <div class="vr-field"></div><div class="vr-ov" id="vro"></div>`;
    const q = s => stage.querySelector(s), field = q('.vr-field'), ov = q('#vro');
    let alive = true, k = 0, score = 0, right = 0, wrong = 0, miss = [], cur = null, raf = 0, seq = [];
    const tms = []; const later = (f, ms) => { const t = setTimeout(() => { if (alive) f(); }, ms); tms.push(t); return t; };
    stage.querySelectorAll('.gt').forEach(g => g.onpointerdown = e => { e.preventDefault(); send(+g.dataset.t, g); });
    const onKey = e => { if (/^[1-4]$/.test(e.key)) send(+e.key, stage.querySelector(`.gt[data-t="${e.key}"]`)); };
    addEventListener('keydown', onKey);
    const intro = () => { ov.style.display = 'grid'; ov.innerHTML = `<div class="vr-card"><h2>🏮 Тоновые ворота</h2><p>Летит фонарик со слогом. Посмотри на <b>значок тона</b> и нажми на <b>ворота с его номером</b>, пока фонарик не упал!</p>
      <div class="tl">${[1,2,3,4].map(t => `<span style="background:${TC[t]}"><b><svg viewBox="0 0 80 60" style="height:44px"><path d="${['','M8 30 H72','M16 46 L64 12','M10 14 L40 46 L70 14','M16 12 L64 46'][t]}" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/></svg></b>${t}</span>`).join('')}</div><button class="vr-go">▶ Начать</button></div>`;
      ov.querySelector('.vr-go').onclick = start; };
    function start(){ K.ac(); k = 0; score = 0; right = 0; wrong = 0; miss = []; q('#vrs').textContent = 0;
      const ts = K.shuffle([1,2,3,4,1,2,3,4,1,2,3,4,1,2,3,4]); const bs = K.shuffle(BASES.concat(BASES)).slice(0, N);
      seq = ts.map((t, i) => ({t, b: bs[i], s: mk(bs[i], t), c: chr(bs[i], t)}));
      ov.style.display = 'none'; later(next, 300); }
    function next(){ if (!alive) return; if (k >= N) return end(); const it = seq[k]; k++; q('#vrn').textContent = k;
      const el = document.createElement('div'); el.className = 'ln'; el.innerHTML = `<div class="cp t"></div><div class="lb"></div><div class="cp b"></div><div class="sy">${it.s}</div>`;
      field.appendChild(el); const x0 = 260 + Math.random() * 760; el.style.left = x0 + 'px';
      const dur = 7000 - (k - 1) * 220, t0 = performance.now(); // faster and faster
      cur = {it, el, done: false};
      q('.vr-tip').style.opacity = k > 2 ? 0 : 1;
      const tick = () => { if (!alive || !cur || cur.el !== el || cur.done) return; const p = (performance.now() - t0) / dur; el.style.top = (175 + p * 250) + 'px'; el.style.transform = `rotate(${Math.sin(p * 12) * 5}deg)`;
        if (p >= 1) return drop(); raf = requestAnimationFrame(tick); }; raf = requestAnimationFrame(tick); }
    function fx(x, y, txt, bad){ const f = document.createElement('div'); f.className = 'fx' + (bad ? ' no' : ''); f.textContent = txt; f.style.left = (x - 60) + 'px'; f.style.top = y + 'px'; field.appendChild(f); later(() => f.remove(), 1000); }
    function send(t, g){ if (!cur || cur.done) return; cur.done = true; cancelAnimationFrame(raf); const {it, el} = cur; const gx = GX[t - 1];
      el.classList.add('fly'); el.style.left = gx + 'px'; el.style.top = (GY - 20) + 'px';
      if (t === it.t){ el.classList.add('hit'); right++; score += 10 + Math.max(0, 6 - Math.floor(k / 3)); q('#vrs').textContent = score; K.sfx('ok'); if (it.c) later(() => K.say(it.c), 250);
        later(() => { g.classList.add('ok'); fx(gx, GY - 230, '✓ ' + it.s); for (let i = 0; i < 14; i++){ const d = document.createElement('i'); d.className = 'fw'; d.style.background = ['#FFE7A3','#FF7A3D','#fff','#7CF5D0'][i % 4]; d.style.left = gx + 'px'; d.style.top = (GY - 120) + 'px'; const a = Math.random() * Math.PI * 2, r = 80 + Math.random() * 90; d.style.setProperty('--dx', Math.cos(a) * r + 'px'); d.style.setProperty('--dy', Math.sin(a) * r + 'px'); field.appendChild(d); later(() => d.remove(), 800); } }, 300);
        later(() => { g.classList.remove('ok'); el.remove(); next(); }, 1100); }
      else { el.classList.add('bad'); wrong++; if (!miss.includes(it.s)) miss.push(it.s); K.sfx('no'); g.classList.add('no');
        const rg = stage.querySelector(`.gt[data-t="${it.t}"]`); later(() => { fx(gx, GY - 230, `${it.s} — это ${it.t}`, true); rg.classList.add('show'); }, 350);
        later(() => { g.classList.remove('no'); rg.classList.remove('show'); el.remove(); next(); }, 2200); } }
    function drop(){ if (!cur || cur.done) return; cur.done = true; const {it, el} = cur; wrong++; if (!miss.includes(it.s)) miss.push(it.s); K.sfx('no'); el.classList.add('bad');
      const rg = stage.querySelector(`.gt[data-t="${it.t}"]`); rg.classList.add('show'); fx(parseFloat(el.style.left), 300, `${it.s} — это ${it.t}`, true);
      later(() => { rg.classList.remove('show'); el.remove(); next(); }, 2200); }
    function end(){ cur = null; K.sfx('win'); ov.style.display = 'grid';
      ov.innerHTML = `<div class="vr-card"><h2>🏆 Все фонарики!</h2><div class="vr-res">🏮 ${right} / ${N}</div><p>Очки: <b>${score}</b>${miss.length ? `<br>Повтори: <b>${miss.join(', ')}</b>` : '<br>Без единой ошибки!'}</p><button class="vr-go">↺ Ещё раз</button></div>`;
      ov.querySelector('.vr-go').onclick = start;
      if (K.onResult) K.onResult('vorota', {right, of: N, score, wrong, miss: miss.slice(0, 20)}); }
    intro();
    return { destroy(){ alive = false; cancelAnimationFrame(raf); tms.forEach(clearTimeout); removeEventListener('keydown', onKey); } };
  }
  KAT.register({id: 'vorota', css, audio: AUD, mount});
})();
