import fs from "fs";
import path from "path";
import { projects, SITE_ASSETS } from "../src/data/portfolioAssets";

const ROOT_DIR = process.cwd();
const PUBLIC_DIR = path.join(ROOT_DIR, "public");
const DIST_DIR = path.join(ROOT_DIR, "dist");
const SRC_DIR = path.join(ROOT_DIR, "src");
const checkDist = process.argv.includes("--check-dist");

const errors: string[] = [];

function hasValidImageMagicBytes(buffer: Buffer): boolean {
  if (buffer.length < 12) return false;
  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return true;
  }
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return true;
  }
  // WebP: RIFF....WEBP
  if (
    buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
    buffer.subarray(8, 12).toString("ascii") === "WEBP"
  ) {
    return true;
  }
  return false;
}

function hasValidPdfMagicBytes(buffer: Buffer): boolean {
  if (buffer.length < 5) return false;
  return buffer.subarray(0, 5).toString("ascii") === "%PDF-";
}

function getExactDirectoryEntries(dirPath: string): Set<string> {
  if (!fs.existsSync(dirPath)) {
    return new Set();
  }
  return new Set(fs.readdirSync(dirPath));
}

const publicEntries = getExactDirectoryEntries(PUBLIC_DIR);
const distEntries = checkDist ? getExactDirectoryEntries(DIST_DIR) : new Set<string>();

function validatePublicAssetReference(
  assetRef: string,
  contextLabel: string,
  expectedType: "image" | "pdf" = "image"
): string | null {
  if (!assetRef || typeof assetRef !== "string") {
    errors.push(`ASSET VALIDATION FAILED: ${contextLabel} – Empty or invalid asset reference`);
    return null;
  }

  if (assetRef !== assetRef.trim() || assetRef.startsWith("/ ") || assetRef.includes("/ ")) {
    errors.push(
      `ASSET VALIDATION FAILED: ${contextLabel} – Asset path contains leading or trailing whitespace: "${assetRef}"`
    );
    return null;
  }

  if (/^\/?public\//i.test(assetRef)) {
    errors.push(
      `ASSET VALIDATION FAILED: ${contextLabel} – Asset URL must not include "/public/" prefix: "${assetRef}"`
    );
    return null;
  }

  if (!assetRef.startsWith("/")) {
    errors.push(
      `ASSET VALIDATION FAILED: ${contextLabel} – Asset URL must start from public root "/": "${assetRef}"`
    );
    return null;
  }

  const relativeFilename = assetRef.slice(1);

  if (
    relativeFilename.includes(" ") ||
    (expectedType === "image" && relativeFilename !== relativeFilename.toLowerCase())
  ) {
    errors.push(
      `ASSET VALIDATION FAILED: ${contextLabel} – Filename must not contain spaces and image filenames must be lowercase: "${relativeFilename}"`
    );
  }

  // Case-sensitive check against actual directory listing in /public
  if (!publicEntries.has(relativeFilename)) {
    const caseInsensitiveMatch = Array.from(publicEntries).find(
      (entry) => entry.toLowerCase() === relativeFilename.toLowerCase()
    );
    if (caseInsensitiveMatch) {
      errors.push(
        `ASSET VALIDATION FAILED: ${contextLabel} – Case-sensitivity mismatch: expected "${relativeFilename}", found "${caseInsensitiveMatch}"`
      );
    } else {
      errors.push(
        `ASSET VALIDATION FAILED: ${contextLabel} – Missing asset: ${relativeFilename}`
      );
    }
    return null;
  }

  const fullPublicPath = path.join(PUBLIC_DIR, relativeFilename);
  const stat = fs.statSync(fullPublicPath);
  if (!stat.isFile() || stat.size === 0) {
    errors.push(
      `ASSET VALIDATION FAILED: ${contextLabel} – Empty or invalid file: ${relativeFilename}`
    );
    return null;
  }

  const buffer = fs.readFileSync(fullPublicPath);
  if (expectedType === "image" && !hasValidImageMagicBytes(buffer)) {
    errors.push(
      `ASSET VALIDATION FAILED: ${contextLabel} – Corrupted or invalid image header in: ${relativeFilename}`
    );
    return null;
  }

  if (expectedType === "pdf" && !hasValidPdfMagicBytes(buffer)) {
    errors.push(
      `ASSET VALIDATION FAILED: ${contextLabel} – Invalid PDF header in: ${relativeFilename}`
    );
    return null;
  }

  if (checkDist) {
    if (!distEntries.has(relativeFilename)) {
      errors.push(
        `ASSET VALIDATION FAILED: ${contextLabel} – Missing from production build (dist/): ${relativeFilename}`
      );
      return null;
    }
    const distFilePath = path.join(DIST_DIR, relativeFilename);
    const distStat = fs.statSync(distFilePath);
    if (distStat.size !== stat.size) {
      errors.push(
        `ASSET VALIDATION FAILED: ${contextLabel} – File size mismatch in dist/ for ${relativeFilename} (expected ${stat.size}B, got ${distStat.size}B)`
      );
      return null;
    }
  }

  return relativeFilename;
}

// 1. Audit public directory for any malformed filenames (leading spaces, embedded spaces, etc.)
for (const entry of publicEntries) {
  if (entry === ".keep" || entry === "_redirects" || entry === ".htaccess") continue;
  if (entry !== entry.trim()) {
    errors.push(
      `ASSET VALIDATION FAILED: Public Directory – File has leading or trailing whitespace: ${JSON.stringify(entry)}`
    );
  }
  const isPdfEntry = entry.toLowerCase().endsWith(".pdf");
  if (entry.includes(" ") || (!isPdfEntry && entry !== entry.toLowerCase())) {
    errors.push(
      `ASSET VALIDATION FAILED: Public Directory – Unstandardised filename in /public (must not contain spaces, and images must be lowercase): "${entry}"`
    );
  }
}

// 2. Audit all 4 projects, covers, opening animations, designs, and thumbnails
const verifiedUniqueFiles = new Set<string>();
let coverCount = 0;
let designCount = 0;
let thumbnailCount = 0;
let animationCount = 0;

for (const project of projects) {
  // Check Cover Image
  const coverContext = `${project.title} – Cover Image`;
  const coverFile = validatePublicAssetReference(project.coverImage, coverContext, "image");
  const coverWebpFile = validatePublicAssetReference(project.coverWebp, coverContext, "image");
  if (coverFile) {
    verifiedUniqueFiles.add(coverFile);
    coverCount++;
  }
  if (coverWebpFile) {
    verifiedUniqueFiles.add(coverWebpFile);
  }

  // Check Opening Animation Component
  const animPath = path.join(ROOT_DIR, project.openingAnimation.componentPath);
  if (!fs.existsSync(animPath) || fs.statSync(animPath).size === 0) {
    errors.push(
      `ASSET VALIDATION FAILED: ${project.title} – Opening Animation – Missing component: ${project.openingAnimation.componentPath}`
    );
  } else {
    animationCount++;
  }

  // Check Designs (Design 1 .. Design N)
  if (!project.designs || project.designs.length === 0) {
    errors.push(
      `ASSET VALIDATION FAILED: ${project.title} – Project has no design mockups configured`
    );
  }

  project.designs.forEach((design, idx) => {
    const expectedNumber = idx + 1;
    const designContext = `${project.title} – Design ${design.designNumber}`;

    if (design.designNumber !== expectedNumber) {
      errors.push(
        `ASSET VALIDATION FAILED: ${designContext} – Design numbering out of sequence (expected ${expectedNumber}, got ${design.designNumber})`
      );
    }

    if (design.src === project.coverImage) {
      errors.push(
        `ASSET VALIDATION FAILED: ${designContext} – Cover image "${project.coverImage}" must not be mapped to Design ${design.designNumber}`
      );
    }

    const srcFile = validatePublicAssetReference(design.src, designContext, "image");
    const thumbFile = validatePublicAssetReference(
      design.thumbWebp,
      `${project.title} – Design ${design.designNumber} (Grid Thumbnail)`,
      "image"
    );

    if (srcFile) {
      verifiedUniqueFiles.add(srcFile);
      designCount++;
    }
    if (thumbFile) {
      verifiedUniqueFiles.add(thumbFile);
      thumbnailCount++;
    }
  });
}

// 3. Audit Site-Wide Profile & Resume Assets
let siteAssetCount = 0;

const landingFile = validatePublicAssetReference(
  SITE_ASSETS.landingPortrait.src,
  "Landing Hero – Profile Photograph",
  "image"
);
if (landingFile) {
  verifiedUniqueFiles.add(landingFile);
  siteAssetCount++;
}

const aboutFile = validatePublicAssetReference(
  SITE_ASSETS.aboutPortrait.src,
  "About Me – Profile Photograph",
  "image"
);
if (aboutFile) {
  verifiedUniqueFiles.add(aboutFile);
  siteAssetCount++;
}

const resumeFile = validatePublicAssetReference(
  SITE_ASSETS.resumePdf.src,
  "Resume Controls – Resume PDF",
  "pdf"
);
if (resumeFile) {
  verifiedUniqueFiles.add(resumeFile);
  siteAssetCount++;
}

// 4. Scan index.html and src/ files for any hardcoded asset references
function collectSourceFiles(dir: string): string[] {
  const results: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectSourceFiles(full));
    } else if (/\.(tsx?|html)$/.test(entry.name)) {
      results.push(full);
    }
  }
  return results;
}

const filesToScan = [path.join(ROOT_DIR, "index.html"), ...collectSourceFiles(SRC_DIR)];
const assetLiteralRegex = /["'`](\/[^"'`\n]*?\.(?:jpe?g|png|webp|pdf))["'`]/gi;

for (const filePath of filesToScan) {
  const content = fs.readFileSync(filePath, "utf8");
  const relFile = path.relative(ROOT_DIR, filePath);
  let match: RegExpExecArray | null;
  while ((match = assetLiteralRegex.exec(content)) !== null) {
    const rawLiteral = match[1];
    const decodedLiteral = decodeURIComponent(rawLiteral);
    const isPdf = decodedLiteral.toLowerCase().endsWith(".pdf");
    validatePublicAssetReference(
      decodedLiteral,
      `Source Reference (${relFile})`,
      isPdf ? "pdf" : "image"
    );
  }
}

// 5. If --check-dist is active, verify dist/index.html and dist/.htaccess exist
if (checkDist) {
  const distIndex = path.join(DIST_DIR, "index.html");
  if (!fs.existsSync(distIndex) || fs.statSync(distIndex).size === 0) {
    errors.push(
      `ASSET VALIDATION FAILED: Production Build – Missing or empty dist/index.html`
    );
  }
  const distHtaccess = path.join(DIST_DIR, ".htaccess");
  if (!fs.existsSync(distHtaccess) || fs.statSync(distHtaccess).size === 0) {
    errors.push(
      `ASSET VALIDATION FAILED: Production Build – Missing or empty dist/.htaccess for Hostinger deployment`
    );
  }
}

if (errors.length > 0) {
  console.error("\n============================================================");
  console.error("PORTFOLIO ASSET VALIDATION FAILED");
  console.error("============================================================");
  for (const err of errors) {
    console.error(`❌ ${err}`);
  }
  console.error("============================================================\n");
  process.exit(1);
}

console.log("\n============================================================");
console.log(
  `✅ PORTFOLIO ASSET VALIDATION PASSED (${checkDist ? "PUBLIC + DIST BUILD" : "PRE-BUILD SOURCE CHECK"})`
);
console.log("============================================================");
console.log(`• Projects audited:                 ${projects.length}`);
console.log(`• Project cover images verified:    ${coverCount}`);
console.log(`• Individual design mockups:        ${designCount}`);
for (const p of projects) {
  console.log(
    `    - ${p.title.padEnd(34)} ${p.designs.length} designs (Design 1 – Design ${p.designs.length})`
  );
}
console.log(`• Grid gallery thumbnails verified: ${thumbnailCount}`);
console.log(`• Opening animation components:     ${animationCount}`);
console.log(`• Site-wide profile & PDF assets:   ${siteAssetCount}`);
console.log(`• Total unique public files checked: ${verifiedUniqueFiles.size}`);
console.log("============================================================\n");
