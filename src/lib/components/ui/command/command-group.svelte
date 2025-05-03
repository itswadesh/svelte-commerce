<script lang="ts">
	import { Command as CommandPrimitive } from 'bits-ui'
	import { cn } from '$lib/core/utils'

	let {
		ref = $bindable(null),
		class: className,
		children,
		heading,
		...restProps
	}: CommandPrimitive.GroupProps & {
		heading?: string
	} = $props()
</script>

<CommandPrimitive.Group class={cn('overflow-hidden p-1 text-foreground', className)} bind:ref {...restProps}>
	{#if heading}
		<CommandPrimitive.GroupHeading class="px-2 py-1.5 text-xs font-medium text-muted-foreground">
			{heading}
		</CommandPrimitive.GroupHeading>
	{/if}
	<CommandPrimitive.GroupItems {children} />
</CommandPrimitive.Group>
