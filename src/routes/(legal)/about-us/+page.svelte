<script lang="ts">
	import { SeoHeader } from '$lib/core/components/index.js'
	import Blocks from '$lib/components/page-blocks/blocks.svelte'
	import type { PageProps } from './$types'

	const { data }: PageProps = $props()
</script>

<SeoHeader metaTitle={data?.page?.metaTitle || 'About Us'} />

<section class="mt-20">
	<div class="container mx-auto flex max-w-7xl flex-col px-4 md:px-10">
		<div class="mx-auto flex max-w-max flex-col items-center py-5 text-center text-3xl font-bold sm:items-start sm:py-10 sm:text-4xl">
			<h1>About Us</h1>

			<hr class="mt-2.5 w-20 border-t-4 border-zinc-900 opacity-50" />
		</div>

		<div class="prose-lg prose-p:my-0 prose-li:my-0">
			{@html data?.page?.content}
		</div>
	</div>
</section>

<Blocks layouts={data.page.layouts}/>
