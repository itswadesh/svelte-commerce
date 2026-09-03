<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js'
	import { ChevronRight } from '@lucide/svelte'
	import Spinner from '$lib/components/common/spinner.svelte'

	let { onclick, disabled = false, loading = false, text = 'Proceed to Shipping', disabledText = '', total = '', class: className = '' } = $props()
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
	<!-- Busy is disabled, so that a second tap cannot place a second order — but it must not *look*
	     unavailable. Without this the disabled palette repaints the button grey-on-grey the instant
	     it is pressed, and the spinner, drawn in currentColor, lands at gray-400 on gray-100. -->
	<Button
		class="ease-out-expo group w-full bg-primary py-7 text-sm font-bold uppercase tracking-[0.2em] shadow-lg transition-all duration-300 hover:shadow-xl disabled:border disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:opacity-100 disabled:shadow-none max-sm:h-20 max-sm:rounded-none {loading
			? 'disabled:border-0 disabled:bg-primary disabled:text-primary-foreground disabled:shadow-lg'
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
