import { describe, expect, it } from "vitest";
import { detectImageKind, stripMetadata } from "./image";

const bytes = (...parts: (number[] | string)[]) =>
  new Uint8Array(
    parts.flatMap((p) =>
      typeof p === "string" ? [...p].map((c) => c.charCodeAt(0)) : p,
    ),
  );
const has = (b: Uint8Array, text: string) =>
  new TextDecoder("latin1").decode(b).includes(text);

/** A JPEG segment: FF marker, 2-byte length (incl. itself), payload. */
const seg = (marker: number, payload: number[] | string) => {
  const data =
    typeof payload === "string"
      ? [...payload].map((c) => c.charCodeAt(0))
      : payload;
  const len = data.length + 2;
  return [0xff, marker, len >> 8, len & 0xff, ...data];
};

describe("detectImageKind", () => {
  it("uses magic bytes, not names or MIME types", () => {
    expect(detectImageKind(bytes([0xff, 0xd8, 0xff, 0xe0]))).toBe("jpeg");
    expect(
      detectImageKind(bytes([0x89], "PNG", [0x0d, 0x0a, 0x1a, 0x0a])),
    ).toBe("png");
    expect(detectImageKind(bytes("RIFF", [0, 0, 0, 0], "WEBP"))).toBe("webp");
    expect(detectImageKind(bytes("MZ", [0x90, 0, 3, 0]))).toBeNull(); // .exe
    expect(detectImageKind(bytes("<svg"))).toBeNull();
    expect(detectImageKind(bytes([0, 0, 0, 0x18], "ftypheic"))).toBeNull(); // HEIC is converted in the browser
  });
});

describe("stripMetadata", () => {
  it("removes EXIF/GPS, XMP and comments from JPEG, keeps JFIF, ICC and image data", () => {
    const jpeg = bytes(
      [0xff, 0xd8],
      seg(0xe0, "JFIF\0"),
      seg(0xe1, "Exif\0\0GPS-46.99N-28.85E"),
      seg(0xe1, "http://ns.adobe.com/xap/1.0/ xmp"),
      seg(0xe2, "ICC_PROFILE\0colours"),
      seg(0xed, "Photoshop 3.0 IPTC"),
      seg(0xfe, "comment by phone"),
      seg(0xdb, [0, 1, 2]),
      [0xff, 0xda, 0, 2, 0x11, 0x22, 0xff, 0xd9],
    );
    const out = stripMetadata(jpeg, "jpeg")!;
    expect(out).not.toBeNull();
    expect(has(out, "GPS")).toBe(false);
    expect(has(out, "adobe")).toBe(false);
    expect(has(out, "IPTC")).toBe(false);
    expect(has(out, "comment")).toBe(false);
    expect(has(out, "JFIF")).toBe(true);
    expect(has(out, "ICC_PROFILE")).toBe(true);
    expect([...out.slice(-4)]).toEqual([0x11, 0x22, 0xff, 0xd9]);
  });

  it("removes eXIf and text chunks from PNG", () => {
    const chunk = (type: string, data: string) => [
      0,
      0,
      0,
      data.length,
      ...[...type, ...data].map((c) => c.charCodeAt(0)),
      0,
      0,
      0,
      0,
    ];
    const png = bytes(
      [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
      chunk("IHDR", "hdr"),
      chunk("eXIf", "GPS"),
      chunk("tEXt", "Author"),
      chunk("IDAT", "pix"),
      chunk("IEND", ""),
    );
    const out = stripMetadata(png, "png")!;
    expect(has(out, "GPS")).toBe(false);
    expect(has(out, "Author")).toBe(false);
    expect(has(out, "IDAT")).toBe(true);
    expect(has(out, "IEND")).toBe(true);
  });

  it("removes EXIF/XMP chunks from WEBP and fixes header size and flags", () => {
    const le = (n: number) => [n & 0xff, (n >> 8) & 0xff, 0, 0];
    const vp8x = [
      ...[..."VP8X"].map((c) => c.charCodeAt(0)),
      ...le(10),
      0x0c,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
    ];
    const exif = [
      ...[..."EXIF"].map((c) => c.charCodeAt(0)),
      ...le(4),
      ...[..."GPS!"].map((c) => c.charCodeAt(0)),
    ];
    const vp8 = [...[..."VP8 "].map((c) => c.charCodeAt(0)), ...le(2), 1, 2];
    const body = [...vp8x, ...exif, ...vp8];
    const webp = bytes("RIFF", le(body.length + 4), "WEBP", body);
    const out = stripMetadata(webp, "webp")!;
    expect(has(out, "GPS")).toBe(false);
    expect(has(out, "VP8 ")).toBe(true);
    const size = out[4]! | (out[5]! << 8);
    expect(size).toBe(out.length - 8);
    expect(out[20]! & 0x0c).toBe(0); // VP8X EXIF/XMP flags cleared
  });

  it("rejects malformed files", () => {
    expect(
      stripMetadata(bytes([0xff, 0xd8], [0x00, 0x00, 0x00]), "jpeg"),
    ).toBeNull();
    expect(
      stripMetadata(
        bytes([0x89], "PNG", [0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 99]),
        "png",
      ),
    ).toBeNull();
  });
});
