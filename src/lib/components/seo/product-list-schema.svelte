<script lang="ts">
	import { page } from '$app/state'
	import StructuredData from './structured-data.svelte'
	import { availabilityUrl, cleanSchemaText } from './schema.js'

	// ItemList JSON-LD for a list of products (listing pages, homepage featured grid).
	//
	// Built in-repo rather than delegating to GoogleStructuredDataProductsList, which emits a
	// flat `'brand.name'` string key (not a schema.org property, so brand is simply absent),
	// a bare-string `manufacturer` where an Organization is required, and unconditional
	// OfferShippingDetails / MerchantReturnPolicy husks with none of their required
	// properties — guaranteed validation errors on every Offer.
	const { products = [] }: { products?: any[] } = $props()

	const toImages = (p: any): string[] => {
		if (Array.isArray(p?.images)) return p.images.filter(Boolean)
		if (typeof p?.images === 'string')
			return p.images
				.split(',')
				.map((i: string) => i.trim())
				.filter(Boolean)
		return [p?.thumbnail].filter(Boolean)
	}

	const schema = $derived.by(() => {
		if (!products?.length) return ''
		const origin = page.url.origin
		const storeName = page.data.store?.name
		const currency = page.data.store?.currency?.code || 'USD'

		return {
			'@context': 'https://schema.org',
			'@type': 'ItemList',
			itemListElement: products.map((p: any, index: number) => {
				const url = `${origin}/products/${p?.slug}`
				const brandName = p?.brandName || p?.vendor?.businessName || storeName
				const manufacturer = p?.manufacturer || p?.vendor?.businessName || storeName
				const material = p?.material || p?.specifications?.material
				const description = cleanSchemaText(p?.description || p?.metaDescription)
				// Only emit shipping/return nodes when the API actually carries them; the
				// type-only shell is worse than silence.
				const shippingDetails = p?.shippingDetails || p?.offers?.shippingDetails
				const returnPolicy = p?.hasMerchantReturnPolicy || p?.offers?.hasMerchantReturnPolicy

				return {
					'@type': 'ListItem',
					position: index + 1,
					item: {
						'@type': 'Product',
						url,
						name: p?.title || p?.name,
						image: toImages(p),
						...(description ? { description } : {}),
						...(brandName ? { brand: { '@type': 'Brand', name: brandName } } : {}),
						...(manufacturer
							? { manufacturer: { '@type': 'Organization', name: manufacturer } }
							: {}),
						...(material ? { material } : {}),
						offers: {
							'@type': 'Offer',
							url,
							priceCurrency: currency,
							price: p?.price,
							availability: availabilityUrl(p?.stock),
							...(shippingDetails
								? { shippingDetails: { '@type': 'OfferShippingDetails', ...shippingDetails } }
								: {}),
							...(returnPolicy
								? { hasMerchantReturnPolicy: { '@type': 'MerchantReturnPolicy', ...returnPolicy } }
								: {})
						}
					}
				}
			})
		}
	})
</script>

<StructuredData {schema} />
