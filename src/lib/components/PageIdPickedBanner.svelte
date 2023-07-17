<script lang="ts">
import { LazyImg } from '$lib/components'

export let pickedBanners
</script>

{#if pickedBanners?.length}
	<div class="flex flex-col gap-5 sm:gap-10">
		{#each pickedBanners as b}
			<div>
				<h2 class="p-3 py-5 text-center sm:px-10 md:py-10 uppercase">
					{b._id?.title}
				</h2>

				{#if b.data?.length}
					<div class="max-w-screen overflow-x-auto scrollbar-none lg:hidden">
						<div role="banner" class="flex flex-row">
							{#each b.data as banner}
								{#if banner.img}
									<a
										href="{banner.link || '##'}"
										aria-label="Click to view banner related products page"
										class="shrink-0">
										<LazyImg
											src="{banner.img}"
											alt=""
											width="375"
											class="w-[47vw] object-contain sm:w-60" />
									</a>
								{/if}
							{/each}
						</div>
					</div>

					<div role="banner" class="hidden grid-cols-7 lg:grid">
						{#each b.data as banner}
							{#if banner.img}
								<a
									href="{banner.link || '##'}"
									aria-label="Click to view banner related products page"
									class="col-span-1">
									<LazyImg
										src="{banner.img}"
										alt=""
										width="375"
										class="h-full w-full object-contain" />
								</a>
							{/if}
						{/each}
					</div>
				{/if}
			</div>
		{/each}
	</div>
{/if}
