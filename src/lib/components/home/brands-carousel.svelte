<script lang="ts">
	import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '$lib/components/ui/carousel'
	import LazyImg from '$lib/core/components/image/lazy-img.svelte'

	let { data = [] }: { data: string[] } = $props()
</script>

<Carousel
	opts={{
		align: 'center',
		loop: true,
		dragFree: true
	}}
	class="mx-auto w-full py-10 sm:w-[90%] laptop:w-[80%]"
>
	<CarouselContent class="-ml-1">
		{#each data as image}
			<CarouselItem class="md:basis-1/5">
				<div class="h-[74px] w-[186px]">
					{#if image}
						<LazyImg src={image} alt="Featured brand partner logo" class="h-full w-full rounded-none object-cover" />
					{:else}
						<div class="flex h-full w-full items-center justify-center rounded-none bg-muted text-muted-foreground">No Image</div>
					{/if}
				</div>
			</CarouselItem>
		{/each}
	</CarouselContent>
	<CarouselPrevious class="absolute left-0 top-1/2 z-30 m-[5px] h-10 w-10 -translate-y-1/2 transform bg-card text-foreground sm:-left-4" />
	<CarouselNext class="absolute right-0 top-1/2 z-30 m-[5px] h-10 w-10 -translate-y-1/2 transform bg-card text-foreground sm:-right-4" />
</Carousel>
