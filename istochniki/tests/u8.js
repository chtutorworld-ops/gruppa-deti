// «Проверяющий» для заданий урока 8: ученик 12 лет проходит все 8 заданий подряд, ошибается нарочно,
// нажимает все кнопки звука. node u8.js [base-url] [phone|land|desk]
const {chromium}=require('playwright');const {wire,errs,AUDIO_SPY}=require('./u8common');
const BASE=process.argv[2]||'http://localhost:8765/urok-8/zadaniya/';
const ONLY=process.argv[3];
const OUT=process.env.OUT||'/tmp/claude-0/t8z';require('fs').mkdirSync(OUT,{recursive:true});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const VIEWS=[['phone',390,844,true],['land',844,390,true],['desk',1280,720,false]].filter(v=>!ONLY||v[0]===ONLY);
async function draw(p,ch){const info=await p.evaluate(ch=>{const el=document.querySelector('#hw');if(!el)return null;el.scrollIntoView({block:'center'});const r=el.getBoundingClientRect();return {x:r.left,y:r.top,w:r.width,med:HZDATA[ch].medians};},ch);
 if(!info)throw new Error('no writer for '+ch);const sz=info.w,pad=sz*.08,sc=(sz-2*pad)/1024;
 for(const m of info.med){const pts=m.map(([x,y])=>[info.x+pad+x*sc,info.y+pad+(900-y)*sc]);await p.mouse.move(...pts[0]);await p.mouse.down();for(const q of pts.slice(1))await p.mouse.move(...q,{steps:4});await p.mouse.up();await sleep(110);}}
async function wrongStroke(p){const r=await p.evaluate(()=>{const el=document.querySelector('#hw');el.scrollIntoView({block:'center'});const b=el.getBoundingClientRect();return [b.left,b.top,b.width];});
 await p.mouse.move(r[0]+r[2]*.9,r[1]+r[2]*.1);await p.mouse.down();await p.mouse.move(r[0]+r[2]*.1,r[1]+r[2]*.9,{steps:6});await p.mouse.up();await sleep(200);}
async function overflow(p,tag){const o=await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth);if(o>2)throw new Error(tag+': horizontal overflow '+o+'px');}
const tap=async(p,sel,mobile)=>{const el=await p.$(sel);if(!el)throw new Error('нет '+sel);await el.scrollIntoViewIfNeeded();if(mobile){const b=await el.boundingBox();await p.touchscreen.tap(b.x+b.width/2,b.y+b.height/2);}else await el.click();};
async function sounds(p,sel,max=40){const bs=await p.$$(sel);let k=0;for(const b of bs.slice(0,max)){await b.scrollIntoViewIfNeeded().catch(()=>{});await b.click({force:true}).catch(()=>{});k++;await sleep(260);}return k;}
async function run(view){const [nm,w,h,mobile]=view;
 const br=await chromium.launch({args:['--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream','--autoplay-policy=no-user-gesture-required']});
 const ctx=await br.newContext({viewport:{width:w,height:h},isMobile:mobile,hasTouch:mobile,deviceScaleFactor:1,permissions:['microphone']});
 const log={err:[],bad:[],ok:new Set(),api:[]};await wire(ctx,log);await ctx.addInitScript(AUDIO_SPY);
 const p=await ctx.newPage();errs(p,log);const shot=n=>p.screenshot({path:`${OUT}/${nm}-${n}.png`});const shotF=n=>p.screenshot({path:`${OUT}/${nm}-${n}.png`,fullPage:true});
 const go=async n=>{await p.evaluate(n=>location.hash='#'+n,n);await sleep(600);};
 const step=s=>console.log(nm,'·',s);
 await p.goto(BASE);await sleep(700);
 await p.fill('#nm','Афина Т.');await tap(p,'#go',mobile);await sleep(500);await overflow(p,'home');await shotF('home');
 if(!await p.$('#pbar'))throw new Error('нет шкалы %');

 // ---------- 1 krot ----------
 await go(1);await shotF('t1');
 if(mobile){await p.evaluate(()=>document.querySelector('.kstage .ml-go').scrollIntoView({block:'center'}));await sleep(300);const bb=await (await p.$('.kstage .ml-start .ml-go')).boundingBox();await p.touchscreen.tap(bb.x+bb.width/2,bb.y+bb.height/2);await sleep(900);}
 else{await p.click('.kbig');await sleep(600);await p.click('.kstage .ml-start .ml-go');await sleep(600);}
 const fs=await p.evaluate(()=>{const k=document.querySelector('.kst');const r=k.getBoundingClientRect();const s=document.querySelector('.kstage').getBoundingClientRect();return {full:k.classList.contains('kfull'),w:r.width,h:r.height,sw:s.width,sh:s.height,st:document.querySelector('.kstage')._inst._dbg().state};});
 step('крот: '+JSON.stringify(fs));
 if(!fs.full||Math.abs(fs.w-w)>2||Math.abs(fs.h-h)>2)throw new Error('крот не на весь экран');
 if(Math.abs(fs.sw-w)>3&&Math.abs(fs.sh-h)>3)throw new Error('сцена крота не во весь экран');
 if(fs.st!=='play')throw new Error('крот не начался');
 await sleep(1500);await shot('t1-play');
 let hits=0,miss=0,paused=false;const t0=Date.now();
 while(Date.now()-t0<130000){const d=await p.evaluate(()=>{const i=document.querySelector('.kstage')._inst._dbg();return {st:i.state,t:i.wave&&i.wave.t,occ:(i.occ||[]).map(o=>o&&!o.hit?o.t:null)};});
  if(d.st==='end')break;
  if(!paused&&Date.now()-t0>8000){await tap(p,'.t8pause',mobile);await sleep(500);const s=await p.evaluate(()=>document.querySelector('.kstage')._inst._dbg().state);await shot('t1-pause');if(s!=='pause')throw new Error('пауза не работает');await sleep(1200);await tap(p,'.t8res',mobile);await sleep(400);paused=true;continue;}
  if(d.st==='play'&&d.t){let i=d.occ.findIndex(x=>x===d.t);const wr=d.occ.findIndex(x=>x!=null&&x!==d.t);if(hits%4===3&&wr>=0){i=wr;miss++;}
   if(i>=0){const el=await p.$(`.ml-mole[data-i="${i}"]`);const bb=el&&await el.boundingBox();if(bb){if(mobile)await p.touchscreen.tap(bb.x+bb.width/2,bb.y+bb.height*0.35);else await p.mouse.click(bb.x+bb.width/2,bb.y+bb.height*0.35);hits++;await sleep(450);continue;}}}
  await sleep(200);}
 await sleep(1500);await shot('t1-end');
 const r1=await p.evaluate(()=>document.querySelector('.kstage')?document.querySelector('.kstage')._inst._dbg().state:'gone');step('крот закончился: '+r1+' ударов '+hits+' нарочно мимо '+miss);
 await sleep(2500);if(!await p.$('#kr .qcard'))throw new Error('после крота нет итога/кнопки дальше');await shotF('t1-res');

 // ---------- 2 tone dictation ----------
 await go(2);await shotF('t2');const D2=['mā','bà','tǔ','dí','kě','fó','lù','hē','nǐ','pō'];
 const tn=s=>{const m=s.normalize('NFD');return /̄/.test(m)?1:/́/.test(m)?2:/̌/.test(m)?3:/̀/.test(m)?4:0;};
 for(let i=0;i<10;i++){let t=tn(D2[i]);if(i===1)t=1;if(i===4)t=2;
  await tap(p,`.dr8[data-i="${i}"] [data-t="${t}"]`,mobile);await sleep(250);
  if(i===1){await shotF('t2-err');const why=await p.$eval(`.dr8[data-i="1"] .why8`,e=>e.textContent);if(!/4-й тон/.test(why)||!/вниз/.test(why))throw new Error('нет пояснения к тону: '+why);}}
 await overflow(p,'d2');step('звук диктант 2: '+await sounds(p,'.ear8',3));
 await tap(p,'#fin',mobile);await sleep(500);await shotF('t2-end');

 // ---------- 3 letters dictation ----------
 await go(3);await shotF('t3');const D3=['bā','dù','gē','pí','mǔ','tè','bǐ','dé','kū','ná','lǐ','hú'];
 const plain=s=>s.normalize('NFD').replace(/[̀-ͯ]/g,'');
 for(let i=0;i<12;i++){await p.waitForSelector('#w');let word=plain(D3[i]),t=tn(D3[i]);
  if(i===0)word='da';if(i===2)word='de';if(i===3)t=4;if(i===5)word='де';if(i===8)word='gu';
  if(mobile&&!/[а-я]/.test(word)){for(const c of word)await tap(p,`.kb8 [data-k="${c}"]`,mobile);}else await p.fill('#w',word),await p.dispatchEvent('#w','input');
  await tap(p,`.mk8 [data-t="${t}"]`,mobile);await tap(p,'#ck',mobile);await sleep(300);
  if([0,2,3,5,8].includes(i)){await shotF('t3-err'+i);const fb=await p.$eval('#fb',e=>e.textContent);step('ошибка '+i+': '+fb.replace(/\s+/g,' ').slice(0,160));
   if(i===0&&!/имел\(а\) в виду букву b/.test(fb))throw new Error('нет подсказки b/d');if(i===2&&!/букву g/.test(fb))throw new Error('нет подсказки g/d');if(i===5&&!/русскими/.test(fb))throw new Error('нет подсказки про русские буквы');}
  if(i===0)step('звук «послушать»: '+await sounds(p,'#ls',1));
  await overflow(p,'d3');await tap(p,'#nb',mobile);await sleep(300);}
 await p.waitForSelector('.ans8');await shotF('t3-end');

 // ---------- 4 propis ----------
 await go(4);await shotF('t4');step('звук пропись: '+await sounds(p,'[data-w]',5));await tap(p,'#st',mobile);
 for(let k=0;k<10;k++){await p.waitForSelector('#hw');await sleep(700);const c=await p.$eval('.ph8 .zh',e=>e.textContent);if(k===0)await shot('t4-q');if(k===1)await wrongStroke(p);await draw(p,c);await sleep(1300);}
 await p.waitForSelector('#again',{timeout:8000});await overflow(p,'propis');await shotF('t4-end');

 // ---------- 5 table ----------
 await go(5);await shotF('t5');const PN=['我','你','他','她','它','我们','你们','他们','她们'];
 for(let i=0;i<9;i++){await tap(p,`[data-c="${i}"]`,mobile);await sleep(400);
  for(const c of PN[i]){await p.waitForSelector('#hw');await sleep(500);if(i===0){await shot('t5-known');const ol=await p.evaluate(()=>!!document.querySelector('#hw svg path[fill="#DCE1EC"]'));step('у 我 образец виден? '+ol);await wrongStroke(p);await sleep(300);await shot('t5-hint');}
   if(i===2&&c==='他')await shot('t5-new');await draw(p,c);await sleep(1100);}
  const syl=PN[i].length;for(let q=0;q<syl;q++){await p.waitForSelector('.mk8.five');await sleep(300);const right=await p.evaluate(()=>{const b=[...document.querySelectorAll('.mk8.five [data-t]')];return null;});
   const T={0:[3],1:[3],2:[1],3:[1],4:[1],5:[3,0],6:[3,0],7:[1,0],8:[1,0]}[i][q];const pick=(i===5&&q===1)?2:T;if(i===5&&q===1)await shot('t5-tone');
   await tap(p,`.mk8.five [data-t="${pick}"]`,mobile);await sleep(400);if(pick!==T){await shotF('t5-tone-err');}
   const nb=await p.$('#nb');if(nb)await tap(p,'#nb',mobile);else await sleep(1400);await sleep(300);}
  await sleep(600);}
 await overflow(p,'table');await shotF('t5-full');await tap(p,'#fin',mobile);await sleep(500);await shotF('t5-end');

 // ---------- 6 recording ----------
 await go(6);await shotF('t6');step('звук таблица: '+await sounds(p,'.tc8[data-w]',9));
 await tap(p,'#mic',mobile);await sleep(3200);await tap(p,'#mic',mobile);await sleep(800);await shotF('t6-rec');
 await tap(p,'#snd',mobile);await sleep(800);await shotF('t6-end');if(!await p.$('#again'))throw new Error('запись не отправилась');

 // ---------- 7 cards ----------
 await go(7);await shotF('t7');await tap(p,'#l1',mobile);await sleep(500);await shotF('t7-1');
 step('звук карточки: '+await sounds(p,'#pool .snd8',9));
 // wrong first: card 我 to «ты»
 const slotOf=(i)=>`.slot8[data-want="${i}"]`;
 if(mobile){await tap(p,'#pool .cd8[data-p="0"]',mobile);await tap(p,slotOf(1),mobile);}
 else{const a=await (await p.$('#pool .cd8[data-p="0"]')).boundingBox();const b=await (await p.$(slotOf(1))).boundingBox();await p.mouse.move(a.x+20,a.y+20);await p.mouse.down();await p.mouse.move(a.x+60,a.y+40,{steps:5});await p.mouse.move(b.x+b.width/2,b.y+b.height/2,{steps:10});await p.mouse.up();}
 await sleep(500);await shotF('t7-1err');
 for(let i=0;i<9;i++){if(!mobile){const a=await (await p.$(`#pool .cd8[data-p="${i}"]`));await a.scrollIntoViewIfNeeded();const ab=await a.boundingBox();await p.evaluate(s=>document.querySelector(s).scrollIntoView({block:'center'}),slotOf(i));await sleep(150);
   const a2=await (await p.$(`#pool .cd8[data-p="${i}"]`)).boundingBox();const b=await (await p.$(slotOf(i))).boundingBox();
   if(a2.y<0||a2.y>h){await tap(p,`#pool .cd8[data-p="${i}"]`,mobile);await tap(p,slotOf(i),mobile);}
   else{await p.mouse.move(a2.x+15,a2.y+15);await p.mouse.down();await p.mouse.move(a2.x+40,a2.y+30,{steps:4});await p.mouse.move(b.x+b.width/2,b.y+b.height/2,{steps:8});await p.mouse.up();}}
  else{await tap(p,`#pool .cd8[data-p="${i}"]`,mobile);await tap(p,slotOf(i),mobile);}
  await sleep(350);}
 await sleep(1300);await shotF('t7-1end');if(!await p.$('#go2'))throw new Error('7.1 не закончился');await tap(p,'#go2',mobile);await sleep(500);await shotF('t7-2');
 // wrong: put «ты» in row of 我
 const place=async(k,i,ri)=>{await tap(p,`[data-b="${k}"]`,mobile);await sleep(150);await tap(p,`[data-pool="${k}"] .cd8[data-p="${i}"] ${k==='h'?'.zh':'span'}`,mobile);await p.evaluate(s=>document.querySelector(s).scrollIntoView({block:'center'}),`.s82[data-row="${ri}"][data-k="${k}"]`);await sleep(120);await tap(p,`.s82[data-row="${ri}"][data-k="${k}"]`,mobile);await sleep(250);};
 await place('h',0,0);await place('r',1,0);await shotF('t7-2err');await shot('t7-2view');
 if(!await p.$('.s82[data-row="0"][data-k="h"] .cd8'))throw new Error('7.2: карточка 我 не встала');if(await p.$('.s82[data-row="0"][data-k="r"] .cd8'))throw new Error('7.2: «ты» встала к 我');
 for(let ri=0;ri<9;ri++){for(const k of ['h','p','r']){const has=await p.$(`.s82[data-row="${ri}"][data-k="${k}"] .cd8`);if(has)continue;await place(k,ri,ri);}}
 await sleep(1300);await shotF('t7-2end');if(!await p.$('#again'))throw new Error('7.2 не закончился');

 // ---------- 8 memory ----------
 await go(8);await shotF('t8');
 const MEM=[['你','ты'],['我','я'],['好','хорошо'],['叫','зваться'],['妈','мама'],['爸','папа'],['他','он'],['她','она'],['它','оно'],['们','много (суффикс)']];
 const faces=await p.$$eval('.mc .mcf',a=>a.map(x=>x.textContent));
 const pairs=MEM.map(([a,b])=>[faces.indexOf(a),faces.indexOf(b)]);if(pairs.some(x=>x.includes(-1)))throw new Error('мемори карточки');
 await tap(p,`.mc[data-j="${pairs[0][0]}"]`,mobile);await tap(p,`.mc[data-j="${pairs[1][1]}"]`,mobile);await sleep(1200);
 for(const [a,b] of pairs){await tap(p,`.mc[data-j="${a}"]`,mobile);await tap(p,`.mc[data-j="${b}"]`,mobile);await sleep(350);}
 await p.waitForSelector('#again',{timeout:8000});await shotF('t8-end');step('звук мемори: '+await sounds(p,'[data-say]',10));
 // ---------- itogi ----------
 await go('itogi');await shotF('itogi');const left=await p.$$eval('.left button',a=>a.length);step('не доделано в итогах: '+left);
 const pc=await p.$eval('#pbar',e=>e.textContent);step('шкала: '+pc);
 // not done list: fresh child skips some tasks
 await sleep(500);
 const au=await p.evaluate(()=>__au);const badAu=au.filter(a=>a.err||!a.dur);
 const saves=log.api.filter(a=>/save/.test(a)).map(a=>(a.match(/"part":"([^"]+)"/)||[])[1]);
 console.log(nm,'== audio запусков',au.length,'без звука',badAu.length,JSON.stringify(badAu.slice(0,4)));
 console.log(nm,'== сохранения',[...new Set(saves)].join(','),'· аудио загрузка',log.api.filter(a=>/audio\?/.test(a)).length);
 console.log(nm,'== звуки ок',[...log.ok].join(' '));
 console.log(nm,'== ОШИБКИ',JSON.stringify(log.err));console.log(nm,'== ПЛОХОЙ ЗВУК',JSON.stringify([...new Set(log.bad)]));
 require('fs').writeFileSync(OUT+'/saves-'+nm+'.json',JSON.stringify(log.saves||[]));
 await br.close();}
(async()=>{for(const v of VIEWS){try{await run(v);}catch(e){console.log(v[0],'!!! FAIL',e.message.split('\n')[0]);}}})();
