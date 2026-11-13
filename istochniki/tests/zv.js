// Проверяющий для страницы «Звуки» (zvuki/): node tests/zv.js <url страницы> [phone|land|desk]
// Звук: все запросы к audio/ подменяются тестовым wav и сверяются со списком tools/audio-list.txt и записями учителя.
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const URL0=process.argv[2]||'http://localhost:8765/zvuki/';const VIEW=process.argv[3]||'phone';
const VP={phone:{viewport:{width:390,height:844},isMobile:true,hasTouch:true},land:{viewport:{width:844,height:390},isMobile:true,hasTouch:true},desk:{viewport:{width:1280,height:800}}}[VIEW];
const LIST=new Set(fs.readFileSync(path.join(__dirname,'../../../gruppa-deti-sait/tools/audio-list.txt'),'utf8').split('\n').map(s=>s.trim()).filter(Boolean).map(t=>[...t].map(c=>c.codePointAt(0).toString(16)).join('-')+'.mp3'));
const VOICE=new Set(['b0','p0','m0','f0','d0','t0','n0','l0','g0','k0','h0'].map(x=>x+'.wav'));
(async()=>{const b=await chromium.launch();const c=await b.newContext(VP);const p=await c.newPage();
const errs=[],bad=[],saves={};let plays=0;
p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error'&&!/favicon|fonts\.g/.test(m.text()))errs.push('console: '+m.text());});
await p.addInitScript(()=>{const o=HTMLMediaElement.prototype.play;HTMLMediaElement.prototype.play=function(){window.__plays=(window.__plays||0)+1;window.__last=this.src;return o.call(this);};});
await p.route('**/audio/**',r=>{const u=r.request().url();const f=u.split('/').pop().split('?')[0];
 const ok=u.includes('/audio/voice/')?VOICE.has(f):LIST.has(f);if(!ok)bad.push(u);
 r.fulfill(ok?{path:path.join(__dirname,'tone.wav'),contentType:'audio/wav'}:{status:404,body:''});});
await p.route('**/api/dz/**',async r=>{const u=r.request().url();
 if(u.includes('/save')){const j=JSON.parse(r.request().postData());const s=saves[j.sid]=saves[j.sid]||{sid:j.sid,name:j.name,parts:{}};s.parts[j.part]=j.data;return r.fulfill({json:{ok:1}});}
 if(u.includes('/list'))return r.fulfill({json:{subs:Object.values(saves)}});r.fulfill({json:{}});});
const tap=async l=>{if(VP.hasTouch)await l.tap();else await l.click();};
const W=ms=>p.waitForTimeout(ms);
const overflow=async tag=>{const o=await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth);if(o>1)errs.push(tag+': страница шире экрана на '+o+'px');};
await p.goto(URL0);await W(500);
await p.fill('#nm','Проверка П.');await tap(p.locator('#go'));await W(600);await overflow('главная');
// № 1: все 22 звука
const cells=await p.locator('[data-ini],[data-fin]').all();if(cells.length!==22)errs.push('звуков в таблице '+cells.length);
for(const el of cells){await el.scrollIntoViewIfNeeded();if(VP.hasTouch)await el.tap();else await el.hover();await W(120);
 const box=await p.locator('#pop').boundingBox();const vw=VP.viewport;if(!box||box.x<0||box.y<0||box.x+box.width>vw.width+1||box.y+box.height>vw.height+1)errs.push('подсказка не на экране: '+await el.getAttribute('data-ini')+await el.getAttribute('data-fin')+' '+JSON.stringify(box));
 const ru=await p.locator('#pop .pp-r').textContent();if(!/«.+»/.test(ru))errs.push('нет русского звучания');}
if(!/сделано/.test(await p.locator('#hcnt').textContent()))errs.push('№ 1 не засчитано');
// кнопки тонов в подсказке и слоги таблицы
for(const b of ['ci','chi','zhi','ba','ke']){const el=p.locator(`[data-syl="${b}"]`);await el.scrollIntoViewIfNeeded();if(VP.hasTouch)await el.tap();else await el.hover();await W(150);
 const t=await p.locator('#pop .pp-r').textContent();if(b==='ci'&&t!=='«цы»'||b==='chi'&&t!=='«чшы»'||b==='zhi'&&t!=='«джы»')errs.push(b+' читается '+t);
 const bs=await p.locator('#pop [data-sy]').all();for(const x of bs){await x.click();await W(60);}}
if(VP.hasTouch){await p.mouse.click(5,5);await W(100);}
for(const x of await p.locator('.zrow6 [data-sy]').all()){await x.scrollIntoViewIfNeeded();await tap(x);await W(50);}
const shot=n=>p.screenshot({path:`/tmp/claude-0/zv-${VIEW}-${n}.png`});
await p.evaluate(()=>scrollTo(0,0));await shot('0-home');
// № 2–6
for(let n=2;n<=6;n++){await p.evaluate(n=>location.hash='#'+n,n);await W(300);await overflow('задание '+n);
 for(const x of await p.locator('[data-sy]').all()){await tap(x);await W(40);}
 await tap(p.locator('#st'));let q=0;
 while(await p.locator('.qcard').count()){q++;const pl0=await p.evaluate(()=>window.__plays||0);
  if(await p.locator('#pl').count()){await tap(p.locator('#pl'));await W(80);if((await p.evaluate(()=>window.__plays||0))<=pl0)errs.push('№'+n+' вопрос '+q+': звук не запустился');}
  const opts=await p.locator('.opt').all();await tap(opts[q===1?0:opts.length-1]);await W(150);
  if(q===2)await shot(n+'-q');
  if(!(await p.locator('.opt.ok').count()))errs.push('№'+n+': не показан верный ответ');
  await overflow('задание '+n+' вопрос '+q);
  if(await p.locator('#nb').count())await tap(p.locator('#nb'));await W(200);if(q>30){errs.push('бесконечный тест '+n);break;}}
 const h=await p.locator('h2').first().textContent();if(!/готово/.test(h))errs.push('№'+n+' не закончилось: '+h);
 if(n<6&&!(await p.locator(`button:has-text("Задание № ${n+1}")`).count()))errs.push('нет кнопки к следующему заданию после '+n);}
await shot('6-end');
await p.evaluate(()=>location.hash='#itogi');await W(300);const it=await p.locator('.main').textContent();if(!/Сделано 6 из 6/.test(it))errs.push('итоги: '+it.slice(0,80));
await shot('7-itogi');
await W(800);
// кабинет учителя
const up=await c.newPage();up.on('pageerror',e=>errs.push('кабинет: '+e.message));
await up.route('**/api/dz/**',r=>r.fulfill({json:{subs:Object.values(saves)}}));
await up.goto(URL0+'uchitel/');await up.click('#ref');await W(700);
const row=await up.locator('td.nm').count();if(row!==1)errs.push('кабинет: строк '+row);
await up.locator('td.nm').first().click();await W(400);if(!(await up.locator('.dc.op').count()))errs.push('кабинет: карточка не открылась');
const card=await up.locator('.dc.op').textContent();if(!/100%/.test(card))errs.push('кабинет: нет 100%');
await up.screenshot({path:`/tmp/claude-0/zv-${VIEW}-uchitel.png`,fullPage:true});
const pl=await p.evaluate(()=>window.__plays||0);
console.log(VIEW,'вызовов звука',pl,'частей сохранено',Object.keys(Object.values(saves)[0]?.parts||{}).join(','));
console.log('неверные пути звука:',bad.length?bad:'нет');console.log('ошибки:',errs.length?errs:'нет');
await b.close();process.exit(errs.length||bad.length?1:0);})();
