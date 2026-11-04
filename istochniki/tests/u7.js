// «Проверяющий» для заданий урока 7: ученик 12 лет проходит все 7 заданий подряд, ошибается нарочно.
// node u7.js [base-url]   (по умолчанию http://localhost:8765/urok-7/zadaniya/)
const {chromium}=require('playwright');
const BASE=process.argv[2]||'http://localhost:8765/urok-7/zadaniya/';
const OUT=process.env.OUT||'/tmp/claude-0/t7';require('fs').mkdirSync(OUT,{recursive:true});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const VIEWS=[['phone',390,844,true],['land',844,390,true],['desk',1280,720,false]];
async function draw(p,ch){const info=await p.evaluate(ch=>{const el=document.querySelector('#hw');if(!el)return null;el.scrollIntoView({block:'center'});const r=el.getBoundingClientRect();return {x:r.left,y:r.top,w:r.width,med:HZDATA[ch].medians};},ch);
 if(!info)return;const sz=info.w,pad=sz*.08,sc=(sz-2*pad)/1024;
 for(const m of info.med){const pts=m.map(([x,y])=>[info.x+pad+x*sc,info.y+pad+(900-y)*sc]);await p.mouse.move(...pts[0]);await p.mouse.down();for(const q of pts.slice(1))await p.mouse.move(...q,{steps:4});await p.mouse.up();await sleep(110);}}
async function wrongStroke(p){const r=await p.evaluate(()=>{const el=document.querySelector('#hw');const b=el.getBoundingClientRect();return [b.left,b.top,b.width];});
 await p.mouse.move(r[0]+r[2]*.9,r[1]+r[2]*.1);await p.mouse.down();await p.mouse.move(r[0]+r[2]*.1,r[1]+r[2]*.9,{steps:6});await p.mouse.up();await sleep(150);}
const curChar=p=>p.evaluate(()=>{const c=document.querySelector('.wch span.cur');if(c)return c.textContent;const py=document.querySelector('.qcard .py');const M={'nǐ':'你','wǒ':'我','hǎo':'好','jiào':'叫','mā':'妈','bà':'爸'};return py?M[py.textContent.trim()]:null;});
async function overflow(p,tag){const o=await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth);if(o>2)throw new Error(tag+': horizontal overflow '+o+'px');}
async function run(view){const [nm,w,h,mobile]=view;const br=await chromium.launch();const ctx=await br.newContext({viewport:{width:w,height:h},isMobile:mobile,hasTouch:mobile,deviceScaleFactor:1});
 const p=await ctx.newPage();const errs=[],saves=[];
 p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error'&&!/Failed to load resource|net::|NotSupportedError|NotAllowedError|play\(\)/.test(m.text()))errs.push('console: '+m.text());});
 await ctx.route(/workers\.dev\/api\/dz\/save/,r=>{saves.push(JSON.parse(r.request().postData()));r.fulfill({status:200,body:'{"ok":true}'});});
 await ctx.route(/kitai-ii|github\.io/,r=>r.fulfill({status:404,body:''}));
 await p.goto(BASE);await sleep(600);
 // login
 await p.fill('#nm','Радмир Т.');await p.click('#go');await sleep(400);await overflow(p,'home');await p.screenshot({path:`${OUT}/${nm}-home.png`});
 const go=async n=>{await p.evaluate(n=>location.hash='#'+n,n);await sleep(500);};
 // 1, 2 memory
 for(const n of [1,2]){await go(n);await p.screenshot({path:`${OUT}/${nm}-t${n}.png`});
  const pairs=await p.evaluate(n=>{const L=MEM[n];const faces=[...document.querySelectorAll('.mc')].map(b=>b.querySelector('.mcf').textContent);return L.map(([a,ru])=>[faces.indexOf(a),faces.indexOf(ru)]);},n);
  if(pairs.some(x=>x.includes(-1)))throw new Error('memory faces');
  await p.click(`.mc[data-j="${pairs[0][0]}"]`);await p.click(`.mc[data-j="${pairs[1][1]}"]`);await sleep(1100); // mistake on purpose
  for(const [a,b] of pairs){await p.click(`.mc[data-j="${a}"]`);await p.click(`.mc[data-j="${b}"]`);await sleep(320);}
  await p.waitForSelector('#again',{timeout:6000});await overflow(p,'mem end');await p.screenshot({path:`${OUT}/${nm}-t${n}-end.png`});}
 // 3 blitz: right, wrong, one timeout
 await go(3);await p.screenshot({path:`${OUT}/${nm}-t3.png`});await p.click('#st');
 for(let q=0;q<11;q++){await p.waitForSelector('.opt:not([disabled])',{timeout:20000});if(q===0)await p.screenshot({path:`${OUT}/${nm}-t3-q.png`});
  if(q===4){await sleep(12800);}else{const right=await p.evaluate(()=>{const t=document.querySelector('.bqq').textContent.replace(/\s+/g,'');const b=BQ.find(x=>x[0].replace(/<[^>]+>/g,'').replace(/\s+/g,'')===t);return b&&b[1][0];});
   if(!right)throw new Error('blitz question not found');const all=await p.$$eval('.opt',bs=>bs.map(b=>b.dataset.v));const pick=q%3===1?all.find(x=>x!==right):right;await p.click(`.opt[data-v="${pick}"]`);}
  await p.waitForSelector('.fb.ok,.fb.no');await overflow(p,'blitz');await sleep(q%3===1||q===4?2700:1500);}
 await p.waitForSelector('#again',{timeout:6000});await p.screenshot({path:`${OUT}/${nm}-t3-end.png`});
 // 4 propis: trace 6, then from memory with hints
 await go(4);await p.screenshot({path:`${OUT}/${nm}-t4.png`});
 for(let k=0;k<6;k++){await sleep(k?1400:400);await p.waitForFunction(()=>document.querySelector('#wh')&&/Обведи/.test(document.querySelector('#wh').textContent),null,{timeout:20000});const c=await curChar(p);if(k===1)await wrongStroke(p);await draw(p,c);}
 await p.waitForSelector('#go',{timeout:8000});await p.click('#go');
 for(let k=0;k<6;k++){await p.waitForSelector('#hw');await sleep(500);const c=await curChar(p);if(k===0){await p.click('#h1');await p.click('#h2');}
  if(k===2){await p.click('#h3');await sleep(400);await p.waitForFunction(()=>/по памяти/.test(document.querySelector('#wh').textContent),null,{timeout:20000});}
  await draw(p,c);await sleep(1100);}
 await p.waitForSelector('#again',{timeout:6000});await overflow(p,'propis');await p.screenshot({path:`${OUT}/${nm}-t4-end.png`});
 // 5 names
 await go(5);await p.fill('#mom','Елена');await p.fill('#dad','Сергей');await p.click('#nmgo');await sleep(400);await overflow(p,'names');await p.screenshot({path:`${OUT}/${nm}-t5.png`,fullPage:true});
 await p.click('#all');await p.click('#ok');await sleep(300);
 // 6 test: hints only for 妈 爸, one «Не помню»
 await go(6);await p.screenshot({path:`${OUT}/${nm}-t6.png`,fullPage:true});await p.click('#st');
 for(let k=0;k<12;k++){await p.waitForSelector('#hw');await sleep(400);const c=await curChar(p);const hasH=!!(await p.$('#h1'));
  if(hasH!==(c==='妈'||c==='爸'))throw new Error('hints shown wrongly for '+c);
  if(k===0)await p.screenshot({path:`${OUT}/${nm}-t6-q.png`});
  if(k===3){await p.click('#sk');await sleep(2200);continue;}
  if(c==='妈'&&hasH)await p.click('#h1');await draw(p,c);await sleep(1100);}
 await p.waitForSelector('.lgd',{timeout:6000});await overflow(p,'test');await p.screenshot({path:`${OUT}/${nm}-t6-end.png`,fullPage:true});
 // 7 krot on the whole screen
 await go(7);await sleep(400);await p.screenshot({path:`${OUT}/${nm}-t7.png`});
 if(mobile){await p.tap('.kst');}else{await p.click('.kbig');}
 await sleep(700);
 const cover=await p.evaluate(()=>{const s=document.querySelector('.kstage').getBoundingClientRect();return {full:document.querySelector('.kst').classList.contains('kfull'),w:Math.round(s.width),h:Math.round(s.height),vw:innerWidth,vh:innerHeight};});
 console.log(nm,'game box',JSON.stringify(cover));
 {if(!cover.full)throw new Error('game did not open full screen');const fr=Math.max(cover.w/cover.vw,cover.h/cover.vh);if(fr<.97)throw new Error('game is not on the whole screen: '+JSON.stringify(cover));
  if(Math.min(cover.w,cover.h)/Math.min(cover.vw,cover.vh)<.5)throw new Error('half screen');}
 await p.screenshot({path:`${OUT}/${nm}-t7-full.png`});
 await p.evaluate(()=>document.querySelector('.kstage .ml-go').click());let hits=0,miss=0;
 for(let k=0;k<700;k++){const done=await p.evaluate(()=>!!DONE[7]);if(done)break;
  const pt=await p.evaluate(k=>{const st=document.querySelector('.kstage');const g=st._inst._dbg();if(g.state!=='play'||!g.wave||g.wave.done)return null;const ms=st.querySelectorAll('.ml-mole');
   for(let i=0;i<9;i++){const o=g.occ[i];if(o&&!o.hit&&ms[i].classList.contains('up')&&((o.tone===g.wave.tone)!==(k%11===5))){const r=ms[i].getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height*.45,ok:o.tone===g.wave.tone};}}return null;},k);
  if(pt){await p.evaluate(pt=>{const el=document.elementFromPoint(pt.x,pt.y);el&&el.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,clientX:pt.x,clientY:pt.y}));},pt);pt.ok?hits++:miss++;if(hits===3)await p.screenshot({path:`${OUT}/${nm}-t7-play.png`});}
  await sleep(180);}
 if(!(await p.evaluate(()=>!!DONE[7])))throw new Error('krot did not finish');
 await p.screenshot({path:`${OUT}/${nm}-t7-end.png`});
 await p.evaluate(()=>document.querySelector('.kx').click());await sleep(500);
 const res=await p.evaluate(()=>({done:DONE,kfull:!!document.querySelector('.kfull')}));if(res.kfull)throw new Error('exit full screen failed');
 await p.waitForSelector('#kr .btn');await p.screenshot({path:`${OUT}/${nm}-t7-res.png`});await p.click('#kr .btn');await sleep(400);await p.screenshot({path:`${OUT}/${nm}-home-end.png`});
 const parts=[...new Set(saves.map(s=>s.part))].sort();
 console.log(nm,'DONE',JSON.stringify(res.done),'hits',hits,'miss',miss,'saved parts',parts.join(','));
 const t6=saves.filter(s=>s.part==='t6').pop();console.log(nm,'test →',JSON.stringify(t6&&t6.data).slice(0,400));
 if(parts.length<8)throw new Error('not all parts saved: '+parts);
 if(errs.length)throw new Error('errors: '+errs.join(' | '));
 await br.close();}
(async()=>{const only=process.env.VIEW;for(const v of VIEWS){if(only&&v[0]!==only)continue;const t=Date.now();await run(v);console.log(v[0],'OK',Math.round((Date.now()-t)/1000)+'s');}})().catch(e=>{console.error('FAIL',e.message);process.exit(1);});
