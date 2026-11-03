# Mayookha’s Portfolio

A React + TypeScript portfolio built with Vite. The repository root contains `package.json`, `vite.config.ts`, `index.html`, `src/`, and `public/`.

## Requirements

- Node.js 20.19 or newer (Node.js 22 recommended)
- npm 10 or newer

## Install and run locally

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

The production site is generated in `dist/`. The build also validates the portfolio's image/PDF references and confirms that the Hostinger `.htaccess` file is copied into the output.

## Hostinger deployment

For Hostinger Git deployment, connect the repository's `main` branch and set the project / repository root to the directory containing this `package.json` file. Do not select `src/` or `public/` as the project root.

| Hostinger setting | Value |
| --- | --- |
| Framework / preset | Vite (or Other, with custom commands) |
| Node.js version | 22.x (20.19+ minimum) |
| Install command | `npm install` |
| Build command | `npm run build` |
| Publish / output directory | `dist` |

Upload the **contents** of `dist/` to the website's document root when using manual file deployment. Do not upload the source project as the live document root. The `public/.htaccess` file is copied automatically to `dist/.htaccess` by Vite and provides Apache/LiteSpeed SPA routing and PDF handling.
