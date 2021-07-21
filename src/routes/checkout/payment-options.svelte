<script context="module" lang="ts">
export async function load({ page: { query }, fetch }) {
	const address = query.get('address')
	return { props: { address } }
}
</script>

<script>
import { goto } from '$app/navigation'

import Pricesummary from '$lib/Pricesummary.svelte'

import Radio from '$lib/ui/Radio.svelte'
import { onMount } from 'svelte'
import { toasts } from 'svelte-toasts'
import { del, get, post } from '../../util/api'
import CheckoutHeader from './_CheckoutHeader.svelte'

let loading = false
let paymentMethod = null
export let address
let addressDetails = {
	id: '',
	firstName: '',
	lastName: '',
	email: '',
	address: '',
	town: '',
	city: '',
	country: '',
	zip: '',
	phone: '',
	state: '',
}
onMount(() => {
	getAddress()
})
async function submit() {
	if (loading) return
	try {
		loading = true
		console.log('Checkout')
		if (!address) {
			showToast('Address not provided.', 'error')
			return
		}
		const order = await post('orders', { address: addressDetails, paymentMethod: 'COD' })
		goto(`/payment/success?id=${order._id}&provider=COD`)
	} catch (err) {
		showToast(err, 'error')
		goto(`/payment/failed?provider=COD`)
	} finally {
		loading = false
	}
}
const showToast = (title, type) => {
	const toast = toasts.add({
		title: title,
		description: '',
		duration: 5000, // 0 or negative to avoid auto-remove
		type: type || 'info',
		theme: 'dark',
		placement: 'top-center',
		showProgress: false,
		onClick: () => {},
		onRemove: () => {},
		// component: BootstrapToast, // allows to override toast component/template per toast
	})
}
async function getAddress() {
	try {
		loading = true
		addressDetails = await get(`addresses/${address}`)
	} catch (e) {
	} finally {
		loading = false
	}
}
</script>

<div class="container  w-full mx-auto max-w-6xl text-gray-500 pb-20">
	<CheckoutHeader selected="payment" />
	<div class="mt-10 lg:flex lg:justify-center lg:space-x-10">
		<div class="lg:w-3/5">
			<h1 class="text-2xl text-center  lg:text-left font-semibold">Cart Summary</h1>

			<div class="mt-5 p-6 mx-auto bg-white border rounded-lg shadow-lg">
				<h5 class="capitalize font-semibold tracking-wide text-lg">Delivery Address:</h5>

				{#if addressDetails}
					<div class="px-5 py-2 font-light bg-white">
						<h5 class="capitalize font-semibold tracking-wide text-lg">
							{addressDetails.firstName}
							{addressDetails.lastName}
						</h5>

						<div class="flex flex-row my-1 sm:w-2/3">
							<h5 class="font-semibold tracking-wide me-2 w-20">Address:</h5>
							<h6 class="flex flex-col">
								<span>{addressDetails.address},</span><span
									>{addressDetails.city}, {addressDetails.state}, {addressDetails.country}</span>
							</h6>
						</div>

						<div class="flex flex-row my-1">
							<h5 class="font-semibold tracking-wide me-2 w-20">Pin:</h5>
							<h6>{addressDetails.zip}</h6>
						</div>

						<div class="flex flex-row my-1">
							<h5 class="font-semibold tracking-wide me-2 w-20">Phone:</h5>
							<h6>{addressDetails.phone}</h6>
						</div>

						<div class="flex flex-row flex-wrap my-1">
							<h5 class="font-semibold tracking-wide me-2 w-20">Email:</h5>
							<h6>{addressDetails.email}</h6>
						</div>
					</div>
				{/if}
			</div>
			<Pricesummary
				text="Confirm Order"
				cls="bg-white rounded sm:hidden"
				loading="{loading}"
				on:submit="{submit}" />
		</div>

		<div class="lg:w-2/5">
			<h1 class="text-2xl text-center  lg:text-left font-semibold">Payment Methods</h1>

			<div
				class="mt-5 p-6 mx-auto bg-white border rounded-lg shadow-lg flex items-center justify-between">
				<h2 class="text-xl font-semibold">COD</h2>

				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
					></path>
				</svg>
			</div>
		</div>
	</div>
</div>
