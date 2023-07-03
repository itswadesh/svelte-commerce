<script>
import { LazyImg } from '$lib/components'

export let categories
export let loading

let clazz = ''
export { clazz as class }
</script>

<div class="{clazz} w-screen">
	{#if loading}
		<div class="overflow-x-auto p-3 py-5 scrollbar-none sm:px-10">
			<div class="container mx-auto flex items-start justify-start gap-4">
				{#each { length: 8 } as _}
					<div class="flex flex-col items-center">
						<div class="mb-1 h-20 w-20 animate-pulse rounded-full bg-zinc-200 sm:mb-4"></div>

						<div class="h-2 w-full animate-pulse rounded-full bg-zinc-200"></div>
					</div>
				{/each}
			</div>
		</div>
	{:else if categories && categories.length}
		<div class="p-3 py-5 sm:px-10 flex flex-wrap items-center gap-3">
			{#each categories as category}
				{#if category.img}
					<a
						href="/{category.link || category.slug || '##'}"
						aria-label="Click to view related products of this category"
						class="group flex w-20 flex-col items-center justify-center">
						<div
							class="mb-1 h-20 w-20 shrink-0 overflow-hidden rounded-full border shadow-md group-hover:border-primary-500 group-hover:shadow-xl sm:mb-4">
							<LazyImg
								src="{category.img}"
								alt="{category.name}"
								width="80"
								height="80"
								class="h-full w-full scale-100 transform object-cover text-xs transition-all duration-300 group-hover:scale-105" />
						</div>

						<h6
							class="w-full truncate overflow-ellipsis text-center capitalize tracking-tighter text-zinc-500 group-hover:font-medium group-hover:text-primary-500">
							{category.name}
						</h6>
					</a>
				{/if}
			{/each}
		</div>
	{/if}
</div>
