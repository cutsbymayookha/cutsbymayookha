# Mayookha’s Portfolio

React + TypeScript portfolio built with Vite 8, Tailwind CSS 4, and the React Vite plugin.

## Requirements

- Node.js 20.19+ or 22.12+ (Node.js 22.12+ recommended; Hostinger should use Node 22)
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
## Dependency security update (November 2026)

The build toolchain is aligned with Vite 8 and compatible current React/Tailwind plugins. Vite 8 uses Rolldown/Oxc rather than esbuild for its bundling and dependency-optimization core. The `tsx` validation runner still uses esbuild, so `esbuild` is pinned to the patched `^0.28.2` range both as a development dependency and through npm `overrides`. This prevents npm from installing an older esbuild release through another package.

The reported advisory `GHSA-gv7w-rqvm-qjhr` was withdrawn by GitHub because the affected component was incorrectly identified as the npm `esbuild` package. The version update is still applied to meet the scanner's requested minimum and to include the fixes shipped in esbuild 0.28.1 and later.

After updating the repository, run `npm install` and commit the generated `package-lock.json` so Hostinger and local builds resolve the same dependency tree. Then run `npm audit` and `npm run build`.
