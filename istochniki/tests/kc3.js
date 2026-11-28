// «Проверяющий» для № 3 «Тренировка: 8 фаз» в карточках: ученик проходит проходки до 100%,
// нарочно ошибается (неверный вариант, неверный перевод, неверный тон, «не помню» и ошибка в черте в диктанте),
// проверяет: ошибочное слово возвращается в этой же проходке, блок 3 закрыт до фаз 1–6, % растут, всё уходит в кабинет.
// node kc3.js [base-url] [phone|desk]
const {chromium}=require('playwright');const fs=require('fs');const {wire,errs,AUDIO_SPY}=require('./u8common');
const BASE=process.argv[2]||'http://localhost:8765/kartochki/';const ONLY=process.argv[3];
const OUT=process.env.OUT||'/tmp/claude-0/tkc3';fs.mkdirSync(OUT,{recursive:true});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const VIEWS=[['phone',390,844,true],['desk',1280,800,false]].filter(v=>!ONLY||v[0]===ONLY);
const RU={'你':'ты','我':'я','好':'хорошо','叫':'зовут','妈':'мама','爸':'папа','他':'он','她':'она','们':'множественное число','吗':'вопросительная частица','是':'являться','不':'не'};
async function click(p,sel){const el=await p.waitForSelector(sel,{timeout:8000});await el.scrollIntoViewIfNeeded().catch(()=>{});await el.click();}
async function stroke(p,c,i,reverse){const pts=await p.evaluate(([c,i])=>{const el=document.querySelector('#hw');const R=el.getBoundingClientRect();const sz=el.clientWidth;const pad=sz*.08,sc=(sz-2*pad)/1024,yo=124*sc+pad;
  return HZDATA[c].medians[i].map(([x,y])=>[R.left+pad+x*sc,R.top+sz-yo-y*sc]);},[c,i]);
 const P=reverse?pts.slice().reverse():pts;await p.mouse.move(P[0][0],P[0][1]);await p.mouse.down();
 for(let k=1;k<P.length;k++){const [x0,y0]=P[k-1],[x1,y1]=P[k];for(let s=1;s<=4;s++)await p.mouse.move(x0+(x1-x0)*s/4,y0+(y1-y0)*s/4);}await p.mouse.up();await sleep(300);}
async function overflow(p,tag,log){const o=await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth);if(o>2)log.bad.push(tag+': прокрутка вбок '+o+'px');}
async function run([vn,w,h,mob]){const log={bad:[],err:[],api:[],ok:new Set(),saves:[]};
 const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:w,height:h},hasTouch:mob,isMobile:mob,deviceScaleFactor:1});
 await ctx.addInitScript(AUDIO_SPY);await wire(ctx,log);const p=await ctx.newPage();errs(p,log);
 await p.goto(BASE);await p.fill('#nm','Проверка Т');await click(p,'#go');await sleep(300);
 if(!(await p.$('[data-n="3"]')))log.bad.push('на главной нет задания № 3');
 await click(p,'[data-n="3"]');await sleep(300);await p.screenshot({path:`${OUT}/${vn}-0-fazy.png`,fullPage:true});
 if(!(await p.$('.blk.lock')))log.bad.push('блок 3 не закрыт в начале');
 let runs=0,errsMade=0,returned=0;const shots=new Set();let prev=null;
 while(runs<20){runs++;if(runs>1){const bt=(await p.$$eval('.row .btn',b=>b.map(x=>x.textContent.trim()))).join('|');if(!/Все фазы.*Пройти ещё раз.*Следующая фаза/.test(bt))log.bad.push('кнопки итога: '+bt);}
  await click(p,runs===1?'#go3':runs===2?'#rp3':'#again3');await sleep(250);const seen={};const first=[];
  while(true){const q=await p.$('.q-ph');if(!q)break;const c=await q.getAttribute('data-c'),ph=+(await q.getAttribute('data-p'));
   seen[c]=(seen[c]||0)+1;if(seen[c]>1)returned++;else first.push(c+ph);
   if(ph>=7&&!(await p.evaluate(()=>b3open())))log.bad.push('фаза 7–8 до открытия блока 3');
   const wrong=runs<=3&&errsMade<10&&seen[c]===1&&(Math.random()<.35||(ph===8&&errsMade<10));
   if(!shots.has(ph)){shots.add(ph);await p.screenshot({path:`${OUT}/${vn}-faza${ph}.png`,fullPage:true});}
   await overflow(p,vn+' фаза '+ph,log);
   if(ph===5||ph===6){await sleep(500);if(!(await p.evaluate(()=>__au.length)))log.bad.push('фаза 5/6: звук не играл');}
   if([1,4,5,7].includes(ph)){const right=await p.evaluate(([c,ph])=>ph===4||ph===7?c:WC[c].ru,[c,ph]);
    const btns=await p.$$('.q-opts button');const vals=(await Promise.all(btns.map(x=>x.textContent()))).map(x=>x.trim());
    if(new Set(vals).size!==4)log.bad.push('фаза '+ph+': варианты повторяются '+vals.join('|'));
    if(!vals.includes(right))log.bad.push('фаза '+ph+': нет верного варианта для '+c);
    if((ph===1||ph===4)&&(c==='他'||c==='她')&&vals.some(v=>v===(c==='他'?'她':'他')||v===(c==='他'?'она':'он')))log.bad.push('фаза '+ph+': 他 и 她 вместе');
    const idx=wrong?vals.findIndex(v=>v!==right):vals.indexOf(right);await btns[idx].click();}
   else if(ph===2||ph===6){await p.fill('#an3',wrong?'кошка':RU[c]);await click(p,'#ok3');}
   else if(ph===3){const py=await p.evaluate(c=>plainPy(WC[c].py),c);const tn=await p.evaluate(c=>TN[c],c);
    await p.fill('#an3',py);await click(p,`.tones button[data-t="${wrong?(tn+1)%5:tn}"]`);await click(p,'#ok3');}
   else if(ph===8){await p.evaluate(()=>document.querySelector('#hw').scrollIntoView({block:'center'}));await sleep(200);
    if(wrong&&errsMade%2===0){await click(p,'#dk3');}
    else{const n=await p.evaluate(c=>HZDATA[c].strokes.length,c);if(wrong)await stroke(p,c,n>1?1:0,true);for(let i=0;i<n;i++)await stroke(p,c,i);}}
   try{await p.waitForSelector('#nx3',{timeout:15000});}catch(e){log.bad.push(`фаза ${ph} ${c}: не появилось «Дальше» (${await p.textContent('#wh').catch(()=>'')})`);break;}
   const v=await p.textContent('.kc-verd');if(wrong!==/Не совсем/.test(v))log.bad.push(`фаза ${ph} ${c}: вердикт «${v.trim()}», ждали ${wrong?'ошибку':'верно'}`);
   if(wrong)errsMade++;await click(p,'#nx3');await sleep(120);}
  await sleep(300);if(!(await p.$('#again3'))){log.bad.push('проходка не закончилась');break;}
  if(runs===2&&prev&&first.slice().sort().join()!==prev.slice().sort().join())log.bad.push('«Пройти ещё раз» дал другие слова/фазы: '+first.join()+' / '+prev.join());
  prev=first;
  if(runs===1)await p.screenshot({path:`${OUT}/${vn}-1-itog.png`,fullPage:true});
  if(await p.evaluate(()=>trPct())>=100)break;}
 await click(p,'#bd3');await sleep(300);await p.screenshot({path:`${OUT}/${vn}-2-100.png`,fullPage:true});
 const pct=await p.evaluate(()=>trPct());if(pct!==100)log.bad.push('за '+runs+' проходок не дошли до 100%: '+pct);
 if(!returned)log.bad.push('ошибочное слово не вернулось в проходке');
 for(let k=1;k<=8;k++)if(!shots.has(k))log.bad.push('не было фазы '+k);
 await p.evaluate(()=>location.hash='');await sleep(300);if(!(await p.$eval('[data-n="3"]',e=>/100%/.test(e.textContent))))log.bad.push('на главной № 3 не отмечено');
 await sleep(800);const parts=new Set(log.saves.map(s=>s.part));if(!parts.has('t3'))log.bad.push('t3 не ушло');
 const nr=[...parts].filter(x=>/^t3_/.test(x)).length;if(nr!==runs)log.bad.push(`проходок ушло ${nr}, было ${runs}`);
 const t3=log.saves.filter(s=>s.part==='t3').pop();if(t3&&t3.data.pct!==100)log.bad.push('t3.pct '+(t3&&t3.data.pct));
 await b.close();return {vn,runs,errsMade,returned,bad:log.bad,err:log.err};}
(async()=>{let fail=0;for(const v of VIEWS){const r=await run(v);console.log(JSON.stringify(r));if(r.bad.length||r.err.length)fail=1;}process.exit(fail);})();
