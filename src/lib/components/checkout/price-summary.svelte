<script lang="ts">
	import { cn } from '$lib/core/utils'
	import { formatPrice, totalLabel, type PaymentFee, type QuotedCoupon } from '$lib/utils/price'
	import { Skeleton } from '$lib/components/ui/skeleton/index.js'
	import { Button } from '$lib/components/ui/button'
	import { fade, slide } from '$lib/motion'

	/**
	 * The one money block for cart, checkout and order confirmation. The same five rows were
	 * hand-written four times over — cart, address, payment, review — and drifted: only review
	 * names the coupon on the discount row, only the cart and address steps admit that shipping
	 * is unknown, and none of them shows tax (UX-088, UX-284).
	 *
	 * It takes figures, never a cart: the confirmation screen has an order, not a cart, and a
	 * component that reached for a store could not serve it.
	 *
	 * `shippingResolved` is the whole reason the label moves. Until a shipping address exists the
	 * shipping cost is unknown, so the bottom line is an estimate and says so; calling it "Total"
	 * one row under "Address required" is the defect this closes.
	 */
	let {
		subtotal = 0,
		mrpSaving = 0,
		discount = 0,
		discountLabel = 'Discount',
		shipping = 0,
		fee = null,
		tax = 0,
		total = 0,
		currencyCode = '',
		shippingResolved = false,
		taxPending = false,
		unresolvedShippingText = 'Address required',
		estimatedNote = 'Shipping is added once we have your address.',
		loading = false,
		coupon = null,
		pending = false,
		error = '',
		onretry,
		class: className = ''
	}: {
		subtotal?: number | null
		/** What the lines save on their MRP (compare-at). Above zero, the MRP and its discount get rows of their own. */
		mrpSaving?: number | null
		discount?: number | null
		/** Review names the code, e.g. `Discount (SAVE10)`; the other steps just say Discount. */
		discountLabel?: string
		shipping?: number | null
		fee?: PaymentFee | null
		tax?: number | null
		total?: number | null
		currencyCode?: string
		/** False until a shipping address is on the cart. Drives both the shipping row and the total label. */
		shippingResolved?: boolean
		taxPending?: boolean
		unresolvedShippingText?: string
		estimatedNote?: string
		loading?: boolean
		/** The code a checkout quote applies. Its row shows even at no saving, when the code frees delivery. */
		coupon?: QuotedCoupon | null
		/** A new total is being worked out; the figures on screen are the last one's. */
		pending?: boolean
		/** Checkout's reason it would refuse the order now. While set, no figure is shown. */
		error?: string
		onretry?: () => void
		class?: string
	} = $props()

	const money = (value?: number | null) => formatPrice(Number(value) || 0, currencyCode)

	let requoted = $state(false)
	$effect(() => {
		if (pending) requoted = true
	})
	const figure = $derived(pending ? 'opacity-60 transition-opacity delay-150 duration-fast' : requoted ? 'transition-opacity duration-fast' : '')

	const hasDiscount = $derived(Number(discount) > 0)
	const hasMrpSaving = $derived(Number(mrpSaving) > 0)
	const hasTax = $derived(Number(tax) > 0)
	const isFreeShipping = $derived(shippingResolved && !Number(shipping))
	const label = $derived(totalLabel(shippingResolved, taxPending))
</script>

<div class={cn('space-y-4', className)} aria-busy={loading || pending}>
	{#if loading}
		<!-- Skeletons in the shape of the rows they replace, so the card does not resize when the
		     figures arrive. -->
		<div class="space-y-3 border-b border-border pb-6">
			{#each ['Subtotal', 'Shipping'] as row (row)}
				<div class="flex items-center justify-between gap-4">
					<Skeleton class="h-4 w-20" />
					<Skeleton class="h-4 w-16" />
				</div>
			{/each}
		</div>
		<div class="flex items-center justify-between gap-4 pt-2">
			<Skeleton class="h-5 w-24" />
			<Skeleton class="h-6 w-24" />
		</div>
		<span class="sr-only">Loading order totals</span>
	{:else if error}
		<div role="alert" class="rounded-radius border border-destructive/40 bg-destructive/5 p-3 text-sm font-medium text-destructive" in:fade>
			<p>{error}</p>
			{#if onretry}
				<Button variant="outline" size="sm" class="mt-3" disabled={pending} onclick={onretry}>{pending ? 'Trying again…' : 'Try again'}</Button>
			{/if}
		</div>
	{:else}
		<dl class="space-y-3 border-b border-border pb-6">
			{#if hasMrpSaving}
				<!-- The breakup a shopper in India expects: what the items list at, what comes off that,
				     then what they cost. Only when the store set compare-at prices above the price. -->
				<div class="flex items-center justify-between gap-4 text-sm">
					<dt class="font-medium text-muted-foreground">Total MRP</dt>
					<dd class={['font-bold text-foreground', figure]}>{money(Number(subtotal) + Number(mrpSaving))}</dd>
				</div>
				<div class="flex items-center justify-between gap-4 text-sm">
					<dt class="font-medium text-muted-foreground">Discount on MRP</dt>
					<dd class={['font-bold text-success', figure]}>-{money(mrpSaving)}</dd>
				</div>
			{/if}
			<div class="flex items-center justify-between gap-4 text-sm">
				<dt class="font-medium text-muted-foreground">Subtotal</dt>
				<dd class={['font-bold text-foreground', figure]}>{money(subtotal)}</dd>
			</div>

			{#if coupon}
				<div class="flex items-center justify-between gap-4 text-sm" transition:slide>
					<dt class="font-medium text-muted-foreground">
						Discount ({coupon.code})
						{#if coupon.autoApplied}
							<span class="block text-[length:var(--type-dense,0.8125rem)]">Applied automatically</span>
						{/if}
					</dt>
					<dd class={['font-bold text-success', figure]}>
						{#if !Number(discount) && coupon.freeShipping}Free delivery{:else}-{money(discount)}{/if}
					</dd>
				</div>
			{:else if hasDiscount}
				<div class="flex items-center justify-between gap-4 text-sm">
					<dt class="font-medium text-muted-foreground">{discountLabel}</dt>
					<!-- A saving reads as success, not as the raw orange it used to carry. -->
					<dd class={['font-bold text-success', figure]}>-{money(discount)}</dd>
				</div>
			{/if}

			<div class="flex items-center justify-between gap-4 text-sm">
				<dt class="font-medium text-muted-foreground">Shipping</dt>
				<dd class={['font-bold text-foreground', figure]}>
					{#if !shippingResolved}
						<span class="font-medium text-muted-foreground">{unresolvedShippingText}</span>
					{:else if isFreeShipping}
						<span class="rounded-radius bg-success/5 px-2 py-0.5 text-xs font-bold text-success ring-1 ring-inset ring-success/30"> Free </span>
					{:else}
						{money(shipping)}
					{/if}
				</dd>
			</div>

			{#if fee}
				<div class="flex items-center justify-between gap-4 text-sm" transition:slide>
					<dt class="font-medium text-muted-foreground">{fee.label}</dt>
					<dd class={['font-bold text-foreground', figure]}>{money(fee.amount)}</dd>
				</div>
			{/if}

			<!-- Only when the store actually charges it; a permanent "Tax $0.00" row is noise. -->
			{#if hasTax}
				<div class="flex items-center justify-between gap-4 text-sm">
					<dt class="font-medium text-muted-foreground">Tax</dt>
					<dd class={['font-bold text-foreground', figure]}>{money(tax)}</dd>
				</div>
			{/if}
		</dl>

		<dl class="pt-2">
			<div class="flex items-start justify-between gap-4">
				<dt class="flex flex-col gap-1">
					<span class="text-sm font-bold text-foreground">{label}</span>
					{#if !shippingResolved}
						<span class="text-xs font-normal text-muted-foreground">{estimatedNote}</span>
					{/if}
					{#if taxPending}
						<span class="text-xs font-normal text-muted-foreground">Any tax is added when you place your order.</span>
					{/if}
				</dt>
				<dd class={['shrink-0 text-xl font-bold text-foreground', figure]}>{money(total)}</dd>
			</div>
		</dl>
	{/if}
</div>
