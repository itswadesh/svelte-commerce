<script lang="ts">
	import { setCartState, setProductState, setWishlistState } from '$lib/core/stores/index.js'
	import Nav from '$lib/components/nav/nav.svelte'
	import Footer from '$lib/components/common/footer.svelte'
	import { StorePlugins } from '$lib/core/components/index.js'
	import ConversationalShopping from '$lib/components/chat/conversational-shopping.svelte'
	import type { LayoutProps } from './$types'
	import { page } from '$app/state'
	import { hasConfiguredSupportChat } from '$lib/components/common/store-capabilities.js'

	const { children }: LayoutProps = $props()

	// StorePlugins mounts the support-chat widget, and the core component falls back to a demo
	// account id when the merchant switches the plugin on without filling one in — which puts another
	// business's inbox on the storefront. Mount it only once an account is actually configured.
	// Checkout gets its own reduced chrome. Carrying the full category nav, search, wishlist,
	// account and the entire footer link list through every step is the distraction the rulebook
	// warns about: tabbing forward from the last address field reached the footer links in three
	// presses. The code already treats checkout as special — the cart drawer is suppressed there
	// and a dedicated step rail exists — so this makes the rest of the chrome agree.
	const isCheckout = $derived(page.url.pathname.startsWith('/checkout'))

	const supportChatConfigured = $derived(hasConfiguredSupportChat(page.data?.store?.plugins))

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
	{#if !isCheckout}
		<Nav />
	{/if}
	<main id="main" class="inter-gap flex min-h-screen flex-1 flex-col">
		{@render children()}
	</main>
	{#if !isCheckout}
		<Footer />
	{/if}
</div>

{#if supportChatConfigured}
	<StorePlugins />
{/if}

<!-- Self-gates on the store's admin toggle via /api/commerce-assistant/config -->
<ConversationalShopping />
