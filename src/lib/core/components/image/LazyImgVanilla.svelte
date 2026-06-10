<script lang="ts">
	import { page } from '$app/stores'
	import { Image } from '@unpic/svelte'
	import { createEventDispatcher } from 'svelte'

	export let alt = ''
	export let aspect_ratio = '3:4'
	export let height: number | 'auto' | null = null
	export let src: string
	export let width: number | 'auto' | null = null

	let clazz: string
	export { clazz as class }

	const dispatch = createEventDispatcher()

	const h = height === 'auto' || height == null ? '0' : +height * 2
	const w = width === 'auto' || width == null ? '0' : +width * 2
	// const h = height === 'auto' ? '0' : +height
	// const w = width === 'auto' ? '0' : +width

	const arh = aspect_ratio?.split(':')[1]
	const arw = aspect_ratio?.split(':')[0]

	const extension = src?.split('.').pop()

	let isSvg = false
	// $: IMAGE_CDN_PROVIDER = 'gumlet'
	// $: IMAGE_CDN_URL = 'https://sparki.gumlet.io'
	$: IMAGE_CDN_PROVIDER = 'imagekit'
	$: IMAGE_CDN_URL = 'https://ik.imagekit.io/kjbbomypt'

	if (extension === 'svg') {
		isSvg = true
	}

	$: useRawSrc = false
	$: loadError = false

	const getCdnImageUrl = ({ src }: { src: string; IMAGE_CDN_URL?: string; IMAGE_CDN_PROVIDER?: string; NO_QUERY?: boolean }) => src

	const handleLoadError = (event: Event) => {
		if (useRawSrc) {
			// Remove the error listener to prevent infinite loop
			if (event.target instanceof HTMLElement) {
				event.target.removeEventListener('error', handleLoadError)
			}
			loadError = true
			dispatch('finalError', event)
			return
		}
		// console.log('Error loading image', event)
		dispatch('error', event)
		useRawSrc = true
	}

	$: modifiedCdnUrl = getCdnImageUrl({
		src,
		IMAGE_CDN_URL,
		IMAGE_CDN_PROVIDER,
		NO_QUERY: false
	})
</script>

<div class="relative">
	{#if loadError}
		<div
			class="{clazz
				.split(' ')
				.filter((c) => c !== 'aspect-square')
				.join(' ')} bg-gray-100"
		></div>
	{:else}
		<!-- style="min-height:{+h / 2}px;" -->
		{#if IMAGE_CDN_PROVIDER === 'gumlet'}
			<Image
				{alt}
				loading="lazy"
				background="/placeholder.png"
				on:error={handleLoadError}
				src={useRawSrc
					? src
					: `${getCdnImageUrl({
							src,
							IMAGE_CDN_URL,
							IMAGE_CDN_PROVIDER
						})}?tr=w-${w},h-${h},ar-${aspect_ratio.replace(':', '-')}`}
				aspectRatio={+w && +h ? null : +aspect_ratio?.split(':')[0] / +aspect_ratio?.split(':')[1]}
				height={+h}
				width={+w}
				class="aspect-[{aspect_ratio?.split(':')[0]}/{aspect_ratio?.split(':')[1]}] lazy {clazz} bg-gray-100"
			/>
		{:else if IMAGE_CDN_PROVIDER === 'imagekit'}
			{#if getCdnImageUrl({ src, IMAGE_CDN_URL, IMAGE_CDN_PROVIDER, NO_QUERY: true })?.includes('http')}
				<!-- <Image
				{alt}
				loading="lazy"
				background="/placeholder.png"
				src="{`${getCdnImageUrl({
					src,
					IMAGE_CDN_URL,
					IMAGE_CDN_PROVIDER,
					NO_QUERY: false
				})}?tr=w-${w},h-${h},ar-${aspect_ratio.replace(':', '-')}`}"
				height="{+h}"
				width="{+w}"
				class="aspect-[{aspect_ratio?.split(':')[0]}/{aspect_ratio?.split(':')[1]}] lazy {clazz}" /> -->

				<!-- aspectRatio="{aspect_ratio?.split(':')[0]}/{aspect_ratio?.split(':')[1]}" -->
				<Image
					{alt}
					on:error={handleLoadError}
					background="/placeholder.png"
					src={useRawSrc ? src : `${modifiedCdnUrl.startsWith(IMAGE_CDN_URL) ? '' : IMAGE_CDN_URL}${modifiedCdnUrl}`}
					layout="constrained"
					loading="lazy"
					height={+h}
					width={+w}
					class="lazy {clazz} bg-gray-100"
				/>
			{:else}
				<!-- <Image
				{alt}
				loading="lazy"
				background="/placeholder.png"
				src="{`${IMAGE_CDN_URL}${getCdnImageUrl({
					src,
					IMAGE_CDN_URL,
					IMAGE_CDN_PROVIDER,
					NO_QUERY: false
				})}?tr=w-${w},h-${h},ar-${aspect_ratio.replace(':', '-')}`}"
				height="{+h}"
				width="{+w}"
				class="aspect-[{aspect_ratio?.split(':')[0]}/{aspect_ratio?.split(':')[1]}] lazy {clazz}" /> -->

				<Image
					{alt}
					background="/placeholder.png"
					on:error={handleLoadError}
					src={useRawSrc ? src : `${modifiedCdnUrl.startsWith(IMAGE_CDN_URL) ? '' : IMAGE_CDN_URL}${modifiedCdnUrl}`}
					layout="constrained"
					loading="lazy"
					aspectRatio={+w && +h ? null : +aspect_ratio?.split(':')[0] / +aspect_ratio?.split(':')[1]}
					height={+h}
					width={+w}
					class="lazy {clazz} bg-gray-100"
				/>
			{/if}
		{:else if IMAGE_CDN_PROVIDER === 'thumbor'}
			{#if getCdnImageUrl({ src, IMAGE_CDN_URL, IMAGE_CDN_PROVIDER, NO_QUERY: true })?.includes('http')}
				<!-- <Image
				{alt}
				src="{`${getCdnImageUrl({
					src,
					IMAGE_CDN_URL,
					IMAGE_CDN_PROVIDER,
					NO_QUERY: true
				})}`}"
				loading="lazy"
				height="{+h}"
				width="{+w}"
				class="aspect-[{aspect_ratio?.split(':')[0]}/{aspect_ratio?.split(':')[1]}] lazy {clazz}" /> -->

				<Image
					{alt}
					background="/placeholder.png"
					on:error={handleLoadError}
					src={useRawSrc ? src : `${modifiedCdnUrl.startsWith(IMAGE_CDN_URL) ? '' : IMAGE_CDN_URL}${modifiedCdnUrl}`}
					layout="constrained"
					loading="lazy"
					aspectRatio={+w && +h ? null : +aspect_ratio?.split(':')[0] / +aspect_ratio?.split(':')[1]}
					height={+h}
					width={+w}
					class="lazy {clazz} bg-gray-100"
				/>
			{:else}
				<!-- <Image
				{alt}
				src="{`${IMAGE_CDN_URL}/fit-in/${w}x${h}${getCdnImageUrl({
					src,
					IMAGE_CDN_URL,
					IMAGE_CDN_PROVIDER,
					NO_QUERY: true
				})}`}"
				loading="lazy"
				height="{+h}"
				width="{+w}"
				class="aspect-[{aspect_ratio?.split(':')[0]}/{aspect_ratio?.split(':')[1]}] lazy {clazz}" /> -->

				<Image
					{alt}
					background="/placeholder.png"
					on:error={handleLoadError}
					src={useRawSrc ? src : `${modifiedCdnUrl.startsWith(IMAGE_CDN_URL) ? '' : IMAGE_CDN_URL}${modifiedCdnUrl}`}
					layout="constrained"
					loading="lazy"
					aspectRatio={+w && +h ? null : +aspect_ratio?.split(':')[0] / +aspect_ratio?.split(':')[1]}
					height={+h}
					width={+w}
					class="lazy {clazz} bg-gray-100"
				/>
			{/if}
		{:else}
			<Image
				{alt}
				background="/placeholder.png"
				on:error={handleLoadError}
				src={useRawSrc ? src : `${modifiedCdnUrl.startsWith(IMAGE_CDN_URL) ? '' : IMAGE_CDN_URL}${modifiedCdnUrl}`}
				layout="constrained"
				loading="lazy"
				height={+h}
				width={+w}
				aspectRatio={+w && +h ? null : +aspect_ratio?.split(':')[0] / +aspect_ratio?.split(':')[1]}
				class="lazy {clazz} bg-gray-100"
			/>
		{/if}
	{/if}
</div>
