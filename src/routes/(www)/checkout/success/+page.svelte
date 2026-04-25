<script lang="ts">
	import { Button } from '$lib/components/ui/button'
	import { formatPrice } from '$lib/core/utils/index.js'
	import { CheckCircle2, MapPin, Package, Truck, ArrowRight, ShoppingBag, Mail, Calendar } from '@lucide/svelte'
	import LazyImg from '$lib/core/components/image/lazy-img.svelte'
	import { getUserState, getCartState } from '$lib/core/stores/index.js'
	import { onMount } from 'svelte'
	import { page } from '$app/state'
	import { fade, fly } from 'svelte/transition'

	const userState = getUserState()
	const cartState = getCartState()

	let { data } = $props()

	const orders = $derived(data.orders?.data || [])
	const firstOrder = $derived(orders[0])
	const useremail = $derived(firstOrder?.userEmail || firstOrder?.shippingAddress?.email)
	const orderNo = $derived(page.url.searchParams.get('order_no') || firstOrder?.orderNo)

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
		cartState.resetPreviousCartIdFromLocalStorage()
		await cartState.refershCart()
	})

	const timelineSteps = [
		{ label: 'Confirmed', icon: CheckCircle2, completed: true, current: false },
		{ label: 'Processing', icon: Package, completed: false, current: true },
		{ label: 'Shipped', icon: Truck, completed: false, current: false }
	]
</script>

<svelte:head>
	<title>Success | Order #{orderNo || ''}</title>
</svelte:head>

<div class="min-h-screen bg-[#fafafa] py-12 md:py-20">
	<div class="container mx-auto max-w-3xl px-4">
		<div
			in:fly={{ y: 20, duration: 600 }}
			class="overflow-hidden rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05),0_20px_40px_rgba(0,0,0,0.02)]"
		>
			<!-- Header Section -->
			<div class="border-b border-gray-100 bg-white p-8 text-center md:p-12">
				<div class="mb-6 flex justify-center">
					<div class="relative">
						<div class="absolute inset-0 animate-ping rounded-full bg-green-100 opacity-20"></div>
						<div class="relative flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
							<CheckCircle2 class="h-8 w-8 text-green-600" />
						</div>
					</div>
				</div>
				<h1 class="mb-3 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">Thank you for your order</h1>
				<p class="mx-auto max-w-md text-lg text-gray-500">We've received your order and we'll notify you as soon as it's on its way.</p>

				{#if orderNo}
					<div class="mt-6 inline-flex items-center rounded-full border border-gray-100 bg-gray-50 px-4 py-1.5 text-sm font-medium text-gray-600">
						Order #{orderNo}
					</div>
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

			<!-- Items List -->
			<div class="border-b border-gray-100 p-8 md:p-12">
				<h2 class="mb-6 text-lg font-bold text-gray-900">Order Summary</h2>
				<div class="divide-y divide-gray-100">
					{#each orders as { lineItems }}
						{#each lineItems as item}
							<div class="flex items-center gap-6 py-6 first:pt-0 last:pb-0">
								<div class="relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
									<LazyImg src={item.thumbnail} alt={item.title} class="h-full w-full object-cover" />
								</div>
								<div class="flex flex-1 flex-col">
									<div class="flex justify-between text-base font-semibold text-gray-900">
										<h3 class="transition-colors hover:text-primary">
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
			</div>

			<!-- Shipping and Delivery Info -->
			<div class="grid gap-0 border-b border-gray-100 sm:grid-cols-2">
				<!-- Shipping Info -->
				<div class="border-b border-gray-100 p-8 sm:border-b-0 sm:border-r md:p-12">
					<div class="mb-4 flex items-center gap-2 font-bold text-gray-900">
						<MapPin class="h-5 w-5 text-primary" />
						<h3>Shipping Address</h3>
					</div>
					<div class="text-sm leading-relaxed text-gray-600">
						<p class="mb-1 font-bold text-gray-900">
							{firstOrder?.shippingAddress?.firstName}
							{firstOrder?.shippingAddress?.lastName}
						</p>
						<p>{firstOrder?.shippingAddress?.address_1}</p>
						{#if firstOrder?.shippingAddress?.address_2}
							<p>{firstOrder?.shippingAddress?.address_2}</p>
						{/if}
						<p>{firstOrder?.shippingAddress?.city}, {firstOrder?.shippingAddress?.state} {firstOrder?.shippingAddress?.zip}</p>
						<p class="mt-2 flex items-center gap-2">
							<span class="inline-block h-1 w-1 rounded-full bg-gray-300"></span>
							{firstOrder?.shippingAddress?.phone}
						</p>
					</div>
				</div>

				<!-- Delivery Status -->
				<div class="bg-gray-50/30 p-8 md:p-12">
					<div class="mb-4 flex items-center gap-2 font-bold text-gray-900">
						<Calendar class="h-5 w-5 text-primary" />
						<h3>Estimated Delivery</h3>
					</div>
					<p class="text-2xl font-bold tracking-tight text-gray-900">{estimatedDeliveryDateDisplay}</p>
					<div class="mt-4 flex items-start gap-3 rounded-xl border border-gray-100 bg-white p-4">
						<Mail class="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
						<p class="text-xs leading-relaxed text-gray-500">
							Confirmation sent to <span class="font-bold text-gray-700">{useremail}</span>. We'll email you again when your items ship.
						</p>
					</div>
				</div>
			</div>

			<!-- Action Buttons -->
			<div class="bg-white p-8 md:p-12">
				<div class="flex flex-col gap-4 sm:flex-row">
					<Button href="/products" class="order-1 h-14 flex-1 text-base font-semibold sm:order-2">
						Continue Shopping
						<ArrowRight class="ml-2 h-4 w-4" />
					</Button>
					{#if userState?.user?.role}
						<Button variant="outline" href="/my/orders" class="order-2 h-14 flex-1 text-base font-semibold sm:order-1">Track My Order</Button>
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

{#if data?.store?.plugins?.googleReviewsOptIn?.active}
	{@html `<script src="https://apis.google.com/js/platform.js?onload=renderOptIn" async defer></script>
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
  </script>`}
{/if}

<style>
	:global(body) {
		background-color: #fafafa;
	}
</style>
