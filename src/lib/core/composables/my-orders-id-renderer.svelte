<script lang="ts">
	import { page } from '$app/state'
	import type { Order } from '$lib/core/types'
	import { onMount, type Snippet } from 'svelte'
	import { orderService } from '$lib/core/services'

	const { content }: { content: Snippet<[SnippetParams]> } = $props()

  interface SnippetParams {
    order: Order | null
    loading: boolean
  }

	const seoProps = {
		title: 'Order Details ',
		metaDescription: 'Order Details '
	}

	// let deliveryBy = null
	let now = $state<Date | null>(null)
	let selectedProduct = $state<any | null>(null)
	let showDemoScheduler = $state(false)
	let loading = $state(true)

	function head() {
		return {
			title: 'Order Details'
		}
	}

	let order = $state<Order | null>(null)
	onMount(async () => {
		const { id } = page.params

		loading = true
		order = await orderService.getOrder(id)
		loading = false
	})
</script>

{@render
  content({
    loading,
    order
  })
}
