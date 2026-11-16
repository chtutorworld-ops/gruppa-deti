/* Урок 9 · Космический шутер (из каталога Дарьи): услышь слог и сбей астероид с его пиньинем. Финали ai ei ao ou an en. */
(function(){
  const WORDS = [["白", "bái", "ai"], ["买", "mǎi", "ai"], ["来", "lái", "ai"], ["开", "kāi", "ai"], ["海", "hǎi", "ai"], ["太", "tài", "ai"], ["在", "zài", "ai"], ["菜", "cài", "ai"], ["摘", "zhāi", "ai"], ["晒", "shài", "ai"], ["牌", "pái", "ai"], ["改", "gǎi", "ai"], ["北", "běi", "ei"], ["杯", "bēi", "ei"], ["美", "měi", "ei"], ["妹", "mèi", "ei"], ["飞", "fēi", "ei"], ["给", "gěi", "ei"], ["黑", "hēi", "ei"], ["类", "lèi", "ei"], ["内", "nèi", "ei"], ["陪", "péi", "ei"], ["贼", "zéi", "ei"], ["包", "bāo", "ao"], ["猫", "māo", "ao"], ["刀", "dāo", "ao"], ["好", "hǎo", "ao"], ["老", "lǎo", "ao"], ["高", "gāo", "ao"], ["早", "zǎo", "ao"], ["草", "cǎo", "ao"], ["跑", "pǎo", "ao"], ["桃", "táo", "ao"], ["找", "zhǎo", "ao"], ["兜", "dōu", "ou"], ["头", "tóu", "ou"], ["楼", "lóu", "ou"], ["狗", "gǒu", "ou"], ["口", "kǒu", "ou"], ["后", "hòu", "ou"], ["走", "zǒu", "ou"], ["手", "shǒu", "ou"], ["周", "zhōu", "ou"], ["抽", "chōu", "ou"], ["班", "bān", "an"], ["满", "mǎn", "an"], ["饭", "fàn", "an"], ["蛋", "dàn", "an"], ["谈", "tán", "an"], ["南", "nán", "an"], ["蓝", "lán", "an"], ["看", "kàn", "an"], ["喊", "hǎn", "an"], ["三", "sān", "an"], ["山", "shān", "an"], ["站", "zhàn", "an"], ["本", "běn", "en"], ["盆", "pén", "en"], ["门", "mén", "en"], ["分", "fēn", "en"], ["跟", "gēn", "en"], ["很", "hěn", "en"], ["森", "sēn", "en"], ["真", "zhēn", "en"], ["陈", "chén", "en"], ["神", "shén", "en"]];
  const FIN = w => w[2];
  const SHIELD_Y = 572, SHIP_Y = 648, WIN_AT = 15, PER_LEVEL = 4;

  const css = `
.g-shooter{--serif:Nunito,Georgia,serif;--ease-out:cubic-bezier(.2,.8,.2,1);background:#070B24;user-select:none;-webkit-user-select:none;color:#fff}
.g-shooter .sh-cv{position:absolute;inset:0;width:1280px;height:720px;display:block}
.g-shooter .sh-cv.sh-on{cursor:none}
.g-shooter .sh-hud{position:absolute;left:0;right:0;top:0;display:flex;justify-content:space-between;align-items:flex-start;padding:20px 26px;box-sizing:border-box;pointer-events:none;transition:opacity .4s,transform .5s var(--ease-out)}
.g-shooter .sh-hud.off{opacity:0;transform:translateY(-30px)}
.g-shooter .sh-glass{background:linear-gradient(180deg,rgba(40,44,96,.62),rgba(18,20,56,.62));backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);border:1px solid rgba(160,170,255,.2);box-shadow:0 12px 30px rgba(0,0,10,.4),0 1px 0 rgba(255,255,255,.08) inset;border-radius:20px}
.g-shooter .sh-score{padding:12px 20px;min-width:160px}
.g-shooter .sh-score small,.g-shooter .sh-tl{display:block;font:700 11px var(--sans);letter-spacing:.18em;text-transform:uppercase;color:#9EA6E0}
.g-shooter .sh-score b{display:block;font:700 34px/1.1 var(--serif);font-variant-numeric:tabular-nums;color:#fff}
.g-shooter .sh-lvl{display:inline-block;margin-top:4px;font:800 12px var(--sans);letter-spacing:.06em;color:#0B1030;background:linear-gradient(135deg,#7FF0E4,#A89CFF);padding:3px 10px;border-radius:99px}
.g-shooter .sh-target{display:flex;align-items:center;gap:20px;padding:12px 14px 12px 26px;pointer-events:auto}
.g-shooter .sh-target.bump{animation:sh-bump .55s cubic-bezier(.3,1.6,.5,1)}
@keyframes sh-bump{0%{transform:scale(.86);filter:brightness(1.8)}100%{transform:scale(1)}}
.g-shooter .sh-han{font:600 56px/1 var(--han);color:#fff;text-shadow:0 0 22px rgba(140,160,255,.6);white-space:nowrap}
.g-shooter .sh-ru{font:600 16px var(--sans);color:#C9CEF7;margin-top:4px}
.g-shooter .sh-rep{width:54px;height:54px;border-radius:50%;border:1px solid rgba(160,240,230,.45);background:radial-gradient(circle at 35% 30%,#3FD6C6,#1A6F8C);color:#fff;cursor:pointer;display:grid;place-items:center;box-shadow:0 0 18px rgba(63,214,198,.35);transition:transform .15s}
.g-shooter .sh-rep:hover{transform:scale(1.07)}
.g-shooter .sh-rep:active{transform:scale(.94)}
.g-shooter .sh-rep svg{width:24px;height:24px}
.g-shooter .sh-lives{display:flex;gap:10px;padding:14px 18px}
.g-shooter .sh-lives svg{width:34px;height:38px;transition:opacity .3s,transform .4s cubic-bezier(.3,1.6,.5,1),filter .3s}
.g-shooter .sh-lives svg.lost{opacity:.22;transform:scale(.8);filter:grayscale(1)}
.g-shooter .sh-banner{position:absolute;left:0;right:0;top:300px;text-align:center;font:700 64px var(--serif);color:#fff;text-shadow:0 0 30px rgba(127,240,228,.7);pointer-events:none;opacity:0}
.g-shooter .sh-banner.go{animation:sh-ban 1.6s var(--ease-out)}
@keyframes sh-ban{0%{opacity:0;transform:scale(.7);letter-spacing:.3em}20%{opacity:1;transform:scale(1);letter-spacing:.02em}75%{opacity:1}100%{opacity:0;transform:translateY(-30px)}}
.g-shooter .sh-screen{position:absolute;inset:0;display:grid;place-items:center;background:radial-gradient(ellipse at center,rgba(20,20,70,.35),rgba(5,6,24,.72));transition:opacity .45s,visibility .45s}
.g-shooter .sh-screen.hide{opacity:0;visibility:hidden}
.g-shooter .sh-panel{text-align:center;padding:48px 70px 46px;border-radius:32px;background:linear-gradient(180deg,rgba(46,48,110,.72),rgba(16,18,54,.8));border:1px solid rgba(170,180,255,.25);box-shadow:0 40px 100px rgba(0,0,0,.55),0 1px 0 rgba(255,255,255,.1) inset;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);animation:sh-in .7s var(--ease-out);max-width:680px}
@keyframes sh-in{from{opacity:0;transform:translateY(24px) scale(.96)}}
.g-shooter .sh-kicker{font:700 13px var(--sans);letter-spacing:.24em;text-transform:uppercase;color:#7FF0E4}
.g-shooter h2{font:700 66px/1.05 var(--serif);margin:12px 0 14px;background:linear-gradient(180deg,#fff,#C9C2FF);-webkit-background-clip:text;background-clip:text;color:transparent}
.g-shooter .sh-rule{font:500 20px/1.45 var(--sans);color:#C9CEF7;margin:0 0 12px}
.g-shooter .sh-keys{font:600 14px var(--sans);color:#8F97CF;margin:0 0 30px}
.g-shooter .sh-keys kbd{font:700 12px var(--sans);color:#fff;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.2);border-bottom-width:2px;border-radius:6px;padding:2px 7px;margin:0 2px}
.g-shooter .sh-go{border:0;cursor:pointer;font:800 22px var(--sans);color:#0B1030;padding:18px 60px;border-radius:99px;background:linear-gradient(135deg,#7FF0E4,#A89CFF 60%,#E07AB0);box-shadow:0 0 34px rgba(127,240,228,.45),0 -3px 0 rgba(0,0,0,.15) inset;transition:transform .2s cubic-bezier(.3,1.6,.5,1),box-shadow .2s}
.g-shooter .sh-go:hover{transform:translateY(-3px) scale(1.03);box-shadow:0 0 48px rgba(127,240,228,.6),0 -3px 0 rgba(0,0,0,.15) inset}
.g-shooter .sh-go:active{transform:scale(.97)}
.g-shooter .sh-end .sh-panel{max-width:none;width:1060px;display:grid;grid-template-columns:320px 1fr;gap:38px;text-align:left;padding:40px 44px}
.g-shooter .sh-big{font:700 90px/1 var(--serif);margin:8px 0 4px;font-variant-numeric:tabular-nums;color:#fff}
.g-shooter .sh-stats{display:flex;gap:26px;margin:18px 0 22px}
.g-shooter .sh-stats div{font:600 14px var(--sans);color:#9EA6E0}
.g-shooter .sh-stats b{display:block;font:700 30px var(--serif);color:#fff}
.g-shooter .sh-praise{font:600 19px/1.4 var(--sans);color:#DDE0FB;margin:0 0 26px}
.g-shooter .sh-list-h{font:700 13px var(--sans);letter-spacing:.16em;text-transform:uppercase;color:#9EA6E0;margin-bottom:12px}
.g-shooter .sh-list{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:10px;max-height:470px;overflow:auto;align-content:start;padding-right:4px}
.g-shooter .sh-w{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:3px 12px;padding:10px 14px;border-radius:14px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);border-left:4px solid #3FD6C6}
.g-shooter .sh-w.miss{border-left-color:#E0588A}
.g-shooter .sh-w .h{grid-row:span 2;font:600 28px/1 var(--han);color:#fff;white-space:nowrap}
.g-shooter .sh-w .p{font:italic 700 16px var(--serif);color:#7FF0E4;white-space:nowrap;font-size:14px}
.g-shooter .sh-w .r{grid-column:2;font:500 13px var(--sans);color:#AEB4E6}
.g-shooter .sh-w .m{grid-row:1/span 2;grid-column:3;font:800 18px var(--sans);color:#3FD6C6}
.g-shooter .sh-w.miss .m{color:#E0588A}
`;
  const SPEAKER = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H3v6h3l5 4V5z" fill="currentColor"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/></svg>';
  const LIFE = '<svg viewBox="0 0 34 38"><defs><linearGradient id="sh-lg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9FF6EC"/><stop offset="1" stop-color="#3A8FD0"/></linearGradient></defs><path d="M17 2 31 7v10c0 9-6 15-14 19C9 32 3 26 3 17V7z" fill="url(#sh-lg)" stroke="#E6FFFC" stroke-width="1.5"/><path d="M17 8v22M10 15h14" stroke="rgba(10,30,70,.35)" stroke-width="2.4" stroke-linecap="round"/></svg>';

  KAT.register({
    id: 'shooter9',
    title: 'Космический шутер: финали',
    kind: 'Аркада',
    text: 'Вверху иероглиф — сбей астероид с его пиньинем. Промах стоит щита, а уровни всё быстрее.',
    where: ['урок', 'домашка'],
    topic: 'Покупки и еда · модули 1–2',
    css,
    audio: WORDS.map(w => w[0]),
    mount(stage, K){
      const root = document.createElement('div');
      root.style.cssText = 'position:absolute;inset:0;outline:none';
      root.tabIndex = -1;
      root.innerHTML = `
        <canvas class="sh-cv"></canvas>
        <div class="sh-hud off">
          <div class="sh-glass sh-score"><small>Счёт</small><b>0</b><span class="sh-lvl">Уровень 1</span></div>
          <div class="sh-glass sh-target"><div><span class="sh-tl">Слушай и сбей этот слог</span><div class="sh-han">—</div><div class="sh-ru">&nbsp;</div></div><button class="sh-rep" type="button" title="Повторить слово" aria-label="Повторить слово">${SPEAKER}</button></div>
          <div class="sh-glass sh-lives">${LIFE}${LIFE}${LIFE}</div>
        </div>
        <div class="sh-banner"></div>
        <div class="sh-screen sh-start"><div class="sh-panel">
          <div class="sh-kicker">Финали · ai ei ao ou an en</div>
          <h2>Космический шутер</h2>
          <p class="sh-rule">Звучит слог — сбей астероид с <b>этим</b> пиньинем! Слушай финаль: <b>ai</b> или <b>ei</b>? <b>ao</b> или <b>ou</b>? <b>an</b> или <b>en</b>? Нажми 🔊, чтобы послушать ещё раз.</p>
          <p class="sh-keys">Корабль — мышью или <kbd>←</kbd> <kbd>→</kbd>, огонь — кликом или <kbd>Пробел</kbd></p>
          <button class="sh-go" type="button">Начать</button>
        </div></div>
        <div class="sh-screen sh-end hide"></div>`;
      stage.appendChild(root);
      const $ = s => root.querySelector(s);
      const cv = $('.sh-cv'), ctx = cv.getContext('2d');
      const S = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
      cv.width = 1280 * S; cv.height = 720 * S;
      const cs = getComputedStyle(stage);
      const SANS = cs.getPropertyValue('--sans').trim() || 'system-ui,sans-serif';
      const SERIF = cs.getPropertyValue('--serif').trim() || 'Georgia,serif';
      const hud = $('.sh-hud'), scoreEl = $('.sh-score b'), lvlEl = $('.sh-lvl'), hanEl = $('.sh-han'), ruEl = $('.sh-ru'), tgtEl = $('.sh-target');
      const lifeEls = [...root.querySelectorAll('.sh-lives svg')], banner = $('.sh-banner');
      const startScr = $('.sh-start'), endScr = $('.sh-end');
      const rnd = (a, b) => a + Math.random() * (b - a);

      /* ---------- фон ---------- */
      const layers = [[110, 12, .8, .55], [70, 30, 1.3, .75], [34, 70, 2.1, .95]].map(([n, v, sz, a]) =>
        ({v, stars: Array.from({length: n}, () => ({x: Math.random() * 1280, y: Math.random() * 720, s: sz * rnd(.6, 1.2), a: a * rnd(.5, 1), tw: Math.random() * 6.28, c: Math.random() < .2 ? '#BFF7F0' : Math.random() < .3 ? '#D7CCFF' : '#FFFFFF'}))}));
      const NEB_H = 1440;
      const neb = document.createElement('canvas'); neb.width = 1280; neb.height = NEB_H;
      (function(){
        const c = neb.getContext('2d');
        const cols = ['120,80,215', '32,190,178', '160,60,130', '70,110,230', '140,110,240'];
        for (let i = 0; i < 16; i++) {
          const x = Math.random() * 1280, y = Math.random() * NEB_H, r = rnd(160, 420), col = cols[i % cols.length], a = rnd(.1, .24);
          for (const oy of [-NEB_H, 0, NEB_H]) {
            const g = c.createRadialGradient(x, y + oy, 0, x, y + oy, r);
            g.addColorStop(0, `rgba(${col},${a})`); g.addColorStop(.5, `rgba(${col},${a * .45})`); g.addColorStop(1, `rgba(${col},0)`);
            c.fillStyle = g; c.fillRect(x - r, y + oy - r, r * 2, r * 2);
          }
        }
        for (let i = 0; i < 900; i++) { c.fillStyle = `rgba(210,215,255,${rnd(.03, .12)})`; c.fillRect(Math.random() * 1280, Math.random() * NEB_H, 1, 1); }
      })();
      const planet = document.createElement('canvas'); planet.width = 300 * S; planet.height = 200 * S;
      (function(){
        const c = planet.getContext('2d'); c.scale(S, S); c.translate(150, 100);
        const ring = (front) => { c.save(); c.rotate(-.35); c.beginPath(); c.ellipse(0, 0, 130, 26, 0, front ? 0 : Math.PI, front ? Math.PI : Math.PI * 2); c.lineWidth = 9; c.strokeStyle = 'rgba(200,190,255,.45)'; c.stroke(); c.lineWidth = 3; c.strokeStyle = 'rgba(127,240,228,.35)'; c.beginPath(); c.ellipse(0, 0, 112, 21, 0, front ? 0 : Math.PI, front ? Math.PI : Math.PI * 2); c.stroke(); c.restore(); };
        ring(false);
        let g = c.createRadialGradient(-22, -24, 4, 0, 0, 62);
        g.addColorStop(0, '#CFC3FF'); g.addColorStop(.45, '#7D6BD0'); g.addColorStop(1, '#241A5C');
        c.fillStyle = g; c.beginPath(); c.arc(0, 0, 58, 0, Math.PI * 2); c.fill();
        c.save(); c.beginPath(); c.arc(0, 0, 58, 0, Math.PI * 2); c.clip();
        for (let i = 0; i < 6; i++) { c.fillStyle = `rgba(${i % 2 ? '60,40,140' : '190,180,255'},.18)`; c.fillRect(-70, -50 + i * 18, 140, 7); }
        c.restore();
        ring(true);
      })();
      let planetY = 150;

      /* ---------- астероиды ---------- */
      const ROCK_R = 64;
      const rocks = Array.from({length: 6}, () => {
        const pad = 8, sz = (ROCK_R + pad) * 2, o = document.createElement('canvas'); o.width = sz * S; o.height = sz * S;
        const c = o.getContext('2d'); c.scale(S, S); c.translate(sz / 2, sz / 2);
        const n = 15, pts = [];
        for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2, r = ROCK_R * rnd(.8, 1); pts.push([Math.cos(a) * r, Math.sin(a) * r]); }
        const path = () => { c.beginPath(); for (let i = 0; i < n; i++) { const p = pts[i], q = pts[(i + 1) % n]; const mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2; if (!i) c.moveTo(mx, my); else c.quadraticCurveTo(p[0], p[1], mx, my); } const p = pts[0], q = pts[1]; c.quadraticCurveTo(p[0], p[1], (p[0] + q[0]) / 2, (p[1] + q[1]) / 2); c.closePath(); };
        path();
        let g = c.createRadialGradient(-ROCK_R * .3, -ROCK_R * .3, 4, 0, 0, ROCK_R * 1.1);
        g.addColorStop(0, '#A8A2BA'); g.addColorStop(.55, '#6F6982'); g.addColorStop(1, '#3B364C');
        c.fillStyle = g; c.fill();
        c.save(); path(); c.clip();
        for (let i = 0; i < 260; i++) { c.fillStyle = Math.random() < .5 ? 'rgba(255,255,255,.08)' : 'rgba(10,5,30,.14)'; c.beginPath(); c.arc(rnd(-ROCK_R, ROCK_R), rnd(-ROCK_R, ROCK_R), rnd(.6, 2.4), 0, Math.PI * 2); c.fill(); }
        for (let i = 0; i < 8; i++) {
          const x = rnd(-ROCK_R * .7, ROCK_R * .7), y = rnd(-ROCK_R * .7, ROCK_R * .7), r = rnd(5, 15);
          c.fillStyle = 'rgba(30,24,50,.45)'; c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill();
          c.strokeStyle = 'rgba(210,205,235,.35)'; c.lineWidth = 2; c.beginPath(); c.arc(x, y, r, .2, Math.PI * .9); c.stroke();
          c.strokeStyle = 'rgba(10,6,24,.5)'; c.beginPath(); c.arc(x, y, r, Math.PI * 1.1, Math.PI * 1.8); c.stroke();
        }
        c.lineWidth = 7; c.strokeStyle = 'rgba(20,14,40,.35)'; path(); c.stroke();
        c.restore();
        return {img: o, sz};
      });
      const shade = document.createElement('canvas'); shade.width = 150 * S; shade.height = 150 * S;
      (function(){
        const c = shade.getContext('2d'); c.scale(S, S); c.translate(75, 75);
        const g = c.createRadialGradient(-22, -22, 8, 0, 0, 50);
        g.addColorStop(0, 'rgba(8,6,30,0)'); g.addColorStop(.6, 'rgba(8,6,30,.16)'); g.addColorStop(1, 'rgba(8,6,30,.5)');
        c.fillStyle = g; c.beginPath(); c.arc(0, 0, 49, 0, Math.PI * 2); c.fill();

      })();

      /* ---------- состояние ---------- */
      let state = 'start', raf = 0, last = 0, t = 0;
      let ship = {x: 640, tx: 640, vx: 0, tilt: 0, flash: 0, dead: false};
      let rocksOn = [], bolts = [], parts = [], floats = [], rings = [];
      let target = null, recent = [], score = 0, lives = 3, correct = 0, wrong = 0, streak = 0, level = 1, rounds = [];
      let fireCd = 0, firing = false, keys = {}, shake = 0, tgtSpawnT = 0, spawnT = 0, overT = 0;

      function setTarget(){
        const pool = WORDS.filter(w => w !== target && !recent.includes(w[0]) && !rocksOn.some(r => r.w === w));
        target = K.pick(pool.length ? pool : WORDS.filter(w => w !== target));
        recent.push(target[0]); if (recent.length > 8) recent.shift();
        rounds.push({w: target, hit: false, miss: 0});
        hanEl.textContent = '🔊 ?'; ruEl.textContent = 'нажми 🔊 — ещё раз';
        tgtEl.classList.remove('bump'); void tgtEl.offsetWidth; tgtEl.classList.add('bump');
        tgtSpawnT = .7;
        setTimeout(() => { if (state === 'play') K.say(target[0]); }, 250);
      }
      const P9 = {ai:'ei',ei:'ai',ao:'ou',ou:'ao',an:'en',en:'an'};
      const ini = w => w[1].normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/(ai|ei|ao|ou|an|en)$/, '');
      const similar = w => WORDS.filter(x => x !== w && (FIN(x) === P9[FIN(w)] || ini(x) === ini(w)));
      function spawnRock(isTarget){
        let w;
        if (isTarget) w = target;
        else {
          const used = rocksOn.map(r => r.w);
          let pool = Math.random() < .45 ? similar(target) : WORDS;
          pool = pool.filter(x => x !== target && !used.includes(x));
          if (!pool.length) pool = WORDS.filter(x => x !== target && !used.includes(x));
          w = K.pick(pool);
        }
        let x = 640, best = -1;
        for (let k = 0; k < 10; k++) {
          const cx = rnd(90, 1190);
          const d = Math.min(...rocksOn.filter(r => r.y < 200).map(r => Math.hypot(r.x - cx, r.y + 60)), 999);
          if (d > best) { best = d; x = cx; }
        }
        const sp = 1 + (level - 1) * .17;
        rocksOn.push({w, x, y: -70 - Math.random() * 40, vx: rnd(-10, 10), vy: rnd(30, 42) * sp, r: rnd(.85, 1.05), rot: Math.random() * 6.28, vr: rnd(-.6, .6), spr: Math.floor(Math.random() * rocks.length), hitF: 0});
      }
      function explode(x, y, big, tint){
        const n = K.reduce ? 12 : big ? 34 : 16;
        for (let i = 0; i < n; i++) {
          const a = Math.random() * Math.PI * 2, sp = rnd(80, big ? 380 : 220);
          parts.push({type: 'rock', x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, r: Math.random() * 6, vr: rnd(-8, 8), sz: rnd(3, big ? 11 : 7), life: 0, max: rnd(.6, 1.2), col: Math.random() < .5 ? '#8A849C' : '#5A546E'});
        }
        for (let i = 0; i < (K.reduce ? 10 : big ? 46 : 18); i++) {
          const a = Math.random() * Math.PI * 2, sp = rnd(120, big ? 520 : 300);
          parts.push({type: 'spark', x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, sz: rnd(2, big ? 5 : 3.5), life: 0, max: rnd(.3, .8), col: tint || K.pick(['#7FF0E4', '#C9B8FF', '#FFFFFF', '#FF9CC4'])});
        }
        rings.push({x, y, life: 0, max: .5, r: big ? 150 : 80, col: tint || '#7FF0E4'});
        if (big) parts.push({type: 'flash', x, y, life: 0, max: .4, sz: 120});
        if (!K.reduce) shake = Math.max(shake, big ? 10 : 5);
      }
      function addFloat(x, y, text, col, size, py){ floats.push({x, y, text, col, size: size || 30, life: 0, py}); }
      function updHud(){
        scoreEl.textContent = score.toLocaleString('ru-RU'); lvlEl.textContent = 'Уровень ' + level;
        lifeEls.forEach((el, i) => el.classList.toggle('lost', i >= lives));
      }
      function loseLife(){
        lives--; ship.flash = 1; updHud();
        if (lives <= 0) { state = 'over'; overT = 0; ship.dead = true; explode(ship.x, SHIP_Y, true, '#FF9CC4'); K.sfx('boom'); }
      }
      function fire(){
        if (state !== 'play' || fireCd > 0) return;
        fireCd = .2; K.sfx('laser');
        bolts.push({x: ship.x - 9, y: SHIP_Y - 40}, {x: ship.x + 9, y: SHIP_Y - 40});
      }
      function hitRock(rk){
        const cur = rounds[rounds.length - 1];
        rocksOn = rocksOn.filter(r => r !== rk);
        if (rk.w === target) {
          explode(rk.x, rk.y, true); K.sfx('boom');
          correct++; streak++; cur.hit = true;
          const pts = 100 * level + 20 * Math.min(streak - 1, 5);
          score += pts; addFloat(rk.x, rk.y - 10, '+' + pts, '#7FF0E4', 34);
          addFloat(rk.x, rk.y + 28, 'финаль ' + rk.w[2], '#FFFFFF', 20);
          const nl = Math.min(6, 1 + Math.floor(correct / PER_LEVEL));
          if (correct >= WIN_AT) { updHud(); state = 'over'; overT = .4; setTimeout(() => { if (state === 'over') finish(true); }, 900); return; }
          if (nl > level) { level = nl; K.sfx('win'); showBanner('Уровень ' + level); rocksOn.forEach(r => r.vy *= 1.17); }
          updHud(); setTarget();
        } else {
          explode(rk.x, rk.y, false, '#FF9CC4'); K.sfx('no');
          wrong++; streak = 0; cur.miss++;
          addFloat(rk.x, rk.y - 10, 'Это ' + rk.w[1] + ', а звучало ' + target[1], '#FF9CC4', 22, 1);
          loseLife();
        }
      }
      function showBanner(txt){ banner.textContent = txt; banner.classList.remove('go'); void banner.offsetWidth; banner.classList.add('go'); }

      /* ---------- рисование ---------- */
      function drawShip(x, y, tilt){
        ctx.save(); ctx.translate(x, y); ctx.rotate(tilt * .22); ctx.scale(1 - Math.abs(tilt) * .12, 1);
        // пламя
        ctx.globalCompositeOperation = 'lighter';
        for (const ex of [-14, 14]) {
          const L = 30 + Math.sin(t * 40 + ex) * 6 + Math.random() * 6;
          const g = ctx.createLinearGradient(0, 28, 0, 28 + L);
          g.addColorStop(0, 'rgba(255,255,255,.95)'); g.addColorStop(.25, 'rgba(127,240,228,.85)'); g.addColorStop(.7, 'rgba(140,110,255,.45)'); g.addColorStop(1, 'rgba(140,110,255,0)');
          ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(ex - 7, 28); ctx.quadraticCurveTo(ex, 28 + L * 1.1, ex + 7, 28); ctx.closePath(); ctx.fill();
          const gl = ctx.createRadialGradient(ex, 34, 0, ex, 34, 26); gl.addColorStop(0, 'rgba(127,240,228,.45)'); gl.addColorStop(1, 'rgba(127,240,228,0)');
          ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(ex, 34, 26, 0, Math.PI * 2); ctx.fill();
        }
        ctx.globalCompositeOperation = 'source-over';
        // крылья
        ctx.beginPath(); ctx.moveTo(0, -12); ctx.lineTo(48, 20); ctx.lineTo(46, 32); ctx.lineTo(16, 25); ctx.lineTo(-16, 25); ctx.lineTo(-46, 32); ctx.lineTo(-48, 20); ctx.closePath();
        let g = ctx.createLinearGradient(0, -12, 0, 32); g.addColorStop(0, '#6A58C8'); g.addColorStop(1, '#2A2168');
        ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = '#7FF0E4'; ctx.lineWidth = 1.6; ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,255,.12)'; ctx.beginPath(); ctx.moveTo(0, -12); ctx.lineTo(48, 20); ctx.lineTo(20, 16); ctx.closePath(); ctx.fill();
        const blink = (Math.sin(t * 6) > 0) ? 1 : .35;
        ctx.fillStyle = `rgba(255,120,180,${blink})`; ctx.beginPath(); ctx.arc(-45, 25, 2.6, 0, 7); ctx.arc(45, 25, 2.6, 0, 7); ctx.fill();
        // сопла
        ctx.fillStyle = '#2B2F45'; ctx.fillRect(-20, 22, 12, 9); ctx.fillRect(8, 22, 12, 9);
        // фюзеляж
        ctx.beginPath(); ctx.moveTo(0, -52); ctx.bezierCurveTo(10, -40, 16, -10, 16, 28); ctx.lineTo(-16, 28); ctx.bezierCurveTo(-16, -10, -10, -40, 0, -52); ctx.closePath();
        g = ctx.createLinearGradient(-16, 0, 16, 0); g.addColorStop(0, '#6D7288'); g.addColorStop(.35, '#F4F6FB'); g.addColorStop(.6, '#C3C7D6'); g.addColorStop(1, '#5E6379');
        ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = 'rgba(20,20,50,.5)'; ctx.lineWidth = 1; ctx.stroke();
        // кабина
        g = ctx.createLinearGradient(0, -34, 0, 4); g.addColorStop(0, '#9FF6EC'); g.addColorStop(.5, '#2FA9B8'); g.addColorStop(1, '#16306E');
        ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(0, -14, 7.5, 16, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,.75)'; ctx.beginPath(); ctx.ellipse(-2.5, -20, 2, 6, -.2, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
        // щит
        const pulse = .14 + Math.sin(t * 3) * .04 + ship.flash * .6;
        ctx.save(); ctx.translate(x, y - 6);
        const sg = ctx.createRadialGradient(0, 0, 40, 0, 0, 74);
        const sc = ship.flash > 0 ? '255,110,170' : '127,240,228';
        sg.addColorStop(0, `rgba(${sc},0)`); sg.addColorStop(.8, `rgba(${sc},${pulse * .5})`); sg.addColorStop(1, `rgba(${sc},0)`);
        ctx.fillStyle = sg; ctx.beginPath(); ctx.ellipse(0, 0, 76, 70, 0, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = `rgba(${sc},${pulse + .12})`; ctx.lineWidth = 1.5 + ship.flash * 2; ctx.beginPath(); ctx.ellipse(0, 0, 70, 64, 0, 0, Math.PI * 2); ctx.stroke();
        ctx.restore();
      }
      function drawRock(r){
        const R = rocks[r.spr], k = r.r * (1 + r.hitF * .08);
        ctx.save(); ctx.translate(r.x, r.y);
        ctx.save(); ctx.rotate(r.rot); ctx.scale(k, k); ctx.drawImage(R.img, -R.sz / 2, -R.sz / 2, R.sz, R.sz); ctx.restore();
        ctx.drawImage(shade, -75 * k, -75 * k, 150 * k, 150 * k);
        // табличка с пиньинем
        ctx.font = `italic 700 24px ${SERIF}`;
        const tw = ctx.measureText(r.w[1]).width, pw = tw + 28, ph = 36;
        ctx.fillStyle = 'rgba(10,12,40,.72)'; ctx.strokeStyle = 'rgba(190,200,255,.35)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.roundRect(-pw / 2, -ph / 2, pw, ph, 18); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#FFFFFF'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(r.w[1], 0, 1);
        ctx.restore();
      }
      function frame(now){
        raf = requestAnimationFrame(frame);
        const dt = Math.min(.05, (now - (last || now)) / 1000); last = now; t += dt;
        const playing = state === 'play';
        // корабль
        if (!ship.dead) {
          if (keys.ArrowLeft || keys.a) ship.tx -= 620 * dt;
          if (keys.ArrowRight || keys.d) ship.tx += 620 * dt;
          ship.tx = Math.max(60, Math.min(1220, ship.tx));
          if (state === 'start') ship.tx = 640 + Math.sin(t * .7) * 220;
          const ax = (ship.tx - ship.x) * 60 - ship.vx * 13;
          ship.vx += ax * dt; ship.x += ship.vx * dt;
          ship.tilt = Math.max(-1, Math.min(1, ship.vx / 700));
        }
        ship.flash = Math.max(0, ship.flash - dt * 1.6);
        fireCd -= dt;
        if (playing && (firing || keys[' '])) fire();
        if (playing) {
          tgtSpawnT -= dt;
          if (tgtSpawnT <= 0 && !rocksOn.some(r => r.w === target)) { spawnRock(true); tgtSpawnT = 99; }
          spawnT -= dt;
          const want = Math.min(7, 3 + level);
          if (spawnT <= 0 && rocksOn.filter(r => r.w !== target).length < want - 1) { spawnRock(false); spawnT = rnd(1.1, 2) / (1 + (level - 1) * .15); }
        }
        if (state === 'over') { overT += dt; if (overT > 1.6 && lives <= 0) { overT = -99; finish(false); } }
        // астероиды
        for (const r of rocksOn) {
          r.x += r.vx * dt; r.y += r.vy * dt; r.rot += r.vr * dt; r.hitF = Math.max(0, r.hitF - dt * 4);
          if (r.x < 70 || r.x > 1210) r.vx *= -1;
          if (r.y > SHIELD_Y - 30 * r.r) {
            r.dead = true;
            if (playing && r.w === target) {
              explode(r.x, r.y, false, '#FF9CC4'); K.sfx('no'); streak = 0;
              addFloat(r.x, r.y - 20, 'Упустил: ' + r.w[1], '#FF9CC4', 22, 1);
              loseLife(); if (state === 'play') setTarget();
            } else { explode(r.x, r.y, false, '#7FF0E4'); }
          }
        }
        rocksOn = rocksOn.filter(r => !r.dead);
        // выстрелы
        for (const b of bolts) {
          b.y -= 980 * dt;
          if (!playing) continue;
          for (const r of rocksOn) {
            if (r.y > 10 && Math.hypot(b.x - r.x, b.y - r.y) < ROCK_R * r.r * .85) { b.dead = true; hitRock(r); break; }
          }
          if (state !== 'play') break;
        }
        bolts = bolts.filter(b => !b.dead && b.y > -40);
        for (const q of parts) { q.life += dt; if (q.type !== 'flash') { q.vx *= 1 - 1.8 * dt; q.vy *= 1 - 1.8 * dt; q.x += q.vx * dt; q.y += q.vy * dt; if (q.r !== undefined) q.r += q.vr * dt; } }
        parts = parts.filter(q => q.life < q.max);
        for (const f of floats) { f.life += dt; f.y -= 50 * dt; }
        floats = floats.filter(f => f.life < 1.2);
        for (const r of rings) r.life += dt;
        rings = rings.filter(r => r.life < r.max);
        shake = Math.max(0, shake - dt * 30);

        // --- рисование ---
        const sx = shake ? rnd(-shake, shake) : 0, sy = shake ? rnd(-shake, shake) : 0;
        ctx.setTransform(S, 0, 0, S, S * sx, S * sy);
        const bg = ctx.createLinearGradient(0, 0, 0, 720);
        bg.addColorStop(0, '#050822'); bg.addColorStop(.6, '#0B1236'); bg.addColorStop(1, '#141A4A');
        ctx.fillStyle = bg; ctx.fillRect(-20, -20, 1320, 760);
        const ny = (t * 8) % NEB_H;
        ctx.drawImage(neb, 0, ny - NEB_H, 1280, NEB_H); ctx.drawImage(neb, 0, ny, 1280, NEB_H);
        planetY += 5 * dt; if (planetY > 820) planetY = -220;
        ctx.drawImage(planet, 930, planetY, 300, 200);
        const spd = K.reduce ? .3 : 1;
        for (const L of layers) for (const s of L.stars) {
          s.y += L.v * dt * spd; if (s.y > 722) { s.y = -2; s.x = Math.random() * 1280; }
          ctx.globalAlpha = s.a * (.7 + .3 * Math.sin(t * 3 + s.tw)); ctx.fillStyle = s.c;
          ctx.fillRect(s.x, s.y, s.s, s.s * (L.v > 50 ? 2.2 : 1));
        }
        ctx.globalAlpha = 1;
        // линия щита
        if (playing || state === 'over') {
          const g = ctx.createLinearGradient(0, SHIELD_Y - 8, 0, SHIELD_Y + 8);
          g.addColorStop(0, 'rgba(127,240,228,0)'); g.addColorStop(.5, 'rgba(127,240,228,.16)'); g.addColorStop(1, 'rgba(127,240,228,0)');
          ctx.fillStyle = g; ctx.fillRect(0, SHIELD_Y - 8, 1280, 16);
        }
        for (const r of rocksOn) drawRock(r);
        // выстрелы
        ctx.globalCompositeOperation = 'lighter';
        for (const b of bolts) {
          ctx.strokeStyle = 'rgba(127,240,228,.35)'; ctx.lineWidth = 8; ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(b.x, b.y); ctx.lineTo(b.x, b.y + 26); ctx.stroke();
          ctx.strokeStyle = '#E8FFFC'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(b.x, b.y); ctx.lineTo(b.x, b.y + 22); ctx.stroke();
        }
        for (const q of parts) {
          const a = Math.max(0, 1 - q.life / q.max);
          if (q.type === 'spark') { ctx.globalAlpha = a; ctx.fillStyle = q.col; ctx.beginPath(); ctx.arc(q.x, q.y, q.sz * (.5 + a * .5), 0, 7); ctx.fill(); }
          else if (q.type === 'flash') { const g = ctx.createRadialGradient(q.x, q.y, 0, q.x, q.y, q.sz); g.addColorStop(0, `rgba(255,255,255,${a})`); g.addColorStop(.25, `rgba(127,240,228,${a * .7})`); g.addColorStop(.6, `rgba(150,110,255,${a * .35})`); g.addColorStop(1, 'rgba(150,110,255,0)'); ctx.globalAlpha = 1; ctx.fillStyle = g; ctx.fillRect(q.x - q.sz, q.y - q.sz, q.sz * 2, q.sz * 2); }
        }
        for (const r of rings) { const k = r.life / r.max; ctx.globalAlpha = 1 - k; ctx.strokeStyle = r.col; ctx.lineWidth = 5 * (1 - k) + 1; ctx.beginPath(); ctx.arc(r.x, r.y, 20 + k * r.r, 0, 7); ctx.stroke(); }
        ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
        for (const q of parts) {
          if (q.type !== 'rock') continue;
          ctx.globalAlpha = Math.max(0, 1 - q.life / q.max); ctx.save(); ctx.translate(q.x, q.y); ctx.rotate(q.r); ctx.fillStyle = q.col;
          ctx.beginPath(); ctx.moveTo(-q.sz, -q.sz * .4); ctx.lineTo(0, -q.sz); ctx.lineTo(q.sz, -q.sz * .2); ctx.lineTo(q.sz * .4, q.sz * .8); ctx.lineTo(-q.sz * .6, q.sz * .6); ctx.closePath(); ctx.fill(); ctx.restore();
        }
        ctx.globalAlpha = 1;
        if (!ship.dead) drawShip(ship.x, SHIP_Y, ship.tilt);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        for (const f of floats) {
          const k = f.life / 1.2, sc = f.life < .15 ? .6 + f.life / .15 * .4 : 1;
          ctx.globalAlpha = k > .7 ? (1 - k) / .3 : 1;
          ctx.font = f.py ? `italic 700 ${f.size * sc}px ${SERIF}` : `800 ${f.size * sc}px ${SANS}`;
          const fw = ctx.measureText(f.text).width / 2 + 12, fx = Math.max(fw, Math.min(1280 - fw, f.x));
          ctx.lineWidth = 5; ctx.strokeStyle = 'rgba(5,8,34,.85)'; ctx.strokeText(f.text, fx, f.y);
          ctx.fillStyle = f.col; ctx.fillText(f.text, fx, f.y);
        }
        ctx.globalAlpha = 1;
      }

      /* ---------- экраны ---------- */
      function start(){
        K.ac(); K.sfx('whoosh');
        state = 'play'; score = 0; lives = 3; correct = 0; wrong = 0; streak = 0; level = 1; rounds = []; recent = []; target = null;
        rocksOn = []; bolts = []; parts = []; floats = []; rings = []; spawnT = .6;
        ship = {x: ship.x, tx: 640, vx: 0, tilt: 0, flash: 0, dead: false};
        updHud(); startScr.classList.add('hide'); endScr.classList.add('hide'); hud.classList.remove('off'); cv.classList.add('sh-on');
        setTarget(); spawnRock(false); spawnRock(false);
        rocksOn.forEach((r, i) => r.y = 60 + i * 90);
        root.focus({preventScroll: true});
      }
      function finish(won){
        state = 'end'; hud.classList.add('off'); cv.classList.remove('sh-on'); firing = false; keys = {};
        if (won) K.sfx('win');
        const shots = correct + wrong, acc = shots ? Math.round(correct / shots * 100) : 0;
        const praise = won ? 'Все уровни пройдены! Пилот высшего класса.' :
          correct >= 15 ? 'Отличный полёт! Ты уверенно читаешь пиньинь.' :
          correct >= 6 ? 'Хороший полёт! В следующий раз — ещё дальше.' : 'Полёт только начался. Попробуй ещё раз!';
        const map = new Map();
        rounds.forEach(r => { if (!r.hit && !r.miss && r === rounds[rounds.length - 1] && won) return; const m = map.get(r.w[0]) || {w: r.w, hit: false}; m.hit = m.hit || r.hit; map.set(r.w[0], m); });
        if (KAT.onResult) KAT.onResult('shooter9', {right: correct, of: correct + wrong + [...map.values()].filter(m => !m.hit).length, wrong, score, won, miss: [...map.values()].filter(m => !m.hit).map(m => m.w[1]).slice(0, 12)});
        const items = [...map.values()].map(m => `<div class="sh-w${m.hit ? '' : ' miss'}"><span class="h" style="font-family:Nunito,sans-serif;font-style:italic">${m.w[1]}</span><span class="p">финаль ${m.w[2]}</span><span class="r">&nbsp;</span><span class="m">${m.hit ? '✓' : '✗'}</span></div>`).join('');
        endScr.innerHTML = `<div class="sh-panel">
          <div><div class="sh-kicker">${won ? 'Победа' : 'Полёт окончен'}</div><div class="sh-big">${score.toLocaleString('ru-RU')}</div>
          <div class="sh-stats"><div><b>${level}</b>уровень</div><div><b>${acc}&nbsp;%</b>точность</div><div><b>${correct}</b>сбито</div></div>
          <p class="sh-praise">${praise}</p><button class="sh-go" type="button">Ещё раз</button></div>
          <div><div class="sh-list-h">Слоги полёта</div><div class="sh-list">${items}</div></div></div>`;
        endScr.querySelector('.sh-go').onclick = start;
        endScr.classList.remove('hide');
      }
      $('.sh-go').onclick = start;
      $('.sh-rep').onclick = e => { e.stopPropagation(); if (target) K.say(target[0]); root.focus({preventScroll: true}); };
      $('.sh-rep').addEventListener('pointerdown', e => e.stopPropagation());

      const pos = e => K.toXY(stage, e)[0];
      cv.addEventListener('pointermove', e => { if (state === 'play') ship.tx = pos(e); });
      cv.addEventListener('pointerdown', e => { if (state !== 'play') return; ship.tx = pos(e); firing = true; fire(); });
      root.addEventListener('pointerup', () => { firing = false; });
      cv.addEventListener('pointerleave', () => { firing = false; });
      root.addEventListener('keydown', e => {
        if (state !== 'play') return;
        if (['ArrowLeft', 'ArrowRight', ' ', 'a', 'd'].includes(e.key)) { e.preventDefault(); keys[e.key] = true; if (e.key === ' ' && !e.repeat) fire(); }
      });
      root.addEventListener('keyup', e => { keys[e.key] = false; });
      root.addEventListener('blur', () => { keys = {}; firing = false; });

      raf = requestAnimationFrame(frame);
      return {
        destroy(){ state = 'dead'; cancelAnimationFrame(raf); K.stopVoice && K.stopVoice(); root.remove(); },
        _dbg: () => ({state, target, rocks: rocksOn, ship})
      };
    }
  });
})();

