<script lang="ts">
	import { Collapsible as CollapsiblePrimitive } from 'bits-ui'
	import { slide } from 'svelte/transition'

	type $$Props = CollapsiblePrimitive.ContentProps

	interface Props {
		transition?: $$Props['transition']
		transitionConfig?: $$Props['transitionConfig']
		children?: import('svelte').Snippet
		[key: string]: any
	}

	let {
		transition = slide,
		transitionConfig = {
			duration: 150
		},
		children,
		...rest
	}: Props = $props()

	const children_render = $derived(children)
</script>

<CollapsiblePrimitive.Content {transitionConfig} {...rest}>
	{#snippet children({ transition })}
		{@render children_render?.()}
	{/snippet}
</CollapsiblePrimitive.Content>
