<script context="module" lang="ts">
export async function load({ url, params, fetch }) {
	const q = +query.get('q')
	return {
		props: {
			q
		}
	}
}
</script>

<script lang="ts">
import { goto } from '$app/navigation'
import { createEventDispatcher } from 'svelte'
const dispatch = createEventDispatcher()
import { Icon, Search } from 'svelte-hero-icons'
export let home = false,
	q
let searchInput
import { onMount } from 'svelte'
onMount(() => {
	if (!home && q) setTimeout(() => searchInput.focus(), 0)
})
function search() {
	setTimeout(() => {
		// When coming from home (or another page)
		if (home) goto('/search?q=' + q)
		// goto reloads the page. Hence focus is lost
		else goto('/search?q=' + q, { replaceState: true })
		dispatch('search', q)
	}, 300)
}
</script>

<form
	class="w-full pb-2 text-center lg:w-1/2 md:pb-0"
	novalidate
	autocomplete="off"
	on:submit|preventDefault="{search}">
	<div class="search_fix"></div>
	<input
		aria-label="Search Box"
		type="text"
		on:blur="{() => search()}"
		bind:this="{searchInput}"
		bind:value="{q}"
		class="w-full bg-transparent py-1.5 pdl focus:outline-none rounded-full border border-gray-800"
		placeholder="Search for products,brands and more"
		name="search" />
	<div class="absolute ml-4">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="w-5 h-5 "
			viewBox="0 0 20 20"
			fill="currentColor">
			<path
				fill-rule="evenodd"
				d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
				clip-rule="evenodd"></path>
		</svg>
	</div>
</form>
