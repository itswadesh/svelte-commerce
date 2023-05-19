<script>
// import { LazyImg } from '$lib/components'

export let data = []
// console.log('collections', data)
</script>

{#await data.streamed.collections then collections}
	{#if collections?.count}
		<div class="px-3 py-10 xl:px-10">
			<div class="container mx-auto max-w-6xl">
				<ul class="grid grid-cols-1 md:grid-cols-2 gap-5">
					{#each collections.data as collection}
						<li class="block col-span-1 max-h-max relative">
							<!-- <LazyImg
								src="{collection.img}"
								alt=""
								height="390"
								aspect_ratio="2:1"
								class="h-full w-full object-contain max-h-[390px]" /> -->

							<img
								src="{collection.img}"
								alt=""
								height="390"
								class="h-full w-full object-contain max-h-[390px]" />

							<div class="absolute bg-black bg-opacity-10 inset-0 p-5 flex items-center">
								<div class="flex flex-col gap-0.5">
									<h6 class="text-lg font-bold text-primary-500 uppercase">
										{collection.name}
									</h6>

									<a
										href="/search?q={collection.name}"
										class="block text-sm underline text-zinc-200">
										View {collection.name}
									</a>
								</div>
							</div>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	{/if}
{/await}
