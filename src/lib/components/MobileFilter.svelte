<style>
.frosted-black {
	backdrop-filter: blur(5px);
	background-color: hsla(0, 0%, 0%, 0.8);
}
</style>

<script>
import { browser } from '$app/environment'
import { constructURL2 } from '$lib/utils'
import { createEventDispatcher, onMount } from 'svelte'
import { fetchMegamenuData } from '$lib/services/CategoryService'
import { fly } from 'svelte/transition'
import { goto } from '$app/navigation'
import { page } from '$app/stores'
import { sorts } from '$lib/config'
import CheckboxEs from '$lib/ui/CheckboxEs.svelte'
import PrimaryButton from '$lib/ui/PrimaryButton.svelte'

const dispatch = createEventDispatcher()

let clazz = ''
export { clazz as class }

export let facets = {},
	fl = {},
	appliedFilters = {},
	filterLength = 0,
	mergedArr = [],
	showFilter = false,
	showSort = false

let selected
let megamenu
let selectedCategory
let showSubCategory = []
let selectedCategory2
let showSubCategory2 = []

onMount(() => {
	$page.url.searchParams.forEach(function (value, key) {
		fl[key] = value
		if (key !== 'page' && key !== 'sort' && key !== 'lat' && key !== 'lng')
			appliedFilters[key] = value
	})

	getMegamenu()
	getSelected()
})

async function getMegamenu() {
	if (browser) {
		try {
			const localmegamenu = localStorage.getItem('megamenu')

			if (!localmegamenu || localmegamenu === 'undefined') {
				megamenu = await fetchMegamenuData({
					origin: $page?.data?.origin,
					storeId: $page?.data?.store?.id
				})
			} else {
				megamenu = JSON.parse(localmegamenu)
			}
		} catch (e) {
			// toast(e, 'error')
		} finally {
		}
	}
}

function getSelected() {
	if (facets?.all_aggs?.age?.all?.buckets?.length > 0) {
		selected = 'Age'
	} else if (facets?.all_aggs?.brands?.all?.buckets?.length > 0) {
		selected = 'Brands'
	} else if (facets?.all_aggs?.colors?.all?.buckets?.length > 0) {
		selected = 'Colors'
	} else if (facets?.all_aggs?.discount?.all?.buckets?.length > 0) {
		selected = 'Discount'
	} else if (facets?.all_aggs?.features?.all?.buckets?.length > 0) {
		selected = 'Features'
	} else if (facets?.all_aggs?.genders?.all?.buckets?.length > 0) {
		selected = 'Genders'
	} else if (facets?.all_aggs?.price?.all?.buckets?.length > 0) {
		selected = 'Price'
	} else if (facets?.all_aggs?.sizes?.all?.buckets?.length > 0) {
		selected = 'Sizes'
	} else if (megamenu) {
		selected = 'Categories'
	}
}

function handleToggleSubCategory(m, mx) {
	selectedCategory = m.name

	if (m.children?.length > 0) {
		if (showSubCategory[mx] === true) {
			selectedCategory = ''
			showSubCategory[mx] = false
		} else {
			showSubCategory[mx] = true
		}
	}
}

function handleToggleSubCategory2(c, cx) {
	selectedCategory2 = c.name

	if (c.children?.length > 0) {
		if (showSubCategory2[cx] === true) {
			selectedCategory2 = ''
			showSubCategory2[cx] = false
		} else {
			showSubCategory2[cx] = true
		}
	}
}

function clearFilters() {
	fl = {}
	appliedFilters = {}
	const url = $page?.url?.pathname
	showFilter = false
	goto(url)
	dispatch('clearAll')
}

function goCheckbox(e) {
	fl[e.detail.model] = e.detail.selectedItems
	fl.q = $page.url.searchParams.get('q')
	let url = constructURL2(`${$page.url.pathname}`, fl)
	appliedFilters = { ...fl }
	delete appliedFilters?.page
	delete appliedFilters?.sort
	delete appliedFilters?.lat
	delete appliedFilters?.lng
	goto(`${url}page=1`)
}

async function sortNow(s) {
	let u = new URL($page.url)

	if (s == 'null' || s == null || s == undefined || s == 'undefined') {
		u.searchParams.delete('sort')
	} else {
		await u.searchParams.set('sort', s)
	}
	// await invalidateAll()
	goto(u.toString())
	window.scroll({ top: 0, behavior: 'smooth' })

	// await goto(`/search?${$page.url.searchParams.toString()}`)
}

$: {
	filterLength = 0
	mergedArr = []
	for (let a in appliedFilters) {
		const arr = appliedFilters[a] || []
		if (Array.isArray(arr)) {
			mergedArr.concat(arr)
			filterLength += arr.length
		} else {
			mergedArr.concat(arr.split(','))
			filterLength += arr.split(',').length
		}
	}
}
</script>

<div
	class="{clazz} grid w-full grid-cols-2 divide-x divide-gray-300 border-b bg-white font-medium shadow-md"
>
	<!-- Filter -->

	<button
		type="button"
		class="flex items-center justify-center gap-2 px-3 py-2"
		on:click="{() => (showFilter = true) && getSelected()}"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="h-5 w-5"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z"
			></path>
		</svg>

		<span>Filter</span>
	</button>

	<!-- Sort -->

	<button
		type="button"
		class="flex items-center justify-center gap-2 px-3 py-2"
		on:click="{() => (showSort = true)}"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="h-5 w-5"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"></path>
		</svg>

		<span>Sort</span>
	</button>
</div>

{#if showFilter}
	<div
		transition:fly="{{ x: -50, duration: 300 }}"
		class="fixed inset-0 z-[100] h-screen w-screen bg-white"
	>
		<header
			class="relative grid grid-cols-3 items-center gap-3 p-3 text-center text-lg font-bold tracking-wide shadow-md"
		>
			<div class="col-span-1 flex items-center justify-self-start">
				<button type="button" class="focus:outline-none" on:click="{() => (showFilter = false)}">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="h-6 w-6"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
					</svg>
				</button>

				{#if filterLength > 0}
					<span class="mx-2 h-6 w-[2px] border-l-2 border-gray-300"></span>

					<button
						on:click="{clearFilters}"
						class="text-xs text-primary-500 focus:outline-none hover:underline"
					>
						Clear All
					</button>
				{/if}
			</div>

			<h5 class="col-span-1 justify-self-center">Filter</h5>

			<PrimaryButton
				type="button"
				loadingringsize="xs"
				roundedFull
				class="col-span-1 justify-self-end text-xs"
				on:click="{() => (showFilter = false)}">APPLY</PrimaryButton
			>

			<!-- <button
				on:click="{clearFilters}"
				class="absolute inset-y-0 text-xs text-right right-4 text-primary-500 hover:underline focus:outline-none">
				Clear All
			</button> -->
		</header>

		<div class="flex h-full items-start">
			<!-- Left Section -->

			<div class="flex h-full w-2/6 flex-col border-b border-r bg-gray-100">
				{#if facets?.all_aggs?.age?.all?.buckets?.length > 0}
					<button
						class="border-l-4 p-3 text-left text-sm font-semibold tracking-wide focus:outline-none 
						{selected === 'Age'
							? 'text-primary-500 border-primary-500 bg-white'
							: 'border-gray-100 bg-transparent'}"
						on:click="{() => (selected = 'Age')}"
					>
						Age
					</button>

					<hr class="w-full" />
				{/if}

				{#if facets?.all_aggs?.brands?.all?.buckets?.length > 0}
					<button
						class="border-l-4 p-3 text-left text-sm font-semibold tracking-wide focus:outline-none 
						{selected === 'Brands'
							? 'text-primary-500 border-primary-500 bg-white'
							: 'border-gray-100 bg-transparent'}"
						on:click="{() => (selected = 'Brands')}"
					>
						Brands
					</button>

					<hr class="w-full" />
				{/if}

				{#if facets?.all_aggs?.genders?.all?.buckets?.length > 0}
					<button
						class="border-l-4 p-3 text-left text-sm font-semibold tracking-wide focus:outline-none 
						{selected === 'genders'
							? 'text-primary-500 border-primary-500 bg-white'
							: 'border-gray-100 bg-transparent'}"
						on:click="{() => (selected = 'genders')}"
					>
						Genders
					</button>

					<hr class="w-full" />
				{/if}

				{#if facets?.all_aggs?.sizes?.all?.buckets?.length > 0}
					<button
						class="border-l-4 p-3 text-left text-sm font-semibold tracking-wide focus:outline-none 
						{selected === 'sizes'
							? 'text-primary-500 border-primary-500 bg-white'
							: 'border-gray-100 bg-transparent'}"
						on:click="{() => (selected = 'sizes')}"
					>
						Sizes
					</button>

					<hr class="w-full" />
				{/if}

				{#if facets?.all_aggs?.themes?.all?.buckets?.length > 0}
					<button
						class="border-l-4 p-3 text-left text-sm font-semibold tracking-wide focus:outline-none 
						{selected === 'themes'
							? 'text-primary-500 border-primary-500 bg-white'
							: 'border-gray-100 bg-transparent'}"
						on:click="{() => (selected = 'themes')}"
					>
						Themes
					</button>

					<hr class="w-full" />
				{/if}

				{#if facets?.all_aggs?.promotions?.all?.buckets?.length > 0}
					<button
						class="border-l-4 p-3 text-left text-sm font-semibold tracking-wide focus:outline-none 
						{selected === 'promotions'
							? 'text-primary-500 border-primary-500 bg-white'
							: 'border-gray-100 bg-transparent'}"
						on:click="{() => (selected = 'promotions')}"
					>
						Promotions
					</button>

					<hr class="w-full" />
				{/if}

				{#if facets?.all_aggs?.types?.all?.buckets?.length > 0}
					<button
						class="border-l-4 p-3 text-left text-sm font-semibold tracking-wide focus:outline-none 
						{selected === 'types'
							? 'text-primary-500 border-primary-500 bg-white'
							: 'border-gray-100 bg-transparent'}"
						on:click="{() => (selected = 'types')}"
					>
						Types
					</button>

					<hr class="w-full" />
				{/if}

				{#if facets?.all_aggs?.colors?.all?.buckets?.length > 0}
					<button
						class="border-l-4 p-3 text-left text-sm font-semibold tracking-wide focus:outline-none 
						{selected === 'Colors'
							? 'text-primary-500 border-primary-500 bg-white'
							: 'border-gray-100 bg-transparent'}"
						on:click="{() => (selected = 'Colors')}"
					>
						Colors
					</button>

					<hr class="w-full" />
				{/if}

				{#if facets?.all_aggs?.discount?.all?.buckets?.length > 0}
					<button
						class="border-l-4 p-3 text-left text-sm font-semibold tracking-wide focus:outline-none 
						{selected === 'Discount'
							? 'text-primary-500 border-primary-500 bg-white'
							: 'border-gray-100 bg-transparent'}"
						on:click="{() => (selected = 'Discount')}"
					>
						Discount
					</button>

					<hr class="w-full" />
				{/if}

				{#if facets?.all_aggs?.features?.all?.buckets?.length > 0}
					<button
						class="border-l-4 p-3 text-left text-sm font-semibold tracking-wide focus:outline-none 
						{selected === 'Features'
							? 'text-primary-500 border-primary-500 bg-white'
							: 'border-gray-100 bg-transparent'}"
						on:click="{() => (selected = 'Features')}"
					>
						Features
					</button>

					<hr class="w-full" />
				{/if}

				{#if facets?.all_aggs?.genders?.all?.buckets?.length > 0}
					<button
						class="border-l-4 p-3 text-left text-sm font-semibold tracking-wide focus:outline-none 
						{selected === 'Genders'
							? 'text-primary-500 border-primary-500 bg-white'
							: 'border-gray-100 bg-transparent'}"
						on:click="{() => (selected = 'Genders')}"
					>
						Genders
					</button>

					<hr class="w-full" />
				{/if}

				{#if facets?.all_aggs?.price?.all?.buckets?.length > 0}
					<button
						class="border-l-4 p-3 text-left text-sm font-semibold tracking-wide focus:outline-none 
						{selected === 'Price'
							? 'text-primary-500 border-primary-500 bg-white'
							: 'border-gray-100 bg-transparent'}"
						on:click="{() => (selected = 'Price')}"
					>
						Price
					</button>

					<hr class="w-full" />
				{/if}

				{#if facets?.all_aggs?.sizes?.all?.buckets?.length > 0}
					<button
						class="border-l-4 p-3 text-left text-sm font-semibold tracking-wide focus:outline-none 
						{selected === 'Sizes'
							? 'text-primary-500 border-primary-500 bg-white'
							: 'border-gray-100 bg-transparent'}"
						on:click="{() => (selected = 'Sizes')}"
					>
						Sizes
					</button>

					<hr class="w-full" />
				{/if}

				{#if megamenu}
					<button
						class="border-l-4 p-3 text-left text-sm font-semibold tracking-wide focus:outline-none 
						{selected === 'Categories'
							? 'text-primary-500 border-primary-500 bg-white'
							: 'border-gray-100 bg-transparent'}"
						on:click="{() => (selected = 'Categories')}"
					>
						Categories
					</button>

					<hr class="w-full" />
				{/if}
			</div>

			<!-- Right Section -->

			<div class="h-full w-4/6">
				{#if selected === 'Age'}
					<div
						class="h-[93vh] w-full overflow-y-auto p-4 overflow-x-hidden"
						in:fly="{{ y: -10, duration: 300, delay: 300 }}"
					>
						{#if facets?.all_aggs?.age?.all?.buckets?.length > 0}
							<CheckboxEs
								items="{facets?.all_aggs?.age?.all?.buckets}"
								model="age"
								selectedItems="{fl.age || []}"
								showSearchBox
								on:go="{goCheckbox}"
							/>
						{/if}
					</div>
				{/if}

				{#if selected === 'Brands'}
					<div
						class="h-[93vh] w-full overflow-y-auto p-4 overflow-x-hidden"
						in:fly="{{ y: -10, duration: 300, delay: 300 }}"
					>
						{#if facets?.all_aggs?.brands?.all?.buckets?.length > 0}
							<CheckboxEs
								items="{facets?.all_aggs?.brands?.all?.buckets}"
								model="brands"
								selectedItems="{fl.brands || []}"
								showSearchBox
								on:go="{goCheckbox}"
							/>
						{/if}
					</div>
				{/if}

				{#if selected === 'Colors'}
					<div
						class="h-[93vh] w-full overflow-y-auto p-4 overflow-x-hidden"
						in:fly="{{ y: -10, duration: 300, delay: 300 }}"
					>
						{#if facets?.all_aggs?.colors?.all?.buckets?.length > 0}
							<CheckboxEs
								items="{facets?.all_aggs?.colors?.all?.buckets}"
								model="colors"
								selectedItems="{fl.colors || []}"
								showSearchBox
								on:go="{goCheckbox}"
							/>
						{/if}
					</div>
				{/if}

				{#if selected === 'Discount'}
					<div
						class="h-[93vh] w-full overflow-y-auto p-4 overflow-x-hidden"
						in:fly="{{ y: -10, duration: 300, delay: 300 }}"
					>
						{#if facets?.all_aggs?.discount?.all?.buckets?.length > 0}
							<CheckboxEs
								items="{facets?.all_aggs?.discount?.all?.buckets}"
								model="discount"
								selectedItems="{fl.discount || []}"
								showSearchBox
								on:go="{goCheckbox}"
							/>
						{/if}
					</div>
				{/if}

				{#if selected === 'Features'}
					<div
						class="h-[93vh] w-full overflow-y-auto p-4 overflow-x-hidden"
						in:fly="{{ y: -10, duration: 300, delay: 300 }}"
					>
						{#if facets?.all_aggs?.features?.all?.buckets?.length > 0}
							<CheckboxEs
								items="{facets?.all_aggs?.features?.all?.buckets}"
								model="features"
								selectedItems="{fl.features || []}"
								showSearchBox
								on:go="{goCheckbox}"
							/>
						{/if}
					</div>
				{/if}

				{#if selected === 'Genders'}
					<div
						class="h-[93vh] w-full overflow-y-auto p-4 overflow-x-hidden"
						in:fly="{{ y: -10, duration: 300, delay: 300 }}"
					>
						{#if facets?.all_aggs?.genders?.all?.buckets?.length > 0}
							<CheckboxEs
								items="{facets?.all_aggs?.genders?.all?.buckets}"
								model="genders"
								selectedItems="{fl.genders || []}"
								showSearchBox
								on:go="{goCheckbox}"
							/>
						{/if}
					</div>
				{/if}

				{#if selected === 'Price'}
					<div
						class="h-[93vh] w-full overflow-y-auto p-4 overflow-x-hidden"
						in:fly="{{ y: -10, duration: 300, delay: 300 }}"
					>
						{#if facets?.all_aggs?.price?.all?.buckets?.length > 0}
							<CheckboxEs
								items="{facets?.all_aggs?.price?.all?.buckets}"
								model="price"
								selectedItems="{fl.price || []}"
								showSearchBox
								on:go="{goCheckbox}"
							/>
						{/if}
					</div>
				{/if}

				{#if selected === 'Sizes'}
					<div
						class="h-[93vh] w-full overflow-y-auto p-4 overflow-x-hidden"
						in:fly="{{ y: -10, duration: 300, delay: 300 }}"
					>
						{#if facets?.all_aggs?.sizes?.all?.buckets?.length > 0}
							<CheckboxEs
								items="{facets?.all_aggs?.sizes?.all?.buckets}"
								model="sizes"
								selectedItems="{fl.sizes || []}"
								showSearchBox
								on:go="{goCheckbox}"
							/>
						{/if}
					</div>
				{/if}

				{#if selected === 'Categories'}
					<div
						class="h-[93vh] w-full overflow-y-auto p-4 overflow-x-hidden"
						in:fly="{{ y: -10, duration: 300, delay: 300 }}"
					>
						<ul class="flex cursor-pointer flex-col text-sm">
							{#if megamenu}
								<!-- 1st level categories -->

								<ul class="flex w-full cursor-pointer flex-col text-sm">
									{#each megamenu as m, mx}
										<li>
											{#if m.children?.length}
												<div
													class="flex w-full items-center justify-between gap-2
													{selectedCategory === m.name ? 'text-blue-600 font-medium' : 'hover:text-blue-600'}"
												>
													<a
														href="/{m.slug}"
														aria-label="Click to route into category related products page"
														class="flex-1"
													>
														{m.name}
													</a>

													<button
														type="button"
														class="overflow-hidden p-1 focus:outline-none"
														on:click="{() => handleToggleSubCategory(m, mx)}"
													>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															viewBox="0 0 20 20"
															fill="currentColor"
															class="h-5 w-5 shrink-0 transition duration-300
																{showSubCategory[mx] ? 'transform rotate-90' : ''}"
														>
															<path
																fill-rule="evenodd"
																d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
																clip-rule="evenodd"></path>
														</svg>
													</button>
												</div>
											{:else}
												<a
													href="/{m.slug}"
													aria-label="Click to route into category related products page"
													class="flex w-full items-center justify-between gap-2 py-1 text-left focus:outline-none hover:text-blue-600"
												>
													{m.name}
												</a>
											{/if}

											<!-- 2nd level categories -->

											{#if showSubCategory[mx]}
												<ul class="ml-2">
													{#each m.children as c, cx}
														<li>
															{#if c.children?.length}
																<div
																	class="flex w-full items-center justify-between gap-2
																	{selectedCategory2 === c.name ? 'text-blue-600 font-medium' : 'hover:text-blue-600'}"
																>
																	<a
																		href="/{c.slug}"
																		aria-label="Click to route into category related products page"
																		class="flex-1"
																	>
																		{c.name}
																	</a>

																	<button
																		type="button"
																		class="overflow-hidden p-1 focus:outline-none"
																		on:click="{() => handleToggleSubCategory2(c, cx)}"
																	>
																		<svg
																			xmlns="http://www.w3.org/2000/svg"
																			viewBox="0 0 20 20"
																			fill="currentColor"
																			class="h-5 w-5 shrink-0 transition duration-300
																				{showSubCategory2[cx] ? 'transform rotate-90' : ''}"
																		>
																			<path
																				fill-rule="evenodd"
																				d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
																				clip-rule="evenodd"></path>
																		</svg>
																	</button>
																</div>
															{:else}
																<a
																	href="/{c.slug}"
																	aria-label="Click to route into category related products page"
																	class="flex w-full items-center justify-between gap-2 py-1 text-left focus:outline-none hover:text-blue-600"
																>
																	{c.name}
																</a>
															{/if}

															<!-- 3rd level categories -->

															{#if showSubCategory2[cx]}
																<ul class="ml-4">
																	{#each c.children as cc}
																		<a
																			href="/{cc.slug}"
																			aria-label="Click to route into category related products page"
																			class="flex w-full items-center justify-between gap-2 py-1 text-left focus:outline-none hover:text-blue-600"
																		>
																			{cc.name}
																		</a>
																	{/each}
																</ul>
															{/if}
														</li>
													{/each}
												</ul>
											{/if}
										</li>
									{/each}
								</ul>
							{/if}
						</ul>
					</div>
				{/if}
			</div>
		</div>

		<!-- <div
			class="absolute inset-x-0 bottom-0 z-[100] flex items-center divide-x-2 divide-gray-300 border-2 border-gray-300 bg-white">
			<button
				type="button"
				class="w-1/2 p-3 font-bold tracking-wide text-center focus:outline-none"
				on:click="{() => (showFilter = false)}">
				Cancel
			</button>

			<button
				type="button"
				class="w-1/2 p-3 font-bold tracking-wide text-center focus:outline-none"
				on:click="{() => (showFilter = false)}">
				Apply
			</button>
		</div> -->
	</div>
{/if}

{#if showSort}
	<div class="fixed inset-0 z-[100] flex h-screen w-screen items-end bg-black bg-opacity-50">
		<button
			type="button"
			class="fixed inset-0 h-screen w-screen focus:outline-none"
			on:click="{() => (showSort = false)}"></button>

		<div
			transition:fly="{{ y: 626, duration: 300 }}"
			class="relative z-10 max-h-max w-full rounded-t-lg bg-white"
		>
			<div class="flex items-center justify-between gap-5 border-b border-gray-300 p-3 text-sm">
				<span>Sort</span>

				<button type="button" class="focus:outline-none" on:click="{() => (showSort = false)}">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-4 w-4 text-gray-500"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fill-rule="evenodd"
							d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
							clip-rule="evenodd"></path>
					</svg>
				</button>
			</div>

			<ul class="flex flex-col gap-3 p-3">
				{#each sorts as s}
					<li>
						<button
							type="button"
							class="w-full text-left text-sm font-semibold tracking-wide focus:outline-none"
							on:click="{() => sortNow(s.val) && (showSort = false)}"
						>
							{s.name}
						</button>
					</li>
				{/each}
			</ul>
		</div>
	</div>
{/if}
