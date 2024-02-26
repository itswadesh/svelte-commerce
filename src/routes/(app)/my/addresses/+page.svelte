<script lang="ts">
import { AddressService } from '$lib/services'
import { applyAction, enhance } from '$app/forms'
import { del } from '$lib/utils/api'
import { goto, invalidateAll } from '$app/navigation'
import { page } from '$app/stores'
import { Pagination } from '$lib/components'
import { toast } from '$lib/utils'
import Modal from '$lib/components/Modal.svelte'
import noEmptyAddress from '$lib/assets/no/empty-address.svg'
import PrimaryButton from '$lib/ui/PrimaryButton.svelte'
import SaveAddress from './_SaveAddress.svelte'
import SEO from '$lib/components/SEO/index.svelte'

export let data

const seoProps = {
	title: 'Dashboard - Addresses ',
	description: 'My Addresses'
}

let loadingOnDelete = []
let newAddress = {}
let selectedShippingAddress = {}
let showAddNewAddressModal = false
let showEditAddressModal = false
let typingTimer

function callSearch(search) {
	clearTimeout(typingTimer)
	typingTimer = setTimeout(() => {
		searchData(search)
	}, 300)
}

async function searchData(search) {
	let u = new URL($page.url)
	u.searchParams.set('search', search.toString())
	goto(u.toString())
}

async function sortNow(sort) {
	let u = new URL($page.url)
	u.searchParams.set('sort', sort.toString())
	goto(u.toString())
}

async function saveAddr(e) {
	const { _id: id, active } = e
	try {
		await AddressService.saveAddress({
			id,
			storeId: $page.data.storeId,
			origin: $page.data.origin,
			sid: $page.data.sid
		})
		await invalidateAll()
	} catch (e) {
		data.err = e
	} finally {
	}
}

async function remove(id, index) {
	data.err = null

	if (confirm('Are you sure to delete?')) {
		try {
			loadingOnDelete[index] = true

			toast('Deleting...Please wait', 'warning')

			await del(`addresses/${id}?store=${$page.data.storeId}`, $page.data.origin)

			toast('Item deleted successfully', 'success')

			invalidateAll()
		} catch (e) {
			data.err = e?.message
			toast(e, 'error')
		} finally {
			loadingOnDelete[index] = false
		}
	} else {
		return
	}
}
</script>

<SEO {...seoProps} />

<section>
	<header class="mb-5 flex flex-wrap items-start justify-between gap-4">
		<h1>
			Addresses {#if data?.addresses?.count}({data?.addresses?.count}){/if}
		</h1>

		<!--  Back button -->

		<div class="flex flex-wrap items-center gap-2">
			<PrimaryButton
				type="button"
				loadingringsize="sm"
				class="text-sm"
				on:click="{() => (showAddNewAddressModal = true)}">
				<svg
					class="h-5 w-5"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
				</svg>

				<span>Add New Address</span>
			</PrimaryButton>
		</div>
	</header>

	<Modal
		show="{showAddNewAddressModal}"
		title="Add New Address"
		hideFooter
		on:close="{() => (showAddNewAddressModal = false)}">
		<SaveAddress
			bind:editAddress="{showAddNewAddressModal}"
			shipping_address="{newAddress}"
			countries="{data.countries?.data}" />
	</Modal>

	{#if data.addresses?.isFetching}
		Loading....
	{:else if data.addresses?.errors}
		{data.addresses?.errors}
	{:else if data.addresses.data.length > 0}
		<ul class="mb-5 flex w-full max-w-xl flex-col gap-4">
			{#each data.addresses.data as add, index}
				{#if add}
					<li
						class="overflow-hidden rounded border bg-white shadow-md transition duration-300 hover:shadow-md">
						<div class="flex items-start gap-3 p-4 sm:p-6">
							<div class="flex flex-1 flex-col gap-1 text-sm">
								<span class="text-base font-semibold">
									{add.firstName || '_'}
									{add.lastName || '_'}
								</span>

								<span>
									{add.address || '_'}, {add.city || '_'}

									<br />

									{add.state || '_'}, {add.country || '_'}

									<br />

									{add.zip || '_'}
								</span>

								<span> {add.email || '_'} </span>

								<span> {add.phone || '_'} </span>
							</div>

							{#if add.isHome}
								<div
									class="shrink-0 rounded-full border-2 border-zinc-200 bg-zinc-100 py-0.5 px-4 text-xs font-bold uppercase tracking-wide">
									Home
								</div>
							{/if}
						</div>

						<div class="grid grid-cols-2 divide-x border-t">
							<button
								type="button"
								class="w-full bg-transparent p-2 text-center font-semibold uppercase text-primary-500 transition duration-300 focus:outline-none hover:bg-zinc-100 hover:text-primary-700"
								on:click="{() => {
									selectedShippingAddress = add
									showEditAddressModal = true
								}}">
								Edit
							</button>

							<!-- <button
								type="button"
								class="bg-transparent p-2 text-center font-semibold uppercase text-primary-500 transition duration-300 focus:outline-none hover:bg-zinc-100 hover:text-primary-700"
								on:click="{() => remove(add._id || add.id, index)}">
								{#if loadingOnDelete[index]}
									Removing...
								{:else}
									Remove
								{/if}
							</button> -->

							<form
								action="/my/addresses?/deleteAddress"
								method="POST"
								use:enhance="{() => {
									return async ({ result }) => {
										toast('Address deleted', 'success')
										await invalidateAll()
										await applyAction(result)
									}
								}}"
								class="w-full">
								<input type="hidden" name="id" value="{add._id || add.id || null}" />

								<button
									type="submit"
									class="w-full bg-transparent p-2 text-center font-semibold uppercase text-primary-500 transition duration-300 focus:outline-none hover:bg-zinc-100 hover:text-primary-700">
									REMOVE
								</button>
							</form>
						</div>
					</li>
				{/if}
			{/each}
		</ul>

		<Modal
			show="{showEditAddressModal}"
			title="Edit Address"
			hideFooter
			on:close="{() => (showEditAddressModal = false)}">
			<SaveAddress
				bind:editAddress="{showEditAddressModal}"
				shipping_address="{selectedShippingAddress}"
				countries="{data.countries?.data}" />
		</Modal>

		<Pagination
			count="{Math.ceil((data?.addresses?.count || 1) / data.pageSize)}"
			current="{data.currentPage || 1}" />
	{:else}
		<div class="flex h-[70vh] flex-col items-center justify-center text-center">
			<img src="{noEmptyAddress}" alt="empty wishlist" class="mb-5 h-60 object-contain" />

			<h2 class="mb-2">Empty Address!!</h2>

			<p class="mb-5">
				There's no address found, start adding address by clicking the add new address button above.
			</p>

			<a href="/" aria-label="Click to visit home" data-sveltekit-preload-data>
				<PrimaryButton class="w-40 py-2 text-sm">Shop Now</PrimaryButton>
			</a>
		</div>
	{/if}
</section>
