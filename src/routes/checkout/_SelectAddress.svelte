<script>
import { createEventDispatcher } from 'svelte'
import { session } from '$app/stores'
import { goto } from '$app/navigation'
import AddressSkeleton from './_AddressSkeleton.svelte'
import Radio from '$lib/ui/Radio.svelte'
import { onMount } from 'svelte'
import { del, get } from '../../util/api'
import { toasts } from 'svelte-toasts'
const dispatch = createEventDispatcher()

let id = null
export let returnUrl = null
export let addReturnUrl = null
export let selectedAddress = null
let skeleton = false,
	iconloading = false,
	addresses = null
$: user = $session.user

onMount(() => {
	getAddress()
})
function selectFirstAddress(x) {
	selectedAddress = x?.addresses[0]?.id
	return x
}
function addressChanged(e) {
	selectedAddress = e
	dispatch('addressChanged', e)
}
async function getAddress() {
	try {
		skeleton = true
		addresses = await get('addresses/my')
		// Can not push automatically, because it creates bad user experience when user clicks on back to address list page
		// if (addresses.count < 1) goto(addReturnUrl)
		selectedAddress = addresses?.data[0]?.id
	} catch (e) {
	} finally {
		skeleton = false
	}
}
function edit(id) {
	goto(`${returnUrl}?id=${id}`)
}
async function remove(id) {
	if (confirm('Are you sure to delete?')) {
		try {
			iconloading = true
			await del(`addresses/${id}`)
			await getAddress()
			showToast('Address deleted successfully', 'success')
		} catch (e) {
			showToast(e, 'error')
		} finally {
			iconloading = false
		}
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
</script>

<div>
	<div class="w-full">
		{#if skeleton}
			<AddressSkeleton />
		{:else if addresses?.data?.length}
			<div class="w-full">
				{#each addresses.data as a}
					<div class="border-b pb-4">
						<label for="group" class="flex flex-row w-full p-2 px-3 sm:p-4 sm:px-6">
							<input
								type="radio"
								value="{a._id}"
								name="group"
								on:change="{() => addressChanged(a._id)}" />
							<div
								class="                w-full
                text-base
                font-light
                leading-7
                text-gray-500
                cursor-pointer
                ms-2
              ">
								<span class="capitalize">
									{a.firstName}
									{a.lastName}
								</span>
								<div class="flex flex-row my-1 sm:w-2/3">
									<span class="text-gray-700 me-1">Address:</span>
									{a.address},
								</div>
								<span class="capitalize">
									{a.city}, {a.state}, {a.country}
								</span>
								<div class="flex flex-row my-1">
									<span class="text-gray-700 me-1">Pin:</span>
									{a.zip}
								</div>
								<div class="flex flex-row my-1">
									<span class="text-gray-700 me-1">Phone:</span>
									<span class="underline">
										{a.phone}
									</span>
								</div>
								<div class="flex flex-row flex-wrap my-1">
									<span class="text-gray-700 me-1">Email:</span>
									<span class="underline">
										{a.email}
									</span>
								</div>
							</div>
						</label>
						<div
							class="
              flex flex-row
              w-full
              px-3
              my-auto
              mt-5
              sm:mt-0
              sm:justify-between
              sm:px-7
            ">
							<div class="flex flex-row">
								<button
									type="button"
									class="
                  w-full
                  px-5
                  text-sm
                  tracking-widest
                  uppercase
                  bg-white
                  border
                  rounded
                  sm:p-1
                  sm:px-3
                  text-primary-500
                  border-primary-500
                  focus:outline-none
                  focus:ring-opacity-50
                  focus:ring
                  focus:ring-offset-2
                  focus:ring-primary-200
                  lg:rounded
                "
									on:click="{() => edit(a.id)}">
									Edit
								</button>
								<button
									type="button"
									class="
                  w-full
                  p-2
                  px-3
                  text-sm
                  tracking-widest
                  text-gray-400
                  uppercase
                  rounded
                  ms-3
                  focus:outline-none
                  focus:ring-opacity-50 focus:ring focus:ring-offset-2
                  lg:rounded
                "
									on:click="{() => remove(a._id)}">
									{#if iconloading}
										<div class="flex justify-center">
											<svg
												style="height: 20px; width: 20px"
												class="text-gray-500 -ms-1 animate-spin"
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
										<span>remove</span>
									{/if}
								</button>
							</div>
						</div>
					</div>
				{/each}
				{#if addresses?.data?.length < 1}
					<div class="p-6 text-lg text-center text-gray-500">No Address found</div>
				{/if}
			</div>
		{/if}
	</div>
</div>
