<script lang="ts">
	import { ChevronRight } from 'lucide-svelte'

	let { data } = $props()
</script>

<svelte:head>
	<title>Categories</title>
</svelte:head>
<div class="container max-w-6xl px-4 py-4 md:py-10">
	<h1 class="mb-6 text-xl font-medium md:text-2xl">Shop by Category</h1>

	<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
		{#each data.categories as category}
			<a
				href="/categories/{category.slug}"
				class="group flex flex-col overflow-hidden rounded-lg border bg-white transition-all hover:border-primary hover:shadow-lg"
			>
				<!-- Image Container -->
				<div class="relative aspect-square overflow-hidden bg-gray-100">
					<img src={category.img} alt={category.name} class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
				</div>

				<!-- Category Info -->
				<div class="flex flex-1 flex-col p-3">
					<h3 class="font-medium">{category.name}</h3>

					<!-- Subcategories -->
					<div class="mt-1 space-y-0.5">
						{#each category.children.slice(0, 2) as child}
							<div class="text-xs text-gray-600">{child.name}</div>
						{/each}
						{#if category.children.length > 2}
							<div class="flex items-center gap-0.5 text-xs text-primary">
								<span>View All</span>
								<ChevronRight class="h-3 w-3" />
							</div>
						{/if}
					</div>
				</div>
			</a>
		{/each}
	</div>
</div>
