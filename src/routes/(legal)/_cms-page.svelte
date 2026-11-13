<script lang="ts">
	/**
	 * The shell every CMS-authored legal page shares.
	 *
	 * The six routes each carried their own copy of it, and each copy had the same three faults:
	 * a `container mx-auto max-w-7xl` rail that put the text edge somewhere the header and footer
	 * are not, an `mt-20 min-h-screen` that opened roughly 700px of blank canvas above the footer,
	 * and `prose-lg` — a size modifier with no `prose` base — so list bullets, link underlines and
	 * heading weight never arrived and a shopper could not see which words in a refund policy were
	 * links. One shell fixes all six at once.
	 */
	import { page as appPage } from '$app/state'
	import SeoHeader from '$lib/components/seo/seo-header.svelte'
	import { cleanSchemaText } from '$lib/components/seo/schema.js'

	interface Props {
		/** Sentence case, matching the page title and the link that leads here. */
		title: string
		content?: string | null
		/** The CMS record's own SEO fields, when the merchant filled them in. */
		meta?: { metaTitle?: string; metaDescription?: string } | null
		children?: import('svelte').Snippet
	}

	const { title, content, meta, children }: Props = $props()

	// The shell draws the page's one h1. A policy pasted with its own heading ("Terms and Conditions"
	// under "Terms & conditions"), first or just inside a wrapper such as <article>, loses it, and
	// any other h1 drops to h2: two h1s told a search engine and a screen reader the page had two
	// subjects.
	const body = $derived(
		(content ?? '').replace(/^((?:\s|<(?!h1\b)[a-z][^>]*>)*)<h1\b[^>]*>[\s\S]*?<\/h1>/i, '$1').replace(/<(\/?)h1\b([^>]*)>/gi, '<$1h2$2>')
	)

	// Policy pages had no description at all. The merchant's own wins; otherwise the opening of the
	// page itself, cut at a word — what the page says, never a made-up summary.
	const ENTITIES: Record<string, string> = { '&amp;': '&', '&nbsp;': ' ', '&quot;': '"', '&#39;': "'", '&rsquo;': '’', '&lsquo;': '‘' }
	const excerpt = (html: string) => {
		const text = cleanSchemaText(html).replace(/&(amp|nbsp|quot|#39|rsquo|lsquo);/g, (e) => ENTITIES[e] ?? e)
		return text.length <= 155 ? text : text.slice(0, text.lastIndexOf(' ', 152)) + '…'
	}
	const storeName = $derived(appPage.data?.store?.name || '')
</script>

<SeoHeader
	metaTitle={meta?.metaTitle || (storeName ? `${title} | ${storeName}` : title)}
	metaDescription={meta?.metaDescription || excerpt(body)}
/>

<section class="page-width py-10 md:py-16">
	<div class="mx-auto max-w-3xl">
		<h1 class="page-heading">{title}</h1>
		<hr class="mt-4 w-20 border-t-4 border-border" />

		{#if body}
			<div class="prose prose-neutral mt-8 max-w-none prose-headings:font-semibold prose-headings:text-foreground prose-a:text-primary">
				{@html body}
			</div>
		{:else if children}
			<div class="mt-8">{@render children()}</div>
		{/if}
	</div>
</section>
