<script lang="ts">
	let {
		products
	}: {
		products: {
			url: string
			name: string
			image: string[]
			description: string
			brandName: string
			manufacturer: string
			material: string
			offers: {
				url: string
				priceCurrency: string
				price: number
				availability: string
			}
		}[]
	} = $props()

	let productsListSchema = $state<string>('')

	$effect(() => {
		if (products) {
			productsListSchema = JSON.stringify(
				{
					'@context': 'https://schema.org',
					'@type': 'ItemList',
					itemListElement: products?.map((product, index) => {
						return {
							'@type': 'ListItem',
							position: index + 1,
							item: {
								'@type': 'Product',
								url: product?.url,
								name: product?.name,
								image: product?.image,
								description: product?.description,
								'brand.name': product?.brandName,
								manufacturer: product?.manufacturer,
								material: product?.material,
								offers: {
									'@type': 'Offer',
									url: product?.offers?.url,
									priceCurrency: product?.offers?.priceCurrency,
									price: product?.offers?.price,
									availability: product?.offers?.availability,
									shippingDetails: {
										'@type': 'OfferShippingDetails',
										shippingDestination: {
											'@type': 'Country',
											name: product?.offers?.shippingDetails?.shippingDestination?.name
										},
										shippingRate: {
											'@type': 'MonetaryAmount',
											currency: product?.offers?.priceCurrency,
											value: product?.offers?.shippingDetails?.shippingRate?.value
										}
									},
									hasMerchantReturnPolicy: {
										'@type': 'MerchantReturnPolicy',
										merchantReturnDays: product?.offers?.hasMerchantReturnPolicy?.merchantReturnDays,
										merchantReturnLink: product?.offers?.hasMerchantReturnPolicy?.merchantReturnLink
									}
								}
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
    ${productsListSchema}
	</script>`}
</svelte:head>
