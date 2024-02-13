<script lang="ts">
import { fireGTagEvent } from '$lib/utils/gTagB'
import { goto } from '$app/navigation'
import { onMount } from 'svelte'
import { page } from '$app/stores'
import { PaymentLoading } from '$lib/ui'
import { Pricesummary, LazyImg, CheckoutHeader, Error, TrustBaggeContainer } from '$lib/components'
import { slide } from 'svelte/transition'
import { toast } from '$lib/utils'
import SEO from '$lib/components/SEO/index.svelte'
import TextboxFloating from '$lib/ui/TextboxFloating.svelte'
import { services } from '@misiki/litekart-utils'
const seoProps = {
	title: 'Select Payment Option',
	metaDescription: 'Choose your payment method'
}

export let data
// console.log('zzzzzzzzzzzzzzzzzz', data)
// console.log('$page', $page)

let addressId = $page.url.searchParams.get('address') || ''
let cashfreeReady = false
let comment = ''
let commentMissing = false
let disabled = false
let errorMessage = 'Select a Payment Method'
let loading = false
let loadingForPaymentProcessingSteps = false
let orderNo = $page.url.searchParams.get('order_no') || ''
let paymentDenied = false
let pg = $page.url.searchParams.get('pg') || ''
let razorpayReady = false
let selectedPaymentMethod = { id: '', name: '', text: '', instructions: '', qrcode: '', img: '' }
let Stripe

$: if (data.err) {
	toast(data.err, 'error')
}

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

	if (pg) {
		const pm = data?.paymentMethods.filter((pm) => pm.value === pg)
		// console.log('pm', pm)
		if (pm[0]) paymentMethodChanged(pm[0])
		// } else if (
		// 	data.paymentMethods?.length === 1 &&
		// 	data.paymentMethods[0].type === 'pg' &&
		// 	!orderNo
		// ) {
		// 	submit(data.paymentMethods[0])
	} else {
		const pm = data?.paymentMethods && data?.paymentMethods[0]
		// console.log('pm', pm)
		paymentMethodChanged(pm)
	}
})

function paymentMethodChanged(pm) {
	selectedPaymentMethod = pm
	errorMessage = null
}

async function submit(pm) {
	if (!data?.cart?.qty) {
		goto('/my/orders?sort=-updatedAt')
		return
	}

	// console.log('started')

	fireGTagEvent('add_payment_info', data?.cart)

	if (!pm || pm === undefined) {
		disabled = true
		errorMessage = 'Please select a payment option'
		toast('Please select a payment option', 'error')
		return
	}

	const paymentMethod = pm.value || pm.id

	// console.log('paymentMethod', paymentMethod)

	if (
		paymentMethod === 'COD' ||
		paymentMethod === 'manual' ||
		paymentMethod === 'BankTransfer' ||
		paymentMethod === 'Cashfree' ||
		paymentMethod === 'Phonepe' ||
		paymentMethod === 'Paypal' ||
		paymentMethod === 'Razorpay'
	) {
		if (paymentMethod === 'COD' || paymentMethod === 'manual') {
			try {
				data.err = null
				loading = true
				loadingForPaymentProcessingSteps = true

				const res = await services.OrdersService.codCheckout({
					address: addressId,
					cartId: $page.data.cartId,
					paymentMethod: 'COD',
					prescription: data.prescription?._id,
					origin: $page.data.origin,
					storeId: $page?.data?.storeId
				})

				// console.log('res of cod', res)

				goto(
					`/payment/process?order_no=${res?.order_no || res?.orderNo || ''}&status=PAYMENT_SUCCESS&provider=COD`
				)
			} catch (e) {
				data.err = e
				gotoOrder(orderNo)
			} finally {
				loading = false
			}
		} else if (paymentMethod === 'BankTransfer') {
			if (comment) {
				try {
					data.err = null
					loading = true
					loadingForPaymentProcessingSteps = true

					const res = await services.OrdersService.codCheckout({
						address: addressId,
						cartId: data?.cartId,
						comment,
						paymentMethod: 'COD',
						prescription: data.prescription?._id,
						origin: $page.data.origin,
						storeId: $page?.data?.storeId
					})

					// console.log('res of cod', res)

					comment = ''

					goto(
						`/payment/process?order_no=${res?.order_no || res?.orderNo || ''}&status=PAYMENT_SUCCESS&provider=COD`
					)
				} catch (e) {
					data.err = e
					gotoOrder(orderNo)
				} finally {
					loading = false
				}
			} else {
				toast('Please enter your transaction id to place your order', 'info')

				commentMissing = true

				setTimeout(() => {
					commentMissing = false
				}, 820)
			}
		} else if (paymentMethod === 'Cashfree') {
			try {
				data.err = null
				loading = true
				loadingForPaymentProcessingSteps = true

				const res = await services.OrdersService.cashfreeCheckout({
					address: addressId,
					orderNo,
					origin: $page.data.origin,
					storeId: $page?.data?.storeId,
					cartId: $page.data.cartId
				})

				orderNo = res?.order_no || res?.orderNo || ''

				if (!res.payment_session_id) {
					data.err = 'Payment failed. Try again'
					toast('Payment failed. Try again', 'error')
				}

				const cashfree = Cashfree({ mode: res.payment_mode })

				cashfree
					.checkout({
						paymentSessionId: res.payment_session_id,
						redirectTarget: '_parent',
						returnUrl: res.order_meta?.return_url
					})
					.then(function () {})

				// if (res?.redirectUrl && res?.redirectUrl !== null) {
				// 	goto(`${res?.redirectUrl}`)
				// } else {
				// 	toast('Something went wrong', 'error')
				// }
			} catch (e) {
				data.err = e
				toast(`Payment failed, please try again`, 'error')
				gotoOrder(orderNo)

				// goto(`/payment/failed?id=${addressId}&status=PAYMENT_PENDING&provider=Cashfree`)
			} finally {
				loading = false
			}
		} else if (paymentMethod === 'Phonepe') {
			try {
				data.err = null
				loading = true
				loadingForPaymentProcessingSteps = true
				const res = await services.OrdersService.phonepeCheckout({
					address: addressId,
					origin: $page.data.origin,
					cartId: $page.data.cartId,
					storeId: $page?.data?.storeId,
					orderNo
				})

				// console.log('res of Phonepe', res)

				if (res?.redirectUrl && res?.redirectUrl !== null) {
					goto(`${res?.redirectUrl}`)
				} else {
					toast('Something went wrong', 'error')
				}
			} catch (e) {
				data.err = e
				gotoOrder(orderNo)
			} finally {
				loading = false
			}
		} else if (paymentMethod === 'Paypal') {
			try {
				data.err = null
				loading = true
				loadingForPaymentProcessingSteps = true

				const res = await services.OrdersService.paypalCheckout({
					address: addressId,
					orderNo,
					cartId: $page.data.cartId,
					origin: $page.data.origin,
					storeId: $page?.data?.storeId
				})

				orderNo = res?.order_no || res?.orderNo || ''
				gotoOrder(orderNo)
				// console.log('res of Paypal', res)

				if (res?.redirect_url && res?.redirect_url !== null) {
					window.location = res?.redirect_url
				} else {
					toast('Something went wrong', 'error')
				}
			} catch (e) {
				data.err = e
				gotoOrder(orderNo)
			} finally {
				loading = false
			}
		} else if (paymentMethod === 'Razorpay') {
			try {
				data.err = null
				loading = true
				loadingForPaymentProcessingSteps = true

				const rp = await services.OrdersService.razorpayCheckout({
					address: addressId,
					orderNo,
					cartId: $page.data.cartId,
					origin: $page.data.origin,
					storeId: $page?.data?.storeId
				})

				orderNo = rp?.order_no || rp?.orderNo || ''
				gotoOrder(orderNo)

				const options = {
					key: rp.keyId, // Enter the Key ID generated from the Dashboard
					description: `Order ${orderNo}`,
					amount: rp.amount,
					order_id: rp.id,
					async handler(response) {
						try {
							const capture = await services.OrdersService.razorpayCapture({
								rpOrderId: response.razorpay_order_id,
								rpPaymentId: response.razorpay_payment_id,
								origin: $page.data.origin,
								storeId: $page?.data?.storeId
							})

							toast('Payment success', 'success')
							goto(
								`/payment/process?pg=razorpay&order_no=${capture?.order_no || capture?.orderNo || ''}`
							)
						} catch (e) {
							data.err = e
						} finally {
						}
					},
					prefill: {
						name: `${data.me.firstName} ${data.me.lastName}`,
						phone: data.me.phone,
						email: data.me.email || data.address.email || 'help@zapvi.in',
						contact: data.me.phone
					}
				}

				const rzp1 = new Razorpay(options)
				rzp1.open()
			} catch (e) {
				data.err = e
				toast(`Payment failed, please try again`, 'error')
				gotoOrder(orderNo)
			} finally {
				loading = false
			}
		}
	} else {
		paymentDenied = true

		setTimeout(() => {
			paymentDenied = false
		}, 820)
	}
}

function gotoOrder(orderNo) {
	const u = new URL($page.url)
	u.searchParams.set('order_no', orderNo)
	goto(u.toString())
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
							class="flex items-start w-full cursor-pointer gap-2 rounded border border-zinc-200 p-5 shadow-md transition duration-300 hover:bg-primary-50 sm:gap-4">
							<input
								bind:group="{selectedPaymentMethod}"
								type="radio"
								value="{pm}"
								name="group"
								class="h-4 w-4 focus:outline-none focus:ring-0 focus:ring-offset-0"
								on:click="{() => paymentMethodChanged(pm)}" />

							<div class="w-full flex-1 flex flex-col gap-2">
								<div class="flex justify-between gap-4">
									<div class="flex-1">
										<h4 style="color:{pm?.color}" class="leading-3 capitalize">
											{pm?.name || pm?.value || pm?.id}
										</h4>

										<p class="mt-2">
											{#if pm?.text}
												{@html pm.text}
											{:else}
												Payment securly
											{/if}
										</p>
									</div>

									<div class="shrink-0">
										{#if pm?.img}
											<img
												src="{pm.img}"
												alt="{pm.name}"
												width="48"
												height="48"
												class="h-10 w-10 rounded-full border object-cover object-center text-xs" />
										{:else}
											<div
												class="flex h-10 w-10 p-2 items-center justify-center rounded-full border bg-zinc-200 text-center text-xs uppercase">
												<span class="w-full truncate">
													{pm?.name || pm?.value || pm?.id}
												</span>
											</div>
										{/if}
									</div>
								</div>

								{#if pm?.value === 'BankTransfer' && selectedPaymentMethod?.value === 'BankTransfer'}
									<div transition:slide="{{ duration: 300 }}" class:wiggle="{commentMissing}">
										<TextboxFloating bind:value="{comment}" label="Transaction ID" />
									</div>
								{/if}

								{#if pm?.value === 'Stripe'}
									<div transition:slide="{{ duration: 300 }}">
										<svelte:component
											this="{Stripe}"
											address="{addressId}"
											isStripeSelected="{selectedPaymentMethod.value === 'Stripe'}"
											stripePublishableKey="{pm.app_id}"
											on:isStripeCardValid="{checkIfStripeCardValid}" />
									</div>
								{/if}
							</div>
						</label>
					{/each}
				</div>
			{:else}
				<div class="flex flex-col h-1/2 items-center justify-center p-4 text-zinc-500 text-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="mb-2 w-10 h-10">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
						></path>
					</svg>
					<h6 class="mb-2 capitalize">We are very sorry!!</h6>

					<p>
						<span> Payment method is not setup yet, </span>

						<a href="/contact-us" class="block underline hover:text-zinc-800">
							Please contact the store admin.
						</a>
					</p>
				</div>
			{/if}
		</div>

		<div class="w-full lg:w-96 lg:shrink-0 lg:grow-0">
			<h2 class="mb-5">Cart Summary</h2>

			<hr class="mb-5" />

			{#if data.cart?.shipping_address}
				<div class="mb-5">
					<h5 class="mb-2">Delivery Address</h5>

					<p>
						{data.cart?.shipping_address?.firstName || '_'}
						{data.cart?.shipping_address?.lastName || '_'}

						<br />

						{#if data.cart?.shipping_address?.address}
							{data.cart?.shipping_address?.address}
						{/if}

						{#if data.cart?.shipping_address?.city}
							, {data.cart?.shipping_address?.city}
						{/if}

						{#if data.cart?.shipping_address?.state}
							, {data.cart?.shipping_address?.state}
						{/if}

						{#if data.cart?.shipping_address?.country}
							, {data.cart?.shipping_address?.country}
						{/if}

						{#if data.cart?.shipping_address?.zip}
							- {data.cart?.shipping_address?.zip}
						{/if}
					</p>

					{#if data.cart?.shipping_address?.phone}
						<p>
							{data.cart?.shipping_address?.phone}
						</p>
					{/if}

					{#if data.cart?.shipping_address?.email}
						<p>
							{data.cart?.shipping_address?.email}
						</p>
					{/if}
				</div>

				<hr class="mb-5" />
			{/if}

			{#if data.cart?.billing_address}
				<div class="mb-5">
					<h5 class="mb-2">Billing Address</h5>

					<p>
						{data.cart?.billing_address?.firstName || '_'}
						{data.cart?.billing_address?.lastName || '_'}

						<br />

						{#if data.cart?.billing_address?.address}
							{data.cart?.billing_address?.address}
						{/if}

						{#if data.cart?.billing_address?.city}
							, {data.cart?.billing_address?.city}
						{/if}

						{#if data.cart?.billing_address?.state}
							, {data.cart?.billing_address?.state}
						{/if}

						{#if data.cart?.billing_address?.country}
							, {data.cart?.billing_address?.country}
						{/if}

						{#if data.cart?.billing_address?.zip}
							- {data.cart?.billing_address?.zip}
						{/if}
					</p>

					{#if data.cart?.billing_address?.phone}
						<p>
							{data.cart?.billing_address?.phone}
						</p>
					{/if}

					{#if data.cart?.billing_address?.email}
						<p>
							{data.cart?.billing_address?.email}
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
				text="{errorMessage || 'Confirm Order'}"
				{loading}
				hideCheckoutButton="{selectedPaymentMethod?.name === 'Stripe'}"
				on:submit="{() => submit(selectedPaymentMethod)}" />

			<TrustBaggeContainer class="mt-5" />
		</div>
	</div>
</div>

{#if loadingForPaymentProcessingSteps}
	<PaymentLoading bind:loadingForPaymentProcessingSteps />
{/if}

<iframe name="cashfreeFrame" title="Cashfree" allow="payment"></iframe>
