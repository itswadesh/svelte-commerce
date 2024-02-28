<script>
import { createEventDispatcher } from 'svelte'
import { nanoid } from 'nanoid'

const dispatch = createEventDispatcher()

export let disabled = false
export let items = []
export let name = ''
export let required = false
export let selectedItems = []

</script>

<ul class="flex flex-wrap gap-x-4 gap-y-2 items-center">
	{#each items as i, ix}
		<li>
			<label class="flex items-center gap-2">
				<input
					type="checkbox"
					{name}
					id="{nanoid()}"
					{disabled}
					{required}
					bind:group="{selectedItems}"
					value="{i._id}"
					on:change="{() => dispatch('change', selectedItems)}"
					class="mt-0.5 h-4 w-4 shrink-0 text-primary-500 focus:ring-0 focus:ring-offset-0" />
				<span class="max-w-max text-sm">
					{i.name}
				</span>
			</label>
		</li>
	{/each}
</ul>
