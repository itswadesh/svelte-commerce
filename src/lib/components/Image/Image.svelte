<style>
img {
	opacity: 0;
	transition: opacity 1200ms ease-out;
}
img.loaded {
	opacity: 1;
}
</style>

<script lang="ts">
import { getCdnImageUrl } from '$lib/utils'
import { onMount } from 'svelte'
import { page } from '$app/stores'
export let clazz: string
export let src: string
export let alt: string
export let width = 'auto'
export let height = 'auto'

const w = width === 'auto' ? 'auto' : +width * 2
const h = height === 'auto' ? 'auto' : +height * 2

let loaded = false
let thisImage: any

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
		? `${getCdnImageUrl(src, $page.data.store?.IMAGE_CDN_URL)}?width=2&height=4`
		: `${getCdnImageUrl(src, $page.data.store?.IMAGE_CDN_URL)}?width=${w}&height=${h}`}"
	alt="{alt}"
	class:loaded="{loaded}"
	class="{clazz} whitespace-pre-line"
	bind:this="{thisImage}" />
