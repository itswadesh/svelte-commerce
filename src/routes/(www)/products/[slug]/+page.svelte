<script lang="ts">
	import ProductDetails from './components/product-details.svelte'
	import { ProductStateProvider } from '$lib/core/composables/index.js'
	import Blocks from '$lib/components/page-blocks/blocks.svelte'
	import ProductCartAndWishlistButtons from './components/product-cart-and-wishlist-buttons.svelte'

	let { data } = $props()

	// Determine if we have block-based layout configured
	const hasBlockLayout = $derived(
		(data?.productDetailPage?.layouts ?? []).some((l: any) => l.blocks?.length > 0)
	)
</script>

<ProductStateProvider {data}>
	{#if hasBlockLayout}
		<!-- Block-based layout from admin page builder -->
		<Blocks layouts={data?.productDetailPage?.layouts ?? []} />

		<!-- Mobile sticky cart bar (block layout mode) -->
		<div
			class="sticky inset-x-0 bottom-0 flex w-full items-center gap-3 border-t border-gray-100 bg-white/95 p-page shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] backdrop-blur-md sm:hidden"
		>
			<div class="flex-1 flex flex-col intra-gap">
				<ProductCartAndWishlistButtons showWishlist={false} />
			</div>
		</div>
	{:else}
		<!-- Hardcoded fallback layout (default until blocks are seeded/configured) -->
		<ProductDetails />
	{/if}
</ProductStateProvider>

