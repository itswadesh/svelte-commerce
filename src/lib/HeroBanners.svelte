<style>
.geeks {
	overflow: hidden;
	margin: 0 auto;
}

.geeks img {
	width: 100%;
	transition: 0.5s all ease-in-out;
}

.geeks:hover img {
	transform: scale(1.03);
}
</style>

<script>
import ImageLoader from '$lib/components/Image/ImageLoader.svelte'
import { createEventDispatcher, onMount } from 'svelte'

export let heroBanners

let localHeroBanners

onMount(async () => {
	localHeroBanners = heroBanners?.filter((b) => {
		return b.type === 'hero'
	})
})
</script>

{#if localHeroBanners}
	<div class="grid grid-cols-2 md:grid-cols-4 items-center gap-2">
		<a href="{localHeroBanners[0]?.link}" class="w-auto col-span-2 geeks rounded">
			<ImageLoader
				src="{localHeroBanners[0]?.imgCdn}"
				alt=" "
				class="h-full w-full object-cover rounded" />
		</a>

		<a href="{localHeroBanners[1]?.link}" class="w-auto col-span-2 geeks rounded">
			<ImageLoader
				src="{localHeroBanners[1]?.imgCdn}"
				alt=" "
				class="h-full w-full object-cover rounded" />
		</a>

		<a href="{localHeroBanners[2]?.link}" class="w-auto col-span-1 geeks rounded">
			<ImageLoader
				src="{localHeroBanners[2]?.imgCdn}"
				alt=" "
				class="h-full w-full object-cover rounded" />
		</a>

		<a href="{localHeroBanners[3]?.link}" class="w-auto col-span-1 geeks rounded">
			<ImageLoader
				src="{localHeroBanners[3]?.imgCdn}"
				alt=" "
				class="h-full w-full object-cover rounded" />
		</a>

		<a href="{localHeroBanners[4]?.link}" class="w-auto col-span-2 geeks rounded">
			<ImageLoader
				src="{localHeroBanners[4]?.imgCdn}"
				alt=" "
				class="h-full w-full object-cover rounded" />
		</a>
	</div>
{/if}
