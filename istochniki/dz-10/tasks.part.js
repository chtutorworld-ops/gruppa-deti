/* ---------- данные ---------- */
const TASKS=[null,
 {t:'Диктант: все звуки',s:'Послушай голос учителя и собери слог',run:()=>dictant()},
 {t:'Иероглифы в темноте',s:'Свети фонариком и ищи иероглифы',run:()=>rooms()},
 {t:'Финали an и en',s:'Правило и тренировка на слух',run:()=>anen()},
 {t:'Читаем диалог',s:'Прочитай и послушай историю',run:()=>readDlg()},
 {t:'Новое слово 吗',s:'Объяснение, пропись, печатаем',run:()=>word('吗')},
 {t:'Новое слово 是',s:'Объяснение, пропись, печатаем',run:()=>word('是')},
 {t:'Новое слово 不',s:'Объяснение, пропись, печатаем',run:()=>word('不')},
 {t:'Вставь пропущенное',s:'Диалог с пропусками',run:()=>gaps()},
 {t:'Расставь реплики',s:'Собери диалог по порядку',run:()=>order()},
 {t:'Мемори',s:'Все наши иероглифы: найди пары',run:()=>memo()}];
const NT=TASKS.length-1;
const TMARK={1:'ˉ',2:'ˊ',3:'ˇ',4:'ˋ'};
const TONES={'ā':1,'á':2,'ǎ':3,'à':4,'ē':1,'é':2,'ě':3,'è':4,'ō':1,'ó':2,'ǒ':3,'ò':4,'ī':1,'í':2,'ǐ':3,'ì':4,'ū':1,'ú':2,'ǔ':3,'ù':4};
const toneOf=py=>{for(const ch of py)if(TONES[ch])return TONES[ch];return 0;};
const plain=py=>py.normalize('NFD').replace(/[̀-ͯ]/g,'');
const pyHTML=py=>`<span class="py t${toneOf(py)}">${esc(py)}</span>`;
// пиньинь фразы: каждое слово своим цветом тона
const pySent=p=>p.split(' ').map(w=>`<span class="t${toneOf(w)}">${esc(w)}</span>`).join(' ');
const bare=t=>String(t).replace(/[，。！？、,.!?\s]/g,'');
const playPhrase=(t,el)=>playWord(bare(t),el);
// пиньинь с тоном из «ba»+3
const MK={a:['ā','á','ǎ','à'],o:['ō','ó','ǒ','ò'],e:['ē','é','ě','è'],i:['ī','í','ǐ','ì'],u:['ū','ú','ǔ','ù']};
function toned(base,t){if(!t)return base;const v=/a|e/.exec(base)||/ou/.exec(base)||/[iou](?!.*[aeiou])/.exec(base);if(!v)return base;const i=v.index,ch=base[i];return base.slice(0,i)+MK[ch][t-1]+base.slice(i+1);}

/* ================= 1. Диктант: все звуки (ТОЛЬКО записи учителя, синтезатор не подмешиваем) ================= */
// 1 строчка, 2 строчка, финали — в порядке, как учили. an en в диктант не берём (это задание 3)
const INI1=['b','p','m','f','d','t','n','l','g','k','h'],INI2=['z','c','s','zh','ch','sh'],INI=[...INI1,...INI2];
const INI_RU={b:'б',p:'пх',m:'м',f:'ф',d:'д',t:'тх',n:'н',l:'л',g:'г',k:'кх',h:'х',z:'дз',c:'цх',s:'с',zh:'дж',ch:'чх',sh:'ш'};
const FIN_ORDER=['a','o','u','i','e','ai','ei','ao','ou'];
// записи на сайте на 24.11 (если список с сайта не загрузится)
const VOICE_DEF='ba1 ba2 ba3 ba4 bi1 bi2 bi3 bi4 bo1 bo2 bo3 bo4 bu1 bu2 bu3 bu4 ca1 ca2 ca3 ca4 chi1 ci1 ci2 ci3 ci4 cu1 cu2 cu3 cu4 da1 da2 da3 da4 de1 de2 de3 de4 di1 di2 di3 di4 du1 du2 du3 du4 fa1 fa2 fa3 fa4 fo2 fu1 fu2 fu3 fu4 ga1 ga2 ga3 ga4 ge1 ge2 ge3 ge4 gu1 gu2 gu3 gu4 ha1 ha2 ha3 ha4 he1 he2 he3 he4 hu1 hu2 hu3 hu4 ka1 ka2 ka3 ka4 ke1 ke2 ke3 ke4 ku1 ku2 ku3 ku4 la1 la2 la3 la4 le4 li1 li2 li3 li4 lu1 lu2 lu3 lu4 ma1 ma2 ma3 ma4 mi1 mi2 mi3 mi4 mo1 mo2 mo3 mo4 na1 na2 na3 na4 ne4 ni1 ni2 ni3 ni4 nu1 nu2 nu3 nu4 pa1 pa2 pa3 pa4 pi1 pi2 pi3 pi4 po1 po2 po3 po4 pu1 pu2 pu3 pu4 sa1 sa2 sa3 sa4 shi1 si1 si2 si3 si4 su1 su2 su3 su4 ta1 ta2 ta3 ta4 te1 te2 te3 te4 ti1 ti2 ti3 ti4 tu1 tu2 tu3 tu4 za1 za2 za3 za4 zhi1 zi1 zi2 zi3 zi4 zu1 zu2 zu3 zu4'.split(' ');
function parseV(id){const m=/^([a-z]+)([1-4])$/.exec(id);if(!m)return null;const base=m[1],t=+m[2];
 const ini=['zh','ch','sh',...INI].find(x=>base.startsWith(x));if(!ini)return null;const fin=base.slice(ini.length);
 if(!FIN_ORDER.includes(fin))return null;return {id,ini,fin,t,py:toned(base,t),row:INI2.includes(ini)?2:1};}
let VPOOL=null;
async function voicePool(){if(VPOOL)return VPOOL;let ids=VOICE_DEF;
 try{const r=await fetch(VOICE+'index.json',{cache:'no-store'});if(r.ok){const j=await r.json();const k=Object.keys(j);if(k.length)ids=k;}}catch(e){}
 VPOOL=ids.map(parseV).filter(Boolean);return VPOOL;}
function pickDict(pool,N){const out=[],cnt={t:{},f:{},i:{}};let row2=0;
 for(const pass of [0,1])for(const s of shuffle(pool)){if(out.length>=N)break;if(out.includes(s))continue;
  if(!pass){if(cnt.i[s.ini]||(cnt.t[s.t]||0)>=3||(cnt.f[s.fin]||0)>=3)continue;if(s.row===2&&row2>=3)continue;if(s.row===1&&out.length-row2>=N-3&&row2<3)continue;}
  out.push(s);cnt.i[s.ini]=1;cnt.t[s.t]=(cnt.t[s.t]||0)+1;cnt.f[s.fin]=(cnt.f[s.fin]||0)+1;if(s.row===2)row2++;}
 return shuffle(out);}
async function dictant(){const n=1;shell(n,{step:'',scene:'<div class="tk">Загружаю голос учителя…</div>'});
 const pool=await voicePool();if(S.cur!==n)return;
 const FINS=FIN_ORDER.filter(f=>pool.some(s=>s.fin===f));
 const items=pickDict(pool,10);let k=0,score=0;const miss=[],ans=[];
 const one=()=>{if(k>=items.length)return finish(n,{score,of:items.length,miss,ans},
   `<p>Слогов без ошибок: ${score} из ${items.length}.</p>${miss.length?`<p>Можно повторить для закрепления:</p><div class="chips">${miss.map(m=>`<span class="x">${pyHTML(m)}</span>`).join('')}</div>`:''}`);
  const it=items[k];let ph=0,clean=true;const wrong=[];
  const PH=['Какая инициаль?','Какая финаль?','Какой тон?'];
  shell(n,{step:(k+1)+' / '+items.length,sub:'Послушай голос учителя и собери слог: инициаль, финаль, тон.',
   scene:`<button class="snd" id="ps" aria-label="Послушать">${IC.snd}</button>
    <div class="slots"><span class="slot on" id="s0">?</span><span class="slot" id="s1">?</span><span class="slot" id="s2">?</span></div><div class="tk" id="ph">${PH[0]}</div>`,
   pult:`<div class="fb" id="fb"></div><div id="kk"></div><button class="main soft" id="mn">${IC.snd} Послушать ещё раз</button>`});
  const play=()=>playVoice(it.id,$('#ps'));$('#ps').onclick=play;$('#mn').onclick=play;later(play,350);
  const keyH=(v,cls,lab,sm)=>`<button class="key sk ${cls}" data-v="${v}"><span class="py">${lab}</span>${sm?`<small>${sm}</small>`:''}</button>`;
  const draw=()=>{const kk=$('#kk');$('#ph').textContent=PH[ph];
   if(ph===0)kk.innerHTML=`<div class="dk"><div class="sgb g1 dkb"><div class="sgh">1 строчка</div><div class="dkr c6">${INI1.map(x=>keyH(x,'g1',x,INI_RU[x])).join('')}</div></div>
     <div class="sgb g2 dkb"><div class="sgh">2 строчка</div><div class="dkr c6">${INI2.map(x=>keyH(x,'g2',x,INI_RU[x])).join('')}</div></div></div>`;
   else if(ph===1)kk.innerHTML=`<div class="sgb gf dkb"><div class="sgh">Финали</div><div class="dkr c${Math.min(FINS.length,5)}">${FINS.map(f=>keyH(f,'gf',f)).join('')}</div></div>`;
   else kk.innerHTML=`<div class="keys k4">${[1,2,3,4].map(v=>`<button class="key" data-v="${v}"><span class="tm t${v}">${TMARK[v]}</span><small>${v} тон</small></button>`).join('')}</div>`;
   $$('#kk [data-v]').forEach(b=>b.onclick=()=>{const v=b.dataset.v;const right=String([it.ini,it.fin,it.t][ph]);
    if(v===right){b.classList.add('ok');$$('#kk [data-v]').forEach(q=>q.disabled=true);
     const s=$('#s'+ph);s.className='slot ok';s.innerHTML=ph===2?`<span class="t${v}">${TMARK[v]}</span>`:esc(v);fb(ph===2?'':'Да','ok');
     later(()=>{ph++;if(ph<3){$('#s'+ph).className='slot on';fb('');draw();}else done();},600);
    }else{b.classList.remove('hint');void b.offsetWidth;b.classList.add('hint');if(clean){clean=false;miss.push(it.py);}wrong.push(v);
     const h=ph===2?'Послушай, как идёт голос: ровно, вверх, ямкой или вниз'
      :ph===0&&((v==='b'&&right==='p')||(v==='p'&&right==='b')||(v==='d'&&right==='t')||(v==='t'&&right==='d')||(v==='g'&&right==='k')||(v==='k'&&right==='g')||(v==='z'&&right==='c')||(v==='c'&&right==='z')||(v==='zh'&&right==='ch')||(v==='ch'&&right==='zh'))?'Слышишь выдох «х»? Предыхательный или нет?'
      :'Похоже, но не то. Послушай ещё раз';
     fb(h,'hint');}});};
  const done=()=>{if(clean)score++;ans.push([it.py,wrong.join(' ')||'—',clean]);
   $('#ph').innerHTML=it.fin==='i'&&it.row===2?'Помнишь? После z c s zh ch sh буква <b>i</b> читается «ы»':'';const sl=$('.slots');sl.outerHTML=`<div class="syl">${pyHTML(it.py)}</div>`;
   fb(clean?'Слог собран без ошибок':'Слог собран','ok');later(()=>playVoice(it.id),150);
   const mn=$('#mn');mn.className='main';mn.innerHTML=k+1<items.length?'Дальше':'Готово';mn.onclick=()=>{k++;one();};$('#kk').innerHTML='';};
  draw();};
 one();}

/* ================= 2. Иероглифы в темноте: те же комнаты урока 10, фонарик ================= */
const HZ10=[['你','ты'],['我','я'],['好','хорошо'],['叫','звать'],['妈','мама'],['爸','папа'],['他','он'],['她','она'],['们','много (людей)'],['您','Вы (вежливо)']];
// x,y — центр в % картинки; s — размер в % ширины; r — поворот; o — прозрачность; k — вид (как на уроке 10)
const ROOMS={
 detektiv:{t:'Кабинет детектива',img:'img/komnata-detektiv.webp',spots:[[78,18,7,-4,.55,'ink'],[85,43,8,0,.8,'gold'],[30,73,6,-8,.75,'ink'],[76,78,6,-10,.85,'gold'],[27,61,4.5,0,.7,'ink'],[80,63,6,-3,.6,'ink'],[49,36,5,3,.45,'ink'],[22,37,4.5,0,.55,'ink'],[42,13,4,-12,.5,'white'],[15,9,5,0,.35,'pale']]},
 chaj:{t:'Чайный дом',img:'img/komnata-chaj.webp',spots:[[56,14,6,0,.6,'ink'],[78,26,8,0,.55,'ink'],[15,59,7,0,.7,'ink'],[33,66,4,0,.7,'ink'],[72,79,6,-12,.75,'ink'],[92,47,6,0,.5,'ink'],[31,19,4,0,.6,'gold'],[29,74,3.5,0,.7,'ink'],[51,37,4,0,.6,'ink'],[38,52,4,0,.75,'gold']]},
 gostinaya:{t:'Гостиная',img:'img/komnata-gostinaya.webp',spots:[[39,19,6,0,.6,'ink'],[61,18,8,0,.55,'ink'],[89,13,5,0,.7,'ink'],[67.5,40.8,3.4,-8,.95,'ink'],[30,87,7,-6,.7,'ink'],[55,38,4.5,0,.5,'ink'],[11,61,5,-8,.45,'white'],[37,33,3.5,0,.7,'gold'],[6,66,3,0,.6,'ink'],[90,52,3.5,0,.6,'ink']]}};
function rooms(){const n=2;S.rooms=S.rooms||{};
 shell(n,{step:'',sub:'В комнате выключили свет! Води фонариком (пальцем или мышкой) и ищи иероглиф, который написан внизу.',
  scene:`<div class="rmlist">${Object.entries(ROOMS).map(([k,r])=>`<button class="rmroom" data-r="${k}"><img src="${r.img}" alt=""><b>${r.t}</b><small>${S.rooms[k]?'найдено '+S.rooms[k]+' из 10':'ещё не была'}</small></button>`).join('')}</div>`,
  pult:`<div class="fb" id="fb">${S.done[n]?'Задание уже засчитано. Можно пройти другие комнаты':'Выбери комнату. Чтобы задание засчиталось, найди все 10 иероглифов в одной комнате'}</div>`});
 $$('.rmroom').forEach(b=>b.onclick=()=>room(b.dataset.r));}
function room(key){const n=2,R=ROOMS[key];const order=shuffle(HZ10.map((h,i)=>i));const place=shuffle(R.spots.map((s,i)=>i));let cur=0,found=0,errs=0;const t0=Date.now();const ans=[];let wrongHere=false;
 shell(n,{step:'0 / 10',sub:'',
  scene:`<div class="rmask" id="ra"></div><div class="rmscene" id="rs"><img src="${R.img}" alt="${esc(R.t)}" draggable="false">${HZ10.map((h,i)=>{const [x,y,s,r,o,kk]=R.spots[place[i]];
   return `<button class="rmh k-${kk}" data-i="${i}" style="left:${x}%;top:${y}%;--s:${s};--r:${r}deg;--o:${o}" aria-label="иероглиф"><span class="zh">${h[0]}</span></button>`;}).join('')}<div class="rmdark" id="rd"></div></div>`,
  pult:`<div class="fb" id="fb">Води фонариком по комнате</div><button class="main soft" id="mn">${IC.back} Другая комната</button>`});
 const ask=()=>{$('#ra').innerHTML=$('#sub').innerHTML=`Найди: <b>«${esc(HZ10[order[cur]][1])}»</b>`;};ask();
 $('#mn').onclick=rooms;
 const rs=$('#rs'),rd=$('#rd');
 const light=(x,y)=>{const r=rs.getBoundingClientRect();rd.style.setProperty('--x',(x-r.left)+'px');rd.style.setProperty('--y',(y-r.top)+'px');};
 const r0=rs.getBoundingClientRect();light(r0.left+r0.width/2,r0.top+r0.height*.45);
 rs.addEventListener('pointermove',e=>light(e.clientX,e.clientY));rs.addEventListener('pointerdown',e=>light(e.clientX,e.clientY));
 $('.scr').classList.add('rm');
 // нажатие засчитывается ближайшему иероглифу (кнопки могут перекрываться на маленьком экране)
 rs.addEventListener('click',e=>{let b=e.target.closest('.rmh');
  if(!b||e.detail!==0){b=null;let best=34;$$('.rmh').forEach(q=>{const r=q.getBoundingClientRect(),d=Math.hypot(r.left+r.width/2-e.clientX,r.top+r.height/2-e.clientY);if(d<best){best=d;b=q;}});}
  if(b)hit(b);});
 function hit(b){if(b.classList.contains('got')||cur>=order.length)return;const i=+b.dataset.i;
  if(i===order[cur]){b.classList.add('got');found++;setCnt(found+' / 10');playWord(HZ10[i][0]);ans.push([HZ10[i][0],HZ10[i][1],!wrongHere]);wrongHere=false;cur++;
   fb(`Нашёл: <span class="zh">${HZ10[i][0]}</span> ${esc(HZ10[i][1])}`,'ok');
   if(cur>=order.length)later(end,900);else ask();}
  else{errs++;wrongHere=true;b.classList.remove('shk');void b.offsetWidth;b.classList.add('shk');
   fb(`Это <span class="zh">${HZ10[i][0]}</span> «${esc(HZ10[i][1])}». Ищи «${esc(HZ10[order[cur]][1])}»`,'hint');}}
 function end(){const sec=Math.round((Date.now()-t0)/1000);S.rooms[key]=10;keep();const sc=ans.filter(a=>a[2]).length;
  const prev=S.done[n];const res={score:Math.max(sc,prev?prev.score||0:0),of:10,errs,sec,last:R.t,rooms:Object.keys(S.rooms).length,ans,miss:ans.filter(a=>!a[2]).map(a=>a[0]+' '+a[1])};
  finish(n,res,`<p>${esc(R.t)}: все 10 иероглифов найдены за ${Math.floor(sec/60)} мин ${sec%60} с. С первой попытки: ${sc} из 10.</p><p>Комнат пройдено: ${Object.keys(S.rooms).length} из 3. Остальные комнаты ждут тебя в задании 2.</p>`);}}

/* ================= 3. Финали an и en: правило ещё раз + тренировка (голос диктанта) ================= */
// пары: [слог an, иероглиф, слог en, иероглиф] — одна инициаль и один тон, меняется только финаль
const ANEN=[['bān','班','bēn','奔'],['bǎn','板','běn','本'],['bàn','半','bèn','笨'],['fān','翻','fēn','分'],['fán','烦','fén','坟'],['fǎn','反','fěn','粉'],['fàn','饭','fèn','份'],
 ['gān','甘','gēn','跟'],['hán','寒','hén','痕'],['hǎn','喊','hěn','很'],['hàn','汗','hèn','恨'],['kǎn','砍','kěn','肯'],['mán','馒','mén','门'],['pān','攀','pēn','喷'],['pán','盘','pén','盆'],
 ['sān','三','sēn','森'],['shān','山','shēn','深'],['shǎn','闪','shěn','审'],['shàn','善','shèn','肾'],['zhān','沾','zhēn','真'],['zhǎn','展','zhěn','枕'],['zhàn','站','zhèn','阵']];
const ANSYL=ANEN.flatMap(([a,ac,e,ec])=>[{py:a,c:ac,f:'an'},{py:e,c:ec,f:'en'}]);
// «какой слог?»: верный слог (an/en) + похожие, как на уроке
const TRI10=[['bān','班',['bāi','bēi']],['mén','门',['méi','mán']],['gǎn','感',['gǒu','gǎo']],['zhēn','真',['shēn','chēn']],['hěn','很',['kěn','gěn']],['fèn','份',['fàn','fèi']],['pán','盘',['pén','pái']],['shān','山',['shēn','shāo']]];
function anen(){const n=3;S.p3=S.p3||0;
 const step1=()=>{shell(n,{step:'правило 1 / 2',sub:'Вспомним, как сказать <b>n</b> в конце слога.',
   scene:`<div class="anr"><img class="anim" src="img/yazyk.webp" alt="Рот и язык: спинка языка, нёбо">
    <div class="ans"><div class="anstep"><span>1</span><p>Язык <b>мягкий</b>, расслабленный</p></div>
    <div class="anstep"><span>2</span><p><b>Подушечкой</b> языка <b>мягко прижми к нёбу</b></p></div>
    <div class="anstep"><span>3</span><p>И всё! Звук получится <b>сам</b></p></div></div></div>
    <div class="srule">n в конце — <b>НЕ наш «н»</b>: не жми кончиком языка в зубы</div>`,
   pult:`<div class="fb" id="fb"></div><button class="main" id="mn">Понятно, дальше</button>`});$('#mn').onclick=()=>{S.p3=1;keep();step2();};};
 const EX={an:[['sān','三'],['fàn','饭'],['kàn','看'],['shān','山']],en:[['mén','门'],['hěn','很'],['běn','本'],['fēn','分']]};
 const step2=()=>ruleStep(n,{sub:'Нажми на каждый слог и послушай. Потом проверь себя.',
   html:`<div class="anc">${['an','en'].map(f=>`<div class="sgb gf anb"><div class="anh"><span class="py">${f}</span><small>${f==='an'?'<b>a</b> + мягкий <b>n</b>, рот широко':'<b>e</b> + мягкий <b>n</b>, как в нашем <span class="zh">们</span> men'}</small></div>
     <div class="anx">${EX[f].map(([py,c])=>`<button class="key sk gf" data-snd="${c}"><span class="py">${py}</span></button>`).join('')}</div></div>`).join('')}</div>`,
   need:8,btn:'Дальше: an или en?',play:(c,el)=>playDict(c,el),onGo:()=>{S.p3=2;keep();step3();}});
 let r3=null;
 const step3=()=>{const items=shuffle([...shuffle(ANSYL.filter(s=>s.f==='an')).slice(0,5),...shuffle(ANSYL.filter(s=>s.f==='en')).slice(0,5)]).map(s=>({...s,id:s.py,miss:s.py}));
  quiz(n,items,{cols:2,audio:(it,el)=>playDict(it.c,el),
   scene:it=>`<button class="snd" id="ps" aria-label="Послушать">${IC.snd}</button><div class="syl" id="sy">&nbsp;</div><div class="tk">an или en?</div>`,
   keys:()=>[{v:'an',cls:'sk gf',html:'<span class="py" style="font-size:34px">an</span><small>a + n</small>'},{v:'en',cls:'sk gf',html:'<span class="py" style="font-size:34px">en</span><small>e + n</small>'}],
   isRight:(it,x)=>x.v===it.f,
   okText:it=>{const sy=$('#sy');if(sy)sy.innerHTML=pyHTML(it.py);return `Да, финаль <b>${it.f}</b>`;},
   hint:it=>it.f==='an'?'Рот открыт широко, как в «а». Послушай ещё раз':'Рот почти закрыт, как в слоге e. Послушай ещё раз',
   save:(s,o,m,a)=>{r3=[s,o,m,a];S.p3=3;keep();step4();}});};
 const step4=()=>{const items=shuffle(TRI10).map(([py,c,oth])=>({py,c,oth,id:py,miss:py}));
  quiz(n,items,{cols:3,audio:(it,el)=>playDict(it.c,el),
   scene:it=>`<button class="snd" id="ps" aria-label="Послушать">${IC.snd}</button><div class="tk">Какой слог ты слышишь?</div>`,
   keys:it=>shuffle([it.py,...it.oth]).map(p=>({v:p,html:pyHTML(p).replace('class="py','style="font-size:28px" class="py')})),
   isRight:(it,x)=>x.v===it.py,
   okText:it=>`Да, это ${pyHTML(it.py)}`,
   hint:(it,x)=>/(ai|ei|ao|ou)$/.test(plain(x.v))?'Слушай конец слога: там мягкий n':plain(x.v).slice(-2)!==plain(it.py).slice(-2)?'an или en? Послушай ещё раз':'Финаль верная, послушай начало слога',
   save:(s4,o4,m4,a4)=>{const [s3,o3,m3,a3]=r3||[0,0,[],[]];S.p3=0;keep();
    finish(n,{score:s3+s4,of:o3+o4,miss:[...m3,...m4],ans:[...a3,...a4]},sumMiss(s3+s4,o3+o4,[...m3,...m4].map(pyHTML)));}});};
 [step1,step2,step3,step4][S.p3||0]();}

/* ================= 4. Читаем диалог (по кадрам комикса урока) ================= */
const DLG=[['p','小朋友，你好！','xiǎo péngyou, nǐ hǎo!','Привет, дружок!'],['b','您好！','nín hǎo!','Здравствуйте!'],['p','小朋友，你叫什么名字？','xiǎo péngyou, nǐ jiào shénme míngzi?','Дружок, как тебя зовут?'],['b','我叫小明。','wǒ jiào Xiǎo Míng.','Меня зовут Сяо Мин.'],['p','她是你妈妈吗？','tā shì nǐ māma ma?','Она твоя мама?'],['b','不是，不是！她不是我妈妈。','bú shì, bú shì! tā bú shì wǒ māma.','Нет, нет! Она не моя мама.'],['b','她是我妈妈！','tā shì wǒ māma!','Вот моя мама!']];
const WHO={p:'Полицейский',b:'Мальчик Сяо Мин'};
const FRAMES=[[0],[1],[2,3],[4,5],[6]];
const hl=z=>esc(z).replace(/(吗|是|不)/g,'<em>$1</em>');
const bubble=(i,o={})=>{const [w,z,p,r]=DLG[i];return `<button class="dlb ${w}" data-snd="${i}"><span class="dlw">${WHO[w]}</span><span class="zh dlz">${o.hl?hl(z):esc(z)}</span>${o.py===false?'':`<span class="py dlp">${pySent(p)}</span>`}${o.ru===false?'':`<small class="dlr">${esc(r)}</small>`}</button>`;};
function readDlg(){const n=4;let f=0;
 const one=()=>{const L=FRAMES[f];
  ruleStep(n,{sub:f===0?'История из урока. Нажми на каждую реплику: послушай и прочитай.':'Нажми на реплику и послушай.',
   html:`<img class="dlimg${L.length>1?' two':''}" src="img/kadr-${f+1}.webp" alt="Кадр ${f+1}"><div class="dll">${L.map(i=>bubble(i,{hl:true})).join('')}</div>`,
   need:L.length,btn:f<FRAMES.length-1?'Дальше: кадр '+(f+2)+' из 5':'Готово',play:(i,el)=>playPhrase(DLG[+i][1],el),
   onGo:()=>{f++;if(f<FRAMES.length)one();else finish(n,{score:7,of:7},`<p>Ты прочитал всю историю. Новые слова в ней: <span class="zh">吗 是 不</span>. Сейчас разберём каждое.</p>`);}});
  setCnt('кадр '+(f+1)+' / 5');};
 one();}

/* ================= 5–7. Новые слова 吗 是 不: объяснение → пропись → печатаем ================= */
const WD={
 '吗':{n:5,py:'ma',ru:'вопрос «да или нет?»',parts:'口 «рот» + 马 «звучит ma»',
  sub:'Чтобы задать вопрос, на который отвечают «да» или «нет», просто поставь 吗 в конец. Нажми на каждую карточку.',
  rule:'<b class="zh">吗</b> ma в конце = вопрос «да или нет?»',
  ex:[['他叫小明。','tā jiào Xiǎo Míng.','Его зовут Сяо Мин.'],['他叫小明吗？','tā jiào Xiǎo Míng ma?','Его зовут Сяо Мин?']],
  note:'<span class="zh">吗</span> = <span class="zh">口</span> «рот» + <span class="zh">马</span> «звучит ma», как в <span class="zh">妈</span>',
  type:[['他叫小明吗？','tā jiào Xiǎo Míng ma?','Его зовут Сяо Мин?'],['你叫小明吗？','nǐ jiào Xiǎo Míng ma?','Тебя зовут Сяо Мин?']]},
 '是':{n:6,py:'shì',ru:'является · да',parts:'сверху 日, снизу «ноги»',
  sub:'是 связывает: кто = кто. По-русски на этом месте тире, по-английски is. Нажми на каждую карточку.',
  rule:'<b class="zh">是</b> shì — связка, как <b>is</b>: Она <b>—</b> моя мама',img:'malchik-da',
  ex:[['她是我妈妈。','tā shì wǒ māma.','Она — моя мама.'],['是！','shì!','Да! (ответ на вопрос с 吗)']],
  note:'Ответ «да» на вопрос с <span class="zh">吗</span>: <span class="zh">是</span>',
  type:[['她是我妈妈。','tā shì wǒ māma.','Она — моя мама.'],['他是我爸爸。','tā shì wǒ bàba.','Он — мой папа.']]},
 '不':{n:7,py:'bù',ru:'не · нет',parts:'всего 4 черты',
  sub:'不 значит «не». 不是 — «нет, не является». Нажми на каждую карточку.',
  rule:'<b class="zh">不</b> bù = «не». Перед 4-м тоном читаем <b>bú</b>: <span class="zh">不是</span> bú shì (4 + 4 → 2 + 4)',img:'malchik-net',
  ex:[['不是！','bú shì!','Нет! (не является)'],['她不是我妈妈。','tā bú shì wǒ māma.','Она не моя мама.'],['不好','bù hǎo','нехорошо: перед 3-м тоном 不 не меняется']],
  note:'',
  type:[['她不是我妈妈。','tā bú shì wǒ māma.','Она не моя мама.'],['他不是你爸爸。','tā bú shì nǐ bàba.','Он не твой папа.']]}};
S.wp=S.wp||{};
function word(c){const W=WD[c],n=W.n;let st=S.wp[c]||0;const res={};
 const go=s=>{st=s;S.wp[c]=s;keep();[explain,writeIt,typeIt][s]();};
 const explain=()=>{ruleStep(n,{sub:W.sub,
   html:`<div class="wdr">${W.img?`<img class="wdimg" src="img/${W.img}.webp" alt="">`:''}<div class="wdh"><span class="zh">${c}</span><div><div class="py t${toneOf(W.py)}">${W.py}</div><small>${esc(W.ru)}</small></div></div></div>
    <div class="srule">${W.rule}</div>
    <div class="wdx">${W.ex.map((e,i)=>`<button class="key wdk" data-snd="${i}"><span class="zh">${hl(e[0])}</span><span class="py">${pySent(e[1])}</span><small>${esc(e[2])}</small></button>`).join('')}</div>
    ${W.note?`<div class="tk wdn">${W.note}</div>`:''}`,
   need:W.ex.length,btn:'Дальше: пропись',play:(i,el)=>playPhrase(W.ex[+i][0],el),onGo:()=>go(1)});setCnt('шаг 1 / 3');};
 const writeIt=()=>propisOne(n,c,W,mist=>{res.mist=mist;go(2);});
 const typeIt=()=>imeTask(n,W.type,(score,of,ans,miss)=>{S.wp[c]=0;keep();
   finish(n,{score,of,ans,miss,mist:res.mist==null?null:res.mist},`<p><span class="zh" style="font-size:40px">${c}</span> <span class="py">${W.py}</span> ${esc(W.ru)}</p><p>Напечатал без ошибок: ${score} из ${of}.</p>`);});
 go(st);}

/* пропись одного иероглифа: смотри → обведи → сам (как в ДЗ 9) */
const GRID='<svg class="g" viewBox="0 0 100 100" aria-hidden="true"><g stroke="var(--grid)" stroke-width=".5" fill="none"><path d="M50 4V96M4 50H96" stroke-dasharray="2 2"/><path d="M4 4L96 96M96 4L4 96" stroke-dasharray="1.5 2.5"/></g></svg>';
function hwOpts(sz,extra){return Object.assign({width:sz,height:sz,padding:sz*.08,showOutline:false,showCharacter:false,
 outlineColor:'#E7E3DB',strokeColor:'#181838',drawingColor:'#4C3DB8',drawingWidth:Math.round(sz/18),highlightColor:'#8FE0C6',
 strokeAnimationSpeed:1,delayBetweenStrokes:260,charDataLoader:(ch,ok)=>ok(HZDATA[ch])},extra||{});}
function propisOne(n,c,W,onDone){let stage=0,w=null;const STG=['Смотри','Обведи','Сам'];
 const subs=['Посмотри, как пишется, черта за чертой.','Обведи по светлому образцу.','Теперь напиши сам, без образца.'];
 const one=()=>{shell(n,{step:'шаг 2 / 3',sub:subs[stage],
   scene:`<div class="wcap"><span class="zh">${c}</span><div><div class="py t${toneOf(W.py)}">${W.py}</div><div class="ru">${esc(W.ru)} · ${esc(W.parts)}</div></div><button class="snd sm" id="ps" aria-label="Послушать">${IC.snd}</button></div>
    <div class="wbox" id="wb">${GRID}<div class="hw" id="hw"></div></div>`,
   pult:`<div class="fb" id="fb"></div><div class="steps3">${STG.map((s,i)=>`<span class="${i<stage?'ok':i===stage?'on':''}">${i+1}. ${s}</span>`).join('')}</div>
    <button class="main" id="mn"${stage===0?' disabled':''}>${stage===0?IC.play+' Показать порядок черт':'Пиши в клетке'}</button>`});
  $('#ps').onclick=()=>playWord(c,$('#ps'));
  const box=$('#hw'),sz=box.clientWidth||280,mn=$('#mn');
  if(!window.HanziWriter||!HZDATA[c]){fb('Напиши '+c+' пальцем в воздухе','hint');later(()=>onDone(0),1500);return;}
  if(stage===0){w=HanziWriter.create(box,c,hwOpts(sz,{showOutline:true}));
   const anim=()=>{mn.disabled=true;w.animateCharacter({onComplete:()=>{if(!mn.isConnected)return;mn.disabled=false;mn.innerHTML='Дальше: обвести';mn.onclick=()=>{stage=1;one();};fb('Запомнил порядок? Теперь обведи.','ok');}});};
   mn.onclick=anim;later(anim,500);later(()=>playWord(c),200);return;}
  mn.disabled=true;let mist=0;
  w=HanziWriter.create(box,c,hwOpts(sz,{showOutline:stage===1}));
  w.quiz({showHintAfterMisses:stage===1?1:3,highlightOnComplete:true,
   onMistake:()=>{if(!mn.isConnected)return;mist++;fb(stage===1?'Веди по светлой черте':'Попробуй ещё раз, черта подскажет','hint');},
   onCorrectStroke:()=>mn.isConnected&&fb('Так, дальше','ok'),
   onComplete:()=>{if(!mn.isConnected)return;fb('Написано','ok');
    mn.disabled=false;mn.innerHTML=stage===1?'Дальше: написать самому':'Дальше: печатаем';
    mn.onclick=()=>{if(stage===1){stage=2;one();}else onDone(mist);};}});};
 one();}

/* печатаем по-китайски, как на настоящей клавиатуре: латиница без тонов → выбираешь иероглиф */
const IME=[['ni','你','ты'],['nin','您','Вы'],['wo','我','я'],['hao','好','хорошо'],['jiao','叫','звать'],['ma','妈','мама'],['ma','吗','вопрос'],['mama','妈妈','мама'],
 ['ba','爸','папа'],['baba','爸爸','папа'],['ta','他','он'],['ta','她','она'],['men','们','много'],['tamen','他们','они'],['tamen','她们','они (девочки)'],['women','我们','мы'],['nimen','你们','вы'],
 ['shi','是','является'],['bu','不','не'],['bushi','不是','не является'],['xiaoming','小明','Сяо Мин']];
function imeCands(buf){if(!buf)return [];const b=buf.toLowerCase().replace(/[^a-z]/g,'');if(!b)return [];
 return IME.filter(e=>e[0].startsWith(b)).sort((x,y)=>(x[0]===b?0:1)-(y[0]===b?0:1)||x[0].length-y[0].length).slice(0,6);}
function imeTask(n,list,done){let k=0,score=0;const ans=[],miss=[];
 const one=()=>{if(k>=list.length)return done(score,list.length,ans,miss);
  const [zh,py,ru]=list[k],target=bare(zh);let out=[],clean=true,hints=0;
  shell(n,{step:'шаг 3 / 3 · '+(k+1)+' из '+list.length,sub:'Печатай латиницей без тонов (например, <b>wo</b>) и выбери иероглиф. Так печатают китайцы.',
   scene:`<div class="imq"><small>Напечатай по-китайски:</small><b>${esc(ru)}</b><button class="quiet" id="ph">Подсказка: пиньинь</button><div class="py imp" id="pp" hidden>${pySent(py)}</div></div>
    <div class="imo" id="io"></div>
    <div class="imin"><input class="inp" id="ib" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" inputmode="latin" placeholder="печатай тут: ta, shi…" aria-label="Пиньинь"><button class="key imdel" id="del" aria-label="Стереть">⌫</button></div>
    <div class="imc" id="ic"></div>`,
   pult:`<div class="fb" id="fb"></div><button class="main" id="mn" disabled>Проверить</button>`});
  const ib=$('#ib'),io=$('#io'),ic=$('#ic'),mn=$('#mn');
  const draw=()=>{io.innerHTML=out.length?out.map(c=>`<span class="zh">${c}</span>`).join('')+'<i class="imcur"></i>':'<span class="imph">здесь появятся иероглифы</span><i class="imcur"></i>';
   const C=imeCands(ib.value);ic.innerHTML=C.length?C.map((e,i)=>`<button class="imk" data-i="${i}"><i>${i+1}</i><span class="zh">${e[1]}</span><small>${esc(e[2])}</small></button>`).join(''):(ib.value?'<span class="tk">Такого слова мы не проходили. Проверь буквы</span>':'');
   $$('.imk').forEach(b=>{b.onpointerdown=e=>e.preventDefault();b.onclick=()=>pick(C[+b.dataset.i]);});mn.disabled=!out.length;};
  const pick=e=>{if(!e)return;out.push(...e[1]);ib.value='';fb('');draw();if(document.activeElement===ib||matchMedia('(hover:hover)').matches)try{ib.focus({preventScroll:true})}catch(x){}};
  ib.oninput=draw;
  ib.onkeydown=e=>{const C=imeCands(ib.value);
   if(/^[1-6]$/.test(e.key)&&C[+e.key-1]){e.preventDefault();pick(C[+e.key-1]);}
   else if(e.key===' '&&C.length){e.preventDefault();pick(C[0]);}
   else if(e.key==='Enter'){e.preventDefault();e.stopPropagation();if(C.length)pick(C[0]);else if(out.length)check();}
   else if(e.key==='Backspace'&&!ib.value&&out.length){e.preventDefault();out.pop();draw();}};
  $('#del').onpointerdown=e=>e.preventDefault();$('#del').onclick=()=>{if(ib.value)ib.value=ib.value.slice(0,-1);else out.pop();draw();};
  $('#ph').onclick=()=>{$('#pp').hidden=false;$('#ph').remove();hints++;};
  const check=()=>{const got=out.join('');
   if(got===target){if(clean)score++;ans.push([zh,got,clean]);fb(`Верно: <span class="zh">${esc(zh)}</span>`,'ok');ib.disabled=true;$('#del').disabled=true;ic.innerHTML='';
    $('#pp').hidden=false;$('#ph')&&$('#ph').remove();later(()=>playPhrase(zh),150);
    mn.innerHTML=k+1<list.length?'Дальше':'Готово';mn.disabled=false;mn.onclick=()=>{k++;one();};return;}
   if(clean){clean=false;miss.push(zh);}ans.push([zh,got,false]);
   let i=0;while(i<got.length&&got[i]===target[i])i++;
   const a=target[i],b=got[i];
   const pair=(x,y)=>(a===x&&b===y)||(a===y&&b===x);
   fb(pair('他','她')?'Он или она? Смотри на левую часть: <span class="zh">亻</span> человек, <span class="zh">女</span> женщина'
    :pair('妈','吗')?'<span class="zh">妈</span> мама (слева <span class="zh">女</span>), <span class="zh">吗</span> вопрос (слева <span class="zh">口</span>)'
    :pair('你','您')?'<span class="zh">你</span> ты, <span class="zh">您</span> Вы (вежливо)'
    :!b?'Не хватает иероглифа в конце. Проверь по русской фразе'
    :!a?'Лишний иероглиф в конце. Сотри его кнопкой ⌫'
    :`Иероглиф № ${i+1} не тот. Сотри кнопкой ⌫ и попробуй ещё`,'hint');};
  mn.onclick=check;draw();if(matchMedia('(hover:hover) and (pointer:fine)').matches)setTimeout(()=>{try{ib.focus({preventScroll:true})}catch(e){}},80);};
 one();}

/* ================= 8. Вставь пропущенное (пиньинь включается кнопкой) ================= */
// [номер реплики, что пропущено, варианты]
const GAPS=[[0,'你',['你','您','我','他']],[1,'您',['您','你','她','吗']],[3,'叫',['叫','是','好','吗']],[4,'是',['是','不','叫','好']],[4,'吗',['吗','妈','们','好']],[5,'不是',['不是','是','不好','吗']],[6,'她',['她','他','你','我']]];
// где в реплике стоит пропуск (первое вхождение после предыдущего пропуска в той же реплике)
function gapPos(){const P=[];const used={};GAPS.forEach(([li,w],g)=>{const z=DLG[li][1];let from=used[li]||0;
 // в реплике 6 пропущено второе «不是» (во фразе «她不是我妈妈»)
 if(li===5)from=z.indexOf('她');const at=z.indexOf(w,from);P.push(at);used[li]=at+w.length;});return P;}
function gaps(){const n=8,POS=gapPos();let g=0,score=0;const miss=[],ans=[];if(S.py8==null)S.py8=false;
 const line=(li,cur)=>{const [w,z,p,r]=DLG[li];let html='',pos=0;
  GAPS.forEach(([L,word],j)=>{if(L!==li)return;const at=POS[j];html+=esc(z.slice(pos,at));
   html+=j<g?`<span class="gp ok">${word}</span>`:`<span class="gp${j===g?' on':''}">${'＿'.repeat(word.length)}</span>`;pos=at+word.length;});
  html+=esc(z.slice(pos));
  return `<div class="dlb ${w}${GAPS[cur]&&GAPS[cur][0]===li?' cur':''}"><span class="dlw">${WHO[w]}</span><span class="zh dlz">${html}</span>${S.py8?`<span class="py dlp">${pySent(p)}</span>`:''}${GAPS[cur]&&GAPS[cur][0]===li?`<small class="dlr">${esc(r)}</small>`:''}</div>`;};
 const one=()=>{if(g>=GAPS.length)return finish(n,{score,of:GAPS.length,miss,ans,py:S.py8?1:0},`<p>С первого раза: ${score} из ${GAPS.length}.</p><div class="dll">${DLG.map((_,i)=>bubble(i,{py:false,ru:false,hl:true})).join('')}</div>`);
  const [li,word,opts]=GAPS[g];let first=true,solved=false;const O=shuffle(opts);
  shell(n,{step:(g+1)+' / '+GAPS.length,sub:'Какое слово пропущено? Пропуск подсвечен.',
   scene:`<button class="pyt${S.py8?' on':''}" id="pt">Пиньинь: <b>${S.py8?'вкл':'выкл'}</b></button><div class="dll gaps">${DLG.map((_,i)=>line(i,g)).join('')}</div>`,
   pult:`<div class="fb" id="fb"></div><div class="keys k4">${O.map((o,i)=>`<button class="key" data-i="${i}"><span class="zh" style="font-size:${o.length>1?26:34}px">${o}</span></button>`).join('')}</div>
    <button class="main" id="mn" disabled>Дальше</button>`});
  $('#pt').onclick=()=>{S.py8=!S.py8;keep();one();};
  later(()=>{const c=$('.gp.on');c&&c.scrollIntoView({block:'center'});},50);
  $$('.keys .key').forEach(b=>b.onclick=()=>{if(solved)return;const o=O[+b.dataset.i];
   if(o===word){solved=true;b.classList.add('ok');$$('.keys .key').forEach(q=>q.disabled=true);if(first)score++;ans.push([DLG[li][1],o,first]);
    const c=$('.gp.on');c.className='gp ok';c.textContent=word;fb(`Да: <span class="zh">${esc(DLG[li][1])}</span>`,'ok');later(()=>playPhrase(DLG[li][1]),150);
    const mn=$('#mn');mn.disabled=false;mn.innerHTML=g+1<GAPS.length?'Дальше':'Готово';mn.onclick=()=>{g++;one();};}
   else{b.classList.remove('hint');void b.offsetWidth;b.classList.add('hint');if(first){first=false;miss.push(DLG[li][1]);}
    fb(word==='吗'?'Это вопрос «да или нет?». Что ставим в конец?':word==='是'?'Нужна связка «является»':word==='不是'?'Мальчик отвечает «нет»':word==='您'?'Мальчик говорит со взрослым вежливо':word==='她'?'Мальчик показывает на маму: «она»':word==='叫'?'«Меня зовут…»':'Полицейский говорит мальчику «ты»','hint');}});};
 one();}

/* ================= 9. Расставь реплики (без пиньиня) ================= */
function order(){const n=9;let k=0,errs=0,here=0;const miss=[],ans=[];const bank=shuffle(DLG.map((_,i)=>i));
 const draw=()=>{shell(n,{step:k+' / '+DLG.length,sub:'Нажимай реплики по порядку: что сказали сначала, что потом.',
   scene:`<div class="dll ord">${DLG.slice(0,k).map((d,i)=>`<button class="dlb ${d[0]} sm" data-snd="${i}"><span class="zh dlz">${esc(d[1])}</span></button>`).join('')}${k<DLG.length?`<div class="dlb slotx">${k+1}. ?</div>`:''}</div>
    <div class="obank">${bank.filter(i=>i>=k).map(i=>`<button class="ocard" data-i="${i}"><span class="zh">${esc(DLG[i][1])}</span></button>`).join('')}</div>`,
   pult:`<div class="fb" id="fb"></div><button class="main" id="mn" disabled>${k<DLG.length?'Выбери реплику №'+(k+1):'Готово'}</button>`});
  $$('.ord [data-snd]').forEach(b=>b.onclick=()=>playPhrase(DLG[+b.dataset.snd][1],b));
  const sl=$('.slotx');sl&&sl.scrollIntoView({block:'nearest'});
  $$('.ocard').forEach(b=>b.onclick=()=>{const i=+b.dataset.i;
   if(i===k){ans.push([DLG[k][1],here?'ошибок '+here:'—',!here]);if(here)miss.push(DLG[k][1]);here=0;k++;playPhrase(DLG[i][1]);
    if(k>=DLG.length){draw();fb('Диалог собран!','ok');const mn=$('#mn');mn.disabled=false;
     mn.onclick=()=>finish(n,{score:ans.filter(a=>a[2]).length,of:DLG.length,errs,miss,ans},`<p>Реплик с первого раза: ${ans.filter(a=>a[2]).length} из ${DLG.length}.</p>`);}
    else{draw();fb('Да! Какая следующая?','ok');}}
   else{errs++;here++;b.classList.remove('hint');void b.offsetWidth;b.classList.add('hint');
    fb(k===0?'Кто начинает разговор? Полицейский здоровается с мальчиком':here>=2?'Подсказка: нужная реплика подсвечена':'Не эта. Что сказали дальше?','hint');
    if(here>=2){const r=$(`.ocard[data-i="${k}"]`);r&&r.classList.add('help');}}});};
 draw();}

/* ================= 10. Мемори: все наши иероглифы, и новые тоже ================= */
const MEM=[['你','ты'],['我','я'],['好','хорошо'],['叫','звать'],['妈','мама'],['爸','папа'],['他','он'],['她','она'],['们','много людей'],['您','Вы (вежливо)'],['是','является'],['不','не'],['吗','вопрос да/нет']];
function memo(){const n=10,NP=MEM.length;
 const cards=shuffle(MEM.flatMap(([a,ru],i)=>[{i,k:'zh',t:a},{i,k:'ru',t:ru}]));
 shell(n,{step:'0 / '+NP,
  scene:`<div class="mem m13" id="mg">${cards.map((c,j)=>`<button class="mc" data-j="${j}" aria-label="Карточка ${j+1}"><span class="ba">汉</span><span class="fa ${c.k}">${esc(c.t)}</span></button>`).join('')}</div>`,
  pult:`<div class="fb" id="fb">Открывай по две карточки</div>`});
 let open=[],moves=0,pairs=0,errs=0,lock=false;const conf=[];
 $$('.mc').forEach(b=>b.onclick=()=>{if(lock)return;const c=cards[+b.dataset.j];if(b.classList.contains('up'))return;
  b.classList.add('up');if(c.k==='zh')playWord(c.t);open.push([b,c]);if(open.length<2)return;moves++;
  const [[b1,c1],[b2,c2]]=open;open=[];
  if(c1.i===c2.i){pairs++;setCnt(pairs+' / '+NP);later(()=>{b1.classList.add('ok');b2.classList.add('ok');},250);
   fb(`Пара: <span class="zh">${MEM[c1.i][0]}</span> ${esc(MEM[c1.i][1])}`,'ok');
   if(pairs===NP)later(()=>finish(n,{score:NP,of:NP,moves,errs,miss:conf.slice(0,8)},`<p>Все ${NP} пар найдены за ${moves} ходов.</p>`),1300);}
  else{errs++;lock=true;conf.push(c1.t+'/'+c2.t);b1.classList.add('no');b2.classList.add('no');fb('Не пара, запоминай, где что лежит','hint');
   later(()=>{b1.classList.remove('up','no');b2.classList.remove('up','no');lock=false;},1000);}});}
function stopGame(){}

/* ================= список, старт, итоги ================= */
function start(){clearTimers();
 $('#app').innerHTML=`<div class="scr start fade"><div class="hero">
  <div class="big">是不吗</div>
  <h1>Домашнее задание 10</h1><p>Диктант, иероглифы в темноте, an и en, наш диалог и новые слова <span class="zh">吗 是 不</span>, пропись, печатаем по-китайски и мемори. Десять заданий, можно делать в несколько заходов.</p>
  <label class="lab" for="nm">Как тебя зовут?</label>
  <input class="inp" id="nm" autocomplete="given-name" placeholder="Имя" value="${esc(S.name||'')}">
  </div><button class="main" id="go">Начать</button></div>`;
 const go=()=>{const v=$('#nm').value.trim();if(!v){$('#nm').focus();toast('Напиши своё имя');return;}
  if(v!==S.name){S.name=v;S.sid=S.sid||('s'+Date.now().toString(36)+Math.random().toString(36).slice(2,7));}keep();flush();list();};
 $('#go').onclick=go;$('#nm').onkeydown=e=>{if(e.key==='Enter')go();};}
function list(){clearTimers();stopGame();try{curA&&curA.pause()}catch(e){}if(!S.name)return start();S.cur=0;keep();
 const d=Object.keys(S.done).filter(k=>S.done[k]).length,pc=Math.round(d*100/NT);
 const first=[...Array(NT).keys()].map(i=>i+1).find(i=>!S.done[i]);
 $('#app').innerHTML=`<div class="scr list fade">
  <div class="top"><span class="lab">Домашнее задание 10</span><h1>Детективная история</h1>
   <div class="who"><span>Ученик: <b>${esc(S.name)}</b></span><button class="quiet" id="ch">Сменить имя</button></div>${isTest()?'<span class="teacher">Режим учителя: всё открыто, ничего не сохраняется</span>':''}</div>
  <div class="prog"><div class="row"><span>Выполнено</span><b>${d} из ${NT}</b></div><div class="pbar"><i style="width:${pc}%"></i></div></div>
  <div class="tiles">${TASKS.slice(1).map((T,i)=>{const n=i+1,dn=!!S.done[n],now=!dn&&n===first;
   return `<button class="tile${dn?' done':now?' now':''}" data-n="${n}"><span class="num">${n}</span><b>${esc(T.t)}</b>${dn?'<span class="st">'+IC.ok+'готово</span>':now?'<span class="st">сейчас</span>':''}</button>`;}).join('')}</div>
  <div class="foot"><button class="main" id="go">${first?'Задание '+first+': '+esc(TASKS[first].t):'Мои итоги'}</button>${first?'<button class="quiet" id="rs">Мои итоги</button>':''}</div></div>`;
 $$('.tile').forEach(b=>b.onclick=()=>TASKS[+b.dataset.n].run());
 $('#go').onclick=()=>first?TASKS[first].run():results();if($('#rs'))$('#rs').onclick=results;
 $('#ch').onclick=()=>{S.name='';keep();start();};}
function results(){clearTimers();const D=[],X=[];for(let i=1;i<=NT;i++)(S.done[i]?D:X).push(i);send('itogi',{done:D.length,of:NT,left:X});
 const line=(i,y)=>{const r=S.done[i];return `<div class="ri ${y?'y':'x'}"><span class="num">${i}</span><span>${esc(TASKS[i].t)}${y&&r?`<small>${i===4?'прочитано':i===10?'все пары найдены':'верно: '+r.score+' из '+r.of}</small>`:''}</span>${y?'':`<button class="go" data-n="${i}">Сделать</button>`}</div>`;};
 $('#app').innerHTML=`<div class="scr res fade">
  <div class="top"><span class="lab">Мои итоги</span><h1>${esc(S.name||'')}, сделано ${D.length} из ${NT}</h1></div>
  ${D.length?`<h2>Сделано</h2><div class="rl">${D.map(i=>line(i,1)).join('')}</div>`:''}
  ${X.length?`<h2>Осталось сделать</h2><div class="rl">${X.map(i=>line(i,0)).join('')}</div>`:`<p class="sub" style="margin-top:16px">Все задания сделаны. Учитель увидит результаты.</p>`}
  <div class="foot"><button class="main" id="go">К списку заданий</button></div></div>`;
 $$('.go').forEach(b=>b.onclick=()=>TASKS[+b.dataset.n].run());$('#go').onclick=list;}

/* клавиатура на компьютере: цифры выбирают ответ, Enter — главная кнопка */
addEventListener('keydown',e=>{if(e.target.tagName==='INPUT')return;
 if(/^[1-9]$/.test(e.key)){const k=$$('.keys .key, #kk [data-v]')[+e.key-1];if(k&&!k.disabled){k.click();e.preventDefault();}}
 else if(e.key==='Enter'){const m=$('#mn')||$('#nx')||$('#go');if(m&&!m.disabled){m.click();e.preventDefault();}}});

/*__BOOT__*/
try{const q=new URLSearchParams(location.search).get('name');if(q){if(q!==S.name){S.name=q;S.sid='s'+Date.now().toString(36)+Math.random().toString(36).slice(2,7);}keep();}}catch(e){}
flush();
const h=location.hash.match(/^#t(\d+)$/);
if(S.name&&h&&TASKS[+h[1]])TASKS[+h[1]].run();else list();
