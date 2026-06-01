# Prompt 05: Hetzner Deployment Preparation

```txt
You are a Senior Full-Stack Web Developer with static deployment and Vite production experience.

Prepare this Vite React TypeScript app for static deployment on Hetzner Webhosting.

Local project path:
C:\Users\lucak\Desktop\TodoListe

Deployment target:
Home/public_html/todolist

Important:
The app is hosted in a subdirectory, not at the domain root.

Product context:
The app is a local-first Project Command Center with Simple Mode and Complex Project Mode. It may contain many todos locally in the browser. Version 1 is static and uses browser storage. There is no backend yet.

Tasks:
1. Verify vite.config.ts contains:
   base: "/todolist/"
2. Verify public/manifest.webmanifest uses /todolist/ paths where needed.
3. Run npm run build.
4. Inspect the dist output.
5. Confirm that only the contents of dist should be uploaded to:
   Home/public_html/todolist
6. Update docs/DEPLOYMENT_HETZNER.md if anything is missing.
7. Document that localStorage data is browser-local and not server-synced in version 1.
8. Document that very large projects may require export/import or future backend migration.
9. Do not change the app into a backend app.
10. Do not upload anything automatically unless I explicitly ask.

Expected server structure after upload:
Home/public_html/todolist/index.html
Home/public_html/todolist/assets/...

Deployment notes to document:
- Upload the contents of dist, not the whole project folder.
- Keep source code and node_modules off the web server public folder.
- localStorage data stays in the user's browser.
- Clearing browser data can remove local project data unless export/import exists later.
- For SaaS later, data must move to a backend database.

After changes:
1. Run npm run typecheck.
2. Run npm run build.
3. Commit with a clear message, for example:
   Prepare Hetzner deployment for local-first project command center
```

---
