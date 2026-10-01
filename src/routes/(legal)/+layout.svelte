<script lang="ts">
	import { setCartState, setWishlistState } from '$lib/core/stores/index.js'
	import type { Snippet } from 'svelte'
	import { page } from '$app/state'
	import Nav from '$lib/components/nav/nav.svelte'
	import Footer from '$lib/components/common/footer.svelte'
	import { StorePlugins } from '$lib/core/components/index.js'
	import { hasConfiguredSupportChat } from '$lib/components/common/store-capabilities.js'
	let { children }: { children: Snippet } = $props()

	setCartState()
	setWishlistState()

	// StorePlugins mounts the support-chat widget, and the core component substitutes a demo account
	// id and slug when the merchant has not filled one in. A merchant who switches the plugin on
	// before configuring it therefore ships a live chat bubble that delivers their shoppers into
	// another business's support inbox. Mount it only when there is a real account to reach.
	const supportChatConfigured = $derived(hasConfiguredSupportChat(page.data?.store?.plugins))
</script>

{#if supportChatConfigured}
	<StorePlugins />
{/if}

<a
	href="#main"
	class="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-skip focus:rounded focus:bg-background focus:p-3 focus:shadow"
>
	Skip to main content
</a>
<Nav />

<main id="main" class="min-h-screen">
	{@render children()}
</main>
<Footer />
