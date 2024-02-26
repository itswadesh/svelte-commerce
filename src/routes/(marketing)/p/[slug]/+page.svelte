<script>
import { Hero, HeroBanners, PickedBanners } from '$lib/theme-config'
import SEO from '$lib/components/SEO/index.svelte'

export let data

let seoProps = {
	title: `${data.page.title || data.page.name || ''}`,
	description: `${data.page.title || data.page.name || ''}`
}
</script>

<SEO {...seoProps} />

{#if data?.page}
	<section class="min-h-screen">
		<!-- Page title -->

		{#if data?.page?.title || data?.page?.name}
			<div class="px-3 py-5 sm:p-10">
				<div class="container mx-auto w-full max-w-6xl">
					<h1 class="text-center capitalize">
						{data?.page?.title || data?.page?.name}
					</h1>
				</div>
			</div>
		{/if}

		<!-- Main slider banner -->

		<div class="flex flex-col gap-10 sm:gap-20">
			<Hero
				sliderBannersDesktop="{data?.page?.sliderBanners?.banners}"
				sliderBannersMobile="{data?.page?.sliderBanners?.bannersMobile}" />

			<HeroBanners heroBanners="{data?.page?.heroBanners?.banners}" />
		</div>

		{#if data?.page?.pickedBanners?.length > 0}
			<PickedBanners pickedBanners="{data?.page?.pickedBanners}" />
		{/if}

		<!-- Page content -->

		{#if data?.page?.content}
			<div class="px-3 py-5 sm:p-10">
				<div class="container mx-auto w-full max-w-6xl">
					<div class="mb-10 prose max-w-none">
						{@html data?.page?.content}
					</div>
				</div>
			</div>
		{/if}
	</section>
{/if}
