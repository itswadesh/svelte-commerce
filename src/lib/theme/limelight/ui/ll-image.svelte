<script lang="ts">
	import LazyImg from '$lib/core/components/image/lazy-img.svelte'
	import EmptyImage from '$lib/core/components/image/empty-image.svelte'

	/**
	 * Limelight image frame — square, no-radius, blush (#f5f5f5) backdrop,
	 * matching the source product/category imagery. Falls back to the shared
	 * empty-image placeholder when no source is provided.
	 */
	let {
		src,
		alt = '',
		ratio = '1 / 1',
		fit = 'cover'
	}: {
		src?: string
		alt?: string
		ratio?: string
		fit?: 'cover' | 'contain'
	} = $props()
</script>

<div class="ll-image" style="aspect-ratio: {ratio};">
	{#if src}
		<LazyImg {src} {alt} class="ll-image-img ll-image-img--{fit}" />
	{:else}
		<EmptyImage class="ll-image-empty" />
	{/if}
</div>

<style>
	.ll-image {
		position: relative;
		width: 100%;
		overflow: hidden;
		border-radius: 0;
		background: var(--limelight-blush, #f5f5f5);
	}

	.ll-image :global(.ll-image-img) {
		width: 100%;
		height: 100%;
		display: block;
	}

	.ll-image :global(.ll-image-img--cover) {
		object-fit: cover;
	}

	.ll-image :global(.ll-image-img--contain) {
		object-fit: contain;
	}

	.ll-image :global(.ll-image-empty) {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
</style>
