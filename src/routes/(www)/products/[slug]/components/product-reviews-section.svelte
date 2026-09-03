<script lang="ts">
	import { toast } from '@misiki/kitcommerce-core'
	import { Star, StarIcon, X, Camera, ChevronLeft, ChevronRight, UserRound } from '@lucide/svelte'
	import { date } from '$lib/core/utils/index.js'
	import { page } from '$app/state'
	import { invalidateAll } from '$app/navigation'
	import { useProductState } from '$lib/core/composables/index.js'
	import { productService, uploadService } from '$lib/core/services/index.js'
	import Button from '$lib/components/ui/button/button.svelte'
	import { Textarea } from '$lib/components/ui/textarea/index.js'
	import { fade, scale } from 'svelte/transition'
	import { quintOut } from 'svelte/easing'

	const productState = useProductState()

	const ratings = $derived(page.data?.product?.ratings ?? [])

	const accRating = $derived.by(() => {
		if (!ratings.length) return 0
		const total = ratings.reduce((acc: number, cur: { rating: number }) => acc + cur.rating, 0)
		return Math.floor((total / ratings.length) * 10) / 10
	})

	// Review photos are stored as a comma-separated URL list in `img`.
	const reviewImages = (r: any): string[] =>
		r?.img
			? String(r.img)
					.split(',')
					.map((s: string) => s.trim())
					.filter(Boolean)
			: []

	const allPhotos = $derived(ratings.flatMap(reviewImages))
	const PHOTO_STRIP = 3

	const variantTitle = (variantId: string): string => {
		const v = page.data?.product?.variants?.find((x: any) => x.id === variantId)
		return v?.title && v.title !== 'default' ? v.title : ''
	}

	const distribution = $derived(
		[5, 4, 3, 2, 1].map((stars) => {
			const count = ratings.filter((r: any) => Math.round(r.rating) === stars).length
			return { stars, count, pct: ratings.length ? Math.round((count / ratings.length) * 100) : 0 }
		})
	)

	// Lightbox for review photos
	let lightbox = $state<{ photos: string[]; index: number } | null>(null)
	const openLightbox = (photos: string[], index = 0) => (lightbox = { photos, index })
	const lightboxStep = (delta: number) => {
		if (!lightbox) return
		lightbox.index = (lightbox.index + delta + lightbox.photos.length) % lightbox.photos.length
	}

	// Review-form photo upload
	let pendingPhotos = $state<{ file: File; preview: string }[]>([])
	let submitting = $state(false)
	const onPhotosPicked = (e: Event) => {
		const files = [...((e.target as HTMLInputElement).files ?? [])].slice(0, 5 - pendingPhotos.length)
		pendingPhotos = [...pendingPhotos, ...files.map((file) => ({ file, preview: URL.createObjectURL(file) }))]
		;(e.target as HTMLInputElement).value = ''
	}
	const removePendingPhoto = (i: number) => {
		URL.revokeObjectURL(pendingPhotos[i].preview)
		pendingPhotos = pendingPhotos.filter((_, idx) => idx !== i)
	}

	async function submitReview() {
		submitting = true
		try {
			let uploadedImages: string[] = []
			if (pendingPhotos.length) {
				const uploads = await uploadService.uploadMultipleToS3({
					files: pendingPhotos.map((p) => p.file),
					folderName: 'reviews',
					type: 'image'
				})
				uploadedImages = (uploads ?? []).map((u: any) => u?.url).filter(Boolean)
			}
			await productService.addReview({
				productId: page.data?.product.id,
				variantId: productState.selectedVariant?.id,
				rating: productState.select || 1,
				review: productState.reviewMessage,
				uploadedImages
			})
			productState.showReviewForm = false
			pendingPhotos.forEach((p) => URL.revokeObjectURL(p.preview))
			pendingPhotos = []
			await invalidateAll()
			toast.success('Review published! Thanks for sharing.')
		} catch (error: any) {
			toast.error(error?.message || 'Could not post review. Try again?')
		} finally {
			submitting = false
		}
	}

	const ratingLabels = [
		{ text: 'Very Disappointed', color: 'text-red-500' },
		{ text: 'Slightly Disappointed', color: 'text-orange-500' },
		{ text: 'Good', color: 'text-emerald-500' },
		{ text: 'Very Good', color: 'text-emerald-600' },
		{ text: 'Excellent', color: 'text-emerald-700' }
	]
</script>

<!-- Customer Ratings -->
{#if page.data.store?.plugins?.isProductReviewsAndRatings?.active}
	<section class="edp-rev">
		<h2 class="edp-rev-title mb-6 border-b border-border pb-4 text-3xl font-bold tracking-tight text-foreground">Customer Ratings</h2>

		{#if ratings.length}
			<!-- Summary: average / distribution / customer photos -->
			<div class="grid grid-cols-1 gap-8 border-b border-border pb-8 md:grid-cols-2 lg:grid-cols-12 lg:gap-10">
				<div class="flex flex-col items-center text-center lg:col-span-3 lg:items-start lg:text-left">
					<div class="flex items-baseline gap-1">
						<span class="edp-rev-score text-5xl font-black text-foreground">{accRating || '0.0'}</span>
						<span class="text-xl font-semibold text-muted-foreground">/5</span>
					</div>
					<div class="mt-2 flex items-center gap-0.5">
						{#each { length: 5 } as _, i}
							<Star
								fill={i < Math.round(accRating) ? 'currentColor' : 'none'}
								class="h-5 w-5 {i < Math.round(accRating) ? 'text-primary' : 'text-muted-foreground/50'}"
							/>
						{/each}
					</div>
					<p class="mt-2 text-sm text-muted-foreground">
						Based on {ratings.length}
						{ratings.length === 1 ? 'review' : 'reviews'}
					</p>
					<Button class="mt-4" onclick={() => (productState.showReviewForm = true)}>Write a Review</Button>
				</div>

				<div class="lg:col-span-5">
					<div class="space-y-2.5">
						{#each distribution as row}
							<div class="flex items-center gap-3">
								<span class="w-12 shrink-0 text-right text-sm text-muted-foreground">{row.stars} star</span>
								<div class="relative h-3.5 flex-1 overflow-hidden rounded-full border border-primary/40 bg-background">
									<div class="absolute inset-y-0 left-0 bg-primary transition-all duration-700 ease-out" style="width: {row.pct}%"></div>
								</div>
								<span class="w-10 shrink-0 text-sm text-muted-foreground">{row.pct}%</span>
							</div>
						{/each}
					</div>
				</div>

				{#if allPhotos.length}
					<div class="lg:col-span-4">
						<div class="flex gap-3">
							{#each allPhotos.slice(0, PHOTO_STRIP) as photo, i}
								<button
									class="edp-rev-photo group relative aspect-square w-full max-w-[140px] flex-1 overflow-hidden rounded-md ring-1 ring-border"
									onclick={() => openLightbox(allPhotos, i)}
									aria-label="View customer photo {i + 1} of {allPhotos.length}"
								>
									<img
										src={photo}
										alt="Customer review"
										class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
										loading="lazy"
									/>
									{#if i === PHOTO_STRIP - 1 && allPhotos.length > PHOTO_STRIP}
										<span class="absolute inset-0 flex items-center justify-center bg-black/45 text-sm font-semibold text-white">
											+{allPhotos.length - PHOTO_STRIP} more
										</span>
									{/if}
								</button>
							{/each}
						</div>
					</div>
				{/if}
			</div>

			<!-- Review rows -->
			<div class="divide-y divide-border">
				{#each ratings as rating}
					{@const photos = reviewImages(rating)}
					{@const size = variantTitle(rating.variantId)}
					<div class="grid grid-cols-1 gap-4 py-7 lg:grid-cols-12 lg:gap-8">
						<div class="lg:col-span-4">
							<div class="flex items-center gap-2.5">
								<span class="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-muted-foreground">
									<UserRound class="h-4 w-4" />
								</span>
								<span class="font-semibold text-foreground">{rating.name || 'Guest'}</span>
								<span class="text-sm text-muted-foreground">{rating.createdAt ? date(rating.createdAt) : ''}</span>
							</div>
							<div class="mt-2.5 flex items-center gap-0.5">
								{#each { length: 5 } as _, i}
									<StarIcon class="h-4.5 w-4.5 {i < Math.round(rating.rating) ? 'fill-primary text-primary' : 'text-muted-foreground/40'}" />
								{/each}
							</div>
							{#if size}
								<p class="mt-2 text-sm text-muted-foreground">Size: {size}</p>
							{/if}
						</div>

						<div class="lg:col-span-8">
							{#if rating.review}
								<p class="leading-relaxed text-foreground/85">{rating.review}</p>
							{/if}
							{#if photos.length}
								<div class="mt-4 flex flex-wrap gap-2.5">
									{#each photos as photo, i}
										<button
											class="edp-rev-photo group aspect-square w-20 overflow-hidden rounded-md ring-1 ring-border transition-all hover:ring-primary sm:w-24"
											onclick={() => openLightbox(photos, i)}
											aria-label="View review photo {i + 1} from {rating.name || 'customer'}"
										>
											<img
												src={photo}
												alt=""
												class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
												loading="lazy"
											/>
										</button>
									{/each}
								</div>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<!-- Empty State -->
			<div class="flex flex-col items-center justify-center py-12 text-center sm:py-16">
				<div class="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted text-muted-foreground ring-1 ring-border">
					<Star class="h-10 w-10" />
				</div>
				<h3 class="mb-2 text-2xl font-bold tracking-tight text-foreground">No reviews yet</h3>
				<p class="mb-8 max-w-sm text-muted-foreground">Be the first to share your thoughts on this product and help other shoppers.</p>
				<Button class="h-12 px-8" onclick={() => (productState.showReviewForm = true)}>Write the First Review</Button>
			</div>
		{/if}
	</section>

	<!-- Photo lightbox -->
	{#if lightbox}
		<!-- Intro-only fade: an outro transition here can wedge mid-removal and leave an
		     invisible full-screen node that blocks all clicks. -->
		<div
			class="fixed inset-0 z-[110] flex items-center justify-center bg-black/85 p-4"
			in:fade={{ duration: 150 }}
			onclick={() => (lightbox = null)}
			onkeydown={(e) => {
				if (e.key === 'Escape') lightbox = null
				if (e.key === 'ArrowRight') lightboxStep(1)
				if (e.key === 'ArrowLeft') lightboxStep(-1)
			}}
			role="dialog"
			aria-label="Review photo viewer"
			tabindex="-1"
		>
			<Button
				variant="ghost"
				size="icon"
				class="absolute right-4 top-4 rounded-full text-white hover:bg-white/10 hover:text-white"
				onclick={(e: MouseEvent) => {
					e.stopPropagation()
					lightbox = null
				}}
				aria-label="Close photo viewer"
			>
				<X class="h-6 w-6" />
			</Button>
			{#if lightbox.photos.length > 1}
				<Button
					variant="ghost"
					size="icon"
					class="absolute left-3 rounded-full text-white hover:bg-white/10 hover:text-white"
					onclick={(e: MouseEvent) => {
						e.stopPropagation()
						lightboxStep(-1)
					}}
					aria-label="Previous photo"
				>
					<ChevronLeft class="h-7 w-7" />
				</Button>
				<Button
					variant="ghost"
					size="icon"
					class="absolute right-3 top-1/2 rounded-full text-white hover:bg-white/10 hover:text-white"
					onclick={(e: MouseEvent) => {
						e.stopPropagation()
						lightboxStep(1)
					}}
					aria-label="Next photo"
				>
					<ChevronRight class="h-7 w-7" />
				</Button>
			{/if}
			<!-- svelte-ignore a11y_no_noninteractive_element_interactions, a11y_click_events_have_key_events -->
			<img
				src={lightbox.photos[lightbox.index]}
				alt="Customer review photo {lightbox.index + 1} of {lightbox.photos.length}"
				class="max-h-[85vh] max-w-[92vw] rounded-md object-contain"
				onclick={(e) => e.stopPropagation()}
			/>
			{#if lightbox.photos.length > 1}
				<span class="absolute bottom-4 rounded-full bg-white/10 px-3 py-1 text-xs text-white">
					{lightbox.index + 1} / {lightbox.photos.length}
				</span>
			{/if}
		</div>
	{/if}

	<!-- Review Form Modal -->
	{#if productState.showReviewForm}
		<div class="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/70 backdrop-blur-sm sm:p-4" transition:fade={{ duration: 200 }}>
			<div
				class="relative h-full w-full overflow-hidden bg-background sm:h-auto sm:max-h-[90vh] sm:max-w-2xl sm:rounded-radius sm:shadow-2xl"
				transition:scale={{ start: 0.95, duration: 300, easing: quintOut }}
			>
				<div class="sticky top-0 z-10 flex items-center justify-between border-b border-border px-6 py-4 backdrop-blur-md sm:px-8 sm:py-5">
					<div>
						<h3 class="text-xl font-black tracking-tight text-foreground sm:text-2xl">Write a Review</h3>
						<p class="text-xs font-medium text-muted-foreground sm:text-sm">Share your experience with us</p>
					</div>
					<Button variant="ghost" size="icon" onclick={() => (productState.showReviewForm = false)} class="rounded-full">
						<X class="h-6 w-6" />
					</Button>
				</div>

				<div class="max-h-[calc(100dvh-140px)] overflow-y-auto px-6 py-6 sm:max-h-[calc(90vh-170px)] sm:px-8 sm:py-8">
					<div class="space-y-8">
						<!-- Rating Selection -->
						<div class="space-y-3">
							<span class="block text-base font-bold text-foreground">Overall Rating</span>
							<div class="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
								<div class="flex items-center gap-1">
									{#each { length: 5 } as _, i}
										<Button
											variant="plain"
											class="h-11 w-11 p-0"
											aria-label="Rate {i + 1} {i === 0 ? 'star' : 'stars'}"
											aria-pressed={productState.select !== null && productState.select === i + 1}
											onclick={() => productState.onSelect(i + 1)}
										>
											<Star
												fill={productState.select !== null && productState.select >= i + 1 ? 'currentColor' : 'none'}
												strokeWidth={1.5}
												class="!h-9 !w-9 transition-colors {productState.select !== null && productState.select >= i + 1
													? 'text-primary'
													: 'text-muted-foreground'}"
											/>
										</Button>
									{/each}
								</div>
								{#if productState.select !== null}
									<div
										class="rounded-full px-4 py-1.5 text-xs font-black ring-1 ring-inset {ratingLabels[productState.select - 1].color
											.replace('text-', 'bg-')
											.replace('-500', '-50')} {ratingLabels[productState.select - 1].color}"
										in:scale={{ start: 0.9, duration: 200 }}
									>
										{ratingLabels[productState.select - 1].text}
									</div>
								{/if}
							</div>
						</div>

						<!-- Review Message -->
						<div class="space-y-3">
							<label for="review" class="block text-base font-bold text-foreground">Your Story</label>
							<Textarea
								id="review"
								placeholder="What did you love? What could be better? We're all ears."
								bind:value={productState.reviewMessage}
								class="min-h-[130px] rounded-md border-2 border-border p-4 text-base focus:ring-0"
							/>
						</div>

						<!-- Photos -->
						<div class="space-y-3">
							<span class="block text-base font-bold text-foreground"
								>Add Photos <span class="text-sm font-normal text-muted-foreground">(optional, up to 5)</span></span
							>
							<div class="flex flex-wrap gap-3">
								{#each pendingPhotos as photo, i}
									<div class="relative aspect-square w-20 overflow-hidden rounded-md ring-1 ring-border">
										<img src={photo.preview} alt="Selected review upload {i + 1}" class="h-full w-full object-cover" />
										<button
											class="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white"
											onclick={() => removePendingPhoto(i)}
											aria-label="Remove photo {i + 1}"
										>
											<X class="h-3 w-3" />
										</button>
									</div>
								{/each}
								{#if pendingPhotos.length < 5}
									<label
										class="flex aspect-square w-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-md border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
									>
										<Camera class="h-5 w-5" />
										<span class="text-[10px] font-semibold">Add</span>
										<input type="file" accept="image/*" multiple class="sr-only" onchange={onPhotosPicked} />
									</label>
								{/if}
							</div>
						</div>
					</div>
				</div>

				<div class="border-t border-border bg-background/80 px-6 py-4 backdrop-blur-md sm:px-8 sm:py-5">
					<div class="flex items-center justify-end gap-3">
						<Button variant="ghost" onclick={() => (productState.showReviewForm = false)} class="h-11 px-5">Discard</Button>
						<Button disabled={productState.select === null || !productState.reviewMessage || submitting} class="h-11 px-8" onclick={submitReview}>
							{submitting ? 'Posting…' : 'Post Review'}
						</Button>
					</div>
				</div>
			</div>
		</div>
	{/if}
{/if}

<style>
	/* Refined Editorial — default theme only. */
	:global([data-theme='default'] .edp-rev) {
		border-top: 1px solid var(--ed-line);
		padding-top: clamp(32px, 5vw, 56px);
		margin-top: clamp(32px, 5vw, 56px);
	}

	:global([data-theme='default'] .edp-rev-title) {
		font-family: var(--ed-display);
		font-weight: 500;
		letter-spacing: -0.01em;
		font-size: clamp(1.8rem, 3vw, 2.4rem);
		color: var(--ed-ink);
		border-color: var(--ed-line);
	}

	:global([data-theme='default'] .edp-rev-score) {
		font-family: var(--ed-display);
		font-weight: 500;
		color: var(--ed-ink);
	}

	:global([data-theme='default'] .edp-rev-photo) {
		border-radius: var(--ed-radius);
	}
</style>
