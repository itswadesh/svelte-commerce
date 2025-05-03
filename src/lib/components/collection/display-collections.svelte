<script lang="ts">
	import LazyImg from '$lib/core/components/image/lazy-img.svelte'
	let { cards } = $props()
</script>

<div class="container mx-auto w-full px-4 py-8 laptop:w-[80%]">
	<div class="grid w-full grid-cols-1 gap-6 mobiles:grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-2 laptopl:grid-cols-3">
		<!-- Loop through the cards data to create each card -->
		{#each cards as card (card.title)}
			<div
				class="card relative mx-auto flex w-full flex-col rounded-lg text-center mobiles:h-[623px] mobiles:w-[355px] tablet:h-[650px] tablet:w-[372px] laptop:h-[789px] laptop:w-[489px] laptopl:h-[642px] laptopl:w-[370px]"
			>
				<div
					class="image-container relative mx-auto h-[356px] w-full overflow-hidden mobiles:h-[422px] mobiles:w-[355px] tablet:h-[442px] tablet:w-[372px] laptop:h-[581px] laptop:w-[489px] laptopl:h-[440px] laptopl:w-[370px]"
				>
					{#if card.src}
						<!-- Lazy-loaded image with higher resolution and srcset support for responsiveness -->
						<LazyImg
							src={card.src}
							alt={card.title}
							width="370"
							height="440"
							class="h-full w-full transform object-cover transition-transform duration-300"
						/>
					{:else}
						<!-- Fallback div when no image is provided -->
						<div class="flex h-full w-full items-center justify-center bg-gray-200 text-gray-500">No Image Available</div>
					{/if}
				</div>
				<div class="content mt-2 flex flex-grow flex-col px-4 text-center">
					<h3 class="mb-2 text-[20px] text-black dark:text-gray-100">
						<a href={card.link} class="hover:text-gray-600 dark:hover:text-gray-300">{card.title}</a>
					</h3>
					<p class="mb-4 flex-grow text-[12px] text-gray-700 dark:text-gray-300">{card.description}</p>
					<div class="mt-auto">
						<a href={card.link} class="inline-block">
							<button
								class="w-[180px] border border-black bg-black px-[15px] py-[10px] text-[14px] font-semibold uppercase text-white transition-colors duration-300 hover:bg-white hover:text-black"
							>
								SHOP NOW
							</button>
						</a>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>
