<script>
import { Footer, Nav } from '$lib/theme-config'
import { page } from '$app/stores'
import { PageTransitions } from '$lib/components'
import { slide } from 'svelte/transition'

export let data = {}

let showFooter = false
</script>

<div class="h-rem w-full flex-1">
	<Nav me="{$page.data.me}" cart="{$page.data.cart}" />

	<PageTransitions url="{data.url}">
		<slot />
	</PageTransitions>

	<!-- Footer mobile show hide toggle -->

	<div class="block lg:hidden">
		<button
			type="button"
			class="p-3 sm:px-10 w-full flex items-center justify-between gap-4 text-sm focus:outline-none"
			on:click="{() => (showFooter = !showFooter)}">
			<span>More about {$page.data.store?.websiteName || 'store'}</span>

			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
				class="w-5 h-5 transition duration-300
				{showFooter ? 'transform rotate-180' : ''}">
				<path
					fill-rule="evenodd"
					d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
					clip-rule="evenodd"></path>
			</svg>
		</button>

		{#if showFooter}
			<div transition:slide="{{ duration: 300 }}">
				<Footer />
			</div>
		{/if}
	</div>
</div>

<div class="hidden lg:block">
	<Footer />
</div>
