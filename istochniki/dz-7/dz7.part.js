/* ===================== ДЗ 7 · повторение перед уроком 8 ===================== */
// Задания — нумерованный список (не станции!). Те же номера — в кабинете учителя.
const TASKS=[null,
 {t:'🎵 Значки тонов',d:'Какой значок — какой тон: правило и упражнение',run:tones},
 {t:'💎 Пещера тонов',d:'Игра: разбей кристаллы нужного тона',run:crystals},
 {t:'🏮 Тоновые ворота',d:'Игра: отправь фонарик в ворота его тона',run:vorota},
 {t:'⚠️ ci = «цы», chi = «чшы»',d:'Где предыхание исчезает',run:cichi},
 {t:'👂 Слух: b–p, d–t, g–k',d:'Предыхательный или нет?',run:ears},
 {t:'🃏 Карточки-мемори',d:'Иероглиф и перевод',run:memo},
 {t:'👀 Узнай иероглиф',d:'你 我 好 叫 妈 爸 — и перевод фраз',run:know},
 {t:'🔑 Ключи',d:'Где ключ и что он подсказывает',run:keys},
 {t:'✍️ Порядок черт',d:'Угадай первую черту нового иероглифа',run:strokes},
 {t:'📝 Диктант',d:'Слушай и пиши иероглиф по памяти',run:dict}];
const NT=TASKS.length-1;
let DONE={};try{DONE=JSON.parse(localStorage.getItem('zh-dz7-done')||'{}')}catch(e){}
const keep=()=>{try{localStorage.setItem('zh-dz7-done',JSON.stringify(DONE))}catch(e){}};
const HW='dz7';
const API=/workers\.dev$/.test(location.hostname)?'/api/dz/':'https://gruppa-deti.ch-tutor-world.workers.dev/api/dz/';
let S={};try{S=JSON.parse(localStorage.getItem('zh-dz7')||'{}')}catch(e){}
const keepS=()=>{try{localStorage.setItem('zh-dz7',JSON.stringify(S))}catch(e){}};S.queue=S.queue||[];
const isTest=()=>/^(учитель|учительница|teacher|тест)$/i.test((S.name||'').trim());
function send(part,data){S.queue=S.queue.filter(q=>q.part!==part);S.queue.push({part,data:Object.assign({},data,{ts:Date.now()})});keepS();flush();}
async function flush(){if(isTest()){S.queue=[];keepS();return;}if(!S.sid||!S.queue.length)return;const q=S.queue[0];
 try{const r=await fetch(API+'save',{method:'POST',headers:{'Content-Type':'text/plain'},body:JSON.stringify({hw:HW,sid:S.sid,name:S.name,part:q.part,data:q.data})});
  if(!r.ok)throw 0;S.queue.shift();keepS();if(S.queue.length)flush();}catch(e){clearTimeout(flush._t);flush._t=setTimeout(flush,15000);}}
addEventListener('online',flush);
function finish(n,ok,of,extra){const prev=DONE[n];const best=prev?Math.max(ok,+String(prev).split('/')[0]||0):ok;DONE[n]=best+'/'+of;keep();send('t'+n,Object.assign({score:ok,of,best},extra||{}));}
const TOP='Домашнее задание 7';
const NAMEQ=new URLSearchParams(location.search).get('name');
function login(){$('#app').innerHTML=`<div class="top n"><span class="zh">作业</span><div><h1>${TOP}</h1><small>Сначала напиши своё имя</small></div></div>
 <div class="main n" style="text-align:center"><h2>Как тебя зовут?</h2><p class="lead">Имя и первая буква фамилии, например <b>Маша П.</b> — как всегда. Так учитель увидит твои результаты.</p>
 <input id="nm" class="in" style="width:100%;font:inherit;font-size:20px;padding:14px 18px;border:0;outline:none;margin-top:16px;color:var(--ink)" placeholder="Имя и буква фамилии" maxlength="40" value="${esc(NAMEQ||S.name||'')}">
 <div class="row" style="justify-content:center"><button class="btn" id="go">Начать →</button></div></div>`;
 const go=()=>{const v=$('#nm').value.trim();if(v.length<2){toast('Напиши имя');return;}S.name=v;S.sid=S.sid||(Date.now().toString(36)+Math.random().toString(36).slice(2,8));keepS();flush();location.hash='';route();};
 $('#go').onclick=go;$('#nm').onkeydown=e=>{if(e.key==='Enter')go();};}
const nDone=()=>Object.keys(DONE).filter(k=>TASKS[+k]).length;
const pbar=()=>{const d=nDone(),pc=Math.round(d*100/NT);return `<div class="pbar n" id="pbar"><div class="pbt"><span>Выполнено <b>${d}</b> из ${NT}</span><b>${pc}%</b></div><div class="pbl"><i style="width:${pc}%"></i></div></div>`;};
const shell=(h)=>{stopAll();$('#app').innerHTML=`<div class="top n"><span class="zh">作业</span><div><h1>${TOP}</h1><small>${isTest()?'🧑‍🏫 режим учителя — результаты не сохраняются':'Повторяем всё перед уроком 8'}</small></div><button class="back n" style="margin:0 0 0 auto;font-size:13px" id="me">${esc(S.name||'')} ✎</button></div>${pbar()}<div class="main n">${h}</div>`;
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
    res.push({q:it.lab||'',a:v,r:String(it.r),ok:right});
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

/* ---- 1: tone marks ---- */
const TB=['ma','ba','bi','pi','mi','fu','da','di','ti','tu','ke','hu','zhi','shi','chu','shu'];
const TN=['','первый','второй','третий','четвёртый'];
const TMK=['','ˉ','ˊ','ˇ','ˋ'];
const TSAY=['','ровно и высоко','вверх, как вопрос «а?»','вниз, а потом вверх — ямка','резко вниз, как «Стоп!»'];
const TPATH=['','M10 12 H140','M10 40 L140 8','M10 22 Q60 52 75 44 T140 10','M10 6 L140 44'];
const MKP=['','M8 30 H72','M16 46 L64 12','M10 14 L40 46 L70 14','M16 12 L64 46'];
const msv=(t,c,h)=>`<svg viewBox="0 0 80 60" style="height:${h||'1em'};width:auto;vertical-align:middle;overflow:visible"><path d="${MKP[t]}" fill="none" stroke="${c||'currentColor'}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const tsvg=t=>`<svg viewBox="0 0 150 50"><path d="${TPATH[t]}" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" opacity=".95"/></svg>`;
const TCV=['','#1FA77A','#E8910C','#6A5BFF','#F0407A'];
function tones(){const n=1;
 quiz(n,{title:'🎵 Значки тонов',
  intro:`<div class="rbox" style="--c1:#5B6BD8;--c2:#8E5BE8"><b>Главное правило</b>Значок над слогом <b>рисует, как движется голос</b>. Запомни номер каждого значка!</div>
  <div class="tgrid">${[1,2,3,4].map(t=>`<div class="tc" style="--tc:${TCV[t]}"><span class="tn">${t}</span><div class="tm">${msv(t,'#fff','58px')}</div><div class="ts">${mark('ma',t)}</div><small>${t}-й тон: ${TSAY[t]}</small><button data-s="${mark('ma',t)}">🔊 ${mark('ma',t)}</button></div>`).join('')}</div>
  <div class="tip" style="font-size:16.5px"><b>Нет значка</b> — это <b>лёгкий тон</b>: коротко и тихо. Как второй слог в <b>māma</b> 妈妈 и <b>bàba</b> 爸爸. <button class="btn g" style="padding:6px 12px;font-size:14px" data-w="妈妈">🔊 māma</button></div>
  <div class="rbox" style="--c1:#FF5C8A;--c2:#FF8A3D"><b>Как запомнить</b><div class="rr2"><span>1 ${msv(1,'#fff')} — ровная дорожка</span><span>2 ${msv(2,'#fff')} — горка вверх</span><span>3 ${msv(3,'#fff')} — ямка: вниз и вверх</span><span>4 ${msv(4,'#fff')} — горка вниз</span></div></div>`,
  items:()=>{const A=[];
   pick(TB,4).forEach((b,j)=>{const t=[1,2,3,4][j];const s=mark(b,t);A.push({q:`<div class="qq">Какой это тон?</div><div class="big7">${s}</div>`,o:['1','2','3','4'],r:String(t),cls:'num',show:x=>`${x}<small>тон</small>`,why:`Значок ${msv(t,TCV[t])} — ${t}-й тон: ${TSAY[t]}.`,after:()=>playS(s),lab:s+' — какой тон?'});});
   pick(TB,4).forEach((b,j)=>{const t=[4,3,2,1][j];const o=[1,2,3,4].map(x=>mark(b,x));A.push({q:`<div class="qq">Найди слог <b>${t}-го тона</b></div><div class="big7"><span class="num" style="background:${TCV[t]}">${t}</span></div>`,o,r:mark(b,t),why:`${t}-й тон — значок ${msv(t,TCV[t])}.`,after:()=>playS(mark(b,t)),lab:t+'-й тон в слоге '+b});});
   [3,2].forEach(t=>A.push({q:`<div class="qq">Какой значок у <b>${t}-го тона</b>?</div>`,o:['1','2','3','4'],r:String(t),cls:'mk',show:x=>msv(+x,'#2B3270','46px'),rshow:'значок, отмеченный зелёным',why:`${t}-й тон: ${TSAY[t]}.`,lab:'значок '+t+'-го тона'}));
   A.push({q:`<div class="qq">Над вторым слогом нет значка. Какой это тон?</div><div class="big7" style="font-size:72px">mā<span style="color:#FF5C8A">ma</span></div>`,o:['лёгкий','1-й','3-й'],r:'лёгкий',cls:'tx',why:'Нет значка — лёгкий тон: коротко и тихо.',after:()=>playW('妈妈'),lab:'māma — второй слог'});
   return shuffle(A);}});}

/* ---- 2: the crystal cave game ---- */
const KVA={};
function kpre(g){(g.audio||[]).forEach(c=>{if(KVA[c])return;const a=new Audio(fn(c));a.preload='auto';try{a.load();}catch(e){}KVA[c]=a;});}
window.KSAY=t=>new Promise(res=>{let a=KVA[t];if(!a){a=new Audio(fn(t));KVA[t]=a;}try{curA&&curA!==a&&curA.pause();}catch(e){}curA=a;let d=false;const end=()=>{if(!d){d=true;res();}};
 try{a.currentTime=0;}catch(e){}a.onended=end;a.onerror=end;a.play().catch(end);setTimeout(end,2500);});
window.KSTOP=()=>{try{curA&&curA.pause()}catch(e){}};
const KRA={};window.KRU=id=>{let a=KRA[id];if(!a){a=new Audio(AUDIO+'ru/'+id+'.mp3');KRA[id]=a;}return new Promise(res=>{try{curA&&curA!==a&&curA.pause();}catch(e){}curA=a;let d=false;const end=()=>{if(!d){d=true;res();}};try{a.currentTime=0;}catch(e){}a.onended=end;a.onerror=end;a.play().catch(end);setTimeout(end,3500);});};
['cr1','cr2','cr3','cr4'].forEach(id=>{const a=new Audio(AUDIO+'ru/'+id+'.mp3');a.preload='auto';KRA[id]=a;});
const KCSS={};
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
 wrap.addEventListener('pointerdown',e=>{if(isFull()||!matchMedia('(max-width:899px),(max-height:520px)').matches)return;e.stopPropagation();e.preventDefault();const bt=e.target.closest&&e.target.closest('button');full(true);if(bt)setTimeout(()=>bt.click(),80);},true);
 const onR=()=>{fit();setTimeout(fit,250);};addEventListener('resize',onR);addEventListener('orientationchange',onR);
 KAT.onResult=(gid,r)=>{if(onRes)onRes(r);};
 const inst=g.mount(stage,KAT)||{};stage._inst=inst;
 KCUR={full,destroy(){ro.disconnect();removeEventListener('resize',onR);removeEventListener('orientationchange',onR);document.removeEventListener('fullscreenchange',onFs);document.removeEventListener('webkitfullscreenchange',onFs);
  if(isFull()){try{if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});}catch(e){}}document.documentElement.classList.remove('knoscroll');wrap.remove();try{inst.destroy&&inst.destroy()}catch(e){}}};
 return stage;}
function gameTask(n,id,title,rule){
 shell(`${backBtn}${tag(n)}<h2>${title}</h2>${rule}<div id="kg"></div><div id="kr"></div>`);
 katMount(id,$('#kg'),r=>{const best=Math.max(r.score||0,+((S.gbest||{})[id]||0));S.gbest=Object.assign(S.gbest||{},{[id]:best});keepS();
  finish(n,r.right,r.of,{pts:r.score,best:best,wrong:r.wrong,miss:r.miss});
  if(KCUR&&KCUR.full)later(()=>KCUR&&KCUR.full(false),2600);
  const nx=nextN(n);
  $('#kr').innerHTML=`<div class="qcard n" style="text-align:center"><div class="res">${r.right} / ${r.of}</div><p class="lead">Очки: <b>${r.score}</b>${best>r.score?` · рекорд ${best}`:''}. ${r.miss&&r.miss.length?'Можно повторить для закрепления: <b class="py">'+r.miss.map(esc).join(', ')+'</b>':'Без ошибок! 🏆'}</p>
   <div class="row" style="justify-content:center">${nx?`<button class="btn" onclick="location.hash='#${nx}'">Задание № ${nx} →</button>`:`<button class="btn" onclick="location.hash='#itogi'">🏁 Мои итоги</button>`}<button class="btn g" onclick="location.hash=''">‹ Все задания</button></div></div>`;});}
const TL=`<div class="rr2"><span>1 ${msv(1,'#fff')} ровно · 2 ${msv(2,'#fff')} вверх · 3 ${msv(3,'#fff')} ямка · 4 ${msv(4,'#fff')} вниз</span></div>`;
function crystals(){gameTask(2,'crystals','💎 Пещера тонов',`<div class="rbox" style="--c1:#5B6BD8;--c2:#2DBE8C"><b>Как играть</b>Наверху — <b>номер тона</b>, голос тоже его скажет. Разбей <b>все кристаллы</b>, где значок этого тона! Не тот кристалл треснет и покажет свой номер.${TL}</div>`);}
function vorota(){gameTask(3,'vorota','🏮 Тоновые ворота',`<div class="rbox" style="--c1:#F0407A;--c2:#6A5BFF"><b>Как играть</b>Летит фонарик со слогом. Посмотри на <b>значок тона</b> и нажми на <b>ворота с номером</b> этого тона, пока фонарик не упал! На компьютере можно нажимать клавиши 1 2 3 4.${TL}</div>`);}

/* ---- 4: ci = «цы», chi = «чшы» ---- */
const ZR={zi:'«дзы»',ci:'«цы»',si:'«сы»',zhi:'«джы»',chi:'«чшы»',shi:'«шы»'};
const ZS={zi:['zī','zǐ','zì'],ci:['cí','cǐ','cì'],si:['sī','sǐ','sì'],zhi:['zhī','zhí','zhǐ','zhì'],chi:['chī','chí','chǐ','chì'],shi:['shī','shí','shǐ','shì']};
function cichi(){const n=4;
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

/* ---- 6: memory cards ---- */
const MEM=[['你','ты','你'],['我','я','我'],['好','хорошо','好'],['叫','зваться','叫'],['妈妈','мама','妈妈'],['爸爸','папа','爸爸'],['你好','привет','你好'],['我叫','меня зовут','我叫']];
function memo(){const n=6,L=MEM;
 shell(`${backBtn}${tag(n)}<h2>🃏 Карточки-мемори</h2>
  <div class="rbox" style="--c1:#FF5C8A;--c2:#FF8A3D"><b>Как играть</b>Открывай по <b>две</b> карточки. Найди к иероглифу его перевод — пиньиня нет! Пара совпала — карточки остаются открытыми и звучит слово.</div>
  <div class="mhud"><span>⏱ <b id="mt">0:00</b></span><span>🔄 ходов: <b id="mm">0</b></span><span>✓ пар: <b id="mp">0</b>/8</span></div>
  <div class="mem" id="mg"></div>`);
 const cards=shuffle(L.flatMap(([a,ru,hz],i)=>[{i,k:'a',t:a,hz},{i,k:'b',t:ru,hz}]));
 $('#mg').innerHTML=cards.map((c,j)=>`<button class="mc" data-j="${j}" aria-label="Карточка ${j+1}"><span class="mcb"><i>汉</i></span><span class="mcf ${c.k==='a'?'zh':'ru'}${c.t.length>8?' long':''}">${esc(c.t)}</span></button>`).join('');
 let open=[],moves=0,pairs=0,errs=0,lock=false;const t0=Date.now(),conf=[];
 const tick=()=>{const s=Math.floor((Date.now()-t0)/1000);const el=$('#mt');if(!el)return;el.textContent=Math.floor(s/60)+':'+String(s%60).padStart(2,'0');later(tick,1000);};tick();
 document.querySelectorAll('.mc').forEach(b=>b.onclick=()=>{if(lock)return;const j=+b.dataset.j,c=cards[j];if(b.classList.contains('up'))return;
  b.classList.add('up');open.push([b,c]);if(open.length<2)return;moves++;$('#mm').textContent=moves;const [[b1,c1],[b2,c2]]=open;open=[];
  if(c1.i===c2.i){pairs++;$('#mp').textContent=pairs;later(()=>{b1.classList.add('ok');b2.classList.add('ok');},250);playW(c1.hz);if(pairs===8)later(end,1500);}
  else{errs++;lock=true;conf.push([c1.t,c2.t]);b1.classList.add('no');b2.classList.add('no');later(()=>{b1.classList.remove('up','no');b2.classList.remove('up','no');lock=false;},950);}});
 function end(){const sec=Math.round((Date.now()-t0)/1000);finish(n,8,8,{moves,errs,sec,conf:conf.slice(0,20)});
  shell(doneBox(n,`<div class="res" style="text-align:center">${errs<=3?'⭐⭐⭐':errs<=8?'⭐⭐':'⭐'}</div><p class="lead" style="text-align:center">Все 8 пар найдены за <b>${moves}</b> ${plural(moves,'ход','хода','ходов')} · ${Math.floor(sec/60)}:${String(sec%60).padStart(2,'0')}</p>
   <div class="mlist">${L.map(([a,ru,hz])=>`<button class="n" data-say="${hz}"><span class="zh">${esc(a)}</span><small>${esc(ru)}</small>🔊</button>`).join('')}</div>`));
  document.querySelectorAll('[data-say]').forEach(b=>b.onclick=()=>playW(b.dataset.say,b));againOn(memo);}}

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
 {c:'好',q:'好 = 女 + 子. Как он устроен?',o:['обе части — смысл','одна часть — чтение'],r:'обе части — смысл',why:'女 «женщина» + 子 «ребёнок» = мама с ребёнком — это «хорошо». Части-чтения здесь нет!'}];
const KB=[{k:'口',km:'рот',w:'пить',o:[['喝','hē','пить'],['河','hé','река'],['妹','mèi','сестрёнка']]},
 {k:'目',km:'глаз',w:'глаз',o:[['眼','yǎn','глаз'],['银','yín','серебро'],['根','gēn','корень']]},
 {k:'氵',km:'вода',w:'река',o:[['河','hé','река'],['何','hé','кто, что'],['喝','hē','пить']]},
 {k:'女',km:'женщина',w:'она',o:[['她','tā','она'],['他','tā','он'],['地','dì','земля']]},
 {k:'亻',km:'человек',w:'он',o:[['他','tā','он'],['地','dì','земля'],['池','chí','пруд']]},
 {k:'木',km:'дерево',w:'лес',o:[['林','lín','лес'],['妹','mèi','сестрёнка'],['吃','chī','есть, кушать']]}];
const KEYOF={'喝':'口','河':'氵','妹':'女','眼':'目','银':'钅','根':'木','何':'亻','她':'女','他':'亻','地':'土','池':'氵','林':'木','吃':'口'};
const KM={'口':'рот','氵':'вода','女':'женщина','目':'глаз','钅':'металл','木':'дерево','亻':'человек','土':'земля'};
function keys(){const n=8;
 quiz(n,{title:'🔑 Ключи',startTxt:'Начать упражнение →',
  intro:`<div class="rbox" style="--c1:#FF3D77;--c2:#FF8A3D"><b>🔑 Правило ключа</b><div class="rr2"><span>🔑 <b>Ключ</b> подсказывает <b>СМЫСЛ</b>. Он стоит чаще <b>слева</b> или <b>сверху</b>.</span><span>🔊 Другая часть часто подсказывает <b>ЧТЕНИЕ</b>.</span><span>⚠️ Бывает, что <b>обе части — смысл</b>: 好 = 女 + 子</span></div></div>
   <div class="split"><span class="zh" style="color:#FF3D77">女</span>+<span class="zh" style="color:#3E86B8">马</span>=<span class="zh">妈</span></div>
   <p class="lead" style="text-align:center"><b style="color:#FF3D77">女 женщина</b> — смысл · <b style="color:#3E86B8">马 mǎ</b> — чтение</p>
   <div class="tip" style="font-size:16px">Во второй части будут <b>новые иероглифы</b> — их учить не нужно! Просто угадай смысл по ключу 🕵️</div>`,
  items:()=>{const A=KA.map(x=>({q:`<div class="big7 zh">${x.c}</div><div class="qq">${x.q}</div>`,o:x.o,r:x.r,cls:/^[一-鿿]$/.test(x.o[0])?'zh':'tx',why:x.why,lab:x.c+': '+x.q.replace(/<[^>]+>/g,'')}));
   const B=KB.map(x=>({q:`<div class="keyh"><span class="zh">${x.k}</span><div><b>ключ «${x.km}»</b><small>подсказывает смысл</small></div></div><span class="newb">НОВЫЕ ИЕРОГЛИФЫ</span><div class="qq">Какой из них значит <b>«${x.w}»</b>?</div>`,
    o:x.o.map(y=>y[0]),r:x.o[0][0],cls:'zh',wait:99999,lab:'ключ '+x.k+' → «'+x.w+'»',
    why:`Ключ ${x.k} «${x.km}» есть только у ${x.o[0][0]}.<div class="reveal">${x.o.map((y,j)=>`<div class="${j?'':'ok'}"><span class="zh">${[...y[0]].map(c=>c)}</span><span class="py">${y[1]}</span><small>«${y[2]}»</small><small>ключ <i class="zh">${KEYOF[y[0]]}</i> ${KM[KEYOF[y[0]]]}</small></div>`).join('')}</div>`}));
   return [...shuffle(A),...shuffle(B)];}});}

/* ---- 9: stroke order of a NEW character ---- */
const SO=[{c:'王',ok:0,o:[0,2,3],why:'Сверху вниз: первая — верхняя горизонтальная. А ещё: горизонталь — раньше вертикали.'},
 {c:'木',ok:0,o:[0,1,2],why:'Горизонталь — раньше вертикали (как в 十).'},
 {c:'中',ok:0,o:[0,3,2],why:'Сначала рамка «коробки»: левая вертикаль. Длинная черта посередине — в самом конце.'},
 {c:'田',ok:0,o:[0,4,2],why:'Сначала рамка: левая вертикаль. «Дно» коробки — в конце.'},
 {c:'大',ok:0,o:[0,1,2],why:'Горизонталь — первая. Потом черта влево, потом вправо (как в 人).'},
 {c:'土',ok:0,o:[0,1,2],why:'Сверху вниз: верхняя горизонталь, потом вертикаль, нижняя — в конце.'}];
function strokeSVG(c,hi){const d=HZDATA[c];if(!d)return '';return `<svg viewBox="0 0 1024 1024"><g transform="translate(0,900) scale(1,-1)">${d.strokes.map((p,i)=>`<path d="${p}" fill="${i===hi?'#FF3D77':'#C9CEDB'}"/>`).join('')}</g></svg>`;}
function strokes(){const n=9;
 quiz(n,{title:'✍️ Порядок черт',
  intro:`<div class="rbox" style="--c1:#2DBE8C;--c2:#5B6BD8"><b>Правила порядка черт</b><div class="srules">
   <span><span class="zh">三</span>сверху вниз</span><span><span class="zh">川</span>слева направо</span><span><span class="zh">十</span>сначала горизонталь, потом вертикаль</span><span><span class="zh">人</span>сначала черта влево, потом вправо</span><span><span class="zh">口</span>сначала рамка, «дно» — в конце</span></div></div>
   <div class="tip" style="font-size:16px">Тебе покажут <b>новый иероглиф</b> — его учить не нужно! По правилам догадайся, <b>какую черту пишут первой</b>. Она подсвечена розовым.</div>`,
  items:()=>shuffle(SO).map(x=>({q:`<span class="newb">НОВЫЙ ИЕРОГЛИФ</span><div class="sbig">${strokeSVG(x.c,-1)}</div><div class="qq">Какую черту пишут <b>первой</b>?</div>`,
   o:x.o.map(String),r:String(x.ok),cls:'sv',show:v=>strokeSVG(x.c,+v),rshow:'та, что отмечена зелёным',wait:99999,lab:x.c+' — первая черта',
   why:`${x.why}<div class="anim"><svg class="grid" viewBox="0 0 100 100"><g stroke="#FFB3C8" stroke-width=".6" stroke-dasharray="2 2"><line x1="50" y1="0" x2="50" y2="100"/><line x1="0" y1="50" x2="100" y2="50"/></g></svg><div class="hw" id="an"></div></div><p class="hint2" style="text-align:center;margin-top:6px">Смотри весь порядок черт 👆</p>`,
   after:()=>{const el=$('#an');if(!el||!window.HanziWriter||!HZDATA[x.c])return;const sz=el.clientWidth||200;const w=HanziWriter.create(el,x.c,{width:sz,height:sz,padding:sz*.08,showOutline:true,showCharacter:false,strokeColor:'#2B3270',outlineColor:'#E1E5EE',strokeAnimationSpeed:1.1,delayBetweenStrokes:350,charDataLoader:(ch,ok)=>ok(HZDATA[ch])});w.loopCharacterAnimation();}}))});}

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
