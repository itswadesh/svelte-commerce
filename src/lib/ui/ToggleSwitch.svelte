<style>
input:checked ~ .dot {
	transform: translateX(100%);
}
input:checked ~ .green {
	@apply bg-green-500;
}
input:checked ~ .blue {
	@apply bg-blue-500;
}
input:checked ~ .red {
	@apply bg-red-500;
}
input:checked ~ .yellow {
	@apply bg-yellow-500;
}
input:checked ~ .indigo {
	@apply bg-indigo-500;
}
input:checked ~ .pink {
	@apply bg-pink-500;
}
input:checked ~ .purple {
	@apply bg-purple-500;
}
input:checked ~ .black {
	@apply bg-gray-800;
}
</style>

<script>
import { onMount } from 'svelte'
import { createEventDispatcher } from 'svelte'

export let id = ''
export let color = 'green'
export let checked
export let name = ''
export let required = false
export let disabled = false
export let textFirst = false
export let size = 'sm'
export let onText = ''
export let offText = ''

const dispatch = createEventDispatcher()

let clazz = ''

export { clazz as class }

onMount(() => {
	genId()
})

let uniqueId

function genId() {
	if (id === undefined || typeof String) {
		uniqueId = `toggle--${Math.random().toString(36).substring(2, 10)}`
	} else {
		uniqueId = id
	}
}
</script>

<div class="{clazz}">
	<!-- Toggle Button -->

	<label
		for="{uniqueId}"
		class="group flex max-w-max cursor-pointer items-center
		{textFirst ? 'flex-row-reverse' : 'flex-row'}
		{disabled ? 'opacity-40 cursor-not-allowed' : 'opacity-100'}">
		<!-- toggle -->

		<div class="relative mr-2">
			<input
				type="checkbox"
				id="{uniqueId}"
				name="{name || uniqueId}"
				disabled="{disabled}"
				required="{required}"
				class="hidden"
				bind:checked
				on:change="{() => dispatch('input')}" />

			<!-- line -->

			<div
				class="block rounded-full bg-gray-300 
				{disabled ? '' : 'opacity-100 group-hover:opacity-90 transition duration-300'}
                {size == 'xs' ? 'h-5 w-8' : ''}
                {size == 'sm' ? 'h-6 w-10' : ''}
                {size == 'md' ? 'h-9 w-16' : ''}
                {color == 'green' ? 'green' : ''}
                {color == 'blue' ? 'blue' : ''}
                {color == 'red' ? 'red' : ''}
                {color == 'pink' ? 'pink' : ''}
                {color == 'purple' ? 'purple' : ''}
                {color == 'yellow' ? 'yellow' : ''}
                {color == 'indigo' ? 'indigo' : ''}
                {color == 'black' ? 'black' : ''}
      			">
			</div>

			<!-- dot -->

			<div
				class="dot absolute left-1 top-1 rounded-full bg-white transition duration-300 ease-in-out
                {size == 'xs' ? 'h-3 w-3' : ''}
                {size == 'sm' ? 'h-4 w-4' : ''}
                {size == 'md' ? 'h-7 w-7' : ''}
       			">
			</div>
		</div>

		<slot>
			<div
				class="font-semibold 
			{textFirst ? 'mr-2' : 'ml-2'}
			{disabled ? '' : 'opacity-100 group-hover:opacity-90 transition duration-300'}
      		{color == 'green' && checked === true ? 'text-green-500' : 'text-gray-400'}
      		{color == 'blue' && checked === true ? 'text-blue-500' : 'text-gray-400'}
      		{color == 'red' && checked === true ? 'text-red-500' : 'text-gray-400'}
      		{color == 'pink' && checked === true ? 'text-pink-500' : 'text-gray-400'}
      		{color == 'purple' && checked === true ? 'text-purple-500' : 'text-gray-400'}
      		{color == 'yellow' && checked === true ? 'text-yellow-500' : 'text-gray-400'}
      		{color == 'indigo' && checked === true ? 'text-indigo-500' : 'text-gray-400'}
      		{color == 'black' && checked === true ? '' : 'text-gray-400'}
			{size == 'xs' ? 'text-sm' : ''}
            {size == 'sm' ? 'text-base' : ''}
            {size == 'md' ? 'text-xl' : ''}
     		">
				{#if checked === true && onText}
					{onText}
				{:else if offText}
					{offText}
				{/if}
			</div>
		</slot>
	</label>
</div>
