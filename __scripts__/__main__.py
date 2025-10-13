from sys import path as syspath
from os.path import join, dirname
import time

syspath.append(join(dirname(__file__)))
from compile_registry import compileRegistry
from compile_homepage import compileHome

syspath.append(join(dirname(__file__), '..'))
from __registries__ import registries

if __name__ == '__main__':
	# print(list(set([k for r in registries for k in r.get('ordered_keys', None) if k is not None])))
	start = time.time()
	for r in registries:
		compileRegistry(r, generate_subregistries=False)
	# Compile the homepage
	compileHome(registries)
	end = time.time()
	print(f'\n\nThe process took {end - start} seconds')