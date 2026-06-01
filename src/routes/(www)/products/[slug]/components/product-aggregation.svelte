<script lang="ts">
	import { page } from '$app/state'
	import { useProductState } from '$lib/core/composables/index.js'
	import { Button } from '$lib/components/ui/button'

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
								variant={productState.selectedAggregations?.[optionName] === value ? 'default' : 'plain'}
								disabled={!productState.isAggregationAvaliable(optionName, value)}
								class={`min-w-[3.5rem] px-4 py-2 !bg-primary ${productState.selectedAggregations?.[optionName] === value ? '!bg-accent text-accent-foreground' : '!bg-transparent border !border-accent'}`}
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
