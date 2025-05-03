<script lang="ts">
	import { Star, StarHalf } from 'lucide-svelte'
	import { page } from '$app/state'
	import ShareButton from '$lib/core/components/plugins/share-button.svelte'

	const { product } = $props()
</script>

<div class="relative sm:border-b sm:pb-3">
	<div class="flex items-center justify-between">
		<h1 class="break-words break-all text-base font-bold sm:text-2xl">
			{product.title}
		</h1>

		{#if page?.data?.store?.plugins?.socialSharingButtons}
			<div class="block sm:hidden">
				<ShareButton productName={product?.title} productImage={product?.thumbnail} url={page?.url?.href} />
			</div>
		{/if}
	</div>

	{#if product.subtitle}
		<h2 class="text-gray-500 max-sm:text-sm">
			{@html product.subtitle}
		</h2>
	{/if}
	<div class="mt-1 flex items-center gap-4">
		<div class="flex gap-2">
			{#if product?.rating && page?.data?.store?.plugins?.enableReviews}
				<div class="relative">
					<div class="flex gap-1">
						{#each { length: 5 } as _, i}
							<Star fill="#111" strokeWidth={1} class="h-5 w-5 fill-none stroke-muted-foreground" />
						{/each}
					</div>
					<div class="absolute top-0 flex gap-1">
						{#each { length: Math.floor(product.rating) } as _, i}
							<Star fill="yellow" strokeWidth={0} class="h-5 w-5 fill-primary" />
						{/each}
						{#if product.rating % 1 > 0}
							<StarHalf fill="yellow" strokeWidth={0} class="h-5 w-5 fill-primary" />
						{/if}
					</div>
				</div>
				<span class="text-sm text-gray-500">({product?.rating || 0})</span>
			{/if}
		</div>
	</div>
</div>
