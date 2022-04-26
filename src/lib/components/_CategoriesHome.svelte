<style>
@media (max-width: 1024px) {
	.container-width {
		width: 18vw;
	}
}

@media (min-width: 1024px) {
	.container-width {
		width: 10vw;
	}
}

@media (max-width: 1024px) {
	.wrapper-width {
		width: 18vw;
		height: 18vw;
	}
}

@media (min-width: 1024px) {
	.wrapper-width {
		width: 10vw;
		height: 10vw;
	}
}
</style>

<script>
import ImageLoader from '$lib/components/Image/ImageLoader.svelte'

export let loading, categories

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

{#if loading}
	<div class="px-3 py-5 sm:p-10">
		<div class="container mx-auto max-w-6xl text-gray-800">
			<div class="sm:hidden grid grid-cols-4 gap-4 items-start justify-items-center">
				{#each { length: 8 } as _}
					<div class="flex flex-col items-center">
						<div class="mb-1 sm:mb-4 w-20 h-20 bg-gray-300 rounded-full animate-pulse"></div>

						<div class="h-2 w-full bg-gray-300 rounded-full animate-pulse"></div>
					</div>
				{/each}
			</div>

			<div class="hidden sm:grid grid-cols-4 lg:grid-cols-6 gap-4 items-start justify-items-center">
				{#each { length: 12 } as _}
					<div class="flex flex-col items-center">
						<div class="mb-4 w-32 h-32 lg:w-36 lg:h-36 bg-gray-300 rounded-full animate-pulse">
						</div>

						<div class="h-4 w-full bg-gray-300 rounded-full animate-pulse"></div>
					</div>
				{/each}
			</div>
		</div>
	</div>
{:else if categories && categories.length}
	<div class="px-3 py-5 sm:p-10">
		<div class="container mx-auto max-w-6xl text-gray-800">
			<div class="pb-5 lg:pb-10 flex items-center justify-center space-x-2">
				<hr class="h-1 border-gray-300 flex-1" />

				<div
					class="flex items-center justify-center text-center sm:text-lg font-semibold tracking-wider uppercase p-2 sm:px-8 text-primary-500">
					Categories
				</div>

				<hr class="h-1 border-gray-300 flex-1" />
			</div>

			<!-- Mobile(Ends at screen size : sm) -->

			<div class="sm:hidden grid grid-cols-4 gap-4 items-start justify-items-center">
				{#each categories as category, i}
					{#if i <= 6}
						{#if category.imgCdn}
							<a
								href="/search?q={category.slug}"
								class="w-20 flex flex-col items-center justify-center group">
								<div
									class="mb-1 sm:mb-4 w-20 h-20 rounded-full border-2 border-gray-300 group-hover:border-primary-500 flex-shrink-0 group-hover:shadow-xl overflow-hidden">
									<ImageLoader
										src="{category.imgCdn}"
										alt="{category.name}"
										class="w-full h-full object-cover text-xs transform scale-105 group-hover:scale-100 transition-all duration-300" />
								</div>

								<h6
									class="w-full text-xs group-hover:font-medium text-center text-gray-500 group-hover:text-primary-500 capitalize overflow-ellipsis line-clamp-2 tracking-tighter">
									{category.name}
								</h6>
							</a>
						{:else}
							<a
								href="/category/{category.slug}"
								class="w-20 flex flex-col items-center justify-center group">
								<div
									class="relative mb-1 sm:mb-4 h-20 w-20 rounded-full border-2 border-gray-300 group-hover:border-primary-500 flex-shrink-0 group-hover:shadow-xl overflow-hidden bg-no-repeat bg-center bg-cover
									"
									style="background-image: url('/atoz-store.jpg');">
									<div
										class="absolute inset-0 flex items-center justify-center text-center text-3xl text-white font-bold group-hover:font-bold bg-opacity-70
										{categoryColors[i]}">
										{category.name[0]}
									</div>
								</div>

								<h6
									class="w-full text-xs group-hover:font-medium text-center text-gray-500 group-hover:text-primary-500 capitalize overflow-ellipsis line-clamp-2 tracking-tighter">
									{category.name}
								</h6>
							</a>
						{/if}
					{/if}
				{/each}

				<div class="sm:hidden">
					<a
						href="/p/sitemap"
						class="w-20 flex flex-col items-center justify-center group hover:text-primary-500">
						<div
							class="mb-1 sm:mb-4 w-20 h-20 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
								></path>
							</svg>
						</div>

						<h6
							class="w-full text-xs group-hover:font-medium text-center text-gray-500 group-hover:text-primary-500 capitalize overflow-ellipsis line-clamp-2 tracking-tighter">
							More
						</h6>
					</a>
				</div>
			</div>

			<!-- Desktop(starts from screen size : sm) -->

			<div class="hidden sm:block">
				<div class="grid grid-cols-4 lg:grid-cols-6 gap-4 items-start justify-items-center">
					{#each categories as category, i}
						{#if i < 12}
							{#if category.img}
								<a
									href="{`/category/${category.slug}`}"
									class="w-32 lg:w-36 flex flex-col items-center justify-center group zoom-out">
									<div
										class="mb-4 w-32 h-32 lg:w-36 lg:h-36 rounded-full border-2 border-gray-300 group-hover:border-primary-500 flex-shrink-0 group-hover:shadow-xl overflow-hidden">
										<ImageLoader
											src="{category.img}"
											alt="{category.name}"
											class="w-full h-full object-cover text-xs" />
									</div>

									<h6
										class="w-full text-xs sm:text-base font-medium group-hover:font-semibold text-center text-gray-500 capitalize overflow-ellipsis line-clamp-2">
										{category.name}
									</h6>
								</a>
							{:else}
								<a
									href="/category/{category.slug}"
									class="sm:w-32 lg:w-36 flex flex-col items-center justify-center group hover:text-primary-500">
									<div
										class="relative mb-1 sm:mb-4 sm:w-32 sm:h-32 lg:w-36 lg:h-36 rounded-full  border-2 border-gray-300 group-hover:border-primary-500 flex-shrink-0 group-hover:shadow-xl overflow-hidden bg-no-repeat bg-center bg-cover
									"
										style="background-image: url('/atoz-store.jpg');">
										<div
											class="absolute inset-0 flex items-center justify-center text-center text-5xl text-white font-bold group-hover:font-bold bg-opacity-70
										{categoryColors[i]}">
											{category.name[0]}
										</div>
									</div>

									<h6
										class="w-full text-xs sm:text-base font-medium group-hover:font-semibold text-center text-gray-500 capitalize overflow-ellipsis line-clamp-2">
										{category.name}
									</h6>
								</a>
							{/if}
						{/if}
					{/each}
				</div>

				<div class="mt-5 sm:mt-10 w-full flex justify-center">
					<a href="/p/sitemap" class="link font-medium hover:underline"> View All </a>
				</div>
			</div>
		</div>
	</div>
{/if}
