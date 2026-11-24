/* ============ ДЗ 10 «Детективная история» · утверждённый вид ДЗ 9 (правила §16, «ИТОГ ПРОБ 17.11») ============ */
const HW_ID='dz10', LS_KEY='zh-dz10';
const API=/workers\.dev$/.test(location.hostname)?'/api/dz/':'https://gruppa-deti.ch-tutor-world.workers.dev/api/dz/';
const AUDIO=(/^https?:$/.test(location.protocol)&&!/claude/i.test(location.hostname)&&!/workers\.dev$/.test(location.hostname))?new URL('../audio/',location.href).href:'https://chtutorworld-ops.github.io/gruppa-deti-sait/audio/';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]];}return a;};
const code=t=>[...t].map(c=>c.codePointAt(0).toString(16)).join('-');
const IC={
 back:'<svg class="i" viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>',
 snd:'<svg class="i" viewBox="0 0 24 24"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/><path d="M19 6a8.5 8.5 0 0 1 0 12"/></svg>',
 ok:'<svg class="i" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
 pause:'<svg class="i" viewBox="0 0 24 24"><path d="M9 6v12M15 6v12"/></svg>',
 play:'<svg class="i" viewBox="0 0 24 24"><path d="M8 5.5v13l10-6.5z"/></svg>'};
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('on'),2600);}
let timers=[];const later=(f,ms)=>{const t=setTimeout(f,ms);timers.push(t);return t;};
const clearTimers=()=>{timers.forEach(clearTimeout);timers=[];};

/* ---------- звук: только готовые mp3, один голос в задании ---------- */
let curA=null;
function tryURL(u,el){return new Promise(res=>{try{curA&&curA.pause()}catch(e){}const a=new Audio(u);curA=a;el&&el.classList.add('on');let done=false;
 const end=ok=>{if(done)return;done=true;el&&el.classList.remove('on');res(ok);};a.onended=()=>end(true);a.onerror=()=>end(false);a.play().catch(()=>end(false));});}
// диктор диктантов (протяжно, 3-й тон с ямкой): audio/dict/. В одном задании — только он (записи Дарьи не подмешиваем)
const playDict=(c,el)=>tryURL(AUDIO+'dict/'+code(c)+'.mp3',el);
const playWord=(w,el)=>tryURL(AUDIO+code(w)+'.mp3',el);

/* ---------- сохранение ---------- */
let S={};try{S=JSON.parse(localStorage.getItem(LS_KEY)||'{}')}catch(e){}
S.done=S.done||{};S.queue=S.queue||[];
const keep=()=>{try{localStorage.setItem(LS_KEY,JSON.stringify(S))}catch(e){}};
const isTest=()=>/^(учитель|учительница|teacher|тест)$/i.test((S.name||'').trim());
function send(part,data){S.queue=S.queue.filter(q=>q.part!==part);S.queue.push({part,data:Object.assign({},data,{ts:Date.now()})});keep();flush();}
async function flush(){if(isTest()){S.queue=[];keep();return;}if(!S.sid||!S.queue.length)return;const q=S.queue[0];
 try{const r=await fetch(API+'save',{method:'POST',headers:{'Content-Type':'text/plain'},body:JSON.stringify({hw:HW_ID,sid:S.sid,name:S.name,part:q.part,data:q.data})});
  if(!r.ok)throw 0;S.queue.shift();keep();if(S.queue.length)flush();}catch(e){clearTimeout(flush._t);flush._t=setTimeout(flush,15000);}}
addEventListener('online',flush);

/*__DATA__*/
// голос учителя (записи Дарьи): audio/voice/<id>.wav
const VOICE=AUDIO+'voice/';
const playVoice=(id,el)=>tryURL(VOICE+id+'.wav',el);

/* ---------- каркас экрана задания ---------- */
function shell(n,{step='',scene='',pult='',sub}){clearTimers();try{curA&&curA.pause()}catch(e){}
 const T=TASKS[n];
 $('#app').innerHTML=`<div class="scr task fade" data-t="${n}">
  <div class="bar"><button class="back" id="bk" aria-label="Вернуться ко всем заданиям">${IC.back}<span>Все задания</span></button><span class="lab">Задание ${n}</span><span class="cnt" id="cnt">${step}</span></div>
  <div class="head"><div class="plq"><span class="num">${n}</span><h1>${esc(T.t)}</h1></div><p class="sub" id="sub">${sub!=null?sub:esc(T.s)}</p></div>
  <main class="scene" id="scene">${scene}</main>
  <div class="pult" id="pult">${pult}</div></div>`;
 $('#bk').onclick=()=>{clearTimers();stopGame();list();};
 S.cur=n;keep();}
const setCnt=t=>{const c=$('#cnt');if(c)c.textContent=t;};
function fb(html,cls){const f=$('#fb');if(!f)return;f.className='fb'+(cls?' '+cls:'');f.innerHTML=html?'<span>'+html+'</span>':'';}
function finish(n,res,sumHTML){S.done[n]=res;keep();send('t'+n,res);
 const left=[];for(let i=1;i<=NT;i++)if(!S.done[i])left.push(i);
 const next=left.find(i=>i>n)||left[0];
 shell(n,{step:'готово',sub:'',
  scene:`<div class="fin-box fade"><div class="bigc">${IC.ok}</div><h2>Задание ${n} сделано</h2>${sumHTML||''}</div>`,
  pult:next?`<button class="main" id="nx">Задание ${next}: ${esc(TASKS[next].t)}</button><button class="quiet" id="ls">К списку заданий</button>`
   :`<button class="main" id="nx">Мои итоги</button><button class="quiet" id="ls">К списку заданий</button>`});
 $('#nx').onclick=()=>next?TASKS[next].run():results();$('#ls').onclick=list;}

/* универсальный вопрос с клавишами: ответ верный → клавиша мягко окрашивается мятой */
function quiz(n,items,{scene,keys,cols=2,isRight,hint,okText,onShow,onOk,mainLabel='Дальше',audio,save}){
 let k=0,score=0;const miss=[],ans=[];
 const one=()=>{if(k>=items.length)return save(score,items.length,miss,ans);
  const it=items[k];let first=true,solved=false;const K=keys(it);
  shell(n,{step:(k+1)+' / '+items.length,scene:scene(it),
   pult:`<div class="fb" id="fb"></div><div class="keys k${cols}">${K.map((x,i)=>`<button class="key ${x.cls||''}" data-i="${i}">${x.html}</button>`).join('')}</div>
    <button class="main${audio?' soft':''}" id="mn" ${audio?'':'disabled'}>${audio?IC.snd+' Послушать ещё раз':esc(mainLabel)}</button>`});
  const mn=$('#mn');
  const play=()=>audio&&audio(it,$('#ps'));
  if(audio){mn.onclick=play;const ps=$('#ps');if(ps)ps.onclick=play;later(play,350);}
  onShow&&onShow(it);
  $$('.key').forEach(b=>b.onclick=()=>{if(solved)return;const x=K[+b.dataset.i];
   if(isRight(it,x)){solved=true;$$('.key').forEach(q=>q.classList.remove('hint'));b.classList.add('ok');if(first)score++;ans.push([it.id||k,x.v,first]);
    fb(okText(it,x),'ok');$$('.key').forEach(q=>q.disabled=true);
    mn.className='main';mn.disabled=false;mn.innerHTML=k+1<items.length?'Дальше':'Готово';mn.onclick=()=>{k++;one();};
    if(audio)later(()=>audio(it),150);else onOk&&onOk(it);
   }else{b.classList.remove('hint');void b.offsetWidth;b.classList.add('hint');
    if(first){first=false;miss.push(it.miss||it.id||String(k));}fb(hint(it,x),'hint');}
  });};
 one();}

/* правило в начале задания: карточки со звуком, «Дальше» открывается, когда всё прослушано */
function ruleStep(n,{sub,html,need,btn,onGo,play}){
 shell(n,{step:'правило',sub,scene:html,
  pult:`<div class="fb" id="fb"></div><button class="main" id="mn" disabled>${esc(btn)}</button>`});
 const heard=new Set(),mn=$('#mn');
 const upd=()=>{const left=need-heard.size;if(left<=0){mn.disabled=false;fb('Всё прослушано','ok');}else fb('Нажми на каждую карточку. Осталось: '+left,'');};
 $$('[data-snd]').forEach(b=>b.onclick=()=>{play(b.dataset.snd,b);b.classList.add('ok');heard.add(b.dataset.snd);upd();});
 mn.onclick=onGo;upd();}
// конец задания с двумя частями: общий счёт
const sumMiss=(score,of,miss)=>`<p>Верно с первого раза: ${score} из ${of}.</p>${miss.length?`<p>Можно повторить для закрепления:</p><div class="chips">${miss.map(m=>`<span class="x">${m}</span>`).join('')}</div>`:''}`;

