<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements'
	import type { WithElementRef } from 'bits-ui'
	import { cn } from '$lib/core/utils'

	let { ref = $bindable(null), value = $bindable(), class: className, ...restProps }: WithElementRef<HTMLInputAttributes> = $props()
</script>

<input
	bind:this={ref}
	class={cn(
		'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-base file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm md:file:text-sm',
		className
	)}
	bind:value
	{...restProps}
/>
