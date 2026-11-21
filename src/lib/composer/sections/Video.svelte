<script lang="ts">
	import { Play } from '@lucide/svelte'
	import { safeHref, text, videoSource, type ComposerSection } from '../helpers.js'

	/**
	 * A video that plays only when pressed. A YouTube or Vimeo video is a picture and a play button
	 * until then — nothing is fetched from either service before the shopper asks — and the embed is
	 * youtube-nocookie.com or Vimeo with do-not-track. A file from the merchant's library is a plain
	 * video element with controls, which never starts by itself.
	 */
	let { section }: { section: ComposerSection } = $props()

	const s = $derived(section.settings ?? {})
	const heading = $derived(text(s, 'heading'))
	const caption = $derived(text(s, 'caption'))
	const poster = $derived(safeHref(s.poster))
	const source = $derived(videoSource(s))
	const label = $derived(heading || caption || 'Video')

	let playing = $state(false)
</script>

{#if source}
	<section class="cmp-band">
		<div class="page-width">
			{#if heading}
				<header class="cmp-head"><h2 class="cmp-head__title">{heading}</h2></header>
			{/if}
			<figure class="cmp-video">
				<div class="cmp-video__frame">
					{#if source.kind === 'file'}
						<!-- The merchant's own clip: a captions file is not something the section holds yet. -->
						<!-- svelte-ignore a11y_media_has_caption -->
						<video controls preload="none" playsinline poster={poster || undefined} aria-label={label}>
							<source src={source.src} type="video/mp4" />
						</video>
					{:else if playing}
						<iframe
							src={source.embed}
							title={label}
							allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
							allowfullscreen
							referrerpolicy="strict-origin-when-cross-origin"
						></iframe>
					{:else}
						<button type="button" class="cmp-video__poster" onclick={() => (playing = true)} aria-label="Play {label}">
							{#if poster}
								<img src={poster} alt="" width="1280" height="720" loading="lazy" decoding="async" />
							{/if}
							<span class="cmp-video__play" aria-hidden="true"><Play /></span>
						</button>
					{/if}
				</div>
				{#if caption}<figcaption class="cmp-video__caption">{caption}</figcaption>{/if}
			</figure>
		</div>
	</section>
{/if}

<style>
	.cmp-video {
		margin: 0;
	}

	/* 16:9 before anything loads: no layout shift when the player arrives. */
	.cmp-video__frame {
		position: relative;
		overflow: hidden;
		border-radius: var(--radius, 0.5rem);
		aspect-ratio: 16 / 9;
		background: hsl(var(--muted));
	}

	.cmp-video__frame video,
	.cmp-video__frame iframe,
	.cmp-video__poster,
	.cmp-video__poster img {
		position: absolute;
		inset: 0;
		display: block;
		width: 100%;
		height: 100%;
		border: 0;
	}

	.cmp-video__frame video {
		background: hsl(var(--foreground));
	}

	.cmp-video__poster {
		cursor: pointer;
	}

	.cmp-video__poster img {
		object-fit: cover;
	}

	.cmp-video__play {
		position: absolute;
		top: 50%;
		left: 50%;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 72px;
		height: 72px;
		margin: -36px 0 0 -36px;
		border-radius: 999px;
		background: hsl(var(--primary));
		color: hsl(var(--primary-foreground));
		box-shadow: 0 6px 20px rgb(0 0 0 / 0.25);
		transition: transform 200ms var(--motion-ease, ease-out);
	}

	.cmp-video__play :global(svg) {
		width: 28px;
		height: 28px;
		margin-left: 3px;
	}

	.cmp-video__poster:hover .cmp-video__play {
		transform: scale(1.08);
	}

	.cmp-video__poster:active .cmp-video__play {
		transform: scale(0.96);
	}

	.cmp-video__caption {
		margin-top: 10px;
		color: hsl(var(--muted-foreground));
		font-size: 0.9rem;
		overflow-wrap: anywhere;
	}

	@media (prefers-reduced-motion: reduce) {
		.cmp-video__play {
			transition: none;
		}
		.cmp-video__poster:hover .cmp-video__play,
		.cmp-video__poster:active .cmp-video__play {
			transform: none;
		}
	}
</style>
