<script>
// import { LazyImg } from '$lib/components'

export let heroBanners
// console.log('heroBanners', heroBanners)
</script>

{#if heroBanners?.length}
	<div class="px-3 py-10 xl:px-10">
		<div class="container mx-auto max-w-6xl">
			<!-- Section 1 -->

			<div class="grid grid-cols-1 md:grid-cols-4 gap-5">
				<!-- Section 2 -->

				<div class="col-span-1 md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-5">
					<!-- Banner 0 -->

					<a
						href="{heroBanners[0]?.link || '##'}"
						aria-label="Click here to view the banner's related products"
						class="block col-span-1">
						<!-- <LazyImg
							src="{heroBanners[0]?.img}"
							alt=""
							aspect_ratio="1:1"
							height="390"
							width="390"
							class="h-full w-full object-cover" /> -->

						<img
							src="{heroBanners[0]?.img}"
							alt=""
							height="390"
							width="390"
							class="h-full w-full object-cover" />
					</a>

					<!-- Banner 1 -->

					<a
						href="{heroBanners[1]?.link || '##'}"
						aria-label="Click here to view the banner's related products"
						class="block col-span-1">
						<!-- <LazyImg
							src="{heroBanners[1]?.img}"
							alt=""
							aspect_ratio="1:1"
							height="390"
							width="390"
							class="h-full w-full object-cover" /> -->

						<img
							src="{heroBanners[1]?.img}"
							alt=""
							height="390"
							width="390"
							class="h-full w-full object-cover" />
					</a>

					<!-- Banner 2 -->

					<a
						href="{heroBanners[2]?.link || '##'}"
						aria-label="Click here to view the banner's related products"
						class="block col-span-1">
						<!-- <LazyImg
							src="{heroBanners[2]?.img}"
							alt=""
							aspect_ratio="1:1"
							height="390"
							width="390"
							class="h-full w-full object-cover" /> -->

						<img
							src="{heroBanners[2]?.img}"
							alt=""
							height="390"
							width="390"
							class="h-full w-full object-cover" />
					</a>

					<!-- Banner 3 -->

					<a
						href="{heroBanners[3]?.link || '##'}"
						aria-label="Click here to view the banner's related products"
						class="block col-span-1">
						<!-- <LazyImg
							src="{heroBanners[3]?.img}"
							alt=""
							aspect_ratio="1:1"
							height="390"
							width="390"
							class="h-full w-full object-cover" /> -->

						<img
							src="{heroBanners[3]?.img}"
							alt=""
							height="390"
							width="390"
							class="h-full w-full object-cover" />
					</a>

					<!-- Banner 4 -->

					<a
						href="{heroBanners[4]?.link || '##'}"
						aria-label="Click here to view the banner's related products"
						class="block col-span-1 md:col-span-2">
						<!-- <LazyImg
							src="{heroBanners[4]?.img}"
							alt=""
							aspect_ratio="2:1"
							height="390"
							width="780"
							class="h-full w-full object-cover" /> -->

						<img
							src="{heroBanners[4]?.img}"
							alt=""
							height="390"
							width="780"
							class="h-full w-full object-cover" />
					</a>
				</div>

				<!-- Section 3 -->

				<!-- Banner 5 -->

				<a
					href="{heroBanners[5]?.link || '##'}"
					aria-label="Click here to view the banner's related products"
					class="block col-span-1">
					<!-- <LazyImg
						src="{heroBanners[5]?.img}"
						alt=""
						aspect_ratio="1:2"
						width="390"
						height="780"
						class="h-full w-full object-cover" /> -->

					<img
						src="{heroBanners[5]?.img}"
						alt=""
						width="390"
						height="780"
						class="h-full w-full object-cover" />
				</a>
			</div>
		</div>
	</div>
{/if}
