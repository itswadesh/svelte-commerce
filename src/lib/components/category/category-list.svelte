<script lang="ts">
	import { goto } from '$app/navigation'
	import LazyImg from '$lib/core/components/image/lazy-img.svelte'
	let { categories = [] } = $props()

	function navigateToCategory(slug: string, link: string) {
		if (link) {
			goto(`${link}`)
		} else if (slug) {
			goto(`/${slug}`)
		} else {
			goto('/products')
		}
	}
</script>

<div class="flex gap-4 overflow-x-auto py-2 sm:hidden">
	{#each categories.filter((category) => category.parentCategoryId === null) as { slug, icon, color, name, link, thumbnail } (slug)}
		<button onclick={() => navigateToCategory(slug, link)} class="flex flex-col items-center gap-2">
			<LazyImg src={thumbnail} alt="Category Image" class="overflow-hidden truncate rounded-full" width="72" height="72" />
			<span class="h-4 w-24 text-xs text-gray-600">{name}</span>
		</button>
	{/each}
</div>
