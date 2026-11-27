// «Проверяющий» для ДЗ 11: ученик 12 лет проходит все 9 заданий подряд, нарочно ошибается, на телефоне — касаниями.
// Звук сверяется со списками: записи учителя — tests/voice10.json, синтезатор — tools/audio-list.txt.
// node dz11.js [base-url] [phone|small|desk|desk2]
const {chromium}=require('playwright');const fs=require('fs');const {AUDIO_SPY}=require('./u8common');
const SAIT=process.env.SAIT||'/home/user/gruppa-deti-sait';
const BASE=process.argv[2]||'http://localhost:8765/dz-11/';const ONLY=process.argv[3];
const OUT=process.env.OUT||'/tmp/claude-0/t11dz';fs.mkdirSync(OUT,{recursive:true});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const VIEWS=[['phone',390,844,true],['small',360,640,true],['desk',1440,900,false],['desk2',1280,800,false]].filter(v=>!ONLY||v[0]===ONLY);
const fname=t=>[...t].map(c=>c.codePointAt(0).toString(16)).join('-')+'.mp3';
const unf=f=>f.replace('.mp3','').split('-').map(h=>String.fromCodePoint(parseInt(h,16))).join('');
const LIST=new Set(fs.readFileSync(SAIT+'/tools/audio-list.txt','utf8').split('\n').map(x=>x.trim()).filter(Boolean).map(fname));
const VIDX=JSON.parse(fs.readFileSync(__dirname+'/voice10.json','utf8'));
const WAV=fs.readFileSync(__dirname+'/tone.wav');
const RU2Z={'ты':'你','я':'我','хорошо':'好','звать':'叫','мама':'妈','папа':'爸','он':'他','она':'她','много (людей)':'们','вопрос «да или нет?»':'吗','являться · да':'是','не':'不'};
const PY={'你':['ni',3],'我':['wo',3],'好':['hao',3],'叫':['jiao',4],'妈':['ma',1],'爸':['ba',4],'他':['ta',1],'她':['ta',1],'们':['men',0],'吗':['ma',0],'是':['shi',4],'不':['bu',4]};
const PHR={'不是':[['bu',2],['shi',4]],'你们好':[['ni',3],['men',0],['hao',3]],'她是我妈妈':[['ta',1],['shi',4],['wo',3],['ma',1],['ma',0]]};
const BLD={'妈':['女','马'],'吗':['口','马'],'他':['亻','也'],'她':['女','也'],'们':['亻','门'],'你':['亻','尔'],'好':['女','子'],'叫':['口','丩'],'爸':['父','巴']};
const ERR={'她是我爸爸。':['c',0],'她是你妈妈。':['g',5],'他不是我爸爸。':['c',1],'吗你是我妈妈？':['c',0],'她是我妈妈。':['g',1],'她是妈妈。':['g',2],'他是我爸爸妈妈。':['g',1],'他是你妈妈吗？':['c',0]};
const PYM={'mā':'妈','ma':'吗','tā':null};

async function main(){const b=await chromium.launch({args:['--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream','--autoplay-policy=no-user-gesture-required']});let allBad=0;
 for(const [v,w,h,mobile] of VIEWS){
  const log={bad:[],err:[],ok:new Set(),voice:new Set(),saves:[],aud:[],lastVoice:null,jump:[]};
  const ctx=await b.newContext({viewport:{width:w,height:h},isMobile:mobile,hasTouch:mobile,deviceScaleFactor:1});
  await ctx.route(/\/audio\//,r=>{const f=decodeURIComponent(r.request().url().split('/audio/').pop().split('?')[0]);
   if(f==='voice/index.json')return r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(VIDX)});
   if(f.startsWith('voice/')){const id=f.slice(6).replace('.wav','');log.lastVoice=id;if(VIDX[id]){log.voice.add(id);return r.fulfill({status:200,contentType:'audio/wav',body:WAV});}log.bad.push('нет записи учителя: '+id);return r.fulfill({status:404,body:''});}
   if(f.startsWith('dict/')){log.bad.push('голос диктанта в ДЗ 11 не нужен: '+f);return r.fulfill({status:404,body:''});}
   if(LIST.has(f)){log.ok.add(unf(f));return r.fulfill({status:200,contentType:'audio/wav',body:WAV});}
   log.bad.push('звука нет в списке: '+unf(f));return r.fulfill({status:404,body:''});});
  await ctx.route(/workers\.dev\/api/,r=>{const u=r.request().url();if(/\/save/.test(u)){try{log.saves.push(JSON.parse(r.request().postData()));}catch(e){}}if(/\/audio/.test(u))log.aud.push(u.split('item=')[1]);
   return r.fulfill({status:200,contentType:'application/json',body:'{"ok":true}'});});
  await ctx.addInitScript(AUDIO_SPY);
  const p=await ctx.newPage();p.on('pageerror',e=>log.err.push('pageerror: '+e.message));
  p.on('console',m=>{if(m.type()==='error'&&!/Failed to load resource|net::|NotSupportedError|NotAllowedError|play\(\)/.test(m.text()))log.err.push('console: '+m.text());});
  const cdp=mobile?await ctx.newCDPSession(p):null;
  const shot=async n=>{if(process.env.TRACE)console.log('  · '+n);try{await p.screenshot({path:`${OUT}/${v}-${n}.png`});}catch(e){log.bad.push('страница закрылась на снимке '+n);}};
  const tap=async(el)=>{await el.scrollIntoViewIfNeeded();const bb=await el.boundingBox();if(!bb)throw new Error('нет коробки');if(mobile)await p.touchscreen.tap(bb.x+bb.width/2,bb.y+bb.height/2);else await p.mouse.click(bb.x+bb.width/2,bb.y+bb.height/2);};
  const tapS=async sel=>{const el=await p.$(sel);if(!el)throw new Error('нет '+sel);await tap(el);};
  const en=async(sel='#mn',ms=15000)=>p.waitForFunction(s=>{const e=document.querySelector(s);return e&&!e.disabled;},sel,{timeout:ms});
  const fits=async tag=>{const o=await p.evaluate(()=>{const pan=document.querySelector('.pan');const r=pan?pan.getBoundingClientRect():null;const m=document.querySelector('#mn');const mb=m?m.getBoundingClientRect():null;
    return {hx:document.documentElement.scrollWidth-innerWidth,ptop:r?r.top:0,mb:mb?mb.bottom-innerHeight:null,h:innerHeight};});
   if(o.hx>2)log.bad.push(tag+': горизонтальная прокрутка '+o.hx+'px');
   if(o.ptop>40||o.ptop<-4)log.bad.push(tag+': задание не в начале экрана (верх '+Math.round(o.ptop)+'px)');
   if(o.mb!=null&&o.mb>2&&v!=='small')log.bad.push(tag+': главная кнопка ниже экрана на '+Math.round(o.mb)+'px');};
  const ys=async()=>p.evaluate(()=>scrollY);
  // письмо черт: телефон — настоящими касаниями (CDP), компьютер — мышью
  const strokeLine=async pts=>{if(mobile){await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:pts[0][0],y:pts[0][1]}]});
    for(const q of pts.slice(1)){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:q[0],y:q[1]}]});await sleep(12);}
    await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});}
   else{await p.mouse.move(...pts[0]);await p.mouse.down();for(const q of pts.slice(1))await p.mouse.move(...q,{steps:3});await p.mouse.up();}await sleep(130);};
  const draw=async ch=>{const info=await p.evaluate(ch=>{const el=document.querySelector('#hw');const r=el.getBoundingClientRect();return {x:r.left,y:r.top,w:r.width,med:HZDATA[ch].medians};},ch);
   const sz=info.w,pad=sz*.08,sc=(sz-2*pad)/1024;
   for(const m of info.med){const pts=[];for(let i=0;i<m.length;i++){const a=m[i],bq=m[i+1];pts.push([info.x+pad+a[0]*sc,info.y+pad+(900-a[1])*sc]);if(bq)for(let t=1;t<4;t++)pts.push([info.x+pad+(a[0]+(bq[0]-a[0])*t/4)*sc,info.y+pad+(900-(a[1]+(bq[1]-a[1])*t/4))*sc]);}await strokeLine(pts);}};
  const wrongStroke=async()=>{const r=await p.evaluate(()=>{const b=document.querySelector('#hw').getBoundingClientRect();return [b.left,b.top,b.width];});
   await strokeLine([[r[0]+r[2]*.92,r[1]+r[2]*.08],[r[0]+r[2]*.6,r[1]+r[2]*.4],[r[0]+r[2]*.3,r[1]+r[2]*.7],[r[0]+r[2]*.08,r[1]+r[2]*.92]]);await sleep(200);};
  const typePy=async(txt,tone)=>{for(const ch of txt){const k=await p.$(`.pk[data-k="${ch}"]`);await tap(k);}await tap(await p.$(`.pt[data-t="${tone}"]`));};
  const done=async n=>{await p.waitForFunction(n=>{const h=document.querySelector('.fin-box h2');return h&&h.textContent.includes('Задание '+n+' сделано');},n,{timeout:30000});await shot(n+'-fin');};
  const next=async n=>{await tapS('#nx');await sleep(500);};
  try{
   await p.goto(BASE+'?name='+encodeURIComponent('Проверка '+v));await sleep(500);await shot('0-list');
   // ---- 1. пиньинь на слух
   await tapS('.tile[data-n="1"]');await p.waitForSelector('.pyd',{timeout:8000});
   for(let k=0;k<10;k++){await sleep(450);await fits('1.'+(k+1));const id=log.lastVoice;const m=/^([a-z]+)([1-4])$/.exec(id||'');if(!m)throw new Error('не услышал запись учителя');
    if(k===0){await typePy('xx',1);const y0=await ys();await tapS('#mn');await sleep(250);if(!await p.$('#fb.hint'))log.bad.push('1: ошибка без подсказки');if(await ys()<y0-5)log.jump.push('1: после ошибки страница прыгнула');await shot('1-hint');
     for(let i=0;i<2;i++)await tap(await p.$('.pk[data-k="⌫"]'));}
    await typePy(m[1],+m[2]);if(k===0)await shot('1-typed');await tapS('#mn');await sleep(250);
    if(!await p.$('#fb.ok'))log.bad.push('1: верный ответ '+id+' не принят');await en();await tapS('#mn');}
   await done(1);await next();
   // ---- 2. введи пиньинь
   for(let k=0;k<15;k++){await p.waitForSelector('.tpz');await fits('2.'+(k+1));
    const z=await p.$$eval('.tpz .zh',e=>e.map(x=>x.textContent).join(''));const S=PHR[z]||[PY[z]];if(!S[0])throw new Error('2: не знаю '+z);
    for(let j=0;j<S.length;j++){if(j>0)await p.waitForSelector('.pyd');
     if(k===0&&j===0){const wt=S[0][1]===1?2:1;await typePy(S[0][0],wt);await tapS('#mn');await sleep(200);if(!await p.$('#fb.hint'))log.bad.push('2: неверный тон без подсказки');await shot('2-hint');await tap(await p.$(`.pt[data-t="${S[0][1]}"]`));}
     else if(z==='不是'&&j===0){await typePy('bu',4);await tapS('#mn');await sleep(200);const t=await p.$eval('#fb',e=>e.textContent);if(!/bú/.test(t))log.bad.push('2: нет подсказки про bú: '+t);await tap(await p.$('.pt[data-t="2"]'));}
     else await typePy(S[j][0],S[j][1]);
     await tapS('#mn');await sleep(200);if(!await p.$('#fb.ok'))log.bad.push('2: '+z+' слог '+(j+1)+' не принят');await en();await tapS('#mn');await sleep(250);}}
   await done(2);await next();
   // ---- 3. собери из ключей
   for(let k=0;k<9;k++){await p.waitForSelector('.bq b');await fits('3.'+(k+1));const ru=(await p.$eval('.bq b',e=>e.textContent)).replace(/^«|»$/g,'');const c=RU2Z[ru];const [r,pt]=BLD[c];
    if(k===0){const wr=await p.$(`.bk:not([data-v="${r}"])`);await tap(wr);await sleep(200);if(!await p.$('#fb.hint'))log.bad.push('3: неверный ключ без подсказки');await shot('3-hint');}
    await tapS(`.bk[data-v="${r}"]`);await sleep(250);await tapS(`.bk[data-v="${pt}"]`);await sleep(250);if(k===0)await shot('3-ok');
    if(!await p.$('.bres .zh'))log.bad.push('3: иероглиф '+c+' не собран');await en();await tapS('#mn');await sleep(250);}
   await done(3);await next();
   // ---- 4. первая черта
   await p.waitForSelector('.fsx');await fits('4 правило');await shot('4-rule');await tapS('#mn');
   for(let k=0;k<12;k++){await p.waitForSelector('.fk');await fits('4.'+(k+1));
    if(k===0){await tapS('.fk:not([data-s="0"])');await sleep(200);if(!await p.$('#fb.hint'))log.bad.push('4: неверная черта без подсказки');await shot('4-hint');
     const g=await p.$('#fx g[data-s="0"]');await tap(g);}else await tapS('.fk[data-s="0"]');
    await sleep(250);if(!await p.$('#fb.ok'))log.bad.push('4: первая черта не принята');if(k===0)await shot('4-ok');await en();await tapS('#mn');await sleep(200);}
   await done(4);await next();
   // ---- 5. пишем по памяти
   for(let i=0;i<8;i++){for(const stage of [0,1]){await p.waitForSelector('#hw svg',{timeout:8000});await sleep(250);await fits('5.1 '+i+' '+stage);
     const ru=await p.$eval('.wcap .ru',e=>e.textContent);const c=RU2Z[ru];if(i===0&&stage===0)await shot('5-obvedi');if(i===0&&stage===1){await shot('5-sam');await wrongStroke();}
     const y0=await ys();await draw(c);await sleep(stage?900:700);if(Math.abs(await ys()-y0)>5&&stage===0)log.jump.push('5: страница сдвинулась после иероглифа');}}
   for(let guard=0;guard<14;guard++){if(await p.$('.fin-box'))break;await p.waitForSelector('.bq b',{timeout:8000});await sleep(250);await fits('5.2');
    const ru=(await p.$eval('.bq b',e=>e.textContent)).replace(/^«|»$/g,'');const c=RU2Z[ru];
    if(guard===0){await shot('5-pamyat');await wrongStroke();await wrongStroke();await wrongStroke();}
    await draw(c);await sleep(1400);}
   await done(5);await next();
   // ---- 6. найди ошибку
   for(let k=0;k<8;k++){await p.waitForSelector('.fel');await fits('6.'+(k+1));const zh=await p.evaluate(()=>[...document.querySelectorAll('.fec .zh')].map(e=>e.textContent).join('')+document.querySelector('.fep').textContent);
    const e=ERR[zh];if(!e)throw new Error('6: не знаю '+zh);
    if(k===0){const wr=e[0]==='c'?`.feg[data-g="0"]`:`.fec[data-c="0"]`;await tapS(wr);await sleep(200);if(!await p.$('#fb.hint'))log.bad.push('6: неверное нажатие без подсказки');await shot('6-hint');}
    await tapS(e[0]==='c'?`.fec[data-c="${e[1]}"]`:`.feg[data-g="${e[1]}"]`);await sleep(250);if(!await p.$('#fb.ok'))log.bad.push('6: ошибка в '+zh+' не принята');if(k===0)await shot('6-ok');await en();await tapS('#mn');}
   await done(6);await next();
   // ---- 7. запись диалога (фальшивый микрофон)
   for(let k=0;k<7;k++){await p.waitForSelector('#mic');await fits('7.'+(k+1));if(k===0)await shot('7-start');await tapS('#mic');await sleep(1300);await tapS('#mic');
    await p.waitForSelector('audio.aud',{timeout:6000,state:'attached'});if(k===0)await shot('7-rec');await en();await tapS('#mn');await sleep(500);}
   await done(7);if(log.aud.length<7)log.bad.push('7: отправлено записей '+log.aud.length);await next();
   // ---- 8. диалог иероглифами
   for(let guard=0;guard<30;guard++){if(await p.$('.fin-box'))break;await p.waitForSelector('#hw svg',{timeout:8000});await sleep(250);await fits('8');
    await p.waitForFunction(()=>{const W=S.w8;if(!W)return true;const L=WRITE8[W.l];const todo=L.ch.map((c,i)=>L.w[i]?i:-1).filter(i=>i>=0);return W.j<todo.length&&document.querySelector('.w8c');},null,{timeout:8000});if(await p.$('.fin-box'))break;await sleep(200);
    const c=await p.evaluate(()=>{const W=S.w8,L=WRITE8[W.l];const todo=L.ch.map((c,i)=>L.w[i]?i:-1).filter(i=>i>=0);return L.ch[todo[W.j]];});
    if(guard===0)await shot('8-start');if(guard===3){await tapS('#hn');await sleep(300);await shot('8-hint');}
    await draw(c);await sleep(900);}
   await done(8);await next();
   // ---- 9. игра
   await p.waitForSelector('.lvdemo');await shot('9-rule');await tapS('#mn');
   for(let r=0;r<12;r++){await p.waitForSelector('.lvq b');await sleep(300);if(r===0){await fits('9 игра');await shot('9-game');}
    const q=await p.$eval('.lvq b',e=>e.textContent.trim());
    const c=q.startsWith('«')?RU2Z[q.replace(/^«|»$/g,'')]:null;const tgtPy=c?null:q;
    const want=c||await p.evaluate(py=>{const H=HZ.find(h=>toned(h[1],h[2])===py);return H&&H[0];},tgtPy);
    // эти слоги бывают у двух иероглифов (tā: 他/她) — тогда подходят оба? нет: игра спрашивает конкретный, берём из ответа
    if(r===0){const wrong=await p.$(`.lvw .lv-card:not([data-z="${want}"])`);// любая видимая
     for(let t=0;t<40;t++){const ok=await p.evaluate(()=>{const W=document.querySelector('.lvw').getBoundingClientRect();return [...document.querySelectorAll('.lvw .lv-card')].some(c=>{const r=c.getBoundingClientRect();return r.left>W.left+20&&r.right<W.right-20;});});if(ok)break;await sleep(100);}
     const vis=await p.evaluateHandle(w=>{const W=document.querySelector('.lvw').getBoundingClientRect();return [...document.querySelectorAll('.lvw .lv-card')].find(c=>{const r=c.getBoundingClientRect();return c.dataset.z!==w&&r.left>W.left+20&&r.right<W.right-20;});},want);
     {const bb=await vis.asElement().evaluate(c=>{const r=c.getBoundingClientRect();return [r.left+r.width/2,r.top+r.height/2];});if(mobile)await p.touchscreen.tap(bb[0],bb[1]);else await p.mouse.click(bb[0],bb[1]);}await sleep(250);if(!await p.$('#fb.hint'))log.bad.push('9: промах без подсказки');await shot('9-miss');}
    let hit=false;
    for(let t=0;t<220&&!hit;t++){const bb=await p.evaluate(w=>{const W=document.querySelector('.lvw').getBoundingClientRect();const c=[...document.querySelectorAll('.lvw .lv-card')].find(c=>{const r=c.getBoundingClientRect();return c.dataset.z===w&&r.left>W.left+30&&r.right<W.right-30;});if(!c)return null;const r=c.getBoundingClientRect();return [r.left+r.width/2,r.top+r.height/2];},want);
     if(bb){const tgt=tgtPy&&['tā'].includes(tgtPy);if(mobile)await p.touchscreen.tap(bb[0],bb[1]);else await p.mouse.click(bb[0],bb[1]);await sleep(150);hit=!!await p.$('.lv-card.lv-ok');if(!hit&&tgt){/* tā: 他 и 她 — пробуем второй */}}
     else await sleep(80);}
    if(!hit){// tā может означать и 他, и 她: пробуем второй
     const alt=want==='他'?'她':want==='她'?'他':null;if(!alt)throw new Error('9: не поймал '+want+' ('+q+')');log.bad.push('9: «'+q+'» — два иероглифа с одним пиньинем');throw new Error('9: двусмысленный раунд');}
    await sleep(1300);}
   await done(9);await tapS('#nx');await sleep(500);await shot('10-itogi');
   const t=await p.textContent('body');if(!/Все 9 заданий сделаны/.test(t))log.bad.push('итоги: не все задания отмечены');
   // повторный вход: список, все ✓
   await tapS('#go');await sleep(300);const dn=await p.$$eval('.tile.done',e=>e.length);if(dn!==9)log.bad.push('список: готово '+dn+' из 9');
  }catch(e){log.bad.push('СТОП: '+e.message.split('\n')[0]);await shot('stop');}
  const parts=new Set(log.saves.map(s=>s.part));for(let i=1;i<=9;i++)if(!parts.has('t'+i))log.bad.push('не отправлен результат t'+i);
  const au=await p.evaluate(()=>window.__au||[]).catch(()=>[]);const bada=au.filter(a=>a.err);if(bada.length)log.bad.push('ошибки <audio>: '+bada.length);
  console.log(`\n== ${v} ${w}×${h}: звуков синтезатора ${log.ok.size}, записей учителя ${log.voice.size}, сохранений ${log.saves.length}, записей голоса ${log.aud.length}`);
  [...log.bad,...log.err,...log.jump].forEach(x=>console.log('  ✗ '+x));if(!log.bad.length&&!log.err.length&&!log.jump.length)console.log('  ✓ чисто');
  allBad+=log.bad.length+log.err.length+log.jump.length;await ctx.close();}
 await b.close();process.exit(allBad?1:0);}
main();
