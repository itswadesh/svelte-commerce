<script lang="ts">
	import { page } from '$app/state'
	import { useProductState } from '$lib/core/composables/index.js'
	import { ChartNoAxesGanttIcon } from '@lucide/svelte'
	import { Button } from '$lib/components/ui/button'

	const productState = useProductState()
</script>

{#if page.data?.product?.ag && Object.keys(page.data?.product?.ag).length}
	<div class="">
		<div class="intra-gap flex items-center">
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
								<Button
									variant={productState.selectedAggregations?.[optionName] === value ? 'default' : 'outline'}
									class="relative overflow-hidden px-4 py-2"
									disabled={!productState.isAggregationAvaliable(optionName, value)}
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
	</div>
{/if}
