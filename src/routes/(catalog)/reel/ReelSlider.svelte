<script>
import { onMount } from 'svelte'
import { SplideSlide } from '@splidejs/svelte-splide'
import LazyImg from '$lib/components/Image/LazyImg.svelte'

export let products = []
export let title = ''

$: innerWidth = 0
let responsiveWidth = 0
$: if (innerWidth >= 640) {
	responsiveWidth = innerWidth - 17
}
let productColors = [
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

let Splide
const options = {
	pagination: false,
	arrows: false,
	autoplay: true,
	lazy: true,
	height: 800,
	type: 'loop',
	perPage: 1,
	direction: 'ttb'
}
onMount(async () => {
	const SplideModule = await import('$lib/components/SplideJs.svelte')
	Splide = SplideModule.default
	const isMobile = window.innerWidth < 768 // set your preferred breakpoint here

	options.arrows = !isMobile
})
</script>

<svelte:window bind:innerWidth="{innerWidth}" />

{#if products}
	<div class="overflow-hidden">
		<svelte:component this="{Splide}" options="{options}">
			{#each products as product, ix}
				<SplideSlide>
					<div class="">
						<h6
							class="w-full overflow-ellipsis text-center text-xs font-medium capitalize text-zinc-500 line-clamp-2 group-hover:font-semibold sm:text-base">
							{product.name}
						</h6>
						<video autoplay="{true}" loop muted="{true}" id="active{ix}" class="detail">
							<source src="{product.img}" type="video/mp4" />
						</video>
					</div>
				</SplideSlide>
			{/each}
		</svelte:component>
	</div>
{/if}
