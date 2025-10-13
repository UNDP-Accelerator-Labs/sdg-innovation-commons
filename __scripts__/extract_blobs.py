from PIL import Image
import json
from pprint import pprint
import requests
from os import listdir, makedirs
from os.path import join, isfile, exists
import base64
import re
from urllib.parse import quote
from io import BytesIO
from datetime import datetime

from pprint import pprint

knowntypes = ['tag', 'txt', 'radiolist', 'mosaic', 'checklist', 'title', 'location', 'index', 'img', 'embed', 'attachment', 'video', 'drawing']
acceptedTypes = ['mosaic', 'radiolist', 'checklist', 'txt', 'title', 'img', 'embed', 'attachment', 'video', 'drawing']

blob_containers = [
	'solutions-mapping',
	'action-plans',
	'experiments',
]
platforms = [
	'solutions',
	'learningplans',
	'experiments',
]
platform_id = 2

bloburl = f'https://acclabplatforms.blob.core.windows.net/{blob_containers[platform_id]}/'

# blobtarget = f'https://undp-accelerator-labs.github.io/Archive_SDG_Commons_2020/'
year = 2025
blobtarget = f'../SDG_Commons_Archive/{year}/blobs/{platforms[platform_id]}'
if not exists(blobtarget):
	makedirs(blobtarget)

def getJson (file):
	f = open(file, 'r')
	return json.loads(f.read())

def parseMosaic (item):
	srcs = item['srcs']
	imgs = '\n'
	for src in srcs:
		if src is not None:
			if not src.split('/')[-1] in [f for f in listdir(blobtarget) if isfile(join(blobtarget, f)) and f != '.DS_Store']:
				try: 
					url = join(bloburl, src)
					Img = Image.open(BytesIO(requests.get(url, stream=True).content))
					w, h = Img.size
					maxwidth = 1280
					maxheight = 720
					ratio = min(maxwidth/w, maxheight/h)
					if ratio < 1:
						Img = Img.resize((round(w * ratio), round(h * ratio)))
					Img.save(join(blobtarget, src.split('/')[-1]))
				except:
					print(f'failed on: {src}')
		else:
			print(src, srcs)

def parseImg (item):
	src = item.get('src', None)
	if src is not None:
		if not src.split('/')[-1] in [f for f in listdir(blobtarget) if isfile(join(blobtarget, f)) and f != '.DS_Store']:
			try: 
				url = join(bloburl, src)
				Img = Image.open(BytesIO(requests.get(url, stream=True).content))
				w, h = Img.size
				maxwidth = 1280
				maxheight = 720
				ratio = min(maxwidth/w, maxheight/h)
				if ratio < 1:
					Img = Img.resize((round(w * ratio), round(h * ratio)), Image.Resampling.LANCZOS)
				Img.save(join(blobtarget, src.split('/')[-1]))
			except:
				print(f'failed on: {src}')
	else:
		print(item)

def parseVideo (item):
	# TO DO: find a good way to store the videos outside the blob storage
	return ''

def parseDrawing (item):
	# TO DO
	return ''

def parseItems (item):
	type = item['type']

	if type == 'mosaic': parseMosaic(item)
	if type == 'img': parseImg(item)
	# if type == 'attachment': md = md + parseAttachment(item)
	# if type == 'video': md = md + parseVideo(item)
	# if type == 'drawing': md = md + parseDrawing(item)

	if type == 'group':
		for g in item['items']:
			items = [i for i in g if i.get('has_content', True) == True]
			for i in items:
				if i['level'] == 'media':
					parseItems(i)

def parseSection (section):
	items = [i for i in section['items'] if i.get('has_content', True) == True]
	for i in items:
		if i.get('level', None) == 'media':
			parseItems(i)
		elif i.get('level', None) == 'meta':
			pass
		# 	pprint(i)
		else:
			print(i)

def render (file):
	data = getJson(file)
	date = datetime.strptime(data['created_at'].split('.')[0], '%Y-%m-%dT%H:%M:%S') # 2020-07-14T11:56:58.274Z
	sections = data['sections']

	if date.year == year:
		for s in sections:
			parseSection(s)

if __name__ == '__main__':
	in_dirname = f'./__pages_test__/json/{platforms[platform_id]}'
	files = [join(in_dirname, f) for f in listdir(in_dirname) if isfile(join(in_dirname, f)) and f != '.DS_Store']
	
	for f in files:
		render(f)
		# title = title.strip().replace('/', '')
		# title = re.sub(r'[^a-z0-9]', '_', title.lower());

		# with open(join(out_dirname, f'{quote(title)}.md'), 'w') as pipe:
		# 	pipe.write(md)
		# 	print(f'{quote(title)} file written')