<style>
img.lazy {
	opacity: 0;
}
img:not(.initial) {
	transition: opacity 1s;
}
img.initial,
img.loaded,
img.error {
	opacity: 1;
}

img:not([src]) {
	visibility: hidden;
}
</style>

<script>
import { onMount } from 'svelte'
import { IMAGE_CDN_URL } from '$lib/config'
import lazyload from 'vanilla-lazyload'
import { onDestroy } from 'svelte'
import { browser } from '$app/environment'

export let src
export let alt = ''
export let width = 'auto'
export let height = 'auto'
const w = width === 'auto' ? 'auto' : +width * 2
const h = height === 'auto' ? 'auto' : +height * 2
let clazz
export { clazz as class }
function getImageUrl(src, tr) {
	if (src) {
		const originalImageUrl = src
			.replace('https://zapvi.s3.ap-south-1.amazonaws.com/', '/')
			.replace('https://ik.imagekit.io/3wzatecz51w3i/zapvi/', '/')
		return IMAGE_CDN_URL + originalImageUrl
	}
}

let lazyloadInstance
onMount(() => {
	if (browser) {
		lazyloadInstance = new lazyload({
			thresholds: '50px 10%'
		})
	}
})
onDestroy(() => {
	if (lazyloadInstance) lazyloadInstance.destroy()
})
</script>

<img
	alt="{alt}"
	class="lazy {clazz}"
	src="{`${getImageUrl(src)}?tr=h-2,w-1:w-${w},h-${h}`}"
	data-src="{`${getImageUrl(src)}?tr=w-${w},h-${h}:w-${w},h-${h}`}" />
