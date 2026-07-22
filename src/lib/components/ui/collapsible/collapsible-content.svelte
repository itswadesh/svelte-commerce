<script lang="ts">
	import { Collapsible as CollapsiblePrimitive } from 'bits-ui'

	let { children, ...rest }: CollapsiblePrimitive.ContentProps = $props()

	const children_render = $derived(children)
</script>

<CollapsiblePrimitive.Content {...rest}>
	{#snippet children()}
		{@render children_render?.()}
	{/snippet}
</CollapsiblePrimitive.Content>
