<script lang="ts">
	import { ArrowRight } from '@lucide/svelte'
	import Paragraphs from '../Paragraphs.svelte'
	import { columnItems, columnsClass, text, type ComposerSection } from '../helpers.js'

	/** Up to four columns, each a picture, a heading, text and a link; stacked on a phone. */
	let { section }: { section: ComposerSection } = $props()

	const heading = $derived(text(section.settings, 'heading'))
	const columns = $derived(columnItems(section.settings?.items))
	const grid = $derived(columnsClass(columns.length))
</script>

{#if columns.length}
	<section class="cmp-band">
		<div class="page-width">
			{#if heading}
				<header class="cmp-head"><h2 class="cmp-head__title">{heading}</h2></header>
			{/if}
			<ul class="cmp-mc grid gap-6 md:gap-8 {grid}">
				{#each columns as column, i (i)}
					<li class="cmp-mc__col">
						{#if column.image}
							<div class="cmp-mc__media">
								<img src={column.image} alt="" width="800" height="600" loading="lazy" decoding="async" />
							</div>
						{/if}
						{#if column.heading}
							<!-- An h3 only under a section heading; without one it would skip a level. -->
							<svelte:element this={heading ? 'h3' : 'p'} class="cmp-mc__title">{column.heading}</svelte:element>
						{/if}
						<Paragraphs value={column.text} class="cmp-copy" />
						{#if column.link && column.linkText}
							<a class="cmp-head__link cmp-mc__link" href={column.link}>
								{column.linkText}
								<ArrowRight class="cmp-head__icon" aria-hidden="true" />
							</a>
						{/if}
					</li>
				{/each}
			</ul>
		</div>
	</section>
{/if}

<style>
	.cmp-mc {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.cmp-mc__col {
		display: grid;
		align-content: start;
		gap: 10px;
		min-width: 0;
	}

	.cmp-mc__media {
		overflow: hidden;
		border-radius: var(--radius, 0.5rem);
		aspect-ratio: 4 / 3;
		background: hsl(var(--muted));
	}

	.cmp-mc__media img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.cmp-mc__title {
		margin: 4px 0 0;
		font-family: var(--font-heading, inherit);
		font-size: 1.125rem;
		font-weight: 600;
		line-height: 1.3;
		overflow-wrap: anywhere;
	}

	.cmp-mc__link {
		justify-self: start;
	}
</style>
