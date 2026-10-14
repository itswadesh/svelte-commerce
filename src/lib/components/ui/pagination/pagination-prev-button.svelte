<script lang="ts">
	import { Pagination as PaginationPrimitive } from 'bits-ui'
	import { ChevronLeft } from '@lucide/svelte'
	import type { HTMLAnchorAttributes } from 'svelte/elements'
	import { cn } from '$lib/core/utils'
	import { buttonVariants } from '$lib/components/ui/button/index.js'

	let { ref = $bindable(null), class: className, href, children, ...restProps }: PaginationPrimitive.PrevButtonProps & { href?: string } = $props()

	const classes = $derived(cn(buttonVariants({ variant: 'ghost', className: 'gap-1 pl-2.5' }), className))
</script>

{#snippet Fallback()}
	<ChevronLeft class="size-4" />
	<span>Previous</span>
{/snippet}

<!-- With an href it renders as a real link, so crawlers and visitors without JavaScript can follow it. -->
{#if href}
	<a bind:this={ref} {href} rel="prev" class={classes} {...restProps as HTMLAnchorAttributes}>
		{@render (children || Fallback)()}
	</a>
{:else}
	<PaginationPrimitive.PrevButton bind:ref {...restProps} class={classes} children={children || Fallback} />
{/if}
