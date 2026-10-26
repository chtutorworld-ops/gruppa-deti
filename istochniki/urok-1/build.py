import base64
s=open('src.html',encoding='utf-8').read()
s=s.replace('__FONT_GB__',base64.b64encode(open('fonts/lxgw-gb.woff','rb').read()).decode())
open('index.html','w',encoding='utf-8').write(s)
