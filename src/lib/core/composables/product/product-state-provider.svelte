<script>
	import { createProductStateContext } from './use-product.svelte'

	const { children } = $props()

	createProductStateContext()
</script>

{@render children?.()}
