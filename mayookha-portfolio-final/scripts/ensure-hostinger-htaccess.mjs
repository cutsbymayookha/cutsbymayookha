import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const publicDir = path.join(root, "public");
const distDir = path.join(root, "dist");
const sourcePath = path.join(publicDir, ".htaccess");
const outputPath = path.join(distDir, ".htaccess");

// Fallback content makes the build resilient if a deployment system strips
// hidden files while extracting the source archive. The public copy is still
// generated so the project itself contains the Hostinger configuration.
const fallbackRules = `# Hostinger shared hosting (Apache / LiteSpeed)\n# Upload the contents of dist/ into public_html/.\n\nOptions -MultiViews\nDirectoryIndex index.html\n\n<IfModule mod_mime.c>\n  AddType application/pdf .pdf\n  AddType text/javascript .js .mjs\n  AddType application/wasm .wasm\n  AddType image/webp .webp\n</IfModule>\n\n<IfModule mod_headers.c>\n  <FilesMatch "\\.pdf$">\n    Header set Content-Type "application/pdf"\n    Header set Content-Disposition "inline"\n    Header set X-Frame-Options "SAMEORIGIN"\n    Header set X-Content-Type-Options "nosniff"\n  </FilesMatch>\n  <FilesMatch "\\.mjs$">\n    Header set Content-Type "text/javascript; charset=utf-8"\n    Header set X-Content-Type-Options "nosniff"\n  </FilesMatch>\n</IfModule>\n\n<IfModule mod_rewrite.c>\n  RewriteEngine On\n  RewriteBase /\n\n  # Keep real files and directories (PDFs, scripts, styles, images, fonts) as-is.\n  RewriteCond %{REQUEST_FILENAME} -f [OR]\n  RewriteCond %{REQUEST_FILENAME} -d\n  RewriteRule ^ - [L]\n\n  # Do not return the React HTML page for missing static assets.\n  RewriteRule \\.(?:pdf|mjs|js|css|jpe?g|png|webp|gif|svg|ico|woff2?|ttf|otf|eot|map|wasm)$ - [L,NC]\n\n  # React single-page application route fallback.\n  RewriteRule ^ index.html [L]\n</IfModule>\n`;

fs.mkdirSync(publicDir, { recursive: true });
fs.mkdirSync(distDir, { recursive: true });

if (!fs.existsSync(sourcePath) || fs.statSync(sourcePath).size === 0) {
  fs.writeFileSync(sourcePath, fallbackRules, "utf8");
  console.log("Created missing public/.htaccess using the Hostinger fallback rules.");
}

const source = fs.readFileSync(sourcePath);
if (source.length === 0) {
  throw new Error("public/.htaccess is empty; refusing to publish an empty Hostinger config.");
}

// Explicit post-build copy: do not rely only on Vite's public-directory copier
// to preserve dotfiles in every build environment.
fs.copyFileSync(sourcePath, outputPath);

const output = fs.readFileSync(outputPath);
if (output.length === 0 || !output.equals(source)) {
  throw new Error("dist/.htaccess is missing, empty, or differs from public/.htaccess.");
}

console.log(`Hostinger config ready: public/.htaccess -> dist/.htaccess (${output.length} bytes).`);
