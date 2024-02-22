<script>
import { CheckoutHeader, Error, Pricesummary, TrustBaggeContainer } from '$lib/components'
import { goto, invalidateAll } from '$app/navigation'
import { onMount } from 'svelte'
import { page } from '$app/stores'
import { slide } from 'svelte/transition'
import Modal from '$lib/components/Modal.svelte'
import SaveAddress from '../../my/addresses/_SaveAddress.svelte'
import SelectAddress from '../_SelectAddress.svelte'
import SelectBillingAddress from '../_SelectBillingAddress.svelte'
import SEO from '$lib/components/SEO/index.svelte'
import { services } from '@misiki/litekart-utils'

export let data
// console.log('zzzzzzzzzzzzzzzzzz', data)

const seoProps = {
	title: 'Address ',
	metaDescription: 'Address'
}

let billing_address = data?.cart?.billing_address || {}
let displayAllDeliveryAddress = false
let isSameAsBillingAddressWithLogIn = true
let loading = false
let newAddress = {}
let selectedAddress = data?.cart?.shipping_address_id || data?.preSelectedAddress
let selectedBillingAddress = data?.cart?.billing_address_id || data?.preSelectedAddress
let shipping_address = data?.cart?.shipping_address || {}
let showAddNewAddressModal = false

onMount(() => {
	// Here we are not taking id for if condition, because in case of guest checkout both id will be same 'new'

	if (
		shipping_address &&
		billing_address &&
		shipping_address.address === billing_address.address &&
		shipping_address.zip === billing_address.zip
	) {
		isSameAsBillingAddressWithLogIn = true
	} else if (!billing_address.firstName) {
		isSameAsBillingAddressWithLogIn = true
	} else {
		isSameAsBillingAddressWithLogIn = false
	}
})

function addressChanged(detail) {
	selectedAddress = detail.detail

	if (isSameAsBillingAddressWithLogIn) {
		selectedBillingAddress = selectedAddress
	}
}

function billingAddressChanged(detail) {
	selectedBillingAddress = detail.detail
}

async function updateCart() {
	try {
		if (isSameAsBillingAddressWithLogIn) {
			selectedBillingAddress = selectedAddress
		}

		const selectedAddressFullObject = data.myAddresses?.data.filter((add) => {
			return add.id === selectedAddress || add._id === selectedAddress
		})

		const selectedBillingAddressFullObject = data.myAddresses?.data.filter((add) => {
			return add.id === selectedBillingAddress || add._id === selectedBillingAddress
		})

		if (selectedAddressFullObject[0] && selectedBillingAddressFullObject[0]) {
			const res = await services.CartService.updateCart({
				billingAddress: selectedBillingAddressFullObject[0],
				billing_address_id: selectedBillingAddress,
				shipping_address_id: selectedAddress,
				shippingAddress: selectedAddressFullObject[0],
				selfTakeout: false,
				cartId: data?.cartId,
				origin: $page.data?.origin,
				storeId: $page?.data?.storeId
			})

			if (data.prescriptionId) {
				goto(
					`/checkout/payment-options?address=${selectedAddress}&prescription=${data.prescriptionId}`
				)
			} else {
				goto(`/checkout/payment-options?address=${selectedAddress}`)
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
			{#if data.me}
				<!-- Select Delivery Address -->

				<h2 class="mb-5">Select Delivery Address</h2>

				{#if data.myAddresses?.data?.length}
					<ul class="mb-5 p-0 list-none rounded-lg border bg-white shadow-lg">
						{#each data.myAddresses.data as ads, adsIndex}
							{#if displayAllDeliveryAddress ? true : adsIndex < 2}
								<li transition:slide="{{ duration: 300 }}">
									<SelectAddress
										address="{ads}"
										{loading}
										countries="{data.countries}"
										{selectedAddress}
										on:deleteAddress="{refreshAddress}"
										on:addressChanged="{({ detail }) => addressChanged({ detail })}" />
								</li>
							{/if}
						{/each}

						{#if data.myAddresses.data?.length > 2}
							<button
								type="button"
								class="w-full p-5 focus:outline-none"
								on:click="{() => (displayAllDeliveryAddress = !displayAllDeliveryAddress)}">
								{#if displayAllDeliveryAddress}
									Hide delivery address
								{:else}
									Display all delivery address
								{/if}
							</button>
						{/if}
					</ul>

					<!-- <div class="mb-5">
						{selectedAddress}---{selectedBillingAddress}
					</div> -->

					{#if data.store?.b2b && data.store?.b2b?.allowDifferentBillingAddress && data.store?.b2b?.allowDifferentBillingAddress?.val === true}
						<!-- Same as billing address checkbox -->

						<label class="mb-5 lg:mb-10 flex items-center gap-2 text-lg font-semibold">
							<input
								type="checkbox"
								class="h-5 w-5"
								bind:checked="{isSameAsBillingAddressWithLogIn}" />

							<span>Same as billing address</span>
						</label>

						<!-- Select Billing Address -->

						{#if !isSameAsBillingAddressWithLogIn}
							<div transition:slide="{{ duration: 300 }}" class="flex flex-col gap-5">
								<h2 class="mb-5">Select Billing Address</h2>

								<ul class="mb-5 p-0 list-none rounded-lg border bg-white shadow-lg">
									{#each data.myAddresses.data as ads}
										<li>
											<SelectBillingAddress
												address="{ads}"
												{loading}
												countries="{data.countries}"
												{selectedBillingAddress}
												on:deleteAddress="{refreshAddress}"
												on:addressChanged="{({ detail }) => billingAddressChanged({ detail })}" />
										</li>
									{/each}
								</ul>
							</div>
						{/if}
					{/if}
				{/if}

				<div>
					{#if !data.myAddresses?.data?.length}
						<hr class="mb-5" />
					{/if}

					<!-- Add New Address -->

					<button
						type="button"
						class="group flex h-40 w-1/2 flex-col items-center justify-center rounded border border-dashed border-zinc-400 hover:border-blue-500 sm:h-60"
						on:click="{() => (showAddNewAddressModal = true)}">
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
							class="mt-2 text-sm font-medium text-zinc-800 group-hover:text-blue-500 sm:text-base uppercase">
							Add New Address
						</span>
					</button>

					<Modal
						show="{showAddNewAddressModal}"
						title="Add New Address"
						hideFooter
						on:close="{() => (showAddNewAddressModal = false)}">
						<SaveAddress
							bind:editAddress="{showAddNewAddressModal}"
							bind:selectedAddress
							bind:selectedBillingAddress
							shipping_address="{newAddress}"
							countries="{data.countries?.data}" />
					</Modal>
				</div>
			{:else}
				<h2 class="mb-5">Enter Your Delivery Address</h2>

				<a
					href="/auth/login?ref={$page.url.pathname}"
					class="block mb-5 text-sm underline text-zinc-500 hover:text-zinc-800">
					Login to view your saved address
				</a>

				<SaveAddress {billing_address} {shipping_address} countries="{data.countries}" />
			{/if}
		</div>

		<div class="w-full lg:w-96 lg:shrink-0 lg:grow-0">
			<h2 class="mb-5">Cart Summary</h2>

			<hr class="mb-5" />

			{#if selectedAddress}
				<Pricesummary text="Proceed" showNextIcon on:submit="{updateCart}" {loading} />
			{:else}
				<Pricesummary text="Please select address" disabled="{true}" {loading} />
			{/if}

			<TrustBaggeContainer class="mt-5" />
		</div>
	</div>
</div>
