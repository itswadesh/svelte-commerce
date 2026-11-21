<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements'
	import type { WithElementRef } from 'bits-ui'
	import { cn } from '$lib/core/utils'

	let { ref = $bindable(null), class: className, children, ...restProps }: WithElementRef<HTMLAttributes<HTMLTableRowElement>> = $props()
</script>

<tr bind:this={ref} class={cn('border-b transition-colors data-[state=selected]:bg-muted hover:bg-muted/50', className)} {...restProps}>
	{@render children?.()}
</tr>
