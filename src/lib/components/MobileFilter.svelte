<style>
.frosted-black {
	backdrop-filter: blur(5px);
	background-color: hsla(0, 0%, 0%, 0.8);
}
</style>

<script>
import { goto, invalidate } from '$app/navigation'
import Checkbox from '$lib/ui/Checkbox.svelte'
import { constructURL2 } from '$lib/util'
import { fly } from 'svelte/transition'
import CheckboxEs from '$lib/ui/CheckboxEs.svelte'
import { createEventDispatcher, onMount } from 'svelte'
import { page } from '$app/stores'
import { sorts } from '$lib/config'
const dispatch = createEventDispatcher()

let showFilter = false
let showSort = false
let filterOptions = [{ name: 'Categories' }]
let selected = 'Categories'
let clazz = ''
export { clazz as class }

export let facets = {},
	fl = {},
	appliedFilters = {},
	filterLength = 0,
	mergedArr = []

function clearFilters() {
	fl = {}
	appliedFilters = {}
	let url = $page?.url?.pathname
	showFilter = false
	goto(url)
	dispatch('clearAll')
}

function goCheckbox(e) {
	fl[e.detail.model] = e.detail.selectedItems
	fl.q = $page.url.searchParams.get('q')
	let url = constructURL2(`${$page.url.pathname}`, fl)
	appliedFilters = { ...fl }
	delete appliedFilters.page
	delete appliedFilters.sort
	delete appliedFilters.lat
	delete appliedFilters.lng
	goto(`${url}page=1`)
}

async function sortNow(s) {
	if (s == 'null' || s == null || s == undefined || s == 'undefined') {
		$page.url.searchParams.delete('sort')
	} else {
		await $page.url.searchParams.set('sort', s)
	}
	await goto(`/search?${$page.url.searchParams.toString()}`)
	await invalidate()
}
onMount(() => {
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
</script>

<div
	class="{clazz} grid w-full grid-cols-2 divide-x divide-gray-300 border-t border-b bg-white font-medium shadow-md">
	<!-- Filter -->

	<button
		type="button"
		class="flex items-center justify-center gap-2 p-3"
		on:click="{() => (showFilter = true) && (selected = 'Categories')}">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-5 w-5"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
			></path>
		</svg>

		<span>Filter</span>
	</button>

	<!-- Sort -->

	<button
		type="button"
		class="flex items-center justify-center gap-2 p-3"
		on:click="{() => (showSort = true)}">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-5 w-5"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path>
		</svg>

		<span>Sort</span>
	</button>
</div>

{#if showFilter}
	<div
		transition:fly="{{ x: -50, duration: 300 }}"
		class="fixed inset-0 z-[100] h-screen w-screen bg-white">
		<div
			class="relative border-2 border-gray-300 p-3 text-center text-lg font-bold tracking-wide shadow-md">
			<span>Filter</span>

			<button
				on:click="{clearFilters}"
				class="absolute inset-y-0 right-4 text-right text-xs text-primary-500 hover:underline focus:outline-none">
				Clear All
			</button>
		</div>

		<div class="flex h-full items-start">
			<div class="flex h-full w-2/6 flex-col border-r border-b bg-gray-100">
				{#each filterOptions as f}
					<button
						class="border-l-4 p-3 text-left text-sm font-semibold tracking-wide 
				{selected === f.name
							? 'text-primary-500 border-primary-500 bg-white'
							: 'border-gray-100 bg-transparent'}"
						on:click="{() => (selected = f.name)}">
						{f.name}
					</button>

					<hr class="w-full" />
				{/each}
			</div>

			<div class="w-4/6">
				{#if selected === 'Categories'}
					<div
						class="h-full w-full overflow-y-auto"
						in:fly="{{ y: -10, duration: 300, delay: 300 }}">
						{#if facets?.categories?.all?.buckets?.length > 0}
							<CheckboxEs
								items="{facets?.categories?.all?.buckets}"
								model="categories"
								selectedItems="{fl.categories || []}"
								on:go="{goCheckbox}" />
						{/if}
					</div>
				{/if}
			</div>
		</div>

		<div
			class="absolute inset-x-0 bottom-0 z-[100] flex items-center divide-x-2 divide-gray-300 border-2 border-gray-300 bg-white">
			<button
				class="w-1/2 p-3 text-center font-bold tracking-wide focus:outline-none"
				on:click="{() => (showFilter = false)}">
				Cancel
			</button>

			<button
				class="w-1/2 p-3 text-center font-bold tracking-wide focus:outline-none"
				on:click="{() => (showFilter = false)}">
				Apply
			</button>
		</div>
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
			class="relative z-10 max-h-max w-full rounded-t-lg bg-white">
			<div class="flex items-center justify-between gap-5 border-b  border-gray-300 p-3 text-sm">
				<span>Sort</span>

				<button type="button" class="focus:outline-none" on:click="{() => (showSort = false)}">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-4 w-4 text-gray-500"
						viewBox="0 0 20 20"
						fill="currentColor">
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
							class="text-left text-sm font-semibold tracking-wide focus:outline-none"
							on:click="{() => sortNow(s.val) && (showSort = false)}">
							{s.name}
						</button>
					</li>
				{/each}
			</ul>
		</div>
	</div>
{/if}
