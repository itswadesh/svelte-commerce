<style>
h1 {
	@apply text-8xl;
	line-height: 150px;
	font-weight: 700;
	color: #252932;
	text-shadow: rgba(61, 61, 61, 0.3) 1px 1px, rgba(61, 61, 61, 0.2) 2px 2px,
		rgba(61, 61, 61, 0.3) 3px 3px;
}
</style>

<script context="module" lang="ts">
export function load({ error, status }) {
	return {
		props: { error, status },
	}
}
</script>

<script>
import { dev } from '$app/env'
import { session } from '$app/stores'

export let status
export let error

const offline = typeof navigator !== 'undefined' && navigator.onLine === false

const title = offline ? 'Offline' : status
const message = offline ? 'Find the internet and try again' : error.message
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>
<section class="min-h-screen px-8 py-1">
	<div class="pb-4 mx-auto font-bold text-center text-gray-800 border-b-4 border-gray-800 lg:w-1/2">
		<h1>Error {title}!</h1>
		<div class="px-4 py-2 mt-3 text-red-500 bg-red-200 border border-red-300">
			{message}
		</div>
	</div>
	<div>
		<a href="/" class="block px-4 py-2 mt-4 text-sm font-thin text-center text-gray-700 rounded">
			Svelte Commerce
		</a>
	</div>
	<div class="text-white p-4 mt-4 bg-gray-800">
		{#if dev && error?.stack}
			<pre>{error.stack}</pre>
		{:else if dev}
			<pre>{error}</pre>
		{/if}
	</div>
</section>
