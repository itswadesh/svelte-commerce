<script>
import { LazyImg, ProductCard } from '$lib/components'
import { onMount } from 'svelte'
import { SplideSlide } from '@splidejs/svelte-splide'

export let deal

let Carousel, Splide

$: innerWidth = 0
$: widthOfSlider = innerWidth - 410
$: if (deal.img) {
	widthOfSlider = innerWidth
}

onMount(async () => {
	const SplideModule = await import('$lib/components/SplideJs.svelte')
	Splide = SplideModule.default
})
</script>

<svelte:window bind:innerWidth="{innerWidth}" />

{#if deal}
	<div
		class="hidden items-start justify-start gap-3 sm:flex w-[99vw] overflow-hidden"
		class:px-10="{!deal.img}">
		{#if deal.img}
			<div class="shrink-0">
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
					autoWidth: true,
					gap: '12px',
					height: '100%',
					pagination: false,
					perMove: 1,
					width: widthOfSlider
				}}">
				{#each deal.products as p}
					{#if p}
						<SplideSlide>
							<ProductCard product="{p}" />
						</SplideSlide>
					{/if}
				{/each}
			</svelte:component>
		</div>
	</div>

	<div class="flex w-[98vw] items-start justify-start gap-3 overflow-x-auto sm:hidden">
		{#if deal.img}
			<div class="shrink-0">
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
