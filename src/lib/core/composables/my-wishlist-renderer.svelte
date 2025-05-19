<script lang="ts">
	import { onMount, type Snippet } from 'svelte'
	import { getCartState } from '$lib/core/stores/cart.svelte'
	import { wishlistService, profileService, type Wishlist, type Product } from '$lib/core/services'
	import { toast } from 'svelte-sonner'
	import { page } from '$app/state'

	let wishlistPlugin = $derived(page?.data?.store?.plugins?.isWishlist)

	const { content }: { content: Snippet<[SnippetParams]> } = $props()

	interface WishlistItem {
		productId: string
		variantId: string
		product: Product
	}

	interface SnippetParams {
		wishlistPlugin: any
		user: any
		loading: boolean
		wishlistItems: WishlistItem[]
		removeFromWishlist: (pid: string, vid: string) => void
		moveToCart: (item: WishlistItem) => void
	}

	const cartState = getCartState()

	let loading = $state(true)
	let user: any = $state({})

	let wishlistItems: WishlistItem[] = $state([])

	onMount(async () => {
		try {
			loading = true

			const res: any = await profileService.getOne()
			const wishlistRes: any = await wishlistService.fetchWishlist({})
			if (wishlistRes?.data?.length) {
				wishlistItems = wishlistRes.data
			}

			if (res) user = res
		} catch (e: any) {
		} finally {
			loading = false
		}
	})

	$effect(() => {
		// Save wishlist items to localStorage whenever they change
		localStorage.setItem('wishlist', JSON.stringify(wishlistItems))
	})

	async function removeFromWishlist(productId: string, variantId: string) {
		try {
			const res = await wishlistService.toggleWishlist({
				productId,
				variantId
			})
			toast.success('Product removed from wishlist')
		} catch (error: any) {
			toast.error(error.message || 'Remove operation failed')
			console.log(error)
		}
		wishlistItems = wishlistItems.filter((item) => item?.productId !== productId)
	}

	function moveToCart(item: WishlistItem) {
		cartState.addOrUpdate({
			productId: item?.productId,
			variantId: item?.variantId,
			qty: 1
		})
	}

	onMount(() => {
		const storedWishlist = localStorage.getItem('wishlist')
		if (storedWishlist) {
			wishlistItems = JSON.parse(storedWishlist)
		}
	})
</script>

{@render content?.({
	user,
	loading,
	wishlistItems,
	removeFromWishlist,
	moveToCart,
	wishlistPlugin
})}
