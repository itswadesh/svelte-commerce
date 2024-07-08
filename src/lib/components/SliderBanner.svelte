<style>
.frosted-black {
	backdrop-filter: blur(5px);
	background-color: hsla(0, 0%, 0%, 0.8);
}
.frosted-blur {
	backdrop-filter: blur(12px);
}
</style>

<script lang="ts">
import { createEventDispatcher } from 'svelte'
import { fly } from 'svelte/transition'
import { Gallery, LazyImg, RatingStarDisplayBig } from '$lib/components'
import { navigateToProperPath } from '$lib/utils'
import dayjs from 'dayjs'
import seamlessBusinessPatternBackground from '$lib/assets/seamless-business-pattern-background.png'
import * as Carousel from '$lib/shad-components/ui/carousel/index'

const dispatch = createEventDispatcher()

export let breadCrumb
export let data: any = { banners: [] }
export let isClaimed = false
export let needClaim = false
export let rating
export let ratingCount
export let reviewCount
export let showBookButton = false
export let showFlight = false
export let showGallery = false
export let showOneBanner = false

let selectedImg
let showPhotosModal = false

if (!data.banners.length) data.banners = ['/icon.png']
$: if (data?.banners[0].img) {
	selectedImg = data?.banners[0].img
} else if (data?.banners[0]) {
	selectedImg = data?.banners[0]
}
</script>

<div
	class="relative z-0 h-96 max-h-max w-full bg-cover bg-center"
	style="background-image: url({seamlessBusinessPatternBackground})">
	{#if data?.banners?.length > 1}
		<Carousel.Root
			opts="{{
				align: 'start',
				loop: true
			}}">
			<Carousel.Content class="-ml-5">
				{#each data?.banners as b}
					{#if b}
						<Carousel.Item class="basis-auto">
							<div class="relative w-full">
								<LazyImg
									src="{b}"
									alt=" "
									height="384"
									width="384"
									class="h-96 w-full object-cover object-center" />
							</div>
						</Carousel.Item>
					{/if}
				{/each}
			</Carousel.Content>
			<Carousel.Previous />
			<Carousel.Next />
		</Carousel.Root>
		<!-- <svelte:component
			this="{Splide}"
			options="{{
				lazyLoad: true,
				pagination: false,
				perMove: 1,
				perPage: 4,
				rewind: true,
				arrows: false,
				breakpoints: {
					1536: {
						arrows: false,
						perMove: 1,
						perPage: 3
					},
					1024: {
						arrows: false,
						perMove: 1,
						perPage: 2
					},
					768: {
						arrows: false,
						perMove: 1,
						perPage: 1
					}
				}
			}}">
		</svelte:component> -->
	{:else if data?.banners?.length == 1}
		<LazyImg
			src="{data?.banners[0]}"
			alt=" "
			height="384"
			width="1536"
			aspect_ratio="4:1"
			class="h-96 w-full object-cover object-center" />
	{/if}

	<div class="absolute inset-0 z-10 flex items-end bg-gradient-to-t from-black p-3 py-5 sm:p-10">
		<div class="container mx-auto flex h-full max-h-max max-w-6xl flex-col justify-between gap-5">
			{#if breadCrumb && breadCrumb.length}
				<div
					class="flex items-center gap-1 overflow-x-auto whitespace-nowrap text-sm font-medium text-white scrollbar-none">
					<a href="/" class="cursor-pointer hover:underline">Home</a>

					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-4 w-4"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"></path>
					</svg>

					{#each breadCrumb as bc, ix}
						{#if ix < breadCrumb.length - 1}
							<a
								href="{navigateToProperPath(bc.link || bc.slug)}"
								class="cursor-pointer hover:underline">{bc.name}</a>
						{:else}
							<span class="text-primary-500">{bc.name}</span>
						{/if}

						{#if ix < breadCrumb.length - 1}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-4 w-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"></path>
							</svg>
						{/if}
					{/each}
				</div>
			{/if}

			<div class="mt-auto flex flex-wrap items-start justify-between gap-4 md:items-end sm:gap-10">
				<div class="flex flex-col sm:flex-row gap-4 tracking-wide text-white sm:gap-10">
					<!-- Business banner -->

					{#if data.img}
						<div class="flex-shrink-0">
							<LazyImg
								src="{data.img}"
								alt="profile"
								height="64"
								width="64"
								class="h-16 w-16 rounded-full border border-gray-300 bg-white object-cover shadow-md sm:h-24 sm:w-24" />
						</div>
					{/if}

					<div class="flex-1 flex flex-col gap-2">
						<!-- Business name-->

						{#if data.businessName}
							<h1 class="text-xl font-bold sm:text-2xl md:text-4xl lg:text-5xl">
								{data.businessName}
							</h1>
						{/if}

						<!-- Business address-->

						{#if data.address?.address || data.address?.landmark || data.address?.city || data.address?.country || data.address?.zip}
							<div class="flex items-start gap-2 text-sm text-gray-100">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									class="w-5 h-5">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"></path>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
									></path>
								</svg>

								<p class="flex-1">
									{#if data.address?.address}
										<span>{data.address?.address}</span>
									{/if}

									{#if data.address?.landmark}
										<span>, {data.address?.landmark}</span>
									{/if}

									{#if data.address?.city}
										<span>, {data.address?.city}</span>
									{/if}

									{#if data.address?.country}
										<span>, {data.address?.country}</span>
									{/if}

									<br />

									{#if data.address?.zip}
										<span> {data.address?.zip}</span>
									{/if}
								</p>
							</div>
						{/if}

						<!-- Business phone-->

						<!-- {#if data.phone}
							<div class="flex items-start gap-2 text-sm text-gray-100">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									class="w-5 h-5">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
									></path>
								</svg>

								<p class="flex-1">
									{#if data.phone}
										{data.phone}
									{/if}

									{#if data.phone2}
										, {data.phone2}
									{/if}

									{#if data.phone3}
										, {data.phone3}
									{/if}
								</p>
							</div>
						{/if} -->

						<!-- Business email-->

						<!-- {#if data.email}
							<div class="flex items-start gap-2 text-sm text-gray-100">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									class="w-5 h-5">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
									></path>
								</svg>

								<p class="flex-1">
									{data.email}
								</p>
							</div>
						{/if} -->

						<div class="flex flex-col gap-2">
							<RatingStarDisplayBig textWhite biggerSize {rating} {ratingCount} {reviewCount} />

							{#if needClaim}
								<div class="text-sm font-semibold">
									{#if isClaimed}
										<div class="flex items-center gap-1 text-green-500">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												class="h-5 w-5"
												viewBox="0 0 20 20"
												fill="currentColor">
												<path
													fill-rule="evenodd"
													d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
													clip-rule="evenodd"></path>
											</svg>

											<span>Claimed</span>
										</div>
									{:else}
										<button
											type="button"
											class="flex items-centeter gap-1 hover:underline focus:outline-none"
											on:click="{() => dispatch('scrollToClaim')}">
											<span> Claim the business </span>

											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												stroke-width="1.5"
												stroke="currentColor"
												class="w-6 h-6">
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"></path>
											</svg>
										</button>
									{/if}
								</div>
							{/if}
						</div>
					</div>
				</div>

				{#if data?.banners?.length || showBookButton}
					<div class="flex items-center flex-wrap gap-2">
						{#if data?.banners?.length}
							<button
								type="button"
								class="whitespace-nowrap rounded-md border-2 border-white py-2 px-4 font-semibold tracking-wide text-white transition duration-700 hover:border-green-500 hover:text-green-500 focus:outline-none sm:py-3 sm:px-6"
								on:click="{() => (showPhotosModal = true)}">
								See {#if data?.banners?.length > 1}
									Photos
								{:else}
									Photo
								{/if}
							</button>
						{/if}

						{#if showBookButton}
							<button
								type="button"
								class="whitespace-nowrap rounded-md border-2 border-white py-2 px-4 font-semibold tracking-wide text-white transition duration-700 hover:border-green-500 hover:text-green-500 focus:outline-none sm:py-3 sm:px-6"
								on:click="{() => dispatch('book')}">
								Book
							</button>
						{/if}
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>

<Gallery bind:showPhotosModal images="{data.banners}" title="{data?.businessName}" />

<!-- {#if showPhotosModal}
	<div
		class="frosted-black fixed inset-0 z-[60] flex h-screen w-screen items-center justify-center overflow-hidden py-10 px-5 text-gray-800 sm:p-10 lg:p-20"
		transition:fly="{{ y: -800, duration: 700 }}">
		<button
			type="button"
			class="fixed top-2 right-2 transform cursor-pointer text-gray-200 transition duration-300 hover:scale-125 hover:text-white focus:outline-none lg:top-5 lg:right-5"
			on:click="{() => (showPhotosModal = false)}">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-5 w-5"
				viewBox="0 0 20 20"
				fill="currentColor">
				<path
					fill-rule="evenodd"
					d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
					clip-rule="evenodd"></path>
			</svg>
		</button>

		<div
			class="container relative mx-auto flex h-full w-full flex-col items-center justify-between gap-4 overflow-hidden rounded-md bg-black lg:flex-row">
			{#if selectedImg}
				<div
					class="flex h-full w-full flex-1 items-center justify-center overflow-hidden px-5 sm:px-10">
					<LazyImg src="{selectedImg}" alt=" " class="h-full w-full object-contain object-center" />
				</div>
			{/if}

			<div class="w-full flex-shrink-0 bg-white py-5 lg:h-full lg:w-auto">
				<div class="mb-2 px-5">
					<h1 class="mb-1 font-bold sm:text-lg">Photos for {data.name}</h1>

					<p class="text-sm">{data?.banners?.length} photos available</p>
				</div>

				<div
					class="grid max-h-40 grid-cols-2 gap-2 overflow-y-auto overflow-x-hidden px-5 scrollbar-thin scrollbar-thumb-slate-300 md:grid-cols-3 lg:max-h-[60vh] lg:grid-cols-2">
					{#each data?.banners as img}
						{#if img?.img}
							<button
								type="button"
								class="relative z-0 col-span-1 focus:outline-none"
								on:click="{() => (selectedImg = img?.img)}">
								<LazyImg
									src="{img?.img}"
									alt=""
									class="h-20 w-full rounded-md object-cover object-center sm:h-24" />

								<div
									class="absolute inset-0 z-10 h-full w-full bg-white
                                        {selectedImg === img?.img
										? 'bg-opacity-0'
										: 'bg-opacity-50'}">
								</div>
							</button>
						{:else if img}
							<button
								type="button"
								class="relative z-0 col-span-1 focus:outline-none"
								on:click="{() => (selectedImg = img)}">
								<LazyImg
									src="{img}"
									alt=""
									class="h-20 w-full rounded-md object-cover object-center sm:h-24" />

								<div
									class="absolute inset-0 z-10 h-full w-full bg-white
                                        {selectedImg === img ? 'bg-opacity-0' : 'bg-opacity-50'}">
								</div>
							</button>
						{/if}
					{/each}
				</div>
			</div>
		</div>
	</div>
{/if} -->
