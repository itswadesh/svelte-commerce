<script lang="ts">
	import { setCartState } from '$lib/core/stores/cart.svelte'
	import type { Snippet } from 'svelte'
	import Nav from '$lib/components/nav/nav.svelte'
	import Footer from '$lib/components/common/footer.svelte'
	import BottomNav from '$lib/components/nav/bottom-nav.svelte'
	import StorePlugins from '$lib/core/components/plugins/store-plugins.svelte'
	let { children }: { children: Snippet } = $props()

	setCartState()
</script>

<StorePlugins />

<Nav />

<main class="min-h-screen">
	{@render children()}
</main>
<Footer />
<BottomNav />
