"""Create reviewed LaTeX presentation fields while retaining the original text.

Run after editing the bank. Math fields are compiled at authoring time, not inferred
in the visitor's browser. Adjust MANUAL for expressions requiring special notation.
"""
import json,re,pathlib,subprocess
ROOT=pathlib.Path(__file__).resolve().parents[1]
raw=subprocess.check_output(['node','-e',"const fs=require('fs'),vm=require('vm');const c={};vm.createContext(c);vm.runInContext(['bank.js','extra.js'].map(f=>fs.readFileSync('dist/'+f,'utf8')).join('\\n')+';this.qs=bank',c);process.stdout.write(JSON.stringify(c.qs));"],cwd=ROOT,text=True)
qs=json.loads(raw)
WORDS=set('Ab Abt BA Bv CV Ceq CeqV Cf Ci EA EB Ea Eelectrical Emechanical Favg Fd Fnew Fv GM GMm IL IR Icm Idisk Ienc Iend Ihoop Ir Kf Klarge Krot Ksmall Ktotal LI La ML MR MV Ma Mg MgL Mgd Mv Pext Pload Pmax Qenc Qf RC RI RL Req Rt SI TR Uf Ui Umin Utotal VA VB VI Vterminal Wb Wext Wexternal Wfield aA aL aR ah amax ar avg ax ay bA bt bv bx cL cos ct cv cx dA dB dE dI dP dR dU dV diel dq dr dt dv dx dy dz eR ext fRt field ft gR gh ghmin gt gv gx hmin kg kA kL kQ kQR kQq kQy kQz kx ln mB mM mR mV ma mg mgR mgh mgv mgvterm mr mt mu mv mvR mvbottom mvmax qB qE qaL qv qvB rF rad sin tan vac vB vbottom vmax vterm vtop xA xcm xy'.split())
GREEK=dict(zip('αβγδεθκλμπρστφΦωℰ', ['alpha','beta','gamma','delta','epsilon','theta','kappa','lambda','mu','pi','rho','sigma','tau','phi','Phi','omega','mathcal{E}']))
GREEK.update({'ξ':'xi','η':'eta','Ω':'Omega'})
SUP=dict(zip('⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺ⁿᴸ', '0123456789-+nL'))
SUP.update({'ᵀ':'T','ʳ':'r'})
SUB=dict(zip('₀₁₂₃₄₅₆₇₈₉ₓᵢ', '0123456789xi'))
SUB['₋']='-'
# Preserve notation that isn't captured by the simple algebra converter.
SPECIAL={
 '∫₋ᴸ⁄₂ᴸ⁄₂':r'\int_{-L/2}^{L/2}',
 '∫₀∞':r'\int_0^\infty', '∫₀ᴸ':r'\int_0^L', '∫₀ᵀ':r'\int_0^T',
 '∫₀²':r'\int_0^2', '∫₀ʳ':r'\int_0^r',
 '∂Eₓ/∂x+∂E_y/∂y':r'\frac{\partial E_x}{\partial x}+\frac{\partial E_y}{\partial y}',
}
SYMBOLS={'−':'-','–':'-','·':r'\cdot ','×':r'\times ','±':r'\pm ','≈':r'\approx ','≥':r'\ge ','≤':r'\le ','→':r'\to ','∞':r'\infty ','ℓ':r'\ell ','∇':r'\nabla ','≫':r'\gg ','∥':r'\parallel ','⊥':r'\perp ','∫':r'\int ','∮':r'\oint ','Δ':r'\Delta ','Σ':r'\sum ','∂':r'\partial ','′':"'",'″':"''",'°':r'^\circ ','⁄':'/','½':r'\frac{1}{2}','¼':r'\frac{1}{4}'}
# These labels are multi-character subscripts, not products of letters.
LABELS={'Eelectrical':r'E_{\mathrm{electrical}}','Emechanical':r'E_{\mathrm{mechanical}}','Wexternal':r'W_{\mathrm{external}}','Wfield':r'W_{\mathrm{field}}','Vterminal':r'V_{\mathrm{terminal}}','Wext':r'W_{\mathrm{ext}}','Pext':r'P_{\mathrm{ext}}','Pload':r'P_{\mathrm{load}}','Pmax':r'P_{\max}','Icm':r'I_{\mathrm{cm}}','Idisk':r'I_{\mathrm{disk}}','Ihoop':r'I_{\mathrm{hoop}}','Ienc':r'I_{\mathrm{enc}}','Iend':r'I_{\mathrm{end}}','Qenc':r'Q_{\mathrm{enc}}','Klarge':r'K_{\mathrm{large}}','Ksmall':r'K_{\mathrm{small}}','Krot':r'K_{\mathrm{rot}}','Ktotal':r'K_{\mathrm{total}}','Utotal':r'U_{\mathrm{total}}','Umin':r'U_{\min}','Favg':r'F_{\mathrm{avg}}','Fnew':r'F_{\mathrm{new}}','CeqV':r'C_{\mathrm{eq}}V','Ceq':r'C_{\mathrm{eq}}','Req':r'R_{\mathrm{eq}}','xcm':r'x_{\mathrm{cm}}','vmax':r'v_{\max}','vterm':r'v_{\mathrm{term}}','vtop':r'v_{\mathrm{top}}','vbottom':r'v_{\mathrm{bottom}}','amax':r'a_{\max}','hmin':r'h_{\min}','mvbottom':r'mv_{\mathrm{bottom}}','mvmax':r'mv_{\max}','mgvterm':r'mgv_{\mathrm{term}}','ghmin':r'gh_{\min}','Pload':r'P_{\mathrm{load}}','Kf':r'K_f','Uf':r'U_f','Ui':r'U_i','Cf':r'C_f','Ci':r'C_i','Qf':r'Q_f','VA':r'V_A','VB':r'V_B'}
allowed_symbols=set('=+-−–*/^()[]{}.,<>≤≥≈→∞±·×√∫∮ΔΣ∂′″°⁄½¼ℓω⃗̈')|set(GREEK)|set(SUP)|set(SUB)|set('ʳ′∇≫∥⊥_')
WORDS.difference_update(['SI','field','avg','ext','vac','diel'])
allowed_symbols.add('|')
allowed_symbols.discard('.')
TOKEN=re.compile(r'[A-Za-z]+_[A-Za-z0-9]+|\d+(?:\.\d+)?|[A-Za-z]+|\s+|.',re.S)
def allowed(t):
 if t.isspace() or re.fullmatch(r'\d+(?:\.\d+)?',t):return True
 if re.fullmatch(r'[A-Za-z]+_[A-Za-z0-9]+',t):return True
 if t.isascii() and t.isalpha():return len(t)==1 or t in WORDS
 return t in allowed_symbols

def top_parts(s,operators):
 depth=0;parts=[];last=0
 for i,c in enumerate(s):
  if c in '([':depth+=1
  elif c in ')]':depth-=1
  elif depth==0 and c in operators and i>0 and s[i-1] not in '=+-*/^(':parts.extend([s[last:i],c]);last=i+1
 parts.append(s[last:]);return parts

def convert(s):
 s=s.strip()
 if not s:return ''
 # Keep integral operators outside fractions and differential products.
 for bound in [k for k in SPECIAL if k.startswith('∫')]:
  if s.startswith(bound):return SPECIAL[bound]+' '+convert(s[len(bound):])
 if s.startswith('∫'):return r'\int '+convert(s[1:])
 diff=re.fullmatch(r'(.*\S)\s+(d[txryz])',s)
 if diff and '/' in diff[1]:return convert(diff[1])+r'\, '+diff[2]
 # Replace manually specified integral bounds before Unicode conversion.
 if s in SPECIAL:return SPECIAL[s]
 # Keep relation chains and sums as separate terms before building fractions.
 pieces=top_parts(s,'=<>≤≥≈→,+−-')
 if len(pieces)>1:return ''.join(convert(p) if i%2==0 else SYMBOLS.get(p,p) for i,p in enumerate(pieces))
 if s[0] in '+−-':return SYMBOLS.get(s[0],s[0])+convert(s[1:])
 pieces=top_parts(s,'/')
 if len(pieces)>1:
  out=convert(pieces[0])
  for i in range(2,len(pieces),2):out=r'\frac{'+out+'}{'+convert(pieces[i])+'}'
  return out
 out='';i=0
 while i<len(s):
  # A manually specified bound is an atomic term.
  special=next((x for x in SPECIAL if s.startswith(x,i)),None)
  if special:out+=SPECIAL[special];i+=len(special);continue
  c=s[i]
  if c in '([':
   close=')' if c=='(' else ']';depth=1;j=i+1
   while j<len(s) and depth:
    if s[j]==c:depth+=1
    elif s[j]==close:depth-=1
    j+=1
   if depth:out+=c;i+=1;continue
   inner=convert(s[i+1:j-1])
   if i>0 and s[i-1] in '^√':out+='{'+inner+'}'
   else:out+=r'\left'+c+inner+r'\right'+close
   i=j;continue
  if c=='√':
   out+=r'\sqrt'
   if i+1<len(s) and s[i+1] not in '([':
    m=re.match(r'[A-Za-zα-ω]+|\d+',s[i+1:]);word=m.group() if m else s[i+1:i+2];out+='{'+convert(word)+'}';i+=len(word)
   i+=1;continue
  if c in SUP or c in SUB:
   chars=SUP if c in SUP else SUB;kind='^' if c in SUP else '_';j=i
   while j<len(s) and s[j] in chars:j+=1
   out+=kind+'{'+''.join(chars[x] for x in s[i:j])+'}';i=j;continue
  if c=='^' and i+1<len(s) and s[i+1] not in '([':
   m=re.match(r'[+−-]?\d+(?:\.\d+)?|[A-Za-z]',s[i+1:]);word=m.group() if m else s[i+1:i+2];out+='^{'+convert(word)+'}';i+=len(word)+1;continue
  if c=='_' and i+1<len(s):
   m=re.match(r'[A-Za-z0-9]+',s[i+1:]);word=m.group() if m else s[i+1:i+2];out+='_{'+word+'}';i+=len(word)+1;continue
  if c.isascii() and c.isalpha():
   m=re.match(r'[A-Za-z]+',s[i:]);word=m.group()
   value=LABELS.get(word,('\\'+word+' ' if word in ['sin','cos','tan','ln'] else r'\mathrm{'+word+'}' if word in ['kg','rad','SI'] else word))
   i+=len(word)
   if i<len(s) and s[i] in ['⃗','̈']:
    value=('\\vec{' if s[i]=='⃗' else '\\ddot{')+value+'}';i+=1
   if i<len(s) and s[i] in ['∥','⊥']:
    value+=r'_{\parallel}' if s[i]=='∥' else r'_{\perp}';i+=1
   out+=value;continue
  if c in GREEK:
   value='\\'+GREEK[c]+' '
   if i+1<len(s) and s[i+1] in ['⃗','̈']:
    value=('\\vec{' if s[i+1]=='⃗' else '\\ddot{')+value.strip()+'}';i+=1
   out+=value
  elif c=='⃗':out=r'\vec{'+out+'}'
  elif c=='̈':out=r'\ddot{'+out+'}'
  elif c.isspace():out+=' '
  else:out+=SYMBOLS.get(c,c)
  i+=1
 return out

def annotate(text):
 text=text.replace('I6=','I_6=').replace('I3=','I_3=').replace('v=at','v=a t').replace('v₁f','v_1f').replace('v₁i','v_1i').replace('v₂f','v_2f')
 tokens=list(TOKEN.finditer(text));spans=[];start=None
 for i,t in enumerate(tokens+ [None]):
  if t is not None and allowed(t.group()) and not (t.group() in ['a','A'] and text[t.end():].startswith(' ') and t.end()+1<len(text) and re.match(r'[A-Za-z]{2,}',text[t.end()+1:])) and not (t.group()=='s' and t.start()>0 and text[t.start()-1] in ["'",'’']):
   if start is None:start=i
   continue
  if start is not None:
   first,last=start,i-1
   while first<=last and (tokens[first].group().isspace() or tokens[first].group() in ',.=' ):first+=1
   while last>=first and (tokens[last].group().isspace() or tokens[last].group() in ',.=+-−–<>'):last-=1
   if first<=last:
    a,b=tokens[first].start(),tokens[last].end();s=text[a:b]
    if re.match(r'^[Aa]\s+(?=[A-Za-z0-9])',s):a+=2;s=text[a:b]
    # Remove unbalanced edge punctuation introduced by prose parentheses.
    while s.startswith(('(', '[')) and s.count(s[0])>s.count(')' if s[0]=='(' else ']'):a+=1;s=text[a:b]
    while s.endswith((')',']')) and s.count(s[-1])>s.count('(' if s[-1]==')' else '['):b-=1;s=text[a:b]
    while s.endswith(('(', '[')) and s.count(s[-1])>s.count(')' if s[-1]=='(' else ']'):b-=1;s=text[a:b].rstrip();b=a+len(s)
    s=s.strip();a=text.find(s,a,b) if s else a;b=a+len(s)
    if s and s not in ['a','A','I','D','SI'] and (any(c.isalnum() or c in GREEK for c in s)):
     spans.append((a,b,convert(s)))
   start=None
 out='';last=0
 for a,b,tex in spans:out+=text[last:a]+r'\('+tex+r'\)';last=b
 return out+text[last:]

presentation={}
for q in qs:
 fields={}
 for key in ['prompt','options','explanation','parts','solutions']:
  if key in q:fields[key]=[annotate(s) for s in q[key]] if isinstance(q[key],list) else annotate(q[key])
 presentation[q['id']]=fields
(ROOT/'dist/math-bank.js').write_text('// LaTeX presentation of original questions; generated by scripts/build-math.py.\nconst mathBank = '+json.dumps(presentation,ensure_ascii=False,indent=2)+';\n')
pathlib.Path('/tmp/math-audit.txt').write_text('\n\n'.join(q['id']+'\n'+'\n'.join(k+': '+str(v) for k,v in presentation[q['id']].items()) for q in qs))
print(f'Generated LaTeX fields for {len(presentation)} questions.')
