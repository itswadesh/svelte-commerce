<script lang="ts">
	import '../app.css'
	import { Toaster } from '@misiki/kitcommerce-core'
	import { setUserState } from '$lib/core/stores/index.js'
	import { GoogleAnalytics } from '$lib/core/components/index.js'
	import { navigating } from '$app/stores'
	import { Loader } from '@lucide/svelte'
	import { onMount, type Snippet } from 'svelte'
	import type { StoreData } from '$lib/core/types/index.js'
	import { modifyColorPalette } from '$lib/core/utils/color-palette.js'
	interface LayoutData {
		store: StoreData
		timestamp: number
		error?: string
	}
	let { children, data }: { children: Snippet; data: LayoutData } = $props()
	setUserState()
  onMount(() => {
    modifyColorPalette(data.store.cssVariables || {})
  })
</script>

<svelte:head>
	<link rel="icon" href={data?.store?.favicon || '/favicon.png'} />
	{#if data?.store?.plugins?.headerScripts?.active}
		{@html data?.store?.plugins?.headerScripts?.html}
	{/if}
</svelte:head>

<GoogleAnalytics />

<!-- <ThemeProvider /> -->

<div class="light min-h-screen">
	<main class="min-h-screen bg-background">
		{#if !!$navigating}
			{#await new Promise((resolve) => setTimeout(resolve, 1000)) then _}
				<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm">
					<div class="rounded-lg bg-white p-4">
						<Loader class="animate-spin" />
					</div>
				</div>
			{:catch}
				<!-- Ignore any errors from the promise -->
			{/await}
		{/if}
		{@render children()}
	</main>
</div>
<Toaster position="top-center" />
