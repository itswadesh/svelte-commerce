<script lang="ts">
	import { page } from '$app/state'
	import { afterNavigate, goto } from '$app/navigation'
	import { tick } from 'svelte'
	import { useProductState } from '$lib/core/composables/index.js'
	import { Button } from '$lib/components/ui/button'
	import SizeGuideDrawer from './size-guide-drawer.svelte'
	import OptionPicker from './option-picker.svelte'
	import { pickerChoices, usesSearchablePicker, variantFor, variantsWith } from '$lib/product/conversion'
	import { themeOptions } from '$lib/composer/theme-options.js'
	import { ChevronRight } from '@lucide/svelte'

	const productState = useProductState()

	/**
	 * Choosing a value, without throwing keyboard focus away.
	 *
	 * `selectVariant` ends in `goto('?variant_id=…')` — unawaited, and without `keepFocus` — so
	 * SvelteKit moves focus to the document body a moment after the click, and a keyboard or switch
	 * user had to tab through the whole header again for every option they tried. That call lives in
	 * `@misiki/kitcommerce-core`, which this repo does not own, so focus is put back here once the
	 * navigation has settled. The keyed blocks below reuse the same DOM node, so the pill that was
	 * pressed is still the right element to return to. `currentTarget` is read synchronously: the
	 * DOM clears it as soon as dispatch ends.
	 */
	let pendingFocus: HTMLElement | null = null

	// The variant is chosen here rather than by the kit's `selectVariant` (GoCommerce D134): its
	// lookup falls back to the first variant carrying the value at all, which could change a size the
	// shopper had already picked. `variantFor` keeps the earlier choices, as the cross-filter that
	// offered the value promised, and moves only the later ones.
	const select = (option: Record<string, any>, value: Record<string, any>) => {
		const target = variantFor(variants, options, selection, option.id, value.value, purchasable)
		if (!target) return productState.selectVariant({ option, value })
		productState.selectedVariant = target
		goto(`?variant_id=${target.id}`, { replaceState: true, noScroll: true })
	}

	const choose = (event: Event, option: Record<string, any>, value: Record<string, any>) => {
		pendingFocus = event.currentTarget as HTMLElement | null
		select(option, value)
	}

	// The searchable picker hands back its trigger, which is where focus belongs after the choice.
	const chooseValue = (option: Record<string, any>, value: string, trigger: HTMLElement | null) => {
		const v = (option.values ?? []).find((x: Record<string, any>) => x.value === value)
		if (!v) return
		pendingFocus = trigger
		select(option, v)
	}

	afterNavigate(async () => {
		const pill = pendingFocus
		pendingFocus = null
		if (!pill) return
		await tick()
		if (pill.isConnected && document.activeElement !== pill) pill.focus({ preventScroll: true })
	})

	// Options and variants are read from page data rather than `productState.productOptions`.
	// That field is seeded once in the composable's constructor and only ever rewritten by a
	// click, so it went stale on client-side navigation, and the `selectable` flag it carries is
	// set by the same click handler — which is exactly why the server rendered every value as
	// unavailable. Page data is always current and is what the composable itself reads.
	const product = $derived(page.data?.product)
	const options = $derived<any[]>(product?.options ?? [])
	const variants = $derived<any[]>(product?.variants ?? [])

	// Ids arrive as numbers from some backends and strings from others; never compare them raw.
	const sameId = (a: unknown, b: unknown) => String(a) === String(b)

	/** The current selection as [optionId, value] pairs, taken from the selected variant. */
	const selection = $derived<[string, string][]>(
		(productState.selectedVariant?.options ?? []).map((o: Record<string, any>) => [String(o.optionId), o.value] as [string, string])
	)

	/**
	 * Every variant that carries `value` for `optionId` and agrees with what is chosen on the options
	 * before it. Empty means the combination does not exist: with S chosen, White returns nothing
	 * when there is no S / White, rather than silently jumping the shopper to M / White.
	 *
	 * Only the earlier options count (GoCommerce D134): judged against every other option, a chosen
	 * model made every other brand unavailable, and "Brand then Model" could never change brand.
	 *
	 * Before hydration `selection` is empty, so every value that exists on any variant comes back
	 * available and the server-rendered pills are enabled.
	 */
	const variantsFor = (optionId: unknown, value: string) => variantsWith(variants, options, selection, optionId, value)

	const purchasable = (variant: any) => {
		if (variant?.manageInventory === false) return true
		if (variant?.allowBackorder) return true
		return Number(variant?.stock ?? 0) > 0
	}

	/** default | selected | unavailable (no such combination) | soldout (exists, cannot be bought) */
	const statusOf = (optionId: unknown, value: string) => {
		if (productState.isVariantOptionSelected(optionId, value)) return 'selected'
		if (!variants.length) return 'default'
		const candidates = variantsFor(optionId, value)
		if (!candidates.length) return 'unavailable'
		if (!candidates.some(purchasable)) return 'soldout'
		return 'default'
	}

	const theme = $derived(themeOptions(page.data?.themeSettings))
	const lowStockAt = $derived(theme.pdp_low_stock_at)
	const sizeGuide = $derived(theme.pdp_size_guide)

	const lowLeftOf = (variant: any) => {
		if (variant?.manageInventory === false || variant?.allowBackorder) return 0
		const n = Number(variant?.stock ?? 0)
		return n > 0 && n <= lowStockAt ? n : 0
	}

	/**
	 * "2 left" under a value of the last option, where a value names one variant: from that variant's
	 * own stock, and only at or below the store's pdp_low_stock_at. The line is reserved whenever any
	 * variant is that low, because the server renders before the selection is known, and a hint that
	 * appeared at hydration would push the button down.
	 */
	const lastOptionId = $derived(options.at(-1)?.id)
	const reservesHint = $derived(lowStockAt > 0 && variants.some((v) => lowLeftOf(v) > 0))
	const leftFor = (optionId: unknown, value: string) => {
		if (!reservesHint || !sameId(optionId, lastOptionId)) return 0
		const candidates = variantsFor(optionId, value)
		return candidates.length === 1 ? lowLeftOf(candidates[0]) : 0
	}

	const unavailableReason = (status: string) => {
		if (status === 'soldout') return 'sold out'
		if (status === 'unavailable') return 'unavailable with the current selection'
		return ''
	}

	const selectedValueOf = (option: Record<string, any>) =>
		productState.selectedVariant?.options?.find((o: Record<string, any>) => sameId(option.id, o.optionId))?.value

	// A colour swatch is only honest when the option value really is a colour. "Rose Gold" used as
	// a CSS background painted an empty circle with no label, so anything that is not a recognised
	// colour token falls back to the standard labelled pill.
	const COLOUR_SYNTAX = /^(#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})|(rgb|hsl)a?\()/i
	const COLOUR_KEYWORDS = new Set([
		'aqua',
		'beige',
		'black',
		'blue',
		'brown',
		'coral',
		'cream',
		'crimson',
		'cyan',
		'fuchsia',
		'gold',
		'gray',
		'green',
		'grey',
		'indigo',
		'ivory',
		'khaki',
		'lavender',
		'lime',
		'magenta',
		'maroon',
		'navy',
		'olive',
		'orange',
		'pink',
		'purple',
		'red',
		'salmon',
		'silver',
		'tan',
		'teal',
		'turquoise',
		'violet',
		'white',
		'yellow'
	])

	const swatchColour = (value: Record<string, any>): string | null => {
		const explicit = value?.colorCode || value?.colourCode || value?.hex || value?.color
		if (typeof explicit === 'string' && explicit.trim()) return explicit.trim()
		const raw = typeof value?.value === 'string' ? value.value.trim() : ''
		if (!raw) return null
		if (COLOUR_SYNTAX.test(raw)) return raw
		return COLOUR_KEYWORDS.has(raw.toLowerCase()) ? raw.toLowerCase() : null
	}
</script>

<!-- No `{#key}` wrapper. Re-keying the whole group on every selection destroyed and rebuilt each
     pill, which threw keyboard focus back to the document body after every choice. The keyed
     `{#each}` blocks below update the same DOM nodes in place, so focus, hover and the pressed
     state survive a selection. -->
{#if options.length}
	<div class="edp-variation flex flex-col gap-4" data-testid="product-variants">
		{#each options as option (option.id)}
			{@const selectedValue = selectedValueOf(option)}
			<div class="flex flex-col gap-2">
				<div class="flex min-h-6 items-center justify-between gap-3">
					<h2 class="edp-opt-label flex items-baseline gap-1.5 text-sm font-semibold text-foreground">
						<span>{option.title}</span>
						{#if selectedValue}
							<span class="edp-opt-value font-semibold text-foreground">{selectedValue}</span>
						{/if}
					</h2>

					{#if sizeGuide && /size/i.test(option.title ?? '')}
						<a href={sizeGuide} class="edp-sizeguide inline-flex min-h-6 items-center gap-0.5 text-supporting font-semibold text-info">
							Size guide
							<ChevronRight class="size-4" aria-hidden="true" />
						</a>
					{:else if option.type === 'Size'}
						<SizeGuideDrawer />
					{/if}
				</div>

				{#if usesSearchablePicker(option.values)}
					<!-- More values than a phone can show as pills (GoCommerce D134): a searchable list of
					     the ones that exist with what is already chosen. -->
					<OptionPicker
						title={option.title}
						selected={selectedValue ?? ''}
						choices={pickerChoices(option.values, (value) => statusOf(option.id, value))}
						onchoose={(value, trigger) => chooseValue(option, value, trigger)}
					/>
				{:else}
					<!-- role="group" + aria-label ties the values to their option name, and aria-pressed is
				     the only thing that tells assistive technology which one is active: the selected
				     state is otherwise a class swap. -->
					<div class="flex flex-wrap items-center gap-2" role="group" aria-label={option.title}>
						{#each option.values || [] as v (v.id ?? v.value)}
							{@const status = statusOf(option.id, v.value)}
							{@const isSelected = status === 'selected'}
							{@const isBlocked = status === 'unavailable' || status === 'soldout'}
							{@const colour = option.type === 'Color' ? swatchColour(v) : null}

							{#if colour}
								<Button
									variant="plain"
									data-testid="variant-option"
									aria-pressed={isSelected}
									disabled={isBlocked}
									title={isBlocked ? `${v.value} — ${unavailableReason(status)}` : v.value}
									class="edp-swatch relative size-11 rounded-full border border-border-strong p-1 md:size-10 {isSelected
										? 'edp-on ring-2 ring-primary ring-offset-2'
										: ''}"
									onclick={(event) => choose(event, option, v)}
								>
									<span class="block h-full w-full rounded-full" style="background-color: {colour}"></span>
									<span class="sr-only">{v.value}{isBlocked ? ` — ${unavailableReason(status)}` : ''}</span>
								</Button>
							{:else}
								{@const left = isBlocked ? 0 : leftFor(option.id, v.value)}
								<span class="inline-flex flex-col items-center gap-0.5">
									<Button
										variant="plain"
										data-testid="variant-option"
										aria-pressed={isSelected}
										disabled={isBlocked}
										title={isBlocked ? `${v.value} — ${unavailableReason(status)}` : undefined}
										class="edp-pill h-11 min-w-[3.5rem] border px-4 text-sm font-medium md:h-10 {isSelected
											? 'edp-on border-primary bg-primary text-primary-foreground'
											: 'border-border-strong bg-background text-foreground hover:border-foreground'}"
										onclick={(event) => choose(event, option, v)}
									>
										{v.value}
										{#if isBlocked}
											<span class="sr-only">— {unavailableReason(status)}</span>
										{:else if left}
											<span class="sr-only">, {left} left</span>
										{/if}
									</Button>
									{#if reservesHint && sameId(option.id, lastOptionId)}
										<span class="min-h-4 text-caption font-semibold leading-4 text-warning" aria-hidden="true" data-testid="variant-low-stock"
											>{left ? `${left} left` : ''}</span
										>
									{/if}
								</span>
							{/if}
						{/each}
					</div>
				{/if}
			</div>
		{/each}
	</div>
{/if}

<style>
	/* Refined Editorial — default theme only. Route component renders for all themes, so every
	   rule is gated under [data-theme='default']. */
	:global([data-theme='default'] .edp-opt-label) {
		font-family: var(--ed-body);
		/* 12px floor for supporting text. The row is min-h-6, so this does not reflow. */
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--ed-soft);
	}

	/* The value sits inside the uppercased label now, so it has to opt back out of it: the
	   selection is data the shopper chose, not a section heading. */
	:global([data-theme='default'] .edp-opt-value) {
		font-family: var(--ed-body);
		font-size: 0.85rem;
		font-weight: 600;
		text-transform: none;
		letter-spacing: 0.01em;
		color: var(--ed-ink);
	}

	/* Height stays on the utility classes (44px on phones, 40px from md) so the density rule is
	   readable at the call site; only the editorial surface is restated here. */
	:global([data-theme='default'] .edp-pill) {
		min-width: 3.25rem;
		padding: 0 18px !important;
		border-color: var(--ed-line-strong) !important;
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
			border-color var(--motion-fast) var(--motion-ease),
			background var(--motion-fast) var(--motion-ease),
			color var(--motion-fast) var(--motion-ease);
	}

	:global([data-theme='default'] .edp-pill:hover:not(:disabled)) {
		border-color: var(--ed-ink) !important;
	}

	:global([data-theme='default'] .edp-pill.edp-on) {
		/* The fill alone is 1.44:1 on white, so the chosen value also takes a 2px ink edge. */
		border-color: hsl(var(--primary-ink)) !important;
		background: hsl(var(--primary)) !important;
		color: hsl(var(--primary-foreground)) !important;
		box-shadow: inset 0 0 0 1px hsl(var(--primary-ink)) !important;
	}

	/* Reserved for values the catalogue has actually excluded — a combination that does not exist
	   or cannot be bought. Everything else renders enabled, including before hydration. */
	:global([data-theme='default'] .edp-pill:disabled) {
		opacity: 0.45 !important;
		text-decoration: line-through;
	}

	:global([data-theme='default'] .edp-swatch) {
		border-color: var(--ed-line-strong) !important;
		box-shadow: none !important;
	}

	:global([data-theme='default'] .edp-swatch:disabled) {
		opacity: 0.45 !important;
	}
</style>
