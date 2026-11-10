/* ===================== Догоняем урок 7 · нумерованный список заданий ===================== */
const TASKS=[null,
 {t:'🃏 Карточки: пиньинь',d:'Найди пары: пиньинь и перевод',run:()=>memGame(1)},
 {t:'🀄 Карточки: иероглиф',d:'Иероглиф и перевод, без пиньиня',run:()=>memGame(2)},
 {t:'📖 Как устроены иероглифы',d:'Правила: ключ, значение и чтение, порядок черт + проверка',run:theoryHz},
 {t:'⚡ Блиц: правила иероглифов',d:'11 быстрых вопросов на время',run:blitz},
 {t:'✍️ Пропись 你 我 好 叫 妈 爸',d:'Обведи, а потом напиши по памяти',run:propis},
 {t:'👋 小美 и мои имена',d:'Послушай рассказ 小美 и узнай, как звучат твоё имя и имена родителей',run:aboutMe},
 {t:'📝 Контрольная',d:'你好！我叫… 我妈妈叫… 我爸爸叫… по памяти',run:test},
 {t:'🔤 Первая строчка инициалей',d:'b p m f d t n l g k h + финали · тест на слух',run:row1},
 {t:'⚠️ z c s zh ch sh · ci и chi',d:'Вторая строчка, главное правило ci = «цы», chi = «чшы» · тест',run:row2},
 {t:'🔨 Бей крота',d:'Игра на слух: обе строчки инициалей',run:krot}];
const NT=TASKS.length-1,LAST=NT;
let DONE={};try{DONE=JSON.parse(localStorage.getItem('zh-dg7-done')||'{}')}catch(e){}
const keep=()=>{try{localStorage.setItem('zh-dg7-done',JSON.stringify(DONE))}catch(e){}};
const HW='dg7';
const API=/workers\.dev$/.test(location.hostname)?'/api/dz/':'https://gruppa-deti.ch-tutor-world.workers.dev/api/dz/';
let S={};try{S=JSON.parse(localStorage.getItem('zh-dg7')||'{}')}catch(e){}
const keepS=()=>{try{localStorage.setItem('zh-dg7',JSON.stringify(S))}catch(e){}};S.queue=S.queue||[];
if(!S.par){for(const k of ['zh-u7','zh-u6','zh-dz6']){try{const o=JSON.parse(localStorage.getItem(k)||'{}');if(o.par&&o.par.mom&&o.par.dad){S.par={mom:o.par.mom,dad:o.par.dad};break;}}catch(e){}}}
const isTest=()=>/^(учитель|учительница|teacher|тест)$/i.test((S.name||'').trim());
function send(part,data){S.queue=S.queue.filter(q=>q.part!==part);S.queue.push({part,data:Object.assign({},data,{ts:Date.now()})});keepS();flush();}
async function flush(){if(isTest()){S.queue=[];keepS();return;}if(!S.sid||!S.queue.length)return;const q=S.queue[0];
 try{const r=await fetch(API+'save',{method:'POST',headers:{'Content-Type':'text/plain'},body:JSON.stringify({hw:HW,sid:S.sid,name:S.name,part:q.part,data:q.data})});
  if(!r.ok)throw 0;S.queue.shift();keepS();if(S.queue.length)flush();}catch(e){clearTimeout(flush._t);flush._t=setTimeout(flush,15000);}}
addEventListener('online',flush);
function finish(n,ok,of,extra){DONE[n]=ok+'/'+of;keep();send('t'+n,Object.assign({score:ok,of},extra||{}));}
const TOP='Догоняем урок 7';
const NAMEQ=new URLSearchParams(location.search).get('name');
function login(){$('#app').innerHTML=`<div class="top n"><span class="zh">补课</span><div><h1>${TOP}</h1><small>Урок 7 «Повторение» — всё, что было на уроке</small></div></div>
 <div class="main n" style="text-align:center"><h2>Как тебя зовут?</h2><p class="lead">Имя и первая буква фамилии, например <b>Маша П.</b> — как в домашке. Так учитель увидит твои результаты.</p>
 <input id="nm" class="in" style="width:100%;font:inherit;font-size:20px;padding:14px 18px;border:0;outline:none;margin-top:16px;color:var(--ink)" placeholder="Имя и буква фамилии" maxlength="40" value="${esc(NAMEQ||S.name||'')}">
 <div class="row" style="justify-content:center"><button class="btn" id="go">Начать →</button></div></div>`;
 const go=()=>{const v=$('#nm').value.trim();if(v.length<2){toast('Напиши имя');return;}S.name=v;S.sid=S.sid||(Date.now().toString(36)+Math.random().toString(36).slice(2,8));keepS();flush();route();};
 $('#go').onclick=go;$('#nm').onkeydown=e=>{if(e.key==='Enter')go();};}
const doneN=()=>TASKS.reduce((a,x,i)=>a+(x&&DONE[i]?1:0),0);
const pbar=()=>{const d=doneN(),p=Math.round(d*100/NT);return `<div class="pg n"><div class="pgt"><b>Готово ${d} из ${NT}</b><span>${p}%</span></div><div class="pgb"><i style="width:${p}%"></i></div><div class="pgd">${TASKS.map((x,i)=>x?`<a href="#${i}" class="${DONE[i]?'ok':''}" title="Задание № ${i}">${i}</a>`:'').join('')}</div></div>`;};
const shell=(h)=>{stopAll();$('#app').innerHTML=`<div class="top n"><span class="zh">补课</span><div><h1>${TOP}</h1><small>${isTest()?'🧑‍🏫 режим учителя — результаты не сохраняются':'Делай задания по порядку: № 1, № 2, № 3…'}</small></div><button class="back n" style="margin:0 0 0 auto;font-size:13px" id="me">${esc(S.name||'')} ✎</button></div>${pbar()}<div class="main n">${h}</div>`;
 $('#me').onclick=()=>login();scrollTo(0,0);};
const backBtn='<button class="back n" onclick="location.hash=\'\'">‹ Все задания</button>';
const tag=n=>`<span class="tag">Задание № ${n} из ${NT}</span>`;
let TM=[];const later=(f,ms)=>{const t=setTimeout(f,ms);TM.push(t);return t;};
let KCUR=null,RAF=0;
function stopAll(){if(KCUR){try{KCUR.destroy()}catch(e){}KCUR=null;}TM.forEach(clearTimeout);TM=[];cancelAnimationFrame(RAF);try{curA&&curA.pause()}catch(e){}}
const left=()=>TASKS.map((x,i)=>x&&!DONE[i]?i:0).filter(Boolean);
function home(){const nx=left()[0];
 shell(`<h2>Задания по порядку</h2><p class="lead">Ты пропустил(а) урок 7 — здесь всё, что было на уроке: правила, тестики, контрольная и игра. Делай <b>по номерам</b>, начиная с № 1. Сделанные отмечаются ✓.</p>
 <div class="list">${TASKS.map((x,i)=>{if(!x)return '';return `<button class="ti n${i===nx?' hot':''}" data-n="${i}"><span class="no" style="background:${DONE[i]?'var(--ok)':i===7?'#FF5C8A':'var(--ac)'}">${i}</span><span><b>${x.t}</b><small>${x.d}</small></span><span class="st${DONE[i]?'':' nd'}">${DONE[i]?'✓ '+DONE[i]:i===nx?'▶ сейчас':''}</span></button>`;}).join('')}</div>
 <button class="btn fin" id="fin">🏁 Мои итоги: что сделано и что осталось</button>`);
 document.querySelectorAll('[data-n]').forEach(b=>b.onclick=()=>{location.hash='#'+b.dataset.n;});$('#fin').onclick=()=>{location.hash='#itog';};}
function itog(){const L=left(),d=NT-L.length,p=Math.round(d*100/NT);
 if(!L.length)send('itog',{done:NT,of:NT});
 shell(`<h2>🏁 Мои итоги</h2>
  <div class="itg"><div class="itp" style="--p:${p}"><b>${p}%</b><small>готово</small></div><div><b style="font-size:20px;color:var(--ink)">Сделано ${d} из ${NT}</b><p class="lead" style="margin-top:4px">${L.length?'Почти! Осталось совсем немного 💪':'Ты догнал(а) урок 7! Все задания сделаны 🏆'}</p></div></div>
  ${L.length?`<div class="nd2"><div class="nd2h">❗ Ты ещё НЕ доделал(а):</div>${L.map(i=>`<button class="nd2i" data-n="${i}"><span class="no">${i}</span><span><b>Задание № ${i}</b> · ${TASKS[i].t}</span><span class="go">Сделать →</span></button>`).join('')}</div>`:''}
  <div class="dn2"><div class="dn2h">✓ Сделано:</div>${TASKS.map((x,i)=>x&&DONE[i]?`<div><span class="no">${i}</span>${x.t}<b>${DONE[i]}</b></div>`:'').join('')||'<div style="color:var(--mu)">Пока ничего — начни с № 1 🙂</div>'}</div>
  <div class="row" style="justify-content:center">${L.length?`<button class="btn" onclick="location.hash='#${L[0]}'">Сделать № ${L[0]} →</button>`:''}<button class="btn g" onclick="location.hash=''">‹ Все задания</button></div>`);
 document.querySelectorAll('.nd2i').forEach(b=>b.onclick=()=>{location.hash='#'+b.dataset.n;});}
function route(){if(!S.name){if(NAMEQ){S.name=NAMEQ;S.sid=S.sid||(Date.now().toString(36)+Math.random().toString(36).slice(2,8));keepS();}else return login();}
 const h=location.hash.slice(1);if(h==='itog')return itog();const n=+h;if(TASKS[n])TASKS[n].run();else home();}
addEventListener('hashchange',route);
// after a task: the next one by number; after the last — the summary of what is still not done
const doneBox=(n,inner,again)=>{const L=left().filter(i=>i!==n);const nx=L.find(i=>i>n)||L[0];
 return `${backBtn}${tag(n)}<h2>${TASKS[n].t} — готово!</h2>${inner}<div class="row">${nx?`<button class="btn" onclick="location.hash='#${nx}'">Задание № ${nx} →</button>`:`<button class="btn" onclick="location.hash='#itog'">🏁 Мои итоги</button>`}<button class="btn g" onclick="location.hash=''">‹ Все задания</button>${again!==false?`<button class="btn g" id="again">↺ Ещё раз</button>`:''}</div>`;};
const againOn=f=>{const a=$('#again');if(a)a.onclick=f;};

/* ---- characters drawn from stroke data: key (radical) pink, the rest blue ---- */
const RADFIX={'骂':[0,1,2,3,4,5]};
const hzSvg=(c,size,mode)=>{const D=(window.HZDATA||{})[c];if(!D)return `<span class="zh" style="font-size:${Math.round(size*.9)}px;line-height:1">${c}</span>`;const rad=RADFIX[c]||D.radStrokes||[];
 const col=i=>mode==='gray'?'#2B3270':mode&&mode[0]==='#'?mode:rad.includes(i)?'#FF5C8A':'#5B6BD8';
 return `<svg class="hzsv" viewBox="0 0 1024 1024" width="${size}" height="${size}" aria-label="${c}"><g transform="translate(0,900) scale(1,-1)">${D.strokes.map((d,i)=>`<path d="${d}" fill="${col(i)}"/>`).join('')}</g></svg>`;};
const PK='#FF5C8A',BL='#5B6BD8';

/* ---- pager: theory screens one by one, then the check ---- */
function pager(n,pages,onEnd,log){let k=0;
 const one=()=>{const [h,body,after]=pages[k];
  shell(`${backBtn}${tag(n)}<div class="pdots">${pages.map((_,j)=>`<i class="${j<k?'ok':j===k?'cur':''}"></i>`).join('')}<span>Правило ${k+1} из ${pages.length}</span></div><h2>${h}</h2>${body}
   <div class="row" style="justify-content:space-between">${k?'<button class="btn g" id="pv">‹ Назад</button>':'<span></span>'}<button class="btn" id="nx">${k<pages.length-1?'Понятно, дальше →':'✓ Понятно! К проверке →'}</button></div>`);
  document.querySelectorAll('[data-say]').forEach(b=>b.onclick=()=>playW(b.dataset.say,b));
  document.querySelectorAll('[data-syl]').forEach(b=>b.onclick=()=>playS(b.dataset.syl,b));
  document.querySelectorAll('[data-pure]').forEach(b=>b.onclick=()=>pure(b.dataset.pure,b));
  if(after)after();
  if(log)log[k]=1;
  if($('#pv'))$('#pv').onclick=()=>{k--;one();};$('#nx').onclick=()=>{k++;k<pages.length?one():onEnd();};};
 one();}
// the clean initial sound (teacher's recording b0, p0 …) or, for z c s zh ch sh, the syllable zi ci si…
const PURE_SYL={z:'zī',c:'cí',s:'sī',zh:'zhī',ch:'chī',sh:'shī'};
function pure(l,el){const k=l+'0';if(VOK&&VOK[k])return playURL(VOICE+k+'.wav',el);if(PURE_SYL[l])return playS(PURE_SYL[l],el);toast('Нет записи этого звука');}
// syllable audio is loaded ahead, so it sounds at once
const SYA={};
function sylURL(s){const k=vkey(s);if(VOK&&VOK[k])return VOICE+k+'.wav';const c=SYL.char(s);return c?fn(c):'';}
function preS(list){list.forEach(s=>{const u=sylURL(s);if(!u||SYA[u])return;const a=new Audio(u);a.preload='auto';try{a.load()}catch(e){}SYA[u]=a;});}
function sayS(s,el){const u=sylURL(s);if(!u)return Promise.resolve();const a=SYA[u];if(!a)return playURL(u,el);
 return new Promise(res=>{try{curA&&curA!==a&&curA.pause()}catch(e){}curA=a;el&&el.classList.add('on');let d=false;const end=()=>{if(d)return;d=true;el&&el.classList.remove('on');res();};
  try{a.currentTime=0}catch(e){}a.onended=end;a.onerror=end;a.play().catch(end);setTimeout(end,3000);});}

/* ---- quiz: questions by ear (hear a syllable, pick it) and questions on the rule ---- */
function quiz(n,title,rule,Q,done){let i=0,ok=0;const res=[],hist=[];
 preS(Q.filter(q=>q.ear).map(q=>q.ear).concat(Q.filter(q=>q.ear).flatMap(q=>q.o)));
 const ask=()=>{if(i>=Q.length)return done(ok,res);const q=Q[i];const [opts]=arrange(q.o,q.ear||q.o[0],hist);hist.push(opts.indexOf(q.ear||q.o[0]));let lock=false;const right=q.ear||q.o[0];window.__QA=right;
  shell(`${backBtn}${tag(n)}<h2>${title}</h2>${i===0?rule:''}<div class="qcard n"><div class="qhead"><span>Вопрос ${i+1} из ${Q.length}</span><span>✓ ${ok}</span></div><div class="dots">${Q.map((_,j)=>`<i class="${j<i?(res[j].ok?'ok':'no'):j===i?'cur':''}"></i>`).join('')}</div>
   ${q.ear?`<button class="play n" id="pl" aria-label="Послушать ещё раз">🔊</button><p class="hint2">Послушай и выбери слог${q.hint?' · '+q.hint:''}</p>`:`<div class="bqq">${q.q}</div>`}
   <div class="opts${opts.length===3?' o3':''}">${opts.map(x=>`<button class="opt ${q.ear?'':/^[\u4e00-\u9fff]+$/.test(x)?'zh':'tx'}" data-v="${esc(x)}">${esc(x)}</button>`).join('')}</div><div class="fb" id="fb"></div><div class="row" style="justify-content:center" id="nxr"></div></div>`);
  if(q.ear){const p=$('#pl');p.onclick=()=>sayS(q.ear,p);sayS(q.ear,p);}
  document.querySelectorAll('.opt').forEach(b=>b.onclick=async()=>{if(lock)return;lock=true;const v=b.dataset.v,good=v===right;if(good)ok++;
   res.push({q:q.ear?'🔊 '+q.ear:q.q.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim(),a:v,r:right,ok:good});
   document.querySelectorAll('.opt').forEach(o=>{o.disabled=true;if(o.dataset.v===right)o.classList.add('ok');else if(o===b)o.classList.add('no');});
   const fb=$('#fb');fb.className='fb '+(good?'ok':'no');fb.innerHTML=(good?'✓ Верно! ':'✗ Правильно: <b>'+esc(right)+'</b>. ')+(q.why||'');
   i++;if(good)later(ask,1300);else{$('#nxr').innerHTML=`${q.ear?'<button class="btn g" id="rp">🔊 Послушать ещё раз</button>':''}<button class="btn" id="go">Дальше →</button>`;if($('#rp'))$('#rp').onclick=()=>sayS(right,$('#rp'));$('#go').onclick=ask;}});};
 ask();}
const quizEnd=(n,ok,res,again,extra)=>{finish(n,ok,res.length,Object.assign({res,miss:res.filter(r=>!r.ok).map(r=>r.r)},extra||{}));
 shell(doneBox(n,`<div class="res" style="text-align:center">✓ ${ok} / ${res.length}</div><p class="lead" style="text-align:center">${ok===res.length?'Всё верно! 🏆':ok>=res.length*.7?'Отлично! Почти всё 💪':'Сделано! Ошибки можно повторить для закрепления 🙂'}</p>
  <div class="why">${res.map(r=>`<div class="${r.ok?'ok':''}">${r.ok?'✓':'✗'} ${esc(r.q)} — <b>${esc(r.r)}</b>${r.ok?'':' (ты выбрал(а): '+esc(r.a)+')'}</div>`).join('')}</div>`));againOn(again);};

/* ---- 3: how characters are built — theory + check ---- */
function theoryHz(){const n=3;const seen=[];
 const RAD=[['亻','rén','человек','🧍',['你']],['口','kǒu','рот','👄',['叫']],['女','nǚ','женщина','👩',['好','妈']],['父','fù','отец','👨',['爸']]];
 const pages=[
  ['🏯 Как устроены иероглифы',`<div class="tv">
    <div class="tvc n"><span class="tvn" style="background:#2DBE8C">1</span><b>Рисунок</b><div class="tve"><img src="../urok-7/img/ma-oracle.png" alt="древний знак" width="84" height="84"><span class="tva">→</span>${hzSvg('马',96,'gray')}</div><p>Древний рисунок стал иероглифом <span class="zh">马</span></p></div>
    <div class="tvc n"><span class="tvn" style="background:#F5A524">2</span><b>Смысл + смысл</b><div class="tve">${hzSvg('女',62,PK)}<span class="tva">+</span>${hzSvg('子',62,PK)}<span class="tva">=</span>${hzSvg('好',86,'gray')}</div><p>Женщина + ребёнок = <span class="zh">好</span> «хорошо». Обе части — <b style="color:${PK}">значение</b></p></div>
    <div class="tvc n hot"><span class="tvn" style="background:${BL}">3</span><b>Смысл + чтение</b><div class="tve">${hzSvg('女',62,PK)}<span class="tva">+</span>${hzSvg('马',62,BL)}<span class="tva">=</span>${hzSvg('妈',86)}</div><p>Одна часть — <b style="color:${PK}">значение</b>, другая — <b style="color:${BL}">чтение</b>. Таких иероглифов больше всего!</p></div></div>`],
  ['🔑 Ключ подсказывает смысл',`<div class="rk">${RAD.map(([r,p,ru,e,ex])=>`<div class="rkc n"><div class="rkt"><span class="rke">${e}</span><span class="zh rkr">${r}</span><span><b class="py" style="color:${BL};font-size:20px">${p}</b><br><b style="font-size:19px;color:var(--ink)">${ru}</b></span></div><div class="rkx">${ex.map(c=>`<button data-say="${c}" aria-label="${c}">${hzSvg(c,ex.length>2?62:78)}</button>`).join('')}</div></div>`).join('')}</div>
   <div class="big1">🔑 <b style="color:${PK}">Розовая часть</b> — ключ. Он чаще всего <b>слева</b> или <b>сверху</b></div>`],
  ['📐 Где значение, а где чтение',`<div class="vr"><div class="vrl"><span class="vrt" style="background:${PK}">🔑 ЗНАЧЕНИЕ</span><p>Ключ подсказывает, <b>о чём</b> иероглиф</p><small>чаще <b>слева</b> или <b>сверху</b></small></div>
    <div class="vrc">${hzSvg('妈',170)}</div>
    <div class="vrl"><span class="vrt" style="background:${BL}">🔊 ЧТЕНИЕ</span><p>Другая часть подсказывает, <b>как читать</b></p><small>чаще <b>справа</b> или <b>снизу</b></small></div></div>
   <div class="big1"><span class="zh" style="font-size:30px">妈</span> = <b style="color:${PK}">女</b> женщина (мама — женщина) + <b style="color:${BL}">马</b> звучит <b>mǎ</b> → читается <b>mā</b></div>
   <div class="exr">${['妈','爸'].map(c=>`<button data-say="${c}">${hzSvg(c,80)}</button>`).join('')}</div><p class="lead" style="text-align:center">Так устроено <b>больше 80%</b> иероглифов!</p>`],
  ['👨‍👩‍👧 Часть-чтение подсказывает звук',[['马','mǎ','妈','mā','мама'],['巴','bā','爸','bà','папа']].map(([h,hp,z,p,r])=>`<div class="fm"><div class="fmh">${hzSvg(h,74,BL)}<b>🔊 звучит ${hp}</b></div><span class="tva">→</span><button class="fmc n" data-say="${z}">${hzSvg(z,90)}<span class="py" style="color:${TCOL[toneOf(p)]}">${p}</span><small>${r}</small></button></div>`).join('')+'<p class="lead" style="text-align:center">Синяя часть — подсказка, <b>как читать</b>. Тон может отличаться, а звук похожий 🔊</p>'],
  ['✏️ Порядок черт: 6 правил',`<div class="so">${[['三','Сверху вниз'],['川','Слева направо'],['十','Сначала горизонталь, потом вертикаль'],['人','Сначала влево, потом вправо'],['日','Сначала рамка, потом внутри, «дверь» в конце'],['小','Сначала середина, потом бока']].map(([c,t],i)=>`<button class="soc n" data-an="${c}"><span class="sow" id="so${i}"></span><span><small>Правило ${i+1}</small><b>${t}</b><em>▶ нажми — покажу</em></span></button>`).join('')}</div>`,
   ()=>{document.querySelectorAll('[data-an]').forEach((b,i)=>{const el=b.querySelector('.sow');let w=null;try{w=HanziWriter.create(el,b.dataset.an,{width:84,height:84,padding:6,showOutline:true,strokeColor:'#2B3270',outlineColor:'#E1E5EE',strokeAnimationSpeed:1.1,delayBetweenStrokes:280,charDataLoader:(ch,ok)=>ok(HZDATA[ch])});}catch(e){el.innerHTML=`<span class="zh" style="font-size:64px">${b.dataset.an}</span>`;}
    b.onclick=()=>{if(w)w.animateCharacter();};});}],
  ['🀄 Наши 6 иероглифов',`<div class="bh">${[['你','nǐ','ты','亻 человек'],['我','wǒ','я',''],['好','hǎo','хорошо','女 + 子'],['叫','jiào','зваться','口 рот'],['妈','mā','мама','女 + 马'],['爸','bà','папа','父 + 巴']].map(([c,p,r,pt])=>`<button class="bhc n" data-say="${c}">${hzSvg(c,84)}<span class="py" style="color:${TCOL[toneOf(p)]};font-size:22px">${p}</span><b>${r}</b>${pt?`<small class="zh">${pt}</small>`:''}</button>`).join('')}</div>`]];
 const Q=[{q:`${hzSvg('妈',110)}<br>Какая часть подсказывает <b>значение</b>?`,o:['女','马'],why:'女 «женщина» — ключ: мама — женщина.'},
  {q:`${hzSvg('爸',110)}<br>Какая часть подсказывает <b>чтение</b>?`,o:['巴','父'],why:'巴 звучит bā — поэтому 爸 читается bà.'},
  {q:`${hzSvg('叫',110)}<br>Где здесь <b>ключ</b>?`,o:['口 рот','女 женщина'],why:'口 «рот» — ключ: звать — это делает рот.'},
  {q:`${hzSvg('好',110)}<br>好 = 女 + 子. Как он устроен?`,o:['обе части — значение','одна часть — чтение'],why:'Женщина + ребёнок = «хорошо». Здесь нет части-чтения.'},
  {q:'<span class="zh" style="font-size:60px">妈</span><br>Почему 妈 читается <b>mā</b>?',o:['справа 马 — звучит mǎ','слева 女 — звучит nǚ'],why:'Часть-чтение 马 справа подсказывает звук ma.'},
  {q:'Ключ <span class="zh" style="font-size:40px;color:#FF5C8A">口</span> «рот». Какой иероглиф значит «<b>зваться</b>»?',o:['叫','你','好'],why:'Звать — это делает рот: 叫 с ключом 口.'},
  {q:'Ключ <span class="zh" style="font-size:40px;color:#FF5C8A">亻</span> «человек». Какой иероглиф значит «<b>ты</b>»?',o:['你','妈','叫'],why:'Ты — человек: 你 с ключом 亻.'},
  {q:'Где чаще всего стоит <b>ключ</b>?',o:['слева или сверху','справа или снизу'],why:'Ключ чаще слева (妈, 你) или сверху (爸).'}];
 pager(n,pages,()=>{shell(`${backBtn}${tag(n)}<h2>🧠 Проверка: 8 вопросов</h2><p class="lead">Теперь проверим, что запомнилось. Ошибся — не страшно, покажем правильный ответ.</p><div class="row" style="justify-content:center"><button class="btn" id="st">Начать проверку →</button></div>`);
  $('#st').onclick=()=>quiz(n,'🧠 Как устроены иероглифы','',Q,(ok,res)=>quizEnd(n,ok,res,theoryHz,{seen:seen.length}));},seen);}

/* ---- 6: 小美 tells about herself + my own names ---- */
const XM=[['你好！','nǐ hǎo!','Привет!'],['我叫小美。','wǒ jiào Xiǎo Měi.','Меня зовут Сяо Мэй.'],['我妈妈叫王丽。','wǒ māma jiào Wáng Lì.','Мою маму зовут Ван Ли.'],['我爸爸叫李大明。','wǒ bàba jiào Lǐ Dàmíng.','Моего папу зовут Ли Дамин.']];
function aboutMe(){const n=6;
 shell(`${backBtn}${tag(n)}<h2>👋 小美 рассказывает о себе</h2><div class="rbox" style="--c1:#FF5C8A;--c2:#8E5BE8"><b>Сначала послушай</b>Нажми на каждую строчку и повтори вслух за 小美. Потом ответишь на 4 вопроса и сделаешь такой же рассказ о себе.</div>
  <div class="xmw"><img src="../urok-7/img/xiaomei.jpg" alt="小美" class="xmp"><button class="btn" id="all">▶ Весь рассказ</button></div>
  <div class="ab xm6">${XM.map(([z,p,r])=>`<div class="abr n"><div class="abz"><span class="zh">${z}</span></div><div class="abp">${tpy2(p)}</div><small>${r}</small><button class="btn g abs" data-g="${z}">🔊</button></div>`).join('')}</div>
  <div class="row" style="justify-content:center"><button class="btn" id="go">Я послушал(а) → вопросы</button></div>`);
 document.querySelectorAll('[data-g]').forEach(b=>b.onclick=()=>girl(b.dataset.g,b));
 $('#all').onclick=async()=>{const b=$('#all');for(const [z] of XM){if(!document.body.contains(b))return;await girl(z,b);}};
 const Q=[{q:'Как зовут девочку?',o:['Xiǎo Měi','Wáng Lì','Lǐ Dàmíng'],why:'我叫小美 — меня зовут Сяо Мэй.'},
  {q:'Как зовут её <b>маму</b>?',o:['Wáng Lì','Xiǎo Měi','Lǐ Dàmíng'],why:'我妈妈叫王丽 — мою маму зовут Ван Ли.'},
  {q:'Как зовут её <b>папу</b>?',o:['Lǐ Dàmíng','Wáng Lì','Xiǎo Měi'],why:'我爸爸叫李大明 — моего папу зовут Ли Дамин.'},
  {q:'Что значит <span class="zh" style="font-size:34px">我妈妈叫…</span>?',o:['Мою маму зовут…','Меня зовут…','Моего папу зовут…'],why:'妈妈 — мама, 叫 — зваться.'}];
 $('#go').onclick=()=>quiz(n,'👋 Вопросы про 小美','',Q,(ok,res)=>{S.q6={ok,res};keepS();
  shell(`${backBtn}${tag(n)}<h2>✓ Вопросы: ${ok} из ${res.length}</h2><p class="lead">А теперь твой рассказ! Напиши, как зовут маму и папу (только имя) — мы запишем твоё имя и их имена по-китайски.</p><div id="nf"></div>`);
  nameForm($('#nf'),()=>{const P=S.par;P.me=meName();
   shell(`${backBtn}${tag(n)}<h2>👋 Мой рассказ</h2><p class="lead">Имена подсвечены — так они <b>читаются</b> по-китайски. Нажми 🔊 и повтори вслух 2–3 раза. Этот рассказ будет в контрольной (№ 7)!</p>${bigCard(P)}<div class="row" style="justify-content:center"><button class="btn" id="ok">✓ Готово — я запомнил(а)</button></div>`);
   const wire=()=>{document.querySelectorAll('[data-free]').forEach(b=>b.onclick=()=>playFree(b.dataset.free,b));$('#all').onclick=()=>playFree(`你好！我叫${P.me.hz}。我妈妈叫${P.mom.hz}。我爸爸叫${P.dad.hz}。`,$('#all'));};wire();
   $('#ok').onclick=()=>{finish(n,ok,res.length,{res,miss:res.filter(r=>!r.ok).map(r=>r.r),me:P.me.hz,mom:P.mom.hz,dad:P.dad.hz});
    shell(doneBox(n,`<p class="lead">Вопросы про 小美: <b>${ok} из ${res.length}</b>. Твой рассказ:</p>${bigCard(P)}`,false));wire();};});});}

/* ---- 8: first row of initials ---- */
const R1=['b','p','m','f','d','t','n','l','g','k','h'];
const RU1={b:'б',p:'п 💨',m:'м',f:'ф',d:'д',t:'т 💨',n:'н',l:'л',g:'г',k:'к 💨',h:'х'};
const syl1=(b,f)=>{for(const t of [1,2,3,4]){const s=mark(b+f,t);if(SYL.char(s))return s;}return '';};
const ftab=(ins,fins,note)=>`<div class="ftw"><table class="ft"><tr><th></th>${fins.map(f=>`<th>${f}${note&&note[f]?`<small>${note[f]}</small>`:''}</th>`).join('')}</tr>${ins.map(b=>`<tr><th>${b}</th>${fins.map(f=>{const s=syl1(b,f);return `<td>${s?`<button data-syl="${s}">${s}</button>`:''}</td>`;}).join('')}</tr>`).join('')}</table></div>`;
function row1(){const n=8;
 const pages=[['🔤 Первая строчка инициалей',`<div class="ini">${R1.map(l=>`<button class="inic n${'ptk'.includes(l)?' hot':''}" data-pure="${l}"><b>${l}</b><small>${RU1[l]}</small></button>`).join('')}</div>
   <div class="rbox" style="--c1:#5B6BD8;--c2:#2B3270"><b>💨 Предыхательные: p t k</b>Говорим с сильной струёй воздуха — поднеси ладонь ко рту и почувствуешь «ветер». <br><b style="display:inline">b d g</b> — непредыхательные: воздуха почти нет.</div>
   <div class="prs">${[['b','p'],['d','t'],['g','k']].map(([a,b])=>`<div class="pr n"><button data-pure="${a}">${a}</button><span>—</span><button data-pure="${b}" class="hot">${b} 💨</button></div>`).join('')}</div>`],
  ['🧩 Подставляем финали: ba bo bu bi…',`<p class="lead">К каждой инициали подставляем финали <b>a o e i u</b>. Нажми на слог — послушай и повтори вслух.</p>${ftab(R1,['a','o','e','i','u'])}`],
  ['👂 Предыхательные и нет — слушаем пары',`<p class="lead">Нажимай по очереди и слушай разницу: справа — <b>предыхательные 💨</b>.</p><div class="prs2">${[['bā','pā'],['bō','pō'],['bǐ','pǐ'],['bù','pù'],['dā','tā'],['dí','tí'],['dù','tù'],['dé','tè'],['gē','kē'],['gǔ','kǔ']].map(([a,b])=>`<div class="pr n"><button data-syl="${a}">${a}</button><span>—</span><button data-syl="${b}" class="hot">${b} 💨</button></div>`).join('')}</div>`]];
 const ears=[['bā','pā','p — предыхательный 💨'],['dí','tí','t — предыхательный 💨'],['gǔ','kǔ','k — предыхательный 💨'],['pō','bō','p — предыхательный 💨'],['dù','tù','d — непредыхательный'],['kē','gē','k — предыхательный 💨'],['mā','fā',''],['nǐ','lǐ',''],['hē','kē',''],['bù','pù','b — непредыхательный'],['tā','dā','t — предыхательный 💨'],['fū','hū','']];
 const Q=shuffle(ears).map(([a,b,why])=>({ear:a,o:[a,b],why}));Q.splice(5,0,{q:'Какие инициали — <b>предыхательные 💨</b>?',o:['p t k','b d g','m n l'],why:'p t k — с сильной струёй воздуха.'});
 pager(n,pages,()=>{preS(Q.filter(q=>q.ear).flatMap(q=>q.o));shell(`${backBtn}${tag(n)}<h2>🎧 Тест на слух</h2><p class="lead">Ты услышишь слог — выбери, какой это. Нажми 🔊, чтобы послушать ещё раз. Сделай звук погромче!</p><div class="row" style="justify-content:center"><button class="btn" id="st">🎧 Начать тест →</button></div>`);
  $('#st').onclick=()=>quiz(n,'🎧 Первая строчка: какой слог?','',Q,(ok,res)=>quizEnd(n,ok,res,row1));});}

/* ---- 9: z c s zh ch sh, ci = «цы», chi = «чшы» ---- */
function row2(){const n=9;
 const IN2=[['z','дз'],['c','цх 💨'],['s','с'],['zh','дж'],['ch','чх 💨'],['sh','ш']];
 const pages=[['🔤 Вторая строчка: z c s zh ch sh',`<div class="ini i6">${IN2.map(([l,r])=>`<button class="inic n${l==='c'||l==='ch'?' hot':''}" data-pure="${l}"><b>${l}</b><small>${r}</small></button>`).join('')}</div>`],
  ['📋 Все правила — коротко',`<div class="cr">
    <div class="crc" style="--a:#2DBE8C;--b:#1E8F69"><div class="cri">👅</div><b>Где язык?</b><span><b>z c s</b> — кончик языка у зубов</span><span><b>zh ch sh</b> — язык загнут вверх</span></div>
    <div class="crc" style="--a:#5B6BD8;--b:#3B48A8"><div class="cri">💨</div><b>Предыхательные</b><span><b>c</b> и <b>ch</b> — предыхательные 💨, как p t k</span><span><b>z zh s sh</b> — непредыхательные</span></div>
    <div class="crc" style="--a:#F5A524;--b:#E07B12"><div class="cri">🔤</div><b>i читается «ы»</b><span><b>zi</b> «дзы» · <b>si</b> «сы»</span><span><b>zhi</b> «джы» · <b>shi</b> «шы»</span></div></div>
   <div class="big1" style="background:#FFE3EB;color:#B0284F">⚠️ А про <b>ci</b> и <b>chi</b> — отдельное правило! Жми «дальше» 👉</div>`],
  ['⚠️ Самое важное правило',`<div class="hotr"><div class="hotk">⚠️ Запомни!</div><div class="hoth">c + i и ch + i:<br>ПРЕДЫХАНИЕ ИСЧЕЗАЕТ!</div><div class="hots">Сами по себе <b>c</b> и <b>ch</b> предыхательные 💨. Но с финалью <b>i</b> они <b>теряют предыхание</b> и меняют звучание:</div></div>
   <div class="cf">${[['c','«цх» 💨','ci','«цы»','cí'],['ch','«чх» 💨','chi','«чшы»','chī']].map(([a,ar,c,cr,s])=>`<div class="cfr n"><div class="cfp"><b>${a}</b><small>${ar}</small></div><span class="cfo">+</span><div class="cfp"><b>i</b><small>«ы»</small></div><span class="cfo">=</span><button class="cfp res" data-syl="${s}"><b>${c}</b><small>${cr}</small><span class="np">без 💨!</span></button></div>`).join('')}</div>
   <div class="exs">Примеры: ${['cí','cì','cǐ','chī','chí','chǐ'].map(s=>`<button data-syl="${s}">${s}</button>`).join('')}</div>`],
  ['👂 Слушаем разницу',`<p class="lead">Слева — с предыханием 💨, справа — <b>ci</b> и <b>chi</b> без предыхания.</p><div class="prs2">${[['cā','cí'],['cù','cǐ'],['chā','chī'],['chū','chí']].map(([a,b])=>`<div class="pr n"><button data-syl="${a}">${a} 💨</button><span>vs</span><button data-syl="${b}" class="hot">${b}</button></div>`).join('')}</div>
   <p class="lead" style="text-align:center"><b>ci</b> = «цы» · <b>chi</b> = «чшы»</p>`],
  ['🧩 Подставляем финали: za ze zu zi…',`<p class="lead">Нажми на слог — послушай и повтори вслух.</p>${ftab(['z','c','s','zh','ch','sh'],['a','e','u','i'],{i:'«ы»'})}`]];
 const ears=[['zā','cā','c — предыхательный 💨'],['chā','zhā','ch — предыхательный 💨'],['sā','shā','sh — язык загнут вверх'],['cū','zū','c — предыхательный 💨'],['zhū','chū','zh — непредыхательный'],['shì','sì','sh — язык загнут вверх'],['zì','cì','ci = «цы», zi = «дзы»'],['chī','zhī','chi = «чшы», zhi = «джы»'],['cí','chí','ci = «цы», chi = «чшы»'],['sū','shū','s — кончик языка у зубов']];
 const Q=shuffle(ears).map(([a,b,why])=>({ear:a,o:[a,b],why}));
 Q.splice(2,0,{q:'Как читается <b>ci</b>?',o:['«цы»','«сы»','«дзы»'],why:'ci = «цы» — предыхание исчезает.'});
 Q.splice(5,0,{q:'Как читается <b>chi</b>?',o:['«чшы»','«шы»','«джы»'],why:'chi = «чшы» — предыхание исчезает.'});
 Q.splice(8,0,{q:'В слоге <b>ci</b> есть предыхание 💨?',o:['нет, оно исчезает','да, есть 💨'],why:'c + i и ch + i — предыхание исчезает!'});
 Q.splice(11,0,{q:'А в слоге <b>cā</b> предыхание есть?',o:['да, есть 💨','нет'],why:'c сама по себе — предыхательная 💨. Исчезает только перед i.'});
 pager(n,pages,()=>{preS(Q.filter(q=>q.ear).flatMap(q=>q.o));shell(`${backBtn}${tag(n)}<h2>🎧 Тест: z c s zh ch sh</h2><div class="hotr sm"><div class="hoth">ci = «цы» · chi = «чшы»</div><div class="hots">предыхание исчезает!</div></div><p class="lead">Слушай слог и выбирай. Есть и вопросы на правило.</p><div class="row" style="justify-content:center"><button class="btn" id="st">🎧 Начать тест →</button></div>`);
  $('#st').onclick=()=>quiz(n,'🎧 z c s zh ch sh: какой слог?','',Q,(ok,res)=>quizEnd(n,ok,res,row2));});}
