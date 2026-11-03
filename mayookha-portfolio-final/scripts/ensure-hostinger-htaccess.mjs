import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = path.join(projectRoot, "public", ".htaccess");
const distDirectory = path.join(projectRoot, "dist");
const destinationPath = path.join(distDirectory, ".htaccess");

if (!fs.existsSync(sourcePath) || !fs.statSync(sourcePath).isFile()) {
  console.error("HOSTINGER CONFIG ERROR: public/.htaccess is missing.");
  process.exit(1);
}

if (fs.statSync(sourcePath).size === 0) {
  console.error("HOSTINGER CONFIG ERROR: public/.htaccess is empty.");
  process.exit(1);
}

if (!fs.existsSync(distDirectory) || !fs.statSync(distDirectory).isDirectory()) {
  console.error("HOSTINGER CONFIG ERROR: dist/ does not exist. Run this after vite build.");
  process.exit(1);
}

fs.copyFileSync(sourcePath, destinationPath);

if (!fs.existsSync(destinationPath) || fs.statSync(destinationPath).size === 0) {
  console.error("HOSTINGER CONFIG ERROR: failed to create a non-empty dist/.htaccess.");
  process.exit(1);
}

console.log("HOSTINGER CONFIG OK: public/.htaccess copied to dist/.htaccess.");
