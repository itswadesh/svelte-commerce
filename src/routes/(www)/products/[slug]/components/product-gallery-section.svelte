<script lang="ts">
	import { ImageOff } from '@lucide/svelte'
	import { page } from '$app/state'
	import { useProductState } from '$lib/core/composables/index.js'
	import * as Drawer from '$lib/components/ui/drawer/index.js'
	import * as Carousel from '$lib/components/ui/carousel/index.js'
	import ProductGallery from './product-gallery.svelte'
	import ShareButton from '$lib/core/components/plugins/share-button.svelte'
	import ProductCard from '$lib/components/product-catalogue/product-card.svelte'
	import { getImageCDNUrl } from '@misiki/kitcommerce-core/utils'

	const productState = useProductState()
	// The LCP element is the first gallery image, and it sits deep in the document (~246KB on jws,
	// behind the inlined style block), so the parser did not request it until ~1.2s after TTFB even
	// though the image itself costs far less than that to transfer. The delay is discovery, not bytes.
	// SvelteKit emits svelte:head content near the top of the head, ahead of the inline CSS, so the
	// preload scanner sees this almost immediately and starts the fetch while the document streams.
	//
	// NOTE: keep literal markup tags out of this comment. vite-preprocess scans the component text
	// for a style tag and will treat everything after one as CSS, which breaks the build.
	//
	// Measured on jws, identical local build with only this tag toggled (Pixel 5 / 4x CPU / Slow 4G):
	//   without preload  LCP image request starts 1615ms after TTFB
	//   with preload     LCP image request starts   48ms after TTFB
	//
	// The href MUST match what the gallery's main image renders — getImageCDNUrl(src, 1280, 0), the
	// cdnW/h defaults LazyImg uses for an auto-sized image — or the browser downloads it twice.
	// No imagesrcset/imagesizes: the main image deliberately carries no srcset (only the 96px
	// thumbnails do). If one is ever added there, this tag needs matching attributes.
	const videoURLRegex = /mp4$|webm$/
	const lcpImage = $derived.by(() => {
		const first = productState.productImagesArray?.[0]
		if (!first || videoURLRegex.test(first) || /youtube\.com|youtu\.be/.test(first)) return null
		return getImageCDNUrl(first, 1280, 0)
	})
</script>

<svelte:head>
	{#if lcpImage}
		<link rel="preload" as="image" fetchpriority="high" href={lcpImage} />
	{/if}
</svelte:head>

<div class="relative">
	{#if page?.data?.store?.plugins?.socialSharingButtons}
		<div class="edp-gallery-float absolute right-2 top-2 z-30 block rounded-full bg-white">
			<ShareButton productName={page.data?.product?.title} productImage={page.data?.product?.thumbnail} url={page?.url?.href} />
		</div>
	{/if}
	{#if productState.productImagesArray?.length > 0}
		<div class="relative">
			<ProductGallery images={productState.productImagesArray || []} />
		</div>

		<Drawer.Root direction="bottom" bind:open={productState.showSimilarDrawer}>
			{#if productState.productsOfSameCategory?.length}
				<Drawer.Trigger class="edp-gallery-float absolute bottom-12 right-4 rounded-full bg-white p-2 sm:hidden">
					<div class="">
						<svg
							class="[&>*]:stroke-[1.2]"
							xmlns="http://www.w3.org/2000/svg"
							width="1em"
							height="1em"
							fill="none"
							viewBox="0 0 20 20"
							stroke="none"
							style="height: 20px; width: 20px;"
							><g stroke="#1C1C1C" stroke-width="1.5" clip-path="url(#icon-ymal_svg__a)"
								><rect width="8.9" height="13.7" x="5.55" y="3.15" rx="1.25"></rect><path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="m14.4 6.4 4 1.2-4 8.8M5.6 6.4l-4 1.2 4 8.8"
								></path></g
							><defs><clipPath id="icon-ymal_svg__a"><path fill="#fff" d="M0 0h19.2v19.2H0z"></path></clipPath></defs></svg
						>
						<span class="sr-only">View similar</span>
					</div>
				</Drawer.Trigger>
			{/if}
			<Drawer.Content class="">
				<Drawer.Header class="text-left">
					<Drawer.Title>You May Also Like</Drawer.Title>
				</Drawer.Header>
				{#if productState.productsOfSameCategory?.length}
					<Carousel.Root class="px-4">
						<Carousel.Content>
							{#each productState.productsOfSameCategory as product}
								<Carousel.Item
									class="basis-1/2"
									onclick={() => {
										productState.showSimilarDrawer = false
									}}
								>
									<ProductCard {product} />
								</Carousel.Item>
							{/each}
						</Carousel.Content>
					</Carousel.Root>
				{/if}
			</Drawer.Content>
		</Drawer.Root>
	{:else}
		<!-- A product with no media used to render nothing at all, leaving the whole left column of the
		     page blank beside the buy box. Reserve the same square the gallery would occupy and say
		     plainly that there is no photograph, rather than letting the layout look broken. -->
		<div
			class="flex aspect-square w-full flex-col items-center justify-center gap-3 rounded-lg border border-border bg-muted text-muted-foreground"
			data-testid="product-image"
		>
			<ImageOff class="h-10 w-10" aria-hidden="true" />
			<p class="text-sm">No photo of this product yet</p>
		</div>
	{/if}
</div>

<style>
	/* Refined Editorial — default theme only. */
	:global([data-theme='default'] .edp-gallery-float) {
		background: var(--ed-surface);
		border: 1px solid var(--ed-line);
		box-shadow: 0 6px 20px -12px rgba(27, 26, 23, 0.3);
	}
</style>
