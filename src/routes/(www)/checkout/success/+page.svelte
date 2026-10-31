<script lang="ts">
	import { Button } from '$lib/components/ui/button'
	import { formatPrice } from '$lib/utils/price'
	import { CheckCircle2, MapPin, Package, Truck, ArrowRight, ShoppingBag, Mail, Calendar, SearchX } from '@lucide/svelte'
	import LazyImg from '$lib/core/components/image/lazy-img.svelte'
	import { linePicture } from '$lib/customizer/line'
	import { getUserState, getCartState } from '$lib/core/stores/index.js'
	import { onMount } from 'svelte'
	import { page } from '$app/state'
	import { fly } from '$lib/motion'
	import CheckoutHeader from '$lib/components/checkout/checkout-header.svelte'
	import { trackOrderPlaced } from '$lib/purchase-tracking'
	import { orderService } from '$lib/core/services/index.js'
	import { Skeleton } from '$lib/components/ui/skeleton/index.js'
	import GoogleSurvey from '$lib/components/google/google-survey.svelte'

	const userState = getUserState()
	const cartState = getCartState()

	let { data } = $props()

	// Some backends can only answer this lookup in the browser that placed the order: the guest order
	// token lives in its localStorage, out of reach of the server load. When the server came back
	// empty, the browser asks again before the page says the details are unavailable.
	let browserOrders = $state<any[]>([])
	let browserLookupDone = $state(false)
	const orders = $derived(data.orders?.data?.length ? data.orders.data : browserOrders)
	const firstOrder = $derived(orders[0])
	const useremail = $derived(firstOrder?.userEmail || firstOrder?.shippingAddress?.email)
	const orderNo = $derived(page.url.searchParams.get('order_no') || firstOrder?.orderNo)

	// Opened with no query parameters at all — a bookmark, a shared link, a back-forward restore —
	// this route used to render the whole confirmation: green tick, "Thank you for your order", a
	// Confirmed-to-Processing timeline and the sentence "Your payment went through", with no order
	// number, no items and no amount behind any of it. The page may only make that claim when the URL
	// carries something identifying an order (UX-291).
	const hasOrderReference = $derived(!!(orderNo || page.url.searchParams.get('cart_id') || firstOrder))

	// Compose the address from the parts that exist, so nothing renders as stray punctuation.
	const recipientName = $derived([firstOrder?.shippingAddress?.firstName, firstOrder?.shippingAddress?.lastName].filter(Boolean).join(' '))
	const localityLine = $derived(
		[[firstOrder?.shippingAddress?.city, firstOrder?.shippingAddress?.state].filter(Boolean).join(', '), firstOrder?.shippingAddress?.zip]
			.filter(Boolean)
			.join(' ')
	)
	const hasShippingAddress = $derived(!!(recipientName || firstOrder?.shippingAddress?.address_1 || localityLine))

	// The confirmation carried per-item prices but no order-level money at all: no subtotal, no
	// shipping, no total and no payment method. A shopper could not check what they had been
	// charged without opening their email.
	const currencyCode = $derived(firstOrder?.currencyCode || page?.data?.store?.currency?.code)
	const orderTotals = $derived(
		[
			{ label: 'Subtotal', value: firstOrder?.subtotal },
			{ label: 'Shipping', value: firstOrder?.shippingCharges },
			{ label: 'Cash on delivery charge', value: firstOrder?.codCharges },
			{ label: 'Discount', value: firstOrder?.discount ? -Math.abs(firstOrder.discount) : 0 }
		].filter((row) => typeof row.value === 'number' && row.value !== 0)
	)

	// Only the order's own estimate. A guessed week was shown here whenever the order had none, a
	// date nobody promised, and it disagreed with the date Google Customer Reviews is given.
	const estimatedDeliveryDateDisplay = $derived.by(() => {
		const days = Number(firstOrder?.shippingRate?.estimatedMaxDays)
		if (!firstOrder || !(days > 0)) return ''
		const date = new Date(firstOrder.createdAt)
		date.setDate(date.getDate() + days)
		return new Intl.DateTimeFormat('en-US', {
			month: 'long',
			day: 'numeric',
			year: 'numeric'
		}).format(date)
	})
	onMount(async () => {
		const cartId = page.url.searchParams.get('cart_id')
		if (!orders.length && (orderNo || cartId)) {
			try {
				browserOrders = (await orderService.listOrdersByParent({ orderNo, cartId }))?.data || []
			} catch (e) {
				console.error('order lookup from the browser failed', e)
			}
		}
		browserLookupDone = true

		// Before the cart refresh, so an error there can't swallow the purchase event
		trackOrderPlaced(orders, currencyCode)

		if (!cartState) return

		const prevCartId = localStorage.getItem('prev_cart_id')
		if (prevCartId) {
			if (typeof cartState.restorePrevCart === 'function') {
				await cartState.restorePrevCart()
			} else if (typeof cartState.resetSingleItemCheckoutSession === 'function') {
				await cartState.resetSingleItemCheckoutSession()
			}
			await cartState.refershCart()
		} else {
			await cartState.refershCart()
			if (!cartState.cart?.lineItems?.length) {
				if (typeof cartState.clear === 'function') {
					await cartState.clear()
				}
			}
		}
	})

	const timelineSteps = [
		{ label: 'Confirmed', icon: CheckCircle2, completed: true, current: false },
		{ label: 'Processing', icon: Package, completed: false, current: true },
		{ label: 'Shipped', icon: Truck, completed: false, current: false }
	]
</script>

<svelte:head>
	<!-- Order number stays out of the title so it cannot leak through referrers or screenshots. -->
	<title>Order confirmed</title>
</svelte:head>

<div class="min-h-screen bg-muted/20 py-12 md:py-5">
	<div class="page-width max-w-3xl">
		{#if hasOrderReference}
			<CheckoutHeader step={4} />
		{/if}
		<div in:fly={{ y: 12 }} class="overflow-hidden rounded-lg border border-border bg-card shadow-z-1">
			{#if hasOrderReference}
				<!-- Header Section -->
				<div class="border-b border-border bg-card p-3 text-center sm:p-8 md:p-12">
					<div class="mb-6 flex justify-center">
						<div class="relative">
							<div class="absolute inset-0 animate-ping rounded-full bg-success/20 opacity-20"></div>
							<div class="relative flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
								<CheckCircle2 class="h-8 w-8 text-success" />
							</div>
						</div>
					</div>
					<h1 class="mb-3 page-heading">Thank you for your order</h1>
					{#if firstOrder}
						<p class="mx-auto max-w-lg text-sm text-muted-foreground">We've received your order and we'll notify you as soon as it's on its way.</p>
					{:else}
						<p class="mx-auto max-w-lg text-sm text-muted-foreground">
							Your payment went through. We're still confirming the order details — they'll appear in your account shortly.
						</p>
					{/if}
					<!-- The reference a shopper quotes to support. It used to appear only when the order
					     failed to load, so a successful confirmation showed no number at all. -->
					{#if orderNo}
						<div
							class="mt-6 inline-flex items-center rounded-full border border-border bg-background px-4 py-1.5 text-sm font-medium text-muted-foreground"
						>
							Order #{orderNo}
						</div>
					{/if}
				</div>

				<!-- Order Progress -->
				<div class="border-b border-border bg-background px-8 py-10 md:px-12">
					<div class="relative flex justify-between">
						<!-- Timeline Line -->
						<div class="absolute left-0 top-5 h-[2px] w-full bg-border">
							<div class="h-full w-1/3 bg-primary"></div>
						</div>

						{#each timelineSteps as step, i}
							<div class="relative z-10 flex flex-col items-center">
								<div
									class="flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors duration-panel
									{step.completed
										? 'border-primary bg-primary text-primary-foreground'
										: step.current
											? 'border-primary bg-card text-primary'
											: 'border-border bg-card text-muted-foreground'}"
								>
									<step.icon class="h-5 w-5" />
								</div>
								<span
									class="mt-3 text-xs font-semibold
									{step.completed || step.current ? 'text-foreground': 'text-muted-foreground'}"
								>
									{step.label}
								</span>
							</div>
						{/each}
					</div>
				</div>
			{:else}
				<!-- No order number, no cart id, no payload: nothing here identifies an order, so the page
				     says so instead of thanking the shopper for one and telling them a payment it knows
				     nothing about went through (UX-291). -->
				<div class="border-b border-border p-6 text-center sm:p-8 md:p-12">
					<div class="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-muted/30">
						<SearchX class="size-7 text-muted-foreground" aria-hidden="true" />
					</div>
					<h1 class="mb-3 page-heading">We can't find that order</h1>
					<p class="mx-auto max-w-lg text-sm leading-relaxed text-muted-foreground">
						This link doesn't carry an order reference, so there's nothing to show. If you have just paid, check your email for the confirmation — it
						carries the order number.
					</p>
					<div class="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
						<Button variant="outline" href="/order-tracking" class="h-11 sm:min-w-48">Track an order</Button>
						{#if userState?.user?.role}
							<Button variant="outline" href="/my/orders" class="h-11 sm:min-w-48">Your orders</Button>
						{/if}
					</div>
				</div>
			{/if}

			<!-- The order lookup can fail after a real payment; never render empty detail blocks. -->
			{#if firstOrder}
				<!-- Items List -->
				<div class="border-b border-muted/30 p-2 pb-6 md:p-12">
					<h2 class="mb-6 text-lg font-bold text-foreground">Order summary</h2>
					<div class="divide-y divide-border">
						{#each orders as { lineItems }}
							{#each lineItems || [] as item}
								{@const picture = linePicture(item)}
								<div class="group flex items-start gap-6 py-6 first:pt-0 last:pb-0">
									<div class="relative flex-shrink-0 overflow-hidden">
										<LazyImg src={picture.src} alt={picture.alt} class="aspect-[3/4] w-16 object-contain sm:w-16" />
									</div>
									<div class="flex flex-1 flex-col">
										<div class="flex justify-between text-base font-semibold text-foreground">
											<h3 class="transition-colors">
												<a href={`/products/${item.slug}`}>
													{item.title}
												</a>
											</h3>
											<p class="ml-4">{formatPrice(item.subtotal, currencyCode)}</p>
										</div>
										<p class="mt-1 text-sm text-muted-foreground">
											{formatPrice(item.price, currencyCode)} × {item.qty}
										</p>
										{#if picture.designed}<p class="mt-0.5 text-xs font-medium text-foreground">Your design</p>{/if}
										{#if item.variantTitle}
											<p class="mt-1 text-xs text-muted-foreground">{item.variantTitle}</p>
										{/if}
									</div>
								</div>
							{/each}
						{/each}
					</div>

					<!-- Order-level money. The page listed per-item prices and then stopped, so a shopper could
					     not check what they had actually been charged, or how, without opening their email. -->
					<div class="mt-6 space-y-2 border-t border-muted/30 pt-6 text-sm">
						{#each orderTotals as row}
							<div class="flex items-center justify-between text-muted-foreground">
								<span>{row.label}</span>
								<span>{formatPrice(row.value, currencyCode)}</span>
							</div>
						{/each}
						{#if typeof firstOrder?.total === 'number'}
							<div class="flex items-center justify-between border-t border-muted/30 pt-2 text-base font-bold text-foreground">
								<span>Total</span>
								<span>{formatPrice(firstOrder.total, currencyCode)}</span>
							</div>
						{/if}
						{#if firstOrder?.paymentMethod}
							<div class="flex items-center justify-between pt-1 text-muted-foreground">
								<span>Paid with</span>
								<span class="capitalize">{String(firstOrder.paymentMethod).replace(/[-_]/g, ' ')}</span>
							</div>
						{/if}
					</div>
				</div>

				<!-- Shipping and Delivery Info -->
				<div class="grid gap-0 border-b border-muted/30 sm:grid-cols-2">
					<!-- Shipping Info -->
					<div class="border-b border-muted/30 p-4 sm:border-b-0 sm:border-r md:p-6">
						<div class="mb-4 flex items-center gap-2 text-base font-bold text-foreground">
							<MapPin class="h-5 w-5 text-primary" />
							<h3>Shipping address</h3>
						</div>
						<!-- Every line is conditional. The city/state/zip line was interpolated unconditionally,
					     so an order whose address the backend does not return rendered as a lone comma
					     under the heading — the shopper's confirmation of where their order is going was
					     a punctuation mark. -->
						<div class="px-2 text-sm leading-relaxed text-muted-foreground">
							{#if hasShippingAddress}
								{#if recipientName}
									<p class="mb-1 font-bold text-foreground">{recipientName}</p>
								{/if}
								{#if firstOrder?.shippingAddress?.address_1}
									<p class="text-foreground">{firstOrder.shippingAddress.address_1}</p>
								{/if}
								{#if firstOrder?.shippingAddress?.address_2}
									<p>{firstOrder.shippingAddress.address_2}</p>
								{/if}
								{#if localityLine}
									<p>{localityLine}</p>
								{/if}
								{#if firstOrder?.shippingAddress?.phone}
									<p class="flex items-center gap-2">{firstOrder.shippingAddress.phone}</p>
								{/if}
							{:else}
								<p>We'll confirm your delivery address by email.</p>
							{/if}
						</div>
					</div>

					<!-- Delivery Status -->
					<div class="p-4 md:p-6">
						{#if estimatedDeliveryDateDisplay}
							<div class="mb-4 flex items-center gap-2 text-base font-bold text-foreground">
								<Calendar class="h-5 w-5 text-primary" />
								<h3>Estimated delivery</h3>
							</div>
							<p class="px-2 text-lg font-bold tracking-tight text-foreground">{estimatedDeliveryDateDisplay}</p>
						{/if}
						<div class="flex items-start gap-3 rounded-radius border border-border bg-card p-2">
							<Mail class="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
							<p class="text-sm leading-relaxed text-foreground">
								{#if useremail}
									Confirmation sent to <span class="font-bold text-foreground">{useremail}</span>. We'll email you again when your items ship.
								{:else}
									We'll email you a confirmation and let you know again when your items ship.
								{/if}
							</p>
						</div>
					</div>
				</div>
			{:else if hasOrderReference && !browserLookupDone}
				<div class="space-y-3 border-b border-muted/30 p-6 md:p-12" aria-busy="true" aria-label="Loading order details">
					<Skeleton class="h-6 w-40" />
					<Skeleton class="h-16 w-full" />
					<Skeleton class="h-16 w-full" />
				</div>
			{:else if hasOrderReference}
				<div class="border-b border-muted/30 p-6 md:p-12">
					<div class="flex items-start gap-3 rounded-radius border border-border bg-card p-4">
						<Package class="mt-0.5 h-5 w-5 shrink-0 text-primary" />
						<div class="text-sm leading-relaxed text-foreground">
							<p class="font-bold text-foreground">Order details aren't available yet</p>
							<p class="mt-1">
								We couldn't load the details for this order right now. Your payment is safe and nothing needs to be paid again.
								{#if orderNo}
									Quote order <span class="font-bold text-foreground">#{orderNo}</span> if you need to get in touch.
								{/if}
							</p>
							<p class="mt-2">
								Check <a href="/my/orders" class="font-semibold text-primary underline-offset-4 hover:underline">your orders</a> in a few minutes, or
								<a href="/contact-us" class="font-semibold text-primary underline-offset-4 hover:underline">contact us</a>.
							</p>
						</div>
					</div>
				</div>
			{/if}

			<!-- Action Buttons -->
			<div class="bg-card p-8 md:p-12">
				<div class="flex flex-col gap-4 sm:flex-row">
					<Button href="/products" class="group order-1 h-14 flex-1 sm:order-2">
						Continue shopping
						<ArrowRight class="ml-2 h-4 w-4" />
					</Button>
					{#if userState?.user?.role}
						<Button variant="outline" href="/my/orders" class="order-2 h-14 flex-1 sm:order-1">Track my order</Button>
					{/if}
				</div>
				<div class="mt-8 text-center">
					<p class="text-sm text-muted-foreground">
						Need help with your order?
						<a href="/contact-us" class="font-semibold text-primary underline-offset-4 hover:underline">Contact us</a>
					</p>
				</div>
			</div>
		</div>
	</div>
</div>

<GoogleSurvey active={!!data?.store?.plugins?.googleReviewsOptIn?.active} orderNo={orderNo || ''} />
