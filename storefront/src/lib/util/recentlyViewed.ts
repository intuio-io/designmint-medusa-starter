// utils/recentlyViewed.ts
const RECENTLY_VIEWED_KEY = 'medusa_recently_viewed_products'

export function addToRecentlyViewed(productId: string) {
  let products = JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY) || '[]')

  // Remove if already exists
  products = products.filter((id: string) => id !== productId)

  // Add to the front
  products.unshift(productId)

  // Keep only latest 10
  products = products.slice(0, 10)

  localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(products))
}

export function getRecentlyViewed(): string[] {
  return JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY) || '[]')
}
