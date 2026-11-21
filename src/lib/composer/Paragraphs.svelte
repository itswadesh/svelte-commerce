<script lang="ts">
	import { paragraphs } from './helpers.js'

	/** Merchant text as paragraphs. Plain text only: it is never parsed as HTML. */
	let { value, class: className = '' }: { value: unknown; class?: string } = $props()

	const blocks = $derived(paragraphs(value))
</script>

{#each blocks as block, i (i)}
	<p class="cmp-p {className}">{block}</p>
{/each}

<style>
	.cmp-p {
		margin: 0;
		/* A single line break the merchant typed is kept; a blank line is a new paragraph. */
		white-space: pre-line;
		overflow-wrap: anywhere;
	}

	.cmp-p + .cmp-p {
		margin-top: 0.85em;
	}
</style>
