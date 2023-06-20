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

<script lang="ts">
import { browser } from '$app/environment'
import { fade } from 'svelte/transition'
import { getCdnImageUrl } from '$lib/utils'
import { onDestroy } from 'svelte'
import { onMount } from 'svelte'
import { page } from '$app/stores'
import lazyload from 'vanilla-lazyload'

export let alt = ''
export let aspect_ratio = '3:4'
export let height = null
export let src: string
export let width = null

// console.log('height, width', height, width)

let clazz: string
export { clazz as class }

const h = height === null ? 'auto' : +height * 2
const w = width === null ? 'auto' : +width * 2

let lazyloadInstance: any
const IMAGE_CDN_URL = $page.data.store.IMAGE_CDN_URL

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
	class="aspect-[{aspect_ratio.split(':')[0]}/{aspect_ratio.split(':')[1]}] lazy {clazz}"
	in:fade="{{ duration: 1000 }}"
	width="{w}"
	height="{h}"
	src="{`${getCdnImageUrl(src, IMAGE_CDN_URL)}?tr=w-1,h-1:w-${aspect_ratio.split(':')[0]},h-${
		aspect_ratio.split(':')[1]
	},ar-${aspect_ratio.replace(':', '-')}`}"
	data-src="{`${getCdnImageUrl(src, IMAGE_CDN_URL)}?tr=w-${w},h-${h},ar-${aspect_ratio.replace(
		':',
		'-'
	)}`}" />
