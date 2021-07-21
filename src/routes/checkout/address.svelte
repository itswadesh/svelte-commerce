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

<div class="container mx-auto">
	<div>
		<CheckoutHeader selected="address" />
		<div class="lg:mx-auto lg:container">
			<div class="flex flex-col w-full mx-auto sm:pb-20 lg:flex-row">
				<div class="container flex flex-col mx-auto lg:w-2/3">
					<span class="my-4 text-2xl text-center text-gray-500 lg:text-left">
						Select Delivery Address
					</span>
					<div class="w-full mx-auto mb-4 bg-white rounded shadow">
						<SelectAddress
							selectedAddress="{selectedAddress}"
							returnUrl="/checkout/edit-address"
							addReturnUrl="/checkout/add"
							on:addressChanged="{addressChanged}" />
					</div>
					<a
						href="/checkout/add"
						class="
                block
                  w-full
                  p-3
                  bg-secondary-500
                  focus:ring-secondary-500
                  md:w-1/3 md:mt-0
                ">
						ADD NEW ADDRESS
					</a>
				</div>
				<div
					class="
              container
              relative
              flex flex-col
              w-full
              mx-auto
              mt-6
              lg:ms-4 lg:w-1/3 lg:-mt-0
            ">
					<span
						class="
                hidden
                w-full
                mx-auto
                text-2xl text-center text-gray-500
                sm:my-4
                lg:text-start
                sm:flex
              ">
						Cart Summary
					</span>
					<div class="">
						<Pricesummary
							text="Proceed"
							nextpage="{`/checkout/payment-options?address=${selectedAddress}`}"
							loading="{loading}"
							cls="border-t rounded sm:border-t-0 sm:border sm:shadow" />
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
