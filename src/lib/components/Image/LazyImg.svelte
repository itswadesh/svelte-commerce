<style>
img.lazy {
	opacity: 0.25;
	transition: opacity 1200ms ease-out;
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
import { browser } from '$app/environment'
import { getCdnImageUrl } from '$lib/util'
import { IMAGE_CDN_URL } from '$lib/config'
import { onDestroy } from 'svelte'
import { onMount } from 'svelte'
import lazyload from 'vanilla-lazyload'

export let src
export let alt = ''
export let width = 'auto'
export let height = 'auto'

const w = width === 'auto' ? 'auto' : +width * 2
const h = height === 'auto' ? 'auto' : +height * 2

let clazz
export { clazz as class }

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

<!-- <img
	alt="{alt}"
	class="lazy {clazz}"
	src="{`${getImageUrl(src)}?tr=h-2,w-1:w-${w},h-${h}`}"
	data-src="{`${getImageUrl(src)}?tr=w-${w},h-${h}:w-${w},h-${h}`}" /> -->

<img
	alt="{alt}"
	class="lazy {clazz}"
	src="{`${getCdnImageUrl(src)}?width=2&blur=25&aspect_ratio=2:3`}"
	data-src="{`${getCdnImageUrl(src)}?width=${w}&height=${h}&sharpen=true`}" />
