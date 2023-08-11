<script>
import { LazyImg } from '$lib/components'
import { navigateToProperPath } from '$lib/utils'

export let banners

$: pickedBanners = banners?.filter((b) => {
	return b._id?.type === 'picked' && b._id?.title !== 'DEAL ZONE'
})

$: pickedBannersForDeals = banners?.filter((b) => {
	return b._id?.type === 'picked' && b._id?.title === 'DEAL ZONE'
})
</script>

<div>
	<!-- Picked Banners For Deals -->

	{#if pickedBannersForDeals?.length}
		<ul class="mb-5 sm:mb-10 p-0 list-none flex flex-col gap-5 sm:gap-10">
			{#each pickedBannersForDeals as b}
				<li>
					<h2 class="p-3 py-5 text-center sm:px-10 md:py-10 uppercase">
						{b._id?.title}
					</h2>

					{#if b.data?.length}
						<div role="banner" class="w-[97vw] overflow-x-auto scrollbar-none lg:hidden">
							<div class="flex flex-row items-start">
								{#each b.data as banner, bx}
									{#if banner.img}
										<a
											href="{navigateToProperPath(banner.link || banner.slug)}"
											class="block shrink-0"
											data-sveltekit-preload-data>
											<LazyImg
												src="{banner.img}"
												alt="banner{bx}"
												height="430"
												width="375"
												class="h-[55vw] max-h-80 w-auto object-contain object-top" />
										</a>
									{/if}
								{/each}
							</div>
						</div>

						<div role="banner" class="hidden grid-cols-7 lg:grid">
							{#each b.data as banner, bx}
								{#if banner.img}
									<a
										href="{navigateToProperPath(banner.link || banner.slug)}"
										class="col-span-1"
										data-sveltekit-preload-data>
										<LazyImg
											src="{banner.img}"
											alt="banner{bx}"
											height="430"
											width="375"
											class="h-auto w-[375px] object-contain object-top" />
									</a>
								{/if}
							{/each}
						</div>
					{/if}
				</li>
			{/each}
		</ul>
	{/if}

	<!-- Picked Banners -->

	{#if pickedBanners?.length}
		<ul class="mb-5 sm:mb-10 p-0 list-none flex flex-col gap-5 sm:gap-10">
			{#each pickedBanners as b}
				<li>
					<h2 class="p-3 py-5 text-center sm:px-10 md:py-10 uppercase">
						{b._id?.title}
					</h2>

					{#if b.data?.length}
						<div role="banner" class="w-[97vw] overflow-x-auto scrollbar-none lg:hidden">
							<div class="flex flex-row items-start">
								{#each b.data as banner, bx}
									{#if banner.img}
										<a
											href="{navigateToProperPath(banner.link || banner.slug)}"
											class="block shrink-0"
											data-sveltekit-preload-data>
											<LazyImg
												src="{banner.img}"
												alt="banner{bx}"
												height="430"
												width="375"
												class="h-[55vw] max-h-80 w-auto object-contain object-top" />
										</a>
									{/if}
								{/each}
							</div>
						</div>

						<div role="banner" class="hidden grid-cols-7 lg:grid">
							{#each b.data as banner, bx}
								{#if banner.img}
									<a
										href="{navigateToProperPath(banner.link || banner.slug)}"
										class="col-span-1"
										data-sveltekit-preload-data>
										<LazyImg
											src="{banner.img}"
											alt="banner{bx}"
											height="430"
											width="375"
											class="h-auto w-[375px] object-contain object-top" />
									</a>
								{/if}
							{/each}
						</div>
					{/if}
				</li>
			{/each}
		</ul>
	{/if}
</div>
