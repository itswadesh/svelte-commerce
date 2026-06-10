<script lang="ts">
	import { toast } from '@misiki/kitcommerce-core'
	import { Image, Star, StarIcon, X, Check, Camera, MessageSquare, ThumbsUp } from '@lucide/svelte'
	import { date } from '$lib/core/utils/index.js'
	import * as Tabs from '$lib/components/ui/tabs/index.js'
	import { page } from '$app/state'
	import { invalidateAll } from '$app/navigation'
	import { useProductState } from '$lib/core/composables/index.js'
	import { productService } from '$lib/core/services/index.js'
	import Button from '$lib/components/ui/button/button.svelte'
	import { Textarea } from '$lib/components/ui/textarea/index.js'
	import { fade, fly, scale } from 'svelte/transition'
	import { quintOut } from 'svelte/easing'

	const productState = useProductState()
	type RatingView = {
		rating: number
	}

	const accRating = $derived.by(() => {
		if (!page.data?.product?.ratings?.length) return 0
		const total = page.data?.product?.ratings?.reduce((acc: number, cur: RatingView) => acc + cur.rating, 0)
		const rating = total / page.data?.product?.ratings?.length
		return Math.floor(rating * 10) / 10
	})

	const ratingLabels = [
		{ text: 'Very Disappointed', color: 'text-red-500' },
		{ text: 'Slightly Disappointed', color: 'text-orange-500' },
		{ text: 'Good', color: 'text-emerald-500' },
		{ text: 'Very Good', color: 'text-emerald-600' },
		{ text: 'Excellent', color: 'text-emerald-700' }
	]
</script>

<!-- Reviews Section -->
{#if page.data.store?.plugins?.isProductReviewsAndRatings?.active}
	<section class="">
		{#if page.data?.product?.ratings?.length}
			<div class="intra-gap grid grid-cols-1 lg:grid-cols-12">
				<!-- Left Column: Summary & Stats -->
				<div class="lg:sticky lg:top-24 lg:col-span-4 lg:h-fit">
					<div class="space-y-6 lg:space-y-8">
						<div class="flex flex-col items-center text-center lg:items-start lg:text-left">
							<h2 class="mb-1 text-2xl font-bold tracking-tight text-foreground lg:mb-2 lg:text-2xl">Reviews</h2>
							<p class="text-sm text-muted-foreground lg:text-base">Real feedback from our community</p>

							<div class="mt-6 flex items-baseline gap-2 lg:mt-8">
								<span class="text-5xl font-black text-primary lg:text-6xl">{accRating || '0.0'}</span>
								<span class="text-lg font-semibold text-muted-foreground/60 lg:text-xl">/ 5.0</span>
							</div>

							<div class="mt-2 flex items-center gap-1.5 lg:mt-3">
								<div class="flex items-center gap-0.5">
									{#each { length: 5 } as _, i}
										<Star
											fill={i < Math.floor(accRating) ? 'currentColor' : 'none'}
											class="h-5 w-5 {i < Math.floor(accRating) ? 'text-primary' : 'text-muted-foreground'}"
										/>
									{/each}
								</div>
								<span class="ml-2 text-sm font-medium text-muted-foreground">
									{page.data?.product?.ratings?.length || 0} global ratings
								</span>
							</div>
						</div>

						<!-- Rating Distribution -->
						<div class="rounded-md bg-muted/10 p-6 ring-1 ring-border">
							<div class="space-y-4">
								{#each [5, 4, 3, 2, 1] as stars}
									{@const count = page.data?.product?.ratings?.filter((r: { [key: string]: any }) => Math.floor(r.rating) === stars - 1).length || 0}
									{@const percentage = page.data?.product?.ratings?.length ? (count / page.data?.product?.ratings?.length) * 100 : 0}
									<div class="group flex items-center gap-4">
										<button class="flex w-12 items-center gap-1.5 text-sm font-bold text-muted-foreground transition-colors hover:text-primary">
											{stars}
											<StarIcon class="h-3.5 w-3.5 fill-current" />
										</button>
										<div class="relative h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
											<div
												class="absolute inset-y-0 left-0 rounded-full bg-primary transition-all duration-700 ease-out"
												style="width: {percentage}%"
											></div>
										</div>
										<div class="w-10 text-right text-sm font-bold text-muted-foreground/50 group-hover:text-foreground">
											{count}
										</div>
									</div>
								{/each}
							</div>
						</div>

						<div class="space-y-4">
							<Button
								class="h-12 w-full"
								onclick={() => (productState.showReviewForm = true)}
							>
								Write a Review
							</Button>
						</div>
					</div>
				</div>

				<!-- Right Column: Reviews Feed -->
				<div class="lg:col-span-8">
					<Tabs.Root value="product" class="w-full">
						<div class="intra-gap flex flex-col sm:flex-row sm:items-center sm:justify-between">
							<Tabs.List class="flex h-11 w-full items-center justify-center rounded-md bg-muted/30 p-1 text-muted-foreground sm:inline-flex sm:w-auto">
								<Tabs.Trigger
									value="product"
									class="inline-flex flex-1 items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-bold transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 sm:flex-none"
								>
									Product Reviews
								</Tabs.Trigger>
								<Tabs.Trigger
									value="brand"
									class="inline-flex flex-1 items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-bold transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 sm:flex-none"
								>
									Brand Feedback
								</Tabs.Trigger>
							</Tabs.List>
						</div>

						<Tabs.Content value="product" class="intra-pt space-y-4">
							{#each page.data?.product?.ratings as rating, i}
								<div
									class="relative flex flex-col gap-4 rounded-md bg-background p-5 ring-1 ring-border transition-all hover:shadow-xl sm:gap-6 sm:p-6"
									in:fly={{ y: 20, delay: i * 50, duration: 400, easing: quintOut }}
								>
									<div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
										<div class="flex items-center gap-3 sm:gap-4">
											<div class="relative flex-shrink-0">
												<div
													class="flex h-10 w-10 items-center justify-center rounded-full bg-muted/10 ring-2 ring-background ring-offset-2 sm:h-12 sm:w-12"
												>
													{#if rating?.img}
														<img src={rating.img} alt={rating.name} class="h-full w-full rounded-full object-cover" />
													{:else}
														<span class="text-base font-black text-muted-foreground/50 sm:text-lg">
															{(rating.name || 'G')[0].toUpperCase()}
														</span>
													{/if}
												</div>
												<div
													class="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground ring-2 ring-background sm:h-5 sm:w-5"
												>
													<Check class="h-2.5 w-2.5 stroke-[3] sm:h-3 sm:w-3" />
												</div>
											</div>
											<div class="min-w-0">
												<h4 class="truncate font-bold text-foreground">{rating.name || 'Guest'}</h4>
												<div class="flex flex-wrap items-center gap-x-2 text-[10px] font-medium text-muted-foreground sm:text-xs">
													<span>{rating.createdAt ? date(rating.createdAt) : 'Recently'}</span>
													<span class="h-1 w-1 rounded-full bg-border"></span>
												</div>
											</div>
										</div>
										<div class="flex w-fit items-center gap-0.5 rounded-full bg-muted/20 px-2.5 py-1 ring-1 ring-border sm:px-3 sm:py-1.5">
											{#each { length: 5 } as _, i}
												<StarIcon class="h-3 w-3 {i <= rating.rating ? 'fill-primary text-primary' : 'text-muted-foreground'} sm:h-3.5 sm:w-3.5" />
											{/each}
										</div>
									</div>

									<div class="space-y-4">
										{#if rating.review}
											<p class="text-base leading-relaxed text-foreground/80 first-letter:uppercase sm:text-lg">
												"{rating.review}"
											</p>
										{/if}

										{#if rating.images?.length}
											<div class="flex flex-wrap gap-2 sm:gap-3">
												{#each rating.images as img}
													<button
														class="group relative aspect-square w-20 overflow-hidden rounded-md ring-2 ring-background transition-all hover:ring-primary sm:w-24"
													>
														<img src={img} alt="Review" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
														<div class="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10"></div>
													</button>
												{/each}
											</div>
										{/if}
									</div>
								</div>
							{/each}
						</Tabs.Content>

						<Tabs.Content value="brand" class="intra-pt space-y-6">
							{#each page.data?.product?.brandReviews as rating, i}
								<div
									class="relative flex flex-col gap-4 rounded-md bg-background p-5 ring-1 ring-border transition-all hover:shadow-xl sm:gap-6 sm:p-6"
									in:fly={{ y: 20, delay: i * 50, duration: 400, easing: quintOut }}
								>
									<div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
										<div class="flex items-center gap-3 sm:gap-4">
											<div class="relative flex-shrink-0">
												<div
													class="flex h-10 w-10 items-center justify-center rounded-full bg-muted/10 ring-2 ring-background ring-offset-2 sm:h-12 sm:w-12"
												>
													{#if rating?.img}
														<img src={rating.img} alt={rating.name} class="h-full w-full rounded-full object-cover" />
													{:else}
														<span class="text-base font-black text-muted-foreground/50 sm:text-lg">
															{(rating.name || 'G')[0].toUpperCase()}
														</span>
													{/if}
												</div>
												<div
													class="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground ring-2 ring-background sm:h-5 sm:w-5"
												>
													<Check class="h-2.5 w-2.5 stroke-[3] sm:h-3 sm:w-3" />
												</div>
											</div>
											<div class="min-w-0">
												<h4 class="truncate font-bold text-foreground">{rating.name || 'Guest'}</h4>
												<div class="flex flex-wrap items-center gap-x-2 text-[10px] font-medium text-muted-foreground sm:text-xs">
													<span>{rating.createdAt ? date(rating.createdAt) : 'Recently'}</span>
													<span class="h-1 w-1 rounded-full bg-border"></span>
												</div>
											</div>
										</div>
										<div class="flex w-fit items-center gap-0.5 rounded-full bg-muted/20 px-2.5 py-1 ring-1 ring-border sm:px-3 sm:py-1.5">
											{#each { length: 5 } as _, i}
												<StarIcon class="h-3 w-3 {i <= rating.rating ? 'fill-primary text-primary' : 'text-muted-foreground'} sm:h-3.5 sm:w-3.5" />
											{/each}
										</div>
									</div>

									<div class="space-y-4">
										{#if rating.review}
											<p class="text-base leading-relaxed text-foreground/80 first-letter:uppercase sm:text-lg">
												"{rating.review}"
											</p>
										{/if}

										{#if rating.images?.length}
											<div class="flex flex-wrap gap-2 sm:gap-3">
												{#each rating.images as img}
													<button
														class="group relative aspect-square w-20 overflow-hidden rounded-md ring-2 ring-background transition-all hover:ring-primary sm:w-24"
													>
														<img src={img} alt="Review" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
														<div class="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10"></div>
													</button>
												{/each}
											</div>
										{/if}
									</div>
								</div>
							{:else}
								<div
									class="flex flex-col items-center justify-center py-12 text-center text-muted-foreground bg-muted/30 rounded-md border-2 border-dashed border-border"
								>
									<MessageSquare class="h-10 w-10 mb-3 opacity-20 sm:h-12 sm:w-12 sm:mb-4" />
									<p class="font-bold text-base sm:text-lg">No brand feedback yet</p>
									<p class="text-xs sm:text-sm">Be the first to share your experience!</p>
								</div>
							{/each}
						</Tabs.Content>
					</Tabs.Root>
				</div>
			</div>
		{:else}
			<!-- Empty State -->
			<div class="flex flex-col items-center justify-center py-12 text-center sm:py-20">
				<div
					class="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted text-muted-foreground ring-1 ring-border sm:mb-8 sm:h-24 sm:w-24"
				>
					<Star class="h-10 w-10 sm:h-12 sm:w-12" />
				</div>
				<h2 class="mb-2 text-2xl font-bold tracking-tight text-foreground sm:mb-3 sm:text-3xl">No reviews yet</h2>
				<p class="mb-8 max-w-xs text-base text-muted-foreground sm:mb-10 sm:max-w-sm sm:text-lg">
					Be the first to share your thoughts on this product and help other shoppers.
				</p>
				<Button
					class="h-12 sm:h-14 px-8 sm:px-8"
					onclick={() => (productState.showReviewForm = true)}
				>
					Write the First Review
				</Button>
			</div>
		{/if}
	</section>

	<!-- Review Form Modal Overlay -->
	{#if productState.showReviewForm}
		<div class="fixed inset-0 z-[100] flex items-center justify-center bg-foreground backdrop-blur-sm sm:p-4" transition:fade={{ duration: 200 }}>
			<div
				class="font-montserrat relative h-full w-full overflow-hidden bg-background sm:h-auto sm:max-h-[90vh] sm:max-w-2xl sm:rounded-radius sm:shadow-2xl"
				transition:scale={{ start: 0.95, duration: 300, easing: quintOut }}
			>
				<!-- Modal Header -->
				<div
					class="sticky top-0 z-10 flex items-center justify-between border-b border-border px-6 py-4 backdrop-blur-md sm:px-8 sm:py-6"
				>
					<div>
						<h3 class="text-xl font-black tracking-tight text-foreground sm:text-2xl">Write a Review</h3>
						<p class="text-xs font-medium text-muted-foreground sm:text-sm">Share your experience with us</p>
					</div>
					<Button
						variant="ghost"
						size="icon"
						onclick={() => (productState.showReviewForm = false)}
						class="rounded-full"
					>
						<X class="h-6 w-6" />
					</Button>
				</div>

				<!-- Modal Body -->
				<div class="custom-scrollbar max-h-[calc(100vh-140px)] overflow-y-auto px-6 py-8 sm:max-h-[calc(90vh-180px)] sm:px-8 sm:py-10">
					<div class="space-y-10 sm:space-y-12">
						<!-- Rating Selection -->
						<div class="space-y-4 sm:space-y-6">
							<span class="block text-base font-bold text-foreground sm:text-lg">Overall Rating</span>
							<div class="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
								<div class="flex items-center gap-1">
									{#each { length: 5 } as _, i}
										<Button
											variant="plain"
											class="h-12 w-12 p-0"
											onclick={() => productState.onSelect(i + 1)}
										>
											<Star
												fill={productState.select !== null && productState.select >= i + 1 ? 'currentColor' : 'none'}
												strokeWidth={1.5}
												class="!h-10 !w-10 transition-colors {productState.select !== null && productState.select >= i + 1
													? 'text-primary'
													: 'text-muted-foreground'} sm:!h-12 sm:!w-12"
											/>
										</Button>
									{/each}
								</div>

								{#if productState.select !== null}
									<div
										class="rounded-full px-4 py-1.5 text-xs font-black ring-1 ring-inset {ratingLabels[productState.select - 1].color
											.replace('text-', 'bg-')
											.replace('-500', '-50')} {ratingLabels[productState.select - 1].color} sm:text-sm"
										in:scale={{ start: 0.9, duration: 200 }}
									>
										{ratingLabels[productState.select - 1].text}
									</div>
								{/if}
							</div>
						</div>

						<!-- Review Message -->
						<div class="space-y-4">
							<label for="review" class="block text-base font-bold text-foreground sm:text-lg">Your Story</label>
							<div class="relative">
								<Textarea
									id="review"
									placeholder="What did you love? What could be better? We're all ears."
									bind:value={productState.reviewMessage}
									class="min-h-[140px] rounded-md border-2 border-border p-4 text-base transition-all focus:ring-0 sm:min-h-[160px] sm:p-6 sm:text-lg"
								/>
								<div class="absolute bottom-4 right-4 text-[10px] font-bold text-muted-foreground/30 sm:text-xs">
									{productState.reviewMessage?.length || 0} characters
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Modal Footer -->
				<div class="border-t border-border bg-background/80 px-6 py-4 backdrop-blur-md sm:px-8 sm:py-6">
					<div class="flex items-center justify-end gap-3 sm:gap-4">
						<Button
							variant="ghost"
							onclick={() => (productState.showReviewForm = false)}
							class="h-10 sm:h-12 px-4 sm:px-6"
						>
							Discard
						</Button>
						<Button
							disabled={productState.select === null || !productState.reviewMessage}
							class="h-10 sm:h-12 px-6 sm:px-10"
							onclick={async () => {
								try {
									await productService.addReview({
										productId: page.data?.product.id,
										variantId: productState.selectedVariant?.id,
										rating: productState.select || 1,
										review: productState.reviewMessage,
										uploadedImages: productState.uploadedImagestoSave
									})
									productState.showReviewForm = false
									await invalidateAll()
									toast.success('Review published! Thanks for sharing.')
								} catch (error: any) {
									toast.error(error?.message || 'Could not post review. Try again?')
								}
							}}
						>
							Post Review
						</Button>
					</div>
				</div>
			</div>
		</div>
	{/if}
{/if}

<style>
	:global(.font-montserrat) {
		font-family: 'Montserrat', sans-serif;
	}

	.rating-bar-glow {
		box-shadow: 0 0 12px rgba(var(--primary), 0.2);
	}

	.custom-scrollbar::-webkit-scrollbar {
		width: 4px;
	}
	.custom-scrollbar::-webkit-scrollbar-track {
		background: transparent;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb {
		background: hsl(var(--border));
		border-radius: 4px;
	}
</style>
