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
	interface Props {
		/** Sentence case, matching the page title and the link that leads here. */
		title: string
		content?: string | null
		children?: import('svelte').Snippet
	}

	const { title, content, children }: Props = $props()
</script>

<section class="page-width py-10 md:py-16">
	<div class="mx-auto max-w-3xl">
		<h1 class="text-3xl font-bold tracking-tight text-foreground md:text-4xl">{title}</h1>
		<hr class="mt-4 w-20 border-t-4 border-border" />

		{#if content}
			<div class="prose prose-neutral mt-8 max-w-none prose-headings:font-semibold prose-headings:text-foreground prose-a:text-primary">
				{@html content}
			</div>
		{:else if children}
			<div class="mt-8">{@render children()}</div>
		{/if}
	</div>
</section>
