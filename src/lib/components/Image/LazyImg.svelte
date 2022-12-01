<style>
img.lazy {
	opacity: 0.95;
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

<img
	alt="{alt}"
	class="lazy {clazz}"
	src="{`${getCdnImageUrl(src)}?tr=h-1.5,w-1:w-${w},h-${h}`}"
	data-src="{`${getCdnImageUrl(src)}?tr=w-${w},h-${h}:w-${w},h-${h}`}" />
