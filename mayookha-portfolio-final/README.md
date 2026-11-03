# Mayookha’s Portfolio

React + TypeScript portfolio built with Vite.

## Requirements

- Node.js 20.19 or newer (Node.js 22 recommended)
- npm 10 or newer

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

The production site is generated in `dist/`. The build validates portfolio assets, runs Vite, repairs the Hostinger configuration if needed, and validates the final output.

## Hostinger deployment

Configure Hostinger with:

| Setting | Value |
| --- | --- |
| Project / repository root | The directory containing this `package.json` |
| Branch | `main` (or the branch connected in Hostinger) |
| Node.js | `22.x` |
| Install command | `npm install` |
| Build command | `npm run build` |
| Output directory | `dist` |

Do not set `src/` or `public/` as the project root. When deploying manually, upload the **contents** of `dist/` to the site's document root.

## Hostinger `.htaccess` recovery

The `ensure:hostinger` build step runs immediately after `vite build` and before `validate:dist`. It does not fail just because a deployment workflow omitted the hidden `.htaccess` file: it recreates `public/.htaccess` from a canonical template embedded in `scripts/ensure-hostinger-htaccess.mjs`, writes `dist/.htaccess`, and verifies the SPA rewrite rules. The generated configuration also retains the PDF MIME/inline-preview handling used by this portfolio.

Commit these files to the branch Hostinger actually builds:

- `package.json`
- `scripts/ensure-hostinger-htaccess.mjs`
- `public/.htaccess`
- `.gitattributes`

The recovery template is inside the tracked script, so the build can restore the hidden file even if `public/.htaccess` is absent from the checkout.
