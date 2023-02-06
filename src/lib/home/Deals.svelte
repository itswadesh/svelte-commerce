<script>
import { onMount } from 'svelte'
import { SplideSlide } from '@splidejs/svelte-splide'
import LazyImg from '$lib/components/Image/LazyImg.svelte'
import ProductCard from '$lib/ProductCard.svelte'

export let deal

$: innerWidth = 0
let Carousel, Splide

onMount(async () => {
	// const RTEmodule = await import('$lib/components/TwECarousel.svelte')
	// Carousel = RTEmodule.default

	const SplideModule = await import('$lib/components/SplideJs.svelte')
	Splide = SplideModule.default
})
</script>

<svelte:window bind:innerWidth="{innerWidth}" />

{#if deal}
	<div class="hidden items-start justify-start gap-3 lg:flex">
		{#if deal.img}
			<div class="flex-shrink-0">
				<LazyImg
					src="{deal.img}"
					alt="{deal.name}"
					height="380"
					width="380"
					class="h-[380px] w-[380px] object-contain object-center text-xs" />
			</div>
		{/if}

		<div class="w-full flex-1">
			<svelte:component
				this="{Splide}"
				options="{{
					type: 'loop',
					rewind: true,
					perMove: 1,
					keyboard: true,
					gap: '12px',
					pagination: false,
					autoWidth: true,
					width: innerWidth - 410,
					height: '100%'
				}}">
				{#each deal.products as p, ix}
					{#if p}
						<SplideSlide>
							<ProductCard product="{p}" />
						</SplideSlide>
					{/if}
				{/each}
			</svelte:component>
		</div>
	</div>

	<div class="flex w-[98vw] items-start justify-start gap-3 overflow-x-auto lg:hidden">
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
