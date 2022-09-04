<script>
import { onMount } from 'svelte'
import { IMAGE_CDN_URL } from '$lib/config'
import lazyload from 'vanilla-lazyload'
import { onDestroy } from 'svelte'
import { browser } from '$app/env'

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
		return originalImageUrl + tr
	}
}

let lazyloadInstance
onMount(() => {
	if (browser) {
		lazyloadInstance = new lazyload()
	}
})
onDestroy(() => {
	if (lazyloadInstance) lazyloadInstance.destroy()
})
</script>

<img
	alt="{alt}"
	class="lazy {clazz}"
	src="{`${src}?tr=h-1,w-1:w-${w},h-${h}`}"
	data-src="{`${src}?tr=w-${w},h-${h}:w-${w},h-${h}`}" />
