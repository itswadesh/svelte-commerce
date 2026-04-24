<script lang="ts">
import { Button } from '$lib/components/ui/button'
import { goto } from '$app/navigation'
import { ChevronRight, LockKeyhole, X } from '@lucide/svelte'
import { formatPrice } from '$lib/core/utils'
import LoadingDots from '$lib/core/components/common/loading-dots.svelte'
import { page } from '$app/state'
import OrderTrustBadges from '$lib/core/components/plugins/order-trust-badges.svelte'
import CouponsDrawer from '$lib/components/coupon/coupons-drawer.svelte'
import { PaymentModule } from '$lib/core/composables/index.js'
import { appendOneTimeCartId } from '$lib/core/utils/index.js'

// Check if phone is required based on login type
const isPhoneRequired = page.data?.store?.isPhoneMandatory
const isEmailRequired = page.data?.store?.isEmailMandatory

const paymentModule = new PaymentModule()
const cartState = paymentModule.cartState
</script>

<svelte:head>
	<title>Checkout - Secure Payment</title>
</svelte:head>

<div class="min-h-screen py-8">
	<div class="container mx-auto px-4">
		<!-- Checkout Progress -->
		<div class="mb-12">
			<div class="flex items-center justify-center space-x-4 sm:space-x-12">
				<button onclick={() => goto(appendOneTimeCartId('/checkout/cart'))} class="flex items-center text-gray-400 hover:text-gray-900 transition-colors">
					<div class="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 text-[11px] font-bold tracking-tight">1</div>
					<span class="ml-2 text-xs font-bold uppercase tracking-widest">Cart</span>
				</button>
				<div class="h-px w-8 bg-gray-200 sm:w-16"></div>
				<button onclick={() => goto(appendOneTimeCartId('/checkout/address'))} class="flex items-center text-gray-400 hover:text-gray-900 transition-colors">
					<div class="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 text-[11px] font-bold tracking-tight">2</div>
					<span class="ml-2 text-xs font-bold uppercase tracking-widest">Address</span>
				</button>
				<div class="h-px w-8 bg-gray-200 sm:w-16"></div>
				<div class="flex items-center text-primary">
					<div class="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-white tracking-tight">3</div>
					<span class="ml-2 text-xs font-bold uppercase tracking-widest">Payment</span>
				</div>
			</div>
		</div>

		<div class="grid gap-8 lg:grid-cols-[1fr_400px]">
			<!-- Left Column -->
			<div class="flex flex-col gap-6">
				{#if paymentModule.shippingRates?.error?.message}
					<div class="mb-4 rounded bg-red-50 p-4 text-[11px] font-bold uppercase tracking-tight text-red-600 ring-1 ring-red-100">
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
					<h2 class="text-base font-bold uppercase tracking-widest text-gray-900" style="font-family: 'Montserrat', sans-serif;">Select Payment Method</h2>
					{#if paymentModule.showError}
						<div class="rounded bg-red-50 p-3 text-[11px] font-bold uppercase tracking-tight text-red-600 ring-1 ring-red-100">
							{paymentModule.errorMessage}
						</div>
					{/if}

					{#if paymentModule.showPaymentMethods}
						<div class="grid grid-cols-1 gap-4">
							{#each paymentModule.listOfPaymentMethods as method}
								<label
									class="relative flex cursor-pointer items-center justify-between rounded-lg border bg-white px-6 py-5 transition-all duration-300 hover:bg-gray-50 hover:shadow-md active:scale-[0.99] {paymentModule.SELECTED_PG_CODE === method?.code ? 'border-primary ring-1 ring-primary' : 'border-gray-100 shadow-sm'}"
								>
									<div class="flex items-center gap-4">
										<div class="relative flex h-5 w-5 items-center justify-center">
											<input
												type="radio"
												name="paymentMethod"
												value={method?.code}
												checked={paymentModule.SELECTED_PG_CODE === method?.code}
												onchange={() => (paymentModule.SELECTED_PG_CODE = method?.code)}
												class="peer h-5 w-5 appearance-none rounded-full border-2 border-gray-200 checked:border-primary transition-all"
											/>
											<div class="absolute h-2.5 w-2.5 rounded-full bg-primary opacity-0 peer-checked:opacity-100 transition-opacity"></div>
										</div>
										
										<div class="flex items-center gap-3">
											{#if method?.img}
												<div class="flex h-10 w-12 items-center justify-center rounded border border-gray-50 bg-white p-1 shadow-sm">
													<img src={method.img} alt={method?.name} class="h-full w-full object-contain" />
												</div>
											{/if}
											<div class="flex flex-col">
												<span class="text-sm font-bold uppercase tracking-tight text-gray-900">{method?.name}</span>
												{#if method?.description}
													<span class="text-[10px] font-medium text-gray-400 uppercase tracking-tighter">{@html method?.description}</span>
												{/if}
											</div>
										</div>
									</div>

									{#if method?.badges?.length}
										<div class="flex gap-2">
											{#each method.badges as badge}
												<span class="rounded bg-gray-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-gray-400 ring-1 ring-gray-100">
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
					<div class="grid h-fit grid-cols-1 space-y-6 pt-6 border-t border-gray-100">
						<h2 class="text-base font-bold uppercase tracking-widest text-gray-900" style="font-family: 'Montserrat', sans-serif;">Shipping Method</h2>

						<div class="flex flex-col gap-3">
							{#each paymentModule.shippingRates?.data as rate}
								<label
									for={rate.id}
									class="flex items-center justify-between rounded-lg border bg-white p-5 transition-all duration-300 hover:bg-gray-50 hover:shadow-md active:scale-[0.99] {cartState?.cart?.shippingRateId === rate.id
										? 'border-primary ring-1 ring-primary'
										: 'border-gray-100 shadow-sm'}"
								>
									<div class="flex items-center gap-4">
										<div class="relative flex h-5 w-5 items-center justify-center">
											<input
												type="radio"
												name="shippingRate"
												id={rate.id}
												checked={cartState?.cart?.shippingRateId === rate.id}
												onchange={() => paymentModule.handleShippingRateChange(rate)}
												class="peer h-5 w-5 appearance-none rounded-full border-2 border-gray-200 checked:border-primary transition-all"
											/>
											<div class="absolute h-2.5 w-2.5 rounded-full bg-primary opacity-0 peer-checked:opacity-100 transition-opacity"></div>
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
												<span class="text-[10px] font-medium text-gray-400 uppercase tracking-tighter">{rate.description}</span>
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
							<button class="text-sm text-red-500" onclick={paymentModule.removeAppliedCoupon}>
								<X class="h-4 w-4" />
							</button>
						</div>
					</div>
				{/if}

				<CouponsDrawer />

				<div class="space-y-4">
					<div class="space-y-4 rounded-lg border border-gray-100 p-6 bg-white shadow-sm">
						<div class="flex flex-col gap-1 mb-6">
							<h2 class="text-base font-bold uppercase tracking-widest text-gray-900" style="font-family: 'Montserrat', sans-serif;">Price Summary</h2>
							<div class="h-1 w-12 bg-primary"></div>
						</div>
						{#if paymentModule.loadingForCart}
							<div class="flex items-center justify-center py-8">
								<LoadingDots />
							</div>
						{:else}
							<div class="space-y-4">
								<div class="space-y-3 border-b border-gray-50 pb-6">
									<div class="flex justify-between text-sm">
										<span class="text-gray-500 font-medium">Subtotal</span>
										<span class="text-gray-900 font-bold">{formatPrice(cartState.cart.subtotal, page?.data?.store?.currency?.code)}</span>
									</div>
									{#if cartState.cart.discountAmount > 0}
										<div class="flex justify-between text-sm">
											<span class="text-gray-500 font-medium">Discount</span>
											<span class="text-orange-600 font-bold uppercase tracking-tight">- {formatPrice(cartState.cart.discountAmount, page?.data?.store?.currency?.code)}</span>
										</div>
									{/if}
									<div class="flex justify-between text-sm">
										<span class="text-gray-500 font-medium">Shipping</span>
										{#if !cartState.cart.shippingAddress}
											<span class="text-[10px] font-bold uppercase tracking-tighter text-gray-400"> Address required </span>
										{:else if cartState.cart.shippingCharges}
											<span class="text-gray-900 font-bold">{formatPrice(cartState.cart.shippingCharges, page?.data?.store?.currency?.code)}</span>
										{:else}
											<span class="text-green-600 font-bold uppercase tracking-widest text-[10px] bg-green-50 px-2 py-0.5 rounded ring-1 ring-green-100">FREE</span>
										{/if}
									</div>
								</div>

								<div class="flex items-center justify-between pt-2">
									<span class="text-sm font-bold uppercase tracking-widest text-gray-900">Total</span>
									<span class="text-xl font-bold text-gray-900">{formatPrice(cartState.cart.total, page?.data?.store?.currency?.code)}</span>
								</div>

								<div class="mt-6 flex items-center justify-center gap-2 py-3 px-4 rounded-md border border-gray-100 bg-gray-50/50">
									<LockKeyhole class="h-3.5 w-3.5 text-gray-400" />
									<p class="text-[10px] font-bold uppercase tracking-widest text-gray-500">Secure 256-bit encryption</p>
								</div>

								{#if (!isPhoneRequired || cartState?.cart?.phone) && (!isEmailRequired || cartState?.cart?.email) && (cartState?.cart?.shippingAddress || cartState?.cart?.shippingAddressId)}
									<Button
										class="group w-full py-7 text-sm font-bold uppercase tracking-[0.2em] transition-all bg-primary hover:bg-black shadow-lg hover:shadow-xl active:scale-[0.98] max-sm:fixed max-sm:bottom-0 max-sm:left-0 max-sm:right-0 max-sm:z-[60] max-sm:rounded-none max-sm:h-20"
										onclick={paymentModule.placeOrder}
										disabled={paymentModule.checkoutDisabled}
									>
										{#if paymentModule.paymentLoader}
											<LoadingDots />
										{:else}
											<span>Complete Purchase</span> <ChevronRight class="ml-2 size-4 transition-transform duration-300 group-hover:translate-x-1" />
										{/if}
									</Button>
								{/if}
							</div>
						{/if}
					</div>

					<OrderTrustBadges />
				</div>
			</div>
		</div>
	</div>
</div>
