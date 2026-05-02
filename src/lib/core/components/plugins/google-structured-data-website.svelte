<script lang="ts">
	let {
		name,
		url,
		description,
		searchUrl
	}: {
		name?: string
		url?: string
		description?: string
		searchUrl?: string
	} = $props()

	let websiteSchema = $state<string>('')

	$effect(() => {
		if (name && url && searchUrl) {
			websiteSchema = JSON.stringify(
				{
					'@context': 'https://schema.org',
					'@type': 'WebSite',
					name,
					url,
					...(description && { description }),
					potentialAction: {
						'@type': 'SearchAction',
						target: {
							'@type': 'EntryPoint',
							urlTemplate: searchUrl
						},
						'query-input': 'required name=search_term_string'
					}
				},
				null,
				2
			)
		}
	})
</script>

<svelte:head>
	{#if websiteSchema}
		<script type="application/ld+json">
			{@html websiteSchema}
		</script>
	{/if}
</svelte:head>
