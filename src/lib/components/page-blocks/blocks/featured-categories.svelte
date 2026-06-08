<script lang="ts">
	import { categoryService, type Category } from '$lib/core/services/index.js'
	import { onMount } from 'svelte'
	import LazyImg from '$lib/core/components/image/lazy-img.svelte'
	import { Skeleton } from '$lib/components/ui/skeleton'
	import { Button } from '$lib/components/ui/button'
	import { toast } from '@misiki/kitcommerce-core'

	const { block } = $props()

	let categories: Category[] | null = $state(null)
	let loadingForCategory = $state(false)

	onMount(async () => {
		try {
			loadingForCategory = true
			const res = await categoryService.fetchFeaturedCategories({ limit: block.metadata.limit || 1000 })
			categories = res?.data
		} catch (e: any) {
			toast.error(e?.message || 'Failed to load categories')
		} finally {
			loadingForCategory = false
		}
	})
</script>

<div class="w-full py-8">
	{#if block.metadata.showHeader}
		<div class="mb-6 flex flex-col items-center justify-between gap-6 md:flex-row md:items-end">
			<div class="text-center md:text-left">
				{#if block.metadata.title}
					<h2 class="text-3xl font-extrabold tracking-tight text-foreground lg:text-4xl">{block.metadata.title}</h2>
					<div class="mx-auto mt-2 h-1 w-12 bg-primary md:mx-0"></div>
				{/if}
				{#if block.metadata.subtitle}
					<p class="mt-4 text-sm font-medium text-muted-foreground">{block.metadata.subtitle}</p>
				{/if}
			</div>
			{#if block.metadata.showViewMore}
				<Button href={block.metadata.redirectsTo || "/categories"} class="group">
					{block.metadata.viewMoreText}
					<svg xmlns="http://www.w3.org/2000/svg" class="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
					</svg>
				</Button>
			{/if}
		</div>
	{/if}

	<div class="grid gap-2 px-2" style="grid-template-columns: repeat({block.metadata.columnCount || 5}, 1fr);">
		{#if loadingForCategory}
			{#each Array(6) as _}
				<div class="flex flex-col items-center">
					<Skeleton class="aspect-square w-full" />
					<Skeleton class="mt-4 h-4 w-2/3 rounded-full" />
				</div>
			{/each}
		{:else}
			{#each categories as { slug, icon, color, name, link, thumbnail, parentCategoryId } (slug)}
				<a href={link ? link : slug ? `/${slug}` : `/products`} class="group flex flex-col items-center focus:outline-none">
					<div class="relative aspect-square w-full overflow-hidden bg-muted bg-red-200 shadow-sm transition-all duration-500 ease-out">
						<LazyImg src={thumbnail} alt={name} class="h-full w-full object-cover transition-transform duration-700 ease-in-out" />
					</div>
					<span class="mt-2 px-2 text-center text-sm font-bold tracking-tight text-foreground transition-colors duration-300 lg:text-base">
						{name}
					</span>
				</a>
			{/each}
		{/if}
	</div>
</div>
