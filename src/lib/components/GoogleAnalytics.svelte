<script lang="ts">
import { page } from '$app/stores'
import { GOOGLE_ANALYTICS_ID } from '$lib/config'

$: {
	if (typeof gtag !== 'undefined') {
		gtag('config', GOOGLE_ANALYTICS_ID, {
			page_title: document.title,
			page_path: $page.url.pathname
		})
	}
}
</script>

<svelte:head>
	<script async src="https://www.googletagmanager.com/gtag/js?id=G-BG3JKWLYPF">
	</script>
	<script>
	window.dataLayer = window.dataLayer || []

	function gtag() {
		dataLayer.push(arguments)
	}

	gtag('js', new Date())
	gtag('config', 'G-BG3JKWLYPF')
	</script>
</svelte:head>
