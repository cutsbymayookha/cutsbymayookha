# Hostinger deployment — Mayookha's Portfolio

This project is a Vite + React static website. It does not need a Node.js server at runtime.

## 1. Create the production build

Use Node.js 22 or newer. From the project root run:

```bash
npm ci
npm run build
```

An npm `package-lock.json` is included so npm installs use the locked dependency graph. The original `bun.lock` is also retained from the project. Use npm for Hostinger deployment so the build environment follows `package-lock.json`.

Do not set `NODE_ENV=production` or `--omit=dev` during the build: Vite, TypeScript and `tsx` are build-time tools listed in `devDependencies`.

## 2. Upload to Hostinger

1. Open Hostinger hPanel → Websites → Manage → File Manager.
2. Open `public_html` for the domain.
3. Upload the **contents of the generated `dist/` folder** into `public_html` (not the source project folder and not a nested `dist` folder).
4. Confirm that `public_html/index.html`, `public_html/.htaccess`, and `public_html/Resume.pdf` exist.
5. Keep the resume filename exactly `Resume.pdf` (capital letters matter on Linux hosting).
6. Enable SSL and visit the site using its HTTPS URL.

## 3. Resume preview checks

- Open the site in desktop Google Chrome.
- Select **View Resume**. The preview uses Chrome's native PDF viewer in a same-origin iframe; it does not depend on PDF.js workers or `.mjs` worker MIME handling.
- Select **Open PDF** to test the direct PDF URL.
- Select **Download Resume** to test the download link.
- Direct URL: `/Resume.pdf`.

The `.htaccess` file configures PDF responses as `application/pdf` and `inline`, preserves existing static files, and routes React paths to `index.html`.

## 4. Preserve original assets

Do not run image optimization, PDF compression, format conversion, or asset cleanup. Vite copies files from `public/` unchanged into `dist/`. The build's asset validator checks that the deployed copies have the same byte sizes as their source files.

## 5. Verify before publishing

After building, confirm that `npm run build` completes and that the build output contains `dist/index.html`, `dist/.htaccess`, and `dist/Resume.pdf`. The website is not considered verified until the built version is uploaded and tested at the live Hostinger domain in Chrome.
