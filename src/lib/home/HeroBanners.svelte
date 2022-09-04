<script>
import LazyImg from '$lib/components/Image/LazyImg.svelte'

export let heroBanners
</script>

{#if heroBanners?.length > 0}
	<div>
		<div class="grid grid-cols-1 sm:grid-cols-2">
			<a
				href="{heroBanners[0]?.link || '/'}"
				aria-label="Click here to view the banner's related products">
				<LazyImg
					src="{heroBanners[0]?.imgCdn}"
					alt=""
					width="760"
					height="390"
					class="col-span-1 h-full w-full" />
			</a>

			<a
				href="{heroBanners[1]?.link || '/'}"
				aria-label="Click here to view the banner's related products">
				<LazyImg
					src="{heroBanners[1]?.imgCdn}"
					alt=""
					width="760"
					height="390"
					class="col-span-1 h-full w-full" />
			</a>
		</div>

		<div class="grid grid-cols-1 sm:grid-cols-2">
			<div class="grid grid-cols-2">
				<a
					href="{heroBanners[2]?.link || '/'}"
					aria-label="Click here to view the banner's related products">
					<LazyImg
						src="{heroBanners[2]?.imgCdn}"
						alt=""
						width="370"
						height="390"
						class="col-span-1 h-full w-full" />
				</a>

				<a
					href="{heroBanners[2]?.link || '/'}"
					aria-label="Click here to view the banner's related products">
					<LazyImg
						src="{heroBanners[3]?.imgCdn}"
						alt=""
						width="370"
						height="390"
						class="col-span-1 h-full w-full" />
				</a>
			</div>

			<div>
				<a
					href="{heroBanners[4]?.link || '/'}"
					aria-label="Click here to view the banner's related products">
					<LazyImg
						src="{heroBanners[4]?.imgCdn}"
						alt=""
						width="760"
						height="390"
						class="col-span-1 h-full w-full" />
				</a>
			</div>
		</div>
	</div>
{/if}
