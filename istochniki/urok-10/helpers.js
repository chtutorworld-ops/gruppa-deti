/* ===================== УРОК 9 · ОН, ОНА, МЫ · ФИНАЛИ ai ei ao ou an en ===================== */
B.length=0;B.push('Начало','1. Повторяем','2. an en','3. Детективная история','4. 吗 · 是 · 不','5. Ключи и фонетики','Конец');
const qrMini=(n,label)=>`<div class="u8q nk"><div class="qrbox" data-qr="${ZURL}#${n}" data-size="96" style="width:108px;height:108px;padding:6px"></div><div><span class="k2">Кабинет</span><b>№ ${n}</b><small>${label}</small></div></div>`;
const TC8={1:'#1FA77A',2:'#E8910C',3:'#6A5BFF',4:'#F0407A',0:'#9AA2BC'};
const tpy8=s=>s.split(' ').map(w=>{const t=[1,2,3,4].find(k=>TMARK[k].test(w));return `<span style="color:${TC8[t||0]}">${w}</span>`;}).join(' ');
const py8=s=>s.replace(/men$/,'\u0001men').split('\u0001').map(w=>tpy8(w)).join('');
const PRON=[['我','wǒ','я'],['你','nǐ','ты'],['他','tā','он'],['她','tā','она']];
const PRONM=[['我们','wǒmen','мы'],['你们','nǐmen','вы'],['他们','tāmen','они'],['她们','tāmen','они (девочки)']];
const pcell=(p)=>`<div class="u8pc nk"><button class="syl has z" data-say="${p[0]}" style="font-size:56px">${p[0]}</button><span class="pyn">${py8(p[1])}</span><b>${p[2]}</b></div>`;
const ptable=(reveal)=>`<div class="u8pt u9pt"><div class="u8ph">один</div><div class="u8ph">много · 们</div>${PRON.map((p,i)=>`<div class="u8pr${reveal?' rv':''}">${pcell(p)}${pcell(PRONM[i])}</div>`).join('')}</div>`;
// finals: colour + a Russian hint
const FC9={ai:'#E8910C',ei:'#1FA77A',ao:'#6A5BFF',ou:'#F0407A',an:'#2B8FD8',en:'#B4529E'};
const fsy=(s,f)=>{const c=SYL.char(s);const i=s.length-f.length;return `<button class="syl has u9s" data-say="${c}" data-v="${vkey(s)}" title="Послушать">${s.slice(0,i)}<b style="color:${FC9[f]}">${s.slice(i)}</b></button>`;};

/* ===== start ===== */

/* ===== 1. 他 и 她 — через фразу ===== */
const PORTR=[['malchik','他'],['pevica','她'],['vrach','他'],['puteshestvennica','她'],['paren','他'],['uchitelnica','她']];
const W9={'他':['他','tā','он',[['mean','亻','КЛЮЧ = СМЫСЛ','«человек» → <b>他</b> — это человек'],['note','也','ВТОРАЯ ЧАСТЬ','раньше подсказывала чтение, сейчас уже не похоже'],['write','✍️','КАК ПИСАТЬ','сначала 亻 (丿, потом 丨), потом 也 — 3 черты']]],
 '她':['她','tā','она',[['mean','女','КЛЮЧ = СМЫСЛ','«женщина» → <b>她</b> — это она. Ты знаешь 女 по 妈 и 好!'],['note','也','ВТОРАЯ ЧАСТЬ','та же, что в 他'],['write','✍️','КАК ПИСАТЬ','女 слева узкий: последняя черта короткая, вверх']]],
 '们':['们','men','много (суффикс)',[['mean','亻','КЛЮЧ = СМЫСЛ','«человек» → <b>们</b> — про людей'],['sound','门','ПОДСКАЗКА ЧТЕНИЯ','<span class="pyn">mén</span> «ворота» → <b>们</b> звучит <span class="pyn">men</span>'],['write','✍️','КАК ПИСАТЬ','门: точка, левая стенка, верх с крючком']]]};
const K9={mean:['#FF4F86','#FFE6EE','#FFD0DE'],sound:['#4D63E0','#E6EBFF','#CCD5FF'],note:['#8A6BE8','#F0EAFF','#DDD2FF'],write:['#2BB38A','#E2F7EF','#C4EEDD']};
const charSlide9=(c,py,ru,rules)=>`${hd(c,py,ru,'left')}
  <div style="position:absolute;left:64px;top:104px;display:grid;gap:12px;justify-items:center">${hzcell(c,430)}${strip(c)}<button class="btn" data-replay="${c}">▶ Ещё раз медленно</button></div>
  <div style="position:absolute;left:556px;right:48px;top:100px;bottom:40px;display:grid;gap:14px;align-content:start">
    <div class="nk" style="padding:12px 22px;display:flex;align-items:center;gap:20px"><button class="syl has z" data-say="${c}" style="font-size:78px;line-height:1">${c}</button><div><div class="pyn" style="font-size:40px;color:#2B3270">${py}</div><div style="font-weight:900;font-size:26px;color:#2B3270">${ru}</div></div></div>
    ${rules.map(([k,g,lab,t])=>{const [cl,bg,bd]=K9[k];return `<div class="rv u9rule" style="--c:${cl};background:${bg};border:3px solid ${bd}"><span class="u9g${g.length>1||/[✍]/.test(g)?' em':''}">${g}</span><div><div class="u9lab">${lab}</div><div class="u9txt">${t}</div></div></div>`;}).join('')}
  </div>`;
const writeSlide=(n,c)=>{const [cc,py,ru,rules]=W9[c];add(n,`Как пишется ${c}`,charSlide9(cc,py,ru,rules));};

/* ===== 2. 们 и таблица ===== */
const SOP=[['我','我们'],['你','你们'],['他','他们'],['她','她们'],['我们','她们']];
const PALL=Object.fromEntries([...PRON,...PRONM].map(p=>[p[0],p]));

/* ===== 3. ai ei · ao ou ===== */
/* Правила Дарьи 2026-11-16: цепочка = ВСЕ 4 тона 1→2→3→4; пара = тот же тон и та же инициаль, меняется только финаль; пары покрывают все 4 тона поровну; цвет = финаль (легенда на слайде); у каждого ученика по одному слогу каждого тона и каждой финали. */
const fin9=s=>{const p=s.normalize('NFD').replace(/[\u0300-\u036f]/g,'');return p.slice(-2);};
const chain9=gs=>`<div class="u8ch u9ch">${gs.map(g=>`<div class="g nk">${g.map(s=>fsy(s,fin9(s))).join('<i class="ar">›</i>')}</div>`).join('')}</div>`;
const pairs9=ps=>`<div class="u9pairs u9p8 rv">${ps.map(([x,y])=>`<div class="nk">${fsy(x,fin9(x))}<i>—</i>${fsy(y,fin9(y))}<span class="u9tn">${SYL.tone(x)}</span></div>`).join('')}</div>`;
const leg9=(a,b)=>`<span class="u9leg">цвет = финаль: <b style="color:${FC9[a]}">${a}</b> <b style="color:${FC9[b]}">${b}</b></span>`;
const chorus9=(a,b,ch,pr)=>`<div class="u8w"><div class="u8lab"><span>🔗</span> Цепочки: все 4 тона 1 → 2 → 3 → 4 ${leg9(a,b)}</div>
   ${chain9(ch)}
   <div class="u8lab rv"><span>⚖️</span> Пары: тон одинаковый — слушай финаль!</div>
   ${pairs9(pr)}</div>`;

const frule=(a,b,ra,rb,ex)=>`<div class="u9fr">
  ${[[a,ra],[b,rb]].map(([f,r])=>`<div class="u9fc nk" style="--fc:${FC9[f]}"><div class="u9fb">${/i$/.test(f)?f.slice(0,-1)+'<span class="u9i">i<em>й</em></span>':f}</div><div class="u9ft">${r}</div><div class="u9fx">${ex[f].map(s=>fsy(s,f)).join('')}</div></div>`).join('')}</div>`;
const SO9=[['bāi','méi','hǎo','dòu'],['lái','běi','dào','gōu'],['mǎi','mèi','māo','tóu'],['tài','fēi','máo','gǒu'],['hài','gěi','táo','zhōu']];

/* ===== 4. как придумали пиньинь ===== */

/* ===== 5. an en ===== */
const D10=['bái','měi','dào','gǒu','fàn','hěn','lái','shǒu','sān','mén'];
const plain9=s=>s.normalize('NFD').replace(/[̀-ͯ]/g,'');

/* ===== end ===== */
