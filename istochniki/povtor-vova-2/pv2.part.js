/* ===================== Повторение 2 для Володи: звуки и тоны ===================== */
// 2026-11-13. Составлено по его ошибкам: тоны на слух (диктант урока 8 — 4/10, всё время «1» или «3»),
// b–p / d–t / g–k, n–l, f–h, m–n, e–a (tè → ta, dé → da), ДЗ 7 и урок 7 пропущены (z c s zh ch sh, ci/chi).
// Задания — НУМЕРОВАННЫЙ СПИСОК (не станции!). Те же номера — в кабинете учителя (povtor-vova-2/uchitel/).
// Механики не повторяют ДЗ 8: рисуем тон, сравниваем тоны, собираем слог, ищем ошибку, соединяем, записываем голос, ракета.
const TASKS=[null,
 {t:'✍️ Нарисуй тон',d:'Слушай слог и нарисуй пальцем, куда идёт голос',run:tDraw},
 {t:'👯 Тоны: одинаковые или разные?',d:'Два слога подряд: тон у них одинаковый?',run:tSame},
 {t:'🧩 Собери слог',d:'Инициаль + финаль + тон: собери то, что слышишь',run:tBuild},
 {t:'🧺 Близнецы: n–l, f–h, m–n',d:'Похожие звуки: какой прозвучал?',run:tTwins},
 {t:'🔍 Найди ошибку',d:'Слушай и проверь: слог написан верно?',run:tCheck},
 {t:'⚠️ z c s zh ch sh',d:'ci = «цы», chi = «чшы»: соедини и послушай',run:tZh},
 {t:'🎙️ Скажи сам',d:'Запиши пары b–p, d–t, g–k, n–l — учитель послушает',run:tSay},
 {t:'🚀 Игра «Звуковая ракета»',d:'Лети в ворота с нужным тоном или звуком',run:tGame}];
const NT=TASKS.length-1;
let DONE={};try{DONE=JSON.parse(localStorage.getItem('zh-pv2-done')||'{}')}catch(e){}
const keep=()=>{try{localStorage.setItem('zh-pv2-done',JSON.stringify(DONE))}catch(e){}};
const HW='pv2';
const API=/workers\.dev$/.test(location.hostname)?'/api/dz/':'https://gruppa-deti.ch-tutor-world.workers.dev/api/dz/';
let S={};try{S=JSON.parse(localStorage.getItem('zh-pv2')||'{}')}catch(e){}
const keepS=()=>{try{localStorage.setItem('zh-pv2',JSON.stringify(S))}catch(e){}};S.queue=S.queue||[];
const isTest=()=>/^(учитель|учительница|teacher|тест)$/i.test((S.name||'').trim());
const newSid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,8);
function send(part,data){S.queue=S.queue.filter(q=>q.part!==part);S.queue.push({part,data:Object.assign({},data,{ts:Date.now()})});keepS();flush();}
async function flush(){if(isTest()){S.queue=[];keepS();return;}if(!S.sid||!S.queue.length)return;const q=S.queue[0];
 try{const r=await fetch(API+'save',{method:'POST',headers:{'Content-Type':'text/plain'},body:JSON.stringify({hw:HW,sid:S.sid,name:S.name,part:q.part,data:q.data})});
  if(!r.ok)throw 0;S.queue.shift();keepS();if(S.queue.length)flush();}catch(e){clearTimeout(flush._t);flush._t=setTimeout(flush,15000);}}
addEventListener('online',flush);
function finish(n,ok,of,extra){const prev=DONE[n];const best=prev?Math.max(ok,+String(prev).split('/')[0]||0):ok;DONE[n]=best+'/'+of;keep();send('t'+n,Object.assign({score:ok,of,best},extra||{}));}
const TOP='Повторение 2: звуки и тоны';
const NAMEQ=new URLSearchParams(location.search).get('name');
function login(){stopAll();$('#app').innerHTML=`<div class="top n"><span class="py tmk">ā á ǎ à</span><div><h1>${TOP}</h1><small>Сначала напиши своё имя</small></div></div>
 <div class="main n" style="text-align:center"><h2>Как тебя зовут?</h2><p class="lead">Имя и первая буква фамилии — как всегда. Так учитель увидит твои результаты.</p>
 <input id="nm" class="in" style="width:100%;font:inherit;font-size:20px;padding:14px 18px;border:0;outline:none;margin-top:16px;color:var(--ink)" placeholder="Имя и буква фамилии" maxlength="40" value="${esc(NAMEQ||S.name||'')}">
 <div class="row" style="justify-content:center"><button class="btn" id="go">Начать →</button></div></div>`;
 const go=()=>{const v=$('#nm').value.trim();if(v.length<2){toast('Напиши имя');return;}S.name=v;S.sid=S.sid||newSid();keepS();flush();location.hash='';route();};
 $('#go').onclick=go;$('#nm').onkeydown=e=>{if(e.key==='Enter')go();};}
const nDone=()=>Object.keys(DONE).filter(k=>TASKS[+k]).length;
const pbar=()=>{const d=nDone(),pc=Math.round(d*100/NT);return `<div class="pbar n" id="pbar"><div class="pbt"><span>Выполнено <b>${d}</b> из ${NT}</span><b>${pc}%</b></div><div class="pbl"><i style="width:${pc}%"></i></div></div>`;};
const shell=h=>{stopAll();$('#app').innerHTML=`<div class="top n"><span class="py tmk">ā á ǎ à</span><div><h1>${TOP}</h1><small>${isTest()?'🧑‍🏫 режим учителя — результаты не сохраняются':'Тренировка ушей и голоса'}</small></div><button class="back n" style="margin:0 0 0 auto;font-size:13px" id="me">${esc(S.name||'')} ✎</button></div>${pbar()}<div class="main n">${h}</div>`;
 $('#me').onclick=()=>login();scrollTo(0,0);};
const backBtn='<button class="back n" onclick="location.hash=\'\'">‹ Все задания</button>';
const tag=n=>`<span class="tag">Задание № ${n}</span>`;
let TM=[];const later=(f,ms)=>{const t=setTimeout(f,ms);TM.push(t);return t;};
function stopAll(){TM.forEach(clearTimeout);TM=[];try{curA&&curA.pause()}catch(e){}if(KCUR){try{KCUR.destroy()}catch(e){}KCUR=null;}recStop();}
const left=()=>TASKS.map((x,i)=>x&&!DONE[i]?i:0).filter(Boolean);
const leftBox=()=>{const L=left();if(!L.length)return `<div class="allok">🏆 Все ${NT} заданий сделаны! Ты супер!</div>`;
 return `<div class="left"><h3>⏳ Ещё не доделано (${L.length}):</h3>${L.map(i=>`<button data-go="${i}"><span class="no">${i}</span><span>${TASKS[i].t}</span><small>Сделать →</small></button>`).join('')}</div>`;};
const leftOn=()=>document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>{location.hash='#'+b.dataset.go;});
function itogi(){const L=left();send('itogi',{done:nDone(),of:NT,left:L});const D=TASKS.map((x,i)=>x&&DONE[i]?i:0).filter(Boolean);
 shell(`${backBtn}<h2>🏁 Мои итоги</h2><p class="lead">Сделано <b>${nDone()} из ${NT}</b> заданий.</p>${leftBox()}
  ${D.length?`<h3>✓ Сделано</h3><div class="list">${D.map(i=>`<button class="ti n" data-n="${i}"><span class="no" style="background:var(--ok)">${i}</span><span><b>${TASKS[i].t}</b><small>можно пройти ещё раз</small></span><span class="sc7">✓ ${DONE[i]}</span></button>`).join('')}</div>`:''}
  ${L.length?'':'<p class="lead" style="text-align:center">Учитель видит твои результаты и слышит твои записи. До встречи на уроке! Zàijiàn!</p>'}`);
 document.querySelectorAll('[data-n]').forEach(b=>b.onclick=()=>{location.hash='#'+b.dataset.n;});leftOn();}
function route(){if(!S.name){if(NAMEQ){S.name=NAMEQ;S.sid=S.sid||newSid();keepS();}else return login();}
 const h=location.hash.slice(1);if(h==='itogi')return itogi();const n=+h;if(TASKS[n])TASKS[n].run();else home();}
addEventListener('hashchange',route);
const nextN=n=>{for(let i=n+1;i<=NT;i++)if(!DONE[i])return i;for(let i=1;i<n;i++)if(!DONE[i])return i;return 0;};
const nextBtns=n=>{const nx=nextN(n);return `<div class="row">${nx?`<button class="btn" onclick="location.hash='#${nx}'">Задание № ${nx} →</button>`:`<button class="btn" onclick="location.hash='#itogi'">🏁 Мои итоги</button>`}<button class="btn g" onclick="location.hash=''">‹ Все задания</button><button class="btn g" id="again">↺ Ещё раз</button></div>${nx?'':leftBox()}`;};
const doneBox=(n,inner)=>`${backBtn}${tag(n)}<h2>${TASKS[n].t} — готово!</h2>${inner}${nextBtns(n)}`;
const againOn=f=>{const a=$('#again');if(a)a.onclick=f;leftOn();};
const praise=(ok,of)=>ok===of?'Ни одной ошибки! 🏆':ok/of>=.7?'Отлично! Почти всё верно 💪':'Хорошая работа! Это можно повторить для закрепления 🙂';
const pick=(a,k)=>shuffle(a).slice(0,k);
const rnd=a=>a[Math.random()*a.length|0];
// два варианта ответа: один и тот же ответ не больше двух раз подряд
function noTriple(list,cat){for(let k=0;k<300;k++){const a=shuffle(list);if(a.every((x,i)=>i<2||!(cat(x)===cat(a[i-1])&&cat(x)===cat(a[i-2]))))return a;}return list;}

/* ===================== данные: только пройденное ===================== */
const INI=[
 {l:'b',ru:'б',asp:0,pair:'p'},{l:'p',ru:'п',asp:1,pair:'b'},{l:'m',ru:'м',asp:null},{l:'f',ru:'ф',asp:null},
 {l:'d',ru:'д',asp:0,pair:'t'},{l:'t',ru:'т',asp:1,pair:'d'},{l:'n',ru:'н',asp:null},{l:'l',ru:'л',asp:null},
 {l:'g',ru:'г',asp:0,pair:'k'},{l:'k',ru:'к',asp:1,pair:'g'},{l:'h',ru:'х',asp:null},
 {l:'z',ru:'дз',asp:0,pair:'c'},{l:'c',ru:'ц',asp:1,pair:'z'},{l:'s',ru:'с',asp:0},
 {l:'zh',ru:'дж',asp:0,pair:'ch'},{l:'ch',ru:'ч',asp:1,pair:'zh'},{l:'sh',ru:'ш',asp:0}];
const IN=Object.fromEntries(INI.map(x=>[x.l,x]));
const FIN=[{l:'a',ru:'а'},{l:'o',ru:'о'},{l:'e',ru:'э'},{l:'i',ru:'и'},{l:'u',ru:'у'}];
const FN=Object.fromEntries(FIN.map(x=>[x.l,x]));
const ZG=['z','c','s','zh','ch','sh'];
const YI={z:'дзы',c:'цы',s:'сы',zh:'джы',ch:'чшы',sh:'шы'};
const ruSyl=(i,f)=>f==='i'&&ZG.includes(i)?YI[i]:IN[i].ru+FN[f].ru;
const NEAR={n:'l',l:'n',f:'h',h:'f',m:'n',s:'sh',sh:'s',z:'zh',zh:'z',c:'ch',ch:'c'};
const tonesOf=b=>[1,2,3,4].filter(t=>SYL.variant(b,t));
const firstT=b=>tonesOf(b)[0];
const sylS=(b,t)=>mark(b,t);
const parse=s=>{const b=SYL.plain(s),t=SYL.tone(s),[i,f]=split(b);return {s,b,t,i,f};};
const TC={1:'#1FA77A',2:'#E8910C',3:'#6A5BFF',4:'#F0407A'};
const TNM={1:'1-й тон: ровно и высоко',2:'2-й тон: вверх, как вопрос «а?»',3:'3-й тон: ямка — вниз и вверх',4:'4-й тон: резко вниз, как «Стоп!»'};
const TSH={1:'ровно',2:'вверх',3:'ямка',4:'вниз'};
const tsp=s=>`<span class="py" style="color:${TC[SYL.tone(s)]||'var(--ac2)'}">${esc(s)}</span>`;
// значки тонов (как на уроке)
const MKP=['','M8 30 H72','M16 46 L64 12','M10 14 L40 46 L70 14','M16 12 L64 46'];
const msv=(t,c,h)=>`<svg viewBox="0 0 80 60" style="height:${h||'1em'};width:auto;vertical-align:middle;overflow:visible"><path d="${MKP[t]}" fill="none" stroke="${c||'currentColor'}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

/* ===================== звук: заранее загружен, без пауз ===================== */
const AC={};
function aud(u){let a=AC[u];if(!a){a=new Audio(u);a.preload='auto';AC[u]=a;}return a;}
let unlockHint=false;
function play(u,el){return new Promise(res=>{if(!u)return res(false);const a=aud(u);try{if(curA&&curA!==a)curA.pause();}catch(e){}curA=a;el&&el.classList.add('on');let d=false;
 const end=ok=>{if(d)return;d=true;el&&el.classList.remove('on');res(ok);};
 try{a.currentTime=0;}catch(e){}a.onended=()=>end(true);a.onerror=()=>end(false);setTimeout(()=>end(true),4000);
 a.play().catch(e=>{if(e&&e.name==='NotAllowedError'&&!unlockHint){unlockHint=true;toast('Нажми 🔊, чтобы услышать слог');}end(false);});});}
const sylURL=(b,t)=>{const v=SYL.variant(b,t);return v?fn(v.c):null;};
const playSyl=(b,t,el)=>play(sylURL(b,t||firstT(b)),el);
const sayS=(s,el)=>{const p=parse(s);return playSyl(p.b,p.t,el);};
const pre=list=>list.forEach(s=>{const p=parse(s);const u=sylURL(p.b,p.t);if(u)aud(u);});
function sndOn(){document.querySelectorAll('[data-sy]').forEach(b=>b.onclick=e=>{e.stopPropagation();sayS(b.dataset.sy,b);});}

/* ---- универсальный тест: один вопрос за раз, ошибка видна только после ответа ---- */
function quiz(n,{title,items,intro,startTxt,base,extra,auto,doneTxt}){
 const go=()=>{const Q=items(),res=(base&&base.res||[]).slice(),hist=[];let i=0,ok=0;const off=res.length;
  pre(Q.flatMap(q=>q.pre||[]));
  const ask=()=>{if(i>=Q.length)return end();const it=Q[i];let opts=it.o,ix=it.o.indexOf(it.r);if(!it.fixed){[opts,ix]=arrange(it.o,it.r,hist);}hist.push(ix);let done=false;
   shell(`${backBtn}${tag(n)}${it.head||''}<div class="qcard n"><div class="qhead"><span>${title}: ${i+1} из ${Q.length}</span><span>✓ ${ok}</span></div>
    <div class="dots">${Q.map((_,j)=>`<i class="${j<i?(res[off+j].ok?'ok':'no'):j===i?'cur':''}"></i>`).join('')}</div>
    ${it.snd?'<button class="play n" id="pl" aria-label="Послушать ещё раз">🔊</button>':''}${it.q}
    <div class="opts ${opts.length===3?'o3':''}">${opts.map(x=>`<button class="opt ${it.cls||'py'}" data-v="${esc(x)}">${it.show?it.show(x):esc(x)}</button>`).join('')}</div>
    <div class="fb" id="fb"></div><div id="nx"></div></div>`);
   if(it.snd){const pl=$('#pl');const p=()=>{pl.classList.add('on');Promise.resolve(it.snd(pl)).then(()=>pl.classList.remove('on'));};pl.onclick=p;later(p,200);}
   document.querySelectorAll('.opt').forEach(b=>b.onclick=()=>{if(done)return;done=true;const v=b.dataset.v,right=v===String(it.r);if(right)ok++;
    res.push({q:it.lab||'',a:it.ash?it.ash(v):v,r:it.rshow||String(it.r),ok:right});
    document.querySelectorAll('.opt').forEach(x=>{if(x.dataset.v===String(it.r))x.classList.add('ok');else if(x===b)x.classList.add('no');x.disabled=true;});
    const fb=$('#fb');fb.className='fb '+(right?'ok':'no');fb.innerHTML=(right?'✓ Верно! ':'✗ Не так. ')+(it.why||'');
    if(it.after)it.after(right);
    $('#nx').innerHTML=`<button class="btn nxt" id="nb">${i+1<Q.length?'Дальше →':'Готово →'}</button>`;$('#nb').onclick=()=>{i++;ask();};
    if(right)later(()=>{if($('#nb')){i++;ask();}},it.wait||1900);});};
  const end=()=>{const all=ok+(base?base.ok:0),of=Q.length+(base?base.of:0);const miss=res.filter(r=>!r.ok);
   finish(n,all,of,Object.assign({res,miss:miss.map(r=>r.q||r.r)},extra?extra():{}));
   shell(doneBox(n,`<div class="res" style="text-align:center">${all} / ${of}</div><p class="lead" style="text-align:center">${doneTxt||praise(all,of)}</p>
    ${miss.length?`<div class="why">${miss.map(r=>`<div>${esc(r.q)} → правильно: <b>${esc(r.r)}</b></div>`).join('')}</div>`:''}`));againOn(()=>TASKS[n].run());};
  ask();};
 if(auto)return go();
 shell(`${backBtn}${tag(n)}<h2>${title}</h2>${intro}<div class="row" style="justify-content:center"><button class="btn" id="st" style="width:100%">${startTxt||'Начать →'}</button></div>`);
 sndOn();$('#st').onclick=go;}

/* ===================== главная ===================== */
function home(){const nx=TASKS.findIndex((x,i)=>x&&!DONE[i]);
 shell(`<div class="hero"><h2>Привет${S.name?', '+esc(S.name.split(/\s+/)[0]):''}! 👋</h2>
  <p class="lead">Это тренировка <b>ушей и голоса</b>: тоны, похожие звуки b–p, d–t, g–k, n–l, f–h и звуки z c s zh ch sh. Делай задания <b>по порядку</b>, номера те же, что видит учитель.</p>
  <p class="lead">Забыл, как звучит буква? Открой страницу <a href="../zvuki/" target="_blank" rel="noopener"><b>«Звуки»</b></a> — там все звуки с подсказкой.</p></div>
  <div class="list">${TASKS.map((x,i)=>{if(!x)return '';return `<button class="ti n${i===nx?' hot':''}${DONE[i]?'':' todo'}" data-n="${i}"><span class="no" style="${DONE[i]?'background:var(--ok)':i===nx?'background:var(--ac)':''}">${i}</span><span><b>${x.t}</b><small>${x.d}</small></span><span class="sc7">${DONE[i]?'✓ '+DONE[i]:''}</span></button>`;}).join('')}</div>
  <div class="row" style="justify-content:center"><button class="btn" id="it">🏁 Мои итоги</button></div>`);
 document.querySelectorAll('[data-n]').forEach(b=>b.onclick=()=>{location.hash='#'+b.dataset.n;});$('#it').onclick=()=>{location.hash='#itogi';};}

/* ===================== № 1 нарисуй тон ===================== */
const TPTS={1:[[0,5],[1,5]],2:[[0,3],[1,5]],3:[[0,2],[.42,1],[.58,1],[1,4]],4:[[0,5],[1,1]]};
const DW=600,DH=300,dX=u=>50+u*(DW-90),dY=v=>DH-40-(v-1)*(DH-80)/4;
const tPath=t=>TPTS[t].map((p,i)=>(i?'L':'M')+dX(p[0]).toFixed(1)+' '+dY(p[1]).toFixed(1)).join(' ');
const miniCurve=(t,col)=>`<svg viewBox="0 0 ${DW} ${DH}" aria-hidden="true"><path d="${tPath(t)}" stroke="${col||'#fff'}" stroke-width="26" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const T4=['ma','ba','da','di','ti','pi','mi','fu','du','tu','hu','lu','bi','pu'];
const ruleTones=`<div class="rbox" style="--c1:#6A5BFF;--c2:#F0407A"><b>Четыре тона — это четыре дорожки голоса</b>Послушай каждый тон и посмотри, куда идёт линия. Потом ты сам будешь рисовать такую линию пальцем.</div>
 <div class="tgrid">${[1,2,3,4].map(t=>`<div class="tc" style="background:${TC[t]}"><span class="tn">${t}</span><div class="tm">${msv(t,'#fff','46px')}</div>${miniCurve(t)}<small>${TNM[t]}</small><button data-sy="${mark('ma',t)}">🔊 ${mark('ma',t)}</button></div>`).join('')}</div>`;
// что нарисовал ребёнок: ровно / вверх / ямка / вниз (высота 0…1, 1 — высоко)
function classify(P){const n=P.length;if(n<4)return 0;const xs=P.map(p=>p[0]),ys=P.map(p=>p[1]);if(Math.max(...xs)-Math.min(...xs)<.18)return 0;
 const k=Math.max(1,Math.round(n*.12)),avg=a=>a.reduce((s,v)=>s+v,0)/a.length;const st=avg(ys.slice(0,k)),en=avg(ys.slice(-k));
 const mid=ys.slice(Math.floor(n*.12),Math.ceil(n*.88));const mn=Math.min(...(mid.length?mid:ys));
 if(st-mn>.12&&en-mn>.12)return 3;if(en-st>.15)return 2;if(st-en>.15)return 4;return 1;}
function tDraw(){const n=1;
 const go=()=>{const L=[];[1,2,3,4,1,2,3,4].forEach(t=>{let b;do{b=rnd(T4.filter(x=>tonesOf(x).length===4));}while(L.some(x=>x.b===b&&x.t===t));L.push({b,t,s:mark(b,t)});});
  const Q=noTriple(L,x=>x.t);pre(Q.map(x=>x.s));const res=[];let i=0,ok=0;
  const ask=()=>{if(i>=Q.length)return end();const it=Q[i];let pts=[],drawing=false,tries=0,locked=false;
   shell(`${backBtn}${tag(n)}<div class="qcard n"><div class="qhead"><span>Нарисуй тон: ${i+1} из ${Q.length}</span><span>✓ ${ok}</span></div>
    <div class="dots">${Q.map((_,j)=>`<i class="${j<i?(res[j].ok?'ok':'no'):j===i?'cur':''}"></i>`).join('')}</div>
    <button class="play n" id="pl" aria-label="Послушать ещё раз">🔊</button>
    <div class="qq">Куда идёт голос? <b>Нарисуй пальцем</b> слева направо</div>
    <div class="pad2 in"><svg id="dsv" viewBox="0 0 ${DW} ${DH}"><g class="gl">${[1,2,3,4,5].map(v=>`<line x1="40" x2="${DW-30}" y1="${dY(v)}" y2="${dY(v)}"/>`).join('')}</g>
     <text x="8" y="${dY(5)+6}">выс.</text><text x="8" y="${dY(1)+6}">низ.</text>
     <path id="rp" d="" stroke-width="22" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0"/><path id="up" d="" stroke="var(--ac2)" stroke-width="12" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
     <div class="pad2h" id="ph">👆 веди пальцем отсюда →</div></div>
    <div class="fb" id="fb"></div><div id="nx"></div></div>`);
   const pl=$('#pl');const p=()=>playSyl(it.b,it.t,pl);pl.onclick=p;later(p,200);
   const sv=$('#dsv'),up=$('#up');
   const xy=e=>{const r=sv.getBoundingClientRect();return [Math.max(0,Math.min(1,((e.clientX-r.left)*DW/r.width-50)/(DW-90))),Math.max(0,Math.min(1,1-((e.clientY-r.top)*DH/r.height-40)/(DH-80)))];};
   const redraw=()=>{up.setAttribute('d',pts.map((q,k)=>(k?'L':'M')+dX(q[0]).toFixed(1)+' '+(40+(1-q[1])*(DH-80)).toFixed(1)).join(' '));};
   sv.addEventListener('pointerdown',e=>{if(locked)return;e.preventDefault();drawing=true;pts=[xy(e)];$('#ph').style.opacity=0;try{sv.setPointerCapture(e.pointerId);}catch(_){}redraw();});
   sv.addEventListener('pointermove',e=>{if(!drawing)return;e.preventDefault();pts.push(xy(e));redraw();});
   const upH=()=>{if(!drawing)return;drawing=false;const got=classify(pts);
    if(!got){toast('Проведи линию слева направо — подлиннее');pts=[];redraw();return;}
    locked=true;const right=got===it.t;if(right)ok++;res.push({q:it.s,a:got,r:it.t,ok:right});
    const rp=$('#rp');rp.setAttribute('d',tPath(it.t));rp.setAttribute('stroke',TC[it.t]);rp.style.transition='opacity .4s';rp.setAttribute('opacity','.45');
    $('#fb').className='fb '+(right?'ok':'no');
    $('#fb').innerHTML=right?`✓ Верно! ${tsp(it.s)} — ${TNM[it.t]}.`:`✗ Ты нарисовал «${TSH[got]}» (${got}-й тон). А прозвучал ${tsp(it.s)} — <b>${TNM[it.t]}</b>. Правильная линия — цветная. Послушай ещё раз 🔊`;
    if(!right)later(()=>playSyl(it.b,it.t,pl),500);
    $('#nx').innerHTML=`<button class="btn nxt" id="nb">${i+1<Q.length?'Дальше →':'Готово →'}</button>`;$('#nb').onclick=()=>{i++;ask();};
    if(right)later(()=>{if($('#nb')){i++;ask();}},2200);};
   sv.addEventListener('pointerup',upH);sv.addEventListener('pointercancel',upH);};
  const end=()=>{const miss=res.filter(r=>!r.ok);finish(n,ok,Q.length,{res,miss:miss.map(r=>r.q)});
   shell(doneBox(n,`<div class="res" style="text-align:center">${ok} / ${Q.length}</div><p class="lead" style="text-align:center">${praise(ok,Q.length)}</p>
    ${miss.length?`<div class="why">${miss.map(r=>`<div>${tsp(r.q)}: ты нарисовал «${TSH[r.a]}», а это ${TNM[r.r]}</div>`).join('')}</div>`:''}`));againOn(tDraw);};
  ask();};
 shell(`${backBtn}${tag(n)}<h2>✍️ Нарисуй тон</h2>${ruleTones}<div class="row" style="justify-content:center"><button class="btn" id="st" style="width:100%">Начать: рисую тоны →</button></div>`);
 sndOn();$('#st').onclick=go;}

/* ===================== № 2 одинаковые или разные ===================== */
const SAMEO=['= одинаковые','≠ разные'];
function tSame(){quiz(2,{title:'Одинаковые или разные?',startTxt:'Начать: сравниваю тоны →',
 intro:`<div class="rbox" style="--c1:#E8910C;--c2:#F0407A"><b>Слушай только голос, не буквы</b>Прозвучат <b>два разных слога</b>, например <b>mā</b> и <b>bā</b>. Буквы разные — а <b>тон</b> одинаковый? Голос идёт по той же дорожке?</div>
  <div class="tip">Пример: ${['mā','dā'].map(s=>`<button class="chip n" data-sy="${s}">${tsp(s)}</button>`).join(' + ')} = <b>одинаковые</b> (оба ровно) · ${['mā','dà'].map(s=>`<button class="chip n" data-sy="${s}">${tsp(s)}</button>`).join(' + ')} = <b>разные</b></div>`,
 items:()=>{const B=T4.filter(x=>tonesOf(x).length===4);const L=[];
  [[1,1],[2,2],[3,3],[4,4],[1,4],[2,3],[3,4],[1,2],[2,4],[3,2]].forEach(([a,b])=>{const [x,y]=pick(B,2);L.push({a:mark(x,a),b:mark(y,b),same:a===b});});
  return noTriple(L,x=>x.same).map(x=>{const r=x.same?SAMEO[0]:SAMEO[1];
   return {pre:[x.a,x.b],q:'<div class="qq">Тоны у двух слогов одинаковые?</div>',snd:el=>sayS(x.a,el).then(()=>new Promise(r=>later(r,450))).then(()=>sayS(x.b,el)),
    o:SAMEO,r,fixed:true,cls:'tx',lab:x.a+' + '+x.b,
    why:`Это ${tsp(x.a)} (${SYL.tone(x.a)}-й тон, ${TSH[SYL.tone(x.a)]}) и ${tsp(x.b)} (${SYL.tone(x.b)}-й тон, ${TSH[SYL.tone(x.b)]}).`,wait:2600};});}});}

/* ===================== № 3 собери слог ===================== */
const BUILD=['tè','dé','kū','gē','pí','fù','ná','lè','hú','tà','dǐ','kǔ','bà','pō'];
function tBuild(){const n=3;
 const go=()=>{const Q=pick(BUILD,8).map(parse);pre(Q.map(x=>x.s));const res=[];let i=0,ok=0;
  const ask=()=>{if(i>=Q.length)return end();const it=Q[i];const sel={i:null,f:null,t:null};let locked=false;
   const io=new Set([it.i]);if(IN[it.i].pair)io.add(IN[it.i].pair);if(NEAR[it.i])io.add(NEAR[it.i]);shuffle('bpmfdtnlgkh'.split('')).forEach(x=>{if(io.size<4)io.add(x);});
   const IO=shuffle([...io]);
   const prev=()=>{const shown=(sel.i||'')+(sel.f&&sel.t?mark(sel.f,sel.t):(sel.f||''));return shown?`<span class="py">${esc(shown)}</span>`:'<i>? ? ?</i>';};
   shell(`${backBtn}${tag(n)}<div class="qcard n"><div class="qhead"><span>Собери слог: ${i+1} из ${Q.length}</span><span>✓ ${ok}</span></div>
    <div class="dots">${Q.map((_,j)=>`<i class="${j<i?(res[j].ok?'ok':'no'):j===i?'cur':''}"></i>`).join('')}</div>
    <button class="play n" id="pl" aria-label="Послушать ещё раз">🔊</button>
    <div class="bprev" id="bp">${prev()}</div>
    <div class="brow"><h4>1. Начало — инициаль</h4><div class="bks">${IO.map(x=>`<button class="bk" data-k="i" data-v="${x}"><b>${x}</b><small>«${IN[x].ru}»${IN[x].asp===1?' 💨':''}</small></button>`).join('')}</div></div>
    <div class="brow"><h4>2. Конец — финаль</h4><div class="bks b5">${FIN.map(F=>`<button class="bk" data-k="f" data-v="${F.l}"><b>${F.l}</b><small>«${F.ru}»</small></button>`).join('')}</div></div>
    <div class="brow"><h4>3. Тон</h4><div class="bks">${[1,2,3,4].map(t=>`<button class="bk tk" data-k="t" data-v="${t}" style="--tc:${TC[t]}">${msv(t,TC[t],'26px')}<small>${t} · ${TSH[t]}</small></button>`).join('')}</div></div>
    <button class="btn nxt" id="chk" disabled>Проверить ✓</button>
    <div class="fb" id="fb"></div><div id="nx"></div></div>`);
   const pl=$('#pl');const p=()=>playSyl(it.b,it.t,pl);pl.onclick=p;later(p,200);
   document.querySelectorAll('.bk').forEach(b=>b.onclick=()=>{if(locked)return;const k=b.dataset.k;sel[k]=k==='t'?+b.dataset.v:b.dataset.v;
    document.querySelectorAll(`.bk[data-k="${k}"]`).forEach(x=>x.classList.toggle('on',x===b));$('#bp').innerHTML=prev();$('#chk').disabled=!(sel.i&&sel.f&&sel.t);});
   $('#chk').onclick=()=>{if(locked||!(sel.i&&sel.f&&sel.t))return;locked=true;$('#chk').style.display='none';
    const okI=sel.i===it.i,okF=sel.f===it.f,okT=sel.t===it.t,right=okI&&okF&&okT;if(right)ok++;const got=sel.i+mark(sel.f,sel.t);
    res.push({q:it.s,a:got,r:it.s,ok:right,parts:{i:okI,f:okF,t:okT}});
    [['i',it.i],['f',it.f],['t',String(it.t)]].forEach(([k,v])=>document.querySelectorAll(`.bk[data-k="${k}"]`).forEach(x=>{if(x.dataset.v===v)x.classList.add('good');else if(x.classList.contains('on'))x.classList.add('bad');x.disabled=true;}));
    const why=[];if(!okI)why.push(`начало не <b>${sel.i}</b>, а <b>${it.i}</b>${IN[it.i].asp===1?' — предыхательный 💨, с сильным выдохом':IN[it.i].asp===0?' — без выдоха':''}`);
    if(!okF)why.push(`конец не <b>${sel.f}</b> «${FN[sel.f].ru}», а <b>${it.f}</b> «${FN[it.f].ru}»`);
    if(!okT)why.push(`тон не ${sel.t}-й, а <b>${it.t}-й</b> — ${TSH[it.t]}`);
    $('#bp').innerHTML=`<span class="py" style="color:${TC[it.t]}">${esc(it.s)}</span>`;
    $('#fb').className='fb '+(right?'ok':'no');$('#fb').innerHTML=right?`✓ Верно! Это ${tsp(it.s)} — «${ruSyl(it.i,it.f)}».`:`✗ Прозвучал ${tsp(it.s)}: ${why.join('; ')}.`;
    if(!right)later(()=>playSyl(it.b,it.t,pl),400);
    $('#nx').innerHTML=`<button class="btn nxt" id="nb">${i+1<Q.length?'Дальше →':'Готово →'}</button>`;$('#nb').onclick=()=>{i++;ask();};
    if(right)later(()=>{if($('#nb')){i++;ask();}},2000);};};
  const end=()=>{const miss=res.filter(r=>!r.ok);const pc=k=>res.filter(r=>!r.parts[k]).length;
   finish(n,ok,Q.length,{res,miss:miss.map(r=>r.q),err:{i:pc('i'),f:pc('f'),t:pc('t')}});
   shell(doneBox(n,`<div class="res" style="text-align:center">${ok} / ${Q.length}</div><p class="lead" style="text-align:center">${praise(ok,Q.length)}</p>
    ${miss.length?`<div class="why">${miss.map(r=>`<div>Ты собрал <b class="py">${esc(r.a)}</b> → правильно ${tsp(r.r)}</div>`).join('')}</div>`:''}`));againOn(tBuild);};
  ask();};
 shell(`${backBtn}${tag(n)}<h2>🧩 Собери слог</h2>
  <div class="rbox" style="--c1:#2DBE8C;--c2:#5B6BD8"><b>Слог = инициаль + финаль + тон</b>Слушай слог и собери его из трёх частей: <b>начало</b> (b, p, d, t…), <b>конец</b> (a o e i u) и <b>тон</b>. Внимательно: <b>e</b> — это «э», а не «а»!</div>
  <div class="tip">Пары, которые легко спутать: <b>b–p</b>, <b>d–t</b>, <b>g–k</b> (p t k — с сильным выдохом 💨) · <b>n–l</b> · <b>f–h</b> · <b>a–e</b>: ${['tà','tè'].map(s=>`<button class="chip n" data-sy="${s}">${tsp(s)}</button>`).join(' ')}</div>
  <div class="row" style="justify-content:center"><button class="btn" id="st" style="width:100%">Начать: собираю слоги →</button></div>`);
 sndOn();$('#st').onclick=go;}

/* ===================== № 4 близнецы ===================== */
const TW={nl:{p:['n','l'],h:'n или l?',hint:['через нос','язык за зубами'],b:['na','ni','nu','la','li','lu','ne','le']},
 fh:{p:['f','h'],h:'f или h?',hint:['зубы на губу','горлом, как «х»'],b:['fa','fu','ha','hu','he','fo']},
 mn:{p:['m','n'],h:'m или n?',hint:['губы сомкнуты','язык за зубами'],b:['ma','mi','mu','na','ni','nu']}};
function tTwins(){quiz(4,{title:'Близнецы',startTxt:'Начать: различаю близнецов →',
 intro:`<div class="rbox" style="--c1:#22A6C9;--c2:#2DBE8C"><b>Звуки-близнецы</b>Они похожи, но рот работает по-разному:</div>
  <div class="twg">${Object.values(TW).map(g=>`<div class="tw n">${g.p.map((x,k)=>{const b=g.b.find(b=>split(b)[0]===x)||x+'a';return `<button data-sy="${mark(b,firstT(b))}"><b>${x}</b> «${IN[x].ru}»<small>${g.hint[k]}</small></button>`;}).join('<i>или</i>')}</div>`).join('')}</div>`,
 items:()=>{const L=[];const add=(g,k)=>{const G=TW[g];const B=G.b.filter(b=>tonesOf(b).length);const set=noTriple(pick(B.concat(B),k),b=>split(b)[0]);
   set.forEach(b=>{const t=rnd(tonesOf(b)),[ini,f]=split(b);L.push({g,b,t,ini,f});});};
  add('nl',5);add('fh',4);add('mn',3);
  return L.map(x=>{const G=TW[x.g];const s=mark(x.b,x.t);return {pre:[s],head:`<div class="twh">${G.h}</div>`,q:`<div class="qq">Слушай начало слога: <b>${G.p[0]}</b> или <b>${G.p[1]}</b>?</div>`,
   snd:el=>sayS(s,el),o:G.p,r:x.ini,fixed:true,cls:'py',show:v=>`${v}<small>«${IN[v].ru}» · ${G.hint[G.p.indexOf(v)]}</small>`,lab:s,
   why:`Это ${tsp(s)} — «${ruSyl(x.ini,x.f)}».`};});}});}

/* ===================== № 5 найди ошибку ===================== */
const CHK=['tè','dé','kū','gē','pí','bà','tǔ','dǐ','ná','lè','fù','hú','mǐ','pō','kě','dà'];
const CHO=['✓ Написано верно','✗ Есть ошибка'];
function spoil(p){const ways=shuffle(['asp','tone','near','ae']);
 for(const w of ways){let i=p.i,f=p.f,t=p.t;
  if(w==='asp'){if(!IN[i].pair)continue;i=IN[i].pair;}
  if(w==='near'){if(!NEAR[i])continue;i=NEAR[i];}
  if(w==='ae'){if(f!=='a'&&f!=='e')continue;f=f==='a'?'e':'a';}
  if(w==='tone'){t=rnd([1,2,3,4].filter(x=>x!==p.t));}
  if(!SYL.variant(i+f,1)&&!tonesOf(i+f).length)continue;
  return {s:i+mark(f,t),w};}
 return {s:p.i+mark(p.f,p.t%4+1),w:'tone'};}
const WHYW={asp:'начало: b–p, d–t, g–k (p t k — с выдохом 💨)',tone:'тон',near:'начало: похожие звуки n–l, f–h, m–n',ae:'конец: a «а» или e «э»'};
function tCheck(){quiz(5,{title:'Найди ошибку',startTxt:'Начать: я проверяющий →',
 intro:`<div class="rbox" style="--c1:#5B6BD8;--c2:#8E5BE8"><b>Ты — проверяющий 🕵️</b>Прозвучит слог, а на экране он написан. Иногда <b>правильно</b>, а иногда с ошибкой: не та инициаль, не та финаль или не тот тон. Проверь каждую букву и значок!</div>`,
 items:()=>{const L=pick(CHK,10).map((s,k)=>({p:parse(s),bad:k%2===1}));
  return noTriple(L,x=>x.bad).map(x=>{const sp=x.bad?spoil(x.p):{s:x.p.s};const r=x.bad?CHO[1]:CHO[0];
   return {pre:[x.p.s],q:`<div class="qq">Послушай. Так написано верно?</div><div class="big7 py">${esc(sp.s)}</div>`,snd:el=>sayS(x.p.s,el),o:CHO,r,fixed:true,cls:'tx',
    lab:'прозвучал '+x.p.s+', написано '+sp.s,why:x.bad?`Прозвучал ${tsp(x.p.s)}, а написано <b class="py">${esc(sp.s)}</b> — ошибка: ${WHYW[sp.w]}.`:`Прозвучал ${tsp(x.p.s)} — так и написано.`,wait:2400};});}});}

/* ===================== № 6 z c s zh ch sh ===================== */
const ruleZ=`<div class="zwarn"><div class="k2">⚠️ Самое важное правило</div><div class="h">После z c s zh ch sh буква i читается «ы»</div>
 <div class="zrow6">${ZG.map(l=>`<button data-sy="${mark(l+'i',firstT(l+'i'))}" class="${l==='c'||l==='ch'?'hot':''}"><b>${l}i</b><small>«${YI[l]}»</small></button>`).join('')}</div>
 <div class="h2w">ci = «цы», chi = «чшы» — ПРЕДЫХАНИЕ ИСЧЕЗАЕТ!</div>
 <p>Сами по себе <b>c</b> и <b>ch</b> предыхательные 💨. Но вместе с <b>i</b> выдох пропадает: <b>ci</b> = «цы», <b>chi</b> = «чшы».</p></div>
 <div class="tip"><b>z c s</b> — кончик языка у зубов. <b>zh ch sh</b> — язык загнут вверх. Нажми на слог, чтобы послушать.</div>`;
const ZP=[['za','zha'],['zu','zhu'],['ze','zhe'],['ca','cha'],['cu','chu'],['ce','che'],['sa','sha'],['su','shu'],['se','she']];
function tZh(){const n=6;let errs=0,mres=[];
 const L=shuffle(ZG),R=shuffle(ZG);let sel=null;const done=new Set();
 const draw=()=>{shell(`${backBtn}${tag(n)}<h2>⚠️ z c s zh ch sh</h2>${ruleZ}
  <h3>6.1 Соедини слог и как он читается</h3><p class="lead" style="margin-top:0">Нажми на слог слева (он прозвучит), потом на чтение справа.</p>
  <div class="mt2"><div class="mcol">${L.map(l=>`<button class="mc n${done.has(l)?' good':''}${sel===l?' on':''}" data-l="${l}"><b class="py">${l}i</b></button>`).join('')}</div>
   <div class="mcol">${R.map(l=>`<button class="mc n${done.has(l)?' good':''}" data-r="${l}"><b>«${YI[l]}»</b></button>`).join('')}</div></div>
  <div class="fb" id="fb"></div>
  ${done.size===6?`<div class="row" style="justify-content:center"><button class="btn" id="go2" style="width:100%">6.2 Слушаю: z или zh? →</button></div>`:''}`);
  sndOn();
  document.querySelectorAll('[data-l]').forEach(b=>b.onclick=()=>{const l=b.dataset.l;if(done.has(l))return;sel=l;playSyl(l+'i',firstT(l+'i'));document.querySelectorAll('[data-l]').forEach(x=>x.classList.toggle('on',x===b));});
  document.querySelectorAll('[data-r]').forEach(b=>b.onclick=()=>{const r=b.dataset.r;if(done.has(r))return;if(!sel){toast('Сначала нажми на слог слева');return;}
   if(r===sel){done.add(r);mres.push({q:sel+'i',a:'«'+YI[r]+'»',r:'«'+YI[sel]+'»',ok:true});sel=null;draw();$('#fb').className='fb ok';$('#fb').innerHTML=`✓ Верно! <b>${r}i</b> = «${YI[r]}»${r==='c'||r==='ch'?' — без выдоха!':''}`;}
   else{errs++;mres.push({q:sel+'i',a:'«'+YI[r]+'»',r:'«'+YI[sel]+'»',ok:false});b.classList.add('bad');setTimeout(()=>b.classList.remove('bad'),600);$('#fb').className='fb no';$('#fb').innerHTML=`✗ <b>${sel}i</b> читается не «${YI[r]}». Послушай ещё раз и попробуй снова.`;playSyl(sel+'i',firstT(sel+'i'));}});
  const g2=$('#go2');if(g2)g2.onclick=part2;};
 const part2=()=>{const mok=Math.max(0,6-errs);
  quiz(n,{title:'z или zh?',auto:true,base:{ok:mok,of:6,res:mres.filter(r=>!r.ok).length?[{q:'6.1 соединить: ошибок '+errs,a:mres.filter(r=>!r.ok).map(r=>r.q+' → '+r.a).join(', '),r:'6 пар',ok:!errs}]:[{q:'6.1 соединить',a:'без ошибок',r:'6 пар',ok:true}]},extra:()=>({match:{errs,log:mres}}),
   items:()=>{const P=ZP.filter(([a,b])=>tonesOf(a).length&&tonesOf(b).length);const L=pick(P,6).map(([a,b])=>{const w=Math.random()<.5?a:b;return {a,b,w,t:rnd(tonesOf(w))};});
    return noTriple(L,x=>x.w===x.a).map(x=>{const s=mark(x.w,x.t),[i,f]=split(x.w);return {pre:[s],head:'<h3 style="margin-top:6px">6.2 Слушай: язык у зубов или загнут вверх?</h3>',q:'<div class="qq">Какой слог прозвучал?</div>',snd:el=>sayS(s,el),o:[x.a,x.b],r:x.w,fixed:true,cls:'py',
     show:v=>{const [a,b]=split(v);return `${v}<small>«${ruSyl(a,b)}» · ${a.length===2?'язык вверх':'у зубов'}</small>`;},lab:s,why:`Это ${tsp(s)} — «${ruSyl(i,f)}», ${i.length===2?'язык загнут вверх':'кончик языка у зубов'}.`};});}});};
 draw();}

/* ===================== № 7 скажи сам (запись уходит учителю) ===================== */
const SAYP=[['bā','pā'],['dà','tà'],['gē','kē'],['nǐ','lǐ']];
let micStream=null,REC=null;
function recStop(){try{if(REC&&REC.state==='recording')REC.stop();}catch(e){}}
async function getMic(){if(micStream&&micStream.active)return micStream;micStream=await navigator.mediaDevices.getUserMedia({audio:true});return micStream;}
const pickType=()=>{for(const t of ['audio/webm;codecs=opus','audio/mp4','audio/webm','audio/ogg;codecs=opus'])if(window.MediaRecorder&&MediaRecorder.isTypeSupported&&MediaRecorder.isTypeSupported(t))return t;return '';};
async function upAud(item,blob){if(isTest()||!blob)return true;if(!S.sid){S.sid=newSid();keepS();}
 try{const r=await fetch(API+'audio?hw='+HW+'&sid='+S.sid+'&item='+item,{method:'POST',headers:{'Content-Type':(blob.type||'audio/webm').split(';')[0]},body:blob});return r.ok;}catch(e){return false;}}
const BLOB={};
function tSay(){const n=7;S.said=S.said||{};
 const card=(pr,k)=>{const d=S.said['r'+(k+1)];return `<div class="sc2 n${d?' done':''}" data-k="${k}"><div class="sp2">${pr.map(s=>{const p=parse(s);return `<span>${tsp(s)}<small>«${ruSyl(p.i,p.f)}»${IN[p.i].asp===1?' 💨':''}</small></span>`;}).join('<i>–</i>')}</div>
  <div class="row"><button class="btn g" data-ref="${k}">▶ Образец</button><button class="btn rc" data-rec="${k}">● Записать</button><button class="btn g" data-me="${k}" ${BLOB[k]?'':'disabled'}>▶ Я</button></div>
  <div class="st2" id="st${k}">${d?'✓ Отправлено учителю':'Скажи оба слога по очереди'}</div></div>`;};
 const draw=()=>{const cnt=SAYP.filter((_,k)=>S.said['r'+(k+1)]).length;
  shell(`${backBtn}${tag(n)}<h2>🎙️ Скажи сам</h2>
  <div class="rbox" style="--c1:#FF5C8A;--c2:#F5A524"><b>Говори громко и чётко</b>Послушай образец ▶, потом нажми <span style="font-weight:900">● Записать</span> и скажи оба слога. Запись сразу уйдёт учителю. На <span class="py" style="font-weight:900">p t k</span> — сильный выдох 💨: поднеси ладонь ко рту, она должна почувствовать воздух!</div>
  <div class="say2">${SAYP.map(card).join('')}</div>
  <p class="hint2" style="text-align:center;margin-top:12px">Записано ${cnt} из ${SAYP.length}</p>
  ${cnt===SAYP.length?`<div class="row" style="justify-content:center"><button class="btn" id="fin7" style="width:100%">✓ Готово →</button></div>`:`<div style="text-align:center;margin-top:10px"><button class="nomic" id="nomic">🎤 Микрофон не работает — пропустить</button></div>`}`);
  SAYP.forEach(pr=>pre(pr));
  document.querySelectorAll('[data-ref]').forEach(b=>b.onclick=async()=>{const pr=SAYP[+b.dataset.ref];await sayS(pr[0],b);await new Promise(r=>later(r,500));await sayS(pr[1],b);});
  document.querySelectorAll('[data-me]').forEach(b=>b.onclick=()=>{const k=+b.dataset.me;if(!BLOB[k])return;const u=URL.createObjectURL(BLOB[k]);const a=new Audio(u);b.classList.add('on');a.onended=()=>b.classList.remove('on');a.play().catch(()=>b.classList.remove('on'));});
  document.querySelectorAll('[data-rec]').forEach(b=>b.onclick=async()=>{const k=+b.dataset.rec;
   if(REC&&REC.state==='recording'){recStop();return;}
   let s;try{s=await getMic();}catch(e){toast('Микрофон не включился. Разреши микрофон или нажми «пропустить»');return;}
   const type=pickType();let mr;try{mr=new MediaRecorder(s,type?{mimeType:type,audioBitsPerSecond:32000}:{});}catch(e){toast('Запись не получилась на этом устройстве');return;}
   const ch=[];mr.ondataavailable=e=>e.data.size&&ch.push(e.data);REC=mr;b.textContent='■ Стоп';b.classList.add('on');$('#st'+k).textContent='🔴 Говори: '+SAYP[k].join(' – ');
   mr.onstop=async()=>{REC=null;const blob=new Blob(ch,{type:mr.mimeType||type||'audio/webm'});if(!document.body.contains(b))return;b.textContent='● Записать';b.classList.remove('on');
    if(blob.size<300){$('#st'+k).textContent='Запись пустая — попробуй ещё раз';return;}
    BLOB[k]=blob;$('#st'+k).textContent='Отправляю учителю…';const ok=await upAud('r'+(k+1),blob);
    if(ok){S.said['r'+(k+1)]=Date.now();keepS();}const y=scrollY;draw();scrollTo(0,y);if(!ok)toast('Не отправилось — нет связи. Попробуй записать ещё раз');};
   mr.start();later(()=>{if(mr.state==='recording')mr.stop();},4000);});
  const nm=$('#nomic');if(nm)nm.onclick=()=>{const c=SAYP.filter((_,k)=>S.said['r'+(k+1)]).length;finish(n,c,SAYP.length,{items:SAYP.map((p,k)=>({pair:p.join(' – '),rec:!!S.said['r'+(k+1)]})),nomic:true});done7(c,true);};
  const f=$('#fin7');if(f)f.onclick=()=>{finish(n,SAYP.length,SAYP.length,{items:SAYP.map((p,k)=>({pair:p.join(' – '),rec:true}))});done7(SAYP.length,false);};};
 const done7=(c,nomic)=>{shell(doneBox(n,`<div class="res" style="text-align:center">${c} / ${SAYP.length}</div><p class="lead" style="text-align:center">${nomic?'Ничего страшного! Скажи эти пары вслух на уроке 🙂':'Молодец! Учитель послушает твои записи 🎧'}</p>`));againOn(tSay);};
 draw();}

/* ===================== № 8 игра «Звуковая ракета» ===================== */
const KVA={};
function kpre(g){(g.audio||[]).forEach(c=>{if(KVA[c])return;const a=new Audio(fn(c));a.preload='auto';try{a.load();}catch(e){}KVA[c]=a;});}
window.KSAY=t=>new Promise(res=>{let a=KVA[t];if(!a){a=new Audio(fn(t));KVA[t]=a;}try{curA&&curA!==a&&curA.pause();}catch(e){}curA=a;let d=false;const end=()=>{if(!d){d=true;res();}};
 try{a.currentTime=0;}catch(e){}a.onended=end;a.onerror=end;a.play().catch(end);setTimeout(end,2500);});
window.KSTOP=()=>{try{curA&&curA.pause()}catch(e){}};
const KCSS={};let KCUR=null;
function katMount(id,box,onRes){const g=KAT.game(id);if(!g){box.innerHTML='<p class="lead">Игра не загрузилась, обнови страницу.</p>';return;}
 if(!KCSS[id]){KCSS[id]=1;const st=document.createElement('style');st.textContent=g.css||'';document.head.appendChild(st);}
 kpre(g);
 box.innerHTML=`<button class="btn kbig">⛶ Играть на весь экран</button><div class="kst"><div class="kstage g-${id}"></div><button class="kfs" title="Во весь экран">⛶</button><button class="kx" title="Выйти">✕</button><div class="khint"><span class="kph">📱</span><b>Поверни телефон боком</b></div></div>`;
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
 // первое касание игры на любом устройстве открывает её на весь экран (дети жаловались на «пол-окна»)
 wrap.addEventListener('pointerdown',e=>{if(isFull())return;e.stopPropagation();e.preventDefault();const bt=e.target.closest&&e.target.closest('button');full(true);if(bt)setTimeout(()=>bt.click(),80);},true);
 const onR=()=>{fit();setTimeout(fit,250);};addEventListener('resize',onR);addEventListener('orientationchange',onR);
 KAT.onResult=(gid,r)=>{if(onRes)onRes(r);};
 const inst=g.mount(stage,KAT)||{};stage._inst=inst;
 requestAnimationFrame(()=>{try{box.scrollIntoView({block:'start'});}catch(e){}});
 KCUR={full,destroy(){ro.disconnect();removeEventListener('resize',onR);removeEventListener('orientationchange',onR);document.removeEventListener('fullscreenchange',onFs);document.removeEventListener('webkitfullscreenchange',onFs);
  if(isFull()){try{if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});}catch(e){}}document.documentElement.classList.remove('knoscroll');wrap.remove();try{inst.destroy&&inst.destroy()}catch(e){}}};
 return stage;}
function tGame(){const n=8,id='raketa';
 shell(`${backBtn}${tag(n)}<h2>🚀 Звуковая ракета</h2><div id="kg"></div><div id="kr"></div>
  <div class="rbox" style="--c1:#1A1050;--c2:#5B6BD8"><b>Как играть</b>Звучит слог — и летят ворота. Нажми на ворота с <b>нужным тоном</b> (линия голоса) или с <b>нужным звуком</b> (b или p, n или l…) — ракета перелетит туда. 16 ворот. Кнопка 🔊 — послушать ещё раз.</div>`);
 katMount(id,$('#kg'),r=>{const best=Math.max(r.score||0,+((S.gbest||{})[id]||0));S.gbest=Object.assign(S.gbest||{},{[id]:best});keepS();
  finish(n,r.right,r.of,{pts:r.score,best,wrong:r.wrong,miss:r.miss,res:r.res});
  if(KCUR&&KCUR.full)later(()=>KCUR&&KCUR.full(false),2600);
  const nx=nextN(n);
  $('#kr').innerHTML=`<div class="qcard n" style="text-align:center"><div class="res">${r.right} / ${r.of}</div><p class="lead">Очки: <b>${r.score}</b>${best>r.score?` · рекорд ${best}`:''}. ${r.miss&&r.miss.length?'Можно повторить для закрепления: <b class="py">'+r.miss.map(esc).join(', ')+'</b>':'Без ошибок! 🏆'}</p>
   <div class="row" style="justify-content:center">${nx?`<button class="btn" onclick="location.hash='#${nx}'">Задание № ${nx} →</button>`:`<button class="btn" onclick="location.hash='#itogi'">🏁 Мои итоги</button>`}<button class="btn g" onclick="location.hash=''">‹ Все задания</button></div>${nx?'':leftBox()}</div>`;leftOn();});}

route();
