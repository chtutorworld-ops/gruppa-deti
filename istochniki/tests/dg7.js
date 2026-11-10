// «Проверяющий» для «Догоняем урок 7»: ученик 12 лет проходит все 10 заданий по номерам, ошибается нарочно, смотрит шкалу % и итоги «что не доделал».
// node dg7.js [base-url]   (по умолчанию http://localhost:8765/dogon-urok-7/)
const {chromium}=require('playwright');
const BASE=process.argv[2]||'http://localhost:8765/dogon-urok-7/';
const OUT=process.env.OUT||'/tmp/claude-0/dg7';require('fs').mkdirSync(OUT,{recursive:true});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const VIEWS=[['phone',390,844,true],['land',844,390,true],['desk',1280,720,false]];
async function draw(p,ch){const info=await p.evaluate(ch=>{const el=document.querySelector('#hw');if(!el)return null;el.scrollIntoView({block:'center'});const r=el.getBoundingClientRect();return {x:r.left,y:r.top,w:r.width,med:HZDATA[ch].medians};},ch);
 if(!info)return;const sz=info.w,pad=sz*.08,sc=(sz-2*pad)/1024;
 for(const m of info.med){const pts=m.map(([x,y])=>[info.x+pad+x*sc,info.y+pad+(900-y)*sc]);await p.mouse.move(...pts[0]);await p.mouse.down();for(const q of pts.slice(1))await p.mouse.move(...q,{steps:4});await p.mouse.up();await sleep(110);}}
async function wrongStroke(p){const r=await p.evaluate(()=>{const el=document.querySelector('#hw');const b=el.getBoundingClientRect();return [b.left,b.top,b.width];});
 await p.mouse.move(r[0]+r[2]*.9,r[1]+r[2]*.1);await p.mouse.down();await p.mouse.move(r[0]+r[2]*.1,r[1]+r[2]*.9,{steps:6});await p.mouse.up();await sleep(150);}
const curChar=p=>p.evaluate(()=>{const c=document.querySelector('.wch span.cur');if(c)return c.textContent;const py=document.querySelector('.qcard .py');const M={'nǐ':'你','wǒ':'我','hǎo':'好','jiào':'叫','mā':'妈','bà':'爸'};return py?M[py.textContent.trim()]:null;});
async function overflow(p,tag){const o=await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth);if(o>2)throw new Error(tag+': horizontal overflow '+o+'px');}

async function quizRun(p,nm,n,tag){let q=0;
 for(;q<40;q++){const st=await p.evaluate(()=>({opt:!!document.querySelector('.opt:not([disabled])'),end:!!document.querySelector('.why')}));if(st.end)break;
  if(!st.opt){await sleep(250);continue;}
  if(q===0)await p.screenshot({path:`${OUT}/${nm}-t${n}-q.png`});
  const right=await p.evaluate(()=>window.__QA);const all=await p.$$eval('.opt',bs=>bs.map(b=>b.dataset.v));
  const pick=q%4===1?all.find(x=>x!==right):right;await p.click(`.opt[data-v="${pick}"]`);await overflow(p,tag);
  if(pick!==right){await p.waitForSelector('#go');if(q===1)await p.screenshot({path:`${OUT}/${nm}-t${n}-wrong.png`});const rp=await p.$('#rp');if(rp)await rp.click();await p.click('#go');}else await sleep(1450);}
 await p.waitForSelector('.why',{timeout:8000});await overflow(p,tag+' end');await p.screenshot({path:`${OUT}/${nm}-t${n}-end.png`,fullPage:true});return q;}
async function pages(p,nm,n){let k=0;while(true){await sleep(250);await overflow(p,'t'+n+' rule '+k);await p.screenshot({path:`${OUT}/${nm}-t${n}-r${k}.png`,fullPage:true});
  for(const b of await p.$$('[data-syl],[data-pure],[data-say],[data-an]'))if(Math.random()<.3)await b.click().catch(()=>{});
  const t=await p.textContent('#nx');await p.click('#nx');k++;if(/проверке/.test(t))break;if(k>8)throw new Error('pager never ends');}
 await p.click('#st');}
async function bar(p){return p.evaluate(()=>document.querySelector('.pgt').textContent);}
async function run(view){const [nm,w,h,mobile]=view;const br=await chromium.launch();const ctx=await br.newContext({viewport:{width:w,height:h},isMobile:mobile,hasTouch:mobile,deviceScaleFactor:1});
 const p=await ctx.newPage();const errs=[],saves=[];
 p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error'&&!/Failed to load resource|net::|NotSupportedError|NotAllowedError|play\(\)/.test(m.text()))errs.push('console: '+m.text());});
 await ctx.route(/workers\.dev\/api\/dz\/save/,r=>{saves.push(JSON.parse(r.request().postData()));r.fulfill({status:200,body:'{"ok":true}'});});
 await ctx.route(/kitai-ii|github\.io/,r=>r.fulfill({status:404,body:''}));
 await p.goto(BASE+'?name=%D0%92%D0%BE%D0%B2%D0%B0%20%D0%9A');await sleep(700);
 await overflow(p,'home');await p.screenshot({path:`${OUT}/${nm}-home.png`,fullPage:true});
 if(await p.$$eval('.ti',x=>x.length)!==10)throw new Error('not 10 tasks');
 if(!/0 из 10/.test(await bar(p)))throw new Error('bar start');
 await p.click('#fin');await sleep(300);if(await p.$$eval('.nd2i',x=>x.length)!==10)throw new Error('itog: undone list');await p.screenshot({path:`${OUT}/${nm}-itog-0.png`,fullPage:true});
 const go=async n=>{await p.evaluate(n=>location.hash='#'+n,n);await sleep(500);};
 for(const n of [1,2]){await go(n);
  const pairs=await p.evaluate(n=>{const L=MEM[n];const faces=[...document.querySelectorAll('.mc')].map(b=>b.querySelector('.mcf').textContent);return L.map(([a,ru])=>[faces.indexOf(a),faces.indexOf(ru)]);},n);
  if(pairs.some(x=>x.includes(-1)))throw new Error('memory faces');
  const bad=await p.evaluate(()=>[...document.querySelectorAll('.mcf')].map(x=>x.textContent).join('').match(/[呢吗吧再见]/));if(bad)throw new Error('unlearned hanzi in memory: '+bad);
  await p.click(`.mc[data-j="${pairs[0][0]}"]`);await p.click(`.mc[data-j="${pairs[1][1]}"]`);await sleep(1100);
  for(const [a,b] of pairs){await p.click(`.mc[data-j="${a}"]`);await p.click(`.mc[data-j="${b}"]`);await sleep(320);}
  await p.waitForSelector('#again',{timeout:6000});await overflow(p,'mem end');await p.screenshot({path:`${OUT}/${nm}-t${n}-end.png`});
  if(!(await p.textContent('.row .btn')).includes('№ '+(n+1)))throw new Error('next button after '+n);}
 if(!/2 из 10/.test(await bar(p)))throw new Error('bar after 2: '+await bar(p));
 // 3 theory + check
 await go(3);await pages(p,nm,3);await quizRun(p,nm,3,'t3');
 // 4 blitz
 await go(4);await p.click('#st');
 for(let q=0;q<11;q++){await p.waitForSelector('.opt:not([disabled])',{timeout:20000});
  const right=await p.evaluate(()=>{const t=document.querySelector('.bqq').textContent.replace(/\s+/g,'');const b=BQ.find(x=>x[0].replace(/<[^>]+>/g,'').replace(/\s+/g,'')===t);return b&&b[1][0];});
  if(!right)throw new Error('blitz question not found');const all=await p.$$eval('.opt',bs=>bs.map(b=>b.dataset.v));await p.click(`.opt[data-v="${q%3===1?all.find(x=>x!==right):right}"]`);
  await p.waitForSelector('.fb.ok,.fb.no');await overflow(p,'blitz');await sleep(q%3===1?2700:1500);}
 await p.waitForSelector('#again',{timeout:6000});await p.screenshot({path:`${OUT}/${nm}-t4-end.png`});
 // 5 propis
 await go(5);
 for(let k=0;k<6;k++){await sleep(k?1400:400);await p.waitForFunction(()=>document.querySelector('#wh')&&/Обведи/.test(document.querySelector('#wh').textContent),null,{timeout:20000});const c=await curChar(p);if(k===1)await wrongStroke(p);await draw(p,c);}
 await p.waitForSelector('#go',{timeout:8000});await p.click('#go');
 for(let k=0;k<6;k++){await p.waitForSelector('#hw');await sleep(500);const c=await curChar(p);if(k===0){await p.click('#h1');await p.click('#h2');}await draw(p,c);await sleep(1100);}
 await p.waitForSelector('#again',{timeout:6000});await overflow(p,'propis');await p.screenshot({path:`${OUT}/${nm}-t5-end.png`});
 // 6 xiaomei + names
 await go(6);await p.screenshot({path:`${OUT}/${nm}-t6.png`,fullPage:true});await p.click('[data-g]');await p.click('#go');await quizRun(p,nm,6,'t6').catch(()=>{});
 await p.waitForSelector('#mom',{timeout:8000});await p.fill('#mom','Елена');await p.fill('#dad','Сергей');await p.click('#nmgo');await sleep(400);await overflow(p,'names');
 await p.screenshot({path:`${OUT}/${nm}-t6-names.png`,fullPage:true});await p.click('#ok');await sleep(400);
 // 7 test
 await go(7);await p.click('#st');
 for(let k=0;k<12;k++){await p.waitForSelector('#hw');await sleep(400);const c=await curChar(p);const hasH=!!(await p.$('#h1'));
  if(hasH!==(c==='妈'||c==='爸'))throw new Error('hints shown wrongly for '+c);
  if(k===3){await p.click('#sk');await sleep(2200);continue;}
  await draw(p,c);await sleep(1100);}
 await p.waitForSelector('.lgd',{timeout:6000});await overflow(p,'test');await p.screenshot({path:`${OUT}/${nm}-t7-end.png`,fullPage:true});
 // 8, 9 initials
 for(const n of [8,9]){await go(n);await pages(p,nm,n);await p.waitForSelector('.opt');await quizRun(p,nm,n,'t'+n);}
 // itog before the last one: only № 10 left
 await p.evaluate(()=>location.hash='#itog');await sleep(400);const lf=await p.$$eval('.nd2i .no',x=>x.map(e=>e.textContent));
 if(lf.join()!=='10')throw new Error('itog left: '+lf);await p.screenshot({path:`${OUT}/${nm}-itog-9.png`,fullPage:true});
 if(!/9 из 10/.test(await bar(p)))throw new Error('bar 9');
 // 10 krot
 await go(10);await sleep(400);
 if(mobile){await p.evaluate(()=>document.querySelector('.kstage .ml-go').scrollIntoView({block:'center'}));await sleep(300);const bb=await (await p.$('.kstage .ml-go')).boundingBox();await p.touchscreen.tap(bb.x+bb.width/2,bb.y+bb.height/2);await sleep(900);}else{await p.click('.kbig');}
 await sleep(700);
 const cover=await p.evaluate(()=>{const s=document.querySelector('.kstage').getBoundingClientRect();return {full:document.querySelector('.kst').classList.contains('kfull'),w:Math.round(s.width),h:Math.round(s.height),vw:innerWidth,vh:innerHeight};});
 if(!cover.full||Math.max(cover.w/cover.vw,cover.h/cover.vh)<.97)throw new Error('game not full screen '+JSON.stringify(cover));
 await p.screenshot({path:`${OUT}/${nm}-t10-full.png`});
 if(!mobile)await p.evaluate(()=>document.querySelector('.kstage .ml-go').click());
 for(let k=0;k<700;k++){if(await p.evaluate(()=>!!DONE[10]))break;
  const pt=await p.evaluate(k=>{const st=document.querySelector('.kstage');const g=st._inst._dbg();if(g.state!=='play'||!g.wave||g.wave.done)return null;const ms=st.querySelectorAll('.ml-mole');
   for(let i=0;i<9;i++){const o=g.occ[i];if(o&&!o.hit&&ms[i].classList.contains('up')&&((o.tone===g.wave.tone)!==(k%11===5))){const r=ms[i].getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height*.45};}}return null;},k);
  if(pt)await p.evaluate(pt=>{const el=document.elementFromPoint(pt.x,pt.y);el&&el.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,clientX:pt.x,clientY:pt.y}));},pt);
  await sleep(180);}
 if(!(await p.evaluate(()=>!!DONE[10])))throw new Error('krot did not finish');
 await p.evaluate(()=>document.querySelector('.kx').click());await sleep(500);
 await p.waitForSelector('#kr .btn');await p.click('#kr .btn');await sleep(400);
 const fin=await p.textContent('.main');if(!/догнал/.test(fin))throw new Error('final itog text');await p.screenshot({path:`${OUT}/${nm}-itog-end.png`,fullPage:true});
 const parts=[...new Set(saves.map(s=>s.part))].sort();console.log(nm,'saved parts',parts.join(','));
 if(!['t1','t2','t3','t4','t5','t6','t7','t8','t9','t10','names'].every(x=>parts.includes(x)))throw new Error('not all parts saved: '+parts);
 if(saves.some(s=>s.hw!=='dg7'))throw new Error('wrong hw');
 require('fs').writeFileSync(`${OUT}/${nm}-saves.json`,JSON.stringify(saves));
 if(errs.length)throw new Error('errors: '+errs.join(' | '));
 await br.close();}
(async()=>{const only=process.env.VIEW;for(const v of VIEWS){if(only&&v[0]!==only)continue;const t=Date.now();await run(v);console.log(v[0],'OK',Math.round((Date.now()-t)/1000)+'s');}})().catch(e=>{console.error('FAIL',e.message);process.exit(1);});
