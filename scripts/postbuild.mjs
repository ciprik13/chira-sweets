// Runs after `next build` (static export in ./out).
// 1. Localised 404 pages for Cloudflare Pages, which serves the nearest
//    404.html up the path: /ro/404.html, /ru/404.html and /404.html (RO).
// 2. Per-page CSP <meta> with sha256 hashes of every inline <script>, so only
//    the scripts Next.js generated can run (see public/_headers).
import { createHash } from "node:crypto";
import { copyFile, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

const OUT = new URL("../out/", import.meta.url).pathname;

async function exists(path) {
  try {
    await readFile(path);
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

async function* htmlFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(path);
    else if (entry.name.endsWith(".html")) yield path;
  }
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
  for await (const file of htmlFiles(OUT)) {
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
const pages = await injectCsp();
console.log(
  `postbuild: 404 pages localised, CSP hashes added to ${pages} HTML files`,
);
