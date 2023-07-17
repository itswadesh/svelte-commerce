<script>
import { LazyImg } from '$lib/components'

export let banners

$: pickedBanners = banners?.filter((b) => {
	return b._id?.type === 'picked' && b._id?.title !== 'DEAL ZONE'
})

$: pickedBannersForDeals = banners?.filter((b) => {
	return b._id?.type === 'picked' && b._id?.title === 'DEAL ZONE'
})
</script>

<div>
	{#if pickedBannersForDeals?.length}
		<div>
			{#each pickedBannersForDeals as b}
				<div>
					<h2 class="p-3 py-5 text-center sm:px-10 md:py-10 uppercase">
						{b._id?.title}
					</h2>

					{#if b.data?.length}
						<div class="w-screen overflow-x-auto scrollbar-none lg:hidden">
							<div role="banner" class="flex flex-row items-start">
								{#each b.data as banner, bx}
									{#if banner.img}
										<a href="{banner.link}" class="block shrink-0" data-sveltekit-preload-data>
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
									<a href="{banner.link}" class="col-span-1" data-sveltekit-preload-data>
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
				</div>
			{/each}
		</div>
	{/if}

	{#if pickedBanners?.length}
		<div>
			{#each pickedBanners as b}
				<div>
					<h2 class="p-3 py-5 text-center sm:px-10 md:py-10 uppercase">
						{b._id?.title}
					</h2>

					{#if b.data?.length}
						<div class="w-screen overflow-x-auto scrollbar-none lg:hidden">
							<div role="banner" class="flex flex-row items-start">
								{#each b.data as banner, bx}
									{#if banner.img}
										<a href="{banner.link}" class="block shrink-0" data-sveltekit-preload-data>
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
									<a href="{banner.link}" class="col-span-1" data-sveltekit-preload-data>
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
				</div>
			{/each}
		</div>
	{/if}
</div>
