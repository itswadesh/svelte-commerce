<script lang="ts">
	import LoginModal from '$lib/components/auth/login-modal.svelte'
	import EnquiryModal from '$lib/core/components/plugins/enquiry-modal.svelte'
	import { GoogleStructuredDataBreadcrumb } from '$lib/core/components/index.js'
	import SeoHeader from '$lib/components/seo/seo-header.svelte'
	import StructuredData from '$lib/components/seo/structured-data.svelte'
	import { stockAvailabilityUrl } from '$lib/components/seo/schema.js'
	import { RETURN_WINDOW_DAYS } from '$lib/config/policy'
	import PincodeCheck from '$lib/components/product-catalogue/pincode-check.svelte'
	import Breadcrumb from '$lib/components/ui/breadcrumb.svelte'
	import PolicyLink from '$lib/components/common/policy-link.svelte'
	import { useProductState } from '$lib/core/composables/index.js'
	import { RotateCcw, Truck } from '@lucide/svelte'
	import ProductAggregation from './product-aggregation.svelte'
	import ProductAvailability from './product-availability.svelte'
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
	import { fly } from '$lib/motion'

	const productState = useProductState()
	const data = $derived(page.data)
	const showPincodeCheck = $derived(productState.wareHousePluginEnabled && productState.isIndianPincodesPluginEnabled)

	// Delivery and returns are stated only where the merchant has actually published the policy.
	// The commented-out fallbacks this replaces promised free delivery over ₹999 and a 7-day
	// return window on every store in every currency; `cmsPages` is the list the root layout
	// resolved from the backend, so an unpublished policy is simply not offered.
	const publishedCmsPages = $derived<string[]>(data?.cmsPages ?? [])
	const hasShippingPolicy = $derived(publishedCmsPages.includes('shipping-policy'))
	const hasRefundPolicy = $derived(publishedCmsPages.includes('refund-policy'))

	// The sticky mobile purchase bar, revealed only after the in-flow Add to bag has scrolled out
	// of view — never from first paint, which is what the rule forbids, and never on a viewport
	// that renders the in-flow CTA anyway (two copies of the CTA in one document would also give
	// the add-to-cart test hook two matches).
	let inFlowCta = $state<HTMLElement | null>(null)
	let ctaOnScreen = $state(true)
	let isCompactViewport = $state(false)

	$effect(() => {
		const mq = window.matchMedia('(max-width: 639px)')
		const sync = () => (isCompactViewport = mq.matches)
		sync()
		mq.addEventListener('change', sync)
		return () => mq.removeEventListener('change', sync)
	})

	$effect(() => {
		const el = inFlowCta
		if (!el || typeof IntersectionObserver === 'undefined') return
		const observer = new IntersectionObserver((entries) => (ctaOnScreen = entries[0]?.isIntersecting ?? true))
		observer.observe(el)
		return () => observer.disconnect()
	})

	const showStickyBar = $derived(isCompactViewport && !ctaOnScreen)

	// A fixed layer covers whatever is under it, and at the foot of the page that is the footer.
	// The document gets exactly the bar's own height back as padding for as long as it is on
	// screen, measured rather than guessed so the reserve always matches.
	let stickyBarEl = $state<HTMLElement | null>(null)

	$effect(() => {
		const el = stickyBarEl
		if (!showStickyBar || !el) return
		const previous = document.body.style.paddingBottom
		document.body.style.paddingBottom = `${el.offsetHeight}px`
		return () => {
			document.body.style.paddingBottom = previous
		}
	})

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

	/*
	 * Structured data, derived from the load data alone so it is in the server-rendered HTML.
	 * `productState.structuredData` is assembled inside a `$effect` in the core composable, and
	 * `$effect` never runs during SSR, so it cannot be the source.
	 */
	const productUrl = $derived(page.url.origin + page.url.pathname)
	const currencyCode = $derived(data?.store?.currency?.code)

	// The gallery field mixes images and videos (YouTube or Vimeo links, hosted video files). Schema
	// `image` must list image files only; the videos get their own VideoObject below.
	const EMBED_URL = /youtube\.com|youtu\.be|vimeo\.com/i
	const VIDEO_FILE = /\.(mp4|webm|mov|m4v|ogv)(\?|#|$)/i
	const isVideo = (url: string) => VIDEO_FILE.test(url) || EMBED_URL.test(url)
	const splitMedia = (value: unknown): string[] =>
		String(value || '')
			.split(',')
			.map((m) => m.trim())
			.filter(Boolean)
	const productMedia = $derived(splitMedia(data?.product?.images))
	const productImages = $derived.by(() => {
		const images = productMedia.filter((m) => !isVideo(m))
		return images.length ? images : [data?.product?.thumbnail].filter(Boolean)
	})
	const productVideos = $derived([...new Set(productMedia.filter(isVideo))])

	// Destinations and rates come from the store's own shipping zones, so the markup states what
	// checkout charges. A zone counts only when it and one of its rates are active and it names at
	// least one country.
	const shippingZones = $derived<{ rate: any; countries: string[] }[]>(
		(data?.store?.shippingZones || []).flatMap((zone: any) => {
			const rate = zone?.active ? zone.shippingRates?.find((r: any) => r?.active) : null
			const countries: string[] = (zone?.countries || []).map((c: any) => c?.countryCode).filter(Boolean)
			return rate && countries.length ? [{ rate, countries }] : []
		})
	)
	const shippingCountries = $derived([...new Set(shippingZones.flatMap((zone) => zone.countries))])
	const shippingDetails = $derived(
		shippingZones.map(({ rate, countries }) => ({
			'@type': 'OfferShippingDetails',
			shippingDestination: countries.map((addressCountry) => ({ '@type': 'DefinedRegion', addressCountry })),
			// Only a rate that does not depend on the cart (its weight, its value, a free-shipping
			// threshold) can be stated for one product; any other rate is left out.
			...(!Number(rate.ratePerWeight) && !Number(rate.ratePerPrice) && !Number(rate.freeShippingThreshold)
				? {
						shippingRate: {
							'@type': 'MonetaryAmount',
							value: Number(rate.baseRate || 0) + Number(rate.handlingFee || 0),
							currency: currencyCode
						}
					}
				: {}),
			// The rate carries its transit estimate; the store records no handling time, so none is stated.
			...(rate.estimatedMinDays != null && rate.estimatedMaxDays != null
				? {
						deliveryTime: {
							'@type': 'ShippingDeliveryTime',
							transitTime: {
								'@type': 'QuantitativeValue',
								minValue: Number(rate.estimatedMinDays),
								maxValue: Number(rate.estimatedMaxDays),
								unitCode: 'DAY'
							}
						}
					}
				: {})
		}))
	)

	// Stated only when the store publishes a refund policy, the same rule the purchase panel follows
	// for its returns link. The window comes from src/lib/config/policy.ts.
	const returnPolicy = $derived(
		hasRefundPolicy
			? {
					'@type': 'MerchantReturnPolicy',
					applicableCountry: shippingCountries.length ? shippingCountries : data?.store?.country?.iso2,
					returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
					merchantReturnDays: RETURN_WINDOW_DAYS,
					merchantReturnLink: `${page.url.origin}/refund-policy`
				}
			: undefined
	)

	// Shipping and returns the API carries for the product itself win over the store-level ones.
	const offerFor = (item: { url: string; price?: number; availability: string }) => {
		const p = data?.product
		const shipping = p?.shippingDetails
			? { '@type': 'OfferShippingDetails', ...p.shippingDetails }
			: shippingDetails.length
				? shippingDetails
				: undefined
		const returns = p?.hasMerchantReturnPolicy ? { '@type': 'MerchantReturnPolicy', ...returnPolicy, ...p.hasMerchantReturnPolicy } : returnPolicy
		return {
			'@type': 'Offer',
			url: item.url,
			priceCurrency: currencyCode,
			price: item.price,
			availability: item.availability,
			priceValidUntil,
			itemCondition: 'https://schema.org/NewCondition',
			...(shipping ? { shippingDetails: shipping } : {}),
			...(returns ? { hasMerchantReturnPolicy: returns } : {})
		}
	}

	// Variant axes, limited to the ones Google accepts in variesBy, and only when the product's
	// options actually name one.
	type Axis = 'size' | 'color' | 'material'
	const AXES: [RegExp, Axis][] = [
		[/size/i, 'size'],
		[/colou?r/i, 'color'],
		[/metal|material/i, 'material']
	]
	const axisOf = (name: unknown) => AXES.find(([re]) => re.test(String(name ?? '')))?.[1]
	const optionAxes = $derived<(readonly [string, Axis])[]>(
		(data?.product?.options || []).flatMap((option: any) => {
			const axis = axisOf(option?.title)
			return axis ? [[option.id, axis] as const] : []
		})
	)

	// A product with more than one real variant is a ProductGroup. Its ID is the family's grouped SKU,
	// or the parent SKU, which stays the same whichever variant is selected. Each variant carries its
	// own name, SKU, URL, image and offer, with availability from the same rule as the Add to bag button.
	const productGroup = $derived.by(() => {
		const p = data?.product
		const variants = (p?.variants || []).filter((v: any) => v?.id && v.title && v.title !== 'default')
		const groupId = p?.groupedSku || p?.sku
		if (!groupId || variants.length < 2) return null
		return {
			productGroupID: String(groupId),
			...(optionAxes.length ? { variesBy: [...new Set(optionAxes.map(([, axis]) => `https://schema.org/${axis}`))] } : {}),
			hasVariant: variants.map((v: any) => {
				const url = `${productUrl}?variant_id=${v.id}`
				const image = v.thumbnail || v.img || splitMedia(v.images).find((m) => !isVideo(m))
				const axes = Object.fromEntries(
					optionAxes.flatMap(([optionId, axis]) => {
						const value = v.options?.find((o: any) => o?.optionId === optionId)?.value
						return value ? [[axis, value]] : []
					})
				)
				return {
					'@type': 'Product',
					name: v.title,
					...(v.sku ? { sku: String(v.sku) } : {}),
					...(v.barcode ? { gtin13: String(v.barcode) } : {}),
					image: image || productImages,
					...axes,
					url,
					offers: offerFor({ url, price: v.price ?? p.price, availability: stockAvailabilityUrl(v) })
				}
			})
		}
	})

	const productSchema = $derived.by(() => {
		const p = data?.product
		if (!p) return ''

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
			'@type': productGroup ? 'ProductGroup' : 'Product',
			'@id': `${productUrl}#product`,
			name: p.title,
			image: productImages,
			url: productUrl,
			...(description ? { description } : {}),
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
			...(productGroup ?? {
				...(p.sku ? { sku: p.sku } : {}),
				...(p.barcode ? { gtin13: String(p.barcode) } : {}),
				offers: offerFor({ url: productUrl, price: p.price, availability: stockAvailabilityUrl(p) })
			})
		}
	})

	// The catalogue keeps no per-video date, so the product's creation date is the only real upload
	// date a video can carry; without one no VideoObject is emitted.
	const videoSchemas = $derived(
		data?.product?.createdAt
			? productVideos.map((videoUrl) => ({
					'@context': 'https://schema.org',
					'@type': 'VideoObject',
					name: data.product.title,
					description: cleanHtmlText(data.product.description) || data.product.title,
					thumbnailUrl: data.product.thumbnail,
					uploadDate: data.product.createdAt,
					...(EMBED_URL.test(videoUrl) ? { embedUrl: videoUrl } : { contentUrl: videoUrl })
				}))
			: []
	)
</script>

<SeoHeader {metaTitle} {metaDescription} metaKeywords={data?.product?.keywords || ''} image={data?.product?.thumbnail || ''} />

<StructuredData schema={productSchema} />

<!-- Hand the raw hierarchy over: the core component maps `${origin}/${slug}` for every crumb,
     including the leaf. Pre-mapping into `breadcrumbs` here previously produced
     `https://example.compendant` (no separator) and dropped the last crumb entirely, so
     single-category products emitted no BreadcrumbList at all. -->
<GoogleStructuredDataBreadcrumb categoryHierarchy={data?.product?.categoryHierarchy || []} />

{#each videoSchemas as videoSchema}
	<StructuredData schema={videoSchema} />
{/each}

<!-- <ProductRenderer bind:data>
{#snippet content(productState)} -->
<div class="intra-pt page-width hidden md:block">
	<Breadcrumb categoryHierarchy={data?.product?.categoryHierarchy} />
</div>

<div class="page-width intra-gap edp-root flex flex-col">
	{#if !data?.product && !productState.isLoading}
		<div class="flex h-80 flex-col items-center justify-center gap-3">
			<h2 class="page-heading edp-empty-title">Product not found</h2>
			<a href="/products" class="edp-empty-link text-sm font-bold text-primary underline underline-offset-4">Browse all products</a>
		</div>
	{:else}
		<div class="inter-gap edp-grid relative grid grid-cols-1 items-start lg:grid-cols-2" data-testid="product-detail">
			<div class="col-span-1 sm:mt-0">
				<ProductGallerySection />
			</div>

			<div class="block md:hidden">
				<Breadcrumb categoryHierarchy={data?.product?.categoryHierarchy} />
			</div>

			<div class="intra-gap edp-buybox top-28 mx-0 flex flex-col lg:pl-6">
				<ProductTitleSection product={data?.product} />

				<ProductPricing />

				<ProductAvailability />

				<ProductAggregation />

				<ProductVariation />

				<!-- In flow on every viewport. The mobile CTA used to exist only inside the sticky
				     bar, which is why that bar had to be pinned from first paint. The wrapper exists
				     only as the IntersectionObserver target, so it sets no spacing of its own. -->
				<div bind:this={inFlowCta}>
					<ProductCartAndWishlistButtons />
				</div>

				{#if showPincodeCheck}
					<div class="flex flex-col gap-2 border-t pt-3">
						<div class="flex items-center gap-2">
							<Truck class="size-4 text-muted-foreground" />
							<span id="pdp-delivery-label" class="text-sm text-foreground">Delivery options</span>
						</div>
						<PincodeCheck />
					</div>
				{:else if hasShippingPolicy || hasRefundPolicy}
					<!-- No delivery plugin on this store, so nothing is promised on the merchant's
					     behalf: their own published policies are linked instead. -->
					<div class="flex flex-col gap-2 border-t pt-3 text-sm">
						{#if hasShippingPolicy}
							<p class="flex items-center gap-2 text-muted-foreground">
								<Truck class="size-4 shrink-0" aria-hidden="true" />
								<PolicyLink href="/shipping-policy" class="underline underline-offset-4 hover:text-foreground">Shipping and delivery</PolicyLink>
							</p>
						{/if}
						{#if hasRefundPolicy}
							<p class="flex items-center gap-2 text-muted-foreground">
								<RotateCcw class="size-4 shrink-0" aria-hidden="true" />
								<PolicyLink href="/refund-policy" class="underline underline-offset-4 hover:text-foreground">Returns and refunds</PolicyLink>
							</p>
						{/if}
					</div>
				{/if}

				{#if productState.trustBadgesPlugin?.active}
					<div class="border-t pt-3">
						{@html productState.trustBadgesPlugin?.html}
					</div>
				{/if}

				{#if productState.returnPlugin?.active && productState.returnPlugin?.html}
					<div>
						<h2 class="mb-1 text-sm font-semibold text-foreground">Returns and exchanges</h2>
						<div class="text-sm leading-relaxed text-muted-foreground {!productState.showReturnPolicy ? 'line-clamp-2 overflow-hidden' : ''}">
							{@html productState.returnPlugin?.html}
						</div>

						{#if productState.returnPlugin?.below_more}
							<Button variant="link" class="mt-1 h-auto p-0 text-sm" onclick={() => (productState.showReturnPolicy = !productState.showReturnPolicy)}>
								{productState.showReturnPolicy ? 'Show less' : 'Read full policy'}
							</Button>
						{/if}
					</div>
				{/if}

				<!-- The accordion stack is one region: each panel draws its own hairline rule, so the
				     column gap must not also apply between them. -->
				<div>
					<StoreCheck />
					<ProductSpecifications />
					<ProductDescription />
				</div>

				<ProductMetaDataSection />

				<ProductTags />
			</div>
		</div>
	{/if}

	<ProductReviewsSection />

	<RelatedProducts />
</div>

<!-- Mobile purchase bar. Fixed, not sticky: stuck to the last flow element it rendered mid-screen
     on short pages and left the viewport entirely at the foot of the page, which is exactly where
     a shopper who has read the description reaches for it. -->
{#if showStickyBar}
	<div
		bind:this={stickyBarEl}
		transition:fly={{ y: 24 }}
		class="edp-mobilebar fixed inset-x-0 bottom-0 z-sticky border-t bg-background px-4 py-3 shadow-z-2 sm:hidden"
	>
		<ProductCartAndWishlistButtons showWishlist={false} compact />
	</div>
{/if}

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
		/* Was clamp(28px, 5vw, 72px) — a 72px trench between the image and the buy box at 1440,
		   which pushed the purchase column toward the right edge and made the two halves read as
		   unrelated pages. 24-48px is the project's own gutter range. */
		column-gap: clamp(24px, 3.5vw, 48px);
		row-gap: 16px;
	}

	/* On top of the grid's own column gap this was a second, larger indent — 44px of padding
	   inside a 72px gutter. The gap belongs to the grid; the buy box only needs a hairline of
	   optical separation. */
	@media (min-width: 1024px) {
		:global([data-theme='default'] .edp-buybox) {
			padding-left: clamp(8px, 1.5vw, 20px);
		}
	}

	:global([data-theme='default'] .edp-mobilebar) {
		background: var(--ed-surface);
		border-top: 1px solid var(--ed-line);
	}

	:global([data-theme='default'] .edp-empty-title) {
		font-family: var(--ed-display);
		font-weight: 500;
		letter-spacing: -0.01em;
		/* An error state does not need a 41.6px display heading. */
		font-size: clamp(1.35rem, 2.4vw, 1.75rem);
		color: var(--ed-ink);
	}

	:global([data-theme='default'] .edp-empty-link) {
		color: var(--ed-ink);
		font-size: 0.75rem;
		text-decoration: none;
		border-bottom: 1px solid var(--ed-ink);
		padding-bottom: 2px;
	}
</style>
