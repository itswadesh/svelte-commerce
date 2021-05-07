<script>
import { createEventDispatcher } from 'svelte'
import { UiRefreshOutline } from '$lib/components/icons/index.js'

const dispatch = createEventDispatcher()

export let submitting
export let submittingText = 'Submitting...'
export let icon = false
export let full = false
const klass = full ? 'w-full flex' : 'inline-flex'
</script>

<button
	type="submit"
	class="{klass} group relative justify-center py-2 px-4 border border-transparent
    focus:ring-primary focus:outline-none leading-5 font-medium rounded-md disabled:opacity-75
    text-white bg-primary-700"
	disabled="{submitting}"
	on:click="{() => {
		dispatch('submit')
	}}">
	{#if icon}
		<span class="absolute left-0 inset-y-0 flex items-center pl-3">
			<svelte:component this="{icon}" />
		</span>
	{/if}
	{#if submitting}
		<span class="mr-1">
			<UiRefreshOutline />
		</span>
		<slot name="submit">
			{submittingText}
		</slot>
	{:else}
		<slot />
	{/if}
</button>
