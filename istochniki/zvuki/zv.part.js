/* ===================== Звуки: все пройденные инициали и финали ===================== */
// Задания — нумерованный список (не станции!). Те же номера — в кабинете учителя (zvuki/uchitel/).
// № 1 — сама таблица звуков (наведи / нажми → русское звучание + звук), № 2–6 — тренировки.
const TASKS=[null,
 {t:'🔊 Таблица звуков',d:'Наведи или нажми на каждый звук: как он звучит по-русски',run:()=>home(true)},
 {t:'👂 Узнай инициаль',d:'Слушай слог: с какой инициали он начинается?',run:tIni},
 {t:'💨 Предыхательный или нет?',d:'b–p · d–t · g–k · z–c · zh–ch',run:tAsp},
 {t:'🔤 Как читается по-русски?',d:'zi «дзы», ci «цы», chi «чшы»…',run:tRu},
 {t:'🎧 Какая финаль?',d:'Слушай слог: a, o, e, i или u?',run:tFin},
 {t:'📝 Диктант: выбери слог',d:'Слушай и выбери, что прозвучало',run:tDict}];
const NT=TASKS.length-1;
let DONE={};try{DONE=JSON.parse(localStorage.getItem('zh-zv-done')||'{}')}catch(e){}
const keep=()=>{try{localStorage.setItem('zh-zv-done',JSON.stringify(DONE))}catch(e){}};
const HW='zv';
const API=/workers\.dev$/.test(location.hostname)?'/api/dz/':'https://gruppa-deti.ch-tutor-world.workers.dev/api/dz/';
let S={};try{S=JSON.parse(localStorage.getItem('zh-zv')||'{}')}catch(e){}
const keepS=()=>{try{localStorage.setItem('zh-zv',JSON.stringify(S))}catch(e){}};S.queue=S.queue||[];S.heard=S.heard||[];
const isTest=()=>/^(учитель|учительница|teacher|тест)$/i.test((S.name||'').trim());
function send(part,data){S.queue=S.queue.filter(q=>q.part!==part);S.queue.push({part,data:Object.assign({},data,{ts:Date.now()})});keepS();flush();}
async function flush(){if(isTest()){S.queue=[];keepS();return;}if(!S.sid||!S.queue.length)return;const q=S.queue[0];
 try{const r=await fetch(API+'save',{method:'POST',headers:{'Content-Type':'text/plain'},body:JSON.stringify({hw:HW,sid:S.sid,name:S.name,part:q.part,data:q.data})});
  if(!r.ok)throw 0;S.queue.shift();keepS();if(S.queue.length)flush();}catch(e){clearTimeout(flush._t);flush._t=setTimeout(flush,15000);}}
addEventListener('online',flush);
function finish(n,ok,of,extra){const prev=DONE[n];const best=prev?Math.max(ok,+String(prev).split('/')[0]||0):ok;DONE[n]=best+'/'+of;keep();send('t'+n,Object.assign({score:ok,of,best},extra||{}));}
const TOP='Звуки китайского';
const NAMEQ=new URLSearchParams(location.search).get('name');
function login(){stopAll();$('#app').innerHTML=`<div class="top n"><span class="zh">声母 韵母</span><div><h1>${TOP}</h1><small>Сначала напиши своё имя</small></div></div>
 <div class="main n" style="text-align:center"><h2>Как тебя зовут?</h2><p class="lead">Имя и первая буква фамилии, например <b>Маша П.</b> — как всегда. Так учитель увидит твои результаты.</p>
 <input id="nm" class="in" style="width:100%;font:inherit;font-size:20px;padding:14px 18px;border:0;outline:none;margin-top:16px;color:var(--ink)" placeholder="Имя и буква фамилии" maxlength="40" value="${esc(NAMEQ||S.name||'')}">
 <div class="row" style="justify-content:center"><button class="btn" id="go">Начать →</button></div></div>`;
 const go=()=>{const v=$('#nm').value.trim();if(v.length<2){toast('Напиши имя');return;}S.name=v;S.sid=S.sid||(Date.now().toString(36)+Math.random().toString(36).slice(2,8));keepS();flush();location.hash='';route();};
 $('#go').onclick=go;$('#nm').onkeydown=e=>{if(e.key==='Enter')go();};}
const nDone=()=>Object.keys(DONE).filter(k=>TASKS[+k]).length;
const pbar=()=>{const d=nDone(),pc=Math.round(d*100/NT);return `<div class="pbar n" id="pbar"><div class="pbt"><span>Выполнено <b>${d}</b> из ${NT}</span><b>${pc}%</b></div><div class="pbl"><i style="width:${pc}%"></i></div></div>`;};
const shell=(h,wide)=>{stopAll();$('#app').classList.toggle('wide',!!wide);$('#app').innerHTML=`<div class="top n"><span class="zh">声母 韵母</span><div><h1>${TOP}</h1><small>${isTest()?'🧑‍🏫 режим учителя — результаты не сохраняются':'Все инициали и финали, которые мы прошли'}</small></div><button class="back n" style="margin:0 0 0 auto;font-size:13px" id="me">${esc(S.name||'')} ✎</button></div>${pbar()}<div class="main n">${h}</div>`;
 $('#me').onclick=()=>login();scrollTo(0,0);};
const backBtn='<button class="back n" onclick="location.hash=\'\'">‹ Все задания</button>';
const tag=n=>`<span class="tag">Задание № ${n}</span>`;
let TM=[];const later=(f,ms)=>{const t=setTimeout(f,ms);TM.push(t);return t;};
function stopAll(){TM.forEach(clearTimeout);TM=[];try{curA&&curA.pause()}catch(e){}hidePop();}
const left=()=>TASKS.map((x,i)=>x&&!DONE[i]?i:0).filter(Boolean);
const leftBox=()=>{const L=left();if(!L.length)return `<div class="allok">🏆 Все ${NT} заданий сделаны! Ты супер!</div>`;
 return `<div class="left"><h3>⏳ Ещё не доделано (${L.length}):</h3>${L.map(i=>`<button data-go="${i}"><span class="no">${i}</span><span>${TASKS[i].t}</span><small>Сделать →</small></button>`).join('')}</div>`;};
const leftOn=()=>document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>{location.hash='#'+b.dataset.go;});
function itogi(){const L=left();send('itogi',{done:nDone(),of:NT,left:L});const D=TASKS.map((x,i)=>x&&DONE[i]?i:0).filter(Boolean);
 shell(`${backBtn}<h2>🏁 Мои итоги</h2><p class="lead">Сделано <b>${nDone()} из ${NT}</b> заданий.</p>${leftBox()}
  ${D.length?`<h3>✓ Сделано</h3><div class="list">${D.map(i=>`<button class="ti n" data-n="${i}"><span class="no" style="background:var(--ok)">${i}</span><span><b>${TASKS[i].t}</b><small>можно пройти ещё раз</small></span><span class="sc7">✓ ${DONE[i]}</span></button>`).join('')}</div>`:''}
  ${L.length?'':'<p class="lead" style="text-align:center">Учитель видит твои результаты. До встречи на уроке! 再见！</p>'}`);
 document.querySelectorAll('[data-n]').forEach(b=>b.onclick=()=>{location.hash='#'+b.dataset.n;});leftOn();}
function route(){if(!S.name){if(NAMEQ){S.name=NAMEQ;S.sid=S.sid||(Date.now().toString(36)+Math.random().toString(36).slice(2,8));keepS();}else return login();}
 const h=location.hash.slice(1);if(h==='itogi')return itogi();const n=+h;if(n===1)return home(true);if(TASKS[n])TASKS[n].run();else home();}
addEventListener('hashchange',route);
const nextN=n=>{for(let i=n+1;i<=NT;i++)if(!DONE[i])return i;for(let i=1;i<n;i++)if(!DONE[i])return i;return 0;};
const doneBox=(n,inner,again)=>{const nx=nextN(n);return `${backBtn}${tag(n)}<h2>${TASKS[n].t} — готово!</h2>${inner}<div class="row">${nx?`<button class="btn" onclick="location.hash='#${nx}'">Задание № ${nx} →</button>`:`<button class="btn" onclick="location.hash='#itogi'">🏁 Мои итоги</button>`}<button class="btn g" onclick="location.hash=''">‹ Все задания</button>${again!==false?`<button class="btn g" id="again">↺ Ещё раз</button>`:''}</div>${nx?'':leftBox()}`;};
const againOn=f=>{const a=$('#again');if(a)a.onclick=f;};

/* ---- universal quiz: one question at a time, the mistake is shown only after the answer ---- */
function quiz(n,{title,items,intro,startTxt}){
 const go=()=>{const Q=items(),res=[],hist=[];let i=0,ok=0;
  const ask=()=>{if(i>=Q.length)return end();const it=Q[i];const [opts,ix]=arrange(it.o,it.r,hist);hist.push(ix);let done=false;
   shell(`${backBtn}${tag(n)}<div class="qcard n"><div class="qhead"><span>Вопрос ${i+1} из ${Q.length}</span><span>✓ ${ok}</span></div>
    <div class="dots">${Q.map((_,j)=>`<i class="${j<i?(res[j].ok?'ok':'no'):j===i?'cur':''}"></i>`).join('')}</div>
    ${it.q}${it.snd?'<button class="play n" id="pl" aria-label="Послушать ещё раз">🔊</button>':''}
    <div class="opts ${it.o.length===3?'o3':''}">${opts.map(x=>`<button class="opt ${it.cls||'py'}" data-v="${esc(x)}">${it.show?it.show(x):esc(x)}</button>`).join('')}</div>
    <div class="fb" id="fb"></div><div id="nx"></div></div>`);
   if(it.snd){const pl=$('#pl');const p=()=>{pl.classList.add('on');Promise.resolve(it.snd()).then(()=>pl.classList.remove('on'));};pl.onclick=p;later(p,150);}
   document.querySelectorAll('.opt').forEach(b=>b.onclick=()=>{if(done)return;done=true;const v=b.dataset.v,right=v===String(it.r);if(right)ok++;
    res.push({q:it.lab||'',a:v,r:String(it.r),ok:right});
    document.querySelectorAll('.opt').forEach(x=>{if(x.dataset.v===String(it.r))x.classList.add('ok');else if(x===b)x.classList.add('no');x.disabled=true;});
    const fb=$('#fb');fb.className='fb '+(right?'ok':'no');fb.innerHTML=(right?'✓ Верно! ':'✗ Правильно: <b>'+esc(it.rshow||it.r)+'</b>. ')+(it.why||'');
    if(it.after)it.after(right);
    $('#nx').innerHTML=`<button class="btn nxt" id="nb">${i+1<Q.length?'Дальше →':'Готово →'}</button>`;$('#nb').onclick=()=>{i++;ask();};
    if(right)later(()=>{if($('#nb')){i++;ask();}},it.wait||1700);});};
  const end=()=>{const miss=res.filter(r=>!r.ok);finish(n,ok,Q.length,{res,miss:miss.map(r=>r.q||r.r)});
   const k=ok/Q.length;
   shell(doneBox(n,`<div class="res" style="text-align:center">${ok} / ${Q.length}</div><p class="lead" style="text-align:center">${ok===Q.length?'Ни одной ошибки! 🏆':k>=.7?'Отлично! Почти всё верно 💪':'Хорошая работа! Это можно повторить для закрепления 🙂'}</p>
    ${miss.length?`<div class="why">${miss.map(r=>`<div>${esc(r.q)} → правильно: <b>${esc(r.r)}</b></div>`).join('')}</div>`:''}`));againOn(()=>quiz(n,{title,items,intro,startTxt}));};
  ask();};
 shell(`${backBtn}${tag(n)}<h2>${title}</h2>${intro}<div class="row" style="justify-content:center"><button class="btn" id="st" style="width:100%">${startTxt||'Начать тренировку →'}</button></div>`);
 introOn();$('#st').onclick=go;}
const pick=(a,k)=>shuffle(a).slice(0,k);
const rnd=a=>a[Math.random()*a.length|0];

/* ===================== данные: только пройденное ===================== */
// инициали (урок 3 — первая строчка, урок 6 — вторая строчка); русское звучание — как на слайдах урока 7
// asp: 1 — предыхательный 💨, 0 — непредыхательный, null — не из пары
const INI=[
 {l:'b',ru:'б',asp:0,pair:'p',grp:'lips'},{l:'p',ru:'п',asp:1,pair:'b',grp:'lips'},{l:'m',ru:'м',asp:null,grp:'lips'},{l:'f',ru:'ф',asp:null,grp:'lips'},
 {l:'d',ru:'д',asp:0,pair:'t',grp:'tip'},{l:'t',ru:'т',asp:1,pair:'d',grp:'tip'},{l:'n',ru:'н',asp:null,grp:'tip'},{l:'l',ru:'л',asp:null,grp:'tip'},
 {l:'g',ru:'г',asp:0,pair:'k',grp:'root'},{l:'k',ru:'к',asp:1,pair:'g',grp:'root'},{l:'h',ru:'х',asp:null,grp:'root'},
 {l:'z',ru:'дз',asp:0,pair:'c',grp:'teeth'},{l:'c',ru:'ц',ru2:'цх',asp:1,pair:'z',grp:'teeth'},{l:'s',ru:'с',asp:0,grp:'teeth'},
 {l:'zh',ru:'дж',asp:0,pair:'ch',grp:'up'},{l:'ch',ru:'ч',ru2:'чх',asp:1,pair:'zh',grp:'up'},{l:'sh',ru:'ш',asp:0,grp:'up'}];
const IN=Object.fromEntries(INI.map(x=>[x.l,x]));
const GRP={lips:['Губы','b p m f','#7C6FFF','#5B4BE0'],tip:['Кончик языка','d t n l','#2DBE8C','#17936A'],root:['Корень языка','g k h','#F5A524','#E07B12'],
 teeth:['Кончик языка у зубов','z c s','#22A6C9','#1479A0'],up:['Язык загнут вверх','zh ch sh','#FF5C8A','#D93A6A']};
const FIN=[{l:'a',ru:'а',s:'ā'},{l:'o',ru:'о',s:'ō'},{l:'e',ru:'э',s:'ē'},{l:'i',ru:'и',s:'ī'},{l:'u',ru:'у',s:'ū'}];
const FN=Object.fromEntries(FIN.map(x=>[x.l,x]));
const ZG=['z','c','s','zh','ch','sh'];
const YI={z:'дзы',c:'цы',s:'сы',zh:'джы',ch:'чшы',sh:'шы'};      // i после z c s zh ch sh = «ы»
const YI_WRONG={z:'дзи',c:'ци',s:'си',zh:'джи',ch:'чи',sh:'ши'};  // так НЕ читается (для вариантов ответа)
const ruSyl=(i,f)=>f==='i'&&ZG.includes(i)?YI[i]:IN[i].ru+FN[f].ru;
const noPuff=(i,f)=>f==='i'&&(i==='c'||i==='ch');
const puffSyl=(i,f)=>IN[i].asp===1&&!noPuff(i,f);
// слоги, которые есть в языке и для которых есть звук (иероглиф в audio-map → mp3 синтезатора)
const tonesOf=b=>[1,2,3,4].filter(t=>SYL.variant(b,t));
const SY=[];INI.forEach(I=>FIN.forEach(F=>{const b=I.l+F.l;if(tonesOf(b).length)SY.push({i:I.l,f:F.l,b});}));
const firstT=b=>tonesOf(b)[0];
const sylS=(b,t)=>mark(b,t);
// чистый звук инициали — запись учителя (b0 … h0); у z c s zh ch sh записи нет — звучит слог с a
const CLEAN=['b','p','m','f','d','t','n','l','g','k','h'];
const iniDemo=l=>CLEAN.includes(l)?null:{b:l+'a',t:firstT(l+'a')};

/* ===================== звук (без пауз: всё заранее загружено) ===================== */
const AC={};
function aud(u){let a=AC[u];if(!a){a=new Audio(u);a.preload='auto';AC[u]=a;}return a;}
let unlockHint=false;
function play(u,el){return new Promise(res=>{const a=aud(u);try{if(curA&&curA!==a)curA.pause();}catch(e){}curA=a;el&&el.classList.add('on');let d=false;
 const end=ok=>{if(d)return;d=true;el&&el.classList.remove('on');res(ok);};
 try{a.currentTime=0;}catch(e){}a.onended=()=>end(true);a.onerror=()=>end(false);
 a.play().catch(e=>{if(e&&e.name==='NotAllowedError'&&!unlockHint){unlockHint=true;toast('Нажми на звук один раз — дальше он будет звучать сам, когда наводишь мышку');}end(false);});});}
const sylURL=(b,t)=>{const v=SYL.variant(b,t);return v?fn(v.c):null;};
async function playSyl(b,t,el){const u=sylURL(b,t||firstT(b));if(u)return play(u,el);}
async function playIni(l,el){if(CLEAN.includes(l)){if(await play(VOICE+l+'0.wav',el))return;return playSyl(l+(l==='f'?'u':'a'),0,el);}const d=iniDemo(l);return playSyl(d.b,d.t,el);}
const playFin=(l,el)=>playSyl(l==='i'?'i':l,0,el);
// заранее грузим то, что звучит при наведении (инициали, финали, первый тон каждого слога); остальные тоны — когда открылась подсказка
function preload(){CLEAN.forEach(l=>aud(VOICE+l+'0.wav'));INI.forEach(I=>{const d=iniDemo(I.l);if(d)aud(sylURL(d.b,d.t));});FIN.forEach(F=>aud(sylURL(F.l,firstT(F.l))));SY.forEach(s=>aud(sylURL(s.b,firstT(s.b))));}
// кнопки звука внутри правил
function introOn(){document.querySelectorAll('[data-sy]').forEach(b=>b.onclick=e=>{e.stopPropagation();const [x,t]=b.dataset.sy.split('|');playSyl(x,+t,b);});}

/* ===================== всплывающая подсказка (наведи — на телефоне нажми) ===================== */
const PUFF='<span class="puff">💨 предыхательный</span>',NOP='<span class="nopf">непредыхательный</span>';
function popIni(l){const I=IN[l],g=GRP[I.grp],ex=FIN.map(F=>I.l+F.l).filter(b=>tonesOf(b).length);
 return `<div class="pp-h" style="--a:${g[2]};--b:${g[3]}"><b class="pp-l">${l}</b><span class="pp-eq">=</span><b class="pp-r">«${I.ru2||I.ru}»</b></div>
 <div class="pp-tag">${I.asp===1?PUFF:I.asp===0?NOP:''}<span class="pp-g">${g[0]}</span></div>
 ${CLEAN.includes(l)?'':`<div class="pp-n">Звучит слог <b>${sylS(I.l+'a',firstT(I.l+'a'))}</b></div>`}
 <div class="pp-x">${ex.map(b=>`<button data-sy="${b}|${firstT(b)}"><b>${sylS(b,firstT(b))}</b><small>${ruSyl(I.l,b.slice(I.l.length))}</small></button>`).join('')}</div>`;}
function popFin(l){const F=FN[l];
 return `<div class="pp-h" style="--a:#5B6BD8;--b:#2B3270"><b class="pp-l">${l}</b><span class="pp-eq">=</span><b class="pp-r">«${F.ru}»</b></div>
 ${l==='i'?'<div class="pp-warn">⚠️ После <b>z c s zh ch sh</b> буква i читается <b>«ы»</b>!</div>':''}
 <div class="pp-x">${tonesOf(l).map(t=>`<button data-sy="${l}|${t}"><b>${sylS(l,t)}</b><small>${t}-й тон</small></button>`).join('')}</div>`;}
function popSyl(b){const s=SY.find(x=>x.b===b);
 return `<div class="pp-h" style="--a:${GRP[IN[s.i].grp][2]};--b:${GRP[IN[s.i].grp][3]}"><b class="pp-l">${b}</b><span class="pp-eq">=</span><b class="pp-r">«${ruSyl(s.i,s.f)}»</b></div>
 <div class="pp-tag">${puffSyl(s.i,s.f)?PUFF:''}${noPuff(s.i,s.f)?'<span class="pp-hot">без 💨! предыхание исчезает</span>':''}${s.f==='i'&&ZG.includes(s.i)&&!noPuff(s.i,s.f)?'<span class="pp-hot">i = «ы»</span>':''}</div>
 <div class="pp-x">${tonesOf(b).map(t=>`<button data-sy="${b}|${t}"><b>${sylS(b,t)}</b><small>${t}-й тон</small></button>`).join('')}</div>`;}
let POPT=0,POPEL=null;
function showPop(el){const p=$('#pop');if(!p)return;const k=el.dataset;
 p.innerHTML=(k.ini?popIni(k.ini):k.fin?popFin(k.fin):popSyl(k.syl))+'<button class="pp-close" aria-label="Закрыть">✕</button>';
 p.hidden=false;POPEL=el;document.querySelectorAll('.zc.cur').forEach(x=>x.classList.remove('cur'));el.classList.add('cur');
 p.querySelectorAll('[data-sy]').forEach(b=>{const [x,t]=b.dataset.sy.split('|');aud(sylURL(x,+t));b.onclick=e=>{e.stopPropagation();playSyl(x,+t,b);};});
 p.querySelector('.pp-close').onclick=e=>{e.stopPropagation();hidePop();};
 if(matchMedia('(max-width:700px)').matches){p.className='pop sheet';p.style.left=p.style.top='';return;}
 p.className='pop';const r=el.getBoundingClientRect(),pw=p.offsetWidth,ph=p.offsetHeight;
 let x=r.left+r.width/2-pw/2;x=Math.max(10,Math.min(innerWidth-pw-10,x));let y=r.bottom+10;if(y+ph>innerHeight-10)y=r.top-ph-10;if(y<10)y=10;
 p.style.left=x+'px';p.style.top=y+'px';}
function hidePop(){const p=$('#pop');if(p)p.hidden=true;POPEL=null;document.querySelectorAll('.zc.cur').forEach(x=>x.classList.remove('cur'));}
function sound(el){const k=el.dataset;if(k.ini)return playIni(k.ini,el);if(k.fin)return playFin(k.fin,el);return playSyl(k.syl,0,el);}
function heard(el){const k=el.dataset.ini||el.dataset.fin;if(!k)return;el.classList.add('seen');if(!S.heard.includes(k)){S.heard.push(k);keepS();
 const m=$('#hcnt');if(m)m.innerHTML=hcnt();if(S.heard.length>=22&&!DONE[1]){finish(1,22,22,{heard:S.heard.slice()});const pb=$('#pbar');if(pb)pb.outerHTML=pbar();toast('🏆 Задание № 1 готово: ты послушал(а) все звуки!');const m2=$('#hcnt');if(m2)m2.innerHTML=hcnt();}}}
const hcnt=()=>{const h=S.heard.length;return DONE[1]?'✓ Задание № 1 сделано: все 22 звука прослушаны':`Прослушано <b>${Math.min(h,22)}</b> из 22 звуков (17 инициалей и 5 финалей)`;};
const hover=matchMedia('(hover:hover) and (pointer:fine)').matches;
function bindCells(){document.querySelectorAll('.zc').forEach(el=>{
  if(hover){el.addEventListener('mouseenter',()=>{clearTimeout(POPT);if(POPEL===el)return;showPop(el);sound(el);heard(el);});
   el.addEventListener('mouseleave',()=>{clearTimeout(POPT);POPT=setTimeout(hidePop,350);});}
  el.addEventListener('click',e=>{e.stopPropagation();clearTimeout(POPT);showPop(el);sound(el);heard(el);});});
 const p=$('#pop');p.onmouseenter=()=>clearTimeout(POPT);p.onmouseleave=()=>{if(hover){POPT=setTimeout(hidePop,350);}};p.onclick=e=>e.stopPropagation();}
document.addEventListener('click',()=>{if(POPEL)hidePop();});

/* ===================== главная: № 1 таблица + список тренировок ===================== */
const iniCard=l=>{const I=IN[l];return `<button class="zc zi${S.heard.includes(l)?' seen':''}" data-ini="${l}" style="--a:${GRP[I.grp][2]};--b:${GRP[I.grp][3]}"><b>${l}</b>${I.asp===1?'<i class="pf">💨</i>':''}<span class="ru">«${I.ru2||I.ru}»</span></button>`;};
const finCard=l=>`<button class="zc zf${S.heard.includes(l)?' seen':''}" data-fin="${l}"><b>${l}</b><span class="ru">«${FN[l].ru}»</span></button>`;
const grpBox=g=>{const G=GRP[g];return `<div class="zg" style="--a:${G[2]};--b:${G[3]}"><div class="zgh">${G[0]}</div><div class="zgr">${INI.filter(x=>x.grp===g).map(x=>iniCard(x.l)).join('')}</div></div>`;};
function sylTable(){return `<div class="stw"><table class="st"><tr><th></th>${FIN.map(F=>`<th>${F.l}</th>`).join('')}</tr>
 ${INI.map(I=>`<tr><th style="color:${GRP[I.grp][3]}">${I.l}</th>${FIN.map(F=>{const b=I.l+F.l;if(!tonesOf(b).length)return '<td></td>';
   const hot=F.l==='i'&&ZG.includes(I.l);return `<td><button class="zc zs${hot?' hot':''}${noPuff(I.l,F.l)?' np':''}" data-syl="${b}">${b}</button></td>`;}).join('')}</tr>`).join('')}</table></div>`;}
function home(scroll){const nx=TASKS.findIndex((x,i)=>x&&!DONE[i]);
 shell(`<div class="hero"><div class="tg">${tag(1)}</div><h2>🔊 Таблица звуков</h2><p class="lead">${hover?'<b>Наведи мышку</b>':'<b>Нажми</b>'} на любой звук: увидишь, как он звучит <b>по-русски</b>, и услышишь его. Послушай <b>все 22 звука</b> — это задание № 1.</p>
  <div class="hc" id="hcnt">${hcnt()}</div></div>
  <h3 class="zh3">声母 <span>Инициали — начало слога</span></h3>
  <div class="zgs">${['lips','tip','root'].map(grpBox).join('')}</div>
  <div class="zgs two">${['teeth','up'].map(grpBox).join('')}</div>
  <div class="lgd"><span><i class="pf">💨</i> <b>предыхательные</b>: p t k c ch — с сильным выдохом</span><span><b>b d g z zh</b> — непредыхательные, без выдоха</span></div>
  <h3 class="zh3">韵母 <span>Финали — конец слога</span></h3>
  <div class="zfs">${FIN.map(F=>finCard(F.l)).join('')}</div>
  <div class="zwarn big"><div class="k2">⚠️ Самое важное правило</div>
   <div class="h">После z c s zh ch sh буква <u>i</u> читается «ы»</div>
   <div class="zrow6">${ZG.map(l=>`<button data-sy="${l}i|${firstT(l+'i')}" class="${noPuff(l,'i')?'hot':''}"><b>${l}i</b><small>«${YI[l]}»</small></button>`).join('')}</div>
   <div class="h2w">ci = «цы», chi = «чшы» — ПРЕДЫХАНИЕ ИСЧЕЗАЕТ!</div>
   <p>Сами по себе <b>c</b> и <b>ch</b> предыхательные 💨. Но вместе с <b>i</b> выдох пропадает: <b>ci</b> = «цы», <b>chi</b> = «чшы».</p></div>
  <h3 class="zh3">拼音 <span>Инициаль + финаль = слог</span></h3>
  <p class="lead" style="margin-top:0">${hover?'Наведи':'Нажми'} на слог — услышишь его и увидишь все тоны. Розовые клетки — где i читается «ы».</p>
  ${sylTable()}
  <h3 class="zh3" style="margin-top:28px">🏋️ <span>Тренировки</span></h3>
  <div class="list">${TASKS.map((x,i)=>{if(!x||i===1)return '';return `<button class="ti n${i===nx?' hot':''}${DONE[i]?'':' todo'}" data-n="${i}"><span class="no" style="${DONE[i]?'background:var(--ok)':i===nx?'background:var(--ac)':''}">${i}</span><span><b>${x.t}</b><small>${x.d}</small></span><span class="sc7">${DONE[i]?'✓ '+DONE[i]:''}</span></button>`;}).join('')}</div>
  <div class="row" style="justify-content:center"><button class="btn" id="it">🏁 Мои итоги</button></div>`,true);
 $('#app').insertAdjacentHTML('beforeend','<div class="pop" id="pop" hidden></div>');
 bindCells();introOn();
 document.querySelectorAll('[data-n]').forEach(b=>b.onclick=()=>{location.hash='#'+b.dataset.n;});$('#it').onclick=()=>{location.hash='#itogi';};
 if(scroll===true)later(()=>{const h=document.querySelector('.hero');h&&h.scrollIntoView({block:'start'});},50);}

/* ===================== № 2 узнай инициаль ===================== */
const ruleIni=`<div class="rbox" style="--c1:#5B6BD8;--c2:#8E5BE8"><b>Как делать</b>Прозвучит слог. Слушай <b>самое начало</b> — это инициаль. Выбери её. Кнопка 🔊 — послушать ещё раз.</div>`;
function tIni(){quiz(2,{title:'👂 Узнай инициаль',intro:ruleIni,
 items:()=>{const L=shuffle(INI.map(x=>x.l)).concat(shuffle(INI.map(x=>x.l))).slice(0,10);return L.map(l=>{const I=IN[l];const ss=SY.filter(s=>s.i===l&&!(noPuff(s.i,s.f)));const s=rnd(ss);const t=rnd(tonesOf(s.b));
  const others=new Set();if(I.pair)others.add(I.pair);const near={s:'sh',sh:'s',z:'zh',zh:'z',c:'ch',ch:'c',n:'l',l:'n',f:'h',h:'f',m:'n'}[l];if(near)others.add(near);
  shuffle(INI.map(x=>x.l)).forEach(x=>{if(others.size<3&&x!==l)others.add(x);});
  const o=[l,...[...others].slice(0,3)];return {q:'<div class="qq">С какой инициали начинается слог?</div>',snd:()=>playSyl(s.b,t),o,r:l,cls:'py',
   why:`Это <b>${sylS(s.b,t)}</b> — «${ruSyl(s.i,s.f)}».`,lab:sylS(s.b,t)+' — инициаль?'};});}});}

/* ===================== № 3 предыхательный или нет ===================== */
const AO=['💨 предыхательный','непредыхательный'];
const ruleAsp=`<div class="rbox" style="--c1:#22A6C9;--c2:#5B6BD8"><b>Правило</b><div class="rr2"><span>💨 <b>p t k c ch</b> — предыхательные: с сильным выдохом</span><span><b>b d g z zh</b> — непредыхательные: без выдоха</span></div></div>
 <div class="tip" style="font-size:16px">Проверь рукой или листочком у рта: на 💨 он дрожит. Послушай пары: ${[['ba','pa'],['da','ta'],['ge','ke'],['za','ca'],['zha','cha']].map(([a,b])=>`<button class="chip n" data-sy="${a}|${firstT(a)}">${sylS(a,firstT(a))}</button>–<button class="chip n" data-sy="${b}|${firstT(b)}">${sylS(b,firstT(b))} 💨</button>`).join(' ')}</div>`;
function tAsp(){quiz(3,{title:'💨 Предыхательный или нет?',intro:ruleAsp,
 items:()=>{const P=SY.filter(s=>IN[s.i].pair&&s.f!=='i');const asp=shuffle(P.filter(s=>IN[s.i].asp===1)).slice(0,5),no=shuffle(P.filter(s=>IN[s.i].asp===0)).slice(0,5);
  return shuffle(asp.concat(no)).map(s=>{const t=rnd(tonesOf(s.b));const r=IN[s.i].asp===1?AO[0]:AO[1];
   return {q:'<div class="qq">Слушай: есть сильный выдох?</div>',snd:()=>playSyl(s.b,t),o:AO,r,cls:'tx',
    why:`Это <b>${sylS(s.b,t)}</b>: ${IN[s.i].asp===1?`<b>${s.i}</b> — предыхательный 💨, пара к ${IN[s.i].pair}`:`<b>${s.i}</b> — непредыхательный, пара к ${IN[s.i].pair} 💨`}.`,lab:sylS(s.b,t)};});}});}

/* ===================== № 4 как читается по-русски ===================== */
const ruleRu=`<div class="zwarn"><div class="k2">⚠️ Запомни</div><div class="h">После z c s zh ch sh: i = «ы»</div>
 <div class="zrow6 sm">${ZG.map(l=>`<button data-sy="${l}i|${firstT(l+'i')}" class="${noPuff(l,'i')?'hot':''}"><b>${l}i</b><small>«${YI[l]}»</small></button>`).join('')}</div>
 <p><b>ci</b> = «цы», <b>chi</b> = «чшы» — предыхание исчезает!</p></div>`;
function ruOpts(i,f){const r=ruSyl(i,f);if(f==='i'&&ZG.includes(i)){const alt={z:'цы',c:'сы',s:'шы',zh:'дзы',ch:'шы',sh:'сы'}[i];return [r,YI_WRONG[i],alt];}
 const o=new Set([r]);if(IN[i].pair)o.add(IN[i].ru+FN[f].ru);[...shuffle(INI)].forEach(I=>{if(o.size<3&&I.l!==i)o.add(I.ru+FN[f].ru);});return [...o].slice(0,3);}
function tRu(){quiz(4,{title:'🔤 Как читается по-русски?',intro:ruleRu,
 items:()=>{const zi=ZG.map(l=>SY.find(s=>s.b===l+'i')).filter(Boolean);const oth=shuffle(SY.filter(s=>!(s.f==='i'&&ZG.includes(s.i)))).slice(0,4);
  return shuffle(zi.concat(oth)).map(s=>{const t=rnd(tonesOf(s.b));const o=ruOpts(s.i,s.f);
   return {q:`<div class="qq">Как читается этот слог?</div><div class="big7">${sylS(s.b,t)}</div>`,o,r:o[0],cls:'tx ru',show:x=>'«'+esc(x)+'»',rshow:'«'+o[0]+'»',
    why:noPuff(s.i,s.f)?'Вместе с i выдох пропадает!':s.f==='i'&&ZG.includes(s.i)?'После z c s zh ch sh i = «ы».':'',after:()=>playSyl(s.b,t),wait:2000,lab:sylS(s.b,t)};});}});}

/* ===================== № 5 какая финаль ===================== */
const ruleFin=`<div class="rbox" style="--c1:#2DBE8C;--c2:#5B6BD8"><b>Как делать</b>Прозвучит слог. Слушай <b>конец</b> — это финаль. Помни: после z c s zh ch sh финаль <b>i</b> звучит «ы».</div>
 <div class="zfs sm">${FIN.map(F=>`<button class="chip n" data-sy="${F.l}|${firstT(F.l)}">${F.l} «${F.ru}»</button>`).join('')}</div>`;
function tFin(){quiz(5,{title:'🎧 Какая финаль?',intro:ruleFin,
 items:()=>{const L=[];const fs=shuffle(FIN.map(F=>F.l).concat(FIN.map(F=>F.l)));fs.forEach(f=>{const c=SY.filter(s=>s.f===f);L.push(rnd(c));});
  return L.map(s=>{const t=rnd(tonesOf(s.b));const o=[s.f,...pick(FIN.map(F=>F.l).filter(x=>x!==s.f),2)];
   return {q:'<div class="qq">Какая финаль в конце слога?</div>',snd:()=>playSyl(s.b,t),o,r:s.f,cls:'py',show:x=>esc(x)+(x==='i'&&ZG.includes(s.i)?'<small>«ы»</small>':`<small>«${FN[x].ru}»</small>`),
    why:`Это <b>${sylS(s.b,t)}</b> — «${ruSyl(s.i,s.f)}».`,lab:sylS(s.b,t)+' — финаль?'};});}});}

/* ===================== № 6 диктант: выбери слог ===================== */
const ruleDict=`<div class="rbox" style="--c1:#FF5C8A;--c2:#F5A524"><b>Диктант, как на уроке</b>Прозвучит слог — выбери, какой. Тон не важен, важны <b>инициаль и финаль</b>. Не спеши: можно послушать ещё раз 🔊</div>`;
function tDict(){quiz(6,{title:'📝 Диктант: выбери слог',intro:ruleDict,
 items:()=>{const L=shuffle(SY).slice(0,10);return L.map(s=>{const t=rnd(tonesOf(s.b));const o=new Set([s.b]);
  const near={s:'sh',sh:'s',z:'zh',zh:'z',c:'ch',ch:'c',n:'l',l:'n',f:'h',h:'f'}[s.i];
  [IN[s.i].pair,near].forEach(x=>{if(x&&SY.find(y=>y.b===x+s.f))o.add(x+s.f);});
  shuffle(SY.filter(y=>y.f===s.f)).forEach(y=>{if(o.size<4)o.add(y.b);});
  shuffle(SY.filter(y=>y.i===s.i)).forEach(y=>{if(o.size<4)o.add(y.b);});
  return {q:'<div class="qq">Какой слог прозвучал?</div>',snd:()=>playSyl(s.b,t),o:[...o].slice(0,4),r:s.b,cls:'py',
   why:`Это <b>${sylS(s.b,t)}</b> — «${ruSyl(s.i,s.f)}».`,lab:sylS(s.b,t)};});}});}

preload();route();
