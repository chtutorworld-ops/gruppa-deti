/* ===================== ДЗ 8 · самое сложное за все уроки ===================== */
// Урок 8: в классе дошли до раздела 4 (разминка + крот, оба диктанта, z c s zh ch sh, порядок черт). Местоимения НЕ проходили.
// Иероглифы в заданиях — только 你 我 好 叫 妈 爸 (кроме задания «первая черта», где новый иероглиф — суть упражнения, как на уроке).
// Задания — нумерованный список (не станции!). Те же номера — в кабинете учителя.
const TASKS=[null,
 {t:'🔨 Крот: тоны',d:'Игра как на уроке: бей слог нужного тона',run:krot},
 {t:'🎵 Диктант на тоны',d:'Слушай слог и нажми значок тона',run:dict2},
 {t:'📝 Диктант: пиши слоги',d:'Напиши слог латиницей и поставь значок тона',run:dict3},
 {t:'✍️ Порядок черт',d:'Какую черту пишут первой? Как на уроке',run:strokes},
 {t:'👂 Слух: b–p, d–t, g–k',d:'Предыхательный или нет?',run:ears},
 {t:'⚠️ ci = «цы», chi = «чшы»',d:'z c s zh ch sh: где предыхание исчезает',run:cichi},
 {t:'👀 Узнай иероглиф',d:'你 我 好 叫 妈 爸 — и перевод фраз',run:know},
 {t:'🔑 Смысл и чтение',d:'Ключ — смысл, другая часть — чтение',run:keys},
 {t:'🥷 Иероглифный ниндзя',d:'Игра: руби только нужные иероглифы',run:ninja},
 {t:'📝 Диктант иероглифов',d:'Слушай и пиши иероглиф по памяти',run:dict}];
const NT=TASKS.length-1;
let DONE={};try{DONE=JSON.parse(localStorage.getItem('zh-dz8-done')||'{}')}catch(e){}
const keep=()=>{try{localStorage.setItem('zh-dz8-done',JSON.stringify(DONE))}catch(e){}};
const HW='dz8';
const API=/workers\.dev$/.test(location.hostname)?'/api/dz/':'https://gruppa-deti.ch-tutor-world.workers.dev/api/dz/';
let S={};try{S=JSON.parse(localStorage.getItem('zh-dz8')||'{}')}catch(e){}
const keepS=()=>{try{localStorage.setItem('zh-dz8',JSON.stringify(S))}catch(e){}};S.queue=S.queue||[];
const isTest=()=>/^(учитель|учительница|teacher|тест)$/i.test((S.name||'').trim());
function send(part,data){S.queue=S.queue.filter(q=>q.part!==part);S.queue.push({part,data:Object.assign({},data,{ts:Date.now()})});keepS();flush();}
async function flush(){if(isTest()){S.queue=[];keepS();return;}if(!S.sid||!S.queue.length)return;const q=S.queue[0];
 try{const r=await fetch(API+'save',{method:'POST',headers:{'Content-Type':'text/plain'},body:JSON.stringify({hw:HW,sid:S.sid,name:S.name,part:q.part,data:q.data})});
  if(!r.ok)throw 0;S.queue.shift();keepS();if(S.queue.length)flush();}catch(e){clearTimeout(flush._t);flush._t=setTimeout(flush,15000);}}
addEventListener('online',flush);
function finish(n,ok,of,extra){const prev=DONE[n];const best=prev?Math.max(ok,+String(prev).split('/')[0]||0):ok;DONE[n]=best+'/'+of;keep();send('t'+n,Object.assign({score:ok,of,best},extra||{}));}
const TOP='Домашнее задание 8';
const NAMEQ=new URLSearchParams(location.search).get('name');
function login(){$('#app').innerHTML=`<div class="top n"><span class="zh">作业</span><div><h1>${TOP}</h1><small>Сначала напиши своё имя</small></div></div>
 <div class="main n" style="text-align:center"><h2>Как тебя зовут?</h2><p class="lead">Имя и первая буква фамилии, например <b>Маша П.</b> — как всегда. Так учитель увидит твои результаты.</p>
 <input id="nm" class="in" style="width:100%;font:inherit;font-size:20px;padding:14px 18px;border:0;outline:none;margin-top:16px;color:var(--ink)" placeholder="Имя и буква фамилии" maxlength="40" value="${esc(NAMEQ||S.name||'')}">
 <div class="row" style="justify-content:center"><button class="btn" id="go">Начать →</button></div></div>`;
 const go=()=>{const v=$('#nm').value.trim();if(v.length<2){toast('Напиши имя');return;}S.name=v;S.sid=S.sid||(Date.now().toString(36)+Math.random().toString(36).slice(2,8));keepS();flush();location.hash='';route();};
 $('#go').onclick=go;$('#nm').onkeydown=e=>{if(e.key==='Enter')go();};}
const nDone=()=>Object.keys(DONE).filter(k=>TASKS[+k]).length;
const pbar=()=>{const d=nDone(),pc=Math.round(d*100/NT);return `<div class="pbar n" id="pbar"><div class="pbt"><span>Выполнено <b>${d}</b> из ${NT}</span><b>${pc}%</b></div><div class="pbl"><i style="width:${pc}%"></i></div></div>`;};
const shell=(h)=>{stopAll();$('#app').innerHTML=`<div class="top n"><span class="zh">作业</span><div><h1>${TOP}</h1><small>${isTest()?'🧑‍🏫 режим учителя — результаты не сохраняются':'Самое сложное за все уроки'}</small></div><button class="back n" style="margin:0 0 0 auto;font-size:13px" id="me">${esc(S.name||'')} ✎</button></div>${pbar()}<div class="main n">${h}</div>`;
 $('#me').onclick=()=>login();scrollTo(0,0);};
const backBtn='<button class="back n" onclick="location.hash=\'\'">‹ Все задания</button>';
const tag=n=>`<span class="tag">Задание № ${n}</span>`;
let TM=[];const later=(f,ms)=>{const t=setTimeout(f,ms);TM.push(t);return t;};
let KCUR=null,RAF=0;
function stopAll(){if(KCUR){try{KCUR.destroy()}catch(e){}KCUR=null;}TM.forEach(clearTimeout);TM=[];cancelAnimationFrame(RAF);try{curA&&curA.pause()}catch(e){}}
const left=()=>TASKS.map((x,i)=>x&&!DONE[i]?i:0).filter(Boolean);
const leftBox=()=>{const L=left();if(!L.length)return `<div class="allok">🏆 Все ${NT} заданий сделаны! Ты супер!</div>`;
 return `<div class="left"><h3>⏳ Ещё не доделано (${L.length}):</h3>${L.map(i=>`<button data-go="${i}"><span class="no">${i}</span><span>${TASKS[i].t}</span><small>Сделать →</small></button>`).join('')}</div>`;};
const leftOn=()=>document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>{location.hash='#'+b.dataset.go;});
function home(){const nx=TASKS.findIndex((x,i)=>x&&!DONE[i]);
 shell(`<h2>Задания по порядку</h2><p class="lead">Делай задания <b>по номерам: 1, 2, 3…</b> Сделанные отмечаются ✓, шкала наверху показывает, сколько готово.</p>
 <div class="list">${TASKS.map((x,i)=>{if(!x)return '';return `<button class="ti n${i===nx?' hot':''}${DONE[i]?'':' todo'}" data-n="${i}"><span class="no" style="${DONE[i]?'background:var(--ok)':i===nx?'background:var(--ac)':''}">${i}</span><span><b>${x.t}</b><small>${x.d}</small></span><span class="sc7">${DONE[i]?'✓ '+DONE[i]:''}</span></button>`;}).join('')}</div>
 <div class="row" style="justify-content:center"><button class="btn" id="it">🏁 Мои итоги</button></div>`);
 document.querySelectorAll('[data-n]').forEach(b=>b.onclick=()=>{location.hash='#'+b.dataset.n;});$('#it').onclick=()=>{location.hash='#itogi';};}
function itogi(){const L=left();send('itogi',{done:nDone(),of:NT,left:L});const D=TASKS.map((x,i)=>x&&DONE[i]?i:0).filter(Boolean);
 shell(`${backBtn}<h2>🏁 Мои итоги</h2><p class="lead">Сделано <b>${nDone()} из ${NT}</b> заданий.</p>${leftBox()}
  ${D.length?`<h3>✓ Сделано</h3><div class="list">${D.map(i=>`<button class="ti n" data-n="${i}"><span class="no" style="background:var(--ok)">${i}</span><span><b>${TASKS[i].t}</b><small>можно пройти ещё раз</small></span><span class="sc7">✓ ${DONE[i]}</span></button>`).join('')}</div>`:''}
  ${L.length?'':'<p class="lead" style="text-align:center">Учитель видит твои результаты. До встречи на уроке! 再见！</p>'}`);
 document.querySelectorAll('[data-n]').forEach(b=>b.onclick=()=>{location.hash='#'+b.dataset.n;});leftOn();}
function route(){if(!S.name){if(NAMEQ){S.name=NAMEQ;S.sid=S.sid||(Date.now().toString(36)+Math.random().toString(36).slice(2,8));keepS();}else return login();}
 const h=location.hash.slice(1);if(h==='itogi')return itogi();const n=+h;if(TASKS[n])TASKS[n].run();else home();}
addEventListener('hashchange',route);
const nextN=n=>{for(let i=n+1;i<=NT;i++)if(!DONE[i])return i;for(let i=1;i<n;i++)if(!DONE[i])return i;return 0;};
const doneBox=(n,inner,again)=>{const nx=nextN(n);return `${backBtn}${tag(n)}<h2>${TASKS[n].t} — готово!</h2>${inner}<div class="row">${nx?`<button class="btn" onclick="location.hash='#${nx}'">Задание № ${nx} →</button>`:`<button class="btn" onclick="location.hash='#itogi'">🏁 Мои итоги</button>`}<button class="btn g" onclick="location.hash=''">‹ Все задания</button>${again!==false?`<button class="btn g" id="again">↺ Ещё раз</button>`:''}</div>${nx?'':leftBox()}`;};
const againOn=f=>{const a=$('#again');if(a)a.onclick=f;};
const plural=(k,a,b,c)=>k%10===1&&k%100!==11?a:k%10>=2&&k%10<=4&&(k%100<12||k%100>14)?b:c;

/* ---- universal quiz: one question at a time, the mistake is shown only after the answer ---- */
// item: {q:html, o:[...], r:right, why:html, cls:'py'|'zh'|'tx'|'num'|'mk', snd:()=>Promise (played first), after:()=>{} (after the answer), lab:'text for the teacher'}
function quiz(n,{title,items,intro,startTxt,onEnd}){
 const go=()=>{const Q=items(),res=[],hist=[];let i=0,ok=0;
  const ask=()=>{if(i>=Q.length)return end();const it=Q[i];const [opts,ix]=arrange(it.o,it.r,hist);hist.push(ix);let done=false;
   shell(`${backBtn}${tag(n)}<div class="qcard n"><div class="qhead"><span>Вопрос ${i+1} из ${Q.length}</span><span>✓ ${ok}</span></div>
    <div class="dots">${Q.map((_,j)=>`<i class="${j<i?(res[j].ok?'ok':'no'):j===i?'cur':''}"></i>`).join('')}</div>
    ${it.q}${it.snd?'<button class="play n" id="pl">🔊</button>':''}
    <div class="opts ${it.o.length===3?'o3':''}">${opts.map(x=>`<button class="opt ${it.cls||'py'}" data-v="${esc(x)}">${it.show?it.show(x):esc(x)}</button>`).join('')}</div>
    <div class="fb" id="fb"></div><div id="nx"></div></div>`);
   if(it.snd){const pl=$('#pl');const p=()=>{pl.classList.add('on');Promise.resolve(it.snd()).then(()=>pl.classList.remove('on'));};pl.onclick=p;later(p,200);}
   document.querySelectorAll('.opt').forEach(b=>b.onclick=()=>{if(done)return;done=true;const v=b.dataset.v,right=v===String(it.r);if(right)ok++;
    res.push({q:it.lab||'',a:it.ans?it.ans(v):v,r:it.ans?it.ans(String(it.r)):String(it.r),ok:right});
    document.querySelectorAll('.opt').forEach(x=>{if(x.dataset.v===String(it.r))x.classList.add('ok');else if(x===b)x.classList.add('no');x.disabled=true;});
    const fb=$('#fb');fb.className='fb '+(right?'ok':'no');fb.innerHTML=(right?'✓ Верно! ':'✗ Правильно: <b>'+esc(it.rshow||it.r)+'</b>. ')+(it.why||'');
    if(it.after)it.after(right);
    $('#nx').innerHTML=`<button class="btn nxt" id="nb">${i+1<Q.length?'Дальше →':'Готово →'}</button>`;$('#nb').onclick=()=>{i++;ask();};
    if(right)later(()=>{if($('#nb')){i++;ask();}},it.wait||1600);});};
  const end=()=>{const miss=res.filter(r=>!r.ok);finish(n,ok,Q.length,{res,miss:miss.map(r=>r.q||r.r)});
   const k=ok/Q.length;
   shell(doneBox(n,`<div class="res" style="text-align:center">${ok} / ${Q.length}</div><p class="lead" style="text-align:center">${ok===Q.length?'Ни одной ошибки! 🏆':k>=.7?'Отлично! Почти всё верно 💪':'Хорошая работа! Это можно повторить для закрепления 🙂'}</p>
    ${miss.length?`<div class="why">${miss.map(r=>`<div>${esc(r.q)} → правильно: <b>${esc(r.r)}</b></div>`).join('')}</div>`:''}${onEnd?onEnd():''}`));againOn(()=>quiz(n,{title,items,intro,startTxt,onEnd}));};
  ask();};
 shell(`${backBtn}${tag(n)}<h2>${title}</h2>${intro}<div class="row" style="justify-content:center"><button class="btn" id="st" style="width:100%">${startTxt||'Начать упражнение →'}</button></div>`);
 introOn();$('#st').onclick=go;}
// sound buttons inside the rules
function introOn(){document.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{b.classList.add('on');playS(b.dataset.s).then(()=>b.classList.remove('on'));});
 document.querySelectorAll('[data-w]').forEach(b=>b.onclick=()=>playW(b.dataset.w,b));}
const pick=(a,k)=>shuffle(a).slice(0,k);


/* ---- tone marks ---- */
const MKP=['','M8 30 H72','M16 46 L64 12','M10 14 L40 46 L70 14','M16 12 L64 46'];
const msv=(t,c,h)=>t?`<svg viewBox="0 0 80 60" style="height:${h||'1em'};width:auto;vertical-align:middle;overflow:visible"><path d="${MKP[t]}" fill="none" stroke="${c||'currentColor'}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/></svg>`:`<span style="font:900 ${h||'1em'}/1 Nunito;vertical-align:middle">•</span>`;
const TCV=['#8A93AE','#1FA77A','#E8910C','#6A5BFF','#F0407A'];
const TSAY=['','ровная дорожка: голос высоко и ровно','горка вверх: голос поднимается, как в вопросе «а?»','ямка: голос опускается вниз и снова поднимается','будто падает вниз: резко, как «Стоп!»'];
const TSH=['лёгкий тон, без значка','1-й тон — ровно','2-й тон — вверх','3-й тон — ямка','4-й тон — вниз'];
const plainS=s=>s.normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/ü/g,'ü');
const toneS=s=>{const m=s.normalize('NFD');if(/̄/.test(m))return 1;if(/́/.test(m))return 2;if(/̌/.test(m))return 3;if(/̀/.test(m))return 4;return 0;};
const TLEG=`<div class="tleg">${[1,2,3,4].map(t=>`<div style="--tc:${TCV[t]}"><span>${msv(t,'#fff','30px')}</span><small>${['','ровно','вверх','ямка','вниз'][t]}</small></div>`).join('')}</div>`;
// explanation for a wrong tone (Daria: «прозвучал 4 тон, его значок вот такой — будто падает вниз»)
const toneWhy=(r,c)=>`Прозвучал <b>${r?r+'-й тон':'лёгкий тон'}</b> — ${r?`его значок вот такой <span class="mkb" style="--tc:${TCV[r]}">${msv(r,'#fff','24px')}</span>: ${TSAY[r]}.`:'значка нет совсем: коротко и тихо.'}${c!=null&&c!==r?` А ты выбрал(а) <span class="mkb" style="--tc:${TCV[c]}">${msv(c,'#fff','24px')}</span> — это ${TSH[c]}.`:''}`;
const sayS=(s,el)=>{el&&el.classList.add('on');return playS(s,el).then(()=>el&&el.classList.remove('on'));};


/* ---- 2: the crystal cave game ---- */
const KVA={};
function kpre(g){(g.audio||[]).forEach(c=>{if(KVA[c])return;const a=new Audio(fn(c));a.preload='auto';try{a.load();}catch(e){}KVA[c]=a;});}
window.KSAY=t=>new Promise(res=>{let a=KVA[t];if(!a){a=new Audio(fn(t));KVA[t]=a;}try{curA&&curA!==a&&curA.pause();}catch(e){}curA=a;let d=false;const end=()=>{if(!d){d=true;res();}};
 try{a.currentTime=0;}catch(e){}a.onended=end;a.onerror=end;a.play().catch(end);setTimeout(end,2500);});
window.KSTOP=()=>{try{curA&&curA.pause()}catch(e){}};
const KRA={};window.KRU=id=>{let a=KRA[id];if(!a){a=new Audio(AUDIO+'ru/'+id+'.mp3');KRA[id]=a;}return new Promise(res=>{try{curA&&curA!==a&&curA.pause();}catch(e){}curA=a;let d=false;const end=()=>{if(!d){d=true;res();}};try{a.currentTime=0;}catch(e){}a.onended=end;a.onerror=end;a.play().catch(end);setTimeout(end,3500);});};
['nj0','nj1','nj2','nj3','nj4','nj5','nj6','nj7','nj8','nj9'].forEach(id=>{const a=new Audio(AUDIO+'ru/'+id+'.mp3');a.preload='auto';KRA[id]=a;});
const KCSS={};
function katMount(id,box,onRes){const g=KAT.game(id);if(!g){box.innerHTML='<p class="lead">Игра не загрузилась, обнови страницу.</p>';return;}
 if(!KCSS[id]){KCSS[id]=1;const st=document.createElement('style');st.textContent=g.css||'';document.head.appendChild(st);}
 kpre(g);
 box.innerHTML=`<button class="btn kbig">⛶ Играть на весь экран</button><div class="kst"><div class="kstage g-${id}${id==='moles8'?' g-moles':''}"></div><button class="kfs" title="Во весь экран">⛶</button><button class="kx" title="Выйти">✕</button><div class="khint"><span class="kph">📱</span><b>Поверни телефон боком</b></div></div>`;
 const wrap=box.querySelector('.kst'),stage=box.querySelector('.kstage'),home=box;
 const fit=()=>{const w=wrap.clientWidth,h=wrap.clientHeight;if(!w||!h)return;
  if(wrap.classList.contains('kfull')&&h>w){const k=Math.min(h/1280,w/720),tx=(w+720*k)/2,ty=(h-1280*k)/2;stage.style.transform=`translate(${tx}px,${ty}px) rotate(90deg) scale(${k})`;const r=wrap.getBoundingClientRect();stage._rot={tx:r.left+tx,ty:r.top+ty,k};}
  else{const k=Math.min(w/1280,h/720);stage.style.transform=`translate(${(w-1280*k)/2}px,${(h-720*k)/2}px) scale(${k})`;stage._rot=null;}};
 const ro=new ResizeObserver(fit);ro.observe(wrap);fit();
 const isFull=()=>wrap.classList.contains('kfull');
 const full=on=>{if(on===isFull())return;
  if(on){document.body.appendChild(wrap);wrap.classList.add('kfull');document.documentElement.classList.add('knoscroll');
   if(innerHeight>innerWidth){wrap.classList.remove('hinted');void wrap.offsetWidth;wrap.classList.add('hinted');}
   const rq=wrap.requestFullscreen||wrap.webkitRequestFullscreen;if(rq)try{const pr=rq.call(wrap);if(pr&&pr.then)pr.then(()=>{try{screen.orientation.lock('landscape').catch(()=>{})}catch(e){}}).catch(()=>{});}catch(e){}}
  else{wrap.classList.remove('kfull','hinted');document.documentElement.classList.remove('knoscroll');if(document.body.contains(home))home.appendChild(wrap);else wrap.remove();
   try{if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});else if(document.webkitFullscreenElement)document.webkitExitFullscreen();}catch(e){}}
  requestAnimationFrame(fit);setTimeout(fit,300);};
 const onFs=()=>{if(!document.fullscreenElement&&!document.webkitFullscreenElement&&isFull()&&wrap._fsOn)full(false);wrap._fsOn=!!(document.fullscreenElement||document.webkitFullscreenElement);};
 document.addEventListener('fullscreenchange',onFs);document.addEventListener('webkitfullscreenchange',onFs);
 wrap.querySelector('.kfs').onclick=()=>full(!isFull());box.querySelector('.kbig').onclick=()=>full(true);wrap.querySelector('.kx').onclick=()=>full(false);
 // ДЗ 8: первое касание игры на ЛЮБОМ устройстве (и на компьютере) открывает её на весь экран — раньше на компьютере
 // игра оставалась в странице, начиналась с середины экрана, и дети видели только половину окна
 wrap.addEventListener('pointerdown',e=>{if(isFull())return;e.stopPropagation();e.preventDefault();const bt=e.target.closest&&e.target.closest('button');full(true);if(bt)setTimeout(()=>bt.click(),80);},true);
 const onR=()=>{fit();setTimeout(fit,250);};addEventListener('resize',onR);addEventListener('orientationchange',onR);
 KAT.onResult=(gid,r)=>{if(onRes)onRes(r);};
 const inst=g.mount(stage,KAT)||{};stage._inst=inst;
 requestAnimationFrame(()=>{try{box.scrollIntoView({block:'start'});}catch(e){}});
 KCUR={full,destroy(){ro.disconnect();removeEventListener('resize',onR);removeEventListener('orientationchange',onR);document.removeEventListener('fullscreenchange',onFs);document.removeEventListener('webkitfullscreenchange',onFs);
  if(isFull()){try{if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});}catch(e){}}document.documentElement.classList.remove('knoscroll');wrap.remove();try{inst.destroy&&inst.destroy()}catch(e){}}};
 return stage;}
function gameTask(n,id,title,rule){
 shell(`${backBtn}${tag(n)}<h2>${title}</h2><div id="kg"></div><div id="kr"></div>${rule}`);
 katMount(id,$('#kg'),r=>{const best=Math.max(r.score||0,+((S.gbest||{})[id]||0));S.gbest=Object.assign(S.gbest||{},{[id]:best});keepS();
  finish(n,r.right,r.of,{pts:r.score,best:best,wrong:r.wrong,miss:r.miss});
  if(KCUR&&KCUR.full)later(()=>KCUR&&KCUR.full(false),2600);
  const nx=nextN(n);
  $('#kr').innerHTML=`<div class="qcard n" style="text-align:center"><div class="res">${r.right} / ${r.of}</div><p class="lead">Очки: <b>${r.score}</b>${best>r.score?` · рекорд ${best}`:''}. ${r.miss&&r.miss.length?'Можно повторить для закрепления: <b class="py">'+r.miss.map(esc).join(', ')+'</b>':'Без ошибок! 🏆'}</p>
   <div class="row" style="justify-content:center">${nx?`<button class="btn" onclick="location.hash='#${nx}'">Задание № ${nx} →</button>`:`<button class="btn" onclick="location.hash='#itogi'">🏁 Мои итоги</button>`}<button class="btn g" onclick="location.hash=''">‹ Все задания</button></div></div>`;});}

/* ---- 2: tone dictation, как на уроке, но читает голос (2 раза), ребёнок нажимает ЗНАЧОК тона ---- */
const D2=['bō','pí','mǎ','fù','dá','tǐ','nù','lā','gǔ','kē'];
// проиграть слог k раз подряд (как учитель на уроке); новый вызов или уход со страницы прерывает повтор
const rep=(s,el,k)=>{const tok=rep.t=(rep.t||0)+1;const go=i=>{if(i>=k||tok!==rep.t||(el&&!document.body.contains(el)))return;sayS(s,el).then(()=>later(()=>go(i+1),600));};go(0);};
function dict2(){const n=2;S.d2=S.d2||{};const A=S.d2;
 const row=i=>{const s=D2[i],a=A[i];const r=toneS(s);return `<div class="dr8 n${a==null?'':(a===r?' ok':' no')}" data-i="${i}"><span class="no">${i+1}</span><span class="sy8">${a==null?plainS(s):s}${a==null?`<button class="pl8" data-p="${s}" aria-label="Послушать">🔊</button>`:''}</span>
  ${a==null?`<div class="mk8">${[1,2,3,4].map(t=>`<button data-t="${t}" aria-label="${t}-й тон">${msv(t,TCV[t],'30px')}</button>`).join('')}</div>`:`<button class="ear8" data-s="${s}" aria-label="Послушать">🔊</button><span class="vr8">${a===r?'✓':'✗'}</span>`}
  ${a!=null&&a!==r?`<div class="why8">${toneWhy(r,a)}</div>`:''}</div>`;};
 const draw=()=>{const k=D2.findIndex((_,i)=>A[i]==null);
  shell(`${backBtn}${tag(n)}<h2>🎵 Диктант на тоны</h2>
   <div class="rbox" style="--c1:#FF5C8A;--c2:#8E5BE8"><b>Правило</b>Голос читает каждый слог <b>2 раза</b> — как учитель на уроке. Слушай и нажми <b>значок тона</b> у этого номера. Хочешь ещё раз — нажми 🔊. ${TLEG}</div>
   <div class="dl8">${D2.map((_,i)=>row(i)).join('')}</div>
   ${k<0?`<div class="row" style="justify-content:center"><button class="btn" id="fin">✓ Готово — мой результат</button></div>`:`<p class="hint2" style="text-align:center;margin-top:12px">Сейчас: № ${k+1}. Послушай и нажми значок тона.</p>`}`);
  const cur=document.querySelector(`.dr8[data-i="${k}"]`);if(cur){cur.classList.add('cur');const pb=cur.querySelector('.pl8');later(()=>rep(D2[k],pb,2),350);}
  document.querySelectorAll('.pl8').forEach(b=>b.onclick=()=>rep(b.dataset.p,b,1));
  document.querySelectorAll('.dr8 [data-t]').forEach(b=>b.onclick=()=>{const i=+b.closest('.dr8').dataset.i,t=+b.dataset.t;A[i]=t;keepS();
   send('d2',{a:D2.map((s,j)=>A[j]==null?null:A[j])});const y=scrollY;draw();scrollTo(0,y);const el=document.querySelector(`.dr8[data-i="${i}"]`);if(el)el.scrollIntoView({block:'nearest'});});
  document.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>sayS(b.dataset.s,b));
  const f=$('#fin');if(f)f.onclick=end;};
 const end=()=>{const res=D2.map((s,i)=>[s,toneS(s),A[i]]);const ok=res.filter(r=>r[1]===r[2]).length;
  finish(n,ok,D2.length,{res,miss:res.filter(r=>r[1]!==r[2]).map(r=>r[0])});
  shell(doneBox(n,`<div class="res" style="text-align:center">${ok} / ${D2.length}</div><p class="lead" style="text-align:center">${ok===D2.length?'Все тоны верно! 🏆':ok>=7?'Отлично! Почти всё верно 💪':'Хорошая работа! Значки тонов можно повторить для закрепления 🙂'}</p>
   <div class="ans8">${res.map(r=>`<button class="${r[1]===r[2]?'ok':'no'}" data-s="${r[0]}"><b>${r[0]}</b><small>${r[1]===r[2]?'✓':'ты: '+(r[2]?msv(r[2],'#B0284F','14px'):'—')}</small></button>`).join('')}</div>`));
  document.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>sayS(b.dataset.s,b));
  againOn(()=>{S.d2={};keepS();dict2();});};
 draw();}

/* ---- 3: real dictation: type the syllable in Latin letters + tap the tone mark ---- */
const D3=['pā','dí','gù','bǐ','mō','tǔ','fá','dé','kǔ','nǐ','lù','hē'];
const CYR={'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'e','ж':'zh','з':'z','и':'i','й':'i','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r','с':'s','т':'t','у':'u','ф':'f','х':'h','ц':'c','ч':'ch','ш':'sh','щ':'sh','ы':'i','э':'e','ю':'u','я':'a'};
const RUS={b:'б',p:'п',m:'м',f:'ф',d:'д',t:'т',n:'н',l:'л',g:'г',k:'к',h:'х'};
// letters that look alike (shape) and letters that sound alike (aspiration)
const SHAPE={b:['d','p','6'],d:['b','g','q'],g:['d','q','9'],p:['b','q'],q:['p','g','d']};
const SOUND={b:'p',p:'b',d:'t',t:'d',g:'k',k:'g'};
const LTR={b:'палочка ВВЕРХ, животик СПРАВА',d:'животик СЛЕВА, палочка ВВЕРХ',p:'палочка ВНИЗ, животик СПРАВА',g:'животик СЛЕВА, хвостик ВНИЗ крючком',q:'животик слева, палочка вниз (в пиньине её почти нет)',t:'палочка с перекладиной',k:'палочка и «уголок» справа'};
const lcard=(l,hot)=>`<div class="lc8${hot?' hot':''}"><b>${l}</b><span>${RUS[l]?'звук «'+RUS[l]+'»':''}</span><small>${LTR[l]||''}</small></div>`;
function letterWhy(typed,cyr,base){
 if(cyr){const lat=[...typed].map(c=>CYR[c]||c).join('');
  return `Ты написал(а) <b>русскими буквами</b>: «${esc(typed)}». В пиньине только <b>латинские</b> буквы${lat===base?` — возможно, ты имел(а) в виду <b>${base}</b>!`:'.'} Нажимай буквы на клавиатуре под словом 👇`;}
 if(typed.length===base.length){const diff=[...base].map((c,i)=>[c,typed[i]]).filter(([a,b])=>a!==b);
  if(diff.length===1){const [r,w]=diff[0];
   if(SHAPE[r]&&SHAPE[r].includes(w))return `Ошибка, но возможно, ты имел(а) в виду букву <b>${r}</b>! Буквы <b>${w}</b> и <b>${r}</b> легко перепутать — смотри, как они пишутся:<div class="lcs8">${lcard(w)}${lcard(r,1)}</div>${r==='d'&&w==='g'?'<small class="ru8">Русская «д» в прописи похожа на g — но звук «д» в пиньине пишется <b>d</b>.</small>':''}${r==='b'&&w==='d'?'<small class="ru8">Русская «б» похожа на латинскую d — но звук «б» в пиньине пишется <b>b</b>.</small>':''}`;
   if(SOUND[r]===w)return `Прозвучал <b>${r}</b> — ${'ptk'.includes(r)?'предыхательный 💨, с сильным выдохом':'непредыхательный, без воздуха'}. А <b>${w}</b> — ${'ptk'.includes(w)?'предыхательный 💨':'непредыхательный'}. Послушай ещё раз 🔊<div class="lcs8">${lcard(w)}${lcard(r,1)}</div>`;}}
 return `Правильно пишется <b>${base}</b>. Послушай ещё раз 🔊`;}
const KB8=['qwertyuiop','asdfghjkl','zxcvbnmü'];
function dict3(){const n=3;S.d3=S.d3||{};const A=S.d3;
 const k=D3.findIndex((_,i)=>!A[i]);
 if(k<0)return end3();
 const s=D3[k],base=plainS(s),r=toneS(s);let tone=0;
 shell(`${backBtn}${tag(n)}<h2>📝 Диктант: пиши слоги</h2>
  <div class="rbox" style="--c1:#2DBE8C;--c2:#5B6BD8"><b>Правило</b>Голос читает каждый слог <b>3 раза</b> — как учитель на уроке. Напиши слог <b>латинскими буквами</b>, потом нажми <b>значок тона</b> и «Проверить».</div>
  <div class="dots" style="margin-top:12px">${D3.map((_,i)=>`<i class="${A[i]?(A[i].ok?'ok':'no'):i===k?'cur':''}"></i>`).join('')}</div>
  <div class="qcard n d3c"><div class="qhead"><span>Слог № ${k+1} из ${D3.length}</span><span>✓ ${D3.filter((_,i)=>A[i]&&A[i].ok).length}</span></div>
   <div class="in8"><button class="no pl8b" id="pl" aria-label="Послушать ещё раз">🔊</button><input id="w" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" maxlength="8" placeholder="слог" aria-label="Слог латиницей"><span class="tm8" id="tm"></span></div>
   <div class="kb8">${KB8.map(r=>`<div>${[...r].map(c=>`<button data-k="${c}">${c}</button>`).join('')}${r==='zxcvbnmü'?'<button data-k="⌫" class="bs">⌫</button>':''}</div>`).join('')}</div>
   <div class="qq" style="margin-top:14px">Какой значок тона?</div>
   <div class="mk8 big">${[1,2,3,4].map(t=>`<button data-t="${t}" aria-label="${t}-й тон">${msv(t,TCV[t],'34px')}</button>`).join('')}</div>
   <button class="btn nxt" id="ck" disabled>Проверить</button><div class="fb" id="fb"></div><div id="nx"></div></div>
  <p class="hint2" style="text-align:center;margin-top:10px">Не расслышал(а)? Нажми 🔊 слева от слова — голос прочитает ещё раз.</p>`);
 $('#pl').onclick=()=>rep(s,$('#pl'),1);later(()=>rep(s,$('#pl'),3),350);
 const w=$('#w'),ck=$('#ck');
 if(matchMedia('(pointer:coarse)').matches)w.setAttribute('inputmode','none');
 const upd=()=>{const v=w.value.trim();ck.disabled=!v||!tone;$('#tm').innerHTML=tone?msv(tone,TCV[tone],'26px'):'';};
 w.oninput=()=>{const v=w.value;const t=toneS(v);if(t){tone=t;document.querySelectorAll('.mk8 [data-t]').forEach(b=>b.classList.toggle('on',+b.dataset.t===t));w.value=plainS(v);}w.value=w.value.replace(/[0-9]/g,'');upd();};
 document.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{const c=b.dataset.k;if(c==='⌫')w.value=w.value.slice(0,-1);else if(w.value.length<8)w.value+=c;upd();});
 document.querySelectorAll('.mk8 [data-t]').forEach(b=>b.onclick=()=>{tone=+b.dataset.t;document.querySelectorAll('.mk8 [data-t]').forEach(x=>x.classList.toggle('on',x===b));upd();});
 w.onkeydown=e=>{if(e.key==='Enter'&&!ck.disabled)ck.click();};
 ck.onclick=()=>{rep.t=(rep.t||0)+1;let typed=w.value.trim().toLowerCase().replace(/v/g,'ü');const cyr=/[а-яё]/.test(typed);
  const okL=typed===base,okT=tone===r,ok=okL&&okT;
  A[k]={w:typed,t:tone,ok,okL,okT,cyr};keepS();send('d3',{a:D3.map((_,i)=>A[i]?[A[i].w,A[i].t]:null)});
  document.querySelectorAll('.kb8 button,.mk8 button,#w').forEach(b=>b.disabled=true);ck.style.display='none';
  const fb=$('#fb');fb.className='fb '+(ok?'ok':'no');
  fb.innerHTML=ok?`✓ Верно! <b class="py">${s}</b>`:`<div class="big8">${s}</div>${okL?'':`<div class="why8">✗ ${letterWhy(typed,cyr,base)}</div>`}${okT?'':`<div class="why8">✗ ${toneWhy(r,tone)}</div>`}`;
  $('#nx').innerHTML=`<div class="row" style="justify-content:center"><button class="btn g" id="ls">🔊 Послушать ${s}</button><button class="btn" id="nb">${k+1<D3.length?'Дальше →':'Готово →'}</button></div>`;
  $('#ls').onclick=()=>sayS(s,$('#ls'));$('#nb').onclick=dict3;};
 function end3(){const res=D3.map((s,i)=>[s,(A[i]||{}).w||'',(A[i]||{}).t||0,!!(A[i]||{}).ok]);const ok=res.filter(r=>r[3]).length;
  const okL=D3.filter((_,i)=>A[i]&&A[i].okL).length,okT=D3.filter((_,i)=>A[i]&&A[i].okT).length;
  finish(n,ok,D3.length,{res,okL,okT,miss:res.filter(r=>!r[3]).map(r=>r[0])});
  shell(doneBox(n,`<div class="res" style="text-align:center">${ok} / ${D3.length}</div><p class="lead" style="text-align:center">Буквы верно: <b>${okL}</b> из ${D3.length} · тоны верно: <b>${okT}</b> из ${D3.length}. ${ok===D3.length?'Без ошибок! 🏆':'Ошибки можно повторить для закрепления 🙂'}</p>
   <div class="ans8">${res.map(r=>`<button class="${r[3]?'ok':'no'}" data-s="${r[0]}"><b>${r[0]}</b><small>${r[3]?'✓':'ты: '+esc(r[1]||'—')+(r[2]?' '+msv(r[2],'#B0284F','13px'):'')}</small></button>`).join('')}</div>`));
  document.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>sayS(b.dataset.s,b));
  againOn(()=>{S.d3={};keepS();dict3();});}}


/* ---- 4: ci = «цы», chi = «чшы» ---- */
const ZR={zi:'«дзы»',ci:'«цы»',si:'«сы»',zhi:'«джы»',chi:'«чшы»',shi:'«шы»'};
const ZS={zi:['zī','zǐ','zì'],ci:['cí','cǐ','cì'],si:['sī','sǐ','sì'],zhi:['zhī','zhí','zhǐ','zhì'],chi:['chī','chí','chǐ','chì'],shi:['shī','shí','shǐ','shì']};
function cichi(){const n=6;
 quiz(n,{title:'⚠️ ci = «цы», chi = «чшы»',
  intro:`<div class="zwarn"><span class="k2">⚠️ Самое важное</span><div class="h">c + i и ch + i:<br>ПРЕДЫХАНИЕ ИСЧЕЗАЕТ!</div>
   <p>Сами по себе <b>c</b> и <b>ch</b> — предыхательные 💨: cā «цха», chā «чха». Но как только они встречаются с финалью <b>i</b>, то <b>теряют предыхание</b>!</p>
   <div class="zpair"><div><span class="a">ci</span><span class="r">«цы»</span><small>без предыхания</small><button class="btn g" style="padding:6px 12px;font-size:14px;margin-top:6px" data-s="cì">🔊 cì</button></div><div><span class="a">chi</span><span class="r">«чшы»</span><small>без предыхания</small><button class="btn g" style="padding:6px 12px;font-size:14px;margin-top:6px" data-s="chī">🔊 chī</button></div></div></div>
   <h3>Вся шестёрка с i — послушай</h3>
   <div class="zrow">${Object.keys(ZR).map(k=>`<button class="n${k==='ci'||k==='chi'?' hot':''}" data-s="${ZS[k][ZS[k].length-1]}"><b>${k}</b><small>${ZR[k]}</small></button>`).join('')}</div>
   <div class="tip" style="font-size:16px">Сравни: <b>cā</b> «цха» 💨 — <b>cì</b> «цы»; <b>chā</b> «чха» 💨 — <b>chī</b> «чшы». <button class="btn g" style="padding:6px 10px;font-size:14px" data-s="cā">🔊 cā</button> <button class="btn g" style="padding:6px 10px;font-size:14px" data-s="chā">🔊 chā</button></div>`,
  items:()=>{const A=[];
   const AIR=[['cā',1],['cí',0],['chá',1],['chī',0],['cū',1],['cǐ',0],['chǔ',1],['chì',0]];
   pick(AIR,6).forEach(([s,a])=>{const ch=s.startsWith('ch');A.push({q:`<div class="qq">Есть ли здесь предыхание 💨?</div><div class="big7">${s}</div>`,o:['💨 есть','🚫 нет'],r:a?'💨 есть':'🚫 нет',cls:'tx',
    why:a?`${ch?'ch':'c'} — предыхательный: ${s} «${ch?'чх':'цх'}…» 💨`:`${ch?'chi':'ci'} = ${ch?'«чшы»':'«цы»'} — с финалью i предыхание исчезает!`,after:()=>playS(s),lab:s+' — предыхание?'});});
   const K=Object.keys(ZR);
   pick(K,4).forEach(k=>{const s=pick(ZS[k],1)[0];const o=[k,...pick(K.filter(x=>x!==k&&(x[0]===k[0]||x.endsWith(k.slice(-2))||true)),3)];
    A.push({q:`<div class="qq">Послушай. Какой это слог?</div>`,snd:()=>playS(s),o,r:k,why:`${k} = ${ZR[k]}.`,lab:'услышь: '+s});});
   [['ci','«цы»'],['chi','«чшы»'],['zhi','«джы»']].forEach(([k,r])=>A.push({q:`<div class="qq">Как читается?</div><div class="big7">${k}</div>`,o:['«цы»','«чшы»','«джы»','«сы»'],r,cls:'tx',why:`${k} = ${r}${k==='ci'||k==='chi'?' — без предыхания!':''}.`,after:()=>playS(ZS[k][ZS[k].length-1]),lab:k+' — как читается'}));
   return shuffle(A);}});}

/* ---- 5: ears — aspirated or not ---- */
const EP=[['bā','pā'],['bǐ','pǐ'],['bù','pù'],['bí','pí'],['dì','tì'],['dǔ','tǔ'],['dà','tà'],['dī','tī'],['gǔ','kǔ'],['gē','kē'],['gù','kù'],['dú','tú']];
function ears(){const n=5;
 quiz(n,{title:'👂 Слух: b–p, d–t, g–k',
  intro:`<div class="rbox" style="--c1:#2DBE8C;--c2:#1E8F69"><b>Правило</b>Пары звучат почти одинаково. Разница — <b>воздух</b>!<div class="rr2"><span>🚫 <b>b d g</b> — непредыхательные: тихо, без воздуха</span><span>💨 <b>p t k</b> — предыхательные: сильный выдох, как будто задуваешь свечу</span></div></div>
   <div class="zrow">${[['bā','pā'],['dì','tì'],['gǔ','kǔ']].map(([a,b])=>`<button class="n" data-s="${a}"><b>${a}</b><small>без воздуха</small></button><button class="n hot" data-s="${b}"><b>${b}</b><small>💨 с воздухом</small></button><span></span>`).join('')}</div>`,
  items:()=>pick(EP,10).map(p=>{const k=Math.random()<.5?0:1,s=p[k];const asp=k===1;
   return {q:`<div class="qq">Послушай. Что ты слышишь?</div>`,snd:()=>playS(s),o:p,r:s,why:asp?`${s[0]} — предыхательный 💨`:`${s[0]} — непредыхательный, без воздуха`,lab:'услышь: '+s};})});}


/* ---- 7: recognise the characters (all six) + phrases in pinyin ---- */
const HZI={'你':['nǐ','ты'],'我':['wǒ','я'],'好':['hǎo','хорошо'],'叫':['jiào','зваться'],'妈':['mā','мама'],'爸':['bà','папа']};
const H6=Object.keys(HZI);
function know(){const n=7;
 quiz(n,{title:'👀 Узнай иероглиф',
  intro:`<div class="rbox" style="--c1:#5B6BD8;--c2:#FF5C8A"><b>Наши 6 иероглифов</b>Посмотри и послушай. Потом узнаешь их в упражнении!</div>
   <div class="mlist">${H6.map(c=>`<button class="n" data-w="${c}"><span class="zh">${c}</span><small><b class="py" style="color:var(--ac)">${HZI[c][0]}</b> ${HZI[c][1]}</small>🔊</button>`).join('')}</div>
   <div class="tip" style="font-size:16px">Подсказки: в <span class="zh" style="font-size:24px">你</span> слева человек 亻, в <span class="zh" style="font-size:24px">叫</span> слева рот 口, в <span class="zh" style="font-size:24px">妈</span> и <span class="zh" style="font-size:24px">好</span> — женщина 女, у <span class="zh" style="font-size:24px">爸</span> сверху 父 «отец».</div>`,
  items:()=>{const A=[];
   shuffle(H6).forEach(c=>A.push({q:`<div class="qq">Что значит этот иероглиф?</div><div class="big7 zh">${c}</div>`,o:[HZI[c][1],...pick(H6.filter(x=>x!==c).map(x=>HZI[x][1]),3)],r:HZI[c][1],cls:'tx',why:`${c} ${HZI[c][0]} — «${HZI[c][1]}».`,after:()=>playW(c),lab:c+' — перевод'}));
   pick(H6,4).forEach(c=>A.push({q:`<div class="qq">Найди иероглиф <b>«${HZI[c][1]}»</b></div>`,snd:()=>playW(c),o:[c,...pick(H6.filter(x=>x!==c),3)],r:c,cls:'zh',why:`«${HZI[c][1]}» — ${c} ${HZI[c][0]}.`,lab:'найди «'+HZI[c][1]+'»'}));
   const PH=[['nǐ ne?','а ты?','你呢'],['zàijiàn','до свидания','再见'],['wǒ jiào','меня зовут','我叫'],['nǐ hǎo','привет','你好']];
   PH.slice(0,3).forEach(([p,r,w])=>A.push({q:`<div class="qq">Как перевести?</div><div class="big7" style="font-size:56px">${p}</div>`,o:PH.map(x=>x[1]),r,cls:'tx',why:`${p} — «${r}».`,after:()=>playW(w),lab:p+' — перевод'}));
   return shuffle(A);}});}

/* ---- 8: radicals ---- */
// part A: our characters; part B: a NEW character — guess the meaning by its key (the task itself is about the key)
const KA=[{c:'妈',q:'Какая часть подсказывает <b>смысл</b> (ключ)?',o:['女','马'],r:'女',why:'女 «женщина» — ключ, слева. Мама — женщина.'},
 {c:'妈',q:'Какая часть подсказывает <b>чтение</b>?',o:['马','女'],r:'马',why:'马 звучит mǎ — поэтому 妈 читается mā.'},
 {c:'爸',q:'Где здесь <b>чтение</b>?',o:['巴','父'],r:'巴',why:'巴 звучит bā — чтение 爸 bà. 父 «отец» сверху — ключ, смысл.'},
 {c:'你',q:'Где ключ? Что он значит?',o:['亻 человек','尔 рот'],r:'亻 человек',why:'亻 «человек» — ключ слева: «ты» — это человек.'},
 {c:'叫',q:'Где ключ? Что он значит?',o:['口 рот','口 глаз'],r:'口 рот',why:'口 «рот» — ключ слева: звать, зваться — делаем ртом.'},
 {c:'好',q:'好 = 女 + 子. Как он устроен?',o:['обе части — смысл','одна часть — чтение'],r:'обе части — смысл',why:'女 «женщина» + 子 «ребёнок» = мама с ребёнком — это «хорошо». Части-чтения здесь нет!'},
 {c:'爸',q:'Какая часть — <b>ключ</b> (смысл)?',o:['父','巴'],r:'父',why:'父 «отец» сверху — ключ: папа — это отец. 巴 звучит ba — чтение.'},
 {c:'好',q:'Есть ли в 好 часть-<b>чтение</b>?',o:['нет — обе части смысл','да — 子 подсказывает чтение'],r:'нет — обе части смысл',why:'好 = 女 «женщина» + 子 «ребёнок». Обе части — смысл: мама с ребёнком — это «хорошо». Звучит hǎo — ни 女, ни 子 так не звучат.'}];
function keys(){const n=8;
 quiz(n,{title:'🔑 Смысл и чтение',
  intro:`<div class="rbox" style="--c1:#FF3D77;--c2:#FF8A3D"><b>🔑 Правило иероглифа</b><div class="rr2"><span>🔑 <b>Ключ</b> подсказывает <b>СМЫСЛ</b>. Он стоит чаще <b>слева</b> или <b>сверху</b>.</span><span>🔊 Другая часть часто подсказывает <b>ЧТЕНИЕ</b>.</span><span>⚠️ Бывает, что <b>обе части — смысл</b>: 好 = 女 + 子</span></div></div>
   <div class="split"><span class="zh" style="color:#FF3D77">女</span>+<span class="zh" style="color:#3E86B8">马</span>=<span class="zh">妈</span></div>
   <p class="lead" style="text-align:center"><b style="color:#FF3D77">女 женщина</b> — смысл · <b style="color:#3E86B8">马</b> звучит <b>ma</b> — чтение</p>
   <div class="split" style="margin-top:6px"><span class="zh" style="color:#FF3D77">女</span>+<span class="zh" style="color:#FF3D77">子</span>=<span class="zh">好</span></div>
   <p class="lead" style="text-align:center">женщина + ребёнок = «хорошо» — <b style="color:#FF3D77">обе части — смысл</b>, чтения здесь нет!</p>`,
  items:()=>shuffle(KA.map(x=>({q:`<div class="big7 zh">${x.c}</div><div class="qq">${x.q}</div>`,o:x.o,r:x.r,cls:/^[一-鿿]$/.test(x.o[0])?'zh':'tx',why:x.why,after:()=>playW(x.c),lab:x.c+': '+x.q.replace(/<[^>]+>/g,'')})))});}

/* ---- 4: порядок черт — как на уроке 8 (раздел 4): правило 十 / 口 и «какую черту пишут первой» ---- */
// [иероглиф, варианты (номера черт; 0 — правильная, первая), объяснение]
const SOQ=[['日',[1,2,0],'Сначала рамка: левая стенка. «Дно» — в самом конце.'],
 ['天',[0,2,3],'Сверху вниз: первая — верхняя горизонталь.'],
 ['山',[1,0,2],'Сначала середина, потом бока — как в 小.'],
 ['四',[4,1,0],'Рамка: левая стенка, потом верх с поворотом. Дно — в конце.'],
 ['上',[2,0,1],'Хитрый! Черты не пересекаются: вертикаль первая, длинное «дно» — в конце.'],
 ['门',[0,2,1],'Сверху вниз: сначала точка.'],
 ['口',[2,0,1],'口 — рамка: левая стенка ┃ первая, потом верх с поворотом ┓, дно — в конце.'],
 ['十',[1,0],'Черты пересекаются: сначала горизонталь, потом вертикаль.'],
 ['田',[0,4,2],'Сначала рамка: левая стенка. «Дно» коробки — в конце.'],
 ['王',[2,0,3],'Сверху вниз: первая — верхняя горизонталь.']];
function strokeSVG(c,hi){const d=HZDATA[c];if(!d)return '';return `<svg viewBox="0 0 1024 1024"><g transform="translate(0,900) scale(1,-1)">${d.strokes.map((p,i)=>`<path d="${p}" fill="${i===hi?'#FF3D77':hi<0?'#2B3270':'#C9CEDB'}"/>`).join('')}</g></svg>`;}
function strokes(){const n=4;
 quiz(n,{title:'✍️ Порядок черт',
  intro:`<div class="rbox" style="--c1:#5B6BD8;--c2:#FF3D77"><b>Почему в 口 первая черта — вертикаль?</b>
   <div class="so8"><div><div class="sbig sm">${strokeSVG('十',-1)}</div><b>十 — черты <u>пересекаются</u></b><small>сначала горизонталь, потом вертикаль</small></div>
   <div><div class="sbig sm">${strokeSVG('口',-1)}</div><b>口 — это <u>рамка</u></b><small>1 левая стенка ┃ · 2 верх + правая стенка — одна черта с поворотом ┓ · 3 дно в конце</small></div></div></div>
   <div class="zwarn" style="margin-top:14px"><span class="k2">💡 Запомни</span><div class="h" style="font-size:22px">«Горизонталь раньше вертикали» — только когда черты ПЕРЕСЕКАЮТСЯ, как в 十</div>
   <p>Если иероглиф в <b>рамке</b> — сначала рамка: левая стенка → верх с поворотом → внутри → <b>дно в конце</b>: 口 日 四.</p></div>
   <div class="rbox" style="--c1:#2DBE8C;--c2:#5B6BD8;margin-top:14px"><b>Ещё правила</b><div class="srules">
   <span><span class="zh">三</span>сверху вниз</span><span><span class="zh">川</span>слева направо</span><span><span class="zh">小</span>сначала середина, потом бока</span><span><span class="zh">人</span>сначала черта влево, потом вправо</span></div></div>
   <div class="tip" style="font-size:16px">Как на уроке: смотри на большой иероглиф и найди черту, которую пишут <b>ПЕРВОЙ</b> (она розовая). Иероглифы <b>учить не нужно</b> — только порядок черт!</div>`,
  items:()=>shuffle(SOQ).map(([c,o,why])=>({q:`<div class="sbig">${strokeSVG(c,-1)}</div><div class="qq">Какую черту пишут <b>первой</b>?</div>`,
   o:o.map(String),r:'0',cls:'sv',ans:v=>v==='0'?'первую черту':'черту № '+(+v+1),show:v=>strokeSVG(c,+v),rshow:'та, что отмечена зелёным',wait:99999,lab:c+' — первая черта',
   why:`${why}<div class="anim"><svg class="grid" viewBox="0 0 100 100"><g stroke="#FFB3C8" stroke-width=".6" stroke-dasharray="2 2"><line x1="50" y1="0" x2="50" y2="100"/><line x1="0" y1="50" x2="100" y2="50"/></g></svg><div class="hw" id="an"></div></div><p class="hint2" style="text-align:center;margin-top:6px">Смотри весь порядок черт 👆</p>`,
   after:()=>{const el=$('#an');if(!el||!window.HanziWriter||!HZDATA[c])return;const sz=el.clientWidth||200;const w=HanziWriter.create(el,c,{width:sz,height:sz,padding:sz*.08,showOutline:true,showCharacter:false,strokeColor:'#2B3270',outlineColor:'#E1E5EE',strokeAnimationSpeed:1.1,delayBetweenStrokes:350,charDataLoader:(ch,ok)=>ok(HZDATA[ch])});w.loopCharacterAnimation();}}))});}

/* ---- 1 и 9: игры на весь экран ---- */
function krot(){gameTask(1,'moles8','🔨 Крот: тоны',`<div class="rbox" style="--c1:#5B6BD8;--c2:#2DBE8C"><b>Как играть</b>Как на уроке: наверху — <b>номер тона</b> и его значок. Бей молотком крота, у которого слог <b>с этим тоном</b>! Первое касание открывает игру на весь экран. ${TLEG}</div>`);}
function ninja(){gameTask(9,'ninja8','🥷 Иероглифный ниндзя',`<div class="rbox" style="--c1:#8E5BE8;--c2:#FF5C8A"><b>Как играть</b>Вверх летят наши иероглифы <span class="zh" style="font-size:26px">你 我 好 叫 妈 爸</span>. Наверху — приказ, что рубить. <b>Нажми</b> на нужный иероглиф или <b>проведи</b> по нему пальцем. Чужой — минус жизнь ❤️. Голос читает приказ — нажми 🔊, чтобы послушать ещё.</div>`);}

/* ---- 10: dictation ---- */
const GRID='<svg class="grid" viewBox="0 0 100 100"><g stroke="#FFB3C8" stroke-width=".6" stroke-dasharray="2 2"><line x1="0" y1="0" x2="100" y2="100"/><line x1="100" y1="0" x2="0" y2="100"/><line x1="50" y1="0" x2="50" y2="100"/><line x1="0" y1="50" x2="100" y2="50"/></g></svg>';
const hwOpts=(sz,extra)=>Object.assign({width:sz,height:sz,padding:sz*.08,showOutline:false,showCharacter:false,outlineColor:'#E1E5EE',strokeColor:'#2B3270',radicalColor:'#FF5C8A',drawingColor:'#5B6BD8',drawingWidth:Math.round(sz/16),highlightColor:'#2DBE8C',strokeAnimationSpeed:1.2,delayBetweenStrokes:250,charDataLoader:(ch,ok)=>ok(HZDATA[ch])},extra||{});
function memoOne(el,c,wh,sk,done){const sz=el.clientWidth||280;let mist=0,fin=false;el.innerHTML='';
 const out=r=>{if(fin)return;fin=true;done(r);};
 if(!window.HanziWriter||!HZDATA[c]){wh.textContent='Напиши '+c+' пальцем в воздухе 🙂';later(()=>out({c,mist,skip:0}),1500);return;}
 const w=HanziWriter.create(el,c,hwOpts(sz));
 w.quiz({showHintAfterMisses:false,highlightOnComplete:true,onMistake:()=>{mist++;if(mist===4)wh.textContent='Не получается? Нажми «Не помню» — ничего страшного 🙂';},
  onCorrectStroke:()=>{wh.textContent='Так держать! ✓';},
  onComplete:()=>{if(!document.body.contains(el))return;wh.textContent='✓ Написано!';later(()=>out({c,mist,skip:0}),900);}});
 sk.onclick=()=>{w.cancelQuiz();sk.disabled=true;wh.textContent='Вот так он пишется — запомни 👀';w.showCharacter();later(()=>out({c,mist,skip:1}),2000);};}
function dict(){const n=10;
 shell(`${backBtn}${tag(n)}<h2>📝 Диктант</h2><div class="rbox" style="--c1:#FF5C8A;--c2:#8E5BE8"><b>Правила диктанта</b><div class="rr2"><span>🔊 Слушай слово и пиши иероглиф <b>по памяти</b> — каждую черту по порядку</span><span>🚫 Подсказок нет. Не помнишь — нажми «Не помню», мы покажем, как он пишется</span><span>6 иероглифов: 你 我 好 叫 妈 爸 вперемешку</span></div></div>
  <div class="row" style="justify-content:center"><button class="btn" id="st" style="width:100%">📝 Начать диктант</button></div>`);
 $('#st').onclick=()=>{const order=shuffle(H6),res=[];let k=0;
  const one=()=>{if(k>=order.length)return end();const c=order[k],[py,ru]=HZI[c];
   shell(`${backBtn}${tag(n)}<div class="qcard in" style="padding:12px"><div class="qhead"><span>Иероглиф ${k+1} из ${order.length}</span><span>📝 диктант</span></div>
    <div style="display:flex;align-items:center;justify-content:center;gap:14px;margin-top:6px"><button class="play n" id="pl" style="width:64px;height:64px;font-size:24px;margin:0">🔊</button><div style="text-align:left"><div style="font-weight:900;font-size:24px;color:var(--ink)">«${ru}»</div><small style="font-weight:700;color:var(--mu)">послушай и напиши</small></div></div></div>
    <div class="wbox">${GRID}<div class="hw" id="hw"></div></div><p class="hint2" id="wh" style="text-align:center;margin-top:8px">Пиши по памяти 👇</p>
    <div class="row" style="justify-content:center"><button class="btn g" id="sk">🤷 Не помню</button></div>`);
   const pl=$('#pl');pl.onclick=()=>playW(c,pl);later(()=>playW(c,pl),300);
   memoOne($('#hw'),c,$('#wh'),$('#sk'),r=>{res.push(r);k++;one();});};
  const end=()=>{const self=res.filter(r=>!r.skip).length,clean=res.filter(r=>!r.skip&&r.mist<=2).length;
   finish(n,self,res.length,{clean,res:res.map(r=>[r.c,r.mist,r.skip]),miss:res.filter(r=>r.skip).map(r=>r.c)});
   shell(doneBox(n,`<div class="res" style="text-align:center">📝 ${self} / ${res.length}</div><p class="lead" style="text-align:center">${self===res.length?'Все шесть — по памяти! 🏆':'Сам(а): '+self+' из '+res.length+'. Остальные можно повторить для закрепления 🙂'}</p>
    <div class="ans" style="grid-template-columns:repeat(6,1fr)">${res.map(r=>`<span class="${r.skip?'no':'ok'}" style="font-family:var(--han);font-size:26px;font-weight:400">${r.c}<small style="display:block;font:800 11px Manrope">${r.skip?'не вспомнил(а)':'сам(а)'}</small></span>`).join('')}</div>`));againOn(dict);};
  one();};}


route();
