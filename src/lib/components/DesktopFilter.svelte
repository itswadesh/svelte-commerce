<script>
import { goto } from '$app/navigation'
import { onMount } from 'svelte'
import { constructURL2, toast } from '$lib/util'
import CheckboxEs from '$lib/ui/CheckboxEs.svelte'
import { page } from '$app/stores'
import { createEventDispatcher } from 'svelte'
import { getAPI } from '$lib/util/api'

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

let megaMenu = []
let selectedCategory
let showSubCategory = []

function clearFilters() {
	fl = {}
	appliedFilters = {}
	let url = $page?.url?.pathname
	goto(url)
	dispatch('clearAll')
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
})

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

	{#if megaMenu.length}
		<div class="my-3">
			<hr class="mb-3 w-full" />

			<h6 class="mb-3 font-bold tracking-wide">Categories</h6>

			<ul class="flex w-full cursor-pointer flex-col text-sm">
				{#each megaMenu as m, mx}
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

						{#if showSubCategory[mx]}
							<ul class="ml-2">
								{#each m.children as c}
									<li>
										<a
											href="/{c.slug}"
											type="button"
											class="flex w-full items-center justify-between gap-2 py-1 text-left focus:outline-none  hover:text-blue-600">
											{c.name}
										</a>
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

	{#if facets?.all_aggs?.categories?.all?.all?.buckets?.length > 0}
		<div class="my-3">
			<hr class="mb-3 w-full" />

			<CheckboxEs
				items="{facets?.all_aggs?.categories?.all?.all?.buckets}"
				title="Categories"
				model="categories"
				selectedItems="{fl.categories || []}"
				on:go="{goCheckbox}" />
		</div>
	{/if}

	{#if facets?.vendors?.all?.all?.buckets?.length > 0}
		<div class="my-3">
			<hr class="mb-3 w-full" />

			<CheckboxEs
				items="{facets?.vendors?.all?.all?.buckets}"
				title="vendors"
				model="vendors"
				selectedItems="{fl.vendors || []}"
				on:go="{goCheckbox}" />
		</div>
	{/if}

	{#if facets?.all_aggs?.price?.all?.all?.buckets?.length > 0}
		<div class="my-3">
			<hr class="mb-3 w-full" />

			<CheckboxEs
				items="{facets?.all_aggs?.price?.all?.all?.buckets}"
				title="PRICE"
				model="price"
				selectedItems="{fl.price || []}"
				on:go="{goCheckbox}" />
		</div>
	{/if}

	{#if facets?.all_aggs?.discount?.all?.all?.buckets?.length > 0}
		<div class="my-3">
			<hr class="mb-3 w-full" />

			<CheckboxEs
				items="{facets?.all_aggs?.discount?.all?.all?.buckets}"
				title="DISCOUNT"
				model="discount"
				selectedItems="{fl.discount || []}"
				on:go="{goCheckbox}" />
		</div>
	{/if}
</div>
