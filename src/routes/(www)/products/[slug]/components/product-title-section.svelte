<script lang="ts">
	import { Star, StarHalf } from '@lucide/svelte'
	import { page } from '$app/state'
	import ShareButton from '$lib/core/components/plugins/share-button.svelte'

	const { product } = $props()
</script>

<div class="relative sm:border-b sm:border-gray-100">
	<div class="flex items-start justify-between gap-4">
		<h1 class="text-xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl uppercase">
			{product.title}
		</h1>

		{#if page?.data?.store?.plugins?.socialSharingButtons}
			<div class="block sm:hidden flex-shrink-0">
				<ShareButton productName={product?.title} productImage={product?.thumbnail} url={page?.url?.href} />
			</div>
		{/if}
	</div>

	{#if product.subtitle}
		<div class="mt-2 text-sm font-medium text-gray-500 uppercase tracking-widest sm:text-base">
			{@html product.subtitle}
		</div>
	{/if}
	
	<div class="mt-4 flex items-center gap-4">
		{#if product?.rating && page?.data?.store?.plugins?.enableReviews}
			<div class="flex items-center gap-2">
				<div class="relative flex items-center">
					<div class="flex gap-0.5">
						{#each { length: 5 } as _}
							<Star class="h-4 w-4 fill-gray-100 text-gray-100" />
						{/each}
					</div>
					<div class="absolute top-0 left-0 flex gap-0.5 overflow-hidden">
						{#each { length: 5 } as _, i}
							<Star 
								class="h-4 w-4 {i < Math.floor(product.rating) ? 'fill-primary text-primary' : 'hidden'}" 
							/>
						{/each}
						{#if product.rating % 1 > 0}
							<StarHalf class="h-4 w-4 fill-primary text-primary" />
						{/if}
					</div>
				</div>
				<span class="text-xs font-bold text-gray-900 dark:text-gray-100">{product.rating}</span>
				<span class="h-1 w-1 rounded-full bg-gray-300"></span>
				<span class="text-xs font-medium text-gray-500 hover:text-primary transition-colors cursor-pointer">View Reviews</span>
			</div>
		{/if}
	</div>
</div>
