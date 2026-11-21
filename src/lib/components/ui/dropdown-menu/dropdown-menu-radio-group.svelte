<script lang="ts">
	import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui'

	let { value = $bindable(undefined), children, ...rest }: DropdownMenuPrimitive.RadioGroupProps = $props()

	const children_render = $derived(children)
</script>

<DropdownMenuPrimitive.RadioGroup bind:value>
	{#snippet children()}
		{@render children_render?.()}
	{/snippet}
</DropdownMenuPrimitive.RadioGroup>
