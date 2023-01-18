<script>
import LazyImg from '$lib/components/Image/LazyImg.svelte'
import ProductCard from '$lib/ProductCard.svelte'
import { onMount } from 'svelte'

export let deal

// let Carousel
// onMount(async () => {
// 	const RTEmodule = await import('$lib/components/TwECarousel.svelte')
// 	Carousel = RTEmodule.default
// })
</script>

{#if deal}
	<div class="flex w-[98vw] items-start justify-start gap-3 overflow-x-auto">
		{#if deal.img}
			<div class="flex-shrink-0">
				<LazyImg
					src="{deal.img}"
					alt="{deal.name}"
					height="380"
					class="h-[380px] w-auto object-contain object-center text-xs" />
			</div>
		{/if}

		<!-- <svelte:component this="{Carousel}">
			{#each deal.products as p, px}
				<div class="carousel-item relative float-left h-auto w-full {px == 0 ? 'active' : ''}">
					{#if p}
						<li>
							<ProductCard product="{p}" />
						</li>
					{/if}
				</div>
			{/each}
		</svelte:component> -->

		<ul class="flex w-full list-none items-start gap-2">
			{#each deal.products as p, px}
				{#if p}
					<li>
						<ProductCard product="{p}" />
					</li>
				{/if}
			{/each}
		</ul>
	</div>
{/if}
