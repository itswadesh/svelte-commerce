<script lang="ts">
	import { ChevronDownIcon } from '@lucide/svelte'
	import { Button } from '$lib/components/ui/button'
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

<div class="page-width py-10 md:py-16">
	<div class="mx-auto max-w-3xl">
		<h1 class="mb-8 text-center text-3xl font-bold tracking-tight text-foreground md:text-4xl">Frequently asked questions</h1>

		{#if faqs.length}
			<div class="space-y-4">
				{#each faqs as faq (faq.id)}
					<!-- Native disclosure: the answer stays in the server HTML whether or not it is open,
				     so crawlers read question and answer together. Also keyboard/AT accessible with
				     no JS state to keep in sync. -->
					<details class="faq overflow-hidden rounded-lg border bg-card shadow-xs">
						<summary class="flex w-full cursor-pointer items-center justify-between px-6 py-4 text-left transition-colors hover:bg-muted/50">
							<span class="flex-1 pr-4 text-lg font-medium text-foreground">{faq.question}</span>
							<span class="faq-chevron text-muted-foreground transition-transform duration-fast">
								<ChevronDownIcon class="h-5 w-5" />
							</span>
						</summary>

						<div id="faq-{faq.id}" class="px-6 pb-4">
							<div class="prose prose-sm prose-neutral max-w-none text-muted-foreground prose-a:text-primary">
								{@html faq.answer}
							</div>
						</div>
					</details>
				{/each}
			</div>
		{:else}
			<!-- A shopper who followed the FAQs link was looking for something. One grey sentence with no
		     way onward sends them back to the navigation to guess again. -->
			<div class="mx-auto max-w-md py-10 text-center">
				<p class="text-muted-foreground">There are no questions and answers here yet.</p>
				<p class="mt-2 text-sm text-muted-foreground">For anything about an order, delivery or a return, write to us and we will answer directly.</p>
				<div class="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
					<Button href="/contact-us" class="h-11">Contact us</Button>
					<Button href="/products" variant="outline" class="h-11">Browse products</Button>
				</div>
			</div>
		{/if}
	</div>
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
