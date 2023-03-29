<script>
import { AutocompleteService } from '$lib/services'
import { createEventDispatcher, onMount } from 'svelte'
import { page } from '$app/stores'
import AutocompleteItem from './AutocompleteItem.svelte'

export let placeholder = 'Search Products'

let data
let inputObject = null
let showSuggestionOptions = false

const dispatch = createEventDispatcher()

onMount(async () => {
	data = await getAutocompleteData()
})

const getAutocompleteData = async (filterText = '') => {
	try {
		const ac =
			(await AutocompleteService.fetchAutocompleteData({
				q: filterText || '',
				origin: $page?.data?.origin,
				storeId: $page?.data?.store?.id
			})) || []
	} catch (e) {
		return []
		// console.log('err....', e)
	}
}

let filteredData = []

const filterData = async (e) => {
	const data = await getAutocompleteData(e.target.value)
	filteredData = data
	if (!filteredData?.length) {
		inputObject = null
	}
}

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
	inputValue = d?.name || d
	filteredData = []
	hiLiteIndex = null
	submitValue()
}

const submitValue = () => {
	if (!inputObject) {
		inputObject = { name: inputValue, slug: undefined, type: 'product' }
	}
	if (inputValue) dispatch('search', inputObject)
}

const makeMatchBold = (str) => {
	let matched = str.name.substring(0, inputValue.length)
	let makeBold = `<strong>${matched}</strong>`
	str.boldedMatch = str.name.replace(matched, makeBold)
	return str
}

const removeBold = (str) => {
	return str.replace(/<(.)*?>/g, '')
}

let hiLiteIndex = null

const navigateList = (e) => {
	if (e.key === 'ArrowDown' && hiLiteIndex <= filteredData?.length - 1) {
		hiLiteIndex === null ? (hiLiteIndex = 0) : (hiLiteIndex += 1)
	} else if (e.key === 'ArrowUp' && hiLiteIndex !== null) {
		hiLiteIndex === 0 ? (hiLiteIndex = filteredData?.length - 1) : (hiLiteIndex -= 1)
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

<form autocomplete="off" on:submit|preventDefault="{submitValue}" class="relative">
	<button
		type="button"
		class="relative w-full focus:outline-none"
		on:click="{() => (showSuggestionOptions = !showSuggestionOptions)}">
		<input
			id="data-input"
			type="text"
			placeholder="{placeholder}"
			bind:this="{searchInput}"
			bind:value="{inputValue}"
			on:input="{filterData}"
			class="w-full rounded-md border bg-white py-2 pl-4 pr-12 text-sm font-light transition duration-300 placeholder:text-gray-500 focus:border-gray-400 focus:outline-none" />

		<button
			type="submit"
			aria-label="Click here to search input data"
			class="absolute inset-y-0 right-0 z-10 hidden h-full w-10 shrink-0 cursor-default items-center justify-center focus:outline-none sm:flex">
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
	</button>

	{#if filteredData?.length > 0 && showSuggestionOptions}
		<ul class="absolute top-12 z-40 w-full border-t border-l border-r bg-white shadow-xl">
			{#each filteredData as d, i}
				<AutocompleteItem
					itemLabel="{d.name}"
					highlighted="{i === hiLiteIndex}"
					on:click="{() => setInputVal(d)}" />
			{/each}
		</ul>
	{/if}
</form>
