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
import { getCdnImageUrl } from '$lib/utils'
import { onMount } from 'svelte'

export let noLazy = false // Dont add lazy to images that are on viewport
export let clazz
export let src
export let alt
export let width = 'auto'
export let height = 'auto'

const w = width === 'auto' ? 'auto' : +width * 2
const h = height === 'auto' ? 'auto' : +height * 2

let loaded = false
let thisImage

onMount(() => {
	thisImage.onload = () => {
		loaded = true
	}
})
</script>

<img
	loading="lazy"
	width="{width}px"
	height="{height}px"
	src="{!loaded
		? `${getCdnImageUrl(src)}?width=2&height=4`
		: `${getCdnImageUrl(src)}?width=${w}&height=${h}`}"
	alt="{alt}"
	class:loaded
	class="{clazz} whitespace-pre-line"
	bind:this="{thisImage}" />
