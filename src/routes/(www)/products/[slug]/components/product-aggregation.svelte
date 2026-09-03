<script lang="ts">
	import { page } from '$app/state'
	import { useProductState } from '$lib/core/composables/index.js'
	import { Button } from '$lib/components/ui/button/index.js'
	import { sortByNumericValue } from '$lib/core/utils/index.js'

	const productState = useProductState()
</script>

{#if page.data?.product?.ag && Object.keys(page.data?.product?.ag).length}
	<div class="intra-gap edp-aggregation flex flex-col">
		{#each Object.entries(page.data?.product?.ag || {}) as [optionName, values]}
			{#if Array.isArray(values)}
				<div class="flex flex-col gap-2">
					<div class="flex min-h-6 items-center gap-2">
						<span class="edp-opt-label text-sm font-semibold text-foreground">
							{optionName}

							{#if productState.selectedAggregations?.[optionName]}
								:
							{/if}
						</span>

						<span class="edp-opt-value font-semibold">{productState.selectedAggregations?.[optionName] || ''}</span>
					</div>

					<div class="flex flex-wrap items-center gap-2">
						{#each sortByNumericValue(values as string[]) as value}
							<Button
								variant={productState.selectedAggregations?.[optionName] === value ? 'default' : 'plain'}
								disabled={!productState.isAggregationAvaliable(optionName, value)}
								class="edp-pill h-11 min-w-[3.5rem] border px-4 md:h-10 {productState.selectedAggregations?.[optionName] === value
									? 'edp-on border-primary bg-primary text-primary-foreground'
									: 'border-border-strong bg-background text-foreground hover:border-foreground'}"
								onclick={() => productState.toggleAggregation(optionName, value, true)}
							>
								{value}
							</Button>
						{/each}
					</div>
				</div>
			{/if}
		{/each}
	</div>
{/if}

<style>
	/* Refined Editorial — default theme only. */
	:global([data-theme='default'] .edp-aggregation .edp-opt-label) {
		font-family: var(--ed-body);
		/* Same 12px floor as the variation labels this row sits beside. */
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--ed-soft);
	}

	:global([data-theme='default'] .edp-aggregation .edp-opt-value) {
		font-family: var(--ed-body);
		font-weight: 600;
		letter-spacing: 0.02em;
		color: var(--ed-ink);
	}

	/* Height stays on the utility classes (44px phone / 40px md up) so the density rule is
	   readable at the call site; only the editorial surface is restated here. */
	:global([data-theme='default'] .edp-aggregation .edp-pill) {
		min-width: 3.25rem;
		padding: 0 16px !important;
		border-color: var(--ed-line-strong) !important;
		border-radius: var(--ed-radius) !important;
		background: transparent !important;
		color: var(--ed-ink) !important;
		font-family: var(--ed-body);
		font-size: 0.85rem;
		font-weight: 500;
		letter-spacing: 0.02em;
		text-transform: none;
		box-shadow: none !important;
		transition:
			border-color 0.2s ease,
			background 0.2s ease,
			color 0.2s ease;
	}

	:global([data-theme='default'] .edp-aggregation .edp-pill:hover:not(:disabled)) {
		border-color: var(--ed-ink) !important;
	}

	:global([data-theme='default'] .edp-aggregation .edp-pill.edp-on) {
		border-color: hsl(var(--primary)) !important;
		background: hsl(var(--primary)) !important;
		color: hsl(var(--primary-foreground)) !important;
	}

	:global([data-theme='default'] .edp-aggregation .edp-pill:disabled) {
		opacity: 0.4 !important;
		text-decoration: line-through;
	}
</style>
