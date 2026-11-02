// Прогон «проверяющего» для povtor-vova: ученик 12 лет проходит все шаги подряд, ошибается нарочно.
// node pvova.js 390|1280  (сервер: python3 -m http.server 8765 в gruppa-deti-sait/site)
const {chromium}=require('playwright');const fs=require('fs');
const W=+(process.argv[2]||390),OUT='/tmp/claude-0/pvshots/';fs.mkdirSync(OUT,{recursive:true});
const STORE={subs:{},aud:{}};
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--autoplay-policy=no-user-gesture-required','--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream','--use-file-for-fake-audio-capture='+__dirname+'/tone.wav']});
 const ctx=await b.newContext({viewport:{width:W,height:W<600?844:900},deviceScaleFactor:1,hasTouch:false});await ctx.grantPermissions(['microphone'],{origin:'http://localhost:8765'});
 const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error'&&!/Failed to load|ERR_|404|net::/.test(m.text()))errs.push('console: '+m.text());});
 const vk=JSON.parse(fs.readFileSync(__dirname+'/vk.json','utf8'));'bpmfdtnlgkh'.split('').forEach(c=>vk[c+'0']=1);
 let sttN=0;
 await p.route('**/*',async r=>{const u=r.request().url();const H={'Access-Control-Allow-Origin':'*'};
  if(u.startsWith('http://localhost'))return r.continue();
  if(u.includes('fonts.googleapis')||u.includes('fonts.gstatic'))return r.abort();
  if(u.includes('/api/dz/save')){const d=JSON.parse(r.request().postData());const s=STORE.subs[d.sid]||(STORE.subs[d.sid]={sid:d.sid,name:d.name,parts:{}});s.parts[d.part]=Object.assign({},d.data,{ts:Date.now()});s.updated=Date.now();return r.fulfill({status:200,body:'{"ok":true}',headers:H});}
  if(u.includes('/api/dz/audio')){const q=new URL(u).searchParams;(STORE.aud[q.get('sid')]=STORE.aud[q.get('sid')]||{})[q.get('item')]={type:'audio/webm',size:(r.request().postDataBuffer()||[]).length,ts:Date.now()};return r.fulfill({status:200,body:'{"ok":true}',headers:H});}
  if(u.includes('/api/dz/list'))return r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({subs:Object.values(STORE.subs),aud:STORE.aud}),headers:H});
  if(u.includes('/api/dz/play'))return r.fulfill({status:200,contentType:'audio/wav',body:fs.readFileSync(__dirname+'/tone.wav'),headers:H});
  if(u.includes('/stt')){sttN++;return r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({text:sttN===1?'你好。':sttN===2?'我好。':'我叫弗拉基米尔。'}),headers:H});}
  if(u.includes('voice/index.json'))return r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(vk),headers:H});
  if(/\.(wav|mp3)/.test(u))return r.fulfill({status:200,contentType:'audio/wav',body:fs.readFileSync(__dirname+'/tone.wav'),headers:H});
  return r.abort();});
 const U='http://localhost:8765/povtor-vova/';await p.goto(U);await p.evaluate(()=>localStorage.clear());await p.goto(U);await p.waitForTimeout(2800);
 const wait=ms=>p.waitForTimeout(ms);
 const overflow=async()=>p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);
 const report=[];
 // lock check on the start screen
 await p.click('#nx');await wait(300);console.log('start, no name: still step 0?',await p.evaluate(()=>document.querySelector('.prog').innerText.includes('Шаг 0')));
 await p.click('[data-who="Владимир"]');await wait(300);await p.screenshot({path:OUT+W+'-00.png',fullPage:true});
 async function solveQuiz(sel){let guard=0;while(guard++<80){const st=await p.evaluate(s=>{const q=document.querySelector(s);if(!q)return 'none';if(q.querySelector('[id$="-again"]'))return 'done';return q.querySelectorAll('[data-k]').length?'ask':'wait';},sel);
   if(st==='done'||st==='none')return st;if(st==='wait'){await wait(300);continue;}
   const n=await p.evaluate(s=>document.querySelectorAll(s+' [data-k]').length,sel);
   for(let k=0;k<n;k++){const res=await p.evaluate(([s,k])=>{const b=document.querySelectorAll(s+' [data-k]')[k];if(!b||b.classList.contains('no'))return 'skip';b.click();return b.classList.contains('ok')?'ok':'no';},[sel,k]);if(res==='ok')break;}
   await wait(1800);}
  return 'timeout';}
 async function strokesOf(ch){return p.evaluate(ch=>{const host=document.querySelector('#mhw')||document.querySelector('[data-hw]');const svg=host.querySelector('svg');const g=[...svg.querySelectorAll('g')].find(x=>/scale/.test(x.getAttribute('transform')||''));
   const m=g.getScreenCTM();return HZDATA[ch].medians.map(md=>md.map(([x,y])=>{const pt=svg.createSVGPoint();pt.x=x;pt.y=y;const q=pt.matrixTransform(m);return [q.x,q.y];}));},ch);}
 async function drawChar(ch,wrongFirst){const S=await strokesOf(ch);
  if(wrongFirst){const s=S[S.length-1];await p.mouse.move(s[0][0],s[0][1]);await p.mouse.down();for(const pt of s)await p.mouse.move(pt[0],pt[1],{steps:2});await p.mouse.up();await wait(250);}
  for(const s of S){await p.mouse.move(s[0][0],s[0][1]);await p.mouse.down();for(const pt of s)await p.mouse.move(pt[0],pt[1],{steps:3});await p.mouse.up();await wait(220);}}
 const PY2C={'nǐ':'你','wǒ':'我','hǎo':'好','jiào':'叫'};
 let last=-1,same=0;
 for(let loop=0;loop<60;loop++){
  const step=await p.evaluate(()=>+document.querySelector('.prog').innerText.match(/Шаг (\d+)/)[1]);const title=await p.evaluate(()=>document.querySelector('.main h2')&&document.querySelector('.main h2').innerText);
  if(step===last){same++;if(same>2){console.log('STUCK at',step,title);break;}}else same=0;last=step;
  const has=s=>p.evaluate(s=>!!document.querySelector(s),s);
  // free checks on the page: wrong first, then right
  await p.evaluate(()=>document.querySelectorAll('.chk').forEach(c=>{const r=+c.dataset.c;const bs=[...c.querySelectorAll('.opt')];const w=bs.find(b=>+b.dataset.i!==r);w&&w.click();bs.find(b=>+b.dataset.i===r).click();}));
  // try to go on without doing the task: must be locked
  const locked=await p.evaluate(()=>{const n=document.querySelector('#nx');return n?n.classList.contains('lock'):null;});
  if(await has('.qbox [data-k], .qbox .qq')||await has('.qbox')){for(const s of ['#q1','#q2','#q3','#q4','#q5','#q6','#q7','#q8'])if(await has(s))report.push([step,s,await solveQuiz(s)]);}
  if(await has('#g1')||await has('#g2')){const g=await has('#g1')?'#g1':'#g2';await p.click(g+' .btn');let k=0;
   while(k++<40){await wait(700);if(await has(g+' [id$="-again"]'))break;const bs=await p.$$(g+' [data-i]');if(bs.length){const i=k%3===0?1:0;await p.evaluate(([g,i])=>{const all=[...document.querySelectorAll(g+' [data-i]')];if(i===0){const t=document.querySelector('#orb');}all[(Math.random()*all.length)|0].click();},[g,i]);await wait(1500);}}
   if(step===2||step===5)await p.screenshot({path:OUT+W+'-game-'+step+'.png'});report.push([step,'game',await has(g+' [id$="-again"]')]);}
  if(await has('#rw')){await p.click('#rw [data-rec]');await wait(2200);await p.click('#rw [data-rec]');await wait(1500);await p.click('#rw [data-wd="1"]');await wait(400);await p.click('#rw [data-rec]');await wait(2200);await p.click('#rw [data-rec]');await wait(1500);
   if(await p.evaluate(()=>document.querySelector('#nx').classList.contains('lock'))){report.push([step,'rec','melody not found → nomic']);await p.evaluate(()=>{const b=document.querySelector('[data-nomic]');b.style.display='inline-block';b.click();});}else report.push([step,'rec','ok']);
   await p.screenshot({path:OUT+W+'-rec.png',fullPage:true});}
  if(await has('#py .pyl')){const bad=['ni hao','wo hao xiao ming','hao4','wo jiao'];const good=['ni3 hao3','wǒ jiào xiǎo míng','hǎo','wo3 jiao4 fulajimier'];
   for(let i=0;i<4;i++){await p.fill('#pi'+i,'');await p.type('#pi'+i,bad[i]);}await p.click('#pchk');await wait(400);await p.screenshot({path:OUT+W+'-py-wrong.png',fullPage:true});
   report.push([step,'py-msgs',await p.evaluate(()=>[0,1,2,3].map(i=>document.querySelector('#pv'+i).innerText).join(' | '))]);
   for(let i=0;i<4;i++){await p.fill('#pi'+i,'');await p.type('#pi'+i,good[i]);}await p.click('#pchk');await wait(400);report.push([step,'py',await p.evaluate(()=>document.querySelector('#pfb').innerText)]);}
  if(await has('#tr')){for(let r=0;r<3;r++){let ok=false;for(let t=0;t<40;t++){await wait(300);const h=await p.evaluate(()=>document.querySelector('[data-wh]').innerText);if(/Обведи|по памяти/.test(h)){ok=true;break;}}
    const ch=await p.evaluate(()=>document.querySelector('.wch span.cur').innerText);await drawChar(ch,r===1);await wait(1300);}
   await wait(500);report.push([step,'trace',await p.evaluate(()=>document.querySelector('#trf').innerText)]);if(step===16)await p.screenshot({path:OUT+W+'-trace.png',fullPage:true});}
  if(await has('#mb')){for(let r=0;r<4;r++){await wait(600);const py=await p.evaluate(()=>document.querySelector('.qcard .py').innerText.trim());const ch=PY2C[py];if(r===0){await p.click('#mh1');}await drawChar(ch,r===2);await wait(1500);}
   await wait(500);report.push([step,'memo',await p.evaluate(()=>document.querySelector('#mb').innerText.slice(0,80))]);await p.screenshot({path:OUT+W+'-memo.png',fullPage:true});}
  if(await has('#ctl')){for(let t=0;t<30;t++){await wait(700);if(await has('#again'))break;const m=await p.$('#mic');if(m){const bb=await m.boundingBox();await p.mouse.move(bb.x+bb.width/2,bb.y+bb.height/2);await p.mouse.down();await wait(1300);await p.mouse.up();await wait(2500);}}
   report.push([step,'xm',await p.evaluate(()=>document.querySelector('#xc').innerText.replace(/\s+/g,' ').slice(0,200))]);await p.screenshot({path:OUT+W+'-xm.png',fullPage:true});}
  if(await overflow())report.push([step,'OVERFLOW']);
  if(W<600&&step%3===0)await p.screenshot({path:OUT+W+'-s'+String(step).padStart(2,'0')+'.png',fullPage:true});
  const nx=await p.$('#nx');if(!nx){report.push([step,'finish']);await p.screenshot({path:OUT+W+'-finish.png',fullPage:true});break;}
  const lockedAfter=await p.evaluate(()=>document.querySelector('#nx').classList.contains('lock'));
  report.push([step,title,'lockedBefore='+locked,'lockedAfter='+lockedAfter]);console.log('STEP',step,title,locked,lockedAfter,new Date().toISOString().slice(14,19));
  await p.click('#nx');await wait(700);}
 report.forEach(r=>console.log(r.join(' · ')));
 // teacher cabinet with the collected answers
 const t=await ctx.newPage();t.on('pageerror',e=>errs.push('cab: '+e.message));await t.route('**/*',r=>p.route?r.fallback():r.continue());
 await t.route('**/api/dz/**',r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({subs:Object.values(STORE.subs),aud:STORE.aud}),headers:{'Access-Control-Allow-Origin':'*'}}));
 await t.goto(U+'uchitel/');await t.waitForTimeout(1200);await t.evaluate(()=>document.querySelectorAll('details').forEach(d=>d.open=true));await t.screenshot({path:OUT+W+'-cabinet.png',fullPage:true});
 console.log('cabinet text:',(await t.evaluate(()=>document.body.innerText)).slice(0,1500));
 console.log('saved parts:',Object.values(STORE.subs).map(s=>Object.keys(s.parts).join(',')).join(' / '),'audio:',JSON.stringify(Object.values(STORE.aud).map(a=>Object.keys(a))));
 console.log('errors',errs);await b.close();})();
