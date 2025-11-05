# SDG Innovation Commons — R&D Archive

This repository contains the UNDP Accelerator Labs R&D Archive site: markdown pages, generation scripts and a small client-side renderer that displays project documentation and audio waveforms.

**Live archive:** https://undp-accelerator-labs.github.io/sdg-innovation-commons/registries/

This project consists of:

- `pages/` — generated and hand-written markdown pages served by the frontend.
- `public/` — static assets (JS, CSS, data) used by the client renderer.
- `registries/` — generated registry index pages and HTML templates.
- `__scripts__/` — Python helper scripts used to generate markdown and registries from JSON sources.

Quick start (local)

1. Generate pages (optional if pages/ already present):

   - Requires Python 3 and these packages: Pillow, beautifulsoup4, requests
   - From the repo root:
     ```bash
     pip install Pillow beautifulsoup4 requests
     python __scripts__/render_md.py
     python __scripts__/compile_registry.py
     ```
   - These scripts create/refresh `pages/` and `registries/` content used by the site.

2. Serve the project locally (simple static server):
   - From the repo root run:
     ```bash
     python -m http.server 8000
     # then open http://localhost:8000 in your browser
     ```
   - Or use your preferred dev server (e.g. live-server, http-server).

Client features

- The client JS (in `public/js`) fetches markdown from `pages/` and renders it into the page.
- Pages can include metadata tags in the form `[[key:value]]` which are parsed into the cartouche and registry menus.
- Audio support: pages may contain `[[audio:https://.../file.m4a]]` tags. The renderer will create an audio player and waveform visualization when present.
- Timestamp tokens like `[[00:19]]` are preserved and converted into clickable jump buttons that advance the audio player.

Deployment / important note

Important: this repository uses two distinct codebases on separate branches:

- `main` — the source code for the SDG Commons platform (development work). This branch contains the platform code and should NOT be treated as the static archive that GitHub Pages serves.
- `gh-pages` — the static archive that is published to GitHub Pages. The `gh-pages` branch contains the built static site (generated markdown/pages and assets) and is the branch actually served by GitHub Pages for this repository.

Because these are different codebases, you should not attempt to deploy the platform from `main` directly to gh-pages. If you need to update the archived site that GitHub Pages serves, make or generate the content intended for the archive and push it to the `gh-pages` branch (or use a workflow that runs on the branch that holds the archive source). The generation scripts in `__scripts__/` are used to create the static content that belongs on the `gh-pages` branch; take care to run them in the correct branch/context before publishing.

If a workflow named `.github/workflows/deploy.yml` exists in this repository, confirm which branch it is designed to run on before using it — the archive workflow must run against the archive's source branch, not against `main` if `main` is the live platform repo.

Notes & troubleshooting

- If pages return 404 on GitHub Pages, the site may be served under a repo subpath (e.g. `https://undp-accelerator-labs.github.io/sdg-innovation-commons/registries/`). The renderer attempts to detect this automatically, but clear the browser cache or hard-refresh after deploy.
- Audio files hosted on external storage must allow CORS requests (or be referenced via absolute URLs). Absolute `https://...` audio URLs are respected; internal paths are resolved under `/pages/`.
- Missing favicon 404 is harmless but add a `favicon.ico` to `public/` to remove the console warning.

Contributing

- Add or update source JSON or markdown under `__scripts__` input directories, then run the Python scripts to regenerate `pages/` and `registries/`.
- Test locally with the static server and submit a PR. The Action will regenerate and deploy the site when merged.

Contact

- This repository is maintained by the UNDP Accelerator Labs team.
