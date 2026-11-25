/* ===================== УРОК 11 · новые задания ===================== */
// 1. Собери комплект карточек: иероглиф + пиньинь + перевод (три корзинки, все 9 старых иероглифов)
const PN11=[['你',[['ni',3]],'ты'],['我',[['wo',3]],'я'],['好',[['hao',3]],'хорошо'],['叫',[['jiao',4]],'звать, зовут'],['妈',[['ma',1]],'мама'],['爸',[['ba',4]],'папа'],['他',[['ta',1]],'он'],['她',[['ta',1]],'она'],['们',[['men',0]],'много (людей)']];
function kit11(){const n=1,L=PN11,R=L.length;let errs=0;const conf=[];const row=[...Array(R)].map(()=>({h:null,p:null,r:null}));
 const py=i=>pyOf(L[i]);
 const fitsP=(i,ri)=>{const c=row[ri];return (c.h==null||c.h===i)&&(c.r==null||c.r===i)&&(c.p==null||py(c.p)===py(i));};
 const solvable=()=>{const used=new Set();const go=ri=>{if(ri>=R)return true;for(let i=0;i<R;i++){if(used.has(i)||!fitsP(i,ri))continue;used.add(i);if(go(ri+1))return true;used.delete(i);}return false;};return go(0);};
 const B={h:'Иероглифы',p:'Пиньинь',r:'Перевод'};let bk='h';
 const face=(k,i)=>k==='h'?`<span class="zh">${L[i][0]}</span><button class="snd8" data-w="${L[i][0]}" aria-label="Послушать">🔊</button>`:k==='p'?`<span class="py">${pyCol8(L[i])}</span>`:`<span class="ru8c">${L[i][2]}</span>`;
 shell(`${backBtn}${tag(n)}<h2>🧩 Собери комплект карточек</h2>
  <div class="rbox" style="--c1:#6A6DDE;--c2:#664796"><b>Как играть</b>В каждой строчке — один комплект: <b>иероглиф · пиньинь · перевод</b>. Бери карточки из корзинок внизу и перетаскивай на места. Или нажми на карточку, а потом на место.</div>
  <div class="bd82"><div class="h82">Иероглиф</div><div class="h82">Пиньинь</div><div class="h82">Перевод</div>${row.map((_,ri)=>['h','p','r'].map(k=>`<div class="slot8 s82" data-row="${ri}" data-k="${k}"></div>`).join('')).join('')}</div>
  <div class="bsk8"><div class="bt8">${Object.keys(B).map(k=>`<button data-b="${k}" class="${k===bk?'on':''}">🧺 ${B[k]} <i id="cn-${k}">${R}</i></button>`).join('')}</div>
   ${Object.keys(B).map(k=>`<div class="pool8 p82${k===bk?'':' hide'}" data-pool="${k}">${shuffle(L.map((_,i)=>i)).map(i=>`<div class="cd8 k-${k}" data-k="${k}" data-p="${i}">${face(k,i)}</div>`).join('')}</div>`).join('')}</div>`);
 document.querySelectorAll('[data-b]').forEach(b=>b.onclick=()=>{bk=b.dataset.b;document.querySelectorAll('[data-b]').forEach(x=>x.classList.toggle('on',x===b));document.querySelectorAll('[data-pool]').forEach(p=>p.classList.toggle('hide',p.dataset.pool!==bk));kit.clear();});
 document.querySelectorAll('.snd8').forEach(b=>b.onclick=e=>{e.stopPropagation();playW(b.dataset.w,b);});
 const cnt=()=>Object.keys(B).forEach(k=>{$('#cn-'+k).textContent=document.querySelectorAll(`[data-pool="${k}"] .cd8`).length;});
 const kit=dragKit((card,slot)=>{const k=card.dataset.k,i=+card.dataset.p,ri=+slot.dataset.row;
  if(slot.dataset.k!==k){shake(card);toast(`Эта карточка — в столбик «${B[k]}»`);return;}
  const prev=row[ri][k];row[ri][k]=i;const ok=fitsP(i,ri)&&solvable();
  if(!ok){row[ri][k]=prev;errs++;const c=row[ri];const other=c.h!=null?L[c.h][0]:c.r!=null?L[c.r][2]:c.p!=null?py(c.p):'';conf.push([k==='h'?L[i][0]:k==='p'?py(i):L[i][2],other]);
   shake(card);slot.classList.add('bad');later(()=>slot.classList.remove('bad'),600);toast(other?'Не подходит к этой строчке 🙂':'Эта карточка подходит к другой строчке 🙂');return;}
  slot.appendChild(card);card.classList.add('used');slot.classList.add('full');cnt();if(k!=='r')playW(L[i][0]);
  const c=row[ri];if(c.h!=null&&c.p!=null&&c.r!=null)document.querySelectorAll(`.s82[data-row="${ri}"]`).forEach(s=>s.classList.add('ok'));
  if(row.every(c=>c.h!=null&&c.p!=null&&c.r!=null)){finish(n,Math.max(0,R-Math.min(R,errs)),R,{errs,conf:conf.slice(0,20),miss:[...new Set(conf.map(x=>x[0]))].slice(0,8)});
   later(()=>{shell(doneBox(n,`<div class="res" style="text-align:center">🧩 Собрано!</div><p class="lead" style="text-align:center">${errs?`Ошибок: ${errs}. Можно повторить для закрепления 🙂`:'Без единой ошибки! 🏆'}</p>
    <div class="mlist">${L.map(p=>`<button class="n" data-say="${p[0]}"><span class="zh">${p[0]}</span><small><b class="py">${pyOf(p)}</b> ${p[2]}</small>🔊</button>`).join('')}</div>`));
    document.querySelectorAll('[data-say]').forEach(b=>b.onclick=()=>playW(b.dataset.say,b));againOn(kit11);},900);}
  else{const p=document.querySelector(`[data-pool="${k}"]`);if(!p.querySelector('.cd8')){const nx=Object.keys(B).find(x=>document.querySelector(`[data-pool="${x}"] .cd8`));if(nx)document.querySelector(`[data-b="${nx}"]`).click();}}});
 document.querySelectorAll('.cd8').forEach(kit.bind);document.querySelectorAll('.slot8').forEach(s=>s.onclick=()=>kit.slotTap(s));}

// 2. Диктант с русского на китайский: пишешь иероглиф пальцем по памяти, потом подписываешь пиньинь
const DK=[['я','我','wo',3],['мама','妈','ma',1],['он','他','ta',1],['хорошо','好','hao',3],['ты','你','ni',3],['папа','爸','ba',4],['она','她','ta',1],['звать, зовут','叫','jiao',4],['много (людей)','们','men',0]];
function dikt11(){const n=2;S.dk=S.dk||{};const A=S.dk;const k=DK.findIndex((_,i)=>!A[i]);
 if(k<0)return end();
 const [ru,c,base,t]=DK[k];let mist=0,hint=false,w=null;
 const head=`${backBtn}${tag(n)}<h2>✍️ Диктант: с русского на китайский</h2>
  <div class="dots" style="margin-top:8px">${DK.map((_,i)=>`<i class="${A[i]?(A[i].ok?'ok':'no'):i===k?'cur':''}"></i>`).join('')}</div>`;
 shell(`${head}<div class="qcard n"><div class="qhead"><span>Слово ${k+1} из ${DK.length}</span><span>шаг 1 · иероглиф</span></div>
   <div class="dk11ru">${esc(ru)}</div><p class="hint2" style="text-align:center;margin:4px 0 8px">Напиши иероглиф пальцем по памяти</p>
   <div class="wbox">${GRID}<div class="hw" id="hw"></div></div><p class="hint2" id="wh" style="text-align:center;margin-top:8px">Пиши каждую черту по порядку</p>
   <div class="row" style="justify-content:center"><button class="btn g" id="hn">💡 Не помню — подскажи</button></div></div>`);
 const start=outline=>{w=writeOne($('#hw'),c,{outline,hintAfter:outline?1:3},$('#wh'),r=>{mist+=r.mist;pinyin();});};
 start(false);
 $('#hn').onclick=()=>{hint=true;$('#hn').disabled=true;try{w&&w.cancelQuiz&&w.cancelQuiz();}catch(e){}start(true);$('#wh').textContent='Обведи по серому образцу';};
 function pinyin(){let tone=-1;
  shell(`${head}<div class="qcard n"><div class="qhead"><span>Слово ${k+1} из ${DK.length}</span><span>шаг 2 · пиньинь</span></div>
   <div class="dk11ru">${esc(ru)}</div><div class="dk11z zh">${c}</div>
   <p class="hint2" style="text-align:center;margin:0 0 6px">Подпиши пиньинь: буквы и значок тона</p>
   <div class="in8"><span class="no">${k+1}</span><input id="w" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" maxlength="8" placeholder="пиньинь" aria-label="Пиньинь"><span class="tm8" id="tm"></span></div>
   <div class="kb8">${KB8.map(r=>`<div>${[...r].map(ch=>`<button data-k="${ch}">${ch}</button>`).join('')}${r==='zxcvbnmü'?'<button data-k="⌫" class="bs">⌫</button>':''}</div>`).join('')}</div>
   <div class="qq" style="margin-top:12px">Какой тон?</div>
   <div class="mk8 big">${[1,2,3,4,0].map(x=>`<button data-t="${x}" aria-label="${x?x+'-й тон':'лёгкий тон'}">${msv(x,TCV[x],'30px')}</button>`).join('')}</div>
   <button class="btn nxt" id="ck" disabled>Проверить</button><div class="fb" id="fb"></div><div id="nx"></div></div>`);
  const inp=$('#w'),ck=$('#ck');if(matchMedia('(pointer:coarse)').matches)inp.setAttribute('inputmode','none');
  const upd=()=>{ck.disabled=!inp.value.trim()||tone<0;$('#tm').innerHTML=tone>=0?msv(tone,TCV[tone],'24px'):'';};
  inp.oninput=()=>{const v=inp.value;const tt=toneS(v);if(tt){tone=tt;document.querySelectorAll('.mk8 [data-t]').forEach(b=>b.classList.toggle('on',+b.dataset.t===tt));inp.value=plainS(v);}upd();};
  document.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{const ch=b.dataset.k;if(ch==='⌫')inp.value=inp.value.slice(0,-1);else if(inp.value.length<8)inp.value+=ch;upd();});
  document.querySelectorAll('.mk8 [data-t]').forEach(b=>b.onclick=()=>{tone=+b.dataset.t;document.querySelectorAll('.mk8 [data-t]').forEach(x=>x.classList.toggle('on',x===b));upd();});
  inp.onkeydown=e=>{if(e.key==='Enter'&&!ck.disabled)ck.click();};
  ck.onclick=()=>{const typed=inp.value.trim().toLowerCase().replace(/v/g,'ü');const okL=typed===base,okT=tone===t,okH=mist<=2&&!hint,ok=okL&&okT&&okH;
   A[k]={ru,c,mist,hint,w:typed,t:tone,okL,okT,okH,ok};keepS();send('dk',{a:DK.map((_,i)=>A[i]?[A[i].mist,A[i].hint?1:0,A[i].w,A[i].t]:null)});
   document.querySelectorAll('.kb8 button,.mk8 button,#w').forEach(b=>b.disabled=true);ck.style.display='none';
   const right=mark(base,t);const fb=$('#fb');fb.className='fb '+(okL&&okT?'ok':'no');
   fb.innerHTML=(okL&&okT?`✓ Верно! <b class="zh">${c}</b> <b class="py">${right}</b>`:`<div class="big8"><span class="zh">${c}</span> ${right}</div>${okL?'':`<div class="why8">Правильно пишется <b>${right}</b>${/[а-яё]/.test(typed)?' — латинскими буквами, не русскими':''}.</div>`}${okT?'':`<div class="why8">${toneWhy(t,tone)}</div>`}`)+(okH?'':`<div class="why8">Иероглиф ${hint?'написан с подсказкой':'с ошибками в чертах: '+mist}. Можно повторить для закрепления 🙂</div>`);
   $('#nx').innerHTML=`<div class="row" style="justify-content:center"><button class="btn g" id="ls">🔊 Послушать</button><button class="btn" id="nb">${k+1<DK.length?'Дальше →':'Готово →'}</button></div>`;
   $('#ls').onclick=()=>playW(c,$('#ls'));$('#nb').onclick=dikt11;};}
 function end(){const ok=DK.filter((_,i)=>A[i]&&A[i].ok).length;
  finish(n,ok,DK.length,{res:DK.map((d,i)=>{const a=A[i]||{};return [d[1],a.mist||0,a.hint?1:0,a.w||'',a.t==null?-1:a.t,a.ok?1:0];}),miss:DK.filter((_,i)=>!(A[i]&&A[i].ok)).map(d=>d[1])});
  shell(doneBox(n,`<div class="res" style="text-align:center">${ok} / ${DK.length}</div><p class="lead" style="text-align:center">${ok===DK.length?'Всё верно: и иероглифы, и пиньинь! 🏆':'Хорошая работа! Где были ошибки — можно повторить для закрепления 🙂'}</p>
   <div class="ans8">${DK.map((d,i)=>{const a=A[i]||{};return `<button class="${a.ok?'ok':'no'}" data-w="${d[1]}"><b><span class="zh">${d[1]}</span> ${mark(d[2],d[3])}</b><small>${esc(d[0])}${a.ok?' ✓':''}</small></button>`;}).join('')}</div>`));
  document.querySelectorAll('[data-w]').forEach(b=>b.onclick=()=>playW(b.dataset.w,b));againOn(()=>{S.dk={};keepS();dikt11();});}}

// 4. Верно или неверно: правильно ли переведено предложение
const VN=[['Она моя мама.','她是我妈妈。','tā shì wǒ māma.',1,'她是我妈妈。',''],
 ['Она не моя мама.','她是我妈妈。','tā shì wǒ māma.',0,'她不是我妈妈。','Здесь «не»: нужно <b class="zh">不是</b>.'],
 ['Он твой папа?','他是你爸爸。','tā shì nǐ bàba.',0,'他是你爸爸吗？','Это вопрос «да или нет?» — в конце нужен <b class="zh">吗</b>.'],
 ['Он не мой папа.','他不是我爸爸。','tā bú shì wǒ bàba.',1,'他不是我爸爸。',''],
 ['Он мой папа.','她是我爸爸。','tā shì wǒ bàba.',0,'他是我爸爸。','<b class="zh">她</b> — это «она» (ключ 女 «женщина»). «Он» — <b class="zh">他</b>.'],
 ['Она твоя мама?','她是你妈妈吗？','tā shì nǐ māma ma?',1,'她是你妈妈吗？',''],
 ['Ты моя мама?','吗你是我妈妈？','ma nǐ shì wǒ māma?',0,'你是我妈妈吗？','<b class="zh">吗</b> ставим в <b>конец</b> предложения.'],
 ['Они мои папа и мама.','他们是我爸爸妈妈。','tāmen shì wǒ bàba māma.',1,'他们是我爸爸妈妈。',''],
 ['Он мой папа.','他不是我爸爸。','tā bú shì wǒ bàba.',0,'他是我爸爸。','Здесь нет «не» — <b class="zh">不</b> лишнее.'],
 ['Нет, она не моя мама.','不是，她不是我妈妈。','bú shì, tā bú shì wǒ māma.',1,'不是，她不是我妈妈。','']];
function verno11(){const n=4;const Q=shuffle(VN.map((_,i)=>i));let k=0,ok=0;const res=[];
 const ask=()=>{if(k>=Q.length)return end();const [ru,zh,py,right,fix,why]=VN[Q[k]];
  shell(`${backBtn}${tag(n)}<h2>✅ Верно или неверно?</h2>
   <div class="rbox" style="--c1:#6A6DDE;--c2:#664796"><b>Правило</b><b class="zh">吗</b> в конце — вопрос «да или нет?» · <b class="zh">是</b> — связка · <b class="zh">不是</b> — «не является»</div>
   <div class="qcard n"><div class="qhead"><span>Предложение ${k+1} из ${Q.length}</span><span>✓ ${ok}</span></div>
    <div class="vn11ru">${esc(ru)}</div><div class="vn11zh zh">${zh}</div><div class="vn11py py">${pySent8(py)}</div>
    <p class="hint2" style="text-align:center">Правильно ли переведено?</p>
    <div class="vn11b"><button class="btn" data-a="1">Верно</button><button class="btn" data-a="0">Неверно</button></div>
    <div class="fb" id="fb"></div><div id="nx"></div></div>`);
  document.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>{const a=+b.dataset.a,good=a===right;if(good)ok++;res.push([VN[Q[k]][0],zh,a,right]);
   document.querySelectorAll('[data-a]').forEach(x=>{x.disabled=true;x.classList.toggle('pick',x===b);});
   const fb=$('#fb');fb.className='fb '+(good?'ok':'no');
   fb.innerHTML=(good?'✓ Правильно! ':'Не совсем. ')+(right?`Перевод верный: <b class="zh">${fix}</b>`:`<div class="why8">${why}</div>Правильно: <b class="zh">${fix}</b>`);
   playW(fix);$('#nx').innerHTML=`<div class="row" style="justify-content:center"><button class="btn g" id="ls">🔊 Ещё раз</button><button class="btn" id="nb">${k+1<Q.length?'Дальше →':'Готово →'}</button></div>`;
   $('#ls').onclick=()=>playW(fix,$('#ls'));$('#nb').onclick=()=>{k++;ask();};});};
 const end=()=>{finish(n,ok,Q.length,{res,miss:res.filter(r=>r[2]!==r[3]).map(r=>r[1])});
  shell(doneBox(n,`<div class="res" style="text-align:center">${ok} / ${Q.length}</div><p class="lead" style="text-align:center">${ok===Q.length?'Все ответы верные! 🏆':'Хорошо! Где были ошибки — можно повторить для закрепления 🙂'}</p>`));againOn(verno11);};
 ask();}
const pySent8=p=>p.split(' ').map(w=>`<span style="color:${TCV[toneS(w)]}">${esc(w)}</span>`).join(' ');

// 5. Собери предложение из слов-плиток
const FZ11=[{ru:'Он мой папа.',w:['他','是','我','爸爸']},{ru:'Она не моя мама.',w:['她','不是','我','妈妈']},{ru:'Он твой папа?',w:['他','是','你','爸爸','吗']},
 {ru:'Она твоя мама?',w:['她','是','你','妈妈','吗']},{ru:'Он не твой папа.',w:['他','不是','你','爸爸']},{ru:'Они мои папа и мама.',w:['他们','是','我','爸爸','妈妈']}];
const FZT11={'他':'tā','她':'tā','我':'wǒ','你':'nǐ','是':'shì','不是':'bú shì','吗':'ma','妈妈':'māma','爸爸':'bàba','他们':'tāmen','我们':'wǒmen'};
function fraza11(){const n=5;const Q=shuffle(FZ11);let k=0,errs=0;const miss=[];
 const ask=()=>{if(k>=Q.length)return end();const q=Q[k];const say=q.w.join('');
  const sw={'他':'她','她':'他','是':'不是','不是':'是','你':'我','我':'你','妈妈':'爸爸','爸爸':'妈妈'};
  let extra=[...new Set(q.w.map(x=>sw[x]).filter(x=>x&&!q.w.includes(x)))];if(!q.w.includes('吗'))extra.push('吗');
  extra=shuffle(extra).slice(0,Math.max(2,7-q.w.length));const tiles=shuffle([...q.w,...extra]);let got=[],bad=0;
  shell(`${backBtn}${tag(n)}<h2>🧱 Собери предложение</h2>
   <div class="rbox" style="--c1:#6A6DDE;--c2:#664796"><b>Как играть</b>Прочитай по-русски и нажимай плитки <b>по порядку</b>. Вопрос «да или нет?» — <b class="zh">吗</b> в конце.</div>
   <div class="qcard n"><div class="qhead"><span>Предложение ${k+1} из ${Q.length}</span><span>ошибок: ${errs}</span></div>
    <div class="fz9ru">${q.ru}</div><div class="fz9line" id="ln">${q.w.map(()=>'<span class="fz9gap"></span>').join('')}</div>
    <div class="fz9tiles">${tiles.map((t,i)=>`<button class="fz9t" data-i="${i}"><b class="zh">${t}</b><small>${FZT11[t]}</small></button>`).join('')}</div>
    <div class="fb" id="fb"></div><div id="nx"></div></div>`);
  document.querySelectorAll('.fz9t').forEach(b=>b.onclick=()=>{const t=tiles[+b.dataset.i],want=q.w[got.length];if(got.length>=q.w.length)return;
   if(t===want){got.push(t);b.disabled=true;b.classList.add('used');const g=document.querySelectorAll('#ln .fz9gap')[got.length-1];g.innerHTML=`<b class="zh">${t}</b>`;g.classList.add('ok');$('#fb').className='fb';$('#fb').innerHTML='';
    if(got.length===q.w.length){playW(say);const fb=$('#fb');fb.className='fb ok';fb.innerHTML=`✓ Верно! <b class="zh">${say}</b> <span class="py">${q.w.map(x=>FZT11[x]).join(' ')}</span>`;
     $('#nx').innerHTML=`<div class="row" style="justify-content:center"><button class="btn g" id="ls">🔊 Ещё раз</button><button class="btn" id="nb">${k+1<Q.length?'Дальше →':'Готово →'}</button></div>`;
     $('#ls').onclick=()=>playW(say,$('#ls'));$('#nb').onclick=()=>{k++;ask();};}}
   else{errs++;bad++;if(bad===1)miss.push(q.ru);shake(b);const fb=$('#fb');fb.className='fb no';
    const why=(t==='他'&&want==='她')?'Тут <b>она</b> — нужен 她 с ключом <b>女</b>.':(t==='她'&&want==='他')?'Тут <b>он</b> — нужен 他 с ключом <b>亻</b>.':(t==='吗')?'<b class="zh">吗</b> ставим только в <b>конец</b> вопроса.':(t==='不是'&&want==='是')?'Здесь нет «не» — нужен просто <b class="zh">是</b>.':(t==='是'&&want==='不是')?'Здесь «не» — нужен <b class="zh">不是</b>.':`Сейчас нужно слово «${FZT11[want]}». Посмотри ещё раз 🙂`;
    fb.innerHTML=`<div class="why8">${why}</div>`;}});};
 const end=()=>{finish(n,Q.length-miss.length,Q.length,{errs,miss});
  shell(doneBox(n,`<div class="res" style="text-align:center">${Q.length-miss.length} / ${Q.length}</div><p class="lead" style="text-align:center">${errs?'Хорошо! Где были ошибки — можно повторить для закрепления 🙂':'Все предложения без ошибок! 🏆'}</p>
   <div class="mlist">${FZ11.map(q=>`<button class="n" data-say="${q.w.join('')}"><span class="zh" style="font-size:22px">${q.w.join('')}</span><small>${q.ru}</small>🔊</button>`).join('')}</div>`));
  document.querySelectorAll('[data-say]').forEach(b=>b.onclick=()=>playW(b.dataset.say,b));againOn(fraza11);};
 ask();}

// 6. Напиши предложение иероглифами (пальцем). Подсказки можно включить: пиньинь + серый образец
const PS11=[['Привет всем!','你们好','nǐmen hǎo'],['Она моя мама.','她是我妈妈','tā shì wǒ māma'],['Он не мой папа.','他不是我爸爸','tā bú shì wǒ bàba'],['Она твоя мама?','她是你妈妈吗','tā shì nǐ māma ma']];
function pishi11(){const n=6;S.ps=S.ps||{};const A=S.ps;let k=PS11.findIndex((_,i)=>!A[i]);if(k<0)return end();
 const [ru,zh,py]=PS11[k];const ch=[...zh];let j=0,mist=0,hints=0;
 const draw=()=>{const H=!!S.hints;
  shell(`${backBtn}${tag(n)}<h2>✍️ Напиши иероглифами</h2>
   <div class="qcard n"><div class="qhead"><span>Предложение ${k+1} из ${PS11.length}</span><button class="ps11sw${H?' on':''}" id="sw" aria-pressed="${H}"><i></i>Подсказки</button></div>
    <div class="dk11ru">${esc(ru)}${/吗$/.test(zh)?'':''}</div>
    ${H?`<div class="vn11py py">${pySent8(py)}</div>`:''}
    <div class="ps11ln">${ch.map((c,i)=>`<span class="${i<j?'ok':i===j?'cur':''}">${i<j?`<b class="zh">${c}</b>`:''}</span>`).join('')}${/吗$/.test(zh)?'<em>？</em>':'<em>。</em>'}</div>
    <div class="wbox">${GRID}<div class="hw" id="hw"></div></div><p class="hint2" id="wh" style="text-align:center;margin-top:8px">${H?'Обведи по серому образцу':'Пиши по памяти. Не помнишь — включи подсказки'}</p></div>`);
  $('#sw').onclick=()=>{S.hints=!S.hints;keepS();if(S.hints)hints++;draw();};
  writeOne($('#hw'),ch[j],{outline:H,hintAfter:H?1:3},$('#wh'),r=>{mist+=r.mist;j++;if(j<ch.length)draw();else done();});};
 const done=()=>{A[k]={mist,hints:hints||(S.hints?1:0)};keepS();send('ps',{a:PS11.map((_,i)=>A[i]||null)});playW(zh);
  shell(`${backBtn}${tag(n)}<h2>✍️ Напиши иероглифами</h2><div class="qcard n"><div class="qhead"><span>Предложение ${k+1} из ${PS11.length}</span><span>✓</span></div>
   <div class="dk11ru">${esc(ru)}</div><div class="vn11zh zh">${zh}${/吗$/.test(zh)?'？':'。'}</div><div class="vn11py py">${pySent8(py)}</div>
   <div class="fb ${mist<=3?'ok':'no'}">${mist<=3?'✓ Написано!':'Написано! Ошибок в чертах: '+mist+' — можно повторить для закрепления 🙂'}</div>
   <div class="row" style="justify-content:center"><button class="btn g" id="ls">🔊 Послушать</button><button class="btn" id="nb">${k+1<PS11.length?'Дальше →':'Готово →'}</button></div></div>`);
  $('#ls').onclick=()=>playW(zh,$('#ls'));$('#nb').onclick=pishi11;};
 draw();
 function end(){const clean=PS11.filter((_,i)=>A[i]&&A[i].mist<=3).length;
  finish(n,clean,PS11.length,{res:PS11.map((p,i)=>[p[1],(A[i]||{}).mist||0,(A[i]||{}).hints||0]),miss:PS11.filter((_,i)=>!(A[i]&&A[i].mist<=3)).map(p=>p[1])});
  shell(doneBox(n,`<div class="res" style="text-align:center">${clean} / ${PS11.length}</div><p class="lead" style="text-align:center">Все предложения написаны! ${clean===PS11.length?'🏆':'Где были ошибки — можно повторить для закрепления 🙂'}</p>
   <div class="mlist">${PS11.map(p=>`<button class="n" data-say="${p[1]}"><span class="zh" style="font-size:22px">${p[1]}</span><small>${p[0]}</small>🔊</button>`).join('')}</div>`));
  document.querySelectorAll('[data-say]').forEach(b=>b.onclick=()=>playW(b.dataset.say,b));againOn(()=>{S.ps={};keepS();pishi11();});}}
