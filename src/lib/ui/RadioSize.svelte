<script>
import { createEventDispatcher } from 'svelte'

const dispatch = createEventDispatcher()

export let modelValue, value

let checked = false

if (modelValue === value) {
	checked = true
}
</script>

<label>
	<div
		class="relative h-10 w-10 rounded border-4 flex items-center justify-center leading-3 text-xs text-center p-1 group cursor-pointer transition duration-300 focus:outline-none"
		style="{modelValue == value ? 'box-shadow: 0 0 6px rgb(24 24 27);' : ''}">
		<slot />
	</div>

	<input type="radio" bind:group="{modelValue}" {value} class="hidden" />
</label>
