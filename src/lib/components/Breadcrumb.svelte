<script lang="ts">
import { navigateToProperPath } from '$lib/utils'

export let categoryPool = []
export let currentProductName = ''
export let isHomeIcon = true
export let isMultipleLine = false

let clazz = ''
export { clazz as class }
</script>

<ul
	class="{clazz} flex text-gray-500 items-center text-sm
	{isMultipleLine ? 'flex-wrap' : 'truncate'}">
	<!-- Home -->

	<li class="flex items-center">
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
	</li>

	<!-- Category Pool -->

	{#each categoryPool as d, dx}
		<li class="flex items-center">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-5 w-5 px-1"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"></path>
			</svg>

			<a
				href="{navigateToProperPath(d.link || d.slug)}?sort=-updatedAt"
				aria-label="Click to go inside this page"
				class="first-letter:uppercase hover:text-primary-500 hover:underline">
				{d.name}
			</a>

			{#if dx < categoryPool?.length - 1}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5 px-1"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"></path>
				</svg>
			{/if}
		</li>
	{/each}

	{#if currentProductName}
		<li class="flex items-center text-zinc-400 first-letter:uppercase">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-5 w-5 px-1"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"></path>
			</svg>

			<span>
				{currentProductName}
			</span>
		</li>
	{/if}
</ul>
