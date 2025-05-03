<script lang="ts">
	import '../app.css'
	import { Toaster } from 'svelte-sonner'
	import { setUserState } from '$lib/core/stores/auth.svelte'
	import GoogleAnalytics from '$lib/core/components/plugins/google-analytics.svelte'
	import { navigating } from '$app/stores'
	import { Loader } from 'lucide-svelte'
	import type { Snippet } from 'svelte'
	import type { StoreData } from '$lib/core/types'
	interface LayoutData {
		store: StoreData
		timestamp: number
		error?: string
	}
	let { children, data }: { children: Snippet; data: LayoutData } = $props()
	setUserState()

</script>

<svelte:head>
	<link rel="icon" href={data?.store?.favicon || '/favicon.png'} />
	{#if data?.store?.plugins?.headerScripts?.active}
		{@html data?.store?.plugins?.headerScripts?.html}
	{/if}
</svelte:head>

<GoogleAnalytics storeData={data.store} />

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
