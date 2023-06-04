<script lang="ts">
import { page } from '$app/stores'
// import { GOOGLE_ANALYTICS_ID } from '$lib/config'
export let googleAnalyticsId
$: {
	if (typeof gtag !== 'undefined') {
		gtag('config', googleAnalyticsId, {
			page_title: document.title,
			page_path: $page.url.pathname
		})
	}
}
</script>

<svelte:head>
	<script async src="{`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}">
	</script>
	<script>
	let GA = 'G-BG3JKWLYPF'
	window.dataLayer = window.dataLayer || []

	function gtag() {
		dataLayer.push(arguments)
	}

	gtag('js', new Date())
	gtag('config', GA)
	</script>
</svelte:head>
