<script lang="ts">
	import { useProductState } from '$lib/core/composables/index.js'
	import { getSettingState } from '$lib/core/stores/index.js'
	import QrCodeDisplayer from '$lib/core/components/common/qr-code.svelte'
	import { page } from '$app/state'
	import { ChevronDown } from '@lucide/svelte'
	import { slide } from 'svelte/transition'
	import { prefersReducedMotion } from 'svelte/motion'

	const productState = useProductState()
	const settingState = getSettingState()
	const data = $derived(page.data)

	let isOpen = $state(true)

	// Same panel budget and the same reduced-motion escape as product-description.svelte, so both
	// accordions on this page open at identical speed.
	const panelMs = $derived(prefersReducedMotion.current ? 0 : 200)

	// Every value is "selected variant, else the product record" — resolved once here instead of
	// repeating the pair inside the markup, where it was written out twelve times and made the
	// dimensions row an unreadable chain of nested {#if}s.
	const variant = $derived<Record<string, any> | null>(productState.selectedVariant ?? null)
	const product = $derived<Record<string, any> | null>(data?.product ?? null)
	const pick = (key: string) => variant?.[key] || product?.[key]

	const sku = $derived(pick('sku'))
	const barcode = $derived(pick('barcode'))
	const weight = $derived(pick('weight'))
	const qrcode = $derived(pick('qrcode'))
	const originCountry = $derived(product?.originCountry)
	const weightUnit = $derived(page?.data?.store?.weight_unit || settingState?.selectedStore?.weight_unit || '')

	/** W-… x H-… x L-…, with only the measurements the backend actually sent. */
	const dimensions = $derived(
		[
			['W', pick('width')],
			['H', pick('height')],
			['L', pick('length')]
		]
			.filter(([, value]) => value !== undefined && value !== null && value !== '')
			.map(([axis, value]) => `${axis}-${value}`)
			.join(' x ')
	)

	// `attributes` is optional on several connectors; iterating it raw threw on any product
	// without one.
	const attributes = $derived<{ name: string; value: string }[]>(product?.attributes ?? [])

	// A bordered header reading "Product Specifications" over nothing at all is worse than no
	// section, so the whole block stands down when the backend sent no specs.
	const hasSpecs = $derived(!!(sku || barcode || dimensions || weight || originCountry || attributes.length || qrcode))
</script>

{#if hasSpecs}
	<div class="edp-spec">
		<button
			type="button"
			class="flex min-h-11 w-full items-center justify-between gap-3 py-2.5 text-left md:min-h-10"
			aria-expanded={isOpen}
			aria-controls="product-specifications-panel"
			onclick={() => (isOpen = !isOpen)}
		>
			<span class="edp-acc-label text-sm font-semibold text-foreground">Product Specifications</span>

			<ChevronDown
				class="size-4 shrink-0 text-muted-foreground transition-transform duration-panel ease-standard motion-reduce:transition-none {isOpen
					? 'rotate-180'
					: ''}"
				aria-hidden="true"
			/>
		</button>

		{#if isOpen}
			<div id="product-specifications-panel" class="overflow-hidden" transition:slide={{ duration: panelMs }}>
				<!-- A definition list, because that is what this is: it gives assistive technology the
				     label/value pairing that a grid of loose <p> tags did not. -->
				<dl class="grid grid-cols-2 gap-x-4 gap-y-3 pb-3 lg:grid-cols-3">
					{#if sku}
						<div class="edp-spec-row">
							<dt class="edp-spec-key">SKU</dt>
							<dd class="edp-spec-val break-words">{String(sku)}</dd>
						</div>
					{/if}

					{#if barcode}
						<div class="edp-spec-row">
							<dt class="edp-spec-key">Barcode</dt>
							<dd class="edp-spec-val break-words">{barcode}</dd>
						</div>
					{/if}

					{#if dimensions}
						<div class="edp-spec-row">
							<dt class="edp-spec-key">Dimensions</dt>
							<dd class="edp-spec-val">{dimensions}</dd>
						</div>
					{/if}

					{#if weight}
						<div class="edp-spec-row">
							<dt class="edp-spec-key">Weight</dt>
							<dd class="edp-spec-val">{weight} {weightUnit}</dd>
						</div>
					{/if}

					{#if originCountry}
						<div class="edp-spec-row">
							<dt class="edp-spec-key">Origin</dt>
							<dd class="edp-spec-val">{originCountry}</dd>
						</div>
					{/if}

					{#each attributes as { name, value }}
						<div class="edp-spec-row">
							<dt class="edp-spec-key">{name.replaceAll('_', ' ')}</dt>
							<dd class="edp-spec-val">{value}</dd>
						</div>
					{/each}
				</dl>

				{#if qrcode}
					<div class="edp-spec-qr mb-4 flex flex-col items-center gap-2 rounded-lg border bg-muted p-3">
						<p class="text-xs font-medium text-muted-foreground">Product authenticity</p>
						<QrCodeDisplayer base64Data={qrcode} />
					</div>
				{/if}
			</div>
		{/if}
	</div>
{/if}

<style>
	/* Refined Editorial — default theme only. */
	:global([data-theme='default'] .edp-spec) {
		border-top: 1px solid var(--ed-line);
	}

	:global([data-theme='default'] .edp-spec .edp-acc-label) {
		font-family: var(--ed-body);
		font-size: 0.78rem;
		font-weight: 600;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--ed-ink);
	}

	/* Base (all themes): the labels were `text-[10px] ... uppercase`, i.e. 10px all-caps, under
	   the 12px supporting-text floor and hard to read. 12px sentence case instead. */
	.edp-spec-row {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.edp-spec-key {
		font-size: 0.75rem;
		line-height: 1.4;
		color: hsl(var(--muted-foreground));
	}

	.edp-spec-val {
		font-size: 0.875rem;
		line-height: 1.45;
		font-weight: 500;
		color: hsl(var(--foreground));
	}

	:global([data-theme='default'] .edp-spec .edp-spec-key) {
		color: var(--ed-soft);
	}

	:global([data-theme='default'] .edp-spec .edp-spec-val) {
		color: var(--ed-ink);
	}

	:global([data-theme='default'] .edp-spec-qr) {
		border: 1px solid var(--ed-line);
		border-radius: var(--ed-radius);
		background: var(--ed-canvas);
	}
</style>
