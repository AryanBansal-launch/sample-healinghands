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
