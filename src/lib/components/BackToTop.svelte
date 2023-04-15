<script>
import { fade } from 'svelte/transition'

export let showOnPx = 150

let hidden = true
let y

// $: if (y === y) {
// 	setTimeout(() => {
// 		hidden = true
// 	}, 10000)
// }

function goTop() {
	// scroll to the top
	window.scroll({ top: 0, behavior: 'smooth' })
}

function scrollContainer() {
	return document.documentElement || document.body
}

function handleOnScroll() {
	if (!scrollContainer()) {
		return
	}

	if (scrollContainer().scrollTop > showOnPx) {
		hidden = false
	} else {
		hidden = true
	}
}
</script>

<svelte:window bind:scrollY="{y}" on:scroll="{handleOnScroll}" />

{#if !hidden}
	<button
		transition:fade="{{ duration: 500 }}"
		aria-label="Back to Top"
		class="fixed z-[99] bottom-16 right-4 group p-2 bg-white border shadow-md hover:shadow-lg hover:border-zinc-200 transition duration-300 rounded-full focus:outline-none overflow-hidden"
		on:click="{goTop}">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="w-5 h-5 transform group-hover:-translate-y-1 transition duration-500 group-hover:text-primary-500">
			<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5"></path>
		</svg>
	</button>
{/if}
