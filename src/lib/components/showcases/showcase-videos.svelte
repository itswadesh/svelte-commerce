<script lang="ts">
	import { Play } from '@lucide/svelte'

	/**
	 * The store's own videos for this place (GoCommerce ext/showcases). Each is a picture and a play
	 * button until pressed, so the platform's player costs nothing on a page nobody plays it on.
	 * Nothing is drawn when the store has none.
	 */
	type Showcase = {
		slug: string
		title: string
		description: string
		label: string
		provider: string
		embedUrl: string
		watchUrl: string
		thumbnailUrl: string | null
	}
	type Place = { product: number | string } | { collection: number | string } | { on: 'home' }
	type Service = { list?: (place: Place) => Promise<Showcase[]>; recordView?: (slug: string) => Promise<void> }

	let { place }: { place: Place | null } = $props()

	let videos = $state<Showcase[]>([])
	let playing = $state<string | null>(null)

	// Reflect.get, as for the Google reviews: a connector without the service answers nothing.
	async function service() {
		const { services } = await import('kitcommerce.config')
		return Reflect.get(services as object, 'showcaseService') as Service | undefined
	}

	// A string, so only a different place reloads: the page's data refreshes more often than that, and
	// each refresh would otherwise close a player the shopper had started.
	const key = $derived(place ? JSON.stringify(place) : '')
	let current = ''
	$effect(() => {
		const asked = key
		current = asked
		videos = []
		playing = null
		if (!asked) return
		service()
			.then((s) => s?.list?.(JSON.parse(asked)))
			// Moved on to another product while this was on its way: the answer is for the old page.
			.then((list) => {
				if (asked === current) videos = list ?? []
			})
			.catch((e: unknown) => console.warn('showcases could not be read', e))
	})

	function play(video: Showcase) {
		playing = video.slug
		service()
			.then((s) => s?.recordView?.(video.slug))
			.catch(() => undefined)
	}

	// The shopper has already pressed play, so YouTube's player should not ask them to press it again.
	const playerUrl = (video: Showcase) =>
		video.provider === 'youtube' ? `${video.embedUrl}?autoplay=1&rel=0` : video.embedUrl
	const platform = (video: Showcase) => (video.provider === 'facebook' ? 'Facebook' : 'YouTube')
</script>

{#if videos.length}
	<section class="showcases" aria-labelledby="showcases-heading">
		<h2 id="showcases-heading" class="mb-4 text-lg font-semibold sm:text-xl">See it on video</h2>
		<div class="grid gap-6 sm:grid-cols-2">
			{#each videos as video (video.slug)}
				<figure class="m-0">
					<div class="frame">
						{#if playing === video.slug}
							<iframe
								src={playerUrl(video)}
								title={video.title}
								allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
								allowfullscreen
								referrerpolicy="strict-origin-when-cross-origin"
							></iframe>
						{:else}
							<button type="button" class="poster" onclick={() => play(video)} aria-label="Play {video.title}">
								{#if video.thumbnailUrl}
									<img src={video.thumbnailUrl} alt="" width="480" height="360" loading="lazy" decoding="async" />
								{/if}
								<span class="play" aria-hidden="true"><Play /></span>
							</button>
						{/if}
					</div>
					<figcaption class="mt-2 text-sm">
						<span class="font-medium">{video.title}</span>
						{#if video.label && video.label.toLowerCase() !== 'video'}
							<span class="ml-1 text-muted-foreground">· {video.label}</span>
						{/if}
						<a class="ml-1 whitespace-nowrap text-muted-foreground underline" href={video.watchUrl} target="_blank" rel="noopener noreferrer">
							Watch on {platform(video)}
						</a>
					</figcaption>
				</figure>
			{/each}
		</div>
	</section>
{/if}

<style>
	/* 16:9 before anything loads, so the player arriving moves nothing. */
	.frame {
		position: relative;
		overflow: hidden;
		aspect-ratio: 16 / 9;
		border-radius: var(--radius, 0.5rem);
		background: hsl(var(--muted));
	}
	.frame iframe,
	.poster,
	.poster img {
		position: absolute;
		inset: 0;
		display: block;
		width: 100%;
		height: 100%;
		border: 0;
	}
	.poster {
		cursor: pointer;
		padding: 0;
		background: none;
	}
	/* Centred: YouTube's still is 4:3 with black bars, and the store's pictures sit at the top of a frame. */
	.poster img {
		object-fit: cover;
		object-position: center;
	}
	.poster:focus-visible {
		outline: 2px solid hsl(var(--primary));
		outline-offset: -2px;
	}
	.play {
		position: absolute;
		top: 50%;
		left: 50%;
		display: grid;
		place-items: center;
		width: 3.5rem;
		height: 3.5rem;
		border-radius: 999px;
		color: hsl(var(--background));
		background: hsl(var(--foreground) / 0.8);
		transform: translate(-50%, -50%);
		transition:
			transform 200ms ease,
			opacity 200ms ease;
	}
	.poster:hover .play {
		transform: translate(-50%, -50%) scale(1.08);
	}
	.poster:active .play {
		opacity: 0.8;
		transform: translate(-50%, -50%) scale(0.96);
	}
	@media (prefers-reduced-motion: reduce) {
		.play {
			transition: opacity 200ms ease;
		}
		.poster:hover .play,
		.poster:active .play {
			transform: translate(-50%, -50%);
		}
	}
</style>
