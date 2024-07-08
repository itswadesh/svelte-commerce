<script>
import { LazyImg } from '$lib/components'
import { navigateToProperPath } from '$lib/utils'
import * as Carousel from '$lib/shad-components/ui/carousel/index'

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
</script>

<svelte:window bind:innerWidth />

{#if categories}
	<div>
		<h2
			class="p-3 py-5 sm:px-10 md:py-10 text-center uppercase text-xl font-medium tracking-wider sm:text-2xl md:text-2xl">
			{title}
		</h2>

		<Carousel.Root
			opts="{{
				align: 'start',
				loop: true
			}}"
			class="relative">
			<Carousel.Content class="mx-10 max-[800px]:mx-0">
				{#each categories as category, ix}
					<Carousel.Item class="pl-5 basis-auto max-[800px]:basis-1/5">
						<div class="relative">
							{#if category.img}
								<a
									href="{navigateToProperPath(category.link || category.slug)}"
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
										style="background-image: url('/logo.png');">
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
						</div>
					</Carousel.Item>
				{/each}
			</Carousel.Content>
			<Carousel.Previous />
			<Carousel.Next />
		</Carousel.Root>
	</div>
{/if}
