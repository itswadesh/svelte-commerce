<script lang="ts">
import { navigateToProperPath } from '$lib/utils'

export let categoryPool = []
export let currentProductName = ''
export let isHomeIcon = true
export let isMultipleLine = false

let clazz = ''
export { clazz as class }
</script>

<div
	class="{clazz} flex text-gray-500 items-center text-sm
	{isMultipleLine ? 'flex-wrap' : 'truncate'}">
	<!-- Home -->

	<a href="/" aria-label="Click to go inside this page" class="hover:text-primary-500">
		{#if isHomeIcon}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
				class="h-5 w-5">
				<path
					fill-rule="evenodd"
					d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z"
					clip-rule="evenodd"></path>
			</svg>
		{:else}
			Home
		{/if}
	</a>

	<!-- Category Pool -->

	{#each categoryPool as d, dx}
		{#if dx === 0}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-5 w-5 px-1 shrink-0"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"></path>
			</svg>
		{/if}

		<a
			href="{navigateToProperPath(d.link || d.slug)}?sort=-updatedAt"
			aria-label="Click to go inside this page"
			class="block first-letter:uppercase hover:text-primary-500 hover:underline">
			{d.name}
		</a>

		{#if dx < categoryPool?.length - 2}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-5 w-5 px-1 shrink-0"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"></path>
			</svg>
		{/if}
	{/each}

	{#if currentProductName}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-5 w-5 px-1 text-zinc-400 shrink-0"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			stroke-width="2">
			<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"></path>
		</svg>

		<span class="text-zinc-400 first-letter:uppercase">
			{currentProductName}
		</span>
	{/if}
</div>
