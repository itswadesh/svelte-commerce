<script lang="ts">
	import { toast } from 'svelte-sonner'
	import { Image, Star, StarIcon, X } from 'lucide-svelte'
	import { date } from '$lib/core/utils'
	import * as Tabs from '$lib/components/ui/tabs'
	import { page } from '$app/state'
	import { useProductState } from '$lib/core/composables/product'
	import { productService } from '$lib/core/services'
	import Button from '$lib/components/ui/button/button.svelte'
	import { Textarea } from '$lib/components/ui/textarea'

	const productState = useProductState()
</script>

{#if page?.data?.store?.plugins?.enableReviews && page.data?.product?.ratings?.length}
	<!-- Reviews Section -->
	<div class="mx-2 mt-8">
		<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
			<!-- Rating Summary -->
			<div class="lg:col-span-1">
				<div class="rounded-lg border bg-white p-6 shadow-sm">
					<div class="mb-6 text-center">
						<div class="text-primary-500 text-4xl font-bold">
							{page.data?.product?.rating?.toFixed(1) || '0.0'}
						</div>
						<div class="my-2 flex items-center justify-center gap-1">
							{#each { length: 5 } as _, i}
								<Star fill="yellow" class="h-5 w-5 {i < (page.data?.product?.rating || 0) ? 'text-primary-500' : 'text-zinc-200'}" />
							{/each}
						</div>
						<div class="text-sm text-zinc-500">
							Based on {page.data?.product?.ratings?.length || 0} reviews
						</div>
					</div>

					<!-- Rating Distribution -->
					<div class="space-y-3">
						{#each [5, 4, 3, 2, 1] as stars}
							{@const count = page.data?.product?.ratings?.filter((r: { [key: string]: any }) => Math.floor(r.rating) === stars).length || 0}
							{@const percentage = page.data?.product?.ratings?.length ? (count / page.data?.product.ratings.length) * 100 : 0}
							<div class="flex items-center gap-2">
								<div class="flex w-16 items-center gap-1 text-sm">
									{stars}
									<StarIcon class="text-primary-500 h-4 w-4 fill-yellow-300" />
								</div>
								<div class="h-2 flex-1 overflow-hidden rounded-full bg-zinc-100">
									<div class="bg-primary-500 h-full rounded-full transition-all" style="width: {percentage}%"></div>
								</div>
								<div class="w-10 text-sm text-zinc-500">{count}</div>
							</div>
						{/each}
					</div>
				</div>

				<!-- Write Review Button (Mobile) -->
				<div class="mt-4 lg:hidden">
					<Button variant="outline" class="w-full" size="lg" onclick={() => (productState.showReviewForm = true)}>Write a Review</Button>
				</div>
			</div>

			<!-- Reviews List -->
			<div class="lg:col-span-2">
				<div class="rounded-lg border bg-white shadow-sm">
					<div class="border-b p-4">
						<div class="flex items-center justify-between">
							<h3 class="text-lg font-semibold">Customer Reviews</h3>
							<Button variant="outline" class="hidden lg:flex" onclick={() => (productState.showReviewForm = true)}>Write a Review</Button>
						</div>
					</div>

					<div class="divide-y">
						{#each page.data?.product?.ratings || [] as rating}
							<div class="p-6">
								<div class="mb-3 flex items-center justify-between">
									<div class="flex items-center gap-3">
										<div class="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100">
											{#if rating?.img}
												<img src={rating.img} alt="" class="h-full w-full rounded-full object-cover" />
											{:else}
												<span class="text-lg font-medium text-zinc-500">
													{(rating.name || 'A')[0].toUpperCase()}
												</span>
											{/if}
										</div>
										<div>
											<div class="font-medium">
												{rating.name || 'Anonymous'}
											</div>
											<div class="text-sm text-zinc-500">
												{rating.date ? date(rating.date) : ''}
											</div>
										</div>
									</div>
									<div class="flex items-center gap-1">
										{#each { length: 5 } as _, i}
											<Star fill="yellow" class="h-5 w-5 {i < rating.rating ? 'fill-primary' : 'fill-zinc-200'}" />
										{/each}
									</div>
								</div>

								{#if rating.review}
									<p class="mb-4 text-zinc-700">{rating.review}</p>
								{/if}

								{#if rating.images?.length}
									<div class="flex flex-wrap gap-2">
										{#each rating.images as img}
											<img src={img} alt="Review" class="h-20 w-20 cursor-pointer rounded-lg object-cover" />
										{/each}
									</div>
								{/if}
							</div>
						{/each}

						{#if !page.data?.product?.ratings?.length}
							<div class="p-8 text-center text-zinc-500">No reviews yet. Be the first to review this product!</div>
						{:else}
							<Tabs.Root value="product" class="w-full">
								<Tabs.List class="mb-6 grid w-full grid-cols-2 border-b">
									<Tabs.Trigger value="product" class="px-4 py-2 font-medium">Product Ratings</Tabs.Trigger>
									<Tabs.Trigger value="brand" class="px-4 py-2 font-medium">Brand Ratings</Tabs.Trigger>
								</Tabs.List>
								<Tabs.Content value="product" class="w-full">
									<div class="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
										{#each page.data?.product?.ratings as rating}
											<div class="flex w-full flex-col gap-4 rounded-lg border bg-white p-6 shadow-sm">
												<div class="flex flex-wrap items-center gap-2">
													<div class="flex flex-wrap items-center gap-2">
														{#each { length: 5 } as _, i}
															<button type="button" class="focus:outline-none focus:ring-0 focus:ring-offset-0">
																<svg
																	class="block h-8 w-8
											{rating.rating >= i && rating.rating != null ? 'text-primary-500' : 'text-zinc-200'}"
																	fill="currentColor"
																	xmlns="http://www.w3.org/2000/svg"
																	viewBox="0 0 20 20"
																>
																	<path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"
																		>{rating.rating}</path
																	>
																</svg>
															</button>
														{/each}

														{#if rating.rating == 0}
															<span class="font-semibold text-red-600"> Very Disappointed </span>
														{/if}

														{#if rating.rating == 1}
															<span class="font-semibold text-orange-600"> Slightly Disappointed </span>
														{/if}

														{#if rating.rating == 2}
															<span class="font-semibold text-green-600"> Good</span>
														{/if}

														{#if rating.rating == 3}
															<span class="font-semibold text-green-600"> Very Good</span>
														{/if}

														{#if rating.rating == 4}
															<span class="font-semibold text-green-600"> Excellent</span>
														{/if}
													</div>
												</div>

												<div class="flex flex-1 flex-col gap-1">
													{#if rating.review}
														<p class="first-letter:uppercase">
															{rating.review}
														</p>
													{/if}

													<div class="flex flex-wrap items-center gap-1 text-xs text-zinc-500">
														<img src={rating?.img} alt="User" class="h-6 w-6 rounded-full" />
														{#if rating.name}
															<span>{rating.name}</span>

															<span class="h-2.5 border-l border-zinc-200"></span>
														{/if}

														{#if rating.createdAt}
															<span>{date(rating.createdAt)}</span>
														{/if}
													</div>
												</div>
											</div>
										{/each}
									</div>
								</Tabs.Content>
								<Tabs.Content value="brand" class="w-full">
									<div class="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
										{#each page.data?.allratings as rating}
											<div class="flex w-full flex-col gap-4 rounded-lg border bg-white p-6 shadow-sm">
												<div class="flex flex-wrap items-center gap-2">
													<div class="flex flex-wrap items-center gap-2">
														{#each { length: 5 } as _, i}
															<button type="button" class="focus:outline-none focus:ring-0 focus:ring-offset-0">
																<svg
																	class="block h-8 w-8
											{rating.rating >= i && rating.rating != null ? 'text-primary-500' : 'text-zinc-200'}"
																	fill="currentColor"
																	xmlns="http://www.w3.org/2000/svg"
																	viewBox="0 0 20 20"
																>
																	<path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"
																		>{rating.rating}</path
																	>
																</svg>
															</button>
														{/each}

														{#if rating.rating == 0}
															<span class="font-semibold text-red-600"> Very Disappointed </span>
														{/if}

														{#if rating.rating == 1}
															<span class="font-semibold text-orange-600"> Slightly Disappointed </span>
														{/if}

														{#if rating.rating == 2}
															<span class="font-semibold text-green-600"> Good</span>
														{/if}

														{#if rating.rating == 3}
															<span class="font-semibold text-green-600"> Very Good</span>
														{/if}

														{#if rating.rating == 4}
															<span class="font-semibold text-green-600"> Excellent</span>
														{/if}
													</div>
												</div>

												<div class="flex flex-1 flex-col gap-1">
													{#if rating.review}
														<p class="first-letter:uppercase">
															{rating.review}
														</p>
													{/if}

													<div class="flex flex-wrap items-center gap-1 text-xs text-zinc-500">
														<img src={rating?.img} alt="User" class="h-6 w-6 rounded-full" />
														{#if rating.name}
															<span>{rating.name}</span>

															<span class="h-2.5 border-l border-zinc-200"></span>
														{/if}

														{#if rating.createdAt}
															<span>{date(rating.createdAt)}</span>
														{/if}
													</div>
												</div>
											</div>
										{/each}
									</div>
								</Tabs.Content>
							</Tabs.Root>
						{/if}
					</div>
				</div>
			</div>
		</div>

		<!-- Review Form Dialog -->
		{#if productState.showReviewForm}
			<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
				<div class="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white">
					<div class="sticky top-0 z-10 border-b bg-white p-6">
						<div class="flex items-center justify-between">
							<h3 class="text-lg font-semibold">Write a Review</h3>
							<button onclick={() => (productState.showReviewForm = false)} class="text-zinc-500 hover:text-zinc-700">
								<X class="h-5 w-5" />
							</button>
						</div>
					</div>

					<div class="space-y-6 p-6">
						<div>
							<span class="mb-2 block text-sm font-medium">Rating</span>
							<div class="flex items-center gap-2">
								{#each { length: 5 } as _, i}
									<button type="button" class="transition-transform focus:outline-none" onclick={() => productState.onSelect(i)}>
										<Star class="h-8 w-8 {productState.select && productState.select >= i ? 'fill-primary' : 'fill-zinc-200'}" />
									</button>
								{/each}

								{#if productState.select !== null}
									<span class="ml-2 font-medium {productState.ratingLabels[productState.select].color}">
										{productState.ratingLabels[productState.select].text}
									</span>
								{/if}
							</div>
						</div>

						<div>
							<label for="review" class="mb-2 block text-sm font-medium">Your Review</label>
							<Textarea
								id="review"
								placeholder="Share your experience with this product..."
								bind:value={productState.reviewMessage}
								class="min-h-[120px]"
							/>
						</div>

						<div>
							<span class="mb-2 block text-sm font-medium">Photos</span>
							<div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
								{#each productState.uploadedImagestoSave as img, index}
									<div class="group relative aspect-square">
										<img src={img} alt="Review image {index + 1}" class="h-full w-full rounded-lg object-cover" />
										<button
											onclick={() => productState.removeSelectedImage(img)}
											class="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 opacity-0 shadow-sm transition-opacity group-hover:opacity-100 hover:bg-white"
										>
											<X class="h-4 w-4" />
										</button>
									</div>
								{/each}

								<label
									for="dropzone-file"
									class="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-zinc-200 bg-zinc-50 transition-colors hover:bg-zinc-100"
								>
									<div class="flex flex-col items-center justify-center p-4 text-center">
										<Image class="mb-2 h-8 w-8 text-zinc-400" />
										<p class="text-sm text-zinc-500">
											<span class="text-primary-500 font-medium">Upload a photo</span>
											<br />or drag and drop
										</p>
									</div>
									<input id="dropzone-file" type="file" accept="image/*" class="hidden" multiple={false} onchange={handleImageChange} />
								</label>
							</div>
						</div>
					</div>

					<div class="sticky bottom-0 z-10 border-t bg-white p-6">
						<div class="flex items-center justify-end gap-3">
							<Button variant="outline" onclick={() => (productState.showReviewForm = false)}>Cancel</Button>
							<Button
								disabled={!productState.select || !productState.reviewMessage}
								onclick={async () => {
									try {
										await productService.addReview({
											productId: page.data?.product.id,
											variantId: productState.selectedVariant?.id,
											rating: productState.select || 0,
											review: productState.reviewMessage,
											uploadedImages: productState.uploadedImagestoSave
										})
										productState.showReviewForm = false
										toast.success('Review submitted successfully')
									} catch (error) {
										toast.error('Failed to submit review')
									}
								}}
							>
								Submit Review
							</Button>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
{/if}

