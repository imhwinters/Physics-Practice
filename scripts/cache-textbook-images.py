"""Bundle textbook diagrams for localhost use. Keep the publisher's attribution."""
import pathlib,json,concurrent.futures,subprocess,hashlib,sys
ROOT=pathlib.Path(__file__).resolve().parents[1]
filename=sys.argv[1] if len(sys.argv)>1 else 'textbook.js'
varname={'textbook.js':'textbookQuestions','ap-mcqs.js':'apMCQs'}[filename]
path=ROOT/'dist'/filename;s=path.read_text();data=json.loads(s[s.index('['):s.rindex(']')+1])
from bs4 import BeautifulSoup
def htmlvalues(q):
 for field,value in q.items():
  if field.endswith('HTML'):
   yield from value if isinstance(value,list) else [value]
urls=sorted({im['src'] for q in data for html in htmlvalues(q) for im in BeautifulSoup(html,'html.parser').find_all('img') if im.get('src','').startswith('https://openstax.org/')})
folder=ROOT/'dist/textbook-assets';folder.mkdir(exist_ok=True)

def get(url):
 stem=hashlib.sha256(url.encode()).hexdigest()[:24]
 existing=list(folder.glob(stem+'.*'))
 if existing:return url,'textbook-assets/'+existing[0].name
 p=subprocess.run(['curl','--fail','-L','-sS','--max-time','60',url],capture_output=True)
 if p.returncode:return url,None
 b=p.stdout
 suffix='.png' if b.startswith(b'\x89PNG') else '.jpg' if b.startswith(b'\xff\xd8') else '.webp' if b.startswith(b'RIFF') else '.svg' if b'<svg' in b[:1000] else None
 if not suffix:return url,None
 if suffix=='.svg':
  from bs4 import BeautifulSoup
  svg=BeautifulSoup(b,'xml')
  for x in svg.select('script,foreignObject'):x.decompose()
  for x in svg.find_all():
   for a in list(x.attrs):
    if a.lower().startswith('on') or a.lower() in ['href','xlink:href'] and not str(x[a]).startswith('#'):del x[a]
  b=str(svg).encode()
 out=folder/(stem+suffix);out.write_bytes(b);return url,'textbook-assets/'+out.name
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as ex:results=dict(ex.map(get,urls))
failed=[u for u,v in results.items() if v is None]
def replace_images(html):
 for u,v in results.items():
  if v:html=html.replace(u,v)
 return html
for q in data:
 for field in q:
  if field.endswith('HTML'):
   q[field]=[replace_images(h) for h in q[field]] if isinstance(q[field],list) else replace_images(q[field])
path.write_text('// Source exercises with attribution retained per entry.\nconst '+varname+'='+json.dumps(data,ensure_ascii=False,indent=2)+';\nbank.push(...'+varname+');\n')
(ROOT/('sources/openstax/'+filename+'-image-manifest.json')).write_text(json.dumps(results,indent=2))
print(f'Bundled {len(urls)-len(failed)} of {len(urls)} diagrams. Unavailable diagrams: {len(failed)}')
if failed:print('\n'.join(failed))
