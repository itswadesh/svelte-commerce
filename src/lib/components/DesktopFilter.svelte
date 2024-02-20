<script lang="ts">
import { constructURL2, navigateToProperPath, toast } from '$lib/utils'
import { createEventDispatcher, onMount } from 'svelte'
import { GetColorName } from 'hex-color-to-color-name'
import { goto } from '$app/navigation'
import { page } from '$app/stores'
import { RadioEs, CheckboxEs } from '$lib/ui'
import { slide } from 'svelte/transition'
import ColoredBackground from '$lib/assets/konva/colored_background.png'
import Cookie from 'cookie-universal'
import Fuse from 'fuse.js'
import { browser } from '$app/environment'
import { getAllMegamenuFromStore } from '$lib/store/megamenu'

const cookies = Cookie()
const dispatch = createEventDispatcher()

export let appliedFilters = {}
export let facets = {}
export let filterLength = 0
export let fl = {}
export let mergedArr = []
export let priceRange = []
export let query // Required because after loading finished then only we will initiate the price slider component

let clazz
export { clazz as class }

let pincode = null
let searchCategoryValue = null
let selectedCategory
let selectedCategory2
let showSearchBox = false
let showSubCategory = []
let showSubCategory2 = []

let allAges = []
let allAttributes = []
let allBrands = []
let allColors = []
let allDiscount = []
let allFeatures = []
let allGenders = []
let allPromotions = []
let allSizes = []
let allTags = []
let allTypes = []
let allVendors = []
let megamenu = []
let megamenuResult = []

const options = {
	keys: ['name', 'children.name', 'children.children.name'], // Search name and children's names
	threshold: 0.4 // Require at least 40% match score
}

function clearFilters() {
	fl = {}
	appliedFilters = {}
	const q = $page?.url?.searchParams.get('q') || ''
	const url = `${$page?.url?.pathname}?q=${q}`
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

onMount(async () => {
	$page.url.searchParams.forEach(function (value, key) {
		fl[key] = value
		if (key !== 'page' && key !== 'sort' && key !== 'lat' && key !== 'lng')
			appliedFilters[key] = value
	})

	getFacetsWithProducts()

	await getMegamenu()

	const pin = cookies.get('zip')

	if (pin && pin.toString()?.length === 6) {
		pincode = pin
	}
})

function getFacetsWithProducts() {
	if (facets?.all_aggs?.age?.all?.buckets?.length) {
		allAges = facets?.all_aggs?.age?.all?.buckets?.filter((t) => t.doc_count > 0)
	}
	if (facets?.all_aggs?.attributes?.all?.key?.buckets?.length) {
		allAttributes = facets?.all_aggs?.attributes?.all?.key?.buckets?.filter((t) => t.doc_count > 0)
	}
	if (facets?.all_aggs?.brands?.all?.buckets?.length) {
		allBrands = facets?.all_aggs?.brands?.all?.buckets?.filter((t) => t.doc_count > 0)
	}
	if (facets?.all_aggs?.colors?.all?.buckets?.length) {
		allColors = facets?.all_aggs?.colors?.all?.buckets?.filter((t) => t.doc_count > 0)
	}
	if (facets?.all_aggs?.discount?.all?.buckets?.length) {
		allDiscount = facets?.all_aggs?.discount?.all?.buckets?.filter((t) => t.doc_count > 0)
	}
	if (facets?.all_aggs?.features?.all?.buckets?.length) {
		allFeatures = facets?.all_aggs?.features?.all?.buckets?.filter((t) => t.doc_count > 0)
	}
	if (facets?.all_aggs?.genders?.all?.buckets?.length) {
		allGenders = facets?.all_aggs?.genders?.all?.buckets?.filter((t) => t.doc_count > 0)
	}
	if (facets?.all_aggs?.promotions?.all?.buckets?.length) {
		allPromotions = facets?.all_aggs?.promotions?.all?.buckets?.filter((t) => t.doc_count > 0)
	}
	if (facets?.all_aggs?.sizes?.all?.buckets?.length) {
		allSizes = facets?.all_aggs?.sizes?.all?.buckets?.filter((t) => t.doc_count > 0)
	}
	if (facets?.all_aggs?.tags?.all?.buckets?.length) {
		allTags = facets?.all_aggs?.tags?.all?.buckets?.filter((t) => t.doc_count > 0)
	}
	if (facets?.all_aggs?.types?.all?.buckets?.length) {
		allTypes = facets?.all_aggs?.types?.all?.buckets?.filter((t) => t.doc_count > 0)
	}
	if (facets?.all_aggs?.vendors?.all?.buckets?.length) {
		allVendors = facets?.all_aggs?.vendors?.all?.buckets?.filter((t) => t.doc_count > 0)
	}
}

// // let allMegamenu
// AllMegamenuStore.subscribe((data) => {
// 	megamenu = data
// 	megamenuResult = megamenu
// })
let loadingForMegamenu = false
async function getMegamenu() {
	if (browser) {
		try {
			loadingForMegamenu = true

			megamenu = await getAllMegamenuFromStore({
				storeId: $page?.data?.storeId,
				origin: $page.data.origin
			})

			if (megamenu?.length) {
				megamenu = megamenu.filter((e) => {
					return e.name !== 'New Arrivals'
				})
			}

			megamenuResult = megamenu
		} catch (e) {
			toast(e, 'error')
		} finally {
			loadingForMegamenu = false
		}
	}
}

function searchCategories() {
	const fuse = new Fuse(megamenu, options)

	megamenuResult = fuse.search(searchCategoryValue)

	megamenuResult = megamenuResult.map((m) => {
		return m.item
	})

	if (!megamenuResult.length) {
		megamenuResult = megamenu
	}

	// console.log('megamenuResult', megamenuResult)
}

async function handleSearchBox() {
	showSearchBox = !showSearchBox
	document.getElementById(`CategoriesSearchText`).focus()
	if (!showSearchBox) {
		searchCategoryValue = ''
		await searchCategories()
	}
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

	// console.log('appliedFilters', appliedFilters)
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
</script>

<div
	class="{clazz} flex h-[85vh] w-56 shrink-0 flex-col items-start pr-6 overflow-y-scroll scrollbar-thin scrollbar-thumb-slate-200">
	<div class="flex flex-col items-start gap-1">
		<!-- Applied filters count -->

		<h4>
			{#if filterLength}
				{filterLength}
			{/if}

			{filterLength > 1 ? 'Filters' : 'Filter'}
		</h4>

		<!-- Applied filters -->

		<ul class="flex flex-row flex-wrap gap-1 text-xs">
			{#each Object.entries(appliedFilters) as [key, value], index (key)}
				{#if value}
					<li class="flex flex-wrap items-center gap-1 first-letter:uppercase">
						{#if key === 'colors'}
							{#each value.toString().split(',') as v, vx}
								{#if v === 'MultiColor'}
									<img
										src="{ColoredBackground}"
										alt=""
										class="h-5 w-5 shrink-0 border rounded-full object-cover object-center" />

									<span>
										{v}
									</span>
								{:else}
									<div class="h-5 w-5 shrink-0 border rounded-full" style="background-color: {v};">
									</div>

									<span>
										{GetColorName(v)}
									</span>
								{/if}

								{#if value.toString().split(',')?.length > 1 && vx !== value
											.toString()
											.split(',')?.length - 1}
									,
								{/if}
							{/each}
						{:else}
							<span>
								{value}
							</span>
						{/if}

						{#if index < Object.entries(appliedFilters)?.length - 1}
							<div class="h-1 w-1 rounded-full bg-zinc-500"></div>
						{/if}
					</li>
				{/if}
			{/each}
		</ul>

		<!-- Clear All -->

		{#if filterLength}
			<button
				type="button"
				class="text-left text-sm text-secondary-500 hover:underline focus:outline-none"
				on:click="{clearFilters}">
				Clear All
			</button>
		{/if}
	</div>

	<!-- Megamenu -->

	{#if megamenuResult?.length}
		<div class="my-3">
			<hr class="mb-3 w-full" />

			<div class="relative mb-3 flex items-center justify-between gap-4">
				<h6>Categories</h6>

				<div class="absolute inset-x-0 right-0 z-10 flex h-8 justify-end">
					<div
						class="relative mb-3 h-8 rounded-full transition duration-300
						{showSearchBox ? 'w-full bg-zinc-100' : 'w-8 hover:bg-zinc-100'}">
						<input
							type="text"
							id="CategoriesSearchText"
							placeholder="Search for categories"
							class="h-8 w-full truncate rounded-full bg-transparent py-2 pl-4 pr-10 text-sm focus:outline-none"
							bind:value="{searchCategoryValue}"
							on:input="{searchCategories}" />

						<button
							type="button"
							class="absolute inset-y-0 right-2 z-20 flex items-center justify-center text-zinc-500 focus:outline-none"
							on:click="{handleSearchBox}">
							{#if !showSearchBox}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-4 w-4"
									viewBox="0 0 20 20"
									fill="currentColor">
									<path
										fill-rule="evenodd"
										d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
										clip-rule="evenodd"></path>
								</svg>
							{:else}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-4 w-4"
									viewBox="0 0 20 20"
									fill="currentColor">
									<path
										fill-rule="evenodd"
										d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
										clip-rule="evenodd"></path>
								</svg>
							{/if}
						</button>
					</div>
				</div>
			</div>

			<!-- 1st level categories -->

			<ul class="flex w-full cursor-pointer flex-col text-sm">
				{#each megamenuResult as m, mx}
					<li>
						{#if m.children?.length}
							<div
								class="flex w-full items-center justify-between gap-2
								{selectedCategory === m.name ? 'text-blue-600 font-medium' : 'hover:text-blue-600'}">
								<a
									href="{navigateToProperPath(m.link || m.slug)}"
									aria-label="Click to visit category related products"
									class="flex-1">
									{m.name}
								</a>

								<button
									type="button"
									class="overflow-hidden p-1 focus:outline-none"
									on:click="{() => handleToggleSubCategory(m, mx)}">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 20 20"
										fill="currentColor"
										class="h-5 w-5 shrink-0 transition duration-300
										{showSubCategory[mx] ? 'transform rotate-90' : ''}">
										<path
											fill-rule="evenodd"
											d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
											clip-rule="evenodd"></path>
									</svg>
								</button>
							</div>
						{:else}
							<a
								href="{navigateToProperPath(m.link || m.slug)}"
								aria-label="Click to visit category related products"
								class="flex w-full items-center justify-between gap-2 py-1 text-left focus:outline-none hover:text-blue-600">
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
												{selectedCategory2 === c.name ? 'text-blue-600 font-medium' : 'hover:text-blue-600'}">
												<a
													href="{navigateToProperPath(c.link || c.slug)}"
													aria-label="Click to visit category related products page"
													class="flex-1">
													{c.name}
												</a>

												<button
													type="button"
													class="overflow-hidden p-1 focus:outline-none"
													on:click="{() => handleToggleSubCategory2(c, cx)}">
													<svg
														xmlns="http://www.w3.org/2000/svg"
														viewBox="0 0 20 20"
														fill="currentColor"
														class="h-5 w-5 shrink-0 transition duration-300
														{showSubCategory2[cx] ? 'transform rotate-90' : ''}">
														<path
															fill-rule="evenodd"
															d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
															clip-rule="evenodd"></path>
													</svg>
												</button>
											</div>
										{:else}
											<a
												href="{navigateToProperPath(c.link || c.slug)}"
												aria-label="Click to visit category related products page"
												class="flex w-full items-center justify-between gap-2 py-1 text-left focus:outline-none hover:text-blue-600">
												{c.name}
											</a>
										{/if}

										<!-- 3rd level categories -->

										{#if showSubCategory2[cx]}
											<ul class="ml-4">
												{#each c.children as cc}
													<a
														href="{navigateToProperPath(cc.link || cc.slug)}"
														aria-label="Click to visit category related products page"
														class="flex w-full items-center justify-between gap-2 py-1 text-left focus:outline-none hover:text-blue-600">
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
		</div>
	{/if}

	{#if allAges?.length > 0}
		<div transition:slide="{{ duration: 300 }}" class="my-3">
			<hr class="mb-3 w-full" />

			<CheckboxEs
				items="{allAges}"
				model="age"
				selectedItems="{fl.age || []}"
				showSearchBox
				on:go="{goCheckbox}" />
		</div>
	{/if}

	{#if allAttributes?.length > 0}
		{#each allAttributes as attribute}
			<div transition:slide="{{ duration: 300 }}" class="my-3">
				<hr class="mb-3 w-full" />

				<CheckboxEs
					items="{attribute.value?.buckets}"
					title="{attribute.key}"
					model="{attribute.key}"
					selectedItems="{fl[attribute.key] || []}"
					on:go="{goCheckbox}" />
			</div>
		{/each}
	{/if}

	{#if allBrands?.length > 0}
		<div transition:slide="{{ duration: 300 }}" class="my-3">
			<hr class="mb-3 w-full" />

			<CheckboxEs
				items="{allBrands}"
				title="Brands"
				model="brands"
				selectedItems="{fl.brands || []}"
				on:go="{goCheckbox}" />
		</div>
	{/if}

	{#if allColors?.length > 0}
		<div transition:slide="{{ duration: 300 }}" class="my-3">
			<hr class="mb-3 w-full" />

			<CheckboxEs
				items="{allColors}"
				title="Colors"
				model="colors"
				isColor
				selectedItems="{fl.colors || []}"
				on:go="{goCheckbox}" />
		</div>
	{/if}

	{#if allDiscount?.length > 1}
		<div transition:slide="{{ duration: 300 }}" class="my-3">
			<hr class="mb-3 w-full" />

			<RadioEs
				items="{allDiscount}"
				title="Discount"
				model="discount"
				selectedItems="{fl.discount || []}"
				on:go="{goCheckbox}" />
		</div>
	{/if}

	{#if allFeatures?.length > 0}
		<div transition:slide="{{ duration: 300 }}" class="my-3">
			<hr class="mb-3 w-full" />

			<RadioEs
				items="{allFeatures}"
				title="Features"
				model="features"
				selectedItems="{fl.features || []}"
				on:go="{goCheckbox}" />
		</div>
	{/if}

	{#if allGenders?.length > 0}
		<div transition:slide="{{ duration: 300 }}" class="my-3">
			<hr class="mb-3 w-full" />

			<CheckboxEs
				items="{allGenders}"
				title="Genders"
				model="genders"
				selectedItems="{fl.genders || []}"
				on:go="{goCheckbox}" />
		</div>
	{/if}

	{#if allPromotions?.length > 0}
		<div transition:slide="{{ duration: 300 }}" class="my-3">
			<hr class="mb-3 w-full" />

			<CheckboxEs
				items="{allPromotions}"
				title="Promotions"
				model="promotions"
				selectedItems="{fl.promotions || []}"
				on:go="{goCheckbox}" />
		</div>
	{/if}

	{#if allSizes?.length > 0}
		<div transition:slide="{{ duration: 300 }}" class="my-3">
			<hr class="mb-3 w-full" />

			<CheckboxEs
				items="{allSizes}"
				title="Sizes"
				model="sizes"
				selectedItems="{fl.sizes || []}"
				on:go="{goCheckbox}" />
		</div>
	{/if}

	{#if allTags?.length > 0}
		<div transition:slide="{{ duration: 300 }}" class="my-3">
			<hr class="mb-3 w-full" />

			<CheckboxEs
				items="{allTags}"
				title="tags"
				model="tags"
				selectedItems="{fl.tags || []}"
				on:go="{goCheckbox}" />
		</div>
	{/if}

	{#if allTypes?.length > 0}
		<div transition:slide="{{ duration: 300 }}" class="my-3">
			<hr class="mb-3 w-full" />

			<CheckboxEs
				items="{allTypes}"
				title="types"
				model="types"
				selectedItems="{fl.types || []}"
				on:go="{goCheckbox}" />
		</div>
	{/if}

	{#if allVendors?.length > 0}
		<div transition:slide="{{ duration: 300 }}" class="my-3">
			<hr class="mb-3 w-full" />

			<CheckboxEs
				items="{allVendors}"
				title="vendors"
				model="vendors"
				selectedItems="{fl.vendors || []}"
				on:go="{goCheckbox}" />
		</div>
	{/if}

	{#if priceRange?.length > 0}
		<div transition:slide="{{ duration: 300 }}" class="my-3">
			<hr class="mb-3 w-full" />

			<RadioEs
				items="{priceRange}"
				title="Price"
				model="price"
				selectedItems="{fl.price || []}"
				on:go="{goCheckbox}" />
		</div>
	{/if}
</div>
