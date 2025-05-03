<script lang="ts">
	import { orderService } from '$lib/core/services'
	import type { Snippet } from 'svelte'
	let orders: any = $state({})
	let currentPage = 1 // Start on page 1
	let perPage = 10 // Number of orders per page
	let paginatedOrders: any[] = [] // Store the orders for the current page
  
	const { content }: { content: Snippet<[SnippetParams]> } = $props()

  interface SnippetParams {
    paginateOrders: () => void
    orders: any
  }

	// Function to paginate orders
	async function paginateOrders() {
		orders = await orderService.list({ page: 1, q: '', sort: 'createdAt' })
		if (orders?.data) {
			const start = (currentPage - 1) * perPage
			paginatedOrders = orders.data.slice(start, start + perPage)
		}
	}

	// Function to go to the previous page
	function goToPreviousPage() {
		currentPage = Math.max(currentPage - 1, 1)
		paginateOrders()
	}

	// Function to go to the next page
	function goToNextPage() {
		currentPage = Math.min(currentPage + 1, Math.ceil(orders.count / perPage))
		paginateOrders()
	}

	// Function to go to a specific page
	function goToPage(page: any) {
		currentPage = page
		paginateOrders()
	}

	// Reactive statement to update pagination when currentPage changes
	$effect(() => {
		paginateOrders()
	})
</script>

{@render
  content({
    paginateOrders,
    orders
  })
}
