<script lang="ts">
	import { ChevronRight, Home } from 'lucide-svelte'
	let { categoryHierarchy }: { categoryHierarchy?: Record<string, any>[] } = $props()

	// let items = $state([])
	// let isProductsPage = $derived(page.route?.id === '/(www)/products/[slug]')
</script>

<!-- {JSON.stringify(product.categoryHierarchy)} -->
<nav class="flex overflow-hidden truncate" aria-label="Breadcrumb">
	<div class="inline-flex items-center space-x-1 text-sm md:space-x-2">
		<div class="inline-flex items-center">
			<a href="/" class="inline-flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
				<Home class="mr-2 h-4 w-4" />
				Home
			</a>
		</div>
		<ol class="hidden sm:inline-flex md:items-center md:space-x-2">
			{#each categoryHierarchy as { slug, name, href }, i}
				<li>
					<div class="flex w-max items-center">
						<ChevronRight class="h-4 min-h-4 w-4 min-w-4 text-gray-400" />
						<div class="grid grid-cols-1">
							<a href="/{slug}" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white md:ml-2">
								{name}
							</a>
						</div>
					</div>
				</li>
			{/each}
		</ol>

		<!-- <ol class="flex sm:hidden">
			{#if product.categoryHierarchy?.length > 1}
				<li>
					<div class="flex items-center">
						<ChevronRight class="h-4 w-4 text-gray-400" />
						<span class="ml-1 text-gray-600 dark:text-gray-300 md:ml-2">...</span>
						<ChevronRight class="h-4 w-4 text-gray-400" />
					</div>
				</li>
			{/if}
			<li>
				<div class="grid grid-cols-1">
					<a
						href={product.categoryHierarchy?.[items?.length - 1]?.href}
						class="ml-1 truncate text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white md:ml-2"
					>
						{product.categoryHierarchy?.[product.categoryHierarchy?.length - 1]?.label}
					</a>
				</div>
			</li>
		</ol> -->
	</div>
</nav>
