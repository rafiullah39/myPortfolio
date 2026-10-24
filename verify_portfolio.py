from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit
class Inventory(HTMLParser):
    def __init__(self):
        super().__init__(); self.refs=[]; self.ids=[]; self.cases=0; self.videos=0
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        for k in ('href','src'):
            value=a.get(k,'')
            if value and not value.startswith(('https:','http:','mailto:','#')): self.refs.append(urlsplit(value).path)
        if 'id' in a:self.ids.append(a['id'])
        self.cases+='data-case' in a; self.videos+='data-video' in a
p=Inventory();p.feed(Path('index.html').read_text(encoding='utf-8-sig'))
missing=[r for r in p.refs if not Path(r).is_file()]
assert not missing, missing
assert len(p.ids)==len(set(p.ids)), 'Duplicate IDs'
assert p.cases==7 and p.videos==4
assert '2024 — Present' in Path('index.html').read_text(encoding='utf-8-sig')
assert '2022 — Present' not in Path('index.html').read_text(encoding='utf-8-sig')
print(f'PASS: {len(p.refs)} local asset references, 7 project case studies, 4 videos, unique IDs.')
