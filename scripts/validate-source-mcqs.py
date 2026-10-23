import pathlib,json,re
from bs4 import BeautifulSoup
ROOT=pathlib.Path(__file__).resolve().parents[1]
s=(ROOT/'dist/ap-mcqs.js').read_text();qs=json.loads(s[s.index('['):s.rindex(']')+1]);pages={}
for q in qs:
 ch=q['chapter']
 if ch not in pages:pages[ch]=(BeautifulSoup((ROOT/f'sources/mcq/ap-{ch}-questions.html').read_text(),'html.parser'),BeautifulSoup((ROOT/f'sources/mcq/ap-{ch}-answers.html').read_text(),'html.parser'))
 src,ans=pages[ch];exid=q['url'].split('#')[1];ex=src.find(id=exid);assert ex
 b=ex.select_one('.os-problem-container');choices=b.find('ol',recursive=False).find_all('li',recursive=False)
 assert len(choices)==len(q['optionsHTML'])
 sol=ans.find(id=exid+'-solution');text=(sol.select_one('.os-solution-container') or sol).get_text(' ',strip=True)
 assert re.fullmatch(r'\(?'+q['publishedKey']+r'\)?\.?',text,re.I),(q['id'],text)
 for field,value in q.items():
  if field.endswith('HTML'):
   for html in value if isinstance(value,list) else [value]:
    soup=BeautifulSoup(html,'html.parser')
    assert not soup.select('script,iframe,form,button,annotation-xml')
    for im in soup.find_all('img'):assert (ROOT/'dist'/im['src']).is_file()
# Every MIT entry must point to a real source page containing numbered choices.
s=(ROOT/'dist/mit-mcqs.js').read_text();mit=json.loads(s[s.index('['):s.rindex(']')+1])
for q in mit:
 session=re.search(r'(w\d+d\d+)',q['url'])[1];p=(ROOT/f'sources/mit-mcq/{session}-questions.txt').read_text().split('\f')[q['page']-1]
 assert re.search(r'\b1\s*[.)]',p) and re.search(r'\b2\s*[.)]',p),q['id']
 assert (ROOT/'dist'/q['url']).is_file()
print(f'Checked {len(qs)} MCQs against public publisher letter keys and all {len(mit)} MIT source-page references; option counts and local diagrams verified.')
