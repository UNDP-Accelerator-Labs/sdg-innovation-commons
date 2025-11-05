#!/usr/bin/env python3
"""
Scan markdown files for [[audio:...]] tags, download remote audio blobs into public/media/audio/
and update the markdown to reference the local file path (/public/media/audio/<filename>).

Usage: python3 __scripts__/migrate_audio.py
"""
import os
import re
import requests
from urllib.parse import urlparse

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
AUDIO_DIR = os.path.join(ROOT, 'public', 'media', 'audio')
if not os.path.exists(AUDIO_DIR):
    os.makedirs(AUDIO_DIR)

# Directories to scan for markdown files
SCAN_DIRS = [
    os.path.join(ROOT, 'rnd-archive', 'stories', 'pages'),
    os.path.join(ROOT, 'pages'),
]

AUDIO_RE = re.compile(r"\[\[audio:([^\]]+)\]\]")

summary = {
    'files_scanned': 0,
    'audio_found': 0,
    'downloaded': 0,
    'skipped_existing': 0,
    'files_updated': 0,
}

for base in SCAN_DIRS:
    if not os.path.exists(base):
        continue
    for fname in os.listdir(base):
        if not fname.lower().endswith('.md'):
            continue
        fpath = os.path.join(base, fname)
        summary['files_scanned'] += 1
        with open(fpath, 'r', encoding='utf-8') as f:
            text = f.read()
        matches = AUDIO_RE.findall(text)
        if not matches:
            continue
        updated = False
        for url in matches:
            summary['audio_found'] += 1
            url = url.strip()
            # If already local (starts with /public/media/audio/ or similar), skip
            if url.startswith('/') and ('/public/media/audio' in url or '/media/audio' in url or url.startswith('public/media/audio')):
                continue
            parsed = urlparse(url)
            filename = os.path.basename(parsed.path)
            if not filename:
                # fallback: create a safe filename from netloc + hash
                filename = parsed.netloc.replace('.', '_') + '.audio'
            local_path = os.path.join(AUDIO_DIR, filename)
            local_webpath = f'/public/media/audio/{filename}'
            if os.path.exists(local_path):
                summary['skipped_existing'] += 1
                # replace remote url with local webpath in the markdown
                new_tag = f'[[audio:{local_webpath}]]'
                text = text.replace(f'[[audio:{url}]]', new_tag)
                updated = True
                continue
            # download
            try:
                print('Downloading', url, '->', local_path)
                resp = requests.get(url, stream=True, timeout=30)
                resp.raise_for_status()
                with open(local_path, 'wb') as out:
                    for chunk in resp.iter_content(chunk_size=8192):
                        if chunk:
                            out.write(chunk)
                summary['downloaded'] += 1
                # replace reference in markdown
                new_tag = f'[[audio:{local_webpath}]]'
                text = text.replace(f'[[audio:{url}]]', new_tag)
                updated = True
            except Exception as e:
                print('Failed to download', url, 'error:', e)
        if updated:
            with open(fpath, 'w', encoding='utf-8') as f:
                f.write(text)
            summary['files_updated'] += 1

print('Migration summary:')
for k, v in summary.items():
    print(f'  {k}: {v}')