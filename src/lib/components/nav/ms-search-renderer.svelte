<script lang="ts">
	// Local copy of the vendored MsSearchRenderer with three fixes that cannot be made from the
	// call site:
	//   1. Enter submits to the route that actually renders a term, /products?search=<term>.
	//      It used to slugify the term and navigate to /<slug>, on the reasoning that a clean
	//      URL suited the project's link convention. But /<slug> resolves a category or a
	//      product and throws 404 for anything else, so "mug", "t shirts" and every plural or
	//      multi-word query dead-ended on the not-found page while the listing route answered
	//      the same term correctly. robots.txt already disallows `?search=`, so the destination
	//      stays out of the index and is simply the page a shopper lands on.
	//   2. `loading` is set for every query, not only the initial recommendations, so the panel
	//      no longer shows the previous query's results or a false "No products found" while a
	//      request is in flight.
	//   3. The autocomplete effect only runs while the panel is open. It used to fire on mount
	//      on every route, so each page load spent a request on an empty-query autocomplete
	//      whose results nothing displayed.
	import { type Snippet } from 'svelte'
	import { meilisearchService } from '$lib/core/services/index.js'
	import { page } from '$app/state'
	import { goto } from '$app/navigation'

	let searchPlugin = $derived(page?.data?.store?.plugins?.search)
	let expandSearch = $state(false)
	let searchResults: any[] = $state([])
	let showSearchResults = $state(false)
	let loading = $state(false)

	interface Props {
		search: string
		content: Snippet<[SnippetParams]>
	}

	let { content, search = $bindable() }: Props = $props()

	interface SnippetParams {
		searchPlugin: any
		expandSearch: boolean
		searchResults: any[]
		showSearchResults: boolean
		loading: boolean
		toggleSearchResults: (value: boolean) => void
		closeSearch: () => void
		handleKeyDown: (e: KeyboardEvent) => void
		handleResultClick: (res: any) => void
		showSearch: () => void
		submitSearch: () => void
		searchUrl: (term: string) => string
	}

	// Only the newest request may write results; late responses from an abandoned query are dropped.
	let requestId = 0

	const autoComplete = async (query: string) => {
		const id = ++requestId
		loading = true
		try {
			const res = await meilisearchService.searchAutoComplete({ query })
			if (id !== requestId) return
			searchResults = res?.data || []
		} catch (error) {
			if (id !== requestId) return
			console.error('Search error:', error)
			searchResults = []
		} finally {
			if (id === requestId) loading = false
		}
	}

	let searchTimeout: ReturnType<typeof setTimeout> | null = null

	const debouncedSearch = (query: string) => {
		if (searchTimeout) clearTimeout(searchTimeout)
		// Cover the debounce window too, otherwise the stale result set stays on screen.
		loading = true
		searchTimeout = setTimeout(() => {
			autoComplete(query)
			searchTimeout = null
		}, 300)
	}

	// Only while the panel is open. This used to run on mount on every route, so every page load
	// paid for an empty-query autocomplete whose results were never shown. Opening the panel is
	// handled by the recommendations effect below; this one covers typing.
	$effect(() => {
		if (!expandSearch) return
		if (!search.trim()) return
		debouncedSearch(search)
	})

	const showInitialRecommendations = async () => {
		await autoComplete('')
	}

	const closeSearch = () => {
		if (searchTimeout) {
			clearTimeout(searchTimeout)
			searchTimeout = null
		}
		requestId++
		expandSearch = false
		search = ''
		showSearchResults = false
		searchResults = []
		loading = false
	}

	$effect(() => {
		if (expandSearch) {
			showInitialRecommendations()
		}
	})

	/** The one route that renders results for a free-text term. Shared with the "see all" row. */
	const searchUrl = (term: string) => `/products?search=${encodeURIComponent(term.trim())}`

	function submitSearch() {
		const term = search.trim()
		if (!term) return
		searchResults = []
		showSearchResults = false
		expandSearch = false
		goto(searchUrl(term))
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			submitSearch()
		} else if (e.key === 'Escape') closeSearch()
		else {
			showSearchResults = true
		}
	}

	function handleResultClick(result: any) {
		goto(`/products/${result?.slug}`)
		closeSearch()
	}

	function toggleSearchResults(value: boolean) {
		showSearchResults = value
	}

	function showSearch() {
		;(document.activeElement as any)?.blur?.()
		expandSearch = true
		showSearchResults = true
	}
</script>

{@render content({
	searchResults,
	loading,
	searchPlugin,
	expandSearch,
	showSearchResults,
	showSearch,
	closeSearch,
	toggleSearchResults,
	handleKeyDown,
	handleResultClick,
	submitSearch,
	searchUrl
})}
