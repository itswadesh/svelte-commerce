<script lang="ts">
	import LoginModal from '$lib/components/auth/login-modal.svelte'
	import EnquiryModal from '$lib/core/components/plugins/enquiry-modal.svelte'
	import { GoogleStructuredDataBreadcrumb, GoogleStructuredVideoSchema } from '$lib/core/components/index.js'
	import SeoHeader from '$lib/components/seo/seo-header.svelte'
	import StructuredData from '$lib/components/seo/structured-data.svelte'
	import { availabilityUrl } from '$lib/components/seo/schema.js'
	import PincodeCheck from '$lib/components/product-catalogue/pincode-check.svelte'
	import Breadcrumb from '$lib/components/ui/breadcrumb.svelte'
	import { useProductState } from '$lib/core/composables/index.js'
	import { Truck } from '@lucide/svelte'
	import ProductAggregation from './product-aggregation.svelte'
	import ProductCartAndWishlistButtons from './product-cart-and-wishlist-buttons.svelte'
	import ProductDescription from './product-description.svelte'
	import ProductGallerySection from './product-gallery-section.svelte'
	import ProductMetaDataSection from './product-meta-data-section.svelte'
	import ProductPricing from './product-pricing.svelte'
	import ProductReviewsSection from './product-reviews-section.svelte'
	import ProductSpecifications from './product-specifications.svelte'
	import ProductTags from './product-tags.svelte'
	import ProductTitleSection from './product-title-section.svelte'
	import ProductVariation from './product-variation.svelte'
	import RelatedProducts from './related-products.svelte'
	import StoreCheck from './store-check.svelte'
	import { page } from '$app/state'
	import { Button } from '$lib/components/ui/button/index.js'

	const productState = useProductState()
	const data = $derived(page.data)
	const showPincodeCheck = $derived(productState.wareHousePluginEnabled && productState.isIndianPincodesPluginEnabled)

	/** Strip HTML tags and collapse whitespace; returns '' for placeholder-only values like "-". */
	const cleanHtmlText = (value: string | null | undefined): string => {
		const text = String(value ?? '')
			.replace(/<[^>]*>/g, ' ')
			.replace(/\s+/g, ' ')
			.trim()
		return /^[\s\-–—._,]*$/.test(text) ? '' : text
	}

	const storeName = $derived(data?.store?.name || '')

	// This is a white-label template: the merchant's own name comes from store settings, and no
	// delivery/returns promise is made on their behalf unless their own copy says so.
	const metaTitle = $derived(data?.product?.metaTitle || [data?.product?.title, storeName].filter(Boolean).join(' | '))

	// Feed data sometimes carries placeholder descriptions ("-"); never surface them in meta tags.
	// When a product has no copy of its own, fall through to SeoHeader's store-level default
	// rather than repeating one boilerplate sentence across the whole catalogue.
	const metaDescription = $derived.by(() => {
		const provided = cleanHtmlText(data?.product?.metaDescription)
		if (provided) return provided
		const description = cleanHtmlText(data?.product?.description)
		if (data?.product?.title && description) {
			return `${data.product.title}. ${description}`.slice(0, 300).trim()
		}
		return ''
	})

	// Video URLs mixed into the product image list (YouTube or hosted mp4/webm) get a VideoObject schema.
	const productVideoUrls = $derived(
		productState.productImagesArray?.filter(
			(img: string) => img.includes('youtube.com') || img.includes('youtu.be') || img.endsWith('.mp4') || img.endsWith('.webm')
		) || []
	)

	// GA4 view_item — fires once per product (also on client-side navigation). Reads
	// window.gtag at call time (defined by the GoogleAnalytics loader in the root layout,
	// driven by the store's googleTagManager plugin); safe no-op when analytics is off.
	const trackViewItem = (p: Record<string, any>, currency?: string) => {
		if (typeof window === 'undefined') return
		const g = (window as any).gtag
		if (typeof g !== 'function') return
		try {
			g('event', 'view_item', {
				currency,
				value: p?.price,
				items: [
					{
						item_id: p?.sku ?? p?.id,
						item_name: p?.title ?? p?.name,
						item_brand: p?.brandName ?? p?.brand?.name,
						item_category: p?.category?.name ?? p?.category,
						price: p?.price,
						quantity: 1,
						...(currency ? { currency } : {})
					}
				]
			})
		} catch {
			/* never let analytics break the app */
		}
	}

	let lastViewedProductId = ''
	$effect(() => {
		const p = page.data.product
		if (p?.id && p.id !== lastViewedProductId) {
			lastViewedProductId = p.id
			trackViewItem(p, page.data.store?.currency?.code)
		}
	})

	const priceValidUntil = new Date(Date.now() + 100 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

	// Product JSON-LD, built here from SSR load data.
	//
	// `productState.structuredData` is assembled inside a `$effect` in the core composable, and
	// `$effect` never runs during SSR — so the server-rendered ld+json was an empty husk for every
	// product (no name, no price, no availability) for every non-JS crawler. A `$derived` off
	// `data.product` is server-visible. It also lets the fields the page already has actually
	// reach the markup: gtin13 (barcode), weight, category and the real customer reviews.
	const productSchema = $derived.by(() => {
		const p = data?.product
		if (!p) return ''

		const images = p.images
			? String(p.images)
					.split(',')
					.map((i: string) => i.trim())
					.filter(Boolean)
			: [p.thumbnail].filter(Boolean)

		const ratings: any[] = p.ratings ?? []
		const scored = ratings.filter((r: any) => Number(r?.rating) > 0)
		const reviewCount = Number(p.reviewCount) || scored.length
		const ratingValue =
			Number(p.rating) || (scored.length ? Math.round((scored.reduce((a: number, r: any) => a + Number(r.rating), 0) / scored.length) * 10) / 10 : 0)

		const description = cleanHtmlText(p.description)
		const brandName = p.brandName || storeName
		const category = p.category?.name || (typeof p.category === 'string' ? p.category : '')
		const weightUnit = data?.store?.weight_unit

		return {
			'@context': 'https://schema.org/',
			'@type': 'Product',
			name: p.title,
			image: images,
			...(description ? { description } : {}),
			...(p.sku ? { sku: p.sku } : {}),
			...(p.barcode ? { gtin13: String(p.barcode) } : {}),
			...(category ? { category } : {}),
			...(p.weight
				? {
						weight: {
							'@type': 'QuantitativeValue',
							value: p.weight,
							...(weightUnit ? { unitText: weightUnit } : {})
						}
					}
				: {}),
			...(brandName ? { brand: { '@type': 'Brand', name: brandName } } : {}),
			// Never fabricate stars: an aggregateRating is emitted only when there is a real one.
			...(reviewCount > 0 && ratingValue > 0
				? {
						aggregateRating: {
							'@type': 'AggregateRating',
							ratingValue,
							reviewCount,
							ratingCount: reviewCount
						}
					}
				: {}),
			...(scored.length
				? {
						review: scored.map((r: any) => ({
							'@type': 'Review',
							...(r?.name ? { author: { '@type': 'Person', name: r.name } } : {}),
							...(r?.createdAt ? { datePublished: r.createdAt } : {}),
							...(cleanHtmlText(r?.review) ? { reviewBody: cleanHtmlText(r.review) } : {}),
							reviewRating: {
								'@type': 'Rating',
								ratingValue: Number(r.rating),
								bestRating: 5,
								worstRating: 1
							}
						}))
					}
				: {}),
			offers: {
				'@type': 'Offer',
				url: page.url.href,
				priceCurrency: data?.store?.currency?.code,
				price: p.price,
				availability: availabilityUrl(p.stock),
				priceValidUntil,
				// Emitted only when the API carries them — a type-only husk with none of the
				// required properties is a validation error, not a partial win.
				...(p.shippingDetails ? { shippingDetails: { '@type': 'OfferShippingDetails', ...p.shippingDetails } } : {}),
				...(p.hasMerchantReturnPolicy
					? {
							hasMerchantReturnPolicy: {
								'@type': 'MerchantReturnPolicy',
								...p.hasMerchantReturnPolicy
							}
						}
					: {})
			}
		}
	})
</script>

<SeoHeader {metaTitle} {metaDescription} metaKeywords={data?.product?.keywords || ''} image={data?.product?.thumbnail || ''} />

<StructuredData schema={productSchema} />

<!-- Hand the raw hierarchy over: the core component maps `${origin}/${slug}` for every crumb,
     including the leaf. Pre-mapping into `breadcrumbs` here previously produced
     `https://example.compendant` (no separator) and dropped the last crumb entirely, so
     single-category products emitted no BreadcrumbList at all. -->
<GoogleStructuredDataBreadcrumb categoryHierarchy={data?.product?.categoryHierarchy || []} />

{#if data?.product}
	{#each productVideoUrls as videoUrl}
		<GoogleStructuredVideoSchema
			name={data.product.title}
			description={cleanHtmlText(data.product.description) || data.product.title}
			thumbnailUrl={data.product.thumbnail}
			uploadDate={data.product.updatedAt || new Date().toISOString()}
			embedUrl={videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be') ? videoUrl : undefined}
			contentUrl={videoUrl.endsWith('.mp4') || videoUrl.endsWith('.webm') ? videoUrl : undefined}
		/>
	{/each}
{/if}

<!-- <ProductRenderer bind:data>
{#snippet content(productState)} -->
<div class="intra-pt page-width hidden md:block">
	<Breadcrumb categoryHierarchy={data?.product?.categoryHierarchy} />
</div>

<div class="page-width intra-gap edp-root flex flex-col">
	{#if !data?.product && !productState.isLoading}
		<div class="flex h-96 flex-col items-center justify-center space-y-4">
			<h2 class="page-heading edp-empty-title">Product not found</h2>
			<a href="/products" class="edp-empty-link text-sm font-bold uppercase tracking-widest text-primary underline underline-offset-4"
				>Browse All Products</a
			>
		</div>
	{:else}
		<div class="inter-gap edp-grid relative grid grid-cols-1 items-start lg:grid-cols-2">
			<div class="col-span-1 sm:mt-0">
				<ProductGallerySection />
			</div>

			<div class="block md:hidden">
				<Breadcrumb categoryHierarchy={data?.product?.categoryHierarchy} />
			</div>

			<div class="intra-gap edp-buybox top-28 mx-0 flex flex-col space-y-0 lg:pl-6">
				<ProductTitleSection product={data?.product} />

				<ProductPricing />

				<ProductAggregation />

				<div class="intra-gap flex flex-col">
					<ProductVariation />

					<!-- Desktop Cart Button -->
					<div class="intra-gap mt-2 hidden flex-col sm:flex">
						<ProductCartAndWishlistButtons />
					</div>

					{#if showPincodeCheck}
						<div class="intra-gap intra-pt flex flex-col border-t">
							<div class="intra-gap flex items-center justify-start">
								<Truck class="size-4 text-gray-900" />
								<span class="text-sm text-gray-900"> Delivery Options </span>
							</div>
							<PincodeCheck />
						</div>
					{:else}
						<!-- Fallback delivery estimate when plugin is not enabled -->
						<!-- <div class="intra-gap border-t border-gray-100 intra-pt flex flex-col">
							<div class="flex items-center gap-2">
								<Truck class="size-4 text-gray-900" />
								<span class="text-base font-bold text-gray-900">Delivery Information</span>
							</div>
							<div class="space-y-1">
								<p class="text-sm font-medium text-gray-700">Free delivery on orders above ₹999</p>
								<p class="text-[11px] font-bold uppercase tracking-tight text-gray-400">
									Estimated delivery: 5-7 business days
								</p>
							</div>
						</div> -->
					{/if}

					{#if productState.trustBadgesPlugin?.active}
						<div class="intra-pt border-t border-gray-100">
							{@html productState.trustBadgesPlugin?.html}
						</div>
					{/if}

					{#if productState.returnPlugin && productState.returnPlugin?.active && productState.returnPlugin?.html}
						<div class="">
							<h3 class="mb-2 text-base font-bold text-gray-900">Returns & Exchanges</h3>
							<div class="text-sm leading-relaxed text-gray-600 {!productState.showReturnPolicy ? 'line-clamp-2 overflow-hidden' : ''}">
								{@html productState.returnPlugin?.html}
							</div>

							{#if productState.returnPlugin?.below_more}
								<Button variant="link" class="mt-1 h-auto p-0" onclick={() => (productState.showReturnPolicy = !productState.showReturnPolicy)}>
									{productState.showReturnPolicy ? 'Show Less' : 'Read Full Policy'}
								</Button>
							{/if}
						</div>
					{:else}
						<!-- Fallback return policy when plugin is not configured -->
						<!-- <div class="">
							<h3 class="mb-2 text-base font-bold text-gray-900">Returns & Exchanges</h3>
							<p class="text-sm leading-relaxed text-gray-600">
								We accept returns within 7 days of delivery for unused items in original packaging.
							</p>
						</div> -->
					{/if}

					<div class="">
						<StoreCheck />
						<ProductSpecifications />
						<ProductDescription />
					</div>

					<ProductMetaDataSection />
				</div>

				<ProductTags />
			</div>
		</div>
	{/if}

	<ProductReviewsSection />

	<div class="">
		<RelatedProducts />
	</div>
</div>

<!-- Mobile cart button - Sticky Footer -->
<div
	class="edp-mobilebar sticky inset-x-0 bottom-0 flex w-full items-center gap-3 border-t border-gray-100 bg-white/95 p-page shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] backdrop-blur-md sm:hidden"
>
	<div class="intra-gap flex flex-1 flex-col">
		<ProductCartAndWishlistButtons showWishlist={false} />
	</div>
</div>

<LoginModal bind:show={productState.showLoginModal} />

<EnquiryModal
	isOpen={productState.showEnquiryModal}
	productId={data?.product?.id}
	productTitle={data?.product?.title}
	onClose={() => (productState.showEnquiryModal = false)}
/>

<!-- {/snippet}
</ProductRenderer> -->

<style>
	/* Refined Editorial — default theme only. Route component renders for all themes,
	   so every rule is gated under [data-theme='default']. */
	:global([data-theme='default'] .edp-grid) {
		column-gap: clamp(28px, 5vw, 72px);
		row-gap: 18px;
	}

	@media (min-width: 1024px) {
		:global([data-theme='default'] .edp-buybox) {
			padding-left: clamp(16px, 3vw, 44px);
		}
	}

	:global([data-theme='default'] .edp-mobilebar) {
		background: var(--ed-surface);
		border-top: 1px solid var(--ed-line);
		box-shadow: 0 -6px 24px -14px rgba(27, 26, 23, 0.22);
		backdrop-filter: none;
	}

	:global([data-theme='default'] .edp-empty-title) {
		font-family: var(--ed-display);
		font-weight: 500;
		letter-spacing: -0.01em;
		font-size: clamp(1.8rem, 4vw, 2.6rem);
		color: var(--ed-ink);
	}

	:global([data-theme='default'] .edp-empty-link) {
		color: var(--ed-ink);
		text-transform: uppercase;
		letter-spacing: 0.14em;
		font-size: 0.76rem;
		text-decoration: none;
		border-bottom: 1px solid var(--ed-ink);
		padding-bottom: 2px;
	}
</style>
