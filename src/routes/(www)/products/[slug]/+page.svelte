<script lang="ts">
	import { setContext } from 'svelte'
	import { services } from 'kitcommerce.config'
	import ProductDetails from './components/product-details.svelte'
	import { ProductStateProvider } from '$lib/core/composables/index.js'
	import { EDITOR, type EditorHandle } from '$lib/customizer/handle'
	// Only a product that can be designed loads the editor (P1-11).
	const loadEditor = () => import('$lib/customizer/editor.svelte')
	import type { CustomizerSetup } from '$lib/customizer/document'
	import { loadSetup } from '$lib/customizer/service'

	let { data } = $props()

	// The connector answers a failed setup read with null, as it does a product nobody can design.
	let lastGood: CustomizerSetup | null = null
	let retried = $state<CustomizerSetup | null>(null)
	const customizer = $derived.by(() => {
		const id = String(data.product?.id)
		const setup = data.customizer ?? (retried?.productId === id ? retried : null)
		if (setup || lastGood?.productId !== id) lastGood = setup
		return lastGood
	})

	setContext<EditorHandle>(EDITOR, {
		get hasSetup() {
			return !!customizer
		},
		reloadSetup: async () => {
			retried = await loadSetup(services as object, data.product?.id)
		}
	})
</script>

<ProductStateProvider>
	<ProductDetails />
	{#if customizer}
		{#await loadEditor() then { default: Editor }}
			{#key customizer.productId}
				<Editor setup={customizer} />
			{/key}
		{/await}
	{/if}
</ProductStateProvider>
