<script lang="ts">
	import Marquee from '../Marquee.svelte'
	import SectionHead from '../SectionHead.svelte'
	import { logoItems, text, type ComposerSection } from '../helpers.js'

	/** The shop's own logos. An unset switch is on: the engine's default, for a layout saved without it. */
	let { section }: { section: ComposerSection } = $props()

	const s = $derived(section.settings ?? {})
	const logos = $derived(logoItems(s.items))
	const scroll = $derived(text(s, 'style') === 'scroll')
	const mono = $derived(s.monochrome !== false)
	const seconds = $derived(Math.max(24, logos.length * 6))
</script>

{#snippet logoRow(hidden: boolean)}
	<ul class="cmp-logos__list" class:cmp-logos__list--moving={scroll}>
		{#each logos as logo, i (i)}
			<li class="cmp-logos__item">
				{#if logo.link}
					<a class="cmp-logos__link" href={logo.link} tabindex={hidden ? -1 : undefined}>
						<img class="cmp-logos__img" src={logo.image} alt={hidden ? '' : logo.name} width="140" height="48" loading="lazy" decoding="async" />
					</a>
				{:else}
					<img class="cmp-logos__img" src={logo.image} alt={hidden ? '' : logo.name} width="140" height="48" loading="lazy" decoding="async" />
				{/if}
			</li>
		{/each}
	</ul>
{/snippet}

{#if logos.length}
	<section class="cmp-logos" class:cmp-logos--mono={mono}>
		<div class="page-width">
			<SectionHead settings={s} />
			{#if !scroll}{@render logoRow(false)}{/if}
		</div>
		{#if scroll}
			<Marquee {seconds} label="logos" content={logoRow} />
		{/if}
	</section>
{/if}

<style>
	.cmp-logos :global(.cmp-head) {
		justify-content: center;
		text-align: center;
	}

	.cmp-logos__list {
		display: flex;
		flex-wrap: wrap;
		flex: none;
		align-items: center;
		justify-content: center;
		gap: clamp(20px, 3vw, 48px);
		margin: 0;
		padding: 0;
		list-style: none;
	}

	/* In a moving strip the list is one long line, with the same space at the join as between logos. */
	.cmp-logos__list--moving {
		flex-wrap: nowrap;
		padding-inline-end: clamp(20px, 3vw, 48px);
	}

	.cmp-logos__item {
		flex: none;
	}

	.cmp-logos__link {
		display: block;
		border-radius: var(--radius, 0.5rem);
	}

	.cmp-logos__link:focus-visible {
		outline: 2px solid hsl(var(--primary-ink));
		outline-offset: 4px;
	}

	.cmp-logos__img {
		display: block;
		width: auto;
		max-width: clamp(96px, 12vw, 148px);
		height: clamp(28px, 3.2vw, 42px);
		object-fit: contain;
		transition: opacity var(--motion-fast, 150ms) var(--motion-ease, ease-out);
	}

	.cmp-logos--mono .cmp-logos__img {
		filter: grayscale(1);
		opacity: 0.72;
	}

	.cmp-logos--mono .cmp-logos__item:hover .cmp-logos__img,
	.cmp-logos--mono .cmp-logos__link:focus-visible .cmp-logos__img {
		filter: none;
		opacity: 1;
	}

	@media (prefers-reduced-motion: reduce) {
		.cmp-logos__list--moving {
			flex-wrap: wrap;
			padding-inline-end: 0;
		}
		.cmp-logos__img {
			transition: none;
		}
	}
</style>
