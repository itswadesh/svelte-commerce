<style>
.h-rem {
	height: 50vh;
}
</style>

<script>
import { dateOnly } from '$lib/utils'
import { DummyProductCard, Pagination, LazyImg, ProductCard } from '$lib/components'
import { RatingStarDisplay } from '$lib/ui'
import PrimaryButton from '$lib/ui/PrimaryButton.svelte'
import SEO from '$lib/components/SEO/index.svelte'

export let data
// console.log('zzzzzzzzzzzzzzzzzz', data)

const seoProps = {
	title: 'Vendor Profile',
	metaDescription: 'Vendor Profile'
}
</script>

<SEO {...seoProps} />

<section class="min-h-screen">
	<div class="h-rem relative mb-4 w-full sm:mb-10">
		<!-- Background banner -->

		<div class="absolute inset-0 h-full w-full bg-white">
			{#if data.vendor?.banners[0]}
				<LazyImg
					src="{data.vendor?.banners[0]}"
					alt=" "
					class="h-full w-full object-cover object-center" />
			{:else}
				<div
					class="h-full w-full bg-zinc-200 text-white text-xl flex flex-col gap-1 items-center justify-center text-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="w-10 h-10">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
						></path>
					</svg>

					<span> No Banner Found</span>
				</div>
			{/if}
		</div>

		<div class="absolute inset-0 flex h-full w-full flex-col justify-center bg-black bg-opacity-75">
			<div class="container mx-auto max-w-6xl p-3 py-5 sm:p-10">
				<div class="flex flex-col items-start gap-4 sm:flex-row sm:gap-10">
					<div class="max-h-max max-w-max rounded border-4">
						<!-- avatar -->

						{#if data.vendor?.user?.avatar}
							<LazyImg
								src="{data.vendor?.user?.avatar}"
								alt=" "
								class="h-28 w-28 object-cover object-center sm:h-40 sm:w-40" />
						{:else}
							<LazyImg
								src="/user-empty-profile.png"
								alt=" "
								class="h-28 w-28 object-cover object-center sm:h-40 sm:w-40" />
						{/if}
					</div>

					<div class="flex flex-col items-start gap-2 text-white sm:gap-4">
						<div class="flex flex-wrap items-end gap-2 sm:gap-4">
							<!-- Business name -->

							<h2 class="text-xl font-semibold sm:text-2xl lg:text-4xl">
								{data.vendor?.businessName}
							</h2>

							<!-- Verified -->

							{#if data.vendor?.verified}
								<div class="flex items-end font-semibold text-green-500">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-10 w-10 -rotate-6"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										stroke-width="3">
										<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path>
									</svg>

									<span class="-ml-2 text-lg leading-relaxed">erified</span>
								</div>
							{/if}
						</div>

						<RatingStarDisplay
							rating="{data.vendor?.ratings}"
							ratingCount="{data.vendor?.ratings}"
							reviewCount="{data.vendor?.reviews}"
							textWhite />

						{#if data.vendor?.address?.address || data.vendor?.address?.locality || data.vendor?.address?.city || data.vendor?.address?.state || data.vendor?.address?.country || data.vendor?.address?.zip}
							<div class="flex items-start gap-2 text-sm text-gray-200">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-5 w-5"
									viewBox="0 0 20 20"
									fill="currentColor">
									<path
										fill-rule="evenodd"
										d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
										clip-rule="evenodd"></path>
								</svg>

								<div class="flex-1">
									{#if data.vendor?.address.address}
										<span>
											{data.vendor?.address.address}
										</span>
									{/if}
									{#if data.vendor?.address.locality}
										<span>
											, {data.vendor?.address.locality}
										</span>
									{/if}
									{#if data.vendor?.address.city}
										<span>
											, {data.vendor?.address.city}
										</span>
									{/if}
									{#if data.vendor?.address.state}
										<span>
											, {data.vendor?.address.state}
										</span>
									{/if}
									{#if data.vendor?.address.country}
										<span>
											, {data.vendor?.address.country}
										</span>
									{/if}
									{#if data.vendor?.address.zip}
										<span>
											, {data.vendor?.address.zip}
										</span>
									{/if}
								</div>
							</div>
						{/if}

						<!-- Get Direction -->

						{#if data.vendor?.address?.lat && data.vendor?.address?.lng}
							<a
								href="https://www.google.com/maps/dir/?api=1&destination={data.vendor?.address
									?.lat},{data.vendor?.address?.lng}"
								target="_blank"
								rel="noopener noreferrer">
								<PrimaryButton class="px-4 text-xs font-normal leading-4">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-4 w-4"
										viewBox="0 0 20 20"
										fill="currentColor">
										<path
											fill-rule="evenodd"
											d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
											clip-rule="evenodd"></path>
									</svg>

									<span>Get Direction</span>
								</PrimaryButton>
							</a>
						{/if}

						<!-- Email -->

						{#if data.vendor?.email}
							<div class="flex items-start gap-2 text-gray-200 text-sm">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-5 w-5"
									viewBox="0 0 20 20"
									fill="currentColor">
									<path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"
									></path>
									<path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
								</svg>

								<p class="flex-1">{data.vendor?.email}</p>
							</div>
						{/if}

						<!-- Phone -->

						{#if data.vendor?.phone}
							<div class="flex items-start gap-2 text-gray-200 text-sm">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-5 w-5"
									viewBox="0 0 20 20"
									fill="currentColor">
									<path
										d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"
									></path>
								</svg>
								<p class="flex-1">{data.vendor?.phone}</p>
							</div>
						{/if}

						<!-- Social media URLs -->

						<div class="flex items-center gap-2 text-sm text-gray-200 sm:gap-4">
							{#if data.vendor?.facebookUrl}
								<a href="{data.vendor?.facebookUrl}" target="_blank" rel="noopener noreferrer">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-6 w-6"
										viewBox="0 0 24 24"
										stroke-width="2"
										stroke="currentColor"
										fill="none"
										stroke-linecap="round"
										stroke-linejoin="round">
										<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
										<path
											d="M7 10v4h3v7h4v-7h3l1 -4h-4v-2a1 1 0 0 1 1 -1h3v-4h-3a5 5 0 0 0 -5 5v2h-3"
										></path>
									</svg>
								</a>
							{/if}

							{#if data.vendor?.twitterUrl}
								<a href="{data.vendor?.twitterUrl}" target="_blank" rel="noopener noreferrer">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-6 w-6"
										viewBox="0 0 24 24"
										stroke-width="2"
										stroke="currentColor"
										fill="none"
										stroke-linecap="round"
										stroke-linejoin="round">
										<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
										<path
											d="M22 4.01c-1 .49 -1.98 .689 -3 .99c-1.121 -1.265 -2.783 -1.335 -4.38 -.737s-2.643 2.06 -2.62 3.737v1c-3.245 .083 -6.135 -1.395 -8 -4c0 0 -4.182 7.433 4 11c-1.872 1.247 -3.739 2.088 -6 2c3.308 1.803 6.913 2.423 10.034 1.517c3.58 -1.04 6.522 -3.723 7.651 -7.742a13.84 13.84 0 0 0 .497 -3.753c-.002 -.249 1.51 -2.772 1.818 -4.013z"
										></path>
									</svg>
								</a>
							{/if}

							{#if data.vendor?.githubUrl}
								<a href="{data.vendor?.githubUrl}" target="_blank" rel="noopener noreferrer">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-6 w-6"
										viewBox="0 0 24 24"
										stroke-width="2"
										stroke="currentColor"
										fill="none"
										stroke-linecap="round"
										stroke-linejoin="round">
										<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
										<path
											d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5"
										></path>
									</svg>
								</a>
							{/if}

							{#if data.vendor?.googleUrl}
								<a href="{data.vendor?.googleUrl}" target="_blank" rel="noopener noreferrer">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-6 w-6"
										viewBox="0 0 24 24"
										stroke-width="2"
										stroke="currentColor"
										fill="none"
										stroke-linecap="round"
										stroke-linejoin="round">
										<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
										<path d="M17.788 5.108a9 9 0 1 0 3.212 6.892h-8"></path>
									</svg>
								</a>
							{/if}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="px-3 py-5 sm:p-10">
		<div class="container mx-auto w-full max-w-6xl">
			<!-- About Vendor -->

			{#if data.vendor?.description}
				<div class="mb-10">
					<h5 class="mb-2 flex items-center gap-2 font-semibold sm:mb-4 sm:text-lg">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-4 w-4 sm:h-5 sm:w-5"
							viewBox="0 0 20 20"
							fill="currentColor">
							<path
								fill-rule="evenodd"
								d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
								clip-rule="evenodd"></path>
						</svg>

						<span>About Vendor</span>
					</h5>

					<p class="prose prose-sm sm:prose-base max-w-none">
						{@html data.vendor?.description}
					</p>
				</div>
			{/if}

			<!-- Categories -->

			{#if data.vendor?.categories && data.vendor?.categories.length}
				<div class="mb-10">
					<h5 class="mb-2 font-semibold sm:mb-4 sm:text-lg">Categories</h5>

					<div class="flex items-center gap-2">
						{#each data.vendor?.categories as category}
							<div class="rounded bg-gray-200 py-2 px-4 text-sm font-semibold">
								{category.name}
							</div>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Product By Vendor -->

			{#if data.vendorsProduct?.count}
				<div>
					<h3 class="mb-2 font-semibold sm:mb-4 sm:text-lg">
						{data.vendor?.businessName || 'Vendor'}'s
						{#if data.vendorsProduct?.count > 1}
							all Products ({data.vendorsProduct?.count})
						{:else}
							Product
						{/if}
					</h3>

					{#if data.vendorsProduct?.count}
						<div>
							<ul
								class="grid w-full grid-cols-2 items-start border-t sm:flex sm:flex-wrap sm:justify-between sm:gap-3 sm:border-t-0 lg:gap-6">
								{#each data.vendorsProduct?.data as p, ix}
									<li>
										<ProductCard product="{p}" />
									</li>
								{/each}

								{#each { length: 7 } as _}
									<li class="hidden sm:block">
										<DummyProductCard />
									</li>
								{/each}
							</ul>

							<Pagination
								count="{Math.ceil((data.vendorsProduct?.count || 1) / 40)}"
								current="{data.page || 1}" />
						</div>
					{:else}
						<p class="bg-zinc-200 rounded p-5 text-sm text-zinc-500 text-center">
							Oops!...No product found, vendor has not uploaded any product yet.
						</p>
					{/if}
				</div>
			{/if}
		</div>
	</div>
</section>
