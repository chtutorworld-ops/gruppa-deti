/* Пещера тонов: цифра тона → значок. Голос и цифра говорят тон, ребёнок разбивает кристаллы со слогами этого тона. */
(function(){
  const BASES = ['ma','ba','bi','pi','mi','fu','da','di','ti','tu','hu','shi','zhi','chu','shu','ke'];
  const V = {a:'āáǎà', e:'ēéěè', i:'īíǐì', o:'ōóǒò', u:'ūúǔù'};
  const mk = (b, t) => { let k = b.search(/a|e/); if (k < 0) k = b.indexOf('ou'); if (k < 0) { for (let j = b.length - 1; j >= 0; j--) if ('aeiou'.includes(b[j])) { k = j; break; } } return b.slice(0, k) + V[b[k]][t - 1] + b.slice(k + 1); };
  const chr = (b, t) => { const v = window.SYL && SYL.variant(b, t); return v ? v.c : ''; };
  const AUD = []; BASES.forEach(b => [1,2,3,4].forEach(t => { const c = chr(b, t); if (c) AUD.push(c); }));
  const TC = ['', '#1FA77A', '#E8910C', '#6A5BFF', '#F0407A'];
  const TN = ['', 'первый', 'второй', 'третий', 'четвёртый'];
  const HUES = [[150,110,255],[90,200,255],[255,120,200],[120,230,210],[190,140,255]];
  const ROUNDS = 8, TIME = 15;
  const POS = []; [0,1].forEach(r => [0,1,2,3,4].forEach(i => POS.push([150 + i * 245, r ? 520 : 300])));

  const css = `
.g-crystals{background:radial-gradient(ellipse at 50% 120%,#3B2A8C 0,#1A1250 45%,#0B0726 100%);user-select:none;-webkit-user-select:none;overflow:hidden;color:#fff}
.g-crystals .cv-st{position:absolute;inset:0;background-image:radial-gradient(2px 2px at 8% 20%,#C9B8FF 50%,transparent 51%),radial-gradient(2px 2px at 22% 70%,#9FE8FF 50%,transparent 51%),radial-gradient(1.5px 1.5px at 40% 35%,#fff 50%,transparent 51%),radial-gradient(2px 2px at 63% 80%,#FFB3E6 50%,transparent 51%),radial-gradient(1.5px 1.5px at 78% 25%,#fff 50%,transparent 51%),radial-gradient(2px 2px at 92% 60%,#9FE8FF 50%,transparent 51%),radial-gradient(1.5px 1.5px at 52% 12%,#fff 50%,transparent 51%);animation:cvtw 3s ease-in-out infinite alternate}
@keyframes cvtw{to{opacity:.45}}
.g-crystals .cv-top{position:absolute;left:0;right:0;top:0;height:120px;background:#0B0726;clip-path:polygon(0 0,100% 0,100% 40%,96% 70%,92% 35%,86% 90%,80% 30%,73% 60%,66% 25%,58% 80%,50% 30%,43% 65%,36% 20%,28% 85%,21% 35%,14% 70%,8% 30%,3% 60%,0 40%)}
.g-crystals .cv-bot{position:absolute;left:0;right:0;bottom:0;height:90px;background:linear-gradient(180deg,#2A1E6E,#120B3A);clip-path:polygon(0 60%,6% 30%,12% 55%,20% 20%,28% 50%,36% 35%,45% 60%,53% 25%,62% 50%,70% 30%,79% 55%,87% 20%,94% 45%,100% 30%,100% 100%,0 100%)}
.g-crystals .cv-hud{position:absolute;left:0;right:0;top:14px;display:flex;justify-content:center;align-items:center;gap:18px;z-index:5;pointer-events:none}
.g-crystals .cv-goal{display:flex;align-items:center;gap:16px;padding:10px 28px 10px 12px;border-radius:60px;background:rgba(255,255,255,.12);backdrop-filter:blur(6px);box-shadow:0 0 0 2px rgba(255,255,255,.25);font:900 34px Nunito,sans-serif}
.g-crystals .cv-num{width:84px;height:84px;border-radius:50%;display:grid;place-items:center;font:900 60px Nunito,sans-serif;color:#fff;box-shadow:0 0 30px currentColor,inset 0 -6px 0 rgba(0,0,0,.18)}
.g-crystals .cv-goal.pop{animation:cvpop .5s}
@keyframes cvpop{40%{transform:scale(1.15)}}
.g-crystals .cv-side{position:absolute;top:24px;font:900 26px Nunito,sans-serif;color:#E9E3FF;z-index:5}
.g-crystals .cv-l{left:76px}.g-crystals .cv-r{right:30px;text-align:right}
.g-crystals .cv-bar{position:absolute;left:340px;right:340px;top:118px;height:12px;border-radius:7px;background:rgba(255,255,255,.15);overflow:hidden;z-index:5}
.g-crystals .cv-bar i{display:block;height:100%;background:linear-gradient(90deg,#7CF5D0,#B49BFF);width:100%}
.g-crystals .cr{position:absolute;width:180px;height:206px;margin:-103px 0 0 -90px;cursor:pointer;animation:crfl 3.2s ease-in-out infinite alternate;animation-delay:var(--dl);touch-action:manipulation}
@keyframes crfl{to{transform:translateY(-14px)}}
.g-crystals .cr .gm{position:absolute;inset:0;clip-path:polygon(50% 0,93% 24%,100% 64%,50% 100%,0 64%,7% 24%);background:linear-gradient(160deg,rgba(255,255,255,.95) 0,rgb(var(--c)) 30%,rgba(var(--c),.75) 62%,rgba(30,10,90,.9) 100%);filter:drop-shadow(0 0 18px rgba(var(--c),.9));transition:transform .25s,opacity .3s}
.g-crystals .cr .gm::before{content:'';position:absolute;inset:0;background:linear-gradient(115deg,rgba(255,255,255,.55) 0 22%,transparent 23% 55%,rgba(255,255,255,.18) 56% 70%,transparent 71%)}
.g-crystals .cr .gm::after{content:'';position:absolute;left:50%;top:0;bottom:0;width:2px;background:rgba(255,255,255,.35)}
.g-crystals .cr .glow{position:absolute;left:10px;right:10px;bottom:-26px;height:30px;border-radius:50%;background:radial-gradient(ellipse,rgba(var(--c),.55),transparent 70%)}
.g-crystals .cr .sy{position:absolute;left:0;right:0;top:66px;text-align:center;font:900 50px Nunito,sans-serif;color:#fff;text-shadow:0 2px 0 rgba(40,10,110,.6),0 0 16px rgba(40,10,110,.8);pointer-events:none}
.g-crystals .cr.cin{animation:crin .45s backwards cubic-bezier(.3,1.6,.5,1),crfl 3.2s ease-in-out .45s infinite alternate}
@keyframes crin{from{transform:scale(0) rotate(-20deg);opacity:0}}
.g-crystals .cr.brk .gm,.g-crystals .cr.brk .sy,.g-crystals .cr.brk .glow{transform:scale(1.4);opacity:0}
.g-crystals .cr.brk{pointer-events:none}
.g-crystals .sh{position:absolute;left:90px;top:100px;width:34px;height:40px;clip-path:polygon(50% 0,100% 60%,30% 100%);background:rgb(var(--c));box-shadow:0 0 12px rgb(var(--c));animation:shfly .7s ease-out forwards}
@keyframes shfly{to{transform:translate(var(--dx),var(--dy)) rotate(var(--rt));opacity:0}}
.g-crystals .cr.bad{animation:crsh .4s}
@keyframes crsh{25%{transform:translateX(-12px) rotate(-4deg)}75%{transform:translateX(12px) rotate(4deg)}}
.g-crystals .cr.bad .gm{filter:grayscale(.7) brightness(.7)}
.g-crystals .cr .ck{position:absolute;inset:0;opacity:0;pointer-events:none}.g-crystals .cr.bad .ck,.g-crystals .cr.was .ck{opacity:1}
.g-crystals .cr.was{pointer-events:none;opacity:.75}
.g-crystals .cr .bd{position:absolute;right:-6px;top:-6px;width:58px;height:58px;border-radius:50%;display:none;place-items:center;font:900 34px Nunito,sans-serif;color:#fff;box-shadow:0 0 0 4px #fff}
.g-crystals .cr.was .bd,.g-crystals .cr.bad .bd,.g-crystals .cr.lost .bd{display:grid}
.g-crystals .cr.lost{pointer-events:none;animation:crlost .8s ease-in-out infinite alternate}
@keyframes crlost{to{filter:brightness(1.6)}}
.g-crystals .fx{position:absolute;font:900 34px Nunito,sans-serif;color:#7CF5D0;text-shadow:0 0 12px #2DBE8C;pointer-events:none;animation:fxup .9s forwards;z-index:6}
.g-crystals .fx.no{color:#FF8FB0;text-shadow:0 0 12px #F0407A}
@keyframes fxup{to{transform:translateY(-60px);opacity:0}}
.g-crystals .cv-ov{position:absolute;inset:0;z-index:20;display:grid;place-items:center;background:rgba(11,7,38,.72);backdrop-filter:blur(4px)}
.g-crystals .cv-card{width:760px;padding:34px 40px;border-radius:34px;text-align:center;background:linear-gradient(160deg,rgba(124,90,255,.35),rgba(30,15,90,.85));box-shadow:0 0 0 2px rgba(255,255,255,.2),0 30px 70px rgba(0,0,0,.5)}
.g-crystals .cv-card h2{font:900 58px Nunito,sans-serif;color:#fff;margin:0}
.g-crystals .cv-card p{font:700 25px/1.4 Manrope,sans-serif;color:#E2DBFF;margin:14px 0 0}
.g-crystals .cv-card .tl{display:flex;justify-content:center;gap:14px;margin-top:20px}
.g-crystals .cv-card .tl span{display:grid;place-items:center;width:120px;height:110px;border-radius:24px;font:900 28px Nunito,sans-serif;color:#fff}
.g-crystals .cv-card .tl b{font-size:48px;line-height:1}
.g-crystals .cv-go{margin-top:26px;padding:20px 54px;border:0;border-radius:24px;font:900 32px Nunito,sans-serif;color:#1A1250;background:linear-gradient(135deg,#7CF5D0,#B49BFF);box-shadow:0 10px 30px rgba(124,245,208,.4);cursor:pointer}
.g-crystals .cv-res{font:900 80px Nunito,sans-serif;color:#7CF5D0;margin-top:6px}
`;
  function mount(stage, K){
    stage.innerHTML = `<div class="cv-st"></div><div class="cv-top"></div><div class="cv-bot"></div>
      <div class="cv-side cv-l">Раунд <span id="cvr">1</span>/${ROUNDS}</div><div class="cv-side cv-r">💎 <span id="cvs">0</span></div>
      <div class="cv-hud"><div class="cv-goal"><span class="cv-num" id="cvn">?</span><span id="cvt">Разбей кристаллы тона</span></div></div><div class="cv-bar"><i id="cvb"></i></div>
      <div class="cv-field"></div><div class="cv-ov" id="cvo"></div>`;
    const q = s => stage.querySelector(s), field = q('.cv-field'), ov = q('#cvo');
    let alive = true, round = 0, score = 0, right = 0, of = 0, wrong = 0, miss = [], order = [], timer = 0, t0 = 0, raf = 0, left = 0, busy = false;
    const tms = []; const later = (f, ms) => { const t = setTimeout(() => { if (alive) f(); }, ms); tms.push(t); return t; };
    const intro = () => { ov.style.display = 'grid'; ov.innerHTML = `<div class="cv-card"><h2>💎 Пещера тонов</h2><p>Наверху — <b>номер тона</b>. Разбей <b>все</b> кристаллы, где значок этого тона!</p>
      <div class="tl">${[1,2,3,4].map(t => `<span style="background:${TC[t]}"><b><svg viewBox="0 0 80 60" style="height:44px"><path d="${['','M8 30 H72','M16 46 L64 12','M10 14 L40 46 L70 14','M16 12 L64 46'][t]}" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/></svg></b>${t}</span>`).join('')}</div><button class="cv-go">▶ Начать</button></div>`;
      ov.querySelector('.cv-go').onclick = start; };
    function start(){ K.ac(); round = 0; score = 0; right = 0; of = 0; wrong = 0; miss = []; q('#cvs').textContent = 0;
      // each tone twice, never the same tone two rounds in a row
      do { order = K.shuffle([1,2,3,4,1,2,3,4]); } while (order.some((t, i) => i && t === order[i - 1]));
      ov.style.display = 'none'; next(); }
    function next(){ if (!alive) return; if (round >= ROUNDS) return end(); const T = order[round]; round++; busy = false;
      q('#cvr').textContent = round; const n = q('#cvn'); n.textContent = T; n.style.background = TC[T]; n.style.color = TC[T]; n.style.color = '#fff'; n.style.boxShadow = `0 0 30px ${TC[T]},inset 0 -6px 0 rgba(0,0,0,.18)`;
      q('#cvt').textContent = `Разбей ${TN[T]} тон!`; const g = q('.cv-goal'); g.classList.remove('pop'); void g.offsetWidth; g.classList.add('pop');
      if (window.KRU) window.KRU('cr' + T);
      const bases = K.shuffle(BASES).slice(0, 10), nT = 3 + (Math.random() < .5 ? 1 : 0);
      const items = bases.map((b, i) => { let t = T; if (i >= nT) { const o = [1,2,3,4].filter(x => x !== T); t = o[Math.floor(Math.random() * 3)]; } return {b, t, s: mk(b, t), c: chr(b, t)}; });
      left = nT; of += nT;
      field.innerHTML = '';
      K.shuffle(items).forEach((it, i) => { const [x, y] = POS[i]; const h = HUES[i % HUES.length];
        const el = document.createElement('div'); el.className = 'cr cin'; el.style.left = (x + (Math.random() * 30 - 15)) + 'px'; el.style.top = (y + (Math.random() * 24 - 12)) + 'px';
        el.style.setProperty('--c', h.join(',')); el.style.setProperty('--dl', (-Math.random() * 3) + 's'); el.style.animationDelay = (i * .04) + 's,' + (-Math.random() * 3) + 's';
        el.innerHTML = `<div class="glow"></div><div class="gm"></div><svg class="ck" viewBox="0 0 180 206"><path d="M90 20 L80 70 L100 95 L70 140 L95 190 M80 70 L50 80 M100 95 L135 110" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/></svg><div class="sy">${it.s}</div><div class="bd" style="background:${TC[it.t]}">${it.t}</div>`;
        el.onpointerdown = e => { e.preventDefault(); hit(el, it, T); };
        field.appendChild(el); it.el = el; });
      field._items = items;
      t0 = performance.now(); cancelAnimationFrame(raf);
      const tick = () => { if (!alive || busy) return; const k = Math.max(0, 1 - (performance.now() - t0) / (TIME * 1000)); q('#cvb').style.width = (k * 100) + '%'; if (k <= 0) return timeout(T); raf = requestAnimationFrame(tick); }; raf = requestAnimationFrame(tick); }
    function fx(el, txt, bad){ const f = document.createElement('div'); f.className = 'fx' + (bad ? ' no' : ''); f.textContent = txt; f.style.left = (parseFloat(el.style.left) - 30) + 'px'; f.style.top = (parseFloat(el.style.top) - 120) + 'px'; field.appendChild(f); later(() => f.remove(), 900); }
    function hit(el, it, T){ if (busy || el.classList.contains('brk') || el.classList.contains('was')) return;
      if (it.t === T){ el.classList.add('brk'); K.sfx('gem'); if (it.c) K.say(it.c); right++; left--; score += 10; q('#cvs').textContent = score; fx(el, '+10');
        for (let i = 0; i < 9; i++){ const s = document.createElement('i'); s.className = 'sh'; const a = Math.random() * Math.PI * 2, d = 90 + Math.random() * 110; s.style.setProperty('--dx', Math.cos(a) * d + 'px'); s.style.setProperty('--dy', Math.sin(a) * d + 'px'); s.style.setProperty('--rt', (Math.random() * 540 - 270) + 'deg'); el.appendChild(s); }
        if (left <= 0){ busy = true; const bonus = Math.max(0, Math.round((TIME * 1000 - (performance.now() - t0)) / 1000)); score += bonus; q('#cvs').textContent = score; if (bonus) fx(el, '⏱ +' + bonus); K.sfx('coin'); later(next, 1100); } }
      else { el.classList.add('bad'); K.sfx('no'); wrong++; score = Math.max(0, score - 3); q('#cvs').textContent = score; fx(el, it.t + '-й тон', true); if (!miss.includes(it.s)) miss.push(it.s); later(() => { el.classList.remove('bad'); el.classList.add('was'); }, 420); } }
    function timeout(T){ busy = true; K.sfx('no'); (field._items || []).forEach(it => { if (it.t === T && !it.el.classList.contains('brk')){ it.el.classList.add('lost'); if (!miss.includes(it.s)) miss.push(it.s); } }); later(next, 1800); }
    function end(){ cancelAnimationFrame(raf); field.innerHTML = ''; K.sfx('win'); ov.style.display = 'grid';
      ov.innerHTML = `<div class="cv-card"><h2>🏆 Пещера пройдена!</h2><div class="cv-res">💎 ${right} / ${of}</div><p>Очки: <b>${score}</b>${miss.length ? `<br>Повтори: <b>${miss.join(', ')}</b>` : '<br>Без единой ошибки!'}</p><button class="cv-go">↺ Ещё раз</button></div>`;
      ov.querySelector('.cv-go').onclick = start;
      if (K.onResult) K.onResult('crystals', {right, of, score, wrong, miss: miss.slice(0, 20)}); }
    intro();
    return { destroy(){ alive = false; cancelAnimationFrame(raf); tms.forEach(clearTimeout); } };
  }
  KAT.register({id: 'crystals', css, audio: AUD, mount});
})();
