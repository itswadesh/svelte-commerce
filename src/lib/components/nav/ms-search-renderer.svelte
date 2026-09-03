<script lang="ts">
	// Local copy of the vendored MsSearchRenderer with the fixes that cannot be made from the
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
	//   4. Recent searches and matching categories, so the panel carries more than one of the
	//      four content types the UX system asks of autocomplete. Neither costs a request:
	//      recents live in localStorage, categories come from the megamenu payload the header
	//      has already loaded.
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

	interface CategorySuggestion {
		name: string
		href: string
	}

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
		recentSearches: string[]
		clearRecentSearches: () => void
		runSearch: (term: string) => void
		categoryMatches: CategorySuggestion[]
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

	/* ---------------- Recent searches ---------------- */

	// Storage can throw outright — Safari private mode, a blocked third-party context, a full
	// quota — so every read and write is guarded and the panel simply shows no recents.
	const RECENT_KEY = 'svelte-commerce:recent-searches'
	const RECENT_LIMIT = 6

	let recentSearches = $state<string[]>([])

	function readRecentSearches(): string[] {
		try {
			const parsed = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]')
			if (!Array.isArray(parsed)) return []
			return parsed.filter((term: unknown): term is string => typeof term === 'string' && !!term.trim()).slice(0, RECENT_LIMIT)
		} catch {
			return []
		}
	}

	function rememberSearch(term: string) {
		const trimmed = term.trim()
		if (!trimmed) return
		const next = [trimmed, ...recentSearches.filter((item) => item.toLowerCase() !== trimmed.toLowerCase())].slice(0, RECENT_LIMIT)
		recentSearches = next
		try {
			localStorage.setItem(RECENT_KEY, JSON.stringify(next))
		} catch {
			// Nothing to recover: the list stays correct for this session and is simply not persisted.
		}
	}

	function clearRecentSearches() {
		recentSearches = []
		try {
			localStorage.removeItem(RECENT_KEY)
		} catch {
			// Already cleared in memory; the stale entry will be overwritten by the next search.
		}
	}

	/* ---------------- Category suggestions ---------------- */

	// The megamenu payload the header already resolves, flattened once per open. No extra request,
	// and a store without a category tree simply contributes no group.
	let categories = $state<CategorySuggestion[]>([])

	function flattenCategories(nodes: any, depth = 0, out: CategorySuggestion[] = []): CategorySuggestion[] {
		if (!Array.isArray(nodes) || depth > 3) return out
		for (const node of nodes) {
			const name = node?.name
			const href = node?.link || (node?.slug ? `/${node.slug}` : '')
			if (name && href && !out.some((item) => item.href === href)) out.push({ name, href })
			flattenCategories(node?.items ?? node?.children, depth + 1, out)
		}
		return out
	}

	// A plain flag, deliberately not `$state`. Guarding on `categories.length` inside the open
	// effect made the effect depend on `categories` while also writing it, and a store whose
	// megamenu resolves to nothing assigned a fresh empty array on every pass — an async loop that
	// never trips Svelte's depth guard and simply pins the main thread.
	let categoriesLoaded = false

	async function loadCategories() {
		if (categoriesLoaded) return
		categoriesLoaded = true
		try {
			const tree = await Promise.resolve(page?.data?.store?.megamenu)
			categories = flattenCategories(tree).slice(0, 100)
		} catch {
			categories = []
		}
	}

	const categoryMatches = $derived.by(() => {
		const term = search.trim().toLowerCase()
		if (!term) return []
		return categories.filter((category) => category.name.toLowerCase().includes(term)).slice(0, 4)
	})

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
			recentSearches = readRecentSearches()
			loadCategories()
		}
	})

	/** The one route that renders results for a free-text term. Shared with the "see all" row. */
	const searchUrl = (term: string) => `/products?search=${encodeURIComponent(term.trim())}`

	/** Run a term the shopper did not type this time — a recent search, or the see-all row. */
	function runSearch(term: string) {
		const trimmed = term.trim()
		if (!trimmed) return
		rememberSearch(trimmed)
		searchResults = []
		showSearchResults = false
		expandSearch = false
		search = ''
		goto(searchUrl(trimmed))
	}

	function submitSearch() {
		runSearch(search)
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
		// No `blur()` here any more: the dialog primitive restores focus to whatever held it when
		// the panel opened, and blurring first left it with nothing to return to, so closing the
		// panel dropped a keyboard shopper back at the top of the document.
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
	searchUrl,
	recentSearches,
	clearRecentSearches,
	runSearch,
	categoryMatches
})}
