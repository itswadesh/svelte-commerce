<script lang="ts">
	import { Star, StarHalf } from '@lucide/svelte'
	import { page } from '$app/state'
	import { Button } from '$lib/components/ui/button'

	const { product } = $props()
</script>

<div class="relative sm:border-b sm:border-gray-100">
	<div class="flex items-start justify-between">
		<h1 class="text-md font-bold uppercase tracking-tight text-gray-900 dark:text-white sm:text-xl">
			{product.title}
		</h1>
	</div>

	{#if product.subtitle}
		<div class="mt-2 line-clamp-2 text-sm font-medium text-gray-500 sm:text-sm">
			{@html product.subtitle}
		</div>
	{/if}

	<div class="intra-pt flex items-center gap-4">
		{#if product?.rating && page?.data?.store?.plugins?.enableReviews}
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
		{/if}
	</div>
</div>
