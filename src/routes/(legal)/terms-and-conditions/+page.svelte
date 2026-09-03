<script lang="ts">
	import CmsPage from '../_cms-page.svelte'
	import Canonical from '$lib/components/seo/canonical.svelte'
	import Blocks from '$lib/components/page-blocks/blocks.svelte'
	import type { PageProps } from './$types'

	let { data }: PageProps = $props()
</script>

<svelte:head>
	<title>Terms & conditions</title>
</svelte:head>

<CmsPage title="Terms & conditions" content={data?.page?.content} />

<Blocks layouts={data?.page?.layouts} />

<Canonical />
