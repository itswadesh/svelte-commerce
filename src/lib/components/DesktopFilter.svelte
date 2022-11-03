<script>
import { goto } from '$app/navigation'
import { onMount } from 'svelte'
import { constructURL2, toast } from '$lib/util'
import CheckboxEs from '$lib/ui/CheckboxEs.svelte'
import { page } from '$app/stores'
import { createEventDispatcher } from 'svelte'
import { getAPI } from '$lib/util/api'
import { browser } from '$app/environment'

const dispatch = createEventDispatcher()

export let facets = {},
	fl = {},
	appliedFilters = {},
	query, // Required because after loading finished then only we will initiate the price slider component
	filterLength = 0,
	mergedArr = []

// console.log('facets inside desktop filter = ', facets)

let clazz
export { clazz as class }

let megamenu
let selectedCategory
let showSubCategory = []
let selectedCategory2
let showSubCategory2 = []

function clearFilters() {
	fl = {}
	appliedFilters = {}
	let url = $page?.url?.pathname
	goto(`${url}?page=1`)
	// dispatch('clearAll')
}

function goCheckbox(e) {
	fl[e.detail.model] = e.detail.selectedItems
	fl.q = $page.url.searchParams.get('q')
	let url = constructURL2(`${$page.url.pathname}`, fl)
	// const nU = new URL('http://localhost' + url)
	// const splitedAtAmp = url?.split('?', 2)[1]?.split('&')
	appliedFilters = { ...fl }
	delete appliedFilters.page
	delete appliedFilters.sort
	delete appliedFilters.lat
	delete appliedFilters.lng
	// for (const property of splitedAtAmp) {
	// 	filterLength += property.split(',').length
	// }
	// appliedFilters = appliedFilters
	// invalidate(`${url}page=1`)
	goto(`${url}page=1`)
}

function filterChanged(op) {}

onMount(async () => {
	$page.url.searchParams.forEach(function (value, key) {
		fl[key] = value
		if (key !== 'page' && key !== 'sort' && key !== 'lat' && key !== 'lng')
			appliedFilters[key] = value
	})

	getMegamenu()
})

async function getMegamenu() {
	if (browser) {
		try {
			const localmegamenu = localStorage.getItem('megamenu')

			if (!localmegamenu || localmegamenu === 'undefined') {
				megamenu = await getAPI(
					`categories/megamenu?megamenu=true&store=${$page.data?.store?.id}`,
					$page.data.origin
				)

				// console.log('zzzzzzzzzzzzzzzzzz', megamenu)
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
	class="{clazz} flex h-[85vh] w-56 flex-shrink-0 flex-col items-start overflow-x-auto overflow-x-hidden pr-6 scrollbar-thin scrollbar-thumb-slate-200">
	<div class="flex flex-col items-start gap-1">
		<h6 class="font-bold tracking-wide">
			<span>
				{#if filterLength} {filterLength} {/if}
			</span>

			<span>
				{filterLength > 1 ? 'Filters' : 'Filter'}
			</span>
		</h6>

		<ul class="flex flex-row flex-wrap gap-1 text-xs">
			{#each Object.entries(appliedFilters) as [key, value], index (key)}
				{#if value}
					<li class="first-letter:uppercase">
						{value}
					</li>
				{/if}
			{/each}
		</ul>

		{#if filterLength}
			<button
				type="button"
				class="text-xs text-primary-500 transition duration-300 focus:outline-none hover:underline"
				on:click="{clearFilters}">
				Clear All
			</button>
		{/if}
	</div>

	{#if megamenu}
		<div class="my-3">
			<hr class="mb-3 w-full" />

			<h6 class="mb-3 font-bold tracking-wide">Categories</h6>

			<!-- 1st level categories -->

			<ul class="flex w-full cursor-pointer flex-col text-sm">
				{#each megamenu as m, mx}
					<li>
						{#if m.children?.length}
							<div
								class="flex w-full items-center justify-between gap-2
								{selectedCategory === m.name ? 'text-blue-600 font-medium' : 'hover:text-blue-600'}">
								<a href="/{m.slug}" class="flex-1">
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
										class="h-5 w-5 flex-shrink-0 transition duration-300
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
								class="flex w-full items-center justify-between gap-2 py-1 text-left  focus:outline-none hover:text-blue-600">
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
												<a href="/{c.slug}" class="flex-1">
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
														class="h-5 w-5 flex-shrink-0 transition duration-300
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
												class="flex w-full items-center justify-between gap-2 py-1 text-left  focus:outline-none hover:text-blue-600">
												{c.name}
											</a>
										{/if}

										<!-- 3rd level categories -->

										{#if showSubCategory2[cx]}
											<ul class="ml-4">
												{#each c.children as cc}
													<a
														href="/{cc.slug}"
														class="flex w-full items-center justify-between gap-2 py-1 text-left  focus:outline-none hover:text-blue-600">
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

	{#if facets?.all_aggs?.brands?.all?.buckets?.length > 0}
		<div class="my-3">
			<hr class="mb-3 w-full" />

			<CheckboxEs
				items="{facets.all_aggs?.brands?.all?.buckets}"
				title="Brands"
				model="brands"
				selectedItems="{fl.brands || []}"
				on:go="{goCheckbox}" />
		</div>
	{/if}

	{#if facets?.all_aggs?.categories?.all?.buckets?.length > 0}
		<div class="my-3">
			<hr class="mb-3 w-full" />

			<CheckboxEs
				items="{facets?.all_aggs?.categories?.all?.buckets}"
				title="Categories"
				model="categories"
				selectedItems="{fl.categories || []}"
				on:go="{goCheckbox}" />
		</div>
	{/if}

	{#if facets?.vendors?.all?.buckets?.length > 0}
		<div class="my-3">
			<hr class="mb-3 w-full" />

			<CheckboxEs
				items="{facets?.vendors?.all?.buckets}"
				title="vendors"
				model="vendors"
				selectedItems="{fl.vendors || []}"
				on:go="{goCheckbox}" />
		</div>
	{/if}

	{#if facets?.all_aggs?.price?.all?.buckets?.length > 0}
		<div class="my-3">
			<hr class="mb-3 w-full" />

			<CheckboxEs
				items="{facets?.all_aggs?.price?.all?.buckets}"
				title="PRICE"
				model="price"
				selectedItems="{fl.price || []}"
				on:go="{goCheckbox}" />
		</div>
	{/if}

	{#if facets?.all_aggs?.discount?.all?.buckets?.length > 0}
		<div class="my-3">
			<hr class="mb-3 w-full" />

			<CheckboxEs
				items="{facets?.all_aggs?.discount?.all?.buckets}"
				title="DISCOUNT"
				model="discount"
				selectedItems="{fl.discount || []}"
				on:go="{goCheckbox}" />
		</div>
	{/if}
</div>
