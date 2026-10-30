<script lang="ts">
	import ProductDetails from './components/product-details.svelte'
	import { ProductStateProvider } from '$lib/core/composables/index.js'
	import Editor from '$lib/customizer/editor.svelte'
	import type { CustomizerSetup } from '$lib/customizer/document'

	let { data } = $props()

	// The connector answers a failed setup read with null, as it does a product nobody can design.
	let lastGood: CustomizerSetup | null = null
	const customizer = $derived.by(() => {
		if (data.customizer || lastGood?.productId !== String(data.product?.id)) lastGood = data.customizer
		return lastGood
	})
</script>

<ProductStateProvider>
	<ProductDetails />
	{#if customizer}
		{#key customizer.productId}
			<Editor setup={customizer} />
		{/key}
	{/if}
</ProductStateProvider>
