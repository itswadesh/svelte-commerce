<script>
import ImageLoader from '$lib/components/Image/ImageLoader.svelte'
import CountDownTimer from '$lib/components/CountDownTimer.svelte'
import SEO from '$lib/components/SEO/index.svelte'
import HeadingUnderline from '$lib/HeadingUnderline.svelte'

export let title, bgWhite
const seoProps = {
	title: 'Sitemap Deals Details',
	metadescription: 'Sitemap Deals Details'
}
let data = [
	{ img: `/deals/deal1.png`, endTime: 'Mar 11, 2022 15:37:25' },
	{ img: `/deals/deal1.png`, endTime: 'Mar 11, 2022 15:37:25' },
	{ img: `/deals/deal1.png`, endTime: 'Mar 11, 2022 15:37:25' },
	{ img: `/deals/deal1.png`, endTime: 'Mar 11, 2022 15:37:25' }
]
</script>

<SEO {...seoProps} />

{#if data && data.length}
	<div
		class="px-3 py-5 sm:p-10 md:py-20
		{bgWhite ? 'bg-white' : 'bg-gray-50'}">
		<div class="container mx-auto max-w-6xl text-gray-800">
			<div
				class="mb-5 sm:mb-10 text-gray-800 max-w-max mx-auto flex flex-col items-center justify-center">
				<h1 class="mb-2 text-primary-500 text-xl sm:text-2xl lg:text-3xl font-bold">All Deals</h1>

				<HeadingUnderline />
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
				{#each data as b, ix}
					<div class="relative">
						<div class="bg-gray-200 border rounded-2xl overflow-hidden w-full h-auto zoom-in">
							<ImageLoader src="{b.img}" alt="{b.name}" class="object-cover text-xs" />
						</div>

						<div
							class="absolute inset-x-0 bottom-0 rounded-b-2xl z-10 pt-4 pb-2 bg-gradient-to-t from-black text-white flex items-center justify-center tracking-wide font-medium text-xs sm:text-sm">
							<CountDownTimer endDateTime="{b.endTime}" />
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
{/if}
