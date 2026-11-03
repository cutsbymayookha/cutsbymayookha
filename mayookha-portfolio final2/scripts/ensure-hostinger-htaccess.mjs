import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// This script is intentionally self-healing. Some deployment/archive workflows
// omit dotfiles such as .htaccess. Never fail just because that source file is
// missing: recreate the canonical file, then guarantee it exists in dist/.
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDirectory = path.join(projectRoot, "public");
const sourcePath = path.join(publicDirectory, ".htaccess");
const distDirectory = path.join(projectRoot, "dist");
const destinationPath = path.join(distDirectory, ".htaccess");

const HOSTINGER_HTACCESS = String.raw`# Hostinger (Apache / LiteSpeed) production configuration
# SPA routing, static asset handling, and inline PDF preview support.

<IfModule mod_mime.c>
  AddType application/pdf .pdf
  AddType text/javascript .js .mjs
  AddType application/wasm .wasm
  AddType image/webp .webp
</IfModule>

<IfModule mod_headers.c>
  <FilesMatch "\.(?i:pdf)$">
    Header set Content-Type "application/pdf"
    Header set Content-Disposition "inline"
    Header set Cache-Control "public, max-age=0, must-revalidate"
    Header set X-Frame-Options "SAMEORIGIN"
    Header set X-Content-Type-Options "nosniff"
  </FilesMatch>

  <FilesMatch "\.mjs$">
    Header set Content-Type "text/javascript; charset=utf-8"
  </FilesMatch>
</IfModule>

<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # Keep the existing resume URL compatible with the published filename.
  RewriteRule ^resume(?:\s+pdf)?\.pdf$ "/Resume PDF.pdf" [L,NC]

  # Do not rewrite real files or directories.
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]

  # Do not turn missing static assets into an HTML response.
  RewriteRule \.(?:pdf|mjs|js|css|jpe?g|png|webp|gif|svg|ico|woff2?|ttf|eot|map)$ - [L,NC]

  # Client-side routes fall back to the Vite entry point.
  RewriteRule ^ index.html [L]
</IfModule>
`;

function isUsableHtaccess(contents) {
  return (
    contents.trim().length > 0 &&
    /RewriteEngine\s+On/i.test(contents) &&
    /RewriteRule\s+\^\s+index\.html\s+\[L\]/i.test(contents) &&
    /RewriteCond\s+%\{REQUEST_FILENAME\}\s+-f/i.test(contents) &&
    /RewriteCond\s+%\{REQUEST_FILENAME\}\s+-d/i.test(contents)
  );
}

fs.mkdirSync(publicDirectory, { recursive: true });

let sourceContents = "";
if (fs.existsSync(sourcePath) && fs.statSync(sourcePath).isFile()) {
  sourceContents = fs.readFileSync(sourcePath, "utf8");
}

if (!isUsableHtaccess(sourceContents)) {
  fs.writeFileSync(sourcePath, HOSTINGER_HTACCESS, { encoding: "utf8", mode: 0o644 });
  sourceContents = fs.readFileSync(sourcePath, "utf8");
  console.log("HOSTINGER CONFIG: restored missing or invalid public/.htaccess from the built-in template.");
}

// Vite normally copies public assets. Copy explicitly as a second guarantee,
// including on hosts/tools that omit hidden files during the Vite copy step.
fs.mkdirSync(distDirectory, { recursive: true });
fs.writeFileSync(destinationPath, sourceContents, { encoding: "utf8", mode: 0o644 });

const deployedContents = fs.readFileSync(destinationPath, "utf8");
if (!isUsableHtaccess(deployedContents)) {
  console.error("HOSTINGER CONFIG ERROR: dist/.htaccess is missing required SPA rewrite rules.");
  process.exit(1);
}

console.log("HOSTINGER CONFIG OK: non-empty public/.htaccess and dist/.htaccess are ready.");
