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

<div class="container mx-auto">
	<CheckoutHeader selected="payment" />
	<div
		class="
        flex flex-col
        max-w-full
        pt-8
        mx-auto
        sm:pb-20
        xl:container
        lg:flex-row
        md:pt-0
      ">
		<div class="w-full lg:w-2/3">
			<div class="flex flex-col w-full">
				<div
					class="
              hidden
              pb-6
              mt-5
              text-2xl text-center text-gray-500
              md:text-start
              md:flex
              lg:mt-0
            ">
					Payment Methods
				</div>
				<div
					class="
                  flex
                  justify-between
                  w-full
                  px-6
                  py-4
                  my-2
                  bg-white
                  rounded
                  shadow-lg
                  cursor-pointer
                ">
					<div class="flex-1">
						<h2 class="text-xl font-black">COD</h2>
					</div>
					<div class="flex items-center">
						<img src="/cod-img.jpg" alt="COD" class="w-16 h-12 mx-4" />
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<div class="container relative w-full mx-auto mt-6 lg:ms-4 lg:w-1/3 lg:mt-0">
	<span
		class="
            hidden
            pb-6
            text-2xl text-center text-gray-500
            lg:text-start
            md:flex
          ">
		Cart Summary
	</span>
	<div class="shadow">
		<Pricesummary
			text="Confirm Order"
			loading="{loading}"
			cls="hidden font-light bg-white rounded sm:flex"
			on:submit="{submit}" />
		<h3
			class="
              pt-5
              pl-5
              my-auto
              text-xl
              font-medium
              text-gray-600
              bg-white
              ps-5
            ">
			Delivery Address:
		</h3>
		{#if addressDetails}
			<div class="p-5 font-light bg-white">
				<strong class="capitalize"> {addressDetails.firstName} {addressDetails.lastName}</strong>
				<div class="mt-1 capitalize">
					{addressDetails.address}
				</div>
				<div class="capitalize">
					{addressDetails.city}
					{addressDetails.state}
					{addressDetails.country}
				</div>
				<div><strong> Pin: </strong>{addressDetails.zip}</div>
				<div class="flex flex-col pt-2">
					<span> <strong> Phone: </strong> {addressDetails.phone}</span>
					<span> <strong> Email: </strong> {addressDetails.email}</span>
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
