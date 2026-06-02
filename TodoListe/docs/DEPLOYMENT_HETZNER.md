# Hetzner Webhosting Deployment — High Value Todo

Static deployment guide for **High Value Todo** on Hetzner Webhosting.

## Current intended setup: subdomain deployment

| Item | Value |
|------|-------|
| **Production domain** | [https://todolist.codingplugs.de/](https://todolist.codingplugs.de/) |
| **Deployment mode** | **Subdomain root** — app at domain root, not under `/todolist/` |
| **Vite base path** | `/` |
| **Hetzner upload path** | `Home/public_html/todolist` |
| **Why the folder is still named `todolist`** | Hetzner maps subdomain `todolist.codingplugs.de` to that folder as its **document root** |
| **Backend** | None (v1 is local-first; data lives in the browser) |

### Domain status (2026-06-02)

The app was **manually uploaded** to `Home/public_html/todolist`, but **https://todolist.codingplugs.de/ is not live yet** due to a **billing issue** on the hosting account. DNS/hosting must be active before the live site can be verified.

### Important: rebuild required after base path change

Agent 05 originally configured **subdirectory** deployment (`base: "/todolist/"`). The final production target is **subdomain root** (`base: "/"`).

If you previously uploaded a build with `/todolist/` asset paths, that build will **break** on `https://todolist.codingplugs.de/` because the browser would request:

```txt
https://todolist.codingplugs.de/todolist/assets/...   ← wrong for subdomain root
```

**You must rebuild and re-upload** the new `dist/` contents after this change.

---

## Deployment modes compared

### A. Subdomain deployment (current intended setup)

Use when the subdomain document root **is** the app folder.

| Setting | Value |
|---------|-------|
| Public URL | `https://todolist.codingplugs.de/` |
| Server folder | `Home/public_html/todolist/` (document root of subdomain) |
| Vite `base` | `/` |
| Asset URLs | `/assets/index-....js` |
| Local dev/preview | `http://localhost:5173/` and `http://localhost:4173/` |

Users visit the app at the **domain root**. Do **not** require `https://todolist.codingplugs.de/todolist/`.

### B. Subdirectory deployment (alternative, not current)

Use only if the app is served **under a path** on a main domain, e.g. `https://codingplugs.de/todolist/`.

| Setting | Value |
|---------|-------|
| Public URL | `https://codingplugs.de/todolist/` |
| Server folder | `Home/public_html/todolist/` (subfolder under main site root) |
| Vite `base` | `/todolist/` |
| Asset URLs | `/todolist/assets/index-....js` |
| Local dev/preview | `http://localhost:5173/todolist/` |

To switch to this mode, change `vite.config.ts` to `base: "/todolist/"`, update `public/manifest.webmanifest` and `public/.htaccess` (`RewriteBase /todolist/`), rebuild, and re-upload.

---

## Prerequisites

- Node.js **20+** on your local machine
- FTP/SFTP or Hetzner file manager access to `Home/public_html/todolist`
- Git clone or local copy at `TodoListe/TodoListe/`

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

### After every new build

Always **re-upload the full contents of `dist/`** (all files and folders inside `dist/`, not the `dist` wrapper). Hashed asset filenames change on each build; partial uploads leave stale JS/CSS and cause blank pages or 404s.

**Real live smoke test** on [https://todolist.codingplugs.de/](https://todolist.codingplugs.de/) remains **pending** until Hetzner billing/DNS is active (see Domain status above). Use local `npm run preview` at [http://localhost:4173/](http://localhost:4173/) until then.

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

### Correct server structure (subdomain deployment)

```txt
Home/public_html/todolist/index.html
Home/public_html/todolist/favicon.svg
Home/public_html/todolist/manifest.webmanifest
Home/public_html/todolist/.htaccess
Home/public_html/todolist/assets/index-XXXXXXXX.js
Home/public_html/todolist/assets/index-XXXXXXXX.css
```

When DNS is live, these files are served at:

```txt
https://todolist.codingplugs.de/
https://todolist.codingplugs.de/assets/...
```

### Wrong (common mistakes)

```txt
Home/public_html/todolist/dist/index.html     ← extra dist/ nesting
https://todolist.codingplugs.de/todolist/     ← wrong URL for subdomain root setup
```

## 3. Upload target

| Local source | Remote target |
|--------------|---------------|
| `dist/*` (all files and folders inside dist) | `Home/public_html/todolist/` |

The folder name `todolist` on the server is correct — it is the **document root** for the subdomain, not a URL path segment.

## 4. Vite base path (subdomain deployment)

`vite.config.ts` must use:

```ts
base: "/"
```

Production `index.html` should reference assets as:

```html
<script type="module" src="/assets/index-....js"></script>
<link rel="stylesheet" href="/assets/index-....css">
<link rel="icon" href="/favicon.svg">
```

`public/manifest.webmanifest` uses `/` for `start_url` and `/favicon.svg` for the icon.

## 5. Verify locally before upload

### Dev server

```powershell
npm run dev
```

Open: [http://localhost:5173/](http://localhost:5173/)

### Production preview

```powershell
npm run preview
```

Open: [http://localhost:4173/](http://localhost:4173/)

Smoke test: Dashboard, Settings, theme toggle, create a task, switch Simple/Complex mode.

## 6. Verify live site after billing/DNS is resolved

1. Open [https://todolist.codingplugs.de/](https://todolist.codingplugs.de/)
2. Confirm the page loads (not blank)
3. DevTools → Network — asset requests should be **`/assets/...`** with **200** status (not `/todolist/assets/...`)
4. Toggle light/dark theme
5. Settings → confirm backup download works
6. Create a task and refresh — data persists via **localStorage** (browser-local)

## 7. Data & storage notes (v1)

- **localStorage is browser-local** — not synced to the server
- Each browser/device has its own data
- Clearing site data removes projects/tasks unless you downloaded a backup
- **Reload demo data** in Settings restores the bundled demo seed
- Very large projects may hit browser quota; use **Download backup**
- No credentials, `.env` files, or secrets belong on the web server

## 8. Dev-only features (not in production)

**Development scale test** (Settings → load ~1,200 tasks) is gated with `import.meta.env.DEV` and is **stripped from production builds**.

## 9. `.htaccess` (Apache / Hetzner)

`public/.htaccess` is copied into `dist/` on build. For subdomain root deployment it uses `RewriteBase /`:

- Serves real files (`assets/`, `favicon.svg`, etc.) directly
- Falls back to `index.html` for unknown paths (future client-side routes)
- Sets `no-cache` on `index.html` after redeploy

Confirm `.htaccess` uploaded — some FTP clients hide dotfiles.

## 10. Common problems

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| Blank white page | Old `/todolist/` build on subdomain root | Rebuild with `base: "/"` and re-upload all `dist/` contents |
| Assets 404 at `/todolist/assets/...` | Subdirectory build on subdomain | Rebuild with `base: "/"`; verify `dist/index.html` uses `/assets/...` |
| Assets 404 at `/assets/...` | Files missing or wrong folder | Upload full `dist/` contents to `Home/public_html/todolist/` |
| Site only works at `/todolist/` path | Wrong hosting mapping or old build | Confirm subdomain points to folder as document root; use subdomain build |
| `index.html` 404 | Uploaded `dist` folder instead of contents | Upload **inside** of `dist/`, not the wrapper folder |
| Old UI after deploy | Browser cache | Hard refresh (Ctrl+Shift+R); redeploy all `assets/` |
| Domain not reachable | Billing/DNS not active | Resolve Hetzner billing; confirm subdomain DNS |

## 11. Rollback

1. Keep a copy of the previous `dist/` output before overwrite
2. Re-upload previous `index.html`, `assets/`, and `.htaccess`
3. Hard-refresh the browser

## 12. Deployment checklist (subdomain)

- [ ] Billing/DNS active for `todolist.codingplugs.de`
- [ ] `npm run typecheck` passes
- [ ] `npm run build` passes
- [ ] `dist/index.html` references `/assets/...` (not `/todolist/assets/...`)
- [ ] `dist/assets/` contains hashed JS and CSS
- [ ] `dist/.htaccess` present with `RewriteBase /`
- [ ] No `.env`, source maps, or secrets in `dist/`
- [ ] Uploaded **contents** of `dist/` to `Home/public_html/todolist/`
- [ ] Live URL loads at `https://todolist.codingplugs.de/` (domain root)
- [ ] Network tab shows **200** for `/assets/*`
- [ ] Theme toggle and task create work
- [ ] Backup download works in Settings

## 13. Do not upload

- `node_modules/`
- `src/`
- `prompts/`
- `docs/` (unless intentional)
- `.env` / `.env.*`
- Git metadata (`.git/`)
- Unbuilt project files

## 14. Future SaaS migration

When adding auth and a backend, replace localStorage with API persistence. Until then, treat Hetzner as **static file hosting only**.
