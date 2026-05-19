<script lang="ts">
	import { useProductState } from '$lib/core/composables/index.js'
	import { ChartNoAxesGanttIcon } from '@lucide/svelte'

	const productState = useProductState()
</script>

<div class="intra-gap flex flex-col">
	{#key productState.productOptions}
		{#each productState.productOptions || [] as option}
			<div class="flex flex-col gap-3">
				<div class="flex items-center justify-between">
					<span class="text-xs font-bold uppercase tracking-widest text-gray-900 dark:text-gray-100">{option.title}</span>
					{#if option.type === 'Size'}
						<button class="text-[10px] font-bold uppercase tracking-widest text-primary transition-all hover:underline">Size Guide</button>
					{/if}
				</div>

				<div class="flex flex-wrap items-center gap-3">
					{#each option.values || [] as v}
						{#if option.type === 'Color'}
							<button
								class:opacity-40={!v.selectable}
								class="group relative h-10 w-10 rounded-full border border-gray-200 p-0.5 transition-all {productState.isVariantOptionSelected(
									option.id,
									v.value
								)
									? 'ring-2 ring-primary ring-offset-2'
									: 'hover:border-gray-400'}"
								onclick={() => productState.selectVariant({ option, value: v })}
								title={v.value}
							>
								<div class="h-full w-full rounded-full" style="background-color: {v.value}"></div>
								<span class="sr-only">{v.value}</span>
							</button>
						{:else}
							<button
								disabled={!v.selectable}
								class="min-w-[3.5rem] rounded-md border px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all
									{productState.isVariantOptionSelected(option.id, v.value)
									? 'border-primary bg-primary text-white'
									: v.selectable
										? 'border-gray-200 text-gray-900 hover:border-gray-900'
										: 'cursor-not-allowed border-gray-100 bg-gray-50 text-gray-300'}"
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
