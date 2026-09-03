<script lang="ts">
	import { PinInput as InputOTPPrimitive } from 'bits-ui'
	import type { ComponentProps } from 'svelte'
	import { cn } from '$lib/core/utils'

	let { ref = $bindable(null), cell, class: className, ...restProps }: ComponentProps<typeof InputOTPPrimitive.Cell> = $props()
</script>

<InputOTPPrimitive.Cell
	{cell}
	bind:ref
	class={cn(
		'relative flex h-9 w-9 items-center justify-center border-y border-r border-input text-sm shadow-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md',
		// The cell is a <div>; the field's one real input is visually hidden, so `:focus-visible`
		// never reaches this element and the global ring cannot draw it. The active cell is the
		// focus indicator, so it matches that ring's width and token (no offset - an offset band
		// would paint over the adjoining cells, which sit flush against it).
		cell.isActive && 'z-10 ring-2 ring-ring',
		className
	)}
	{...restProps}
>
	{cell.char}
	{#if cell.hasFakeCaret}
		<div class="pointer-events-none absolute inset-0 flex items-center justify-center">
			<div class="h-4 w-px animate-caret-blink bg-foreground duration-1000"></div>
		</div>
	{/if}
</InputOTPPrimitive.Cell>
