<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js'
	import { ChevronRight } from '@lucide/svelte'
	import Spinner from '$lib/components/common/spinner.svelte'

	let {
		onclick,
		disabled = false,
		loading = false,
		text = 'Proceed to Shipping',
		disabledText = '',
		total = '',
		// The pinned bar repeats the summary's bottom line, so it has to repeat the summary's
		// honesty about it: while shipping is unresolved the figure is an estimate, not a total.
		totalLabel = 'Total',
		class: className = ''
	} = $props()
</script>

<!-- Below sm this is the checkout step's only visible CTA: the summary card it lives in sits under
     the whole item/payment list in the single-column layout, so it is pinned to the viewport.
     `pb-[env(safe-area-inset-bottom)]` keeps the tap area clear of the iOS home indicator — without
     it the bottom ~34px of the button is unreachable. Each step page reserves matching bottom
     padding so trailing content is not left underneath. -->
<div
	class="w-full max-sm:fixed max-sm:bottom-0 max-sm:left-0 max-sm:right-0 max-sm:z-sticky max-sm:border-t max-sm:border-border max-sm:bg-background max-sm:pb-[env(safe-area-inset-bottom)] max-sm:shadow-z-2 {className}"
>
	{#if total}
		<!-- The order total is in the summary card the shopper has just scrolled past on mobile;
		     repeating it here means the amount is on screen at the moment of commitment. -->
		<div class="flex items-center justify-between px-4 py-2.5 sm:hidden">
			<span class="text-xs font-medium text-muted-foreground">{totalLabel}</span>
			<span class="text-base font-bold text-foreground">{total}</span>
		</div>
	{/if}
	<!-- Busy is disabled, so that a second tap cannot place a second order — but it must not *look*
	     unavailable. Without the `loading` override the disabled palette repaints the button in the
	     muted tokens the instant it is pressed, and the spinner, drawn in currentColor, lands as
	     muted-on-muted. -->
	<Button
		data-testid="checkout-button"
		class="group w-full bg-primary py-6 text-sm font-semibold tracking-wide shadow-z-1 transition-colors duration-150 hover:bg-primary-hover disabled:border disabled:border-border disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100 disabled:shadow-none max-sm:h-14 max-sm:rounded-none {loading
			? 'disabled:border-0 disabled:bg-primary disabled:text-primary-foreground disabled:shadow-z-1'
			: ''}"
		disabled={disabled || loading}
		aria-busy={loading}
		{onclick}
	>
		<div class="flex items-center justify-center gap-2">
			{#if loading}
				<!-- The label stays put while the request is in flight. Swapping it out left the flow's
				     highest-stakes control reading as an empty box (UX-077). -->
				<Spinner label="Submitting" />
				<span>{text}</span>
			{:else}
				<span>{disabled && disabledText ? disabledText : text}</span>
				{#if !disabled}
					<ChevronRight class="size-4 transition-transform duration-300 group-hover:translate-x-1" />
				{/if}
			{/if}
		</div>
	</Button>
</div>
