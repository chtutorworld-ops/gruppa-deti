// «Проверяющий» для заданий урока 11: ученик 12 лет проходит все 7 заданий подряд, ошибается нарочно,
// звук сверяется со списком tools/audio-list.txt. node u11.js [base-url] [phone|small|desk|desk2]   (SAIT=путь к gruppa-deti-sait)
const {chromium}=require('playwright');const {wire,errs,AUDIO_SPY}=require('./u8common');
const BASE=process.argv[2]||'http://localhost:8765/urok-11/zadaniya/';
const ONLY=process.argv[3];
const OUT=process.env.OUT||'/tmp/claude-0/t11z';require('fs').mkdirSync(OUT,{recursive:true});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const VIEWS=[['phone',390,844,true],['small',360,640,true],['desk',1440,900,false],['desk2',1280,800,false]].filter(v=>!ONLY||v[0]===ONLY);
const DK={'я':['我','wo',3],'мама':['妈','ma',1],'он':['他','ta',1],'хорошо':['好','hao',3],'ты':['你','ni',3],'папа':['爸','ba',4],'она':['她','ta',1],'звать, зовут':['叫','jiao',4],'много (людей)':['们','men',0]};
const VN={'她是我妈妈。':1,'他是你爸爸。':0,'他不是我爸爸。':null,'她是我爸爸。':0,'她是你妈妈吗？':1,'吗你是我妈妈？':0,'他们是我爸爸妈妈。':1,'不是，她不是我妈妈。':1};
const vnRight=(ru,zh)=>zh==='她是我妈妈。'?(ru==='Она моя мама.'?1:0):zh==='他不是我爸爸。'?(ru==='Он не мой папа.'?1:0):VN[zh];
const FZ={'Он мой папа.':['他','是','我','爸爸'],'Она не моя мама.':['她','不是','我','妈妈'],'Он твой папа?':['他','是','你','爸爸','吗'],'Она твоя мама?':['她','是','你','妈妈','吗'],'Он не твой папа.':['他','不是','你','爸爸'],'Они мои папа и мама.':['他们','是','我','爸爸','妈妈']};
const PS={'Привет всем!':'你们好','Она моя мама.':'她是我妈妈','Он не мой папа.':'他不是我爸爸','Она твоя мама?':'她是你妈妈吗'};
const MEM=[['你','ты'],['我','я'],['好','хорошо'],['叫','зваться'],['妈','мама'],['爸','папа'],['他','он'],['她','она'],['们','много (суффикс)'],['是','являться (да)'],['不','не'],['吗','вопрос да/нет']];
async function draw(p,ch){const info=await p.evaluate(ch=>{const el=document.querySelector('#hw');if(!el)return null;el.scrollIntoView({block:'center'});const r=el.getBoundingClientRect();return {x:r.left,y:r.top,w:r.width,med:HZDATA[ch].medians};},ch);
 if(!info)throw new Error('нет поля для '+ch);const sz=info.w,pad=sz*.08,sc=(sz-2*pad)/1024;
 for(const m of info.med){const pts=m.map(([x,y])=>[info.x+pad+x*sc,info.y+pad+(900-y)*sc]);await p.mouse.move(...pts[0]);await p.mouse.down();for(const q of pts.slice(1))await p.mouse.move(...q,{steps:4});await p.mouse.up();await sleep(110);}}
async function wrongStroke(p){const r=await p.evaluate(()=>{const el=document.querySelector('#hw');el.scrollIntoView({block:'center'});const b=el.getBoundingClientRect();return [b.left,b.top,b.width];});
 await p.mouse.move(r[0]+r[2]*.9,r[1]+r[2]*.1);await p.mouse.down();await p.mouse.move(r[0]+r[2]*.1,r[1]+r[2]*.9,{steps:6});await p.mouse.up();await sleep(200);}
const tap=async(p,sel,mobile)=>{const el=typeof sel==='string'?await p.$(sel):sel;if(!el)throw new Error('нет '+sel);await el.scrollIntoViewIfNeeded();if(mobile){const b=await el.boundingBox();await p.touchscreen.tap(b.x+b.width/2,b.y+b.height/2);}else await el.click();};
async function run(view){const [nm,w,h,mobile]=view;
 const br=await chromium.launch({args:['--autoplay-policy=no-user-gesture-required']});
 const ctx=await br.newContext({viewport:{width:w,height:h},isMobile:mobile,hasTouch:mobile,deviceScaleFactor:1});
 const log={err:[],bad:[],ok:new Set(),api:[]};await wire(ctx,log);await ctx.addInitScript(AUDIO_SPY);
 const p=await ctx.newPage();errs(p,log);const shot=n=>p.screenshot({path:`${OUT}/${nm}-${n}.png`});const shotF=n=>p.screenshot({path:`${OUT}/${nm}-${n}.png`,fullPage:true});
 const fits=async tag=>{const o=await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth);if(o>2)log.bad.push(tag+': горизонтальная прокрутка '+o+'px');};
 const go=async n=>{await p.evaluate(n=>location.hash='#'+n,n);await sleep(600);};
 const step=s=>console.log(nm,'·',s);
 const nextBtn=async n=>{const t=await p.$$eval('.btn',a=>a.map(b=>b.textContent));if(n<7&&!t.some(x=>x.includes('Задание № '+(n+1))))log.bad.push(n+': в конце нет кнопки к заданию '+(n+1));};
 await p.goto(BASE);await p.evaluate(()=>localStorage.clear());await p.reload();await sleep(600);
 await p.fill('#nm','Петя');await tap(p,'#go',mobile);await sleep(500);await fits('список');await shotF('home');
 if(!await p.$('#pbar'))log.bad.push('нет шкалы %');

 // ---------- 1 комплект карточек ----------
 await go(1);await fits('1');await shot('t1');
 const place=async(k,i,ri)=>{await tap(p,`[data-b="${k}"]`,mobile);await sleep(150);await tap(p,`[data-pool="${k}"] .cd8[data-p="${i}"] ${k==='h'?'.zh':'span'}`,mobile);await p.evaluate(s=>document.querySelector(s).scrollIntoView({block:'center'}),`.s82[data-row="${ri}"][data-k="${k}"]`);await sleep(120);await tap(p,`.s82[data-row="${ri}"][data-k="${k}"]`,mobile);await sleep(250);};
 await place('h',0,0);await place('r',1,0);await shot('t1-err');
 if(await p.$('.s82[data-row="0"][data-k="r"] .cd8'))log.bad.push('1: «я» встала к 你');
 for(let ri=0;ri<9;ri++)for(const k of ['h','p','r']){if(await p.$(`.s82[data-row="${ri}"][data-k="${k}"] .cd8`))continue;await place(k,ri,ri);}
 await sleep(1300);await fits('1 конец');await shotF('t1-end');if(!await p.$('#again'))throw new Error('1 не закончилось');await nextBtn(1);

 // ---------- 2 диктант рус→кит ----------
 await go(2);
 for(let k=0;k<9;k++){await p.waitForSelector('#hw');await sleep(500);const ru=await p.$eval('.dk11ru',e=>e.textContent);const d=DK[ru];if(!d)throw new Error('2: не знаю слово '+ru);
  if(k===0){await fits('2 иероглиф');await shot('t2-q');await wrongStroke(p);}
  if(k===1){await tap(p,'#hn',mobile);await sleep(400);await shot('t2-hint');}
  await draw(p,d[0]);await p.waitForSelector('#ck',{timeout:5000});await sleep(300);if(k===0){await fits('2 пиньинь');await shot('t2-py');}
  const word=k===3?d[1]+'x':d[1];const tone=k===2?(d[2]===1?2:1):d[2];
  if(mobile){for(const ch of word)await tap(p,`.kb8 [data-k="${ch}"]`,mobile);if(k===3)await tap(p,'.kb8 [data-k="⌫"]',mobile);}else{await p.fill('#w',k===3?d[1]:word);}
  await tap(p,`.mk8 [data-t="${tone}"]`,mobile);await tap(p,'#ck',mobile);await sleep(300);
  const fb=await p.$eval('#fb',e=>e.className+' '+e.textContent);
  if(k===2){if(!/no/.test(fb))log.bad.push('2: неверный тон засчитан');await shot('t2-err');}
  else if(k===1){if(!/подсказк/.test(fb))log.bad.push('2: подсказка не отмечена: '+fb);}
  else if(!/ ok/.test(fb))log.bad.push('2: верный ответ не засчитан '+ru+': '+fb.slice(0,80));
  await tap(p,'#nb',mobile);await sleep(400);}
 await p.waitForSelector('.ans8');await fits('2 конец');await shotF('t2-end');await nextBtn(2);

 // ---------- 3 пропись ----------
 await go(3);await shotF('t3');await tap(p,'#st',mobile);
 for(let k=0;k<6;k++){await p.waitForSelector('#hw');await sleep(700);const c=await p.$eval('.ph8 .zh',e=>e.textContent);if(k===0){await fits('3');await shot('t3-q');}if(k===1)await wrongStroke(p);await draw(p,c);await sleep(1300);}
 await p.waitForSelector('#again',{timeout:8000});await fits('3 конец');await shotF('t3-end');await nextBtn(3);

 // ---------- 4 верно-неверно ----------
 await go(4);
 for(let k=0;k<10;k++){await p.waitForSelector('[data-a]:not([disabled])');const ru=await p.$eval('.vn11ru',e=>e.textContent),zh=await p.$eval('.vn11zh',e=>e.textContent);const r=vnRight(ru,zh);if(r==null)throw new Error('4: не знаю '+ru+' '+zh);
  if(k===0){await fits('4');await shot('t4');}const a=k===1?1-r:r;await tap(p,`[data-a="${a}"]`,mobile);await sleep(300);
  const fb=await p.$eval('#fb',e=>e.className);if((a===r)!==/ok/.test(fb))log.bad.push('4: ответ оценён неверно: '+ru+' '+zh);if(k===1){await fits('4 ошибка');await shot('t4-err');}
  await tap(p,'#nb',mobile);await sleep(300);}
 await p.waitForSelector('#again');await shotF('t4-end');await nextBtn(4);

 // ---------- 5 плитки ----------
 await go(5);
 for(let k=0;k<6;k++){await p.waitForSelector('.fz9t');const ru=await p.$eval('.fz9ru',e=>e.textContent);const W=FZ[ru];if(!W)throw new Error('5: не знаю '+ru);
  if(k===0){await fits('5');await shot('t5');}
  if(k<2){const idx=await p.$$eval('.fz9t',(a,w)=>a.findIndex(b=>b.querySelector('.zh').textContent!==w),W[0]);await tap(p,`.fz9t[data-i="${idx}"]`,mobile);await sleep(250);const fb=await p.$eval('#fb',e=>e.className+' '+e.textContent);if(!/no/.test(fb))log.bad.push('5: неверная плитка без пояснения');if(k===0)await shot('t5-err');}
  const used=new Set();for(const t of W){const idx=await p.$$eval('.fz9t',(a,[t,u])=>a.findIndex((b,i)=>!b.disabled&&!u.includes(i)&&b.querySelector('.zh').textContent===t),[t,[...used]]);if(idx<0)throw new Error('5: нет плитки '+t);used.add(idx);await tap(p,`.fz9t[data-i="${idx}"]`,mobile);await sleep(150);}
  await sleep(250);if(!await p.$('#fb.ok'))log.bad.push('5: собранное не засчитано '+ru);if(k===0)await shot('t5-ok');await tap(p,'#nb',mobile);await sleep(300);}
 await p.waitForSelector('#again');await shotF('t5-end');await nextBtn(5);

 // ---------- 6 напиши иероглифами ----------
 await go(6);
 for(let k=0;k<4;k++){await p.waitForSelector('#hw');await sleep(400);const ru=await p.$eval('.dk11ru',e=>e.textContent.trim());const zh=PS[ru];if(!zh)throw new Error('6: не знаю '+ru);
  if(k===1){await tap(p,'#sw',mobile);await sleep(400);if(!await p.$('.vn11py'))log.bad.push('6: подсказки не включились');await shot('t6-hints');}
  if(k===2){await tap(p,'#sw',mobile);await sleep(400);if(await p.$('.vn11py'))log.bad.push('6: подсказки не выключились');}
  for(const [i,c] of [...zh].entries()){step('6: '+k+' '+c);await p.waitForSelector('#hw',{timeout:8000});await sleep(450);if(k===0&&i===0){await fits('6');await shot('t6');await wrongStroke(p);}await draw(p,c);await sleep(1000);}
  await p.waitForSelector('#nb');if(k===0){await fits('6 готово');await shot('t6-done');}await tap(p,'#nb',mobile);await sleep(400);}
 await p.waitForSelector('#again');await shotF('t6-end');await nextBtn(6);

 // ---------- 7 мемори ----------
 await go(7);await fits('7');await shotF('t7');
 const faces=await p.$$eval('.mc .mcf',a=>a.map(x=>x.textContent));const pairs=MEM.map(([a,b])=>[faces.indexOf(a),faces.indexOf(b)]);if(pairs.some(x=>x.includes(-1)))throw new Error('мемори карточки: '+faces.join('|'));
 await tap(p,`.mc[data-j="${pairs[0][0]}"]`,mobile);await tap(p,`.mc[data-j="${pairs[1][1]}"]`,mobile);await sleep(1200);
 for(const [a,b] of pairs){await tap(p,`.mc[data-j="${a}"]`,mobile);await tap(p,`.mc[data-j="${b}"]`,mobile);await sleep(350);}
 await p.waitForSelector('#again',{timeout:8000});await shotF('t7-end');

 // ---------- итоги ----------
 await go('itogi');await fits('итоги');await shotF('itogi');if(await p.$('.left button'))log.bad.push('итоги: что-то осталось недоделанным');
 const pc=await p.$eval('#pbar',e=>e.textContent.replace(/\s+/g,' '));step('шкала: '+pc);
 const saves=log.api.filter(a=>/save/.test(a)).map(a=>(a.match(/"part":"([^"]+)"/)||[])[1]);for(const t of ['t1','t2','t3','t4','t5','t6','t7','dk','ps'])if(!saves.includes(t))log.bad.push('не отправлено в кабинет: '+t);
 await p.evaluate(()=>{const S=JSON.parse(localStorage.getItem('zh-u11-done')||'{}');for(const k of Object.keys(S))if(k!=='1')delete S[k];localStorage.setItem('zh-u11-done',JSON.stringify(S));});await p.reload();await sleep(500);
 await go('itogi');const left=await p.$$eval('.left button',a=>a.length);if(left!==6)log.bad.push('«не доделано» показывает '+left+' вместо 6');await shotF('itogi-left');
 const au=await p.evaluate(()=>__au);const badAu=au.filter(a=>a.err);
 console.log(`== ${nm}: ошибок консоли ${log.err.length}, замечаний ${new Set(log.bad).size}, звуков ${au.length} (с ошибкой ${badAu.length}), отправки ${[...new Set(saves)].join(',')}`);
 [...new Set(log.err)].slice(0,10).forEach(e=>console.log('  ERR',e));[...new Set(log.bad)].slice(0,30).forEach(e=>console.log('  !',e));
 console.log('  звуки:',[...log.ok].join(' '));
 require('fs').writeFileSync(OUT+'/saves-'+nm+'.json',JSON.stringify(log.saves||[]));
 await br.close();return log.err.length+new Set(log.bad).size;}
(async()=>{let bad=0;for(const v of VIEWS){try{bad+=await run(v);}catch(e){bad++;console.log(v[0],'!!! СЛОМАЛОСЬ',e.message.split('\n')[0]);}}console.log(bad?'ЕСТЬ ЗАМЕЧАНИЯ':'ЧИСТО');process.exit(bad?1:0);})();
