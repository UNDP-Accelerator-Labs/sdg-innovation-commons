#!/usr/bin/env python3
"""
Generate AI summaries and titles for story markdown files using local Ollama CLI.
This script processes files with [[type:story]] tags, generates new titles that include
the country name, and adds AI summaries as [[ai_summary:...]] tags.

Usage:
  python __scripts__/generate_ollama_summaries.py [model]

Features:
- Filters files by [[type:story]] tag
- Extracts country from [[country:...]] tag
- Generates descriptive titles including country name
- Creates AI summaries and adds them as tags
- Replaces existing AI summaries if they exist

Notes:
- Requires Ollama to be installed and available
- Default model: llama3.2
- Only processes story files with country information
"""
import subprocess
import sys
import re
from os import listdir
from os.path import join, isfile

# Try to import the Ollama Python client. If not available, 
# fall back to calling the ollama binary via subprocess.
try:
    from ollama import chat, ChatResponse  # type: ignore
    OLLAMA_PY = True
except Exception:
    OLLAMA_PY = False

MODEL = sys.argv[1] if len(sys.argv) > 1 else 'llama3.2'
PAGES_DIR = join('..', 'pages')
AI_START = '<!-- AI_SUMMARY_START -->'  # Kept for compatibility
AI_END = '<!-- AI_SUMMARY_END -->'      # Kept for compatibility


def check_ollama():
    """Check if Ollama is available (either Python client or binary)"""
    if OLLAMA_PY:
        print('Found ollama python client')
        return True
    
    try:
        # Try to check ollama version first
        res = subprocess.run(['ollama', '--version'], capture_output=True, text=True)
        if res.returncode == 0:
            print('Found ollama:', res.stdout.strip().splitlines()[0] if res.stdout else 'version returned')
            return True
        
        # Fallback to --help if version command fails
        res2 = subprocess.run(['ollama', '--help'], capture_output=True, text=True)
        print('Found ollama (via --help)')
        return True
        
    except FileNotFoundError:
        print('ollama binary not found. Please install ollama and ensure it is on your PATH.')
        return False
    except Exception:
        # Generic fallback: assume binary exists
        return True


def extract_country(text):
    """Extract country name from [[country:...]] tag"""
    match = re.search(r'\[\[country:([^\]]+)\]\]', text)
    return match.group(1) if match else None


def generate_title_with_ollama(text, country, model=MODEL):
    """Generate a new title based on the transcript content, including country name"""
    # Remove internal tags and timestamps to avoid sending irrelevant tokens
    clean = re.sub(r"\[\[[^\]]+\]\]", '', text)
    excerpt = clean.strip()[:8000]

    prompt = (
        f"You are a helpful assistant. Based on the following interview transcript from {country}, "
        f"generate a concise, descriptive title that captures the main topic or initiative discussed. "
        f"The title should include the country name '{country}' and be suitable for a story/case study. "
        f"Keep it under 80 characters. Output ONLY the title — no additional commentary, headings, or labels.\n\n"
        + excerpt
    )

    # Prefer Python client when available
    if OLLAMA_PY:
        try:
            response = chat(model=model, messages=[{'role': 'user', 'content': prompt}])
            # Attempt to extract the message content using both mapping and object access
            content = None
            try:
                content = response['message']['content']
            except Exception:
                try:
                    content = response.message.content
                except Exception:
                    content = str(response)
            return content.strip() if content else None
        except Exception as e:
            print('ollama python client error:', e)
            return None

    # Fallback: call the ollama binary via subprocess
    try:
        proc = subprocess.run(['ollama', 'run', model, '--prompt', prompt], capture_output=True, text=True, timeout=120)
        if proc.returncode != 0:
            print('ollama returned error:', proc.stderr)
            return None
        out = proc.stdout.strip()
        return out
    except Exception as e:
        print('Error running ollama subprocess:', e)
        return None


def summarize_with_ollama(text, model=MODEL):
    """Generate a concise summary of the interview transcript"""
    # Remove internal tags and timestamps to avoid sending irrelevant tokens
    clean = re.sub(r"\[\[[^\]]+\]\]", '', text)
    excerpt = clean.strip()[:12000]

    prompt = (
        "You are a helpful summarizer. Produce a concise summary of the "
        "following interview transcript in EXACTLY 5 sentences or fewer. "
        "Be factual and neutral. Output ONLY the summary — no additional commentary, headings, or labels.\n\n"
        + excerpt
    )

    # Prefer Python client when available
    if OLLAMA_PY:
        try:
            response = chat(model=model, messages=[{'role': 'user', 'content': prompt}])
            # Attempt to extract the message content using both mapping and object access
            content = None
            try:
                content = response['message']['content']
            except Exception:
                try:
                    content = response.message.content
                except Exception:
                    content = str(response)
            return content.strip() if content else None
        except Exception as e:
            print('ollama python client error:', e)
            return None

    # Fallback: call the ollama binary via subprocess
    try:
        proc = subprocess.run(['ollama', 'run', model, '--prompt', prompt], capture_output=True, text=True, timeout=120)
        if proc.returncode != 0:
            print('ollama returned error:', proc.stderr)
            return None
        out = proc.stdout.strip()
        return out
    except Exception as e:
        print('Error running ollama subprocess:', e)
        return None


def process_file(path):
    """Process a single markdown file to generate title and AI summary"""
    try:
        with open(path, 'r', encoding='utf-8') as f:
            text = f.read()

        # Check if file has [[type:story]] tag
        if '[[type:story]]' not in text:
            print(f'Skipping {path} - not a story file')
            return

        # Extract country from the file
        country = extract_country(text)
        if not country:
            print(f'Skipping {path} - no country found')
            return

        # Extract body content (exclude initial tags and metadata)
        parts = text.split('\n\n', 2)
        body = text
        if len(parts) >= 2:
            body = parts[1] + (('\n\n' + parts[2]) if len(parts) > 2 else '')

        # Generate new title and summary
        new_title = generate_title_with_ollama(body, country)
        if not new_title:
            print(f'Failed to generate title for {path}; skipping')
            return

        summary = summarize_with_ollama(body)
        if not summary:
            print(f'Failed to generate summary for {path}; skipping')
            return

        # Update the title in the file
        title_pattern = r'^#\s+.*$'
        title_match = re.search(title_pattern, text, re.MULTILINE)
        if title_match:
            updated_text = text.replace(title_match.group(), f'# {new_title}')
        else:
            # Add title after the tags if none exists
            lines = text.split('\n')
            insert_index = 0
            for i, line in enumerate(lines):
                if not line.startswith('[[') and line.strip():
                    insert_index = i
                    break
            lines.insert(insert_index, f'# {new_title}')
            lines.insert(insert_index + 1, '')
            updated_text = '\n'.join(lines)

        # Handle AI summary tag - always place as first line
        ai_summary_tag = f"[[ai_summary:{summary}]]"
        ai_summary_pattern = r'\[\[ai_summary:.*?\]\]'
        
        if re.search(ai_summary_pattern, updated_text, re.DOTALL):
            # Remove existing AI summary from wherever it is
            updated_text = re.sub(ai_summary_pattern, '', updated_text, flags=re.DOTALL)
            # Clean up any extra newlines left behind
            updated_text = re.sub(r'\n\n\n+', '\n\n', updated_text)
            print(f'Removed existing AI summary from {path}')
        
        # Add AI summary as the very first line
        lines = updated_text.split('\n')
        lines.insert(0, ai_summary_tag)
        updated_text = '\n'.join(lines)
        print(f'Added AI summary as first line in {path}')

        print(f'Updated title: {new_title}')
        print(f'Added summary: {summary[:100]}...')

        # Write the updated file
        with open(path, 'w', encoding='utf-8') as f:
            f.write(updated_text)
            
    except Exception as e:
        print(f'Error processing {path}: {str(e)}')
        # Continue with next file instead of stopping


if __name__ == '__main__':
    if not check_ollama():
        sys.exit(1)

    # First, filter files to only those with [[type:story]] to be more efficient
    all_files = [f for f in listdir(PAGES_DIR) if isfile(join(PAGES_DIR, f)) and f.endswith('.md')]
    story_files = []
    
    print(f"Scanning {len(all_files)} markdown files for story files...")
    
    for f in all_files:
        try:
            path = join(PAGES_DIR, f)
            with open(path, 'r', encoding='utf-8') as file:
                content = file.read()
                if '[[type:story]]' in content:
                    story_files.append(f)
        except Exception as e:
            print(f"Error reading {f}: {e}")
            continue
    
    print(f"Found {len(story_files)} story files to process")
    
    story_files.sort()
    for fn in story_files:
        path = join(PAGES_DIR, fn)
        print(f'\nProcessing story file: {path}')
        process_file(path)
    
    print('\nDone')