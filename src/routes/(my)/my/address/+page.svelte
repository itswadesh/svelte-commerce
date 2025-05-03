<script lang="ts">
	import { AddressService } from '$lib/core/services'
	import { applyAction, enhance } from '$app/forms'
	import { goto, invalidateAll } from '$app/navigation'
	import { page } from '$app/state'
	// import noEmptyAddress from '$lib/assets/no/empty-address.svg'
	import { Button } from '$lib/components/ui/button'
	import Pagination from '$lib/components/common/pagination.svelte'
	import { toast } from 'svelte-sonner'

	let data: any = $state({})

	const seoProps = {
		title: 'Dashboard - Addresses ',
		description: 'My Addresses'
	}

	let newAddress = $state({})
	let selectedShippingAddress = $state({})
	let showAddNewAddressModal = $state(false)
	let showEditAddressModal = $state(false)
	let typingTimer = $state(null)
	let loadingOnDelete = $state([])

	async function searchData(search: any) {
		let u = new URL(page.url)
		u.searchParams.set('search', search.toString())
		goto(u.toString())
	}
</script>

<svelte:head>
	<title>Address</title>
</svelte:head>
<SEO {...seoProps} />

<section>
	<header class="mb-5 flex flex-wrap items-start justify-between gap-4">
		<h1>
			Addresses {#if data?.addresses?.count}({data?.addresses?.count}){/if}
		</h1>

		<!--  Back button -->

		<div class="flex flex-wrap items-center gap-2">
			<Button type="button" class="text-sm" onclick={() => (showAddNewAddressModal = true)}>
				<svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
				</svg>

				<span>Add New Address</span>
			</Button>
		</div>
	</header>

	<!-- <Modal show={showAddNewAddressModal} title="Add New Address" hideFooter on:close={() => (showAddNewAddressModal = false)}>
		<SaveAddress bind:editAddress={showAddNewAddressModal} shipping_address={newAddress} countries={data.countries?.data} />
	</Modal> -->

	{#if data.addresses?.isFetching}
		Loading....
	{:else if data.addresses?.errors}
		{data.addresses?.errors}
	{:else if data.addresses.data.length > 0}
		<ul class="mb-5 flex w-full max-w-xl flex-col gap-4">
			{#each data.addresses.data as add, index}
				{#if add}
					<li class="overflow-hidden rounded border bg-white shadow-md transition duration-300 hover:shadow-md">
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
								<div class="shrink-0 rounded-full border-2 border-zinc-200 bg-zinc-100 px-4 py-0.5 text-xs font-bold uppercase tracking-wide">
									Home
								</div>
							{/if}
						</div>

						<div class="grid grid-cols-2 divide-x border-t">
							<button
								type="button"
								class="text-primary-500 hover:text-primary-700 w-full bg-transparent p-2 text-center font-semibold uppercase transition duration-300 hover:bg-zinc-100 focus:outline-none"
								onclick={() => {
									selectedShippingAddress = add
									showEditAddressModal = true
								}}
							>
								Edit
							</button>

							<!-- <button
								type="button"
								class="bg-transparent p-2 text-center font-semibold uppercase text-primary-500 transition duration-300 focus:outline-none hover:bg-zinc-100 hover:text-primary-700"
								onclick="{() => remove(add._id || add.id, index)}">
								{#if loadingOnDelete[index]}
									Removing...
								{:else}
									Remove
								{/if}
							</button> -->

							<form
								action="/my/addresses?/deleteAddress"
								method="POST"
								use:enhance={() => {
									return async ({ result }) => {
										toast.success('Address deleted')
										await invalidateAll()
										await applyAction(result)
									}
								}}
								class="w-full"
							>
								<input type="hidden" name="id" value={add._id || add.id || null} />

								<button
									type="submit"
									class="text-primary-500 hover:text-primary-700 w-full bg-transparent p-2 text-center font-semibold uppercase transition duration-300 hover:bg-zinc-100 focus:outline-none"
								>
									REMOVE
								</button>
							</form>
						</div>
					</li>
				{/if}
			{/each}
		</ul>

		<!-- <Modal show={showEditAddressModal} title="Edit Address" hideFooter on:close={() => (showEditAddressModal = false)}>
			<SaveAddress bind:editAddress={showEditAddressModal} shipping_address={selectedShippingAddress} countries={data.countries?.data} />
		</Modal> -->

		<Pagination count={data?.addresses?.count || 1} />
	{:else}
		<div class="flex h-[70vh] flex-col items-center justify-center text-center">
			<!-- <img src={noEmptyAddress} alt="empty wishlist" class="mb-5 h-60 object-contain" /> -->

			<h2 class="mb-2">Empty Address!!</h2>

			<p class="mb-5">There's no address found, start adding address by clicking the add new address button above.</p>

			<a href="/" aria-label="Click to visit home" data-sveltekit-preload-data>
				<Button class="w-40 py-2 text-sm">Shop Now</Button>
			</a>
		</div>
	{/if}
</section>
