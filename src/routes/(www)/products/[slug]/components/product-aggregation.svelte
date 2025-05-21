<script lang="ts">
	import { page } from '$app/state'
	import { useProductState } from '$lib/core/composables/product'
	import { ChartNoAxesGanttIcon } from 'lucide-svelte'

	const productState = useProductState()
</script>

<div class="">
	{#if page.data?.product?.ag && Object.keys(page.data?.product?.ag).length}
		<div class="flex items-center gap-2">
			<span class="text-sm text-gray-500">Select Options</span>
			<ChartNoAxesGanttIcon class="h-3 w-3" />
		</div>

		<div class="my-2 flex flex-col flex-wrap justify-center gap-2">
			{#each Object.entries(page.data?.product?.ag || {}) as [optionName, values]}
				{#if Array.isArray(values)}
					<div class="flex flex-col gap-1">
						<span class="text-lg uppercase">{optionName}</span>
						<div class="flex flex-wrap items-center gap-2">
							{#each [...values].sort() as value}
								<button
									class="relative overflow-hidden border px-4 py-2 text-sm transition-colors hover:border-primary
                            {productState.selectedAggregations?.[optionName] === value
										? 'border-black bg-secondary dark:border-white'
										: 'border-muted'}
                            {!productState.isAggregationAvaliable(optionName, value) ? 'bg-gray-200 text-gray-600' : ''}
                              "
									onclick={() => productState.toggleAggregation(optionName, value)}
								>
									{value}
								</button>
							{/each}
						</div>
					</div>
				{/if}
			{/each}
		</div>
	{/if}
</div>

