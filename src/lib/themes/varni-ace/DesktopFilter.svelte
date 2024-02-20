<script>
import { browser } from '$app/environment'
import { CheckboxEs, RadioEs } from '$lib/themes/varni-ace'
import { constructURL2, toast } from '$lib/utils'
import { createEventDispatcher, onMount } from 'svelte'
import { goto } from '$app/navigation'
import { page } from '$app/stores'
import { services } from '@misiki/litekart-utils'
import { slide } from 'svelte/transition'

const dispatch = createEventDispatcher()

export let appliedFilters = {}
export let filterLength = 0
export let fl = {}
export let mergedArr = []
export let priceRange = []
export let query // Required because after loading finished then only we will initiate the price slider component
export let facets = {}

let clazz
export { clazz as class }

let selectedCategory
let selectedCategory2
let showSubCategory = []
let showSubCategory2 = []
// ----------------
let allAges = []
let allBrands = []
let allColors = []
// let allDiscount = []
let allFeatures = []
let allGenders = []
let allPromotions = []
let allSizes = []
// let allTags = []
let allTypes = []
let allVendors = []
let megamenu
// ----------------
let showCategories = false

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
})

function getFacetsWithProducts() {
	if (facets?.all_aggs?.age?.all?.buckets?.length) {
		allAges = facets?.all_aggs?.age?.all?.buckets?.filter((t) => t.doc_count > 0)
	}
	if (facets?.all_aggs?.brands?.all?.buckets?.length) {
		allBrands = facets?.all_aggs?.brands?.all?.buckets?.filter((t) => t.doc_count > 0)
	}
	if (facets?.all_aggs?.colors?.all?.buckets?.length) {
		allColors = facets?.all_aggs?.colors?.all?.buckets?.filter((t) => t.doc_count > 0)
	}
	// if (facets?.all_aggs?.discount?.all?.buckets?.length) {
	// 	allDiscount = facets?.all_aggs?.discount?.all?.buckets?.filter((t) => t.doc_count > 0)
	// }
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
	// if (facets?.all_aggs?.tags?.all?.buckets?.length) {
	// 	allTags = facets?.all_aggs?.tags?.all?.buckets?.filter((t) => t.doc_count > 0)
	// }
	if (facets?.all_aggs?.types?.all?.buckets?.length) {
		allTypes = facets?.all_aggs?.types?.all?.buckets?.filter((t) => t.doc_count > 0)
	}
	if (facets?.all_aggs?.vendors?.all?.buckets?.length) {
		allVendors = facets?.all_aggs?.vendors?.all?.buckets?.filter((t) => t.doc_count > 0)
	}
}

async function getMegamenu() {
	if (browser) {
		try {
			// megamenu = await getMegamenuFromStore({
			// 	sid: null,
			// 	storeId: $page?.data?.storeId,
			// 	origin: $page.data.origin
			// })

			const localmegamenu = localStorage.getItem('megamenu')

			if (!localmegamenu || localmegamenu === 'undefined') {
				megamenu = await services.CategoryService.fetchMegamenuData({
					origin: $page.data.origin,
					storeId: $page?.data?.storeId
				})
			} else {
				megamenu = JSON.parse(localmegamenu)
			}
		} catch (e) {
			toast(e, 'error')
		} finally {
		}
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
	class="{clazz} flex h-[85vh] w-56 shrink-0 flex-col items-start overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-slate-200">
	<h6 class="uppercase font-bold text-primary-500">Diamond by ace</h6>

	<hr class="my-3" />

	<div class="flex flex-col items-start gap-1">
		<!-- Applied filters count -->

		<h6 class="font-bold tracking-wide">
			<span>
				{#if filterLength}
					{filterLength}
				{/if}
			</span>

			<span>
				{filterLength > 1 ? 'Filters' : 'Filter'}
			</span>
		</h6>

		<!-- Applied filters -->

		<ul class="flex flex-row flex-wrap gap-1 text-xs">
			{#each Object.entries(appliedFilters) as [key, value], index (key)}
				{#if value}
					<li class="first-letter:uppercase">
						{value}
					</li>
				{/if}
			{/each}
		</ul>

		<!-- Clear All -->

		{#if filterLength}
			<button
				type="button"
				class="text-xs text-primary-500 transition duration-300 focus:outline-none hover:underline"
				on:click="{clearFilters}">
				Clear All
			</button>
		{/if}
	</div>

	<!-- Megamenu -->

	{#if megamenu?.length}
		<div class="my-3">
			<hr class="mb-3 w-full" />

			<button
				type="button"
				class="mb-3 w-full text-left flex items-center gap-2 justify-between"
				on:click="{() => (showCategories = !showCategories)}">
				<h6 class="flex-1 text-sm font-normal text-primary-500">Category</h6>

				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
					class="w-5 h-5transition duration-300
					{showCategories ? 'text-secondary-500 transform -rotate-180' : ''}">
					<path
						fill-rule="evenodd"
						d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
						clip-rule="evenodd"></path>
				</svg>
			</button>

			<!-- 1st level categories -->
			{#if showCategories}
				<ul
					transition:slide="{{ duration: 300 }}"
					class="flex w-full cursor-pointer flex-col text-sm">
					{#each megamenu as m, mx}
						<li>
							{#if m.children?.length}
								<div
									class="flex w-full items-center justify-between gap-2
								{selectedCategory === m.name ? 'text-blue-600 font-medium' : 'hover:text-blue-600'}">
									<a
										href="/{m.slug}"
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
									href="/{m.slug}"
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
														href="/{c.slug}"
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
													href="/{c.slug}"
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
															href="/{cc.slug}"
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
			{/if}
		</div>
	{/if}

	{#if allAges?.length > 0}
		<div class="my-3">
			<hr class="mb-3 w-full" />

			<CheckboxEs
				items="{allAges}"
				model="age"
				selectedItems="{fl.age || []}"
				showSearchBox
				on:go="{goCheckbox}" />
		</div>
	{/if}

	{#if allBrands?.length > 0}
		<div class="my-3">
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
		<div class="my-3">
			<hr class="mb-3 w-full" />

			<CheckboxEs
				items="{allColors}"
				title="Colors"
				model="colors"
				selectedItems="{fl.colors || []}"
				on:go="{goCheckbox}" />
		</div>
	{/if}

	<!-- {#if allDiscount?.length > 0}
		<div class="my-3">
			<hr class="mb-3 w-full" />

			<RadioEs
				items="{allDiscount}"
				title="Discount"
				model="discount"
				selectedItems="{fl.discount || []}"
				on:go="{goCheckbox}" />
		</div>
	{/if} -->

	{#if allFeatures?.length > 0}
		<div class="my-3">
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
		<div class="my-3">
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
		<div class="my-3">
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
		<div class="my-3">
			<hr class="mb-3 w-full" />

			<CheckboxEs
				items="{allSizes}"
				title="Sizes"
				model="sizes"
				selectedItems="{fl.sizes || []}"
				on:go="{goCheckbox}" />
		</div>
	{/if}

	<!-- {#if allTags?.length > 0}
		<div class="my-3">
			<hr class="mb-3 w-full" />

			<CheckboxEs
				items="{allTags}"
				title="tags"
				model="tags"
				selectedItems="{fl.tags || []}"
				on:go="{goCheckbox}" />
		</div>
	{/if} -->

	{#if allTypes?.length > 0}
		<div class="my-3">
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
		<div class="my-3">
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
		<div class="my-3">
			<hr class="mb-3 w-full" />

			<RadioEs
				items="{priceRange}"
				title="Price"
				model="price"
				selectedItems="{fl.price || []}"
				on:go="{goCheckbox}" />
		</div>
	{/if}

	<!-- {#if facets?.all_aggs?.price?.all?.buckets?.length > 0}
		<div class="my-3">
			<hr class="mb-3 w-full" />

			<RadioEs
				items="{facets?.all_aggs?.price?.all?.buckets}"
				title="Price"
				model="price"
				selectedItems="{fl.price || []}"
				on:go="{goCheckbox}" />
		</div>
	{/if} -->
</div>
