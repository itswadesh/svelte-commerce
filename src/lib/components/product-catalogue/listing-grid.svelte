<script lang="ts">
	import { navigating, page } from '$app/state'
	import Pagination from '$lib/components/common/pagination.svelte'
	import ProductCard from '$lib/components/product-catalogue/product-card.svelte'
	import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte'
	import { SearchService } from '$lib/core/services/index.js'
	import { readAppliedFilters, urlWithoutAnyFilter } from './scope-filters.js'

	const data = $derived(page.data)
	const searchService = new SearchService(fetch)
	const listingQueryKey = $derived.by(() => {
		const params = new URLSearchParams(page.url.search)
		params.delete('page')
		return `${page.url.pathname}?${params.toString()}`
	})

	// Seeded from the SSR payload, NOT from the $effect below: effects never run on the server, so
	// starting this at [] meant the server rendered an empty grid — no product cards and no product
	// links — on /products and every /[slug] category, for every crawler that does not execute JS.
	let products = $state<any[]>(data.products?.data ?? [])
	let currentPage = $state(Number(page.url.searchParams.get('page') ?? 1))
	let loadingMore = $state(false)
	let loadFailed = $state(false)
	let previousListingQueryKey = ''

	const hasMore = $derived(currentPage < (data.products?.totalPages ?? 0))

	// A refinement is a navigation to this same route with a different query. Ticking a facet or
	// changing the sort used to leave the previous cards and the previous count on screen with
	// nothing acknowledging the tap, until the layout's 700ms overlay blurred the entire page and
	// still did not say which region was updating. Marking just the grid busy is both the honest
	// answer and the quiet one.
	const refining = $derived(!!navigating.to && navigating.to.url.pathname === page.url.pathname)

	const searchTerm = $derived(page.url.searchParams.get('search') ?? '')
	const hasRemovableFilters = $derived(readAppliedFilters(page.url, Object.keys(data?.products?.facets || {})).some((f) => f.key !== 'search'))

	// Mobile is the viewport Googlebot renders, and the desktop pagination is display:none there.
	// Giving the infinite-scroll trigger a real href keeps page 2+ reachable without JS.
	const nextPageHref = $derived.by(() => {
		const url = new URL(page.url)
		url.searchParams.set('page', String(currentPage + 1))
		return url.pathname + url.search
	})

	// Infinitely-scrolled pages live in component state, so opening a PDP and pressing back used to
	// remount this with only the first 20 items while SvelteKit restored the old scroll position.
	// Park the accumulated list against the listing key so a remount can pick it back up.
	const SCROLL_CACHE_KEY = 'listing-infinite-scroll'

	function readScrollCache(key: string) {
		try {
			const cached = JSON.parse(sessionStorage.getItem(SCROLL_CACHE_KEY) || 'null')
			return cached?.key === key && Array.isArray(cached.products) ? cached : null
		} catch {
			return null
		}
	}

	function writeScrollCache(key: string) {
		try {
			sessionStorage.setItem(SCROLL_CACHE_KEY, JSON.stringify({ key, currentPage, products }))
		} catch {
			// Quota exceeded or storage blocked — accumulation just won't survive a back-navigation.
		}
	}

	$effect(() => {
		if (listingQueryKey === previousListingQueryKey) return

		const isMount = previousListingQueryKey === ''
		previousListingQueryKey = listingQueryKey
		loadFailed = false

		const urlPage = Number(page.url.searchParams.get('page') ?? 1)
		const cached = isMount ? readScrollCache(listingQueryKey) : null

		if (cached && cached.currentPage > urlPage) {
			products = cached.products
			currentPage = cached.currentPage
		} else {
			products = data.products?.data ?? []
			currentPage = urlPage
		}
	})

	async function loadNextPage() {
		if (loadingMore || !hasMore) return

		loadingMore = true
		loadFailed = false
		try {
			const nextUrl = new URL(page.url)
			nextUrl.searchParams.set('page', String(currentPage + 1))
			const result = await searchService.searchWithUrl(nextUrl, page.params.slug)
			products = [...products, ...result.data]
			currentPage += 1
			writeScrollCache(listingQueryKey)
		} catch (e) {
			// The observer only fires on an intersection *transition*, so a swallowed failure left
			// the sentinel already intersecting and the list silently stopped loading forever.
			console.error('Failed to load more products:', e)
			loadFailed = true
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
	<!-- Say what was looked for and offer the one action that helps. The old copy was a bare
	     "No products found" over a link to /products, which also threw away the search term. -->
	<div class="ed-empty flex flex-col items-center justify-center gap-2 px-6 py-20 text-center">
		<p class="ed-empty__title text-lg font-medium text-foreground">
			{#if searchTerm}
				No products match “{searchTerm}”
			{:else}
				No products match these filters
			{/if}
		</p>
		<p class="max-w-sm text-sm text-muted-foreground">
			{#if hasRemovableFilters}
				Try removing a filter, or search for something more general.
			{:else}
				Try a shorter or more general search term.
			{/if}
		</p>
		{#if hasRemovableFilters}
			<a
				href={urlWithoutAnyFilter(page.url)}
				data-sveltekit-replacestate
				class="ed-empty__link mt-3 inline-flex h-11 items-center rounded-md border border-input px-4 text-sm font-semibold transition-colors hover:bg-muted"
			>
				Clear all filters
			</a>
		{:else if searchTerm}
			<a
				href="/products"
				class="ed-empty__link mt-3 inline-flex h-11 items-center rounded-md border border-input px-4 text-sm font-semibold transition-colors hover:bg-muted"
			>
				Browse all products
			</a>
		{/if}
	</div>
{:else}
	<div
		class="ed-grid intra-gap grid auto-rows-auto grid-cols-2 transition-opacity md:grid-cols-3 xl:grid-cols-4 {refining ? 'opacity-60' : ''}"
		aria-busy={refining}
	>
		{#each products as product, i (product.id)}
			<ProductCard {product} priority={i < 6} />
		{/each}
	</div>

	{#if hasMore || loadingMore}
		<div use:infiniteScroll class="mt-6 flex min-h-16 items-center justify-center lg:hidden" aria-live="polite">
			{#if loadingMore}
				<!-- Card-shaped, at the same aspect ratio as the real cards, so the page grows by the
				     height the products will occupy instead of jumping when they arrive. This used to
				     be two 8px grey dashes, which read as a rendering fault rather than as loading. -->
				<div class="intra-gap grid w-full grid-cols-2" aria-label="Loading more products">
					{#each Array(2) as _}
						<div class="flex flex-col gap-2">
							<Skeleton class="aspect-square w-full rounded-md" />
							<Skeleton class="h-3 w-3/4" />
							<Skeleton class="h-3 w-1/3" />
						</div>
					{/each}
				</div>
			{:else}
				<a
					href={nextPageHref}
					rel="next"
					onclick={(e) => {
						e.preventDefault()
						loadNextPage()
					}}
					class="text-xs font-semibold uppercase tracking-[0.16em] {loadFailed
						? 'ed-empty__link text-primary underline underline-offset-4'
						: 'ed-more text-gray-400'}"
				>
					{loadFailed ? 'Retry' : 'Load more'}
				</a>
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
