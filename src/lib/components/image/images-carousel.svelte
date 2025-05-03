<script lang="ts">
	import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '$lib/components/ui/carousel'
	import LazyImg from '$lib/core/components/image/lazy-img.svelte'

	let { data = [] }: { data: string[] } = $props()
</script>

<Carousel
	opts={{
		align: 'center',
		loop: true
	}}
	class="mx-auto w-[90%] py-10 sm:w-[80%]"
>
	<CarouselContent class="flex flex-row items-center justify-between">
		{#each data as image}
			<CarouselItem class="flex-shrink-0 flex-grow-0 basis-auto px-2">
				<div
					class="h-[148px] w-[148px] mobiles:h-[176px] mobiles:w-[176px] mobilem:h-[201px] mobilem:w-[201px] mobilel:h-[245px] mobilel:w-[245px] laptop:h-[230px] laptop:w-[230px]"
				>
					{#if image}
						<LazyImg src={image} alt="Image" class="h-full w-full rounded-none object-cover" />
					{:else}
						<div class="flex h-full w-full items-center justify-center rounded-none bg-gray-200 text-gray-500">No Image</div>
					{/if}
				</div>
			</CarouselItem>
		{/each}
	</CarouselContent>
	<div class="absolute left-2 top-1/2 z-30 -translate-y-1/2 translate-x-10 transform">
		<CarouselPrevious class="rounded-full bg-white p-2 text-black shadow-md hover:bg-gray-100" />
	</div>

	<div class="absolute right-2 top-1/2 z-30 -translate-x-10 -translate-y-1/2 transform">
		<CarouselNext class="rounded-full bg-white p-2 text-black shadow-md hover:bg-gray-100" />
	</div>
</Carousel>
