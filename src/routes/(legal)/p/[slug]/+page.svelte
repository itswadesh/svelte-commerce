<script>
	import SeoHeader from '$lib/core/components/plugins/seo-header.svelte'

	let { data } = $props()

	let seoProps = {
		metaTitle: `${data.page.metaTitle || data.page.name || ''}`,
		metaDescription: `${data.page.metaDescription || data.page.name || ''}`,
		metaKeywords: `${data.page.metaKeywords || data.page.name || ''}`
	}
</script>

<SeoHeader {...seoProps} />

{#if data?.page}
	<section class="min-h-screen">
		<div class="container mx-auto flex max-w-7xl flex-col px-4 md:px-10">
			<div class="mx-auto flex max-w-max flex-col items-center py-5 text-center text-3xl font-bold sm:items-start sm:py-10 sm:text-4xl">
				<h1>{data.page.name}</h1>

				<hr class="mt-2.5 w-20 border-t-4 border-zinc-900 opacity-50" />
			</div>

			<div class="prose-lg [&>p]:my-2">
				{@html data?.page?.content}
			</div>
		</div>
	</section>
{/if}
