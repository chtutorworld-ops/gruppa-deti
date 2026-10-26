const {chromium}=require('playwright');const fs=require('fs');(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.route('**/*',r=>{const u=r.request().url();if(u.startsWith('file:'))return r.continue();if(u.includes('qrcode'))return r.fulfill({path:'/tmp/claude-0/qrcode.min.js'});
 if(u.includes('/api/'))return r.fulfill({status:200,body:'{"ok":true}',headers:{'Access-Control-Allow-Origin':'*'}});if(u.includes('voice/index.json'))return r.fulfill({status:200,contentType:'application/json',body:fs.readFileSync(__dirname+'/vk.json','utf8')});return r.abort();});
const K=fs.readFileSync(__dirname+'/teacher_key.txt','utf8').trim();const U='file:///tmp/claude-0/site/urok-3/zadaniya/index.html?key='+K;
await p.goto(U);await p.waitForTimeout(500);const nm=await p.$('#nm');if(nm){await nm.fill('учитель');await p.click('#go');await p.waitForTimeout(400);}
for(const h of ['3','5','2']){await p.goto(U+'#'+h);await p.waitForTimeout(3500);const st=await p.$('#st');if(st){await st.click();await p.waitForTimeout(1900);}
 const ps=[];for(let k=0;k<12;k++){await p.waitForTimeout(400);const os=await p.$$('[data-o]');if(!os.length){await p.waitForTimeout(1700);continue;}let j=0;for(const o of os){await o.click().catch(()=>{});await p.waitForTimeout(40);if(await o.evaluate(e=>e.classList.contains('ok')||e.classList.contains('hit')))break;j++;}ps.push(j);await p.waitForTimeout(1100);}
 console.log(h,ps.join(''));}
console.log(errs);await b.close();})();
