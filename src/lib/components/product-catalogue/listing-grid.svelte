<script lang="ts">
	import { page } from '$app/state'
	import Pagination from '$lib/components/common/pagination.svelte'
	import ProductCard from '$lib/components/product-catalogue/product-card.svelte'
	import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte'
	import { SearchService } from '$lib/core/services/index.js'

	const data = $derived(page.data)
	const searchService = new SearchService(fetch)
	const listingQueryKey = $derived.by(() => {
		const params = new URLSearchParams(page.url.search)
		params.delete('page')
		return `${page.url.pathname}?${params.toString()}`
	})

	let products = $state<any[]>([])
	let currentPage = $state(1)
	let loadingMore = $state(false)
	let previousListingQueryKey = ''

	const hasMore = $derived(currentPage < (data.products?.totalPages ?? 0))

	$effect(() => {
		if (listingQueryKey !== previousListingQueryKey) {
			previousListingQueryKey = listingQueryKey
			products = data.products?.data ?? []
			currentPage = Number(page.url.searchParams.get('page') ?? 1)
		}
	})

	async function loadNextPage() {
		if (loadingMore || !hasMore) return

		loadingMore = true
		try {
			const nextUrl = new URL(page.url)
			nextUrl.searchParams.set('page', String(currentPage + 1))
			const result = await searchService.searchWithUrl(nextUrl, page.params.slug)
			products = [...products, ...result.data]
			currentPage += 1
		} finally {
			loadingMore = false
		}
	}

	function infiniteScroll(node: HTMLElement) {
		if (!window.matchMedia('(max-width: 1023px)').matches) return

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) loadNextPage()
			},
			{ rootMargin: '320px 0px' }
		)

		observer.observe(node)
		return { destroy: () => observer.disconnect() }
	}
</script>

{#if !data.products?.data?.length}
	<div class="intra-gap flex h-96 flex-col items-center justify-center">
		<p class="text-md uppercase text-gray-500">No products found</p>
		<a href="/products" class="text-sm font-bold uppercase tracking-widest text-primary underline underline-offset-4">Clear all filters</a>
	</div>
{:else}
	<div class="intra-gap grid auto-rows-auto grid-cols-2 lg:grid-cols-3">
		{#each products as product (product.id)}
			<ProductCard {product} />
		{/each}
	</div>

	{#if hasMore || loadingMore}
		<div use:infiniteScroll class="mt-6 flex min-h-16 items-center justify-center lg:hidden" aria-live="polite">
			{#if loadingMore}
				<div class="grid grid-cols-2 gap-3" aria-label="Loading more products">
					<Skeleton class="h-2 w-20 bg-gray-200 dark:bg-gray-700" />
					<Skeleton class="h-2 w-20 bg-gray-200 dark:bg-gray-700" />
				</div>
			{:else}
				<span class="text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">Loading more</span>
			{/if}
		</div>
	{:else if products.length > 0}
		<p class="mt-8 text-center text-xs font-semibold uppercase tracking-[0.16em] text-gray-400 lg:hidden">You've reached the end</p>
	{/if}

	<div class="hidden lg:block">
		<Pagination noOfPage={data.products.totalPages} />
	</div>
{/if}
