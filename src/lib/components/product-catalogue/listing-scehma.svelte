<script lang="ts">
  import { GoogleStructuredDataProductsList, GoogleStructuredFaqSchema } from '@misiki/kitcommerce-core/components'

	import { page } from '$app/state'

	const { products = [] } = $props()

	const mappedProducts = $derived(
		products?.map((p: any) => ({
			url: `${page.url.origin}/products/${p.slug}`,
			name: p.name || p.title,
			image: p.images || [p.thumbnail],
			description: p.description || p.metaDescription || '',
			brandName: p.brandName || page.data.store?.name || 'JewelWeSell',
			manufacturer: p.manufacturer || '',
			material: p.material || '',
			offers: {
				url: `${page.url.origin}/products/${p.slug}`,
				priceCurrency: page.data.store?.currency?.code || 'USD',
				price: p.price,
				availability: p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
				shippingDetails: p.shippingDetails,
				hasMerchantReturnPolicy: p.hasMerchantReturnPolicy
			}
		}))
	)

	const listingFaqs = [
		{
			question: 'What is your return policy?',
			answer:
				'We offer an easy 7-day return policy on all our products. Items must be in their original condition.'
		},
	]

</script>

<GoogleStructuredDataProductsList products={mappedProducts} />
<GoogleStructuredFaqSchema faqs={listingFaqs} />
<!-- <GoogleStructuredServiceSchema
	serviceName="Luxury Custom Jewelry Design"
	serviceDescription="Experience the art of bespoke jewelry design. From engagement rings to statement pieces, we bring your vision to life with unparalleled craftsmanship."
/> -->
