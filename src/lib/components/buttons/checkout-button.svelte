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
		class: className = ''
	} = $props()
</script>

<div class="w-full max-sm:fixed max-sm:bottom-0 max-sm:left-0 max-sm:right-0 max-sm:z-[60] {className}">
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
