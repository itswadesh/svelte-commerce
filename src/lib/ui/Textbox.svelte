<style>
</style>

<script>
import { createEventDispatcher } from 'svelte'

const dispatch = createEventDispatcher()

let clazz = ''

export { clazz as class }

export let type = 'text',
	id = '',
	name = '',
	placeholder = '',
	value = '',
	required = false,
	disabled = false
</script>

{#if type === 'text'}
	<input
		type="text"
		bind:value
		id="{id}"
		name="{name}"
		class="w-full rounded-md border border-gray-300 p-2 text-sm placeholder-gray-400 transition duration-300 focus:outline-none focus:ring-1 focus:ring-primary-500 {clazz} 
		{disabled ? 'cursor-not-allowed bg-gray-100' : 'bg-transparent hover:bg-gray-50'}"
		placeholder="{placeholder}"
		required="{required}"
		disabled="{disabled}"
		aria-label="{placeholder}"
		on:input="{() => dispatch('input')}" />
{:else if type === 'email'}
	<input
		type="email"
		bind:value
		id="{id}"
		name="{name}"
		class="w-full rounded-md border border-gray-300 p-2 text-sm placeholder-gray-400 transition duration-300 focus:outline-none focus:ring-1 focus:ring-primary-500 {clazz} 
		{disabled ? 'cursor-not-allowed bg-gray-100' : 'bg-transparent hover:bg-gray-50'}"
		placeholder="{placeholder}"
		required="{required}"
		disabled="{disabled}"
		aria-label="{placeholder}"
		on:input="{() => dispatch('input')}" />
{:else if type === 'password'}
	<input
		type="password"
		bind:value
		id="{id}"
		name="{name}"
		class="w-full rounded-md border border-gray-300 p-2 text-sm placeholder-gray-400 transition duration-300 focus:outline-none focus:ring-1 focus:ring-primary-500 {clazz} 
		{disabled ? 'cursor-not-allowed bg-gray-100' : 'bg-transparent hover:bg-gray-50'}"
		placeholder="{placeholder}"
		required="{required}"
		disabled="{disabled}"
		aria-label="{placeholder}"
		on:input="{() => dispatch('input')}" />
{:else if type === 'date'}
	<input
		type="date"
		bind:value
		id="{id}"
		name="{name}"
		class="w-full rounded-md border border-gray-300 p-2 text-sm placeholder-gray-400 transition duration-300 focus:outline-none focus:ring-1 focus:ring-primary-500 {clazz} 
		{disabled ? 'cursor-not-allowed bg-gray-100' : 'bg-transparent hover:bg-gray-50'}"
		placeholder="{placeholder}"
		required="{required}"
		disabled="{disabled}"
		aria-label="{placeholder}"
		on:input="{() => dispatch('input')}" />
{:else if type === 'time'}
	<input
		type="time"
		bind:value
		id="{id}"
		name="{name}"
		class="w-full rounded-md border border-gray-300 p-2 text-sm placeholder-gray-400 transition duration-300 focus:outline-none focus:ring-1 focus:ring-primary-500 {clazz} 
		{disabled ? 'cursor-not-allowed bg-gray-100' : 'bg-transparent hover:bg-gray-50'}"
		placeholder="{placeholder}"
		required="{required}"
		disabled="{disabled}"
		aria-label="{placeholder}"
		on:input="{() => dispatch('input')}" />
{:else if type === 'number'}
	<input
		type="number"
		bind:value
		id="{id}"
		name="{name}"
		class="w-full rounded-md border border-gray-300 p-2 text-sm placeholder-gray-400 transition duration-300 focus:outline-none focus:ring-1 focus:ring-primary-500 {clazz} 
		{disabled ? 'cursor-not-allowed bg-gray-100' : 'bg-transparent hover:bg-gray-50'}"
		placeholder="{placeholder}"
		required="{required}"
		disabled="{disabled}"
		aria-label="{placeholder}"
		on:input="{() => dispatch('input')}" />
{:else if type === 'tel'}
	<input
		type="tel"
		bind:value
		id="{id}"
		name="{name}"
		class="w-full rounded-md border border-gray-300 p-2 text-sm placeholder-gray-400 transition duration-300 focus:outline-none focus:ring-1 focus:ring-primary-500 {clazz} 
		{disabled ? 'cursor-not-allowed bg-gray-100' : 'bg-transparent hover:bg-gray-50'}"
		placeholder="{placeholder}"
		required="{required}"
		disabled="{disabled}"
		aria-label="{placeholder}"
		on:input="{() => dispatch('input')}" />
{:else if type === 'datetime-local'}
	<input
		type="datetime-local"
		bind:value
		id="{id}"
		name="{name}"
		class="w-full rounded-md border border-gray-300 p-2 text-sm placeholder-gray-400 transition duration-300 focus:outline-none focus:ring-1 focus:ring-primary-500 {clazz} 
		{disabled ? 'cursor-not-allowed bg-gray-100' : 'bg-transparent hover:bg-gray-50'}"
		placeholder="{placeholder}"
		required="{required}"
		disabled="{disabled}"
		aria-label="{placeholder}"
		on:input="{() => dispatch('input')}" />
{/if}
