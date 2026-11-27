// проверяющий кабинета учителя ДЗ 11: без автозагрузки, «↻ Обновить», клик по имени открывает карточку, записи, отчёт
const {chromium}=require('playwright');
const BASE=process.argv[2]||'http://localhost:8765/dz-11/uchitel/';
const subs=[{sid:'s1',name:'Семён',parts:{t1:{score:8,of:10,miss:['cā'],ans:[['cā','zā',false],['sì','sì',true]]},t2:{score:13,of:15,miss:['不是'],ans:[['不是','bù shì',false]]},t3:{score:8,of:9,miss:['爸']},t4:{score:10,of:12,miss:['你']},
 t5:{score:6,of:8,miss:['吗'],res:[['我',0,0],['吗',3,99]]},t6:{score:7,of:8,miss:['她'],ans:[['她是我爸爸',false]]},t7:{rec:7,sec:40},t8:{score:20,of:24,m:[['她',2],['是',0]],h:['吗'],miss:['吗']},t9:{score:10,of:12,errs:3,miss:['他']}}},
 {sid:'s2',name:'Афина',parts:{t1:{score:5,of:10,miss:['zhī'],ans:[]},t5p:{res:[['我',1,-1]]}}},{sid:'t',name:'учитель',parts:{}}];
(async()=>{const b=await chromium.launch();let bad=0;const no=m=>{bad++;console.log('  ✗',m);};
 for(const [v,w,h] of [['desk',1280,800],['phone',390,844]]){
  const ctx=await b.newContext({viewport:{width:w,height:h}});let lists=0;
  await ctx.route(/workers\.dev\/api\/dz\/list/,r=>{lists++;r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({subs,aud:{s1:{l1:1,l2:1,l3:1,l4:1,l5:1,l6:1,l7:1}}})});});
  await ctx.route(/workers\.dev\/api\/dz\/play/,r=>r.fulfill({status:200,body:''}));
  const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.goto(BASE);await p.waitForTimeout(800);
  if(lists)no(v+': данные загрузились без кнопки');
  await p.click('#ref');await p.waitForTimeout(600);
  if(lists!==1)no(v+': после «Обновить» запросов '+lists);
  const rows=await p.$$eval('#tb tr',t=>t.length);if(rows!==3)no(v+': строк таблицы '+rows+' (учитель должен скрываться)');
  await p.click('td.nm[data-open="s1"]');await p.waitForTimeout(800);
  if(!await p.$eval('.dc[data-sid="s1"]',d=>d.classList.contains('op')))no(v+': клик по имени не открыл карточку');
  await p.click('.dc[data-sid="s2"]>button');await p.waitForTimeout(300);
  if(!await p.$eval('.dc[data-sid="s2"]',d=>d.classList.contains('op')))no(v+': кнопка имени не открыла карточку');
  const rep=await p.$eval('.dc[data-sid="s2"] .rep',e=>e.textContent);if(!/Нужно доделать: № 2/.test(rep))no(v+': отчёт без «Нужно доделать»');
  await p.$eval('.dc[data-sid="s1"] details',d=>d.open=true);
  const au=await p.$$eval('.dc[data-sid="s1"] audio',a=>a.length);if(au!==7)no(v+': записей диалога '+au);
  const txt=await p.textContent('#zvuk');for(const z of ['小朋友，你叫什么名字？','她不是我妈妈','你们好','他们是我爸爸妈妈'])if(!txt.includes(z))no(v+': нет текста '+z);
  const ov=await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth);if(ov>2)no(v+': горизонтальная прокрутка '+ov);
  await p.screenshot({path:`/tmp/claude-0/shots/u11-${v}.png`,fullPage:true});
  if(errs.length)no(v+': ошибки '+errs.join(' | '));await ctx.close();}
 console.log(bad?'✗ проблемы':'✓ кабинет чисто');await b.close();})();
