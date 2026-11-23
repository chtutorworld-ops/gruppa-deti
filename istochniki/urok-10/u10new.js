/* ===== урок 10: новые задания ===== */
const HZ10=[['你','ты'],['我','я'],['好','хорошо'],['叫','зовут'],['妈','мама'],['爸','папа'],['他','он'],['她','она'],['们','много (们)'],['您','Вы (вежливо)']];
// x,y — центр в % картинки; s — размер в % ширины; r — поворот; o — прозрачность; k — вид: ink (тушь), gold (золото), pale (полупрозрачно), white (белый)
const ROOMS={
 detektiv:{t:'Кабинет детектива',img:'img/komnata-detektiv.webp',spots:[[78,18,7,-4,.55,'ink'],[85,43,8,0,.8,'gold'],[30,73,6,-8,.75,'ink'],[76,78,6,-10,.85,'gold'],[27,61,4.5,0,.7,'ink'],[80,63,6,-3,.6,'ink'],[49,36,5,3,.45,'ink'],[22,37,4.5,0,.55,'ink'],[42,13,4,-12,.5,'white'],[15,9,5,0,.35,'pale']]},
 chaj:{t:'Чайный дом',img:'img/komnata-chaj.webp',spots:[[56,14,6,0,.6,'ink'],[78,26,8,0,.55,'ink'],[15,59,7,0,.7,'ink'],[33,66,4,0,.7,'ink'],[72,79,6,-12,.75,'ink'],[92,47,6,0,.5,'ink'],[31,19,4,0,.6,'gold'],[29,74,3.5,0,.7,'ink'],[51,37,4,0,.6,'ink'],[38,52,4,0,.75,'gold']]},
 gostinaya:{t:'Гостиная',img:'img/komnata-gostinaya.webp',spots:[[39,19,6,0,.6,'ink'],[61,18,8,0,.55,'ink'],[89,13,5,0,.7,'ink'],[67,40.5,2.6,-8,.85,'ink'],[30,87,7,-6,.7,'ink'],[55,38,4.5,0,.5,'ink'],[11,61,5,-8,.45,'white'],[37,33,3.5,0,.7,'gold'],[6,66,3,0,.6,'ink'],[90,52,3.5,0,.6,'ink']]}};
S.rooms=S.rooms||{};
function findHz(){const n=1;
 shell(`${backBtn}${tag(n)}<h2>🔎 Найди иероглиф</h2>
  <div class="rbox" style="--c1:#6A6DDE;--c2:#664796"><b>Как играть</b>Выбери комнату. Внизу написано, что искать, например «ты». Найди этот иероглиф в комнате и нажми на него! Иероглифы спрятаны на книгах, вазах, стенах, даже в причёске.</div>
  <div class="r10t"><span>Время:</span>${[[180,'3 минуты'],[120,'2 минуты'],[0,'без времени']].map(([v,l],i)=>`<button class="r10tb${i===0?' on':''}" data-t="${v}">${l}</button>`).join('')}</div>
  <div class="r10rooms">${Object.entries(ROOMS).map(([k,r])=>`<button class="r10room" data-r="${k}"><img src="${r.img}" alt=""><b>${r.t}</b><small>${S.rooms[k]?'найдено '+S.rooms[k]+' из 10':'не пройдена'}</small></button>`).join('')}</div>`);
 let T=180;document.querySelectorAll('.r10tb').forEach(b=>b.onclick=()=>{document.querySelectorAll('.r10tb').forEach(x=>x.classList.remove('on'));b.classList.add('on');T=+b.dataset.t;});
 document.querySelectorAll('.r10room').forEach(b=>b.onclick=()=>room(b.dataset.r,T));}
function room(k,T){const n=1,R=ROOMS[k];const order=shuffle(HZ10.map((h,i)=>i));const place=shuffle(R.spots.map((s,i)=>i));let cur=0,found=0,errs=0;const t0=Date.now();let over=false;
 shell(`<div class="r10top"><button class="back n" id="rx">‹ Комнаты</button><span id="rtm">${T?'':'∞'}</span><span>✓ <b id="rf">0</b>/10</span></div>
  <div class="r10scene" id="rs"><img src="${R.img}" alt="${R.t}">${HZ10.map((h,i)=>{const [x,y,s,r,o,kk]=R.spots[place[i]];return `<button class="r10h k-${kk}" data-i="${i}" style="left:${x}%;top:${y}%;--s:${s};--r:${r}deg;--o:${o}" aria-label="иероглиф"><span class="z">${h[0]}</span></button>`;}).join('')}</div>
  <div class="r10ask" id="ra"></div>`);
 const ask=()=>{$('#ra').innerHTML=`Найди: <b>«${HZ10[order[cur]][1]}»</b>`;};ask();
 $('#rx').onclick=()=>findHz();
 const tick=()=>{if(over||!T)return;const left=T-Math.floor((Date.now()-t0)/1000);const el=$('#rtm');if(!el)return;if(left<=0){end();return;}el.textContent='⏱ '+Math.floor(left/60)+':'+String(left%60).padStart(2,'0');later(tick,500);};tick();
 document.querySelectorAll('.r10h').forEach(b=>b.onclick=()=>{if(over||b.classList.contains('got'))return;const i=+b.dataset.i;
  if(i===order[cur]){b.classList.add('got');found++;$('#rf').textContent=found;playW(HZ10[i][0]);cur++;if(cur>=order.length)later(end,700);else ask();}
  else{errs++;b.classList.remove('shk');void b.offsetWidth;b.classList.add('shk');$('#ra').innerHTML=`Это <b class="z">${HZ10[i][0]}</b> — «${HZ10[i][1]}». Ищи <b>«${HZ10[order[cur]][1]}»</b>`;}});
 function end(){if(over)return;over=true;const sec=Math.round((Date.now()-t0)/1000);S.rooms[k]=Math.max(S.rooms[k]||0,found);keepS();
  const tot=Object.values(S.rooms).reduce((a,b)=>a+b,0),rn=Object.keys(S.rooms).length;finish(n,Math.max(...Object.values(S.rooms)),10,{rooms:S.rooms,last:k,found,errs,sec});
  const other=Object.keys(ROOMS).filter(x=>x!==k);
  shell(doneBox(n,`<p class="lead" style="text-align:center">${R.t}: найдено <b>${found} из 10</b>${found<10?' — время вышло, можно повторить для закрепления':''}. Комнат пройдено: <b>${rn} из 3</b></p>
   <div class="r10rooms">${other.map(x=>`<button class="r10room" data-r="${x}"><img src="${ROOMS[x].img}" alt=""><b>Идём в: ${ROOMS[x].t}</b><small>${S.rooms[x]?'найдено '+S.rooms[x]+' из 10':'не пройдена'}</small></button>`).join('')}</div>`));
  document.querySelectorAll('.r10room').forEach(b=>b.onclick=()=>room(b.dataset.r,T));againOn(findHz);}}
/* 2. взлом сейфа */
const SAFE=[['pǎo',['p','b','d','t'],'ao'],['cái',['c','ch','z','s'],'ai'],['zǒu',['z','zh','c','s'],'ou'],['bēi',['b','p','m','f'],'ei'],['dào',['d','t','g','k'],'ao'],['shōu',['sh','s','zh','ch'],'ou']];
const FINS=['ai','ei','ao','ou'];
function safe(){const n=2;let k=0,ok=0;const miss=[];
 const step=()=>{if(k>=SAFE.length)return end();const [py,ini]=SAFE[k];const I=shuffle(ini);let a=0,b=0,tries=0;
  shell(`${backBtn}${tag(n)}<h2>🔐 Взлом сейфа ${Math.floor(k/2)+1} из 3</h2>
   <div class="rbox" style="--c1:#6A6DDE;--c2:#664796"><b>Как играть</b>Нажми «Слушай». Поверни колёсики: слева инициаль, справа финаль. Потом «Открыть».</div>
   <div class="sf10"><div class="sf10door"><div class="sf10code">Код ${k%2+1} из 2</div>
    <div class="sf10w"><button class="sf10a" data-w="a" data-d="-1">▲</button><div class="sf10v" id="wa">${I[0]}</div><button class="sf10a" data-w="a" data-d="1">▼</button></div>
    <div class="sf10w"><button class="sf10a" data-w="b" data-d="-1">▲</button><div class="sf10v" id="wb">${FINS[0]}</div><button class="sf10a" data-w="b" data-d="1">▼</button></div></div>
    <div class="sf10msg" id="sm"></div>
    <div class="row" style="justify-content:center"><button class="btn g" id="sl">🔊 Слушай</button><button class="btn" id="so">Открыть</button></div></div>`);
  const pl=()=>playS(py,$('#sl'));pl();$('#sl').onclick=pl;
  document.querySelectorAll('.sf10a').forEach(x=>x.onclick=()=>{const d=+x.dataset.d;if(x.dataset.w==='a'){a=(a+d+4)%4;$('#wa').textContent=I[a];}else{b=(b+d+4)%4;$('#wb').textContent=FINS[b];}});
  $('#so').onclick=()=>{const ga=I[a],gb=FINS[b],want=SAFE[k];if(ga===want[1][0]&&gb===want[2]){if(!tries)ok++;$('#sm').innerHTML=`<span class="ok10">Щёлк! Это <b>${py}</b></span>`;$('.sf10door').classList.add('open');k++;later(step,1300);}
   else{tries++;if(tries===1)miss.push(py);const h=ga!==want[1][0]?'инициаль':'финаль';$('#sm').innerHTML=`<span class="no10">Не открылось: проверь <b>${h}</b>. Послушай ещё раз</span>`;$('.sf10door').classList.remove('shk');void $('.sf10door').offsetWidth;$('.sf10door').classList.add('shk');later(pl,600);}};};
 const end=()=>{finish(n,ok,SAFE.length,{miss});shell(doneBox(n,`<p class="lead" style="text-align:center">Все 3 сейфа открыты! С первой попытки: <b>${ok} из ${SAFE.length}</b>${miss.length?'<br>Можно повторить для закрепления: '+miss.join(', '):''}</p>`));againOn(safe);};step();}
/* 6. ключи и фонетики */
const KEYS10=[['女','ключ','женщина','妈 好 她'],['口','ключ','рот','叫 吗'],['亻','ключ','человек','你 他 们'],['父','ключ','отец','爸'],['氵','ключ','вода',''],['木','ключ','дерево',''],['日','ключ','солнце','是 (сверху)'],['马','фонетик','звучит ma','妈 吗'],['巴','фонетик','звучит ba','爸'],['门','фонетик','звучит men','们'],['丩','фонетик','звучит jiu → jiào','叫']];
function keys(){const n=6;
 shell(`${backBtn}${tag(n)}<h2>🔑 Ключи и фонетики</h2>
  <div class="k10imp">ВАЖНО! Запомни: <b>ключ</b> подсказывает <b>смысл</b>, <b>фонетик</b> подсказывает <b>чтение</b>.</div>
  <h3 class="k10h">Ключи — смысл</h3><div class="k10g">${KEYS10.filter(x=>x[1]==='ключ').map(kc).join('')}</div>
  <h3 class="k10h">Фонетики — чтение</h3><div class="k10g">${KEYS10.filter(x=>x[1]==='фонетик').map(kc).join('')}</div>
  <div class="row" style="justify-content:center;margin-top:16px"><button class="btn" id="kq">Я запомнил(а) — проверь меня →</button></div>`);
 $('#kq').onclick=kquiz;}
const kc=([z,t,m,ex])=>`<div class="k10c ${t==='ключ'?'key':'fon'}"><span class="z">${z}</span><b>${m}</b>${ex?`<small class="z">${ex}</small>`:''}</div>`;
function kquiz(){const n=6;const Q=shuffle(KEYS10).slice(0,8);let k=0,ok=0;const miss=[];
 const step=()=>{if(k>=Q.length){finish(n,ok,Q.length,{miss});shell(doneBox(n,`<p class="lead" style="text-align:center">Верно: <b>${ok} из ${Q.length}</b>${miss.length?'<br>Можно повторить для закрепления: <span class="z">'+miss.join(' ')+'</span>':''}</p>`));againOn(keys);return;}
  const q=Q[k];const opts=shuffle([q,...shuffle(KEYS10.filter(x=>x!==q)).slice(0,2)]);let first=true;
  shell(`${backBtn}${tag(n)}<h2>Проверка ${k+1} из ${Q.length}</h2><div class="k10q"><span class="z">${q[0]}</span></div><p class="lead" style="text-align:center">Что подсказывает эта часть?</p>
   <div class="k10o">${opts.map((o,i)=>`<button class="btn g" data-i="${i}">${o[1]==='ключ'?'ключ «'+o[2]+'»':o[2]}</button>`).join('')}</div><div id="kf" class="sf10msg"></div>`);
  document.querySelectorAll('.k10o button').forEach(b=>b.onclick=()=>{const o=opts[+b.dataset.i];if(o===q){if(first)ok++;b.classList.add('k10ok');k++;later(step,700);}else{if(first)miss.push(q[0]);first=false;b.classList.add('k10no');$('#kf').innerHTML=`<span class="no10">Нет: это ${o[1]} «${o[2]}». Попробуй ещё</span>`;}});};step();}
