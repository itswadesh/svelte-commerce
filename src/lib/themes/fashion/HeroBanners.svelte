<script>
import { LazyImg } from '$lib/components'
import { navigateToProperPath } from '$lib/utils'
import { page } from '$app/stores'

export let heroBanners

function generateRandomImage() {
	const randomNum = Math.floor(Math.random() * 50) // Generates a random number between 0 and 9

	// Replace the image source with a random image URL
	return 'https://source.unsplash.com/random/' + randomNum
}
</script>

{#if heroBanners?.length > 0}
	<h2
		class="p-3 py-5 sm:px-10 md:py-10 text-center uppercase text-xl font-medium tracking-wider sm:text-2xl md:text-2xl">
		Best of {$page.data.store?.websiteName} exclusive
	</h2>

	<div>
		<div class="grid grid-cols-1 sm:grid-cols-2">
			<a
				href="{navigateToProperPath(heroBanners[0]?.link || heroBanners[0]?.slug)}"
				aria-label="Click here to view the banner's related products">
				<LazyImg
					src="{heroBanners[0]?.img || generateRandomImage()}"
					alt=""
					width="694"
					height="390"
					aspect_ratio="16:9"
					class="col-span-1 h-full max-h-[390px] w-full object-cover object-center aspect-video" />
			</a>

			<a
				href="{navigateToProperPath(heroBanners[1]?.link || heroBanners[1]?.slug)}"
				aria-label="Click here to view the banner's related products">
				<LazyImg
					src="{heroBanners[1]?.img || generateRandomImage()}"
					alt=""
					width="694"
					height="390"
					aspect_ratio="16:9"
					class="col-span-1 h-full max-h-[390px] w-full object-cover object-center aspect-video" />
			</a>
		</div>

		<div class="grid grid-cols-1 sm:grid-cols-2">
			<div class="grid grid-cols-2">
				<a
					href="{navigateToProperPath(heroBanners[2]?.link || heroBanners[2]?.slug)}"
					aria-label="Click here to view the banner's related products">
					<LazyImg
						src="{heroBanners[2]?.img || generateRandomImage()}"
						alt=""
						width="390"
						height="390"
						class="col-span-1 h-full max-h-[390px] w-full object-cover object-center" />
				</a>

				<a
					href="{navigateToProperPath(heroBanners[3]?.link || heroBanners[3]?.slug)}"
					aria-label="Click here to view the banner's related products">
					<LazyImg
						src="{heroBanners[3]?.img || generateRandomImage()}"
						alt=""
						width="390"
						height="390"
						class="col-span-1 h-full max-h-[390px] w-full object-cover object-center" />
				</a>
			</div>

			<div>
				<a
					href="{navigateToProperPath(heroBanners[4]?.link || heroBanners[4]?.slug)}"
					aria-label="Click here to view the banner's related products">
					<LazyImg
						src="{heroBanners[4]?.img || generateRandomImage()}"
						alt=""
						width="694"
						height="390"
						aspect_ratio="16:9"
						class="col-span-1 h-full max-h-[390px] w-full object-cover object-center aspect-video" />
				</a>
			</div>
		</div>
	</div>
{/if}
