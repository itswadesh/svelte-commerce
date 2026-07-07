<script lang="ts">
	import { Star } from '@lucide/svelte'

	/**
	 * Limelight rating primitive — a quiet 5-star row.
	 * Renders filled / half / empty stars in the plum brand tone.
	 */
	let {
		value = 0,
		count,
		size = 14
	}: {
		value?: number
		count?: number
		size?: number
	} = $props()

	const stars = $derived(
		Array.from({ length: 5 }, (_, i) => {
			const fill = Math.max(0, Math.min(1, value - i))
			return fill >= 0.75 ? 'full' : fill >= 0.25 ? 'half' : 'empty'
		})
	)
</script>

{#if value > 0}
	<div class="ll-rating" aria-label="Rated {value} out of 5">
		<div class="ll-rating-stars">
			{#each stars as state}
				<span class="ll-star ll-star--{state}" style="width:{size}px; height:{size}px;">
					<Star style="width:{size}px; height:{size}px;" strokeWidth={1.25} />
				</span>
			{/each}
		</div>
		{#if count != null}
			<span class="ll-rating-count">({count})</span>
		{/if}
	</div>
{/if}

<style>
	.ll-rating {
		display: inline-flex;
		align-items: center;
		gap: 6px;
	}

	.ll-rating-stars {
		display: inline-flex;
		gap: 2px;
	}

	.ll-star :global(svg) {
		display: block;
	}

	.ll-star--full :global(svg) {
		fill: var(--limelight-plum, #460032);
		color: var(--limelight-plum, #460032);
	}

	.ll-star--half :global(svg) {
		fill: color-mix(in srgb, var(--limelight-plum, #460032) 45%, transparent);
		color: var(--limelight-plum, #460032);
	}

	.ll-star--empty :global(svg) {
		fill: transparent;
		color: var(--limelight-line, #d9c6ba);
	}

	.ll-rating-count {
		color: #8a8a8a;
		font-size: 12px;
	}
</style>
