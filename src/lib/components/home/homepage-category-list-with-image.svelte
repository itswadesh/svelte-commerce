<script lang="ts">
	// import { CategoryService } from '$lib/services'
	// import { onMount } from 'svelte'
	import LazyImg from '$lib/core/components/image/lazy-img.svelte'
	import { Skeleton } from '$lib/components/ui/skeleton'

	// let categories = $state([])
	let { categories, loading } = $props()

	// onMount(async () => {
	// 	try {
	// 		featuredCategories = (await CategoryService.fetchFeaturedCategories({ limit: 18 }))?.data || []
	// 	} finally {
	// 		loading = false
	// 	}
	// })
</script>

{#if categories?.length}
	<div class="mx-2 lg:mx-0">
		<h2 class="my-8 text-center text-xl font-bold uppercase">Top Category</h2>
		<div class="grid grid-cols-3 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
			{#if loading}
				{#each Array(12) as _}
					<div class="mb-4 flex flex-col items-center">
						<Skeleton class="aspect-square w-full rounded-none" />
						<Skeleton class="mt-3 h-5 w-32" />
					</div>
				{/each}
			{:else}
				{#each categories.filter((category) => category.parentCategoryId != null) as { slug, icon, color, name, link, thumbnail, parentCategoryId } (slug)}
					<a href={link ? link : slug ? `/${slug}` : `/products`} class="mb-4 flex flex-col items-center">
						<div class="aspect-square w-full bg-gray-100">
							<LazyImg src={thumbnail} alt="Category Image" class="h-full w-full object-cover" />
						</div>
						<div class="mt-3 w-32 truncate text-center text-xs font-bold lg:text-sm">
							{name}
						</div>
					</a>
				{/each}
			{/if}
		</div>
	</div>
{/if}
