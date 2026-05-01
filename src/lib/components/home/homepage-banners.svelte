<script lang="ts">
	import { Skeleton } from '$lib/components/ui/skeleton'
	import LazyImg from '$lib/core/components/image/lazy-img.svelte'
	let { bannersList = [] } = $props()
	let loading = $state(true)
	let loadedImages = $state(new Set())

	const onImageLoad = (url: string) => {
		loadedImages.add(url)
	}

	$effect(() => {
		loading = !bannersList?.length
	})
</script>

<div>
	{#if loading}
	<div class="space-y-12">
		<div>
			<Skeleton class="mx-auto mb-6 h-8 w-48 rounded-full" />
			<div class="grid grid-cols-2 gap-4">
				<Skeleton class="aspect-[4/5] w-full rounded-none md:aspect-video" />
				<Skeleton class="aspect-[4/5] w-full rounded-none md:aspect-video" />
			</div>
		</div>
	</div>
{:else if bannersList.length}
	{#each bannersList as { title, link, isActive, banners, itemsPerRow }}
		{#if isActive}
			<div class="py-12">
				{#if title}
					<div class="mb-10 flex flex-col items-center text-center">
						<h2 class="text-3xl font-extrabold tracking-tight text-foreground lg:text-4xl">
							{title}
						</h2>
						<div class="mt-4 h-1 w-12 bg-primary"></div>
					</div>
				{/if}
				<div class="grid grid-cols-{itemsPerRow} gap-4 md:gap-8">
					{#if banners.length}
						{#each banners as banner}
							<a
								href={banner.link || link}
								aria-label={banner.title || banner.link}
								class="group relative block w-full overflow-hidden rounded-none shadow-sm transition-all duration-500 hover:shadow-xl"
							>
								<div class="relative overflow-hidden">
									<LazyImg
										src={banner.url}
										alt={banner.title || banner.link}
										aspectRatio={itemsPerRow === 1 ? '21:9' : '1:1'}
										class="relative w-full transition-transform duration-700 ease-in-out group-hover:scale-105"
									/>
									<div
										class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
									>
										{#if banner.title}
											<div class="absolute bottom-6 left-6 text-white">
												<h3 class="text-xl font-bold">{banner.title}</h3>
												<p class="mt-1 text-sm font-medium text-white/80">Explore Collection</p>
											</div>
										{/if}
									</div>
								</div>
							</a>
						{/each}
					{/if}
				</div>
			</div>
		{/if}
	{/each}
{/if}
</div>
