/**
 * Responsive variants of photos uploaded through the CMS (public/uploads).
 * scripts/postbuild.mjs writes `/_img/<width>/uploads/<name>.webp` for each
 * width below, without EXIF/GPS. In development the original file is used.
 */
export const IMAGE_WIDTHS = [480, 960, 1600] as const;

const UPLOAD_PREFIX = "/uploads/";
const OPTIMISABLE = /\.(jpe?g|png|webp|avif)$/i;

export function isOptimisable(src: string): boolean {
  return src.startsWith(UPLOAD_PREFIX) && OPTIMISABLE.test(src);
}

export function variantPath(src: string, width: number): string {
  return `/_img/${width}${src.replace(OPTIMISABLE, "")}.webp`;
}

export function responsiveImage(
  src: string,
  production: boolean = process.env.NODE_ENV === "production",
): { src: string; srcSet?: string } {
  if (!production || !isOptimisable(src)) return { src };
  return {
    src: variantPath(src, 960),
    srcSet: IMAGE_WIDTHS.map((w) => `${variantPath(src, w)} ${w}w`).join(", "),
  };
}
