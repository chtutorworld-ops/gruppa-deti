// быстрые снимки первого экрана каждого задания ДЗ 11 (телефон и компьютер)
const {chromium}=require('playwright');const fs=require('fs');
const OUT=process.env.OUT||'/tmp/claude-0/dz11shots';fs.mkdirSync(OUT,{recursive:true});
const BASE=process.argv[2]||'http://localhost:8765/dz-11/';
(async()=>{const b=await chromium.launch({args:['--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream']});
 for(const [v,w,h,m] of [['phone',390,844,true],['desk',1280,800,false]]){
  const ctx=await b.newContext({viewport:{width:w,height:h},isMobile:m,hasTouch:m});
  await ctx.route(/\/audio\/|workers\.dev/,r=>r.fulfill({status:404,body:''}));
  const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
  for(let t=0;t<=9;t++){await p.goto(BASE+'?name=%D1%83%D1%87%D0%B8%D1%82%D0%B5%D0%BB%D1%8C');await p.waitForTimeout(300);if(t)await p.click(`.tile[data-n="${t}"]`);await p.waitForTimeout(t===1?1500:800);
   await p.screenshot({path:`${OUT}/${v}-${t}.png`,fullPage:false});}
  console.log(v,errs.join(' | ')||'без ошибок');await ctx.close();}
 await b.close();})();
