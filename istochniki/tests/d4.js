const {chromium}=require('playwright');const fs=require('fs');(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2});const p=await ctx.newPage();const errs=[],posts=[];p.on('pageerror',e=>errs.push(e.message));
await p.route('**/*',r=>{const u=r.request().url();if(u.startsWith('file:'))return r.continue();if(u.includes('/api/')){posts.push((r.request().postData()||'').slice(60,200));return r.fulfill({status:200,body:'{"ok":true}',headers:{'Access-Control-Allow-Origin':'*'}});}
 if(u.includes('voice/index.json'))return r.fulfill({status:200,contentType:'application/json',body:fs.readFileSync(__dirname+'/vk.json','utf8')});return r.abort();});
const U='file:///tmp/claude-0/site/dz-2/index.html';
await p.goto(U);await p.fill('#nm','Тест Ученик');await p.click('#go');await p.waitForTimeout(400);
for(const t of ['parts','china']){await p.goto(U+'#'+t);await p.waitForTimeout(3600);const ps=[];
 for(let k=0;k<30;k++){const fnb=await p.$('#fn');if(fnb){if(t==='china'&&k===2)await p.screenshot({path:__dirname+'/u3/e-china2.png',fullPage:true});await fnb.click();await p.waitForTimeout(300);continue;}
  const os=await p.$$('[data-o],[data-a],[data-n]');if(!os.length)break;let j=0;for(const o of os){await o.click().catch(()=>{});await p.waitForTimeout(80);if(await o.evaluate(e=>e.classList.contains('ok'))){ps.push(j);break;}j++;}
  if(t==='parts'&&k===8)await p.screenshot({path:__dirname+'/u3/e-parts2.png',fullPage:true});await p.waitForTimeout(1500);}
 console.log(t,'pos',ps.join(''));await p.screenshot({path:__dirname+'/u3/e-'+t+'-end.png',fullPage:true});}
await p.goto(U+'#game');await p.waitForTimeout(400);await p.click('#st');await p.waitForTimeout(4500);await p.screenshot({path:__dirname+'/u3/e-game1.png'});
const as=await p.$$('.ast');if(as.length){await as[1].evaluate(e=>e.click());await p.waitForTimeout(120);await p.screenshot({path:__dirname+'/u3/e-game2.png'});}
console.log('errors',errs,'\nposts',posts.join('\n'));await b.close();})();
