import { wishlistService, type Product } from "../services";

interface Query {
  productId: string
  variantId: string
}

const key = (x: string, y: string) =>
  `${x}-${y}`

export const getProductKey = (product: Product) => key(product?.id, product?.variants?.[0]?.id)

class WishlistState {
  static instance: WishlistState | null = null
  private queries: Query[] = []

  loading = $state(false)
  isWishlisted = $state<Record<string, boolean>>({})

  addProductsAsQueries = (products: Product[]) => {
    const queries: Query[] = []
    for (const prod of products)
      queries.push({ productId: prod?.id, variantId: prod?.variants?.[0]?.id })
    this.queries = [...this.queries, ...queries]
  }

  resolveQueries = async () => {
    try {
      this.loading = true
      const res = await wishlistService.checkWishlistInBulk(this.queries)
      this.queries = []
      const tmp: Record<string, boolean> = {}
      for (const entry of res) tmp[key(entry.productId, entry.variantId)] = entry.exists
      this.isWishlisted = tmp
    } catch (e: any) {
      console.error(e)
    } finally {
      this.loading = false
    }
  }

  toggleWishlist = async (product: Product) => {
    const res = await wishlistService.toggleWishlist({
      productId: product?.id,
      variantId: product?.variants?.[0]?.id,
    })
    this.isWishlisted[getProductKey(product)] = Boolean(res?.active)
  }
}

export const wishlistState = new WishlistState()
