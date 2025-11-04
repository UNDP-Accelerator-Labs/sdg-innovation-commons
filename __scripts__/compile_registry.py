import re
import os
from sys import path as syspath, argv
from os import listdir, makedirs
from os.path import isfile, join, basename, splitext, exists, dirname
from urllib.parse import quote
from math import inf
from shutil import copy
import json

from pprint import pprint

syspath.append(join(dirname(__file__), '..'))
from __registries__ import registries

# basepath = './pages/'

# # Get base path from CLI arg or env var (e.g., from GitHub Actions)
# basePath = (
#     argv[1]
#     if len(argv) > 1
#     else os.getenv("BASE_PATH", "")
# )

# # Normalize basePath (leading slash, no trailing slash)
# if basePath and not basePath.startswith("/"):
#     basePath = "/" + basePath
# if basePath.endswith("/"):
#     basePath = basePath[:-1]
# # basePath IS NOT USED

def getJson (file):
  f = open(file, 'r')
  return json.loads(f.read())

def makeSafe (path):
	return re.sub(r'[^a-z0-9]', '_', path.lower())

def getText (file):
	f = open(file, 'r')
	return f.read()

def getTitle (text):
	try: mdTitle = re.search(r'^#\s+.*', text, flags = re.MULTILINE).group()
	except: print(text)
	title = re.sub('\xc2\xa0', ' ', mdTitle).lower().capitalize()
	return re.sub(r'#\s+', '', title)

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

def setListItems (file, structure):
	filename, text = file
	title = getTitle(text)
	
	trees = []
	for i, d in enumerate(structure['ordered_keys']):
		if isinstance(d, dict):
			k = d['key']
			"""
			TO DO: If this is the case, it means we are filtering a given metadata item,
			and on the main index/ registry page, we do not need to navigate to
			other items of the same metadata (because there is only one). For example,
			if this is to filter only solutions, then we do not need solutions as 
			a section in the index/ registry page.
			"""
		else:
			k = d
		
		if k != 'alphabetical':
			if isinstance(d, dict):
				v = d['value'][0]
				"""
				TO DO: In the regex line below, find a way to iterate over d['value'].
				Probably something like this:
					re.findall(fr'\[\[{k}:[{'|'.join(v)}]\]\]', text)
				"""
				md_tags = re.findall(fr'\[\[{k}:{v}\]\]', text)
			else:
				md_tags = re.findall(fr'\[\[{k}:[\w\s\d\.,]*\]\]', text)
			md_tag_values = [re.sub(r'[\[\]]*', '', t).replace(f'{k}:', '') for t in md_tags]
		else:
			md_tag_values = [title[:1].upper()]

		md_tag_values = list(set(md_tag_values))
		md_tag_values.sort()
		# Maybe this only needs to be a set (unique values) as there are duplicates

		if len(md_tag_values) == 0: md_tag_values = [f'Undefined {k}']

		if i == 0: 
			trees = md_tag_values
		else:
			subtrees = []
			for tree in trees:
				if len(md_tag_values) > 0:
					for tag in md_tag_values:
						split_tree = tree.split('|')
						# Below is the only specific case for identifying continents for countries
						if k == 'country':
							continent = getContinent(tag)
							if continent is not None:
								if len(split_tree) > 1:
									tree = f'{'|'.join(split_tree[:-1])}|{continent}'
								else:
									tree = continent
						subtrees.append(f'{tree}|{tag}')
				else:
					subtrees.append(f'{tree}|None')
			trees = subtrees

	return (f'- [{title}](./?doc={filename})', trees)

def filterRelevantFiles (basepath, structure):
	files = [f for f in listdir(basepath) if isfile(join(basepath, f)) and f != '.DS_Store']
	relevantFiles = []
	for f in files:
		text = getText(join(basepath, f))
		for d in structure['ordered_keys']:
			if isinstance(d, dict):
				k = d['key']
				v = d['value'][0]
				"""
				TO DO: In the regex line below, find a way to iterate over d['value'].
				Probably something like this:
					re.findall(fr'\[\[{k}:[{'|'.join(v)}]\]\]', text)
				"""
				pattern = re.compile(fr'\[\[{k}:{v}\]\]', re.MULTILINE)
			else:
				k = d
				pattern = re.compile(fr'\[\[{k}:[\w\s\d\.]+\]\]', re.MULTILINE)
			
			if pattern.search(text):
				if f not in [_f for (_f,_t) in relevantFiles]:
					relevantFiles.append((f, text))
	return relevantFiles

def setSections (items):
	sections = []
	for (li, tree) in items:
		for t in tree:
			levels = t.split('|')
			try:
				branch = next(obj for obj in sections if obj['title'] == levels[0])
			except:
				branch = {
					'title': levels[0],
					'sections': [],
					'items': [],
				}
				sections.append(branch)
				branch = next(obj for obj in sections if obj['title'] == levels[0])
			for l in levels[1:]:
				try:
					branch = next(obj for obj in branch['sections'] if obj['title'] == l)
				except:
					leaf = {
						'title': l,
						'sections': [],
						'items': [],
					}
					branch['sections'].append(leaf)
					branch = next(obj for obj in branch['sections'] if obj['title'] == l)
			branch['items'].append(li)
	return sections

""" 
The function below is deprecated. It works for finding a branch based on a given leaf.
The issue is, leaves on different branches can have the same value (e.g. for alphabetical sorting).
So we prefer the findBranch() funciton.
"""
def findSection (sections, key, depth=0):
	item = tuple()
	for s in sections:
		title = s['title']
		if title.lower() == key.lower():
			item = (title, [dict([i for i in s.items() if i[0] != 'title'])], depth)
		else:
			if s['sections']:
				opt = findSection(s['sections'], key, depth+1)
				if len(opt) == 3: item = opt
	return item

def findBranch (sections, branch, path=''):
	item = tuple()
	for s in sections:
		title = s.get('title', 'None')
		if len(path) > 0:
			subpath = f'{path}|{title}'
		else:
			subpath = title
		
		if subpath.lower() == branch.lower():
			item = (title, [dict([i for i in s.items() if i[0] != 'title'])])
		else:
			subsections = s.get('sections', None)
			if subsections is not None:
				opt = findBranch(subsections, branch, subpath)
				if len(opt) == 2: item = opt
	return item

def sortfn (s):
	title = s.get('title', None)
	if title is not None:
		try: 
			print(int(re.match(r'^\d+', title).group()))
			return int(re.match(r'^\d+', title).group())
		except: 
			return float('inf')
	else:
		return None

def countSubSections (sections):
	n = 0
	if len(sections) > 0:
		n = n + 1
		for s in sections:
			n = n + countSubSections(s['sections'])
	return n

def traverseSections (sections, **kwargs):
	iterator = kwargs.get('iterator', 0)
	path = kwargs.get('path', '')
	generate_subregistries = kwargs.get('generate_subregistries', False)
	
	content = ''
	n_subsection = countSubSections(sections)

	if n_subsection == 1:
		content = content + f'\n<div class="multicol">\n'
	
	try: sections.sort(key=sortfn)
	except: sections.sort(key=lambda x: x.get('title', None))

	for s in sections:
		if n_subsection == 1:
			content = content + '\n\n<div>\n\n'
		
		title = s.get('title', None)
		subpath = ''

		if title is not None:
			safe_title = makeSafe(title)
			if len(path) > 0:
				subpath = f'{path}/{safe_title}'
			else:
				subpath = safe_title

		if title is not None:
			if generate_subregistries == True:
				content = content + f'\n{''.join(['#'] * (iterator + 2))} [{title.capitalize()}](./{subpath})\n'
			else:
				content = content + f'\n{''.join(['#'] * (iterator + 2))} {title.capitalize()}\n'

		items = s.get('items', [])
		items.sort()
		if len(items) > 0:
			content = content + f'{'\n'.join(items)}\n'
		if len(s['sections']) > 0 and n_subsection != 0: 
			content = content + traverseSections(s['sections'], generate_subregistries=generate_subregistries, iterator=iterator+1, path=subpath)
		if n_subsection == 1:
			content = content + '\n\n</div>\n\n'
	
	if n_subsection == 1:
		content = content + '\n</div>\n'
	
	return content

def generateFile (readme, title, content):
	if exists(readme):
		text = getText(readme)
		content = re.sub(r'<!-- !!DO NOT REMOVE THIS COMMENT!! start autogenerated hyperlinks -->(.|\s)*<!-- !!DO NOT REMOVE THIS COMMENT!! end autogenerated hyperlinks -->', content, text)
	else:
		content = f'# {title.capitalize()}\n\n{content}'
	
	with open(readme, 'w') as pipe:
		pipe.write(content)
		print(f'{title} file written')

def copyTemplate (dirname):
	content = open('./template.html', 'r').read()
	relative_path = ''.join(['../' for x in range(len(dirname.split('/')) - 1)])
	content = re.sub(r'\{relative_path\}\/', relative_path, content, flags = re.MULTILINE)

	with open(join(dirname, 'index.html'), 'w') as pipe:
		pipe.write(content)
		print(f'template copied')

def compileRegistry (structure, **kwargs):
	generate_subregistries = kwargs.get('generate_subregistries', False)
	
	basepath = './pages/'
	title = structure['title']
	safe_title = makeSafe(title)
	registries_dir = './registries'
	if not exists(registries_dir):
		makedirs(registries_dir)
	dirname = join(registries_dir, safe_title)
	if not exists(dirname):
		makedirs(dirname)

	relevantFiles = filterRelevantFiles(basepath, structure)
	items = [setListItems(f, structure) for f in relevantFiles]

	# Generate the main registry
	content = '<!-- !!DO NOT REMOVE THIS COMMENT!! start autogenerated hyperlinks -->\n'
	sections = setSections(items)
	md = traverseSections(sections, generate_subregistries=generate_subregistries)
	content = content + md
	content = content + '<!-- !!DO NOT REMOVE THIS COMMENT!! end autogenerated hyperlinks -->'

	# Generate the README
	readme = join(dirname, 'README.md')
	generateFile(readme, title, content)
	# Generate the html file
	try:
		copyTemplate(dirname)
	except:
		print('an error occurred when trying to copy the template.html')

	if generate_subregistries == True:
		# Generate all the subregistries
		branches = list(set([t for (li, trees) in items for t in trees]))
		for b in branches:
			subdirname = dirname
			branch = ''

			for p in b.split('|'):
				if len(branch) > 0:
					branch = f'{branch}|{p}'
				else:
					branch = p
				
				subtitle, subsections = findBranch(sections, branch)
				safe_subtitle = makeSafe(subtitle)
				subdirname = join(subdirname, safe_subtitle.capitalize())
				if not exists(subdirname):
					makedirs(subdirname)

				subcontent = '<!-- !!DO NOT REMOVE THIS COMMENT!! start autogenerated hyperlinks -->\n'
				md = traverseSections(subsections, generate_subregistries=generate_subregistries)
				subcontent = subcontent + md
				subcontent = subcontent + '<!-- !!DO NOT REMOVE THIS COMMENT!! end autogenerated hyperlinks -->'
				
				# Generate the README
				readme = join(subdirname, 'README.md')
				generateFile(readme, subtitle, subcontent)
				# Generate the html file
				try:
					copyTemplate(subdirname)
				except:
					print('an error occurred when trying to copy the template.html')

if __name__ == '__main__':
	structure = registries[0]
	compileRegistry(structure, generate_subregistries=False)