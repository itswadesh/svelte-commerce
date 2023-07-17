<script>
import SEO from '$lib/components/SEO/index.svelte'

export let data
// console.log('zzzzzzzzzzzzzzzzzz', data)

let seoProps = {
	title: `${data.page.title || data.page.name || ''}`,
	description: `${data.page.title || data.page.name || ''}`
}
</script>

<SEO {...seoProps} />

{#if data.page}
	<section class="min-h-screen px-3 py-5 sm:p-10">
		<div class="container mx-auto w-full max-w-6xl">
			<!-- Page title -->

			{#if data.page.title || data.page.name}
				<h1 class="mb-5 text-center sm:mb-10 capitalize">
					{data.page.title || data.page.name}
				</h1>
			{/if}

			<!-- Page content -->

			{#if data.page.content}
				<div class="mb-10 prose max-w-none">
					{@html data.page.content}
				</div>
			{/if}
		</div>
	</section>
{/if}
