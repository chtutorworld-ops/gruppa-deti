// Кабинет учителя урока 8: «↻ Обновить» → таблица, ответы диктантов, клик по имени открывает карточку.
// Данные — то, что реально отправил ребёнок в прогоне u8.js (saves-desk.json), плюс ребёнок, который бросил на середине.
// node u8uchitel.js [base-url]
const {chromium}=require('playwright');const {wire,errs}=require('./u8common');const fs=require('fs');
const BASE=process.argv[2]||'http://localhost:8765/urok-8/uchitel/';
const OUT=process.env.OUT||'/tmp/claude-0/t8z';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const saves=JSON.parse(fs.readFileSync(OUT+'/saves-desk.json','utf8'));
const parts={};for(const s of saves)parts[s.part]=s.data;
global.LISTDATA={subs:[{sid:'a1',name:'Афина Т.',parts},
 {sid:'b2',name:'Семён К.',parts:{t1:parts.t1,d2:{a:[1,4,3,2,null,null,null,null,null,null]},d3:{a:[['ba',1],['du',4],null]},tab:{cells:{0:{mist:[['我',1]],terr:[]},2:{mist:[['他',0]],terr:['ta']}}}}},
 {sid:'t',name:'учитель',parts}],aud:{a1:{rec:{sec:12,type:'audio/webm'}}}};
(async()=>{const b=await chromium.launch();const log={err:[],bad:[],ok:new Set(),api:[]};
 for(const [nm,w,h] of [['desk',1280,800],['phone',390,844]]){
 log.api=[];const ctx=await b.newContext({viewport:{width:w,height:h},deviceScaleFactor:1});await wire(ctx,log);const p=await ctx.newPage();errs(p,log);
 await p.goto(BASE);await sleep(600);await p.screenshot({path:`${OUT}/uch-${nm}-0.png`,fullPage:true});
 if(log.api.some(a=>/list/.test(a)))throw new Error('кабинет грузит данные сам, без кнопки');
 await p.click('#ref');await sleep(800);
 const rows=await p.$$eval('#tb tr',r=>r.length);if(rows!==3)throw new Error('строк в таблице '+rows+' (учитель должен быть скрыт)');
 await p.screenshot({path:`${OUT}/uch-${nm}-1.png`,fullPage:true});
 await p.click('td.nm[data-open="b2"]');await sleep(800);
 const op=await p.$eval('.dc[data-sid="b2"]',e=>e.classList.contains('op'));if(!op)throw new Error('клик по имени не открыл карточку');
 const card=await p.$eval('.dc[data-sid="b2"] .bd',e=>e.innerText);
 if(!/13%/.test(card)||!/не сделал/.test(card)||!/Нужно доделать: № 2, № 3/.test(card))throw new Error('карточка ребёнка неполная: '+card.slice(0,300));
 await p.click('td.nm[data-open="a1"]');await sleep(800);
 const au=await p.$('.dc[data-sid="a1"] audio');if(!au)throw new Error('нет записи голоса в карточке');
 const src=await au.getAttribute('src');if(!/play\?hw=u8&sid=a1&item=rec/.test(src))throw new Error('ссылка на запись '+src);
 await p.screenshot({path:`${OUT}/uch-${nm}-2.png`,fullPage:true});
 const o=await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth);if(o>2)console.log(nm,'горизонтальная прокрутка страницы',o);
 console.log(nm,'кабинет ок');await ctx.close();}
 console.log('ОШИБКИ',log.err);await b.close();})().catch(e=>{console.log('!!! FAIL',e.message);process.exit(1);});
