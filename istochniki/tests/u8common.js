// общая обвязка для проверок урока 8: звук сверяется со списком tools/audio-list.txt и картой слогов
const fs=require('fs');
const SAIT=process.env.SAIT||'/home/claude/gruppa-deti-sait';
const LIST=new Set();
const fname=t=>[...t].map(c=>c.codePointAt(0).toString(16)).join('-')+'.mp3';
for(const l of fs.readFileSync(SAIT+'/tools/audio-list.txt','utf8').split('\n')){const t=l.trim();if(t&&!t.startsWith('#'))LIST.add(fname(t));}
const WAV=fs.readFileSync(__dirname+'/tone.wav');
const unf=f=>{try{return f.replace('.mp3','').split('-').map(h=>String.fromCodePoint(parseInt(h,16))).join('');}catch(e){return f;}};
async function wire(ctx,log){
 await ctx.route(/\/audio\//,r=>{const u=r.request().url();const f=decodeURIComponent(u.split('/audio/').pop().split('?')[0]);
  if(f.includes('voice/')||f.endsWith('.wav')){log.bad.push('старая запись .wav: '+f);return r.fulfill({status:404,body:''});}
  if(LIST.has(f)){log.ok.add(unf(f));return r.fulfill({status:200,contentType:'audio/wav',body:WAV});}
  log.bad.push('звука нет в списке: '+unf(f)+' ('+f+')');return r.fulfill({status:404,body:''});});
 await ctx.route(/workers\.dev\/api/,r=>{const u=r.request().url();if(/\/save/.test(u)){try{(log.saves=log.saves||[]).push(JSON.parse(r.request().postData()));}catch(e){}}log.api.push(u.replace(/^https?:\/\/[^/]+/,'')+' '+(r.request().postData()||'').slice(0,160));
  if(/list/.test(u))return r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(global.LISTDATA||{items:[]})});
  return r.fulfill({status:200,contentType:'application/json',body:'{"ok":true}'});});
 await ctx.route(/kitai-ii|github\.io/,r=>r.fulfill({status:404,body:''}));}
function errs(p,log){p.on('pageerror',e=>log.err.push('pageerror: '+e.message));
 p.on('console',m=>{if(m.type()==='error'&&!/Failed to load resource|net::|NotSupportedError|NotAllowedError|play\(\)/.test(m.text()))log.err.push('console: '+m.text());});}
// следим за <audio>: каждое play() должно дать duration>0 и без error
const AUDIO_SPY=`(()=>{window.__au=[];const P=HTMLMediaElement.prototype.play;HTMLMediaElement.prototype.play=function(){const a=this,rec={src:a.src,dur:a.readyState>=1?a.duration:0,err:null};__au.push(rec);a.addEventListener('loadedmetadata',()=>rec.dur=a.duration);a.addEventListener('error',()=>rec.err=String(a.error&&a.error.code));return P.call(this);};})();`;
module.exports={wire,errs,LIST,fname,AUDIO_SPY};
