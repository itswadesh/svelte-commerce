<script>
import { createEventDispatcher } from 'svelte'

const dispatch = createEventDispatcher()

export let modelValue, value

let checked = false

if (modelValue === value) {
	checked = true
}
</script>

<label class="flex items-center gap-2">
	<input
		type="radio"
		bind:group="{modelValue}"
		name="{value}"
		value="{value}"
		checked="{checked}"
		class="mt-0.5 h-4 w-4 text-primary-500 focus:ring-0 focus:ring-offset-0"
		on:change="{() => dispatch('change', modelValue)}" />

	<span class="max-w-max text-sm">
		<slot />
	</span>
</label>
