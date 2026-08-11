<script lang="ts">
	import { ChevronDownIcon } from '@lucide/svelte'
	import SeoHeader from '$lib/components/seo/seo-header.svelte'
	import StructuredData from '$lib/components/seo/structured-data.svelte'
	import { cleanSchemaText } from '$lib/components/seo/schema.js'

	interface FAQ {
		id: string
		question: string
		answer: string
	}

	let { data } = $props()

	const faqs = $derived((data?.faqs ?? []) as FAQ[])

	// FAQPage markup built from the questions this page actually renders — the only place on the
	// site where FAQ structured data describes visible content.
	const faqSchema = $derived.by(() => {
		const entries = faqs.filter((faq) => faq?.question && faq?.answer)
		if (!entries.length) return ''
		return {
			'@context': 'https://schema.org',
			'@type': 'FAQPage',
			mainEntity: entries.map((faq) => ({
				'@type': 'Question',
				name: cleanSchemaText(faq.question),
				acceptedAnswer: { '@type': 'Answer', text: cleanSchemaText(faq.answer) }
			}))
		}
	})
</script>

<SeoHeader metaTitle="Frequently Asked Questions" />

<StructuredData schema={faqSchema} />

<div class="mx-auto max-w-3xl px-4 py-8">
	<h1 class="mb-8 text-center text-3xl font-bold text-gray-900">Frequently Asked Questions</h1>

	{#if faqs.length}
		<div class="space-y-4">
			{#each faqs as faq (faq.id)}
				<!-- Native disclosure: the answer stays in the server HTML whether or not it is open,
				     so crawlers read question and answer together. Also keyboard/AT accessible with
				     no JS state to keep in sync. -->
				<details class="faq overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm">
					<summary
						class="flex w-full cursor-pointer items-center justify-between px-6 py-4 text-left transition-colors hover:bg-gray-50"
					>
						<span class="flex-1 pr-4 text-lg font-medium text-gray-900">{faq.question}</span>
						<span class="faq-chevron text-gray-500 transition-transform duration-200">
							<ChevronDownIcon class="h-5 w-5" />
						</span>
					</summary>

					<div id="faq-{faq.id}" class="px-6 pb-4">
						<div class="prose prose-sm max-w-none text-gray-600 prose-p:my-0 prose-li:my-0">
							{@html faq.answer}
						</div>
					</div>
				</details>
			{/each}
		</div>
	{:else}
		<div class="py-8 text-center text-gray-500">
			<p>No FAQs available at the moment.</p>
		</div>
	{/if}
</div>

<style>
	/* Hide the default disclosure triangle; the chevron is the affordance. */
	.faq > summary {
		list-style: none;
	}
	.faq > summary::-webkit-details-marker {
		display: none;
	}
	.faq[open] .faq-chevron {
		transform: rotate(180deg);
	}
</style>
