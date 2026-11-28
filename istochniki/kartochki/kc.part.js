/* ===================== Карточки: наши иероглифы ===================== */
// 2026-11-13. По навыку «Карточки» (контрольные карточки слов), под детскую группу:
// только пройденные иероглифы (2026-11-27: 你 我 好 叫 妈 爸 + уроки 9–11 他 她 们 吗 是 不; больше ничего!). Задания НУМЕРОВАННЫМ СПИСКОМ, те же номера — в кабинете
// учителя (kartochki/uchitel/). № 1 «Узнай иероглиф» (иероглиф → перевод, карточка переворачивается, апелляция),
// № 2 «Напиши иероглиф» (перевод → пишешь пальцем, подсказки «Не помню»), «Мои итоги» — три зоны и что не доделано.
// 2026-11-27 (Дарья): каждое задание можно переделывать сколько угодно раз; КАЖДАЯ попытка уходит в кабинет отдельной
// частью t1_<время> / t2_<время> (плюс t1/t2 — последняя). Итоги и зоны — по последней попытке.
const TASKS=[null,
 {t:'👀 Узнай иероглиф',d:'Видишь иероглиф — пишешь, что он значит',run:t1},
 {t:'✍️ Напиши иероглиф',d:'Видишь перевод — пишешь иероглиф пальцем',run:t2},
 {t:'🎯 Тренировка: 8 фаз',d:'Каждое слово от пиньиня до диктанта — проходи, пока не будет 100%',run:t3}];
const NT=TASKS.length-1;
const HW='kart12'; // было kart6 (6 знаков); с 27.11 — 12 знаков, дети проходят заново
let DONE={};try{DONE=JSON.parse(localStorage.getItem('zh-kc12-done')||'{}')}catch(e){}
const keep=()=>{try{localStorage.setItem('zh-kc12-done',JSON.stringify(DONE))}catch(e){}};
const API=/workers\.dev$/.test(location.hostname)?'/api/dz/':'https://gruppa-deti.ch-tutor-world.workers.dev/api/dz/';
let S={};try{S=JSON.parse(localStorage.getItem('zh-kc12')||'{}')}catch(e){}
const keepS=()=>{try{localStorage.setItem('zh-kc12',JSON.stringify(S))}catch(e){}};S.queue=S.queue||[];S.r1=S.r1||{};S.r2=S.r2||{};S.n1=S.n1||0;S.n2=S.n2||0;
const isTest=()=>/^(учитель|учительница|teacher|тест)$/i.test((S.name||'').trim());
const newSid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,8);
function send(part,data){S.queue=S.queue.filter(q=>q.part!==part);S.queue.push({part,data:Object.assign({},data,{ts:Date.now()})});keepS();flush();}
async function flush(){if(isTest()){S.queue=[];keepS();return;}if(!S.sid||!S.queue.length)return;const q=S.queue[0];
 try{const r=await fetch(API+'save',{method:'POST',headers:{'Content-Type':'text/plain'},body:JSON.stringify({hw:HW,sid:S.sid,name:S.name,part:q.part,data:q.data})});
  if(!r.ok)throw 0;S.queue.shift();keepS();if(S.queue.length)flush();}catch(e){clearTimeout(flush._t);flush._t=setTimeout(flush,15000);}}
addEventListener('online',flush);
const TOP='Тренировка лексики и иероглифики';
const NAMEQ=new URLSearchParams(location.search).get('name');
let TM=[];const later=(f,ms)=>{const t=setTimeout(f,ms);TM.push(t);return t;};
let KW=null;
function stopAll(){TM.forEach(clearTimeout);TM=[];try{curA&&curA.pause()}catch(e){}KW=null;}

/* ---------- данные: только пройденные иероглифы ---------- */
// [иероглиф, пиньинь, перевод, подсказка-перевод для № 2, принимаемые ответы (основы), пример zh, пример pinyin, пример ru, что озвучить, ключ]
const W=[
 {c:'你',py:'nǐ',ru:'ты',q:'«ты»',acc:['ты','теб','тобо','тебе'],ex:'你好！',exPy:'nǐ hǎo!',exRu:'Привет!',exA:'你好',key:'亻 «человек» — слева'},
 {c:'我',py:'wǒ',ru:'я',q:'«я»',acc:['я','мен','мне','мной'],ex:'我妈妈',exPy:'wǒ māma',exRu:'моя мама',exA:'我妈妈',key:''},
 {c:'好',py:'hǎo',ru:'хороший, хорошо',q:'«хороший, хорошо»',acc:['хорош','добр','отличн','прекрасн','good'],ex:'你好！',exPy:'nǐ hǎo!',exRu:'Привет! (дословно «ты хороший»)',exA:'你好',key:'女 «женщина» — слева'},
 {c:'叫',py:'jiào',ru:'звать, зваться',q:'«звать, зваться» (меня зовут…)',acc:['зва','зов','назыв','крич','зовут'],ex:'我叫…',exPy:'wǒ jiào…',exRu:'Меня зовут…',exA:'我叫',key:'口 «рот» — слева'},
 {c:'妈',py:'mā',ru:'мама',q:'«мама»',acc:['мам','мать','матер','мамоч'],ex:'我妈妈叫…',exPy:'wǒ māma jiào…',exRu:'Мою маму зовут…',exA:'我妈妈叫',key:'女 «женщина» — слева'},
 {c:'爸',py:'bà',ru:'папа',q:'«папа»',acc:['пап','отец','отц','отеч'],ex:'我爸爸叫…',exPy:'wǒ bàba jiào…',exRu:'Моего папу зовут…',exA:'我爸爸叫',key:'父 «отец» — сверху'},
 {c:'他',py:'tā',ru:'он',q:'«он»',acc:['он','его','ему','им','нем','he'],ex:'他是我爸爸。',exPy:'tā shì wǒ bàba.',exRu:'Он мой папа.',exA:'他是我爸爸',key:'亻 «человек» — слева'},
 {c:'她',py:'tā',ru:'она',q:'«она»',acc:['она','ее','ей','нее','she'],ex:'她是我妈妈。',exPy:'tā shì wǒ māma.',exRu:'Она моя мама.',exA:'她是我妈妈',key:'女 «женщина» — слева'},
 {c:'们',py:'men',ru:'много (людей)',q:'«много (людей)» — как в словах «мы», «вы», «они»',acc:['много','множ','люд','мы','вы','они','we','plural'],ex:'你们好！',exPy:'nǐmen hǎo!',exRu:'Привет всем!',exA:'你们好',key:'亻 «человек» — слева'},
 {c:'吗',py:'ma',ru:'вопросительная частица',q:'«вопросительная частица» (в конце вопроса)',acc:['вопрос','частиц','ли'],ex:'她是你妈妈吗？',exPy:'tā shì nǐ māma ma?',exRu:'Она твоя мама?',exA:'她是你妈妈吗',key:'口 «рот» — слева'},
 {c:'是',py:'shì',ru:'являться · да',q:'«являться» (он — мой папа)',acc:['явл','быть','есть','это','да','is'],ex:'他是我爸爸。',exPy:'tā shì wǒ bàba.',exRu:'Он мой папа.',exA:'他是我爸爸',key:''},
 {c:'不',py:'bù',ru:'не',q:'«не»',acc:['не','нет','no','not'],ex:'她不是我妈妈。',exPy:'tā bú shì wǒ māma.',exRu:'Она не моя мама.',exA:'她不是我妈妈',key:''}];
const WC=Object.fromEntries(W.map(x=>[x.c,x]));
const normW=s=>String(s||'').toLowerCase().replace(/ё/g,'е').replace(/[^a-zа-я\s-]/g,' ').split(/[\s-]+/).filter(Boolean);
const dunno=s=>/^\s*(не\s*знаю|незнаю|не\s*помню|\?+|-+)\s*$/i.test(s||'');
function accepted(w,ans){const ws=normW(ans);return w.acc.some(a=>ws.some(x=>a.length<=2?x===a:x.startsWith(a)));}

/* ---------- оболочка: шапка, шкала %, список ---------- */
function login(){stopAll();$('#app').innerHTML=`<div class="top n"><span class="zh kc-tlogo">你我</span><div><h1>${TOP}</h1><small>Сначала напиши своё имя</small></div></div>
 <div class="main n" style="text-align:center"><h2>Как тебя зовут?</h2><p class="lead">Имя и первая буква фамилии — как всегда. Так учитель увидит твои результаты.</p>
 <input id="nm" class="in" style="width:100%;font:inherit;font-size:20px;padding:14px 18px;border:0;outline:none;margin-top:16px;color:var(--ink)" placeholder="Имя и буква фамилии" maxlength="40" value="${esc(NAMEQ||S.name||'')}">
 <div class="row" style="justify-content:center"><button class="btn" id="go">Начать →</button></div></div>`;
 const go=()=>{const v=$('#nm').value.trim();if(v.length<2){toast('Напиши имя');return;}
  if(S.name&&S.name!==v){DONE={};keep();S={queue:[],r1:{},r2:{}};}
  S.name=v;S.sid=S.sid||newSid();keepS();flush();location.hash='';route();};
 $('#go').onclick=go;$('#nm').onkeydown=e=>{if(e.key==='Enter')go();};}
const nDone=()=>Object.keys(DONE).filter(k=>TASKS[+k]).length;
const pbar=()=>{const d=nDone(),pc=Math.round(d*100/NT);return `<div class="pbar n" id="pbar"><div class="pbt"><span>Выполнено <b>${d}</b> из ${NT}</span><b>${pc}%</b></div><div class="pbl"><i style="width:${pc}%"></i></div></div>`;};
const shell=h=>{stopAll();$('#app').innerHTML=`<div class="top n"><span class="zh kc-tlogo">你我</span><div><h1>${TOP}</h1><small>${isTest()?'🧑‍🏫 режим учителя — результаты не сохраняются':'все наши иероглифы — проверь себя'}</small></div><button class="back n" style="margin:0 0 0 auto;font-size:13px" id="me">${esc(S.name||'')} ✎</button></div>${pbar()}<div class="main n">${h}</div>`;
 $('#me').onclick=()=>login();scrollTo(0,0);};
const backBtn='<button class="back n" onclick="location.hash=\'\'">‹ Все задания</button>';
// 28.11 Дарья: две части — «Заучивание» (8 фаз) и «Контроль» (старые карточки и написание).
// Внутри задания по-прежнему 1 узнай, 2 напиши, 3 тренировка (так хранятся результаты), а детям и в кабинете номера по порядку:
const ORD=[3,1,2];const D=i=>ORD.indexOf(i)+1;const PART={3:'📚 Заучивание',1:'✅ Контроль'};
const tag=n=>`<span class="tag">Задание № ${D(n)}</span>`;
const left=()=>ORD.filter(i=>!DONE[i]);
const leftBox=()=>{const L=left();if(!L.length)return `<div class="allok">🏆 Все задания сделаны! Ты супер!</div>`;
 return `<div class="left"><h3>⏳ Ещё не доделано (${L.length}):</h3>${L.map(i=>`<button data-go="${i}"><span class="no">${D(i)}</span><span>${TASKS[i].t}</span><small>Сделать →</small></button>`).join('')}</div>`;};
const leftOn=()=>document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>{location.hash='#'+b.dataset.go;});
const locked=n=>n===2&&!DONE[1]&&!isTest();

function home(){const nx=ORD.find(i=>!DONE[i]&&!locked(i));
 shell(`<div class="hero"><h2>Привет${S.name?', '+esc(S.name.split(/\s+/)[0]):''}! 👋</h2>
  <p class="lead">Все наши иероглифы. Сначала <b>заучивание</b> — 8 фаз, от пиньиня до диктанта. Потом <b>контроль</b>: узнай каждый и напиши по памяти.</p>
  <div class="kc-six">${W.map(w=>`<span class="zh">${w.c}</span>`).join('')}</div></div>
  <div class="list">${ORD.map(i=>{const x=TASKS[i];const lk=locked(i);return `${PART[i]?`<h3 class="kc-part">${PART[i]}</h3>`:''}<button class="ti n${i===nx&&!lk?' hot':''}${DONE[i]?'':' todo'}${lk?' kc-lock':''}" data-n="${i}"><span class="no" style="${DONE[i]?'background:var(--ok)':i===nx?'background:var(--ac)':''}">${D(i)}</span><span><b>${x.t}</b><small>${lk?'🔒 Откроется после задания № '+D(1):x.d}</small></span><span class="sc7">${DONE[i]?'✓ '+DONE[i]:''}</span></button>`;}).join('')}</div>
  <div class="row" style="justify-content:center"><button class="btn" id="it">🏁 Мои итоги</button>${isTest()?'<button class="btn g" id="rs">↺ Сбросить (учитель)</button>':''}</div>`);
 document.querySelectorAll('[data-n]').forEach(b=>b.onclick=()=>{if(locked(+b.dataset.n)){toast('Сначала сделай задание № '+D(1)+' 🙂');return;}location.hash='#'+b.dataset.n;});
 $('#it').onclick=()=>{location.hash='#itogi';};
 const rs=$('#rs');if(rs)rs.onclick=()=>{DONE={};keep();S.r1={};S.r2={};keepS();home();toast('Сброшено');};}
function route(){if(!S.name){if(NAMEQ){S.name=NAMEQ;S.sid=S.sid||newSid();keepS();}else return login();}
 const h=location.hash.slice(1);if(h==='itogi')return itogi();const n=+h;
 if(TASKS[n]){if(locked(n)){location.hash='';return;}TASKS[n].run();}else home();}
addEventListener('hashchange',route);
const nextBtns=n=>{const L=left().filter(i=>i!==n),nx=L.find(i=>D(i)>D(n))||L[0];return `<div class="row">${nx?`<button class="btn" onclick="location.hash='#${nx}'">Задание № ${D(nx)} →</button>`:`<button class="btn" onclick="location.hash='#itogi'">🏁 Мои итоги</button>`}<button class="btn g" onclick="location.hash=''">‹ Все задания</button></div>${nx?'':leftBox()}`;};

/* ---------- пройти ещё раз (сколько угодно попыток) ---------- */
const againBox=(n,tries,all)=>`<p class="lead" style="text-align:center;margin:6px 0 0">${tries>1?'Попытка № '+tries+'. ':''}${all?'Отлично! Можно пройти ещё раз для тренировки.':'Можно пройти ещё раз — учитель увидит все попытки.'}</p><div class="row" style="justify-content:center"><button class="btn${all?' g':''}" data-again="${n}">↻ Пройти ещё раз</button></div>`;
const againOn=()=>document.querySelectorAll('[data-again]').forEach(b=>b.onclick=()=>{const n=+b.dataset.again;if(location.hash!=='#'+n){history.replaceState(null,'','#'+n);}(n===1?t1:t2)(true);});

/* ===================== № 1 Узнай иероглиф ===================== */
function t1(again){const n=1;
 if(DONE[1]&&!isTest()&&!again)return t1res();
 shell(`${backBtn}${tag(n)}<h2>👀 Узнай иероглиф</h2>
  <div class="rbox" style="--c1:#5B6BD8;--c2:#2DBE8C"><b>Как делать</b><div class="rr2"><span>👀 Смотри на иероглиф, 🔊 можно послушать</span><span>⌨️ Напиши по-русски, что он значит</span><span>🤷 Не помнишь — нажми «Не знаю», ничего страшного</span><span>🃏 Карточка перевернётся — там ответ и пример</span></div></div>
  <div class="row" style="justify-content:center"><button class="btn" id="st" style="width:100%">🃏 Начать: ${W.length} карточек</button></div>`);
 $('#st').onclick=()=>{const order=shuffle(W),res=[];let k=0;
  const one=()=>{if(k>=order.length)return end();const w=order[k];
   shell(`${backBtn}${tag(n)}<div class="qhead kc-qh"><span>Карточка ${k+1} из ${order.length}</span><span>${order.map((_,i)=>`<i class="kc-dot${i<k?' d':i===k?' c':''}"></i>`).join('')}</span></div>
    <div class="kc-card" id="kc"><div class="kc-in">
     <div class="kc-face kc-front"><button class="play n kc-pl" id="pl" aria-label="Послушать">🔊</button><div class="zh kc-big">${w.c}</div><small class="kc-ask">Что значит этот иероглиф?</small></div>
     <div class="kc-face kc-back" id="bk"></div></div></div>
    <div id="ia"><input id="an" class="in kc-inp" placeholder="Напиши перевод по-русски" maxlength="40" autocomplete="off" autocapitalize="off" spellcheck="false">
    <div class="row" style="justify-content:center"><button class="btn" id="ok">✓ Проверить</button><button class="btn g" id="dk">🤷 Не знаю</button></div></div>
    <div id="nx"></div>`);
   const pl=$('#pl');pl.onclick=()=>playW(w.c,pl);
   const inp=$('#an');setTimeout(()=>{try{inp.focus({preventScroll:true})}catch(e){}},50);
   const answer=dk=>{const a=dk?'':inp.value.trim();if(!dk&&!a){toast('Напиши перевод или нажми «Не знаю»');return;}
    const idk=dk||dunno(a),ok=!idk&&accepted(w,a);const r={c:w.c,a:idk?'не знаю':a,ok:ok?1:0,idk:idk?1:0,ap:0};res.push(r);
    $('#ia').style.display='none';
    $('#bk').innerHTML=`<div class="kc-verd ${ok?'g':idk?'m':'b'}">${ok?'✓ Верно!':idk?'Ничего страшного, запомним 🙂':'Не совсем так'}</div>
     <div class="kc-bh"><span class="zh">${w.c}</span><div><b class="py">${w.py}</b><span class="kc-ru">${w.ru}</span></div></div>
     <button class="kc-ex" id="ex"><span class="zh">${w.ex}</span><b class="py">${w.exPy}</b><small>${w.exRu}</small><i>🔊</i></button>
     ${idk?'':`<div class="kc-your">Твой ответ: <b>${esc(a)}</b></div>`}`;
    $('#kc').classList.add('fl');
    $('#ex').onclick=()=>playW(w.exA,$('#ex'));later(()=>playW(w.c,pl),350);
    $('#nx').innerHTML=`${!ok&&!idk?'<div class="row" style="justify-content:center"><button class="btn g kc-ap" id="ap">🙋 Мой ответ правильный, просто сказано по-другому</button></div>':''}
     <div class="row" style="justify-content:center"><button class="btn" id="go">${k+1<order.length?'Дальше →':'Готово →'}</button></div>`;
    const ap=$('#ap');if(ap)ap.onclick=()=>{r.ok=1;r.ap=1;ap.disabled=true;ap.textContent='✓ Засчитано — учитель посмотрит';const v=$('.kc-verd');v.className='kc-verd g';v.textContent='✓ Засчитано';};
    $('#go').onclick=()=>{k++;one();};};
   $('#ok').onclick=()=>answer(false);$('#dk').onclick=()=>answer(true);inp.onkeydown=e=>{if(e.key==='Enter')answer(false);};};
  const end=()=>{const ok=res.filter(r=>r.ok).length;DONE[1]=ok+'/'+res.length;keep();
   res.forEach(r=>S.r1[r.c]=r);keepS();
   S.n1++;keepS();const d={score:ok,of:res.length,res,ap:res.filter(r=>r.ap).length,try:S.n1};send('t1',d);send('t1_'+Date.now().toString(36),d);t1res();};
  one();};}
function t1res(){const n=1,R=W.map(w=>S.r1[w.c]).filter(Boolean),ok=R.filter(r=>r.ok).length;
 shell(`${backBtn}${tag(n)}<h2>👀 Узнай иероглиф — готово!</h2><div class="res" style="text-align:center">${ok} / ${R.length}</div>${againBox(1,S.n1,ok===R.length)}
  <p class="lead" style="text-align:center">${ok===R.length?'Ты узнал(а) все иероглифы! 🏆':'Хорошая работа! Остальные можно повторить для закрепления 🙂'}</p>
  <div class="kc-rl">${R.map(r=>{const w=WC[r.c];return `<div class="${r.ok?'g':r.idk?'m':'b'}"><span class="zh">${r.c}</span><span><b>${w.ru}</b><small>${r.idk?'не знал(а)':'твой ответ: '+esc(r.a)}${r.ap?' · 🙋 засчитано':''}</small></span><i>${r.ok?'✓':'○'}</i></div>`;}).join('')}</div>
  ${nextBtns(n)}`);leftOn();againOn(1);}

/* ===================== № 2 Напиши иероглиф ===================== */
const GRID='<svg class="grid" viewBox="0 0 100 100"><g stroke="#FFB3C8" stroke-width=".6" stroke-dasharray="2 2"><line x1="0" y1="0" x2="100" y2="100"/><line x1="100" y1="0" x2="0" y2="100"/><line x1="50" y1="0" x2="50" y2="100"/><line x1="0" y1="50" x2="100" y2="50"/></g></svg>';
const hwOpts=sz=>({width:sz,height:sz,padding:sz*.08,showOutline:false,showCharacter:false,outlineColor:'#E1E5EE',strokeColor:'#2B3270',radicalColor:'#FF5C8A',drawingColor:'#5B6BD8',drawingWidth:Math.round(sz/16),highlightColor:'#2DBE8C',strokeAnimationSpeed:1.2,delayBetweenStrokes:250,charDataLoader:(ch,ok)=>ok(HZDATA[ch])});
function t2(again){const n=2;
 if(DONE[2]&&!isTest()&&!again)return t2res();
 shell(`${backBtn}${tag(n)}<h2>✍️ Напиши иероглиф</h2>
  <div class="rbox" style="--c1:#FF5C8A;--c2:#8E5BE8"><b>Как делать</b><div class="rr2"><span>📖 Читаешь перевод — пишешь иероглиф пальцем (или мышкой) в клетке</span><span>✏️ Каждую черту по порядку. Две ошибки подряд — покажем следующую черту</span><span>💡 «Не помню» — подсказка (можно 3 раза)</span><span>👀 Совсем забыл(а) — красная кнопка покажет весь знак</span></div></div>
  <div class="row" style="justify-content:center"><button class="btn" id="st" style="width:100%">✍️ Начать: ${W.length} иероглифов</button></div>`);
 $('#st').onclick=()=>{const order=shuffle(W),res=[];let k=0;
  const one=()=>{if(k>=order.length)return end();const w=order[k];
   shell(`${backBtn}${tag(n)}<div class="qhead kc-qh"><span>Иероглиф ${k+1} из ${order.length}</span><span>${order.map((_,i)=>`<i class="kc-dot${i<k?' d':i===k?' c':''}"></i>`).join('')}</span></div>
    <div class="kc-wq"><small>Напиши иероглиф</small><b>${w.q}</b></div>
    <div class="wbox">${GRID}<div class="hw" id="hw"></div></div>
    <p class="hint2" id="wh" style="text-align:center;margin-top:8px">Пиши черту за чертой 👇</p>
    <div class="row" style="justify-content:center"><button class="btn g" id="hn">💡 Не помню</button><button class="btn kc-red" id="sh">👀 Показать весь знак</button></div>
    <div id="nx"></div>`);
   const el=$('#hw'),wh=$('#wh'),sz=el.clientWidth||280;el.innerHTML='';
   const r={c:w.c,mist:0,hints:0,shown:0};let row=0,cur=0,fin=false;
   const done=()=>{if(fin)return;fin=true;res.push(r);$('#hn').disabled=true;$('#sh').disabled=true;
    wh.innerHTML=r.shown?'Теперь ты знаешь, как он пишется 👀':(r.hints||r.mist?'✓ Написано!':'✓ Написано сам(а) — без ошибок! 🏆');
    $('#nx').innerHTML=`<button class="kc-ex" id="ex" style="margin-top:12px"><span class="zh">${w.c}</span><b class="py">${w.py}</b><small>${w.ru}</small><i>🔊</i></button><div class="row" style="justify-content:center"><button class="btn" id="go">${k+1<order.length?'Дальше →':'Готово →'}</button></div>`;
    $('#ex').onclick=()=>playW(w.c,$('#ex'));later(()=>playW(w.c),200);$('#go').onclick=()=>{k++;one();};};
   if(!window.HanziWriter||!HZDATA[w.c]){wh.textContent='Напиши '+w.c+' пальцем в воздухе 🙂';r.shown=1;later(done,1200);return;}
   const hw=HanziWriter.create(el,w.c,hwOpts(sz));KW=hw;
   const quiz=()=>hw.quiz({showHintAfterMisses:2,highlightOnComplete:true,
    onMistake:d=>{r.mist++;row++;wh.textContent=row>=2?'Смотри, где эта черта, и повтори 👀':'Не та черта — попробуй ещё 🙂';},
    onCorrectStroke:d=>{row=0;cur=d.strokeNum+1;wh.textContent='Так держать! ✓';},
    onComplete:()=>{if(KW!==hw)return;later(done,500);}});
   quiz();
   const strokeHint=()=>{try{hw.highlightStroke(cur)}catch(e){}};
   $('#hn').onclick=()=>{if(fin)return;r.hints++;
    if(r.hints===1){strokeHint();wh.innerHTML='💡 Подсказка 1: смотри — так идёт следующая черта';}
    else if(r.hints===2){wh.innerHTML=w.key?`💡 Подсказка 2: ключ этого иероглифа — <b class="zh">${w.key}</b>`:'💡 Подсказка 2: посмотри на контур — он сейчас мигнёт';if(!w.key){hw.showOutline();later(()=>{try{hw.hideOutline()}catch(e){}},1500);}}
    else{hw.showOutline();strokeHint();wh.innerHTML='💡 Подсказка 3: контур в клетке и ещё одна черта. Обведи!';$('#hn').disabled=true;}};
   $('#sh').onclick=()=>{if(fin)return;r.shown=1;$('#hn').disabled=true;$('#sh').disabled=true;wh.textContent='Смотри, как он пишется 👀';
    try{hw.cancelQuiz()}catch(e){}hw.hideCharacter();hw.animateCharacter({onComplete:()=>{if(KW!==hw)return;wh.textContent='А теперь обведи сам(а) по контуру ✍️';hw.hideCharacter();hw.showOutline();quiz();}});};};
  const end=()=>{const self=res.filter(r=>!r.shown&&!r.hints).length;DONE[2]=self+'/'+res.length;keep();
   res.forEach(r=>S.r2[r.c]=r);keepS();
   S.n2++;keepS();const d={score:self,of:res.length,res:res.map(r=>[r.c,r.mist,r.hints,r.shown]),try:S.n2};send('t2',d);send('t2_'+Date.now().toString(36),d);t2res();};
  one();};}
function t2res(){const n=2,R=W.map(w=>S.r2[w.c]).filter(Boolean),self=R.filter(r=>!r.shown&&!r.hints).length;
 shell(`${backBtn}${tag(n)}<h2>✍️ Напиши иероглиф — готово!</h2><div class="res" style="text-align:center">${self} / ${R.length}</div>${againBox(2,S.n2,self===R.length)}
  <p class="lead" style="text-align:center">${self===R.length?'Все — сам(а), без подсказок! 🏆':'Сам(а), без подсказок: '+self+' из '+R.length+'. Остальные можно повторить для закрепления 🙂'}</p>
  <div class="kc-rl">${R.map(r=>`<div class="${r.shown?'b':r.hints||r.mist?'m':'g'}"><span class="zh">${r.c}</span><span><b>${WC[r.c].ru}</b><small>${r.shown?'смотрел(а) весь знак':r.hints?'подсказок: '+r.hints:'сам(а)'}${r.mist?' · ошибок в чертах: '+r.mist:''}</small></span><i>${r.shown?'👀':r.hints?'💡':'✓'}</i></div>`).join('')}</div>
  ${nextBtns(n)}`);leftOn();againOn(2);}

/* ===================== Мои итоги: зоны ===================== */
function zoneOf(c){const a=S.r1[c],b=S.r2[c];if(!a||!b)return null;
 if(b.shown||(!a.ok&&b.hints>=2))return 'r';
 if(a.ok&&!a.ap&&!b.hints&&!b.mist)return 'g';return 'y';}
function itogi(){const L=left();const Z={g:[],y:[],r:[]};W.forEach(w=>{const z=zoneOf(w.c);if(z)Z[z].push(w.c);});
 send('itogi',{done:nDone(),of:NT,left:L,zones:Z});
 const zb=(k,ic,t,sub)=>Z[k].length?`<div class="kc-zone ${k}"><h3>${ic} ${t}</h3><small>${sub}</small><div>${Z[k].map(c=>`<button class="kc-chip" data-w="${c}"><span class="zh">${c}</span><b>${WC[c].py}</b><small>${WC[c].ru}</small></button>`).join('')}</div></div>`:'';
 const any=Z.g.length+Z.y.length+Z.r.length;
 shell(`${backBtn}<h2>🏁 Мои итоги</h2><p class="lead">Сделано <b>${nDone()} из ${NT}</b> заданий.</p>
  ${any?zb('g','🟢','Знаешь','Узнал(а) и написал(а) сам(а) без ошибок')+zb('y','🟡','Стоит повторить','Была ошибка в переводе, подсказка или ошибка в чертах')+zb('r','🔴','Особое внимание','Смотрел(а) весь знак — повтори его ещё раз')
   :'<p class="lead">Сделай оба задания контроля — и здесь появятся твои иероглифы по зонам: 🟢 знаешь, 🟡 стоит повторить, 🔴 особое внимание.</p>'}
  ${!L.length&&(Z.y.length||Z.r.length)?`<p class="lead" style="text-align:center;margin-top:14px">Хочешь, чтобы все иероглифы стали 🟢? Пройди задания ещё раз:</p><div class="row" style="justify-content:center"><button class="btn" data-again="1">↻ Ещё раз № ${D(1)}</button><button class="btn" data-again="2">↻ Ещё раз № ${D(2)}</button></div>`:''}
  ${leftBox()}
  ${L.length?'':'<p class="lead" style="text-align:center">Учитель видит твои результаты. До встречи на уроке! Zàijiàn!</p>'}`);
 document.querySelectorAll('.kc-chip').forEach(b=>b.onclick=()=>playW(b.dataset.w,b));leftOn();againOn();}
/* ===================== № 3 Тренировка: 8 фаз (Дарья 28.11) ===================== */
// Каждое слово идёт по фазам 1→8 само: верно — фаза +1, ошибка — остаётся на этой фазе и в этой же проходке
// возвращается через 2–3 вопроса (до 2 раз). Блоки: 1–3 пиньинь и перевод, 4–6 иероглиф и звук, 7–8 по памяти;
// блок 3 открывается, когда ВСЕ слова прошли фазы 1–6. Проходка — по одному вопросу на каждое доступное слово.
// Прогресс — в браузере (S.tr), каждая проходка уходит в кабинет частью t3_<время>, итог — t3.
const TN={'你':3,'我':3,'好':3,'叫':4,'妈':1,'爸':4,'他':1,'她':1,'们':0,'吗':0,'是':4,'不':4};
const TWIN={'他':'她','她':'他'};
const LOOK={'妈':['吗','她','好'],'吗':['妈','叫','们'],'他':['她','你','们'],'她':['他','妈','好'],'你':['们','他','我'],'们':['你','他','门'],'好':['她','妈','你'],'我':['你','好','是'],'叫':['吗','好','爸'],'爸':['妈','他','叫'],'是':['不','我','好'],'不':['是','你','们']};
const PH=[null,
 {t:'Пиньинь → выбери перевод',b:1},{t:'Пиньинь → напиши перевод',b:1},{t:'Перевод → напиши пиньинь и тон',b:1},
 {t:'Пиньинь → выбери иероглиф',b:2},{t:'Слушай иероглиф → выбери перевод',b:2},{t:'Слушай иероглиф → напиши перевод',b:2},
 {t:'Перевод → выбери иероглиф',b:3},{t:'Диктант: напиши иероглиф',b:3}];
const BLK=[null,{t:'Блок 1 · пиньинь и перевод',p:[1,2,3]},{t:'Блок 2 · иероглиф и звук',p:[4,5,6]},{t:'Блок 3 · по памяти',p:[7,8]}];
const plainPy=s=>String(s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-zü]/g,'');
const trS=()=>{S.tr=S.tr||{ph:{},runs:0};W.forEach(w=>{if(!S.tr.ph[w.c])S.tr.ph[w.c]=1;});return S.tr;};
const b3open=()=>W.every(w=>trS().ph[w.c]>=7);
const phPct=p=>Math.round(W.filter(w=>trS().ph[w.c]>p).length*100/W.length);
const trPct=()=>Math.round(W.reduce((a,w)=>a+Math.min(trS().ph[w.c],9)-1,0)*100/(W.length*8));
const trDone=()=>W.every(w=>trS().ph[w.c]>=9);
function t3(){const n=3,T=trS();if(trDone()&&!DONE[3]){DONE[3]='100%';keep();}
 const ph=p=>{const v=phPct(p);return `<div class="ph${v===100?' full':''}"><span class="n">${p}</span><b>${PH[p].t}</b><em>${v}%</em><div class="bar"><i style="width:${v}%"></i></div><small>${W.filter(w=>T.ph[w.c]>p).length} из ${W.length} слов</small></div>`;};
 const bp=b=>Math.round(BLK[b].p.reduce((a,p)=>a+phPct(p),0)/BLK[b].p.length);
 shell(`${backBtn}${tag(n)}<h2>🎯 Тренировка: 8 фаз</h2><div class="fz-top"><b>Всего: ${trPct()}%</b><small>Проходок: ${T.runs}</small></div>
  ${T.runs?'':`<div class="rbox" style="--c1:#7C6FFF;--c2:#5B6BD8;margin-bottom:12px"><b>Как делать</b><div class="rr2"><span>▶ Нажми «Новая проходка» — каждое слово спросим на его фазе</span><span>✓ Верно — слово переходит на следующую фазу</span><span>🔁 Ошибся — слово вернётся ещё раз, пока не запомнишь</span><span>🏆 Цель — 100% во всех 8 фазах</span></div></div>`}
  ${[1,2,3].map(b=>{const lk=b===3&&!b3open();return `<div class="blk${lk?' lock':''}"><h3>${lk?'🔒 ':''}${BLK[b].t}<span>${lk?'откроется, когда все слова пройдут фазы 1–6':bp(b)+'%'}</span></h3>${BLK[b].p.map(ph).join('')}</div>`;}).join('')}
  ${trDone()?`<div class="allok">🏆 Все 12 иероглифов прошли все 8 фаз! Можно тренироваться ещё.</div>`:''}
  <div class="row" style="justify-content:center"><button class="btn" id="go3" style="width:100%">▶ ${trDone()?'Ещё проходка (повторение)':'Новая проходка'}</button></div>
  ${isTest()?'<div class="row" style="justify-content:center"><button class="btn g" id="rs3">↺ Сбросить тренировку (учитель)</button></div>':''}
  ${nextBtns(n)}`);leftOn();
 $('#go3').onclick=trRun;const r=$('#rs3');if(r)r.onclick=()=>{S.tr={ph:{},runs:0};delete DONE[3];keep();keepS();t3();toast('Сброшено');};}
function trRun(){const T=trS(),open3=b3open(),all=trDone();
 // слова этой проходки: доступные, сначала нижние фазы; после 100% — повторение всех на фазах 7–8
 let pool=W.filter(w=>{const p=T.ph[w.c];return all||p<=6||(open3&&p<=8);});
 const q=shuffle(pool).sort((a,b)=>T.ph[a.c]-T.ph[b.c]).map(w=>({w,p:all?(Math.random()<.5?7:8):Math.min(T.ph[w.c],8),re:0}));
 const Q=shuffle(q.slice(0,12));const log=[];let k=0,prevOk=[];
 const up=(w)=>{if(!all&&T.ph[w.c]<9)T.ph[w.c]++;};
 const fin=()=>{T.runs++;keepS();if(trDone()&&!DONE[3]){DONE[3]='100%';keep();}
  const ok=log.filter(x=>x[2]).length;send('t3',{pct:trPct(),ph:T.ph,runs:T.runs});send('t3_'+Date.now().toString(36),{ok,of:log.length,log,pct:trPct()});
  shell(`${backBtn}${tag(3)}<h2>🎯 Проходка готова!</h2><div class="res" style="text-align:center">${ok} / ${log.length}</div>
   <p class="lead" style="text-align:center">Всего пройдено: <b>${trPct()}%</b>. ${ok===log.length?'Ни одной ошибки! 🏆':'Ошибки — это нормально: эти слова вернутся в следующей проходке 🙂'}</p>
   <div class="kc-rl">${log.map(([c,p,o])=>`<div class="${o?'g':'b'}"><span class="zh">${c}</span><span><b>${WC[c].ru}</b><small>фаза ${p} · ${o?'верно → дальше':'ещё раз потренируем'}</small></span><i>${o?'✓':'↻'}</i></div>`).join('')}</div>
   <div class="row" style="justify-content:center"><button class="btn" id="again3">▶ Ещё проходка</button><button class="btn g" id="bd3">📊 Мои фазы</button></div>`);
  $('#again3').onclick=trRun;$('#bd3').onclick=t3;};
 const next=()=>{if(k>=Q.length)return fin();const it=Q[k];ask(it,(ok,g)=>{log.push([it.w.c,it.p,ok?1:0,String(g||'').slice(0,40)]);
   if(ok)up(it.w);else if(it.re<2){Q.splice(Math.min(k+3,Q.length),0,{w:it.w,p:it.p,re:it.re+1});}
   keepS();k++;next();});};
 const ask=(it,done)=>{const {w,p}=it;let answered=false,given='';
  const head=`${backBtn}${tag(3)}<div class="q-ph" data-c="${w.c}" data-p="${p}"><span>Вопрос ${k+1} из ${Q.length}</span><b>Фаза ${p}</b></div>`;
  const big=(main,cls,sub)=>`<div class="q-big"><div class="${cls}">${main}</div><small>${sub}</small></div>`;
  const ruQ=w.q.replace(/^«|».*$/g,'');
  const verdict=(ok,extra)=>{answered=true;$('#nx').innerHTML=`<div class="kc-verd ${ok?'g':'b'}" style="text-align:center;margin-top:12px">${ok?'✓ Верно!':'Не совсем — запомни:'}</div>
    <div class="kc-bh" style="justify-content:center;margin-top:10px"><span class="zh">${w.c}</span><div><b class="py">${w.py}</b><span class="kc-ru">${w.ru}</span></div></div>${extra||''}
    <div class="row" style="justify-content:center"><button class="btn" id="nx3" style="width:100%">Дальше →</button></div>`;
   $('#nx3').onclick=()=>done(ok,given);try{$('#nx3').scrollIntoView({block:'nearest'})}catch(e){}};
  const choose=(opts,right,render,html)=>{const [a]=arrange(opts,right,prevOk);prevOk.push(a.indexOf(right));
   shell(head+html+`<div class="q-opts${render==='zh'?' zh4':''}">${a.map((o,i)=>`<button data-i="${i}" class="${render==='zh'?'zh':''}">${esc(o)}</button>`).join('')}</div><div id="nx"></div>`);
   document.querySelectorAll('.q-opts button').forEach(b=>b.onclick=()=>{if(answered)return;const v=a[+b.dataset.i],ok=v===right;given=v;
    b.classList.add(ok?'ok':'no');if(!ok)document.querySelectorAll('.q-opts button').forEach(x=>{if(a[+x.dataset.i]===right)x.classList.add('ok');});
    document.querySelectorAll('.q-opts button').forEach(x=>x.disabled=true);verdict(ok);});};
  const typeIn=(html,ph,check,extraHtml)=>{shell(head+html+`<input id="an3" class="in kc-inp" placeholder="${ph}" maxlength="40" autocomplete="off" autocapitalize="off" spellcheck="false">${extraHtml||''}
    <div class="row" style="justify-content:center"><button class="btn" id="ok3" style="width:100%">✓ Проверить</button></div><div id="nx"></div>`);
   const inp=$('#an3');setTimeout(()=>{try{inp.focus({preventScroll:true})}catch(e){}},50);
   const go=()=>{if(answered)return;const r=check(inp.value.trim());if(r===null)return;given=inp.value.trim()+(given?' '+given:'');inp.disabled=true;$('#ok3').style.display='none';
    document.querySelectorAll('.tones button').forEach(x=>x.disabled=true);verdict(r,inp.value.trim()&&!r?`<div class="kc-your" style="text-align:center">Твой ответ: <b>${esc(inp.value.trim())}</b></div>`:'');};
   $('#ok3').onclick=go;inp.onkeydown=e=>{if(e.key==='Enter')go();};};
  const ruOpts=excl=>{const pool=shuffle(W.filter(x=>x.c!==w.c&&!excl.includes(x.c))).slice(0,3).map(x=>x.ru);return [w.ru,...pool];};
  const zhOpts=excl=>{let pool=(LOOK[w.c]||[]).filter(c=>WC[c]&&c!==w.c&&!excl.includes(c));
   pool=shuffle(pool).slice(0,Math.random()<.5?2:1);const rest=shuffle(W.map(x=>x.c).filter(c=>c!==w.c&&!pool.includes(c)&&!excl.includes(c)));
   return [w.c,...pool,...rest].slice(0,4);};
  const okRu=v=>accepted(w,v)||(TWIN[w.c]&&p<=2&&accepted(WC[TWIN[w.c]],v));
  const plBtn=`<button class="play n kc-pl" id="pl3" aria-label="Послушать">🔊</button>`;
  if(p===1)choose(ruOpts(TWIN[w.c]?[TWIN[w.c]]:[]),w.ru,'ru',big(w.py,'py','Что это значит?'));
  else if(p===2)typeIn(big(w.py,'py','Напиши, что это значит, по-русски'),'Перевод по-русски',v=>{if(!v){toast('Напиши перевод');return null;}return okRu(v);});
  else if(p===3){let tone=null;typeIn(big('«'+ruQ+'»','ru','Напиши пиньинь и выбери тон'),'Пиньинь без тона, например ni',v=>{
     if(!v){toast('Напиши пиньинь');return null;}if(tone===null){toast('Выбери тон');return null;}given='тон '+tone;return plainPy(v)===plainPy(w.py)&&tone===TN[w.c];},
    `<div class="tones">${[1,2,3,4,0].map(t=>`<button data-t="${t}">${t}<small>${['','ˉ','ˊ','ˇ','ˋ'][t]||'нулевой'}</small></button>`).join('')}</div>`);
   document.querySelectorAll('.tones button').forEach(b=>b.onclick=()=>{tone=+b.dataset.t;document.querySelectorAll('.tones button').forEach(x=>x.classList.toggle('on',x===b));});}
  else if(p===4)choose(zhOpts(TWIN[w.c]?[TWIN[w.c]]:[]),w.c,'zh',big(w.py,'py','Выбери иероглиф'));
  else if(p===5||p===6){const html=`<div class="q-big" style="position:relative">${plBtn}<div class="zh kc-big" style="font-size:min(140px,34vw)">${w.c}</div><small>${p===5?'Послушай и выбери перевод':'Послушай и напиши перевод'}</small></div>`;
   if(p===5)choose(ruOpts([]),w.ru,'ru',html);else typeIn(html,'Перевод по-русски',v=>{if(!v){toast('Напиши перевод');return null;}return okRu(v);});
   const pl=$('#pl3');pl.onclick=()=>playW(w.c,pl);later(()=>playW(w.c,pl),300);}
  else if(p===7)choose(zhOpts([]),w.c,'zh',big('«'+ruQ+'»','ru','Выбери иероглиф'));
  else{shell(head+big('«'+ruQ+'»','ru','Диктант: напиши иероглиф по памяти')+`<div class="wbox" style="margin-top:12px">${GRID}<div class="hw" id="hw"></div></div>
    <p class="hint2" id="wh" style="text-align:center;margin-top:8px">Пиши черту за чертой 👇</p><div class="row" style="justify-content:center"><button class="btn g" id="dk3">🤷 Не помню</button></div><div id="nx"></div>`);
   const el=$('#hw'),wh=$('#wh'),sz=el.clientWidth||280;el.innerHTML='';let mist=0;
   if(!window.HanziWriter||!HZDATA[w.c]){verdict(false);return;}
   const hw=HanziWriter.create(el,w.c,hwOpts(sz));KW=hw;
   hw.quiz({showHintAfterMisses:1,highlightOnComplete:true,
    onMistake:()=>{mist++;wh.textContent='Не та черта — посмотри подсказку и продолжай 👀';},
    onCorrectStroke:()=>{wh.textContent='Так держать! ✓';},
    onComplete:()=>{if(KW!==hw||answered)return;$('#dk3').style.display='none';wh.textContent=mist?'Написано, но с ошибкой — потренируем ещё':'✓ Написано по памяти без ошибок!';given=mist?'ошибок в чертах: '+mist:'';later(()=>verdict(!mist),400);}});
   $('#dk3').onclick=()=>{if(answered)return;given='не помню';$('#dk3').style.display='none';try{hw.cancelQuiz()}catch(e){}wh.textContent='Смотри, как он пишется 👀';hw.hideCharacter();
    hw.animateCharacter({onComplete:()=>{if(KW!==hw)return;verdict(false);}});};}};
 next();}


route();
