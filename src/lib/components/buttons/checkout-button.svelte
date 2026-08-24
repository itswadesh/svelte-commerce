<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js'
	import { ChevronRight } from '@lucide/svelte'
	import LoadingDots from '$lib/core/components/common/loading-dots.svelte'

	let {
		onclick,
		disabled = false,
		loading = false,
		text = 'Proceed to Shipping',
		disabledText = '',
		total = '',
		class: className = ''
	} = $props()
</script>

<!-- Below sm this is the checkout step's only visible CTA: the summary card it lives in sits under
     the whole item/payment list in the single-column layout, so it is pinned to the viewport.
     `pb-[env(safe-area-inset-bottom)]` keeps the tap area clear of the iOS home indicator — without
     it the bottom ~34px of the button is unreachable. Each step page reserves matching bottom
     padding so trailing content is not left underneath. -->
<div
	class="w-full max-sm:fixed max-sm:bottom-0 max-sm:left-0 max-sm:right-0 max-sm:z-[60] max-sm:border-t max-sm:border-border max-sm:bg-background max-sm:pb-[env(safe-area-inset-bottom)] {className}"
>
	{#if total}
		<!-- The order total is in the summary card the shopper has just scrolled past on mobile;
		     repeating it here means the amount is on screen at the moment of commitment. -->
		<div class="flex items-center justify-between px-4 py-2.5 sm:hidden">
			<span class="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total</span>
			<span class="text-base font-bold text-foreground">{total}</span>
		</div>
	{/if}
	<Button
		class="ease-out-expo group w-full bg-primary py-7 text-sm font-bold tracking-[0.2em] uppercase shadow-lg transition-all duration-300 hover:shadow-xl max-sm:h-20 max-sm:rounded-none disabled:bg-gray-100 disabled:text-gray-400 disabled:shadow-none disabled:border-gray-200 disabled:border disabled:opacity-100"
		disabled={disabled || loading}
		{onclick}
	>
		{#if loading}
			<LoadingDots />
		{:else}
			<div class="flex items-center justify-center gap-2">
				<span>{disabled && disabledText ? disabledText : text}</span>
				{#if !disabled}
					<ChevronRight class="size-4 transition-transform duration-300 group-hover:translate-x-1" />
				{/if}
			</div>
		{/if}
	</Button>
</div>
