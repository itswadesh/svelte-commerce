<script>
import { createEventDispatcher } from 'svelte'

const dispatch = createEventDispatcher()

export let value = '',
	placeholder = ''

let clazz = ''
export { clazz as class }
</script>

<div class="relative w-full {clazz}">
	<input
		type="search"
		placeholder="{placeholder}"
		class="w-full rounded-full border  bg-gray-50 py-2 pl-4 pr-14 text-sm font-semibold placeholder-gray-400  transition duration-300 placeholder:font-normal focus:outline-none focus:ring-1 focus:ring-primary-500 hover:bg-white"
		bind:value="{value}"
		on:change="{() => dispatch('change', value)}" />

	<button
		type="submit"
		class="absolute inset-y-0 right-0 flex items-center justify-center px-4 text-gray-500 focus:outline-none">
		<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
			<path
				fill-rule="evenodd"
				d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
				clip-rule="evenodd"></path>
		</svg>
	</button>
</div>
