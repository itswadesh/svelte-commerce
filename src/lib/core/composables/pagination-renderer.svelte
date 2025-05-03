<script lang="ts">
	import { goto } from '$app/navigation'
	import { page } from '$app/state'
	import { onMount, type Snippet } from 'svelte'

	interface Props {
		content: Snippet<[SnippetParams]>
		noOfPage: number
		paginateProducts?: () => void
	}

	const { content, noOfPage = $bindable(), paginateProducts }: Props = $props()

	interface SnippetParams {
		pageSize: number
		currentPage: number
		goToPreviousPage: () => Promise<void>
		goToNextPage: () => Promise<void>
		goToPage: (newPage: number) => Promise<void>
		count: number
	}

	const pageSize = 20

	let currentPage = $state(1)

	const updateCurrentPage = () => {
		const pageFromUrl = +(page.url.searchParams.get('page') || '1')
		if (pageFromUrl !== currentPage) {
			currentPage = pageFromUrl
		}
	}

	onMount(() => {
		updateCurrentPage()
	})

	$effect(() => {
		updateCurrentPage()
	})

	const goToPreviousPage = async () => {
		const newPage = Math.max(currentPage - 1, 1)
		const url = new URL(page.url)
		url.searchParams.set('page', newPage.toString())
		await goto(url, { replaceState: true, invalidateAll: true })
		if (paginateProducts) paginateProducts()
	}

	const goToNextPage = async () => {
		const newPage = Math.min(currentPage + 1, Math.ceil(noOfPage))
		const url = new URL(page.url)
		url.searchParams.set('page', newPage.toString())
		await goto(url, { replaceState: true, invalidateAll: true })
		if (paginateProducts) paginateProducts()
	}

	const goToPage = async (newPage: number) => {
		const url = new URL(page.url)
		url.searchParams.set('page', newPage.toString())
		await goto(url, { replaceState: true, invalidateAll: true })
		if (paginateProducts) paginateProducts()
	}

	const count = $derived(noOfPage * pageSize)

	// Update currentPage when URL changes
	$effect(() => {
		const pageFromUrl = +(page.url.searchParams.get('page') || '1')
		if (pageFromUrl !== currentPage) {
			currentPage = pageFromUrl
		}
	})
</script>

{@render content?.({ currentPage, goToNextPage, goToPage, goToPreviousPage, pageSize, count })}
