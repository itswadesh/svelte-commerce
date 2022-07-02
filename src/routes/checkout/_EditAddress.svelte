<script context="module" lang="ts">
export async function load({ url, params, fetch }) {
	const prev = +url.searchParams.get('prev')
	return {
		props: {
			prev
		}
	}
}
</script>

<script>
import { session } from '$app/stores'
import { goto } from '$app/navigation'
import { onMount } from 'svelte'
import Submit from '$lib/ui/Button.svelte'
import Textbox from '$lib/ui/Textbox.svelte'
import Button from '$lib/ui/Button.svelte'
import { toast } from '$lib/util'
import { KQL_Address, KQL_SaveAddress } from '$lib/graphql/_kitql/graphqlStores'

export let prev = ''
export let id = 'new'
export let returnUrl = '/checkout/address'
let iconloading = false
let address = {}
$: isDisabled =
	!address?.firstName ||
	!address?.phone ||
	!address?.zip ||
	!address?.address ||
	!address?.city ||
	!address?.country
$: user = $session.me
onMount(() => {
	if (id !== 'new') getAddress()
	else
		address = {
			firstName: user?.firstName,
			lastName: user?.lastName,
			email: user?.email,
			phone: user?.phone,
			address: user?.address,
			town: user?.town,
			city: user?.city,
			country: user?.country,
			zip: user?.zip
		}
})

async function getAddress() {
	try {
		address = (await KQL_Address.query({ variables: { id } })).data?.address

		// console.log(address)
	} catch (e) {
		// console.log(e)
	}
}
async function submit() {
	if (!address) return toast('Please enter address', 'error')
	if (!address.address) return toast('Please enter address', 'error')
	const msg = id === 'new' ? 'Address Added' : 'Address Updated'
	try {
		iconloading = true
		if (!address?.id) address.id = 'new'
		await KQL_SaveAddress.mutate({ variables: address })
		toast(msg, 'success')
		if (prev) goto(`/${prev}`)
		else goto(returnUrl)
	} catch (e) {
		toast(e, null)
	} finally {
		iconloading = false
	}
}
</script>

<div class="flex flex-col">
	<div v-if="address">
		<form class="my-4" novalidate autocomplete="off" on:submit|preventDefault="{submit}">
			<!-- forms -->
			<div
				class="
            grid grid-cols-1
            gap-2
            text-sm text-primary-500
            md:grid-cols-2
            md:gap-4
          ">
				<div class="col-span-2 flex flex-col-reverse md:col-span-1">
					<input type="text" bind:value="{address.firstName}" placeholder="" />
					<span class="my-2 font-semibold">First Name</span>
				</div>

				<div class="col-span-2 flex flex-col-reverse md:col-span-1">
					<input type="text" bind:value="{address.lastName}" placeholder="" />
					<span class="my-2 font-semibold">Last Name</span>
				</div>

				<div class="col-span-2 flex flex-col-reverse md:col-span-1">
					<input type="text" bind:value="{address.phone}" placeholder="" />
					<span class="my-2 font-semibold">Mobile number</span>
				</div>
				<div class="col-span-2 flex flex-col-reverse md:col-span-1">
					<!-- @input="$event.target.composing = false" -->
					<input type="text" bind:value="{address.zip}" placeholder="" />
					<span class="my-2 font-semibold">Pincode</span>
				</div>

				<div class="col-span-2 flex flex-col-reverse">
					<input type="text" bind:value="{address.address}" placeholder="" />
					<span class="my-2 font-semibold">Address (Area and Street)</span>
				</div>

				<div class="col-span-2 flex flex-col-reverse md:col-span-1">
					<input type="text" bind:value="{address.city}" placeholder="" />
					<span class="my-2 font-semibold">City/District/Town</span>
				</div>

				<div class="col-span-2 flex flex-col-reverse md:col-span-1">
					<input type="text" bind:value="{address.state}" placeholder="" />
					<span class="my-2 font-semibold">State</span>
				</div>

				<div class="col-span-2 flex flex-col-reverse md:col-span-1">
					<input type="text" bind:value="{address.country}" placeholder="" />
					<span class="my-2 font-semibold">Country</span>
				</div>

				<div class="col-span-2 flex flex-col-reverse md:col-span-1">
					<input type="text" bind:value="{address.email}" placeholder="" />
					<span class="my-2 font-semibold">Email</span>
				</div>
			</div>

			<!-- <label class="flex flex-row">
                <input
                  type="checkbox"
                  class="my-auto border-0 rounded-sm me-3 bg-gray-50 text-primary-500 ring-primary-500 ring-1 focus:ring-1 focus:ring-primary-500 focus:ring-offset-0"
                />
                <span class="text-gray-500"
                  >Make this as a default address</span
                >
              </label> -->

			<div class="mt-10 flex justify-start pr-4">
				<button
					type="submit"
					class=" w-1/2 transform rounded-md bg-primary-500 py-2 font-semibold text-white shadow-md transition  duration-300 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 active:scale-95 ">
					{#if iconloading}
						<div class="flex justify-center">
							<svg
								style="height: 20px; width: 20px"
								class="animate-spin text-white -ms-1"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24">
								<circle
									class="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									stroke-width="4"></circle>
								<path
									class="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								></path>
							</svg>
						</div>
					{:else}
						<span class="text-base"> SAVE ADDRESS</span>
					{/if}
				</button>
			</div>
		</form>
	</div>
</div>
