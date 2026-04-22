<script lang="ts">
	import { useProductState } from '$lib/core/composables/index.js'
	import { ChartNoAxesGanttIcon } from '@lucide/svelte'

	const productState = useProductState()
</script>

{#if productState.productOptions?.length}
	<div class="hidden items-center gap-2 sm:flex">
		<span class="text-sm text-gray-600 font-medium"> Select Variation </span>
		<ChartNoAxesGanttIcon class="h-3 w-3 text-gray-600" />
	</div>

	<div class="my-2 flex flex-col flex-wrap justify-center gap-4">
		{#key productState.productOptions}
			{#each productState.productOptions || [] as option}
				<div class="flex flex-col gap-2">
					<span class="text-sm font-semibold capitalize text-gray-900">{option.title}</span>
					<div class="flex flex-wrap items-center gap-3">
						{#each option.values || [] as v}
							{#if option.type === 'Color'}
								<button
									class:bg-gray-200={!v.selectable}
									class="h-11 w-11 rounded-md border p-1 transition-colors {productState.isVariantOptionSelected(option.id, v.value)
										? 'border-2 border-pink-500 dark:border-white'
										: 'border-muted'}"
									style="background-color: {v.value}"
									onclick={() => productState.selectVariant({ option, value: v })}
									title={v.value}
								>
									<span class="sr-only">{v.value}</span>
								</button>
							{:else if option.type === 'Size'}
								<button
									class:bg-gray-200={!v.selectable}
									class="min-w-[3rem] border px-4 py-2 transition-colors hover:border-primary {productState.isVariantOptionSelected(
										option.id,
										v.value
									)
										? 'border-black bg-gray-50 dark:border-white'
										: 'border-muted'}"
									onclick={() => productState.selectVariant({ option, value: v })}
								>
									{v.value}
								</button>
							{:else}
								<button
									class:bg-gray-200={!v.selectable}
									class="min-w-[3rem] rounded-md border px-4 py-2 text-sm transition-colors hover:border-primary
                          {productState.isVariantOptionSelected(option.id, v.value)
										? 'border-black bg-yellow-50 dark:border-white'
										: 'border-muted'}"
									onclick={() => productState.selectVariant({ option, value: v })}
								>
									{v.value}
								</button>
							{/if}
						{/each}
					</div>
				</div>
			{/each}
		{/key}
	</div>
{/if}

