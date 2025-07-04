<script lang="ts">
	import { getCartState } from '$lib/core/stores/cart.svelte'
	import { page } from '$app/state'
	import { goto } from '$app/navigation'
	import type { Snippet } from 'svelte'
	import type { Product } from '../services'
	import { toast } from 'svelte-sonner'
	import { getProductKey, getWishlistState } from '../stores/wishlist.svelte'

  const wishlistState = getWishlistState()
	const cartState = getCartState()

	interface Props {
		aspectRatio: string
		product: Product
		content: Snippet<[SnippetParams]>
	}

	let { content, product, aspectRatio }: Props = $props()

	interface SnippetParams {
		loadingForCart: boolean
		loadingForWishlist: boolean
		aspectHeight: number
		aspectWidth: number
		isWishlisted: boolean
		toggleWishlist: () => void
		handleCardClick: () => void
		changeQuantity: (product: Product, factor: 1 | -1) => Promise<void>
		addToCart: (product: Product) => Promise<void>
	}

	let loadingForWishlist = $state(false)
	let loadingForCart = $state(false)
	const aspectHeight = $derived((aspectRatio || page?.data?.store?.productImageAspectRatio)?.split(':')?.[1] || 1)
	const aspectWidth = $derived((aspectRatio || page?.data?.store?.productImageAspectRatio)?.split(':')?.[0] || 1)

	function handleCardClick() {
		goto(`/products/${product.slug}?variant_id=${product?.variants?.[0]?.id || ''}`)
	}

	async function toggleWishlist() {
		try {
			loadingForWishlist = true
			await wishlistState.toggleWishlist(product)
		} catch (error: any) {
			console.error(error)
		} finally {
			loadingForWishlist = false
		}
	}

	async function changeQuantity(product: Product, factor: 1 | -1) {
		try {
			loadingForCart = true
			await cartState.addOrUpdate({
				qty: factor,
				productId: product.id,
				variantId: product?.variants[0]?.id,
				id: cartState.cart?.lineItems?.find((item) => item.productId === product.id)?.id
			})
		} catch (e: any) {
			toast.error(e?.message || 'Cart update failed')
		} finally {
			loadingForCart = false
		}
	}

	async function addToCart(product: Product) {
		try {
			loadingForCart = true
			await cartState.addOrUpdate({
				qty: 1,
				productId: product.id,
				variantId: product?.variants[0]?.id
			})
			toast.success('Item added to cart')
		} catch (e: any) {
			toast.error(e?.message || 'Cart update failed')
		} finally {
			loadingForCart = false
		}
	}
</script>

{@render content({
	loadingForCart,
	loadingForWishlist: loadingForWishlist || wishlistState.loading,
	aspectHeight,
	aspectWidth,
	isWishlisted: wishlistState.isWishlisted[getProductKey(product)],
	changeQuantity,
	addToCart,
	handleCardClick,
	toggleWishlist
})}
