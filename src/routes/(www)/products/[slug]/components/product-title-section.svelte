<script lang="ts">
	import { Star, StarHalf, HeartIcon, LoaderCircle } from '@lucide/svelte'
	import { page } from '$app/state'
	import { Button } from '$lib/components/ui/button'
	import { useProductState } from '$lib/core/composables/index.js'

	const { product } = $props()
	const productState = useProductState()
</script>

<div class="relative">

		{#if product?.categories}
		<p class="text-sm font-semibold leading-[1]">{product?.categories?.[product?.categories.length-1]?.category?.name}</p>
		{/if}


	<div class="flex items-center justify-between gap-4">
		<h1 class="text-md flex-1 font-medium tracking-tight text-gray-900 dark:text-white sm:text-xl leading-[1]">
			{product.title}
		</h1>

		{#if productState.wishlistPluginEnabled}
			<Button
				variant="plain"
				class="h-9 w-9 p-0 sm:hidden"
				onclick={productState.handleWishlistClick}
				aria-label="Add to wishlist"
			>
				{#if productState.wishlistLoading}
					<LoaderCircle class="h-6 w-6 animate-spin text-primary" />
				{:else}
					<HeartIcon
						class="h-6 w-6 {productState.wishlisted
							? 'scale-110 fill-red-500 text-red-500'
							: 'text-gray-900'} transition-transform duration-300"
					/>
				{/if}
			</Button>
		{/if}
	</div>

	{#if product.subtitle}
		<div class="mt-3 line-clamp-3 text-xs font-medium sm:text-sm">
			{@html product.subtitle}
		</div>
	{/if}

		{#if product?.rating && page?.data?.store?.plugins?.enableReviews}
	<div class="intra-pt flex items-center gap-4">
			<div class="flex items-center gap-2">
				<div class="relative flex items-center">
					<div class="flex gap-0.5">
						{#each { length: 5 } as _}
							<Star class="h-4 w-4 fill-gray-100 text-gray-100" />
						{/each}
					</div>
					<div class="absolute left-0 top-0 flex gap-0.5 overflow-hidden">
						{#each { length: 5 } as _, i}
							<Star class="h-4 w-4 {i < Math.floor(product.rating) ? 'fill-primary text-primary' : 'hidden'}" />
						{/each}
						{#if product.rating % 1 > 0}
							<StarHalf class="h-4 w-4 fill-primary text-primary" />
						{/if}
					</div>
				</div>
				<span class="text-xs font-bold text-gray-900 dark:text-gray-100">{product.rating}</span>
				<span class="h-1 w-1 rounded-full bg-gray-300"></span>
				<Button variant="link" class="h-auto p-0 text-xs font-medium">View Reviews</Button>
			</div>
	</div>
		{/if}
</div>
