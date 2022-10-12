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
import ToggleSwitch from '$lib/ui/ToggleSwitch.svelte'
import SearchBox from '$lib/ui/SearchBox.svelte'
import Pagination from '$lib/components/Pagination.svelte'
import { gett } from '$lib/utils'

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
		await del(`addresses?id=${id}&store=${$page.data.store?.id}`, $page.data.origin)
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
		const res = await getAPI(
			`addresses?search=${search}&page=${currentPage}&sort=${sort}`,
			$page.data.origin
		)
		addresses = res?.data
	} catch (e) {
		err = e
	} finally {
	}
}
</script>

<SEO {...seoProps} />

<div class="text-gray-800">
	{#if addresses?.isFetching}
		Loading....
	{:else if addresses?.errors}
		{addresses}
	{:else if addresses.count > 0}
		<header class="mb-5 flex flex-wrap items-center justify-between gap-2 sm:gap-5">
			<h1 class="text-xl font-bold md:text-2xl">
				Addresses ({addresses.count})
			</h1>

			<label>
				<span class="text-sm">Sort: </span>

				<select
					bind:value="{sort}"
					class="border-b border-gray-300 bg-transparent p-0.5 text-sm font-semibold focus:outline-none"
					on:change="{() => sortNow(sort)}">
					<option value="-updatedAt" selected class="p-4">Whats New</option>
					<option value="status">Status ASC</option>
					<option value="-status">Status DESC</option>
					<option value="-active">Active</option>
					<option value="active">Inactive</option>
				</select>
			</label>
		</header>

		<div class="mb-5 flex items-center justify-between gap-4 sm:gap-6">
			<!-- <SearchBox
			placeholder="Search addresses name, title, content and status..."
			bind:value="{search}"
			on:change="{() => callSearch(search)}" /> -->

			<a href="/my/addresses/new" aria-label="Click to route new address" data-sveltekit-prefetch>
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

		<div
			class="max-h-[68vh] overflow-hidden rounded-md border bg-white shadow-md scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
			<table class="relative min-h-full min-w-full divide-y whitespace-nowrap text-left text-sm">
				<thead class="sticky top-0 z-20 bg-white uppercase shadow-md">
					<tr>
						<th scope="col" class="px-6 py-3"> First Name </th>

						<th scope="col" class="px-6 py-3"> Last Name </th>

						<th scope="col" class="px-6 py-3"> Email </th>

						<th scope="col" class="px-6 py-3"> Phone </th>

						<th scope="col" class="px-6 py-3"> Address </th>

						<th scope="col" class="px-6 py-3"> Locality </th>

						<th scope="col" class="px-6 py-3"> City </th>

						<th scope="col" class="px-6 py-3"> State </th>

						<th scope="col" class="px-6 py-3"> Country </th>

						<th scope="col" class="px-6 py-3"> Zip </th>

						<th scope="col" class="px-6 py-3"> Active </th>

						<th scope="col" class="px-6 py-3"> Actions </th>
					</tr>
				</thead>

				<tbody class="divide-y">
					{#each addresses.data as i, index}
						{#if i}
							<tr
								class="cursor-default transition duration-300 hover:bg-primary-50 
								{index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}">
								<td class="whitespace-pre-line px-6 py-3">{i.firstName || '_'}</td>

								<td class="whitespace-pre-line px-6 py-3">{i.lastName || '_'}</td>

								<td class="whitespace-pre-line px-6 py-3">{i.email || '_'}</td>

								<td class="whitespace-pre-line px-6 py-3">{i.phone || '_'}</td>

								<td class="whitespace-pre-line px-6 py-3">{i.address || '_'}</td>

								<td class="whitespace-pre-line px-6 py-3">{i.locality || '_'}</td>

								<td class="whitespace-pre-line px-6 py-3">{i.city || '_'}</td>

								<td class="whitespace-pre-line px-6 py-3">{i.state || '_'}</td>

								<td class="whitespace-pre-line px-6 py-3">{i.country || '_'}</td>

								<td class="whitespace-pre-line px-6 py-3">{i.zip || '_'}</td>

								<td class="whitespace-nowrap px-6 py-3">
									<ToggleSwitch
										color="blue"
										size="sm"
										bind:checked="{i.active}"
										on:input="{() => saveAddress(i)}" />
								</td>

								<td class="whitespace-nowrap px-6 py-3">
									<div class="flex items-center gap-3 text-sm text-gray-500">
										<a
											href="{`/my/addresses/${i._id}`}"
											title="Click to edit"
											aria-label="Click to route edit address"
											class="relative z-10 flex h-8 w-8 transform items-center justify-center rounded-full bg-gray-200 text-xs text-gray-500 transition duration-300 hover:bg-gray-300 hover:text-gray-800 active:scale-90">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												stroke-width="1.5"
												stroke="currentColor"
												class="h-4 w-4">
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
												></path>
											</svg>
										</a>

										<button
											type="button"
											title="Click to delete"
											class="relative z-10 flex h-8 w-8 transform items-center justify-center rounded-full bg-gray-200 text-xs text-gray-500 transition duration-300 hover:bg-gray-300 hover:text-gray-800 active:scale-90"
											on:click="{() => remove(i.id)}">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												stroke-width="1.5"
												stroke="currentColor"
												class="h-4 w-4">
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
												></path>
											</svg>
										</button>
									</div>
								</td>
							</tr>
						{/if}
					{:else}
						<div class="px-6 py-3 text-sm text-gray-500 whitespace-nowrap">
							No Pages Data Found!
						</div>
					{/each}
				</tbody>
			</table>
		</div>

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
