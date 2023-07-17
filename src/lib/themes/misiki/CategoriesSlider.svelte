<script>
import { LazyImg } from '$lib/components'
import { onMount } from 'svelte'
import { SplideSlide } from '@splidejs/svelte-splide'

export let categories = []
export let title = ''

$: innerWidth = 0
let responsiveWidth = 0
$: if (innerWidth >= 640) {
	responsiveWidth = innerWidth - 17
}
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

let Splide

onMount(async () => {
	const SplideModule = await import('$lib/components/SplideJs.svelte')
	Splide = SplideModule.default
})
</script>

<svelte:window bind:innerWidth="{innerWidth}" />

{#if categories}
	<div>
		<h2 class="p-3 py-5 text-center uppercase sm:px-10 md:py-10">
			{title}
		</h2>

		<svelte:component
			this="{Splide}"
			options="{{
				// autoplay: true,
				autoWidth: true,
				gap: '12px',
				lazyLoad: true,
				padding: '40px',
				pagination: false,
				perMove: 1,
				// type: 'loop',
				width: responsiveWidth || '100%'
			}}">
			{#each categories as category, ix}
				<SplideSlide>
					{#if category.img}
						<a
							href="{category.link || `/${category.slug}` || '##'}"
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

							<p
								class="w-full overflow-ellipsis text-center group-hover:text-zinc-500 capitalize line-clamp-2">
								{category.name}
							</p>
						</a>
					{:else}
						<a
							href="/{category.slug || '##'}"
							aria-label="Click to view related products of this category"
							class="group flex flex-col items-center justify-center hover:text-primary-500 sm:w-24 lg:w-28">
							<div
								class="relative mb-2 shrink-0 overflow-hidden rounded-full border bg-cover bg-center bg-no-repeat group-hover:border-primary-500 group-hover:shadow-xl h-24 w-24 lg:h-28 lg:w-28"
								style="background-image: url('/logo.svg');">
								<div
									class="absolute inset-0 flex items-center justify-center bg-opacity-70 text-center text-5xl font-bold text-white group-hover:font-bold
									{categoryColors[ix >= 12 ? String(ix)[1] : ix]}">
									{category.name[0]}
								</div>
							</div>

							<p
								class="w-full overflow-ellipsis text-center group-hover:text-zinc-500 capitalize line-clamp-2">
								{category.name}
							</p>
						</a>
					{/if}
				</SplideSlide>
			{/each}
		</svelte:component>
	</div>
{/if}
