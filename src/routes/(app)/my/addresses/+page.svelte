<style>
.line-clamp-3 {
	overflow: hidden;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 3;
}

.h-rem-empty {
	height: 70vh;
}
</style>

<script>
import SEO from '$lib/components/SEO/index.svelte'
import PrimaryButton from '$lib/ui/PrimaryButton.svelte'
import { post, del, getAPI } from '$lib/util/api'
import { goto } from '$app/navigation'
import { page } from '$app/stores'
import Pagination from '$lib/components/Pagination.svelte'

const seoProps = {
	title: 'Dashboard - Addresses ',
	description: 'My Addresses'
}

export let data

$: ({ search, sort, err, addresses, count, query, currentPage } = data)

let typingTimer,
	loading = false

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

async function saveAddress(e) {
	const { _id: id, active } = e
	try {
		await post('addresses', { id, store: $page.data.store?.id }, $page.data.origin)
		refreshData()
	} catch (e) {
		err = e
		// toast(e, 'error')
	} finally {
		// loading = false
	}
}

async function remove(id) {
	try {
		await del(`addresses/${id}`, $page.data.origin)
		// &store=${$page.data.store?.id}
		refreshData()
	} catch (e) {
		err = e
		// toast(e, 'error')
	} finally {
		// loading = false
	}
}

async function refreshData() {
	try {
		const res = await getAPI(`addresses/my`, $page.data.origin)

		addresses = res?.data
	} catch (e) {
		err = e
	} finally {
	}
}
</script>

<SEO {...seoProps} />

<div>
	<h1 class="mb-5 text-xl font-bold md:text-2xl">
		Saved Addresses ({addresses.count})
	</h1>

	<div class="mb-5 flex items-center justify-between gap-4 sm:gap-6">
		<!-- <SearchBox
			placeholder="Search addresses name, title, content and status..."
			bind:value="{search}"
			on:change="{() => callSearch(search)}" /> -->

		<a href="/my/addresses/new" aria-label="Click to route new address" data-sveltekit-preload-data>
			<PrimaryButton class="text-sm">
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
		</a>
	</div>

	{#if addresses?.isFetching}
		Loading....
	{:else if addresses?.errors}
		{addresses}
	{:else if addresses.count > 0}
		<ul class="flex flex-col gap-4 w-full max-w-xl">
			{#each addresses.data as i, index}
				{#if i}
					<li
						class="bg-white rounded-md shadow-md border overflow-hidden hover:shadow-md transition duration-300">
						<div class="p-4 sm:p-6 flex gap-3 items-start">
							<div class="flex-1 flex flex-col gap-1 text-sm">
								<span class="font-semibold text-base">
									{i.firstName || '_'}
									{i.lastName || '_'}
								</span>

								<span>Email: {i.email || '_'}</span>

								<span>Phone: {i.phone || '_'}</span>

								<span>
									{i.address || '_'}, {i.locality || '_'}, {i.city || '_'}

									<br />

									{i.state || '_'}, {i.zip || '_'}

									<br />

									{i.country || '_'}
								</span>
							</div>

							{#if i.isHome}
								<div
									class="flex-shrink-0 border-2 bg-gray-100 font-bold tracking-wide border-gray-300 text-xs uppercase py-0.5 px-4 rounded-full">
									Home
								</div>
							{/if}
						</div>

						<div class="grid grid-cols-2 divide-x border-t">
							<a
								href="{`/my/addresses/${i._id}`}"
								class="p-2 font-semibold uppercase text-primary-500 hover:text-primary-700 transition duration-300 bg-transparent hover:bg-gray-100 focus:outline-none text-center">
								Edit
							</a>

							<button
								type="button"
								class="p-2 font-semibold uppercase text-primary-500 hover:text-primary-700 transition duration-300 bg-transparent hover:bg-gray-100 focus:outline-none text-center"
								on:click="{() => remove(i._id)}">
								Remove
							</button>
						</div>
					</li>
				{/if}
			{:else}
				<div class="px-6 py-3 text-sm text-gray-500 whitespace-nowrap">
					No address found, Please add address by clicking add new address button above.
				</div>
			{/each}
		</ul>

		<Pagination count="{Math.ceil(count / 40)}" current="{currentPage}" />
	{:else}
		<div class="h-rem-empty flex flex-col items-center justify-center text-center">
			<div>
				<img src="/no/empty-address.svg" alt="empty address" class="mb-5 h-60 object-contain" />
			</div>

			<span class="mb-3 text-xl font-medium md:text-3xl">Empty Addresses!!</span>

			<span class="mb-5 text-xs">
				We didn't find any address, Add a address by clicking the plus icon
			</span>
		</div>
	{/if}
</div>
