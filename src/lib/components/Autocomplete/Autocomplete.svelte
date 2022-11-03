<script>
import { getAPI } from '$lib/util/api'
import { createEventDispatcher, onMount } from 'svelte'
import AutocompleteItem from './AutocompleteItem.svelte'
import { page } from '$app/stores'

export let placeholder = 'Search Products'
let inputObject = null
let data
const dispatch = createEventDispatcher()

onMount(async () => {
	data = await getAutocompleteData()
})

const getAutocompleteData = async (filterText = '') => {
	try {
		const res = await getAPI(
			`es/autocomplete?q=${filterText}&store=${$page.data.store?.id}`,
			$page.data.origin
		)
		const hits = res?.data?.hits?.hits
		let data = []
		if (hits) {
			data = hits.map((h) => {
				return { name: h._source.name, slug: h._source.slug, type: h._source.type }
			})
		}
		return data || []
	} catch (e) {
		console.log('err....', e)
	}
}

/* FILTERING countres DATA BASED ON INPUT */
let filteredData = []
// $: console.log(filteredData)

const filterData = async (e) => {
	const data = await getAutocompleteData(e.target.value)
	// let storageArr = []
	// console.log('333333333', data, inputValue)
	// if (inputValue) {
	// 	data.forEach((d) => {
	// 		if (d?.name.toLowerCase().startsWith(inputValue.toLowerCase())) {
	// 			// TODO
	// 			// storageArr = [...storageArr, makeMatchBold(d)]
	// 			storageArr = [...storageArr, d]
	// 		}
	// 	})
	// }
	filteredData = data
	if (!filteredData.length) {
		inputObject = null
	}
}

/* HANDLING THE INPUT */
let searchInput // use with bind:this to focus element
let inputValue = ''

$: if (!inputValue) {
	inputObject = null
	filteredData = []
	hiLiteIndex = null
}

const clearInput = () => {
	inputValue = ''
	searchInput.focus()
}

const setInputVal = (d) => {
	inputObject = d
	// if (!inputObject) {
	// 	inputObject = { name: d.name, slug: undefined, type: 'product' }
	// }
	// TODO
	// inputValue = removeBold(d)
	inputValue = d?.name || d
	filteredData = []
	hiLiteIndex = null
	submitValue()
	// document.querySelector('#data-input').focus()
}

const submitValue = () => {
	if (!inputObject) {
		inputObject = { name: inputValue, slug: undefined, type: 'product' }
	}
	if (inputValue) dispatch('search', inputObject)
}

const makeMatchBold = (str) => {
	// replace part of (data name === inputValue) with strong tags
	let matched = str.name.substring(0, inputValue.length)
	let makeBold = `<strong>${matched}</strong>`
	str.boldedMatch = str.name.replace(matched, makeBold)
	return str
}

const removeBold = (str) => {
	//replace < and > all characters between
	return str.replace(/<(.)*?>/g, '')
	// return str.replace(/<(strong)>/g, "").replace(/<\/(strong)>/g, "");
}

/* NAVIGATING OVER THE LIST OF DATA W HIGHLIGHTING */
let hiLiteIndex = null
//$: console.log(hiLiteIndex);
$: hiLitedData = filteredData[hiLiteIndex]

const navigateList = (e) => {
	if (e.key === 'ArrowDown' && hiLiteIndex <= filteredData.length - 1) {
		hiLiteIndex === null ? (hiLiteIndex = 0) : (hiLiteIndex += 1)
	} else if (e.key === 'ArrowUp' && hiLiteIndex !== null) {
		hiLiteIndex === 0 ? (hiLiteIndex = filteredData.length - 1) : (hiLiteIndex -= 1)
	} else if (e.key === 'Enter') {
		if (hiLiteIndex !== null) {
			setInputVal(filteredData[hiLiteIndex])
		} else {
			setInputVal({ name: e.target.value, slug: undefined, type: 'product' })
		}
	} else {
		return
	}
}
</script>

<!-- Can not enable it because it will trigger the function on any Enterpress including zip input form at product details page -->
<!-- <svelte:window on:keydown="{navigateList}" /> -->

<form autocomplete="off" on:submit|preventDefault="{submitValue}" class="relative">
	<div class="relative">
		<input
			id="data-input"
			type="text"
			placeholder="{placeholder}"
			bind:this="{searchInput}"
			bind:value="{inputValue}"
			on:input="{filterData}"
			class="py-2 pl-4 pr-12 rounded-md w-full bg-white transition duration-300 border focus:outline-none focus:border-gray-400 text-sm font-light placeholder:text-gray-500" />

		<button
			type="submit"
			aria-label="Click here to search input data"
			class="absolute inset-y-0 right-0 z-10 hidden h-full w-10 flex-shrink-0 cursor-default items-center justify-center focus:outline-none sm:flex">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-5 w-5 text-gray-500"
				viewBox="0 0 20 20"
				fill="currentColor">
				<path
					fill-rule="evenodd"
					d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
					clip-rule="evenodd"></path>
			</svg>
		</button>
	</div>

	<!-- FILTERED LIST OF DATA -->

	{#if filteredData.length > 0}
		<ul class="absolute top-12 w-full border-l border-r border-t shadow-xl bg-white">
			{#each filteredData as d, i}
				<AutocompleteItem
					itemLabel="{d.name}"
					highlighted="{i === hiLiteIndex}"
					on:click="{() => setInputVal(d)}" />
			{/each}
		</ul>
	{/if}
</form>
