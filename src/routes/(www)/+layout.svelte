<script lang="ts">
	import { setCartState, setProductState, setWishlistState } from '$lib/core/stores/index.js'
	import { type Snippet } from 'svelte'
	import Nav from '$lib/components/nav/nav.svelte'
	import Footer from '$lib/components/common/footer.svelte'
	import BottomNav from '$lib/components/nav/bottom-nav.svelte'
	import { StorePlugins } from '$lib/core/components/index.js'
	import { page } from '$app/state'
	import type { StoreData } from '$lib/core/services/index.js'

	const { children, data }: { children: Snippet; data: { store: StoreData } } = $props()

	setCartState()
	setProductState()
	setWishlistState()

	let isProductDetailsPage = $derived(page.route?.id === '/(www)/products/[slug]')
	let isProductsListingPage = $derived(page?.route?.id === '/(www)/products' || page?.route?.id === '/(www)/[slug]')
	let isCheckoutPage = $derived(page.url.pathname.startsWith('/checkout'))
</script>

<svelte:head>
	<link rel="icon" href={page?.data?.store?.favicon} />
</svelte:head>

<div class="flex min-h-screen flex-col justify-between">
	<Nav storeData={data.store} />
	<main class="inter-gap flex min-h-screen flex-1 flex-col">
		{@render children()}
	</main>
	<Footer />
	{#if !isProductDetailsPage && !isCheckoutPage}
		<BottomNav class={isProductsListingPage ? 'invisible' : ''} />
	{/if}
</div>

<StorePlugins storeData={data.store} />
