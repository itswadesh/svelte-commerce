<script lang="ts">
	let {
		name,
		url,
		logo,
		description,
		sameAs = [],
		address,
		contactPoint
	}: {
		name?: string
		url?: string
		logo?: string
		description?: string
		sameAs?: string[]
		address?: {
			streetAddress?: string
			addressLocality?: string
			addressRegion?: string
			postalCode?: string
			addressCountry?: string
		}
		contactPoint?: {
			telephone?: string
			email?: string
			contactType?: string
		}
	} = $props()

	let organizationSchema = $state<string>('')

	$effect(() => {
		if (name && url) {
			organizationSchema = JSON.stringify(
				{
					'@context': 'https://schema.org',
					'@type': 'Organization',
					name,
					url,
					...(logo && { logo }),
					...(description && { description }),
					...(sameAs && sameAs.length > 0 && { sameAs }),
					...(address && {
						address: {
							'@type': 'PostalAddress',
							...address
						}
					}),
					...(contactPoint && {
						contactPoint: {
							'@type': 'ContactPoint',
							...contactPoint
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
	{#if organizationSchema}
		<script type="application/ld+json">
			{@html organizationSchema}
		</script>
	{/if}
</svelte:head>
