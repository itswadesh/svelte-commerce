<style>
h1 {
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
		props: { error, status }
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
	<div class="mx-auto border-b-4 border-gray-800 pb-4 text-center font-bold text-gray-800 lg:w-1/2">
		<h1>Error {title}!</h1>
		<div class="mt-3 border border-red-300 bg-red-200 px-4 py-2 text-red-500">
			{message}
		</div>
	</div>
	<div>
		<a href="/" class="mt-4 block rounded px-4 py-2 text-center text-sm font-thin text-gray-700">
			Misiki
		</a>
	</div>
	<div class="mt-4 bg-gray-800 p-4 text-white">
		{#if dev && error?.stack}
			<pre>{error.stack}</pre>
		{:else if dev}
			<pre>{error}</pre>
		{/if}
	</div>
</section>
