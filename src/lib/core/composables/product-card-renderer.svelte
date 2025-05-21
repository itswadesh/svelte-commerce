<script lang="ts">
	import { getCartState } from '$lib/core/stores/cart.svelte'
	import { page } from '$app/state'
	import { goto } from '$app/navigation'
	import type { Snippet } from 'svelte'
	import type { Product } from '../services'
	import { toast } from 'svelte-sonner'

	const cartState = getCartState()

	interface Props {
		aspectRatio: string
		product: Product
		content: Snippet<[SnippetParams]>
	}

	let { content, product, aspectRatio }: Props = $props()

	interface SnippetParams {
    loadingForCart: boolean
		aspectHeight: number
		aspectWidth: number
		handleCardClick: () => void
		changeQuantity: (product: Product, factor: 1 | -1) => Promise<void>
		addToCart: (product: Product) => Promise<void>
	}

  let loadingForCart = $state(false)
	const aspectHeight = $derived((aspectRatio || page?.data?.store?.productImageAspectRatio)?.split(':')?.[1] || 1)
	const aspectWidth = $derived((aspectRatio || page?.data?.store?.productImageAspectRatio)?.split(':')?.[0] || 1)

	function handleCardClick() {
		goto(`/products/${product.slug}?variant_id=${product?.variants?.[0]?.id || ''}`)
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
    } catch(e: any) {
      toast.error(e?.message || "Cart update failed")
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
      toast.success("Item added to cart")
    } catch(e: any) {
      toast.error(e?.message || "Cart update failed")
    } finally {
      loadingForCart = false
    }
	}
</script>

{@render content({
  loadingForCart,
	aspectHeight,
	aspectWidth,
	changeQuantity,
	addToCart,
	handleCardClick
})}
