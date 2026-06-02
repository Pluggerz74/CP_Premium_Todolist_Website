# Agent 05B — Prompt Report

**Agent:** Agent 05B (Subdomain Deployment Alignment)  
**Project:** High Value Todo  
**Project root:** `C:\Users\lucak\Desktop\TodoListe\TodoListe`  
**Git root:** `C:\Users\lucak\Desktop\TodoListe`  
**Behavior rules followed:** `prompts/cursor-rule-update-senior-fullstack-behavior.md`  
**Planning source:** `docs/MEGA_TODO_PLANNING.md`  
**Date:** 2026-06-02  
**Status:** Complete — config aligned for subdomain; **not deployed automatically**

---

## 1. Reports Read Before Implementation

| Report | Key takeaways used |
|--------|-------------------|
| **AGENT-01-REPORT.md** | Full MVP; initial Vite `base: "/todolist/"` for subdirectory hosting |
| **AGENT-02-REPORT.md** | Git root at parent; app under `TodoListe/`; GitHub remote configured |
| **AGENT-03-REPORT.md** | Premium UI polish; VirtualList and performance preserved |
| **AGENT-04-REPORT.md** | Storage hardening, schema v2, TaskIndex, backup utilities — preserved |
| **AGENT-05-REPORT.md** | Subdirectory deployment prep: `.htaccess`, docs, `base: "/todolist/"`, manual upload to `Home/public_html/todolist` |
| **AGENT-06-REPORT.md** | Metadata UI fixes, dev-only scale test, build/typecheck passed |

**Conflict resolved:** Agent 05 configured **subdirectory** deployment (`/todolist/` URL path). Final production domain is **subdomain root** (`https://todolist.codingplugs.de/`). Technical reason: when `todolist.codingplugs.de` maps to `Home/public_html/todolist` as document root, Vite must use `base: "/"` so assets load from `/assets/...`, not `/todolist/assets/...`.

---

## 2. Final Planned Production Domain

**https://todolist.codingplugs.de/**

Not: `https://codingplugs.de/todolist/`

---

## 3. Deployment Mode Decision

| Mode | Selected? | Notes |
|------|-----------|-------|
| **Subdomain root** | **Yes (current intended)** | Subdomain document root = `Home/public_html/todolist` |
| Subdirectory | No (documented as alternative) | Would require `base: "/todolist/"` on main domain |

---

## 4. Vite Base Path Before

```ts
base: "/todolist/"
```

---

## 5. Vite Base Path After

```ts
base: "/"
```

---

## 6. .htaccess Decision

**Updated** `public/.htaccess`:

- Changed `RewriteBase /todolist/` → `RewriteBase /`
- Comments updated for subdomain root at `https://todolist.codingplugs.de/`
- Still serves existing files first; SPA fallback to `index.html`
- Still sets `no-cache` on `index.html`

Copied to `dist/.htaccess` on build.

---

## 7. Files Changed

### Updated

```txt
vite.config.ts
public/.htaccess
public/manifest.webmanifest
src/config/app.ts
.env.example
docs/DEPLOYMENT_HETZNER.md
README.md
```

### Created

```txt
Agent-Promptreport/AGENT-05B-REPORT.md
```

### Not committed

```txt
dist/   (regenerate locally with npm run build before upload)
```

---

## 8. Build Result

**Passed**

```txt
vite v7.3.5 building for production...
dist/index.html                   0.70 kB
dist/assets/index-DS1sSe6x.css   24.38 kB
dist/assets/index-yT3D-j7G.js   269.85 kB
✓ built in ~2s
```

---

## 9. Typecheck Result

**Passed** — `tsc -b` with no errors.

---

## 10. Preview Result

**Passed**

```txt
npm run preview
➜  Local:   http://localhost:4173/
```

Verified:

- `GET http://localhost:4173/` → **200**, HTML references `/assets/...`

---

## 11. dist Asset Path Inspection Result

| Check | Result |
|-------|--------|
| `dist/index.html` script src | `/assets/index-yT3D-j7G.js` |
| `dist/index.html` stylesheet | `/assets/index-DS1sSe6x.css` |
| Favicon | `/favicon.svg` |
| Manifest | `/manifest.webmanifest` |
| Manifest `start_url` | `/` |
| `.htaccess` in dist | Yes, `RewriteBase /` |
| `.env` in dist | None |
| Source maps | None |

**Correct for subdomain root deployment at https://todolist.codingplugs.de/**

---

## 12. Exact Upload Instructions for Hetzner

1. Resolve billing so `todolist.codingplugs.de` is reachable.

2. Build locally:

   ```powershell
   cd C:\Users\lucak\Desktop\TodoListe\TodoListe
   npm run build
   ```

3. Upload **all contents inside `dist/`** to:

   ```txt
   Home/public_html/todolist/
   ```

   Files to upload:

   - `index.html`
   - `favicon.svg`
   - `manifest.webmanifest`
   - `.htaccess`
   - `assets/` (entire folder)

4. **Replace** any previously uploaded subdirectory build (old `/todolist/assets/` paths will not work on subdomain root).

5. Visit **https://todolist.codingplugs.de/** (not `/todolist/`).

6. DevTools → Network: confirm `/assets/*` returns **200**.

---

## 13. Remaining Risks

1. **Billing/DNS not active** — domain offline until Hetzner billing resolved
2. **Stale upload on server** — previously uploaded `/todolist/` build will show blank page or asset 404s until re-uploaded
3. **Hidden `.htaccess`** — confirm dotfile uploaded via FTP
4. **localStorage** — browser-local only; no server sync
5. **Browser cache** — hard refresh after redeploy
6. **Wrong mode confusion** — subdirectory docs from Agent 05 are superseded for production; use subdomain checklist in updated docs

---

## 14. Next Manual Deployment Step After Billing Issue Is Resolved

1. Run `npm run build` locally
2. Upload fresh `dist/` **contents** to `Home/public_html/todolist/`
3. Open https://todolist.codingplugs.de/
4. Smoke test: load app, theme toggle, create task, Settings backup, Echo Realms Project Map
5. Confirm no requests to `/todolist/assets/...`

---

## Agent Compliance Checklist

- [x] Read behavior rules and all Agent reports (01–06, 05)
- [x] Read `MEGA_TODO_PLANNING.md`
- [x] Aligned Vite base to `/` for subdomain root
- [x] Updated `.htaccess` and manifest
- [x] Updated deployment docs (subdomain vs subdirectory)
- [x] Documented billing/domain status and rebuild warning
- [x] `npm install`, `typecheck`, `build`, `preview` passed
- [x] Did not deploy automatically
- [x] Did not remove features, modes, storage hardening, or metadata fixes
- [x] Did not commit `dist/`, secrets, or `node_modules`
- [x] Commit and push from Git root

---

*End of Agent 05B report.*
