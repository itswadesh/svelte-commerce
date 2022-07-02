<style>
.frosted-black {
	backdrop-filter: blur(12px);
	background-color: hsla(0, 0%, 0%, 0.5);
}

.z-index {
	z-index: 99999;
}
</style>

<script context="module" lang="ts">
export async function load({ url, params, fetch, session, context }) {
	let addressId = url.searchParams.get('address')
	let prescriptionId = url.searchParams.get('prescription')
	let loading, err, address, prescription, paymentMethods

	try {
		loading = true

		paymentMethods = (await KQL_PaymentMethods.query({ fetch, variables: { store: store?.id } }))
			.data?.paymentMethods.data

		address = (
			await KQL_Address.query({
				fetch,
				variables: {
					id: addressId
				}
			})
		).data?.address
	} catch (e) {
		err = e
	} finally {
		loading = false
	}
	return { props: { loading, address, err, paymentMethods, prescription, addressId } }
}
</script>

<script>
import SEO from '$lib/components/SEO/index.svelte'
import {
	KQL_Address,
	KQL_Cart,
	KQL_CashfreePayNowNew,
	KQL_Checkout,
	KQL_PaymentMethods
} from '$lib/graphql/_kitql/graphqlStores'
import { store, toast } from '$lib/util'
import Error from '$lib/Error.svelte'
import Pricesummary from '$lib/components/Pricesummary.svelte'
import ImageLoader from '$lib/components/Image/ImageLoader.svelte'
import { goto } from '$app/navigation'
import CheckoutHeader from '$lib/components/CheckoutHeader.svelte'
import Stripe from '$lib/Stripe.svelte'
import { fly } from 'svelte/transition'
import Textbox from '$lib/ui/Textbox.svelte'
import Textarea from '$lib/ui/Textarea.svelte'
import PrimaryButton from '$lib/ui/PrimaryButton.svelte'

const seoProps = {
	title: 'Payment-Methods',
	metadescription: 'Choose your payment methods'
}

export let loading, err, paymentMethods, address, prescription, addressId

let errorMessage = 'Select a Payment Method',
	disabled = true,
	showPayWithBankTransfer = false,
	bankPayment = {
		type: 'order',
		reference: '',
		remark: '',
		paymentMethodId: '',
		amount: Math.floor($KQL_Cart?.data?.cart.subtotal)
	},
	selectedPaymentMethod = { id: '', name: '', text: '', instructions: '', qrcode: '', img: '' }

function paymentMethodChanged(pm) {
	selectedPaymentMethod = pm
	errorMessage = null
	if (selectedPaymentMethod.name === 'ABA Bank') {
		showPayWithBankTransfer = true
		selectedPaymentMethod = pm
	}

	// if (pm.value === 'Stripe') {
	// 	setupStripeElement()
	// } else if (pm.value === 'Paypal') {
	// 	getDropinInstance()
	// }
}

async function submit(pm) {
	if (!pm || pm === undefined) {
		disabled = true
		errorMessage = 'Select a Payment Method'
		toast('Please select a payment method', 'error')
		return
	}

	const paymentMethod = pm.value
	const paymentMethod2 = pm.name
	// console.log('paymentMethod = ', paymentMethod)
	// const vm = this
	if (paymentMethod === 'COD') {
		try {
			loading = true

			const res = (
				await KQL_Checkout.mutate({
					variables: {
						address: address.id
					}
				})
			).data?.checkout

			if (res?.paymentReferenceId && res?.paymentReferenceId !== null) {
				goto(`/payment/success?order_id=${res?.id}&payment_reference_id=${res?.paymentReferenceId}`)
			} else {
				goto(`/payment/success?order_id=${res?.id}`)
			}
		} catch (e) {
			toast(e, 'error')
		} finally {
			loading = false
		}
	} else if (paymentMethod === 'Cashfree') {
		if (loading) return
		try {
			loading = true
			const cashFreePayload = (
				await KQL_CashfreePayNowNew.mutate({
					variables: { address: address.id }
				})
			).data.cashfreePayNowNew
			if (!cashFreePayload) {
				toast('Cashfree not available', 'error')
				return
			}
			const url = cashFreePayload.redirectUrl
			window.location.href = url
		} catch (e) {
		} finally {
			loading = false
		}
	}
}

function cancelBankModal() {
	showPayWithBankTransfer = false
	selectedPaymentMethod = { id: '', name: '', text: '', instructions: '', qrcode: '', img: '' }
}
</script>

<SEO {...seoProps} />

<Error err="{err}" />
<div class="container  mx-auto w-full max-w-6xl px-4 py-5 pb-10 text-gray-800 sm:px-10 md:py-10 ">
	<CheckoutHeader selected="payment" />

	<div class="mt-10 flex flex-col gap-10 md:flex-row md:justify-center xl:gap-20">
		<div class="w-full flex-1">
			<h2 class="mb-5 text-xl font-bold capitalize tracking-wide sm:text-2xl">Payment Methods</h2>

			{#if paymentMethods}
				<div class="flex w-full flex-col gap-4">
					{#each paymentMethods as pm}
						<label
							class="flex w-full cursor-pointer items-center gap-2 rounded-md border border-gray-300 p-4 shadow-md transition duration-300 hover:bg-primary-50 sm:gap-4">
							<input
								bind:group="{selectedPaymentMethod}"
								type="radio"
								value="{pm}"
								name="group"
								class="h-4 w-4 focus:outline-none focus:ring-0 focus:ring-offset-0"
								on:click="{() => paymentMethodChanged(pm)}" />

							<div class="flex w-full flex-1 items-center justify-between gap-4">
								<h2 class="text-xl font-semibold" style="color:{pm.color}">
									{pm.name}
								</h2>

								<div>
									<ImageLoader
										src="{pm.imgCdn}"
										alt="{pm.name}"
										class="h-1w-14 w-14 rounded-full border-2 border-gray-300 object-cover object-center text-xs" />
								</div>
							</div>
						</label>
					{/each}
				</div>
			{:else}
				<div
					class="h-[50vh] bg-white flex items-center justify-center rounded-xl p-4 shadow-xl border">
					<div class="max-w-md mx-auto flex flex-col items-center justify-center text-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="mb-5 h-10 w-10"
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

						<p class="mb-2 font-bold capitalize">We are very sorry!!</p>

						<p class="text-sm text-gray-500">
							There's no payment methode is available. If you are an admin, then add a payment
							methode as fast as possible
						</p>
					</div>
				</div>
			{/if}

			<!-- <Stripe address="{addressId}" /> -->
		</div>

		<div class="w-full md:w-80 md:flex-shrink-0 md:flex-grow-0">
			<h2 class="text-xl font-bold capitalize tracking-wide sm:text-2xl">Cart Summary</h2>

			<div class="mt-5 border-t pt-5">
				<h5 class="mb-2 text-xl font-bold capitalize tracking-wide">Delivery Address</h5>

				{#if address}
					<div class="text-sm font-light">
						<div class="my-1 flex flex-row">
							<h5 class="mr-2 w-20 flex-shrink-0 font-semibold tracking-wide">Name</h5>

							<p>
								{address.firstName}
								{address.lastName}
							</p>
						</div>

						<div class="flex flex-row">
							<h5 class="mr-2 w-20 flex-shrink-0 font-semibold tracking-wide">Address</h5>

							<p class="flex flex-wrap items-center">
								{#if address.address}
									{address.address}
								{/if}

								{#if address.locality}
									, {address.locality}
								{/if}

								{#if address.city}
									, {address.city}
								{/if}

								{#if address.state}
									, {address.state}
								{/if}

								{#if address.country}
									, {address.country}
								{/if}
							</p>
						</div>

						<div class="my-1 flex flex-row">
							<h5 class="mr-2 w-20 flex-shrink-0 font-semibold tracking-wide">Pin</h5>

							<h6>{address.zip}</h6>
						</div>

						<div class="my-1 flex flex-row">
							<h5 class="mr-2 w-20 flex-shrink-0 font-semibold tracking-wide">Phone</h5>

							<h6>{address.phone}</h6>
						</div>

						<div class="my-1 flex flex-row flex-wrap">
							<h5 class="mr-2 w-20 flex-shrink-0 font-semibold tracking-wide">Email</h5>

							<h6>{address.email}</h6>
						</div>
					</div>
				{/if}
			</div>

			<Pricesummary
				text="{errorMessage || 'Confirm Order'}"
				loading="{loading}"
				disabled="{!selectedPaymentMethod && disabled}"
				on:submit="{() => submit(selectedPaymentMethod)}" />
		</div>
	</div>
</div>
