/* Бей крота: тоны — услышь слог и ударь крота с нужным тоном. */
(function(){
  // ДЗ 6: слух на предыхание. В каждой семье пары: [0] и [1] — пара b/p (или d/t, g/k), [2] и [3] — вторая пара.
  // Урок 7: пары, которые легко спутать. [0]↔[1] и [2]↔[3] — «соседи» (b–p, d–t, g–k, z–c, zh–ch, s–sh).
  const FAM = {
    ba1: [['八','bā'], ['趴','pā'], ['搭','dā'], ['他','tā']],
    gu3: [['古','gǔ'], ['苦','kǔ'], ['赌','dǔ'], ['土','tǔ']],
    za1: [['匝','zā'], ['擦','cā'], ['渣','zhā'], ['插','chā']],
    zu1: [['租','zū'], ['粗','cū'], ['猪','zhū'], ['出','chū']],
    zi4: [['字','zì'], ['次','cì'], ['志','zhì'], ['翅','chì']],
    zi3: [['子','zǐ'], ['此','cǐ'], ['纸','zhǐ'], ['尺','chǐ']],
    sa1: [['仨','sā'], ['沙','shā'], ['苏','sū'], ['书','shū']],
    si4: [['四','sì'], ['是','shì'], ['色','sè'], ['社','shè']]
  };
  const ROW1 = f => f === 'ba1' || f === 'gu3';
  const INI = py => (py.match(/^(zh|ch|sh|[bpmfdtnlgkhzcs])/) || ['', ''])[1];
  const ISI = py => /^(z|c|s|zh|ch|sh)[iīíǐì]$/.test(py);
  const NOTE = py => { const i = INI(py);
    if (ISI(py)) return {z: '«дзы»', c: '«цы» — без предыхания!', s: '«сы»', zh: '«джы»', ch: '«чшы» — без предыхания!', sh: '«шы»'}[i];
    if ('ptkc'.includes(i) || i === 'ch') return 'предыхательный 💨';
    if (i === 's') return 's — «с», кончик языка у зубов';
    if (i === 'sh') return 'sh — «ш», язык загнут';
    return 'непредыхательный'; };
  const AIR = () => false;
  const FAMS = Object.keys(FAM);
  const DUR = 60;
  const TONE_COL = ['#3E86B8', '#E2557F', '#3E86B8', '#E2557F'];
  // лунки: [x, y центра ямки, масштаб]
  const HOLES = [];
  [[330, .74, [405, 640, 875]], [468, .87, [360, 640, 920]], [626, 1, [305, 640, 975]]].forEach(([y, s, xs]) => xs.forEach(x => HOLES.push({x, y, s})));

  const css = `
.g-moles{background:#8FD3A8;user-select:none;-webkit-user-select:none}
.g-moles .ml-bg{position:absolute;inset:0;width:1280px;height:720px}
.g-moles .ml-field{position:absolute;inset:0}
.g-moles .ml-field.play{cursor:none}
.g-moles .ml-hole{position:absolute;width:260px;height:300px;margin:-230px 0 0 -130px;transform-origin:130px 230px;pointer-events:none}
.g-moles .ml-hole svg{position:absolute;left:0;top:0;width:260px;height:300px;overflow:visible}
.g-moles .ml-clip{position:absolute;left:0;top:-40px;width:260px;height:296px;overflow:hidden}
.g-moles .ml-mole{position:absolute;left:55px;bottom:0;width:150px;height:230px;transform:translateY(105%);transition:transform .26s cubic-bezier(.5,0,.75,0);pointer-events:auto;cursor:inherit}
.g-moles .ml-mole.up{transform:translateY(0);transition:transform .38s cubic-bezier(.3,1.5,.55,1)}
.g-moles .ml-mole.fast{transition-duration:.16s}
.g-moles .ml-mole svg{position:absolute;left:0;top:0;width:150px;height:230px}
.g-moles .ml-body{transform-origin:75px 230px}
.g-moles .ml-mole.bonk .ml-body{animation:ml-squash .35s ease-out}
@keyframes ml-squash{0%{transform:scale(1.18,.72)}50%{transform:scale(.94,1.06)}100%{transform:scale(1,1)}}
.g-moles .ml-mole .e-x,.g-moles .ml-mole .e-happy{display:none}
.g-moles .ml-mole.dizzy .e-open,.g-moles .ml-mole.happy .e-open{display:none}
.g-moles .ml-mole.dizzy .e-x{display:inline}
.g-moles .ml-mole.happy .e-happy{display:inline}
.g-moles .ml-sign{position:absolute;left:14px;top:110px;width:122px;height:74px;box-sizing:border-box;border-radius:14px;background:linear-gradient(180deg,#FFFDF8,#F4ECDF);border:2px solid #D9CCE6;box-shadow:0 6px 12px rgba(40,30,60,.25),0 -2px 0 rgba(0,0,0,.05) inset;display:flex;flex-direction:column;align-items:center;justify-content:center;line-height:1}
.g-moles .ml-sign b{font:900 40px Nunito,var(--sans);color:var(--ink)}
.g-moles .ml-sign i{display:none}
.g-moles .ml-mole.dizzy .ml-sign{border-color:#E3A2BA}
.g-moles .ml-mole.happy .ml-sign{border-color:#7ED3C3;background:linear-gradient(180deg,#F4FFFC,#DDF5EF)}
.g-moles .ml-paws{position:absolute;left:0;top:0;pointer-events:none}
.g-moles .ml-dz{position:absolute;left:35px;top:14px;width:80px;height:26px;display:none;animation:ml-spin 1s linear infinite}
.g-moles .ml-mole.dizzy .ml-dz{display:block}
@keyframes ml-spin{to{transform:rotate(360deg)}}
.g-moles .ml-hammer{position:absolute;left:0;top:0;width:140px;height:140px;pointer-events:none;transform-origin:70px 130px;z-index:5;display:none;filter:drop-shadow(0 8px 6px rgba(20,30,40,.3))}
.g-moles .ml-field.play .ml-hammer.on{display:block}
.g-moles .ml-fx{position:absolute;left:0;top:0;pointer-events:none;z-index:4}
.g-moles .ml-float{position:absolute;pointer-events:none;z-index:6;font:800 32px var(--sans);color:var(--vio-2);text-shadow:0 2px 0 #fff,0 0 12px rgba(255,255,255,.9);white-space:nowrap;transform:translate(-50%,-50%)}
.g-moles .ml-float.sm{font:700 20px var(--sans);color:var(--ink-3)}
.g-moles .ml-float.sm em{font:italic 700 22px var(--serif)}
.g-moles .ml-float.sm span{font-family:var(--han)}
.g-moles .ml-hud{position:absolute;left:0;right:0;top:0;display:flex;justify-content:space-between;align-items:flex-start;padding:20px 26px;box-sizing:border-box;pointer-events:none;z-index:7;transition:opacity .4s,transform .5s var(--ease-out)}
.g-moles .ml-hud.off{opacity:0;transform:translateY(-30px)}
.g-moles .ml-card{background:rgba(255,255,255,.82);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,.95);box-shadow:0 10px 28px rgba(30,60,60,.16);border-radius:22px}
.g-moles .ml-score{padding:12px 22px;min-width:150px}
.g-moles .ml-score small,.g-moles .ml-tl{display:block;font:700 12px var(--sans);letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}
.g-moles .ml-score b{display:block;font:700 38px/1.05 var(--serif);color:var(--vio-2);font-variant-numeric:tabular-nums}
.g-moles .ml-task{display:flex;align-items:center;gap:18px;padding:14px 16px 14px 24px;pointer-events:auto}
.g-moles .ml-task p{margin:4px 0 0;font:600 19px var(--sans);color:var(--ink)}
.g-moles .ml-wave{display:flex;gap:4px;align-items:center;height:30px}
.g-moles .ml-wave i{width:5px;height:8px;border-radius:3px;background:var(--vio);opacity:.35}
.g-moles .ml-task.talk .ml-wave i{opacity:1;animation:ml-eq .5s ease-in-out infinite alternate}
.g-moles .ml-wave i:nth-child(2){animation-delay:-.15s!important}.g-moles .ml-wave i:nth-child(3){animation-delay:-.3s!important}.g-moles .ml-wave i:nth-child(4){animation-delay:-.4s!important}
@keyframes ml-eq{from{height:6px}to{height:28px}}
.g-moles .ml-rep{display:flex;align-items:center;gap:9px;border:0;cursor:pointer;background:var(--vio);color:#fff;font:700 15px var(--sans);padding:12px 18px 12px 14px;border-radius:16px;box-shadow:0 6px 16px rgba(78,76,142,.35);transition:transform .15s,background .2s}
.g-moles .ml-rep:hover{background:var(--vio-2);transform:translateY(-1px)}
.g-moles .ml-rep:active{transform:scale(.96)}
.g-moles .ml-rep svg{width:22px;height:22px}
.g-moles .ml-timer{position:relative;width:96px;height:96px;border-radius:50%;display:grid;place-items:center}
.g-moles .ml-timer svg{position:absolute;inset:6px;width:84px;height:84px;transform:rotate(-90deg)}
.g-moles .ml-timer .trk{fill:none;stroke:rgba(78,76,142,.13);stroke-width:7}
.g-moles .ml-timer .val{fill:none;stroke:url(#ml-grad);stroke-width:7;stroke-linecap:round}
.g-moles .ml-timer b{font:700 30px var(--serif);color:var(--vio-2);font-variant-numeric:tabular-nums}
.g-moles .ml-timer.hot b{color:var(--rose)}
.g-moles .ml-timer.hot{animation:ml-pulse 1s infinite}
@keyframes ml-pulse{50%{transform:scale(1.06)}}
.g-moles .ml-screen{position:absolute;inset:0;z-index:8;display:grid;place-items:center;background:radial-gradient(ellipse at center,rgba(250,245,234,.5),rgba(60,90,90,.22));transition:opacity .45s,visibility .45s}
.g-moles .ml-screen.hide{opacity:0;visibility:hidden}
.g-moles .ml-panel{background:rgba(255,255,255,.88);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-radius:32px;box-shadow:0 30px 80px rgba(20,50,60,.25),0 1px 0 #fff inset;text-align:center;padding:44px 64px 42px;max-width:660px;animation:ml-in .7s var(--ease-out)}
@keyframes ml-in{from{opacity:0;transform:translateY(24px) scale(.96)}}
.g-moles .ml-kicker{font:700 13px var(--sans);letter-spacing:.2em;text-transform:uppercase;color:var(--jade)}
.g-moles h2{font:700 64px/1.05 var(--serif);color:var(--ink);margin:10px 0 14px}
.g-moles .ml-rule{font:500 20px/1.45 var(--sans);color:var(--ink-3);margin:0 0 18px}
.g-moles .ml-tones{display:flex;justify-content:center;gap:10px;margin:0 0 28px}
.g-moles .ml-tones span{font:italic 700 24px var(--serif);padding:6px 14px;border-radius:12px;background:#fff;box-shadow:0 2px 8px rgba(30,40,80,.1)}
.g-moles .ml-go{border:0;cursor:pointer;font:800 22px var(--sans);color:#fff;padding:18px 58px;border-radius:99px;background:linear-gradient(135deg,#2E9C8E,#3E86B8 50%,#6A4FB3);box-shadow:0 14px 30px rgba(46,120,140,.38),0 -3px 0 rgba(0,0,0,.12) inset;transition:transform .2s cubic-bezier(.3,1.6,.5,1),box-shadow .2s}
.g-moles .ml-go:hover{transform:translateY(-3px) scale(1.03)}
.g-moles .ml-go:active{transform:scale(.97)}
.g-moles .ml-end .ml-panel{max-width:none;width:1060px;text-align:left;padding:36px 44px 34px}
.g-moles .ml-top{display:flex;align-items:flex-end;justify-content:space-between;gap:30px;margin-bottom:22px}
.g-moles .ml-big{font:700 84px/1 var(--serif);color:var(--vio-2);font-variant-numeric:tabular-nums;margin-top:6px}
.g-moles .ml-praise{font:600 19px/1.4 var(--sans);color:var(--ink-3);margin:0;max-width:540px}
.g-moles .ml-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
.g-moles .ml-tc{background:#fff;border-radius:18px;padding:16px 18px 16px;box-shadow:0 3px 12px rgba(30,40,80,.08);border-top:5px solid var(--c)}
.g-moles .ml-tc h4{margin:0;display:flex;align-items:center;justify-content:space-between;font:700 17px var(--sans);color:var(--ink)}
.g-moles .ml-tc h4 svg{width:44px;height:24px}
.g-moles .ml-tc .ex{font:italic 700 17px var(--serif);color:var(--c);margin:4px 0 10px}
.g-moles .ml-tc .pc{font:700 40px/1 var(--serif);color:var(--c)}
.g-moles .ml-tc .bar{height:8px;border-radius:5px;background:#EEEAF4;margin:10px 0 8px;overflow:hidden}
.g-moles .ml-tc .bar i{display:block;height:100%;border-radius:5px;background:var(--c)}
.g-moles .ml-tc .n{font:600 14px var(--sans);color:var(--muted)}
.g-moles .ml-tc .cf{font:600 14px/1.4 var(--sans);color:var(--rose);margin-top:6px;min-height:20px}
.g-moles .ml-tc .cf.ok{color:var(--jade)}
.g-moles .ml-syl{display:flex;flex-wrap:wrap;gap:8px;margin:18px 0 22px}
.g-moles .ml-syl span{background:#F4F0FA;border-radius:10px;padding:5px 11px;font:500 14px var(--sans);color:var(--ink-3)}
.g-moles .ml-syl span b{font:500 17px var(--han);color:var(--ink);margin-right:5px}
.g-moles .ml-syl span em{font:italic 700 15px var(--serif);margin-right:5px}
.g-moles .ml-foot{display:flex;align-items:center;justify-content:space-between}
.g-moles .ml-foot small{font:600 15px var(--sans);color:var(--muted)}
`;
  const SPEAKER = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H3v6h3l5 4V5z" fill="currentColor"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/></svg>';
  const TONE_PATH = ['M4 7H40', 'M4 20L40 5', 'M4 8Q14 24 22 20T40 6', 'M4 5L40 20'];

  function moleSVG(){
    return `<svg viewBox="0 0 150 230"><defs>
      <linearGradient id="ml-fur" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#C3BCDD"/><stop offset=".55" stop-color="#9C95BF"/><stop offset="1" stop-color="#77709C"/></linearGradient>
      <radialGradient id="ml-muz" cx=".45" cy=".35" r=".7"><stop offset="0" stop-color="#FFF8F0"/><stop offset="1" stop-color="#EADDD2"/></radialGradient>
      <radialGradient id="ml-nose" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#FF9FC0"/><stop offset="1" stop-color="#C94878"/></radialGradient>
      <linearGradient id="ml-deep" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1A1216" stop-opacity="0"/><stop offset="1" stop-color="#1A1216" stop-opacity=".85"/></linearGradient></defs>
      <g class="ml-body">
      <path d="M16 230 C14 112 26 30 75 28 C124 30 136 112 134 230 Z" fill="url(#ml-fur)"/>
      <path d="M36 64 C42 42 58 34 75 33" stroke="rgba(255,255,255,.35)" stroke-width="6" fill="none" stroke-linecap="round"/>
      <ellipse cx="44" cy="40" rx="11" ry="9" fill="#8C85B0"/><ellipse cx="44" cy="41" rx="6" ry="5" fill="#E9B8CC"/>
      <ellipse cx="106" cy="40" rx="11" ry="9" fill="#8C85B0"/><ellipse cx="106" cy="41" rx="6" ry="5" fill="#E9B8CC"/>
      <path d="M16 230 C14 112 26 30 75 28 C124 30 136 112 134 230 Z" fill="none" stroke="rgba(60,50,90,.25)" stroke-width="2"/>
      <ellipse cx="45" cy="90" rx="10" ry="6" fill="#F3A5C2" opacity=".55"/><ellipse cx="105" cy="90" rx="10" ry="6" fill="#F3A5C2" opacity=".55"/>
      <g class="e-open"><ellipse cx="56" cy="66" rx="6.5" ry="8" fill="#1E1B2E"/><ellipse cx="94" cy="66" rx="6.5" ry="8" fill="#1E1B2E"/><circle cx="58.5" cy="63" r="2.6" fill="#fff"/><circle cx="96.5" cy="63" r="2.6" fill="#fff"/><circle cx="54" cy="69" r="1.2" fill="#fff"/><circle cx="92" cy="69" r="1.2" fill="#fff"/></g>
      <g class="e-x" stroke="#1E1B2E" stroke-width="3.4" stroke-linecap="round"><path d="M50 60l12 12M62 60 50 72M88 60l12 12M100 60 88 72"/></g>
      <g class="e-happy" stroke="#1E1B2E" stroke-width="3.6" stroke-linecap="round" fill="none"><path d="M49 69q7-10 14 0M87 69q7-10 14 0"/></g>
      <ellipse cx="75" cy="94" rx="30" ry="21" fill="url(#ml-muz)"/>
      <path d="M52 92 30 88M52 97 31 99M98 92l22-4M98 97l21 2" stroke="rgba(60,50,90,.35)" stroke-width="1.4" stroke-linecap="round"/>
      <ellipse cx="75" cy="83" rx="12" ry="8.5" fill="url(#ml-nose)"/><ellipse cx="71" cy="80" rx="3.5" ry="2" fill="#fff" opacity=".7"/>
      <path d="M66 99q9 7 18 0" stroke="#6B4A5E" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      <rect x="70" y="100" width="4.6" height="6" rx="1.4" fill="#fff" stroke="#D6CDE0" stroke-width=".8"/><rect x="75.4" y="100" width="4.6" height="6" rx="1.4" fill="#fff" stroke="#D6CDE0" stroke-width=".8"/>
      <rect x="10" y="176" width="130" height="56" fill="url(#ml-deep)"/>
      </g></svg>`;
  }
  const PAWS = `<svg class="ml-paws" viewBox="0 0 150 196" width="150" height="196" style="height:196px"><g fill="#F2DCE6" stroke="#B89AB0" stroke-width="1.4">
    <ellipse cx="30" cy="114" rx="14" ry="10"/><ellipse cx="120" cy="114" rx="14" ry="10"/></g>
    <g stroke="#B89AB0" stroke-width="1.3" stroke-linecap="round"><path d="M24 110v7M30 109v8M36 110v7M114 110v7M120 109v8M126 110v7"/></g></svg>`;
  const DIZZY = `<svg class="ml-dz" viewBox="0 0 80 26"><g fill="#B9A6F0" stroke="#fff" stroke-width="1"><path d="M8 13l2.5-6 2.5 6-6-2.5h7z"/><path d="M40 4l2.5 6 6 .5-4.6 4 1.4 6-5.3-3.3-5.3 3.3 1.4-6-4.6-4 6-.5z"/><path d="M70 13l2.5-6 2.5 6-6-2.5h7z"/></g></svg>`;
  const HOLE_BACK = `<svg viewBox="0 0 260 300"><defs>
    <radialGradient id="ml-mound" cx=".5" cy=".3" r=".75"><stop offset="0" stop-color="#B49B90"/><stop offset=".7" stop-color="#8C7268"/><stop offset="1" stop-color="#6E5750"/></radialGradient>
    <radialGradient id="ml-pit" cx=".5" cy=".62" r=".6"><stop offset="0" stop-color="#1A1216"/><stop offset=".75" stop-color="#2E2126"/><stop offset="1" stop-color="#4A3438"/></radialGradient></defs>
    <ellipse cx="130" cy="246" rx="132" ry="42" fill="rgba(30,70,50,.22)"/>
    <ellipse cx="130" cy="232" rx="124" ry="46" fill="url(#ml-mound)"/>
    <ellipse cx="130" cy="228" rx="92" ry="30" fill="url(#ml-pit)"/>
    <path d="M40 222 Q130 186 220 222" stroke="rgba(0,0,0,.28)" stroke-width="5" fill="none"/></svg>`;
  const HOLE_FRONT = `<svg viewBox="0 0 260 300"><defs>
    <linearGradient id="ml-lip" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A68D82"/><stop offset="1" stop-color="#6E5750"/></linearGradient></defs>
    <path d="M6 232 A124 46 0 0 0 254 232 L222 228 A92 30 0 0 1 38 228 Z" fill="url(#ml-lip)"/>
    <path d="M38 229 A92 30 0 0 0 222 229" stroke="rgba(255,255,255,.28)" stroke-width="2.5" fill="none"/>
    <g fill="#5DB585"><path d="M14 246c2-14 6-20 10-24-1 8 0 14 2 22zM24 250c0-12 4-18 9-21-2 8-2 14-1 21zM232 248c-1-12-5-19-9-23 1 8 0 15-2 23zM242 244c1-11 4-17 8-20-1 7-1 13 0 20z"/></g>
    <g fill="#79C99B"><path d="M120 280c1-9 3-13 6-16-1 6-1 11 0 16zM131 281c0-8 2-12 5-14-1 5-1 9-1 14z"/></g></svg>`;

  KAT.register({
    id: 'moles7',
    title: 'Бей крота: инициали',
    kind: 'Реакция',
    text: 'Голос называет слог — ударь молотком крота с тем же тоном. В конце видно, какие тоны путаются.',
    where: ['урок', 'домашка'],
    topic: 'Фонетика · четыре тона',
    css,
    audio: FAMS.flatMap(f => FAM[f].map(x => x[0])),
    mount(stage, K){
      const root = document.createElement('div');
      root.style.cssText = 'position:absolute;inset:0;outline:none';
      root.tabIndex = -1;
      // фон
      let flowers = '';
      const busy = (x, y) => HOLES.some(h => Math.abs(h.x - x) < 150 * h.s && Math.abs(h.y - y) < 70 * h.s) || (y < 240);
      for (let i = 0; i < 70; i++) {
        const x = Math.random() * 1280, y = 225 + Math.random() * 490; if (busy(x, y)) continue;
        const c = ['#FFFFFF', '#E9DDFB', '#F7C6D9', '#CFE7FA'][i % 4], r = 3 + Math.random() * 2.5 * (y / 720);
        flowers += `<g transform="translate(${x.toFixed(0)} ${y.toFixed(0)})">${[0, 72, 144, 216, 288].map(a => `<circle cx="${(Math.cos(a / 57.3) * r).toFixed(1)}" cy="${(Math.sin(a / 57.3) * r).toFixed(1)}" r="${(r * .75).toFixed(1)}" fill="${c}"/>`).join('')}<circle r="${(r * .55).toFixed(1)}" fill="#C9A4E8"/></g>`;
      }
      let tufts = '';
      for (let i = 0; i < 90; i++) {
        const x = Math.random() * 1280, y = 230 + Math.random() * 490; if (busy(x, y)) continue;
        const k = .6 + y / 720;
        tufts += `<path transform="translate(${x.toFixed(0)} ${y.toFixed(0)}) scale(${k.toFixed(2)})" d="M-6 0c1-7 2-11 5-14-1 5-1 9 0 14zM0 0c0-9 2-14 5-17-1 6-1 11-1 17zM5 0c1-6 3-9 6-11-2 4-2 7-2 11z" fill="${i % 3 ? '#62B98A' : '#86CFA2'}"/>`;
      }
      root.innerHTML = `
        <svg class="ml-bg" viewBox="0 0 1280 720" preserveAspectRatio="none"><defs>
          <linearGradient id="ml-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#AFD8F4"/><stop offset="1" stop-color="#E8F3FB"/></linearGradient>
          <linearGradient id="ml-lawn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A6DEB6"/><stop offset="1" stop-color="#72C497"/></linearGradient>
          <pattern id="ml-stripe" width="160" height="720" patternUnits="userSpaceOnUse" patternTransform="skewX(-18)"><rect width="80" height="720" fill="rgba(255,255,255,.09)"/></pattern></defs>
          <rect width="1280" height="260" fill="url(#ml-sky)"/>
          <g fill="#fff" opacity=".85"><ellipse cx="200" cy="80" rx="70" ry="20"/><ellipse cx="240" cy="68" rx="44" ry="24"/><ellipse cx="990" cy="110" rx="80" ry="18"/><ellipse cx="1030" cy="98" rx="46" ry="22"/><ellipse cx="640" cy="50" rx="50" ry="13"/></g>
          <path d="M0 214 C160 170 300 180 460 200 S760 168 940 190 S1180 178 1280 196 V260 H0Z" fill="#C7C4EC"/>
          <path d="M0 228 C200 204 380 214 560 222 S900 200 1080 214 S1240 210 1280 216 V260 H0Z" fill="#B3B0E0"/>
          <g fill="#A993D8">${Array.from({length: 26}, (_, i) => `<circle cx="${i * 52 + (i % 2) * 14}" cy="${236 + (i % 3) * 3}" r="${22 + (i * 7) % 10}"/>`).join('')}</g>
          <g fill="#C7B5EC" opacity=".8">${Array.from({length: 26}, (_, i) => `<circle cx="${i * 52 + 20}" cy="${230 + (i % 2) * 4}" r="${9 + (i * 5) % 6}"/>`).join('')}</g>
          <rect y="240" width="1280" height="480" fill="url(#ml-lawn)"/>
          <rect y="240" width="1280" height="480" fill="url(#ml-stripe)"/>
          <rect y="240" width="1280" height="16" fill="rgba(40,90,70,.12)"/>
          ${tufts}${flowers}
        </svg>
        <div class="ml-field">
          ${HOLES.map((h, i) => `<div class="ml-hole" data-i="${i}" style="left:${h.x}px;top:${h.y}px;transform:scale(${h.s})">${HOLE_BACK}<div class="ml-clip"><div class="ml-mole" data-i="${i}">${moleSVG()}<div class="ml-sign"><b></b><i></i></div>${PAWS}${DIZZY}</div></div>${HOLE_FRONT}</div>`).join('')}
          <div class="ml-fx"></div>
          <svg class="ml-hammer" viewBox="0 0 140 140"><defs>
            <linearGradient id="ml-wood" x1="0" x2="1"><stop offset="0" stop-color="#C9B08E"/><stop offset=".5" stop-color="#EAD9BD"/><stop offset="1" stop-color="#B39873"/></linearGradient>
            <linearGradient id="ml-head" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E86A98"/><stop offset=".5" stop-color="#C23A6E"/><stop offset="1" stop-color="#8E2350"/></linearGradient>
            <linearGradient id="ml-band" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F4F5FA"/><stop offset=".5" stop-color="#B9BDCC"/><stop offset="1" stop-color="#7F8497"/></linearGradient></defs>
            <rect x="63" y="52" width="14" height="84" rx="6" fill="url(#ml-wood)" stroke="#8F7656" stroke-width="1.2"/>
            <rect x="62" y="112" width="16" height="22" rx="6" fill="#6A4FB3"/>
            <rect x="18" y="16" width="104" height="44" rx="16" fill="url(#ml-head)" stroke="#6E1A3E" stroke-width="1.5"/>
            <rect x="18" y="16" width="16" height="44" rx="7" fill="url(#ml-band)"/><rect x="106" y="16" width="16" height="44" rx="7" fill="url(#ml-band)"/>
            <rect x="38" y="21" width="62" height="7" rx="3.5" fill="rgba(255,255,255,.35)"/></svg>
        </div>
        <div class="ml-hud off">
          <div class="ml-card ml-score"><small>Счёт</small><b>0</b></div>
          <div class="ml-card ml-task"><div class="ml-wave"><i></i><i></i><i></i><i></i></div><div><span class="ml-tl">Слушай слог</span><p>Ударь крота с этим слогом</p></div><button class="ml-rep" type="button">${SPEAKER}Ещё раз</button></div>
          <div class="ml-card ml-timer"><svg viewBox="0 0 84 84"><defs><linearGradient id="ml-grad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2E9C8E"/><stop offset="1" stop-color="#6A4FB3"/></linearGradient></defs><circle class="trk" cx="42" cy="42" r="36"/><circle class="val" cx="42" cy="42" r="36"/></svg><b>45</b></div>
        </div>
        <div class="ml-screen ml-start"><div class="ml-panel">
          <div class="ml-kicker">Слух · инициали</div>
          <h2>Бей крота</h2>
          <p class="ml-rule">Слушай слог и бей молотком крота <b>с этим слогом</b>. Не перепутай пары: <b>b — p</b>, <b>z — c</b>, <b>zh — ch</b>, <b>s — sh</b>. Помни: <b>ci</b> = «цы», <b>chi</b> = «чшы» — без предыхания!</p>
          <div class="ml-tones"><span style="color:#3E86B8">zā</span><span style="color:#E2557F">cā 💨</span><span style="color:#3E86B8">zì</span><span style="color:#E2557F">cì «цы»</span></div>
          <button class="ml-go" type="button">Начать</button>
        </div></div>
        <div class="ml-screen ml-end hide"></div>`;
      stage.appendChild(root);
      const $ = s => root.querySelector(s);
      const field = $('.ml-field'), fx = $('.ml-fx'), hammer = $('.ml-hammer'), hud = $('.ml-hud');
      const moles = [...root.querySelectorAll('.ml-mole')];
      const scoreEl = $('.ml-score b'), taskEl = $('.ml-task'), timerEl = $('.ml-timer'), timerVal = $('.ml-timer .val'), timerTxt = $('.ml-timer b');
      const CIRC = 2 * Math.PI * 36; timerVal.style.strokeDasharray = CIRC;
      const startScr = $('.ml-start'), endScr = $('.ml-end');

      let state = 'start', raf = 0, last = 0, left = DUR, lastSec = 99, score = 0, combo = 0, elapsed = 0;
      let wave = null, waveT = 0, gapT = 0, demoT = 0, timers = [];
      let asked, right, conf, heard, missed = new Set(), lastPick = '', R1 = [0, 0], R2 = [0, 0];
      const later = (fn, ms) => { const id = setTimeout(fn, ms); timers.push(id); return id; };
      const occ = new Array(9).fill(null); // {fam, tone, wave}

      function showMole(i, fam, tone, w){
        const m = moles[i], d = FAM[fam][tone];
        m.className = 'ml-mole';
        m.querySelector('.ml-sign b').textContent = d[1];
        m.querySelector('.ml-sign i').textContent = '';
        occ[i] = {fam, tone, w, hit: false};
        void m.offsetWidth; m.classList.add('up');
      }
      function hideMole(i, fast){
        const m = moles[i]; m.classList.remove('up'); if (fast) m.classList.add('fast');
        occ[i] = null;
      }
      function speak(ch){
        taskEl.classList.add('talk');
        Promise.resolve(K.say(ch)).then(() => taskEl.classList.remove('talk'));
        later(() => taskEl.classList.remove('talk'), 1600);
      }
      function newWave(){
        const p = elapsed / DUR;
        const n = p < .3 ? 2 : p < .65 ? 3 : 4;
        let fam, tone, key;
        do {
          fam = K.pick(FAMS);
          const minA = Math.min(...asked);
          const cand = [0, 1, 2, 3].filter(t => asked[t] <= minA + 1);
          tone = K.pick(cand); key = fam + tone;
        } while (key === lastPick);
        lastPick = key;
        const mate = tone ^ 1; const tones = [tone, mate, ...K.shuffle([0, 1, 2, 3].filter(t => t !== tone && t !== mate)).slice(0, Math.max(0, n - 2))];
        const holes = K.shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8]).slice(0, n);
        wave = {fam, tone, done: false, id: Math.random()};
        asked[tone]++; heard.add(fam + tone); (ROW1(fam) ? R1 : R2)[0]++;
        const order = K.shuffle(tones);
        holes.forEach((h, k) => later(() => { if (wave && !wave.done && state === 'play') showMole(h, fam, order[k], wave.id); }, k * 120 + Math.random() * 80));
        later(() => { if (state === 'play') speak(FAM[fam][tone][0]); }, 180);
        waveT = 3.8 - p * .8 + (n - 2) * .3;
      }
      function endWave(gap){
        if (!wave) return;
        wave.done = true;
        occ.forEach((o, i) => { if (o && !o.hit) hideMole(i, false); });
        gapT = gap; wave = null;
      }
      function stars(x, y, col){
        const n = K.reduce ? 4 : 9;
        for (let i = 0; i < n; i++) {
          const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('width', 26); s.setAttribute('height', 26);
          s.style.cssText = `position:absolute;left:${x - 13}px;top:${y - 13}px`;
          s.innerHTML = `<path d="M12 2l2.9 6.3 6.9.7-5.2 4.6 1.5 6.8L12 17l-6.1 3.4 1.5-6.8L2.2 9l6.9-.7z" fill="${i % 3 ? col : '#FFFFFF'}" stroke="rgba(60,40,100,.25)" stroke-width="1"/>`;
          fx.appendChild(s);
          const a = i / n * Math.PI * 2 + Math.random() * .4, d = 70 + Math.random() * 60;
          const an = s.animate([
            {transform: 'translate(0,0) scale(.3) rotate(0deg)', opacity: 1},
            {transform: `translate(${Math.cos(a) * d}px,${Math.sin(a) * d - 20}px) scale(1) rotate(${Math.random() * 300}deg)`, opacity: 1, offset: .6},
            {transform: `translate(${Math.cos(a) * d * 1.15}px,${Math.sin(a) * d + 20}px) scale(.6) rotate(360deg)`, opacity: 0}
          ], {duration: 750, easing: 'cubic-bezier(.2,.8,.3,1)'});
          an.onfinish = () => s.remove();
        }
        const ring = document.createElement('div');
        ring.style.cssText = `position:absolute;left:${x - 50}px;top:${y - 50}px;width:100px;height:100px;border-radius:50%;border:5px solid ${col};box-sizing:border-box`;
        fx.appendChild(ring);
        ring.animate([{transform: 'scale(.3)', opacity: 1}, {transform: 'scale(1.5)', opacity: 0}], {duration: 450, easing: 'ease-out'}).onfinish = () => ring.remove();
      }
      function float(x, y, html, cls){
        const f = document.createElement('div'); f.className = 'ml-float' + (cls ? ' ' + cls : ''); f.innerHTML = html;
        f.style.left = x + 'px'; f.style.top = y + 'px'; field.appendChild(f);
        f.animate([{transform: 'translate(-50%,-50%) scale(.6)', opacity: 0}, {transform: 'translate(-50%,-80%) scale(1.05)', opacity: 1, offset: .2}, {transform: 'translate(-50%,-190%) scale(1)', opacity: 0}], {duration: 1200, easing: 'ease-out'}).onfinish = () => f.remove();
      }
      function whack(i){
        const o = occ[i];
        if (!o || o.hit || state !== 'play' || !wave || o.w !== wave.id) return;
        const m = moles[i], h = HOLES[i];
        const cx = h.x, cy = h.y - 120 * h.s;
        o.hit = true;
        m.classList.remove('bonk'); void m.offsetWidth; m.classList.add('bonk');
        const d = FAM[o.fam][o.tone];
        if (o.tone === wave.tone) {
          K.sfx('pop'); later(() => K.sfx('gem'), 70);
          m.classList.add('happy');
          right[o.tone]++; combo++; (ROW1(o.fam) ? R1 : R2)[1]++;
          const pts = 100 + 20 * Math.min(combo - 1, 5); score += pts; scoreEl.textContent = score.toLocaleString('ru-RU');
          stars(cx, cy, TONE_COL[o.tone]);
          float(cx, cy - 40, '+' + pts);
          float(cx, cy + 10, `<em>${d[1]}</em> — ${NOTE(d[1])}`, 'sm');
          later(() => hideMole(i, true), 380);
          endWave(.55);
        } else {
          K.sfx('no'); m.classList.add('dizzy'); combo = 0;
          conf[wave.tone][o.tone]++; missed.add(FAM[wave.fam][wave.tone][1]);
          float(cx, cy - 30, `это <em>${d[1]}</em> — ${NOTE(d[1])}`, 'sm');
          later(() => hideMole(i, false), 650);
        }
      }
      function swing(){
        hammer.getAnimations().forEach(a => a.cancel());
        hammer.animate([{transform: 'rotate(12deg)'}, {transform: 'rotate(-58deg)', offset: .35}, {transform: 'rotate(-50deg)', offset: .55}, {transform: 'rotate(12deg)'}], {duration: 260, easing: 'ease-out'});
      }
      function frame(now){
        raf = requestAnimationFrame(frame);
        const dt = Math.min(.05, (now - (last || now)) / 1000); last = now;
        if (state === 'play') {
          left -= dt; elapsed += dt;
          const sec = Math.ceil(Math.max(0, left));
          if (sec !== lastSec) { lastSec = sec; timerTxt.textContent = sec; if (sec <= 5 && sec > 0) K.sfx('tick'); timerEl.classList.toggle('hot', sec <= 10); }
          timerVal.style.strokeDashoffset = CIRC * (1 - Math.max(0, left) / DUR);
          if (wave) { waveT -= dt; if (waveT <= 0) { K.sfx('whoosh'); combo = 0; missed.add(FAM[wave.fam][wave.tone][1]); endWave(.45); } }
          else { gapT -= dt; if (gapT <= 0) newWave(); }
          if (left <= 0) finish();
        } else if (state === 'start') {
          demoT -= dt;
          if (demoT <= 0) {
            demoT = .9;
            const free = occ.map((o, i) => o ? -1 : i).filter(i => i >= 0 && i !== 4);
            if (free.length > 5) { const i = K.pick(free), f = K.pick(FAMS), tn = Math.floor(Math.random() * 4); showMole(i, f, tn, -1); later(() => hideMole(i), 1500 + Math.random() * 700); }
          }
        }
      }
      function start(){
        K.ac(); K.sfx('whoosh');
        timers.forEach(clearTimeout); timers = [];
        occ.forEach((o, i) => hideMole(i, true));
        state = 'play'; left = DUR; elapsed = 0; lastSec = 99; score = 0; combo = 0; wave = null; gapT = .7; lastPick = '';
        missed = new Set(); R1 = [0, 0]; R2 = [0, 0]; asked = [0, 0, 0, 0]; right = [0, 0, 0, 0]; conf = [0, 1, 2, 3].map(() => [0, 0, 0, 0]); heard = new Set();
        scoreEl.textContent = '0'; timerEl.classList.remove('hot');
        startScr.classList.add('hide'); endScr.classList.add('hide'); hud.classList.remove('off'); field.classList.add('play');
        root.focus({preventScroll: true});
      }
      const plural = (n, a, b, c) => { const m10 = n % 10, m100 = n % 100; return m10 === 1 && m100 !== 11 ? a : m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14) ? b : c; };
      const withTone = t => (t === 1 ? 'со ' : 'с ') + (t + 1) + '-м';
      function finish(){
        state = 'end'; if (wave) endWave(0); field.classList.remove('play'); hud.classList.add('off'); K.sfx('win');
        const [aA, aR] = R1, [nA, nR] = R2;
        const totalA = aA + nA, totalR = aR + nR, acc = totalA ? Math.round(totalR / totalA * 100) : 0;
        const missList = [...missed];
        if (KAT.onResult) KAT.onResult('moles', {right: totalR, of: totalA, score, miss: missList});
        const card = (title, ex, a, r, col) => { const pc = a ? Math.round(r / a * 100) : null; return `<div class="ml-tc" style="--c:${col}"><h4>${title}</h4><div class="ex">${ex}</div><div class="pc">${pc === null ? '—' : pc + '&nbsp;%'}</div><div class="bar"><i style="width:${pc || 0}%"></i></div><div class="n">${a ? `верно ${r} из ${a}` : 'в этом раунде не было'}</div></div>`; };
        const praise = !totalA ? 'Попробуй ещё раз!' : acc >= 85 ? 'Отличный слух! Обе строчки инициалей слышишь уверенно.' : acc >= 60 ? 'Хорошо! Послушай ещё раз пары z — c, zh — ch, s — sh.' : 'Это непросто! Помни: c и ch — с выдохом 💨, а ci и chi — без. sh, zh, ch — язык загнут.';
        const syl = FAMS.flatMap(f => FAM[f].map((d, t) => heard.has(f + t) ? `<span><em>${d[1]}</em></span>` : '')).join('');
        endScr.innerHTML = `<div class="ml-panel">
          <div class="ml-top"><div><div class="ml-kicker">Раунд окончен</div><div class="ml-big">${score.toLocaleString('ru-RU')}</div></div><p class="ml-praise">${praise}</p></div>
          <div class="ml-grid" style="grid-template-columns:1fr 1fr">${card('1️⃣ Первая строчка', 'b p · d t · g k', aA, aR, '#3E86B8')}${card('2️⃣ Вторая строчка', 'z c s · zh ch sh', nA, nR, '#E2557F')}</div>
          ${missList.length ? `<p class="ml-praise" style="margin-top:14px">Можно повторить для закрепления: <b>${missList.join(', ')}</b></p>` : ''}
          <div class="ml-syl">${syl}</div>
          <div class="ml-foot"><small>Точность: ${acc}&nbsp;% · верных ударов: ${totalR} из ${totalA}</small><button class="ml-go" type="button">Ещё раз</button></div></div>`;
        endScr.querySelector('.ml-go').onclick = start;
        later(() => endScr.classList.remove('hide'), 500);
      }
      $('.ml-go').onclick = start;
      $('.ml-rep').onclick = () => { if (wave) speak(FAM[wave.fam][wave.tone][0]); };

      const pos = e => K.toXY(stage, e);
      field.addEventListener('pointermove', e => {
        const [x, y] = pos(e); hammer.classList.add('on');
        hammer.style.left = (x + 104 - 70) + 'px'; hammer.style.top = (y + 12 - 130) + 'px';
      });
      field.addEventListener('pointerleave', () => hammer.classList.remove('on'));
      field.addEventListener('pointerdown', e => {
        if (state !== 'play') return;
        const [x, y] = pos(e); hammer.classList.add('on');
        hammer.style.left = (x + 104 - 70) + 'px'; hammer.style.top = (y + 12 - 130) + 'px';
        swing();
        const m = e.target.closest && e.target.closest('.ml-mole');
        if (m && m.classList.contains('up')) whack(+m.dataset.i); else K.sfx('step');
      });

      raf = requestAnimationFrame(frame);
      return {
        destroy(){ state = 'dead'; cancelAnimationFrame(raf); timers.forEach(clearTimeout); K.stopVoice && K.stopVoice(); root.remove(); },
        _dbg: () => ({state, wave, occ})
      };
    }
  });
})();