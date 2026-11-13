/* ===================== № 11–13: «Звуки китайского» внутри ДЗ 8 ===================== */
// Перенесено из istochniki/zvuki/zv.part.js (та же таблица и тренировки), но номера, шкала % и «не доделано» — общие с ДЗ 8.
// Всё в одном модуле ZV, чтобы имена не пересекались с ДЗ 8. Классы оформления — с приставкой zv (не play/pop/st/…: такие есть в общем оформлении).
function zv11(){ZV.table(11);}
function zv12(){ZV.ini(12);}
function zv13(){ZV.ru(13);}
const ZV=(()=>{
const INI=[
 {l:'b',ru:'б',asp:0,pair:'p',grp:'lips'},{l:'p',ru:'п',asp:1,pair:'b',grp:'lips'},{l:'m',ru:'м',asp:null,grp:'lips'},{l:'f',ru:'ф',asp:null,grp:'lips'},
 {l:'d',ru:'д',asp:0,pair:'t',grp:'tip'},{l:'t',ru:'т',asp:1,pair:'d',grp:'tip'},{l:'n',ru:'н',asp:null,grp:'tip'},{l:'l',ru:'л',asp:null,grp:'tip'},
 {l:'g',ru:'г',asp:0,pair:'k',grp:'root'},{l:'k',ru:'к',asp:1,pair:'g',grp:'root'},{l:'h',ru:'х',asp:null,grp:'root'},
 {l:'z',ru:'дз',asp:0,pair:'c',grp:'teeth'},{l:'c',ru:'ц',ru2:'цх',asp:1,pair:'z',grp:'teeth'},{l:'s',ru:'с',asp:0,grp:'teeth'},
 {l:'zh',ru:'дж',asp:0,pair:'ch',grp:'up'},{l:'ch',ru:'ч',ru2:'чх',asp:1,pair:'zh',grp:'up'},{l:'sh',ru:'ш',asp:0,grp:'up'}];
const IN=Object.fromEntries(INI.map(x=>[x.l,x]));
const GRP={lips:['Губы','b p m f','#7C6FFF','#5B4BE0'],tip:['Кончик языка','d t n l','#2DBE8C','#17936A'],root:['Корень языка','g k h','#F5A524','#E07B12'],
 teeth:['Кончик языка у зубов','z c s','#22A6C9','#1479A0'],up:['Язык загнут вверх','zh ch sh','#FF5C8A','#D93A6A']};
const FIN=[{l:'a',ru:'а'},{l:'o',ru:'о'},{l:'e',ru:'э'},{l:'i',ru:'и'},{l:'u',ru:'у'}];
const FN=Object.fromEntries(FIN.map(x=>[x.l,x]));
const ZG=['z','c','s','zh','ch','sh'];
const YI={z:'дзы',c:'цы',s:'сы',zh:'джы',ch:'чшы',sh:'шы'};
const YI_WRONG={z:'дзи',c:'ци',s:'си',zh:'джи',ch:'чи',sh:'ши'};
const ruSyl=(i,f)=>f==='i'&&ZG.includes(i)?YI[i]:IN[i].ru+FN[f].ru;
const noPuff=(i,f)=>f==='i'&&(i==='c'||i==='ch');
const puffSyl=(i,f)=>IN[i].asp===1&&!noPuff(i,f);
const tonesOf=b=>[1,2,3,4].filter(t=>SYL.variant(b,t));
const SY=[];INI.forEach(I=>FIN.forEach(F=>{const b=I.l+F.l;if(tonesOf(b).length)SY.push({i:I.l,f:F.l,b});}));
const firstT=b=>tonesOf(b)[0];
const sylS=(b,t)=>mark(b,t);
const CLEAN=['b','p','m','f','d','t','n','l','g','k','h'];
const iniDemo=l=>CLEAN.includes(l)?null:{b:l+'a',t:firstT(l+'a')};
const rnd=a=>a[Math.random()*a.length|0];

/* звук: всё заранее загружено, без пауз */
const AC={};
function aud(u){let a=AC[u];if(!a){a=new Audio(u);a.preload='auto';AC[u]=a;}return a;}
let unlockHint=false;
function play(u,el){return new Promise(res=>{const a=aud(u);try{if(curA&&curA!==a)curA.pause();}catch(e){}curA=a;el&&el.classList.add('on');let d=false;
 const end=ok=>{if(d)return;d=true;el&&el.classList.remove('on');res(ok);};
 try{a.currentTime=0;}catch(e){}a.onended=()=>end(true);a.onerror=()=>end(false);
 a.play().catch(e=>{if(e&&e.name==='NotAllowedError'&&!unlockHint){unlockHint=true;toast('Нажми на звук один раз — дальше он будет звучать сам, когда наводишь мышку');}end(false);});});}
const sylURL=(b,t)=>{const v=SYL.variant(b,t);return v?fn(v.c):null;};
async function playSyl(b,t,el){const u=sylURL(b,t||firstT(b));if(u)return play(u,el);}
async function playIni(l,el){if(CLEAN.includes(l)){if(await play(VOICE+l+'0.wav',el))return;return playSyl(l+(l==='f'?'u':'a'),0,el);}const d=iniDemo(l);return playSyl(d.b,d.t,el);}
const playFin=(l,el)=>playSyl(l,0,el);
let PRE=false;
function preload(){if(PRE)return;PRE=true;CLEAN.forEach(l=>aud(VOICE+l+'0.wav'));INI.forEach(I=>{const d=iniDemo(I.l);if(d)aud(sylURL(d.b,d.t));});FIN.forEach(F=>aud(sylURL(F.l,firstT(F.l))));SY.forEach(s=>aud(sylURL(s.b,firstT(s.b))));}
// кнопки звука data-sy в правилах (вызывается из introOn ДЗ 8)
window.ZVON=()=>document.querySelectorAll('[data-sy]').forEach(b=>{if(b.closest('#zvpop'))return;b.onclick=e=>{e.stopPropagation();const [x,t]=b.dataset.sy.split('|');playSyl(x,+t,b);};});

/* всплывающая подсказка: наведи (на телефоне — нажми) */
const PUFF='<span class="zv-puff">💨 предыхательный</span>',NOP='<span class="zv-nopf">непредыхательный</span>';
function popIni(l){const I=IN[l],g=GRP[I.grp],ex=FIN.map(F=>I.l+F.l).filter(b=>tonesOf(b).length);
 return `<div class="pp-h" style="--a:${g[2]};--b:${g[3]}"><b class="pp-l">${l}</b><span class="pp-eq">=</span><b class="pp-r">«${I.ru2||I.ru}»</b></div>
 <div class="pp-tag">${I.asp===1?PUFF:I.asp===0?NOP:''}<span class="pp-g">${g[0]}</span></div>
 ${CLEAN.includes(l)?'':`<div class="pp-n">Звучит слог <b>${sylS(I.l+'a',firstT(I.l+'a'))}</b></div>`}
 <div class="pp-x">${ex.map(b=>`<button data-sy="${b}|${firstT(b)}"><b>${sylS(b,firstT(b))}</b><small>${ruSyl(I.l,b.slice(I.l.length))}</small></button>`).join('')}</div>`;}
function popFin(l){const F=FN[l];
 return `<div class="pp-h" style="--a:#5B6BD8;--b:#2B3270"><b class="pp-l">${l}</b><span class="pp-eq">=</span><b class="pp-r">«${F.ru}»</b></div>
 ${l==='i'?'<div class="pp-warn">⚠️ После <b>z c s zh ch sh</b> буква i читается <b>«ы»</b>!</div>':''}
 <div class="pp-x">${tonesOf(l).map(t=>`<button data-sy="${l}|${t}"><b>${sylS(l,t)}</b><small>${t}-й тон</small></button>`).join('')}</div>`;}
function popSyl(b){const s=SY.find(x=>x.b===b);
 return `<div class="pp-h" style="--a:${GRP[IN[s.i].grp][2]};--b:${GRP[IN[s.i].grp][3]}"><b class="pp-l">${b}</b><span class="pp-eq">=</span><b class="pp-r">«${ruSyl(s.i,s.f)}»</b></div>
 <div class="pp-tag">${puffSyl(s.i,s.f)?PUFF:''}${noPuff(s.i,s.f)?'<span class="pp-hot">без 💨! предыхание исчезает</span>':''}${s.f==='i'&&ZG.includes(s.i)&&!noPuff(s.i,s.f)?'<span class="pp-hot">i = «ы»</span>':''}</div>
 <div class="pp-x">${tonesOf(b).map(t=>`<button data-sy="${b}|${t}"><b>${sylS(b,t)}</b><small>${t}-й тон</small></button>`).join('')}</div>`;}
let POPT=0,POPEL=null;
function showPop(el){const p=$('#zvpop');if(!p)return;const k=el.dataset;
 p.innerHTML=(k.ini?popIni(k.ini):k.fin?popFin(k.fin):popSyl(k.syl))+'<button class="pp-close" aria-label="Закрыть">✕</button>';
 p.hidden=false;POPEL=el;document.querySelectorAll('.zc.cur').forEach(x=>x.classList.remove('cur'));el.classList.add('cur');
 p.querySelectorAll('[data-sy]').forEach(b=>{const [x,t]=b.dataset.sy.split('|');aud(sylURL(x,+t));b.onclick=e=>{e.stopPropagation();playSyl(x,+t,b);};});
 p.querySelector('.pp-close').onclick=e=>{e.stopPropagation();hidePop();};
 if(matchMedia('(max-width:700px)').matches){const r=el.getBoundingClientRect();p.className='zvpop sheet'+(r.top+r.height/2>innerHeight/2?' up':'');p.style.left=p.style.top='';return;} // на телефоне: звук внизу экрана — подсказка сверху, чтобы не закрывала нажатую клетку
 p.className='zvpop';const r=el.getBoundingClientRect(),pw=p.offsetWidth,ph=p.offsetHeight;
 let x=r.left+r.width/2-pw/2;x=Math.max(10,Math.min(innerWidth-pw-10,x));let y=r.bottom+10;if(y+ph>innerHeight-10)y=r.top-ph-10;
 if(y<10){y=Math.max(10,Math.min(innerHeight-ph-10,r.top+r.height/2-ph/2));x=r.right+10+pw<=innerWidth-10?r.right+10:Math.max(10,r.left-pw-10);} // низкий экран (телефон боком): подсказка сбоку, не на звуке
 p.style.left=x+'px';p.style.top=y+'px';}
function hidePop(){const p=$('#zvpop');if(p)p.hidden=true;POPEL=null;document.querySelectorAll('.zc.cur').forEach(x=>x.classList.remove('cur'));}
function sound(el){const k=el.dataset;if(k.ini)return playIni(k.ini,el);if(k.fin)return playFin(k.fin,el);return playSyl(k.syl,0,el);}
let TN=11;
const hcnt=()=>{const h=S.zvh.length;return DONE[TN]?`✓ Задание № ${TN} сделано: все 22 звука прослушаны`:`Прослушано <b>${Math.min(h,22)}</b> из 22 звуков (17 инициалей и 5 финалей)`;};
function heard(el){const k=el.dataset.ini||el.dataset.fin;if(!k)return;el.classList.add('seen');if(S.zvh.includes(k))return;S.zvh.push(k);keepS();
 const m=$('#hcnt');if(m)m.innerHTML=hcnt();
 if(S.zvh.length>=22&&!DONE[TN]){finish(TN,22,22,{heard:S.zvh.slice()});const pb=$('#pbar');if(pb)pb.outerHTML=pbar();toast(`🏆 Задание № ${TN} готово: ты послушал(а) все звуки!`);if(m)m.innerHTML=hcnt();const f=$('#zvfoot');if(f)f.innerHTML=foot();}
 else if(S.zvh.length%4===0)send('t'+TN+'p',{heard:S.zvh.slice()});}
const hover=matchMedia('(hover:hover) and (pointer:fine)').matches;
function bindCells(){document.querySelectorAll('.zc').forEach(el=>{
  if(hover){el.addEventListener('mouseenter',()=>{clearTimeout(POPT);if(POPEL===el)return;showPop(el);sound(el);heard(el);});
   el.addEventListener('mouseleave',()=>{clearTimeout(POPT);POPT=setTimeout(hidePop,350);});}
  el.addEventListener('click',e=>{e.stopPropagation();clearTimeout(POPT);showPop(el);sound(el);heard(el);});});
 const p=$('#zvpop');p.onmouseenter=()=>clearTimeout(POPT);p.onmouseleave=()=>{if(hover){POPT=setTimeout(hidePop,350);}};p.onclick=e=>e.stopPropagation();}
document.addEventListener('click',()=>{if(POPEL)hidePop();});

/* № 11: таблица звуков */
const iniCard=l=>{const I=IN[l];return `<button class="zc zi${S.zvh.includes(l)?' seen':''}" data-ini="${l}" style="--a:${GRP[I.grp][2]};--b:${GRP[I.grp][3]}"><b>${l}</b>${I.asp===1?'<i class="pf">💨</i>':''}<span class="ru">«${I.ru2||I.ru}»</span></button>`;};
const finCard=l=>`<button class="zc zf${S.zvh.includes(l)?' seen':''}" data-fin="${l}"><b>${l}</b><span class="ru">«${FN[l].ru}»</span></button>`;
const grpBox=g=>{const G=GRP[g];return `<div class="zg" style="--a:${G[2]};--b:${G[3]}"><div class="zgh">${G[0]}</div><div class="zgr">${INI.filter(x=>x.grp===g).map(x=>iniCard(x.l)).join('')}</div></div>`;};
function sylTable(){return `<div class="zv-stw"><table class="zv-st"><tr><th></th>${FIN.map(F=>`<th>${F.l}</th>`).join('')}</tr>
 ${INI.map(I=>`<tr><th style="color:${GRP[I.grp][3]}">${I.l}</th>${FIN.map(F=>{const b=I.l+F.l;if(!tonesOf(b).length)return '<td></td>';
   const hot=F.l==='i'&&ZG.includes(I.l);return `<td><button class="zc zs${hot?' hot':''}${noPuff(I.l,F.l)?' np':''}" data-syl="${b}">${b}</button></td>`;}).join('')}</tr>`).join('')}</table></div>`;}
const foot=()=>{const nx=nextN(TN);return DONE[TN]?`<div class="row">${nx?`<button class="btn" onclick="location.hash='#${nx}'">Задание № ${nx} →</button>`:`<button class="btn" onclick="location.hash='#itogi'">🏁 Мои итоги</button>`}<button class="btn g" onclick="location.hash=''">‹ Все задания</button></div>${nx?'':leftBox()}`
 :`<div class="tip" style="font-size:16px">Чтобы задание № ${TN} засчиталось, послушай <b>все 22 звука</b> наверху: 17 инициалей и 5 финалей. Слоги в таблице — для тренировки.</div><div class="row"><button class="btn g" onclick="location.hash=''">‹ Все задания</button></div>`;};
function table(n){TN=n;S.zvh=S.zvh||[];preload();
 shell(`${backBtn}${tag(n)}<h2>🔊 Таблица звуков</h2><p class="lead">${hover?'<b>Наведи мышку</b>':'<b>Нажми</b>'} на любой звук: увидишь, как он звучит <b>по-русски</b>, и услышишь его. Послушай <b>все 22 звука</b> — тогда задание № ${n} готово.</p>
  <div class="zv-hc" id="hcnt">${hcnt()}</div>
  <h3 class="zh3">声母 <span>Инициали — начало слога</span></h3>
  <div class="zgs">${['lips','tip','root'].map(grpBox).join('')}</div>
  <div class="zgs two">${['teeth','up'].map(grpBox).join('')}</div>
  <div class="zv-lgd"><span><i class="pf">💨</i> <b>предыхательные</b>: p t k c ch — с сильным выдохом</span><span><b>b d g z zh</b> — непредыхательные, без выдоха</span></div>
  <h3 class="zh3">韵母 <span>Финали — конец слога</span></h3>
  <div class="zfs">${FIN.map(F=>finCard(F.l)).join('')}</div>
  <div class="zwarn big"><div class="k2">⚠️ Самое важное правило</div>
   <div class="h">После z c s zh ch sh буква <u>i</u> читается «ы»</div>
   <div class="zrow6">${ZG.map(l=>`<button data-sy="${l}i|${firstT(l+'i')}" class="${noPuff(l,'i')?'hot':''}"><b>${l}i</b><small>«${YI[l]}»</small></button>`).join('')}</div>
   <div class="h2w">ci = «цы», chi = «чшы» — ПРЕДЫХАНИЕ ИСЧЕЗАЕТ!</div>
   <p>Сами по себе <b>c</b> и <b>ch</b> предыхательные 💨. Но вместе с <b>i</b> выдох пропадает: <b>ci</b> = «цы», <b>chi</b> = «чшы».</p></div>
  <h3 class="zh3">拼音 <span>Инициаль + финаль = слог</span></h3>
  <p class="lead" style="margin-top:0">${hover?'Наведи':'Нажми'} на слог — услышишь его и увидишь все тоны. Розовые клетки — где i читается «ы».</p>
  ${sylTable()}<div id="zvfoot">${foot()}</div>`,true);
 $('#app').insertAdjacentHTML('beforeend','<div class="zvpop" id="zvpop" hidden></div>');
 bindCells();ZVON();leftOn();}

/* № 12: узнай инициаль */
const ruleIni=`<div class="rbox" style="--c1:#5B6BD8;--c2:#8E5BE8"><b>Как делать</b>Прозвучит слог. Слушай <b>самое начало</b> — это инициаль. Выбери её. Кнопка 🔊 — послушать ещё раз.</div>`;
function ini(n){preload();quiz(n,{title:'👂 Узнай инициаль',intro:ruleIni,
 items:()=>{const L=shuffle(INI.map(x=>x.l)).slice(0,10);return L.map(l=>{const I=IN[l];const ss=SY.filter(s=>s.i===l&&!noPuff(s.i,s.f));const s=rnd(ss);const t=rnd(tonesOf(s.b));
  const others=new Set();if(I.pair)others.add(I.pair);const near={s:'sh',sh:'s',z:'zh',zh:'z',c:'ch',ch:'c',n:'l',l:'n',f:'h',h:'f',m:'n'}[l];if(near)others.add(near);
  shuffle(INI.map(x=>x.l)).forEach(x=>{if(others.size<3&&x!==l)others.add(x);});
  const o=[l,...[...others].slice(0,3)];return {q:'<div class="qq">С какой инициали начинается слог?</div>',snd:()=>playSyl(s.b,t),o,r:l,cls:'py',
   why:`Это <b>${sylS(s.b,t)}</b> — «${ruSyl(s.i,s.f)}».`,lab:'инициаль в '+sylS(s.b,t)};});}});}

/* № 13: как читается по-русски */
const ruleRu=`<div class="zwarn"><div class="k2">⚠️ Запомни</div><div class="h">После z c s zh ch sh: i = «ы»</div>
 <div class="zrow6 sm">${ZG.map(l=>`<button data-sy="${l}i|${firstT(l+'i')}" class="${noPuff(l,'i')?'hot':''}"><b>${l}i</b><small>«${YI[l]}»</small></button>`).join('')}</div>
 <p><b>ci</b> = «цы», <b>chi</b> = «чшы» — предыхание исчезает!</p></div>`;
function ruOpts(i,f){const r=ruSyl(i,f);if(f==='i'&&ZG.includes(i)){const alt={z:'цы',c:'сы',s:'шы',zh:'дзы',ch:'шы',sh:'сы'}[i];return [r,YI_WRONG[i],alt];}
 const o=new Set([r]);if(IN[i].pair)o.add(IN[IN[i].pair].ru+FN[f].ru);shuffle(INI).forEach(I=>{if(o.size<3&&I.l!==i)o.add(I.ru+FN[f].ru);});return [...o].slice(0,3);}
function ru(n){preload();quiz(n,{title:'🔤 Как читается по-русски?',intro:ruleRu,
 items:()=>{const zi=ZG.map(l=>SY.find(s=>s.b===l+'i')).filter(Boolean);const oth=shuffle(SY.filter(s=>!(s.f==='i'&&ZG.includes(s.i)))).slice(0,4);
  return shuffle(zi.concat(oth)).map(s=>{const t=rnd(tonesOf(s.b));const o=ruOpts(s.i,s.f);
   return {q:`<div class="qq">Как читается этот слог?</div><div class="big7">${sylS(s.b,t)}</div>`,o,r:o[0],cls:'tx ru',show:x=>'«'+esc(x)+'»',rshow:'«'+o[0]+'»',
    why:noPuff(s.i,s.f)?'Вместе с i выдох пропадает!':s.f==='i'&&ZG.includes(s.i)?'После z c s zh ch sh i = «ы».':'',after:()=>playSyl(s.b,t),wait:2000,lab:sylS(s.b,t)};});}});}

return {table,ini,ru};})();

route();
