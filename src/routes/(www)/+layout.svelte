<script lang="ts">
	import { setCartState, setProductState, setWishlistState } from '$lib/core/stores/index.js'
	import Nav from '$lib/components/nav/nav.svelte'
	import Footer from '$lib/components/common/footer.svelte'
	import { StorePlugins } from '$lib/core/components/index.js'
	import ConversationalShopping from '$lib/components/chat/conversational-shopping.svelte'
	import { page } from '$app/state'
	import type { LayoutProps } from './$types'

	const { children }: LayoutProps = $props()

	setCartState()
	setProductState()
	setWishlistState()

</script>

<svelte:head>
	<link rel="icon" href={page?.data?.store?.favicon} />
</svelte:head>

<div class="flex min-h-screen flex-col justify-between">
	<a
		href="#main"
		class="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-[9999] focus:rounded focus:bg-white focus:p-3 focus:shadow"
	>
		Skip to main content
	</a>
	<Nav />
	<main id="main" class="inter-gap flex min-h-screen flex-1 flex-col">
		{@render children()}
	</main>
	<Footer />
</div>

<StorePlugins />

<!-- Self-gates on the store's admin toggle via /api/commerce-assistant/config -->
<ConversationalShopping />
