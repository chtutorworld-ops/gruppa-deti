// «Проверяющий» для «Карточек: наши иероглифы» (kartochki): ученик 12 лет проходит № 1 и № 2 подряд,
// нарочно ошибается (неверный перевод + апелляция, «не знаю», неверные черты, все подсказки, «показать весь знак»),
// жмёт все кнопки звука, смотрит «Мои итоги» (зоны, «не доделано»), проверяет режим учителя.
// node kc.js [base-url] [phone|land|desk]   (по умолчанию http://localhost:8765/kartochki/)
const {chromium}=require('playwright');const fs=require('fs');const {wire,errs,AUDIO_SPY}=require('./u8common');
const BASE=process.argv[2]||'http://localhost:8765/kartochki/';
const ONLY=process.argv[3];
const OUT=process.env.OUT||'/tmp/claude-0/tkc';fs.mkdirSync(OUT,{recursive:true});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const VIEWS=[['phone',390,844,true],['land',844,390,true],['desk',1280,720,false]].filter(v=>!ONLY||v[0]===ONLY);
const RIGHT={'你':'Ты','我':'я','好':'Хорошо','叫':'зовут','妈':'Мамочка','爸':'отец'};
async function overflow(p,tag,log){const o=await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth);if(o>2)log.bad.push(tag+': горизонтальная прокрутка '+o+'px');}
async function click(p,sel){const el=await p.waitForSelector(sel,{timeout:8000});await el.scrollIntoViewIfNeeded().catch(()=>{});await el.click();}
// рисуем черту по медиане из данных черт (как это сделал бы палец)
async function stroke(p,c,i,reverse){const pts=await p.evaluate(([c,i])=>{const el=document.querySelector('#hw');const R=el.getBoundingClientRect();const sz=el.clientWidth;const pad=sz*.08,sc=(sz-2*pad)/1024,yo=124*sc+pad;
  return HZDATA[c].medians[i].map(([x,y])=>[R.left+pad+x*sc,R.top+sz-yo-y*sc]);},[c,i]);
 const P=reverse?pts.slice().reverse():pts;await p.mouse.move(P[0][0],P[0][1]);await p.mouse.down();
 for(let k=1;k<P.length;k++){const [x0,y0]=P[k-1],[x1,y1]=P[k];for(let s=1;s<=4;s++)await p.mouse.move(x0+(x1-x0)*s/4,y0+(y1-y0)*s/4);}await p.mouse.up();await sleep(380);}
async function writeAll(p,c,from){await p.evaluate(()=>document.querySelector('#hw').scrollIntoView({block:'center'}));await sleep(200);const n=await p.evaluate(c=>HZDATA[c].strokes.length,c);for(let i=from||0;i<n;i++)await stroke(p,c,i);}
async function run([vn,w,h,mob]){const log={bad:[],err:[],api:[],ok:new Set(),saves:[]};
 const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:w,height:h},hasTouch:mob,isMobile:mob,deviceScaleFactor:1});
 await ctx.addInitScript(AUDIO_SPY);await wire(ctx,log);const p=await ctx.newPage();errs(p,log);
 await p.goto(BASE);await p.fill('#nm','Проверка П');await click(p,'#go');await sleep(300);
 await overflow(p,vn+' главная',log);await p.screenshot({path:`${OUT}/${vn}-0-home.png`});
 // № 2 закрыт до № 1
 await click(p,'[data-n="2"]');await sleep(300);if(await p.evaluate(()=>location.hash))log.bad.push('№ 2 открылся раньше № 1');
 if(!(await p.$('.kc-six')))log.bad.push('главная: нет шести иероглифов');
 // ===== № 1 =====
 await click(p,'[data-n="1"]');await click(p,'#st');
 for(let k=0;k<6;k++){await p.waitForSelector('.kc-big');const c=(await p.textContent('.kc-big')).trim();
  if(!RIGHT[c])log.bad.push('№ 1: непройденный иероглиф '+c);
  const n0=await p.evaluate(()=>__au.length);await click(p,'#pl');await sleep(250);if(await p.evaluate(()=>__au.length)===n0)log.bad.push('№ 1: 🔊 не играет ('+c+')');
  if(k===0){await p.fill('#an','');await click(p,'#ok');}            // пусто — должна быть подсказка, карточка не переворачивается
  if(k===1){await p.fill('#an','яблоко');await click(p,'#ok');}       // неверно → апелляция
  else if(k===2)await click(p,'#dk');                                  // не знаю
  else if(k===3){await p.fill('#an','кошка');await click(p,'#ok');}   // неверно без апелляции
  else{await p.fill('#an',RIGHT[c]);await p.press('#an','Enter');}
  await sleep(700);
  if(!(await p.$('.kc-card.fl')))log.bad.push('№ 1: карточка не перевернулась ('+c+')');
  const v=(await p.textContent('.kc-verd')).trim();
  const want=k===1||k===3?'Не совсем так':k===2?'Ничего страшного':'Верно';if(!v.includes(want))log.bad.push(`№ 1: ${c} вердикт «${v}», ждали «${want}»`);
  if(k===1){await click(p,'#ap');if(!(await p.textContent('.kc-verd')).includes('Засчитано'))log.bad.push('№ 1: апелляция не сработала');}
  const n1=await p.evaluate(()=>__au.length);await click(p,'#ex');await sleep(250);if(await p.evaluate(()=>__au.length)===n1)log.bad.push('№ 1: 🔊 примера не играет ('+c+')');
  if(k===1)await p.screenshot({path:`${OUT}/${vn}-1-card.png`});
  await overflow(p,vn+' № 1',log);await click(p,'#go');await sleep(200);}
 await sleep(400);const r1=(await p.textContent('.res')).trim();if(r1!=='4 / 6')log.bad.push('№ 1: итог '+r1+', ждали 4 / 6 (2 верно + 1 апелляция + 2 верно… )');
 await p.screenshot({path:`${OUT}/${vn}-2-t1res.png`,fullPage:true});
 // ===== № 2 =====
 await click(p,'button.btn[onclick*="#2"]');await click(p,'#st');
 for(let k=0;k<6;k++){await p.waitForSelector('#hw svg');await sleep(300);const q=(await p.textContent('.kc-wq b')).trim();
  const c=await p.evaluate(q=>({'«ты»':'你','«я»':'我','«хороший, хорошо»':'好','«звать, зваться» (меня зовут…)':'叫','«мама»':'妈','«папа»':'爸'})[q],q);
  if(!c){log.bad.push('№ 2: странный перевод '+q);break;}
  await p.evaluate(()=>document.querySelector('#hw').scrollIntoView({block:'center'}));await sleep(200);
  if(k===1){await stroke(p,c,1,true);await stroke(p,c,1,true);await writeAll(p,c);}          // две ошибки подряд, потом верно
  else if(k===2){await click(p,'#hn');await click(p,'#hn');await click(p,'#hn');await p.screenshot({path:`${OUT}/${vn}-3-hints.png`});await writeAll(p,c);}
  else if(k===3){await click(p,'#sh');await p.waitForFunction(()=>/обведи/.test(document.querySelector('#wh').textContent),null,{timeout:15000});await writeAll(p,c);}
  else await writeAll(p,c);
  try{await p.waitForSelector('#go',{timeout:5000});}catch(e){log.bad.push('№ 2: не засчитал написанный '+c+' ('+(await p.textContent('#wh'))+')');break;}
  const n1=await p.evaluate(()=>__au.length);await click(p,'#ex');await sleep(250);if(await p.evaluate(()=>__au.length)===n1)log.bad.push('№ 2: 🔊 не играет ('+c+')');
  if(k===0)await p.screenshot({path:`${OUT}/${vn}-4-write.png`});
  await overflow(p,vn+' № 2',log);await click(p,'#go');await sleep(200);}
 await sleep(400);const r2=(await p.textContent('.res')).trim();if(r2!=='4 / 6')log.bad.push('№ 2: итог '+r2+', ждали 4 / 6');
 await p.screenshot({path:`${OUT}/${vn}-5-t2res.png`,fullPage:true});
 // ===== итоги =====
 await p.evaluate(()=>location.hash='#itogi');await sleep(400);
 const z=await p.evaluate(()=>['g','y','r'].map(k=>[...document.querySelectorAll('.kc-zone.'+k+' .kc-chip')].map(e=>e.dataset.w).join('')));
 if(z.join('').length!==6)log.bad.push('итоги: в зонах не 6 иероглифов: '+z.join('|'));if(!z[2])log.bad.push('итоги: нет красной зоны (смотрел весь знак)');
 if(!(await p.$('.allok')))log.bad.push('итоги: нет «Все задания сделаны»');
 const n2=await p.evaluate(()=>__au.length);await click(p,'.kc-chip');await sleep(250);if(await p.evaluate(()=>__au.length)===n2)log.bad.push('итоги: 🔊 чипа не играет');
 await overflow(p,vn+' итоги',log);await p.screenshot({path:`${OUT}/${vn}-6-itogi.png`,fullPage:true});
 // главная: 100 %
 await p.evaluate(()=>location.hash='');await sleep(300);const pc=await p.evaluate(()=>[...document.querySelectorAll('.pbt b')].pop().textContent);if(pc.trim()!=='100%')log.bad.push('шкала: '+pc);
 // повторный вход в № 1 — только результат (контроль)
 await click(p,'[data-n="1"]');await sleep(300);if(await p.$('#st'))log.bad.push('№ 1 можно пройти второй раз');
 await sleep(800);const parts=[...new Set(log.saves.map(s=>s.part))];['t1','t2','itogi'].forEach(x=>{if(!parts.includes(x))log.bad.push('в кабинет не ушло: '+x);});
 const t1=log.saves.find(s=>s.part==='t1');if(t1&&!(t1.data.res||[]).some(r=>r.ap))log.bad.push('в кабинет не ушла апелляция');
 if(t1&&t1.hw!=='kart6')log.bad.push('hw не kart6');
 const bad=await p.evaluate(()=>__au.filter(a=>a.err).length);if(bad)log.bad.push('звуков с ошибкой: '+bad);
 // ===== учитель =====
 const p2=await ctx.newPage();errs(p2,log);await p2.goto(BASE+'?name=учитель');await sleep(300);await p2.evaluate(()=>localStorage.clear());await p2.goto(BASE+'?name=учитель');await sleep(400);
 const before=log.saves.length;
 if(!(await p2.$('#rs')))log.bad.push('учитель: нет кнопки «Сбросить»');
 await p2.click('[data-n="2"]');await sleep(300);if(!(await p2.$('#st')))log.bad.push('учитель: № 2 закрыт');
 await sleep(500);if(log.saves.length>before)log.bad.push('учитель: ответы ушли в кабинет');
 await b.close();
 return {vn,bad:log.bad,err:log.err,sounds:[...log.ok].join(' ')};}
(async()=>{let fail=0;for(const v of VIEWS){const r=await run(v);console.log(JSON.stringify(r,null,1));if(r.bad.length||r.err.length)fail=1;}process.exit(fail);})();
