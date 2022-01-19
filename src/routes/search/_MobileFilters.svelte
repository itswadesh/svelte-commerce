<style>
.selected {
	color: rgba(37, 128, 194);
	background-color: white;
	border-color: rgba(37, 128, 194);
}
ul > li {
	font: bold;
	color: gray;
	padding: 10px;
	font-size: 1.1rem;
}
ul > li {
	font: bold;
	color: gray;
	padding: 10px;
	font-size: 1.1rem;
}
</style>

<script>
import Checkbox from '$lib/ui/Checkbox.svelte'
import Radio from '$lib/ui/Radio.svelte'
import { constructURL, constructURL2 } from '../../util'
import { goto } from '$app/navigation'
import { page } from '$app/stores'
import { createEventDispatcher } from 'svelte'
import { onMount } from 'svelte'
import { fly } from 'svelte/transition'

const dispatch = createEventDispatcher()
export let facets = {},
	fl = {},
	query,
	showMobileFilter

let selected = 'brands',
	loadingPrice = true // Required because after loading finished then only we will initiate the price slider component

onMount(() => {
	var searchParams = new URLSearchParams(query)
	searchParams.forEach(function (value, key) {
		fl[key] = value
	})
})
function hide() {
	dispatch('hide')
}
function clearFilters() {
	dispatch('hide')
	let url = constructURL2('/search', {})
	goto(url)
}
function changed(e) {
	query[e.model] = e.checked
	let url = constructURL('/search', query)
	goto(url)
}
function checkCategory() {}
function go(slug) {
	goto('/' + slug)
}
// function goCheckbox(e) {
// 	query[e.detail.model] = e.detail.selectedItems
// 	let url = constructURL2('/search', query)
// 	goto(`${url}page=${query.page || 1}`)
// }

function goCheckbox(e) {
	fl[e.detail.model] = e.detail.selectedItems
	let url = constructURL2('/search', fl)
	goto(`${url}page=1`)
}

let features = [
	'Processor Brand',
	'Processor Name',
	'Screen Size',
	'RAM',
	'Touchscreen',
	'RAM Type',
	'Screen Resolution',
	'SSD',
	'Processor Generation',
	'Keyboard',
	'Weight',
	'HDD Capacity',
	'Mic In',
	'Battery Backup',
	'Expandable Memory',
	'SSD Capacity',
	'Finger Print Sensor',
	'Backlit Keyboard',
	'NFC Support',
	'Face Recognition',
	'Optane Memory',
]
function checkFeature(k) {
	return features.includes(k)
}
function stringToArray(v) {
	let a = (query[v.key] && query[v.key].split(',')) || []
	return a
}
</script>

<!-- Mobile version starts here -->
{#if showMobileFilter}
	<div
		transition:fly="{{ x: -50, duration: 300 }}"
		class="fixed inset-0 z-50 bg-white w-screen h-screen">
		<div
			class="p-3 border-2 border-gray-300 shadow-md tracking-wide  flex items-center justify-between">
			<button
				type="button"
				on:click="{() => (showMobileFilter = false)}"
				class="text-primary-500 text-xs hover:underline focus:outline-none">
				Cancle
			</button>

			<span class="font-bold">FILTER</span>

			<button
				type="button"
				on:click="{clearFilters}"
				class="text-primary-500 text-xs hover:underline focus:outline-none">
				Clear All
			</button>
		</div>

		<div class="flex w-full h-full">
			<div class="w-2/5 bg-gray-200 h-full border-r border-gray-300 overflow-y-scroll">
				<ul class=" divide-y divide-gray-300 border-b border-gray-300">
					<!-- <li
              on:click="{()=>selected='categories'}"
              class:selected={selected=='categories'}
            >
              Category
            </li> -->

					<li
						on:click="{() => (selected = 'brands')}"
						class="border-l-4 border-gray-200"
						class:selected="{selected == 'brands'}">
						Brands
					</li>

					<li
						on:click="{() => (selected = 'colors')}"
						class="border-l-4 border-gray-200"
						class:selected="{selected == 'colors'}">
						Colour
					</li>

					{#each facets.features && facets.features.name && facets.features.name.buckets && facets.features.name.buckets as f}
						{#if checkFeature(f.key)}
							<li on:click="{() => (selected = f.key)}" class:selected="{selected == f.key}">
								{f.key}
							</li>
						{/if}
					{/each}

					<!-- <li
              on:click="{()=>selected='Price'}"
              class:selected={selected=='Price'}
            >
              Price
            </li> -->
				</ul>
			</div>

			<div class="w-full overflow-y-scroll">
				{#if selected == 'categories' && facets?.categories?.all?.buckets?.length > 0}
					<Checkbox
						items="{facets.categories.all.buckets}"
						title="CATEGORY"
						model="categories"
						selectedItems="{fl.categories || []}"
						on:go="{goCheckbox}" />
				{/if}
				{#if selected == 'brands' && facets?.brands?.all?.buckets?.length > 0}
					<Checkbox
						items="{facets.brands.all.buckets}"
						title="BRANDS"
						model="brands"
						selectedItems="{fl.brands || []}"
						on:go="{goCheckbox}" />
				{/if}
				{#if selected == 'Gender' && facets?.Gender?.all?.buckets?.length > 0}
					<Checkbox
						items="{facets.Gender.all.buckets}"
						title="Gender"
						model="Gender"
						selectedItems="{fl.Gender || []}"
						on:go="{goCheckbox}" />
				{/if}
				{#if selected == 'colors' && facets?.colors?.colors?.name?.buckets?.length > 0}
					<Checkbox
						items="{facets.colors.colors.name.buckets}"
						title="COLOR"
						model="color"
						selectedItems="{fl.color || []}"
						on:go="{goCheckbox}" />
				{/if}
				{#if facets?.features?.name?.buckets?.length > 0}
					{#each facets.features.name.buckets as v, k}
						{#if selected == v.key && v.key != 'Color' && v.val && v.val.buckets && v.val.buckets.length > 0}
							<Checkbox
								items="{v.val.buckets}"
								title="{v.key.toUpperCase()}"
								model="{v.key}"
								selectedItems="{stringToArray(v)}"
								on:go="{goCheckbox}" />
						{/if}
					{/each}
				{/if}
			</div>
		</div>

		<div class="absolute bottom-0 inset-x-0 w-full bg-primary-500 ">
			<button
				type="submit"
				class="w-full p-3 text-white text-center tracking-wider font-bold cursor-pointer focus:outline-none"
				on:click="{hide}">
				APPLY
			</button>
		</div>
	</div>
{/if}
