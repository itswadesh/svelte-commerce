<script>
import LazyImg from '$lib/components/Image/LazyImg.svelte'

export let loading, categories

let clazz = ''
export { clazz as class }

let categoryColors = [
	'bg-fuchsia-900',
	'bg-blue-900',
	'bg-green-900',
	'bg-stone-900',
	'bg-indigo-900',
	'bg-amber-900',
	'bg-lime-900',
	'bg-orange-900',
	'bg-teal-900',
	'bg-cyan-900',
	'bg-yellow-900',
	'bg-gray-900'
]
</script>

<div class="{clazz} w-screen">
	{#if loading}
		<div class="overflow-x-auto p-3 py-5 scrollbar-none sm:px-10">
			<div class="container mx-auto flex items-start justify-start gap-4">
				{#each { length: 8 } as _}
					<div class="flex flex-col items-center">
						<div class="mb-1 h-16 w-16 animate-pulse rounded-full bg-gray-300 sm:mb-4"></div>

						<div class="h-2 w-full animate-pulse rounded-full bg-gray-300"></div>
					</div>
				{/each}
			</div>
		</div>
	{:else if categories && categories.length}
		<div class="overflow-x-auto py-5 scrollbar-none sm:px-10">
			<div class="flex items-center pl-3">
				{#each categories as category}
					{#if category.img}
						<div class="pr-3">
							<a
								href="/{category.link || category.slug || '##'}"
								aria-label="Click to view related products of this category"
								class="group flex w-16 flex-col items-center justify-center"
							>
								<div
									class="mb-1 h-16 w-16 shrink-0 overflow-hidden rounded-full border shadow-md group-hover:border-primary-500 group-hover:shadow-xl sm:mb-4"
								>
									<LazyImg
										src="{category.img}"
										alt="{category.name}"
										width="64"
										height="64"
										class="h-full w-full scale-100 transform object-cover text-xs transition-all duration-300 group-hover:scale-105"
									/>
								</div>

								<h6
									class="w-full truncate overflow-ellipsis text-center text-xs capitalize tracking-tighter text-gray-500 group-hover:font-medium group-hover:text-primary-500"
								>
									{category.name}
								</h6>
							</a>
						</div>
					{/if}
				{/each}
			</div>
		</div>
	{/if}
</div>
