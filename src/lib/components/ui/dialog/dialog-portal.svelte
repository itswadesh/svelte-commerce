<script lang="ts">
	import { Dialog as DialogPrimitive } from 'bits-ui'

	let { children, ...rest }: DialogPrimitive.PortalProps = $props()

	const children_render = $derived(children)
</script>

<DialogPrimitive.Portal>
	{#snippet children()}
		{@render children_render?.()}
	{/snippet}
</DialogPrimitive.Portal>
