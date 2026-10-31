<script lang="ts">
	import type { Snippet } from 'svelte'
	import { SECTIONS } from './registry.js'
	import { firstPictureSection, knownSections, pageHeadingSection, type ComposerLayout, type ComposerSection } from './helpers.js'
	import { draftSections, editorMessage, storefrontMessage, type DraftDocument } from './editor-bridge.js'
	import { TEMPLATE_CORE, withCore } from './page-layout.js'
	import { themeFontsHref, themeTokenCss } from './theme-tokens.js'

	/**
	 * A page the merchant composed in the panel: the engine's sections, in the engine's order, each
	 * rendered by its registered component on the server. Hidden sections never arrive; an unknown
	 * type is skipped, never thrown.
	 *
	 * The home page is all sections. A product or collection page is a template (D128): `parts`
	 * draws the types only that page has — its core, where the merchant put it, and on a product
	 * page its reviews and related products — and the core, not a hero, carries the page's h1.
	 *
	 * With `editorOrigin` — a preview the panel's theme editor framed (D126) — the page also draws
	 * the draft the panel posts as it is edited, outlines the section under the pointer, and tells
	 * the panel which one was clicked instead of following its links. See editor-bridge.ts for the
	 * rules a message has to pass.
	 */
	let {
		layout,
		page = 'home',
		parts = {},
		brandName = '',
		aspectRatio = '4 / 5',
		editorOrigin = null,
		onsaved = () => {}
	}: {
		layout: ComposerLayout
		page?: 'home' | 'product' | 'collection'
		parts?: Record<string, Snippet<[ComposerSection]>>
		brandName?: string
		aspectRatio?: string
		editorOrigin?: string | null
		/** The panel saved the draft: the route re-reads it (`invalidate(LAYOUT_DEPENDENCY)`). */
		onsaved?: () => void
	} = $props()

	let draft = $state<DraftDocument | null>(null)
	let selected = $state<string | null>(null)
	// Only once the page is framed by the panel and listening; a direct visit draws the preview as is.
	let editing = $state(false)

	const home = $derived(page === 'home')
	const core = $derived(home ? null : TEMPLATE_CORE[page as 'product' | 'collection'])
	const source = $derived(
		editing && draft ? withCore(draftSections(draft, layout?.sections), layout?.sections ?? [], core) : layout?.sections
	)
	const sections = $derived(knownSections(source, { ...SECTIONS, ...parts }, import.meta.env.DEV ? (m) => console.warn(m) : undefined))
	// On a template the core's own title is the h1; every section heading is an h2.
	const headingId = $derived(home ? pageHeadingSection(sections) : null)
	const firstPicture = $derived(firstPictureSection(sections))

	// A home-page preview draws its own theme settings (D127): the draft's as the panel posts them,
	// else the saved draft's. The root layout leaves the published ones out of that preview, so a
	// setting the draft cleared shows the storefront's own value, as it will once published. A
	// template carries none — they publish with the home page — so its preview, like a shopper's
	// page, gets the published ones from the root layout.
	const previewTokens = $derived(
		!home ? null : editing && draft ? (draft.theme_settings ?? {}) : layout?.preview ? (layout.themeSettings ?? {}) : null
	)
	const tokenCss = $derived(previewTokens ? themeTokenCss(previewTokens, 3) : '')
	const tokenFonts = $derived(previewTokens ? themeFontsHref(previewTokens) : '')
	// Split so the compiler does not take the literal for this component's own stylesheet.
	const tokenStyle = $derived(tokenCss ? '<sty' + 'le id="theme-tokens-preview">' + tokenCss + '</sty' + 'le>' : '')

	function post(message: object) {
		if (editorOrigin) window.parent.postMessage(message, editorOrigin)
	}

	$effect(() => {
		if (!editorOrigin || window.parent === window) return
		const onMessage = (event: MessageEvent) => {
			const message = editorMessage(event, editorOrigin, window.parent)
			if (!message) return
			if (message.type === 'draft') {
				draft = message.document
			} else if (message.type === 'saved') {
				// The saved draft's product grids, resolved by the engine; the settings drawn stay
				// the latest posted, which may be newer than the save.
				onsaved()
			} else {
				selected = message.id
				if (message.id) reveal(message.id)
			}
		}
		window.addEventListener('message', onMessage)
		editing = true
		post(storefrontMessage('ready'))
		return () => window.removeEventListener('message', onMessage)
	})

	function reveal(id: string) {
		const el = document.querySelector(`[data-cmp-section="${CSS.escape(id)}"]`)
		if (!el) return
		const still = matchMedia('(prefers-reduced-motion: reduce)').matches
		el.scrollIntoView({ block: 'nearest', behavior: still ? 'auto' : 'smooth' })
	}

	// In the editor a click picks the section, as in the panel's list; following a link would leave
	// the page being edited.
	function pick(event: MouseEvent, id: string) {
		event.preventDefault()
		selected = id
		post(storefrontMessage('select', id))
	}

	function pickByKey(event: KeyboardEvent, id: string) {
		if (event.key !== 'Enter' && event.key !== ' ') return
		if (event.target !== event.currentTarget) return
		event.preventDefault()
		selected = id
		post(storefrontMessage('select', id))
	}
</script>

<svelte:head>
	{#if tokenFonts}<link href={tokenFonts} rel="stylesheet" />{/if}
	{#if tokenStyle}{@html tokenStyle}{/if}
</svelte:head>

{#snippet drawn(section: ComposerSection, index: number)}
	{@const part = parts[section.type]}
	{#if part}
		{@render part(section)}
	{:else}
		{@const Section = SECTIONS[section.type]}
		<Section {section} {aspectRatio} isPageHeading={section.id === headingId} priority={index === firstPicture} />
	{/if}
{/snippet}

<div class="cmp-home cmp-page--{page}" class:cmp-home--editing={editing}>
	{#if home && !headingId && brandName}
		<!-- No hero heading to carry it, so the page's one h1 is the store's name, for screen readers. -->
		<h1 class="sr-only">{brandName}</h1>
	{/if}
	{#each sections as section, index (section.id || index)}
		{#if editing}
			<div
				class="cmp-edit"
				class:cmp-edit--selected={selected === section.id}
				data-cmp-section={section.id}
				role="button"
				tabindex="0"
				aria-pressed={selected === section.id}
				onclickcapture={(e) => pick(e, section.id)}
				onkeydown={(e) => pickByKey(e, section.id)}
			>
				{@render drawn(section, index)}
			</div>
		{:else}
			{@render drawn(section, index)}
		{/if}
	{/each}
</div>

<style>
	/* One space between every two sections, whatever they are. Each section used to bring its own
	   padding (bands 32-64px, the hero 12-32px, the benefits strip 28-48px), so the gaps on one page
	   ran from 24px to over 100px depending on which pair met. */
	.cmp-home {
		--cmp-gap: var(--space-section, clamp(24px, 3vw, 40px));
		display: flex;
		flex-direction: column;
		gap: var(--cmp-gap);
		padding-block: var(--cmp-gap);
		color: hsl(var(--foreground));
	}

	/* The default theme's footer keeps this same gap above itself (footer.svelte), so the page draws
	   none below its last section: the two used to add up to 60px, and left a 20px strip of page
	   between a benefits band and the footer it is meant to meet. */
	:global([data-theme='default']) .cmp-home {
		padding-bottom: 0;
	}

	/* A full-width strip at the very top or bottom meets the header or footer, as it always has. */
	.cmp-home > :global(.cmp-announce:first-child),
	.cmp-home > :global(.cmp-benefits-band:first-child) {
		margin-top: calc(-1 * var(--cmp-gap));
	}

	.cmp-home > :global(.cmp-announce:last-child),
	.cmp-home > :global(.cmp-benefits-band:last-child) {
		margin-bottom: calc(-1 * var(--cmp-gap));
	}

	.cmp-home :global(.cmp-head) {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-end;
		justify-content: space-between;
		gap: 8px 24px;
		margin-bottom: var(--space-head, clamp(16px, 2.4vw, 28px));
	}

	.cmp-home :global(.cmp-head__title) {
		margin: 0;
		font-family: var(--font-heading, inherit);
		font-size: var(--type-section-title, clamp(1.5rem, 3vw, 2.125rem));
		font-weight: var(--weight-heading, 700);
		line-height: var(--leading-title, 1.15);
		letter-spacing: var(--tracking-title, -0.01em);
		overflow-wrap: anywhere;
	}

	.cmp-home :global(.cmp-head__link) {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		min-height: 44px;
		color: hsl(var(--foreground));
		font-size: var(--type-ui, 0.82rem);
		font-weight: 600;
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
		font-size: var(--type-label, 0.75rem);
		font-weight: 600;
		overflow-wrap: anywhere;
	}

	.cmp-home :global(.cmp-head__words) {
		display: grid;
		gap: 8px;
		min-width: 0;
	}

	.cmp-home :global(.cmp-head__eyebrow) {
		margin: 0;
		color: hsl(var(--muted-foreground));
		font-size: var(--type-label, 0.75rem);
		font-weight: 500;
		line-height: 1.35;
		overflow-wrap: anywhere;
	}

	.cmp-home :global(.cmp-head__subtitle) {
		max-width: 36rem;
		margin: 0;
		color: hsl(var(--muted-foreground));
		font-size: var(--type-ui, 0.875rem);
		line-height: var(--leading-ui, 1.4);
		overflow-wrap: anywhere;
	}

	@media (min-width: 640px) {
		.cmp-home :global(.cmp-head__subtitle) {
			font-size: var(--type-body, 1rem);
			line-height: var(--leading-body, 1.5);
		}
	}

	.cmp-home :global(.cmp-copy) {
		color: hsl(var(--muted-foreground));
		font-size: var(--type-body, 1rem);
		line-height: var(--leading-body, 1.65);
	}

	/* The theme editor's frame (D126): the section under the pointer is outlined, the picked one
	   more firmly. Outlines take no room, so the page measures exactly as a shopper sees it. */
	.cmp-home :global(.cmp-edit) {
		position: relative;
		cursor: pointer;
		outline: none;
	}

	/* Drawn over the section, not round it, so a full-bleed picture cannot cover the outline. */
	.cmp-home :global(.cmp-edit::after) {
		content: '';
		position: absolute;
		inset: 0;
		z-index: 1;
		border: 2px solid transparent;
		pointer-events: none;
		transition: border-color var(--motion-fast, 150ms) var(--motion-ease, ease-out);
	}

	.cmp-home :global(.cmp-edit:hover::after) {
		border-color: hsl(var(--primary-ink) / 0.45);
	}

	.cmp-home :global(.cmp-edit:focus-visible::after),
	.cmp-home :global(.cmp-edit--selected::after) {
		border-color: hsl(var(--primary-ink));
	}

	/* A section with nothing to show yet — a grid before its products are saved, a hero before its
	   heading — still has a place to click. */
	.cmp-home :global(.cmp-edit:empty) {
		min-height: 48px;
		background: hsl(var(--muted));
	}

	@media (prefers-reduced-motion: reduce) {
		.cmp-home :global(.cmp-head__link:hover .cmp-head__icon) {
			transform: none;
		}
		.cmp-home :global(.cmp-edit::after) {
			transition: none;
		}
	}
</style>
