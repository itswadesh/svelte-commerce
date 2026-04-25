<script lang="ts">
	import { page } from '$app/state'
	import { Plus, Minus } from '@lucide/svelte'
	import { Button } from '$lib/components/ui/button'
	import LoadingDots from '$lib/core/components/common/loading-dots.svelte'
	import LazyImg from '$lib/core/components/image/lazy-img.svelte'
	import EmptyImage from '$lib/core/components/image/empty-image.svelte'
	import { getCartState } from '$lib/core/stores/index.js'

	import { formatPrice } from '$lib/core/utils'
	import { ProductCardRenderer } from '$lib/core/composables/index.js'

	const cartState = getCartState()
	let { product, aspectRatio, displayProduct, hideVariations = true, hideCartControls = true }: any = $props()
</script>

<ProductCardRenderer {product} {aspectRatio}>
	{#snippet content({ aspectHeight, aspectWidth, handleCardClick, changeQuantity, addToCart })}
		<button
			onclick={handleCardClick}
			class="aspect-[{page?.data?.store?.productImageAspectRatio?.replace(
				':',
				'/'
			)}] group mb-4 flex w-full flex-col justify-start overflow-hidden rounded-lg border-none bg-white shadow-none transition-all duration-300 dark:bg-gray-800 dark:text-white"
			aria-label="Product card for {product.name}"
		>
			<div class="group relative flex h-full w-full overflow-hidden bg-gray-50 dark:bg-gray-900">
				{#if product.tag}
					<div class="absolute left-0 top-0 z-30 max-h-[20px] max-w-fit px-3 {product.tag.color}" role="status">
						<p class="text-[10px] font-bold uppercase tracking-wider text-white">{product.tag.title}</p>
					</div>
				{/if}
				<a
					href="/products/{product.slug}?variant_id={product?.variants?.[0]?.id || ''}"
					class="flex h-full w-full justify-center"
					aria-label="View details of {product.name}"
				>
					{#if product.thumbnail || product?.image_url}
						<LazyImg
							src={product.thumbnail || product?.image_url}
							alt="{product.title || product.name} product image"
							height="200"
							width={String(200 * (aspectWidth / aspectHeight))}
							class="inset-0 h-[200px] object-contain transition-transform duration-500"
							placeholder-class="bg-gray-300 dark:bg-gray-700"
						/>
					{:else}
						<EmptyImage class="object-cover" />
					{/if}
				</a>

				{#if !hideCartControls}
					<div
						class="absolute bottom-0 left-0 right-0 z-10 flex w-full translate-y-full items-center p-0 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
						role="group"
						aria-label="Quantity controls for {product.name}"
					>
						{#if cartState.cart?.lineItems?.some((item) => item.productId === product.id)}
							<Button
								disabled={!!cartState.isUpdatingCart}
								variant="outline"
								size="icon"
								class="w-full rounded-none border-gray-200 bg-white/90 p-0 text-xs backdrop-blur-sm transition-colors hover:bg-white dark:border-gray-500"
								onclick={() => changeQuantity(product, -1)}
								aria-label="Decrease quantity of {product.name}"
							>
								<Minus class="h-4 w-4" />
							</Button>
							<div class="flex flex-1 items-center justify-center bg-white/90 text-sm font-bold backdrop-blur-sm">
								{#if cartState.isUpdatingCart}
									<LoadingDots />
								{:else}
									<span role="status" aria-live="polite">
										{cartState.cart?.lineItems?.find((item) => item.productId === product.id)?.qty}
									</span>
								{/if}
							</div>
							<Button
								disabled={!!cartState.isUpdatingCart}
								variant="outline"
								size="icon"
								class="w-full rounded-none border-gray-200 bg-white/90 p-0 text-xs backdrop-blur-sm transition-colors hover:bg-white dark:border-gray-500"
								onclick={() => changeQuantity(product, 1)}
								aria-label="Increase quantity of {product.name}"
							>
								<Plus class="h-4 w-4" />
							</Button>
						{:else}
							<Button
								disabled={!!cartState.isUpdatingCart}
								variant="default"
								class="w-full rounded-none bg-gray-900 py-6 text-xs font-bold uppercase tracking-widest text-white transition-all duration-300 ease-out-expo hover:bg-primary active:scale-95"
								onclick={() => addToCart(product)}
							>
								{#if cartState.isUpdatingCart}
									<LoadingDots />
								{:else}
									Quick Add
								{/if}
							</Button>
						{/if}
					</div>
				{/if}
			</div>

			<div class="flex flex-1 flex-col p-3 text-left">
				<!-- {#if page?.data?.store?.plugins?.isMultiVendor?.active}
					<a href={`/store/${product?.vendor?.slug || product?.vendor?.id}`} class="mb-1 text-[10px] font-bold uppercase tracking-widest text-gray-400"
						>{product.vendor?.businessName}</a
					>
				{/if} -->
				
				<a href="/products/{product.slug}" class="group/title flex-1">
					<h3 class="line-clamp-2 text-sm sm:text-sm font-medium text-center leading-snug text-gray-900 transition-colors group-hover/title:text-primary dark:text-gray-100">
						{product.title}
					</h3>
				</a>

				<div class="mt-2 flex items-baseline justify-center gap-2">
					<span class="text-sm font-bold text-gray-900 dark:text-white">
						{formatPrice(product.price, page?.data?.store?.currency?.code)}
					</span>
					{#if product.mrp && product.mrp > product.price}
						<span class="text-xs text-gray-400 line-through">
							{formatPrice(product.mrp, page?.data?.store?.currency?.code)}
						</span>
					{/if}
						<!-- <span class="text-[10px] font-bold text-orange-600 uppercase">
							{Math.round(((product.mrp - product.price) / product.mrp) * 100)}% Off
						</span> -->
				</div>

				{#if !hideVariations && product.variants.length > 1}
					<div class="mt-3 flex gap-1.5">
						{#each product.variants as variant, i (variant.id)}
							<a href={`/products/${product.slug}?variant_id=${variant.id || ''}`} class="group/variant">
								<div class="h-6 w-6 overflow-hidden rounded-full border border-gray-200 p-0.5 transition-colors group-hover/variant:border-primary">
									<img
										src={variant.thumbnail || product.thumbnail}
										alt="{product.title} - {variant.name}"
										class="h-full w-full rounded-full object-cover"
									/>
								</div>
							</a>
						{/each}
					</div>
				{/if}
			</div>
		</button>
	{/snippet}
</ProductCardRenderer>

<!-- <div
      class="absolute right-1 top-1 z-20 ml-2 flex max-h-[60px] justify-between space-y-2 opacity-100 transition-opacity duration-300 group-hover:opacity-100 mobilel:right-2 mobilel:top-2 laptop:opacity-0"
    >
      <Button
				variant="outline"
				size="icon"
				class="z-20 rounded-full border border-gray-300 bg-white p-2 hover:bg-gray-100 dark:border-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600"
				onclick={() => displayProduct(product)}
				aria-label="Quick view {product.name}"
			>
				<Eye aria-hidden="true" />
			</Button>
      <Button
				variant="outline"
				size="icon"
				class="rounded-full border border-gray-300 bg-white p-2 hover:bg-gray-100 dark:border-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600"
				onclick={() => {
					/* Add like logic here */
					handleToggleWishlist(product.id, product.variants[0].id)
				}}
				aria-label="Add {product.name} to wishlist"
			>
				<Heart aria-hidden="true" />
			</Button>
    </div> -->
