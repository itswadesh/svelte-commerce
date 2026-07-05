<script lang="ts">
	/**
	 * Maison Émeraude wordmark — gem SVG mark + serif logotype.
	 * `variant="light"` renders white text for use on dark backgrounds (footer).
	 */
	let {
		href = '/',
		variant = 'default',
		class: className = ''
	}: { href?: string; variant?: 'default' | 'light'; class?: string } = $props()
</script>

<a
	{href}
	class="inline-flex items-center gap-2.5 font-serif text-[1.7rem] font-bold leading-none tracking-[0.02em] {variant ===
	'light'
		? 'text-white'
		: 'text-emerald-900'} {className}"
	aria-label="Maison Émeraude — home"
>
	<span class="h-[26px] w-[26px] shrink-0 text-gold" aria-hidden="true">
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" class="h-full w-full">
			<path d="M5 9h14l-7 12z" />
			<path d="M5 9l3-5h8l3 5" />
			<path d="M9 4l-1 5M15 4l1 5M8 9h8" />
		</svg>
	</span>
	<span>Maison<span class="text-gold">Émeraude</span></span>
</a>
