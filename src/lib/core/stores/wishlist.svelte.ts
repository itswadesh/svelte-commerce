import { getContext, onMount, setContext } from "svelte";
import { wishlistService, type Product } from "../services";
import type { setCartState } from "./cart.svelte";

interface Query {
  productId: string
  variantId: string
}

const key = (x: string, y: string) =>
  `${x}-${y}`

export const getProductKey = (product: Product) => key(product?.id, product?.variants?.[0]?.id)

class WishlistState {
  static instance: WishlistState | null = null

  loading = $state(false)
  count = $state(0)
  isWishlisted = $state<Record<string, boolean>>({})

  constructor() {
    onMount(async () => {
      try {
        this.loading = true
        const res = await wishlistService.fetchWishlist({})
        this.count = res?.data?.length
        for (const { variant, product } of res?.data)
          this.isWishlisted[key(product?.id, variant?.id)] = true
      } catch(e: any) {
        console.error("While fetching wishlist", e)
      }
      finally {
        this.loading = false
      }
    })
  }

  /*
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
      this.count = Object.values(tmp).reduce((acc, cur) => acc + (cur ? 1 : 0), 0)
    } catch (e: any) {
      console.error(e)
    } finally {
      this.loading = false
    }
  }
  */

  toggleWishlist = async (product: Product) => {
    const res = await wishlistService.toggleWishlist({
      productId: product?.id,
      variantId: product?.variants?.[0]?.id,
    })
    const active = Boolean(res?.active)
    this.isWishlisted[getProductKey(product)] = active
    if (active) this.count++
    else if (this.count) this.count--
    else console.error('Wishlist count decrementing to negative integer')
  }
}

const WISHLIST_KEY = Symbol('WISHLIST')

export function setWishlistState() {
  return setContext(WISHLIST_KEY, new WishlistState())
}

export function getWishlistState() {
	return getContext<ReturnType<typeof setCartState>>(WISHLIST_KEY)
}
