<script lang="ts">
	import { page } from '$app/state'

	// Self-canonical for routes that hand-roll their <svelte:head> instead of rendering <SeoHeader>.
	// Deliberately drops the query string: these routes have no paginated or filtered variants, so
	// every parameterised form of the URL should fold back to the bare path.
	// Do NOT add this to a layout — a page that also renders SeoHeader would then emit two
	// conflicting canonicals, which makes Google ignore both.
</script>

<svelte:head>
	<link rel="canonical" href={page.url.origin + page.url.pathname} />
</svelte:head>
