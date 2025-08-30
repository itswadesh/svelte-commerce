<script lang="ts">
import { onMount } from 'svelte'
import type { CarouselAPI } from '../ui/carousel/context'
import AutoScroll from 'embla-carousel-auto-scroll'
import EmblaCarousel from 'embla-carousel'
import { page } from '$app/state'

let carouselApi: CarouselAPI | null = $state(null)
let emblaNode: HTMLDivElement | null = $state(null)
const newsTickerPlugin = $derived(page.data?.store?.plugins?.newsTicker)

onMount(() => {
	if (!emblaNode) return console.log('.')
	carouselApi = EmblaCarousel(
		emblaNode,
		{
			axis: 'x',
			loop: true,
			duration: 20, // Faster snap animation
			startIndex: 0,
			align: 'center'
		},
		[AutoScroll({ playOnInit: true })]
	)
})
</script>


{#if newsTickerPlugin?.active}
  <div class="relative w-full">
  	<div bind:this={emblaNode} class="embla flex h-12 w-full gap-4 bg-black text-white">
  		<div class="embla__container">
  			{#each { length: 10 } as _, idx}
  				<div class="embla__slide flex items-center justify-between whitespace-nowrap text-center">
  					<p>{@html newsTickerPlugin.html}</p>
  					<div class="flex flex-grow justify-evenly">
  						<div class="h-[1px] w-[60%] border-[2px] border-b border-gray-300"></div>
  					</div>
  				</div>
  			{/each}
  		</div>
  	</div>
  </div>
{/if}

<style>
	.embla {
		overflow: hidden;
	}
	.embla__container {
		display: flex;
	}
	.embla__slide {
		flex: 0 0 20%;
		min-width: 0;
	}
</style>
