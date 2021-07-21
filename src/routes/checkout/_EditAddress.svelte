<script context="module" lang="ts">
export async function load({ page: { host, path, params, query }, fetch }) {
	const prev = +query.get('prev')
	return {
		props: {
			prev,
		},
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
import { put, post, get } from '../../util/api'
import { toasts } from 'svelte-toasts'

export let prev = ''
export let id = 'new'
export let returnUrl = '/checkout/address'
let iconloading = false
let address = {
	id: null,
	email: null,
	firstName: null,
	lastName: null,
	address: null,
	town: null,
	city: null,
	country: null,
	state: null,
	zip: null,
	phone: null,
}
$: isDisabled =
	!address.firstName ||
	!address.phone ||
	!address.zip ||
	!address.address ||
	!address.city ||
	!address.country
$: user = $session.user
onMount(() => {
	if (id !== 'new') getAddress()
})
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
		address = await get(`address/?id=${id}`)
		if (!address) {
			address.firstName = user.firstName
			address.lastName = user.lastName
			address.email = user.email
			address.phone = user.phone
			address.address = user.address
			address.town = user.town
			address.city = user.city
			address.country = user.country
			address.zip = user.zip
		}
		// console.log(address)
	} catch (e) {
		// console.log(e)
	}
}
async function submit() {
	if (!address) return showToast('Please enter address', 'error')
	if (!address.address) return showToast('Please enter address', 'error')
	const msg = id === 'new' ? 'Address Added' : 'Address Updated'
	try {
		iconloading = true
		if (!address?.id) address.id = 'new'
		address = await post('addresses', address)
		showToast(msg, 'success')
		if (prev) goto(`/${prev}`)
		else goto(returnUrl)
	} catch (e) {
		showToast(e, null)
	} finally {
		iconloading = false
	}
}
</script>

<div class="flex flex-col">
	<div v-if="address">
		<form class="p-1 md:p-4" novalidate autocomplete="off" on:submit|preventDefault="{submit}">
			<!-- forms -->
			<div
				class="
            grid grid-cols-1
            gap-2
            text-sm text-primary-500
            md:gap-4
            md:grid-cols-2
          ">
				<div class="flex flex-col-reverse col-span-2 md:col-span-1">
					<input type="text" bind:value="{address.firstName}" placeholder="" />
					<span class="my-2">First Name</span>
				</div>

				<div class="flex flex-col-reverse col-span-2 md:col-span-1">
					<input type="text" bind:value="{address.lastName}" placeholder="" />
					<span class="my-2">Last Name</span>
				</div>

				<div class="flex flex-col-reverse col-span-2 md:col-span-1">
					<input type="text" bind:value="{address.phone}" placeholder="" />
					<span class="my-2">Mobile number</span>
				</div>
				<div class="flex flex-col-reverse col-span-2 md:col-span-1">
					<!-- @input="$event.target.composing = false" -->
					<input type="text" bind:value="{address.zip}" placeholder="" />
					<span class="my-2">Pincode</span>
				</div>

				<div class="flex flex-col-reverse col-span-2">
					<input type="text" bind:value="{address.address}" placeholder="" />
					<span class="my-2">Address (Area and Street)</span>
				</div>

				<div class="flex flex-col-reverse col-span-2 md:col-span-1">
					<input type="text" bind:value="{address.city}" placeholder="" />
					<span class="my-2">City/District/Town</span>
				</div>

				<div class="flex flex-col-reverse col-span-2 md:col-span-1">
					<input type="text" bind:value="{address.state}" placeholder="" />
					<span class="my-2">State</span>
				</div>

				<div class="flex flex-col-reverse col-span-2 md:col-span-1">
					<input type="text" bind:value="{address.country}" placeholder="" />
					<span class="my-2">Country</span>
				</div>

				<div class="flex flex-col-reverse col-span-2 md:col-span-1">
					<input type="text" bind:value="{address.email}" placeholder="" />
					<span class="my-2">Email</span>
				</div>
			</div>
			<div class="w-full mt-8">
				<div
					class="
              flex flex-col
              justify-between
              w-full
              my-auto
              mb-0
              md:flex-row
            ">
					<div class="w-full my-auto md:w-1/2">
						<!-- <label class="flex flex-row">
                <input
                  type="checkbox"
                  class="my-auto border-0 rounded-sm me-3 bg-gray-50 text-primary-500 ring-primary-500 ring-1 focus:ring-1 focus:ring-primary-500 focus:ring-offset-0"
                />
                <span class="text-gray-500"
                  >Make this as a default address</span
                >
              </label> -->
					</div>
					<div
						class="
                w-full
                p-2
                mt-4
                bg-secondary-500
                focus:ring-secondary-500
                md:w-1/3
                m:my-4
              ">
						<button type="submit">
							{#if iconloading}
								<div class="flex justify-center">
									<svg
										style="height: 20px; width: 20px"
										class="text-white -ms-1 animate-spin"
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
				</div>
			</div>
		</form>
	</div>
</div>
