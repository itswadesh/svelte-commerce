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
import LazyImg from '$lib/components/Image/LazyImg.svelte'

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
	'bg-zinc-800'
]
</script>

{#if loading}
	<div class="px-3 py-5 sm:p-10">
		<div class="container mx-auto max-w-6xl">
			<div class="grid grid-cols-4 items-start justify-items-center gap-4 sm:hidden">
				{#each { length: 8 } as _}
					<div class="flex flex-col items-center">
						<div class="mb-1 h-20 w-20 animate-pulse rounded-full bg-zinc-200 sm:mb-4"></div>

						<div class="h-2 w-full animate-pulse rounded-full bg-zinc-200"></div>
					</div>
				{/each}
			</div>

			<div class="hidden grid-cols-4 items-start justify-items-center gap-4 sm:grid lg:grid-cols-6">
				{#each { length: 12 } as _}
					<div class="flex flex-col items-center">
						<div class="mb-4 h-32 w-32 animate-pulse rounded-full bg-zinc-200 lg:h-36 lg:w-36">
						</div>

						<div class="h-4 w-full animate-pulse rounded-full bg-zinc-200"></div>
					</div>
				{/each}
			</div>
		</div>
	</div>
{:else if categories && categories.length}
	<!-- Old version UI -->

	<!-- <div class="px-3 py-5 sm:p-10">
		<div class="container mx-auto max-w-6xl">
			<div class="flex items-center justify-center space-x-2 pb-5 lg:pb-10">
				<hr class="h-1 flex-1 border-zinc-200" />

				<div
					class="flex items-center justify-center p-2 text-center font-semibold uppercase tracking-wider text-primary-500 sm:px-8 sm:text-lg">
					Categories
				</div>

				<hr class="h-1 flex-1 border-zinc-200" />
			</div>

			Mobile(Ends at screen size : sm)

			<div class="grid grid-cols-4 items-start justify-items-center gap-4 sm:hidden">
				{#each categories as category, i}
					{#if i <= 6}
						{#if category.img}
							<a
								href="/{category.slug || '##'}"
								aria-label="Click to view related products of this category"
								class="group flex w-20 flex-col items-center justify-center">
								<div
									class="mb-1 h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-zinc-200 group-hover:border-primary-500 group-hover:shadow-xl sm:mb-4">
									<LazyImg
										src="{category.img}"
										alt="{category.name}"
										width="80"
										height="80"
										class="h-full w-full scale-105 transform object-cover text-xs transition-all duration-300 group-hover:scale-100" />
								</div>

								<h6
									class="w-full overflow-ellipsis text-center text-xs capitalize tracking-tighter text-zinc-500 line-clamp-2 group-hover:font-medium group-hover:text-primary-500">
									{category.name}
								</h6>
							</a>
						{:else}
							<a
								href="/{category.slug || '##'}"
								aria-label="Click to view related products of this category"
								class="group flex w-20 flex-col items-center justify-center">
								<div
									class="relative mb-1 h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-zinc-200 bg-cover bg-center bg-no-repeat group-hover:border-primary-500 group-hover:shadow-xl sm:mb-4
									"
									style="background-image: url('/atoz-store.jpg');">
									<div
										class="absolute inset-0 flex items-center justify-center bg-opacity-70 text-center text-3xl font-bold text-white group-hover:font-bold
										{categoryColors[i]}">
										{category.name[0]}
									</div>
								</div>

								<h6
									class="w-full overflow-ellipsis text-center text-xs capitalize tracking-tighter text-zinc-500 line-clamp-2 group-hover:font-medium group-hover:text-primary-500">
									{category.name}
								</h6>
							</a>
						{/if}
					{/if}
				{/each}

				<div class="sm:hidden">
					<a
						href="/sitemap"
						aria-label="Click to visit sitemap"
						class="group flex w-20 flex-col items-center justify-center hover:text-primary-500">
						<div
							class="mb-1 flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full sm:mb-4">
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
							class="w-full overflow-ellipsis text-center text-xs capitalize tracking-tighter text-zinc-500 line-clamp-2 group-hover:font-medium group-hover:text-primary-500">
							More
						</h6>
					</a>
				</div>
			</div>

			Desktop(starts from screen size : sm)

			<div class="hidden sm:block">
				<div class="grid grid-cols-4 items-start justify-items-center gap-4 lg:grid-cols-6">
					{#each categories as category, i}
						{#if i < 12}
							{#if category.img}
								<a
									href="{`/${category.slug || '##'}`}"
									aria-label="Click to view related products of this category"
									class="zoom-out group flex w-32 flex-col items-center justify-center lg:w-36">
									<div
										class="mb-4 h-32 w-32 shrink-0 overflow-hidden rounded-full border-2 border-zinc-200 group-hover:border-primary-500 group-hover:shadow-xl lg:h-36 lg:w-36">
										<LazyImg
											src="{category.img}"
											alt="{category.name}"
											width="144"
											height="144"
											class="h-full w-full object-cover text-xs" />
									</div>

									<h6
										class="w-full overflow-ellipsis text-center text-xs font-medium capitalize text-zinc-500 line-clamp-2 group-hover:font-semibold sm:text-base">
										{category.name}
									</h6>
								</a>
							{:else}
								<a
									href="/{category.slug || '##'}"
									aria-label="Click to view related products of this category"
									class="group flex flex-col items-center justify-center hover:text-primary-500 sm:w-32 lg:w-36">
									<div
										class="relative mb-1 shrink-0 overflow-hidden rounded-full border-2 border-zinc-200 bg-cover  bg-center bg-no-repeat group-hover:border-primary-500 group-hover:shadow-xl sm:mb-4 sm:h-32 sm:w-32 lg:h-36 lg:w-36
									"
										style="background-image: url('/atoz-store.jpg');">
										<div
											class="absolute inset-0 flex items-center justify-center bg-opacity-70 text-center text-5xl font-bold text-white group-hover:font-bold
										{categoryColors[i]}">
											{category.name[0]}
										</div>
									</div>

									<h6
										class="w-full overflow-ellipsis text-center text-xs font-medium capitalize text-zinc-500 line-clamp-2 group-hover:font-semibold sm:text-base">
										{category.name}
									</h6>
								</a>
							{/if}
						{/if}
					{/each}
				</div>

				<div class="mt-5 flex w-full justify-center sm:mt-10">
					<a
						href="/sitemap"
						aria-label="Click to visit sitemap"
						class="link font-medium hover:underline">
						View All
					</a>
				</div>
			</div>
		</div>
	</div> -->

	<!-- New version UI -->

	<div>
		<h2
			class="p-3 py-5 text-center font-serif text-xl font-medium uppercase tracking-wider sm:px-10 sm:text-2xl md:py-10 md:text-3xl xl:text-4xl">
			TOP COLLECTIONS
		</h2>

		<div class="px-3 sm:px-10">
			<div class="container mx-auto flex flex-wrap items-start gap-5 justify-center">
				{#each categories as category, ix}
					{#if category.img}
						<a
							href="{`/${category.slug || '##'}`}"
							aria-label="Click to view related products of this category"
							class="zoom-out group flex w-24 flex-col items-center justify-center lg:w-28">
							<div
								class="mb-2 h-24 w-24 shrink-0 overflow-hidden rounded-full border group-hover:border-primary-500 group-hover:shadow-xl lg:h-28 lg:w-28">
								<LazyImg
									src="{category.img}"
									alt="{category.name}"
									width="144"
									height="144"
									class="h-full w-full object-cover text-xs" />
							</div>

							<h6
								class="w-full overflow-ellipsis text-center text-xs font-medium capitalize text-zinc-500 line-clamp-2 group-hover:font-semibold sm:text-base">
								{category.name}
							</h6>
						</a>
					{:else}
						<a
							href="/{category.slug || '##'}"
							aria-label="Click to view related products of this category"
							class="group flex flex-col items-center justify-center hover:text-primary-500 sm:w-24 lg:w-28">
							<div
								class="relative mb-2 shrink-0 overflow-hidden rounded-full border bg-cover bg-center bg-no-repeat group-hover:border-primary-500 group-hover:shadow-xl  h-24 w-24 lg:h-28 lg:w-28"
								style="background-image: url('/logo.svg');">
								<div
									class="absolute inset-0 flex items-center justify-center bg-opacity-70 text-center text-5xl font-bold text-white group-hover:font-bold
									{categoryColors[ix >= 12 ? String(ix)[1] : ix]}">
									{category.name[0]}
								</div>
							</div>

							<h6
								class="w-full overflow-ellipsis text-center text-xs font-medium capitalize text-zinc-500 line-clamp-2 group-hover:font-semibold sm:text-base">
								{category.name}
							</h6>
						</a>
					{/if}
				{/each}
			</div>
		</div>
	</div>
{/if}
