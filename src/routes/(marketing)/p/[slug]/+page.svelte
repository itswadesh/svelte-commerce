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
			<!-- Payments & Returns -->

			{#if data.page.title || data.page.name}
				<h1
					class="mb-5 text-center font-serif text-2xl font-medium sm:mb-10 md:text-3xl lg:text-4xl">
					{data.page.title || data.page.name}
				</h1>
			{/if}

			{#if data.page.content}
				<div class="mb-10 prose prose-sm max-w-none">
					{@html data.page.content}
				</div>
			{/if}
		</div>
	</section>
{/if}
