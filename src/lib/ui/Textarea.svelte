<script>
import { createEventDispatcher } from 'svelte'

const dispatch = createEventDispatcher()

let clazz = ''
export { clazz as class }

export let autoFocus = false
export let cols = 30
export let disabled = false
export let error = false
export let id = ''
export let name = ''
export let placeholder = ' '
export let required = false
export let rows = 4
export let success = false
export let value = ''
</script>

<textarea
	name="{name}"
	id="{id}"
	cols="{cols}"
	rows="{rows}"
	bind:value="{value}"
	placeholder="{placeholder}"
	autoFocus="{autoFocus}"
	required="{required}"
	class="w-full rounded-md border border-gray-300 p-2 text-sm placeholder-gray-400 transition duration-300 focus:outline-none focus:ring-1 focus:ring-primary-500 {clazz} 
	{disabled ? 'cursor-not-allowed bg-gray-100' : 'bg-transparent hover:bg-gray-50'}
	{success ? 'border-green-500 focus:border-green-500 bg-green-100 focus:ring-green-500' : ''}
	{error ? 'border-red-500 focus:border-red-500 bg-red-100 focus:ring-red-500' : ''}"
	aria-label="{placeholder}"
	on:input="{() => dispatch('input')}"></textarea>
