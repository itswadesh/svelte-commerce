<script lang="ts">
	import CmsPage from '../../_cms-page.svelte'

	let { data } = $props()
</script>

{#if data?.page}
	<CmsPage title={data.page.name} content={data?.page?.content} meta={data.page} />
{/if}
