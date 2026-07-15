<script lang="ts">
	import { page } from '$app/state'
	import { useProductState } from '$lib/core/composables/index.js'
	import { Button } from '$lib/components/ui/button/index.js'

	const productState = useProductState()
</script>

{#if page.data?.product?.ag && Object.keys(page.data?.product?.ag).length}
	<div class="intra-gap flex flex-col">
		{#each Object.entries(page.data?.product?.ag || {}) as [optionName, values]}
			{#if Array.isArray(values)}
				<div class="flex flex-col gap-3">
					<div class="flex items-center gap-2">
						<span class="text-sm font-semibold text-gray-900 dark:text-gray-100">
							{optionName}

							{#if productState.selectedAggregations?.[optionName]}
								:
							{/if}
						</span>

						<span class="font-semibold">{productState.selectedAggregations?.[optionName] || ''}</span>
					</div>

					<div class="flex flex-wrap items-center gap-3">
						{#each [...values].sort() as value}
							<Button
								variant="outline"
								disabled={!productState.isAggregationAvaliable(optionName, value)}
								class="min-w-[3.5rem] rounded-md border px-4 py-2 text-sm font-medium transition-colors {productState.selectedAggregations?.[optionName] === value
									? '!border-primary !bg-primary !text-primary-foreground'
									: '!border-border !bg-background !text-foreground hover:!border-primary hover:!text-primary'}"
								onclick={() => productState.toggleAggregation(optionName, value)}
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
