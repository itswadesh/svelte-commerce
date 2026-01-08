<script lang="ts">
	import { Button } from '$lib/components/ui/button'
	import { formatPrice } from '$lib/core/utils/index.js'
	import { CheckCircle2, MapPin, Package, Truck } from 'lucide-svelte'
	import LazyImg from '$lib/core/components/image/lazy-img.svelte'
	import { getUserState } from '$lib/core/stores/auth.svelte.js'
	import { getCartState } from '$lib/core/stores/cart.svelte.js'
	import { onMount } from 'svelte'
	import { page } from '$app/state'
	const userState = getUserState()

	let checkoutErr = null
	let { data } = $props()
	const useremail = data.orders.data?.length && data.orders.data[0]?.userEmail
	const cartState = getCartState()
	const orderNo = $derived(page.url.searchParams.get('order_no'))
	const estimatedDeliveryDate = $derived.by(() => {
		const today = new Date(data.orders?.data[0]?.createdAt)
		today.setDate(today.getDate() + data.orders?.data[0]?.shippingRate?.estimatedMaxDays || 7)
		return today.toISOString().split('T')[0]
	})

	onMount(async () => {
    cartState.resetPreviousCartIdFromLocalStorage()
		await cartState.refershCart()
	})
</script>

<svelte:head>
	<title>Order Placed Successfully</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 py-12">
	<div class="container mx-auto max-w-3xl px-4">
		<div class="rounded-lg bg-white p-6 shadow-lg md:p-8">
			<!-- Success Header -->
			<div class="mb-8 text-center">
				<div class="mb-4 flex justify-center">
					<div class="rounded-full bg-green-100 p-3">
						<CheckCircle2 class="h-12 w-12 text-green-500" />
					</div>
				</div>
				<h1 class="mb-2 text-2xl font-bold text-gray-900 md:text-3xl">Thank You for Your Order!</h1>
				<p class="text-gray-600">Your order has been placed successfully</p>
			</div>

			<!-- Order Timeline -->
			<div class="mb-8">
				<div class="relative flex justify-between">
					<div class="flex flex-col items-center">
						<div class="z-10 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
							<CheckCircle2 class="h-5 w-5" />
						</div>
						<p class="mt-2 text-sm font-medium text-gray-600">Order Placed</p>
					</div>
					<div class="absolute left-0 top-5 z-0 h-0.5 w-full bg-gray-200">
						<div class="h-full w-1/3 bg-primary"></div>
					</div>
					<div class="flex flex-col items-center">
						<div class="z-10 flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
							<Package class="h-5 w-5 text-gray-400" />
						</div>
						<p class="mt-2 text-sm font-medium text-gray-400">Processing</p>
					</div>
					<div class="flex flex-col items-center">
						<div class="z-10 flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
							<Truck class="h-5 w-5 text-gray-400" />
						</div>
						<p class="mt-2 text-sm font-medium text-gray-400">Shipped</p>
					</div>
				</div>
			</div>

			<!-- Order Details -->
			<div class="mb-8 rounded-lg border border-gray-200 bg-gray-50 p-6">
				<h2 class="mb-4 text-lg font-semibold text-gray-900">Order Details</h2>
				<div class="space-y-4">
					{#each data.orders.data as { lineItems }}
						{#each lineItems as { id, thumbnail, title, handle, qty, price, variantId, subtotal, slug }}
							<div class="flex items-start gap-4 rounded-lg bg-white p-4">
								<a href={`/products/${slug}?variant_id=${variantId || ''}`} class="shrink-0">
									<LazyImg src={thumbnail} alt={title} class="h-20 w-16 rounded-lg border border-gray-200 object-cover" />
								</a>
								<div class="flex-1 space-y-1">
									<a href="/products/{slug}" class="hover:text-primary">
										<h3 class="font-medium text-gray-900">{title}</h3>
									</a>
									<div class="flex items-center justify-between">
										<p class="text-sm text-gray-500">
										  {formatPrice(price, page?.data?.store?.currency?.code)} x {qty}
										</p>
										<p class="font-medium text-gray-900">
											{formatPrice(subtotal, page?.data?.store?.currency?.code)}
										</p>
									</div>
								</div>
							</div>
						{/each}
					{/each}
				</div>
			</div>

			<div class="mb-8 rounded-lg border border-gray-200 p-4">
				<h3 class="mb-3 font-medium text-gray-900">Delivery Address</h3>
				<div class="mb-2 flex items-center">
					<h3 class="text-lg font-medium">
						{data?.orders?.data?.[0]?.shippingAddress?.firstName}
						{data?.orders?.data?.[0]?.shippingAddress?.lastName}
					</h3>
				</div>
				<div class="flex text-gray-600">
					<MapPin class="mr-2 h-5 w-5 text-primary" />
					{data?.orders?.data?.[0]?.shippingAddress?.address_1}
				</div>
				{#if data?.orders?.data?.shippingAddress?.address_2}
					<p class="text-gray-600">
						{data?.orders?.data?.[0]?.shippingAddress?.address_2}
					</p>
				{/if}
				<p class="text-gray-600">
					{data?.orders?.data?.[0]?.shippingAddress?.city}, {data?.orders?.data?.[0]?.shippingAddress?.state}
					{data?.orders?.data?.[0]?.shippingAddress?.zip}
				</p>
				<p class="mt-2 text-gray-600">
					{data?.orders?.data?.[0]?.shippingAddress?.phone}
				</p>
				<p class="mt-2 text-gray-600">
					{data?.orders?.data?.[0]?.userEmail || data?.orders?.data?.[0]?.shippingAddress?.email}
				</p>
			</div>

			<!-- Order Info -->
			<div class="mb-8 grid gap-6 md:grid-cols-2">
				<div class="rounded-lg border border-gray-200 p-4">
					<h3 class="mb-3 font-medium text-gray-900">Delivery Updates</h3>
					<p class="text-sm text-gray-600">
						We'll send you shipping confirmation when your items are on the way! We appreciate your business, and hope you enjoy your purchase.
					</p>
				</div>
				<div class="rounded-lg border border-gray-200 p-4">
					<h3 class="mb-3 font-medium text-gray-900">Order Updates</h3>
					<p class="text-sm text-gray-600">
            Estimated Delivery Date: <span class="font-bold">{estimatedDeliveryDate}</span> <br>
						You'll receive an email confirmation shortly at <span class="font-medium text-gray-900">
							{useremail}
						</span>
					</p>
				</div>
			</div>

			<!-- Actions -->
			<div class="flex flex-col gap-4 sm:flex-row">
				<Button href="/products" class="flex-1 py-6">Continue Shopping</Button>
				{#if userState?.user?.role}
					<Button variant="outline" href="/my/orders" class="flex-1 py-6">View Order Status</Button>
				{/if}
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
            "delivery_country": "${data?.orders?.data?.[0]?.shippingAddress?.countryCode}",
            "estimated_delivery_date": "${estimatedDeliveryDate}",

            // OPTIONAL FIELDS
          });
      });
    }
  </script>`}
{/if}
