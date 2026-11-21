<script lang="ts">
	import SectionHead from '../SectionHead.svelte'
	import { statItems, text, type ComposerSection } from '../helpers.js'

	/** Up to four large figures, as the shop wrote them: text, never counted or animated up to. */
	let { section }: { section: ComposerSection } = $props()

	const s = $derived(section.settings ?? {})
	const items = $derived(statItems(s.items))
	const band = $derived(text(s, 'style') === 'band')
	const split = $derived(!!(text(s, 'heading') || text(s, 'subtitle') || text(s, 'eyebrow')))
</script>

{#if items.length}
	<section class="cmp-stats-wrap" class:cmp-stats-band={band}>
		<div class="page-width cmp-stats-layout" class:cmp-stats-layout--split={split}>
			<SectionHead settings={s} />
			<dl class="cmp-stats cmp-stats--{items.length}" class:cmp-stats--beside={split}>
				{#each items as item, i (i)}
					<div class="cmp-stat">
						<dt class="cmp-stat__label">{item.label}</dt>
						<dd class="cmp-stat__value">{item.value}</dd>
					</div>
				{/each}
			</dl>
		</div>
	</section>
{/if}

<style>
	.cmp-stats-band {
		padding-block: var(--space-section, clamp(28px, 4vw, 48px));
		background: hsl(var(--foreground));
		color: hsl(var(--background));
		--muted-foreground: var(--background);
		--border: var(--background);
	}

	.cmp-stats-band :global(.cmp-head__title) {
		color: inherit;
	}

	.cmp-stats-layout :global(.cmp-head) {
		align-items: flex-start;
	}

	.cmp-stats {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 20px var(--grid-gap-x, 12px);
		margin: 0;
	}

	.cmp-stats--1 {
		grid-template-columns: minmax(0, 1fr);
	}

	/* Two across would leave the third alone with a hole beside it. */
	.cmp-stats--3 .cmp-stat:first-child {
		grid-column: span 2;
	}

	.cmp-stat {
		display: flex;
		flex-direction: column-reverse;
		justify-content: flex-end;
		gap: 8px;
		min-width: 0;
		padding-top: 16px;
		border-top: 1px solid hsl(var(--border));
	}

	.cmp-stat__value {
		margin: 0;
		font-family: var(--font-heading, inherit);
		font-size: clamp(2.25rem, 5vw, 4rem);
		font-weight: var(--weight-heading, 700);
		line-height: 1;
		letter-spacing: var(--tracking-display, -0.025em);
		font-variant-numeric: tabular-nums;
		overflow-wrap: break-word;
		min-width: 0;
	}

	.cmp-stat__label {
		color: hsl(var(--muted-foreground));
		font-size: var(--type-ui, 0.875rem);
		line-height: var(--leading-ui, 1.4);
		overflow-wrap: break-word;
	}

	@media (min-width: 768px) {
		.cmp-stats--3 {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
		.cmp-stats--3 .cmp-stat:first-child {
			grid-column: auto;
		}
		.cmp-stats--4 {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}
	}

	@media (min-width: 1024px) {
		/* The words on the left, the figures beside them: the heading no longer stacks over a row. */
		.cmp-stats-layout--split {
			display: grid;
			grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
			align-items: start;
			gap: clamp(32px, 5vw, 72px);
		}
		.cmp-stats-layout--split :global(.cmp-head) {
			margin-bottom: 0;
		}
		.cmp-stats--beside.cmp-stats--4 {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
</style>
