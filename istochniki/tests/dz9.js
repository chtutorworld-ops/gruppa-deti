// «Проверяющий» для ДЗ 9 (новый дизайн): ученик 12 лет проходит все 7 заданий подряд, ошибается нарочно,
// проверяет, что каждый шаг помещается в экран без прокрутки, главная кнопка видна, звук запрашивается из списка.
// node dz9.js [base-url] [phone|small|desk]
const {chromium}=require('playwright');const {wire,errs,AUDIO_SPY,LIST,fname}=require('./u8common');
const BASE=process.argv[2]||'http://localhost:8099/dz-9/';
const ONLY=process.argv[3];
const OUT=process.env.OUT||'/tmp/claude-0/t9dz';require('fs').mkdirSync(OUT,{recursive:true});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const VIEWS=[['phone',390,844,true],['small',360,640,true],['desk',1440,900,false]].filter(v=>!ONLY||v[0]===ONLY);
const MEM={'我':'я','你':'ты','他':'он','她':'она','我们':'мы','你们':'вы','他们':'они','妈':'мама'};
const MST={'мы':'我们','вы':'你们','я':'我','ты':'你','он':'他','она':'她'};
async function draw(p,ch){const info=await p.evaluate(ch=>{const el=document.querySelector('#hw');const r=el.getBoundingClientRect();return {x:r.left,y:r.top,w:r.width,med:HZDATA[ch].medians};},ch);
 const sz=info.w,pad=sz*.08,sc=(sz-2*pad)/1024;
 for(const m of info.med){const pts=m.map(([x,y])=>[info.x+pad+x*sc,info.y+pad+(900-y)*sc]);await p.mouse.move(...pts[0]);await p.mouse.down();for(const q of pts.slice(1))await p.mouse.move(...q,{steps:4});await p.mouse.up();await sleep(120);}}
async function wrongStroke(p){const r=await p.evaluate(()=>{const b=document.querySelector('#hw').getBoundingClientRect();return [b.left,b.top,b.width];});
 await p.mouse.move(r[0]+r[2]*.9,r[1]+r[2]*.1);await p.mouse.down();await p.mouse.move(r[0]+r[2]*.1,r[1]+r[2]*.9,{steps:6});await p.mouse.up();await sleep(250);}
async function fits(p,tag,log){const o=await p.evaluate(()=>{const m=document.querySelector('#mn,#nx');const b=m?m.getBoundingClientRect():null;
  return {hx:document.documentElement.scrollWidth-innerWidth,vy:document.documentElement.scrollHeight-innerHeight,mb:b?b.bottom-innerHeight:null};});
 if(o.hx>2)log.bad.push(tag+': горизонтальная прокрутка '+o.hx+'px');
 if(o.vy>2)log.bad.push(tag+': шаг длиннее экрана на '+o.vy+'px');
 if(o.mb!=null&&o.mb>1)log.bad.push(tag+': главная кнопка за краем экрана');}
const click=async(p,sel,mobile)=>{const el=await p.$(sel);if(!el)throw new Error('нет '+sel);if(mobile){const b=await el.boundingBox();await p.touchscreen.tap(b.x+b.width/2,b.y+b.height/2);}else await el.click();};
async function waitEnabled(p,sel,ms=15000){await p.waitForFunction(s=>{const e=document.querySelector(s);return e&&!e.disabled;},sel,{timeout:ms});}
async function finished(p,n){await p.waitForFunction(n=>{const h=document.querySelector('.fin-box h2');return h&&h.textContent.includes('Задание '+n+' сделано');},n,{timeout:20000});}
// перебор клавиш: первая неверная (нарочно), пока не станет верно
async function brute(p,sel,mobile){const n=await p.$$eval(sel,e=>e.length);for(let i=0;i<n;i++){
 const ok=await p.evaluate(s=>!!document.querySelector(s+'.ok'),sel);if(ok)return i;
 const d=await p.$eval(`${sel}:nth-child(${i+1})`,e=>e.disabled);if(d)continue;await click(p,`${sel}:nth-child(${i+1})`,mobile);await sleep(160);}
 return n;}
async function run(view){const [nm,w,h,mobile]=view;
 const br=await chromium.launch({args:['--autoplay-policy=no-user-gesture-required']});
 const ctx=await br.newContext({viewport:{width:w,height:h},isMobile:mobile,hasTouch:mobile,deviceScaleFactor:1});
 const log={err:[],bad:[],ok:new Set(),api:[]};await wire(ctx,log);await ctx.addInitScript(AUDIO_SPY);
 const p=await ctx.newPage();errs(p,log);const shot=async t=>p.screenshot({path:`${OUT}/${nm}-${t}.png`});
 await p.goto(BASE);await p.evaluate(()=>localStorage.clear());await p.reload();
 await click(p,'#go',mobile);await sleep(200);// пустое имя: должна быть подсказка
 await p.fill('#nm','Петя');await click(p,'#go',mobile);await sleep(400);await shot('list');
 const hx=await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth);if(hx>2)log.bad.push('список: горизонтальная прокрутка');
 // ---- 1 пропись
 await click(p,'#go',mobile);await sleep(500);
 for(const ch of ['他','她','们']){
  await waitEnabled(p,'#mn',20000);await fits(p,'1 смотри '+ch,log);await click(p,'#mn',mobile);await sleep(500);
  await fits(p,'1 обведи '+ch,log);if(ch==='他')await shot('t1');await draw(p,ch);await waitEnabled(p,'#mn');await click(p,'#mn',mobile);await sleep(500);
  await wrongStroke(p);await draw(p,ch);await waitEnabled(p,'#mn');await click(p,'#mn',mobile);await sleep(500);}
 await finished(p,1);await shot('t1-fin');await click(p,'#nx',mobile);await sleep(500);
 // ---- 2 он или она
 for(let k=0;k<6;k++){await fits(p,'2 шаг '+(k+1),log);const f=await p.$eval('.photo',e=>e.getAttribute('src'));const she=/pevica|puteshestvennica|uchitelnica/.test(f);
  await click(p,`.key:nth-child(${she?1:2})`,mobile);await sleep(200);if(k===0)await shot('t2-hint');
  await click(p,`.key:nth-child(${she?2:1})`,mobile);await sleep(300);if(k===0)await shot('t2-ok');await waitEnabled(p,'#mn');await click(p,'#mn',mobile);await sleep(400);}
 await finished(p,2);await click(p,'#nx',mobile);await sleep(500);
 // ---- 3 я, ты, мы, они
 for(let k=0;k<8;k++){await fits(p,'3 шаг '+(k+1),log);const [ru,sub]=await p.$eval('.ru-big',e=>[e.childNodes[0].textContent.trim(),e.querySelector('small').textContent]);
  const want=ru==='они'?(/девочки/.test(sub)?'她们':'他们'):MST[ru];
  const keys=await p.$$eval('.keys .key .zh',e=>e.map(x=>x.textContent));const wi=keys.findIndex(x=>x!==want),ri=keys.indexOf(want);
  if(ri<0){log.bad.push('3: нет верного ответа для '+ru);break;}
  await click(p,`.key:nth-child(${wi+1})`,mobile);await sleep(200);await click(p,`.key:nth-child(${ri+1})`,mobile);await sleep(300);
  if(k===0)await shot('t3');await waitEnabled(p,'#mn');await click(p,'#mn',mobile);await sleep(400);}
 await finished(p,3);await click(p,'#nx',mobile);await sleep(500);
 // ---- 4 услышь финаль
 for(let k=0;k<12;k++){await fits(p,'4 шаг '+(k+1),log);await brute(p,'.keys .key',mobile);if(k===0)await shot('t4');await waitEnabled(p,'#mn');await click(p,'#mn',mobile);await sleep(400);}
 await finished(p,4);await click(p,'#nx',mobile);await sleep(500);
 // ---- 5 диктант
 for(let k=0;k<8;k++){for(let ph=0;ph<3;ph++){await fits(p,`5 шаг ${k+1}.${ph+1}`,log);await brute(p,'#kk .key',mobile);if(k===0&&ph===1)await shot('t5');await sleep(800);}
  await waitEnabled(p,'#mn');const t=await p.$eval('#mn',e=>e.textContent);if(!/Дальше|Готово/.test(t))log.bad.push('5: нет кнопки «Дальше»');await click(p,'#mn',mobile);await sleep(400);}
 await finished(p,5);await click(p,'#nx',mobile);await sleep(500);
 // ---- 6 крот (прежняя игра ДЗ 8: на весь экран, 60 с)
 await fits(p,'6 начало',log);await click(p,'.kbig',mobile);await sleep(700);
 if(!await p.$('.kst.kfull'))log.bad.push('6: игра не открылась на весь экран');
 await click(p,'.kstage .ml-start .ml-go',mobile);
 let hits=0,wrong=0,paused=false;const t0=Date.now();
 while(Date.now()-t0<75000){if(await p.$('.kstage .ml-end:not(.hide)'))break;
  if(!paused&&Date.now()-t0>4000){paused=true;await click(p,'.t8pause',mobile);await sleep(400);if(!await p.$('.ml-pause:not(.hide)'))log.bad.push('6: пауза не показалась');await shot('t6-pause');await sleep(800);await click(p,'.t8res',mobile);}
  const tf=await p.$eval('.t8n',e=>e.textContent).catch(()=>'');
  const ms=await p.$$eval('.ml-mole.up:not(.happy):not(.dizzy)',e=>e.map(x=>{const r=x.querySelector('.ml-sign').getBoundingClientRect();return {t:x.querySelector('.ml-sign b').textContent,x:r.x+r.width/2,y:r.y+r.height/2,w:r.width};}));
  for(const m of ms){if(m.w<5)continue;const pl=m.t.normalize('NFD').replace(/[\u0300-\u036f]/g,'');const good=pl.endsWith(tf);
   if(good||wrong<2){if(mobile)await p.touchscreen.tap(m.x,m.y);else await p.mouse.click(m.x,m.y);good?hits++:wrong++;if(hits===2)await shot('t6');await sleep(250);break;}}
  await sleep(200);}
 await shot('t6-end');
 await finished(p,6);if(hits<3)log.bad.push('6: попаданий мало ('+hits+')');if(await p.$('.kst'))log.bad.push('6: игра не закрылась после конца');await shot('t6-fin');await click(p,'#nx',mobile);await sleep(500);
 // ---- 7 мемори
 await fits(p,'7',log);const cards=await p.$$eval('.mc .fa',e=>e.map(x=>x.textContent));
 const pairOf=t=>MEM[t]||Object.keys(MEM).find(k=>MEM[k]===t);
 const a0=cards[0],bad=cards.findIndex((t,i)=>i>0&&pairOf(a0)!==t);await click(p,'.mc[data-j="0"]',mobile);await click(p,`.mc[data-j="${bad}"]`,mobile);await sleep(1300);
 const used=new Set();for(let i=0;i<cards.length;i++){if(used.has(i))continue;const j=cards.findIndex((t,k)=>k!==i&&!used.has(k)&&t===pairOf(cards[i]));used.add(i);used.add(j);
  await click(p,`.mc[data-j="${i}"]`,mobile);await sleep(150);await click(p,`.mc[data-j="${j}"]`,mobile);await sleep(500);}
 await shot('t7');await finished(p,7);await click(p,'#nx',mobile);await sleep(500);
 const res=await p.$eval('.top h1',e=>e.textContent);if(!/7 из 7/.test(res))log.bad.push('итоги: '+res);await shot('itogi');
 const au=await p.evaluate(()=>window.__au.length);if(au<20)log.bad.push('звуков мало: '+au);
 const auErr=await p.evaluate(()=>window.__au.filter(a=>a.err).length);if(auErr)log.bad.push('ошибок звука: '+auErr);
 // ---- после обновления страницы ничего не потерялось
 await p.reload();await sleep(400);const pr=await p.$eval('.prog b',e=>e.textContent);if(pr!=='7 из 7')log.bad.push('после обновления: '+pr);
 const parts=(log.saves||[]).filter(s=>s.hw==='dz9').map(s=>s.part);for(let i=1;i<=7;i++)if(!parts.includes('t'+i))log.bad.push('не отправлено в кабинет: t'+i);
 await br.close();
 console.log(`== ${nm}: ошибок консоли ${log.err.length}, замечаний ${log.bad.length}, звуков ${au}, слоги диктора ${(log.dict||new Set()).size}, отправок ${parts.length}`);
 [...new Set(log.err)].slice(0,10).forEach(e=>console.log('  ERR',e));[...new Set(log.bad)].slice(0,30).forEach(e=>console.log('  !',e));
 return log.err.length+log.bad.length;}
(async()=>{let bad=0;for(const v of VIEWS)bad+=await run(v);console.log(bad?'ЕСТЬ ЗАМЕЧАНИЯ':'ЧИСТО');process.exit(bad?1:0);})().catch(e=>{console.error('СЛОМАЛОСЬ',e);process.exit(2);});
