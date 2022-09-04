<style>
img {
	opacity: 0;
	transition: opacity 1200ms ease-out;
}
img.loaded {
	opacity: 1;
}
</style>

<script>
import { IMAGE_CDN_URL } from '$lib/config'

export let src
export let alt
export let clazz
import { onMount } from 'svelte'

let loaded = false
let thisImage

onMount(() => {
	const originalImageUrl = src.replace('https://misiki.s3.ap-south-1.amazonaws.com/', '/')

	if (src) src = IMAGE_CDN_URL + originalImageUrl

	thisImage.onload = () => {
		loaded = true
	}
})
</script>

<img
	src="{src}"
	alt="{alt}"
	class:loaded
	class="{clazz} whitespace-pre-line"
	bind:this="{thisImage}"
	loading="lazy" />
