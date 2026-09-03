<script lang="ts">
	import CmsPage from '../../_cms-page.svelte'
	import SeoHeader from '$lib/components/seo/seo-header.svelte'

	let { data } = $props()

	let seoProps = {
		metaTitle: `${data.page.metaTitle || data.page.name || ''}`,
		metaDescription: `${data.page.metaDescription || data.page.name || ''}`,
		metaKeywords: `${data.page.metaKeywords || data.page.name || ''}`
	}
</script>

<SeoHeader {...seoProps} />

{#if data?.page}
	<CmsPage title={data.page.name} content={data?.page?.content} />
{/if}
