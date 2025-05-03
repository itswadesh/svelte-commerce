<script lang="ts">
	import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui'

	type $$Props = DropdownMenuPrimitive.RadioGroupProps

	interface Props {
		value?: $$Props['value']
		children?: import('svelte').Snippet
		[key: string]: any
	}

	let { value = $bindable(undefined), children, ...rest }: Props = $props()

	const children_render = $derived(children)
</script>

<DropdownMenuPrimitive.RadioGroup bind:value>
	{#snippet children({ undefined: $$restProps })}
		{@render children_render?.()}
	{/snippet}
</DropdownMenuPrimitive.RadioGroup>
