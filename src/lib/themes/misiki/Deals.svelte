<script>
import { DealCountdown, ProductCard } from '$lib/components'
import * as Carousel from '$lib/shad-components/ui/carousel/index'

export let deals = []

$: innerWidth = 0
let responsiveWidth = 0
$: if (innerWidth >= 640) {
	responsiveWidth = innerWidth - 17
}
</script>

<svelte:window bind:innerWidth />

{#if deals.length}
	<ul class="mb-5 sm:mb-10 p-0 list-none flex flex-col gap-5 sm:gap-10">
		{#each deals as deal}
			{#if deal && deal.products?.length}
				<li>
					<header
						class="p-3 py-5 sm:px-10 md:py-10 flex flex-col items-center justify-center text-center gap-5">
						<h2 class="uppercase">
							{deal.name}
						</h2>

						<DealCountdown startTimeISO="{deal.startTimeISO}" endTimeISO="{deal.endTimeISO}" />
					</header>

					<div class="hidden sm:block">
						<Carousel.Root
							opts="{{
								align: 'start',
								loop: true
							}}">
							<Carousel.Content class="-ml-5">
								{#each deal.products as p}
									{#if p}
										<Carousel.Item class="basis-auto">
											<div class="relative w-full">
												<ProductCard product="{p}" />
											</div>
										</Carousel.Item>
									{/if}
								{/each}
							</Carousel.Content>
							<Carousel.Previous />
							<Carousel.Next />
						</Carousel.Root>
					</div>

					<div
						class="flex w-[98vw] items-start justify-start gap-3 overflow-x-auto sm:hidden scrollbar-none">
						<ul class="flex w-full list-none items-start gap-2">
							{#each deal.products as p, px}
								{#if p}
									<li class="w-[210px] shrink-0">
										<ProductCard product="{p}" />
									</li>
								{/if}
							{/each}
						</ul>
					</div>
				</li>
			{/if}
		{/each}
	</ul>
{/if}
