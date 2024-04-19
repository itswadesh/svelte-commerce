<script lang="ts">
	import { type Snippet } from 'svelte'
	import { meilisearchService } from '$lib/core/services'
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

	const autoComplete = async (query: string) => {
		try {
			const res = await meilisearchService.searchAutoComplete({ query })
			searchResults = res?.hits
		} catch (error) {
			console.error('Search error:', error)
			searchResults = []
		}
	}

	let searchTimeout: ReturnType<typeof setTimeout> | null = null

	const debouncedSearch = async (query: string) => {
		if (searchTimeout) {
			clearTimeout(searchTimeout)
		}

		if (!query) {
			searchResults = []
			return
		}

		searchTimeout = setTimeout(() => {
			autoComplete(query)
			searchTimeout = null
		}, 300)
	}

	$effect(() => {
		debouncedSearch(search)
	})

	const showInitialRecommendations = async () => {
		loading = true

		await autoComplete('')

		setTimeout(() => {
			loading = false
		}, 100)
	}

	const closeSearch = () => {
		expandSearch = false
		search = ''
    showSearchResults = false
		searchResults = []
	}

	$effect(() => {
		if (expandSearch) {
			showInitialRecommendations()
		}
	})

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			searchResults = []
			showSearchResults = false
			goto(`/products?search=${encodeURIComponent(search)}`)
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

{@render content({ searchResults, loading, searchPlugin, expandSearch, showSearchResults, showSearch, closeSearch, toggleSearchResults, handleKeyDown, handleResultClick })}
