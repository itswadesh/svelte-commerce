<script>
import SEO from '$lib/components/SEO/index.svelte'
import Pricesummary from '$lib/components/Pricesummary.svelte'
import SelectAddress from '../_SelectAddress.svelte'
import Error from '$lib/components/Error.svelte'
import CheckoutHeader from '$lib/components/CheckoutHeader.svelte'
import { getAPI } from '$lib/util/api'
import { page } from '$app/stores'

export let data
$: ({ cart, loading, myAddresses, err, prescriptionId, selectedAddress } = data)

const seoProps = {
	title: 'Address ',
	metadescription: 'Address'
}

function addressChanged(detail) {
	// console.log('detail = ', detail)

	selectedAddress = detail.detail
}

async function refreshAddress() {
	try {
		myAddresses = await getAPI('addresses/my')
		selectedAddress = myAddresses?.data[0]?._id
	} catch (e) {
		err = e
	} finally {
	}
}
</script>

<SEO {...seoProps} />

<div class="container mx-auto min-h-screen w-full max-w-6xl p-3 py-5 sm:p-10">
	<Error err="{err}" />

	<CheckoutHeader selected="address" />
	<!-- isPrescription="{cart.needPrescription}" -->

	<div class="mt-5 md:mt-10 lg:flex lg:justify-center lg:gap-10 xl:gap-20">
		<div class="w-full flex-1">
			<h1 class="text-xl font-bold capitalize tracking-wide sm:text-2xl">
				Select Delivery Address
			</h1>

			{#if myAddresses?.count > 0}
				<div class="mx-auto mt-5 rounded-lg border bg-white shadow-lg">
					{#each myAddresses.data as ads}
						<SelectAddress
							loading="{loading}"
							address="{ads}"
							selectedAddress="{selectedAddress}"
							on:deleteAddress="{refreshAddress}"
							on:addressChanged="{({ detail }) => addressChanged({ detail })}" />
					{/each}
				</div>
			{:else}
				<hr class="mt-5" />
			{/if}

			<div class="my-10 w-1/2">
				<a
					href="/checkout/add-address?id=new"
					aria-label="Click to route add address"
					class="group flex h-40 w-full flex-col items-center justify-center rounded-md border border-dashed border-gray-400 hover:border-blue-500 sm:h-60 ">
					<div
						class="flex h-8 w-8 items-center justify-center rounded-full border  border-gray-400 bg-gray-50 group-hover:border-blue-500 sm:h-10 sm:w-10">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6 text-gray-600 group-hover:text-blue-500"
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
						class="mt-2 text-sm font-medium text-gray-800 group-hover:text-blue-500 sm:text-base">
						ADD NEW ADDRESS
					</span>
				</a>
			</div>
		</div>

		<div class="w-full lg:w-80 lg:flex-shrink-0 lg:flex-grow-0">
			<h2 class="text-xl font-bold capitalize tracking-wide sm:text-2xl">Cart Summary</h2>

			{#if selectedAddress}
				<Pricesummary
					cart="{cart}"
					text="Proceed"
					showNextIcon
					nextpage="
				    {prescriptionId
						? `/checkout/payment-options?address=${selectedAddress}&prescription=${prescriptionId}`
						: `/checkout/payment-options?address=${selectedAddress}`}"
					loading="{loading}" />
			{:else}
				<Pricesummary cart="{cart}" text="Please select address" loading="{loading}" />
			{/if}
		</div>
	</div>
</div>
