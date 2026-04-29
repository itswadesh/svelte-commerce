<script lang="ts">
	let { breadcrumbs = [] }: { breadcrumbs: Array<{ name: string; item?: string }> } = $props()

	let breadcrumbSchema = $state<string>('')

	$effect(() => {
		if (breadcrumbs && breadcrumbs.length > 0) {
			breadcrumbSchema = JSON.stringify(
				{
					'@context': 'https://schema.org',
					'@type': 'BreadcrumbList',
					itemListElement: breadcrumbs.map((breadcrumb, index) => ({
						'@type': 'ListItem',
						position: index + 1,
						name: breadcrumb.name,
						item: breadcrumb.item
					}))
				},
				null,
				2
			)
		}
	})
</script>

<svelte:head>
	{#if breadcrumbSchema}
	  {@html `<script type="application/ld+json">
      ${breadcrumbSchema}
	  </script>`}
	{/if}
</svelte:head>
