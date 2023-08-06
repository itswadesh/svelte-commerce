<script>
import { CartService } from '$lib/services'
import { CheckoutHeader, Error, Pricesummary } from '$lib/components'
import { goto, invalidateAll } from '$app/navigation'
import { page } from '$app/stores'
import SelectAddress from '../_SelectAddress.svelte'
import SEO from '$lib/components/SEO/index.svelte'

export let data
console.log('zzzzzzzzzzzzzzzzzz', data)

const seoProps = {
	title: 'Address ',
	metaDescription: 'Address'
}

function addressChanged(detail) {
	data.selectedAddress = detail.detail
}

async function updateCart() {
	try {
		// console.log('selectedAddress', data.selectedAddress)

		const selectedAddressFullObject = data.myAddresses?.data.filter((add) => {
			return add.id === data.selectedAddress || add._id === data.selectedAddress
		})

		// console.log('selectedAddressFullObject', selectedAddressFullObject)

		if (selectedAddressFullObject[0]) {
			const res = await CartService.updateCart({
				billingAddress: selectedAddressFullObject[0],
				cartId: data?.cartId,
				email: selectedAddressFullObject[0].email,
				shippingAddress: selectedAddressFullObject[0],
				storeId: $page.data?.store?.id
			})

			// console.log('updated cart res =', res)

			if (data.prescriptionId) {
				goto(
					`/checkout/payment-options?address=${data.selectedAddress}&prescription=${data.prescriptionId}`
				)
			} else {
				goto(`/checkout/payment-options?address=${data.selectedAddress}`)
			}
		}
	} catch (e) {
	} finally {
	}
}

async function refreshAddress() {
	invalidateAll()
}
</script>

<SEO {...seoProps} />

<div class="container mx-auto min-h-screen w-full max-w-6xl p-3 py-5 sm:p-10">
	<Error err="{data.err}" class="mb-5" />

	<CheckoutHeader selected="address" />
	<!-- isPrescription="{cart.needPrescription}" -->

	<div
		class="mb-14 lg:mb-0 mt-5 md:mt-10 flex flex-col lg:flex-row lg:justify-center gap-10 xl:gap-20">
		<div class="w-full flex-1">
			<h2 class="mb-5">Select Delivery Address</h2>

			{#if data.myAddresses?.data?.length}
				<div class="mb-5 rounded-lg border bg-white shadow-lg">
					{#each data.myAddresses.data as ads}
						<SelectAddress
							address="{ads}"
							loading="{data.loading}"
							selectedAddress="{data.selectedAddress}"
							on:deleteAddress="{refreshAddress}"
							on:addressChanged="{({ detail }) => addressChanged({ detail })}" />
					{/each}
				</div>
			{/if}

			<div>
				{#if !data.myAddresses?.data?.length}
					<hr class="mb-5" />
				{/if}

				<a
					href="/checkout/add-address?id=new"
					aria-label="Click to visit add address"
					class="group flex h-40 w-1/2 flex-col items-center justify-center rounded border border-dashed border-zinc-400 hover:border-blue-500 sm:h-60">
					<div
						class="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-400 bg-zinc-50 group-hover:border-blue-500 sm:h-10 sm:w-10">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6 text-zinc-500 group-hover:text-blue-500"
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
						class="mt-2 text-sm font-medium text-zinc-800 group-hover:text-blue-500 sm:text-base">
						ADD NEW ADDRESS
					</span>
				</a>
			</div>
		</div>

		<div class="w-full lg:w-80 lg:shrink-0 lg:grow-0">
			<h2 class="mb-5">Cart Summary</h2>

			<hr class="mb-5" />

			{#if data.selectedAddress}
				<Pricesummary
					cart="{data.cart}"
					text="Proceed"
					showNextIcon
					on:submit="{updateCart}"
					loading="{data.loading}" />
			{:else}
				<Pricesummary
					cart="{data.cart}"
					text="Please select address"
					disabled="{true}"
					loading="{data.loading}" />
			{/if}
		</div>
	</div>
</div>
