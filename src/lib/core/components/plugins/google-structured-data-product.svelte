<script lang="ts">
	let {
		product
	}: {
		product: {
			name: string
			image: string
			description: string
			sku: string
			brandName: string
			aggregateRating: {
				reviewRating: number
				reviewCount: number
			}
			url: string
			priceCurrency: string
			price: number
			availability: string
		}
	} = $props()

	let productSchema = $state<string>('')
	let _100DaysFromNow = new Date(Date.now() + 100 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

	$effect(() => {
		if (product) {
			productSchema = JSON.stringify(
				{
					'@context': 'https://schema.org/',
					'@type': 'Product',
					name: product?.name,
					image: product?.image,
					description: product?.description,
					sku: product?.sku,
					brand: {
						'@type': 'Brand',
						name: product?.brandName
					},
					aggregateRating: {
						'@type': 'AggregateRating',
						ratingValue: product?.aggregateRating?.reviewRating || 5,
						ratingCount: product?.aggregateRating?.reviewCount || 1,
						reviewCount: product?.aggregateRating?.reviewCount ? undefined : product?.aggregateRating?.reviewCount || 1
					},
					offers: {
						'@type': 'Offer',
						url: product?.url,
						priceCurrency: product?.priceCurrency,
						price: product?.price,
						availability: product?.availability,
						priceValidUntil: product?.priceValidUntil || _100DaysFromNow
					},
					review: product?.reviews?.map?.((r: any) => {
						return {
							'@type': 'Review',
							author: r?.author,
							datePublished: r?.datePublished,
							reviewBody: r?.reviewBody,
							name: r?.name,
							reviewRating: {
								'@type': 'Rating',
								bestRating: r?.reviewRating?.bestRating || '5',
								ratingValue: r?.reviewRating?.ratingValue || '5',
								worstRating: r?.reviewRating?.worstRating || '1'
							}
						}
					})
				},
				null,
				2
			)
		}
	})
</script>

<svelte:head>
	{@html `<script type="application/ld+json">
    ${productSchema}
	</script>`}
</svelte:head>
