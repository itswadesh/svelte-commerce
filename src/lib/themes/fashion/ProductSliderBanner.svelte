<script lang="ts">
import { Gallery, LazyImg } from '$lib/components'
import * as Carousel from '$lib/shad-components/ui/carousel/index'

export let data

let selectedImgIndex
let showPhotosModal

// const mainOptions = {
// 	type: 'loop',
// 	perPage: 1,
// 	perMove: 1,
// 	pagination: false,
// 	arrows: false
// }

// const thumbsOptions = {
// 	type: 'slide',
// 	rewind: true,
// 	arrows: data.product?.images?.length > 1 ? true : false,
// 	gap: '1rem',
// 	pagination: false,
// 	fixedWidth: 100,
// 	fixedHeight: 100,
// 	cover: true,
// 	// focus: 'center' as const,
// 	isNavigation: true,
// 	updateOnMove: true,
// 	breakpoints: {
// 		640: {
// 			fixedWidth: 80,
// 			fixedHeight: 80
// 		}
// 	}
// }

function handleGallery(index) {
	selectedImgIndex = index
	showPhotosModal = true
}
</script>

<div class="flex flex-col gap-5">
	{#if !data.product?.isCustomized && data?.product?.images?.length}
		<Carousel.Root
			opts="{{
				align: 'start',
				loop: true
			}}">
			<Carousel.Content class="-ml-5">
				{#each data.product?.images as img, ix}
					<Carousel.Item class="basis-auto">
						<div class="relative w-full flex justify-center">
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
						</div>
					</Carousel.Item>
				{/each}
			</Carousel.Content>
			<Carousel.Previous />
			<Carousel.Next />
		</Carousel.Root>

		<Carousel.Root
			opts="{{
				align: 'start',
				loop: true
			}}">
			<Carousel.Content class="-ml-5">
				{#each data.product?.images as slide, ix}
					<Carousel.Item class="basis-auto">
						<div class="relative w-full">
							<LazyImg class="" src="{slide}" alt="{slide.alt}" height="80" width="80" />
						</div>
					</Carousel.Item>
				{/each}
			</Carousel.Content>
			<Carousel.Previous />
			<Carousel.Next />
		</Carousel.Root>
	{/if}
</div>

<!-- Gallery -->
<Gallery
	bind:selectedImgIndex
	bind:showPhotosModal
	title="{data.product.name}"
	images="{data.product?.images || []}" />
