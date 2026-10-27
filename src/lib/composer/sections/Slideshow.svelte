<script lang="ts">
	import { ChevronLeft, ChevronRight, Pause, Play } from '@lucide/svelte'
	import ComposerButton from '../ComposerButton.svelte'
	import Paragraphs from '../Paragraphs.svelte'
	import { slideInterval, slideItems, type ComposerSection } from '../helpers.js'

	/**
	 * Several pictures, one at a time. It stays put unless the merchant switched on autoplay; even
	 * then it waits while the pointer or focus is on it, offers a pause button (WCAG 2.2.2), and
	 * never moves by itself for a shopper who asked their device to reduce motion. Only the slide
	 * on show can be reached with the keyboard: the others are inert.
	 */
	let { section, priority = false }: { section: ComposerSection; priority?: boolean } = $props()

	const slides = $derived(slideItems(section.settings?.slides))
	const autoplay = $derived(section.settings?.autoplay === true)
	const interval = $derived(slideInterval(section.settings?.interval))

	let index = $state(0)
	let paused = $state(false)
	let hovering = $state(false)
	let reduced = $state(false)
	const current = $derived(Math.min(index, Math.max(0, slides.length - 1)))
	const moving = $derived(autoplay && !paused && !hovering && !reduced && slides.length > 1)

	$effect(() => {
		const mq = matchMedia('(prefers-reduced-motion: reduce)')
		reduced = mq.matches
		const on = (e: MediaQueryListEvent) => (reduced = e.matches)
		mq.addEventListener('change', on)
		return () => mq.removeEventListener('change', on)
	})

	$effect(() => {
		if (!moving) return
		const timer = setInterval(() => go(current + 1), interval)
		return () => clearInterval(timer)
	})

	function go(to: number) {
		const n = slides.length
		if (n) index = ((to % n) + n) % n
	}

	function onkeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowLeft') {
			e.preventDefault()
			go(current - 1)
		} else if (e.key === 'ArrowRight') {
			e.preventDefault()
			go(current + 1)
		}
	}

	// A swipe on a touch screen: far enough sideways, and more sideways than down.
	let startX = 0
	let startY = 0
	function pointerdown(e: PointerEvent) {
		startX = e.clientX
		startY = e.clientY
	}
	function pointerup(e: PointerEvent) {
		const dx = e.clientX - startX
		if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(e.clientY - startY)) go(current + (dx < 0 ? 1 : -1))
	}
</script>

{#if slides.length}
	<!-- The hover and focus listeners only hold autoplay still while the shopper is on it, and the
	     arrow keys are a shortcut: the buttons below are the way through for everyone. -->
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<section
		class="cmp-slides"
		aria-roledescription="carousel"
		aria-label={slides[0].heading || 'Slideshow'}
		onmouseenter={() => (hovering = true)}
		onmouseleave={() => (hovering = false)}
		onfocusin={() => (hovering = true)}
		onfocusout={() => (hovering = false)}
		{onkeydown}
	>
		<!-- A swipe is a touch shortcut for the same buttons. -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="cmp-slides__viewport" onpointerdown={pointerdown} onpointerup={pointerup}>
			<div class="cmp-slides__track" style:transform="translateX(-{current * 100}%)" aria-live={moving ? 'off' : 'polite'}>
				{#each slides as slide, i (i)}
					<div
						class="cmp-slide"
						class:cmp-slide--words={!!(slide.heading || slide.buttonText)}
						role="group"
						aria-roledescription="slide"
						aria-label="{i + 1} of {slides.length}"
						inert={i !== current}
					>
						<picture class="cmp-slide__media">
							{#if slide.mobileImage && slide.mobileImage !== slide.image}
								<source media="(max-width: 767px)" srcset={slide.mobileImage} />
							{/if}
							<img
								src={slide.image}
								alt={slide.heading}
								width="1600"
								height="700"
								loading={priority && i === 0 ? 'eager' : 'lazy'}
								fetchpriority={priority && i === 0 ? 'high' : 'auto'}
								decoding="async"
							/>
						</picture>
						{#if slide.heading || slide.buttonText || slide.text}
							<div class="cmp-slide__body">
								{#if slide.heading}<h2 class="cmp-slide__title">{slide.heading}</h2>{/if}
								<Paragraphs value={slide.text} class="cmp-slide__text" />
								<div class="cmp-slide__actions">
									<ComposerButton href={slide.buttonLink} label={slide.buttonText} />
								</div>
							</div>
						{/if}
					</div>
				{/each}
			</div>
		</div>

		{#if slides.length > 1}
			<div class="page-width cmp-slides__controls">
				<button type="button" class="cmp-slides__btn" onclick={() => go(current - 1)} aria-label="Previous slide">
					<ChevronLeft aria-hidden="true" />
				</button>
				<div class="cmp-slides__dots">
					{#each slides as _, i (i)}
						<button
							type="button"
							class="cmp-slides__dot"
							class:cmp-slides__dot--on={i === current}
							aria-label="Show slide {i + 1} of {slides.length}"
							aria-current={i === current ? 'true' : undefined}
							onclick={() => go(i)}
						></button>
					{/each}
				</div>
				<button type="button" class="cmp-slides__btn" onclick={() => go(current + 1)} aria-label="Next slide">
					<ChevronRight aria-hidden="true" />
				</button>
				{#if autoplay && !reduced}
					<button
						type="button"
						class="cmp-slides__btn"
						onclick={() => (paused = !paused)}
						aria-label={paused ? 'Play the slideshow' : 'Pause the slideshow'}
					>
						{#if paused}<Play aria-hidden="true" />{:else}<Pause aria-hidden="true" />{/if}
					</button>
				{/if}
			</div>
		{/if}
	</section>
{/if}

<style>
	.cmp-slides {
		position: relative;
		background: var(--ed-canvas, hsl(var(--muted)));
	}

	.cmp-slides__viewport {
		overflow: hidden;
		touch-action: pan-y;
	}

	.cmp-slides__track {
		display: flex;
		transition: transform 300ms var(--motion-ease, ease-out);
	}

	.cmp-slide {
		position: relative;
		flex: 0 0 100%;
		min-width: 0;
	}

	/* The box is sized before the picture arrives: no layout shift. */
	.cmp-slide__media {
		display: block;
		aspect-ratio: 4 / 3;
		background: hsl(var(--muted));
	}

	.cmp-slide__media img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	/* On a phone the words sit under the picture, on the page's own colours. */
	.cmp-slide__body {
		display: grid;
		gap: 10px;
		padding: 18px var(--container-gutter, 16px) 4px;
		color: hsl(var(--foreground));
	}

	.cmp-slide__title {
		margin: 0;
		font-family: var(--font-heading, inherit);
		font-size: clamp(1.5rem, 3.6vw, 2.75rem);
		font-weight: 500;
		line-height: 1.1;
		overflow-wrap: anywhere;
	}

	.cmp-slide__body :global(.cmp-slide__text) {
		font-size: 1rem;
		line-height: 1.55;
	}

	.cmp-slide__actions:empty {
		display: none;
	}

	.cmp-slides__controls {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 4px;
		padding-block: 10px;
	}

	.cmp-slides__btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 44px;
		border-radius: 999px;
		color: hsl(var(--foreground));
		transition:
			background-color var(--motion-fast, 150ms) var(--motion-ease, ease-out),
			transform var(--motion-fast, 150ms) var(--motion-ease, ease-out);
	}

	.cmp-slides__btn :global(svg) {
		width: 20px;
		height: 20px;
	}

	.cmp-slides__btn:hover {
		background: hsl(var(--foreground) / 0.08);
	}

	.cmp-slides__btn:active {
		transform: scale(0.94);
	}

	.cmp-slides__dots {
		display: flex;
		align-items: center;
	}

	/* A 24px target round an 8px dot. */
	.cmp-slides__dot {
		position: relative;
		width: 24px;
		height: 44px;
	}

	.cmp-slides__dot::after {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		width: 8px;
		height: 8px;
		margin: -4px 0 0 -4px;
		border-radius: 999px;
		background: hsl(var(--foreground) / 0.3);
		transition:
			transform 200ms var(--motion-ease, ease-out),
			background-color 200ms var(--motion-ease, ease-out);
	}

	.cmp-slides__dot--on::after {
		background: hsl(var(--foreground));
		transform: scale(1.35);
	}

	@media (min-width: 768px) {
		.cmp-slide__media {
			aspect-ratio: 16 / 7;
		}

		/* From the tablet up the words sit on the picture, over a shade that keeps them readable
		   whatever the picture is. */
		.cmp-slide--words .cmp-slide__media::after {
			content: '';
			position: absolute;
			inset: 0;
			background: linear-gradient(to top, rgb(0 0 0 / 0.6), rgb(0 0 0 / 0) 65%);
			pointer-events: none;
		}

		.cmp-slide__body {
			position: absolute;
			inset: auto 0 0;
			max-width: calc(var(--container-max, 1240px) + 2 * var(--container-gutter, 32px));
			margin-inline: auto;
			padding: 0 var(--container-gutter, 32px) clamp(24px, 4vw, 48px);
			/* Over the shade, whatever the theme: the shade is always dark. */
			color: white;
		}

		.cmp-slide__title,
		.cmp-slide__body :global(.cmp-slide__text) {
			max-width: 36rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.cmp-slides__track {
			transition: none;
		}
		.cmp-slides__btn:active {
			transform: none;
		}
		.cmp-slides__dot::after {
			transition: none;
		}
	}
</style>
