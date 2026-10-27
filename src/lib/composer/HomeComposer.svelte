<script lang="ts">
	import { dev } from '$app/environment'
	import { invalidate } from '$app/navigation'
	import { SECTIONS } from './registry.js'
	import { knownSections, pageHeadingSection, type ComposerLayout } from './helpers.js'
	import { draftSections, editorMessage, storefrontMessage, LAYOUT_DEPENDENCY, type DraftDocument } from './editor-bridge.js'

	/**
	 * The home page the merchant composed in the panel: the engine's sections, in the engine's
	 * order, each rendered by its registered component on the server. Hidden sections never
	 * arrive; an unknown type is skipped, never thrown.
	 *
	 * With `editorOrigin` — a preview the panel's theme editor framed (D126) — the page also draws
	 * the draft the panel posts as it is edited, outlines the section under the pointer, and tells
	 * the panel which one was clicked instead of following its links. See editor-bridge.ts for the
	 * rules a message has to pass.
	 */
	let {
		layout,
		brandName = '',
		aspectRatio = '4 / 5',
		editorOrigin = null
	}: { layout: ComposerLayout; brandName?: string; aspectRatio?: string; editorOrigin?: string | null } = $props()

	let draft = $state<DraftDocument | null>(null)
	let selected = $state<string | null>(null)
	// Only once the page is framed by the panel and listening; a direct visit draws the preview as is.
	let editing = $state(false)

	const source = $derived(editing && draft ? draftSections(draft, layout?.sections) : layout?.sections)
	const sections = $derived(knownSections(source, SECTIONS, dev ? (m) => console.warn(m) : undefined))
	const headingId = $derived(pageHeadingSection(sections))
	// The section whose picture is first on the screen loads at once; every later one waits.
	const firstHero = $derived(sections.findIndex((s) => s.type === 'hero'))

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
				invalidate(LAYOUT_DEPENDENCY)
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

<div class="cmp-home" class:cmp-home--editing={editing}>
	{#if !headingId && brandName}
		<!-- No hero heading to carry it, so the page's one h1 is the store's name, for screen readers. -->
		<h1 class="sr-only">{brandName}</h1>
	{/if}
	{#each sections as section, index (section.id || index)}
		{@const Section = SECTIONS[section.type]}
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
				<Section {section} {aspectRatio} isPageHeading={section.id === headingId} priority={index === firstHero && index < 3} />
			</div>
		{:else}
			<Section {section} {aspectRatio} isPageHeading={section.id === headingId} priority={index === firstHero && index < 3} />
		{/if}
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
		border-color: hsl(var(--primary) / 0.45);
	}

	.cmp-home :global(.cmp-edit:focus-visible::after),
	.cmp-home :global(.cmp-edit--selected::after) {
		border-color: hsl(var(--primary));
	}

	/* A section with nothing to show yet — a grid before its products are saved, a hero before its
	   heading — still has a place to click. */
	.cmp-home :global(.cmp-edit:empty) {
		min-height: 48px;
		background: hsl(var(--muted));
	}

	/* The wrapper would hide one band from the next; the rhythm is the shopper's page. */
	.cmp-home :global(.cmp-edit:has(> .cmp-band) + .cmp-edit > .cmp-band) {
		padding-top: 0;
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
