# High Value Todo

A premium Apple-like project command center for managing high-value tasks across active projects.

## USP

Classic todo apps help you store tasks. This app helps you decide what matters most now.

The first version calculates a simple high-value score:

```txt
highValueScore = impact + urgency - effort
```

The product direction is a calm, focused, high-end SaaS dashboard that can start as a personal productivity system and later become a full SaaS product.

## Tech Stack

- React
- TypeScript
- Vite
- CSS architecture with global tokens
- localStorage persistence for version 1
- Static hosting on Hetzner

## Local Development

```bash
npm install
npm run dev
```

## Typecheck

```bash
npm run typecheck
```

## Production Build

```bash
npm run build
```

Upload the contents of `dist/` to:

```txt
Home/public_html/todolist
```

Production URL: [https://todolist.codingplugs.de/](https://todolist.codingplugs.de/) (subdomain root deployment).

The app is configured with this Vite base path:

```ts
base: "/"
```

See `docs/DEPLOYMENT_HETZNER.md` for subdomain vs subdirectory deployment notes.

## Cursor Workflow

Use the prompts inside `/prompts` with Cursor Composer 2.5.

Recommended order:

1. `prompts/01-initial-build.md`
2. `prompts/02-github-setup.md`
3. `prompts/03-ui-polish.md`
4. `prompts/04-state-and-localstorage.md`
5. `prompts/05-hetzner-deployment.md`
6. `prompts/06-quality-review.md`
7. `prompts/07-future-saas-migration.md`

## Project Structure

```txt
src/
  assets/
  components/
  config/
  constants/
  data/
  features/
  hooks/
  styles/
  types/
  utils/
```

## Git Workflow

```bash
git add .
git commit -m "Describe what changed"
git push
```
