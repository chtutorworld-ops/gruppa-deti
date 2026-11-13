// «Проверяющий» для ДЗ 8: ученик 12 лет проходит все 13 заданий подряд, ошибается нарочно, жмёт кнопки звука,
// доигрывает обе игры. Игры ОБЯЗАНЫ открываться на весь экран (дети жаловались: крот на пол-окна).
// node dz8.js [base-url] [phone|land|desk]   (по умолчанию http://localhost:8765/dz-8/, все три вида)
const {chromium}=require('playwright');const fs=require('fs');const {wire,errs,AUDIO_SPY}=require('./u8common');
const BASE=process.argv[2]||'http://localhost:8765/dz-8/';
const ONLY=process.argv[3];const ONLYT=(process.env.ONLY||'').split(',').filter(Boolean).map(Number);
const OUT=process.env.OUT||'/tmp/claude-0/tdz8';fs.mkdirSync(OUT,{recursive:true});
const SAIT=process.env.SAIT||'/home/claude/gruppa-deti-sait';
const RUL=new Set(fs.readFileSync(SAIT+'/tools/audio-ru.txt','utf8').split('\n').map(l=>l.split('|')[0].trim()).filter(x=>x&&!x.startsWith('#')));
const WAV=fs.readFileSync(__dirname+'/tone.wav');
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const VIEWS=[['phone',390,844,true],['land',844,390,true],['desk',1280,720,false]].filter(v=>!ONLY||v[0]===ONLY);
const RU={'ты':'你','я':'我','хорошо':'好','зваться':'叫','мама':'妈','папа':'爸'};
async function draw(p,ch){const info=await p.evaluate(ch=>{const el=document.querySelector('#hw');if(!el)return null;el.scrollIntoView({block:'center'});const r=el.getBoundingClientRect();return {x:r.left,y:r.top,w:r.width,med:HZDATA[ch].medians};},ch);
 if(!info)throw new Error('no writer for '+ch);const sz=info.w,pad=sz*.08,sc=(sz-2*pad)/1024;
 for(const m of info.med){const pts=m.map(([x,y])=>[info.x+pad+x*sc,info.y+pad+(900-y)*sc]);await p.mouse.move(...pts[0]);await p.mouse.down();for(const q of pts.slice(1))await p.mouse.move(...q,{steps:4});await p.mouse.up();await sleep(110);}}
async function overflow(p,tag){const o=await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth);if(o>2)throw new Error(tag+': horizontal overflow '+o+'px');}
const tapEl=async(p,el,mobile)=>{await el.scrollIntoViewIfNeeded().catch(()=>{});const b=await el.boundingBox();if(!b)throw new Error('элемент не виден');if(mobile)await p.touchscreen.tap(b.x+b.width/2,b.y+b.height/2);else await p.mouse.click(b.x+b.width/2,b.y+b.height/2);};
const tap=async(p,sel,mobile)=>{const el=await p.$(sel);if(!el)throw new Error('нет '+sel);await tapEl(p,el,mobile);};
async function sounds(p,sel,max=40){const bs=await p.$$(sel);let k=0;for(const b of bs.slice(0,max)){await b.scrollIntoViewIfNeeded().catch(()=>{});await b.click({force:true}).catch(()=>{});k++;await sleep(300);}return k;}
const done=p=>p.evaluate(()=>/готово!/.test((document.querySelector('h2')||{}).textContent||'')||!!document.querySelector('#kr .res'));
async function quizTask(p,n,mobile){if(await p.$('#st'))await tap(p,'#st',mobile);await sleep(400);let wrong=0;
 for(let g=0;g<80;g++){if(await done(p))return;const opts=await p.$$('.opt:not([disabled])');
  if(opts.length){await opts[Math.floor(Math.random()*opts.length)].click();await sleep(250);const fb=await p.$eval('#fb',e=>e.className).catch(()=>'');if(/no/.test(fb))wrong++;const nb=await p.$('#nb');if(nb)await nb.click();await sleep(250);continue;}
  await sleep(300);}
 await p.screenshot({path:OUT+'/fail-'+n+'.png',fullPage:true});throw new Error('task '+n+' did not finish');}
// игра: окно целиком на экране, первое касание — на весь экран, сцена занимает весь экран
async function gameFull(p,w,h,startSel,mobile,step,name){
 const inl=await p.evaluate(()=>{const r=document.querySelector('.kst').getBoundingClientRect();return {top:Math.round(r.top),bottom:Math.round(r.bottom),vh:innerHeight};});
 step(name+' в странице: '+JSON.stringify(inl));
 if(inl.top<0||inl.bottom>inl.vh+1)throw new Error(name+': окно игры не помещается на экран целиком (видна только часть) '+JSON.stringify(inl));
 await tap(p,startSel,mobile);await sleep(1100);
 const f=await p.evaluate(()=>{const k=document.querySelector('.kst');const r=k.getBoundingClientRect();const s=document.querySelector('.kstage').getBoundingClientRect();return {full:k.classList.contains('kfull'),w:Math.round(r.width),h:Math.round(r.height),sw:Math.round(s.width),sh:Math.round(s.height),sx:Math.round(s.x),sy:Math.round(s.y),st:document.querySelector('.kstage')._inst._dbg().state};});
 step(name+' весь экран: '+JSON.stringify(f));
 if(!f.full||Math.abs(f.w-w)>2||Math.abs(f.h-h)>2)throw new Error(name+' не на весь экран');
 if(Math.abs(f.sw-w)>3&&Math.abs(f.sh-h)>3)throw new Error(name+': сцена не во весь экран');
 if(f.sx<-2||f.sy<-2||f.sx+f.sw>w+2||f.sy+f.sh>h+2)throw new Error(name+': сцена вылезает за экран');
 if(name==='крот'){await sleep(400);const fl=await p.evaluate(()=>{const a=document.querySelector('.ml-field').getBoundingClientRect(),b=document.querySelector('.kstage').getBoundingClientRect();return {fw:Math.round(a.width),fh:Math.round(a.height),sw:Math.round(b.width),sh:Math.round(b.height)};});
  step('поле с норками: '+JSON.stringify(fl));if(Math.abs(fl.fw-fl.sw)>3||Math.abs(fl.fh-fl.sh)>3)throw new Error('поле крота не на всю сцену (пол-окна!) '+JSON.stringify(fl));}
 return f;}
async function run(view){const [nm,w,h,mobile]=view;
 const br=await chromium.launch({args:['--autoplay-policy=no-user-gesture-required']});
 const ctx=await br.newContext({viewport:{width:w,height:h},isMobile:mobile,hasTouch:mobile,deviceScaleFactor:1});
 const log={err:[],bad:[],ok:new Set(),api:[]};await wire(ctx,log);
 // № 11: чистые инициали — записи учителя b0…h0 (как на странице «Звуки»); другие .wav — ошибка
 const VW=new Set(['b0','p0','m0','f0','d0','t0','n0','l0','g0','k0','h0'].map(x=>x+'.wav'));
 await ctx.route(/\/audio\/voice\//,r=>{const f=r.request().url().split('/audio/voice/').pop().split('?')[0];if(VW.has(f)){log.ok.add('voice '+f);return r.fulfill({status:200,contentType:'audio/wav',body:WAV});}log.bad.push('лишняя запись: '+f);return r.fulfill({status:404,body:''});});await ctx.addInitScript(AUDIO_SPY);
 const ru=new Set();
 await ctx.route(/\/audio\/ru\//,r=>{const f=r.request().url().split('/audio/ru/').pop().split('?')[0].replace('.mp3','');if(RUL.has(f)){ru.add(f);return r.fulfill({status:200,contentType:'audio/wav',body:WAV});}log.bad.push('русского звука нет в audio-ru.txt: '+f);return r.fulfill({status:404,body:''});});
 const p=await ctx.newPage();errs(p,log);
 const AUD=new URL('../audio/',BASE).href;p.on('request',r=>{const u=r.url();if(/\.(mp3|wav)(\?|$)/.test(u)&&!u.startsWith(AUD)&&!/gruppa-deti-sait\/audio\//.test(u))log.bad.push('звук не из папки audio: '+u);});
 const shot=n=>p.screenshot({path:`${OUT}/${nm}-${n}.png`});const shotF=n=>p.screenshot({path:`${OUT}/${nm}-${n}.png`,fullPage:true});
 const go=async n=>{await p.evaluate(n=>location.hash='#'+n,n);await sleep(700);};
 const step=s=>console.log(nm,'·',s);const want=n=>!ONLYT.length||ONLYT.includes(n);
 await p.goto(BASE);await sleep(700);
 await p.fill('#nm','тест');await tap(p,'#go',mobile);await sleep(500);await overflow(p,'home');await shotF('00-home');
 if(!await p.$('#pbar'))throw new Error('нет шкалы %');
 const nItems=await p.$$eval('.ti',a=>a.length);if(nItems!==13)throw new Error('заданий в списке '+nItems);

 // ---------- 1 крот (как на уроке 8) ----------
 if(want(1)){await go(1);await shotF('01-a');await shot('01-screen');
 await gameFull(p,w,h,'.kstage .ml-start .ml-go',mobile,step,'крот');
 const st=await p.evaluate(()=>document.querySelector('.kstage')._inst._dbg().state);if(st!=='play')throw new Error('крот не начался: '+st);
 await sleep(1500);await shot('01-play');
 let hits=0,miss=0,paused=false;const t0=Date.now();
 while(Date.now()-t0<130000){const d=await p.evaluate(()=>{const i=document.querySelector('.kstage')._inst._dbg();return {st:i.state,t:i.wave&&i.wave.t,occ:(i.occ||[]).map(o=>o&&!o.hit?o.t:null)};});
  if(d.st==='end')break;
  if(!paused&&Date.now()-t0>8000){await tap(p,'.t8pause',mobile);await sleep(500);const s=await p.evaluate(()=>document.querySelector('.kstage')._inst._dbg().state);await shot('01-pause');if(s!=='pause')throw new Error('пауза не работает');await sleep(800);await tap(p,'.t8res',mobile);await sleep(400);paused=true;continue;}
  if(d.st==='play'&&d.t){let i=d.occ.findIndex(x=>x===d.t);const wr=d.occ.findIndex(x=>x!=null&&x!==d.t);if(hits%4===3&&wr>=0){i=wr;miss++;}
   if(i>=0){const el=await p.$(`.ml-mole[data-i="${i}"]`);const bb=el&&await el.boundingBox();if(bb){if(mobile)await p.touchscreen.tap(bb.x+bb.width/2,bb.y+bb.height*0.35);else await p.mouse.click(bb.x+bb.width/2,bb.y+bb.height*0.35);hits++;await sleep(450);continue;}}}
  await sleep(200);}
 await sleep(1500);await shot('01-end');step('крот: ударов '+hits+', нарочно мимо '+miss);
 await sleep(2500);if(!await p.$('#kr .qcard'))throw new Error('после крота нет итога/кнопки дальше');
 const fullAfter=await p.evaluate(()=>!!document.querySelector('.kst.kfull'));if(fullAfter)throw new Error('после крота не вышли из полного экрана');
 await shotF('01-res');}

 // ---------- 2 диктант на тоны (голос читает 2 раза) ----------
 const tn=s=>{const m=s.normalize('NFD');return /̄/.test(m)?1:/́/.test(m)?2:/̌/.test(m)?3:/̀/.test(m)?4:0;};
 if(want(2)){await go(2);const D2=await p.evaluate(()=>D2);
 await sleep(2500);const au=await p.evaluate(()=>__au.length);if(au<2)throw new Error('диктант на тоны: голос не прочитал слог 2 раза ('+au+')');await shotF('02-a');
 for(let i=0;i<D2.length;i++){let t=tn(D2[i]);if(i===1)t=(t%4)+1;if(i===4)t=(t%4)+1;
  if(i===2)step('🔊 у слога: '+await sounds(p,'.pl8',1));
  await tap(p,`.dr8[data-i="${i}"] [data-t="${t}"]`,mobile);await sleep(300);
  if(i===1){await shotF('02-err');const why=await p.$eval(`.dr8[data-i="1"] .why8`,e=>e.textContent);if(!/тон/.test(why))throw new Error('нет пояснения к тону: '+why);}}
 await overflow(p,'d2');step('звук ответов: '+await sounds(p,'.ear8',3));
 await tap(p,'#fin',mobile);await sleep(500);if(!await done(p))throw new Error('2 не закончилось');await shotF('02-end');}

 // ---------- 3 диктант слогов (голос читает 3 раза) ----------
 if(want(3)){await go(3);const D3=await p.evaluate(()=>D3);await sleep(3600);const au=await p.evaluate(()=>__au.length);step('звуков после открытия 3: '+au);await shotF('03-a');
 const plain=s=>s.normalize('NFD').replace(/[̀-ͯ]/g,'');
 for(let i=0;i<D3.length;i++){await p.waitForSelector('#w');let word=plain(D3[i]),t=tn(D3[i]);
  if(i===1)word='bi';if(i===2)word='ku';if(i===3)t=(t%4)+1;if(i===5)word='ту';
  if(i===0)step('🔊 ещё раз: '+await sounds(p,'#pl',1));
  if(mobile&&!/[а-я]/.test(word)){for(const c of word)await tap(p,`.kb8 [data-k="${c}"]`,mobile);}else{await p.fill('#w',word);await p.dispatchEvent('#w','input');}
  await tap(p,`.mk8 [data-t="${t}"]`,mobile);await tap(p,'#ck',mobile);await sleep(300);
  if([1,2,3,5].includes(i)){await shotF('03-err'+i);const fb=await p.$eval('#fb',e=>e.textContent);step('ошибка '+i+': '+fb.replace(/\s+/g,' ').slice(0,140));
   if(i===1&&!/букву d/.test(fb))throw new Error('нет подсказки b/d');if(i===5&&!/русскими/.test(fb))throw new Error('нет подсказки про русские буквы');}
  await overflow(p,'d3');await tap(p,'#nb',mobile);await sleep(300);}
 await p.waitForSelector('.ans8');await shotF('03-end');}

 // ---------- 4–8 упражнения ----------
 for(const n of [4,5,6,7,8]){if(!want(n))continue;await go(n);await overflow(p,'task '+n);await shotF(String(n).padStart(2,'0')+'-a');
  step('звук в правиле '+n+': '+await sounds(p,'[data-s],[data-w]',8));
  if(await p.$('#st'))await tap(p,'#st',mobile);await sleep(500);await shot(String(n).padStart(2,'0')+'-q');
  await quizTask(p,n,mobile);if(!await done(p))throw new Error('task '+n+' not done');await overflow(p,'task '+n+' end');await shotF(String(n).padStart(2,'0')+'-z');step('задание '+n+' ok');}

 // ---------- 9 ниндзя ----------
 if(want(9)){await go(9);await shotF('09-a');
 await gameFull(p,w,h,'.kstage .nj-go',mobile,step,'ниндзя');
 await sleep(3200);const s0=await p.evaluate(()=>document.querySelector('.kstage')._inst._dbg());if(s0.state!=='play')throw new Error('ниндзя не начался: '+s0.state);
 await sleep(1500);await shot('09-play');
 let real=0,good=0,bad=0;const t0=Date.now();
 while(Date.now()-t0<40000){const d=await p.evaluate(()=>document.querySelector('.kstage')._inst._dbg());
  if(d.state!=='play')break;
  // настоящее касание по иероглифу (сцена не повёрнута): проверяем, что попадание пальцем работает
  if(real<2&&d.it.length){const it=d.it.find(x=>x.ok)||d.it[0];const r=await p.evaluate(()=>{const s=document.querySelector('.kstage');const b=s.getBoundingClientRect();return {x:b.left,y:b.top,w:b.width,h:b.height,rot:!!s._rot};});
   if(!r.rot){const cx=r.x+it.x*r.w/1280,cy=r.y+it.y*r.h/720;const before=d.good+d.bad;if(mobile)await p.touchscreen.tap(cx,cy);else await p.mouse.click(cx,cy);await sleep(150);const a=await p.evaluate(()=>document.querySelector('.kstage')._inst._dbg());if(a.good+a.bad>before){real++;step('касание по '+it.c+' сработало');}continue;}}
  const c=await p.evaluate(w=>document.querySelector('.kstage')._inst._cut(w),bad<2&&good>3?false:true);if(c){if(bad<2&&good>3)bad++;else good++;}
  if(good>=12&&bad>=2)break;await sleep(250);}
 if(real===0&&!(await p.evaluate(()=>!!document.querySelector('.kstage')._rot)))throw new Error('касание по иероглифу не срабатывает');
 await shot('09-mid');await p.evaluate(()=>document.querySelector('.kstage')._inst._end());
 for(let k=0;k<40;k++){const st=await p.evaluate(()=>document.querySelector('.kstage')?document.querySelector('.kstage')._inst._dbg().state:'gone');if(st==='end')break;await sleep(300);}
 await sleep(800);await shot('09-end');await sleep(2600);if(!await p.$('#kr .qcard'))throw new Error('после ниндзя нет итога');await shotF('09-res');
 const ruN=[...ru];step('русская озвучка приказов: '+ruN.join(' '));if(!ruN.length)throw new Error('приказ ниндзя не озвучен');}

 // ---------- 10 диктант иероглифов ----------
 if(want(10)){await go(10);await shotF('10-a');await tap(p,'#st',mobile);
 for(let k=0;k<6;k++){await sleep(700);const r=await p.evaluate(()=>(document.querySelector('.qcard div[style*="font-weight:900"]')||{}).textContent||'');const ch=RU[r.replace(/[«»]/g,'')];
  if(k===0)await shot('10-q');if(k===2){await tap(p,'#sk',mobile);await sleep(2600);continue;}
  await draw(p,ch);await sleep(1300);}
 await sleep(900);if(!await done(p))throw new Error('10 не закончилось');await shotF('10-z');}

 // ---------- 11 таблица звуков (из страницы «Звуки»): наведи/нажми все 22 звука ----------
 if(want(11)){await go(11);await overflow(p,'task 11');await shotF('11-a');
  const cells=await p.$$('.zc.zi,.zc.zf');if(cells.length!==22)throw new Error('звуков в таблице '+cells.length+' (нужно 22)');
  const a0=await p.evaluate(()=>__au.length);let closed=0;
  for(let i=0;i<cells.length;i++){const el=cells[i];await el.scrollIntoViewIfNeeded();const b=await el.boundingBox();
   const cov=await p.evaluate(([x,y])=>{const e=document.elementFromPoint(x,y);return !!(e&&e.closest('#zvpop'));},[b.x+b.width/2,b.y+b.height/2]);
   if(cov){closed++;const cx=await p.$('#zvpop .pp-close');const vb=cx&&await cx.boundingBox();if(vb&&vb.width)await tapEl(p,cx,mobile);else{if(mobile)await p.touchscreen.tap(5,5);else await p.mouse.click(5,5);}await sleep(250);}
   if(mobile)await p.touchscreen.tap(b.x+b.width/2,b.y+b.height/2);else await p.mouse.move(b.x+b.width/2,b.y+b.height/2);await sleep(420);
   const hid=await p.evaluate(([x,y])=>{const e=document.elementFromPoint(x,y);return !!(e&&e.closest('#zvpop'));},[b.x+b.width/2,b.y+b.height/2]);if(hid)throw new Error('подсказка закрыла нажатый звук № '+(i+1));
   const pp=await p.evaluate(()=>{const e=document.querySelector('#zvpop');if(!e||e.hidden)return null;const r=e.getBoundingClientRect();return {t:e.querySelector('.pp-r').textContent,x:r.left,y:r.top,r:r.right,b:r.bottom,w:innerWidth,h:innerHeight};});
   const ai=await p.evaluate(()=>__au.length);if(process.env.DBG)step('ячейка '+i+' звуков '+ai+' '+JSON.stringify(pp&&pp.t));
   if(!pp)throw new Error('подсказка не появилась у звука № '+(i+1));
   if(pp.x<-1||pp.y<-1||pp.r>pp.w+1||pp.b>pp.h+1)throw new Error('подсказка вылезает за экран '+JSON.stringify(pp));
   if(i===0||i===12){await shot('11-pop'+i);step('подсказка: '+pp.t);}
   if(i===3){const bt=await p.$('#zvpop [data-sy]');await bt.click();await sleep(400);}}
  const a1=await p.evaluate(()=>__au.length);step('звуков в таблице сыграно: '+(a1-a0)+', пришлось закрыть подсказку ✕: '+closed);if(a1-a0<22)throw new Error('не все звуки таблицы прозвучали: '+(a1-a0));
  const syl=await p.$$('.zc.zs');step('слогов в таблице: '+syl.length);await syl[20].scrollIntoViewIfNeeded();await syl[20].click();await sleep(400);
  await shot('11-syl');step('звук в правиле 11: '+await sounds(p,'.zrow6 [data-sy]',6));
  const ok=await p.evaluate(()=>!!DONE[11]);if(!ok)throw new Error('задание 11 не засчиталось после 22 звуков');
  if(!await p.$('#zvfoot .btn'))throw new Error('нет кнопки «дальше» после 11');await overflow(p,'task 11 end');await shotF('11-z');step('задание 11 ok');}
 // ---------- 12–13 тренировки звуков ----------
 for(const n of [12,13]){if(!want(n))continue;await go(n);await overflow(p,'task '+n);await shotF(n+'-a');
  step('звук в правиле '+n+': '+await sounds(p,'[data-sy]',6));
  await quizTask(p,n,mobile);if(!await done(p))throw new Error('task '+n+' not done');await overflow(p,'task '+n+' end');await shotF(n+'-z');step('задание '+n+' ok');}

 // ---------- итоги ----------
 await p.evaluate(()=>location.hash='#itogi');await sleep(700);await shotF('99-itogi');
 const pc=await p.evaluate(()=>document.querySelector('.pbt').textContent);step('шкала: '+pc);
 const left=await p.$$eval('.left button',a=>a.map(x=>x.textContent.trim()));step('не доделано: '+(left.join(' | ')||'—'));
 const au=await p.evaluate(()=>__au);const badAu=au.filter(a=>a.err);
 step('звуков сыграно: '+au.length+', без ошибки: '+(au.length-badAu.length)+', слогов/слов из списка: '+log.ok.size);
 if(badAu.length)log.bad.push('ошибки <audio>: '+badAu.slice(0,5).map(a=>a.src).join(' '));
 if(!au.length)log.bad.push('ни одного звука');
 await br.close();
 const all=[...log.err,...log.bad];if(all.length){console.log(nm,'ОШИБКИ:\n'+all.join('\n'));process.exitCode=1;}else console.log(nm,'✓ чисто');}
(async()=>{for(const v of VIEWS)await run(v);})().catch(e=>{console.error('FAIL',e.message);process.exit(1);});
