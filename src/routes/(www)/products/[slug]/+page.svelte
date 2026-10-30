<script lang="ts">
	import ProductDetails from './components/product-details.svelte'
	import { ProductStateProvider } from '$lib/core/composables/index.js'
	import Editor from '$lib/customizer/editor.svelte'

	let { data } = $props()
</script>

<ProductStateProvider>
	<ProductDetails />
	{#if data.customizer}
		{#key data.customizer.productId}
			<Editor setup={data.customizer} />
		{/key}
	{/if}
</ProductStateProvider>
