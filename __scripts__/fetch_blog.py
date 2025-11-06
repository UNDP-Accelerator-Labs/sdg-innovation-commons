"""
fetch_blog.py

Fetch blog entries from the SDG Innovation Commons blog API and render each
result as a markdown page in `pages/` similar to the output of
`render_md.py` so the client renderer can display them.
"""

import os
import sys
import json
import re
import requests
from os.path import join, exists, abspath, dirname as _dirname
from os import makedirs
from bs4 import BeautifulSoup
from urllib.parse import urlparse
from datetime import datetime
import subprocess

PAGES_DIR = '../pages'
API_DEFAULT = "https://blogapi.sdg-innovation-commons.org/blogs"


def load_dotenv(path='.env'):
    """Simple .env loader: populates os.environ from a .env file if keys are not already set."""
    try:
        if not os.path.exists(path):
            return
        with open(path, 'r', encoding='utf-8') as fh:
            for raw in fh:
                line = raw.strip()
                if not line or line.startswith('#') or '=' not in line:
                    continue
                k, v = line.split('=', 1)
                k = k.strip()
                v = v.strip().strip('"').strip("'")
                if k and k not in os.environ:
                    os.environ[k] = v
    except Exception:
        # fail silently — loading .env is convenience only
        pass

# Determine repository root (one level up from this script) and load .env files there
_repo_root = abspath(_dirname(_dirname(__file__)))
load_dotenv(join(_repo_root, '.env'))
load_dotenv(join(_repo_root, '.env.local'))


def safe_filename(s):
    s = s or ''
    s = s.strip().lower()
    s = re.sub(r'[^a-z0-9\-\_]+', '_', s)
    s = re.sub(r'_+', '_', s)
    s = s.strip('_')
    if not s:
        s = 'untitled'
    return s


def call_ollama(model, prompt, timeout=20):
    try:
        proc = subprocess.run(["ollama", "query", model, prompt], capture_output=True, text=True, timeout=timeout)
        if proc.returncode == 0:
            return proc.stdout.strip()
    except Exception:
        pass
    return None


def extract_title_from_html(html):
    if not html:
        return None
    soup = BeautifulSoup(html, 'html.parser')
    h1 = soup.find('h1')
    if h1 and h1.get_text(strip=True):
        return h1.get_text(strip=True)
    title = soup.find('title')
    if title and title.get_text(strip=True):
        return title.get_text(strip=True)
    for tag in ('h2', 'h3'):
        t = soup.find(tag)
        if t and t.get_text(strip=True):
            return t.get_text(strip=True)
    text = soup.get_text(separator=' ', strip=True)
    if text:
        snippet = text[:120].rsplit(' ', 1)[0]
        return (snippet + '...') if len(text) > 120 else snippet
    return None


def fetch_page_title_from_url(url):
    try:
        r = requests.get(url, timeout=10)
        if r.status_code == 200:
            return extract_title_from_html(r.text)
    except Exception:
        return None
    return None


def ensure_pages_dir():
    if not exists(PAGES_DIR):
        makedirs(PAGES_DIR)


def api_fetch(url, token=None, params=None):
    headers = {}
    if token:
        # Some APIs expect the token as a query parameter (see example curl); include both
        headers['Authorization'] = f'Token {token}'
        if params is None:
            params = {}
        # create a shallow copy to avoid mutating caller's dict
        params = dict(params)
        params['token'] = token
    r = requests.get(url, headers=headers, params=params, timeout=30)
    try:
        r.raise_for_status()
    except requests.exceptions.HTTPError as e:
        # Helpful debug output to understand why a 401 occurred (do not print token)
        try:
            req_url = r.request.url
        except Exception:
            req_url = url
        has_token_param = bool(params and 'token' in params)
        print(f"API request failed: status={r.status_code} url={req_url} token_in_params={has_token_param}")
        raise
    return r.json()


def clean_html_to_markdown(html):
    """Convert HTML (or messy text) into cleaned markdown-friendly plain text.
    - Uses BeautifulSoup to extract visible text with paragraph separation.
    - Collapses runs of whitespace into single spaces and collapses >2 newlines to 2.
    """
    if not html:
        return ''
    # If the input is already plaintext (no tags), still normalize whitespace
    try:
        soup = BeautifulSoup(html, 'html.parser')
        # Extract text with paragraph-like separators
        text = soup.get_text('\n\n', strip=True)
    except Exception:
        text = html
    # Normalize whitespace within lines
    text = re.sub(r'[ \t\u00A0]+', ' ', text)
    # Collapse multiple blank lines to at most one empty line (two newlines)
    text = re.sub(r'\n{3,}', '\n\n', text)
    # Trim spaces on each line and remove leading/trailing blank lines
    lines = [ln.rstrip() for ln in text.splitlines()]
    # Remove lines that are just whitespace, but keep paragraph breaks
    cleaned_lines = []
    empty_run = False
    for ln in lines:
        if not ln.strip():
            if not empty_run:
                cleaned_lines.append('')
            empty_run = True
        else:
            cleaned_lines.append(ln.strip())
            empty_run = False
    cleaned = '\n'.join(cleaned_lines).strip() + '\n'
    return cleaned


def compose_markdown(item, title, insight=None):
    lines = []
    lines.append(f"# {title}\n")
    source = item.get('url') or item.get('source') or ''
    type = item.get('article_type') or 'unknown'

    lines.append(f"[[type:{type}]]\n")

    if source:
        lines.append(f"[[source:{source}]]\n")
        lines.append(f"[Original article published here]({source})\n\n")

    date_str = item.get('posted_date_str') or item.get('date') or item.get('posted_date')
    if date_str:
        try:
            year = None
            if item.get('posted_date'):
                year = datetime.fromisoformat(item.get('posted_date').replace('Z', '')) .year
        except Exception:
            year = None
        if year:
            lines.append(f"[[year:{year}]]\n")
        clean_date = re.sub('\n', ' ', date_str)
        lines.append(f"[[date:{clean_date}]]\n")

    # Add continent tag (if lookup available) and country tag when present
    country = item.get('country')
    if country:
        continent = get_continent(country)
        if continent:
            lines.append(f"[[continent:{continent}]]\n")
        lines.append(f"[[country:{country}]]\n")

    lines.append('\n')

    content = item.get('html_content') or item.get('content') or ''
    if content:
        # Clean the content to remove excessive whitespace and indentation.
        # Prefer to convert HTML fragments to cleaned plain text for consistent
        # markdown rendering in the archive pages.
        cleaned = clean_html_to_markdown(content)
        lines.append(cleaned)
        lines.append('\n')
    else:
        lines.append('*No article content available.*\n')

    # if insight:
    #     lines.append('\n---\n')
    #     lines.append('**AI insight:**\n')
    #     lines.append(insight)
    #     lines.append('\n')

    return '\n'.join(lines)


def generate_insight_with_ollama(model, text):
    prompt = (
        'Provide a concise (2-3 sentence) insight/summary for the following blog article.\n\n'
        + (text or '')[:2000]
    )
    return call_ollama(model, prompt)


def infer_country_with_ollama(model, text):
    """Ask Ollama to infer a most-likely country the article is about.
    Returns a country name string or None if not found/confident.
    """
    if not model or not text:
        return None
    prompt = (
        "Read the following article text or URL and return the single country name that the article is primarily about. "
        "If no specific country is identifiable, reply with 'None'.\n\n" + (text or '')[:3000]
    )
    try:
        resp = call_ollama(model, prompt)
        if not resp:
            return None
        # Take first non-empty line and strip surrounding punctuation
        first = resp.splitlines()[0].strip()
        first = re.sub(r"[\.\,\;\:]$", '', first).strip()
        if not first or first.lower() in ('none', 'unknown', 'n/a', 'no country'):
            return None
        # Basic cleanup: if response contains parentheses or extra text, take leftmost token
        first = re.split(r"\(|,|-|/", first)[0].strip()
        # Capitalize nicely
        return first
    except Exception:
        return None


def parse_api_response(data, fallback_page=1):
    """Return (results_list, page_number, total_pages) from API response.
    Handles both the list-wrapped format and direct dict responses.
    """
    results = []
    page = fallback_page
    total_pages = 1
    if isinstance(data, list):
        # Find the element that contains searchResults and pagination metadata
        for elem in data:
            if isinstance(elem, dict) and 'searchResults' in elem:
                results = elem.get('searchResults', []) or []
                try:
                    page = int(elem.get('page') or fallback_page)
                except Exception:
                    page = fallback_page
                try:
                    total_pages = int(elem.get('total_pages') or 1)
                except Exception:
                    total_pages = 1
                break
    elif isinstance(data, dict):
        if 'searchResults' in data:
            results = data.get('searchResults', []) or []
            try:
                page = int(data.get('page') or fallback_page)
            except Exception:
                page = fallback_page
            try:
                total_pages = int(data.get('total_pages') or 1)
            except Exception:
                total_pages = 1
    return results, page, total_pages


def load_country_lookup():
    """Load the country lookup JSON (best-effort). Returns a list of country objects.
    The expected file is __scripts__/data/country_lookup.json relative to the repo root.
    """
    try:
        lookup_path = join(_repo_root, '__scripts__', 'data', 'country_lookup.json')
        if not os.path.exists(lookup_path):
            return []
        with open(lookup_path, 'r', encoding='utf-8') as fh:
            return json.load(fh)
    except Exception:
        return []


_country_lookup_cache = None

def infer_country_from_url(url):
    """Try to infer a country name from the article URL using the country lookup.
    Returns a country name string or None.
    """
    if not url:
        return None
    global _country_lookup_cache
    if _country_lookup_cache is None:
        _country_lookup_cache = load_country_lookup()
    s = url.lower()
    # Prefer exact matches on the first path segment (e.g., /jordan/publications/...)
    try:
        p = urlparse(url)
        path_parts = [seg for seg in p.path.split('/') if seg]
        if len(path_parts) > 0:
            first = path_parts[0].lower()
            for c in _country_lookup_cache:
                try:
                    name = (c.get('name') or '').lower()
                    iso3 = (c.get('iso3') or '').lower()
                    alt = [a.lower() for a in c.get('alt_names', []) if isinstance(a, str)]
                except Exception:
                    continue
                if first == name or first == iso3 or first in alt:
                    return c.get('name')
    except Exception:
        pass

    # Fallback: look for any country name/iso3/alt as a substring in the full URL
    for c in _country_lookup_cache:
        try:
            name = (c.get('name') or '').lower()
            iso3 = (c.get('iso3') or '').lower()
            alt = [a.lower() for a in c.get('alt_names', []) if isinstance(a, str)]
        except Exception:
            continue
        if name and name in s:
            return c.get('name')
        if iso3 and iso3 in s:
            return c.get('name')
        for a in alt:
            if a and a in s:
                return c.get('name')

    # As a last resort, try matching a couple of early path segments equal to country names
    try:
        p = urlparse(url)
        path_parts = [seg for seg in p.path.split('/') if seg]
        for part in path_parts[:3]:
            part_low = part.lower()
            for c in _country_lookup_cache:
                if part_low == (c.get('name') or '').lower() or part_low == (c.get('iso3') or '').lower():
                    return c.get('name')
    except Exception:
        pass

    return None


def get_continent(country_name):
    """Return continent name for a given country name/iso3/alt_name using lookup cache."""
    if not country_name:
        return None
    global _country_lookup_cache
    if _country_lookup_cache is None:
        _country_lookup_cache = load_country_lookup()
    try:
        cn = country_name.strip().lower()
    except Exception:
        return None
    for c in _country_lookup_cache:
        try:
            if cn == (c.get('name') or '').lower():
                return c.get('continent')
            if cn == (c.get('iso3') or '').lower():
                return c.get('continent')
            for a in c.get('alt_names', []):
                if isinstance(a, str) and cn == a.lower():
                    return c.get('continent')
        except Exception:
            continue
    return None


def process_results(results, ollama_model=None):
    """Process a list of API items and write markdown files for each."""
    ensure_pages_dir()
    for item in results:
        title = item.get('title')
        if title and title.strip():
            title = title.strip()
        else:
            html_content = item.get('html_content') or item.get('content')
            title = extract_title_from_html(html_content)

        if not title or not title.strip():
            if item.get('url'):
                title = fetch_page_title_from_url(item.get('url'))

        # First try to infer country from the article URL (fast, deterministic)
        if not item.get('country') and item.get('url'):
            inferred_url_country = infer_country_from_url(item.get('url'))
            if inferred_url_country:
                item['country'] = inferred_url_country
                print(f"Inferred country from URL for item id={item.get('id') or '?'} -> {inferred_url_country}")

        # If country is missing, try to infer it using Ollama (best-effort)
        if not item.get('country') and ollama_model:
            try:
                source_text = (item.get('html_content') or item.get('content') or item.get('url') or '')
                inferred = infer_country_with_ollama(ollama_model, source_text)
                if inferred:
                    item['country'] = inferred
                    print(f"Inferred country for item id={item.get('id') or '?'} -> {inferred}")
            except Exception:
                pass

        if not title or not title.strip():
            if ollama_model:
                print(f'Attempting Ollama title generation for item id={item.get("id") or "?"}')
                source_text = (item.get('html_content') or item.get('content') or item.get('url') or '')
                generated = call_ollama(ollama_model, f"Generate a short, descriptive title for this blog post:\n\n{source_text}")
                if generated:
                    title = generated.split('\n')[0].strip()

        if not title or not title.strip():
            domain = ''
            try:
                domain = urlparse(item.get('url', '')).hostname or ''
            except Exception:
                domain = ''
            title = f"Untitled blog post ({domain})" if domain else f"Untitled blog post ({item.get('id', '')})"

        insight = None
        if ollama_model and (item.get('html_content') or item.get('content')):
            try:
                insight = generate_insight_with_ollama(ollama_model, item.get('html_content') or item.get('content'))
            except Exception:
                insight = None

        md = compose_markdown(item, title, insight=insight)

        # If we have an AI-generated insight/summary, add it as an [[ai_summary:...]] tag
        # at the very top of the markdown file (matching generate_ollama_summaries.py behavior).
        if insight and isinstance(insight, str) and insight.strip():
            # Clean the insight to be single-line for the tag
            one_line = ' '.join(insight.splitlines()).strip()
            ai_tag = f"[[ai_summary:{one_line}]]\n\n"
            md = ai_tag + md

        # Filename selection: prefer safe title, then numeric id; only fallback to
        # a timestamped filename if neither is available. This avoids filenames
        # like `blog_unknown` or `blog_untitled`.
        if title and title.strip():
            basename = safe_filename(title)
            filename = join(PAGES_DIR, f"blog_{basename}.md")
        elif item.get('id'):
            filename = join(PAGES_DIR, f"blog_{str(item.get('id'))}.md")
        else:
            # Use domain + timestamp to create a unique fallback filename
            try:
                domain = urlparse(item.get('url', '')).hostname or 'missing'
            except Exception:
                domain = 'missing'
            ts = datetime.utcnow().strftime('%Y%m%d%H%M%S')
            filename = join(PAGES_DIR, f"blog_missing_{safe_filename(domain)}_{ts}.md")

        with open(filename, 'w', encoding='utf-8') as fh:
            fh.write(md)
            print('Wrote', filename)


def main(argv):
    token = None
    if len(argv) > 1:
        token = argv[1]
    else:
        token = os.getenv('BLOG_API_TOKEN')

    page_size = 30
    params = {
        'page_content_limit': page_size,
        'page': 1,
        'lab_relevance': 'true'
    }

    api_url = os.getenv('BLOG_API_URL', API_DEFAULT)

    print('Fetching blog API:', api_url)

    # Default Ollama model to 'llama3.2' unless overridden in env
    ollama_model = os.getenv('OLLAMA_MODEL', 'llama3.2')

    current_page = 1
    while True:
        params['page'] = current_page
        try:
            data = api_fetch(api_url, token=token, params=params)
        except Exception as e:
            print('Stopping due to API error:', e)
            return

        results, page, total_pages = parse_api_response(data, fallback_page=current_page)
        print(f'Fetched page {page} / {total_pages} — {len(results)} items')

        if not results:
            print('No more results; finishing.')
            break

        process_results(results, ollama_model=ollama_model)

        if page >= total_pages:
            print('All pages fetched.')
            break
        current_page = page + 1


if __name__ == '__main__':
    main(sys.argv)
