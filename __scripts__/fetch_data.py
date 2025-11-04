import urllib.request
from pprint import pprint
import json
from os.path import join, exists
from os import makedirs, getenv

token = getenv['API_KEY']
platforms = [
	'solutions',
	'learningplans',
	'experiments',
]
platform_id = 2

contents = urllib.request.urlopen(f'https://{platforms[platform_id]}.sdg-innovation-commons.org/apis/fetch/pads?output=json&token={token}&status=2&status=3&include_data=true&limit=10&include_tags=true&include_metafields=true&include_locations=true&include_imgs=true').read()

for entry in json.loads(contents):
	out_dirname = join('./__pages_test__/json/', platforms[platform_id])
	if not exists(out_dirname):
	  makedirs(out_dirname)

	file = join(out_dirname, f'entry-{entry['pad_id']}.json')
	with open(file, 'w') as pipe:
		pipe.write(json.dumps(entry))
		print(f'{entry['pad_id']} file written')