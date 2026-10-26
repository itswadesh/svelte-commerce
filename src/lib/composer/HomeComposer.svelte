<script lang="ts">
	import { dev } from '$app/environment'
	import { SECTIONS } from './registry.js'
	import { knownSections, pageHeadingSection, type ComposerLayout } from './helpers.js'

	/**
	 * The home page the merchant composed in the panel: the engine's sections, in the engine's
	 * order, each rendered by its registered component on the server. Hidden sections never
	 * arrive; an unknown type is skipped, never thrown.
	 */
	let { layout, brandName = '', aspectRatio = '4 / 5' }: { layout: ComposerLayout; brandName?: string; aspectRatio?: string } = $props()

	const sections = $derived(knownSections(layout?.sections, SECTIONS, dev ? (m) => console.warn(m) : undefined))
	const headingId = $derived(pageHeadingSection(sections))
	// The section whose picture is first on the screen loads at once; every later one waits.
	const firstHero = $derived(sections.findIndex((s) => s.type === 'hero'))
</script>

<div class="cmp-home">
	{#if !headingId && brandName}
		<!-- No hero heading to carry it, so the page's one h1 is the store's name, for screen readers. -->
		<h1 class="sr-only">{brandName}</h1>
	{/if}
	{#each sections as section, index (section.id || index)}
		{@const Section = SECTIONS[section.type]}
		<Section {section} {aspectRatio} isPageHeading={section.id === headingId} priority={index === firstHero && index < 3} />
	{/each}
</div>

<style>
	.cmp-home {
		color: hsl(var(--foreground));
	}

	/* The vocabulary every section shares, so the page has one rhythm and one heading step. */
	.cmp-home :global(.cmp-band) {
		padding-block: clamp(32px, 5vw, 64px);
	}

	/* Two plain bands in a row would stack both paddings; the second gives up its top. */
	.cmp-home :global(.cmp-band + .cmp-band) {
		padding-top: 0;
	}

	.cmp-home :global(.cmp-head) {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-end;
		justify-content: space-between;
		gap: 8px 24px;
		margin-bottom: clamp(16px, 2.4vw, 28px);
	}

	.cmp-home :global(.cmp-head__title) {
		margin: 0;
		font-family: var(--font-heading, inherit);
		font-size: clamp(1.375rem, 2.4vw, 1.75rem);
		font-weight: 500;
		line-height: 1.15;
		letter-spacing: -0.01em;
		overflow-wrap: anywhere;
	}

	.cmp-home :global(.cmp-head__link) {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		min-height: 44px;
		color: hsl(var(--foreground));
		font-size: 0.82rem;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		white-space: nowrap;
		transition: opacity var(--motion-fast, 150ms) var(--motion-ease, ease-out);
	}

	.cmp-home :global(.cmp-head__link:active) {
		opacity: 0.7;
	}

	.cmp-home :global(.cmp-head__icon) {
		width: 16px;
		height: 16px;
		transition: transform var(--motion-fast, 150ms) var(--motion-ease, ease-out);
	}

	.cmp-home :global(.cmp-head__link:hover .cmp-head__icon) {
		transform: translateX(4px);
	}

	@media (hover: hover) and (pointer: fine) {
		.cmp-home :global(.cmp-head__link) {
			min-height: 32px;
		}
	}

	.cmp-home :global(.cmp-eyebrow) {
		color: hsl(var(--muted-foreground));
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		overflow-wrap: anywhere;
	}

	.cmp-home :global(.cmp-copy) {
		color: hsl(var(--muted-foreground));
		font-size: 1rem;
		line-height: 1.65;
	}

	@media (prefers-reduced-motion: reduce) {
		.cmp-home :global(.cmp-head__link:hover .cmp-head__icon) {
			transform: none;
		}
	}
</style>
