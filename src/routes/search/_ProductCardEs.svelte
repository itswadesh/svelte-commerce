<style>
.line-clamp-3 {
	overflow: hidden;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 3;
}
</style>

<script>
import ImageLoader from '$lib/components/Image/ImageLoader.svelte'

export let product
</script>

<a
	href="/{product._source.slug}?id={product.id}"
	class="relative rounded-2xl shadow-md hover:shadow-xl transition duration-300 flex flex-col sm:flex-row lg:flex-col xl:flex-row bg-gray-50 hover:bg-gray-100 py-10 px-4">
	{#if product._source.verified}
		<div class="absolute z-10 top-2 left-2 transform -rotate-12">
			<ImageLoader
				src="/verified-badge.png"
				alt="verified badge"
				class="object-contain object-center h-10" />
		</div>
	{/if}

	<div class="mb-2 w-28 h-28 sm:w-36 sm:h-36 rounded-full mx-auto zoom-out">
		{#if product._source.img}
			<ImageLoader
				src="{product._source.img}"
				alt="{product._source.name}"
				class="h-full w-full object-cover border text-xs mx-auto mb-4" />
		{:else}
			<div
				class="h-full w-full flex items-center justify-center bg-gray-200 border text-gray-300 rounded-full mb-4">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-12 w-12"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
					></path>
				</svg>
			</div>
		{/if}
	</div>

	{#if product._source.averageRating || product._source.totalReview}
		<div
			class="absolute top-0 right-0 bg-primary-500 text-white rounded-tr-2xl rounded-bl-2xl px-4 py-1 flex items-center justify-center">
			{#if product._source.averageRating > 0}
				<div class="flex items-center space-x-1">
					<span class="font-bold">
						{product._source.averageRating}
					</span>

					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						viewBox="0 0 20 20"
						fill="currentColor">
						<path
							d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
						></path>
					</svg>
				</div>
			{/if}

			{#if product._source.totalReview > 0}
				<hr class="mx-2 h-4 border-l border-white" />

				<h6 class="text-sm font-light">
					{product._source.totalReview}
					{#if product._source.totalReview === 1}<span>Review</span>{:else}
						<span>Reviews</span>
					{/if}
				</h6>
			{/if}
		</div>
	{/if}

	<div
		class="pl-0 sm:pl-4 lg:pl-0 xl:pl-4 flex-1 w-full flex flex-col first-letter:uppercase rounded-r-xl">
		<h2 class="mb-1 font-bold ">{product._source.name}</h2>

		<p class="text-sm text-gray-500 leading-relaxed line-clamp-3">
			{@html product._source.description}
		</p>

		<!-- {#if product._source.updatedAt}
			<div class="mt-2 text-xs">
				<TimeAgo date="{product._source.updatedAt}" />
			</div>{/if} -->
	</div>
</a>
