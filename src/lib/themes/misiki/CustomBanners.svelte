<script>
import { navigateToProperPath } from '$lib/utils'
import LazyImg from '$lib/components/Image/LazyImg.svelte'

export let sections = []
</script>

{#if sections?.length}
	{#each sections as banner, banner_index (banner.id)}
		{#if banner && banner.active}
			{#if !banner.is_mobile}
				<section class="hidden lg:block">
					<!-- Header -->

					{#if banner.link && banner.title}
						<!-- Title with link -->

						<a href="{banner.link}" class="block">
							<h2 class="p-3 py-5 text-center sm:px-10 md:py-10 uppercase">
								{banner.title}
							</h2>
						</a>
					{:else if banner.title}
						<!-- Title with out link -->

						<h2 class="p-3 py-5 text-center sm:px-10 md:py-10 uppercase">
							{banner.title}
						</h2>
					{/if}

					<!-- Layout -->

					<div>
						<div
							class="grid grid-cols-12 shrink-0"
							style="grid-template-rows: repeat({banner.total_rows}, minmax(0, 1fr)); 
                        	gap: {banner.padding_between_banners}px; 
                        	padding: {banner.padding_over_all_banners}px;">
							{#each banner.items as item, item_index}
								<a
									href="{navigateToProperPath(item.link || item.slug)}"
									class="relative block"
									style="grid-column: span {item.columns_count} / span {item.columns_count};  grid-row: span {item.rows_count} / span {item.rows_count};">
									{#if item.img}
										<!-- Banner -->

										<LazyImg
											src="{item.img}"
											alt="{banner.title || ''} banner {item_index + 1}"
											aspect_ratio="{item.aspect_ratio || ''}"
											height="{(item.rows_count * banner.row_height).toString()}"
											class="h-full w-full object-cover object-top text-xs" />

										{#if item.title}
											<div class="absolute inset-0 z-10 flex items-center justify-start p-10">
												<h5 class="text-primary-500 text-xl font-bold uppercase">
													{item.title}
												</h5>
											</div>
										{/if}
									{/if}
								</a>
							{/each}
						</div>
					</div>
				</section>
			{:else if banner.is_mobile && !banner.is_horizontally_scrollable}
				<section class="block lg:hidden">
					<!-- Header -->

					{#if banner.link && banner.title}
						<!-- Title with link -->

						<a href="{banner.link}" class="block">
							<h2 class="p-3 py-5 text-center sm:px-10 md:py-10 uppercase">
								{banner.title}
							</h2>
						</a>
					{:else if banner.title}
						<!-- Title with out link -->

						<h2 class="p-3 py-5 text-center sm:px-10 md:py-10 uppercase">
							{banner.title}
						</h2>
					{/if}

					<!-- Layout -->

					<div>
						<div
							class="grid grid-cols-12 shrink-0"
							style="grid-template-rows: repeat({banner.total_rows}, minmax(0, 1fr)); 
                        	gap: {banner.padding_between_banners}px; 
                       	 	padding: {banner.padding_over_all_banners}px;">
							{#each banner.items as item, item_index}
								{#if item.img}
									<a
										href="{navigateToProperPath(item.link || item.slug)}"
										class="relative block shrink-0"
										style="grid-column: span {item.columns_count} / span {item.columns_count};  grid-row: span {item.rows_count} / span {item.rows_count};"
										data-sveltekit-preload-data>
										<LazyImg
											src="{item.img}"
											alt="{banner.title || ''} banner {item_index + 1}"
											aspect_ratio="{item.aspect_ratio || ''}"
											height="{(item.rows_count * banner.row_height).toString()}"
											class="h-full w-full object-cover object-top text-xs" />

										{#if item.title}
											<div class="absolute inset-0 z-10 flex items-center justify-start p-10">
												<h5 class="text-primary-500 text-xl font-bold uppercase">
													{item.title}
												</h5>
											</div>
										{/if}
									</a>
								{/if}
							{/each}
						</div>
					</div>
				</section>
			{:else if banner.is_mobile && banner.is_horizontally_scrollable}
				<section class="block lg:hidden">
					<!-- Header -->

					{#if banner.link && banner.title}
						<!-- Title with link -->

						<a href="{banner.link}" class="block">
							<h2 class="p-3 py-5 text-center sm:px-10 md:py-10 uppercase">
								{banner.title}
							</h2>
						</a>
					{:else if banner.title}
						<!-- Title with out link -->

						<h2 class="p-3 py-5 text-center sm:px-10 md:py-10 uppercase">
							{banner.title}
						</h2>
					{/if}

					<!-- Layout -->

					<div class="w-screen overflow-x-auto scrollbar-none">
						<div
							role="banner"
							class="flex flex-row items-start"
							style="gap: {banner.padding_between_banners}px; padding: {banner.padding_over_all_banners}px;">
							{#each banner.items as item, item_index}
								{#if item.img}
									<!-- Banner -->

									<a
										href="{navigateToProperPath(item.link || item.slug)}"
										class="relative block shrink-0"
										data-sveltekit-preload-data>
										<LazyImg
											src="{item.img}"
											alt="{banner.title || ''} banner {item_index + 1}"
											aspect_ratio="{item.aspect_ratio || ''}"
											height="{banner.row_height}"
											class="h-[{banner.row_height}px] object-contain object-top" />

										{#if item.title}
											<div class="absolute inset-0 z-10 flex items-center justify-start p-10">
												<h5 class="text-primary-500 text-xl font-bold uppercase">
													{item.title}
												</h5>
											</div>
										{/if}
									</a>
								{/if}
							{/each}
						</div>
					</div>
				</section>
			{/if}
		{/if}
	{/each}
{/if}
