# Mayookha's Portfolio

A Vite + React portfolio website.

## Local development

Prerequisites: Node.js 22 or newer and npm.

```bash
npm ci
npm run dev
```

## Production build

```bash
npm ci
npm run build
```

Vite writes the production site to `dist/`. The custom build script validates all configured portfolio images and the original resume PDF before and after the build.

## Hostinger

Follow [HOSTINGER-DEPLOYMENT.md](./HOSTINGER-DEPLOYMENT.md). Upload the contents of `dist/` to the domain's `public_html` folder.
