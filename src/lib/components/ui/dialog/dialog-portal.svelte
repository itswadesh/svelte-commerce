<script lang="ts">
	import { Dialog as DialogPrimitive } from 'bits-ui'
	interface Props {
		children?: import('svelte').Snippet
		[key: string]: any
	}

	let { children, ...rest }: Props = $props()
	type $$Props = DialogPrimitive.PortalProps

	const children_render = $derived(children)
</script>

<DialogPrimitive.Portal>
	{#snippet children({ undefined: $$restProps })}
		{@render children_render?.()}
	{/snippet}
</DialogPrimitive.Portal>
