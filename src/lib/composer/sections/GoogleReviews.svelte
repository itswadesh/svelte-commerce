<script lang="ts">
	import { onMount } from 'svelte'
	import { Star } from '@lucide/svelte'
	import { text, type ComposerSection } from '../helpers.js'
	import { loadGoogleReviews, type GoogleReviews } from '$lib/google-reviews'

	/**
	 * The store's Google rating and Google's most relevant reviews (GoCommerce ext/google-reviews),
	 * drawn as Google's Places policies ask
	 * (developers.google.com/maps/documentation/places/web-service/policies): each author named with
	 * their photo and profile link, each review linked on Google Maps with a way to report it, a
	 * notice saying how the reviews were chosen, a link to all of them, and the Google Maps logo,
	 * all in one container set apart from the shop's own content. No structured data: Google's
	 * review-snippet rules say not to mark up ratings taken from another site.
	 *
	 * Nothing renders until Google has answered with a rating. Every answer is a call the store pays
	 * Google for, and Google's terms forbid keeping it, so the section asks only when a shopper is
	 * about to scroll to it. It asks about a screen and a half ahead, so it grows below the fold and
	 * moves nothing a shopper is looking at; a placeholder would instead snap shut whenever Google
	 * has nothing to show.
	 *
	 * `load` is the connector's service unless a caller passes its own (the tests).
	 */
	let { section, load = loadGoogleReviews }: { section: ComposerSection; load?: () => Promise<GoogleReviews | null> } = $props()

	const heading = $derived(text(section.settings, 'heading') || 'Reviews on Google')
	const headingId = $derived(`cmp-gr-${section.id}`)
	const nf = new Intl.NumberFormat()
	const monthOf = new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric', timeZone: 'UTC' })

	let place = $state<GoogleReviews | null>(null)
	let anchor: HTMLDivElement

	onMount(() => {
		const io = new IntersectionObserver(
			(entries) => {
				if (!entries.some((e) => e.isIntersecting)) return
				io.disconnect()
				load()
					.then((p) => (place = p?.count ? p : null))
					.catch(() => (place = null))
			},
			{ rootMargin: '1200px 0px' }
		)
		io.observe(anchor)
		return () => io.disconnect()
	})

	const fill = (value: number) => `${(Math.min(5, Math.max(0, value)) / 5) * 100}%`

	function visited(value: string): string {
		const [y, m] = value.split('-').map(Number)
		return y && m ? monthOf.format(new Date(Date.UTC(y, m - 1, 1))) : ''
	}
</script>

{#snippet stars(value: number)}
	<span class="cmp-gr__stars" role="img" aria-label="Rated {value} out of 5">
		<span class="cmp-gr__stars-row" aria-hidden="true">
			{#each [0, 1, 2, 3, 4] as i (i)}<Star />{/each}
		</span>
		<span class="cmp-gr__stars-row cmp-gr__stars-row--on" style:width={fill(value)} aria-hidden="true">
			{#each [0, 1, 2, 3, 4] as i (i)}<Star fill="currentColor" />{/each}
		</span>
	</span>
{/snippet}

<div bind:this={anchor} class="cmp-gr__anchor"></div>
{#if place}
	<section class="cmp-band cmp-gr" aria-labelledby={headingId}>
		<div class="page-width">
			<div class="cmp-gr__box bg-card">
				<div class="cmp-gr__head">
					<h2 id={headingId} class="cmp-head__title">{heading}</h2>
					<p class="cmp-gr__score">
						<span class="cmp-gr__value">{place.rating.toFixed(1)}</span>
						{@render stars(place.rating)}
						<span class="cmp-gr__count">{nf.format(place.count)} {place.count === 1 ? 'review' : 'reviews'}</span>
					</p>
				</div>

				{#if place.reviews.length}
					<ul class="cmp-gr__list">
						{#each place.reviews as r, i (i)}
							<li class="cmp-gr__review">
								<div class="cmp-gr__author">
									{#if r.authorPhoto}
										<img src={r.authorPhoto} alt="" width="32" height="32" loading="lazy" decoding="async" referrerpolicy="no-referrer" />
									{/if}
									{#if r.authorUrl}
										<a class="cmp-gr__name" href={r.authorUrl} target="_blank" rel="noopener nofollow">{r.author}</a>
									{:else}
										<span class="cmp-gr__name">{r.author}</span>
									{/if}
								</div>
								<p class="cmp-gr__meta">
									{@render stars(r.rating)}
									{#if r.when}<span>{r.when}</span>{/if}
									{#if r.visited && visited(r.visited)}<span>Visited {visited(r.visited)}</span>{/if}
								</p>
								{#if r.text}<p class="cmp-gr__text" lang={r.language || undefined}>{r.text}</p>{/if}
								{#if r.url || r.reportUrl}
									<p class="cmp-gr__links">
										{#if r.url}<a href={r.url} target="_blank" rel="noopener nofollow" aria-label="Read {r.author}'s review on Google Maps"
												>Read on Google Maps</a
											>{/if}
										{#if r.reportUrl}<a href={r.reportUrl} target="_blank" rel="noopener nofollow" aria-label="Report {r.author}'s review to Google"
												>Report</a
											>{/if}
									</p>
								{/if}
							</li>
						{/each}
					</ul>
				{/if}

				<div class="cmp-gr__foot">
					{#if place.reviews.length}
						<p class="cmp-gr__note">
							Google's {place.reviews.length} most relevant {place.reviews.length === 1 ? 'review' : 'reviews'} of {nf.format(place.count)}, in
							Google's order, none left out. Google doesn't verify reviews, but removes fake ones it finds.
						</p>
					{/if}
					{#if place.mapsUrl}
						<a class="cmp-gr__all" href={place.mapsUrl} target="_blank" rel="noopener nofollow">See all reviews on Google</a>
					{/if}
					<img class="cmp-gr__logo" src="/attribution/google-maps.svg" alt="Google Maps" width="98" height="18" />
				</div>
			</div>
		</div>
	</section>
{/if}

<style>
	.cmp-gr__anchor {
		height: 0;
	}

	.cmp-gr__box {
		display: grid;
		gap: 16px;
		padding: clamp(16px, 4vw, 32px);
		border: 1px solid hsl(var(--border));
		border-radius: var(--radius, 0.5rem);
		animation: cmp-gr-in 250ms var(--motion-ease, ease-out);
	}

	@keyframes cmp-gr-in {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
	}

	.cmp-gr__head {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		justify-content: space-between;
		gap: 8px 16px;
	}

	.cmp-gr__score {
		display: inline-flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 8px;
		margin: 0;
	}

	.cmp-gr__value {
		font-size: 1.5rem;
		font-weight: 700;
		line-height: 1;
	}

	.cmp-gr__count,
	.cmp-gr__meta,
	.cmp-gr__note {
		color: hsl(var(--muted-foreground));
		font-size: 0.875rem;
	}

	.cmp-gr__stars {
		position: relative;
		display: inline-block;
		flex: none;
		line-height: 0;
	}

	.cmp-gr__stars-row {
		display: inline-flex;
		color: hsl(var(--muted-foreground) / 0.5);
	}

	.cmp-gr__stars-row--on {
		position: absolute;
		inset: 0 auto 0 0;
		overflow: hidden;
		color: hsl(var(--primary-ink, var(--primary)));
	}

	.cmp-gr__stars-row :global(svg) {
		flex: none;
		width: 16px;
		height: 16px;
	}

	.cmp-gr__list {
		display: grid;
		gap: 12px;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	@media (min-width: 640px) {
		.cmp-gr__list {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (min-width: 1024px) {
		.cmp-gr__list {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}

	.cmp-gr__review {
		display: grid;
		align-content: start;
		gap: 8px;
		min-width: 0;
		padding: 14px;
		border: 1px solid hsl(var(--border));
		border-radius: var(--radius, 0.5rem);
		background: hsl(var(--background));
	}

	.cmp-gr__author {
		display: flex;
		align-items: center;
		gap: 10px;
		min-width: 0;
	}

	.cmp-gr__author img {
		flex: none;
		width: 32px;
		height: 32px;
		border-radius: 9999px;
		object-fit: cover;
	}

	.cmp-gr__name {
		overflow: hidden;
		font-weight: 600;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.cmp-gr__meta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 4px 8px;
		margin: 0;
	}

	.cmp-gr__text {
		display: -webkit-box;
		margin: 0;
		overflow: hidden;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 5;
		line-clamp: 5;
		overflow-wrap: anywhere;
	}

	.cmp-gr__links {
		display: flex;
		flex-wrap: wrap;
		gap: 4px 16px;
		margin: 0;
		font-size: 0.875rem;
	}

	.cmp-gr a {
		border-radius: 2px;
		text-decoration-color: hsl(var(--muted-foreground) / 0.6);
		text-underline-offset: 3px;
		transition:
			text-decoration-color var(--motion-fast, 150ms) var(--motion-ease, ease-out),
			opacity var(--motion-fast, 150ms) var(--motion-ease, ease-out);
	}

	.cmp-gr__links a,
	.cmp-gr__name[href] {
		text-decoration-line: underline;
	}

	.cmp-gr a:hover {
		text-decoration-color: currentColor;
	}

	.cmp-gr a:focus-visible {
		outline: 2px solid hsl(var(--ring));
		outline-offset: 2px;
	}

	.cmp-gr__foot {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 12px 16px;
	}

	.cmp-gr__note {
		flex: 1 1 260px;
		margin: 0;
	}

	.cmp-gr .cmp-gr__all {
		display: inline-flex;
		align-items: center;
		min-height: 44px;
		padding: 0 18px;
		border: 1px solid hsl(var(--foreground));
		border-radius: var(--radius, 0.5rem);
		font-size: 0.875rem;
		font-weight: 600;
		text-decoration: none;
		transition:
			transform var(--motion-fast, 150ms) var(--motion-ease, ease-out),
			background-color var(--motion-fast, 150ms) var(--motion-ease, ease-out);
	}

	.cmp-gr .cmp-gr__all:hover {
		background: hsl(var(--muted));
	}

	.cmp-gr .cmp-gr__all:active {
		transform: scale(0.98);
	}

	/* Google's clear space around its logo: 10 on the sides and top, 5 below. */
	.cmp-gr__logo {
		flex: none;
		width: 98px;
		height: 18px;
		margin: 10px 10px 5px;
	}

	@media (prefers-reduced-motion: reduce) {
		.cmp-gr__box {
			animation: none;
		}
		.cmp-gr .cmp-gr__all:active {
			transform: none;
		}
	}
</style>
