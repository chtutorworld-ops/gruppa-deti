/* ===================== tasks · урок 7 ===================== */
const TASKS=[null,
 {t:'🃏 Карточки: пиньинь',d:'Найди пары: пиньинь и перевод',run:()=>memGame(1)},
 {t:'🀄 Карточки: иероглиф',d:'Уровень 2: иероглиф и перевод, без пиньиня',run:()=>memGame(2)},
 {t:'⚡ Блиц: правила иероглифов',d:'11 быстрых вопросов на время',run:blitz},
 {t:'✍️ Пропись 你 我 好 叫 妈 爸',d:'Обведи, а потом напиши по памяти',run:propis},
 {t:'👋 Мои имена-подсказки',d:'Как по-китайски звучат твоё имя и имена мамы и папы',run:names},
 {t:'📝 Контрольная',d:'你好！我叫… 我妈妈叫… 我爸爸叫… по памяти',run:test},
 {t:'🔨 Бей крота',d:'Игра на слух: обе строчки инициалей',run:krot}];
let DONE={};try{DONE=JSON.parse(localStorage.getItem('zh-u7-done')||'{}')}catch(e){}
const keep=()=>{try{localStorage.setItem('zh-u7-done',JSON.stringify(DONE))}catch(e){}};
const HW='u7';
const API=/workers\.dev$/.test(location.hostname)?'/api/dz/':'https://gruppa-deti.ch-tutor-world.workers.dev/api/dz/';
let S={};try{S=JSON.parse(localStorage.getItem('zh-u7')||'{}')}catch(e){}
const keepS=()=>{try{localStorage.setItem('zh-u7',JSON.stringify(S))}catch(e){}};S.queue=S.queue||[];
// names typed earlier in lesson 6 / homework 6 on this device: reuse them as a starting point
if(!S.par){for(const k of ['zh-u6','zh-dz6']){try{const o=JSON.parse(localStorage.getItem(k)||'{}');if(o.par&&o.par.mom&&o.par.dad){S.par={mom:o.par.mom,dad:o.par.dad};break;}}catch(e){}}}
const isTest=()=>/^(учитель|учительница|teacher|тест)$/i.test((S.name||'').trim());
function send(part,data){S.queue=S.queue.filter(q=>q.part!==part);S.queue.push({part,data:Object.assign({},data,{ts:Date.now()})});keepS();flush();}
async function flush(){if(isTest()){S.queue=[];keepS();return;}if(!S.sid||!S.queue.length)return;const q=S.queue[0];
 try{const r=await fetch(API+'save',{method:'POST',headers:{'Content-Type':'text/plain'},body:JSON.stringify({hw:HW,sid:S.sid,name:S.name,part:q.part,data:q.data})});
  if(!r.ok)throw 0;S.queue.shift();keepS();if(S.queue.length)flush();}catch(e){clearTimeout(flush._t);flush._t=setTimeout(flush,15000);}}
addEventListener('online',flush);
function finish(n,ok,of,extra){DONE[n]=ok+'/'+of;keep();send('t'+n,Object.assign({score:ok,of},extra||{}));}
const TOP='Задания урока 7';
const NAMEQ=new URLSearchParams(location.search).get('name');
function login(){$('#app').innerHTML=`<div class="top n"><span class="zh">课堂任务</span><div><h1>${TOP}</h1><small>Сначала напиши своё имя</small></div></div>
 <div class="main n" style="text-align:center"><h2>Как тебя зовут?</h2><p class="lead">Имя и первая буква фамилии, например <b>Маша П.</b> — как в домашке. Так учитель увидит твои результаты.</p>
 <input id="nm" class="in" style="width:100%;font:inherit;font-size:20px;padding:14px 18px;border:0;outline:none;margin-top:16px;color:var(--ink)" placeholder="Имя и буква фамилии" maxlength="40" value="${esc(NAMEQ||'')}">
 <div class="row" style="justify-content:center"><button class="btn" id="go">Начать →</button></div></div>`;
 const go=()=>{const v=$('#nm').value.trim();if(v.length<2){toast('Напиши имя');return;}S.name=v;S.sid=S.sid||(Date.now().toString(36)+Math.random().toString(36).slice(2,8));keepS();flush();route();};
 $('#go').onclick=go;$('#nm').onkeydown=e=>{if(e.key==='Enter')go();};}
const shell=(h)=>{stopAll();$('#app').innerHTML=`<div class="top n"><span class="zh">课堂任务</span><div><h1>${TOP}</h1><small>${isTest()?'🧑‍🏫 режим учителя — результаты не сохраняются':'Учитель скажет, какое задание делать'}</small></div><button class="back n" style="margin:0 0 0 auto;font-size:13px" id="me">${esc(S.name||'')} ✎</button></div><div class="main n">${h}</div>`;
 $('#me').onclick=()=>login();scrollTo(0,0);};
const backBtn='<button class="back n" onclick="location.hash=\'\'">‹ Все задания</button>';
const tag=n=>`<span class="tag">Задание № ${n}</span>`;
let TM=[];const later=(f,ms)=>{const t=setTimeout(f,ms);TM.push(t);return t;};
let KCUR=null,RAF=0;
function stopAll(){if(KCUR){try{KCUR.destroy()}catch(e){}KCUR=null;}TM.forEach(clearTimeout);TM=[];cancelAnimationFrame(RAF);try{curA&&curA.pause()}catch(e){}}
const LOCKED=false;let TKEY=new URLSearchParams(location.search).has('uchitel');
try{if(TKEY)localStorage.setItem('zh-u7-t','1');else if(localStorage.getItem('zh-u7-t')==='1')TKEY=true;}catch(e){}
function home(){const nx=TASKS.findIndex((x,i)=>x&&!DONE[i]);
 shell(`<h2>Задания урока</h2><p class="lead">Учитель скажет, какое задание делать сейчас. Сделанные отмечаются ✓.</p>
 <div class="list">${TASKS.map((x,i)=>{if(!x)return '';return `<button class="ti n${i===nx?' hot':''}" data-n="${i}"><span class="no" style="background:${DONE[i]?'var(--ok)':i===6?'#FF5C8A':'var(--ac)'}">${i}</span><span><b>${x.t}</b><small>${x.d}</small></span><span class="st">${DONE[i]?'✓':''}</span></button>`;}).join('')}</div>`);
 document.querySelectorAll('[data-n]').forEach(b=>b.onclick=()=>{location.hash='#'+b.dataset.n;});}
function route(){if(LOCKED&&!TKEY){$('#app').innerHTML=`<div class="top n"><span class="zh">课堂任务</span><div><h1>${TOP}</h1></div></div><div class="main n" style="text-align:center"><div style="font-size:64px">🔒</div><h2>Задания пока закрыты</h2><p class="lead">Учитель откроет их на уроке.</p></div>`;return;}
 if(!S.name){if(NAMEQ){S.name=NAMEQ;S.sid=S.sid||(Date.now().toString(36)+Math.random().toString(36).slice(2,8));keepS();}else return login();}
 const n=+location.hash.slice(1);if(TASKS[n])TASKS[n].run();else home();}
addEventListener('hashchange',route);
const doneBox=(n,inner,again)=>`${backBtn}${tag(n)}<h2>${TASKS[n].t} — готово!</h2>${inner}<div class="row">${n<7?`<button class="btn" onclick="location.hash='#${n+1}'">Задание № ${n+1} →</button>`:''}<button class="btn g" onclick="location.hash=''">‹ Все задания</button>${again!==false?`<button class="btn g" id="again">↺ Ещё раз</button>`:''}</div>`;
const againOn=f=>{const a=$('#again');if(a)a.onclick=f;};

/* ---- 1, 2: memory cards ---- */
const MEM={1:[['nǐ hǎo','привет','你好'],['wǒ','я','我'],['nǐ','ты','你'],['jiào','зваться','叫'],['māma','мама','妈妈'],['bàba','папа','爸爸'],['nǐ ne?','а ты?','你呢'],['zàijiàn','до свидания','再见']],
 2:[['你','ты','你'],['我','я','我'],['好','хорошо','好'],['叫','зваться','叫'],['妈妈','мама','妈妈'],['爸爸','папа','爸爸'],['你好','привет','你好'],['我叫','меня зовут','我叫']]};
function memGame(n){const L=MEM[n];
 shell(`${backBtn}${tag(n)}<h2>${n===1?'🃏 Карточки: пиньинь и перевод':'🀄 Карточки: иероглиф и перевод'}</h2>
  <div class="rbox" style="--c1:${n===1?'#5B6BD8':'#FF5C8A'};--c2:${n===1?'#8E5BE8':'#FF8A3D'}"><b>Как играть</b>Открывай по <b>две</b> карточки. ${n===1?'Найди к пиньиню его перевод':'Найди к иероглифу его перевод — пиньиня нет!'}. Пара совпала — карточки остаются открытыми и звучит слово.</div>
  <div class="mhud"><span>⏱ <b id="mt">0:00</b></span><span>🔄 ходов: <b id="mm">0</b></span><span>✓ пар: <b id="mp">0</b>/8</span></div>
  <div class="mem" id="mg"></div>`);
 const cards=shuffle(L.flatMap(([a,ru,hz],i)=>[{i,k:'a',t:a,hz},{i,k:'b',t:ru,hz}]));
 $('#mg').innerHTML=cards.map((c,j)=>`<button class="mc" data-j="${j}" aria-label="Карточка ${j+1}"><span class="mcb"><i>汉</i></span><span class="mcf ${c.k==='a'?(n===1?'py':'zh'):'ru'}${c.t.length>8?' long':''}">${esc(c.t)}</span></button>`).join('');
 let open=[],moves=0,pairs=0,errs=0,lock=false;const t0=Date.now(),conf=[];
 const tick=()=>{const s=Math.floor((Date.now()-t0)/1000);const el=$('#mt');if(!el)return;el.textContent=Math.floor(s/60)+':'+String(s%60).padStart(2,'0');later(tick,1000);};tick();
 document.querySelectorAll('.mc').forEach(b=>b.onclick=()=>{if(lock)return;const j=+b.dataset.j,c=cards[j];if(b.classList.contains('up'))return;
  b.classList.add('up');open.push([b,c]);if(open.length<2)return;moves++;$('#mm').textContent=moves;const [[b1,c1],[b2,c2]]=open;open=[];
  if(c1.i===c2.i){pairs++;$('#mp').textContent=pairs;later(()=>{b1.classList.add('ok');b2.classList.add('ok');},250);playW(c1.hz);
   if(pairs===8)later(end,1500);}
  else{errs++;lock=true;conf.push([c1.t,c2.t]);b1.classList.add('no');b2.classList.add('no');later(()=>{b1.classList.remove('up','no');b2.classList.remove('up','no');lock=false;},950);}});
 function end(){const sec=Math.round((Date.now()-t0)/1000);finish(n,8,8,{moves,errs,sec,conf:conf.slice(0,20)});
  const stars=errs<=3?'⭐⭐⭐':errs<=8?'⭐⭐':'⭐';
  shell(doneBox(n,`<div class="res" style="text-align:center">${stars}</div><p class="lead" style="text-align:center">Все 8 пар найдены за <b>${moves}</b> ${moves%10===1&&moves%100!==11?'ход':moves%10>=2&&moves%10<=4&&(moves%100<12||moves%100>14)?'хода':'ходов'} · ${Math.floor(sec/60)}:${String(sec%60).padStart(2,'0')}</p>
   <div class="mlist">${L.map(([a,ru,hz])=>`<button class="n" data-say="${hz}"><span class="${n===1?'py':'zh'}">${esc(a)}</span><small>${esc(ru)}</small>🔊</button>`).join('')}</div>`));
  document.querySelectorAll('[data-say]').forEach(b=>b.onclick=()=>playW(b.dataset.say,b));againOn(()=>memGame(n));}}

/* ---- 3: blitz on hanzi rules ---- */
const BQ=[['<span class="zh bq">妈</span>Какая часть подсказывает <b>значение</b>?',['女','马'],'女 «женщина» — ключ, он подсказывает смысл: мама — женщина.','zh'],
 ['<span class="zh bq">妈</span>Какая часть подсказывает <b>чтение</b>?',['马','女'],'马 звучит mǎ — поэтому 妈 читается mā.','zh'],
 ['<span class="zh bq">爸</span>Где здесь <b>чтение</b>?',['巴','父'],'巴 звучит bā — подсказывает чтение 爸 bà. 父 «отец» — значение.','zh'],
 ['<span class="zh bq">吗</span>Какая часть — <b>ключ</b>?',['口','马'],'口 «рот» — ключ. 马 подсказывает чтение ma.','zh'],
 ['Ключ <span class="zh bk">亻</span> значит…',['человек','рот','женщина'],'亻 — «человек», как в 你 «ты».'],
 ['Ключ <span class="zh bk">口</span> значит…',['рот','отец','человек'],'口 — «рот»: звать 叫 — это делает рот.'],
 ['Ключ <span class="zh bk">女</span> значит…',['женщина','человек','рот'],'女 — «женщина», как в 妈 и 好.'],
 ['<span class="zh bq">好</span> = 女 + 子. Как он устроен?',['обе части — значение','одна часть — чтение'],'Женщина + ребёнок = «хорошо». Здесь нет части-чтения.'],
 ['Где чаще всего стоит <b>ключ</b>?',['слева или сверху','справа или снизу'],'Ключ чаще слева (妈, 你) или сверху (爸).'],
 ['<span class="zh bq">十</span>Какую черту пишем первой?',['горизонтальную —','вертикальную |'],'Правило: сначала горизонталь, потом вертикаль.'],
 ['<span class="zh bq">口</span>Когда пишем «дно» коробки?',['в конце','в начале'],'Сначала рамка, «дверь» закрываем в конце.']];
const BT=12;
function blitz(){const n=3;
 shell(`${backBtn}${tag(n)}<h2>⚡ Блиц: правила иероглифов</h2>
  <div class="rbox" style="--c1:#F5A524;--c2:#FF5C8A"><b>Правило блица</b>${BQ.length} вопросов, на каждый — <b>${BT} секунд</b>. Отвечай быстро, но думай! Вспомни: 🔑 <b>ключ</b> — значение, другая часть — 🔊 <b>чтение</b>.</div>
  <div class="row" style="justify-content:center"><button class="btn" id="st">⚡ Поехали!</button></div>`);
 $('#st').onclick=run;
 function run(){const Q=shuffle(BQ);let i=0,ok=0;const res=[],h=[];
  const ask=()=>{if(i>=Q.length)return end();const [q,o,why,cls]=Q[i];const [opts,ix]=arrange(o,o[0],h);h.push(ix);let left=BT,done=false;
   shell(`${backBtn}${tag(n)}<div class="qcard n"><div class="qhead"><span>Вопрос ${i+1} из ${Q.length}</span><span>⚡ ${ok}</span></div><div class="tbar"><i id="tb"></i></div>
    <div class="bqq">${q}</div><div class="opts${opts.length===3?' o3':''}">${opts.map(x=>`<button class="opt ${cls==='zh'?'zh':'tx'}" data-v="${esc(x)}">${esc(x)}</button>`).join('')}</div><div class="fb" id="fb"></div></div>`);
   const t0=Date.now();const bar=$('#tb');
   const step=()=>{if(done)return;const k=Math.max(0,1-(Date.now()-t0)/(BT*1000));bar.style.width=(k*100)+'%';if(k<=0)return pick(null);RAF=requestAnimationFrame(step);};RAF=requestAnimationFrame(step);
   const pick=v=>{if(done)return;done=true;cancelAnimationFrame(RAF);const right=v===o[0];if(right)ok++;res.push({q:q.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim(),a:v,r:o[0],ok:right,s:Math.round((Date.now()-t0)/100)/10});
    document.querySelectorAll('.opt').forEach(b=>{if(b.dataset.v===o[0])b.classList.add('ok');else if(b.dataset.v===v)b.classList.add('no');b.disabled=true;});
    const fb=$('#fb');fb.className='fb '+(right?'ok':'no');fb.innerHTML=(right?'✓ Верно! ':v===null?'⏰ Время вышло. ':'✗ ')+why;i++;later(ask,right?1400:2600);};
   document.querySelectorAll('.opt').forEach(b=>b.onclick=()=>pick(b.dataset.v));};
  const end=()=>{finish(n,ok,Q.length,{res,miss:res.filter(r=>!r.ok).map(r=>r.r)});
   shell(doneBox(n,`<div class="res" style="text-align:center">⚡ ${ok} / ${Q.length}</div><p class="lead" style="text-align:center">${ok===Q.length?'Все правила помнишь! 🏆':ok>=Q.length*.7?'Отлично! Почти всё помнишь 💪':'Правила можно повторить для закрепления 🙂'}</p>
    <div class="why">${res.map(r=>`<div class="${r.ok?'ok':''}">${r.ok?'✓':'✗'} ${esc(r.q)} — <b>${esc(r.r)}</b></div>`).join('')}</div>`));againOn(blitz);};
  ask();}}

/* ---- 4: writing 你 我 好 叫 妈 爸 ---- */
const GRID='<svg class="grid" viewBox="0 0 100 100"><g stroke="#FFB3C8" stroke-width=".6" stroke-dasharray="2 2"><line x1="0" y1="0" x2="100" y2="100"/><line x1="100" y1="0" x2="0" y2="100"/><line x1="50" y1="0" x2="50" y2="100"/><line x1="0" y1="50" x2="100" y2="50"/></g></svg>';
const HZI={'你':['nǐ','ты'],'我':['wǒ','я'],'好':['hǎo','хорошо'],'叫':['jiào','зваться'],'妈':['mā','мама'],'爸':['bà','папа']};
const hwOpts=(sz,extra)=>Object.assign({width:sz,height:sz,padding:sz*.08,showOutline:true,showCharacter:false,outlineColor:'#E1E5EE',strokeColor:'#2B3270',radicalColor:'#FF5C8A',drawingColor:'#5B6BD8',drawingWidth:Math.round(sz/16),highlightColor:'#2DBE8C',strokeAnimationSpeed:1.2,delayBetweenStrokes:250,charDataLoader:(ch,ok)=>ok(HZDATA[ch])},extra||{});
function tracer(box,chars,cb){let k=0,mist=0,w=null;
 box.innerHTML=`<div class="wch">${[...chars].map((c,j)=>`<span class="n" data-j="${j}">${c}</span>`).join('')}</div><div class="wbox">${GRID}<div class="hw" id="hw"></div></div>
  <p class="hint2" id="wh" style="text-align:center;margin-top:8px"></p><div class="row" style="justify-content:center"><button class="btn g" id="wa">▶ Покажи порядок черт</button><button class="btn g" id="wr">↺ Заново</button></div>`;
 const one=()=>{const c=chars[k];box.querySelectorAll('[data-j]').forEach(s=>{s.classList.toggle('cur',+s.dataset.j===k);s.classList.toggle('ok',+s.dataset.j<k);});
  const el=box.querySelector('#hw');el.innerHTML='';const sz=el.clientWidth||280;
  if(!window.HanziWriter||!HZDATA[c]){$('#wh').textContent='Пропиши '+c+' пальцем в воздухе 🙂';later(()=>{k++;k<chars.length?one():cb(mist);},1500);return;}
  w=HanziWriter.create(el,c,hwOpts(sz));
  const quiz=()=>{$('#wh').innerHTML=`Обведи <span class="zh" style="font-size:20px">${c}</span> по порядку черт`;w.quiz({showHintAfterMisses:2,highlightOnComplete:true,onMistake:()=>{mist++;},onComplete:()=>{if(!document.body.contains(el))return;$('#wh').textContent='✓ Отлично!';later(()=>{k++;if(k<chars.length)one();else cb(mist);},1000);}});};
  $('#wa').onclick=()=>{w.cancelQuiz();$('#wh').textContent='Смотри порядок черт…';w.showCharacter();w.hideCharacter({duration:0});w.animateCharacter({onComplete:()=>later(()=>{w.hideCharacter();quiz();},600)});};
  $('#wr').onclick=()=>{w.cancelQuiz();quiz();};
  w.animateCharacter({onComplete:()=>{if(document.body.contains(el))later(()=>{w.hideCharacter();quiz();},500);}});$('#wh').textContent='Смотри порядок черт…';};
 one();}
// one character from memory; hints=false → no hint buttons (test), only «Не помню»
function memoOne(el,c,wh,ctl,done,hintsOn){const sz=el.clientWidth||280;let hints=0,show=0,mist=0,cur=0,fin=false;el.innerHTML='';
 const out=r=>{if(fin)return;fin=true;done(r);};
 if(!window.HanziWriter||!HZDATA[c]){wh.textContent='Напиши '+c+' пальцем в воздухе 🙂';later(()=>out({c,hints,show,mist,skip:0}),1500);return;}
 const w=HanziWriter.create(el,c,hwOpts(sz,{showOutline:false}));
 const q=()=>w.quiz({showHintAfterMisses:hintsOn?3:false,highlightOnComplete:true,onMistake:()=>{mist++;if(hintsOn&&mist===3)wh.textContent='Ничего страшного! Нужная черта мигнёт зелёным 🙂';else if(!hintsOn&&mist===4)wh.textContent='Не получается? Нажми «Не помню» — ничего страшного 🙂';},
  onCorrectStroke:d=>{cur=d.strokeNum+1;wh.textContent='Так держать! ✓';},
  onComplete:()=>{if(!document.body.contains(el))return;wh.textContent=hints+show===0?'🏆 Сам(а) — супер!':'✓ Написано!';later(()=>out({c,hints,show,mist,skip:0}),900);}});
 if(ctl.h1)ctl.h1.onclick=()=>{hints++;ctl.cnt(hints+show);try{w.highlightStroke(cur);}catch(e){}};
 if(ctl.h2)ctl.h2.onclick=()=>{hints++;ctl.cnt(hints+show);w.showOutline();later(()=>w.hideOutline(),2500);};
 if(ctl.h3)ctl.h3.onclick=()=>{show++;ctl.cnt(hints+show);w.cancelQuiz();cur=0;wh.textContent='Смотри внимательно…';w.showCharacter();w.hideCharacter({duration:0});w.animateCharacter({onComplete:()=>later(()=>{w.hideCharacter();wh.textContent='А теперь ты — по памяти!';q();},700)});};
 if(ctl.sk)ctl.sk.onclick=()=>{w.cancelQuiz();ctl.sk.disabled=true;wh.textContent='Вот так он пишется — запомни 👀';w.showCharacter();later(()=>out({c,hints,show,mist,skip:1}),1800);};
 q();}
const HINTS=`<div class="row" style="justify-content:center;gap:8px"><button class="btn g" id="h1">👉 Следующая черта</button><button class="btn g" id="h2">💡 Контур</button><button class="btn g" id="h3">👀 Покажи весь</button></div>`;
function propis(){const n=4;
 shell(`${backBtn}${tag(n)}<h2>✍️ Пропись 你 我 好 叫 妈 爸</h2><div class="rbox" style="--c1:#2DBE8C;--c2:#1E8F69"><b>Сначала обводим</b>Смотри порядок черт и <b>обведи</b> каждый иероглиф. Ключ светится розовым. Потом напишешь их <b>по памяти</b> — подсказки можно брать.</div><div id="tr"></div>`);
 tracer($('#tr'),'你我好叫妈爸',m=>{
  const order=shuffle([...'你我好叫妈爸']),res=[];let k=0;
  const one=()=>{if(k>=order.length)return end();const c=order[k],[py,ru]=HZI[c];
   shell(`${backBtn}${tag(n)}<h2>✍️ По памяти</h2><div class="qcard in" style="padding:12px"><div class="qhead"><span>Иероглиф ${k+1} из ${order.length}</span><span>💡 <b id="hc">0</b></span></div><div style="display:flex;align-items:center;justify-content:center;gap:14px;margin-top:6px"><button class="play n" id="pl" style="width:58px;height:58px;font-size:22px;margin:0">🔊</button><div style="text-align:left"><div class="py" style="font-size:26px;color:${TCOL[toneOf(py)]}">${py}</div><div style="font-weight:800;font-size:18px;color:var(--ink)">«${ru}»</div></div></div></div>
    <div class="wbox">${GRID}<div class="hw" id="hw"></div></div><p class="hint2" id="wh" style="text-align:center;margin-top:8px">Напиши по памяти. Не помнишь — бери подсказку 👇</p>${HINTS}`);
   $('#pl').onclick=()=>playW(c,$('#pl'));
   memoOne($('#hw'),c,$('#wh'),{h1:$('#h1'),h2:$('#h2'),h3:$('#h3'),cnt:x=>$('#hc').textContent=x},r=>{res.push(r);k++;one();},true);};
  const end=()=>{const self=res.filter(r=>!r.show).length,clean=res.filter(r=>!r.show&&!r.hints).length;
   finish(n,self,res.length,{trace:m,clean,res:res.map(r=>[r.c,r.hints,r.show,r.mist])});
   shell(doneBox(n,`<div class="res" style="text-align:center;font-family:var(--han);font-weight:400">你 我 好 叫 妈 爸</div><p class="lead" style="text-align:center">${clean===6?'Все шесть — по памяти и без подсказок! 🏆':'Написано! Без подсказок: '+clean+' из 6. Остальные можно повторить для закрепления 🙂'}</p>
    <div class="ans" style="grid-template-columns:repeat(6,1fr)">${res.map(r=>`<span class="${r.show?'no':'ok'}" style="font-family:var(--han);font-size:24px;font-weight:400">${r.c}<small style="display:block;font:800 11px Manrope">${r.hints+r.show?'💡 '+(r.hints+r.show):'сам(а)'}</small></span>`).join('')}</div>`));againOn(propis);};
  shell(`${backBtn}${tag(n)}<h2>✍️ Обвели — молодец!</h2><p class="lead">А теперь <b>по памяти</b>: 6 иероглифов вперемешку. Подсказки можно брать — учитель увидит, сколько.</p><div class="row" style="justify-content:center"><button class="btn" id="go">✍️ Пишу по памяти</button></div>`);
  $('#go').onclick=one;});}

/* ---- 5: my names as hints ---- */
const KIDS=[{ru:'Радмир',hz:'拉德米尔',py:['lā','dé','mǐ','ěr']},{ru:'Султан',hz:'苏尔坦',py:['sū','ěr','tǎn']},{ru:'Вова',al:['владимир','вова','володя'],hz:'弗拉基米尔',py:['fú','lā','jī','mǐ','ěr']},{ru:'Афина',hz:'阿菲娜',py:['ā','fēi','nà']},{ru:'Семён',al:['семен','семён','сёма','сема'],hz:'谢苗',py:['xiè','miáo']}];
function meName(){const v=(S.name||'').toLowerCase().replace(/ё/g,'е');const k=KIDS.find(x=>v.startsWith(x.ru.toLowerCase().replace(/ё/g,'е').slice(0,3))||(x.al||[]).some(a=>v.startsWith(a.replace(/ё/g,'е'))));
 if(k)return {ru:k.ru,hz:k.hz,py:k.py,dict:true};const first=(S.name||'').trim().split(/\s+/)[0]||'';const fem=/[ая]$/i.test(first);return nmName(first,fem);}
const pyJ=a=>(a||[]).join('');
const fz=x=>x.hz.length>4?'min(30px,7vw)':x.hz.length>3?'min(36px,8vw)':'44px';
function nameForm(box,cb){const P=S.par||{};
 box.innerHTML=`<h3>👩 Как зовут маму?</h3><input id="mom" class="in nmi" placeholder="Например, Елена" maxlength="20" value="${esc(P.mom?P.mom.ru:'')}">
  <h3>👨 Как зовут папу?</h3><input id="dad" class="in nmi" placeholder="Например, Сергей" maxlength="20" value="${esc(P.dad?P.dad.ru:'')}">
  <div class="row" style="justify-content:center"><button class="btn" id="nmgo">✨ Показать по-китайски</button></div>`;
 const go=()=>{const m=$('#mom').value.trim(),d=$('#dad').value.trim();if(!/[а-яё]{2}/i.test(m)||!/[а-яё]{2}/i.test(d)){toast('Напиши оба имени русскими буквами');return;}
  const mom=nmName(m,true),dad=nmName(d,false),me=meName();S.par={mom,dad,me};keepS();send('names',{me,mom,dad});cb();};
 $('#nmgo').onclick=go;}
function bigCard(P){const L=[['你好！','nǐ hǎo!','Привет!',null],['我叫','wǒ jiào','Меня зовут',P.me],['我妈妈叫','wǒ māma jiào','Мою маму зовут',P.mom],['我爸爸叫','wǒ bàba jiào','Моего папу зовут',P.dad]];
 return `<div class="ab">${L.map(([z,p,r,x])=>`<div class="abr n"><div class="abz"><span class="zh">${z}</span>${x?`<span class="zh abn" style="font-size:${fz(x)}">${esc(x.hz)}</span><span class="zh">。</span>`:''}</div>
  <div class="abp"><span class="py">${tpy2(p)}</span>${x?` <span class="py abnp">${pyCol(x.py)}</span>`:''}</div><small>${r}${x?' '+esc(x.ru):''}</small>
  <button class="btn g abs" data-free="${z}${x?esc(x.hz)+'。':''}">🔊</button></div>`).join('')}</div>
  <button class="btn" id="all" style="width:100%;margin-top:12px">🔊 Послушать весь рассказ</button>`;}
const tpy2=p=>p.split(' ').map(w=>`<span style="color:${TCOL[toneOf(w)]}">${esc(w)}</span>`).join(' ');
function names(){const n=5;
 const show=()=>{const P=S.par;P.me=meName();
  shell(`${backBtn}${tag(n)}<h2>👋 Мои имена-подсказки</h2><p class="lead">Вот твой рассказ. Имена подсвечены — так они <b>читаются</b> по-китайски. Нажми 🔊 и повтори вслух 2–3 раза — сейчас ты будешь рассказывать о себе всему классу!</p>
   ${bigCard(P)}<div class="row" style="justify-content:center"><button class="btn" id="ok">✓ Готово — я готов(а) рассказать</button><button class="btn g" id="ch">✎ Поменять имена</button></div>`);
  document.querySelectorAll('[data-free]').forEach(b=>b.onclick=()=>playFree(b.dataset.free,b));
  $('#all').onclick=()=>playFree(`你好！我叫${P.me.hz}。我妈妈叫${P.mom.hz}。我爸爸叫${P.dad.hz}。`,$('#all'));
  $('#ch').onclick=ask;$('#ok').onclick=()=>{finish(n,1,1,{me:P.me.hz,mom:P.mom.hz,dad:P.dad.hz});send('names',{me:P.me,mom:P.mom,dad:P.dad});
   shell(doneBox(n,`${bigCard(P)}<p class="lead">Держи эту страницу открытой, пока рассказываешь 😉</p>`,false));
   document.querySelectorAll('[data-free]').forEach(b=>b.onclick=()=>playFree(b.dataset.free,b));$('#all').onclick=()=>playFree(`你好！我叫${P.me.hz}。我妈妈叫${P.mom.hz}。我爸爸叫${P.dad.hz}。`,$('#all'));};};
 const ask=()=>{shell(`${backBtn}${tag(n)}<h2>👋 Мои имена-подсказки</h2><p class="lead">Напиши, как зовут маму и папу (только имя). Мы запишем твоё имя и их имена по-китайски — получится подсказка для рассказа.</p><div id="nf"></div>`);nameForm($('#nf'),show);};
 if(S.par&&S.par.mom&&S.par.dad){show();}else ask();}

/* ---- 6: test — 你好！我叫… 我妈妈叫… 我爸爸叫… from memory; hints only for 妈 and 爸 ---- */
function test(){const n=6;
 if(!(S.par&&S.par.mom&&S.par.dad)){shell(`${backBtn}${tag(n)}<h2>📝 Контрольная</h2><p class="lead">Сначала напиши, как зовут маму и папу — программа сама допишет имена в рассказ.</p><div id="nf"></div>`);nameForm($('#nf'),test);return;}
 const P=S.par,me=meName();P.me=me;
 const LINES=[{w:'你好',n:'',p:'！'},{w:'我叫',n:me.hz,p:'。'},{w:'我妈妈叫',n:P.mom.hz,p:'。'},{w:'我爸爸叫',n:P.dad.hz,p:'。'}];
 const Q=[];LINES.forEach((l,li)=>[...l.w].forEach((c,ci)=>Q.push({c,li,ci})));
 const HOK=c=>c==='妈'||c==='爸';
 shell(`${backBtn}${tag(n)}<h2>📝 Контрольная</h2>
  <div class="rbox" style="--c1:#FF5C8A;--c2:#FF8A3D"><b>⚠️ Правила контрольной</b>Пиши рассказ о себе <b>по памяти</b>, каждый иероглиф в своей клетке. Имена серые — их программа допишет сама.
   <div class="rr2"><span>💡 Подсказку можно включить <b>только для</b> <span class="zh" style="font-size:30px">妈</span> и <span class="zh" style="font-size:30px">爸</span></span><span>🚫 Остальные иероглифы — <b>без подсказок</b>. Не помнишь — нажми «Не помню»</span></div></div>
  <div class="sc n" style="margin-top:12px;text-align:left"><small>Что пишем:</small><div class="py" style="font-size:17px;line-height:1.6">${tpy2('nǐ hǎo!')} ${tpy2('wǒ jiào')} ${pyCol(me.py)}. ${tpy2('wǒ māma jiào')} ${pyCol(P.mom.py)}. ${tpy2('wǒ bàba jiào')} ${pyCol(P.dad.py)}.</div><small>Привет! Меня зовут ${esc(me.ru)}. Мою маму зовут ${esc(P.mom.ru)}. Моего папу зовут ${esc(P.dad.ru)}.</small></div>
  <div class="row" style="justify-content:center"><button class="btn" id="st">📝 Начать контрольную</button><button class="btn g" id="ch">✎ Другие имена</button></div>`);
 $('#ch').onclick=()=>{shell(`${backBtn}${tag(n)}<h2>📝 Контрольная</h2><div id="nf"></div>`);nameForm($('#nf'),test);};
 $('#st').onclick=()=>{let k=0;const res=[];const t0=Date.now();
  const strip=()=>`<div class="cells">${LINES.map((l,li)=>[...l.w].map((c,ci)=>{const j=Q.findIndex(q=>q.li===li&&q.ci===ci);const r=res[j];return `<span class="${j<k?(r.skip?'sk':r.hints+r.show?'hn':'ok'):j===k?'cur':''}">${j<k?c:''}</span>`;}).join('')+[...l.n].map(c=>`<span class="nm">${c}</span>`).join('')+`<span class="pn">${l.p}</span>`+(li<LINES.length-1?'<i class="br"></i>':'')).join('')}</div>`;
  const one=()=>{if(k>=Q.length)return end();const q=Q[k];const [cpy,cru]=HZI[q.c];const h=HOK(q.c);
   shell(`${tag(n)}${strip()}<div class="qcard in" style="padding:12px;margin-top:12px"><div class="qhead"><span>Клетка ${k+1} из ${Q.length}</span><span>${h?'💡 <b id="hc">0</b>':'🚫 без подсказок'}</span></div>
    <div style="display:flex;align-items:center;justify-content:center;gap:12px;margin-top:6px"><div style="text-align:center"><div class="py" style="font-size:28px;color:${TCOL[toneOf(cpy)]}">${cpy}</div><div style="font-weight:800;color:var(--ink)">«${cru}»</div></div></div></div>
    <div class="wbox">${GRID}<div class="hw" id="hw"></div></div><p class="hint2" id="wh" style="text-align:center;margin-top:8px">Пиши по памяти 👇</p>
    ${h?`${HINTS}<div class="row" style="justify-content:center;margin-top:8px"><button class="btn g" id="sk">🤷 Не помню</button></div>`:`<div class="row" style="justify-content:center"><button class="btn g" id="sk">🤷 Не помню</button></div>`}`);
   if(k>0)$('.wbox').scrollIntoView({block:'center'});
   memoOne($('#hw'),q.c,$('#wh'),h?{h1:$('#h1'),h2:$('#h2'),h3:$('#h3'),sk:$('#sk'),cnt:x=>$('#hc').textContent=x}:{sk:$('#sk'),cnt:()=>{}},r=>{res.push(r);k++;one();},h);};
  const end=()=>{const self=res.filter(r=>!r.skip&&!r.show).length,clean=res.filter(r=>!r.skip&&!r.show&&!r.hints).length;
   const text=`你好！我叫${me.hz}。我妈妈叫${P.mom.hz}。我爸爸叫${P.dad.hz}。`;
   finish(n,self,res.length,{clean,sec:Math.round((Date.now()-t0)/1000),text,names:{me:me.ru,mom:P.mom.ru,dad:P.dad.ru},res:res.map(r=>[r.c,r.hints,r.show,r.mist,r.skip])});
   shell(doneBox(n,`${strip()}<div class="res" style="text-align:center">📝 ${self} / ${res.length}</div><p class="lead" style="text-align:center">${clean===res.length?'Весь рассказ — по памяти, без подсказок! 🏆':'Контрольная сдана! Сам(а): '+self+' из '+res.length+'. Остальное можно повторить для закрепления 🙂'}</p>
    <div class="lgd"><span class="ok">сам(а)</span><span class="hn">с подсказкой</span><span class="sk">не вспомнил(а)</span></div>`,false));};
  one();};}

/* ---- 7: whack-a-mole, the whole screen ---- */
const KVA={};
function kpre(g){(g.audio||[]).forEach(c=>{if(KVA[c])return;const a=new Audio(fn(c));a.preload='auto';try{a.load();}catch(e){}KVA[c]=a;});}
window.KSAY=t=>new Promise(res=>{let a=KVA[t];if(!a){a=new Audio(fn(t));KVA[t]=a;}try{curA&&curA!==a&&curA.pause();}catch(e){}curA=a;let d=false;const end=()=>{if(!d){d=true;res();}};
 try{a.currentTime=0;}catch(e){}a.onended=end;a.onerror=end;a.play().catch(end);setTimeout(end,2500);});
window.KSTOP=()=>{try{curA&&curA.pause()}catch(e){}};
const KCSS={};
// the game stage is 1280×720 and always fits the window whole. Full screen on a phone held upright: the stage turns 90° and fills
// the screen — it works even when the phone's auto-rotate is locked (that is why kids saw «half a screen» before).
function katMount(id,box,onRes){const g=KAT.game(id);if(!g){box.innerHTML='<p class="lead">Игра не загрузилась, обнови страницу.</p>';return;}
 if(!KCSS[id]){KCSS[id]=1;const st=document.createElement('style');st.textContent=g.css||'';document.head.appendChild(st);}
 kpre(g);
 box.innerHTML=`<button class="btn kbig">⛶ Играть на весь экран</button><div class="kst"><div class="kstage g-moles"></div><button class="kfs" title="Во весь экран">⛶</button><button class="kx" title="Выйти">✕</button><div class="khint"><span class="kph">📱</span><b>Поверни телефон боком</b></div></div>`;
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
 // on a phone the first touch on the small game opens it on the whole screen
 wrap.addEventListener('pointerdown',e=>{if(isFull()||!matchMedia('(max-width:899px),(max-height:520px)').matches)return;e.stopPropagation();e.preventDefault();full(true);},true);
 const onR=()=>{fit();setTimeout(fit,250);};addEventListener('resize',onR);addEventListener('orientationchange',onR);
 KAT.onResult=(gid,r)=>{if(onRes)onRes(r);};
 const inst=g.mount(stage,KAT)||{};stage._inst=inst;
 KCUR={destroy(){ro.disconnect();removeEventListener('resize',onR);removeEventListener('orientationchange',onR);document.removeEventListener('fullscreenchange',onFs);document.removeEventListener('webkitfullscreenchange',onFs);
  if(isFull()){try{if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});}catch(e){}}document.documentElement.classList.remove('knoscroll');wrap.remove();try{inst.destroy&&inst.destroy()}catch(e){}}};
 return stage;}
function krot(){const n=7;
 shell(`${backBtn}${tag(n)}<h2>🔨 Бей крота</h2><div class="rbox" style="--c1:#2DBE8C;--c2:#5B6BD8"><b>Как играть</b>Слушай слог и бей молотком крота <b>с этим слогом</b>. Не перепутай: b — p, z — c, zh — ch, s — sh. Помни: <b>ci</b> = «цы», <b>chi</b> = «чшы» — без предыхания!</div><div id="kg"></div><div id="kr"></div>`);
 katMount('moles7',$('#kg'),r=>{const best=Math.max(r.score||0,+(S.kbest||0));S.kbest=best;keepS();
  finish(n,r.right,r.of,{pts:r.score,best,miss:r.miss});
  $('#kr').innerHTML=`<div class="qcard n" style="text-align:center"><div class="res">🔨 ${r.right} / ${r.of}</div><p class="lead">Очки: <b>${r.score}</b>${best>r.score?` · рекорд ${best}`:''}. ${r.miss&&r.miss.length?'Можно повторить для закрепления: <b class="py">'+r.miss.map(esc).join(', ')+'</b>':'Без ошибок! 🏆'}</p>
   <div class="row" style="justify-content:center"><button class="btn" onclick="location.hash=''">✓ Все задания</button></div></div>`;});}

route();
