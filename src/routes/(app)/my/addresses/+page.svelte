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
import LazyImg from '$lib/components/Image/LazyImg.svelte'
import { goto } from '$app/navigation'
import { page } from '$app/stores'
import ToggleSwitch from '$lib/ui/ToggleSwitch.svelte'
import SearchBox from '$lib/ui/SearchBox.svelte'
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
		await post('addresses', { id })
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
		await del('addresses', { id })
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
		const res = await getAPI('addresses', { search, page: currentPage, sort })
		addresses = res?.data
	} catch (e) {
		err = e
	} finally {
	}
}
</script>

<SEO {...seoProps} />

<div class="text-gray-800">
	<div class="mb-5 flex items-center justify-between gap-4 sm:gap-6">
		<SearchBox
			placeholder="Search addresses name, title, content and status..."
			bind:value="{search}"
			on:change="{() => callSearch(search)}" />

		<a href="/my/addresses/new" aria-label="Click to route new address" sveltekit:prefetch>
			<PrimaryButton
				roundedFull="{true}"
				class="flex h-10 w-10 transform items-center justify-center shadow shadow-primary-500/30 hover:scale-110 hover:shadow-lg md:h-12 md:w-12">
				<svg
					class="h-6 w-6 md:h-8 md:w-8"
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
			</PrimaryButton>
		</a>
	</div>

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

		<div class="overflow-hidden border-b border-gray-200 shadow-md sm:rounded-lg">
			<table class="min-w-full divide-y divide-gray-200 text-left text-sm tracking-wider">
				<thead class="whitespace-nowrap bg-primary-500 text-xs font-medium uppercase text-white">
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

				<tbody class="divide-y divide-gray-200">
					{#each addresses.data as i, ix}
						{#if i}
							<tr>
								<td class="whitespace-pre-line px-6 py-3">{i.firstName}</td>
								<td class="whitespace-pre-line px-6 py-3">{i.lastName}</td>
								<td class="whitespace-pre-line px-6 py-3">{i.email}</td>
								<td class="whitespace-pre-line px-6 py-3">{i.phone}</td>
								<td class="whitespace-pre-line px-6 py-3">{i.address}</td>
								<td class="whitespace-pre-line px-6 py-3">{i.locality}</td>
								<td class="whitespace-pre-line px-6 py-3">{i.city}</td>
								<td class="whitespace-pre-line px-6 py-3">{i.state}</td>
								<td class="whitespace-pre-line px-6 py-3">{i.country}</td>
								<td class="whitespace-pre-line px-6 py-3">{i.zip}</td>

								<td class="whitespace-nowrap px-6 py-3">
									<ToggleSwitch
										color="blue"
										size="sm"
										bind:checked="{i.active}"
										on:input="{() => saveAddress(i)}" />
								</td>

								<td class="whitespace-nowrap px-6 py-3">
									<div class="flex items-center gap-5 text-sm text-gray-500">
										<a
											href="{`/my/addresses/${i.id}`}"
											aria-label="Click to route edit address"
											class="w-9 rounded-full bg-gray-100 p-2 text-xs text-gray-500 transition duration-300 hover:bg-gray-200">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												class="h-5 w-5"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
												stroke-width="2">
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
												></path>
											</svg>
										</a>

										<button
											type="button"
											class="w-9 rounded-full bg-gray-100 p-2 text-xs text-gray-500 transition duration-300 hover:bg-gray-200"
											on:click="{() => remove(i.id)}">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												class="h-5 w-5"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
												stroke-width="2">
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
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
				<LazyImg
					src="/no/empty-address.svg"
					alt="empty address"
					height="240"
					class="mb-5 h-60 object-contain" />
			</div>

			<span class="mb-3 text-xl font-medium md:text-3xl">Empty Addresses!!</span>

			<span class="mb-5 text-xs">
				We didn't find any address, Add a address by clicking the plus icon
			</span>
		</div>
	{/if}
</div>
