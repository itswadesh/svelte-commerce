<script>
import { createEventDispatcher } from 'svelte'

const dispatch = createEventDispatcher()

export let modelValue, value

let checked = false

// console.log('modelValue, value', modelValue, value)

if (modelValue === value) {
	checked = true
}
</script>

<label
	class=" mr-2 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border-2 text-zinc-500 focus:outline-none focus:ring-0 focus:ring-offset-0 hover:border-primary-500 hover:font-bold hover:text-primary-500
											{modelValue == value
		? ` border-primary-500 bg-primary-500 text-white`
		: `bg-zinc-100 border-zinc-400`}">
	<div class="text-xs uppercase sm:text-sm">
		<slot />
	</div>

	<input type="radio" bind:group="{modelValue}" value="{value}" class="hidden" />
</label>
