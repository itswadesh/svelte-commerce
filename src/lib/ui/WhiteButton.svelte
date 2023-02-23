<style>
.applyRoundedNone {
	@apply rounded-none;
}
.applyroundedFull {
	@apply rounded-full;
}
</style>

<script>
import { createEventDispatcher } from 'svelte'

const dispatch = createEventDispatcher()

export let loading = false
export let loadingringsize = 'base'
export let disabled = false
export let roundedNone = false
export let roundedFull = false
export let hideLoading = false
export let clickEffect = true
export let type = 'button'
export let title = ''

// creates a `class` property, even
// though it is a reserved word
let clazz = ''
export { clazz as class }

let localLoadingPeriod = false

function handleClick() {
	if (loading || disabled) return
	else {
		dispatch('click')

		if (!hideLoading) {
			if (loading === false) {
				localLoadingPeriod = true

				setTimeout(() => {
					localLoadingPeriod = false
				}, 820)
			}
		}
	}
}
</script>

<button
	type="{type}"
	title="{title}"
	class="relative transform items-center justify-center overflow-hidden rounded-md border px-4 py-2 text-center font-semibold tracking-wider text-gray-800 shadow-md transition duration-700 focus:outline-none focus:ring-0 focus:ring-offset-0 {clazz}
	{disabled
		? 'cursor-not-allowed border-gray-400 bg-gray-400 opacity-40'
		: 'bg-white opacity-100 hover:border-primary-50 hover:bg-primary-50 active:scale-95'}"
	class:active:scale-95="{clickEffect}"
	class:applyRoundedNone="{roundedNone}"
	class:applyroundedFull="{roundedFull}"
	on:click="{handleClick}">
	<div class="flex items-center justify-center gap-2">
		<slot />
	</div>

	{#if loading || localLoadingPeriod}
		<div
			class="absolute inset-0 flex cursor-not-allowed items-center justify-center bg-black bg-opacity-70">
			<svg
				class="mx-auto animate-spin text-white 
				{loadingringsize == 'xs' ? 'h-4 w-4' : ''}
				{loadingringsize == 'sm' ? 'h-5 w-5' : ''}
				{loadingringsize == 'base' ? 'h-6 w-6' : ''}
				{loadingringsize == 'lg' ? 'h-7 w-7' : ''}"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24">
				<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
				></circle>
				<path
					class="opacity-75"
					fill="currentColor"
					d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
				></path>
			</svg>
		</div>
	{/if}
</button>
