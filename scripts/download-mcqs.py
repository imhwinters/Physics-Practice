import concurrent.futures,pathlib,subprocess
ROOT=pathlib.Path(__file__).resolve().parents[1];cache=ROOT/'sources/mcq';cache.mkdir(parents=True,exist_ok=True)
APCH=[2,3,4,5,6,7,8,9,10,16,18,19,20,21,22,23]
PHYCH=[2,3,4,5,6,7,8,9,18,19,20]
items=[('ap',ch,kind) for ch in APCH for kind in ['questions','answers']]+[('physics',ch,'questions') for ch in PHYCH]
def download(item):
 book,ch,kind=item;slug='college-physics-ap-courses-2e' if book=='ap' else 'physics'
 page=f'chapter-{ch}' if kind=='answers' else f'{ch}-test-prep-for-ap-r-courses' if book=='ap' else f'{ch}-multiple-choice'
 path=cache/f'{book}-{ch}-{kind}.html'
 if path.exists():return True
 p=subprocess.run(['curl','--fail','-L','-sS','--max-time','60',f'https://openstax.org/books/{slug}/pages/{page}'],capture_output=True)
 if p.returncode:return False
 path.write_bytes(p.stdout);return True
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as ex:res=list(ex.map(download,items))
print('Downloaded',sum(res),'of',len(res),'MCQ and answer pages.')
