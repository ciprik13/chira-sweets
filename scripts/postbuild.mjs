// Runs after `next build` (static export in ./out).
// 1. Localised 404 pages for Cloudflare Pages, which serves the nearest
//    404.html up the path: /ro/404.html, /ru/404.html and /404.html (RO).
// 2. Photos uploaded through the CMS (out/uploads): metadata (EXIF/GPS) is
//    stripped from the published originals, and WEBP variants are written to
//    out/_img/<width>/uploads/… (widths must match src/lib/images.ts).
// 3. Per-page CSP <meta> with sha256 hashes of every inline <script>, so only
//    the scripts Next.js generated can run (see public/_headers). The CMS
//    admin (out/admin) has its own policy in _headers and is skipped.
import { createHash } from "node:crypto";
import {
  copyFile,
  mkdir,
  readdir,
  readFile,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import sharp from "sharp";

const OUT = new URL("../out/", import.meta.url).pathname;
const IMAGE_WIDTHS = [480, 960, 1600];
const MAX_ORIGINAL_EDGE = 2400;
const PHOTO = /\.(jpe?g|png|webp|avif)$/i;

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

async function localise404() {
  for (const locale of ["ro", "ru"]) {
    const src = join(OUT, locale, "404", "index.html");
    if (!(await exists(src))) throw new Error(`missing ${src}`);
    await copyFile(src, join(OUT, locale, "404.html"));
    await rm(join(OUT, locale, "404"), { recursive: true, force: true });
  }
  await copyFile(join(OUT, "ro", "404.html"), join(OUT, "404.html"));
}

async function* files(dir, test) {
  if (!(await exists(dir))) return;
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* files(path, test);
    else if (test(entry.name)) yield path;
  }
}

async function optimiseUploads() {
  let count = 0;
  for await (const file of files(join(OUT, "uploads"), (n) => PHOTO.test(n))) {
    const input = await readFile(file);
    // rotate() applies the EXIF orientation; sharp drops all metadata
    // (EXIF incl. GPS, XMP, IPTC) unless asked to keep it.
    const base = sharp(input, { failOn: "error" }).rotate();
    const { width = 0 } = await base.metadata();

    const original = base.clone().resize({
      width: MAX_ORIGINAL_EDGE,
      height: MAX_ORIGINAL_EDGE,
      fit: "inside",
      withoutEnlargement: true,
    });
    const format = file.toLowerCase().endsWith(".png")
      ? "png"
      : file.toLowerCase().endsWith(".webp")
        ? "webp"
        : file.toLowerCase().endsWith(".avif")
          ? "avif"
          : "jpeg";
    await writeFile(
      file,
      await original.toFormat(format, { quality: 86 }).toBuffer(),
    );

    const rel = relative(OUT, file).replace(PHOTO, ".webp");
    for (const w of IMAGE_WIDTHS) {
      const target = join(OUT, "_img", String(w), rel);
      await mkdir(dirname(target), { recursive: true });
      await base
        .clone()
        .resize({ width: Math.min(w, width || w), withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(target);
    }
    count++;
  }
  return count;
}

const INLINE_SCRIPT = /<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/gi;
const EXTERNAL = [
  "https://challenges.cloudflare.com",
  "https://static.cloudflareinsights.com",
];

export function cspFor(html) {
  const hashes = new Set();
  for (const [, attrs, body] of html.matchAll(INLINE_SCRIPT)) {
    if (/type=["']application\/ld\+json["']/i.test(attrs)) continue; // data, not executed
    hashes.add(
      `'sha256-${createHash("sha256").update(body, "utf8").digest("base64")}'`,
    );
  }
  return `script-src 'self' ${EXTERNAL.join(" ")} ${[...hashes].join(" ")}`.trim();
}

async function injectCsp() {
  let count = 0;
  const adminDir = join(OUT, "admin");
  for await (const file of files(OUT, (n) => n.endsWith(".html"))) {
    if (file.startsWith(adminDir)) continue;
    const html = await readFile(file, "utf8");
    if (html.includes('http-equiv="Content-Security-Policy"')) continue;
    const meta = `<meta http-equiv="Content-Security-Policy" content="${cspFor(html)}">`;
    const updated = html.replace(/<head([^>]*)>/i, (m) => `${m}${meta}`);
    if (updated === html) throw new Error(`no <head> in ${file}`);
    await writeFile(file, updated);
    count++;
  }
  return count;
}

await localise404();
const photos = await optimiseUploads();
const pages = await injectCsp();
console.log(
  `postbuild: 404 pages localised, ${photos} photo(s) optimised, CSP hashes added to ${pages} HTML files`,
);
