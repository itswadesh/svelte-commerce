<script lang="ts">
	import { Skeleton } from '$lib/components/ui/skeleton'
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
		<div class="space-y-8">
			<div>
				<Skeleton class="mx-auto mb-4 h-8 w-48" />
				<div class="grid grid-cols-2 gap-0">
					<Skeleton class="h-[200px] w-full" />
					<Skeleton class="h-[200px] w-full" />
				</div>
			</div>
			<div>
				<Skeleton class="mx-auto mb-4 h-8 w-48" />
				<div class="grid grid-cols-3 gap-0">
					<Skeleton class="h-[150px] w-full" />
					<Skeleton class="h-[150px] w-full" />
					<Skeleton class="h-[150px] w-full" />
				</div>
			</div>
		</div>
	{:else if bannersList.length}
		{#each bannersList as { title, link, isActive, banners, itemsPerRow }}
			{#if isActive}
				<div>
					<h2 class="my-2 text-center text-xl font-bold uppercase lg:my-4">{title}</h2>
					<div class="grid grid-cols-{itemsPerRow} gap-0">
						{#if banners.length}
							{#each banners as banner}
								<a href={banner.link || link} aria-label="Goto {banner.title || banner.link}" class="relative w-full">
									<!-- <div
										class="absolute inset-0 bg-gray-200 transition-opacity duration-300"
										class:opacity-0={loadedImages.has(url)}
										class:opacity-100={!loadedImages.has(url)}
									/> -->
									<img src={banner.url} alt={banner.title || banner.link} class="relative w-full transition-opacity duration-300" />
								</a>
							{/each}
						{/if}
					</div>
				</div>
			{/if}
		{/each}
	{/if}
</div>
