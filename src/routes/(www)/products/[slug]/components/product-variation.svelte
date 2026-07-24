<script lang="ts">
	import { useProductState } from '$lib/core/composables/index.js'
	import { ChartNoAxesGanttIcon } from '@lucide/svelte'
	import { Button } from '$lib/components/ui/button'
	import SizeGuideDrawer from './size-guide-drawer.svelte'

	const productState = useProductState()
</script>

<div class="intra-gap flex flex-col edp-variation">
	{#key productState.productOptions}
		{#each productState.productOptions || [] as option}
			<div class="flex flex-col gap-3">
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-2">
					  <span class="text-sm font-semibold  text-gray-900 dark:text-gray-100 edp-opt-label">
							{option.title}

							{#if productState.selectedVariant?.options?.find((opt: Record<string, any>) => option.id === opt.optionId)?.value}
								:
							{/if}
						</span>

						<span class="font-semibold edp-opt-value">{productState.selectedVariant?.options?.find((opt: Record<string, any>) => option.id === opt.optionId)?.value}</span>
					</div>
					{#if option.type === 'Size'}
						<SizeGuideDrawer />
					{/if}
				</div>

				<div class="flex flex-wrap items-center gap-3">
					{#each option.values || [] as v}
						{#if option.type === 'Color'}
							<Button
								variant="outline"
								size="icon"
								class="edp-swatch group relative h-10 w-10 rounded-full p-0.5 {productState.isVariantOptionSelected(
									option.id,
									v.value
								)
									? 'edp-on ring-2 ring-primary ring-offset-2'
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
								class="edp-pill min-w-[3.5rem] !bg-primary px-4 py-2 {
                  productState.isVariantOptionSelected(option.id, v.value)
									? 'edp-on border !border-accent !bg-transparent'
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

<style>
	/* Refined Editorial — default theme only. Selectors override the shared
	   !bg-primary / !bg-accent utilities, hence !important; scoped to default. */
	:global([data-theme='default'] .edp-opt-label) {
		font-family: var(--ed-body);
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--ed-soft);
	}

	:global([data-theme='default'] .edp-opt-value) {
		font-family: var(--ed-body);
		font-weight: 600;
		letter-spacing: 0.02em;
		color: var(--ed-ink);
	}

	:global([data-theme='default'] .edp-pill) {
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

	:global([data-theme='default'] .edp-pill:hover:not(:disabled)) {
		border-color: var(--ed-ink) !important;
	}

	:global([data-theme='default'] .edp-pill.edp-on) {
		border-color: hsl(var(--primary)) !important;
		background: hsl(var(--primary)) !important;
		color: hsl(var(--primary-foreground)) !important;
	}

	:global([data-theme='default'] .edp-pill:disabled) {
		opacity: 0.4 !important;
		text-decoration: line-through;
	}

	:global([data-theme='default'] .edp-swatch) {
		border: 1px solid var(--ed-line) !important;
		box-shadow: none !important;
	}
</style>

