// «Проверяющий» для ДЗ 10 (вид ДЗ 9): ученик 12 лет проходит все 10 заданий подряд, ошибается нарочно,
// проверяет, что шаг помещается в экран, главная кнопка видна, звук берётся только из того, что есть на сайте:
//   записи учителя — из списка voice (tests/voice10.json = audio/voice/index.json с сайта),
//   голос диктанта audio/dict/ — только иероглифы из tools/audio-tones.json и audio-list.txt, остальное — из audio-list.txt.
// node dz10.js [base-url] [phone|small|desk]   (SAIT=путь к gruppa-deti-sait)
const {chromium}=require('playwright');const fs=require('fs');const {errs,AUDIO_SPY}=require('./u8common');
const SAIT=process.env.SAIT||'/home/user/gruppa-deti-sait';
const BASE=process.argv[2]||'http://localhost:8765/dz-10/';
const ONLY=process.argv[3];const ST=+(process.env.START||1);
const OUT=process.env.OUT||'/tmp/claude-0/t10dz';fs.mkdirSync(OUT,{recursive:true});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const VIEWS=[['phone',390,844,true],['small',360,640,true],['desk',1440,900,false],['desk2',1280,800,false]].filter(v=>!ONLY||v[0]===ONLY);
const fname=t=>[...t].map(c=>c.codePointAt(0).toString(16)).join('-')+'.mp3';
const unf=f=>f.replace('.mp3','').split('-').map(h=>String.fromCodePoint(parseInt(h,16))).join('');
const LIST=new Set(fs.readFileSync(SAIT+'/tools/audio-list.txt','utf8').split('\n').map(x=>x.trim()).filter(Boolean).map(fname));
const TONES=new Set(Object.values(JSON.parse(fs.readFileSync(SAIT+'/tools/audio-tones.json','utf8'))).map(v=>v.c));
const VIDX=JSON.parse(fs.readFileSync(__dirname+'/voice10.json','utf8'));
const WAV=fs.readFileSync(__dirname+'/tone.wav');
const HZ10={'ты':'你','я':'我','хорошо':'好','звать':'叫','мама':'妈','папа':'爸','он':'他','она':'她','много (людей)':'们','Вы (вежливо)':'您'};
const MEM={'你':'ты','我':'я','好':'хорошо','叫':'звать','妈':'мама','爸':'папа','他':'он','她':'она','们':'много людей','您':'Вы (вежливо)','是':'является','不':'не','吗':'вопрос да/нет'};
const DLG=['小朋友，你好！','您好！','小朋友，你叫什么名字？','我叫小明。','她是你妈妈吗？','不是，不是！她不是我妈妈。','她是我妈妈！'];
// печатаем: русская фраза → [латиница, нужный иероглиф]
const TYPE={'Его зовут Сяо Мин?':[['ta','他'],['jiao','叫'],['xiaoming','小明'],['ma','吗']],'Тебя зовут Сяо Мин?':[['ni','你'],['jiao','叫'],['xiaoming','小明'],['ma','吗']],
 'Она — моя мама.':[['ta','她'],['shi','是'],['wo','我'],['mama','妈妈']],'Он — мой папа.':[['ta','他'],['shi','是'],['wo','我'],['baba','爸爸']],
 'Она не моя мама.':[['ta','她'],['bushi','不是'],['wo','我'],['mama','妈妈']],'Он не твой папа.':[['ta','他'],['bu','不'],['shi','是'],['ni','你'],['baba','爸爸']]};
async function draw(p,ch){const info=await p.evaluate(ch=>{const el=document.querySelector('#hw');const r=el.getBoundingClientRect();return {x:r.left,y:r.top,w:r.width,med:HZDATA[ch].medians};},ch);
 const sz=info.w,pad=sz*.08,sc=(sz-2*pad)/1024;
 for(const m of info.med){const pts=m.map(([x,y])=>[info.x+pad+x*sc,info.y+pad+(900-y)*sc]);await p.mouse.move(...pts[0]);await p.mouse.down();for(const q of pts.slice(1))await p.mouse.move(...q,{steps:4});await p.mouse.up();await sleep(120);}}
async function wrongStroke(p){const r=await p.evaluate(()=>{const b=document.querySelector('#hw').getBoundingClientRect();return [b.left,b.top,b.width];});
 await p.mouse.move(r[0]+r[2]*.9,r[1]+r[2]*.1);await p.mouse.down();await p.mouse.move(r[0]+r[2]*.1,r[1]+r[2]*.9,{steps:6});await p.mouse.up();await sleep(250);}
async function fits(p,tag,log,scrollOk){const o=await p.evaluate(()=>{const m=document.querySelector('#mn,#nx');const b=m?m.getBoundingClientRect():null;const sc=document.querySelector('.scene');
  return {hx:document.documentElement.scrollWidth-innerWidth,vy:document.documentElement.scrollHeight-innerHeight,mb:b?b.bottom-innerHeight:null,sy:sc?sc.scrollHeight-sc.clientHeight:0,w:innerWidth,h:innerHeight};});
 if(o.sy>4)(o.h<700||scrollOk?log.note:log.bad).push(tag+': внутри шага прокрутка '+o.sy+'px');
 if(o.hx>2)log.bad.push(tag+': горизонтальная прокрутка '+o.hx+'px');
 if(o.vy>2)(scrollOk?log.note:log.bad).push(tag+': шаг длиннее экрана на '+o.vy+'px');
 if(o.mb!=null&&o.mb>1)log.bad.push(tag+': главная кнопка за краем экрана');}
const tapEl=async(p,el,mobile)=>{await el.scrollIntoViewIfNeeded();if(mobile){const b=await el.boundingBox();await p.touchscreen.tap(b.x+b.width/2,b.y+b.height/2);}else await el.click();};
const click=async(p,sel,mobile)=>{const el=await p.$(sel);if(!el)throw new Error('нет '+sel);await tapEl(p,el,mobile);};
async function waitEnabled(p,sel,ms=15000){await p.waitForFunction(s=>{const e=document.querySelector(s);return e&&!e.disabled;},sel,{timeout:ms});}
async function finished(p,n){await p.waitForFunction(n=>{const h=document.querySelector('.fin-box h2');return h&&h.textContent.includes('Задание '+n+' сделано');},n,{timeout:20000});}
async function brute(p,sel,mobile){const els=await p.$$(sel);for(let i=0;i<els.length;i++){
 if(await p.evaluate(s=>!!document.querySelector(s.split(',').map(x=>x.trim()+'.ok').join(',')),sel))return i;
 if(await els[i].evaluate(e=>e.disabled))continue;await tapEl(p,els[i],mobile);await sleep(160);}return els.length;}
async function rule(p,tag,mobile,log,shot,scrollOk){await fits(p,tag+' правило',log,scrollOk);await shot(tag+'-rule');const k=await p.$$eval('[data-snd]',e=>e.length);
 for(let i=0;i<k;i++){const el=(await p.$$('[data-snd]'))[i];await tapEl(p,el,mobile);await sleep(120);}
 await waitEnabled(p,'#mn');await click(p,'#mn',mobile);await sleep(400);}
async function quizSteps(p,tag,cnt,mobile,log,shot){for(let k=0;k<cnt;k++){await fits(p,tag+' шаг '+(k+1),log);await brute(p,'.keys .key',mobile);if(k===0)await shot(tag);await waitEnabled(p,'#mn');await click(p,'#mn',mobile);await sleep(350);}}
async function typeTok(p,key,ch,mobile){await p.fill('#ib','');await p.type('#ib',key,{delay:20});await sleep(120);
 const ks=await p.$$('.imk');for(const k of ks){if(await k.$eval('.zh',e=>e.textContent)===ch){await tapEl(p,k,mobile);await sleep(120);return;}}throw new Error('нет кандидата '+ch+' для '+key);}
async function wordTask(p,n,ch,mobile,log,shot){
 await rule(p,n,mobile,log,shot);
 // пропись: смотри → обведи → сам (одна ошибка нарочно)
 await waitEnabled(p,'#mn',20000);await fits(p,n+' смотри',log);await click(p,'#mn',mobile);await sleep(500);
 await fits(p,n+' обведи',log);await shot(n+'-propis');await draw(p,ch);await waitEnabled(p,'#mn');await click(p,'#mn',mobile);await sleep(500);
 await wrongStroke(p);await draw(p,ch);await waitEnabled(p,'#mn');await click(p,'#mn',mobile);await sleep(500);
 for(let s=0;s<2;s++){await fits(p,n+' печатаем '+(s+1),log);const ru=await p.$eval('.imq b',e=>e.textContent);const T=TYPE[ru];if(!T)throw new Error('нет фразы '+ru);
  if(s===0){// нарочно: другой иероглиф с тем же чтением, проверить, стереть
   const alt={'他':'她','她':'他','吗':'妈','你':'您'}[T[0][1]]||T[0][1];await typeTok(p,T[0][0],alt,mobile);await click(p,'#mn',mobile);await sleep(250);
   if(!await p.$('#fb.hint'))log.bad.push(n+': неверная фраза не показала подсказку');await shot(n+'-ime-hint');await click(p,'#del',mobile);await sleep(100);
   if(await p.$$eval('#io .zh',e=>e.length))log.bad.push(n+': ⌫ не стёр иероглиф');}
  for(const [k,c] of T)await typeTok(p,k,c,mobile);if(s===0)await shot(n+'-ime');await click(p,'#mn',mobile);await sleep(300);
  if(!await p.$('#fb.ok'))log.bad.push(n+': верная фраза не засчитана: '+ru);await waitEnabled(p,'#mn');await click(p,'#mn',mobile);await sleep(400);}
 await finished(p,n);await click(p,'#nx',mobile);await sleep(500);}
async function run(view){const [nm,w,h,mobile]=view;
 const br=await chromium.launch({args:['--autoplay-policy=no-user-gesture-required']});
 const ctx=await br.newContext({viewport:{width:w,height:h},isMobile:mobile,hasTouch:mobile,deviceScaleFactor:1});
 const log={err:[],bad:[],note:[],ok:new Set(),voice:new Set(),dict:new Set(),saves:[]};
 await ctx.route(/\/audio\//,r=>{const f=decodeURIComponent(r.request().url().split('/audio/').pop().split('?')[0]);
  if(f==='voice/index.json')return r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(VIDX)});
  if(f.startsWith('voice/')){const id=f.slice(6).replace('.wav','');if(VIDX[id]){log.voice.add(id);return r.fulfill({status:200,contentType:'audio/wav',body:WAV});}log.bad.push('нет записи учителя: '+id);return r.fulfill({status:404,body:''});}
  if(f.startsWith('dict/')){const c=unf(f.slice(5));if(LIST.has(f.slice(5))&&TONES.has(c)){log.dict.add(c);return r.fulfill({status:200,contentType:'audio/wav',body:WAV});}log.bad.push('нет голоса диктанта: '+c);return r.fulfill({status:404,body:''});}
  if(LIST.has(f)){log.ok.add(unf(f));return r.fulfill({status:200,contentType:'audio/wav',body:WAV});}
  log.bad.push('звука нет в списке: '+unf(f));return r.fulfill({status:404,body:''});});
 await ctx.route(/workers\.dev\/api/,r=>{const u=r.request().url();if(/\/save/.test(u)){try{log.saves.push(JSON.parse(r.request().postData()));}catch(e){}}
  return r.fulfill({status:200,contentType:'application/json',body:'{"ok":true}'});});
 await ctx.addInitScript(AUDIO_SPY);
 const p=await ctx.newPage();global.P=p;global.LOG=log;errs(p,log);const shot=async t=>p.screenshot({path:`${OUT}/${nm}-${t}.png`});
 p.on('response',r=>{if(r.status()>=400&&!/audio|workers/.test(r.url()))log.bad.push('ошибка загрузки '+r.status()+' '+r.url());});
 await p.goto(BASE);await p.evaluate(()=>localStorage.clear());await p.reload();await sleep(300);
 await p.fill('#nm','Петя');await click(p,'#go',mobile);await sleep(400);
 if(ST>1){await p.evaluate(st=>{const S=JSON.parse(localStorage.getItem('zh-dz10'));for(let i=1;i<st;i++)S.done[i]={score:1,of:1};localStorage.setItem('zh-dz10',JSON.stringify(S));},ST);await p.reload();await sleep(400);}
 await shot('list');await fits(p,'список',log,true);
 await click(p,'#go',mobile);await sleep(500);
 // ---- 1 диктант (голос учителя)
 if(ST<=1){for(let k=0;k<10;k++){for(let ph=0;ph<3;ph++){await fits(p,`1 слог ${k+1}.${ph+1}`,log);await brute(p,'#kk [data-v]',mobile);if(k===0)await shot('t1-'+ph);await sleep(700);}
  await waitEnabled(p,'#mn');await click(p,'#mn',mobile);await sleep(400);}
  await finished(p,1);await click(p,'#nx',mobile);await sleep(500);}
 // ---- 2 иероглифы в темноте
 if(ST<=2){await fits(p,'2 комнаты',log);await shot('t2-rooms');await click(p,'.rmroom[data-r="chaj"]',mobile);await sleep(500);
  await fits(p,'2 комната',log);
  const sc=await p.evaluate(()=>{const r=document.querySelector('#rs').getBoundingClientRect();return [r.width,r.height,innerWidth,innerHeight];});if(sc[1]<sc[3]*.4)log.bad.push('2: комната мелкая '+sc);
  for(let k=0;k<10;k++){const ask=await p.$eval('#ra b',e=>e.textContent.replace(/[«»]/g,''));const ch=HZ10[ask];if(!ch)throw new Error('не знаю, что искать: '+ask);
   const bs=await p.$$('.rmh:not(.got)');let right=null,wrong=null;for(const b of bs){const t=await b.$eval('.zh',e=>e.textContent);if(t===ch)right=b;else if(!wrong)wrong=b;}
   const bb=await right.boundingBox();if(mobile)await p.evaluate(([x,y])=>document.querySelector('#rs').dispatchEvent(new PointerEvent('pointermove',{clientX:x,clientY:y,bubbles:true})),[bb.x+bb.width/2,bb.y+bb.height/2]);else{await p.mouse.move(bb.x+bb.width/2,bb.y+bb.height/2,{steps:5});}
   if(k===1)await shot('t2-light');
   if(k<2&&wrong){const wb=await wrong.boundingBox();if(mobile)await p.touchscreen.tap(wb.x+wb.width/2,wb.y+wb.height/2);else await p.mouse.click(wb.x+wb.width/2,wb.y+wb.height/2);await sleep(200);if(!await p.$('#fb.hint'))log.bad.push('2: ошибка не показана');}
   if(mobile)await p.touchscreen.tap(bb.x+bb.width/2,bb.y+bb.height/2);else await p.mouse.click(bb.x+bb.width/2,bb.y+bb.height/2);await sleep(250);
   if(!await right.evaluate(e=>e.classList.contains('got')))log.bad.push('2: не засчитан найденный '+ch);}
  await shot('t2-end');await finished(p,2);await click(p,'#nx',mobile);await sleep(500);}
 // ---- 3 an en
 if(ST<=3){await fits(p,'3 правило 1',log);await shot('t3-1');await click(p,'#mn',mobile);await sleep(400);
  await rule(p,'3',mobile,log,shot);await quizSteps(p,'3a',10,mobile,log,shot);await quizSteps(p,'3b',8,mobile,log,shot);
  await finished(p,3);await click(p,'#nx',mobile);await sleep(500);}
 // ---- 4 диалог
 if(ST<=4){for(let f=0;f<5;f++)await rule(p,'4-'+(f+1),mobile,log,shot);await finished(p,4);await click(p,'#nx',mobile);await sleep(500);}
 // ---- 5–7 новые слова
 if(ST<=5)await wordTask(p,5,'吗',mobile,log,shot);
 if(ST<=6)await wordTask(p,6,'是',mobile,log,shot);
 if(ST<=7)await wordTask(p,7,'不',mobile,log,shot);
 // ---- 8 пропуски (с пиньинем и без)
 if(ST<=8){await shot('t8');await click(p,'#pt',mobile);await sleep(200);if(!await p.$('.dlp'))log.bad.push('8: пиньинь не включился');await shot('t8-py');await click(p,'#pt',mobile);await sleep(200);if(await p.$('.dlp'))log.bad.push('8: пиньинь не выключился');
  for(let g=0;g<7;g++){await fits(p,'8 пропуск '+(g+1),log,true);await brute(p,'.keys .key',mobile);await waitEnabled(p,'#mn');await click(p,'#mn',mobile);await sleep(350);}
  await finished(p,8);await click(p,'#nx',mobile);await sleep(500);}
 // ---- 9 реплики по порядку
 if(ST<=9){if(await p.$('.dlp'))log.bad.push('9: есть пиньинь');
  for(let k=0;k<7;k++){await fits(p,'9 реплика '+(k+1),log,true);const cs=await p.$$('.ocard');let right=null,wrong=null;for(const c of cs){const t=await c.textContent();if(t===DLG[k])right=c;else if(!wrong)wrong=c;}
   if(!right)throw new Error('9: нет реплики '+DLG[k]);if(k<2&&wrong){await tapEl(p,wrong,mobile);await sleep(200);if(k===0)await shot('t9-hint');}
   await tapEl(p,right,mobile);await sleep(300);}
  await shot('t9');await waitEnabled(p,'#mn');await click(p,'#mn',mobile);await sleep(400);await finished(p,9);await click(p,'#nx',mobile);await sleep(500);}
 // ---- 10 мемори
 if(ST<=10){await fits(p,'10',log);await shot('t10-start');const cards=await p.$$eval('.mc .fa',e=>e.map(x=>x.textContent));
  const pairOf=t=>MEM[t]||Object.keys(MEM).find(k=>MEM[k]===t);
  const bad=cards.findIndex((t,i)=>i>0&&pairOf(cards[0])!==t);await click(p,'.mc[data-j="0"]',mobile);await click(p,`.mc[data-j="${bad}"]`,mobile);await sleep(1300);
  const used=new Set();for(let i=0;i<cards.length;i++){if(used.has(i))continue;const j=cards.findIndex((t,k)=>k!==i&&!used.has(k)&&t===pairOf(cards[i]));used.add(i);used.add(j);
   await click(p,`.mc[data-j="${i}"]`,mobile);await sleep(150);await click(p,`.mc[data-j="${j}"]`,mobile);await sleep(500);}
  await shot('t10');await finished(p,10);await click(p,'#nx',mobile);await sleep(500);}
 const res=await p.$eval('.top h1',e=>e.textContent);if(!/10 из 10/.test(res))log.bad.push('итоги: '+res);await shot('itogi');
 const au=await p.evaluate(()=>window.__au.length);
 const auErr=await p.evaluate(()=>window.__au.filter(a=>a.err).map(a=>a.src));if(auErr.length)log.bad.push('ошибок звука: '+auErr.length+' '+auErr.slice(0,3).join(' '));
 await p.reload();await sleep(400);const pr=await p.$eval('.prog b',e=>e.textContent);if(ST===1&&pr!=='10 из 10')log.bad.push('после обновления: '+pr);
 const parts=log.saves.filter(s=>s.hw==='dz10').map(s=>s.part);if(ST===1)for(let i=1;i<=10;i++)if(!parts.includes('t'+i))log.bad.push('не отправлено в кабинет: t'+i);
 // «не доделано»: пустой ученик видит список недоделанных
 await p.evaluate(()=>{const S=JSON.parse(localStorage.getItem('zh-dz10'));S.done={1:{score:1,of:1}};localStorage.setItem('zh-dz10',JSON.stringify(S));});await p.reload();await sleep(300);
 await click(p,'#rs',mobile);await sleep(300);const left=await p.$$eval('.ri.x',e=>e.length);if(left!==9)log.bad.push('итоги: «осталось» показывает '+left+' вместо 9');await shot('itogi-left');
 await br.close();
 console.log(`== ${nm}: ошибок консоли ${log.err.length}, замечаний ${log.bad.length}, звуков ${au}, записей учителя ${log.voice.size}, голос диктанта ${log.dict.size}, отправок ${parts.length}`);
 [...new Set(log.err)].slice(0,10).forEach(e=>console.log('  ERR',e));[...new Set(log.bad)].slice(0,30).forEach(e=>console.log('  !',e));[...new Set(log.note)].slice(0,12).forEach(e=>console.log('  (заметка)',e));
 if(process.env.LISTAUDIO)fs.writeFileSync(OUT+'/audio-'+nm+'.json',JSON.stringify({voice:[...log.voice],dict:[...log.dict],ok:[...log.ok]}));
 return log.err.length+log.bad.length;}
(async()=>{let bad=0;for(const v of VIEWS)bad+=await run(v);console.log(bad?'ЕСТЬ ЗАМЕЧАНИЯ':'ЧИСТО');process.exit(bad?1:0);})().catch(async e=>{try{await global.P.screenshot({path:OUT+'/FAIL.png'});console.log(await global.P.evaluate(()=>document.querySelector('#app').innerText.slice(0,400)))}catch(x){}console.error('СЛОМАЛОСЬ',e,global.LOG&&global.LOG.err,global.LOG&&[...new Set(global.LOG.bad)]);process.exit(2);});
