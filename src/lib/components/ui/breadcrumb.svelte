<script lang="ts">
	import { ChevronRight, Home } from '@lucide/svelte'
	let { categoryHierarchy }: { categoryHierarchy?: Record<string, any>[] } = $props()

	// let items = $state([])
	// let isProductsPage = $derived(page.route?.id === '/(www)/products/[slug]')
</script>

{#if categoryHierarchy && categoryHierarchy.length > 0}
	<nav class="flex overflow-x-auto scrollbar-none whitespace-nowrap sm:py-1" aria-label="Breadcrumb">
		<div class="inline-flex items-center space-x-1 text-sm md:space-x-2">
			<div class="inline-flex flex-shrink-0 items-center">
				<a href="/" class="inline-flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
					<Home class="mr-2 h-4 w-4 max-sm:hidden flex-shrink-0" />
					Home
				</a>
			</div>
			<ol class="inline-flex items-center space-x-1 md:space-x-2">
				{#each categoryHierarchy as { slug, name }, i}
					<li class="flex-shrink-0">
						<div class="flex items-center">
							<ChevronRight class="h-4 min-h-4 w-4 min-w-4 text-gray-400 flex-shrink-0" />
							<div class="grid grid-cols-1">
								<a
									href="/{slug}"
									class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white md:ml-2 block {i === categoryHierarchy.length - 1 ? 'truncate max-w-[500px]' : ''}"
									title={name}
								>
									{name}
								</a>
							</div>
						</div>
					</li>
				{/each}
			</ol>
		</div>
	</nav>
{/if}

<style>
	/* Hide scrollbar for Chrome, Safari and Opera */
	.scrollbar-none::-webkit-scrollbar {
		display: none;
	}
	/* Hide scrollbar for IE, Edge and Firefox */
	.scrollbar-none {
		-ms-overflow-style: none;  /* IE and Edge */
		scrollbar-width: none;  /* Firefox */
	}
</style>
