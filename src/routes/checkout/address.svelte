<script lang="ts">
import { get, post, del } from '../../util/api'
import { session } from '$app/stores'
import { onMount } from 'svelte'
import SelectAddress from './_SelectAddress.svelte'
import CartSummaryCheckout from './_CartSummaryCheckout.svelte'
import CheckoutHeader from './_CheckoutHeader.svelte'
import Pricesummary from '$lib/Pricesummary.svelte'
let iconloading = false
let addresses = null
let selectedAddress = null
let loading = false
$: user = $session.user

onMount(() => {
	getAddress()
})
function selectFirstAddress(x) {
	const selectedAddress = x?.addresses?.data[0]['id']
	return selectedAddress
}
function addressChanged(e) {
	selectedAddress = e.detail
}
async function getAddress() {
	try {
		loading = true
		addresses = await get('addresses/my')
		selectedAddress = addresses?.data[0]['_id']
	} catch (e) {
	} finally {
		loading = false
	}
}
async function remove(id) {
	if (confirm('Are you sure to delete?')) {
		try {
			iconloading = true
			await del(`address/delete/${id}`)
			await getAddress()
		} catch (e) {
			console.log(e)
		} finally {
			iconloading = false
			console.log(false)
		}
	}
}
</script>

<section class="container mx-auto max-w-6xl">
	<CheckoutHeader selected="address" />
	<div class="mt-10 lg:flex lg:space-x-10">
		<div class="lg:w-2/3 ">
			<h1 class="text-2xl text-center text-gray-500 lg:text-left font-semibold">
				Select Delivery Address
			</h1>
			<div class="mt-5 mx-auto bg-white border rounded-lg shadow-lg">
				<SelectAddress
					selectedAddress="{selectedAddress}"
					returnUrl="/checkout/edit-address"
					addReturnUrl="/checkout/add"
					on:addressChanged="{addressChanged}" />
			</div>

			<div class="mt-10 max-w-max">
				<a
					href="/checkout/add"
					class="
                  py-3 px-12 text-white font-semibold tracking-wide rounded-md shadow-md flex items-center space-x-1
                  bg-primary-500 hover:bg-primary-700 transition duration-300
                  focus:ring-primary-500 focus:ring-offset-1
                  
                ">
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
							d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
					</svg>
					<span> ADD NEW ADDRESS</span>
				</a>
			</div>
		</div>
		<div class="lg:w-1/3">
			<h1 class="text-2xl text-center text-gray-500 lg:text-left font-semibold">Cart Summary</h1>

			<Pricesummary
				text="Proceed"
				nextpage="{`/checkout/payment-options?address=${selectedAddress}`}"
				loading="{loading}"
				cls="border-t rounded sm:border-t-0 sm:border sm:shadow" />
		</div>
	</div>
</section>
