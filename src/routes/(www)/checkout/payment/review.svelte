<script lang="ts">
	import { Button } from '$lib/components/ui/button'
	import { ChevronLeft, CreditCard, LockKeyhole, Mail, MapPin, Pencil, Truck } from '@lucide/svelte'
	import { formatPrice } from '$lib/core/utils'
	import { page } from '$app/state'
	import OrderTrustBadges from '$lib/core/components/plugins/order-trust-badges.svelte'
	import CheckoutHeader from '$lib/components/checkout/checkout-header.svelte'
	import CheckoutButton from '$lib/components/buttons/checkout-button.svelte'
	import { appendOneTimeCartId } from '$lib/core/utils/index.js'

	const { paymentModule, onsubmit, onback } = $props()

	const cartState = paymentModule.cartState

	const selectedItems = $derived(cartState.cart?.lineItems?.filter((i: any) => i.isSelectedForCheckout) || [])
	const selectedPaymentMethod = $derived(paymentModule.listOfPaymentMethods?.find((m: any) => m.code === paymentModule.SELECTED_PG_CODE))
	const selectedShippingRate = $derived(paymentModule.shippingRates?.data?.find((r: any) => r.id === cartState.cart?.shippingRateId))
	const currencyCode = $derived(page?.data?.store?.currency?.code)
</script>

<svelte:head>
	<title>Checkout - Review Order</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="min-h-screen py-8">
	<div class="container mx-auto px-4">
		<CheckoutHeader step={3} />

		<div class="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
			<h1 class="text-xl font-bold uppercase text-gray-900" style="font-family: var(--font-body);">Review Your Order</h1>
			<Button variant="outline" onclick={onback} class="group flex w-fit items-center gap-2">
				<ChevronLeft class="size-4 transition-transform duration-300 group-hover:-translate-x-1" /> Back to Payment
			</Button>
		</div>

		<div class="grid gap-8 lg:grid-cols-[1fr_400px]">
			<!-- Left Column -->
			<div class="flex flex-col gap-4">
				<!-- Items -->
				<div class="rounded-lg border border-border bg-background p-6 shadow-sm">
					<div class="flex items-center justify-between border-b border-border pb-3">
						<h2 class="text-base font-bold uppercase text-gray-900" style="font-family: var(--font-body);">
							Items ({selectedItems.length})
						</h2>
						<Button variant="ghost" size="sm" href={appendOneTimeCartId('/checkout/cart')} class="h-8 text-primary hover:text-primary/80">
							<Pencil class="mr-1 size-3.5" /> Edit
						</Button>
					</div>
					<div class="divide-y divide-gray-100">
						{#each selectedItems as item}
							<div class="flex gap-3 py-3 text-sm">
								<div class="relative size-16 shrink-0 overflow-hidden rounded bg-gray-50 p-1">
									<img src={item?.thumbnail || '/placeholder.svg'} alt={item.title} class="size-full object-contain" />
								</div>
								<div class="flex min-w-0 flex-1 flex-col justify-between py-1">
									<div>
										<p class="line-clamp-2 font-medium text-gray-900">{item.title}</p>
										<p class="text-xs text-gray-500">Qty: {item.qty}</p>
									</div>
									<p class="font-bold text-gray-900">
										{formatPrice(item.price * item.qty, currencyCode)}
									</p>
								</div>
							</div>
						{/each}
					</div>
				</div>

				<!-- Contact -->
				{#if cartState.cart?.email || cartState.cart?.phone}
					<div class="rounded-lg border border-border bg-background p-6 shadow-sm">
						<div class="flex items-center justify-between border-b border-border pb-3">
							<h2 class="flex items-center gap-2 text-base font-bold uppercase text-gray-900" style="font-family: var(--font-body);">
								<Mail class="size-4 text-primary" /> Contact
							</h2>
							<Button variant="ghost" size="sm" href={appendOneTimeCartId('/checkout/address')} class="h-8 text-primary hover:text-primary/80">
								<Pencil class="mr-1 size-3.5" /> Edit
							</Button>
						</div>
						<div class="space-y-1 pt-3 text-sm text-gray-600">
							{#if cartState.cart.email}
								<p>Email: {cartState.cart.email}</p>
							{/if}
							{#if cartState.cart.phone}
								<p>Phone: {cartState.cart.phone}</p>
							{/if}
						</div>
					</div>
				{/if}

				<!-- Delivery Address -->
				{#if cartState.cart?.shippingAddress}
					<div class="rounded-lg border border-border bg-background p-6 shadow-sm">
						<div class="flex items-center justify-between border-b border-border pb-3">
							<h2 class="flex items-center gap-2 text-base font-bold uppercase text-gray-900" style="font-family: var(--font-body);">
								<MapPin class="size-4 text-primary" /> Delivery Address
							</h2>
							<Button variant="ghost" size="sm" href={appendOneTimeCartId('/checkout/address')} class="h-8 text-primary hover:text-primary/80">
								<Pencil class="mr-1 size-3.5" /> Edit
							</Button>
						</div>
						<div class="pt-3 text-sm leading-relaxed text-gray-600">
							<p class="font-bold text-gray-900">
								{cartState.cart.shippingAddress?.firstName}
								{cartState.cart.shippingAddress?.lastName}
							</p>
							<p>{cartState.cart.shippingAddress?.address_1}</p>
							{#if cartState.cart.shippingAddress?.address_2}
								<p>{cartState.cart.shippingAddress?.address_2}</p>
							{/if}
							<p>
								{cartState.cart.shippingAddress?.city}, {cartState.cart.shippingAddress?.state}, {cartState.cart.shippingAddress?.countryCode}
								{cartState.cart.shippingAddress?.zip}
							</p>
							{#if cartState.cart.shippingAddress?.phone}
								<p class="mt-1">{cartState.cart.shippingAddress?.phone}</p>
							{/if}
						</div>
					</div>
				{/if}

				<!-- Shipping Method -->
				{#if selectedShippingRate}
					<div class="rounded-lg border border-border bg-background p-6 shadow-sm">
						<div class="flex items-center justify-between border-b border-border pb-3">
							<h2 class="flex items-center gap-2 text-base font-bold uppercase text-gray-900" style="font-family: var(--font-body);">
								<Truck class="size-4 text-primary" /> Shipping Method
							</h2>
							<Button variant="ghost" size="sm" onclick={onback} class="h-8 text-primary hover:text-primary/80">
								<Pencil class="mr-1 size-3.5" /> Edit
							</Button>
						</div>
						<div class="flex items-center justify-between pt-3 text-sm text-gray-600">
							<div>
								<p class="font-bold text-gray-900">
									{selectedShippingRate.name}
									{#if !Number.isNaN(Number.parseFloat(selectedShippingRate?.estimated_min_days)) && !Number.isNaN(Number.parseFloat(selectedShippingRate?.estimated_max_days))}
										{'(' + selectedShippingRate?.estimated_min_days + ' - ' + selectedShippingRate?.estimated_max_days + ' business days)'}
									{/if}
								</p>
								{#if selectedShippingRate.description}
									<p class="text-xs">{selectedShippingRate.description}</p>
								{/if}
							</div>
							<span class="font-bold">
								{selectedShippingRate.base_rate > 0 ? formatPrice(selectedShippingRate.base_rate, currencyCode) : 'FREE'}
							</span>
						</div>
					</div>
				{/if}

				<!-- Payment Method -->
				<div class="rounded-lg border border-border bg-background p-6 shadow-sm">
					<div class="flex items-center justify-between border-b border-border pb-3">
						<h2 class="flex items-center gap-2 text-base font-bold uppercase text-gray-900" style="font-family: var(--font-body);">
							<CreditCard class="size-4 text-primary" /> Payment Method
						</h2>
						<Button variant="ghost" size="sm" onclick={onback} class="h-8 text-primary hover:text-primary/80">
							<Pencil class="mr-1 size-3.5" /> Edit
						</Button>
					</div>
					<div class="flex items-center gap-3 pt-3">
						{#if selectedPaymentMethod?.img}
							<div class="flex h-10 w-12 items-center justify-center rounded border border-border bg-white p-1 shadow-sm">
								<img src={selectedPaymentMethod.img} alt={selectedPaymentMethod?.name} class="h-full w-full object-contain" />
							</div>
						{/if}
						<span class="text-sm font-bold uppercase tracking-tight text-gray-900">
							{selectedPaymentMethod?.name || 'No payment method selected'}
						</span>
					</div>
				</div>
			</div>

			<!-- Right Column - Price Summary -->
			<div class="flex h-fit flex-col gap-3">
				<div class="space-y-4 rounded-lg border border-border bg-background p-6 shadow-sm">
					<div class="mb-6 flex flex-col gap-1">
						<h2 class="text-base font-bold uppercase text-gray-900" style="font-family: var(--font-body);">Price Summary</h2>
						<div class="h-1 w-12 bg-primary"></div>
					</div>
					<div class="space-y-4">
						<div class="space-y-3 border-b border-border pb-6">
							<div class="flex justify-between text-sm">
								<span class="font-medium text-gray-500">Subtotal</span>
								<span class="font-bold text-gray-900">{formatPrice(cartState.cart.subtotal, currencyCode)}</span>
							</div>
							{#if cartState.cart.discountAmount > 0}
								<div class="flex justify-between text-sm">
									<span class="font-medium text-gray-500">Discount {cartState.cart.couponCode ? `(${cartState.cart.couponCode})` : ''}</span>
									<span class="font-bold uppercase tracking-tight text-orange-600">- {formatPrice(cartState.cart.discountAmount, currencyCode)}</span>
								</div>
							{/if}
							<div class="flex justify-between text-sm">
								<span class="font-medium text-gray-500">Shipping</span>
								{#if cartState.cart.shippingCharges}
									<span class="font-bold text-gray-900">{formatPrice(cartState.cart.shippingCharges, currencyCode)}</span>
								{:else}
									<span class="rounded bg-green-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-green-600 ring-1 ring-green-100"
										>FREE</span
									>
								{/if}
							</div>
						</div>

						<div class="flex items-center justify-between pt-2">
							<span class="text-sm font-bold uppercase text-gray-900">Total</span>
							<span class="text-xl font-bold text-gray-900">{formatPrice(cartState.cart.total, currencyCode)}</span>
						</div>

						{#if paymentModule.showError}
							<div class="rounded bg-destructive p-3 text-[11px] font-bold uppercase tracking-tight text-destructive-foreground ring-1 ring-red-100">
								{paymentModule.errorMessage}
							</div>
						{/if}

						<div class="mt-6 flex items-center justify-center gap-2 rounded-md border border-gray-100 bg-gray-50/50 px-4 py-3">
							<LockKeyhole class="h-3.5 w-3.5 text-gray-400" />
							<p class="text-[10px] font-bold uppercase tracking-widest text-gray-500">Secure 256-bit encryption</p>
						</div>

						<CheckoutButton
							text="Confirm Order"
							onclick={onsubmit}
							disabled={paymentModule.checkoutDisabled}
							loading={paymentModule.paymentLoader}
						/>
					</div>
				</div>

				<OrderTrustBadges />
			</div>
		</div>
	</div>
</div>
