/* ---------- данные ---------- */
const TASKS=[null,
 {t:'Пиньинь на слух',s:'Послушай голос учителя и напечатай слог',run:()=>hear()},
 {t:'Введи пиньинь',s:'Иероглиф → пиньинь и тон',run:()=>typePy()},
 {t:'Собери иероглиф из ключей',s:'Ключ — смысл, вторая часть — чтение',run:()=>build()},
 {t:'Первая черта',s:'С какой черты начинают иероглиф?',run:()=>first()},
 {t:'Пишем по памяти',s:'Обведи → напиши сам → вспомни по слову',run:()=>ladder()},
 {t:'Найди ошибку',s:'Читай по одному знаку и сравни с русским',run:()=>findErr()},
 {t:'Наш диалог: запиши себя',s:'Послушай реплику и прочитай её сам',run:()=>recDlg()},
 {t:'Наш диалог иероглифами',s:'Допиши реплики пальцем',run:()=>writeDlg()},
 {t:'Поймай иероглиф',s:'Игра: карточки едут, лови нужную',run:()=>catchGame()}];
const NT=TASKS.length-1;
const TMARK={1:'ˉ',2:'ˊ',3:'ˇ',4:'ˋ'};
const TONES={'ā':1,'á':2,'ǎ':3,'à':4,'ē':1,'é':2,'ě':3,'è':4,'ō':1,'ó':2,'ǒ':3,'ò':4,'ī':1,'í':2,'ǐ':3,'ì':4,'ū':1,'ú':2,'ǔ':3,'ù':4,'ǖ':1,'ǘ':2,'ǚ':3,'ǜ':4};
const toneOf=py=>{for(const ch of py)if(TONES[ch])return TONES[ch];return 0;};
const plain=py=>py.normalize('NFD').replace(/[̀-ͯ]/g,'');
const pyHTML=py=>`<span class="py t${toneOf(py)}">${esc(py)}</span>`;
const pySent=p=>p.split(' ').map(w=>`<span class="t${toneOf(w)}">${esc(w)}</span>`).join(' ');
const bare=t=>String(t).replace(/[，。！？、,.!?\s]/g,'');
const playPhrase=(t,el)=>playWord(bare(t),el);
const MK={a:['ā','á','ǎ','à'],o:['ō','ó','ǒ','ò'],e:['ē','é','ě','è'],i:['ī','í','ǐ','ì'],u:['ū','ú','ǔ','ù'],'ü':['ǖ','ǘ','ǚ','ǜ']};
function toned(base,t){if(!t)return base;const v=/a|e/.exec(base)||/ou/.exec(base)||/[iouü](?!.*[aeiouü])/.exec(base);if(!v)return base;const i=v.index,ch=base[i];return base.slice(0,i)+MK[ch][t-1]+base.slice(i+1);}
// наши иероглифы (уроки 1–11)
const HZ=[['你','ni',3,'ты'],['我','wo',3,'я'],['好','hao',3,'хорошо'],['叫','jiao',4,'звать'],['妈','ma',1,'мама'],['爸','ba',4,'папа'],['他','ta',1,'он'],['她','ta',1,'она'],['们','men',0,'много (людей)'],['吗','ma',0,'вопросительная частица'],['是','shi',4,'являться · да'],['不','bu',4,'не']];
const HZM=Object.fromEntries(HZ.map(h=>[h[0],h]));
const shake=el=>{if(!el)return;el.classList.remove('hint');void el.offsetWidth;el.classList.add('hint');};

/* ---------- клавиатура пиньиня: свои клавиши (экранную клавиатуру телефона не вызываем) ---------- */
const TPATH={1:'M6 8H34',2:'M6 22L34 6',3:'M6 6Q20 34 34 8',4:'M6 6L34 22',0:''};
const TSVG=t=>`<svg class="tsv t${t}" viewBox="0 0 40 28" aria-hidden="true">${t?`<path d="${TPATH[t]}"/>`:'<circle cx="20" cy="14" r="5"/>'}</svg>`;
const KBR=['qwertyuiop','asdfghjkl','zxcvbnmü'];
function pyPad(box,{neutral=false,onEnter}={}){let txt='',tone=-1,locked=false;
 box.innerHTML=`<div class="pyd" id="pyd"><span class="pyv" id="pyv"></span><i class="imcur"></i><span class="pym" id="pym"></span></div>
  <div class="pkb">${KBR.map(r=>`<div>${[...r].map(ch=>`<button class="pk" data-k="${ch}">${ch}</button>`).join('')}${r==='zxcvbnmü'?'<button class="pk bs" data-k="⌫" aria-label="Стереть">⌫</button>':''}</div>`).join('')}</div>
  <div class="ptl">Тон:</div><div class="keys k${neutral?5:4} ptk">${[1,2,3,4].concat(neutral?[0]:[]).map(t=>`<button class="key pt" data-t="${t}" aria-label="${t?t+'-й тон':'лёгкий тон'}">${TSVG(t)}<small>${t?t+' тон':'лёгкий'}</small></button>`).join('')}</div>`;
 const draw=()=>{const v=box.querySelector('#pyv');if(!v)return;v.textContent=txt;box.querySelector('#pym').innerHTML=tone>=0?`<span class="t${tone}">${tone?tone+' тон':'лёгкий тон'}</span>`:'';
  box.querySelectorAll('.pt').forEach(b=>b.classList.toggle('on',+b.dataset.t===tone));api.onChange&&api.onChange();};
 const key=ch=>{if(locked)return;if(ch==='⌫')txt=txt.slice(0,-1);else if(txt.length<7)txt+=ch;draw();};
 box.querySelectorAll('.pk').forEach(b=>{b.onpointerdown=e=>e.preventDefault();b.onclick=()=>key(b.dataset.k);});
 box.querySelectorAll('.pt').forEach(b=>b.onclick=()=>{if(locked)return;tone=+b.dataset.t;draw();});
 const kd=e=>{if(!box.isConnected){removeEventListener('keydown',kd,true);return;}if(locked||e.ctrlKey||e.metaKey||e.altKey)return;
  const k=e.key.toLowerCase();if(/^[a-z]$/.test(k)){e.preventDefault();e.stopPropagation();key(k==='v'?'ü':k);}
  else if(k==='backspace'){e.preventDefault();key('⌫');}
  else if(/^[0-4]$/.test(k)&&(k!=='0'||neutral)){e.preventDefault();e.stopPropagation();tone=+k;draw();}};
 addEventListener('keydown',kd,true);
 const api={get:()=>({txt,tone}),ready:()=>txt.length>0&&tone>=0,lock:()=>{locked=true;box.querySelectorAll('button').forEach(b=>b.disabled=true);},
  clear:()=>{txt='';tone=-1;draw();},onChange:null,show:(py)=>{const v=box.querySelector('#pyv');if(v){v.innerHTML=pyHTML(py);box.querySelector('#pym').innerHTML='';}}};
 draw();return api;}
// разбор слога: инициаль + финаль
const INI_ALL=['zh','ch','sh','b','p','m','f','d','t','n','l','g','k','h','z','c','s','j','q','x','r','y','w'];
const splitS=s=>{const i=INI_ALL.find(x=>s.startsWith(x))||'';return {ini:i,fin:s.slice(i.length)};};
const PAIRS_ASP=[['b','p'],['d','t'],['g','k'],['z','c'],['zh','ch']];
const isPair=(a,b,L)=>L.some(([x,y])=>(a===x&&b===y)||(a===y&&b===x));
function pyWhy(want,got){// want/got: {txt,tone} → подсказка по делу
 const W=splitS(want.txt),G=splitS(got.txt);const out=[];
 if(/[а-яё]/i.test(got.txt))out.push('Печатай латинскими буквами');
 else if(W.ini!==G.ini){
  if(isPair(W.ini,G.ini,PAIRS_ASP))out.push('Начало слога: слышишь выдох «х»? Предыхательный или нет?');
  else if(isPair(W.ini,G.ini,[['z','zh'],['c','ch'],['s','sh']]))out.push('Начало слога: z c s или zh ch sh? Это разные строчки');
  else if(isPair(W.ini,G.ini,[['n','l']]))out.push('Начало слога: n или l? Послушай ещё раз');
  else out.push('Начало слога (инициаль) не та');}
 if(W.fin!==G.fin&&!out.length)out.push('Конец слога (финаль) не тот');
 if(want.tone!==got.tone)out.push(want.tone===0?'Тут лёгкий тон: коротко и без значка':'Тон: ровно (1), вверх (2), ямкой (3) или вниз (4)?');
 return out.join('. ');}

/* ================= 1. Пиньинь на слух (ТОЛЬКО записи учителя) ================= */
const INI1=['b','p','m','f','d','t','n','l','g','k','h'],INI2=['z','c','s','zh','ch','sh'],INI=[...INI1,...INI2];
const FIN_ORDER=['a','o','u','i','e'];
const VOICE_DEF='ca1 ca2 ca3 ca4 chi1 ci1 ci2 ci3 ci4 cu1 cu2 cu3 cu4 ga1 ga2 ga3 ga4 ge1 ge2 ge3 ge4 gu1 gu2 gu3 gu4 ha1 ha2 ha3 ha4 he1 he2 he3 he4 hu1 hu2 hu3 hu4 ka1 ka2 ka3 ka4 ke1 ke2 ke3 ke4 ku1 ku2 ku3 ku4 la1 la2 la3 la4 le4 li1 li2 li3 li4 lu1 lu2 lu3 lu4 na1 na2 na3 na4 ne4 ni1 ni2 ni3 ni4 nu1 nu2 nu3 nu4 sa1 sa2 sa3 sa4 shi1 si1 si2 si3 si4 su1 su2 su3 su4 za1 za2 za3 za4 zhi1 zi1 zi2 zi3 zi4 zu1 zu2 zu3 zu4'.split(' ');
function parseV(id){const m=/^([a-z]+)([1-4])$/.exec(id);if(!m)return null;const base=m[1],t=+m[2];
 const ini=['zh','ch','sh',...INI].find(x=>base.startsWith(x));if(!ini)return null;const fin=base.slice(ini.length);
 if(!FIN_ORDER.includes(fin))return null;return {id,base,ini,fin,t,py:toned(base,t)};}
// трудные пары по ДЗ 10: z c s / zh ch sh, g k h, n l
const HARD=[['z','c','s'],['zh','ch','sh'],['g','k','h'],['n','l']];
let VPOOL=null;
async function voicePool(){if(VPOOL)return VPOOL;let ids=VOICE_DEF;
 try{const r=await fetch(VOICE+'index.json',{cache:'no-store'});if(r.ok){const j=await r.json();const k=Object.keys(j);if(k.length)ids=k;}}catch(e){}
 VPOOL=ids.map(parseV).filter(s=>s&&HARD.flat().includes(s.ini));return VPOOL;}
function pickHear(pool){const want=[['z','c','s'],['z','c','s'],['z','c','s'],['zh','ch','sh'],['g','k','h'],['g','k','h'],['g','k','h'],['n','l'],['n','l'],['zh','ch','sh']];
 const out=[],tc={};
 for(const grp of want){const c=shuffle(pool.filter(s=>grp.includes(s.ini)&&!out.includes(s)&&!out.some(o=>o.base===s.base)));
  const s=c.find(x=>(tc[x.t]||0)<3&&!out.some(o=>o.ini===x.ini&&out.filter(q=>q.ini===x.ini).length>=2))||c[0];if(s){out.push(s);tc[s.t]=(tc[s.t]||0)+1;}}
 return shuffle(out);}
async function hear(){const n=1;shell(n,{step:'',scene:'<div class="tk">Загружаю голос учителя…</div>'});
 const pool=await voicePool();if(S.cur!==n)return;
 const items=pickHear(pool);let k=0,score=0;const miss=[],ans=[];
 const one=()=>{if(k>=items.length)return finish(n,{score,of:items.length,miss,ans},
   `<p>С первого раза: ${score} из ${items.length}.</p>${miss.length?`<p>Можно повторить для закрепления:</p><div class="chips">${miss.map(m=>`<span class="x">${pyHTML(m)}</span>`).join('')}</div>`:''}`);
  const it=items[k];let tries=0;const typed=[];
  shell(n,{step:(k+1)+' / '+items.length,sub:'Послушай голос учителя. Напечатай слог буквами и выбери тон.',
   scene:`<button class="snd" id="ps" aria-label="Послушать">${IC.snd}</button><div id="pp" class="pp"></div>`,
   pult:`<div class="fb" id="fb"></div><button class="main" id="mn" disabled>Проверить</button>`});
  const play=()=>playVoice(it.id,$('#ps'));$('#ps').onclick=play;later(play,350);
  const P=pyPad($('#pp'),{onEnter:()=>$('#mn').click()});const mn=$('#mn');P.onChange=()=>{if(!mn.dataset.nx)mn.disabled=!P.ready();};P.onChange();
  const next=()=>{mn.dataset.nx=1;mn.disabled=false;mn.innerHTML=k+1<items.length?'Дальше':'Готово';mn.onclick=()=>{k++;one();};};
  mn.onclick=()=>{const g=P.get();g.txt=g.txt.replace(/v/g,'ü');typed.push(toned(g.txt,g.tone)||g.txt);
   if(g.txt===it.base&&g.tone===it.t){if(!tries)score++;ans.push([it.py,typed.join(' · '),!tries]);P.lock();P.show(it.py);
    fb((tries?'Верно: ':'Верно с первого раза: ')+pyHTML(it.py)+(it.fin==='i'&&INI2.includes(it.ini)?' · после '+it.ini+' буква i читается «ы»':''),'ok');later(()=>playVoice(it.id),150);next();return;}
   tries++;if(tries===1)miss.push(it.py);
   if(tries>=2){ans.push([it.py,typed.join(' · '),false]);P.lock();P.show(it.py);fb('Правильно: '+pyHTML(it.py)+'. '+pyWhy({txt:it.base,tone:it.t},g),'hint');later(()=>playVoice(it.id),150);next();}
   else{fb(pyWhy({txt:it.base,tone:it.t},g)+'. Послушай и исправь','hint');shake($('#pyd'));}};};
 one();}

/* ================= 2. Введи пиньинь: иероглиф → пиньинь (синтезатор звучит только после ответа) ================= */
const PHR=[{z:'不是',ru:'нет, не является',s:[['bu',2],['shi',4]],note:'不 перед 4-м тоном читаем bú (2-й тон)'},
 {z:'你们好',ru:'привет всем',s:[['ni',3],['men',0],['hao',3]],note:'们 — лёгкий тон'},
 {z:'她是我妈妈',ru:'она моя мама',s:[['ta',1],['shi',4],['wo',3],['ma',1],['ma',0]],note:'второй слог в 妈妈 — лёгкий тон'}];
function typePy(){const n=2;const items=[...shuffle(HZ).map(h=>({z:h[0],ru:h[3],s:[[h[1],h[2]]],one:1})),...PHR];
 let k=0,score=0;const miss=[],ans=[];
 const one=()=>{if(k>=items.length)return finish(n,{score,of:items.length,miss,ans},
   `<p>С первого раза: ${score} из ${items.length}.</p>${miss.length?`<p>Можно повторить для закрепления:</p><div class="chips">${miss.map(m=>`<span class="x zh">${esc(m)}</span>`).join('')}</div>`:''}`);
  const it=items[k],ch=[...it.z];let j=0,clean=true;const typed=[];
  const draw=()=>{const [b,t]=it.s[j];
   shell(n,{step:(k+1)+' / '+items.length,sub:it.one?'Напечатай пиньинь этого иероглифа и выбери тон.':'Теперь целое слово: печатай по одному слогу.',
    scene:`<div class="tpq"><div class="tpz">${ch.map((c,i)=>`<span class="zh${it.one?'':i===j?' on':i<j?' ok':''}">${c}</span>`).join('')}</div>
     <div class="tpp">${it.s.map((s,i)=>i<j?pyHTML(toned(s[0],s[1])):'').filter(Boolean).join(' ')}</div><small>${esc(it.ru)}</small></div><div id="pp" class="pp"></div>`,
    pult:`<div class="fb" id="fb"></div><button class="main" id="mn" disabled>Проверить</button>`});
   const P=pyPad($('#pp'),{neutral:true}),mn=$('#mn');P.onChange=()=>{if(!mn.dataset.nx)mn.disabled=!P.ready();};P.onChange();let tries=0;
   mn.onclick=()=>{const g=P.get();g.txt=g.txt.replace(/v/g,'ü');typed.push(toned(g.txt,g.tone));
    if(g.txt===b&&g.tone===t){P.lock();P.show(toned(b,t));j++;
     if(j<it.s.length){fb('Верно: '+pyHTML(toned(b,t)),'ok');mn.dataset.nx=1;mn.disabled=false;mn.innerHTML='Следующий слог';mn.onclick=draw;return;}
     if(clean)score++;ans.push([it.z,typed.join(' '),clean]);later(()=>playPhrase(it.z),150);
     fb(`<span class="zh">${esc(it.z)}</span> ${pySent(it.s.map(s=>toned(s[0],s[1])).join(' '))}${it.note?' · '+it.note:''}`,'ok');
     mn.dataset.nx=1;mn.disabled=false;mn.innerHTML=k+1<items.length?'Дальше':'Готово';mn.onclick=()=>{k++;one();};return;}
    tries++;if(clean){clean=false;miss.push(it.z);}
    const why=(b==='bu'&&t===2&&g.txt==='bu'&&g.tone===4)?'Перед 4-м тоном 不 читаем bú, 2-й тон':pyWhy({txt:b,tone:t},g);
    if(tries>=2){P.lock();P.show(toned(b,t));fb('Правильно: '+pyHTML(toned(b,t))+'. '+why,'hint');j++;mn.dataset.nx=1;mn.disabled=false;
     if(j<it.s.length){mn.innerHTML='Следующий слог';mn.onclick=draw;}else{ans.push([it.z,typed.join(' '),false]);later(()=>playPhrase(it.z),150);mn.innerHTML=k+1<items.length?'Дальше':'Готово';mn.onclick=()=>{k++;one();};}}
    else{fb(why+'. Исправь','hint');shake($('#pyd'));}};};
  draw();};
 one();}

/* ================= 3. Собери иероглиф из ключей ================= */
const RAD={'女':'женщина','口':'рот','亻':'человек','父':'отец'};
const PARTS=['马','也','门','尔','子','丩','巴'];
const BLD=[['妈','女','马'],['吗','口','马'],['他','亻','也'],['她','女','也'],['们','亻','门'],['你','亻','尔'],['好','女','子'],['叫','口','丩'],['爸','父','巴','tb']];
const PART_HINT={'马':'звучит ma','门':'звучит men','巴':'звучит ba','丩':'jiu → jiào','也':'','尔':'','子':''};
function build(){const n=3;const items=shuffle(BLD);let k=0,score=0;const miss=[],ans=[];
 const one=()=>{if(k>=items.length)return finish(n,{score,of:items.length,miss,ans},sumMiss(score,items.length,miss.map(m=>`<span class="zh">${m}</span>`)));
  const [c,rad,part,tb]=items[k],h=HZM[c];let st=0,clean=true;
  const opts2=shuffle([part,...shuffle(PARTS.filter(p=>p!==part)).slice(0,3)]);
  const draw=()=>{shell(n,{step:(k+1)+' / '+items.length,sub:'Ключ подсказывает <b>смысл</b>, вторая часть — <b>чтение</b>. Собери иероглиф.',
    scene:`<div class="bq"><small>Собери иероглиф</small><b>«${esc(h[3])}»</b>${st?`<span class="py t${h[2]}">${toned(h[1],h[2])}</span>`:''}</div>
     <div class="bslots ${tb?'tb':''}"><span class="bs1 ${st?'ok':'on'}">${st?`<span class="zh">${rad}</span>`:'ключ'}</span><span class="bplus">+</span><span class="bs2 ${st===2?'ok':st?'on':''}">${st===2?`<span class="zh">${part}</span>`:tb?'низ':'справа'}</span><span class="beq">=</span><span class="bres">${st===2?`<span class="zh">${c}</span>`:'?'}</span></div>`,
    pult:`<div class="fb" id="fb"></div><div class="tk bph">${st===0?'Шаг 1: какой ключ? Он подсказывает смысл':st===1?'Шаг 2: какая вторая часть?':''}</div>
     <div class="keys k4">${(st===0?Object.keys(RAD):opts2).map(x=>`<button class="key bk" data-v="${x}"><span class="zh" style="font-size:40px">${x}</span>${st===0?`<small>${RAD[x]}</small>`:(PART_HINT[x]&&st>=1?`<small>${PART_HINT[x]}</small>`:'')}</button>`).join('')}</div>
     <button class="main" id="mn" disabled>Дальше</button>`});
   $$('.bk').forEach(b=>b.onclick=()=>{const v=b.dataset.v;
    if(st===0){if(v===rad){st=1;draw();fb(`Да: ключ <span class="zh">${rad}</span> «${RAD[rad]}»`,'ok');}
     else{if(clean){clean=false;miss.push(c);}shake(b);fb(`<span class="zh">${v}</span> — «${RAD[v]}». ${c==='他'?'«Он» — это человек: ключ <span class="zh">亻</span>':c==='她'?'«Она» — женщина: ключ <span class="zh">女</span>':'Подумай: что значит слово «'+esc(h[3])+'»?'}`,'hint');}}
    else if(st===1){if(v===part){st=2;if(clean)score++;ans.push([c,clean]);draw();$$('.bk').forEach(q=>q.disabled=true);
      fb(`Собрал: <span class="zh">${c}</span> ${pyHTML(toned(h[1],h[2]))} «${esc(h[3])}»`,'ok');later(()=>playWord(c),150);
      const mn=$('#mn');mn.disabled=false;mn.innerHTML=k+1<items.length?'Дальше':'Готово';mn.onclick=()=>{k++;one();};}
     else{if(clean){clean=false;miss.push(c);}shake(b);fb(PART_HINT[part]&&/звучит/.test(PART_HINT[part])?`Слово читается ${pyHTML(toned(h[1],h[2]))}. Какая часть звучит похоже?`:'Не та часть. Вспомни, как выглядит '+esc(h[3]==='он'||h[3]==='она'?'«'+h[3]+'»':'этот иероглиф'),'hint');}}});};
  draw();};
 one();}

/* ================= 4. Первая черта ================= */
// черты из данных Hanzi Writer: рисуем иероглиф, три черты пронумерованы, одна из них — первая
function firstSvg(c,cand){const d=HZDATA[c];if(!d)return '';
 const pt=i=>{const m=d.medians[i][0];return [m[0],900-m[1]];};
 return `<svg class="fs" viewBox="-20 -60 1064 1064" aria-label="${c}"><g transform="scale(1,-1) translate(0,-900)">${d.strokes.map((p,i)=>`<path d="${p}" class="${cand.includes(i)?'fc fc'+cand.indexOf(i):'fo'}" data-s="${i}"/>`).join('')}</g>
  ${cand.map((s,i)=>{const [x,y]=pt(s);return `<g class="fb${i}" data-s="${s}"><circle cx="${x}" cy="${y}" r="74"/><text x="${x}" y="${y+30}" text-anchor="middle">${i+1}</text></g>`;}).join('')}</svg>`;}
function pickCand(c){const d=HZDATA[c],N=d.strokes.length;const s0=d.medians[0][0];const far=i=>{const m=d.medians[i][0];return Math.hypot(m[0]-s0[0],m[1]-s0[1])>170;};
 let rest=shuffle([...Array(N).keys()].slice(1)).filter(far);
 const out=[0];for(const i of rest){if(out.length>=3)break;const m=d.medians[i][0];if(out.every(o=>{const q=d.medians[o][0];return Math.hypot(m[0]-q[0],m[1]-q[1])>170;}))out.push(i);}
 for(const i of shuffle([...Array(N).keys()].slice(1)))if(out.length<3&&!out.includes(i))out.push(i);
 return shuffle(out);}
function first(){const n=4;const items=shuffle(HZ.map(h=>h[0]));let k=0,score=0;const miss=[],ans=[];
 const rule=()=>{shell(n,{step:'правило',sub:'Как найти первую черту',
   scene:`<div class="srule">Пишем <b>сверху вниз</b> и <b>слева направо</b>. Есть ключ слева — <b>начинаем с ключа</b>.</div>
    <div class="fsx">${['你','好','是'].map(c=>`<div class="fsxi"><svg class="fs" viewBox="-20 -60 1064 1064"><g transform="scale(1,-1) translate(0,-900)">${HZDATA[c].strokes.map((p,i)=>`<path d="${p}" class="${i===0?'fc fc0':'fo'}"/>`).join('')}</g></svg><small>${c==='是'?'сверху':'ключ слева'}</small></div>`).join('')}</div>`,
   pult:`<div class="fb" id="fb">Первая черта подсвечена</div><button class="main" id="mn">Понятно, начнём</button>`});$('#mn').onclick=one;};
 const one=()=>{if(k>=items.length)return finish(n,{score,of:items.length,miss,ans},sumMiss(score,items.length,miss.map(m=>`<span class="zh">${m}</span>`)));
  const c=items[k],cand=pickCand(c),h=HZM[c];let clean=true,solved=false;
  shell(n,{step:(k+1)+' / '+items.length,sub:'Какую черту пишут <b>первой</b>? Нажми на номер.',
   scene:`<div class="fsbox" id="fx">${firstSvg(c,cand)}</div><div class="tk">${pyHTML(toned(h[1],h[2]))} · ${esc(h[3])}</div>`,
   pult:`<div class="fb" id="fb"></div><div class="keys k3">${cand.map((s,i)=>`<button class="key fk fk${i}" data-s="${s}"><b>${i+1}</b></button>`).join('')}</div><button class="main" id="mn" disabled>Дальше</button>`});
  const pickS=(s,b)=>{if(solved)return;s=+s;
   if(s===0){solved=true;if(clean)score++;ans.push([c,clean]);$$('.fk').forEach(q=>q.disabled=true);b&&b.classList.add('ok');
    fb(clean?'Верно! Смотри весь порядок черт':'Да, эта. Смотри весь порядок черт','ok');
    const fx=$('#fx');fx.innerHTML='<div class="wbox fsw">'+GRID+'<div class="hw" id="hw"></div></div>';const box=$('#hw');
    try{const w=HanziWriter.create(box,c,hwOpts(box.clientWidth||240,{showOutline:true,strokeAnimationSpeed:1.6,delayBetweenStrokes:180}));w.animateCharacter();}catch(e){}
    playWord(c);const mn=$('#mn');mn.disabled=false;mn.innerHTML=k+1<items.length?'Дальше':'Готово';mn.onclick=()=>{k++;one();};}
   else{if(clean){clean=false;miss.push(c);}shake(b||$(`.fk[data-s="${s}"]`));fb(HZDATA[c]&&s>0?'Эту черту пишут позже. Сверху вниз, слева направо':'Попробуй ещё','hint');}};
  $$('.fk').forEach(b=>b.onclick=()=>pickS(b.dataset.s,b));
  $$('#fx .fc, #fx g[data-s]').forEach(g=>g.addEventListener('click',()=>pickS(g.dataset.s,$(`.fk[data-s="${g.dataset.s}"]`))));};
 rule();}

/* ================= 5. Пишем по памяти лесенкой ================= */
const GRID='<svg class="g" viewBox="0 0 100 100" aria-hidden="true"><g stroke="#D3D8E6" stroke-width=".5" fill="none"><path d="M50 4V96M4 50H96" stroke-dasharray="2 2"/><path d="M4 4L96 96M96 4L4 96" stroke-dasharray="1.5 2.5"/></g></svg>';
function hwOpts(sz,extra){return Object.assign({width:sz,height:sz,padding:sz*.08,showOutline:false,showCharacter:false,
 outlineColor:'#DCE0EB',strokeColor:'#1E2350',drawingColor:'#5B6BD8',drawingWidth:Math.round(sz/18),highlightColor:'#8E5BE8',
 strokeAnimationSpeed:1,delayBetweenStrokes:260,charDataLoader:(ch,ok)=>ok(HZDATA[ch])},extra||{});}
// одна клетка: квиз Hanzi Writer
function writeBox(box,c,{outline=false,hintAfter=3}={},on={}){const sz=box.clientWidth||260;let mist=0;
 if(!window.HanziWriter||!HZDATA[c]){later(()=>on.done&&on.done(0),300);return null;}
 const w=HanziWriter.create(box,c,hwOpts(sz,{showOutline:outline}));
 w.quiz({showHintAfterMisses:hintAfter,highlightOnComplete:true,
  onMistake:()=>{if(!box.isConnected)return;mist++;on.mist&&on.mist(mist);},
  onCorrectStroke:()=>box.isConnected&&on.ok&&on.ok(),
  onComplete:()=>{if(!box.isConnected)return;on.done&&on.done(mist);}});
 return w;}
const LAD=['我','好','你','他','她','们','吗','是'];
function ladder(){const n=5;S.l5=S.l5||{a:{},b:{},q:null};const L=S.l5;
 const res=()=>LAD.map(c=>[c,L.a[c]==null?-1:L.a[c],L.b[c]==null?-1:L.b[c]]);
 // часть А: для каждого иероглифа обведи → сам
 const partA=()=>{const c=LAD.find(x=>L.a[x]==null);if(!c)return partB();const h=HZM[c];let stage=0,m1=0;
  const one=()=>{shell(n,{step:'5.1 · '+(LAD.indexOf(c)+1)+' / '+LAD.length,sub:stage===0?'Обведи по светлому образцу, черта за чертой.':'Теперь напиши <b>сам</b>, без образца.',
    scene:`<div class="wcap"><span class="zh">${stage===0?c:'?'}</span><div><div class="py t${h[2]}">${toned(h[1],h[2])}</div><div class="ru">${esc(h[3])}</div></div><button class="snd sm" id="ps" aria-label="Послушать">${IC.snd}</button></div>
     <div class="wbox" id="wb">${GRID}<div class="hw" id="hw"></div></div>`,
    pult:`<div class="fb" id="fb"></div><div class="steps3"><span class="${stage?'ok':'on'}">1. Обведи</span><span class="${stage?'on':''}">2. Сам</span><span>3. По памяти</span></div>${stage?'<button class="quiet" id="hn">Не помню — покажи образец</button>':''}`});
   $('#ps').onclick=()=>playWord(c,$('#ps'));
   writeBox($('#hw'),c,{outline:stage===0,hintAfter:stage===0?1:3},{mist:()=>fb(stage===0?'Веди по светлой черте':'Не та черта. После 3 ошибок черта подскажет','hint'),ok:()=>fb('Так, дальше','ok'),
    done:m=>{if(stage===0){m1=m;stage=1;fb('Обвёл! Теперь сам','ok');later(one,600);}else{L.a[c]=m;keep();send('t5p',{res:res()});fb(m<=1?'Отлично, по памяти!':'Написано. Ещё встретимся в части 5.2','ok');later(partA,800);}}});
   const hn=$('#hn');if(hn)hn.onclick=()=>{stage=0;one();};};
  one();};
 // часть Б: все 8 вперемешку только по русскому слову; ошибочные возвращаются в конец (до 2 раз)
 const partB=()=>{if(!L.q){L.q=shuffle(LAD).map(c=>({c,r:0}));keep();}
  if(!L.q.length)return end();const it=L.q[0],c=it.c,h=HZM[c];let hint=false;
  shell(n,{step:'5.2 · осталось '+L.q.length,sub:'Последняя ступень: вспомни иероглиф <b>только по русскому слову</b>.',
   scene:`<div class="bq"><small>Напиши по памяти</small><b>«${esc(h[3])}»</b></div><div class="wbox" id="wb">${GRID}<div class="hw" id="hw"></div></div>`,
   pult:`<div class="fb" id="fb">${it.r?'Этот иероглиф вернулся: попробуй ещё раз':''}</div><button class="quiet" id="hn">Не помню — подскажи</button>`});
  const go=outline=>writeBox($('#hw'),c,{outline,hintAfter:outline?1:3},{mist:()=>fb('Не та черта','hint'),ok:()=>fb('Так, дальше','ok'),
   done:m=>{const clean=!hint&&m<=1;if(L.b[c]==null||it.r===0)L.b[c]=hint?99:m;L.q.shift();
    if(!clean&&it.r<2){L.q.push({c,r:it.r+1});fb(`<span class="zh">${c}</span> вернётся в конце, ещё раз по памяти`,'hint');}else fb(clean?`Да! <span class="zh">${c}</span> по памяти`:`<span class="zh">${c}</span> — написано`,'ok');
    keep();send('t5p',{res:res()});later(()=>playWord(c),100);later(partB,1100);}});
  go(false);$('#hn').onclick=()=>{hint=true;$('#hn').remove();$('#hw').innerHTML='';fb(`Это <span class="zh">${c}</span> ${pyHTML(toned(h[1],h[2]))}: обведи`,'hint');go(true);};};
 const end=()=>{const R=res();const clean=R.filter(r=>r[2]>=0&&r[2]<=1).length;const miss=R.filter(r=>!(r[2]>=0&&r[2]<=1)).map(r=>r[0]);
  S.l5=null;keep();finish(n,{score:clean,of:LAD.length,res:R,miss},`<p>По памяти с первого раза: ${clean} из ${LAD.length}.</p>${miss.length?`<p>Можно повторить для закрепления:</p><div class="chips">${miss.map(m=>`<span class="x zh">${m}</span>`).join('')}</div>`:''}`);};
 if(Object.keys(L.a).length===LAD.length)partB();else partA();}

/* ================= 6. Найди ошибку ================= */
// e: ['c',i] — не тот/лишний знак №i; ['g',i] — не хватает знака перед №i (i = длина → в конце)
const ERR=[['Он мой папа.','她是我爸爸。',['c',0],'他是我爸爸。','<span class="zh">她</span> — «она», ключ <span class="zh">女</span>. «Он» — <span class="zh">他</span>.'],
 ['Она твоя мама?','她是你妈妈。',['g',5],'她是你妈妈吗？','Это вопрос «да или нет?» — в конце нужен <span class="zh">吗</span>.'],
 ['Он мой папа.','他不是我爸爸。',['c',1],'他是我爸爸。','Здесь нет «не» — <span class="zh">不</span> лишний.'],
 ['Ты моя мама?','吗你是我妈妈？',['c',0],'你是我妈妈吗？','<span class="zh">吗</span> ставим только <b>в конец</b>.'],
 ['Она не моя мама.','她是我妈妈。',['g',1],'她不是我妈妈。','«не» — <span class="zh">不</span> перед <span class="zh">是</span>.'],
 ['Она моя мама.','她是妈妈。',['g',2],'她是我妈妈。','«моя» — нужен <span class="zh">我</span>.'],
 ['Они мои папа и мама.','他是我爸爸妈妈。',['g',1],'他们是我爸爸妈妈。','«они» — <span class="zh">他们</span>: не хватает <span class="zh">们</span>.'],
 ['Она твоя мама?','他是你妈妈吗？',['c',0],'她是你妈妈吗？','«она» — <span class="zh">她</span> с ключом <span class="zh">女</span>.']];
function findErr(){const n=6;const items=shuffle(ERR);let k=0,score=0;const miss=[],ans=[];
 const one=()=>{if(k>=items.length)return finish(n,{score,of:items.length,miss,ans},sumMiss(score,items.length,miss.map(m=>`<span class="zh">${esc(m)}</span>`)));
  const [ru,zh,e,fix,why]=items[k];const ch=[...zh.replace(/[。？！]$/,'')],end=zh.slice(-1);let clean=true,solved=false;
  shell(n,{step:(k+1)+' / '+items.length,sub:'В переводе <b>одна ошибка</b>. Нажми на неправильный знак. Если знака не хватает — нажми на щель, где он должен стоять.',
   scene:`<div class="feru">${esc(ru)}</div><div class="fel">${ch.map((c,i)=>`<button class="feg" data-g="${i}" aria-label="щель ${i+1}"></button><button class="fec" data-c="${i}"><span class="zh">${c}</span></button>`).join('')}<button class="feg" data-g="${ch.length}" aria-label="щель в конце"></button><span class="fep zh">${end}</span></div><div id="fx"></div>`,
   pult:`<div class="fb" id="fb"></div><button class="main" id="mn" disabled>Дальше</button>`});
  const tap=(t,i,b)=>{if(solved)return;
   if(t===e[0]&&i===e[1]){solved=true;if(clean)score++;ans.push([zh,clean]);b.classList.add('ok');
    $('#fx').innerHTML=`<div class="fefix"><small>Правильно:</small><button class="key wdk" id="fs"><span class="zh">${esc(fix)}</span></button></div>`;$('#fs').onclick=()=>playPhrase(fix,$('#fs'));
    fb((clean?'Нашёл! ':'Да. ')+why,'ok');later(()=>playPhrase(fix),200);$$('.fec,.feg').forEach(q=>q.disabled=true);
    const mn=$('#mn');mn.disabled=false;mn.innerHTML=k+1<items.length?'Дальше':'Готово';mn.onclick=()=>{k++;one();};}
   else{if(clean){clean=false;miss.push(zh);}shake(b);fb(t==='c'?`<span class="zh">${ch[i]}</span> здесь на месте. Читай по одному знаку и сравни с русским`:'Здесь ничего не пропущено. Сравни с русским ещё раз','hint');}};
  $$('.fec').forEach(b=>b.onclick=()=>tap('c',+b.dataset.c,b));$$('.feg').forEach(b=>b.onclick=()=>tap('g',+b.dataset.g,b));};
 one();}

/* ================= 7–8. Наш детективный диалог ================= */
const DLG=[['p','小朋友，你好！','xiǎo péngyou, nǐ hǎo!','Привет, дружок!'],['b','您好！','nín hǎo!','Здравствуйте!'],['p','小朋友，你叫什么名字？','xiǎo péngyou, nǐ jiào shénme míngzi?','Дружок, как тебя зовут?'],['b','我叫小明。','wǒ jiào Xiǎo Míng.','Меня зовут Сяо Мин.'],['p','她是你妈妈吗？','tā shì nǐ māma ma?','Она твоя мама?'],['b','不是，不是！她不是我妈妈。','bú shì, bú shì! tā bú shì wǒ māma.','Нет, нет! Она не моя мама.'],['b','她是我妈妈！','tā shì wǒ māma!','Вот моя мама!']];
const WHO={p:'Полицейский',b:'Мальчик Сяо Мин'};
const KADR=[1,2,3,3,4,4,5];
let STREAM=null,REC=null;
async function upload(item,blob){if(isTest())return true;if(!S.sid)return false;
 for(let k=0;k<3;k++){try{const r=await fetch(API+'audio?hw='+HW_ID+'&sid='+encodeURIComponent(S.sid)+'&item='+item,{method:'POST',headers:{'Content-Type':blob.type||'audio/webm'},body:blob});if(r.ok)return true;}catch(e){}await new Promise(r=>setTimeout(r,1500*(k+1)));}
 return false;}
function stopRec(){try{if(REC&&REC.state==='recording'){REC.onstop=null;REC.stop();}}catch(e){}}
function recDlg(){const n=7;S.r7=S.r7||{};const R=S.r7;
 const k=DLG.findIndex((_,i)=>!R[i]);if(k<0)return end();
 const [w,z,p,ru]=DLG[k];
 shell(n,{step:'реплика '+(k+1)+' / '+DLG.length,sub:k===0?'Наша история с урока. Послушай реплику, потом нажми 🎤 и прочитай её сам. Учитель послушает.':'Послушай, потом запиши себя.',
  scene:`<img class="dlimg" src="img/kadr-${KADR[k]}.webp" alt="Кадр ${KADR[k]}"><button class="dlb ${w}" id="ln"><span class="dlw">${WHO[w]}</span><span class="zh dlz">${esc(z)}</span><span class="py dlp">${pySent(p)}</span><small class="dlr">${esc(ru)}</small></button>
   <div class="recb"><button class="mic" id="mic" aria-label="Записать">🎤</button><div><b id="tmr">0:00</b><small id="rs">Нажми 🎤 и прочитай реплику</small></div></div><div id="rv"></div>`,
  pult:`<div class="fb" id="fb"></div><button class="main soft" id="mn">${IC.snd} Послушать реплику</button>`});
 const play=()=>playPhrase(z,$('#ln'));$('#ln').onclick=play;$('#mn').onclick=play;later(play,350);
 const mic=$('#mic');let chunks=[],t0=0,tick=0;
 mic.onclick=async()=>{if(REC&&REC.state==='recording'){REC.stop();return;}
  try{try{curA&&curA.pause()}catch(e){}if(!STREAM||!STREAM.active)STREAM=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,channelCount:1}});}
  catch(e){$('#rv').innerHTML=`<div class="tk">Микрофон не открылся. Разреши доступ к микрофону (значок 🔒 рядом с адресом сайта) и нажми 🎤 ещё раз.</div><button class="quiet" id="nomic">Не получается — прочитаю учителю на уроке</button>`;
   $('#nomic').onclick=()=>{stopRec();finish(n,{score:0,of:DLG.length,noMic:true,rec:Object.keys(R).length},'<p>Хорошо! Прочитай диалог учителю на уроке.</p>');};return;}
  const type=['audio/webm;codecs=opus','audio/mp4','audio/webm','audio/ogg'].find(t=>window.MediaRecorder&&MediaRecorder.isTypeSupported(t));
  try{REC=new MediaRecorder(STREAM,type?{mimeType:type,audioBitsPerSecond:48000}:undefined);}catch(e){toast('Этот браузер не умеет записывать звук');return;}
  chunks=[];REC.ondataavailable=e=>e.data.size&&chunks.push(e.data);
  REC.onstop=()=>{clearInterval(tick);if(!mic.isConnected)return;mic.classList.remove('rec');mic.textContent='🎤';const dur=(Date.now()-t0)/1000;
   if(dur<1){toast('Слишком коротко — прочитай всю реплику');return;}
   const blob=new Blob(chunks,{type:(REC.mimeType||type||'audio/webm').split(';')[0]});const u=URL.createObjectURL(blob);
   $('#rs').textContent='Послушай себя. Если что-то не так — запиши ещё раз';
   $('#rv').innerHTML=`<audio controls src="${u}" class="aud"></audio>`;
   const mn=$('#mn');mn.className='main';mn.innerHTML='Отправить и дальше';mn.onclick=async()=>{mn.disabled=true;mn.textContent='Отправляю…';const ok=await upload('l'+(k+1),blob);
    if(!ok){mn.disabled=false;mn.textContent='Отправить ещё раз';toast('Не получилось отправить. Проверь интернет и нажми ещё раз.');return;}
    R[k]=Math.round(dur);keep();send('t7p',{rec:R});recDlg();};};
  REC.start(500);t0=Date.now();mic.classList.add('rec');mic.textContent='⏹';$('#rv').innerHTML='';$('#rs').textContent='Читай! Потом нажми ⏹';
  tick=setInterval(()=>{const s=Math.floor((Date.now()-t0)/1000);const el=$('#tmr');if(!el){clearInterval(tick);return;}el.textContent=Math.floor(s/60)+':'+String(s%60).padStart(2,'0');if(s>=30&&REC.state==='recording')REC.stop();},250);};
 function end(){const rec=Object.keys(R).length;S.r7={};keep();finish(n,{score:rec,of:DLG.length,rec,sec:Object.values(R)},`<p>Ты записал все ${DLG.length} реплик. Учитель послушает, как ты читаешь.</p>`);}}

// 8. Допиши реплики: [реплика, с какого знака, по какой] — эти знаки пишет ребёнок, остальное уже написано
const WDL=[[0,4,5],[1,1,1],[2,4,5],[3,0,1],[4,0,5],[5,6,11],[6,0,4]];
const WRITE8=WDL.map(([li,a,b])=>{const ch=[...DLG[li][1]];return {li,ch,w:ch.map((c,i)=>i>=a&&i<=b&&!!HZM[c])};});
function writeDlg(){const n=8;S.w8=S.w8||{l:0,j:0,m:[],h:[]};const W=S.w8;
 if(W.l>=WRITE8.length)return end();
 const L=WRITE8[W.l],[who,z,p,ru]=DLG[L.li];const todo=L.ch.map((c,i)=>L.w[i]?i:-1).filter(i=>i>=0);
 if(W.j>=todo.length){W.l++;W.j=0;keep();return writeDlg();}
 const ci=todo[W.j],c=L.ch[ci],noPy=W.l===WRITE8.length-1;let hint=false;
 shell(n,{step:'реплика '+(W.l+1)+' / '+WRITE8.length,sub:noPy?'Последняя реплика — <b>без пиньиня</b>. Пиши по памяти.':'Пиши пропущенные иероглифы по порядку. Пиньинь подскажет, какой нужен.',
  scene:`<div class="dlb ${who} w8"><span class="dlw">${WHO[who]}</span><span class="zh dlz w8z">${L.ch.map((x,i)=>!L.w[i]?esc(x):i===ci?'<b class="w8c">？</b>':todo.indexOf(i)<W.j?`<b class="w8ok">${x}</b>`:'<b class="w8e">＿</b>').join('')}</span>${noPy?'':`<span class="py dlp">${pySent(p)}</span>`}<small class="dlr">${esc(ru)}</small></div>
   <div class="wbox w8box" id="wb">${GRID}<div class="hw" id="hw"></div></div>`,
  pult:`<div class="fb" id="fb"></div><button class="quiet" id="hn">Не помню — подскажи</button>`});
 const go=outline=>writeBox($('#hw'),c,{outline,hintAfter:outline?1:3},{mist:()=>fb('Не та черта','hint'),ok:()=>fb('Так, дальше','ok'),
  done:m=>{W.m.push([c,m]);if(hint)W.h.push(c);W.j++;keep();send('t8p',{l:W.l,m:W.m,h:W.h});
   if(W.j>=todo.length){fb(`Реплика готова: <span class="zh">${esc(z)}</span>`,'ok');playPhrase(z);later(()=>{W.l++;W.j=0;keep();writeDlg();},1600);}else later(writeDlg,500);}});
 go(false);$('#hn').onclick=()=>{hint=true;$('#hn').remove();$('#hw').innerHTML='';fb(`Это <span class="zh">${c}</span>: обведи`,'hint');go(true);};
 function end(){const of=W.m.length,clean=W.m.filter(([c,m])=>m<=1&&!W.h.includes(c)).length;const miss=[...new Set(W.m.filter(([c,m])=>m>1).map(x=>x[0]).concat(W.h))];
  const res={score:clean,of,m:W.m,h:W.h,miss};S.w8=null;keep();
  finish(n,res,`<p>Ты написал весь диалог! Без ошибок: ${clean} иероглифов из ${of}.</p><div class="dll">${DLG.map(([w,z])=>`<div class="dlb ${w} sm"><span class="zh dlz">${esc(z)}</span></div>`).join('')}</div>${miss.length?`<p>Можно повторить для закрепления:</p><div class="chips">${miss.map(m=>`<span class="x zh">${m}</span>`).join('')}</div>`:''}`);}}

/* ================= 9. Игра «Поймай иероглиф» =================
   Лента карточек сделана по мотивам слайдера:
   From Uiverse.io by ashwin_5681 - https://uiverse.io/ashwin_5681/tough-baboon-50
   MIT License, Copyright (c) ashwin_5681 (Ashwin A)
   (классы переименованы с приставкой lv-, чтобы не пересекаться с оформлением страниц) */
const LV_TRAP={'妈':['吗','她','好'],'吗':['妈','叫','们'],'他':['她','你','们'],'她':['他','妈','好'],'你':['们','他','我'],'们':['你','他','门'],'好':['她','妈','你'],'我':['你','好','是'],'叫':['吗','好','爸'],'爸':['妈','他','叫'],'是':['不','我','好'],'不':['是','你','们']};
const LV_COL=['#5B6BD8,#8E5BE8','#6A6DDE,#664796','#3D88E0,#5B6BD8','#8E5BE8,#B46BD8','#4C3DB8,#7B6BE8','#7D5BD8,#5B8BE8'];
let LVSTOP=null;
function stopGame(){if(LVSTOP){LVSTOP();LVSTOP=null;}stopRec();}
function catchGame(){const n=9,ROUNDS=12;const order=shuffle(HZ.map(h=>h[0]));let r=0,score=0,errs=0;const miss=[],ans=[];let paused=false;
 const rule=()=>{shell(n,{step:'',sub:'Сверху написано, какой иероглиф найти. Карточки едут — <b>успей нажать</b> нужную! С каждым раундом быстрее.',
   scene:`<div class="lvdemo">${lvLane(['你','妈','吗','他','她','好','们','是'],{dur:14,rev:false,demo:true})}</div><div class="tk">Осторожно: рядом едут похожие — <span class="zh">妈 吗</span>, <span class="zh">他 她</span>.</div>`,
   pult:`<div class="fb" id="fb"></div><button class="main" id="mn">Играть</button>`});$('#mn').onclick=round;};
 const round=()=>{if(r>=ROUNDS)return end();const c=order[r%order.length],h=HZM[c];const byPy=r%3===2&&h[2]>0&&HZ.filter(x=>x[1]===h[1]&&x[2]===h[2]).length===1;
  const dur=Math.max(6.5,15-r*0.75);let tries=0,solved=false;
  const fill=()=>{const traps=LV_TRAP[c].filter(x=>HZM[x]);const others=shuffle(HZ.map(x=>x[0]).filter(x=>x!==c&&!traps.includes(x)));
   const a=shuffle([c,...traps.slice(0,2),...others.slice(0,5)]),b=shuffle([traps[2]||others[5],traps[0],...others.slice(5,11)]).slice(0,8);return [a,b];};
  const [A,B]=fill();
  shell(n,{step:'раунд '+(r+1)+' / '+ROUNDS,sub:'',
   scene:`<div class="lvq"><small>Найди</small><b>${byPy?pyHTML(toned(h[1],h[2])):'«'+esc(h[3])+'»'}</b></div>
    <div class="lvw${paused?' lv-paused':''}" id="lvw">${lvLane(A,{dur,rev:false})}${lvLane(B,{dur:dur*1.15,rev:true})}</div>`,
   pult:`<div class="fb" id="fb"></div><div class="lvbar"><span>✓ ${score}</span><button class="quiet" id="pz">${paused?IC.play+' Продолжить':IC.pause+' Пауза'}</button></div>`});
  $('#pz').onclick=()=>{paused=!paused;$('#lvw').classList.toggle('lv-paused',paused);$('#pz').innerHTML=paused?IC.play+' Продолжить':IC.pause+' Пауза';};
  $$('.lv-card').forEach(b=>b.onclick=()=>{if(solved||paused)return;const v=b.dataset.z;
   if(v===c){solved=true;b.classList.add('lv-ok');$('#lvw').classList.add('lv-paused');if(!tries)score++;ans.push([c,tries]);playWord(c);
    fb(`Поймал: <span class="zh">${c}</span> ${pyHTML(toned(h[1],h[2]))} «${esc(h[3])}»`,'ok');r++;later(round,1100);}
   else{tries++;errs++;if(tries===1)miss.push(c);b.classList.remove('lv-no');void b.offsetWidth;b.classList.add('lv-no');
    fb(`Это <span class="zh">${v}</span> «${esc(HZM[v][3])}». Ищи ${byPy?pyHTML(toned(h[1],h[2])):'«'+esc(h[3])+'»'}`,'hint');
    if(tries>=2)$$(`.lv-card[data-z="${c}"]`).forEach(q=>q.classList.add('lv-help'));}});};
 const end=()=>{finish(n,{score,of:ROUNDS,errs,miss,ans},`<p>Поймано с первой попытки: ${score} из ${ROUNDS}.</p>${miss.length?`<p>Можно повторить для закрепления:</p><div class="chips">${[...new Set(miss)].map(m=>`<span class="x zh">${m}</span>`).join('')}</div>`:''}`);};
 LVSTOP=()=>{};rule();}
function lvLane(list,{dur,rev,demo}){const q=list.length;
 return `<div class="lv-slider" style="--lv-w:var(--lv-card);--lv-q:${q};--lv-d:${dur}s"${rev?' data-rev="1"':''}><div class="lv-list">${list.map((z,i)=>`<div class="lv-item" style="--lv-p:${i+1}"><button class="lv-card" data-z="${z}" style="--lv-g:linear-gradient(135deg,${LV_COL[(i+(rev?3:0))%LV_COL.length]})"${demo?' tabindex="-1"':''}><span class="zh">${z}</span></button></div>`).join('')}</div></div>`;}


/* ================= список, старт, итоги ================= */
function start(){clearTimers();
 $('#app').innerHTML=`<div class="scr start fade">${topHTML()}<div class="pan n" style="text-align:center"><h2>Как тебя зовут?</h2>
  <p class="lead">Пиньинь, ключи, первая черта, пишем по памяти и наш детективный диалог. Девять заданий, можно делать в несколько заходов.</p>
  <input class="inp" id="nm" autocomplete="given-name" placeholder="Имя и буква фамилии" value="${esc(S.name||'')}">
  <button class="main" id="go">Начать →</button></div></div>`;
 const go=()=>{const v=$('#nm').value.trim();if(!v){$('#nm').focus();toast('Напиши своё имя');return;}
  if(v!==S.name){S.name=v;S.sid=S.sid||('s'+Date.now().toString(36)+Math.random().toString(36).slice(2,7));}keep();flush();list();};
 $('#go').onclick=go;$('#nm').onkeydown=e=>{if(e.key==='Enter')go();};}
function list(){clearTimers();stopGame();try{curA&&curA.pause()}catch(e){}if(!S.name)return start();S.cur=0;keep();
 const first=[...Array(NT).keys()].map(i=>i+1).find(i=>!S.done[i]);
 $('#app').innerHTML=`<div class="scr list fade">${topHTML()}${pbarHTML()}<div class="pan n">
  <h2>Задания по порядку</h2><p class="lead">Делай задания <b>по номерам: 1, 2, 3…</b> Сделанные отмечаются ✓, шкала наверху показывает, сколько готово.${isTest()?'<br><b>Режим учителя: всё открыто, ничего не сохраняется.</b>':''}</p>
  <div class="olist">${TASKS.slice(1).map((T,i)=>{const n=i+1,dn=!!S.done[n],now=!dn&&n===first;
   return `<button class="ti n tile${dn?' done':now?' hot':' todo'}" data-n="${n}"><span class="no">${n}</span><span class="tt"><b>${EMO[n]} ${esc(T.t)}</b><small>${esc(T.s)}</small></span>${dn?'<span class="st">✓ готово</span>':''}</button>`;}).join('')}</div>
  <div class="foot"><button class="main" id="go">${first?'Задание '+first+': '+esc(TASKS[first].t)+' →':'🏁 Мои итоги'}</button>${first?'<button class="quiet" id="rs">🏁 Мои итоги</button>':''}</div></div></div>`;
 $$('.tile').forEach(b=>b.onclick=()=>TASKS[+b.dataset.n].run());topOn();
 $('#go').onclick=()=>first?TASKS[first].run():results();if($('#rs'))$('#rs').onclick=results;}
function results(){clearTimers();stopGame();const D=[],X=[];for(let i=1;i<=NT;i++)(S.done[i]?D:X).push(i);send('itogi',{done:D.length,of:NT,left:X});
 const line=(i,y)=>{const r=S.done[i];return `<div class="ri ${y?'y':'x'}"><span class="num">${i}</span><span>${EMO[i]} ${esc(TASKS[i].t)}${y&&r?`<small>${i===7?(r.noMic?'прочитаю на уроке':'записано реплик: '+r.rec):'верно: '+r.score+' из '+r.of}</small>`:''}</span>${y?'<span class="st">✓</span>':`<button class="go" data-n="${i}">Сделать →</button>`}</div>`;};
 $('#app').innerHTML=`<div class="scr res fade">${topHTML()}${pbarHTML()}<div class="pan n"><div class="top"><h1>🏁 ${esc(S.name||'')}, сделано ${D.length} из ${NT}</h1></div>
  ${X.length?`<div class="left"><h3>⏳ Ещё не доделано (${X.length}):</h3><div class="rl">${X.map(i=>line(i,0)).join('')}</div></div>`:`<div class="allok">🏆 Все ${NT} заданий сделаны! Учитель увидит результаты.</div>`}
  ${D.length?`<h3>✓ Сделано</h3><div class="rl">${D.map(i=>line(i,1)).join('')}</div>`:''}
  <div class="foot"><button class="main" id="go">К списку заданий</button></div></div></div>`;
 $$('.go').forEach(b=>b.onclick=()=>TASKS[+b.dataset.n].run());$('#go').onclick=list;topOn();}

/* клавиатура на компьютере: цифры выбирают ответ, Enter — главная кнопка */
addEventListener('keydown',e=>{if(e.target.tagName==='INPUT')return;
 if(/^[1-9]$/.test(e.key)){const k=$$('.keys .key:not(.pt), #kk [data-v]')[+e.key-1];if(k&&!k.disabled){k.click();e.preventDefault();}}
 else if(e.key==='Enter'){const m=$('#mn')||$('#nx')||$('#go');if(m&&!m.disabled){m.click();e.preventDefault();}}});

/*__BOOT__*/
try{const q=new URLSearchParams(location.search).get('name');if(q){if(q!==S.name){S.name=q;S.sid='s'+Date.now().toString(36)+Math.random().toString(36).slice(2,7);}keep();}}catch(e){}
flush();
const h=location.hash.match(/^#t(\d+)$/);
if(S.name&&h&&TASKS[+h[1]])TASKS[+h[1]].run();else list();
