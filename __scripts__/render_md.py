from PIL import Image
import json
from pprint import pprint
import requests
from os import listdir
from os.path import join, isfile, isdir
import base64
from bs4 import BeautifulSoup
import re
from io import BytesIO
from datetime import datetime
from sys import path as syspath
from os.path import join, dirname

from pprint import pprint

syspath.append(join(dirname(__file__)))
from compile_registry import makeSafe

knowntypes = ['group', 'tag', 'txt', 'radiolist', 'mosaic', 'checklist', 'title', 'location', 'index', 'img', 'embed', 'attachment', 'video', 'drawing']
acceptedTypes = ['group', 'mosaic', 'radiolist', 'checklist', 'txt', 'title', 'img', 'embed', 'attachment', 'video', 'drawing']
platforms = [
  'solutions',
  'learningplans',
  'experiments',
]
platform_id = 2
doctype = platforms[platform_id][:-1]

def getJson (file):
  f = open(file, 'r')
  return json.loads(f.read())

def parseInstruction (item):
  try:
    instruction = item['instruction']
    return f'\n> {instruction}\n'
  except:
    return None

def parseTitle (item):
  txt = item.get('txt', None)
  if txt is not None:
    return f'\n{re.sub('\n{3,}', '\n\n', txt)}\n'
  else:
    return ''

def parseText (item):
  txt = item.get('txt', None)
  if txt is not None:
    return f'\n{re.sub('\n{3,}', '\n\n', txt)}\n'
  else:
    return ''

def parseEmbed (item):
  pattern = re.compile(r'https?://\S+|www\.\S+')
  html = item.get('html', None)
  if html is not None:
    if pattern.match(html):
      return f'[{html}]({html})\n'
    else: 
      html = BeautifulSoup(html, 'html.parser').get_text()
      if pattern.match(html):
        return f'\n[{html}]({html})\n'
      return f'\n{html}\n'
  else:
    return ''

def parseAttachment (item):
  print('attachment')
  print(item)

def parseChecklist (item):
  options = [o['name'] for o in item['options'] if o.get('checked', False) == True]
  return f'\n- {'\n- '.join(options)}\n'

# This function is a helper in case the blobs for a year need to be split because of size constraints
def checkImgPath (src, year):
  path_to_local_images = '../SDG_Commons_Archive/'
  subdirs = [d for d in listdir(path_to_local_images) if isdir(join(path_to_local_images, d)) and str(year) in d]
  
  res = ''
  for d in subdirs:
    dir_path = join(path_to_local_images, f'{d}/blobs/{platforms[platform_id]}')
    try:
      f = open(join(dir_path, src))
      res = d
    except:
      pass
  return res

def parseMosaic (item, year):
  srcs = item['srcs']
  imgs = '\n'
  for src in srcs:
    if src is not None:
      src = src.split('/')[-1]
      year_path = checkImgPath(src, year)
      # if year == 2025: print(year_path)
      if year_path != '': bloburl = f'https://undp-accelerator-labs.github.io/Archive_SDG_Commons_{str(year_path)}/blobs/{platforms[platform_id]}'
      else: bloburl = f'https://undp-accelerator-labs.github.io/Archive_SDG_Commons_{str(year)}/blobs/{platforms[platform_id]}'
      url = join(bloburl, src)
      imgs = imgs + f'\n![Missing alt text]({url})\n'
      # imgs = imgs + '\n![Missing alt text](data:image/png;base64,' + base64.b64encode(requests.get(url, stream=True).content).decode('utf-8') + ')\n'
  imgs = imgs + '\n'
  return imgs

def parseImg (item, year):
  src = item.get('src', None)
  if src is not None:
    src = src.split('/')[-1]
    year_path = checkImgPath(src, year)
    # if year == 2025: print(year_path)
    if year_path != '': bloburl = f'https://undp-accelerator-labs.github.io/Archive_SDG_Commons_{str(year_path)}/blobs/{platforms[platform_id]}'
    else: bloburl = f'https://undp-accelerator-labs.github.io/Archive_SDG_Commons_{str(year)}/blobs/{platforms[platform_id]}'
    url = join(bloburl, src)
    return f'\n\n![Missing alt text]({url})\n\n'
    # return f'\n\n![Missing alt text](data:image/png;base64,' + base64.b64encode(requests.get(url, stream=True).content).decode('utf-8') + ')\n\n'
  else: return ''

def parseVideo (item):
  # TO DO: find a good way to store the videos outside the blob storage
  return ''

def parseDrawing (item):
  # TO DO
  return ''

def parseTag (item):
  key = item['type']
  if key == 'sdgs':
    value = f'{item['key']}. {item['name']}'
  else:
    value = item.get('name', None)
  if value is not None:
    return f'[[{key}:{value}]]\n'
  else:
    return ''

# def parseIndex (item):
#   return ''

def getContinent (country):
  # This is not used for now
  lookup = getJson(join(dirname(__file__), './data/country_lookup.json'))
  continent = [o.get('continent', 'Undefined') 
    for o in lookup 
    if o['iso3'].lower() == country.lower() 
    or o['name'].lower() == country.lower()
    or country.lower() in list(map(lambda x: x.lower(), o.get('alt_names', [])))
  ]
  if len(continent) > 0:
    return continent[0]
  else:
    return None

def parseLocation (item):
  country = item.get('country', None)
  lat = item.get('lat', 0)
  lng = item.get('lng', 0)
  if country is not None:
    # Moving "continent" to the registry compilation
    # This means no need to add it as a tag
    
    # continent = getContinent(country)
    # s = ''
    # if continent: 
    #   s = f'[[continent:{continent}]]\n'
    # s = s + f'[[country:{country}]]\n[[latlng:{','.join([str(lat),str(lng)])}]]\n'
    # return s
    return f'[[country:{country}]]\n[[latlng:{','.join([str(lat),str(lng)])}]]\n'
  else:
    return ''

def parseMetadata (item):
  key = item['name']
  value = item['value']
  # Remove some of the extra text in tags
  value = re.sub('^This experiment ', '', value, flags=re.I)
  value = re.sub('^No, it does not ', 'It does not ', value, flags=re.I)
  return f'[[{key}:{value}]]\n'

def parseItems (item, year):
  md = ''
  type = item['type']
  if type in acceptedTypes:
    instruction = parseInstruction(item)
    if instruction is not None:
      md = instruction

  if type == 'title': md = md + parseTitle(item)
  if type == 'txt': md = md + parseText(item)
  if type in ['checklist', 'radioList']: md = md + parseChecklist(item)
  if type == 'mosaic': md = md + parseMosaic(item, year)
  if type == 'img': md = md + parseImg(item, year)
  if type == 'embed': md = md + parseEmbed(item)
  if type == 'attachment': md = md + parseAttachment(item)
  if type == 'video': md = md + parseVideo(item)
  if type == 'drawing': md = md + parseDrawing(item)
  
  # if type == 'tag': md = md + parseTag(item) # does nothing
  # if type == 'index': md = md + parseIndex(item) # does nothing
  # if type == 'location': md = md + parseLocation(item) # does nothing

  if type == 'group':
    for g in item['items']:
      items = [i for i in g if i.get('has_content', True) == True]
      if len(items) > 0:
        md = md + '\n\n<div class="group">\n\n'
        for i in items:
          level = i.get('level', None)
          if level == 'media':
            md = md + parseItems(i, year)
          elif level == 'meta':
            name = i.get('name', None)
            if name not in ('thematic_areas','sdgs'):
              md = md + parseItems(i, year)
        md = md + '\n\n</div>\n\n'

  return md

def parseSection (section, year):
  try: title = section['title']
  except: title = None
  try: lead = section['lead']
  except: lead = None
  items = [i for i in section['items'] if i.get('has_content', True) == True]
  types = list(set([i['type'] for i in items]))
  
  md = ''
  if title is not None:
    md = f'## {re.sub('\xc2\xa0', ' ', title.lower().capitalize())}\n'
  if lead is not None:
    md = md + f'**{lead}**\n'
  for i in items:
    level = i.get('level', None)
    if level == 'media':
      md = md + parseItems(i, year)
    elif level == 'meta':
      name = i.get('name', None)
      if name not in ('thematic_areas','sdgs'):
        md = md + parseItems(i, year)

  return (md, [t for t in types if t not in knowntypes])

def render (file):
  data = getJson(file)

  title = data['title']
  sections = data['sections']
  # country = data['country']
  focal_point = data['email']
  tags = sorted([d for d in data['tags'] if d['type'] != 'auto_thematic'], key=lambda x: x['type'])
  locations = data['locations']
  metadata = data['metadata']
  date = datetime.strptime(data['created_at'].split('.')[0], '%Y-%m-%dT%H:%M:%S') # 2020-07-14T11:56:58.274Z

  md = f'# {title}\n\n'
  md = md + f'[[focal_point:{focal_point}]]\n\n'
  md = md + f'[[year:{date.year}]]\n\n'
  md = md + f'[[type:{doctype}]]\n\n'

  for t in tags:
    md = md + parseTag(t)
  for l in locations:
    md = md + parseLocation(l)
  for m in metadata:
    md = md + parseMetadata(m)

  types = []
  for s in sections:
    _md, _types = parseSection(s, date.year)
    md = md + _md
    types = types + _types

  if len(types) > 0: 
    print(f'missing types: {types}')
  return (title, md)

if __name__ == '__main__':
  # checkImgPath('0aca7f5f-cd51-48f7-8303-07f70039f563.png', 2025)
  in_dirname = f'./__pages_test__/json/{platforms[platform_id]}'
  out_dirname = './__pages__/'
  files = [join(in_dirname, f) for f in listdir(in_dirname) if isfile(join(in_dirname, f)) and f != '.DS_Store']
  
  for f in files:
    title, md = render(f)
    title = title.strip().replace('/', '')
    title = re.sub(r'[^a-z0-9]', '_', title.lower());

    with open(join(out_dirname, f'{makeSafe(title)}.md'), 'w') as pipe:
      pipe.write(md)
      print(f'{makeSafe(title)} file written')