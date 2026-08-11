<script lang="ts">
	// JSON-LD emitter. JSON.stringify escapes quotes and backslashes but never the `<`
	// character, so any value containing a literal closing script tag (a merchant- or
	// vendor-authored description, a blog post body) ends the block early: broken structured
	// data plus unescaped markup in the document head. Escaping `<` to its unicode form is
	// valid JSON, parses back to the same string, and cannot break out.
	const { schema }: { schema?: unknown } = $props()

	const json = $derived.by(() => {
		if (schema === undefined || schema === null || schema === '') return ''
		const serialized = typeof schema === 'string' ? schema : JSON.stringify(schema)
		return serialized ? serialized.replace(/</g, '\\u003c') : ''
	})
</script>

<svelte:head>
	{#if json}
		{@html `<script type="application/ld+json">${json}</script>`}
	{/if}
</svelte:head>
