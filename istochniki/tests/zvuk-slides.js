// Всё, что звучит в презентации (кнопки data-say / data-dict / «Слушай»), по слайдам — для кабинета учителя.
// node tests/zvuk-slides.js <путь к index.html>  → JSON в stdout
const {chromium}=require('playwright');const path=require('path');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:720}});
await p.goto('file://'+path.resolve(process.argv[2])+'#s1');await p.waitForTimeout(1000);
const out=await p.evaluate(()=>[...document.querySelectorAll('section.slide')].map((s,i)=>{const t=(s.getAttribute('aria-label')||'').trim();
 const items=[...s.querySelectorAll('[data-say],[data-dict]')].map(b=>({say:b.dataset.say||'',dict:b.dataset.dict||'',v:b.dataset.v||'',txt:b.textContent.trim().slice(0,60),
  py:(((b.closest('.c11mb,.nk,p')||b).querySelector('.pyn'))||{}).textContent||'',opts:[...(b.closest('.c10t')?.querySelectorAll('.c10o')||[])].map(o=>o.textContent.trim())}));
 return {i:i+1,t,items};}).filter(x=>x.items.length));
console.log(JSON.stringify(out));await b.close();})();
