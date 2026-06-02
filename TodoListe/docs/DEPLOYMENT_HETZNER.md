# Hetzner Webhosting Deployment — High Value Todo

Static deployment guide for subdirectory hosting at **`/todolist/`**.

## Overview

| Item | Value |
|------|-------|
| Build tool | Vite + React + TypeScript |
| Vite base path | `/todolist/` |
| Server upload path | `Home/public_html/todolist` |
| Public URL | `https://your-domain.example/todolist/` |
| Backend | None (v1 is local-first; data lives in the browser) |

## Prerequisites

- Node.js **20+** on your local machine
- FTP/SFTP or Hetzner file manager access to `Home/public_html/`
- Git clone or local copy of this project at `TodoListe/TodoListe/`

## 1. Build locally

From the **app root** (`TodoListe/TodoListe/`):

```powershell
cd C:\Users\lucak\Desktop\TodoListe\TodoListe
npm install
npm run typecheck
npm run build
```

Expected output folder: **`dist/`**

Do **not** upload `node_modules`, `src/`, `prompts/`, `docs/`, or the project root — only the **contents** of `dist/`.

## 2. What to upload

Upload **everything inside `dist/`**, not the `dist` folder itself.

After build, `dist/` typically contains:

```txt
dist/
  index.html
  favicon.svg
  manifest.webmanifest
  .htaccess
  assets/
    index-XXXXXXXX.js
    index-XXXXXXXX.css
```

### Correct server structure

```txt
Home/public_html/todolist/index.html
Home/public_html/todolist/favicon.svg
Home/public_html/todolist/manifest.webmanifest
Home/public_html/todolist/.htaccess
Home/public_html/todolist/assets/index-XXXXXXXX.js
Home/public_html/todolist/assets/index-XXXXXXXX.css
```

### Wrong (common mistake)

```txt
Home/public_html/todolist/dist/index.html   ← wrong: extra dist/ nesting
```

## 3. Upload target

| Local source | Remote target |
|--------------|---------------|
| `dist/*` (all files and folders inside dist) | `Home/public_html/todolist/` |

Create the `todolist` folder under `public_html` if it does not exist.

## 4. Vite base path (required)

`vite.config.ts` must keep:

```ts
base: "/todolist/"
```

This ensures production `index.html` references assets as:

```html
<script type="module" src="/todolist/assets/index-....js"></script>
<link rel="stylesheet" href="/todolist/assets/index-....css">
```

`public/manifest.webmanifest` uses `/todolist/` for `start_url` and icon paths.

## 5. Verify locally before upload

### Dev server

```powershell
npm run dev
```

Open: [http://localhost:5173/todolist/](http://localhost:5173/todolist/)

### Production preview

```powershell
npm run preview
```

Open: [http://localhost:4173/todolist/](http://localhost:4173/todolist/)

Smoke test: Dashboard, Settings, theme toggle, create a task, switch Simple/Complex mode.

## 6. Verify live site after upload

1. Open `https://your-domain.example/todolist/`
2. Confirm the page loads (not blank)
3. Open browser DevTools → Network — asset requests should be **`/todolist/assets/...`** with **200** status
4. Toggle light/dark theme
5. Open Settings — confirm backup download works
6. Create a task and refresh — data should persist via **localStorage** (browser-local)

## 7. Data & storage notes (v1)

- **localStorage is browser-local** — not synced to the server
- Each browser/device has its own data
- Clearing site data removes projects/tasks unless you downloaded a backup
- **Reload demo data** in Settings restores the bundled demo seed
- Very large projects (thousands of tasks) may hit browser quota; use **Download backup** and plan future IndexedDB/backend migration
- No credentials, `.env` files, or secrets belong on the web server

## 8. Dev-only features (not in production)

**Development scale test** (Settings → load ~1,200 tasks) is gated with `import.meta.env.DEV` and is **stripped from production builds**. It does not appear on Hetzner.

## 9. `.htaccess` (Apache / Hetzner)

`public/.htaccess` is copied into `dist/` on build. It:

- Serves real files (`assets/`, `favicon.svg`, etc.) directly
- Falls back to `index.html` for unknown paths (future client-side routes)
- Sets `no-cache` on `index.html` so new hashed assets load after redeploy

If the site loads but deep links 404 after adding routing later, confirm `.htaccess` uploaded and `mod_rewrite` is enabled on the host.

## 10. Common problems

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| Blank white page | Wrong `base` path | Ensure `base: "/todolist/"` and rebuild |
| Assets 404 (`/assets/...` instead of `/todolist/assets/...`) | Missing or wrong base | Rebuild; verify `dist/index.html` asset URLs |
| Site at wrong URL | Uploaded to wrong folder | Move files to `public_html/todolist/` |
| `index.html` 404 | Uploaded `dist` folder instead of contents | Upload **inside** of `dist/`, not the folder wrapper |
| Old UI after deploy | Browser or CDN cache | Hard refresh (Ctrl+Shift+R); clear cache; redeploy all `assets/` |
| Empty app / demo missing | Old localStorage on that browser | Settings → Reload demo data |
| Data “lost” after browser cleanup | localStorage cleared | Restore from backup JSON if exported |

## 11. Rollback

1. Keep a copy of the previous `dist/` output (or download current `public_html/todolist/` before overwrite)
2. Re-upload the previous `index.html`, `assets/`, and `.htaccess`
3. Hard-refresh the browser

## 12. Deployment checklist

- [ ] `npm run typecheck` passes
- [ ] `npm run build` passes
- [ ] `dist/index.html` references `/todolist/assets/...`
- [ ] `dist/assets/` contains hashed JS and CSS
- [ ] `dist/.htaccess` present
- [ ] No `.env`, source maps, or secrets in `dist/`
- [ ] Uploaded **contents** of `dist/` to `Home/public_html/todolist/`
- [ ] Live URL loads at `/todolist/`
- [ ] Network tab shows 200 for assets
- [ ] Theme toggle and task create work
- [ ] Backup download works in Settings

## 13. Do not upload

- `node_modules/`
- `src/`
- `prompts/`
- `docs/` (unless you intentionally want docs on the server)
- `.env` / `.env.*`
- Git metadata (`.git/`)
- Unbuilt project files

## 14. Future SaaS migration

When adding auth and a backend, replace localStorage with API persistence. Until then, treat Hetzner as **static file hosting only**.
