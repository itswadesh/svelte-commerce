<script lang="ts">
	import ComposerButton from '../ComposerButton.svelte'
	import Paragraphs from '../Paragraphs.svelte'
	import { choice, countdownEnd, countdownParts, safeHref, text, type ComposerSection } from '../helpers.js'

	/**
	 * A sale or a launch with the time left to one moment, the same for every shopper. The digits
	 * start with the page's script: a server's clock drawn into the page would change as it wakes,
	 * so until then they hold their place as dashes. Past its end the section is taken off the page
	 * or says the shop's message, and a section with no end set draws nothing.
	 */
	let { section }: { section: ComposerSection } = $props()

	const s = $derived(section.settings ?? {})
	const end = $derived(countdownEnd(s.ends_at))
	const tone = $derived(choice(s.tone, ['accent', 'dark', 'quiet'], 'accent'))
	const heading = $derived(text(s, 'heading'))
	const eyebrow = $derived(text(s, 'eyebrow'))
	const image = $derived(safeHref(s.image))
	const alt = $derived(text(s, 'image_alt') || heading)
	const endedText = $derived(text(s, 'after_end') === 'message' ? text(s, 'ended_text') : '')

	let now = $state<number | null>(null)
	const ended = $derived(end !== null && (now ?? Date.now()) >= end)
	const parts = $derived(end !== null && now !== null ? countdownParts(end, now) : null)
	const units = $derived([
		{ label: 'Days', value: parts?.days },
		{ label: 'Hours', value: parts?.hours },
		{ label: 'Minutes', value: parts?.minutes },
		{ label: 'Seconds', value: parts?.seconds }
	])

	const two = (n: number | undefined) => (n === undefined ? '--' : String(n).padStart(2, '0'))

	$effect(() => {
		if (end === null) return
		now = Date.now()
		if (now >= end) return
		const tick = setInterval(() => {
			now = Date.now()
			if (now >= end) clearInterval(tick)
		}, 1000)
		return () => clearInterval(tick)
	})
</script>

{#if end !== null && (!ended || endedText)}
	<section class="cmp-band">
		<div class="page-width">
			<div class="cmp-count cmp-count--{tone}" class:cmp-count--picture={!!image}>
				{#if image}
					<div class="cmp-count__media">
						<img src={image} {alt} width="900" height="700" loading="lazy" decoding="async" />
					</div>
				{/if}
				<div class="cmp-count__body">
					{#if ended}
						<p class="cmp-count__title">{endedText}</p>
					{:else}
						{#if eyebrow}<span class="cmp-eyebrow-ink">{eyebrow}</span>{/if}
						{#if heading}<h2 class="cmp-count__title">{heading}</h2>{/if}
						<Paragraphs value={s.body} class="cmp-count__text" />
						<div class="cmp-count__clock" role="timer">
							{#each units as unit (unit.label)}
								<div class="cmp-count__unit">
									<span class="cmp-count__digits">{two(unit.value)}</span>
									<span class="cmp-count__label">{unit.label}</span>
								</div>
							{/each}
						</div>
						<div class="cmp-count__actions">
							<ComposerButton href={s.button_link} label={text(s, 'button_text')} variant={tone === 'accent' ? 'inverse' : 'primary'} />
						</div>
					{/if}
				</div>
			</div>
		</div>
	</section>
{/if}

<style>
	.cmp-count {
		display: grid;
		overflow: hidden;
		border-radius: calc(var(--radius, 0.5rem) * 2);
	}

	/* Each tone is a pair the theme editor already checks or the page already reads at. */
	.cmp-count--accent {
		background: hsl(var(--primary));
		color: hsl(var(--primary-foreground));
	}

	.cmp-count--dark {
		background: hsl(var(--foreground));
		color: hsl(var(--background));
		/* The button's fill is the accent on any other block; here it takes the block's own words. */
		--primary: var(--background);
		--primary-foreground: var(--foreground);
	}

	.cmp-count--quiet {
		background: hsl(var(--muted));
		color: hsl(var(--foreground));
	}

	.cmp-count__media {
		min-height: 220px;
		background: hsl(var(--muted));
	}

	.cmp-count__media img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.cmp-count__body {
		display: grid;
		gap: 12px;
		align-content: center;
		justify-items: start;
		min-width: 0;
		padding: clamp(24px, 4.5vw, 64px);
	}

	.cmp-count__title {
		margin: 0;
		font-family: var(--font-heading, inherit);
		font-size: var(--type-section-title, clamp(1.5rem, 3vw, 2.125rem));
		font-weight: var(--weight-heading, 700);
		line-height: var(--leading-title, 1.15);
		letter-spacing: var(--tracking-title, -0.01em);
		text-wrap: balance;
		overflow-wrap: break-word;
		min-width: 0;
	}

	.cmp-count__body :global(.cmp-count__text) {
		max-width: 34rem;
		line-height: var(--leading-body, 1.5);
	}

	.cmp-count__clock {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 8px;
		width: 100%;
		max-width: 34rem;
		padding-block: 4px;
	}

	/* A wash of the block's own words, so it holds on any of the three colours. */
	.cmp-count__unit {
		position: relative;
		isolation: isolate;
		display: grid;
		gap: 2px;
		justify-items: center;
		min-width: 0;
		padding: clamp(12px, 1.4vw, 16px) 4px;
		overflow: hidden;
		border-radius: var(--radius, 0.5rem);
	}

	.cmp-count__unit::before {
		content: '';
		position: absolute;
		inset: 0;
		z-index: -1;
		background: currentColor;
		opacity: 0.1;
	}

	.cmp-count__digits {
		font-family: var(--font-heading, inherit);
		font-size: clamp(1.75rem, 4.6vw, 3.25rem);
		font-weight: var(--weight-heading, 700);
		line-height: 1;
		letter-spacing: var(--tracking-title, -0.01em);
		font-variant-numeric: tabular-nums;
	}

	.cmp-count__label {
		font-size: var(--type-label, 0.75rem);
		font-weight: 500;
	}

	.cmp-count__actions:empty {
		display: none;
	}

	.cmp-count__actions {
		padding-top: 4px;
	}

	.cmp-count--accent .cmp-count__actions :global(.cmp-btn:focus-visible),
	.cmp-count--dark .cmp-count__actions :global(.cmp-btn:focus-visible) {
		outline: 3px solid currentColor;
		outline-offset: 3px;
	}

	@media (min-width: 768px) {
		.cmp-count--picture {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
		.cmp-count--picture .cmp-count__media {
			position: relative;
			min-height: 0;
		}
		.cmp-count--picture .cmp-count__media img {
			position: absolute;
			inset: 0;
		}
	}
</style>
