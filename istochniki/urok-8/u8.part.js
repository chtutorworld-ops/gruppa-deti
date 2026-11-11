/* ===================== УРОК 8 · задания на телефоне ===================== */
// Задания — нумерованный список (не станции!). Те же номера — на слайдах и в кабинете учителя.
const TASKS=[null,
 {t:'🔨 Крот: тоны',d:'Бей слог нужного тона. Позвали отвечать — нажми «Пауза»',run:krot},
 {t:'🎵 Диктант на тоны',d:'Учитель читает 10 слогов — нажми значок тона',run:dict2},
 {t:'📝 Диктант: пиши слоги',d:'12 слогов: напиши латиницей и поставь значок тона',run:dict3},
 {t:'✍️ Пропись: 他 她 它 们 您',d:'Обведи новые иероглифы, потом напиши сам',run:propis},
 {t:'📋 Таблица местоимений',d:'Заполни таблицу от руки и поставь тоны',run:table},
 {t:'🎙️ Прочитай таблицу',d:'Запиши себя голосом — учитель послушает',run:recTab},
 {t:'🧩 Собери местоимения',d:'7.1 перевод · 7.2 три корзинки',run:cards},
 {t:'🃏 Мемори-финал',d:'Все наши иероглифы и их перевод',run:memo}];
const NT=TASKS.length-1;
const HW='u8';
let DONE={};try{DONE=JSON.parse(localStorage.getItem('zh-u8-done')||'{}')}catch(e){}
const keep=()=>{try{localStorage.setItem('zh-u8-done',JSON.stringify(DONE))}catch(e){}};
const API=/workers\.dev$/.test(location.hostname)?'/api/dz/':'https://gruppa-deti.ch-tutor-world.workers.dev/api/dz/';
let S={};try{S=JSON.parse(localStorage.getItem('zh-u8')||'{}')}catch(e){}
const keepS=()=>{try{localStorage.setItem('zh-u8',JSON.stringify(S))}catch(e){}};S.queue=S.queue||[];
const isTest=()=>/^(учитель|учительница|teacher|тест)$/i.test((S.name||'').trim());
function send(part,data){S.queue=S.queue.filter(q=>q.part!==part);S.queue.push({part,data:Object.assign({},data,{ts:Date.now()})});keepS();flush();}
async function flush(){if(isTest()){S.queue=[];keepS();return;}if(!S.sid||!S.queue.length)return;const q=S.queue[0];
 try{const r=await fetch(API+'save',{method:'POST',headers:{'Content-Type':'text/plain'},body:JSON.stringify({hw:HW,sid:S.sid,name:S.name,part:q.part,data:q.data})});
  if(!r.ok)throw 0;S.queue.shift();keepS();if(S.queue.length)flush();}catch(e){clearTimeout(flush._t);flush._t=setTimeout(flush,15000);}}
addEventListener('online',flush);
async function upload(item,blob){if(isTest())return true;if(!S.sid)return false;
 for(let k=0;k<3;k++){try{const r=await fetch(API+'audio?hw='+HW+'&sid='+encodeURIComponent(S.sid)+'&item='+item,{method:'POST',headers:{'Content-Type':blob.type||'audio/webm'},body:blob});if(r.ok)return true;}catch(e){}await new Promise(r=>setTimeout(r,1500*(k+1)));}
 return false;}
function finish(n,ok,of,extra){const prev=DONE[n];const best=prev?Math.max(ok,+String(prev).split('/')[0]||0):ok;DONE[n]=best+'/'+of;keep();send('t'+n,Object.assign({score:ok,of,best},extra||{}));}
const TOP='Задания урока 8';
const NAMEQ=new URLSearchParams(location.search).get('name');
function login(){$('#app').innerHTML=`<div class="top n"><span class="zh">课堂任务</span><div><h1>${TOP}</h1><small>Сначала напиши своё имя</small></div></div>
 <div class="main n" style="text-align:center"><h2>Как тебя зовут?</h2><p class="lead">Имя и первая буква фамилии, например <b>Маша П.</b> — как всегда. Так учитель увидит твои результаты.</p>
 <input id="nm" class="in" style="width:100%;font:inherit;font-size:20px;padding:14px 18px;border:0;outline:none;margin-top:16px;color:var(--ink)" placeholder="Имя и буква фамилии" maxlength="40" value="${esc(NAMEQ||S.name||'')}">
 <div class="row" style="justify-content:center"><button class="btn" id="go">Начать →</button></div></div>`;
 const go=()=>{const v=$('#nm').value.trim();if(v.length<2){toast('Напиши имя');return;}S.name=v;S.sid=S.sid||(Date.now().toString(36)+Math.random().toString(36).slice(2,8));keepS();flush();location.hash='';route();};
 $('#go').onclick=go;$('#nm').onkeydown=e=>{if(e.key==='Enter')go();};}
const nDone=()=>Object.keys(DONE).filter(k=>TASKS[+k]).length;
const pbar=()=>{const d=nDone(),pc=Math.round(d*100/NT);return `<div class="pbar n" id="pbar"><div class="pbt"><span>Выполнено <b>${d}</b> из ${NT}</span><b>${pc}%</b></div><div class="pbl"><i style="width:${pc}%"></i></div></div>`;};
const shell=(h)=>{stopAll();$('#app').innerHTML=`<div class="top n"><span class="zh">课堂任务</span><div><h1>${TOP}</h1><small>${isTest()?'🧑‍🏫 режим учителя — результаты не сохраняются':'Я, ты, он, она — местоимения'}</small></div><button class="back n" style="margin:0 0 0 auto;font-size:13px" id="me">${esc(S.name||'')} ✎</button></div>${pbar()}<div class="main n">${h}</div>`;
 $('#me').onclick=()=>login();scrollTo(0,0);};
const backBtn='<button class="back n" onclick="location.hash=\'\'">‹ Все задания</button>';
const tag=n=>`<span class="tag">Задание № ${n}</span>`;
let TM=[];const later=(f,ms)=>{const t=setTimeout(f,ms);TM.push(t);return t;};
let KCUR=null,RAF=0,STREAM=null,REC=null;
function stopAll(){if(KCUR){try{KCUR.destroy()}catch(e){}KCUR=null;}TM.forEach(clearTimeout);TM=[];cancelAnimationFrame(RAF);try{curA&&curA.pause()}catch(e){}try{REC&&REC.state==='recording'&&REC.stop()}catch(e){}document.querySelectorAll('.dg8').forEach(x=>x.remove());}
const left=()=>TASKS.map((x,i)=>x&&!DONE[i]?i:0).filter(Boolean);
const leftBox=()=>{const L=left();if(!L.length)return `<div class="allok">🏆 Все ${NT} заданий сделаны! Ты супер!</div>`;
 return `<div class="left"><h3>⏳ Ещё не доделано (${L.length}):</h3>${L.map(i=>`<button data-go="${i}"><span class="no">${i}</span><span>${TASKS[i].t}</span><small>Сделать →</small></button>`).join('')}</div>`;};
const leftOn=()=>document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>{location.hash='#'+b.dataset.go;});
function home(){const nx=TASKS.findIndex((x,i)=>x&&!DONE[i]);
 shell(`<h2>Задания по порядку</h2><p class="lead">Учитель скажет, <b>какой номер</b> открыть. Сделанные отмечаются ✓, шкала наверху показывает, сколько готово.</p>
 <div class="list">${TASKS.map((x,i)=>{if(!x)return '';return `<button class="ti n${i===nx?' hot':''}${DONE[i]?'':' todo'}" data-n="${i}"><span class="no" style="${DONE[i]?'background:var(--ok)':i===nx?'background:var(--ac)':''}">${i}</span><span><b>${x.t}</b><small>${x.d}</small></span><span class="sc7">${DONE[i]?'✓ '+DONE[i]:''}</span></button>`;}).join('')}</div>
 <div class="row" style="justify-content:center"><button class="btn" id="it">🏁 Мои итоги</button></div>`);
 document.querySelectorAll('[data-n]').forEach(b=>b.onclick=()=>{location.hash='#'+b.dataset.n;});$('#it').onclick=()=>{location.hash='#itogi';};}
function itogi(){const L=left();send('itogi',{done:nDone(),of:NT,left:L});const D=TASKS.map((x,i)=>x&&DONE[i]?i:0).filter(Boolean);
 shell(`${backBtn}<h2>🏁 Мои итоги</h2><p class="lead">Сделано <b>${nDone()} из ${NT}</b> заданий.</p>${leftBox()}
  ${D.length?`<h3>✓ Сделано</h3><div class="list">${D.map(i=>`<button class="ti n" data-n="${i}"><span class="no" style="background:var(--ok)">${i}</span><span><b>${TASKS[i].t}</b><small>можно пройти ещё раз</small></span><span class="sc7">✓ ${DONE[i]}</span></button>`).join('')}</div>`:''}
  ${L.length?'':'<p class="lead" style="text-align:center">Учитель видит твои результаты. До встречи! 👋</p>'}`);
 document.querySelectorAll('[data-n]').forEach(b=>b.onclick=()=>{location.hash='#'+b.dataset.n;});leftOn();}
function route(){if(!S.name){if(NAMEQ){S.name=NAMEQ;S.sid=S.sid||(Date.now().toString(36)+Math.random().toString(36).slice(2,8));keepS();}else return login();}
 const h=location.hash.slice(1);if(h==='itogi')return itogi();const n=+h;if(TASKS[n])TASKS[n].run();else home();}
addEventListener('hashchange',route);
const nextN=n=>{for(let i=n+1;i<=NT;i++)if(!DONE[i])return i;for(let i=1;i<n;i++)if(!DONE[i])return i;return 0;};
const doneBox=(n,inner,again)=>{const nx=nextN(n);return `${backBtn}${tag(n)}<h2>${TASKS[n].t} — готово!</h2>${inner}<div class="row">${nx?`<button class="btn" onclick="location.hash='#${nx}'">Задание № ${nx} →</button>`:`<button class="btn" onclick="location.hash='#itogi'">🏁 Мои итоги</button>`}<button class="btn g" onclick="location.hash=''">‹ Все задания</button>${again!==false?`<button class="btn g" id="again">↺ Ещё раз</button>`:''}</div>${nx?'':leftBox()}`;};
const againOn=f=>{const a=$('#again');if(a)a.onclick=f;};
const plural=(k,a,b,c)=>k%10===1&&k%100!==11?a:k%10>=2&&k%10<=4&&(k%100<12||k%100>14)?b:c;

/* ---- tone marks ---- */
const MKP=['','M8 30 H72','M16 46 L64 12','M10 14 L40 46 L70 14','M16 12 L64 46'];
const msv=(t,c,h)=>t?`<svg viewBox="0 0 80 60" style="height:${h||'1em'};width:auto;vertical-align:middle;overflow:visible"><path d="${MKP[t]}" fill="none" stroke="${c||'currentColor'}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/></svg>`:`<span style="font:900 ${h||'1em'}/1 Nunito;vertical-align:middle">•</span>`;
const TCV=['#8A93AE','#1FA77A','#E8910C','#6A5BFF','#F0407A'];
const TSAY=['','ровная дорожка: голос высоко и ровно','горка вверх: голос поднимается, как в вопросе «а?»','ямка: голос опускается вниз и снова поднимается','будто падает вниз: резко, как «Стоп!»'];
const TSH=['лёгкий тон, без значка','1-й тон — ровно','2-й тон — вверх','3-й тон — ямка','4-й тон — вниз'];
const plainS=s=>s.normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/ü/g,'ü');
const toneS=s=>{const m=s.normalize('NFD');if(/̄/.test(m))return 1;if(/́/.test(m))return 2;if(/̌/.test(m))return 3;if(/̀/.test(m))return 4;return 0;};
const TLEG=`<div class="tleg">${[1,2,3,4].map(t=>`<div style="--tc:${TCV[t]}"><span>${msv(t,'#fff','30px')}</span><small>${['','ровно','вверх','ямка','вниз'][t]}</small></div>`).join('')}</div>`;
// explanation for a wrong tone (Daria: «прозвучал 4 тон, его значок вот такой — будто падает вниз»)
const toneWhy=(r,c)=>`Прозвучал <b>${r?r+'-й тон':'лёгкий тон'}</b> — ${r?`его значок вот такой <span class="mkb" style="--tc:${TCV[r]}">${msv(r,'#fff','24px')}</span>: ${TSAY[r]}.`:'значка нет совсем: коротко и тихо.'}${c!=null&&c!==r?` А ты выбрал(а) <span class="mkb" style="--tc:${TCV[c]}">${msv(c,'#fff','24px')}</span> — это ${TSH[c]}.`:''}`;
const sayS=(s,el)=>{el&&el.classList.add('on');return playS(s,el).then(()=>el&&el.classList.remove('on'));};

/* ---- 1: the mole game (tones of the first row) ---- */
const KVA={};
function kpre(g){(g.audio||[]).forEach(c=>{if(KVA[c])return;const a=new Audio(fn(c));a.preload='auto';try{a.load();}catch(e){}KVA[c]=a;});}
window.KSAY=t=>new Promise(res=>{let a=KVA[t];if(!a){a=new Audio(fn(t));KVA[t]=a;}try{curA&&curA!==a&&curA.pause();}catch(e){}curA=a;let d=false;const end=()=>{if(!d){d=true;res();}};
 try{a.currentTime=0;}catch(e){}a.onended=end;a.onerror=end;a.play().catch(end);setTimeout(end,2500);});
window.KSTOP=()=>{try{curA&&curA.pause()}catch(e){}};
const KCSS={};
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
 wrap.addEventListener('pointerdown',e=>{if(isFull()||!matchMedia('(max-width:899px),(max-height:520px)').matches)return;e.stopPropagation();e.preventDefault();const bt=e.target.closest&&e.target.closest('button');full(true);if(bt)setTimeout(()=>bt.click(),80);},true);
 const onR=()=>{fit();setTimeout(fit,250);};addEventListener('resize',onR);addEventListener('orientationchange',onR);
 KAT.onResult=(gid,r)=>{if(onRes)onRes(r);};
 const inst=g.mount(stage,KAT)||{};stage._inst=inst;
 KCUR={full,destroy(){ro.disconnect();removeEventListener('resize',onR);removeEventListener('orientationchange',onR);document.removeEventListener('fullscreenchange',onFs);document.removeEventListener('webkitfullscreenchange',onFs);
  if(isFull()){try{if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});}catch(e){}}document.documentElement.classList.remove('knoscroll');wrap.remove();try{inst.destroy&&inst.destroy()}catch(e){}}};
 return stage;}
function krot(){const n=1;
 shell(`${backBtn}${tag(n)}<h2>🔨 Крот: тоны</h2>
  <div class="rbox" style="--c1:#5B6BD8;--c2:#2DBE8C"><b>Как играть</b>Наверху — <b>номер тона</b> и его значок. Бей молотком крота, у которого слог <b>с этим тоном</b>! ${TLEG}</div>
  <div class="pz8">⏸ Учитель позвал тебя отвечать? Нажми <b>«Пауза»</b> в игре. Ответил(а) — нажми «Продолжить».</div>
  <div id="kg"></div><div id="kr"></div>`);
 katMount('moles8',$('#kg'),r=>{finish(n,r.right,r.of,{pts:r.score,wrong:r.wrong,miss:r.miss,tones:r.tones});
  if(KCUR&&KCUR.full)later(()=>KCUR&&KCUR.full(false),2600);const nx=nextN(n);
  $('#kr').innerHTML=`<div class="qcard n" style="text-align:center"><div class="res">${r.right} / ${r.of}</div><p class="lead">Очки: <b>${r.score}</b>. ${r.miss&&r.miss.length?'Можно повторить для закрепления: <b class="py">'+r.miss.map(esc).join(', ')+'</b>':'Без ошибок! 🏆'}</p>
   <div class="row" style="justify-content:center">${nx?`<button class="btn" onclick="location.hash='#${nx}'">Задание № ${nx} →</button>`:`<button class="btn" onclick="location.hash='#itogi'">🏁 Мои итоги</button>`}<button class="btn g" onclick="location.hash=''">‹ Все задания</button></div></div>`;});}

/* ---- 2: tone dictation (the teacher reads, the child taps the tone MARK) ---- */
const D2=['mā','bà','tǔ','dí','kě','fó','lù','hē','nǐ','pō'];
function dict2(){const n=2;S.d2=S.d2||{};const A=S.d2;
 const row=i=>{const s=D2[i],a=A[i];const r=toneS(s);return `<div class="dr8 n${a==null?'':(a===r?' ok':' no')}" data-i="${i}"><span class="no">${i+1}</span><span class="sy8">${a==null?plainS(s):s}</span>
  ${a==null?`<div class="mk8">${[1,2,3,4].map(t=>`<button data-t="${t}" aria-label="${t}-й тон">${msv(t,TCV[t],'30px')}</button>`).join('')}</div>`:`<button class="ear8" data-s="${s}" aria-label="Послушать">🔊</button><span class="vr8">${a===r?'✓':'✗'}</span>`}
  ${a!=null&&a!==r?`<div class="why8">${toneWhy(r,a)}</div>`:''}</div>`;};
 const draw=()=>{const k=D2.findIndex((_,i)=>A[i]==null);
  shell(`${backBtn}${tag(n)}<h2>🎵 Диктант на тоны</h2>
   <div class="rbox" style="--c1:#FF5C8A;--c2:#8E5BE8"><b>Правило</b>Учитель читает каждый слог <b>2 раза</b>. Слушай и нажми <b>значок тона</b> у этого номера. ${TLEG}</div>
   <div class="dl8">${D2.map((_,i)=>row(i)).join('')}</div>
   ${k<0?`<div class="row" style="justify-content:center"><button class="btn" id="fin">✓ Готово — мой результат</button></div>`:`<p class="hint2" style="text-align:center;margin-top:12px">Сейчас: № ${k+1}. Не торопись — жди, когда учитель прочитает.</p>`}`);
  const cur=document.querySelector(`.dr8[data-i="${k}"]`);if(cur)cur.classList.add('cur');
  document.querySelectorAll('.dr8 [data-t]').forEach(b=>b.onclick=()=>{const i=+b.closest('.dr8').dataset.i,t=+b.dataset.t;A[i]=t;keepS();
   send('d2',{a:D2.map((s,j)=>A[j]==null?null:A[j])});const y=scrollY;draw();scrollTo(0,y);const el=document.querySelector(`.dr8[data-i="${i}"]`);if(el)el.scrollIntoView({block:'nearest'});});
  document.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>sayS(b.dataset.s,b));
  const f=$('#fin');if(f)f.onclick=end;};
 const end=()=>{const res=D2.map((s,i)=>[s,toneS(s),A[i]]);const ok=res.filter(r=>r[1]===r[2]).length;
  finish(n,ok,D2.length,{res,miss:res.filter(r=>r[1]!==r[2]).map(r=>r[0])});
  shell(doneBox(n,`<div class="res" style="text-align:center">${ok} / ${D2.length}</div><p class="lead" style="text-align:center">${ok===D2.length?'Все тоны верно! 🏆':ok>=7?'Отлично! Почти всё верно 💪':'Хорошая работа! Значки тонов можно повторить для закрепления 🙂'}</p>
   <div class="ans8">${res.map(r=>`<button class="${r[1]===r[2]?'ok':'no'}" data-s="${r[0]}"><b>${r[0]}</b><small>${r[1]===r[2]?'✓':'ты: '+(r[2]?msv(r[2],'#B0284F','14px'):'—')}</small></button>`).join('')}</div>`));
  document.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>sayS(b.dataset.s,b));
  againOn(()=>{S.d2={};keepS();dict2();});};
 draw();}

/* ---- 3: real dictation: type the syllable in Latin letters + tap the tone mark ---- */
const D3=['bā','dù','gē','pí','mǔ','tè','bǐ','dé','kū','ná','lǐ','hú'];
const CYR={'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'e','ж':'zh','з':'z','и':'i','й':'i','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r','с':'s','т':'t','у':'u','ф':'f','х':'h','ц':'c','ч':'ch','ш':'sh','щ':'sh','ы':'i','э':'e','ю':'u','я':'a'};
const RUS={b:'б',p:'п',m:'м',f:'ф',d:'д',t:'т',n:'н',l:'л',g:'г',k:'к',h:'х'};
// letters that look alike (shape) and letters that sound alike (aspiration)
const SHAPE={b:['d','p','6'],d:['b','g','q'],g:['d','q','9'],p:['b','q'],q:['p','g','d']};
const SOUND={b:'p',p:'b',d:'t',t:'d',g:'k',k:'g'};
const LTR={b:'палочка ВВЕРХ, животик СПРАВА',d:'животик СЛЕВА, палочка ВВЕРХ',p:'палочка ВНИЗ, животик СПРАВА',g:'животик СЛЕВА, хвостик ВНИЗ крючком',q:'животик слева, палочка вниз (в пиньине её почти нет)',t:'палочка с перекладиной',k:'палочка и «уголок» справа'};
const lcard=(l,hot)=>`<div class="lc8${hot?' hot':''}"><b>${l}</b><span>${RUS[l]?'звук «'+RUS[l]+'»':''}</span><small>${LTR[l]||''}</small></div>`;
function letterWhy(typed,cyr,base){
 if(cyr){const lat=[...typed].map(c=>CYR[c]||c).join('');
  return `Ты написал(а) <b>русскими буквами</b>: «${esc(typed)}». В пиньине только <b>латинские</b> буквы${lat===base?` — возможно, ты имел(а) в виду <b>${base}</b>!`:'.'} Нажимай буквы на клавиатуре под словом 👇`;}
 if(typed.length===base.length){const diff=[...base].map((c,i)=>[c,typed[i]]).filter(([a,b])=>a!==b);
  if(diff.length===1){const [r,w]=diff[0];
   if(SHAPE[r]&&SHAPE[r].includes(w))return `Ошибка, но возможно, ты имел(а) в виду букву <b>${r}</b>! Буквы <b>${w}</b> и <b>${r}</b> легко перепутать — смотри, как они пишутся:<div class="lcs8">${lcard(w)}${lcard(r,1)}</div>${r==='d'&&w==='g'?'<small class="ru8">Русская «д» в прописи похожа на g — но звук «д» в пиньине пишется <b>d</b>.</small>':''}${r==='b'&&w==='d'?'<small class="ru8">Русская «б» похожа на латинскую d — но звук «б» в пиньине пишется <b>b</b>.</small>':''}`;
   if(SOUND[r]===w)return `Прозвучал <b>${r}</b> — ${'ptk'.includes(r)?'предыхательный 💨, с сильным выдохом':'непредыхательный, без воздуха'}. А <b>${w}</b> — ${'ptk'.includes(w)?'предыхательный 💨':'непредыхательный'}. Послушай ещё раз 🔊<div class="lcs8">${lcard(w)}${lcard(r,1)}</div>`;}}
 return `Правильно пишется <b>${base}</b>. Послушай ещё раз 🔊`;}
const KB8=['qwertyuiop','asdfghjkl','zxcvbnmü'];
function dict3(){const n=3;S.d3=S.d3||{};const A=S.d3;
 const k=D3.findIndex((_,i)=>!A[i]);
 if(k<0)return end3();
 const s=D3[k],base=plainS(s),r=toneS(s);let tone=0;
 shell(`${backBtn}${tag(n)}<h2>📝 Диктант: пиши слоги</h2>
  <div class="rbox" style="--c1:#2DBE8C;--c2:#5B6BD8"><b>Правило</b>Учитель читает каждый слог <b>3 раза</b>. Напиши слог <b>латинскими буквами</b>, потом нажми <b>значок тона</b> и «Проверить».</div>
  <div class="dots" style="margin-top:12px">${D3.map((_,i)=>`<i class="${A[i]?(A[i].ok?'ok':'no'):i===k?'cur':''}"></i>`).join('')}</div>
  <div class="qcard n d3c"><div class="qhead"><span>Слог № ${k+1} из ${D3.length}</span><span>✓ ${D3.filter((_,i)=>A[i]&&A[i].ok).length}</span></div>
   <div class="in8"><span class="no">${k+1}</span><input id="w" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" maxlength="8" placeholder="слог" aria-label="Слог латиницей"><span class="tm8" id="tm"></span></div>
   <div class="kb8">${KB8.map(r=>`<div>${[...r].map(c=>`<button data-k="${c}">${c}</button>`).join('')}${r==='zxcvbnmü'?'<button data-k="⌫" class="bs">⌫</button>':''}</div>`).join('')}</div>
   <div class="qq" style="margin-top:14px">Какой значок тона?</div>
   <div class="mk8 big">${[1,2,3,4].map(t=>`<button data-t="${t}" aria-label="${t}-й тон">${msv(t,TCV[t],'34px')}</button>`).join('')}</div>
   <button class="btn nxt" id="ck" disabled>Проверить</button><div class="fb" id="fb"></div><div id="nx"></div></div>
  <p class="hint2" style="text-align:center;margin-top:10px">Учитель диктует по порядку. Если пропустил(а) слог — нажми «Проверить» с тем, что успел(а).</p>`);
 const w=$('#w'),ck=$('#ck');
 if(matchMedia('(pointer:coarse)').matches)w.setAttribute('inputmode','none');
 const upd=()=>{const v=w.value.trim();ck.disabled=!v||!tone;$('#tm').innerHTML=tone?msv(tone,TCV[tone],'26px'):'';};
 w.oninput=()=>{const v=w.value;const t=toneS(v);if(t){tone=t;document.querySelectorAll('.mk8 [data-t]').forEach(b=>b.classList.toggle('on',+b.dataset.t===t));w.value=plainS(v);}w.value=w.value.replace(/[0-9]/g,'');upd();};
 document.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{const c=b.dataset.k;if(c==='⌫')w.value=w.value.slice(0,-1);else if(w.value.length<8)w.value+=c;upd();});
 document.querySelectorAll('.mk8 [data-t]').forEach(b=>b.onclick=()=>{tone=+b.dataset.t;document.querySelectorAll('.mk8 [data-t]').forEach(x=>x.classList.toggle('on',x===b));upd();});
 w.onkeydown=e=>{if(e.key==='Enter'&&!ck.disabled)ck.click();};
 ck.onclick=()=>{let typed=w.value.trim().toLowerCase().replace(/v/g,'ü');const cyr=/[а-яё]/.test(typed);
  const okL=typed===base,okT=tone===r,ok=okL&&okT;
  A[k]={w:typed,t:tone,ok,okL,okT,cyr};keepS();send('d3',{a:D3.map((_,i)=>A[i]?[A[i].w,A[i].t]:null)});
  document.querySelectorAll('.kb8 button,.mk8 button,#w').forEach(b=>b.disabled=true);ck.style.display='none';
  const fb=$('#fb');fb.className='fb '+(ok?'ok':'no');
  fb.innerHTML=ok?`✓ Верно! <b class="py">${s}</b>`:`<div class="big8">${s}</div>${okL?'':`<div class="why8">✗ ${letterWhy(typed,cyr,base)}</div>`}${okT?'':`<div class="why8">✗ ${toneWhy(r,tone)}</div>`}`;
  $('#nx').innerHTML=`<div class="row" style="justify-content:center"><button class="btn g" id="ls">🔊 Послушать ${s}</button><button class="btn" id="nb">${k+1<D3.length?'Дальше →':'Готово →'}</button></div>`;
  $('#ls').onclick=()=>sayS(s,$('#ls'));$('#nb').onclick=dict3;};
 function end3(){const res=D3.map((s,i)=>[s,(A[i]||{}).w||'',(A[i]||{}).t||0,!!(A[i]||{}).ok]);const ok=res.filter(r=>r[3]).length;
  const okL=D3.filter((_,i)=>A[i]&&A[i].okL).length,okT=D3.filter((_,i)=>A[i]&&A[i].okT).length;
  finish(n,ok,D3.length,{res,okL,okT,miss:res.filter(r=>!r[3]).map(r=>r[0])});
  shell(doneBox(n,`<div class="res" style="text-align:center">${ok} / ${D3.length}</div><p class="lead" style="text-align:center">Буквы верно: <b>${okL}</b> из ${D3.length} · тоны верно: <b>${okT}</b> из ${D3.length}. ${ok===D3.length?'Без ошибок! 🏆':'Ошибки можно повторить для закрепления 🙂'}</p>
   <div class="ans8">${res.map(r=>`<button class="${r[3]?'ok':'no'}" data-s="${r[0]}"><b>${r[0]}</b><small>${r[3]?'✓':'ты: '+esc(r[1]||'—')+(r[2]?' '+msv(r[2],'#B0284F','13px'):'')}</small></button>`).join('')}</div>`));
  document.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>sayS(b.dataset.s,b));
  againOn(()=>{S.d3={};keepS();dict3();});}}

/* ---- writing helpers ---- */
const GRID='<svg class="grid" viewBox="0 0 100 100"><g stroke="#FFB3C8" stroke-width=".6" stroke-dasharray="2 2"><line x1="0" y1="0" x2="100" y2="100"/><line x1="100" y1="0" x2="0" y2="100"/><line x1="50" y1="0" x2="50" y2="100"/><line x1="0" y1="50" x2="100" y2="50"/></g></svg>';
const hwOpts=(sz,extra)=>Object.assign({width:sz,height:sz,padding:sz*.08,showOutline:false,showCharacter:false,outlineColor:'#DCE1EC',strokeColor:'#2B3270',radicalColor:'#FF5C8A',drawingColor:'#5B6BD8',drawingWidth:Math.round(sz/16),highlightColor:'#2DBE8C',strokeAnimationSpeed:1.2,delayBetweenStrokes:250,charDataLoader:(ch,ok)=>ok(HZDATA[ch])},extra||{});
// one character: outline = the sample is visible; hint = after a mistake the right stroke flashes
function writeOne(el,c,{outline,hintAfter},wh,done){const sz=el.clientWidth||280;let mist=0,fin=false;el.innerHTML='';
 if(!window.HanziWriter||!HZDATA[c]){wh.textContent='Напиши '+c+' пальцем в воздухе 🙂';later(()=>done({c,mist:0}),1200);return null;}
 const w=HanziWriter.create(el,c,hwOpts(sz,{showOutline:!!outline}));
 w.quiz({showHintAfterMisses:hintAfter,highlightOnComplete:true,onMistake:()=>{mist++;wh.textContent=hintAfter===1?'Смотри на мерцающую черту 👀':'Попробуй ещё раз 🙂';},
  onCorrectStroke:()=>{wh.textContent='Так держать! ✓';},
  onComplete:()=>{if(fin||!document.body.contains(el))return;fin=true;wh.textContent='✓ Написано!';later(()=>done({c,mist}),800);}});
 return w;}
const PR={'他':['tā','он','亻 человек + 也','亻 «человек» — смысл: «он» — это человек'],'她':['tā','она','女 женщина + 也','女 «женщина» — смысл: «она»'],
 '它':['tā','оно','宀 крыша + 匕','Древний рисунок змеи. Сейчас — «оно»: животные и вещи'],'们':['men','много (суффикс)','亻 человек + 门 mén','门 «ворота» звучит mén — это ЧТЕНИЕ, 亻 — смысл'],
 '您':['nín','Вы (уважительно)','你 ты + 心 сердце','«Ты — от всего сердца»: так говорят учителю, бабушке']};

/* ---- 4: writing the new characters ---- */
function propis(){const n=4;const L=['他','她','它','们','您'];let k=0,round=0;const res=[];
 const one=()=>{if(k>=L.length)return end();const c=L[k],[py,ru,parts,why]=PR[c];
  shell(`${backBtn}${tag(n)}<div class="qcard n" style="padding:12px"><div class="qhead"><span>Иероглиф ${k+1} из ${L.length}</span><span>${round?'✍️ сам(а), без образца':'✏️ обведи по образцу'}</span></div>
   <div class="ph8"><span class="zh">${c}</span><div><b class="py">${py}</b> · ${ru}<small>${parts}</small></div><button class="btn g" id="pl" style="padding:8px 12px">🔊</button></div>
   <div class="tip" style="margin-top:8px;font-size:14.5px">${why}</div></div>
   <div class="wbox">${GRID}<div class="hw" id="hw"></div></div><p class="hint2" id="wh" style="text-align:center;margin-top:8px">${round?'Теперь сам(а) — ошибёшься, черта подскажет':'Обведи по серому образцу — каждую черту по порядку'}</p>
   <div class="row" style="justify-content:center"><button class="btn g" id="an">▶ Как пишется</button></div>`);
  const pl=$('#pl');pl.onclick=()=>playW(c,pl);if(!round)later(()=>playW(c,pl),300);
  let w=writeOne($('#hw'),c,{outline:!round,hintAfter:round?2:1},$('#wh'),r=>{res.push({c,r:round,mist:r.mist});if(round){k++;round=0;}else round=1;one();});
  $('#an').onclick=()=>{if(!w)return;w.cancelQuiz&&w.cancelQuiz();w.animateCharacter({onComplete:()=>{w=writeOne($('#hw'),c,{outline:!round,hintAfter:round?2:1},$('#wh'),r=>{res.push({c,r:round,mist:r.mist});if(round){k++;round=0;}else round=1;one();});}});};};
 const end=()=>{const self=res.filter(r=>r.r===1);const clean=self.filter(r=>r.mist<=2).length;
  finish(n,clean,L.length,{res:self.map(r=>[r.c,r.mist]),trace:res.filter(r=>r.r===0).map(r=>[r.c,r.mist]),miss:self.filter(r=>r.mist>2).map(r=>r.c)});
  shell(doneBox(n,`<div class="res zh" style="text-align:center;font-weight:400">他 她 它 们 您</div><p class="lead" style="text-align:center">Все пять иероглифов написаны! ${clean===L.length?'И без ошибок 🏆':'Где были ошибки — можно повторить для закрепления 🙂'}</p>
   <div class="ans" style="grid-template-columns:repeat(5,1fr)">${self.map(r=>`<span class="${r.mist<=2?'ok':'no'}" style="font-family:var(--han);font-size:28px;font-weight:400">${r.c}<small style="display:block;font:800 11px Manrope">ошибок: ${r.mist}</small></span>`).join('')}</div>`));againOn(propis);};
 shell(`${backBtn}${tag(n)}<h2>✍️ Пропись: 他 她 它 们 您</h2>
  <div class="rbox" style="--c1:#FF5C8A;--c2:#FF8A3D"><b>Как писать</b><div class="rr2"><span>1️⃣ Сначала <b>обведи</b> по серому образцу</span><span>2️⃣ Потом напиши <b>сам(а)</b> — ошибёшься, черта подскажет</span><span>Пиши каждую черту по порядку — как в правилах порядка черт</span></div></div>
  <div class="mlist">${L.map(c=>`<button class="n" data-w="${c}"><span class="zh">${c}</span><small><b class="py" style="color:var(--ac)">${PR[c][0]}</b> ${PR[c][1]}</small>🔊</button>`).join('')}</div>
  <div class="row" style="justify-content:center"><button class="btn" id="st" style="width:100%">✍️ Начать пропись</button></div>`);
 document.querySelectorAll('[data-w]').forEach(b=>b.onclick=()=>playW(b.dataset.w,b));$('#st').onclick=one;}

/* ---- the pronoun table ---- */
// [hanzi, syllables [base, tone], translation]
const PN=[['我',[['wo',3]],'я'],['你',[['ni',3]],'ты'],['他',[['ta',1]],'он'],['她',[['ta',1]],'она'],['它',[['ta',1]],'оно'],
 ['我们',[['wo',3],['men',0]],'мы'],['你们',[['ni',3],['men',0]],'вы'],['他们',[['ta',1],['men',0]],'они'],['她们',[['ta',1],['men',0]],'они (девочки)']];
const KNOWN=new Set(['我','你']);
const pyOf=p=>p[1].map(([b,t])=>mark(b,t)).join('');
const pyCol8=p=>p[1].map(([b,t])=>`<span style="color:${TCV[t]}">${mark(b,t)}</span>`).join('');
// the layout: singular on the left, plural on the right
const TROWS=[[0,5],[1,6],[2,7],[3,8],[4,-1]];

/* ---- 5: fill the table by hand ---- */
function table(){const n=5;S.tb=S.tb||{};const T=S.tb;
 const cell=i=>{if(i<0)return `<div class="tc8 empty"><small>— без 们</small></div>`;const p=PN[i],d=T[i];
  return `<button class="tc8${d?' done':''}" data-c="${i}"><small>${p[2]}</small>${d?`<span class="zh">${p[0]}</span><span class="py">${pyCol8(p)}</span>`:`<span class="q8">✍️</span>`}</button>`;};
 const draw=()=>{const left=PN.filter((_,i)=>!T[i]).length;
  shell(`${backBtn}${tag(n)}<h2>📋 Таблица местоимений</h2>
   <div class="rbox" style="--c1:#5B6BD8;--c2:#8E5BE8"><b>Заполни таблицу</b><div class="rr2"><span>Нажми на клетку и напиши иероглиф от руки</span><span>🧠 <b>我 你</b> ты уже знаешь — пиши сам(а). Ошибёшься — черта замерцает</span><span>🆕 Новые иероглифы — по образцу</span><span>Потом поставь <b>значок тона</b> к пиньиню</span></div></div>
   <div class="tb8"><div class="th8">один</div><div class="th8">много · 们</div>${TROWS.map(([a,b])=>cell(a)+cell(b)).join('')}</div>
   ${left?`<p class="hint2" style="text-align:center;margin-top:10px">Осталось клеток: ${left}</p>`:`<div class="row" style="justify-content:center"><button class="btn" id="fin">✓ Таблица готова</button></div>`}`);
  document.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>fill(+b.dataset.c));const f=$('#fin');if(f)f.onclick=end;};
 const fill=i=>{const p=PN[i],chars=[...p[0]];let j=0;const mist=[],terr=[];
  const write=()=>{if(j>=chars.length)return tones();const c=chars[j],known=KNOWN.has(c);
   shell(`${backBtn}${tag(n)}<div class="qcard n" style="padding:12px"><div class="qhead"><span>Клетка «${p[2]}»</span><span>${known?'🧠 по памяти':'🆕 по образцу'}</span></div>
    <div class="cw8">${chars.map((x,q)=>`<span class="${q<j?'ok':q===j?'cur':''}">${q<j?x:'?'}</span>`).join('')}</div></div>
    <div class="wbox">${GRID}<div class="hw" id="hw"></div></div><p class="hint2" id="wh" style="text-align:center;margin-top:8px">${known?`Ты его знаешь! Напиши <b>${c}</b> сам(а)`:`Новый иероглиф — пиши по образцу`}</p>
    <div class="row" style="justify-content:center"><button class="btn g" id="bk">‹ К таблице</button></div>`);
   $('#bk').onclick=draw;
   writeOne($('#hw'),c,{outline:!known,hintAfter:1},$('#wh'),r=>{mist.push([c,r.mist]);j++;write();});};
  const tones=()=>{let q=0;const syl=p[1];
   const ask=()=>{if(q>=syl.length)return save();const [b,t]=syl[q];
    shell(`${backBtn}${tag(n)}<div class="qcard n"><div class="qhead"><span>Клетка «${p[2]}»</span><span>значок тона</span></div>
     <div class="zh" style="font-size:72px;line-height:1.1;color:var(--ac2)">${p[0]}</div>
     <div class="py8">${syl.map(([bb,tt],z)=>z<q?`<span style="color:${TCV[tt]}">${mark(bb,tt)}</span>`:z===q?`<span class="cur">${bb}</span>`:`<span class="dim">${bb}</span>`).join('')}</div>
     <div class="qq">Какой тон у слога <b>${b}</b>?</div>
     <div class="mk8 big five">${[1,2,3,4,0].map(x=>`<button data-t="${x}">${x?msv(x,TCV[x],'34px'):'<small>без значка<br>(лёгкий)</small>'}</button>`).join('')}</div>
     <div class="fb" id="fb"></div><div id="nx"></div></div>`);
    later(()=>playW(p[0]),250);
    document.querySelectorAll('[data-t]').forEach(x=>x.onclick=()=>{const c=+x.dataset.t;document.querySelectorAll('[data-t]').forEach(y=>y.disabled=true);
     const ok=c===t;if(!ok)terr.push(b);x.classList.add(ok?'ok':'no');if(!ok)document.querySelector(`[data-t="${t}"]`).classList.add('ok');
     const fb=$('#fb');fb.className='fb '+(ok?'ok':'no');fb.innerHTML=ok?`✓ Верно: <b class="py">${mark(b,t)}</b>`:`<div class="why8">${toneWhy(t,c)}</div>`;
     $('#nx').innerHTML=`<button class="btn nxt" id="nb">Дальше →</button>`;$('#nb').onclick=()=>{q++;ask();};if(ok)later(()=>{if($('#nb')){q++;ask();}},1300);});};
   ask();};
  const save=()=>{T[i]={mist,terr};keepS();send('tab',{cells:Object.fromEntries(Object.entries(T).map(([k,v])=>[k,v]))});
   draw();const el=document.querySelector(`[data-c="${i}"]`);if(el){el.classList.add('pop');el.scrollIntoView({block:'center'});}playW(p[0]);};
  write();};
 const end=()=>{const cells=PN.map((p,i)=>[p[0],(T[i]||{}).mist||[],(T[i]||{}).terr||[]]);
  const clean=cells.filter(c=>!c[2].length&&c[1].every(m=>m[1]<=2)).length;
  finish(n,clean,PN.length,{cells,miss:cells.filter(c=>c[2].length).map(c=>c[0]+' (тон)')});
  shell(doneBox(n,`<div class="tb8 small">${TROWS.map(([a,b])=>[a,b].map(i=>i<0?'<div class="tc8 empty"></div>':`<div class="tc8 done"><small>${PN[i][2]}</small><span class="zh">${PN[i][0]}</span><span class="py">${pyCol8(PN[i])}</span></div>`).join('')).join('')}</div>
   <p class="lead" style="text-align:center">Таблица готова! Без ошибок: <b>${clean}</b> клеток из ${PN.length}.</p>`));againOn(()=>{S.tb={};keepS();table();});};
 draw();}

/* ---- 6: read the table aloud and record it ---- */
function recTab(){const n=6;const L=PN;
 shell(`${backBtn}${tag(n)}<h2>🎙️ Прочитай таблицу</h2><p class="lead">Послушай каждое местоимение, повтори вслух. Потом <b>запиши себя</b>: прочитай всю таблицу подряд. Учитель послушает 🎧</p>
  <div class="tb8 rec">${TROWS.map(([a,b])=>[a,b].map(i=>i<0?'<div class="tc8 empty"></div>':`<button class="tc8 done" data-w="${PN[i][0]}"><small>${PN[i][2]}</small><span class="zh">${PN[i][0]}</span><span class="py">${pyCol8(PN[i])}</span><i>🔊</i></button>`).join('')).join('')}</div>
  <div class="row" style="justify-content:center"><button class="btn g" id="all">▶ Послушать всю таблицу</button></div>
  <div class="qcard in"><p class="hint2">Нажми 🎤 и прочитай: <b>我 — 我们, 你 — 你们, 他 — 他们, 她 — 她们, 它</b>. Потом нажми ⏹.</p>
   <button class="mic" id="mic">🎤</button><div id="tmr" class="hint2" style="font:900 22px Nunito;color:var(--ac2)">0:00</div><div id="rv"></div></div>`);
 document.querySelectorAll('[data-w]').forEach(b=>b.onclick=()=>playW(b.dataset.w,b));
 $('#all').onclick=async()=>{const b=$('#all');for(const [a,c] of TROWS)for(const i of [a,c]){if(i<0)continue;if(!document.body.contains(b))return;const el=document.querySelector(`[data-w="${PN[i][0]}"]`);await playW(PN[i][0],el);await new Promise(r=>setTimeout(r,200));}};
 const mic=$('#mic');let chunks=[],t0=0,tick=0,blob=null;
 mic.onclick=async()=>{if(REC&&REC.state==='recording'){REC.stop();return;}
  try{try{curA&&curA.pause()}catch(e){}if(!STREAM||!STREAM.active)STREAM=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,channelCount:1}});}
  catch(e){$('#rv').innerHTML=`<div class="tip">🎤 Микрофон не открылся. Разреши доступ к микрофону (значок 🔒 рядом с адресом сайта) и нажми 🎤 ещё раз.<br>Совсем не получается? <button class="btn g" id="nomic" style="margin-top:8px">Прочитаю учителю на уроке</button></div>`;
   $('#nomic').onclick=()=>{finish(n,0,1,{noMic:true});shell(doneBox(n,'<p class="lead">Хорошо! Прочитай таблицу учителю голосом на уроке 🙂</p>',false));};return;}
  const type=['audio/webm;codecs=opus','audio/mp4','audio/webm','audio/ogg'].find(t=>window.MediaRecorder&&MediaRecorder.isTypeSupported(t));
  try{REC=new MediaRecorder(STREAM,type?{mimeType:type,audioBitsPerSecond:48000}:undefined);}catch(e){toast('Этот браузер не умеет записывать звук');return;}
  chunks=[];REC.ondataavailable=e=>e.data.size&&chunks.push(e.data);
  REC.onstop=()=>{clearInterval(tick);mic.classList.remove('rec');mic.textContent='🎤';const dur=(Date.now()-t0)/1000;if(!document.body.contains(mic))return;if(dur<2){toast('Слишком коротко — прочитай всю таблицу');return;}
   blob=new Blob(chunks,{type:(REC.mimeType||type||'audio/webm').split(';')[0]});const u=URL.createObjectURL(blob);
   $('#rv').innerHTML=`<p class="lead" style="margin-top:6px">Послушай себя:</p><audio controls src="${u}" style="width:100%;margin-top:8px"></audio>
    <div class="row" style="justify-content:center"><button class="btn" id="snd">📨 Отправить учителю</button><button class="btn g" id="re">↺ Перезаписать</button></div>`;
   $('#re').onclick=()=>{$('#rv').innerHTML='';$('#tmr').textContent='0:00';};
   $('#snd').onclick=async()=>{const b=$('#snd');b.disabled=true;b.textContent='Отправляю…';const ok=await upload('rec',blob);
    if(!ok){b.disabled=false;b.textContent='📨 Отправить ещё раз';toast('Не получилось отправить. Проверь интернет и нажми ещё раз.');return;}
    finish(n,1,1,{sec:Math.round(dur)});
    shell(doneBox(n,`<div class="res">🎧 Отправлено!</div><p class="lead">Учитель услышит, как ты читаешь таблицу местоимений 🎉</p>`,true));againOn(recTab);};};
  REC.start(1000);t0=Date.now();mic.classList.add('rec');mic.textContent='⏹';$('#rv').innerHTML='';
  tick=setInterval(()=>{const s=Math.floor((Date.now()-t0)/1000);const el=$('#tmr');if(!el){clearInterval(tick);return;}el.textContent=Math.floor(s/60)+':'+String(s%60).padStart(2,'0');if(s>=90&&REC.state==='recording')REC.stop();},250);};}

/* ---- 7: drag the cards to their places (not a memory game) ---- */
// drag with a finger or the mouse; a tap on a card and then a tap on a place works too
function dragKit(onDrop){let sel=null;
 const pick=c=>{if(sel)sel.classList.remove('sel');sel=c===sel?null:c;if(sel)sel.classList.add('sel');};
 const bind=card=>{let st=null,ghost=null,moved=false;
  card.addEventListener('pointerdown',e=>{if(e.button>0||card.classList.contains('used'))return;if(e.target.closest('.snd8'))return;st={x:e.clientX,y:e.clientY,id:e.pointerId};moved=false;});
  card.addEventListener('pointermove',e=>{if(!st||e.pointerId!==st.id)return;const dx=e.clientX-st.x,dy=e.clientY-st.y;
   if(!moved&&Math.hypot(dx,dy)>8){moved=true;try{card.setPointerCapture(e.pointerId)}catch(_){}ghost=card.cloneNode(true);ghost.className=card.className+' dg8';const r=card.getBoundingClientRect();ghost.style.width=r.width+'px';ghost._ox=e.clientX-r.left;ghost._oy=e.clientY-r.top;document.body.appendChild(ghost);card.classList.add('lift');}
   if(moved&&ghost){e.preventDefault();ghost.style.left=(e.clientX-ghost._ox)+'px';ghost.style.top=(e.clientY-ghost._oy)+'px';document.querySelectorAll('.slot8.over').forEach(s=>s.classList.remove('over'));const s=slotAt(e.clientX,e.clientY);if(s)s.classList.add('over');}});
  const up=e=>{if(!st||e.pointerId!==st.id)return;const was=moved;st=null;card.classList.remove('lift');document.querySelectorAll('.slot8.over').forEach(s=>s.classList.remove('over'));
   if(ghost){ghost.remove();ghost=null;}
   if(was){const s=slotAt(e.clientX,e.clientY);if(s)onDrop(card,s);}else pick(card);};
  card.addEventListener('pointerup',up);card.addEventListener('pointercancel',e=>{if(ghost){ghost.remove();ghost=null;}st=null;card.classList.remove('lift');});};
 const slotAt=(x,y)=>{const el=document.elementFromPoint(x,y);return el&&el.closest&&el.closest('.slot8:not(.full)');};
 const slotTap=s=>{if(!sel||s.classList.contains('full'))return;const c=sel;pick(c);onDrop(c,s);};
 return {bind,slotTap,clear:()=>pick(null)};}
const shake=el=>{el.classList.remove('shk');void el.offsetWidth;el.classList.add('shk');};
function cards(){const n=7;S.c7=S.c7||{};
 shell(`${backBtn}${tag(n)}<h2>🧩 Собери местоимения</h2>
  <div class="rbox" style="--c1:#2DBE8C;--c2:#5B6BD8"><b>Как играть</b>Это не мемори: все карточки открыты! <b>Перетащи</b> карточку на её место пальцем. Или нажми на карточку, а потом на место.</div>
  <div class="list"><button class="ti n${S.c7.l1?'':' hot'}" id="l1"><span class="no" style="${S.c7.l1?'background:var(--ok)':''}">7.1</span><span><b>Иероглиф → перевод</b><small>Карточка с иероглифом, пиньинем и звуком — на место с переводом</small></span><span class="sc7">${S.c7.l1?'✓':''}</span></button>
   <button class="ti n${S.c7.l1&&!S.c7.l2?' hot':''}" id="l2"><span class="no" style="${S.c7.l2?'background:var(--ok)':''}">7.2</span><span><b>Три корзинки</b><small>Иероглифы, пиньинь и перевод — собери каждую строчку</small></span><span class="sc7">${S.c7.l2?'✓':''}</span></button></div>`);
 $('#l1').onclick=lvl1;$('#l2').onclick=lvl2;}
function c7done(){const a=S.c7.l1,b=S.c7.l2;if(!a||!b)return;const errs=(a.errs||0)+(b.errs||0);
 finish(7,2,2,{e1:a.errs,e2:b.errs,c1:a.conf,c2:b.conf,miss:[...(a.conf||[]),...(b.conf||[])].map(x=>x[0]).slice(0,8)});return errs;}
function lvl1(){const n=7;let errs=0;const conf=[];const L=PN.map((p,i)=>i);
 shell(`${backBtn}${tag(n)}<h2>7.1 · Иероглиф → перевод</h2><p class="lead">Перетащи карточку на место с переводом. 🔊 — послушать.</p>
  <div class="bd81">${L.map(i=>`<div class="r81"><span class="lb81">${PN[i][2]}</span><div class="slot8" data-want="${i}"></div></div>`).join('')}</div>
  <div class="pool8" id="pool">${shuffle(L).map(i=>`<div class="cd8" data-p="${i}"><span class="zh">${PN[i][0]}</span><span class="py">${pyCol8(PN[i])}</span><button class="snd8" data-w="${PN[i][0]}" aria-label="Послушать">🔊</button></div>`).join('')}</div>`);
 document.querySelectorAll('.snd8').forEach(b=>b.onclick=e=>{e.stopPropagation();playW(b.dataset.w,b);});
 const kit=dragKit((card,slot)=>{const p=+card.dataset.p,want=+slot.dataset.want;
  if(p===want){slot.appendChild(card);card.classList.add('used');slot.classList.add('full','ok');playW(PN[p][0]);
   if(document.querySelectorAll('#pool .cd8').length===0){S.c7.l1={errs,conf};keepS();send('c71',S.c7.l1);later(()=>{const e=c7done();
    shell(`${backBtn}${tag(n)}<h2>7.1 готово! 🎉</h2><p class="lead" style="text-align:center">${errs?`Ошибок: ${errs}. `:'Без единой ошибки! 🏆 '}Теперь уровень посложнее — <b>три корзинки</b>.</p><div class="row" style="justify-content:center"><button class="btn" id="go2">7.2 · Три корзинки →</button><button class="btn g" onclick="location.hash=''">‹ Все задания</button></div>`);$('#go2').onclick=lvl2;},900);}}
  else{errs++;conf.push([PN[p][0],PN[want][2]]);shake(card);slot.classList.add('bad');later(()=>slot.classList.remove('bad'),600);toast(`${PN[p][0]} ${pyOf(PN[p])} — это «${PN[p][2]}»`);}});
 document.querySelectorAll('.cd8').forEach(kit.bind);document.querySelectorAll('.slot8').forEach(s=>s.onclick=()=>kit.slotTap(s));}
// 7.2 — rows of three places (hanzi · pinyin · translation), cards from three baskets.
// A card fits if the whole board can still be finished (pinyin tā fits он / она / оно).
function lvl2(){const n=7;let errs=0;const conf=[];const R=PN.length;const row=[...Array(R)].map(()=>({h:null,p:null,r:null}));
 const fitsP=(i,ri)=>{const c=row[ri];return (c.h==null||c.h===i)&&(c.r==null||c.r===i)&&(c.p==null||pyOf(PN[c.p])===pyOf(PN[i]));};
 const solvable=()=>{const used=new Set();const go=ri=>{if(ri>=R)return true;for(let i=0;i<R;i++){if(used.has(i)||!fitsP(i,ri))continue;used.add(i);if(go(ri+1))return true;used.delete(i);}return false;};return go(0);};
 const B={h:'Иероглифы',p:'Пиньинь',r:'Перевод'};let bk='h';
 const face=(k,i)=>k==='h'?`<span class="zh">${PN[i][0]}</span><button class="snd8" data-w="${PN[i][0]}" aria-label="Послушать">🔊</button>`:k==='p'?`<span class="py">${pyCol8(PN[i])}</span>`:`<span class="ru8c">${PN[i][2]}</span>`;
 shell(`${backBtn}${tag(n)}<h2>7.2 · Три корзинки</h2><p class="lead">Собери каждую строчку: <b>иероглиф · пиньинь · перевод</b>. Бери карточки из корзинок внизу.</p>
  <div class="bd82"><div class="h82">Иероглиф</div><div class="h82">Пиньинь</div><div class="h82">Перевод</div>${row.map((_,ri)=>['h','p','r'].map(k=>`<div class="slot8 s82" data-row="${ri}" data-k="${k}"></div>`).join('')).join('')}</div>
  <div class="bsk8"><div class="bt8">${Object.keys(B).map(k=>`<button data-b="${k}" class="${k===bk?'on':''}">🧺 ${B[k]} <i id="cn-${k}">${R}</i></button>`).join('')}</div>
   ${Object.keys(B).map(k=>`<div class="pool8 p82${k===bk?'':' hide'}" data-pool="${k}">${shuffle(PN.map((_,i)=>i)).map(i=>`<div class="cd8 k-${k}" data-k="${k}" data-p="${i}">${face(k,i)}</div>`).join('')}</div>`).join('')}</div>`);
 document.querySelectorAll('[data-b]').forEach(b=>b.onclick=()=>{bk=b.dataset.b;document.querySelectorAll('[data-b]').forEach(x=>x.classList.toggle('on',x===b));document.querySelectorAll('[data-pool]').forEach(p=>p.classList.toggle('hide',p.dataset.pool!==bk));kit.clear();});
 document.querySelectorAll('.snd8').forEach(b=>b.onclick=e=>{e.stopPropagation();playW(b.dataset.w,b);});
 const cnt=()=>Object.keys(B).forEach(k=>{$('#cn-'+k).textContent=document.querySelectorAll(`[data-pool="${k}"] .cd8`).length;});
 const kit=dragKit((card,slot)=>{const k=card.dataset.k,i=+card.dataset.p,ri=+slot.dataset.row;
  if(slot.dataset.k!==k){shake(card);toast(`Эта карточка — в столбик «${B[k]}»`);return;}
  const prev=row[ri][k];row[ri][k]=i;const ok=fitsP(i,ri)&&solvable();
  if(!ok){row[ri][k]=prev;errs++;const c=row[ri];const other=c.h!=null?PN[c.h][0]:c.r!=null?PN[c.r][2]:c.p!=null?pyOf(PN[c.p]):'';conf.push([k==='h'?PN[i][0]:k==='p'?pyOf(PN[i]):PN[i][2],other]);
   shake(card);slot.classList.add('bad');later(()=>slot.classList.remove('bad'),600);toast(other?'Не подходит к этой строчке 🙂':'Эта карточка подходит к другой строчке 🙂');return;}
  slot.appendChild(card);card.classList.add('used');slot.classList.add('full');cnt();if(k!=='r')playW(PN[i][0]);
  const c=row[ri];if(c.h!=null&&c.p!=null&&c.r!=null)document.querySelectorAll(`.s82[data-row="${ri}"]`).forEach(s=>s.classList.add('ok'));
  if(row.every(c=>c.h!=null&&c.p!=null&&c.r!=null)){S.c7.l2={errs,conf};keepS();send('c72',S.c7.l2);later(()=>{c7done();
   shell(doneBox(n,`<div class="res" style="text-align:center">🧩 Собрано!</div><p class="lead" style="text-align:center">7.1 — ошибок ${S.c7.l1?S.c7.l1.errs:'—'} · 7.2 — ошибок ${errs}. ${errs?'Можно повторить для закрепления 🙂':'Ты отлично знаешь местоимения! 🏆'}</p>`));againOn(()=>{S.c7={};keepS();cards();});},900);}
  else{const p=document.querySelector(`[data-pool="${k}"]`);if(!p.querySelector('.cd8')){const nx=Object.keys(B).find(x=>document.querySelector(`[data-pool="${x}"] .cd8`));if(nx)document.querySelector(`[data-b="${nx}"]`).click();}}});
 document.querySelectorAll('.cd8').forEach(kit.bind);document.querySelectorAll('.slot8').forEach(s=>s.onclick=()=>kit.slotTap(s));}

/* ---- 8: the final memory game with ALL our characters ---- */
const MEM=[['你','ты'],['我','я'],['好','хорошо'],['叫','зваться'],['妈','мама'],['爸','папа'],['他','он'],['她','она'],['它','оно'],['们','много (суффикс)']];
function memo(){const n=8,L=MEM,NP=L.length;
 shell(`${backBtn}${tag(n)}<h2>🃏 Мемори-финал</h2>
  <div class="rbox" style="--c1:#FF5C8A;--c2:#FF8A3D"><b>Как играть</b>Открывай по <b>две</b> карточки. Найди к иероглифу его перевод. Все наши иероглифы — с самого первого урока!</div>
  <div class="mhud"><span>⏱ <b id="mt">0:00</b></span><span>🔄 ходов: <b id="mm">0</b></span><span>✓ пар: <b id="mp">0</b>/${NP}</span></div>
  <div class="mem" id="mg"></div>`);
 const cardsL=shuffle(L.flatMap(([a,ru],i)=>[{i,k:'a',t:a},{i,k:'b',t:ru}]));
 $('#mg').innerHTML=cardsL.map((c,j)=>`<button class="mc" data-j="${j}" aria-label="Карточка ${j+1}"><span class="mcb"><i>汉</i></span><span class="mcf ${c.k==='a'?'zh':'ru'}${c.t.length>8?' long':''}">${esc(c.t)}</span></button>`).join('');
 let open=[],moves=0,pairs=0,errs=0,lock=false;const t0=Date.now(),conf=[];
 const tick=()=>{const s=Math.floor((Date.now()-t0)/1000);const el=$('#mt');if(!el)return;el.textContent=Math.floor(s/60)+':'+String(s%60).padStart(2,'0');later(tick,1000);};tick();
 document.querySelectorAll('.mc').forEach(b=>b.onclick=()=>{if(lock)return;const j=+b.dataset.j,c=cardsL[j];if(b.classList.contains('up'))return;
  b.classList.add('up');open.push([b,c]);if(open.length<2)return;moves++;$('#mm').textContent=moves;const [[b1,c1],[b2,c2]]=open;open=[];
  if(c1.i===c2.i){pairs++;$('#mp').textContent=pairs;later(()=>{b1.classList.add('ok');b2.classList.add('ok');},250);playW(L[c1.i][0]);if(pairs===NP)later(end,1500);}
  else{errs++;lock=true;conf.push([c1.t,c2.t]);b1.classList.add('no');b2.classList.add('no');later(()=>{b1.classList.remove('up','no');b2.classList.remove('up','no');lock=false;},950);}});
 function end(){const sec=Math.round((Date.now()-t0)/1000);finish(n,NP,NP,{moves,errs,sec,conf:conf.slice(0,20)});
  shell(doneBox(n,`<div class="res" style="text-align:center">${errs<=5?'⭐⭐⭐':errs<=10?'⭐⭐':'⭐'}</div><p class="lead" style="text-align:center">Все ${NP} пар найдены за <b>${moves}</b> ${plural(moves,'ход','хода','ходов')} · ${Math.floor(sec/60)}:${String(sec%60).padStart(2,'0')}</p>
   <div class="mlist">${L.map(([a,ru])=>`<button class="n" data-say="${a}"><span class="zh">${esc(a)}</span><small>${esc(ru)}</small>🔊</button>`).join('')}</div>`));
  document.querySelectorAll('[data-say]').forEach(b=>b.onclick=()=>playW(b.dataset.say,b));againOn(memo);}}

route();
