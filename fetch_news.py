import json, urllib.request, urllib.parse, xml.etree.ElementTree as ET, re
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime

FEEDS=[
 {"name":"GMA News","url":"https://www.gmanetwork.com/news/rss/","category":"news"},
 {"name":"Philstar.com","url":"https://www.philstar.com/rss/headlines","category":"news"},
 {"name":"Manila Bulletin","url":"https://mb.com.ph/feed","category":"news"},
 {"name":"BusinessWorld","url":"https://www.bworldonline.com/feed/","category":"business"},
 {"name":"PNA","url":"https://www.pna.gov.ph/rss.xml","category":"news"},
 {"name":"Rappler","url":"https://www.rappler.com/feed/","category":"news"},
]
UA="PHNewsHub/1.0 RSS reader"
def text(e):
    return "".join(e.itertext()).strip() if e is not None else ""
def child(item,*names):
    for e in list(item):
        tag=e.tag.split("}")[-1].lower()
        if tag in names:return e
    return None
def get(feed):
    req=urllib.request.Request(feed["url"],headers={"User-Agent":UA})
    with urllib.request.urlopen(req,timeout=20) as r:data=r.read()
    root=ET.fromstring(data);out=[]
    for it in root.iter():
        if it.tag.split("}")[-1].lower() in ("item","entry"):
            title=text(child(it,"title"));link=""
            le=child(it,"link")
            if le is not None: link=le.attrib.get("href","") or text(le)
            desc=text(child(it,"description","summary","content"))
            date=text(child(it,"pubdate","published","updated"))
            try: dt=parsedate_to_datetime(date).astimezone(timezone.utc).isoformat()
            except: dt=date
            image=""
            for e in it.iter():
                tag=e.tag.split("}")[-1].lower()
                if tag in ("content","thumbnail") and e.attrib.get("url"): image=e.attrib["url"];break
            if title and link: out.append({"title":title,"link":link,"description":desc,"date":dt,"source":feed["name"],"category":feed["category"],"image":image})
    return out[:25]
items=[]
for f in FEEDS:
    try: items += get(f)
    except Exception as e: print(f["name"],"ERROR",e)
items.sort(key=lambda x:x.get("date",""),reverse=True)
json.dump({"updated":datetime.now(timezone.utc).isoformat(),"items":items[:100]},open("data/news.json","w",encoding="utf-8"),ensure_ascii=False,indent=2)
print("Saved",len(items),"stories")
