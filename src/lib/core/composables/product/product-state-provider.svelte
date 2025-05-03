<script>
	import { createProductStateContext } from './use-product.svelte'

	const { data = {}, children } = $props()

	const filterState = createProductStateContext(data)

	$effect(() => {
		filterState.setState(data)
	})
</script>

{@render children?.()}
