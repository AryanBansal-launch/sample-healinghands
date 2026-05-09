/** Legacy paths stored in DB or old seeds before files lived under /public/products */
export function normalizeProductImageUrl(url: string): string {
  const u = url.trim()
  if (!u) return "/products/spray.jpeg"
  if (/^\/spray\.jpeg$/i.test(u) || /^spray\.jpeg$/i.test(u)) return "/products/spray.jpeg"
  return url
}

export function normalizeProductImages(images: string[] | undefined | null): string[] {
  if (!images?.length) return ["/products/spray.jpeg"]
  return images.map(normalizeProductImageUrl)
}

/** Put the selected variant image first, then remaining product images (deduped). Safe for client bundles. */
export function mergeGalleryForVariant(
  baseImages: string[] | undefined,
  variantImage?: string | null
): string[] {
  const base = normalizeProductImages(baseImages)
  const trimmed = variantImage?.trim()
  if (!trimmed) return base
  const v = normalizeProductImageUrl(trimmed)
  const withoutDup = base.filter((u) => normalizeProductImageUrl(u) !== v)
  return [v, ...withoutDup]
}
