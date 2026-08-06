<script lang="ts">
	import '../app.css'
	import { Toaster } from '@misiki/kitcommerce-core'
	import { getThemeFontsUrl } from '$lib/theme/index.js'
	import { setUserState } from '$lib/core/stores/index.js'
	import { GoogleAnalytics } from '$lib/core/components/index.js'
	import { navigating } from '$app/stores'
	import { updated } from '$app/state'
	import { beforeNavigate } from '$app/navigation'
	import { Loader } from '@lucide/svelte'
	import { onMount, type Snippet } from 'svelte'
	import type { StoreData } from '$lib/core/types/index.js'
  import { ColorPalette } from '$lib/core/components/index.js'

	interface LayoutData {
		store: StoreData
		theme?: {
			name: string
			source: 'admin' | 'env' | 'default'
			available: string[]
		}
		timestamp: number
		error?: string
	}
	let { children, data }: { children: Snippet; data: LayoutData } = $props()
	setUserState()

	const themeFontsUrl = $derived(getThemeFontsUrl(data?.theme?.name || 'default'))

	// Stale-client protection. SvelteKit's `updated` store flips to true once the
	// deployed build (via _app/version.json polling) no longer matches the running
	// client. We then load fresh code at the next safe moment so mobile/PWA users
	// never keep running an old bundle:
	//  - on the next in-app navigation (hard load instead of client-side nav)
	//  - when the app returns to the foreground (covers webviews sitting idle)
	beforeNavigate((nav) => {
		if (updated.current && nav.to?.url && !nav.willUnload) {
			location.href = nav.to.url.href
		}
	})

	onMount(() => {
		const onVisible = () => {
			if (document.visibilityState === 'visible' && updated.current) {
				location.reload()
			}
		}
		document.addEventListener('visibilitychange', onVisible)
		return () => document.removeEventListener('visibilitychange', onVisible)
	})

	// Origin serving product imagery — usually the LCP element and always a different host from
	// the document, so without a preconnect the browser pays DNS + TCP + TLS before the fetch can
	// even start (~100ms measured). Derived at runtime so it follows whatever store this is
	// deployed against. The Cloudflare provider falls back to the image's own origin when no
	// explicit CDN prefix is configured, so fall back to a known store asset in that case.
	const imageCdnOrigin = $derived.by(() => {
		const cdn = data?.store?.plugins?.imageCdn
		if (!cdn?.active) return ''
		try {
			return new URL(cdn.url || data?.store?.logo || data?.store?.favicon).origin
		} catch {
			return ''
		}
	})
</script>

<svelte:head>
	{#if imageCdnOrigin}
		<link rel="preconnect" href={imageCdnOrigin} />
	{/if}
	<link rel="icon" href={data?.store?.favicon || '/favicon.png'} />
	{#if themeFontsUrl}
		<link rel="preconnect" href="https://fonts.googleapis.com" />
		<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
		<link rel="preload" as="style" href={themeFontsUrl} />
		<link href={themeFontsUrl} rel="stylesheet" />
	{/if}
	{#if data?.store?.plugins?.headerScripts?.active}
		{@html data?.store?.plugins?.headerScripts?.html}
	{/if}
</svelte:head>

<ColorPalette />
<GoogleAnalytics />

<!-- <ThemeProvider /> -->

<div
	class="light min-h-screen theme-{data?.theme?.name || 'default'}"
	data-theme={data?.theme?.name || 'default'}
	data-theme-source={data?.theme?.source || 'default'}
>
	<main class="min-h-screen bg-background">
		<!-- {#if !!$navigating}
			{#await new Promise((resolve) => setTimeout(resolve, 1000)) then _}
				<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm">
					<div class="rounded-lg bg-white p-4">
						<Loader class="animate-spin" />
					</div>
				</div>
			{:catch}
				<!-- Ignore any errors from the promise ->
			{/await}
		{/if}-->
		{@render children()}
	</main>
</div>
<Toaster position="top-center" />
