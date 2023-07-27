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
img:not([src]) :not([srcset]) {
	visibility: hidden;
}
/* Initially set the opacity of the loader-line span to 1 (visible) */
span.loader-line {
	opacity: 1;
}
/* When the img with the loaded class is inside the .relative div,
   set the opacity of the loader-line span to 0 (hidden) */
.relative img.loaded + div span.loader-line {
	opacity: 0;
}
.loader-line {
	width: 50px;
	height: 3px;
	position: relative;
	overflow: hidden;
	background-color: #ddd;
	margin: auto;
	-webkit-border-radius: 20px;
	-moz-border-radius: 20px;
	border-radius: 20px;
}
.loader-line:before {
	content: '';
	position: absolute;
	left: -50%;
	height: 3px;
	width: 40%;
	background-color: gray;
	-webkit-animation: lineAnim 1s linear infinite;
	-moz-animation: lineAnim 1s linear infinite;
	animation: lineAnim 1s linear infinite;
	-webkit-border-radius: 20px;
	-moz-border-radius: 20px;
	border-radius: 20px;
}

@keyframes lineAnim {
	0% {
		left: -40%;
	}
	50% {
		left: 20%;
		width: 80%;
	}
	100% {
		left: 100%;
		width: 100%;
	}
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

let clazz: string
export { clazz as class }

let imageLoaded = false

const h = height === null ? 'auto' : +height * 2
const w = width === null ? 'auto' : +width * 2

let lazyloadInstance: any
const IMAGE_CDN_URL = $page.data.store?.IMAGE_CDN_URL ?? ''

onMount(() => {
	if (browser) {
		lazyloadInstance = new lazyload({
			thresholds: '50px 10%'
		})
	}
})

onDestroy(() => {
	if (lazyloadInstance) lazyloadInstance.destroy()
	imageLoaded = true
})
</script>

<div class="relative">
	{#if imageLoaded}
		<img
			in:fade="{{ duration: 300 }}"
			alt="{alt}"
			src="/placeholder.png"
			data-src="{`${getCdnImageUrl(src, IMAGE_CDN_URL)}?tr=w-${w},h-${h},ar-${aspect_ratio.replace(
				':',
				'-'
			)}`}"
			height="{h}"
			width="{w}"
			class="aspect-[{aspect_ratio.split(':')[0]}/{aspect_ratio.split(':')[1]}] lazy {clazz}" />
	{:else}
		<img
			in:fade="{{ duration: 300 }}"
			alt=" "
			src="/placeholders/placeholder2.png"
			data-src="{`${getCdnImageUrl(src, IMAGE_CDN_URL)}?tr=w-${w},h-${h},ar-${aspect_ratio.replace(
				':',
				'-'
			)}`}"
			class="aspect-[{aspect_ratio.split(':')[0]}/{aspect_ratio.split(':')[1]}] lazy {clazz}" />
	{/if}

	<div class="absolute inset-0 flex itmes-center justify-center">
		<span class="loader-line"></span>
	</div>
</div>

<!-- <img
	alt="{alt}"
	class="aspect-[{aspect_ratio.split(':')[0]}/{aspect_ratio.split(':')[1]}] lazy {clazz}"
	in:fade="{{ duration: 300}}"
	width="{w}"
	height="{h}"
	src="{`${getCdnImageUrl(src, IMAGE_CDN_URL)}?tr=w-1,h-1:w-${aspect_ratio.split(':')[0]},h-${
		aspect_ratio.split(':')[1]
	},ar-${aspect_ratio.replace(':', '-')}`}"
	data-src="{`${getCdnImageUrl(src, IMAGE_CDN_URL)}?tr=w-${w},h-${h},ar-${aspect_ratio.replace(
		':',
		'-'
	)}`}" /> -->
