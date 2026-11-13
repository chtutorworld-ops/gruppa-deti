/* Ядро каталога: голос, звуки, картинки, реестр игр. */
(function(){
  const K = window.KAT = window.KAT || {};
  K.AUDIO = K.AUDIO || {};   // 'текст' или 'голос:текст' -> data:audio/mpeg;base64,...
  K.IMG = K.IMG || {};       // имя -> data:image/webp;base64,...
  K.GAMES = K.GAMES || [];
  K.TTS_FALLBACK = K.TTS_FALLBACK || '';   // в тестовой обвязке — адрес сервера голоса
  K.reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let AC = null;
  K.ac = () => { if (!AC) AC = new (window.AudioContext || window.webkitAudioContext)(); if (AC.state === 'suspended') AC.resume(); return AC; };
  K.img = name => K.IMG[name] || '';
  // ДЗ 6: голос берём из озвучки сайта (window.KSAY), звуки заранее загружены — без паузы
  K.say = (text) => window.KSAY ? window.KSAY(text) : Promise.resolve();
  K.stopVoice = () => { if (window.KSTOP) window.KSTOP(); };

  /* ---- синтезированные звуки ---- */
  function env(g, t, a, d, peak = .3){ g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + a + d); }
  function tone(type, f1, f2, dur, peak = .25, delay = 0){
    const c = K.ac(), t = c.currentTime + delay, o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.setValueAtTime(f1, t); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + dur);
    env(g, t, .005, dur, peak); o.connect(g).connect(K.master()); o.start(t); o.stop(t + dur + .05);
  }
  function noise(dur, filt = 'lowpass', f1 = 2000, f2 = 400, peak = .3, delay = 0){
    const c = K.ac(), t = c.currentTime + delay, n = Math.floor(c.sampleRate * dur), b = c.createBuffer(1, n, c.sampleRate), d = b.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    const s = c.createBufferSource(); s.buffer = b; const f = c.createBiquadFilter(); f.type = filt; f.frequency.setValueAtTime(f1, t); f.frequency.exponentialRampToValueAtTime(f2, t + dur);
    const g = c.createGain(); env(g, t, .004, dur, peak); s.connect(f).connect(g).connect(K.master()); s.start(t); s.stop(t + dur + .05);
  }
  let M = null;
  K.volume = .8;
  K.master = () => { const c = K.ac(); if (!M) { M = c.createGain(); M.gain.value = K.volume; M.connect(c.destination); } return M; };
  const SFX = {
    pop:   () => { noise(.12, 'bandpass', 1800, 600, .5); tone('sine', 700, 180, .1, .25); },
    laser: () => tone('square', 1400, 180, .16, .12),
    boom:  () => { noise(.55, 'lowpass', 1200, 80, .6); tone('sine', 120, 40, .4, .35); },
    coin:  () => { tone('square', 988, 0, .08, .12); tone('square', 1319, 0, .25, .12, .08); },
    ok:    () => { tone('triangle', 523, 0, .12, .25); tone('triangle', 659, 0, .12, .25, .09); tone('triangle', 784, 0, .25, .25, .18); },
    no:    () => { tone('sawtooth', 220, 180, .18, .12); tone('sawtooth', 180, 140, .25, .12, .16); },
    win:   () => { [523, 659, 784, 1047].forEach((f, i) => tone('triangle', f, 0, .22, .25, i * .11)); tone('triangle', 1319, 0, .5, .2, .48); },
    whoosh:() => noise(.35, 'bandpass', 400, 3000, .25),
    click: () => tone('square', 1800, 900, .03, .08),
    tick:  () => tone('sine', 1500, 0, .03, .12),
    bell:  () => { tone('sine', 1760, 0, .9, .2); tone('sine', 2640, 0, .6, .08); },
    paper: () => noise(.28, 'highpass', 1500, 5000, .18),
    chew:  () => { noise(.07, 'bandpass', 900, 500, .3); noise(.07, 'bandpass', 800, 450, .25, .12); },
    pour:  () => noise(.9, 'bandpass', 900, 1400, .12),
    cash:  () => { tone('sine', 2093, 0, .5, .18); tone('sine', 2637, 0, .6, .12, .05); noise(.25, 'highpass', 4000, 8000, .12, .1); },
    step:  () => noise(.06, 'lowpass', 600, 200, .25),
    zap:   () => tone('sawtooth', 600, 1800, .12, .1),
    gem:   () => { tone('sine', 1047, 1568, .15, .2); tone('sine', 1568, 2093, .2, .15, .08); },
  };
  K.sfx = name => { try { (SFX[name] || SFX.click)(); } catch (e) {} };
  K.register = g => { K.GAMES.push(g); };
  // координаты указателя на сцене 1280×720 (сцена может быть повёрнута на телефоне)
  K.toXY = (stage, e) => { const q = stage._rot; if (q) return [(e.clientY - q.ty) / q.k, (q.tx - e.clientX) / q.k]; const r = stage.getBoundingClientRect(); return [(e.clientX - r.left) * 1280 / r.width, (e.clientY - r.top) * 720 / r.height]; };
  K.game = id => K.GAMES.find(g => g.id === id);
  // черты иероглифов: из данных Hanzi Writer, которые вшиты в страницу
  K.HZ = K.HZ || {};
  if (window.HZDATA) for (const c in window.HZDATA) { const d = window.HZDATA[c]; K.HZ[c] = {s: d.strokes, m: d.medians, r: d.radStrokes || []}; }
  // вспомогательные
  K.shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  K.pick = a => a[Math.floor(Math.random() * a.length)];
})();