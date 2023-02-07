<script>
import SEO from '$lib/components/SEO/index.svelte'
import LazyImg from '$lib/components/Image/LazyImg.svelte'
import MobileFooter from '$lib/MobileFooter.svelte'
import PrimaryButton from '$lib/ui/PrimaryButton.svelte'
import { goto } from '$app/navigation'
import Hero from '$lib/home/Hero.svelte'
import HeroBanners from '$lib/home/HeroBanners.svelte'
import PageIdPickedBanner from '$lib/components/PageIdBanners/PageIdPickedBanner.svelte'
import { page } from '$app/stores'
export let data

$: heroBanners = data.banners?.data.filter((b) => {
	return b.type === 'hero'
})

$: pickedBanners = data.groupByBanners?.filter((b) => {
	return b._id?.title !== null
})

let seoProps = {
	title: `Category specific banners`,
	description: `Category specific banners`
}
</script>

<SEO {...seoProps} />

<div>
	{#if data.banners?.count > 0 || data.groupByBanners?.count > 0}
		<div class="bg-opacity-25 bg-center bg-repeat">
			<div class="mb-20 sm:mb-0">
				<div class="flex flex-col gap-5 sm:gap-10">
					<Hero banners="{data.banners?.data}" />

					<!-- HERO BANNERS -->

					{#await data.banners?.data}
						<div class="grid grid-cols-2 items-center gap-2 md:grid-cols-4">
							<div class="col-span-2 h-40 animate-pulse rounded-md bg-gray-300 sm:h-60"></div>

							<div class="col-span-2 h-40 animate-pulse rounded-md bg-gray-300 sm:h-60"></div>

							<div class="col-span-1 h-40 animate-pulse rounded-md bg-gray-300 sm:h-60"></div>

							<div class="col-span-1 h-40 animate-pulse rounded-md bg-gray-300 sm:h-60"></div>

							<div class="col-span-2 h-40 animate-pulse rounded-md bg-gray-300 sm:h-60"></div>
						</div>
					{:then banner}
						{#if heroBanners.length > 0}
							<div>
								<h1
									class="uppercase p-3 py-5 text-center font-serif text-xl font-medium tracking-wider sm:px-10 md:py-10 sm:text-2xl md:text-3xl xl:text-4xl"
								>
									BEST OF {$page.data.store?.websiteName} EXCLUSIVE
								</h1>

								<HeroBanners heroBanners="{heroBanners}" />
							</div>
						{/if}
					{/await}

					<!-- PICKED BANNERS -->

					{#await data.groupByBanners}
						<div class="grid grid-cols-2 items-center gap-2 md:grid-cols-4">
							<div class="col-span-2 h-40 animate-pulse rounded-md bg-gray-300 sm:h-60"></div>

							<div class="col-span-2 h-40 animate-pulse rounded-md bg-gray-300 sm:h-60"></div>

							<div class="col-span-1 h-40 animate-pulse rounded-md bg-gray-300 sm:h-60"></div>

							<div class="col-span-1 h-40 animate-pulse rounded-md bg-gray-300 sm:h-60"></div>

							<div class="col-span-2 h-40 animate-pulse rounded-md bg-gray-300 sm:h-60"></div>
						</div>
					{:then banner}
						{#if pickedBanners.length > 0}
							<div>
								<PageIdPickedBanner pickedBanners="{pickedBanners}" />
							</div>
						{/if}
					{/await}
				</div>
			</div>

			<!-- MOBILE FOOTER -->

			<div class="block sm:hidden">
				<MobileFooter />
			</div>
		</div>
	{:else}
		<div class="flex h-[70vh] items-center justify-center">
			<div class="m-10 flex flex-col items-center justify-center text-center">
				<h1 class="mb-10 text-xl font-semibold capitalize sm:text-2xl lg:text-3xl">
					Oops!!, No Items Found In this Id
				</h1>

				<div class="mb-5">
					<img
						src="/no/no-data-availible.png"
						alt="no data availible"
						class="h-20 w-20 text-xs object-contain"
					/>
				</div>

				<p class="mb-5 text-center text-gray-500">No data found</p>

				<PrimaryButton class="text-sm" on:click="{() => goto('/')}">Back to banner</PrimaryButton>
			</div>
		</div>
	{/if}
</div>
