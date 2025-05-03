<script lang="ts">
	import { getCartState } from '$lib/core/stores/cart.svelte'
	import { page } from '$app/state'
	import { goto } from '$app/navigation'
	import type { Snippet } from 'svelte'
	import type { Product } from '../services'

	const cartState = getCartState()

	interface Props {
		aspectRatio: string
		product: Product
		content: Snippet<[SnippetParams]>
	}

	let { content, product, aspectRatio }: Props = $props()

	interface SnippetParams {
		aspectHeight: number
		aspectWidth: number
		handleCardClick: () => void
		changeQuantity: (product: Product, factor: 1 | -1) => void
		addToCart: (product: Product) => void
	}

	const aspectHeight = $derived((aspectRatio || page?.data?.store?.productImageAspectRatio)?.split(':')?.[1] || 1)
	const aspectWidth = $derived((aspectRatio || page?.data?.store?.productImageAspectRatio)?.split(':')?.[0] || 1)

	function handleCardClick() {
		goto(`/products/${product.slug}?variant_id=${product?.variants?.[0]?.id || ''}`)
	}

	function changeQuantity(product: Product, factor: 1 | -1) {
		cartState.addOrUpdate({
			qty: factor,
			productId: product.id,
			variantId: product?.variants[0]?.id,
			id: cartState.cart?.lineItems?.find((item) => item.productId === product.id)?.id
		})
	}

	function addToCart(product: Product) {
		cartState.addOrUpdate({
			qty: 1,
			productId: product.id,
			variantId: product?.variants[0]?.id
		})
	}
</script>

{@render content({
	aspectHeight,
	aspectWidth,
	changeQuantity,
	addToCart,
	handleCardClick
})}
