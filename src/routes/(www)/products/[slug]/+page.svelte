<script lang="ts">
	import ProductDetails from './components/product-details.svelte'
	import { ProductStateProvider } from '$lib/core/composables/product'

	let { data } = $props()
</script>

<ProductStateProvider {data}>
	<ProductDetails />
</ProductStateProvider>

