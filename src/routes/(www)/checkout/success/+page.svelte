<script lang="ts">
	import { Button } from '$lib/components/ui/button'
	import { formatPrice } from '$lib/core/utils/index.js'
	import { CheckCircle2, MapPin, Package, Truck, ArrowRight, ShoppingBag, Mail, Calendar } from '@lucide/svelte'
	import LazyImg from '$lib/core/components/image/lazy-img.svelte'
	import { getUserState, getCartState } from '$lib/core/stores/index.js'
	import { onMount } from 'svelte'
	import { page } from '$app/state'
	import { fade, fly } from 'svelte/transition'
	import CheckoutHeader from '$lib/components/checkout/checkout-header.svelte'

	const userState = getUserState()
	const cartState = getCartState()

	let { data } = $props()

	const orders = $derived(data.orders?.data || [])
	const firstOrder = $derived(orders[0])
	const useremail = $derived(firstOrder?.userEmail || firstOrder?.shippingAddress?.email)
	const orderNo = $derived(page.url.searchParams.get('order_no') || firstOrder?.orderNo)

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
			{ label: 'Discount', value: firstOrder?.discount ? -Math.abs(firstOrder.discount) : 0 }
		].filter((row) => typeof row.value === 'number' && row.value !== 0)
	)

	const estimatedDeliveryDateMachine = $derived.by(() => {
		if (!firstOrder) return ''
		const date = new Date(firstOrder.createdAt)
		const days = firstOrder.shippingRate?.estimatedMaxDays || 7
		date.setDate(date.getDate() + days)
		return date.toISOString().split('T')[0]
	})

	const estimatedDeliveryDateDisplay = $derived.by(() => {
		if (!firstOrder) return ''
		const date = new Date(firstOrder.createdAt)
		const days = firstOrder.shippingRate?.estimatedMaxDays || 7
		date.setDate(date.getDate() + days)
		return new Intl.DateTimeFormat('en-US', {
			month: 'long',
			day: 'numeric',
			year: 'numeric'
		}).format(date)
	})
	onMount(async () => {
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
	<title>Order Confirmed</title>
</svelte:head>

<div class="min-h-screen bg-[#fafafa] py-12 md:py-5">
	<div class="container mx-auto max-w-3xl px-4">
		<CheckoutHeader step={4} />
		<div
			in:fly={{ y: 20, duration: 600 }}
			class="overflow-hidden rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05),0_20px_40px_rgba(0,0,0,0.02)]"
		>
			<!-- Header Section -->
			<div class="border-b border-gray-100 bg-white p-3 text-center sm:p-8 md:p-12">
				<div class="mb-6 flex justify-center">
					<div class="relative">
						<div class="absolute inset-0 animate-ping rounded-full bg-green-100 opacity-20"></div>
						<div class="relative flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
							<CheckCircle2 class="h-8 w-8 text-green-600" />
						</div>
					</div>
				</div>
				<h1 class="mb-3 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">Thank you for your order</h1>
				{#if firstOrder}
					<p class="mx-auto max-w-lg text-lg text-sm text-gray-500">We've received your order and we'll notify you as soon as it's on its way.</p>
					<!-- The reference a shopper quotes to support. It used to appear only when the order
					     failed to load, so a successful confirmation showed no number at all. -->
					{#if orderNo}
						<div class="mt-6 inline-flex items-center rounded-full border border-gray-100 bg-gray-50 px-4 py-1.5 text-sm font-medium text-gray-600">
							Order #{orderNo}
						</div>
					{/if}
				{:else}
					<p class="mx-auto max-w-lg text-lg text-sm text-gray-500">
						Your payment went through. We're still confirming the order details — they'll appear in your account shortly.
					</p>
					{#if orderNo}
						<div class="mt-6 inline-flex items-center rounded-full border border-gray-100 bg-gray-50 px-4 py-1.5 text-sm font-medium text-gray-600">
							Order #{orderNo}
						</div>
					{/if}
				{/if}
			</div>

			<!-- Order Progress -->
			<div class="bg-gray-50/50 px-8 py-10 md:px-12">
				<div class="relative flex justify-between">
					<!-- Timeline Line -->
					<div class="absolute left-0 top-5 h-[2px] w-full bg-gray-200">
						<div class="h-full w-1/3 bg-primary transition-all duration-1000"></div>
					</div>

					{#each timelineSteps as step, i}
						<div class="relative z-10 flex flex-col items-center">
							<div
								class="flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors duration-500
								{step.completed
									? 'border-primary bg-primary text-white'
									: step.current
										? 'border-primary bg-white text-primary'
										: 'border-gray-200 bg-white text-gray-400'}"
							>
								<step.icon class="h-5 w-5" />
							</div>
							<span
								class="mt-3 text-xs font-semibold uppercase tracking-wider
								{step.completed || step.current ? 'text-gray-900' : 'text-gray-400'}"
							>
								{step.label}
							</span>
						</div>
					{/each}
				</div>
			</div>

			<!-- The order lookup can fail after a real payment; never render empty detail blocks. -->
			{#if firstOrder}
				<!-- Items List -->
				<div class="border-b border-muted/30 p-2 pb-6 md:p-12">
					<h2 class="mb-6 text-lg font-bold text-gray-900">Order Summary</h2>
					<div class="divide-y divide-gray-100">
						{#each orders as { lineItems }}
							{#each lineItems || [] as item}
								<div class="group flex items-start gap-6 py-6 first:pt-0 last:pb-0">
									<div class="relative flex-shrink-0 overflow-hidden transition-all duration-300">
										<LazyImg src={item.thumbnail || '/placeholder.svg'} alt={item.title} class="aspect-[3/4] w-16 object-contain sm:w-16" />
									</div>
									<div class="flex flex-1 flex-col transition-all duration-300">
										<div class="flex justify-between text-base font-semibold text-gray-900">
											<h3 class="transition-colors">
												<a href={`/products/${item.slug}`}>
													{item.title}
												</a>
											</h3>
											<p class="ml-4">{formatPrice(item.subtotal, page?.data?.store?.currency?.code)}</p>
										</div>
										<p class="mt-1 text-sm text-gray-500">
											{formatPrice(item.price, page?.data?.store?.currency?.code)} × {item.qty}
										</p>
										{#if item.variantTitle}
											<p class="mt-1 text-xs text-gray-400">{item.variantTitle}</p>
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
						<div class="mb-4 flex items-center gap-2 text-base font-bold text-gray-900">
							<MapPin class="h-5 w-5 text-primary" />
							<h3>Shipping Address</h3>
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
						<div class="mb-4 flex items-center gap-2 text-base font-bold text-gray-900">
							<Calendar class="h-5 w-5 text-primary" />
							<h3>Estimated Delivery</h3>
						</div>
						<p class="px-2 text-lg font-bold tracking-tight text-gray-900">{estimatedDeliveryDateDisplay}</p>
						<div class="flex items-start gap-3 rounded-xl border border-gray-100 bg-white p-2">
							<Mail class="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
							<p class="text-sm leading-relaxed text-gray-700">
								{#if useremail}
									Confirmation sent to <span class="font-bold text-gray-700">{useremail}</span>. We'll email you again when your items ship.
								{:else}
									We'll email you a confirmation and let you know again when your items ship.
								{/if}
							</p>
						</div>
					</div>
				</div>
			{:else}
				<div class="border-b border-muted/30 p-6 md:p-12">
					<div class="flex items-start gap-3 rounded-xl border border-gray-100 bg-white p-4">
						<Package class="mt-0.5 h-5 w-5 shrink-0 text-primary" />
						<div class="text-sm leading-relaxed text-gray-700">
							<p class="font-bold text-gray-900">Order details aren't available yet</p>
							<p class="mt-1">
								We couldn't load the details for this order right now. Your payment is safe and nothing needs to be paid again.
								{#if orderNo}
									Quote order <span class="font-bold text-gray-900">#{orderNo}</span> if you need to get in touch.
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
			<div class="bg-white p-8 md:p-12">
				<div class="flex flex-col gap-4 sm:flex-row">
					<Button href="/products" class="group order-1 h-14 flex-1 sm:order-2">
						Continue Shopping
						<ArrowRight class="ml-2 h-4 w-4" />
					</Button>
					{#if userState?.user?.role}
						<Button variant="outline" href="/my/orders" class="order-2 h-14 flex-1 sm:order-1">Track My Order</Button>
					{/if}
				</div>
				<div class="mt-8 text-center">
					<p class="text-sm text-gray-500">
						Need help with your order?
						<a href="/contact-us" class="font-semibold text-primary underline-offset-4 hover:underline">Contact us</a>
					</p>
				</div>
			</div>
		</div>
	</div>
</div>

{#if data?.store?.plugins?.googleReviewsOptIn?.active && firstOrder}
	<!-- The `<\/script>` escapes are load-bearing: Vite's dep scanner extracts <script>…</script> by
	regex across the whole file, so an unescaped closing tag in here makes it parse this markup as JS
	and fail with `Expected "}" but found "{"` on the ${…} interpolations. -->
	{@html `<script src="https://apis.google.com/js/platform.js?onload=renderOptIn" async defer><\/script>
  <script>
    window.renderOptIn = function() {
      window.gapi.load('surveyoptin', function() {
        window.gapi.surveyoptin.render(
          {
            // REQUIRED FIELDS
            "merchant_id": ${data?.store?.plugins?.googleReviewsOptIn?.merchantId},
            "order_id": "${orderNo}",
            "email": "${cartState?.cart?.email}",
            "delivery_country": "${firstOrder?.shippingAddress?.countryCode}",
            "estimated_delivery_date": "${estimatedDeliveryDateMachine}",

            // OPTIONAL FIELDS
          });
      });
    }
  <\/script>`}
{/if}

<style>
	:global(body) {
		background-color: #fafafa;
	}
</style>
