<script>
import { LazyImg } from '$lib/components'
import { navigateToProperPath } from '$lib/utils'
import { page } from '$app/stores'

export let pickedBanners
</script>

{#if pickedBanners?.length}
	{#each pickedBanners as pickedBanner}
		{#if pickedBanner?.banners?.length}
			<div>
				<h2 class="p-3 py-5 text-center sm:px-10 md:py-10 uppercase">
					{pickedBanner?.title}
				</h2>

				<div class="w-screen overflow-x-auto scrollbar-none lg:hidden">
					<div role="banner" class="flex flex-row items-start">
						{#each pickedBanner?.banners as banner, bx}
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
					{#each pickedBanner?.banners as banner, bx}
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
			</div>
		{/if}
	{/each}
{/if}
