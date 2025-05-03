<script lang="ts">
	import { ChevronRight } from 'lucide-svelte'

	let { data } = $props()
</script>

<svelte:head>
	<title>Category - {data.category.name || ''}</title>
</svelte:head>
<div class="min-h-screen bg-gray-50">
	<!-- Category Banner -->
	<div class="relative h-40 overflow-hidden bg-gray-100 md:h-64">
		<img src={data.category.banner} alt={data.category.name} class="h-full w-full object-cover object-center" />
		<div class="absolute inset-0 bg-black/30" />
		<div class="absolute inset-0 flex items-center justify-center">
			<h1 class="text-3xl font-bold text-white md:text-4xl">{data.category.name}</h1>
		</div>
	</div>

	<div class="container mx-auto max-w-6xl px-4 py-8">
		<!-- Featured Collections -->
		<section class="mb-12">
			<h2 class="mb-6 text-xl font-medium">Featured Collections</h2>
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
				{#each data.category.featuredCollections as collection}
					<a href="/categories/{data.category.slug}/{collection.slug}" class="group relative aspect-[2/1] overflow-hidden rounded-lg md:aspect-[3/2]">
						<img
							src={collection.image}
							alt={collection.name}
							class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
						/>
						<div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
						<div class="absolute bottom-0 left-0 right-0 p-4">
							<h3 class="text-lg font-medium text-white">{collection.name}</h3>
						</div>
					</a>
				{/each}
			</div>
		</section>

		<!-- Subcategories -->
		<section>
			<h2 class="mb-6 text-xl font-medium">Shop by Category</h2>
			<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
				{#each data.category.subcategories as subcategory}
					<div>
						<h3 class="mb-3 text-lg font-medium">{subcategory.name}</h3>
						<ul class="space-y-2">
							{#each subcategory.items as item}
								<li>
									<a href="/categories/{data.category.slug}/{item.slug}" class="group flex items-center justify-between">
										<span class="text-gray-600 transition-colors group-hover:text-primary">
											{item.name}
										</span>
										<span class="text-sm text-gray-400">({item.count})</span>
									</a>
								</li>
							{/each}
						</ul>
					</div>
				{/each}
			</div>
		</section>
	</div>
</div>
