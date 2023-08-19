<script lang="ts">
import { Gallery, LazyImg } from '$lib/components'
import { onMount } from 'svelte'
import { Splide, SplideSlide } from '@splidejs/svelte-splide'

export let data

let main: Splide
let thumbs: SplideSlide

let selectedImgIndex
let showPhotosModal

const mainOptions = {
	type: 'loop',
	perPage: 1,
	perMove: 1,
	pagination: false,
	arrows: false
}

const thumbsOptions = {
	type: 'slide',
	rewind: true,
	arrows: data.product?.images?.length > 1 ? true : false,
	gap: '1rem',
	pagination: false,
	fixedWidth: 100,
	fixedHeight: 100,
	cover: true,
	// focus: 'center' as const,
	isNavigation: true,
	updateOnMove: true,
	breakpoints: {
		640: {
			fixedWidth: 80,
			fixedHeight: 80
		}
	}
}

onMount(() => {
	if (main && thumbs) {
		main.sync(thumbs.splide)
	}
})

function handleGallery(index) {
	selectedImgIndex = index
	showPhotosModal = true
}
</script>

<div class="flex flex-col gap-5">
	{#if !data.product?.isCustomized && data?.product?.images?.length}
		<Splide options="{mainOptions}" bind:this="{main}" aria-labelledby="thumbnails-example-heading">
			{#each data.product?.images as img, ix}
				<SplideSlide class="flex justify-center">
					<button
						type="button"
						class="min-h-[300px] focus:outline-none"
						on:click="{() => handleGallery(ix)}">
						<LazyImg
							src="{img}"
							alt="{data.product?.name}"
							aspect_ratio="1:1"
							height="300"
							class="block h-auto w-full justify-center object-contain object-center" />

						<!-- <img
							alt="{data.product?.name}"
							height="500"
							src="{`${getCdnImageUrl(img, $page.data.store?.IMAGE_CDN_URL)}?tr=h-500`}"
							class="block h-auto w-full justify-center object-contain object-center" /> -->
					</button>
				</SplideSlide>
			{/each}
		</Splide>

		<Splide options="{thumbsOptions}" bind:this="{thumbs}">
			{#each data.product?.images as slide, ix}
				<SplideSlide>
					<LazyImg src="{slide}" alt="{slide.alt}" height="80" width="80" />
				</SplideSlide>
			{/each}
		</Splide>
	{/if}
</div>

<!-- Gallery -->
<Gallery
	bind:selectedImgIndex="{selectedImgIndex}"
	bind:showPhotosModal="{showPhotosModal}"
	title="{data.product.name}"
	images="{data.product?.images || []}" />
