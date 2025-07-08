<script lang="ts">
import { setCartState } from '$lib/core/stores/cart.svelte'
import { onMount, type Snippet } from 'svelte'
import Nav from '$lib/components/nav/nav.svelte'
import Footer from '$lib/components/common/footer.svelte'
import { setProductState } from '$lib/core/stores/product.svelte'
import BottomNav from '$lib/components/nav/bottom-nav.svelte'
import StorePlugins from '$lib/core/components/plugins/store-plugins.svelte'
import { page } from '$app/state'
import { setWishlistState } from '$lib/core/stores/wishlist.svelte'
let { children, data }: { children: Snippet; data: { store: StoreData } } = $props()

setCartState()
setProductState()
setWishlistState()

let isProductDetailsPage = $derived(page.route?.id === '/(www)/products/[slug]')
let isProductsListingPage = $derived(page?.route?.id === '/(www)/products' || page?.route?.id === '/(www)/[slug]')
</script>

<svelte:head>
	<link rel="icon" href={page?.data?.store?.favicon} />
</svelte:head>

<div class="flex min-h-screen flex-col justify-between">

	<Nav storeData={data.store} />
  <main class="min-h-screen flex-1">
    {@render children()}
  </main>
  <Footer />
	{#if !isProductDetailsPage}
		<BottomNav class={isProductsListingPage ? 'invisible' : ''} />
	{/if}
</div>

<StorePlugins storeData={data.store} />
