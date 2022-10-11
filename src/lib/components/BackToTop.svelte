<style>
.back-to-top {
	transition: opacity 0.5s, visibility 0.5s;
	position: fixed;
	z-index: 99;
	right: 20px;
	user-select: none;
	bottom: 70px;
}

.back-to-top.hidden {
	opacity: 0;
	visibility: hidden;
}
</style>

<script>
import { fly } from 'svelte/transition'

export let showOnPx = 150
let hidden = true

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

<svelte:window on:scroll="{handleOnScroll}" />

{#if !hidden}
	<button
		transition:fly="{{ y: -200, duration: 500 }}"
		aria-label="Click to go to top"
		class="back-to-top overflow-hidden rounded-full focus:outline-none bg-white"
		on:click="{goTop}">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-8 w-8 text-primary-500"
			viewBox="0 0 20 20"
			fill="currentColor">
			<path
				fill-rule="evenodd"
				d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
				clip-rule="evenodd"></path>
		</svg>
	</button>
{/if}
