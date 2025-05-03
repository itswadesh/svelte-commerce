<script>
	import { page } from '$app/state'
	import { useProductState } from '$lib/core/composables/product'
	import * as Drawer from '$lib/components/ui/drawer'
	import * as Carousel from '$lib/components/ui/carousel'
	import ProductGallery from './product-gallery.svelte'
	import ShareButton from '$lib/core/components/plugins/share-button.svelte'
	import ProductCard from '$lib/components/product-catalogue/product-card.svelte'

	const productState = useProductState()
</script>

<div class="relative">
	<div class="absolute right-2 top-2 z-30 hidden rounded-full bg-white sm:block">
		{#if page?.data?.store?.plugins?.socialSharingButtons}
			<ShareButton productName={productState.data?.product?.title} productImage={productState.data?.product?.thumbnail} url={page?.url?.href} />
		{/if}
	</div>
	{#if productState.productImagesArray?.length > 0}
		<div class="relative">
			<ProductGallery images={productState.productImagesArray || []} />
		</div>

		<Drawer.Root direction="bottom" bind:open={productState.showSimilarDrawer}>
			{#if productState.productsOfSameCategory?.length}
				<Drawer.Trigger class="absolute bottom-12 right-4 rounded-full bg-white p-2 sm:hidden">
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
	{/if}
</div>

