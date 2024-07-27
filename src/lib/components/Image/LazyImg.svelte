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
import { getCdnImageUrl } from '$lib/utils/index'
import { page } from '$app/stores'
import { Image } from '@unpic/svelte'
// import PlaceHolder from '/placeholders/placeholder2.png'
// import PlaceHolder from '/placeholder.png'

export let alt = ''
export let aspect_ratio = '3:4'
export let height = 0
export let src: string
export let width = 0

let clazz: string
export { clazz as class }

const h = height === 0 ? 0 : +height * 2
const w = width === 0 ? 0 : +width * 2

const arh = aspect_ratio?.split(':')[1]
const arw = aspect_ratio?.split(':')[0]

const extension = src?.split('.').pop()

let isSvg = false

if (extension === 'svg') {
	isSvg = true
}
</script>

<div class="relative h-full" style="min-height:{24}px;">
	<Image
		{alt}
		loading="lazy"
		background="/placeholder.png"
		src="{`${getCdnImageUrl({ src })}?tr=w-${w},h-${h},ar-${aspect_ratio.replace(':', '-')}`}"
		height="{+h}"
		width="{+w}"
		class="aspect-[{aspect_ratio?.split(':')[0]}/{aspect_ratio?.split(':')[1]}] lazy {clazz}" />
</div>
