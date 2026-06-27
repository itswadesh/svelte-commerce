<script lang="ts">
	import { useProductState } from '$lib/core/composables/index.js'
	import { ChartNoAxesGanttIcon } from '@lucide/svelte'
	import { Button } from '$lib/components/ui/button'

	const productState = useProductState()
</script>

<div class="intra-gap flex flex-col">
	{#key productState.productOptions}
		{#each productState.productOptions || [] as option}
			<div class="flex flex-col gap-3">
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-2">
					  <span class="text-sm font-semibold  text-gray-900 dark:text-gray-100">
							{option.title}

							{#if productState.selectedVariant?.options?.find((opt: Record<string, any>) => option.id === opt.optionId)?.value}
								:
							{/if}
						</span>

						<span class="font-semibold">{productState.selectedVariant?.options?.find((opt: Record<string, any>) => option.id === opt.optionId)?.value}</span>
					</div>
					{#if option.type === 'Size'}
						<Button variant="link" class="h-auto p-0">Size Guide</Button>
					{/if}
				</div>

				<div class="flex flex-wrap items-center gap-3">
					{#each option.values || [] as v}
						{#if option.type === 'Color'}
							<Button
								variant="outline"
								size="icon"
								class="group relative h-10 w-10 rounded-full p-0.5 {productState.isVariantOptionSelected(
									option.id,
									v.value
								)
									? 'ring-2 ring-primary ring-offset-2'
									: ''} {!v.selectable ? 'opacity-40' : ''}"
								onclick={() => productState.selectVariant({ option, value: v })}
								title={v.value}
							>
								<div class="h-full w-full rounded-full" style="background-color: {v.value}"></div>
								<span class="sr-only">{v.value}</span>
							</Button>
						{:else}
							<Button
								variant={productState.isVariantOptionSelected(option.id, v.value) ? 'default' : 'plain'}
								disabled={!v.selectable}
								class="min-w-[3.5rem] !bg-primary px-4 py-2 {
                  productState.isVariantOptionSelected(option.id, v.value)
									? 'border !border-accent !bg-transparent'
									: '!bg-accent text-accent-foreground'}"
								onclick={() => productState.selectVariant({ option, value: v })}
							>
								{v.value}
							</Button>
						{/if}
					{/each}
				</div>
			</div>
		{/each}
	{/key}
</div>

