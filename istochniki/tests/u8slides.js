// «Проверяющий» для презентации урока 8: все слайды открыты целиком, ничего не вылезает, все кнопки звука играют.
// node u8slides.js [base-url]
const {chromium}=require('playwright');const {wire,errs,AUDIO_SPY}=require('./u8common');
const BASE=process.argv[2]||'http://localhost:8765/urok-8/';
const OUT=process.env.OUT||'/tmp/claude-0/t8';require('fs').mkdirSync(OUT,{recursive:true});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:1280,height:720},deviceScaleFactor:1});
 const log={err:[],bad:[],ok:new Set(),api:[]};await wire(ctx,log);await ctx.addInitScript(AUDIO_SPY);
 const p=await ctx.newPage();errs(p,log);
 await p.goto(BASE+'#s1');await sleep(1200);
 const n=await p.evaluate(()=>document.querySelectorAll('#stage .slide').length);console.log('slides',n);
 const probs=[];let clicks=0;
 for(let i=0;i<n;i++){
  if(i)await p.click('#bNext');await sleep(300);
  // учитель щёлкает по самому слайду, пока всё не откроется
  for(let k=0;k<15;k++){const left=await p.evaluate(()=>{const s=document.querySelector('.slide.live');return [...s.querySelectorAll('.rv')].filter(e=>!e.classList.contains('on')).length;});if(!left)break;
   await p.evaluate(()=>{const s=document.querySelector('.slide.live');s.dispatchEvent(new MouseEvent('click',{bubbles:true}));});await sleep(120);}
  await sleep(400);
  const info=await p.evaluate(()=>{const s=document.querySelector('.slide.live');const r=s.getBoundingClientRect();const out=[];
   s.querySelectorAll('*').forEach(e=>{const q=e.getBoundingClientRect();if(!q.width||!q.height)return;const cs=getComputedStyle(e);if(cs.visibility==='hidden'||cs.display==='none'||+cs.opacity===0)return;
    if(q.right>r.right+3||q.bottom>r.bottom+3||q.left<r.left-3||q.top<r.top-3)out.push((e.className&&e.className.baseVal===undefined?e.className:e.tagName)+'@'+Math.round(q.bottom-r.top)+'/'+Math.round(q.right-r.left));});
   return {t:s.getAttribute('aria-label')||s.querySelector('h1,h2')?.textContent||'',out:out.slice(0,3),say:s.querySelectorAll('[data-say]').length};});
  await p.screenshot({path:`${OUT}/s${String(i+1).padStart(2,'0')}.png`});
  // все кнопки звука на слайде
  const btn=await p.$$('.slide.live [data-say]');
  for(const bt of btn){await bt.click({force:true}).catch(()=>{});clicks++;await sleep(90);}
  console.log(String(i+1).padStart(2),info.t.slice(0,60).replace(/\s+/g,' '),'звук:'+info.say,info.out.length?' ВЫЛЕЗАЕТ '+info.out.join(' | '):'');
  if(info.out.length)probs.push(i+1);}
 await sleep(800);
 const au=await p.evaluate(()=>__au);const badAu=au.filter(a=>a.err||!a.dur);
 console.log('нажато кнопок звука',clicks,'запусков audio',au.length,'без звука',badAu.length,badAu.slice(0,5));
 console.log('звуки ок',log.ok.size,[...log.ok].join(' '));
 console.log('ОШИБКИ',log.err);console.log('ПЛОХОЙ ЗВУК',[...new Set(log.bad)]);console.log('вылезает на слайдах',probs);
 await b.close();})();
