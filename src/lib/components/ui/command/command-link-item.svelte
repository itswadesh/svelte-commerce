<script lang="ts">
	import { Command as CommandPrimitive } from 'bits-ui'
	import { cn } from '$lib/core/utils'

	let { ref = $bindable(null), class: className, ...restProps }: CommandPrimitive.LinkItemProps = $props()
</script>

<CommandPrimitive.LinkItem
	class={cn(
		'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
		className
	)}
	bind:ref
	{...restProps}
/>
