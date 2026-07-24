<script lang="ts">
	import { page } from '$app/state'
	import { useProductState } from '$lib/core/composables/index.js'
	import { Button } from '$lib/components/ui/button/index.js'

	const productState = useProductState()
</script>

{#if page.data?.product?.ag && Object.keys(page.data?.product?.ag).length}
	<div class="intra-gap flex flex-col edp-aggregation">
		{#each Object.entries(page.data?.product?.ag || {}) as [optionName, values]}
			{#if Array.isArray(values)}
				<div class="flex flex-col gap-3">
					<div class="flex items-center gap-2">
						<span class="text-sm font-semibold text-gray-900 dark:text-gray-100 edp-opt-label">
							{optionName}

							{#if productState.selectedAggregations?.[optionName]}
								:
							{/if}
						</span>

						<span class="font-semibold edp-opt-value">{productState.selectedAggregations?.[optionName] || ''}</span>
					</div>

					<div class="flex flex-wrap items-center gap-3">
						{#each [...values].sort() as value}
							<Button
								variant={productState.selectedAggregations?.[optionName] === value ? 'default' : 'plain'}
								disabled={!productState.isAggregationAvaliable(optionName, value)}
								class="edp-pill min-w-[3.5rem] !bg-primary px-4 py-2 {productState.selectedAggregations?.[optionName] === value
									? 'edp-on border !border-accent !bg-transparent'
									: '!bg-accent text-accent-foreground'}"
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
		font-size: 0.72rem;
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

	:global([data-theme='default'] .edp-aggregation .edp-pill) {
		min-width: 3.25rem;
		height: 44px;
		padding: 0 18px !important;
		border: 1px solid var(--ed-line) !important;
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
