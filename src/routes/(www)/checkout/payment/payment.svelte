<script lang="ts">
	import { Button } from '$lib/components/ui/button'
	import { ChevronDown, LoaderCircle, LockKeyhole, X } from '@lucide/svelte'
	import { formatPrice } from '$lib/core/utils'
	import LoadingDots from '$lib/core/components/common/loading-dots.svelte'
	import { page } from '$app/state'
	import OrderTrustBadges from '$lib/core/components/plugins/order-trust-badges.svelte'
	import CouponsDrawer from '$lib/components/coupon/coupons-drawer.svelte'
	import CheckoutHeader from '$lib/components/checkout/checkout-header.svelte'
	import CheckoutButton from '$lib/components/buttons/checkout-button.svelte'

	const { paymentModule, onreview } = $props()

	// Check if phone is required based on login type
	const isPhoneRequired = page.data?.store?.isPhoneMandatory
	const isEmailRequired = page.data?.store?.isEmailMandatory

	const cartState = paymentModule.cartState

	let showAddress = $state(false)
</script>

<svelte:head>
	<title>Checkout - Secure Payment</title>
</svelte:head>

<div class="min-h-screen py-8">
	<div class="container mx-auto px-4">
		<CheckoutHeader step={3} />
					<!-- <div class="mb-8 flex justify-between items-center">
		  <div>
				<p class="font-bold tracking-tight text-xl">Payment</p>
			</div>
			<Button variant="link" onclick={() => {
				goto("/checkout/address")
			}} >
				Back to Address
			</Button>
		</div> -->

		{#if paymentModule.loadingForPaymentMethods}
			<div class="flex min-h-96 items-center justify-center py-8">
				<LoaderCircle class="animate-spin" />
			</div>
		{:else}
			<div class="grid gap-8 lg:grid-cols-[1fr_400px]">
				<!-- Left Column -->
					<div class="flex flex-col gap-6">


						{#if paymentModule.shippingRates?.error?.message}
						<div class="mb-4 rounded bg-red-50 p-4 text-[11px] font-bold tracking-tight text-red-600 ring-1 ring-red-100">
							We currently deliver only to
							{#each paymentModule.shippingRates?.error?.countriesDeliverable || [] as country, index}
								<span class="font-black">{country}</span>{#if index !== paymentModule.shippingRates?.error?.countriesDeliverable?.length - 1},
									{' '}
								{/if}
							{/each}.

							{#if paymentModule.shippingRates?.error?.moreCountriesCount}
								<span class="font-black"> and {paymentModule.shippingRates.error.moreCountriesCount} more</span>
							{/if} Your selected country is <span class="font-black">"{paymentModule.shippingRates?.error?.selectedCountry}"</span>.
						</div>
					{/if}

					<div class="h-fit space-y-6">
						<h2 class="text-base font-bold uppercase text-gray-900" >
							Select Payment Method
						</h2>
						{#if paymentModule.showError}
							<div class="rounded bg-destructive p-3 text-[11px] font-bold uppercase tracking-tight text-destructive-foreground ring-1 ring-red-100">
								{paymentModule.errorMessage}
							</div>
						{/if}

						{#if paymentModule.showPaymentMethods}
							<div class="grid grid-cols-1 gap-4">
								{#each paymentModule.listOfPaymentMethods as method}
									<label
										class="relative flex cursor-pointer items-center justify-between rounded-lg border bg-background px-6 py-5 {(paymentModule.selectedPGCode == method?.code && paymentModule.listOfPaymentMethods?.length !== 1)
											? 'border-primary ring-1 ring-primary'
											: 'border-border shadow-sm'}"
									>
										<div class="flex items-center gap-4">
											<div class="relative flex h-5 w-5 items-center justify-center">
												<input
													type="radio"
													name="paymentMethod"
													value={method?.code}
													checked={paymentModule.SELECTED_PG_CODE === method?.code}
													onchange={() => paymentModule.SELECTED_PG_CODE = method?.code}
													class="peer h-5 w-5 appearance-none rounded-full border-2 border-gray-200 transition-all checked:border-primary"
												/>
												<div class="absolute h-2.5 w-2.5 rounded-full bg-primary opacity-0 transition-opacity peer-checked:opacity-100"></div>
											</div>

											<div class="flex items-center gap-3">
												{#if method?.img}
													<div class="flex h-10 w-12 items-center justify-center rounded border border-border bg-white p-1 shadow-sm">
														<img src={method.img} alt={method?.name} class="h-full w-full object-contain" />
													</div>
												{/if}
												<div class="flex flex-col">
													<span class="text-sm font-bold uppercase tracking-tight text-gray-900">{method?.name}</span>
													{#if method?.description}
														<span class="text-[10px] font-medium uppercase tracking-tighter text-gray-400">{@html method?.description}</span>
													{/if}
												</div>
											</div>
										</div>

										{#if method?.badges?.length}
											<div class="flex gap-2">
												{#each method.badges as badge}
													<span
														class="rounded bg-gray-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-gray-400 ring-1 ring-gray-100"
													>
														{badge}
													</span>
												{/each}
											</div>
										{/if}
									</label>
								{/each}
							</div>
						{/if}
					</div>

					{#if paymentModule.shippingRates?.data?.length}
						<div class="grid h-fit grid-cols-1 space-y-6  pt-4">
							<h2 class="text-base font-bold uppercase text-gray-900" style="font-family: var(--font-body);">
								Select Shipping Method
							</h2>

							<div class="flex flex-col gap-3">
								{#each paymentModule.shippingRates?.data as rate}
									<label
										for={rate.id}
										class="flex items-center justify-between rounded-lg border bg-white p-5 transition-all duration-300 active:scale-[0.99] {cartState
											?.cart?.shippingRateId === rate.id
											? ''
											: 'shadow-sm'}"
									>
										<div class="flex items-center gap-4">
											<div class="relative flex h-5 w-5 items-center justify-center">
												<input
													type="radio"
													name="shippingRate"
													id={rate.id}
													checked={cartState?.cart?.shippingRateId === rate.id}
													onchange={() => paymentModule.handleShippingRateChange(rate)}
													class="peer h-5 w-5 appearance-none rounded-full border-2 border-border transition-all checked:border-primary"
												/>
												<div class="absolute h-2.5 w-2.5 rounded-full bg-primary opacity-0 transition-opacity peer-checked:opacity-100"></div>
											</div>

											<div class="flex flex-col gap-0.5">
												<span class="text-sm font-bold uppercase tracking-tight text-gray-900">
													{rate.name}
												</span>
												<div class="flex items-center gap-2">
													{#if !Number.isNaN(Number.parseFloat(rate?.estimated_min_days)) && !Number.isNaN(Number.parseFloat(rate?.estimated_max_days))}
														<span class="text-[10px] font-bold uppercase tracking-tighter text-primary">
															{rate?.estimated_min_days} - {rate?.estimated_max_days} Days
														</span>
														<span class="h-1 w-1 rounded-full bg-gray-200"></span>
													{/if}
													<span class="text-[10px] font-medium uppercase tracking-tighter text-gray-400">{rate.description}</span>
												</div>
											</div>
										</div>
										<div class="text-right">
											<span class="text-sm font-bold text-gray-900">
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
								<Button
									variant="ghost"
									size="icon"
									class="h-auto w-auto p-1 text-red-500"
									onclick={paymentModule.removeAppliedCoupon}
								>
									<X class="size-4" />
								</Button>
							</div>
						</div>
					{/if}

											{#if cartState?.cart?.shippingAddress}
							<div class="rounded-lg border border-border bg-white shadow-sm overflow-hidden text-left">
								<Button
									variant="plain"
									class="flex w-full items-center justify-between px-6 py-4 h-auto"
									onclick={() => (showAddress = !showAddress)}
								>
									<div class="flex flex-col items-start">
										<span class="text-sm font-bold text-muted">Delivering Order to</span>
										<span class="text-sm font-bold uppercase tracking-tight text-gray-900">
											{cartState.cart.shippingAddress.firstName} {cartState.cart.shippingAddress.lastName}
										</span>
									</div>
									<ChevronDown
										class="h-5 w-5 text-gray-400 transition-transform duration-300 {showAddress ? 'rotate-180' : ''}"
									/>
								</Button>

								{#if showAddress}
									<div class="border-t border-gray-50 bg-gray-50/30 px-6 py-2">
										<div class="flex items-start justify-between gap-4">
											<div class="flex-1">
												<p class="text-sm leading-relaxed text-gray-600">
													{cartState.cart.shippingAddress?.address_1},<br />
													{cartState.cart.shippingAddress.locality ? cartState.cart.shippingAddress.locality + ',' : ''}
													{cartState.cart.shippingAddress.city}, {cartState.cart.shippingAddress.state} - {cartState.cart.shippingAddress.zip}<br />
													{cartState.cart.shippingAddress.country}
												</p>
												{#if cartState.cart.shippingAddress?.address_2}
													<p class="text-xs leading-relaxed text-gray-600">{cartState.cart.shippingAddress?.address_2}</p>
												{/if}
											</div>
											<Button
												variant="outline"
												size="sm"
												class="h-7 px-3"
												onclick={paymentModule.handleAddressChange}
											>
												Change
											</Button>
										</div>
										{#if cartState.cart.phone}
											<p class="mt-2 text-xs font-bold text-gray-900">
												Phone: {cartState.cart.phone}
											</p>
										{/if}
									</div>
								{/if}
							</div>
						{/if}


					<CouponsDrawer />

					<div class="space-y-4">

						<div class="space-y-4 rounded-lg border border-border bg-white p-6 shadow-sm">


							<div class="mb-6 flex flex-col gap-1">
								<h2 class="text-base font-bold uppercase text-gray-900" style="font-family: var(--font-body);">
									Price Summary
								</h2>
								<div class="h-1 w-12 bg-primary"></div>
							</div>
							{#if paymentModule.loadingForCart}
								<div class="flex items-center justify-center py-8">
									<LoadingDots />
								</div>
							{:else}
								<div class="space-y-4">
									<div class="space-y-3 border-b border-border pb-6">
										<div class="flex justify-between text-sm">
											<span class="font-medium text-gray-500">Subtotal</span>
											<span class="font-bold text-gray-900">{formatPrice(cartState.cart.subtotal, page?.data?.store?.currency?.code)}</span>
										</div>
										{#if cartState.cart.discountAmount > 0}
											<div class="flex justify-between text-sm">
												<span class="font-medium text-gray-500">Discount</span>
												<span class="font-bold uppercase tracking-tight text-orange-600"
													>- {formatPrice(cartState.cart.discountAmount, page?.data?.store?.currency?.code)}</span
												>
											</div>
										{/if}
										<div class="flex justify-between text-sm">
											<span class="font-medium text-gray-500">Shipping</span>
											{#if !cartState.cart.shippingAddress}
												<span class="text-[10px] font-bold uppercase tracking-tighter text-gray-400"> Address required </span>
											{:else if cartState.cart.shippingCharges}
												<span class="font-bold text-gray-900">{formatPrice(cartState.cart.shippingCharges, page?.data?.store?.currency?.code)}</span>
											{:else}
												<span
													class="rounded bg-green-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-green-600 ring-1 ring-green-100"
													>FREE</span
												>
											{/if}
										</div>
									</div>

									<div class="flex items-center justify-between pt-2">
										<span class="text-sm font-bold uppercase  text-gray-900">Total</span>
										<span class="text-xl font-bold text-gray-900">{formatPrice(cartState.cart.total, page?.data?.store?.currency?.code)}</span>
									</div>

									<div class="mt-6 flex items-center justify-center gap-2 rounded-md border border-gray-100 bg-gray-50/50 px-4 py-3">
										<LockKeyhole class="h-3.5 w-3.5 text-gray-400" />
										<p class="text-[10px] font-bold uppercase tracking-widest text-gray-500">Secure 256-bit encryption</p>
									</div>

									{#if (!isPhoneRequired || cartState?.cart?.phone) && (!isEmailRequired || cartState?.cart?.email) && (cartState?.cart?.shippingAddress || cartState?.cart?.shippingAddressId)}
										<CheckoutButton
											text="Review Order"
											disabledText="Select Method"
											onclick={onreview}
											disabled={paymentModule.checkoutDisabled || !!paymentModule.shippingRates?.error?.message}
											loading={paymentModule.paymentLoader}
										/>
									{/if}
								</div>
							{/if}
						</div>

						<OrderTrustBadges />
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>
