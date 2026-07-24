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
	<div class="ed-empty intra-gap flex h-96 flex-col items-center justify-center">
		<p class="ed-empty__title text-md uppercase text-gray-500">No products found</p>
		<a href="/products" class="ed-empty__link text-sm font-bold uppercase tracking-widest text-primary underline underline-offset-4">Clear all filters</a>
	</div>
{:else}
	<div class="ed-grid intra-gap grid auto-rows-auto grid-cols-2 lg:grid-cols-3">
		{#each products as product, i (product.id)}
			<ProductCard {product} priority={i < 6} />
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
				<span class="ed-more text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">Loading more</span>
			{/if}
		</div>
	{:else if products.length > 0}
		<p class="ed-end mt-8 text-center text-xs font-semibold uppercase tracking-[0.16em] text-gray-400 lg:hidden">You've reached the end</p>
	{/if}

	<div class="ed-pagination hidden lg:block">
		<Pagination noOfPage={data.products.totalPages} />
	</div>
{/if}

<style>
	/* ---- Refined Editorial · listing grid (default theme only) ---- */

	/* Generous, symmetric gutters echoing the homepage product grid */
	:global([data-theme='default']) .ed-grid {
		column-gap: clamp(16px, 2vw, 28px);
		row-gap: clamp(30px, 3.4vw, 52px);
	}

	/* Empty state */
	:global([data-theme='default']) .ed-empty {
		min-height: 58vh;
		gap: 14px;
	}

	:global([data-theme='default']) .ed-empty__title {
		font-family: var(--ed-display);
		font-weight: 500;
		font-size: clamp(1.5rem, 3vw, 2.1rem);
		letter-spacing: -0.01em;
		text-transform: none;
		color: var(--ed-ink);
	}

	:global([data-theme='default']) .ed-empty__link {
		color: hsl(var(--primary));
		text-underline-offset: 4px;
	}

	:global([data-theme='default']) .ed-more,
	:global([data-theme='default']) .ed-end {
		color: var(--ed-soft);
	}

	/* Editorial pagination — hairline chips, primary fill for the active page */
	:global([data-theme='default'] .ed-pagination) {
		font-family: var(--ed-body);
		margin-top: clamp(28px, 4vw, 44px);
	}

	:global([data-theme='default'] .ed-pagination a),
	:global([data-theme='default'] .ed-pagination button) {
		border: 1px solid var(--ed-line);
		border-radius: var(--ed-radius);
		background: var(--ed-surface);
		color: var(--ed-ink);
		font-family: var(--ed-body);
		font-size: 0.85rem;
		font-weight: 500;
		box-shadow: none;
		transition:
			border-color 0.2s ease,
			background 0.2s ease,
			color 0.2s ease;
	}

	:global([data-theme='default'] .ed-pagination a:hover),
	:global([data-theme='default'] .ed-pagination button:not(:disabled):hover) {
		border-color: hsl(var(--primary));
		background: var(--ed-surface);
		color: hsl(var(--primary));
	}

	:global([data-theme='default'] .ed-pagination a[aria-current='page']) {
		background: hsl(var(--primary));
		border-color: hsl(var(--primary));
		color: hsl(var(--primary-foreground));
	}

	:global([data-theme='default'] .ed-pagination button:disabled) {
		opacity: 0.45;
	}

	@media (prefers-reduced-motion: reduce) {
		:global([data-theme='default'] .ed-pagination a),
		:global([data-theme='default'] .ed-pagination button) {
			transition: none;
		}
	}
</style>
