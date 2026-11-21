<script lang="ts">
	import { page } from '$app/state'
	import { productService } from '$lib/core/services'
	import { formatPrice } from '$lib/utils/price'
	import { slide } from '$lib/motion'
	import { addOnPicks, resetPicks, togglePick } from '$lib/product/add-on-picks.svelte'
	import type { AddOnOption } from '$lib/product/upsells'

	/**
	 * "Complete the set" (GoCommerce D133): add-ons the shop offers with this product, ticked here
	 * and bought by the add button with it. Each shows its own price struck through and what
	 * ticking it adds, which is the engine's offer price: the engine keeps that price only while
	 * this product is in the bag, one for each, so the figure is never a promise the bag breaks.
	 *
	 * A connector without add-ons, or a product with none, draws nothing.
	 */
	let options = $state<AddOnOption[]>([])
	const productId = $derived(String(page.data?.product?.id ?? ''))
	const slug = $derived(page.data?.product?.slug as string | undefined)
	const currencyCode = $derived(page.data?.store?.currency?.code)

	$effect(() => {
		const s = slug
		const id = productId
		const svc = productService as unknown as { listAddOns?: (q: { product: string }) => Promise<AddOnOption[]> }
		options = []
		if (!s || typeof svc.listAddOns !== 'function') return
		resetPicks(id)
		let live = true
		svc
			.listAddOns({ product: s })
			.then((rows) => {
				if (live) options = rows ?? []
			})
			.catch(() => {
				// The buy box stands without its extras.
			})
		return () => {
			live = false
		}
	})

	// Read through the shared state so the sticky bar's add button and this box agree.
	const picked = $derived(new Set(addOnPicks.productId === productId ? addOnPicks.items.map((a) => a.id) : []))
</script>

{#if options.length}
	<fieldset class="cts rounded-radius border border-border p-3" transition:slide data-testid="complete-the-set">
		<legend class="cts-legend px-1 text-sm font-semibold text-foreground">Complete the set</legend>
		<ul class="flex flex-col">
			{#each options as option (option.id)}
				<li>
					<label class="cts-row flex min-h-11 cursor-pointer items-center gap-3 rounded-md px-1 py-1.5" class:cts-off={!option.inStock}>
						<input
							type="checkbox"
							class="cts-box size-4 shrink-0 accent-primary"
							checked={picked.has(option.id)}
							disabled={!option.inStock}
							onchange={() => togglePick(productId, option)}
						/>
						{#if option.thumbnail}
							<img src={option.thumbnail} alt="" width="32" height="32" loading="lazy" class="size-8 shrink-0 rounded-sm border border-border object-cover" />
						{/if}
						<span class="min-w-0 flex-1 text-sm text-foreground">
							<span class="line-clamp-2">Add {option.title}{option.variantTitle ? ` · ${option.variantTitle}` : ''}</span>
							{#if !option.inStock}<span class="block text-xs text-muted-foreground">Out of stock</span>{/if}
						</span>
						<span class="shrink-0 text-right text-sm tabular-nums">
							{#if option.hasOffer}
								<s class="mr-1 text-xs text-muted-foreground">{formatPrice(option.regularPrice, currencyCode)}</s>
							{/if}
							<span class="font-semibold text-foreground">+{formatPrice(option.price, currencyCode)}</span>
						</span>
					</label>
				</li>
			{/each}
		</ul>
	</fieldset>
{/if}

<style>
	.cts-row {
		transition: background-color var(--motion-fast, 150ms) ease;
	}
	.cts-row:hover {
		background: hsl(var(--muted) / 0.6);
	}
	.cts-row:has(.cts-box:focus-visible) {
		outline: 2px solid hsl(var(--ring));
		outline-offset: 1px;
	}
	.cts-box {
		transition: transform var(--motion-fast, 150ms) ease;
	}
	.cts-box:active {
		transform: scale(0.9);
	}
	.cts-off {
		cursor: not-allowed;
		opacity: 0.6;
	}
	@media (prefers-reduced-motion: reduce) {
		.cts-box:active {
			transform: none;
		}
	}
</style>
