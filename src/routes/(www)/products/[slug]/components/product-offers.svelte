<script lang="ts">
	import { page } from '$app/state'
	import { BadgePercent, Check, Copy } from '@lucide/svelte'
	import { Button } from '$lib/components/ui/button'
	import { formatPrice } from '$lib/utils/price'
	import { offerMinimum, offerValue, type BagOffer } from '$lib/product/upsells'

	/**
	 * The store's coupon codes beside the delivery check (Bewakoof study, 2026-11-25), each with a
	 * Copy button for the bag's code box. Read with the product (+page.ts); a store with no listed
	 * codes, or with discount codes switched off, shows nothing. What a code takes off and its
	 * minimum are the store's own figures; no "as low as" price is worked out here.
	 */
	const SHOWN = 3
	const offers = $derived<BagOffer[]>(page.data?.store?.plugins?.isDiscountCoupons?.active === false ? [] : (page.data?.offers ?? []))
	const money = (n: number) => formatPrice(n, page.data?.store?.currency?.code)
	let expanded = $state(false)
	const visible = $derived(expanded ? offers : offers.slice(0, SHOWN))

	let copied = $state('')
	let timer: ReturnType<typeof setTimeout> | undefined
	$effect(() => () => clearTimeout(timer))

	async function copy(code: string) {
		try {
			await navigator.clipboard.writeText(code)
		} catch {
			return
		}
		copied = code
		clearTimeout(timer)
		timer = setTimeout(() => (copied = ''), 2000)
	}
</script>

{#if offers.length}
	<section class="flex flex-col gap-2 border-t pt-3" aria-labelledby="pdp-offers-title" data-testid="pdp-offers">
		<h2 id="pdp-offers-title" class="flex items-center gap-2 text-sm text-foreground">
			<BadgePercent class="size-4 text-muted-foreground" aria-hidden="true" />
			Offers
		</h2>
		<ul class="flex flex-col divide-y divide-border rounded-radius border border-border">
			{#each visible as offer (offer.code)}
				<li class="flex items-center gap-3 py-1.5 pl-3 pr-1">
					<div class="min-w-0 flex-1">
						<p class="flex flex-wrap items-center gap-x-2 gap-y-0.5">
							<span class="font-mono rounded-sm border border-dashed border-primary px-1.5 py-0.5 text-xs font-semibold text-foreground"
								>{offer.code}</span
							>
							<span class="text-sm font-medium text-foreground">{offerValue(offer, money)}</span>
						</p>
						{#if offerMinimum(offer, money)}
							<p class="mt-0.5 text-xs text-muted-foreground">{offerMinimum(offer, money)}</p>
						{/if}
					</div>
					<Button
						variant="ghost"
						class="pdp-copy h-11 shrink-0 gap-1.5 px-3 text-sm font-semibold md:h-9"
						aria-label={copied === offer.code ? `Copied ${offer.code}` : `Copy code ${offer.code}`}
						onclick={() => copy(offer.code)}
					>
						{#key copied === offer.code}
							<span class="pdp-copy__face inline-flex items-center gap-1.5 {copied === offer.code ? 'text-success' : ''}">
								{#if copied === offer.code}
									<Check class="size-4" aria-hidden="true" />
									Copied
								{:else}
									<Copy class="size-4" aria-hidden="true" />
									Copy
								{/if}
							</span>
						{/key}
					</Button>
				</li>
			{/each}
		</ul>
		{#if offers.length > SHOWN}
			<Button variant="link" class="h-auto self-start p-0 text-xs font-semibold" aria-expanded={expanded} onclick={() => (expanded = !expanded)}>
				{expanded ? 'Show fewer offers' : `Show all offers (${offers.length})`}
			</Button>
		{/if}
		<p class="sr-only" aria-live="polite">{copied ? `Copied ${copied}` : ''}</p>
	</section>
{/if}

<style>
	:global(.pdp-copy) {
		transition: transform var(--motion-fast, 150ms) ease;
	}
	:global(.pdp-copy:active) {
		transform: scale(0.96);
	}
	.pdp-copy__face {
		animation: pdp-copy-in var(--motion-fast, 150ms) ease-out;
	}
	@keyframes pdp-copy-in {
		from {
			opacity: 0;
			transform: scale(0.85);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		:global(.pdp-copy:active) {
			transform: none;
		}
		.pdp-copy__face {
			animation-name: pdp-copy-fade;
		}
		@keyframes pdp-copy-fade {
			from {
				opacity: 0;
			}
		}
	}
</style>
