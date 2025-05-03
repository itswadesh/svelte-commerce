<script lang="ts">
  import { Ellipsis } from 'lucide-svelte';
	import type { WithElementRef, WithoutChildren } from 'bits-ui'
	import type { HTMLAttributes } from 'svelte/elements'
	import { cn } from '$lib/core/utils'

	let { ref = $bindable(null), class: className, ...restProps }: WithoutChildren<WithElementRef<HTMLAttributes<HTMLSpanElement>>> = $props()
</script>

<span bind:this={ref} role="presentation" aria-hidden="true" class={cn('flex size-9 items-center justify-center', className)} {...restProps}>
	<Ellipsis class="size-4 outline-none" tabindex={-1} />
	<span class="sr-only">More</span>
</span>
