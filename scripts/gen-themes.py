#!/usr/bin/env python3
"""產生 src/themes.css 裡的各個主題色票。

用法：python3 scripts/gen-themes.py（需先 npm install，會讀 Tailwind 的內建色）
要調某個主題，改下面 THEMES 的參數再重跑；原版色票（:root）不會被改動。
"""
import math
def srgb2lin(c):
    c/=255; return c/12.92 if c<=0.04045 else ((c+0.055)/1.055)**2.4
def lin2srgb(c):
    c=max(0,min(1,c)); v= 12.92*c if c<=0.0031308 else 1.055*c**(1/2.4)-0.055
    return round(max(0,min(1,v))*255)
def hex2oklch(h):
    r,g,b=[srgb2lin(int(h[i:i+2],16)) for i in (1,3,5)]
    l=0.4122214708*r+0.5363325363*g+0.0514459929*b
    m=0.2119034982*r+0.6806995451*g+0.1073969566*b
    s=0.0883024619*r+0.2817188376*g+0.6299787005*b
    l,m,s=[x**(1/3) for x in (l,m,s)]
    L=0.2104542553*l+0.7936177850*m-0.0040720468*s
    a=1.9779984951*l-2.4285922050*m+0.4505937099*s
    bb=0.0259040371*l+0.7827717662*m-0.8086757660*s
    return L, math.hypot(a,bb), math.degrees(math.atan2(bb,a))%360
def oklch2hex(L,C,H):
    a=C*math.cos(math.radians(H)); b=C*math.sin(math.radians(H))
    # gamut clip by reducing chroma
    for _ in range(40):
        l_=L+0.3963377774*a+0.2158037573*b; m_=L-0.1055613458*a-0.0638541728*b; s_=L-0.0894841775*a-1.2914855480*b
        l,m,s=l_**3,m_**3,s_**3
        r=4.0767416621*l-3.3077115913*m+0.2309699292*s
        g=-1.2684380046*l+2.6097574011*m-0.3413193965*s
        bl=-0.0041960863*l-0.7034186147*m+1.7076147010*s
        if all(-0.001<=x<=1.001 for x in (r,g,bl)): break
        a*=0.93; b*=0.93
    return '#%02X%02X%02X'%(lin2srgb(r),lin2srgb(g),lin2srgb(bl))

import re, subprocess, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
CSS = ROOT / 'src' / 'themes.css'
# 原版色票（:root 區塊）是唯一的來源：變數名 → 原版色碼
_root_block = CSS.read_text().split(':root {', 1)[1].split('}', 1)[0]
names = {h: n for n, h in re.findall(r'(--[a-z]+-[0-9a-z]+|--white): (#[0-9A-F]{6});', _root_block)}

THEMES = {
 'aizome': dict(label='藍染', neutral=(255,0.45,0.004), accent=(262,1.55,-0.06), ai=None, dark=False,
   fonts=dict(display='"Zen Kaku Gothic New", system-ui, sans-serif', sans=None),
   note='藍染：未漂白棉布的冷白底＋靛藍主色。標題改用黑體，像染坊的工作標籤，比原版更俐落。'),
 'sakura': dict(label='桜餅', neutral=(12,0.5,0.006), accent=(352,1.9,0.0), ai=(352,1.6), dark=False,
   fonts=dict(display='"M PLUS Rounded 1c", system-ui, sans-serif', sans='"M PLUS Rounded 1c", system-ui, sans-serif'),
   note='桜餅：粉白底＋梅紫主色，全站改圓體字。給初學者、輕鬆可愛。'),
 'yagaku': dict(label='夜学', neutral=(262,0.6,0.012), accent=(82,1.9,0.0), ai=(85,0.9), dark=True,
   fonts=dict(display=None, sans=None),
   note='夜学（深色）：深藍夜色＋山吹金主色，保留明朝體。晚上念書不刺眼。'),
}

def dark_L(L):
    if L>=0.80: return 0.17+(min(L,0.97)-0.80)*0.0+ (0.97-min(L,0.97))*0.85   # 0.95→0.19, 0.85→0.27
    return min(0.94, 0.93-(L-0.24)*0.72)                                     # ink 0.24→0.93, 0.50→0.74

def map_color(h,n,t):
    L,C,H=hex2oklch(h); f=n[2:].rsplit('-',1)[0]
    if f in ('paper','ink','white'):
        hue,k,add=t['neutral']; H=hue; C=C*k+add*(1 if C>0.003 or f!='white' else 0)
    elif f=='moss':
        hue,k,dL=t['accent']; H=hue; C=min(C*k,0.16); L=L+dL*(1 if L<0.8 else 0.2)
    elif f=='ai' and t.get('ai'):
        H=t['ai'][0]; C=C*t['ai'][1]
    if t['dark']:
        L=dark_L(L)
        if f not in ('paper','ink','white') and L<0.5: C=C*0.7   # 深色底上的彩色淡底不要太艷
    return oklch2hex(L,C,H)

TW={}
_used=set(re.findall(r'(?:from|via|to|bg|text|border|ring)-((?:slate|red|orange|amber|yellow|emerald|sky|blue|indigo|rose)-[0-9]+)', subprocess.run(['grep','-rhoE','[a-z]+-[a-z]+-[0-9]+',str(ROOT / 'src')],capture_output=True,text=True).stdout))
for m in re.finditer(r'--color-([a-z]+-[0-9]+): oklch\(([0-9.]+)% ([0-9.]+) ([0-9.]+)\)', open(ROOT / 'node_modules' / 'tailwindcss' / 'theme.css').read()):
    if m.group(1) in _used: TW[m.group(1)]=(float(m.group(2))/100,float(m.group(3)),float(m.group(4)))
def rgb(h): return ' '.join(str(int(h[i:i+2],16)) for i in (1,3,5))

out=['/* ────────────────────────────────────────────────────────────',
' 主題色票：元件只用這裡的變數，不直接寫色碼。',
' :root 是原版（和紙・抹茶），數值與改版前的色碼完全相同。',
' 其他主題掛在 html[data-theme="…"]，由 scripts/gen-themes.py 依原版色票換算：',
' 中性色換色相、主色換色相與彩度，深色主題再把明度反轉。',
' 變數名 = 色系-明度（例如 --moss-50 是明度 50% 的苔綠主色）。',
' ──────────────────────────────────────────────────────────── */','',':root {']
for h,n in sorted(names.items(), key=lambda x:x[1]):
    out.append('  %s: %s;'%(n,h))
out.append('}')
for key,t in THEMES.items():
    out+=['','/* %s */'%t['note'],'html[data-theme="%s"] {'%key]
    if t['dark']: out.append('  color-scheme: dark;')
    mapped={n:map_color(h,n,t) for h,n in names.items()}
    for n in sorted(mapped): out.append('  %s: %s;'%(n,mapped[n]))
    out.append('  --shadow-rgb: %s;'%('0 0 0' if t['dark'] else rgb(mapped['--ink-24'])))
    out.append('  --glow-rgb: %s;'%rgb(mapped['--moss-50']))
    if t['dark']:
        out.append('  /* Tailwind 內建色（提示、徽章用）：淺色淡底換成深色淡底，深色字換成淺色字 */')
        out.append('  --color-white: %s;'%mapped['--paper-92'])
        for name,(L,C,H) in TW.items():
            shade=int(name.rsplit('-',1)[1])
            if name in ('slate-900','yellow-300') or 400<=shade<=500: continue   # 遮罩、亮色強調本來就適合深底
            if shade<=200: v=oklch2hex(dark_L(L), C*0.6, H)
            elif shade==300: v=oklch2hex(0.40, C*0.8, H)
            else: v=oklch2hex(0.80, C*0.8, H)
            out.append('  --color-%s: %s;'%(name, v))
    out.append('}')
    if t['fonts']['display'] or t['fonts']['sans']:
        # 多一個 [lang] 讓權重高過 index.css 裡各語言的字型設定
        out.append('html[lang][data-theme="%s"] {'%key)
        if t['fonts']['display']: out.append('  --font-display: %s;'%t['fonts']['display'])
        if t['fonts']['sans']: out.append('  --font-sans: %s;'%t['fonts']['sans'])
        out.append('}')
    if t['dark']:
        out+=['html[data-theme="%s"] body { background-color: var(--paper-bg); }'%key]
CSS.write_text('\n'.join(out)+'\n')
