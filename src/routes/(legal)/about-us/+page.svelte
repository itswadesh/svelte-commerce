<script lang="ts">
	import CmsPage from '../_cms-page.svelte'
	import SeoHeader from '$lib/components/seo/seo-header.svelte'
	import Blocks from '$lib/components/page-blocks/blocks.svelte'
	import type { PageProps } from './$types'

	const { data }: PageProps = $props()
</script>

<SeoHeader metaTitle={data?.page?.metaTitle || 'About us'} />

<CmsPage title="About us" content={data?.page?.content} />

<Blocks layouts={data?.page?.layouts} />
