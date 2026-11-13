// «Проверяющий» для кабинета учителя «Карточек» (kartochki/uchitel/): ничего не грузится без кнопки,
// по кнопке — таблица, % , зоны, клик по имени открывает карточку ребёнка, апелляция видна, отчёт копируется.
// node kc-uchitel.js [url]
const {chromium}=require('playwright');const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const URL=process.argv[2]||'http://localhost:8765/kartochki/uchitel/';
const D={subs:[{sid:'a1',name:'Радмир П',parts:{t1:{score:4,of:6,ap:1,res:[{c:'你',a:'ты',ok:1,idk:0,ap:0},{c:'我',a:'я',ok:1,idk:0,ap:0},{c:'好',a:'круто',ok:1,idk:0,ap:1},{c:'叫',a:'не знаю',ok:0,idk:1,ap:0},{c:'妈',a:'мама',ok:1,idk:0,ap:0},{c:'爸',a:'дядя',ok:0,idk:0,ap:0}]},
 t2:{score:4,of:6,res:[['你',0,0,0],['我',2,0,0],['好',0,0,0],['叫',0,3,0],['妈',0,0,0],['爸',1,0,1]]},itogi:{done:2,of:2}}},
 {sid:'b2',name:'Афина К',parts:{t1:{score:6,of:6,ap:0,res:[]}}},{sid:'t',name:'учитель',parts:{}}]};
(async()=>{const bad=[],err=[];const b=await chromium.launch();
 for(const [vn,w,h] of [['phone',390,844],['desk',1280,800]]){const ctx=await b.newContext({viewport:{width:w,height:h}});let calls=0;
  await ctx.route(/workers\.dev\/api/,r=>{calls++;r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(D)});});
  await ctx.route(/fonts\.g/,r=>r.fulfill({status:200,body:''}));
  const p=await ctx.newPage();p.on('pageerror',e=>err.push(e.message));await p.goto(URL);await sleep(800);
  if(calls)bad.push(vn+': загрузка без кнопки');await p.click('#ref');await sleep(800);
  const rows=await p.$$eval('#tb tr',t=>t.length);if(rows!==3)bad.push(vn+': строк '+rows+' (учитель должен быть скрыт)');
  const t=await p.textContent('#tb');if(!/100%/.test(t)||!/50%/.test(t))bad.push(vn+': нет процентов');
  await p.click('td.nm:has-text("Радмир")');await sleep(600);if(!(await p.$('.dc.op')))bad.push(vn+': клик по имени не открыл карточку');
  const card=await p.textContent('.dc.op');['апелляция','круто','смотрел(а) весь знак','подсказок: 3','Особое внимание','爸','Знает'].forEach(x=>{if(!card.includes(x))bad.push(vn+': в карточке нет «'+x+'»');});
  const rep=await p.textContent('.dc.op .rep');if(!/1\. Узнай иероглиф — ✅/.test(rep))bad.push(vn+': отчёт '+rep.slice(0,80));
  const o=await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth);if(o>2)bad.push(vn+': прокрутка вбок '+o);
  await p.screenshot({path:'/tmp/claude-0/tkc/uchitel-'+vn+'.png',fullPage:true});await ctx.close();}
 await b.close();console.log(JSON.stringify({bad,err}));process.exit(bad.length||err.length?1:0);})();
