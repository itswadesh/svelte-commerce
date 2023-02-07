<script>
import LazyImg from '$lib/components/Image/LazyImg.svelte'

export let heroBanners
</script>

{#if heroBanners?.length > 0}
	<div>
		<div class="grid grid-cols-1 sm:grid-cols-2">
			<a
				href="{heroBanners[0]?.link || '##'}"
				aria-label="Click here to view the banner's related products"
			>
				<LazyImg
					src="{heroBanners[0]?.img}"
					alt=""
					height="390"
					aspect_ratio="2:1"
					class="col-span-1 h-full w-full object-cover"
				/>
			</a>

			<a
				href="{heroBanners[1]?.link || '##'}"
				aria-label="Click here to view the banner's related products"
			>
				<LazyImg
					src="{heroBanners[1]?.img}"
					alt=""
					height="390"
					aspect_ratio="2:1"
					class="col-span-1 h-full w-full object-cover"
				/>
			</a>
		</div>

		<div class="grid grid-cols-1 sm:grid-cols-2">
			<div class="grid grid-cols-2">
				<a
					href="{heroBanners[2]?.link || '##'}"
					aria-label="Click here to view the banner's related products"
				>
					<LazyImg
						src="{heroBanners[2]?.img}"
						alt=""
						height="390"
						aspect_ratio="1:1"
						class="col-span-1 h-full w-full object-cover"
					/>
				</a>

				<a
					href="{heroBanners[2]?.link || '##'}"
					aria-label="Click here to view the banner's related products"
				>
					<LazyImg
						src="{heroBanners[3]?.img}"
						alt=""
						height="390"
						aspect_ratio="1:1"
						class="col-span-1 h-full w-full object-cover"
					/>
				</a>
			</div>

			<div>
				<a
					href="{heroBanners[4]?.link || '##'}"
					aria-label="Click here to view the banner's related products"
				>
					<LazyImg
						src="{heroBanners[4]?.img}"
						alt=""
						height="390"
						aspect_ratio="2:1"
						class="col-span-1 h-full w-full object-cover"
					/>
				</a>
			</div>
		</div>
	</div>
{/if}
