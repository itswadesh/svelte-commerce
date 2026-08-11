<script lang="ts">
	let { children } = $props()
</script>

<!-- Auth pages (signup, password reset, verification) must never be indexed. -->
<svelte:head>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

{@render children?.()}
