<style>
.animate-slide-in-left {
	animation: slideInLeft 0.3s ease-out forwards;
}

.animate-bounce {
	animation: bounce 0.3s ease-out forwards;
}

@keyframes slideInLeft {
	from {
		transform: translateX(100%);
	}
	to {
		transform: translateX(0);
	}
}

@keyframes bounce {
	0%,
	100% {
		transform: translateY(0);
	}
	50% {
		transform: translateY(-20px);
	}
}
</style>

<script lang="ts">
import { delay, toast } from '$lib/utils'
import { fireGTagEvent } from '$lib/utils/gTagB'
import { goto } from '$app/navigation'
import { onMount } from 'svelte'
import { OrdersService } from '$lib/services'
import { page } from '$app/stores'
import { Pricesummary, LazyImg, CheckoutHeader, Error, TrustBaggeContainer } from '$lib/components'
import logo from '$lib/assets/logo.svg'
import SEO from '$lib/components/SEO/index.svelte'

const seoProps = {
	title: 'Select Payment Option',
	metaDescription: 'Choose your payment method'
}

export let data
// console.log('zzzzzzzzzzzzzzzzzz', data)
let bankPayment = { type: 'order', reference: '', remark: '', paymentMethodId: '', amount: 0 }
let disabled = false
let errorMessage = 'Select a Payment Method'
let loading = false
let paymentDenied = false
let razorpayReady = false
let cashfreeReady = false
let selectedPaymentMethod = { id: '', name: '', text: '', instructions: '', qrcode: '', img: '' }
let showPayWithBankTransfer = false
let paymentProcessingStep = 1

$: if (data.paymentMethods?.length === 1 && data.paymentMethods[0]?.type === 'pg') {
	const pm = data.paymentMethods[0]

	submit(pm)
}

let Stripe

onMount(async () => {
	const StripeModule = await import('$lib/components/Stripe.svelte')
	Stripe = StripeModule.default

	const razorpayScript = document.createElement('script')
	razorpayScript.setAttribute('src', 'https://checkout.razorpay.com/v1/checkout.js')
	document.head.appendChild(razorpayScript)
	razorpayReady = true

	const cashfreeScript = document.createElement('script')
	cashfreeScript.setAttribute('src', 'https://sdk.cashfree.com/js/v3/cashfree.js')
	document.head.appendChild(cashfreeScript)
	cashfreeReady = true
	fireGTagEvent('begin_checkout', data.cart)
})

function paymentMethodChanged(pm) {
	selectedPaymentMethod = pm
	errorMessage = null
}

async function submit(pm) {
	if (!pm || pm === undefined) {
		disabled = true
		errorMessage = 'Please select a payment option'
		toast('Please select a payment option', 'error')
		return
	}

	const paymentMethod = pm.value || pm.id

	// console.log('paymentMethod', paymentMethod)

	if (paymentMethod === 'COD' || paymentMethod === 'manual') {
		try {
			loading = true

			setTimeout(() => {
				paymentProcessingStep = 2
				setTimeout(() => {
					paymentProcessingStep = 3
				}, 500)
			}, 500)

			const res = await OrdersService.codCheckout({
				address: data.addressId,
				cartId: data?.cartId,
				paymentMethod: 'COD',
				paymentProviderId: paymentMethod,
				prescription: data.prescription?._id,
				storeId: $page.data.store?.id,
				origin: $page.data.origin
			})

			// console.log('res of cod', res)

			goto(`/payment/success?orderId=${res?._id || res?.id}&status=PAYMENT_SUCCESS&provider=COD`)
		} catch (e) {
			data.err = e
			toast(e?.body?.message || e, 'error')
		} finally {
			loading = false
		}
	} else if (paymentMethod === 'Cashfree') {
		try {
			loading = true

			setTimeout(() => {
				paymentProcessingStep = 2
				setTimeout(() => {
					paymentProcessingStep = 3
				}, 500)
			}, 500)

			const res = await OrdersService.cashfreeCheckout({
				address: data.addressId,
				storeId: $page.data.store?.id,
				origin: $page.data.origin
			})

			console.log('res of Cashfree', res.payment_session_id)
			const cashfree = Cashfree({ mode: 'sandbox' })
			cashfree
				.checkout({
					paymentSessionId: res.payment_session_id,
					returnUrl: res.order_meta?.return_url,
					redirectTarget: '_parent'
				})
				.then(function () {
					console.log('on going redirection')
				})
			// if (res?.redirectUrl && res?.redirectUrl !== null) {
			// 	goto(`${res?.redirectUrl}`)
			// } else {
			// 	toast('Something went wrong', 'error')
			// }
		} catch (e) {
			data.err = e
			toast(e?.body?.message || e, 'error')
		} finally {
			loading = false
		}
	} else if (paymentMethod === 'Phonepe') {
		try {
			loading = true

			setTimeout(() => {
				paymentProcessingStep = 2
				setTimeout(() => {
					paymentProcessingStep = 3
				}, 500)
			}, 500)

			const res = await OrdersService.phonepeCheckout({
				address: data.addressId,
				storeId: $page.data.store?.id,
				origin: $page.data.origin
			})

			// console.log('res of Phonepe', res)

			if (res?.redirectUrl && res?.redirectUrl !== null) {
				goto(`${res?.redirectUrl}`)
			} else {
				toast('Something went wrong', 'error')
			}
		} catch (e) {
			data.err = e
			toast(e?.body?.message || e, 'error')
		} finally {
			loading = false
		}
	} else if (paymentMethod === 'Paypal') {
		try {
			loading = true

			setTimeout(() => {
				paymentProcessingStep = 2
				setTimeout(() => {
					paymentProcessingStep = 3
				}, 500)
			}, 500)

			const res = await OrdersService.paypalCheckout({
				address: data.addressId,
				storeId: $page.data.store?.id,
				origin: $page.data.origin
			})

			// console.log('res of Paypal', res)

			if (res?.redirect_url && res?.redirect_url !== null) {
				goto(`${res?.redirect_url}`)
			} else {
				toast('Something went wrong', 'error')
			}
		} catch (e) {
			data.err = e
			toast(e?.body?.message || e, 'error')
		} finally {
			loading = false
		}
	} else if (paymentMethod === 'Razorpay') {
		try {
			loading = true

			setTimeout(() => {
				paymentProcessingStep = 2
				setTimeout(() => {
					paymentProcessingStep = 3
				}, 500)
			}, 500)

			const rp = await OrdersService.razorpayCheckout({
				address: data.addressId,
				storeId: $page.data.store?.id,
				origin: $page.data.origin
			})

			// console.log('rp of Razorpay', res)

			const options = {
				key: rp.keyId, // Enter the Key ID generated from the Dashboard
				name: 'Litekart.in',
				description: 'Payment for Litekart',
				image: logo,
				amount: rp.amount,
				order_id: rp.id,
				async handler(response) {
					try {
						const capture = await OrdersService.razorpayCapture({
							rpPaymentId: response.razorpay_payment_id,
							rpOrderId: response.razorpay_order_id,
							storeId: $page.data.store?.id,
							origin: $page.data.origin
						})
						toast('Payment success', 'success')
						goto(`/payment/success?orderId=${capture._id || capture.id}`)
					} catch (e) {
						data.err = e
						goto(`/payment/failure?ref=/checkout/payment-options?address=${data.addressId}`)
					} finally {
					}
				},
				prefill: {
					name: `${data.me.firstName} ${data.me.lastName}`,
					phone: data.me.phone,
					email: data.me.email || 'help@litekart.in',
					contact: data.me.phone
				},
				notes: {
					address: 'Padmajyoti Marg, Semiliguda, Odisha 764036'
				},
				theme: {
					color: '#112D4E'
				}
			}
			const rzp1 = new Razorpay(options)
			rzp1.open()
		} catch (e) {
			data.err = e
			toast(e?.message, 'error')
		} finally {
			loading = false
		}
	} else {
		paymentDenied = true

		setTimeout(() => {
			paymentDenied = false
		}, 820)
	}
}

function checkIfStripeCardValid({ detail }) {
	disabled = !detail
}
</script>

<SEO {...seoProps} />
<div class="container mx-auto min-h-screen w-full max-w-6xl p-3 py-5 sm:p-10">
	<CheckoutHeader selected="payment" />

	<Error err="{data.err}" class="mt-5" />

	<div
		class="mb-14 lg:mb-0 mt-5 md:mt-10 flex flex-col lg:flex-row lg:justify-center gap-10 xl:gap-20">
		<div class="w-full flex-1">
			<h2 class="mb-5">Payment Options</h2>

			{#if data.paymentMethods?.length}
				<div class="flex w-full flex-col gap-4" class:wiggle="{paymentDenied}">
					{#each data.paymentMethods as pm}
						<label
							class="flex w-full cursor-pointer items-center gap-2 rounded border border-zinc-200 p-3 shadow-md transition duration-300 hover:bg-primary-50 sm:gap-4">
							<input
								bind:group="{selectedPaymentMethod}"
								type="radio"
								value="{pm}"
								name="group"
								class="h-4 w-4 focus:outline-none focus:ring-0 focus:ring-offset-0"
								on:click="{() => paymentMethodChanged(pm)}" />

							<div class="flex w-full flex-1 items-center justify-between gap-4">
								<div class="flex-1">
									<h3 style="color:{pm.color}" class="capitalize">
										{pm.name || pm.value || pm.id}
									</h3>

									{#if pm.text}
										<p class="mt-1">{@html pm.text}</p>
									{/if}
								</div>

								<div class="shrink-0">
									{#if pm.img}
										<img
											src="{pm.img}"
											alt="{pm.name}"
											width="48"
											height="48"
											class="h-12 w-12 rounded-full border object-cover object-center text-xs" />
									{:else}
										<div
											class="flex h-12 w-12 p-2 items-center justify-center rounded-full border bg-zinc-200 text-center text-xs uppercase">
											<span class="w-full truncate">
												{pm.name || pm.value || pm.id}
											</span>
										</div>
									{/if}
								</div>
							</div>
						</label>

						{#if pm.value === 'Stripe'}
							<svelte:component
								this="{Stripe}"
								address="{data.addressId}"
								isStripeSelected="{selectedPaymentMethod.value === 'Stripe'}"
								stripePublishableKey="{pm.app_id}"
								on:isStripeCardValid="{checkIfStripeCardValid}" />
						{/if}
					{/each}
				</div>
			{:else}
				<div class="flex flex-col h-1/2 items-center justify-center p-4 text-zinc-500 text-center">
					<svg
						xmlns="http://www.w3.org/500/svg"
						class="mb-2 h-8 w-10"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						stroke-width="2">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						></path>
					</svg>

					<h6 class="mb-2 capitalize">We are very sorry!!</h6>

					<p>
						<span> Payment method is not setup yet, </span>

						<a href="/contact-us" class="block underline hover:text-zinc-800">
							Please contact the store admin
						</a>
					</p>
				</div>
			{/if}
		</div>

		<div class="w-full lg:w-96 lg:shrink-0 lg:grow-0">
			<h2 class="mb-5">Cart Summary</h2>

			<hr class="mb-5" />

			{#if data.address}
				<div class="mb-5">
					<h5 class="mb-2">Delivery Address</h5>

					<p>
						{data.address.firstName || '_'}
						{data.address.lastName || '_'}

						<br />

						{#if data.address.address}
							{data.address.address}
						{/if}

						{#if data.address.locality}
							, {data.address.locality}
						{/if}

						{#if data.address.city}
							, {data.address.city}
						{/if}

						{#if data.address.state}
							, {data.address.state}
						{/if}

						{#if data.address.country}
							, {data.address.country}
						{/if}

						{#if data.address.zip}
							- {data.address.zip}
						{/if}
					</p>

					{#if data.address.phone}
						<p>
							{data.address.phone}
						</p>
					{/if}

					{#if data.address.email}
						<p>
							{data.address.email}
						</p>
					{/if}
				</div>

				<hr class="mb-5" />
			{:else if data.cart?.shippingAddress}
				<div class="mb-5">
					<h5 class="mb-2">Delivery Address</h5>

					<p>
						{data.cart?.shippingAddress?.first_name || '_'}
						{data.cart?.shippingAddress?.last_name || '_'}

						<br />

						{#if data.cart?.shippingAddress?.address_1}
							{data.cart?.shippingAddress?.address_1}
						{/if}

						{#if data.cart?.shippingAddress?.address_2}
							, {data.cart?.shippingAddress?.address_2}
						{/if}

						{#if data.cart?.shippingAddress?.city}
							, {data.cart?.shippingAddress?.city}
						{/if}

						{#if data.cart?.shippingAddress?.state}
							, {data.cart?.shippingAddress?.state}
						{/if}

						{#if data.cart?.shippingAddress?.country}
							, {data.cart?.shippingAddress?.country}
						{/if}

						{#if data.cart?.shippingAddress?.postal_code}
							- {data.cart?.shippingAddress?.postal_code}
						{/if}
					</p>

					{#if data.cart?.shippingAddress?.phone}
						<p>
							{data.cart?.shippingAddress?.phone}
						</p>
					{/if}

					{#if data.cart?.shippingAddress?.email}
						<p>
							{data.cart?.shippingAddress?.email}
						</p>
					{/if}
				</div>

				<hr class="mb-5" />
			{/if}

			{#if data.prescription}
				<div class="mb-5">
					<h5 class="mb-2">Prescription</h5>

					<div class="text-sm font-light">
						{#if data.prescription.name}
							<div class="my-1 flex flex-row">
								<h6 class="mr-2 w-20 shrink-0">Name</h6>

								<p class="flex-1">
									{data.prescription.name}
								</p>
							</div>
						{/if}

						{#if data.prescription.description}
							<div class="my-1 flex flex-row">
								<h6 class="mr-2 w-20 shrink-0">Note</h6>

								<p class="flex-1">
									{data.prescription.description}
								</p>
							</div>
						{/if}

						{#if data.prescription.url}
							<div>
								<LazyImg
									src="{data.prescription.url}"
									alt=""
									height="80"
									class="h-20 w-auto object-contain object-top text-xs" />
							</div>
						{/if}
					</div>
				</div>

				<hr class="mb-5" />
			{/if}

			<Pricesummary
				cart="{data.cart}"
				text="{errorMessage || 'Confirm Order'}"
				loading="{loading}"
				hideCheckoutButton="{selectedPaymentMethod.name === 'Stripe'}"
				on:submit="{() => submit(selectedPaymentMethod)}" />
			<!-- disabled="{!razorpayReady ||
					(!selectedPaymentMethod?.name && !selectedPaymentMethod?.value) ||
					(selectedPaymentMethod?.name === 'Stripe' && disabled)}" -->

			<TrustBaggeContainer class="mt-5" />
		</div>
	</div>
</div>

{#if loading}
	<div class="fixed inset-0 flex justify-center items-center bg-black bg-opacity-60 p-5 sm:p-10">
		{#if paymentProcessingStep === 1}
			<div
				class="h-60 w-60 bg-white p-4 flex flex-col gap-4 items-center justify-center text-center font-semibold rounded transform translate-x-full animate-slide-in-left">
				<img
					src="/payment-processing/lightning.gif"
					alt=""
					class="h-8 w-auto object-contain object-center" />

				<span> Fetching your order info </span>
			</div>
		{:else if paymentProcessingStep === 2}
			<div
				class="h-60 w-60 bg-white p-4 flex flex-col gap-4 items-center justify-center text-center font-semibold rounded transform animate-bounce">
				<img
					src="/payment-processing/list.gif"
					alt=""
					class="h-8 w-auto object-contain object-center" />

				<span>Filling your information</span>
			</div>
		{:else}
			<div
				class="h-60 w-60 bg-white p-4 flex flex-col gap-4 items-center justify-center text-center font-semibold rounded transform animate-bounce">
				<img
					src="/payment-processing/tick.gif"
					alt=""
					class="h-8 w-auto object-contain object-center" />

				<span>All set</span>
			</div>
		{/if}
	</div>
{/if}
<iframe name="cashfreeFrame" title="Cashfree" class="absolute" allow="payment"></iframe>
