/* ===================== Карточки: наши иероглифы ===================== */
// 2026-11-13. По навыку «Карточки» (контрольные карточки слов), под детскую группу:
// только пройденные иероглифы 你 我 好 叫 妈 爸 (больше ничего!). Задания НУМЕРОВАННЫМ СПИСКОМ, те же номера — в кабинете
// учителя (kartochki/uchitel/). № 1 «Узнай иероглиф» (иероглиф → перевод, карточка переворачивается, апелляция),
// № 2 «Напиши иероглиф» (перевод → пишешь пальцем, подсказки «Не помню»), «Мои итоги» — три зоны и что не доделано.
// Это контроль: каждое задание проходится один раз (учитель — под именем «учитель» — может сбросить).
const TASKS=[null,
 {t:'👀 Узнай иероглиф',d:'Видишь иероглиф — пишешь, что он значит',run:t1},
 {t:'✍️ Напиши иероглиф',d:'Видишь перевод — пишешь иероглиф пальцем',run:t2}];
const NT=TASKS.length-1;
const HW='kart6';
let DONE={};try{DONE=JSON.parse(localStorage.getItem('zh-kc-done')||'{}')}catch(e){}
const keep=()=>{try{localStorage.setItem('zh-kc-done',JSON.stringify(DONE))}catch(e){}};
const API=/workers\.dev$/.test(location.hostname)?'/api/dz/':'https://gruppa-deti.ch-tutor-world.workers.dev/api/dz/';
let S={};try{S=JSON.parse(localStorage.getItem('zh-kc')||'{}')}catch(e){}
const keepS=()=>{try{localStorage.setItem('zh-kc',JSON.stringify(S))}catch(e){}};S.queue=S.queue||[];S.r1=S.r1||{};S.r2=S.r2||{};
const isTest=()=>/^(учитель|учительница|teacher|тест)$/i.test((S.name||'').trim());
const newSid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,8);
function send(part,data){S.queue=S.queue.filter(q=>q.part!==part);S.queue.push({part,data:Object.assign({},data,{ts:Date.now()})});keepS();flush();}
async function flush(){if(isTest()){S.queue=[];keepS();return;}if(!S.sid||!S.queue.length)return;const q=S.queue[0];
 try{const r=await fetch(API+'save',{method:'POST',headers:{'Content-Type':'text/plain'},body:JSON.stringify({hw:HW,sid:S.sid,name:S.name,part:q.part,data:q.data})});
  if(!r.ok)throw 0;S.queue.shift();keepS();if(S.queue.length)flush();}catch(e){clearTimeout(flush._t);flush._t=setTimeout(flush,15000);}}
addEventListener('online',flush);
const TOP='Карточки: наши иероглифы';
const NAMEQ=new URLSearchParams(location.search).get('name');
let TM=[];const later=(f,ms)=>{const t=setTimeout(f,ms);TM.push(t);return t;};
let KW=null;
function stopAll(){TM.forEach(clearTimeout);TM=[];try{curA&&curA.pause()}catch(e){}KW=null;}

/* ---------- данные: только 6 пройденных иероглифов ---------- */
// [иероглиф, пиньинь, перевод, подсказка-перевод для № 2, принимаемые ответы (основы), пример zh, пример pinyin, пример ru, что озвучить, ключ]
const W=[
 {c:'你',py:'nǐ',ru:'ты',q:'«ты»',acc:['ты','теб','тобо','тебе'],ex:'你好！',exPy:'nǐ hǎo!',exRu:'Привет!',exA:'你好',key:'亻 «человек» — слева'},
 {c:'我',py:'wǒ',ru:'я',q:'«я»',acc:['я','мен','мне','мной'],ex:'我妈妈',exPy:'wǒ māma',exRu:'моя мама',exA:'我妈妈',key:''},
 {c:'好',py:'hǎo',ru:'хороший, хорошо',q:'«хороший, хорошо»',acc:['хорош','добр','отличн','прекрасн','good'],ex:'你好！',exPy:'nǐ hǎo!',exRu:'Привет! (дословно «ты хороший»)',exA:'你好',key:'女 «женщина» — слева'},
 {c:'叫',py:'jiào',ru:'звать, зваться',q:'«звать, зваться» (меня зовут…)',acc:['зва','зов','назыв','крич','зовут'],ex:'我叫…',exPy:'wǒ jiào…',exRu:'Меня зовут…',exA:'我叫',key:'口 «рот» — слева'},
 {c:'妈',py:'mā',ru:'мама',q:'«мама»',acc:['мам','мать','матер','мамоч'],ex:'我妈妈叫…',exPy:'wǒ māma jiào…',exRu:'Мою маму зовут…',exA:'我妈妈叫',key:'女 «женщина» — слева'},
 {c:'爸',py:'bà',ru:'папа',q:'«папа»',acc:['пап','отец','отц','отеч'],ex:'我爸爸叫…',exPy:'wǒ bàba jiào…',exRu:'Моего папу зовут…',exA:'我爸爸叫',key:'父 «отец» — сверху'}];
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
const shell=h=>{stopAll();$('#app').innerHTML=`<div class="top n"><span class="zh kc-tlogo">你我</span><div><h1>${TOP}</h1><small>${isTest()?'🧑‍🏫 режим учителя — результаты не сохраняются':'你 我 好 叫 妈 爸 — проверь себя'}</small></div><button class="back n" style="margin:0 0 0 auto;font-size:13px" id="me">${esc(S.name||'')} ✎</button></div>${pbar()}<div class="main n">${h}</div>`;
 $('#me').onclick=()=>login();scrollTo(0,0);};
const backBtn='<button class="back n" onclick="location.hash=\'\'">‹ Все задания</button>';
const tag=n=>`<span class="tag">Задание № ${n}</span>`;
const left=()=>TASKS.map((x,i)=>x&&!DONE[i]?i:0).filter(Boolean);
const leftBox=()=>{const L=left();if(!L.length)return `<div class="allok">🏆 Все задания сделаны! Ты супер!</div>`;
 return `<div class="left"><h3>⏳ Ещё не доделано (${L.length}):</h3>${L.map(i=>`<button data-go="${i}"><span class="no">${i}</span><span>${TASKS[i].t}</span><small>Сделать →</small></button>`).join('')}</div>`;};
const leftOn=()=>document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>{location.hash='#'+b.dataset.go;});
const locked=n=>n===2&&!DONE[1]&&!isTest();

function home(){const nx=TASKS.findIndex((x,i)=>x&&!DONE[i]);
 shell(`<div class="hero"><h2>Привет${S.name?', '+esc(S.name.split(/\s+/)[0]):''}! 👋</h2>
  <p class="lead">Это <b>карточки</b> на все наши иероглифы. Проверь, что ты их помнишь: сначала <b>узнай</b> каждый, потом <b>напиши</b> по памяти.</p>
  <div class="kc-six">${W.map(w=>`<span class="zh">${w.c}</span>`).join('')}</div></div>
  <div class="list">${TASKS.map((x,i)=>{if(!x)return '';const lk=locked(i);return `<button class="ti n${i===nx&&!lk?' hot':''}${DONE[i]?'':' todo'}${lk?' kc-lock':''}" data-n="${i}"><span class="no" style="${DONE[i]?'background:var(--ok)':i===nx?'background:var(--ac)':''}">${i}</span><span><b>${x.t}</b><small>${lk?'🔒 Откроется после задания № 1':x.d}</small></span><span class="sc7">${DONE[i]?'✓ '+DONE[i]:''}</span></button>`;}).join('')}</div>
  <div class="row" style="justify-content:center"><button class="btn" id="it">🏁 Мои итоги</button>${isTest()?'<button class="btn g" id="rs">↺ Сбросить (учитель)</button>':''}</div>`);
 document.querySelectorAll('[data-n]').forEach(b=>b.onclick=()=>{if(locked(+b.dataset.n)){toast('Сначала сделай задание № 1 🙂');return;}location.hash='#'+b.dataset.n;});
 $('#it').onclick=()=>{location.hash='#itogi';};
 const rs=$('#rs');if(rs)rs.onclick=()=>{DONE={};keep();S.r1={};S.r2={};keepS();home();toast('Сброшено');};}
function route(){if(!S.name){if(NAMEQ){S.name=NAMEQ;S.sid=S.sid||newSid();keepS();}else return login();}
 const h=location.hash.slice(1);if(h==='itogi')return itogi();const n=+h;
 if(TASKS[n]){if(locked(n)){location.hash='';return;}TASKS[n].run();}else home();}
addEventListener('hashchange',route);
const nextBtns=n=>{const nx=left().find(i=>i!==n);return `<div class="row">${nx?`<button class="btn" onclick="location.hash='#${nx}'">Задание № ${nx} →</button>`:`<button class="btn" onclick="location.hash='#itogi'">🏁 Мои итоги</button>`}<button class="btn g" onclick="location.hash=''">‹ Все задания</button></div>${nx?'':leftBox()}`;};

/* ===================== № 1 Узнай иероглиф ===================== */
function t1(){const n=1;
 if(DONE[1]&&!isTest())return t1res();
 shell(`${backBtn}${tag(n)}<h2>👀 Узнай иероглиф</h2>
  <div class="rbox" style="--c1:#5B6BD8;--c2:#2DBE8C"><b>Как делать</b><div class="rr2"><span>👀 Смотри на иероглиф, 🔊 можно послушать</span><span>⌨️ Напиши по-русски, что он значит</span><span>🤷 Не помнишь — нажми «Не знаю», ничего страшного</span><span>🃏 Карточка перевернётся — там ответ и пример</span></div></div>
  <div class="row" style="justify-content:center"><button class="btn" id="st" style="width:100%">🃏 Начать: 6 карточек</button></div>`);
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
   send('t1',{score:ok,of:res.length,res,ap:res.filter(r=>r.ap).length});t1res();};
  one();};}
function t1res(){const n=1,R=W.map(w=>S.r1[w.c]).filter(Boolean),ok=R.filter(r=>r.ok).length;
 shell(`${backBtn}${tag(n)}<h2>👀 Узнай иероглиф — готово!</h2><div class="res" style="text-align:center">${ok} / ${R.length}</div>
  <p class="lead" style="text-align:center">${ok===R.length?'Ты узнал(а) все иероглифы! 🏆':'Хорошая работа! Остальные можно повторить для закрепления 🙂'}</p>
  <div class="kc-rl">${R.map(r=>{const w=WC[r.c];return `<div class="${r.ok?'g':r.idk?'m':'b'}"><span class="zh">${r.c}</span><span><b>${w.ru}</b><small>${r.idk?'не знал(а)':'твой ответ: '+esc(r.a)}${r.ap?' · 🙋 засчитано':''}</small></span><i>${r.ok?'✓':'○'}</i></div>`;}).join('')}</div>
  ${nextBtns(n)}`);leftOn();}

/* ===================== № 2 Напиши иероглиф ===================== */
const GRID='<svg class="grid" viewBox="0 0 100 100"><g stroke="#FFB3C8" stroke-width=".6" stroke-dasharray="2 2"><line x1="0" y1="0" x2="100" y2="100"/><line x1="100" y1="0" x2="0" y2="100"/><line x1="50" y1="0" x2="50" y2="100"/><line x1="0" y1="50" x2="100" y2="50"/></g></svg>';
const hwOpts=sz=>({width:sz,height:sz,padding:sz*.08,showOutline:false,showCharacter:false,outlineColor:'#E1E5EE',strokeColor:'#2B3270',radicalColor:'#FF5C8A',drawingColor:'#5B6BD8',drawingWidth:Math.round(sz/16),highlightColor:'#2DBE8C',strokeAnimationSpeed:1.2,delayBetweenStrokes:250,charDataLoader:(ch,ok)=>ok(HZDATA[ch])});
function t2(){const n=2;
 if(DONE[2]&&!isTest())return t2res();
 shell(`${backBtn}${tag(n)}<h2>✍️ Напиши иероглиф</h2>
  <div class="rbox" style="--c1:#FF5C8A;--c2:#8E5BE8"><b>Как делать</b><div class="rr2"><span>📖 Читаешь перевод — пишешь иероглиф пальцем (или мышкой) в клетке</span><span>✏️ Каждую черту по порядку. Две ошибки подряд — покажем следующую черту</span><span>💡 «Не помню» — подсказка (можно 3 раза)</span><span>👀 Совсем забыл(а) — красная кнопка покажет весь знак</span></div></div>
  <div class="row" style="justify-content:center"><button class="btn" id="st" style="width:100%">✍️ Начать: 6 иероглифов</button></div>`);
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
   send('t2',{score:self,of:res.length,res:res.map(r=>[r.c,r.mist,r.hints,r.shown])});t2res();};
  one();};}
function t2res(){const n=2,R=W.map(w=>S.r2[w.c]).filter(Boolean),self=R.filter(r=>!r.shown&&!r.hints).length;
 shell(`${backBtn}${tag(n)}<h2>✍️ Напиши иероглиф — готово!</h2><div class="res" style="text-align:center">${self} / ${R.length}</div>
  <p class="lead" style="text-align:center">${self===R.length?'Все шесть — сам(а), без подсказок! 🏆':'Сам(а), без подсказок: '+self+' из '+R.length+'. Остальные можно повторить для закрепления 🙂'}</p>
  <div class="kc-rl">${R.map(r=>`<div class="${r.shown?'b':r.hints||r.mist?'m':'g'}"><span class="zh">${r.c}</span><span><b>${WC[r.c].ru}</b><small>${r.shown?'смотрел(а) весь знак':r.hints?'подсказок: '+r.hints:'сам(а)'}${r.mist?' · ошибок в чертах: '+r.mist:''}</small></span><i>${r.shown?'👀':r.hints?'💡':'✓'}</i></div>`).join('')}</div>
  ${nextBtns(n)}`);leftOn();}

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
   :'<p class="lead">Сделай оба задания — и здесь появятся твои иероглифы по зонам: 🟢 знаешь, 🟡 стоит повторить, 🔴 особое внимание.</p>'}
  ${leftBox()}
  ${L.length?'':'<p class="lead" style="text-align:center">Учитель видит твои результаты. До встречи на уроке! Zàijiàn!</p>'}`);
 document.querySelectorAll('.kc-chip').forEach(b=>b.onclick=()=>playW(b.dataset.w,b));leftOn();}

route();
