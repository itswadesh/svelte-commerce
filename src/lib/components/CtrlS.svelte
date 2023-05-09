<script lang="ts">
import { createEventDispatcher, onDestroy, onMount } from 'svelte'
import { fly } from 'svelte/transition'
import { PrimaryButton } from '$lib/ui'

const dispatch = createEventDispatcher()

export let errors = null
export let formChanged = false
export let loadingMessage = null
export let successMessage = null
export let loading = false

function emitSave() {
	dispatch('save')
}

function ctrlSPressed(e) {
	if (!(e.keyCode === 83 && (e.ctrlKey || e.metaKey))) {
		return
	}
	e.preventDefault()
	dispatch('save')
}
</script>

<svelte:window on:keydown="{ctrlSPressed}" />
{#if formChanged}
	<div
		class="fixed inset-x-0 top-0 z-50 flex w-full items-center justify-between bg-primary-50 p-2 text-center text-sm shadow-lg md:p-3 md:px-5"
		transition:fly="{{ y: -20, duration: 300 }}">
		<h6 class="flex max-w-max flex-row items-center gap-2 text-zinc-500 md:mx-auto">
			{#if loading}
				<span class=" sm:block"> {@html loadingMessage || 'Saving...'} </span>
			{:else if successMessage}
				<span class=" sm:block"> {@html successMessage || 'Success.'} </span>
			{:else if errors && errors.length}
				{#each errors as e}
					<span class=" sm:block"> {@html e.message} </span>
				{/each}
			{:else}
				<span class=" sm:block"> There are unsaved changes on this page. Press </span>

				<span><b>Ctrl + S</b> to save.</span>
			{/if}
		</h6>

		<form class="max-w-max" on:submit|preventDefault="{emitSave}">
			<PrimaryButton type="submit" loading="{loading}" class="px-10 sm:px-20">SAVE</PrimaryButton>
		</form>
	</div>
{/if}
