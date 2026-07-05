<script lang="ts">
	import { setCartState, setWishlistState } from '$lib/core/stores/index.js'
	import type { Snippet } from 'svelte'
	import Nav from '$lib/components/nav/nav.svelte'
	import Footer from '$lib/components/common/footer.svelte'
	import { StorePlugins } from '$lib/core/components/index.js'
	let { children }: { children: Snippet } = $props()

	setCartState()
  setWishlistState()
</script>

<StorePlugins />

<Nav />

<main class="min-h-screen">
	{@render children()}
</main>
<Footer />
