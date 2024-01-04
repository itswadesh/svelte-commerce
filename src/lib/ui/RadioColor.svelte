<script>
import { createEventDispatcher } from 'svelte'

const dispatch = createEventDispatcher()

export let backgroundColor
export let modelValue
export let value

let checked = false

if (modelValue === value) {
	checked = true
}
</script>

<label>
	<div
		class="relative h-10 w-10 rounded-full border-4 flex items-center justify-center p-1 group cursor-pointer transition duration-300 focus:outline-none"
		style="background-color: {backgroundColor}; 
		{modelValue == value ? 'box-shadow: 0 0 6px rgb(24 24 27);' : ''}">
	</div>

	<input type="radio" bind:group="{modelValue}" {value} class="hidden" />

	<div class="mt-1 w-10 leading-3 text-xs text-center whitespace-nowrap">
		<slot />
	</div>
</label>
