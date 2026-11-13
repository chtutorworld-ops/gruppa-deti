// «Проверяющий» для «Повторения 2 для Володи» (povtor-vova-2): ученик 12 лет проходит все 8 заданий подряд,
// нарочно ошибается, жмёт все кнопки звука, рисует тоны, собирает слоги, записывает голос (фальшивый микрофон),
// доигрывает «Звуковую ракету» (она обязана открываться на весь экран), потом проверяет кабинет учителя.
// node pvova2.js [base-url] [phone|land|desk]   (по умолчанию http://localhost:8765/povtor-vova-2/, все три вида)
const {chromium}=require('playwright');const fs=require('fs');const {wire,errs,AUDIO_SPY}=require('./u8common');
const BASE=process.argv[2]||'http://localhost:8765/povtor-vova-2/';
const ONLY=process.argv[3];const ONLYT=(process.env.ONLY||'').split(',').filter(Boolean).map(Number);
const OUT=process.env.OUT||'/tmp/claude-0/tpv2';fs.mkdirSync(OUT,{recursive:true});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const VIEWS=[['phone',390,844,true],['land',844,390,true],['desk',1280,720,false]].filter(v=>!ONLY||v[0]===ONLY);
const TSH={1:'ровно',2:'вверх',3:'ямка',4:'вниз'};
async function overflow(p,tag){const o=await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth);if(o>2)throw new Error(tag+': horizontal overflow '+o+'px');}
const tapEl=async(p,el,mobile)=>{await el.scrollIntoViewIfNeeded().catch(()=>{});const b=await el.boundingBox();if(!b)throw new Error('элемент не виден');if(mobile)await p.touchscreen.tap(b.x+b.width/2,b.y+b.height/2);else await p.mouse.click(b.x+b.width/2,b.y+b.height/2);};
const tap=async(p,sel,mobile)=>{const el=await p.$(sel);if(!el)throw new Error('нет '+sel);await tapEl(p,el,mobile);};
async function sounds(p,sel,log,tag){const bs=await p.$$(sel);const n0=await p.evaluate(()=>__au.length);for(const b of bs){await b.scrollIntoViewIfNeeded().catch(()=>{});await b.click({force:true}).catch(()=>{});await sleep(250);}
 const n1=await p.evaluate(()=>__au.length);if(bs.length&&n1-n0<bs.length)log.bad.push(tag+': кнопок звука '+bs.length+', а звуков сыграло '+(n1-n0));return bs.length;}
const doneH=p=>p.evaluate(()=>/готово!/.test((document.querySelector('h2')||{}).textContent||''));
async function quizTask(p,n,mobile,log){if(await p.$('#st')){await sounds(p,'[data-sy]',log,'№'+n+' правило');await tap(p,'#st',mobile);}await sleep(500);let wrong=0,q=0;
 for(let g=0;g<120;g++){if(await doneH(p))return {q,wrong};const opts=await p.$$('.opt:not([disabled])');
  if(opts.length){q++;const a0=await p.evaluate(()=>__au.length);if(q<=2){await tap(p,'#pl',mobile);await sleep(300);if(await p.evaluate(a=>__au.length,a0)<=a0)log.bad.push('№'+n+': 🔊 не играет');}
   await tapEl(p,opts[Math.floor(Math.random()*opts.length)],mobile);await sleep(250);const fb=await p.$eval('#fb',e=>e.className).catch(()=>'');if(/no/.test(fb))wrong++;const nb=await p.$('#nb');if(nb)await tapEl(p,nb,mobile);await sleep(300);continue;}
  await sleep(300);}
 throw new Error('task '+n+' did not finish');}
async function draw(p,t){await p.$eval('#dsv',e=>e.scrollIntoView({block:'center'}));await sleep(150);const b=await p.$eval('#dsv',e=>{const r=e.getBoundingClientRect();if(r.top<0||r.bottom>innerHeight+1)throw new Error('поле для рисования не помещается на экран '+Math.round(r.height)+' из '+innerHeight);return {x:r.left,y:r.top,w:r.width,h:r.height};});
 const P={1:[[0,5],[1,5]],2:[[0,3],[1,5]],3:[[0,2.2],[.45,1],[.6,1],[1,4]],4:[[0,5],[1,1]]}[t];
 const pt=([u,v])=>[b.x+(50+u*510)*b.w/600,b.y+(260-(v-1)*55)*b.h/300];
 const seg=[];for(let k=0;k<P.length-1;k++)for(let s=0;s<=10;s++){const a=P[k],c=P[k+1],u=s/10;seg.push(pt([a[0]+(c[0]-a[0])*u,a[1]+(c[1]-a[1])*u]));}
 await p.mouse.move(...seg[0]);await p.mouse.down();for(const q of seg.slice(1))await p.mouse.move(...q,{steps:2});await p.mouse.up();}
async function game(p,w,h,mobile,step,log){
 const inl=await p.evaluate(()=>{const r=document.querySelector('.kst').getBoundingClientRect();return {top:Math.round(r.top),bottom:Math.round(r.bottom),vh:innerHeight};});
 step('ракета в странице: '+JSON.stringify(inl));if(inl.top<0||inl.bottom>inl.vh+1)throw new Error('окно игры не помещается на экран целиком '+JSON.stringify(inl));
 await tap(p,'.kstage .zr-start .zr-go',mobile);await sleep(1200);
 const f=await p.evaluate(()=>{const k=document.querySelector('.kst');const r=k.getBoundingClientRect();const s=document.querySelector('.kstage').getBoundingClientRect();const c=document.querySelector('.kstage canvas').getBoundingClientRect();
  return {full:k.classList.contains('kfull'),w:Math.round(r.width),h:Math.round(r.height),sx:Math.round(s.left),sy:Math.round(s.top),sw:Math.round(s.width),sh:Math.round(s.height),cw:Math.round(c.width),ch:Math.round(c.height)};});
 step('ракета на весь экран: '+JSON.stringify(f));
 if(!f.full||Math.abs(f.w-w)>2||Math.abs(f.h-h)>2)throw new Error('ракета не на весь экран');
 if(Math.abs(f.sw-w)>3&&Math.abs(f.sh-h)>3)throw new Error('сцена ракеты не во весь экран');
 if(f.sx<-2||f.sy<-2||f.sx+f.sw>w+2||f.sy+f.sh>h+2)throw new Error('сцена вылезает за экран');
 if(Math.abs(f.cw-f.sw)>3||Math.abs(f.ch-f.sh)>3)throw new Error('поле игры не на всю сцену (пол-окна!) '+JSON.stringify(f));
 // игра запустилась сразу (касание открыло весь экран и нажало «Полетели»)
 let st=await p.evaluate(()=>document.querySelector('.kstage')._inst._dbg().state);if(st==='start'){await tap(p,'.kstage .zr-start .zr-go',mobile);await sleep(500);}
 await sleep(2600);
 const lanePt=async k=>p.evaluate(k=>{const s=document.querySelector('.kstage');const L=s._inst._lane();const sx=640,sy=L[k];const q=s._rot;
  if(q)return [q.tx-sy*q.k,q.ty+sx*q.k];const r=s.getBoundingClientRect();return [r.left+sx*r.width/1280,r.top+sy*r.height/720];},k);
 let lastRi=-1,guard=0,auBefore=await p.evaluate(()=>__au.length);
 while(guard++<400){const d=await p.evaluate(()=>document.querySelector('.kstage')._inst._dbg());
  if(d.state==='end')break;
  if(d.state==='play'&&d.wallX!=null&&!d.done&&d.ri!==lastRi){lastRi=d.ri;
   // первые 3 — нарочно мимо, потом верно; иногда сначала мимо, потом передумал
   const wrong=d.ri<3;const target=wrong?(d.okLane+1)%4:d.okLane;
   if(d.ri===5){const [x,y]=await lanePt((d.okLane+2)%4);mobile?await p.touchscreen.tap(x,y):await p.mouse.click(x,y);await sleep(150);}
   if(d.ri===1){await tap(p,'.kstage .zr-say',mobile);await sleep(200);}
   const [x,y]=await lanePt(target);mobile?await p.touchscreen.tap(x,y):await p.mouse.click(x,y);await sleep(350);
   const d2=await p.evaluate(()=>document.querySelector('.kstage')._inst._dbg());if(d2.lane!==target)throw new Error('касание ворот не перевело ракету: lane '+d2.lane+' вместо '+target);
   if(d.ri===2)await p.screenshot({path:OUT+'/'+ONLYV+'-08-game.png'});
   await p.evaluate(()=>document.querySelector('.kstage')._inst._fast());}
  await sleep(120);}
 const d=await p.evaluate(()=>document.querySelector('.kstage')._inst._dbg());
 step('ракета итог: '+JSON.stringify(d));if(d.state!=='end')throw new Error('игра не закончилась');if(d.right!==13||d.wrong!==3)throw new Error('счёт игры неверный '+JSON.stringify(d));
 const au=await p.evaluate(a=>__au.length-a,auBefore);if(au<16)log.bad.push('в игре сыграло звуков '+au+' (меньше 16)');
 await p.screenshot({path:OUT+'/'+ONLYV+'-08-end.png'});}
let ONLYV='';
async function run(view){const [nm,w,h,mobile]=view;ONLYV=nm;
 const br=await chromium.launch({args:['--autoplay-policy=no-user-gesture-required','--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream']});
 const ctx=await br.newContext({viewport:{width:w,height:h},isMobile:mobile,hasTouch:mobile,deviceScaleFactor:1,permissions:['microphone']});
 const log={err:[],bad:[],ok:new Set(),api:[]};await wire(ctx,log);await ctx.addInitScript(AUDIO_SPY);
 const p=await ctx.newPage();errs(p,log);
 const shot=n=>p.screenshot({path:`${OUT}/${nm}-${n}.png`});const shotF=n=>p.screenshot({path:`${OUT}/${nm}-${n}.png`,fullPage:true});
 const go=async n=>{await p.evaluate(n=>location.hash='#'+n,n);await sleep(700);};
 const step=s=>console.log(nm,'·',s);const want=n=>!ONLYT.length||ONLYT.includes(n);
 await p.goto(BASE);await sleep(700);
 await p.fill('#nm','Проверка П');await tap(p,'#go',mobile);await sleep(500);await overflow(p,'home');await shotF('00-home');
 if(!await p.$('#pbar'))throw new Error('нет шкалы %');
 const nItems=await p.$$eval('.ti',a=>a.length);if(nItems!==8)throw new Error('заданий в списке '+nItems);
 await go('itogi');const lf=await p.$$eval('.left [data-go]',a=>a.length);if(lf!==8)throw new Error('в итогах «не доделано» '+lf+' вместо 8');await shotF('00-itogi-pusto');
 await tap(p,'.left [data-go="3"]',mobile);await sleep(500);if(!/#3$/.test(p.url()))throw new Error('кнопка «Сделать →» не ведёт к заданию');

 // ---------- 1 нарисуй тон ----------
 if(want(1)){await go(1);await sounds(p,'[data-sy]',log,'№1 правило');await shotF('01-rule');await tap(p,'#st',mobile);await sleep(500);
  let n=0,bad=0;for(let g=0;g<40&&!(await doneH(p));g++){if(!await p.$('#dsv')){await sleep(300);continue;}
   n++;const t=1+((n+(n>4?1:0))%4);
   // короткий штрих — должен попросить провести подлиннее
   if(n===1){await p.$eval('#dsv',e=>e.scrollIntoView({block:'center'}));const b=await p.$eval('#dsv',e=>{const r=e.getBoundingClientRect();return [r.left+r.width/2,r.top+r.height/2];});await p.mouse.move(b[0],b[1]);await p.mouse.down();await p.mouse.move(b[0]+8,b[1]+3);await p.mouse.up();await sleep(300);
    if(await p.$eval('#fb',e=>e.textContent))throw new Error('№1: короткий штрих засчитан как ответ');}
   await draw(p,t);await sleep(300);const fb=await p.$eval('#fb',e=>({c:e.className,t:e.textContent}));
   if(!fb.t)throw new Error('№1: после рисования нет ответа');
   if(/no/.test(fb.c)){bad++;if(!fb.t.includes('«'+TSH[t]+'»'))throw new Error('№1: нарисовал '+t+'-й тон, а распознано иначе: '+fb.t);}
   if(n===2)await shotF('01-draw');
   const nb=await p.$('#nb');if(nb)await tapEl(p,nb,mobile);await sleep(400);}
  if(!await doneH(p))throw new Error('№1 не закончилось');step('№1 нарисовано '+n+', ошибок '+bad);await shotF('01-done');}
 // ---------- 2 одинаковые или разные ----------
 if(want(2)){await go(2);await shotF('02-rule');const r=await quizTask(p,2,mobile,log);step('№2 '+JSON.stringify(r));await shotF('02-done');}
 // ---------- 3 собери слог ----------
 if(want(3)){await go(3);await sounds(p,'[data-sy]',log,'№3 правило');await tap(p,'#st',mobile);await sleep(500);let n=0;
  for(let g=0;g<40&&!(await doneH(p));g++){if(!await p.$('#chk')){await sleep(300);continue;}n++;
   if(await p.$eval('#chk',e=>!e.disabled))throw new Error('№3: «Проверить» активна до выбора');
   for(const k of ['i','f','t']){const bs=await p.$$(`.bk[data-k="${k}"]`);await tapEl(p,bs[Math.floor(Math.random()*bs.length)],mobile);await sleep(120);}
   if(n===1)await shotF('03-build');
   await tap(p,'#chk',mobile);await sleep(300);const fb=await p.$eval('#fb',e=>e.textContent);if(!fb)throw new Error('№3: нет ответа после «Проверить»');
   if(n===1)await shotF('03-check');const nb=await p.$('#nb');if(nb)await tapEl(p,nb,mobile);await sleep(400);}
  if(!await doneH(p))throw new Error('№3 не закончилось');step('№3 собрано '+n);await shotF('03-done');}
 // ---------- 4 близнецы, 5 найди ошибку ----------
 for(const n of [4,5])if(want(n)){await go(n);await shotF('0'+n+'-rule');const r=await quizTask(p,n,mobile,log);step('№'+n+' '+JSON.stringify(r));await shotF('0'+n+'-done');}
 // ---------- 6 z c s zh ch sh ----------
 if(want(6)){await go(6);await sounds(p,'.zrow6 [data-sy]',log,'№6 правило');await shotF('06-rule');
  // нарочно неверная пара, потом все верно
  const L=await p.$$eval('[data-l]',a=>a.map(x=>x.dataset.l));
  await tap(p,`[data-l="${L[0]}"]`,mobile);await sleep(200);const wrongR=L.find(x=>x!==L[0]);await tap(p,`[data-r="${wrongR}"]`,mobile);await sleep(300);
  if(!/no/.test(await p.$eval('#fb',e=>e.className)))throw new Error('№6: неверная пара не показала ошибку');
  for(const l of L){await tap(p,`[data-l="${l}"]`,mobile);await sleep(200);await tap(p,`[data-r="${l}"]`,mobile);await sleep(300);}
  await shotF('06-match');await tap(p,'#go2',mobile);await sleep(500);const r=await quizTask(p,6,mobile,log);step('№6 '+JSON.stringify(r));
  const t6=(log.saves||[]).filter(s=>s.part==='t6').pop();if(!t6||t6.data.of!==12||!t6.data.match||t6.data.match.errs!==1)throw new Error('№6: в кабинет ушло не то '+JSON.stringify(t6&&t6.data).slice(0,200));
  await shotF('06-done');}
 // ---------- 7 скажи сам (фальшивый микрофон) ----------
 if(want(7)){await go(7);await shotF('07-a');const k0=log.api.filter(a=>/\/api\/dz\/audio/.test(a)).length;
  for(let k=0;k<4;k++){await tap(p,`[data-ref="${k}"]`,mobile);await sleep(1600);await tap(p,`[data-rec="${k}"]`,mobile);await sleep(nm==='desk'&&k===0?1500:4600);
   if(nm==='desk'&&k===0){await tap(p,`[data-rec="${k}"]`,mobile);await sleep(800);}  // кнопка «■ Стоп»
   await sleep(500);}
  await shotF('07-done-cards');const up=log.api.filter(a=>/\/api\/dz\/audio/.test(a)).length-k0;if(up<4)throw new Error('№7: записей отправлено '+up+' из 4');
  const me=await p.$('[data-me="0"]');if(me&&!(await me.isDisabled())){await tapEl(p,me,mobile);await sleep(400);}
  await tap(p,'#fin7',mobile);await sleep(500);if(!await doneH(p))throw new Error('№7 не закончилось');step('№7 записей '+up);}
 // ---------- 8 игра ----------
 if(want(8)){await go(8);await shotF('08-a');await shot('08-screen');await game(p,w,h,mobile,step,log);await sleep(3200);
  const kr=await p.$('#kr .res');if(!kr)throw new Error('№8: после игры нет результата на странице');
  const full=await p.evaluate(()=>!!document.querySelector('.kst.kfull'));if(full)throw new Error('после игры не вышли из полного экрана');await shotF('08-done');}
 // ---------- итоги ----------
 if(!ONLYT.length){await go('itogi');await shotF('09-itogi');const lf2=await p.$$eval('.left [data-go]',a=>a.length);if(lf2)throw new Error('после всех заданий «не доделано» = '+lf2);
  if(!await p.$('.allok'))throw new Error('нет «Все задания сделаны»');
  const pc=await p.$eval('#pbar',e=>e.textContent);if(!/100%/.test(pc))throw new Error('шкала не 100%: '+pc);}
 await overflow(p,'end');
 // звук: каждое play() дало звук без ошибки
 const au=await p.evaluate(()=>__au.map(a=>({s:a.src.split('/').pop(),dur:a.dur,err:a.err})));const badA=au.filter(a=>a.err);if(badA.length)log.bad.push('аудио с ошибкой: '+JSON.stringify(badA.slice(0,5)));
 step('звуков сыграло '+au.length+', разных файлов '+log.ok.size);
 const parts=[...new Set((log.saves||[]).map(s=>s.part))];step('в кабинет ушло: '+parts.join(' '));
 fs.writeFileSync(OUT+'/'+nm+'-saves.json',JSON.stringify(log.saves||[]));
 await br.close();
 if(log.err.length||log.bad.length){console.log(nm,'ОШИБКИ:',log.err,log.bad);throw new Error(nm+': ошибки в консоли или со звуком');}
 if(!ONLYT.length&&parts.filter(x=>/^t\d$/.test(x)).length!==8)throw new Error('в кабинет ушли не все задания: '+parts);
 console.log(nm,'✓ чистый прогон');}
(async()=>{for(const v of VIEWS)await run(v);})().catch(e=>{console.error('ПРОВАЛ:',e.message);process.exit(1);});
