<script lang="ts">
	// Local copy of the vendored MsSearchRenderer with two fixes that cannot be made from the
	// call site:
	//   1. Enter navigates to the clean slug route (/pendant), not /products?search=pendant —
	//      the latter is both against the project's link convention and robots-disallowed.
	//   2. `loading` is set for every query, not only the initial recommendations, so the panel
	//      no longer shows the previous query's results or a false "No products found" while a
	//      request is in flight.
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

	$effect(() => {
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

	const toSlug = (term: string) =>
		term
			.trim()
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-+|-+$/g, '')

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			const slug = toSlug(search)
			if (!slug) return
			searchResults = []
			showSearchResults = false
			goto(`/${slug}`)
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
	handleResultClick
})}
