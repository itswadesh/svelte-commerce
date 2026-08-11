<script lang="ts">
	import { setCartState, setProductState, setWishlistState } from '$lib/core/stores/index.js'
	import Nav from '$lib/components/nav/nav.svelte'
	import Footer from '$lib/components/common/footer.svelte'
	import { StorePlugins } from '$lib/core/components/index.js'
	import ConversationalShopping from '$lib/components/chat/conversational-shopping.svelte'
	import type { LayoutProps } from './$types'

	const { children }: LayoutProps = $props()

	setCartState()
	setProductState()
	setWishlistState()

</script>

<!-- No <link rel="icon"> here: the root layout already emits one for every route *with* a
     /favicon.png fallback. This one had no fallback, and since browsers take the last rel=icon,
     a store with no configured favicon shipped a bare <link rel="icon"> that resolved to the
     HTML page itself — blank favicon on the storefront, correct one on /my and /blog. -->

<div class="flex min-h-screen flex-col justify-between">
	<!-- z-index here has to out-bid the hand-rolled overlays (cart drawer z-[10000000], share sheet
	     z-[9999997], mobile bottom nav z-[1000001]) or the focused skip link renders *behind* them.
	     ponytail: escalation, not a scale — the real fix is a named z scale in tailwind.config.ts
	     (z-header/dropdown/drawer/modal/toast/skip) applied across all the arbitrary values. -->
	<a
		href="#main"
		class="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-[10000001] focus:rounded focus:bg-white focus:p-3 focus:shadow"
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
