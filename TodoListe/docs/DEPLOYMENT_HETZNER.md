# Hetzner Deployment

## Target Path

```txt
Home/public_html/todolist
```

## Build Locally

```bash
npm install
npm run build
```

## Upload

Upload only the contents of the `dist` folder to:

```txt
Home/public_html/todolist
```

Correct server structure:

```txt
Home/public_html/todolist/index.html
Home/public_html/todolist/assets/...
```

## Important Vite Setting

The production base path is configured in `vite.config.ts`:

```ts
base: "/todolist/"
```

This is required because the app is hosted in a subdirectory instead of the domain root.
