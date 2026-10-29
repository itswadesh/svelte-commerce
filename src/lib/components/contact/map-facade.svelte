<script lang="ts">
	import { MapPin, ExternalLink } from '@lucide/svelte'
	import { tick } from 'svelte'

	/**
	 * A map that costs nothing until it is asked for.
	 *
	 * Google's embed is a megabyte of script and sets third-party cookies, so the page draws a
	 * still picture of a map in CSS with a "Show map" button, and the frame is only put in the
	 * page when a shopper taps it. The box keeps one height before, during and after, so nothing
	 * moves (CLS 0). "Open in Google Maps" beside it is a plain link that works without loading
	 * anything, and is all there is when the store gave a share link and no address to frame.
	 */
	let { embed, open, label }: { embed: string | null; open: string; label: string } = $props()

	let shown = $state(false)
	let loaded = $state(false)
	let frame = $state<HTMLIFrameElement | null>(null)

	async function show() {
		shown = true
		await tick()
		// The button is gone; the map is where the shopper's focus belongs now.
		frame?.focus()
	}
</script>

{#if embed}
	<div class="map-box relative overflow-hidden rounded-lg border bg-muted">
		<!-- The still picture: blocks, roads and a river drawn in the theme's own greys. -->
		<svg class="absolute inset-0 h-full w-full text-muted-foreground" aria-hidden="true" preserveAspectRatio="xMidYMid slice" viewBox="0 0 400 240">
			<g fill="currentColor" opacity="0.07">
				<rect x="12" y="14" width="86" height="54" rx="3" /><rect x="114" y="14" width="64" height="54" rx="3" />
				<rect x="226" y="14" width="74" height="40" rx="3" /><rect x="316" y="14" width="72" height="62" rx="3" />
				<rect x="12" y="92" width="58" height="62" rx="3" /><rect x="86" y="92" width="92" height="40" rx="3" />
				<rect x="226" y="74" width="74" height="58" rx="3" /><rect x="316" y="96" width="72" height="40" rx="3" />
				<rect x="12" y="176" width="86" height="52" rx="3" /><rect x="114" y="152" width="64" height="76" rx="3" />
				<rect x="226" y="154" width="74" height="74" rx="3" /><rect x="316" y="160" width="72" height="68" rx="3" />
			</g>
			<g fill="none" stroke="currentColor" stroke-linecap="round">
				<path d="M0 80h400M0 142h400M106 0v240M202 0v240M308 0v240" stroke-width="9" opacity="0.14" />
				<path d="M0 80h400M0 142h400M106 0v240M202 0v240M308 0v240" stroke-width="1" opacity="0.2" stroke-dasharray="6 6" />
				<path d="M-10 208c60-20 90 10 150-6s80-48 140-40 90 28 130 14" stroke-width="12" opacity="0.1" />
			</g>
		</svg>

		{#if shown}
			<!-- Lazy too, so a shopper who taps and scrolls straight on still costs nothing. -->
			<iframe
				bind:this={frame}
				src={embed}
				title="Map: {label}"
				loading="lazy"
				referrerpolicy="no-referrer-when-downgrade"
				allowfullscreen
				class="map-frame absolute inset-0 h-full w-full border-0"
				class:loaded
				onload={() => (loaded = true)}
			></iframe>
		{/if}

		{#if !loaded}
			<div class="map-cover absolute inset-0 flex flex-col items-center justify-center gap-3 p-4 text-center" class:waiting={shown}>
				<span class="flex h-11 w-11 items-center justify-center rounded-full bg-background text-foreground shadow-sm">
					<MapPin class="h-5 w-5" aria-hidden="true" />
				</span>
				{#if shown}
					<p class="text-sm font-medium text-foreground" role="status">Loading the map…</p>
				{:else}
					<button type="button" class="map-show min-h-11 rounded-md border border-transparent bg-background px-4 text-sm font-semibold text-foreground shadow-sm" onclick={show}>
						Show map
					</button>
					<p class="text-xs text-muted-foreground">Loads a map from Google</p>
				{/if}
			</div>
		{/if}
	</div>
{/if}

<a
	href={open}
	target="_blank"
	rel="noopener noreferrer"
	class="contact-link mt-3 inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-foreground underline decoration-foreground/30 underline-offset-4 transition-colors duration-fast ease-standard hover:decoration-foreground"
>
	Open in Google Maps
	<ExternalLink class="h-3.5 w-3.5" aria-hidden="true" />
	<span class="sr-only">(opens in a new tab)</span>
</a>

<style>
	/* One height before the tap, while loading and after: the frame replaces the picture in place. */
	.map-box {
		height: 240px;
	}
	@media (min-width: 1024px) {
		.map-box {
			height: 300px;
		}
	}
	/* The map fades in over the picture once Google has drawn it. Opacity only, so under reduced
	   motion it is the same: a fade is feedback, not movement. */
	.map-frame {
		opacity: 0;
		transition: opacity var(--motion-panel) var(--motion-ease);
	}
	.map-frame.loaded {
		opacity: 1;
	}
	.map-cover.waiting {
		animation: map-wait 1.2s var(--motion-ease) infinite alternate;
	}
	@keyframes map-wait {
		to {
			opacity: 0.6;
		}
	}
	/* A border and a dim answer the pointer in every mode; the lift and press add movement where
	   it is welcome. */
	.map-show {
		transition:
			transform var(--motion-fast) var(--motion-ease),
			border-color var(--motion-fast) var(--motion-ease),
			opacity var(--motion-fast) var(--motion-ease);
	}
	@media (hover: hover) {
		.map-show:hover {
			border-color: hsl(var(--foreground) / 0.35);
		}
	}
	.map-show:active {
		opacity: 0.85;
	}
	@media (prefers-reduced-motion: no-preference) {
		@media (hover: hover) {
			.map-show:hover {
				transform: translateY(-2px);
			}
		}
		.map-show:active {
			transform: scale(0.97);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.map-cover.waiting {
			animation: none;
		}
	}
</style>
