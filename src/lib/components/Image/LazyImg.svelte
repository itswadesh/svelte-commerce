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
import { onDestroy, onMount } from 'svelte'
import { page } from '$app/stores'
import lazyload from 'vanilla-lazyload'
// import { storeStore } from '$lib/store/store'

export let alt = ''
export let aspect_ratio = '3:4'
export let height = null
export let src: string
export let width = null

let clazz: string
export { clazz as class }

// const h = height === 'auto' ? 'auto' : +height * 2
// const w = width === 'auto' ? 'auto' : +width * 2
const h = height === 'auto' ? '0' : +height * 2
const w = width === 'auto' ? '0' : +width * 2

const arh = aspect_ratio?.split(':')[1]
const arw = aspect_ratio?.split(':')[0]

const extension = src?.split('.').pop()

let imageLoaded = false
let isSvg = false
let lazyloadInstance: any
$: IMAGE_CDN_PROVIDER = $page?.data?.store?.imageCdn?.provider?.val
$: IMAGE_CDN_URL = $page?.data?.store?.imageCdn?.url?.val
// let loadedImage = false
// let store = {}
onMount(() => {
	// if (browser) {
	// 	storeStore.subscribe((value) => {
	// 		store = value
	// 		IMAGE_CDN_PROVIDER = store?.imageCdn?.provider?.val
	// 		IMAGE_CDN_URL = store?.imageCdn?.url?.val
	// 	})
	// }
	lazyloadInstance = new lazyload({
		thresholds: '50px 10%',
		callback_error: (img) => {
			img.setAttribute('src', 'https://i.ibb.co/ZKFtJ25/image-1.png')
		},
		callback_enter: handleLineLoader
	})
})

onDestroy(() => {
	if (lazyloadInstance) {
		lazyloadInstance.destroy()
	}

	imageLoaded = true
})

if (extension === 'svg') {
	isSvg = true
}

function handleLineLoader() {
	const lineLoader = document.querySelector('.loader-line')

	lineLoader.style.display = 'none'
}
</script>

<div class="relative">
	{#if imageLoaded}
		{#if IMAGE_CDN_PROVIDER === 'imagekit'}
			{#if getCdnImageUrl( { src, IMAGE_CDN_URL, IMAGE_CDN_PROVIDER, NO_QUERY: true } )?.includes('http')}
				<img
					{alt}
					src="/placeholder.png"
					data-src="{`${getCdnImageUrl({
						src,
						IMAGE_CDN_URL,
						IMAGE_CDN_PROVIDER,
						NO_QUERY: true
					})}?tr=w-${w},h-${h},ar-${aspect_ratio.replace(':', '-')}`}"
					height="{h}"
					width="{w}"
					class="aspect-[{aspect_ratio?.split(':')[0]}/{aspect_ratio?.split(
						':'
					)[1]}] lazy {clazz}" />
			{:else}
				<img
					{alt}
					src="/placeholder.png"
					data-src="{`${IMAGE_CDN_URL}${getCdnImageUrl({
						src,
						IMAGE_CDN_URL,
						IMAGE_CDN_PROVIDER,
						NO_QUERY: true
					})}?tr=w-${w},h-${h},ar-${aspect_ratio.replace(':', '-')}`}"
					height="{h}"
					width="{w}"
					class="aspect-[{aspect_ratio?.split(':')[0]}/{aspect_ratio?.split(
						':'
					)[1]}] lazy {clazz}" />
			{/if}

			<!-- <div class="absolute inset-0 flex itmes-center justify-center">
				<span class="loader-line"></span>
			</div> -->
		{:else if IMAGE_CDN_PROVIDER === 'thumbor'}
			{#if getCdnImageUrl( { src, IMAGE_CDN_URL, IMAGE_CDN_PROVIDER, NO_QUERY: true } )?.includes('http')}
				<img
					{alt}
					src="/placeholder.png"
					data-src="{`${getCdnImageUrl({
						src,
						IMAGE_CDN_URL,
						IMAGE_CDN_PROVIDER,
						NO_QUERY: true
					})}`}"
					height="{h}"
					width="{w}"
					class="aspect-[{aspect_ratio?.split(':')[0]}/{aspect_ratio?.split(
						':'
					)[1]}] lazy {clazz}" />
			{:else}
				<img
					{alt}
					src="/placeholder.png"
					data-src="{`${IMAGE_CDN_URL}/fit-in/${w}x${h}${getCdnImageUrl({
						src,
						IMAGE_CDN_URL,
						IMAGE_CDN_PROVIDER,
						NO_QUERY: true
					})}`}"
					height="{h}"
					width="{w}"
					class="aspect-[{aspect_ratio?.split(':')[0]}/{aspect_ratio?.split(
						':'
					)[1]}] lazy {clazz}" />
			{/if}
		{/if}

		<!-- <div class="absolute inset-0 flex itmes-center justify-center">
			<span class="loader-line"></span>
		</div> -->
	{:else if IMAGE_CDN_PROVIDER === 'imagekit'}
		{#if getCdnImageUrl( { src, IMAGE_CDN_URL, IMAGE_CDN_PROVIDER, NO_QUERY: true } )?.includes('http')}
			<img
				alt=" "
				src="/placeholders/placeholder2.png"
				data-src="{`${getCdnImageUrl({
					src,
					IMAGE_CDN_URL,
					IMAGE_CDN_PROVIDER,
					NO_QUERY: true
				})}?tr=w-${w},h-${h},ar-${aspect_ratio.replace(':', '-')}`}"
				class="aspect-[{aspect_ratio?.split(':')[0]}/{aspect_ratio?.split(':')[1]}] lazy {clazz}" />

			<!-- <div class="absolute inset-0 flex itmes-center justify-center">
				<span class="loader-line"></span>
			</div> -->
		{:else}
			<img
				alt=" "
				src="/placeholders/placeholder2.png"
				data-src="{`${IMAGE_CDN_URL}${getCdnImageUrl({
					src,
					IMAGE_CDN_URL,
					IMAGE_CDN_PROVIDER,
					NO_QUERY: true
				})}?tr=w-${w},h-${h},ar-${aspect_ratio.replace(':', '-')}`}"
				class="aspect-[{aspect_ratio?.split(':')[0]}/{aspect_ratio?.split(':')[1]}] lazy {clazz}" />
			<!-- <div class="absolute inset-0 flex itmes-center justify-center">
				<span class="loader-line"></span>
			</div> -->
		{/if}
	{:else if IMAGE_CDN_PROVIDER === 'thumbor'}
		{#if getCdnImageUrl( { src, IMAGE_CDN_URL, IMAGE_CDN_PROVIDER, NO_QUERY: true } )?.includes('http')}
			<img
				alt=" "
				src="/placeholders/placeholder2.png"
				data-src="{`${getCdnImageUrl({
					src,
					IMAGE_CDN_URL,
					IMAGE_CDN_PROVIDER,
					NO_QUERY: true
				})}`}"
				class="aspect-[{aspect_ratio?.split(':')[0]}/{aspect_ratio?.split(':')[1]}] lazy {clazz}" />
			<!-- <div class="absolute inset-0 flex itmes-center justify-center">
				<span class="loader-line"></span>
			</div> -->
		{:else}
			<img
				alt=" "
				src="/placeholders/placeholder2.png"
				data-src="{`${IMAGE_CDN_URL}/fit-in/${w}x${h}${getCdnImageUrl({
					src,
					IMAGE_CDN_URL,
					IMAGE_CDN_PROVIDER,
					NO_QUERY: true
				})}`}"
				class="aspect-[{aspect_ratio?.split(':')[0]}/{aspect_ratio?.split(':')[1]}] lazy {clazz}" />
			<!-- <div class="absolute inset-0 flex itmes-center justify-center">
				<span class="loader-line"></span>
			</div> -->
		{/if}
	{/if}

	<div class="absolute inset-0 flex itmes-center justify-center">
		<span class="loader-line"></span>
	</div>
</div>

<!-- <img
	alt="{alt}"
	class="aspect-[{aspect_ratio?.split(':')[0]}/{aspect_ratio?.split(':')[1]}] lazy {clazz}"
	in:fade="{{ duration: 300}}"
	width="{w}"
	height="{h}"
	src="{`${getCdnImageUrl(src, IMAGE_CDN_URL)}?tr=w-1,h-1:w-${aspect_ratio?.split(':')[0]},h-${
		aspect_ratio?.split(':')[1]
	},ar-${aspect_ratio.replace(':', '-')}`}"
	data-src="{`${getCdnImageUrl(src, IMAGE_CDN_URL)}?tr=w-${w},h-${h},ar-${aspect_ratio.replace(
		':',
		'-'
	)}`}" /> -->
