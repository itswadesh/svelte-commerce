<script lang="ts">
	// import { CategoryService } from '$lib/services'
	// import { onMount } from 'svelte'
	import LazyImg from '$lib/core/components/image/lazy-img.svelte'
	import { Skeleton } from '$lib/components/ui/skeleton'

	import { Button } from '$lib/components/ui/button'

	// let categories = $state([])
	let { categories, loading } = $props()
</script>

{#if categories?.length}
	<div class="py-8 w-full">
		<div class="mb-6 flex flex-col items-center justify-between gap-6 md:flex-row md:items-end">
			<div class="text-center md:text-left">
				<h2 class="text-3xl font-extrabold tracking-tight text-foreground lg:text-4xl">Top Categories</h2>
				<div class="mx-auto mt-2 h-1 w-12 bg-primary md:mx-0"></div>
				<p class="mt-4 text-sm font-medium text-muted-foreground">Discover our curated range of products by category</p>
			</div>
			<Button
				href="/categories"
				class="group"
			>
				View all categories
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="ml-2 h-4 w-4"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
				</svg>
			</Button>
		</div>

		<div class="grid grid-cols-2 gap-2 px-2 mobiles:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-6">
			{#if loading}
				{#each Array(6) as _}
					<div class="flex flex-col items-center">
						<Skeleton class="aspect-square w-full" />
						<Skeleton class="mt-4 h-4 w-2/3 rounded-full" />
					</div>
				{/each}
			{:else}
				{#each categories as { slug, icon, color, name, link, thumbnail, parentCategoryId } (slug)}
					<a href={link ? link : slug ? `/${slug}` : `/products`} class="group flex flex-col items-center focus:outline-none">
						<div
							class="relative aspect-square w-full overflow-hidden bg-red-200 bg-muted shadow-sm transition-all duration-500 ease-out"
						>
							<LazyImg
								src={thumbnail}
								alt={name}
								class="h-full w-full object-cover transition-transform duration-700 ease-in-out"
							/>
						</div>
						<span
							class="mt-2 px-2 text-center text-sm font-bold tracking-tight text-foreground transition-colors duration-300 lg:text-base"
						>
							{name}
						</span>
					</a>
				{/each}
			{/if}
		</div>
	</div>
{/if}
