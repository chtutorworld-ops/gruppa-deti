// Кабинет «Повторения 2»: данные только по «↻ Обновить», таблица 8 заданий, клик по имени открывает карточку с % и записями.
const {chromium}=require('playwright');const fs=require('fs');const {wire,errs}=require('./u8common');
const BASE=process.argv[2]||'http://localhost:8765/povtor-vova-2/uchitel/';const OUT=process.env.OUT||'/tmp/claude-0/tpv2';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const saves=JSON.parse(fs.readFileSync(OUT+'/desk-saves.json','utf8'));
const sub={sid:'s1',name:'Вова к',parts:{}};for(const s of saves)sub.parts[s.part]={...s.data,ts:Date.now()};
const half={sid:'s2',name:'Радмир',parts:{t1:sub.parts.t1,t3:sub.parts.t3}};
global.LISTDATA={subs:[sub,half],aud:{s1:{r1:{t:1},r2:{t:1},r3:{t:1},r4:{t:1}}}};
(async()=>{for(const [nm,w,h,m] of [['phone',390,844,true],['desk',1280,720,false]]){
 const br=await chromium.launch();const ctx=await br.newContext({viewport:{width:w,height:h},isMobile:m,hasTouch:m});
 const log={err:[],bad:[],ok:new Set(),api:[]};await wire(ctx,log);const p=await ctx.newPage();errs(p,log);
 await p.goto(BASE);await sleep(800);if(log.api.some(a=>/list/.test(a)))throw new Error('кабинет грузит данные без кнопки');
 await p.click('#ref');await sleep(800);const rows=await p.$$eval('#tb tr',a=>a.length);if(rows<3)throw new Error('в таблице строк '+rows);
 const txt=await p.$eval('#tb',e=>e.innerText);if(!/100%/.test(txt)||!/25%/.test(txt))throw new Error('проценты в таблице: '+txt.slice(0,300));
 await p.screenshot({path:`${OUT}/u-${nm}-table.png`,fullPage:true});
 await p.click('#tb [data-open="s2"]');await sleep(600);
 if(!await p.$('.dc.op[data-sid="s2"]'))throw new Error('клик по имени не открыл карточку');const dos=await p.$eval('.dc[data-sid="s2"]',e=>e.innerText);if(!/25%/.test(dos)||!/не сделал/i.test(dos))throw new Error('карточка Радмира: '+dos.slice(0,300));
 await p.click('#tb [data-open="s1"]');await sleep(600);
 const dos1=await p.$eval('.dc[data-sid="s1"]',e=>e.innerText);const au=await p.$$eval('.dc[data-sid="s1"] audio',a=>a.map(x=>x.getAttribute('src')));
 if(!/100%/.test(dos1)||au.length!==4||!au.every(s=>/play\?hw=pv2&sid=s1&item=r\d/.test(s)))throw new Error('карточка Вовы: записи '+JSON.stringify(au)+' '+dos1.slice(0,200));
 await p.screenshot({path:`${OUT}/u-${nm}-card.png`,fullPage:true});
 const o=await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth);if(o>2)throw new Error(nm+' overflow '+o);
 await br.close();if(log.err.length)throw new Error(nm+' ошибки: '+log.err);console.log(nm,'✓ кабинет');}})().catch(e=>{console.error('ПРОВАЛ:',e.message);process.exit(1);});
