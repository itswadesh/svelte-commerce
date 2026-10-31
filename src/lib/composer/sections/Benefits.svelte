<script lang="ts">
	import { Pause, Play } from '@lucide/svelte'
	import { benefitItems, text, type ComposerSection } from '../helpers.js'
	import { benefitIcon } from '../benefit-icons.js'
	import SectionHead from '../SectionHead.svelte'

	/** Up to six short promises, each a title, a line and an optional icon. Statements, not links. */
	let { section }: { section: ComposerSection } = $props()

	const heading = $derived(text(section.settings, 'heading'))
	const items = $derived(benefitItems(section.settings?.items))
	// One icon in the strip keeps the icon column for every benefit, so titles line up.
	const withIcons = $derived(items.some((item) => benefitIcon(item.icon)))
	const marquee = $derived(text(section.settings, 'style') === 'marquee')
	// About 30px a second however long the promises run; a copy is never narrower than the screen, so 48 s is the slowest.
	const seconds = $derived(
		Math.max(48, Math.round(items.reduce((px, item) => px + Math.max(item.title.length * 7, item.body.length * 6) + 76, 0) / 30))
	)
	// Until the button is pressed the pointer holds the strip still; a press then wins over the pointer.
	let choice = $state<'paused' | 'playing' | null>(null)
</script>

{#if items.length && marquee}
	<section class="cmp-marquee-band">
		<div class="page-width">
			<SectionHead settings={section.settings} />
		</div>
		<div
			class="cmp-marquee"
			class:cmp-marquee--paused={choice === 'paused'}
			class:cmp-marquee--playing={choice === 'playing'}
			style:--marquee-duration="{seconds}s"
		>
			<div class="cmp-marquee__track">
				{#each [false, true] as copy (copy)}
					<ul class="cmp-marquee__group" aria-hidden={copy ? 'true' : undefined}>
						{#each items as item, i (i)}
							{@const Icon = benefitIcon(item.icon)}
							<li class="cmp-marquee__item">
								{#if Icon}<Icon class="cmp-marquee__icon" aria-hidden="true" />{/if}
								<div>
									<svelte:element this={heading ? 'h3' : 'p'} class="cmp-marquee__title">{item.title}</svelte:element>
									{#if item.body}<p class="cmp-marquee__body">{item.body}</p>{/if}
								</div>
							</li>
						{/each}
					</ul>
				{/each}
			</div>
			<button
				type="button"
				class="cmp-marquee__toggle"
				data-target="secondary"
				onclick={() => (choice = choice === 'paused' ? 'playing' : 'paused')}
				aria-label={choice === 'paused' ? 'Play the strip' : 'Pause the strip'}
			>
				{#if choice === 'paused'}<Play aria-hidden="true" />{:else}<Pause aria-hidden="true" />{/if}
			</button>
		</div>
	</section>
{:else if items.length}
	<!-- Bold and bright (D140): a dark band, the page's own text and background colours swapped. -->
	<section class="cmp-benefits-band">
		<div class="page-width">
			<SectionHead settings={section.settings}>
				{#snippet title()}<h2 class="cmp-head__title cmp-benefits__heading">{heading}</h2>{/snippet}
			</SectionHead>
			<ul class="cmp-benefits" class:cmp-benefits--four={items.length === 4} class:cmp-benefits--icons={withIcons}>
				{#each items as item, i (i)}
					{@const Icon = benefitIcon(item.icon)}
					<li class="cmp-benefit">
						{#if Icon}<Icon class="cmp-benefit__icon" aria-hidden="true" />{/if}
						<div class="cmp-benefit__words">
							<!-- An h3 only under a section heading; without one it would skip a level. -->
							<svelte:element this={heading ? 'h3' : 'p'} class="cmp-benefit__title">{item.title}</svelte:element>
							{#if item.body}<p class="cmp-benefit__body">{item.body}</p>{/if}
						</div>
					</li>
				{/each}
			</ul>
		</div>
	</section>
{/if}

<style>
	/* A full-width band, not one of the page's plain bands: it keeps its own padding wherever it
	   sits, on the default theme the same space the page leaves between sections. */
	.cmp-benefits-band {
		padding-block: var(--space-section, clamp(28px, 4vw, 48px));
		background: hsl(var(--foreground));
		color: hsl(var(--background));
		--muted-foreground: var(--background);
	}

	.cmp-benefits__heading {
		color: inherit;
	}

	.cmp-benefits {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 20px 16px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.cmp-benefit {
		display: flex;
		align-items: flex-start;
		gap: 12px;
	}

	/* Line icons at 22px in the band's own text colour: the accent can be too dark to see on it. */
	.cmp-benefit :global(.cmp-benefit__icon) {
		flex: none;
		width: 22px;
		height: 22px;
		margin-top: 1px;
		color: currentColor;
		stroke-width: 1.75;
	}

	/* Centred on the title's first line, whichever size the heading step is at (16-18px). */
	:global([data-theme='default']) .cmp-benefit :global(.cmp-benefit__icon) {
		margin-top: calc((var(--type-heading) * var(--leading-heading) - 22px) / 2);
	}

	.cmp-benefit__words {
		min-width: 0;
	}

	.cmp-benefits--icons .cmp-benefit__words:first-child {
		padding-left: 34px;
	}

	.cmp-benefit__title {
		margin: 0;
		font-family: var(--font-heading, inherit);
		font-size: var(--type-heading, 1.0625rem);
		font-weight: var(--weight-heading, 700);
		line-height: var(--leading-heading, 1.3);
		overflow-wrap: anywhere;
	}

	.cmp-benefit__body {
		margin: 6px 0 0;
		color: inherit;
		font-size: var(--type-ui, 0.9rem);
		line-height: var(--leading-ui, 1.5);
		overflow-wrap: anywhere;
	}

	@media (min-width: 1024px) {
		.cmp-benefits {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
		.cmp-benefits--four {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}
	}

	.cmp-marquee-band {
		padding-block: 14px;
		border-block: 1px solid hsl(var(--border));
		background: hsl(var(--muted) / 0.4);
	}

	.cmp-marquee {
		display: flex;
		align-items: center;
	}

	.cmp-marquee__track {
		display: flex;
		flex: 1;
		min-width: 0;
		overflow: hidden;
	}

	.cmp-marquee__group {
		display: flex;
		flex: none;
		justify-content: space-around;
		min-width: 100%;
		margin: 0;
		padding: 0;
		list-style: none;
		animation: cmp-marquee var(--marquee-duration, 48s) linear infinite;
	}

	.cmp-marquee--paused .cmp-marquee__group {
		animation-play-state: paused;
	}

	@media (hover: hover) {
		.cmp-marquee:not(.cmp-marquee--playing):hover .cmp-marquee__group {
			animation-play-state: paused;
		}
	}

	.cmp-marquee__toggle {
		display: inline-flex;
		flex: none;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		margin-inline: 4px 12px;
		border-radius: 999px;
		color: hsl(var(--muted-foreground));
		transition:
			background-color var(--motion-fast, 150ms) var(--motion-ease, ease-out),
			color var(--motion-fast, 150ms) var(--motion-ease, ease-out),
			transform var(--motion-fast, 150ms) var(--motion-ease, ease-out);
	}

	.cmp-marquee__toggle:hover {
		background: hsl(var(--foreground) / 0.08);
		color: hsl(var(--foreground));
	}

	.cmp-marquee__toggle:active {
		transform: scale(0.92);
	}

	.cmp-marquee__toggle :global(svg) {
		width: 16px;
		height: 16px;
	}

	@keyframes cmp-marquee {
		to {
			transform: translateX(-100%);
		}
	}

	.cmp-marquee__item {
		display: flex;
		align-items: center;
		gap: 10px;
		padding-inline: 24px;
		white-space: nowrap;
	}

	.cmp-marquee__item :global(.cmp-marquee__icon) {
		flex: none;
		width: 18px;
		height: 18px;
		color: hsl(var(--primary-ink));
		stroke-width: 1.75;
	}

	.cmp-marquee__title {
		margin: 0;
		font-size: var(--type-dense, 0.8125rem);
		font-weight: 500;
		line-height: 1.25;
	}

	.cmp-marquee__body {
		margin: 0;
		color: hsl(var(--muted-foreground));
		font-size: var(--type-label, 0.75rem);
		line-height: 1.35;
	}

	@media (prefers-reduced-motion: reduce) {
		.cmp-marquee__group {
			flex: auto;
			flex-wrap: wrap;
			justify-content: center;
			row-gap: 12px;
			min-width: 0;
			animation: none;
		}
		.cmp-marquee__item {
			white-space: normal;
		}
		.cmp-marquee__group[aria-hidden],
		.cmp-marquee__toggle {
			display: none;
		}
	}
</style>
