// «Проверяющий» для ДЗ 7: ученик 12 лет проходит все 10 заданий подряд, нажимает наугад (значит, и ошибается), доигрывает обе игры до конца.
// node dz7.js [base-url]   (по умолчанию http://localhost:8765/dz-7/)   VIEW=phone|land|desk   ONLY=2,3 — только эти задания
const {chromium}=require('playwright');
const BASE=process.argv[2]||'http://localhost:8765/dz-7/';
const OUT=process.env.OUT||'/tmp/claude-0/tdz7';require('fs').mkdirSync(OUT,{recursive:true});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const VIEWS={phone:[390,844,true],land:[844,390,true],desk:[1280,720,false]};
const ONLY=(process.env.ONLY||'').split(',').filter(Boolean).map(Number);
const RU={'ты':'你','я':'我','хорошо':'好','зваться':'叫','мама':'妈','папа':'爸'};
async function draw(p,ch){const info=await p.evaluate(ch=>{const el=document.querySelector('#hw');if(!el)return null;el.scrollIntoView({block:'center'});const r=el.getBoundingClientRect();return {x:r.left,y:r.top,w:r.width,med:HZDATA[ch].medians};},ch);
 if(!info)return;const sz=info.w,pad=sz*.08,sc=(sz-2*pad)/1024;
 for(const m of info.med){const pts=m.map(([x,y])=>[info.x+pad+x*sc,info.y+pad+(900-y)*sc]);await p.mouse.move(...pts[0]);await p.mouse.down();for(const q of pts.slice(1))await p.mouse.move(...q,{steps:4});await p.mouse.up();await sleep(110);}}
async function tap(p,h){const b=await h.boundingBox();if(!b)return;const x=b.x+b.width/2,y=b.y+b.height/2;if(MOB)await p.touchscreen.tap(x,y);else await p.mouse.click(x,y);}
let MOB=false;
async function overflow(p,tag){const o=await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth);if(o>2)throw new Error(tag+': horizontal overflow '+o+'px');}
const done=p=>p.evaluate(()=>/готово!/.test((document.querySelector('h2')||{}).textContent||'')||!!document.querySelector('#kr .res'));
async function quizTask(p,n){if(await p.$('#st'))await p.click('#st');
 for(let g=0;g<60;g++){if(await done(p))return;const opts=await p.$$('.opt:not([disabled])');
  if(opts.length){await opts[Math.floor(Math.random()*opts.length)].click();await sleep(250);const nb=await p.$('#nb');if(nb)await nb.click();await sleep(250);continue;}
  await sleep(300);}
 await p.screenshot({path:OUT+'/fail-'+n+'.png',fullPage:true});throw new Error('task '+n+' did not finish');}
async function memo(p){const cards=await p.$$eval('.mc .mcf',a=>a.map(x=>x.textContent));const M={'你':'ты','我':'я','好':'хорошо','叫':'зваться','妈妈':'мама','爸爸':'папа','你好':'привет','我叫':'меня зовут'};
 const els=await p.$$('.mc');// one deliberate mistake first
 await els[0].click();const w=cards.findIndex((t,j)=>j>0&&M[cards[0]]!==t&&M[t]!==cards[0]);await els[w].click();await sleep(1100);
 const used=new Set();for(let i=0;i<cards.length;i++){if(used.has(i)||!M[cards[i]])continue;const j=cards.findIndex(t=>t===M[cards[i]]);used.add(i);used.add(j);await els[i].click();await els[j].click();await sleep(450);}
 await sleep(2000);}
async function crystals(p,shot){await p.click('.kbig');await sleep(500);await tap(p,await p.$('.cv-go'));await sleep(700);let wrongOnce=false;
 for(let g=0;g<400;g++){const st=await p.evaluate(()=>{const ov=document.querySelector('#cvo');if(ov&&ov.style.display!=='none'&&/пройдена/.test(ov.textContent))return 'end';
   const T=+document.querySelector('#cvn').textContent;const L=[...document.querySelectorAll('.cr:not(.brk):not(.was):not(.lost)')].map((e,i)=>({i,t:toneOf(e.querySelector('.sy').textContent)}));return {T,L};});
  if(st==='end')break;if(g===3&&shot)await p.screenshot({path:shot});
  const all=await p.$$('.cr:not(.brk):not(.was):not(.lost)');const tg=st.L.filter(x=>x.t===st.T);
  if(!wrongOnce){const w=st.L.find(x=>x.t!==st.T);if(w){await tap(p,all[w.i]);wrongOnce=true;await sleep(500);continue;}}
  if(tg.length){await tap(p,all[tg[0].i]);await sleep(200);}else await sleep(300);}
 const r=await p.evaluate(()=>document.querySelector('#cvo').textContent);if(!/пройдена/.test(r))throw new Error('crystals did not end');
 await sleep(3200);}
async function vorota(p,shot){await p.click('.kbig');await sleep(500);await tap(p,await p.$('.vr-go'));await sleep(800);let k=0;
 for(let g=0;g<600;g++){const st=await p.evaluate(()=>{const ov=document.querySelector('#vro');if(ov&&ov.style.display!=='none'&&/фонарики/.test(ov.textContent))return 'end';
   const l=[...document.querySelectorAll('.ln:not(.fly):not(.bad)')].pop();return l?toneOf(l.querySelector('.sy').textContent):0;});
  if(st==='end')break;if(!st){await sleep(200);continue;}
  k++;if(k===2&&shot)await p.screenshot({path:shot});
  const t=k===3?(st%4)+1:st;// one deliberate mistake
  if(k===5){await sleep(7500);continue;}// one lantern falls
  await tap(p,await p.$(`.gt[data-t="${t}"]`));await sleep(400);}
 const r=await p.evaluate(()=>document.querySelector('#vro').textContent);if(!/фонарики/.test(r))throw new Error('vorota did not end');
 await sleep(3200);}
async function dict(p){await p.click('#st');
 for(let k=0;k<6;k++){await sleep(600);const ru=await p.evaluate(()=>(document.querySelector('.qcard div[style*="font-weight:900"]')||{}).textContent||'');const ch=RU[ru.replace(/[«»]/g,'')];
  if(k===2){await p.click('#sk');await sleep(2600);continue;}
  await draw(p,ch);await sleep(1300);}
 await sleep(800);}
(async()=>{const view=process.env.VIEW||'phone';const [w,h,mob]=VIEWS[view];MOB=mob;
 const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:w,height:h},isMobile:mob,hasTouch:mob});const p=await ctx.newPage();
 const errs=[];p.on('pageerror',e=>{errs.push(e.message);console.log('PAGEERR',e.message);});
 await p.goto(BASE+'?name=тест');await sleep(800);await overflow(p,'home');await p.screenshot({path:`${OUT}/${view}-00-home.png`});
 for(let n=1;n<=10;n++){if(ONLY.length&&!ONLY.includes(n))continue;await p.goto(BASE+'?name=тест#'+n);await p.reload();await sleep(600);await overflow(p,'task '+n+' intro');
  await p.screenshot({path:`${OUT}/${view}-${String(n).padStart(2,'0')}-a.png`,fullPage:view!=='land'});
  if(n===2)await crystals(p,`${OUT}/${view}-02-game.png`);else if(n===3)await vorota(p,`${OUT}/${view}-03-game.png`);else if(n===6)await memo(p);else if(n===10)await dict(p);else{
   if(await p.$('#st'))await p.click('#st');await sleep(500);await p.screenshot({path:`${OUT}/${view}-${String(n).padStart(2,'0')}-q.png`});await quizTask(p,n);}
  if(!await done(p))throw new Error('task '+n+' not done');await overflow(p,'task '+n+' end');
  await p.screenshot({path:`${OUT}/${view}-${String(n).padStart(2,'0')}-z.png`,fullPage:view!=='land'});console.log(view,'task',n,'ok');}
 await p.goto(BASE+'?name=тест#itogi');await p.reload();await sleep(600);await p.screenshot({path:`${OUT}/${view}-99-itogi.png`,fullPage:true});
 const pc=await p.evaluate(()=>document.querySelector('.pbt').textContent);console.log(view,'progress:',pc);
 if(errs.length){console.log('ERRORS:\n'+errs.join('\n'));process.exitCode=1;}else console.log(view,'no page errors');
 await b.close();})().catch(e=>{console.error('FAIL',e.message);process.exit(1);});
