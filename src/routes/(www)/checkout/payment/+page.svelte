<script lang="ts">
	import { Button } from '$lib/components/ui/button'
	import { goto } from '$app/navigation'
	import { LockKeyhole, X } from 'lucide-svelte'
	import { formatPrice } from '$lib/core/utils'
	import LoadingDots from '$lib/core/components/common/loading-dots.svelte'
	import { page } from '$app/state'
	import OrderTrustBadges from '$lib/core/components/plugins/order-trust-badges.svelte'
	import CouponsDrawer from '$lib/components/coupon/coupons-drawer.svelte'
	import { PaymentModule } from '$lib/core/composables/use-payment.svelte'

	const paymentModule = new PaymentModule()
  const cartState = paymentModule.cartState
</script>

<svelte:head>
	<title>Checkout - Secure Payment</title>
</svelte:head>

<div class="min-h-screen py-8">
	<div class="container mx-auto px-4">
		<!-- Checkout Progress -->
		<div class="mb-8">
			<div class="flex items-center justify-center space-x-8">
				<button onclick={() => goto('/checkout/cart')} class="flex cursor-pointer items-center text-gray-400">
					<div class="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300">1</div>
					<span class="ml-2 font-medium">Cart</span>
				</button>
				<div class="hidden h-px w-16 bg-gray-300 sm:block"></div>
				<button onclick={() => goto('/checkout/address')} class="flex cursor-pointer items-center text-gray-400">
					<div class="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300">2</div>
					<span class="ml-2 font-medium">Address</span>
				</button>
				<div class="hidden h-px w-16 bg-gray-300 sm:block"></div>
				<div class="flex items-center text-gray-400">
					<div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">3</div>
					<span class="ml-2 font-medium">Payment</span>
				</div>
			</div>
		</div>

		<div class="grid gap-6 lg:grid-cols-[1fr_400px]">
			<!-- Left Column -->
			<div class="flex flex-col gap-4">
				{#if paymentModule.shippingRates?.error?.message}
					<div class="mb-4 text-red-500">
						We currently deliver only to the following countries:
						{#each paymentModule.shippingRates?.error?.countriesDeliverable || [] as country, index}
							<span class="font-semibold">{country}</span>{#if index !== paymentModule.shippingRates?.error?.countriesDeliverable?.length - 1},
								{' '}
							{/if}
						{/each}
						{#if paymentModule.shippingRates?.error?.moreCountriesCount}
							<span class="font-semibold"> and {paymentModule.shippingRates.error.moreCountriesCount} more</span>
						{/if}. Your selected country is <span class="font-semibold">"{paymentModule.shippingRates?.error?.selectedCountry}"</span>.
					</div>
				{/if}

				<div class="h-fit space-y-6 rounded-lg">
					<h2 class="mb-4 text-xl font-semibold">Select Payment Methods</h2>
					{#if paymentModule.showError}
						<div class="mb-4 text-red-500">
							{paymentModule.errorMessage}
						</div>
					{/if}

					{#if paymentModule.showPaymentMethods}
						<div class="">
							{#each paymentModule.listOfPaymentMethods as method}
								<label
									class="mb-4 block h-20 cursor-pointer gap-2 rounded border px-8 py-4 transition-all duration-200 hover:bg-gray-50 {paymentModule.SELECTED_PG_NAME ===
									method?.name
										? 'border-2 border-primary'
										: 'border'}"
								>
									<div class="flex h-full items-center justify-between gap-4">
										<div class="flex flex-1 items-center gap-3">
											{#if method?.img}
												<img src={method.img} alt={method?.name} class="h-8 w-auto object-contain" />
											{/if}
											<div class="flex flex-col">
												<span class="font-medium text-gray-900">{method?.name}</span>
												{#if method?.description}
													<span class="text-sm text-gray-500">{@html method?.description}</span>
												{/if}
											</div>
										</div>
										<input
											type="radio"
											name="paymentMethod"
											value={method?.name}
											checked={paymentModule.SELECTED_PG_NAME === method?.name}
											onchange={() => (paymentModule.SELECTED_PG_NAME = method?.name)}
											class="focus:ring-primary-500 h-4 w-4 border-gray-300 text-primary"
										/>
									</div>
									{#if method?.badges?.length}
										<div class="flex gap-2">
											{#each method.badges as badge}
												<span class="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
													{badge}
												</span>
											{/each}
										</div>
									{/if}
								</label>
							{/each}
						</div>
					{/if}
					<!-- {#each cartState.cart.lineItems || [] as item}
          {#if item.isSelectedForCheckout}
            <div class="flex items-start gap-2">
              <a
                class="flex flex-1 gap-4 border-b py-3"
                href={`/products/${item.slug}`}
                target="_blank"
              >
                <div class="relative">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    class="h-20 w-16 rounded object-cover"
                  />
                  <div
                    class="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-gray-500 text-xs text-white"
                  >
                    {item.qty}
                  </div>
                </div>
                <div class="flex-1">
                  <p class="line-clamp-2 font-medium">{item.title}</p>
                  <p class="mt-1 text-sm text-gray-500">Qty: {item.qty}</p>
                  <p class="mt-1 font-semibold">
                    {formatPrice(
                      item.price * item.qty,
                      page?.data?.store?.currency?.code
                    )}
                  </p>
                </div>
              </a>
            </div>
          {/if}
        {/each} -->
				</div>
				{#if paymentModule.shippingRates?.data?.length}
					<div class="grid h-fit grid-cols-1 space-y-6 rounded-lg">
						<h2 class="text-xl font-semibold">Shipping Methods</h2>

						<div class="flex flex-col divide-y rounded-lg border">
							{#each paymentModule.shippingRates?.data as rate}
								<label
									for={rate.id}
									class="flex flex-row justify-between gap-3 p-4 hover:cursor-pointer {cartState?.cart?.shippingRateId === rate.id
										? 'bg-gray-100'
										: ''}"
								>
									<div class="flex flex-row gap-3">
										<div class="flex items-start justify-center">
											<input
												type="radio"
												name="shippingRate"
												id={rate.id}
												checked={cartState?.cart?.shippingRateId === rate.id}
												onchange={() => paymentModule.handleShippingRateChange(rate)}
												class="focus:ring-primary-500 h-4 w-4 border-gray-300 text-primary"
											/>
										</div>
										<div class="flex flex-col gap-2">
											<span class="font-medium leading-none">
												{rate.name}
												{#if !Number.isNaN(Number.parseFloat(rate?.estimated_min_days)) && !Number.isNaN(Number.parseFloat(rate?.estimated_max_days))}
													{'(' + rate?.estimated_min_days + ' - ' + rate?.estimated_max_days + ' business days)'}
												{/if}
											</span>
											<span class="text-sm text-gray-500">{rate.description}</span>
										</div>
									</div>
									<div class="flex flex-col">
										<span class="text-sm font-semibold">
											{rate.base_rate > 0 ? formatPrice(rate.base_rate, page?.data?.store?.currency?.code) : 'FREE'}
										</span>
									</div>
								</label>
							{/each}
						</div>
					</div>
				{/if}
			</div>

			<!-- Right Column - Order Summary -->
			<div class="flex flex-col gap-3">
				<!-- coupon applied-->
				{#if cartState.cart.couponCode}
					<div class="flex items-center justify-between px-1 text-sm sm:text-base">
						<p class="font-medium">Coupon Applied</p>
						<div class="flex items-center gap-2 rounded-lg bg-gray-100 p-2 px-3">
							<p class="text-sm font-medium text-gray-600">
								{cartState.cart.couponCode}
							</p>
							<button class="text-sm text-red-500" onclick={paymentModule.removeAppliedCoupon}>
								<X class="h-4 w-4" />
							</button>
						</div>
					</div>
				{/if}

				<CouponsDrawer />

				<div class="space-y-6">
					<div class="space-y-6 rounded-md border p-4">
						<h2 class="text-xl font-semibold">Price Summary</h2>
						<span class="mb-4 text-sm text-gray-400">Includes all government taxes</span>
						{#if paymentModule.loadingForCart}
							<div class="flex items-center justify-center py-8">
								<LoadingDots />
							</div>
						{:else}
							<div class="space-y-4 max-sm:text-sm">
								<div class="space-y-3 border-b py-4">
									<div class="flex justify-between">
										<span class="text-gray-600">Subtotal</span>
										<span>{formatPrice(cartState.cart.subtotal, page?.data?.store?.currency?.code)}</span>
									</div>
									{#if cartState.cart.discountAmount > 0}
										<div class="flex justify-between text-green-600">
											<span>Discount</span>
											<span>- {formatPrice(cartState.cart.discountAmount, page?.data?.store?.currency?.code)}</span>
										</div>
									{/if}
									<div class="flex justify-between">
										<span class="text-gray-600">Shipping</span>
										<!-- {#if cartState.cart.total > freeShippingOn}
											<span class="rounded border border-green-500 px-1.5 text-xs text-green-500 sm:text-sm">FREE</span>
										{:else} -->
										<!-- <span
                            >{cartState.cart.shippingCharges
                              ? formatPrice(
                                  cartState.cart.shippingCharges,
                                  page?.data?.store?.currency?.code
                                )
                              : shippingCharges
                                ? formatPrice(
                                    shippingCharges,
                                    page?.data?.store?.currency?.code
                                  )
                                : "FREE"}</span> -->
										{#if !cartState.cart.shippingAddress}
											<span class="text-gray-600"> will be calulcated after entering address. </span>
										{:else if cartState.cart.shippingCharges}
											<span>{formatPrice(cartState.cart.shippingCharges, page?.data?.store?.currency?.code)}</span>
										{:else}
											<span class="rounded border border-green-500 px-1.5 text-xs text-green-500 sm:text-sm">FREE</span>
										{/if}
										<!-- {/if} -->
									</div>
								</div>

								<div class="flex items-center justify-between py-4 text-base font-semibold sm:text-lg">
									<span>Total</span>
									<span>{formatPrice(cartState.cart.total, page?.data?.store?.currency?.code)}</span>
								</div>

								<div class="w-full rounded-lg bg-slate-100 p-4 shadow-sm">
									<div class="flex items-center justify-center gap-3">
										<LockKeyhole class="h-5 w-5 text-slate-600" />
										<p class="font-medium text-slate-700">Your order is secured with 256-bit encryption</p>
									</div>
								</div>

								{#if cartState?.cart?.email && (cartState?.cart?.shippingAddress || cartState?.cart?.shippingAddressId)}
									<Button
										class="bottom-0 left-0 right-0 z-[45] w-full py-6 text-lg hover:bg-primary max-sm:fixed max-sm:h-16 max-sm:rounded-none max-sm:disabled:bg-gray-500"
										onclick={paymentModule.placeOrder}
										disabled={paymentModule.checkoutDisabled || paymentModule.SELECTED_PG_NAME === ''}
									>
										{#if paymentModule.paymentLoader}
											<LoadingDots />
										{:else}
											Place Order
										{/if}
									</Button>
								{/if}
							</div>
						{/if}
					</div>

					<!-- <div class="rounded-lg bg-white p-4 shadow">
              <div class="flex items-center text-sm text-gray-600">
                <ShoppingBag class="mr-2 size-4" />
                <span>Your order is secured with 256-bit encryption</span>
              </div>
            </div> -->
					<OrderTrustBadges />

					<!-- <div
              class="mt-5 bg-white shadow flex items-start justify-between gap-3 p-5 rounded"
            >
              <div
                class="flex flex-col items-center justify-center gap-2 text-center text-[0.5em] text-zinc-500 uppercase"
              >
                <img
                  src="/cart-badge-trust.svg"
                  alt="cart badge trust"
                  class="h-8 w-8 object-contain object-bottom"
                /> <span>100% secure payments</span>
              </div>
              <div
                class="flex flex-col items-center justify-center gap-2 text-center text-[0.5em] text-zinc-500 uppercase"
              >
                <img
                  src="/cart-easy-return.svg"
                  alt="cart badge trust"
                  class="h-8 w-8 object-contain object-bottom"
                /> <span>Easy return &amp; quick refunds</span>
              </div>
              <div
                class="flex flex-col items-center justify-center gap-2 text-center text-[0.5em] text-zinc-500 uppercase"
              >
                <img
                  src="/quality-check.svg"
                  alt="cart badge trust"
                  class="h-8 w-8 object-contain object-bottom"
                /> <span>Quality assurance</span>
              </div>
            </div> -->
				</div>
			</div>
		</div>
	</div>
</div>

