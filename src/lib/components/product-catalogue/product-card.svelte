<script lang="ts">
	import { page } from '$app/state'
	import { Plus, Minus } from 'lucide-svelte'
	import { Button } from '$lib/components/ui/button'
	import LoadingDots from '$lib/core/components/common/loading-dots.svelte'
	import LazyImg from '$lib/core/components/image/lazy-img.svelte'
	import EmptyImage from '$lib/core/components/image/empty-image.svelte'
	import { getCartState } from '$lib/core/stores/cart.svelte'

	import { formatPrice } from '$lib/core/utils'
	import ProductCardRenderer from '$lib/core/composables/product-card-renderer.svelte'

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
			)}] group mb-4 flex w-full flex-col justify-start overflow-hidden rounded-none border-none shadow-none transition-colors duration-300 hover:shadow-sm dark:bg-gray-800 dark:text-white"
			aria-label="Product card for {product.name}"
		>
			<div class="group flex h-full w-full overflow-hidden">
				{#if product.tag}
					<div class="absolute left-0 top-0 z-30 max-h-[20px] max-w-fit px-3 {product.tag.color}" role="status">
						<p class="text-[12px] text-white">{product.tag.title}</p>
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
							alt="{product.name} product image"
							height="200"
							width={String(200 * (aspectWidth / aspectHeight))}
							class="inset-0 h-[200px] object-contain transition-transform duration-300"
							placeholder-class="bg-gray-300 dark:bg-gray-700"
						/>
					{:else}
						<EmptyImage class="object-cover" />
					{/if}
				</a>

				{#if !hideCartControls}
					<div
						class="relative z-10 flex w-full items-center p-0 opacity-100 duration-300 laptop:absolute laptop:bottom-0 laptop:translate-y-full laptop:transform laptop:opacity-0 laptop:transition-all laptop:group-hover:translate-y-0 laptop:group-hover:opacity-100"
						role="group"
						aria-label="Quantity controls for {product.name}"
					>
						{#if cartState.cart?.lineItems?.some((item) => item.productId === product.id)}
							<Button
								disabled={!!cartState.isUpdatingCart}
								variant="outline"
								size="icon"
								class="w-full rounded-none border-gray-300 p-0 text-xs transition-colors duration-300 dark:border-gray-500"
								onclick={() => changeQuantity(product, -1)}
								aria-label="Decrease quantity of {product.name}"
							>
								<Minus aria-hidden="true" />
							</Button>
							{#if cartState.isUpdatingCart}
								<LoadingDots />
							{:else}
								<span class="text-lg font-medium" role="status" aria-live="polite">
									{cartState.cart?.lineItems?.find((item) => item.productId === product.id)?.qty}
								</span>
							{/if}
							<Button
								disabled={!!cartState.isUpdatingCart}
								variant="outline"
								size="icon"
								class="w-full rounded-none border-gray-300 p-0 text-xs transition-colors duration-300 dark:border-gray-500"
								onclick={() => changeQuantity(product, 1)}
								aria-label="Increase quantity of {product.name}"
							>
								<Plus aria-hidden="true" />
							</Button>
						{:else}
							<Button
								disabled={!!cartState.isUpdatingCart}
								variant="outline"
								class="w-full rounded-none border-gray-300 text-xs transition-colors duration-300 dark:border-gray-500"
								onclick={() => addToCart(product)}
								aria-label="Add {product.name} to cart"
							>
								{#if cartState.isUpdatingCart}
									<LoadingDots />
								{:else}
									Add to Cart
								{/if}
							</Button>
						{/if}
					</div>
				{/if}
			</div>
			<div class="mx-2 px-0 pt-1 text-left">
				{#if page?.data?.store?.plugins?.isMultiVendor?.active}
					<a href={`/store/${product?.vendor?.slug || product?.vendor?.id}`} class="text-xs font-bold tracking-wider text-gray-800 dark:text-gray-400"
						>{product.vendor?.businessName}</a
					>
				{/if}
				<a href="/products/{product.slug}">
					<div class="line-clamp-2 max-h-[3rem] text-xs font-medium text-gray-500 dark:text-gray-200">
						{product.title}
					</div>
				</a>
			</div>
			<div class="mx-2 flex flex-col space-y-1 px-0">
				<div class="flex items-baseline gap-1 overflow-hidden whitespace-nowrap">
					<div class="text-sm font-bold text-black dark:text-gray-100">
						{formatPrice(product.price, page?.data?.store?.currency?.code)}
					</div>
					{#if product.mrp && product.mrp > product.price}
						<div class="text-xs text-gray-600 line-through">
							{formatPrice(product.mrp, page?.data?.store?.currency?.code)}
						</div>
						<div class="truncate text-xs font-thin text-[#00b852]">
							{Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
						</div>
					{/if}
				</div>
				{#if !hideVariations && product.variants.length > 1}
					<div class="mt-2 flex space-x-2">
						{#each product.variants as variant, i (variant.id)}
							<a href={`/products/${product.slug}?variant_id=${variant.id || ''}`}>
								<img
									src={variant.thumbnail || product.thumbnail}
									alt={`Variant ${i + 1}`}
									class="h-8 w-8 rounded-full border-gray-300 object-contain dark:border-gray-600"
								/>
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
