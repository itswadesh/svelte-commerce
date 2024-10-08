<script lang="ts">
import { goto } from '$app/navigation'
import { onMount } from 'svelte'
import { page } from '$app/stores'
import { AutocompleteService } from '$lib/services'
import { slide } from 'svelte/transition'
import Cookie from 'cookie-universal'
import LazyImg from '$lib/components/Image/LazyImg.svelte'
import { getCategoriesFromStore } from '$lib/store/categories'

const cookies = Cookie()

export let placeholder = 'Search products...'

let autocomplete: { img: string; name: string }[] = []
let categories: any = []
let err
let pincode = null
let product
let q = ''
let query = ''
let searchInput: any
let showSuggestionOptions = false
let typingTimer: any

onMount(() => {
	const pin = cookies.get('zip')

	if (pin && pin.toString()?.length === 6) {
		pincode = pin
	}
})

function submit() {
	showSuggestionOptions = false

	if (autocomplete?.length && autocomplete[0].slug && autocomplete[0].type === 'products') {
		goto(`/product/${autocomplete[0].slug}`)
	} else if (
		autocomplete?.length &&
		autocomplete[0].slug &&
		autocomplete[0].type === 'categories'
	) {
		goto(`/${autocomplete[0].slug}`)
	} else {
		goto(`/search?q=${q}`)
	}
}

function onselect(v: any) {
	showSuggestionOptions = false

	if (v) {
		if (v.type === 'products') {
			goto(`/product/${v.slug}`)
		} else if (v.type === 'categories') {
			goto(`/${v.slug}`)
		} else {
			goto(`/search?q=${encodeURIComponent(v.key)}`)
		}
	}
}

async function getData(e: any) {
	if (e) {
		if (e.isComposing) {
			if (e.target.value === '') {
				q = query.slice(0, -1)
			} else {
				q = e.target.value
			}
		} else {
			q = e.target.value
		}
	}

	clearTimeout(typingTimer)

	typingTimer = setTimeout(async () => {
		try {
			autocomplete = await AutocompleteService.fetchAutocompleteData({
				q: q,
				origin: $page?.data?.origin,
				storeId: $page.data.storeId
			})
		} catch (e) {}
	}, 200)
}

onMount(async () => {
	searchInput.focus()
	try {
		const categoriesRes = await getCategoriesFromStore({
			featured: true,
			storeId: $page.data.storeId,
			origin: $page.data.origin
		})
		categories = categoriesRes.data
	} catch (e) {
		err = e
	} finally {
	}
})
</script>

<form autocomplete="off" class="relative" on:submit|preventDefault="{submit}">
	<div
		
		class="relative w-full focus:outline-none"
		on:click="{() => (showSuggestionOptions = true)}">
		<input
			id="data-input"
			type="search"
			{placeholder}
			bind:this="{searchInput}"
			on:input="{getData}"
			class="w-full rounded border bg-white py-2 pl-4 pr-12 text-sm font-light transition duration-300 placeholder:text-zinc-500 focus:border-zinc-400 focus:outline-none" />

		<button
			type="submit"
			aria-label="Click here to search input data"
			class="absolute inset-y-0 right-0 z-10 hidden h-full w-10 shrink-0 cursor-default items-center justify-center focus:outline-none sm:flex">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-5 w-5 text-zinc-500"
				viewBox="0 0 20 20"
				fill="currentColor">
				<path
					fill-rule="evenodd"
					d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
					clip-rule="evenodd"></path>
			</svg>
		</button>
	</div>

	{#if autocomplete?.length && showSuggestionOptions}
		<ul
			transition:slide="{{ duration: 300 }}"
			class="absolute top-10 z-50 m-0 p-0 list-none w-full border bg-white divide-y rounded shadow-xl overflow-hidden">
			{#each autocomplete || [] as v}
				<li>
					<button
						type="button"
						class="p-3 flex w-full items-center justify-between text-left text-zinc-500 hover:bg-zinc-100"
						on:click="{() => onselect(v)}">
						<div class="flex-1 flex items-center gap-2 justify-start">
							{#if v.img}
								<LazyImg
									src="{v.img}"
									alt=""
									height="40"
									class="h-10 object-contain w-auto object-center" />
							{/if}

							<span class="w-full truncate text-sm capitalize">{v.key}</span>
						</div>

						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="w-5 h-5">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"></path>
						</svg>
					</button>
				</li>
			{/each}
		</ul>

		<button
			type="button"
			class="fixed inset-0 h-full w-full z-40 bg-black bg-opacity-0 cursor-default"
			on:click="{() => (showSuggestionOptions = false)}">
		</button>
	{/if}
</form>
