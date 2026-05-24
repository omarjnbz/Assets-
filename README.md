# asset.archive

A personal CDN for your images, video, and other static assets — hosted free on **GitHub** + **jsDelivr**, with a built-in gallery UI to browse and copy URLs.

```
push file → action rebuilds manifest → gallery shows it → copy CDN url → paste anywhere
```

No server, no database, no upload UI — just `git push` and your asset is live with a permanent, fast, cached URL.

---

## What you get

- **Assets served from a global CDN** — every file in `assets/` is automatically reachable at:
  ```
  https://cdn.jsdelivr.net/gh/<you>/<repo>@main/assets/images/your-file.jpg
  ```
  jsDelivr caches aggressively on 1000+ POPs worldwide. Free, no auth, no rate limits for normal use.

- **A gallery UI** at `https://<you>.github.io/<repo>/` that lets you browse, search, filter, and copy URLs (direct, Markdown, HTML embed, or raw GitHub).

- **An auto-generated `manifest.json`** rebuilt on every push by a GitHub Action — so the gallery always reflects what's actually in the repo.

---

## Setup (5 minutes)

### 1. Create the repo
Create a new public GitHub repo and push these files to `main`.

### 2. Enable GitHub Pages
- Go to **Settings → Pages**
- Source: **Deploy from a branch**
- Branch: **main** / folder: **/ (root)**
- Save. Wait ~30 sec for the first build.

Your gallery will be live at `https://<you>.github.io/<repo>/`.

### 3. Give the Action permission to commit
- Go to **Settings → Actions → General**
- Under **Workflow permissions**, select **Read and write permissions**
- Save.

(This lets the workflow commit the regenerated `manifest.json` back to the repo.)

### 4. Drop in your first file

```bash
cp ~/Pictures/cat.jpg assets/images/
git add . && git commit -m "first asset" && git push
```

Within ~30 sec the Action runs, `manifest.json` updates, and the gallery shows the file.

---

## Using your assets

Once a file is in the repo, you have URLs for it immediately:

| Format    | Use for                                       |
|-----------|-----------------------------------------------|
| **CDN**   | Embedding anywhere on the web (recommended)   |
| **Raw**   | Direct GitHub link, no CDN cache              |
| **Markdown** | Pasting into READMEs, blog posts, Notion   |
| **HTML**  | Pasting into web pages                        |

Click any asset in the gallery and choose your format — one tap to copy.

### Example
```html
<!-- works on any site, anywhere -->
<img src="https://cdn.jsdelivr.net/gh/yourname/asset-cdn@main/assets/images/cat.jpg" />
```

### Cache busting
jsDelivr aggressively caches by branch tag. If you overwrite a file with the same name and need the CDN to refresh, either:
- **Tag a version**: replace `@main` with `@v2` after creating a `v2` tag, or
- **Purge**: visit `https://purge.jsdelivr.net/gh/<you>/<repo>@main/<path>` once.

For new files, no purge is needed — they're served fresh on first request.

---

## Folder layout

```
asset-cdn/
├── assets/                  ← drop your files here
│   ├── images/
│   ├── videos/
│   └── other/
├── scripts/
│   └── build-manifest.js    ← walks assets/, writes manifest.json
├── .github/workflows/
│   └── build-manifest.yml   ← runs the script on every push
├── index.html               ← the gallery (served by GitHub Pages)
└── manifest.json            ← auto-generated, do not edit by hand
```

You can nest folders inside `assets/` however you like — the script walks recursively.

---

## Running locally

You don't have to — pushing is enough. But if you want to preview the manifest without pushing:

```bash
node scripts/build-manifest.js
```

To preview the gallery, serve the directory with any static server:

```bash
npx serve .
# → http://localhost:3000
```

---

## Limits to know about

- **jsDelivr** is intended for open-source / public assets. Don't put anything private here. The repo is public; the CDN URL is public.
- **Per-file limit on GitHub**: 100 MB. For larger files you'd need Git LFS, which isn't covered here (you said small clips, so this should be fine).
- **Soft repo size**: GitHub recommends keeping repos under 1 GB. Plenty of room for thousands of images and short clips.
- **No deletes from CDN cache**: once a URL is requested at a given commit, jsDelivr caches the bytes. Renaming a file gives you a new URL; the old one keeps serving the old bytes until cache eviction.

---

## Customizing

- **Gallery aesthetic** lives entirely in `index.html` — CSS variables at the top control the palette.
- **Type detection** is by extension in `scripts/build-manifest.js` — add new extensions to the `IMAGE_EXTS` / `VIDEO_EXTS` / `AUDIO_EXTS` sets if needed.
- **Manifest schema** is plain JSON, so you can consume it from anywhere — a Notion integration, a CLI, a dashboard, whatever.

---

## License

Yours to use, modify, fork. Drop the credit line in the footer if you want, or rip it out.
