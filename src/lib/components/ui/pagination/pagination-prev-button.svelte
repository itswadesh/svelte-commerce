<script lang="ts">
	import { Pagination as PaginationPrimitive } from 'bits-ui'
  import { ChevronLeft } from 'lucide-svelte';
	import { cn } from '$lib/core/utils'
	import { buttonVariants } from '$lib/components/ui/button/index.js'

	let { ref = $bindable(null), class: className, children, ...restProps }: PaginationPrimitive.PrevButtonProps = $props()
</script>

{#snippet Fallback()}
	<span>Previous</span>
	<ChevronLeft class="size-4" />
{/snippet}

<PaginationPrimitive.PrevButton
	bind:ref
	{...restProps}
	class={cn(buttonVariants({ variant: 'ghost', className: 'gap-1 pl-2.5' }), className)}
	children={children || Fallback}
/>
