// Проверяющий для ДЗ 6: проходит все шаги подряд как ученик (с нарочными ошибками), телефон и экран.
// node dz6.js [url] [ширина]   — сайт должен быть доступен по url (например python3 -m http.server в site/)
const {chromium}=require('playwright');
const URL=process.argv[2]||'http://localhost:8765/dz-6/';const ONLY=process.argv[3];
const PYC={'nǐ':'你','wǒ':'我','hǎo':'好','jiào':'叫','mā':'妈','bà':'爸'};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function draw(p,ch){ // trace every stroke of the character along its median
 for(let k=0;k<40;k++){const info=await p.evaluate(ch=>{const el=document.querySelector('#hw');if(!el)return null;el.scrollIntoView({block:'center'});const r=el.getBoundingClientRect();return {x:r.left,y:r.top,w:r.width,med:HZDATA[ch].medians};},ch);
  if(!info)return;const sz=info.w,pad=sz*.08,sc=(sz-2*pad)/1024;
  for(const m of info.med){const pts=m.map(([x,y])=>[info.x+pad+x*sc,info.y+pad+(900-y)*sc]);await p.mouse.move(...pts[0]);await p.mouse.down();for(const q of pts.slice(1))await p.mouse.move(...q,{steps:4});await p.mouse.up();await sleep(120);}
  return;}}
async function solveQuiz(p,wrongFirst){ // click options until the right one; return when the step result appears
 for(let g=0;g<200;g++){if(await p.$('#again'))return;const opts=await p.$$('.opts .opt:not(.no):not(.ok)');if(!opts.length){await sleep(300);continue;}
  const before=await p.evaluate(()=>document.querySelector('.qhead')&&document.querySelector('.qhead').textContent);
  const pick=wrongFirst&&g%3===0?opts[opts.length-1]:opts[0];await pick.click();await sleep(250);
  const ok=await p.$('.opt.ok');if(ok){for(let w=0;w<30;w++){await sleep(150);const now=await p.evaluate(()=>document.querySelector('.qhead')?document.querySelector('.qhead').textContent:'end');if(now!==before)break;}}}
 throw new Error('quiz did not finish');}
async function rec(p){await p.click('#mic');await sleep(2200);await p.click('#mic');await p.waitForSelector('#snd');await p.click('#snd');}
const go=async(p,h)=>{await p.evaluate(h=>location.hash=h,h);await sleep(500);};
const STEPS={
 async krot(p){await p.click('.kstage button:has-text("Начать")');for(let k=0;k<600;k++){const d=await p.evaluate(()=>S.done.krot&&S.done.krot.tries);if(d)return;
  const h=await p.evaluate(k=>{const st=document.querySelector('.kstage');const g=st&&st._inst&&st._inst._dbg&&st._inst._dbg();if(!g||!g.wave||g.wave.done)return -1;const ms=st.querySelectorAll('.ml-mole');for(let i=0;i<9;i++){const o=g.occ[i];if(o&&!o.hit&&ms[i].classList.contains('up')&&((o.tone===g.wave.tone)!==(k%13===6)))return i;}return -1;},k);
  if(h>=0){await p.evaluate(h=>{const m=document.querySelectorAll('.kstage .ml-mole')[h];const r=m.getBoundingClientRect();m.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,clientX:r.left+r.width/2,clientY:r.top+r.height/2}));},h);}await sleep(200);}throw new Error('krot');},
 async para(p){for(let k=0;k<20;k++){if(await p.$('#again'))return;const q=(await p.textContent('.big1')).trim();const P={b:'p',p:'b',d:'t',t:'d',g:'k',k:'g'};await p.fill('#ti',k===1?'x':P[q]);await p.press('#ti','Enter');await sleep(k===1?400:1900);}throw new Error('para');},
 async row(p){await rec(p);await p.waitForSelector('#again');},
 async light(p){await p.click('#st');await solveQuiz(p,true);},
 async xmt(p){await p.click('#all');await p.waitForSelector('#ck:visible',{timeout:60000});await p.click('#ck');await solveQuiz(p,true);},
 async tree(p){await rec(p);await p.waitForSelector('#again');},
 async facts(p){await p.click('#ok');},
 async sost(p){await p.click('#st');await solveQuiz(p,true);},
 async alch(p){await p.click('.kstage button:has-text("Начать")');await sleep(1500);const plan=[['亻','女','口'],['父','口']];let used={};
  for(let k=0;k<80;k++){if(await p.evaluate(()=>S.done.alch))return;
   const b=await p.$('.kstage .al-res.show .al-go, .kstage .al-over:not(.hide) .al-next');if(b){await b.click().catch(()=>{});await sleep(1500);continue;}
   const st=await p.evaluate(()=>document.querySelector('.kstage')._dbg.state());if(st.busy){await sleep(500);continue;}
   const ks=plan[st.si]||[];const n=used[st.si]||0;if(n<ks.length){used[st.si]=n+1;await p.evaluate(k=>document.querySelector('.kstage')._dbg.brew(k),ks[n]);}await sleep(1200);}
  throw new Error('alch '+JSON.stringify(await p.evaluate(()=>document.querySelector('.kstage')._dbg.state())));},
 async fam(p){await p.click('#st');await solveQuiz(p,true);},
 async prop(p){for(const ch of ['妈','爸']){await p.waitForFunction(()=>/Обведи/.test(document.querySelector('#wh')&&document.querySelector('#wh').textContent),null,{timeout:20000});const c=await p.$eval('.wch .cur',e=>e.textContent);await draw(p,c);await sleep(1500);}
  for(let k=0;k<2;k++){await p.waitForFunction(k=>{const q=document.querySelector('.qhead');return q&&q.textContent.includes('Иероглиф '+(k+1)+' ');},k);await sleep(300);if(k===0){await p.click('#h1');await p.click('#h2');}const py=(await p.textContent('.qcard .py')).trim();await draw(p,PYC[py]);await sleep(1500);}await p.waitForSelector('#again');},
 async perev(p){const W={'nǐ hǎo':'привет','wǒ':'я','nǐ':'ты','hǎo':'хорошо','jiào':'зовут','mā ma':'мама','bà ba':'папа','wǒ jiào':'меня зовут','nǐ ne':'а ты','zài jiàn':'до свиданя'};
  for(let k=0;k<20;k++){if(await p.$('#again'))return;const py=(await p.textContent('.qcard .py')).trim().replace(/\s+/g,' ');await p.fill('#ti',k===2?'кот':W[py]);await p.press('#ti','Enter');await sleep(2800);}throw new Error('perev');},
 async troi(p){const v=['你','我','好','叫','妈','爸'];await p.click('[data-c="0"][data-v="你"]');await p.click('[data-c="1"][data-v="我"]');await p.click('[data-c="2"][data-v="好"]');await sleep(600);
  for(const x of v){for(const c of [0,1,2])await p.click(`[data-c="${c}"][data-v="${x}"]`);await sleep(150);}await p.waitForSelector('#again');},
 async lamp(p){await p.click('#st');for(let k=0;k<200;k++){if(await p.$('#again'))return;const lg=await p.$('#lg');if(lg){const t=await lg.getAttribute('data-t');const b=k%7===3?await p.$(`.ln6:not([data-v="${t}"])`):await p.$(`.ln6[data-v="${t}"]`);if(b){await b.click({force:true}).catch(()=>{});await sleep(1300);continue;}}await sleep(300);}throw new Error('lamp');},
 async wxi(p){await p.click('#ok');},
 async chat(p){const type=async s=>{await p.fill('#py',s);await p.press('#py','Enter');};const send=()=>p.click('#sd');const W=()=>sleep(2600);
  await W();await type('nihao');await p.click('[data-pn="！"]');await send();await W();
  await type('wojiao');await send();await sleep(400);await p.click('#nm1');await send();await W();
  await p.click('#bk');for(let k=0;k<5;k++)await p.click('#bk');await type('wo');await type('mama');await type('jiao');await p.click('#nm2');await send();await W();
  await type('wo');await type('baba');await type('jiao');await p.click('#nm3');await send();await W();
  await type('zaijian');await send();await p.waitForSelector('#again',{timeout:8000});},
 async cells(p){await p.click('#st');for(let k=0;k<12;k++){await p.waitForFunction(k=>{const q=document.querySelector('.qhead');return q&&q.textContent.includes('Клетка '+(k+1)+' ');},k);await sleep(300);if(k===3)await p.click('#h3'),await sleep(4000);const py=(await p.textContent('.qcard div[style*="font-size:26px"]')).trim();await draw(p,PYC[py]);await sleep(1500);}await p.waitForSelector('#again');},
 async zt(p){await p.click('#ok');},
 async yi(p){await p.click('#go');await solveQuiz(p,true);},
 async ztip(p){await solveQuiz(p,true);}, async zair(p){await solveQuiz(p,true);}, async zi(p){await solveQuiz(p,true);},
 async tt(p){await p.click('#ok');},
 async trec(p){for(let k=0;k<4;k++){await p.waitForSelector('#mic');await rec(p);await sleep(800);}await p.waitForSelector('[data-re]');},
 async drag(p){await p.click('.kstage #dgo');let na=0;for(let k=0;k<400;k++){if(await p.evaluate(()=>S.done.drag&&S.done.drag.tries))return;
  const a=await p.evaluate(()=>{const st=document.querySelector('.kstage');return st&&st._dbg?st._dbg.cur():null;});
  if(a){await sleep(400);const sel=(na++)%6===2?`.kstage .dkeys button:not([data-i="${a}"])`:`.kstage .dkeys button[data-i="${a}"]`;await p.evaluate(sel=>document.querySelector(sel).click(),sel);await sleep(300);}else await sleep(250);}throw new Error('drag');},
 async ninja(p){await p.click('#st');await sleep(2800);const box=await (await p.$('#cv')).boundingBox();
  for(let k=0;k<400;k++){if(await p.$('#again'))return;const its=await p.evaluate(()=>{const b=document.querySelector('#nj');return b&&b._it?b._it.filter(i=>!i.dead&&i.y>60&&i.y<b.clientHeight-60).map(i=>({x:i.x,y:i.y,ok:i.ok})):[];});
   const t=its.find(i=>i.ok)||(k%25===7?its[0]:null);if(t){await p.mouse.move(box.x+t.x-60,box.y+t.y-20);await p.mouse.down();await p.mouse.move(box.x+t.x+60,box.y+t.y+20,{steps:6});await p.mouse.up();}await sleep(120);}throw new Error('ninja');}};
(async()=>{const b=await chromium.launch({args:['--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream','--autoplay-policy=no-user-gesture-required']});
 for(const vp of (ONLY?[{width:+ONLY,height:ONLY<600?844:800}]:[{width:390,height:844},{width:1280,height:800}])){
  const ctx=await b.newContext({viewport:vp,permissions:['microphone']});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error'&&!/Failed to load resource|net::|ERR_|CORS|kitai-ii|github\.io|NotSupportedError|play\(\)/.test(m.text()))errs.push('console: '+m.text().slice(0,150));});
  await p.goto(URL);await p.fill('#nm','учитель');await p.click('#go');await sleep(400);
  const ids=await p.evaluate(()=>STEPS.map(x=>[ST[x.si].id,x.id]));const out=[];
  for(const [st,id] of ids){if(process.env.ST&&!process.env.ST.split(',').includes(id))continue;const t0=Date.now();await go(p,'#'+st+'.'+id);let res='';
   try{if(id==='tree'||id==='chat'||id==='cells'){if(await p.$('#mom')){await p.fill('#mom','Елена');await p.fill('#dad','Сергей');await p.click('#go');await sleep(500);}}
    await STEPS[id](p);await sleep(300);const d=await p.evaluate(id=>S.done[id],id);res=d?`${d.best}/${d.of}`:'НЕ СОХРАНЕНО';
    const ov=await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);if(ov)res+=' ПЕРЕПОЛНЕНИЕ';
    const nx=await p.$('#nx, .nextbar .nx');if(!nx)res+=' нет кнопки дальше';
    if(id==='prop'||id==='chat'||id==='lamp'||id==='ninja'||id==='drag')await p.screenshot({path:`/tmp/claude-0/d6/run-${vp.width}-${id}.png`,fullPage:true});
   }catch(e){res='ОШИБКА '+e.message.split('\n')[0];await p.screenshot({path:`/tmp/claude-0/d6/fail-${vp.width}-${id}.png`,fullPage:true});}
   out.push(`${id}: ${res} (${Math.round((Date.now()-t0)/1000)}s)`);}
  require('fs').writeFileSync(`/tmp/claude-0/d6/done-${vp.width}.json`,JSON.stringify(await p.evaluate(()=>({done:S.done,par:S.par}))));
  await go(p,'#res');await p.screenshot({path:`/tmp/claude-0/d6/run-${vp.width}-res.png`,fullPage:true});
  console.log(vp.width+'px\n '+out.join('\n ')+'\n errors: '+JSON.stringify(errs));await ctx.close();}
 await b.close();})();
