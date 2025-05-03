<script lang="ts">
	import { Select as SelectPrimitive } from 'bits-ui'
	import { cn } from '$lib/core/utils'

	type $$Props = SelectPrimitive.LabelProps

	interface Props {
		class?: $$Props['class'];
		children?: import('svelte').Snippet;
		[key: string]: any
	}

	let { class: className = undefined, children, ...rest }: Props = $props();
	

	const children_render = $derived(children);
</script>

<SelectPrimitive.Label  {...rest}>
	{#snippet children({ class })}
		{@render children_render?.()}
	{/snippet}
</SelectPrimitive.Label>
