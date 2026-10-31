<script lang="ts">
	import { page } from '$app/state'
	import { Button } from '$lib/components/ui/button'
	import { cartService } from '$lib/core/services'
	import { formatPrice } from '$lib/utils/price'
	import { slide } from '$lib/motion'
	import { autoMarked, offerNote, offerValue, sortOffers, type BagOffer } from '$lib/product/upsells'
	import { BadgePercent } from '@lucide/svelte'
	import { toast } from 'svelte-sonner'

	/**
	 * The bag's offers (GoCommerce D133): the codes the shop chose to show, each with what it takes
	 * off this bag or how much more the bag needs, and APPLY. Three show; the rest behind "Show all
	 * offers". A code the shop did not list never appears, and the code box still takes it.
	 */
	let {
		subtotal = 0,
		applied = '',
		quoted,
		apply
	}: {
		subtotal?: number | null
		applied?: string | null
		/** The automatic code a checkout quote applied, null for none; absent without a quote. */
		quoted?: string | null
		apply: (code: string) => Promise<unknown>
	} = $props()

	const SHOWN = 3
	let offers = $state<BagOffer[]>([])
	let expanded = $state(false)
	let applying = $state('')
	const currencyCode = $derived(page?.data?.store?.currency?.code)
	const money = (n: number) => formatPrice(n, currencyCode)
	const sorted = $derived(sortOffers(offers))
	const visible = $derived(expanded ? sorted : sorted.slice(0, SHOWN))
	const marked = $derived(autoMarked(offers, applied, quoted))

	$effect(() => {
		void subtotal
		const svc = cartService as unknown as { getOffers?: () => Promise<BagOffer[]> }
		if (typeof svc.getOffers !== 'function') return
		let live = true
		svc
			.getOffers()
			.then((rows) => {
				if (live) offers = rows ?? []
			})
			.catch(() => {
				if (live) offers = []
			})
		return () => {
			live = false
		}
	})

	async function use(code: string) {
		applying = code
		try {
			await apply(code)
		} catch (err) {
			toast.error((err as Error)?.message || 'That code could not be applied')
		} finally {
			applying = ''
		}
	}
</script>

{#if sorted.length}
	<section class="rounded-radius border border-border bg-background p-4" aria-labelledby="bag-offers-title" data-testid="cart-offers">
		<h2 id="bag-offers-title" class="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
			<BadgePercent class="size-4 text-primary" aria-hidden="true" />
			Coupons and offers
		</h2>
		<ul class="divide-y divide-border">
			{#each visible as offer (offer.code)}
				<li class="flex items-center gap-3 py-2.5" transition:slide>
					<div class="min-w-0 flex-1">
						<p class="flex flex-wrap items-center gap-2">
							<span class="font-mono rounded-sm border border-dashed border-primary px-2 py-0.5 text-xs font-semibold text-foreground">{offer.code}</span>
							<span class="text-sm font-medium text-foreground">{offerValue(offer, money)}</span>
						</p>
						{#if offerNote(offer, money)}
							<p class="mt-1 text-xs {offer.applies ? 'text-success' : 'text-muted-foreground'}">{offerNote(offer, money)}</p>
						{/if}
					</div>
					{#if applied && applied.toUpperCase() === offer.code.toUpperCase()}
						<span class="text-xs font-semibold text-success">Applied</span>
					{:else if offer.autoApply && !applied}
						<!-- Applying it would make it a typed code, which always wins, even over another
						     automatic code that would save more. -->
						{#if marked === offer.code}
							<span class="text-xs font-semibold text-success">Applied automatically at checkout</span>
						{/if}
					{:else}
						<Button
							variant="outline"
							size="sm"
							class="offer-apply shrink-0"
							disabled={!offer.applies || !!applying}
							aria-label="Apply {offer.code}"
							onclick={() => use(offer.code)}
						>
							{applying === offer.code ? 'Applying…' : 'Apply'}
						</Button>
					{/if}
				</li>
			{/each}
		</ul>
		{#if sorted.length > SHOWN}
			<Button variant="link" class="mt-1 h-auto p-0 text-xs font-semibold" onclick={() => (expanded = !expanded)} aria-expanded={expanded}>
				{expanded ? 'Show fewer offers' : `Show all offers (${sorted.length})`}
			</Button>
		{/if}
	</section>
{/if}

<style>
	:global(.offer-apply) {
		transition: transform var(--motion-fast, 150ms) ease;
	}
	:global(.offer-apply:active:not(:disabled)) {
		transform: scale(0.96);
	}
	@media (prefers-reduced-motion: reduce) {
		:global(.offer-apply:active:not(:disabled)) {
			transform: none;
		}
	}
</style>
