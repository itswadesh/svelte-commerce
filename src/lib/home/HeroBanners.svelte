<script>
import LazyImg from '$lib/components/Image/LazyImg.svelte'

export let heroBanners

function generateRandomImage() {
	const randomNum = Math.floor(Math.random() * 10) // Generates a random number between 0 and 9

	// Replace the image source with a random image URL
	return 'https://source.unsplash.com/random/' + randomNum
}
</script>

{#if heroBanners?.length > 0}
	<div>
		<div class="grid grid-cols-1 sm:grid-cols-2">
			<a
				href="{heroBanners[0]?.link || '##'}"
				aria-label="Click here to view the banner's related products">
				<LazyImg
					src="{heroBanners[0]?.img || generateRandomImage()}"
					alt=""
					height="390"
					aspect_ratio="2:1"
					class="col-span-1 h-full max-h-[390px] w-full object-cover aspect-video" />
			</a>

			<a
				href="{heroBanners[1]?.link || '##'}"
				aria-label="Click here to view the banner's related products">
				<LazyImg
					src="{heroBanners[1]?.img || generateRandomImage()}"
					alt=""
					height="390"
					aspect_ratio="2:1"
					class="col-span-1 h-full max-h-[390px] w-full object-cover aspect-video" />
			</a>
		</div>

		<div class="grid grid-cols-1 sm:grid-cols-2">
			<div class="grid grid-cols-2">
				<a
					href="{heroBanners[2]?.link || '##'}"
					aria-label="Click here to view the banner's related products">
					<LazyImg
						src="{heroBanners[2]?.img || generateRandomImage()}"
						alt=""
						height="390"
						aspect_ratio="1:1"
						class="col-span-1 h-full max-h-[390px] w-full object-cover aspect-square" />
				</a>

				<a
					href="{heroBanners[2]?.link || '##'}"
					aria-label="Click here to view the banner's related products">
					<LazyImg
						src="{heroBanners[3]?.img || generateRandomImage()}"
						alt=""
						height="390"
						aspect_ratio="1:1"
						class="col-span-1 h-full max-h-[390px] w-full object-cover aspect-square" />
				</a>
			</div>

			<div>
				<a
					href="{heroBanners[4]?.link || '##'}"
					aria-label="Click here to view the banner's related products">
					<LazyImg
						src="{heroBanners[4]?.img || generateRandomImage()}"
						alt=""
						height="390"
						aspect_ratio="2:1"
						class="col-span-1 h-full max-h-[390px] w-full object-cover aspect-video" />
				</a>
			</div>
		</div>
	</div>
{/if}
