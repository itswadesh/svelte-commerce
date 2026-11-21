<script lang="ts">
	import CmsPage from '../_cms-page.svelte'
	import Blocks from '$lib/components/page-blocks/blocks.svelte'
	import type { PageProps } from './$types'

	const { data }: PageProps = $props()
</script>

<CmsPage title="Privacy policy" content={data?.page?.content} meta={data?.page} />

<Blocks layouts={data?.page?.layouts} />
