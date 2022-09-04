<script>
import { createEventDispatcher } from 'svelte'

const dispatch = createEventDispatcher()

export let value, checked, id

function updateInput() {
	dispatch('change', value)
}
</script>

<label class="flex cursor-pointer items-start">
	<input
		id="{id}"
		type="radio"
		checked="{checked}"
		value="{value}"
		class="mr-2 mt-0.5 h-4 w-4 cursor-pointer bg-transparent text-primary-500 focus:ring-0 focus:ring-offset-0"
		on:change="{updateInput}" />

	<span class="text-sm">
		<slot />
	</span>
</label>
