/*
 * Image checks for the custom-cake reference photo, used by the Pages Function.
 * No "@/" imports (bundled by wrangler).
 *
 * - The type is decided from the file's magic bytes, never from the
 *   browser-supplied MIME type or file name.
 * - Metadata that can identify a person or place (EXIF incl. GPS, XMP, IPTC,
 *   text chunks, comments) is removed before the photo is forwarded.
 */

export type ImageKind = "jpeg" | "png" | "webp";

export const imageMime: Record<ImageKind, string> = {
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

const ascii = (b: Uint8Array, start: number, text: string) =>
  [...text].every((c, i) => b[start + i] === c.charCodeAt(0));

export function detectImageKind(b: Uint8Array): ImageKind | null {
  if (b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff)
    return "jpeg";
  if (
    b.length >= 8 &&
    [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every((v, i) => b[i] === v)
  )
    return "png";
  if (b.length >= 12 && ascii(b, 0, "RIFF") && ascii(b, 8, "WEBP"))
    return "webp";
  return null;
}

/** Returns the image without metadata, or null if the file is malformed. */
export function stripMetadata(
  b: Uint8Array,
  kind: ImageKind,
): Uint8Array | null {
  switch (kind) {
    case "jpeg":
      return stripJpeg(b);
    case "png":
      return stripPng(b);
    case "webp":
      return stripWebp(b);
  }
}

function concat(parts: Uint8Array[]): Uint8Array {
  const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
  let o = 0;
  for (const p of parts) {
    out.set(p, o);
    o += p.length;
  }
  return out;
}

/*
 * JPEG: keep SOI, APP0 (JFIF), APP2 ICC_PROFILE (colours), APP14 (Adobe),
 * tables and frame headers; drop APP1 (EXIF/XMP), APP3–APP13 (IPTC…),
 * APP15 and COM. Everything from SOS onwards is image data, copied as is.
 */
function stripJpeg(b: Uint8Array): Uint8Array | null {
  const parts: Uint8Array[] = [b.subarray(0, 2)];
  let i = 2;
  while (i + 4 <= b.length) {
    if (b[i] !== 0xff) return null;
    const marker = b[i + 1]!;
    if (marker === 0xff) {
      i++; // fill byte
      continue;
    }
    if (marker === 0xda) {
      parts.push(b.subarray(i)); // SOS: rest of file
      return concat(parts);
    }
    const len = (b[i + 2]! << 8) | b[i + 3]!;
    if (len < 2 || i + 2 + len > b.length) return null;
    const segment = b.subarray(i, i + 2 + len);
    const isApp = marker >= 0xe0 && marker <= 0xef;
    const keep =
      !isApp && marker !== 0xfe
        ? true
        : marker === 0xe0 ||
          marker === 0xee ||
          (marker === 0xe2 && ascii(b, i + 4, "ICC_PROFILE"));
    if (keep) parts.push(segment);
    i += 2 + len;
  }
  return null;
}

/** PNG: drop eXIf and text/time chunks; keep image and colour chunks. */
function stripPng(b: Uint8Array): Uint8Array | null {
  const drop = new Set(["eXIf", "tEXt", "zTXt", "iTXt", "tIME"]);
  const parts: Uint8Array[] = [b.subarray(0, 8)];
  let i = 8;
  while (i + 12 <= b.length) {
    const len =
      ((b[i]! << 24) | (b[i + 1]! << 16) | (b[i + 2]! << 8) | b[i + 3]!) >>> 0;
    const end = i + 12 + len;
    if (end > b.length) return null;
    const type = String.fromCharCode(
      b[i + 4]!,
      b[i + 5]!,
      b[i + 6]!,
      b[i + 7]!,
    );
    if (!drop.has(type)) parts.push(b.subarray(i, end));
    i = end;
    if (type === "IEND") return concat(parts);
  }
  return null;
}

/** WEBP: drop EXIF and XMP chunks, clear their VP8X flags, fix the RIFF size. */
function stripWebp(b: Uint8Array): Uint8Array | null {
  const chunks: Uint8Array[] = [];
  let i = 12;
  while (i + 8 <= b.length) {
    const fourcc = String.fromCharCode(b[i]!, b[i + 1]!, b[i + 2]!, b[i + 3]!);
    const size =
      (b[i + 4]! | (b[i + 5]! << 8) | (b[i + 6]! << 16) | (b[i + 7]! << 24)) >>>
      0;
    const end = i + 8 + size + (size % 2);
    if (i + 8 + size > b.length) return null;
    if (fourcc !== "EXIF" && fourcc !== "XMP ") {
      const chunk = b.slice(i, Math.min(end, b.length));
      if (fourcc === "VP8X" && chunk.length > 8) chunk[8] = chunk[8]! & ~0x0c;
      chunks.push(chunk);
    }
    i = end;
  }
  if (!chunks.length) return null;
  const body = concat(chunks);
  const header = new Uint8Array(12);
  header.set([0x52, 0x49, 0x46, 0x46], 0); // RIFF
  const riffSize = body.length + 4;
  header.set(
    [
      riffSize & 0xff,
      (riffSize >> 8) & 0xff,
      (riffSize >> 16) & 0xff,
      (riffSize >>> 24) & 0xff,
    ],
    4,
  );
  header.set([0x57, 0x45, 0x42, 0x50], 8); // WEBP
  return concat([header, body]);
}
