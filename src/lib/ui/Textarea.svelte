<script>
import { createEventDispatcher } from 'svelte'

const dispatch = createEventDispatcher()

let clazz = ''

export { clazz as class }

export let value = '',
	name = '',
	id = '',
	placeholder = ' ',
	cols = 30,
	rows = 4,
	disabled = false,
	required = false
</script>

<textarea
	name="{name}"
	id="{id}"
	cols="{cols}"
	rows="{rows}"
	bind:value
	placeholder="{placeholder}"
	required="{required}"
	class="w-full rounded-md border border-gray-300 p-2 text-sm placeholder-gray-400 transition duration-300 focus:outline-none focus:ring-1 focus:ring-primary-500 {clazz} 
	{disabled ? 'cursor-not-allowed bg-gray-100' : 'bg-transparent hover:bg-gray-50'}"
	aria-label="{placeholder}"
	on:input="{() => dispatch('input')}"></textarea>
