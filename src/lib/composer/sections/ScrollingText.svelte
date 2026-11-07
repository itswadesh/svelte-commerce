<script lang="ts">
	import { Asterisk } from '@lucide/svelte'
	import Marquee from '../Marquee.svelte'
	import { choice, phraseItems, scrollSeconds, text, type ComposerSection } from '../helpers.js'

	/** Very large words moving across the page. A pause in the page's rhythm, so nothing here is a link. */
	let { section }: { section: ComposerSection } = $props()

	const s = $derived(section.settings ?? {})
	const phrases = $derived(phraseItems(s.items))
	const tone = $derived(choice(s.tone, ['plain', 'accent', 'dark'], 'plain'))
	const size = $derived(choice(s.size, ['large', 'huge'], 'large'))
	const separator = $derived(choice(s.separator, ['star', 'slash', 'none'], 'star'))
	const seconds = $derived(scrollSeconds(phrases.join('').length + phrases.length * 3, text(s, 'speed')))
</script>

{#snippet line(_hidden: boolean)}
	<ul class="cmp-words__list">
		{#each phrases as phrase, i (i)}
			<li class="cmp-words__phrase">
				{phrase}
				{#if separator === 'star'}
					<Asterisk class="cmp-words__mark" aria-hidden="true" />
				{:else if separator === 'slash'}
					<span class="cmp-words__slash" aria-hidden="true">/</span>
				{/if}
			</li>
		{/each}
	</ul>
{/snippet}

{#if phrases.length}
	<section class="cmp-words cmp-words--{tone} cmp-words--{size}" class:cmp-words--band={tone !== 'plain'}>
		<Marquee {seconds} reverse={s.reverse === true} label="moving words" content={line} />
	</section>
{/if}

<style>
	.cmp-words {
		padding-block: clamp(12px, 1.8vw, 24px);
		color: hsl(var(--foreground));
	}

	.cmp-words--accent {
		background: hsl(var(--primary));
		color: hsl(var(--primary-foreground));
	}

	.cmp-words--dark {
		background: hsl(var(--foreground));
		color: hsl(var(--background));
	}

	.cmp-words__list {
		display: flex;
		flex: none;
		align-items: center;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.cmp-words__phrase {
		display: flex;
		flex: none;
		align-items: center;
		gap: 0.4em;
		padding-inline-end: 0.4em;
		font-family: var(--font-heading, inherit);
		font-size: clamp(2.25rem, 6.5vw, 5rem);
		font-weight: 800;
		/* The strip clips what overflows it: a tighter line would cut the tails off g and y. */
		line-height: 1.25;
		letter-spacing: var(--tracking-display, -0.025em);
		white-space: nowrap;
	}

	.cmp-words--huge .cmp-words__phrase {
		font-size: clamp(3.25rem, 10.5vw, 8.5rem);
	}

	.cmp-words__phrase :global(.cmp-words__mark) {
		flex: none;
		width: 0.72em;
		height: 0.72em;
		stroke-width: 3;
	}

	.cmp-words__slash {
		font-weight: 400;
	}

	/* Stood still it is ordinary text: a phrase wider than a phone must wrap, not run off the page. */
	@media (prefers-reduced-motion: reduce) {
		.cmp-words__list {
			flex: auto;
			flex-wrap: wrap;
			justify-content: center;
			padding-inline: var(--container-gutter, 16px);
		}
		.cmp-words__phrase {
			flex: 0 1 auto;
			min-width: 0;
			white-space: normal;
			overflow-wrap: break-word;
		}
	}
</style>
