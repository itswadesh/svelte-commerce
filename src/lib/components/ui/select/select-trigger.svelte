<script lang="ts">
	import { Select as SelectPrimitive, type WithoutChild } from 'bits-ui'
  import { ChevronsUpDown } from 'lucide-svelte';
	import { cn } from '$lib/core/utils'

	let { ref = $bindable(null), class: className, children, ...restProps }: WithoutChild<SelectPrimitive.TriggerProps> = $props()
</script>

<SelectPrimitive.Trigger
	bind:ref
	class={cn(
		'flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
		className
	)}
	{...restProps}
>
	{@render children?.()}
	<ChevronsUpDown class="size-4 opacity-50" />
</SelectPrimitive.Trigger>
