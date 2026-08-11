<script lang="ts">
	let { children } = $props()
</script>

<!-- Checkout URLs are per-session and must never be indexed. robots.txt only stops crawling,
     not indexing, so state it on the page for the whole checkout tree. -->
<svelte:head>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

{@render children?.()}
