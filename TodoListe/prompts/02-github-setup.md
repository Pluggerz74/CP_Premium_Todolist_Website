# Prompt 02: GitHub Setup

```txt
You are a Senior Full-Stack Web Developer and Git workflow expert.

Connect this project to GitHub safely.

Local project path:
C:\Users\lucak\Desktop\TodoListe

Project structure already contains:
- src/
- docs/
- prompts/
- .cursor/rules/
- package.json
- vite.config.ts
- .gitignore

Important project context:
This project is evolving into a premium Project Command Center with Simple Mode and Complex Project Mode. It may contain planning docs, prompt docs, architecture docs, and template definitions for game development and other large projects. These should be committed. Generated build output and dependencies should not be committed.

Tasks:
1. Open the terminal in the local project path.
2. Check whether this folder is already a Git repository.
3. If it is not a Git repository, run git init.
4. Rename the branch to main.
5. Inspect .gitignore and make sure these are ignored:
   - node_modules
   - dist
   - build
   - .env
   - .env.local
   - logs
   - cache folders
   - system files
6. Do not commit secrets.
7. Do not commit generated dist files.
8. Do not commit node_modules.
9. Run git status.
10. Stage all relevant source, docs, prompts, and configuration files.
11. Commit with this message:
    Initial commit: premium project command center
12. Check whether remote origin already exists.
13. If origin exists, show it and do not overwrite it without confirmation.
14. If origin does not exist, ask me for the GitHub remote URL.
15. After the remote is configured, push main to GitHub with upstream tracking.
16. Show final git status and git remote -v.

Important:
Never commit node_modules, dist, environment files, secrets, or local machine credentials.
```

---
