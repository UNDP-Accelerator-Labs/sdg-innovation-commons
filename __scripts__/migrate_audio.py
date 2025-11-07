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

            # If the URL path contains certain platform segments, download into
            # a matching subdirectory (Experimenters, Explorers, SolutionMappers)
            path = parsed.path or ''
            subdir = None
            for key in ('Experimenters', 'Explorers', 'SolutionMappers'):
                if f'/{key}/' in path:
                    subdir = key
                    break

            if subdir:
                dest_dir = os.path.join(AUDIO_DIR, subdir)
                os.makedirs(dest_dir, exist_ok=True)
                local_path = os.path.join(dest_dir, filename)
                local_webpath = f'/public/media/audio/{subdir}/{filename}'
            else:
                local_path = os.path.join(AUDIO_DIR, filename)
                local_webpath = f'/public/media/audio/{filename}'

            if os.path.exists(local_path):
                summary['skipped_existing'] += 1
                # File already exists locally; do not modify the markdown reference yet.
                # We only record that the audio was present and continue to next match.
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
                # Audio downloaded. Do not update the markdown references yet.
                # We leave the original [[audio:...]] tag in place for now.
                print('Downloaded to', local_path)
            except Exception as e:
                print('Failed to download', url, 'error:', e)
        if updated:
            with open(fpath, 'w', encoding='utf-8') as f:
                f.write(text)
            summary['files_updated'] += 1

print('Migration summary:')
for k, v in summary.items():
    print(f'  {k}: {v}')