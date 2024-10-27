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
	<div class="py-8">
		<div class="mb-6 flex flex-col items-center justify-between gap-6 px-2 md:flex-row md:items-end">
			<div class="text-center md:text-left">
				<h2 class="text-3xl font-extrabold tracking-tight text-foreground lg:text-4xl">
					Top Categories
				</h2>
				<div class="mt-2 h-1 w-12 bg-primary mx-auto md:mx-0"></div>
				<p class="mt-4 text-sm font-medium text-muted-foreground">
					Discover our curated range of products by category
				</p>
			</div>
			<a
				href="/categories"
				class="group flex items-center rounded-full bg-secondary px-6 py-2.5 text-sm font-semibold text-secondary-foreground transition-all hover:bg-primary hover:text-primary-foreground"
			>
				View all categories
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
				</svg>
			</a>
		</div>

		<div class="grid grid-cols-2 gap-2 px-2 mobiles:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-6">
			{#if loading}
				{#each Array(6) as _}
					<div class="flex flex-col items-center">
						<Skeleton class="aspect-square w-full rounded-[2rem]" />
						<Skeleton class="mt-4 h-4 w-2/3 rounded-full" />
					</div>
				{/each}
			{:else}
				{#each categories as { slug, icon, color, name, link, thumbnail, parentCategoryId } (slug)}
					<a
						href={link ? link : slug ? `/${slug}` : `/products`}
						class="group flex flex-col items-center focus:outline-none"
					>
						<div
							class="relative aspect-square w-full overflow-hidden rounded-[2rem] bg-muted shadow-sm transition-all duration-500 ease-out group-hover:-translate-y-2 group-hover:shadow-xl group-hover:ring-2 group-hover:ring-primary/20"
						>
							<LazyImg
								src={thumbnail}
								alt={name}
								class="h-full w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
							/>
							<div
								class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
							></div>
						</div>
						<span
							class="mt-2 px-2 text-center text-sm font-bold tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary lg:text-base"
						>
							{name}
						</span>
					</a>
				{/each}
			{/if}
		</div>
	</div>
{/if}
