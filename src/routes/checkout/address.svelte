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

<section
	class="container  w-full mx-auto max-w-6xl px-4 sm:px-10 pb-10 py-5 md:py-10 text-gray-800 ">
	<CheckoutHeader selected="address" />
	<div class="mt-5 md:mt-10 lg:flex lg:justify-center lg:space-x-10 xl:space-x-20">
		<div class="lg:w-1/2 xl:w-2/3 ">
			<h2 class="text-2xl md:text-3xl lg:text-4xl font-bold tracking-wide ">
				Select Delivery Address
			</h2>

			<div class="mt-5 mx-auto bg-white border rounded-lg shadow-lg">
				<SelectAddress
					selectedAddress="{selectedAddress}"
					returnUrl="/checkout/edit-address"
					addReturnUrl="/checkout/add"
					on:addressChanged="{addressChanged}" />
			</div>

			<div class="my-10 w-1/2">
				<a
					href="/checkout/add"
					class="w-full h-40 sm:h-60 border border-gray-400 border-dashed rounded-md flex flex-col items-center justify-center hover:border-primary-500 group ">
					<div
						class="h-8 w-8 sm:h-10 sm:w-10 rounded-full border border-gray-400  flex items-center justify-center bg-gray-100 group-hover:border-primary-500">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6 text-gray-600 group-hover:text-primary-500"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
						</svg>
					</div>
					<span
						class="mt-2 text-gray-800 group-hover:text-primary-500 text-sm sm:text-base font-medium">
						ADD NEW ADDRESS</span>
				</a>
			</div>
		</div>

		<div class="lg:w-1/2  xl:w-1/3">
			<h2 class="text-2xl md:text-3xl lg:text-4xl font-bold tracking-wide ">Cart Summary</h2>

			<Pricesummary
				text="Proceed"
				nextpage="{`/checkout/payment-options?address=${selectedAddress}`}"
				loading="{loading}"
				cls="border-t rounded sm:border-t-0 sm:border sm:shadow" />
		</div>
	</div>
</section>
