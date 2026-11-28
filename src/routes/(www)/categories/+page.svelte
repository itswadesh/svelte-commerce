<script lang="ts">
	import { taxonomy } from '$lib/core/connectors/taxonomy'
	import Canonical from '$lib/components/seo/canonical.svelte'
	import { ArrowRight } from '@lucide/svelte'

	type Card = { name: string; slug: string; img?: string; count?: number }
	type Category = Card & { id?: string; children?: Card[] }

	let { data } = $props()

	const categories = $derived((data.categories ?? []) as Category[])
	// A top category with sub-categories gets a section of its own, its sub-categories as cards. The
	// ones without share one grid at the top. One parent with eight children used to be a single
	// narrow card with eight pills stacked in it.
	const loose = $derived(categories.filter((c) => !c.children?.length))
	const groups = $derived(categories.filter((c) => c.children?.length))

	// Only a count the engine gave; 0 says nothing useful on a card, so it shows none.
	const items = (n?: number) => (n ? `${n} ${n === 1 ? 'item' : 'items'}` : '')
</script>

<svelte:head>
	<title>{taxonomy.many}</title>
</svelte:head>

{#snippet card(c: Card)}
	<a href="/{c.slug}" class="cat-card group flex flex-col gap-2.5 rounded-lg focus-visible:outline-none">
		<div class="cat-media relative aspect-[4/5] overflow-hidden rounded-lg bg-muted">
			{#if c.img}
				<img
					src={c.img}
					alt=""
					loading="lazy"
					decoding="async"
					class="h-full w-full object-cover transition-transform duration-emphasis ease-standard motion-safe:group-hover:scale-[1.04]"
				/>
			{:else}
				<!-- No picture of its own and no product to borrow one from: the name's first letter in the
				     store's heading font, never an empty grey box. -->
				<span
					class="grid h-full w-full place-items-center text-5xl text-muted-foreground/70 transition-transform duration-emphasis ease-standard motion-safe:group-hover:scale-[1.04]"
					style="font-family: var(--font-heading);"
					aria-hidden="true">{c.name.trim().charAt(0).toUpperCase()}</span
				>
			{/if}
		</div>
		<span class="flex flex-col gap-0.5 px-0.5">
			<span class="line-clamp-2 break-words text-sm font-medium text-foreground transition-colors duration-fast ease-standard group-hover:text-primary-ink"
				>{c.name}</span
			>
			{#if items(c.count)}
				<span class="text-xs text-muted-foreground">{items(c.count)}</span>
			{/if}
		</span>
	</a>
{/snippet}

<div class="container max-w-6xl px-4 py-6 md:py-12">
	<h1 class="mb-8 text-2xl md:mb-10 md:text-3xl" style="font-family: var(--font-heading);">Shop by {taxonomy.one}</h1>

	{#if loose.length}
		<ul class="cat-grid m-0 list-none p-0" class:mb-12={groups.length}>
			{#each loose as c (c.id ?? c.slug)}
				<li>{@render card(c)}</li>
			{/each}
		</ul>
	{/if}

	{#each groups as group (group.id ?? group.slug)}
		<section class="mb-12 last:mb-0" aria-labelledby="cat-{group.slug}">
			<div class="mb-5 flex items-end justify-between gap-4 border-b border-border pb-3">
				<div class="min-w-0">
					<h2 id="cat-{group.slug}" class="break-words text-lg md:text-xl" style="font-family: var(--font-heading);">{group.name}</h2>
					{#if items(group.count)}
						<p class="mt-0.5 text-xs text-muted-foreground">{items(group.count)}</p>
					{/if}
				</div>
				<a
					href="/{group.slug}"
					class="group/all inline-flex min-h-11 shrink-0 items-center gap-1 text-sm font-medium text-foreground transition-colors duration-fast ease-standard hover:text-primary-ink"
				>
					View all<span class="sr-only"> {group.name}</span>
					<ArrowRight class="size-4 transition-transform duration-fast ease-standard motion-safe:group-hover/all:translate-x-0.5" aria-hidden="true" />
				</a>
			</div>
			<ul class="cat-grid m-0 list-none p-0">
				{#each group.children ?? [] as c (c.slug)}
					<li>{@render card(c)}</li>
				{/each}
			</ul>
		</section>
	{/each}
</div>

<Canonical />

<style>
	.cat-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1.5rem 1rem;
	}
	@media (min-width: 640px) {
		.cat-grid {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}
	@media (min-width: 1024px) {
		.cat-grid {
			grid-template-columns: repeat(5, minmax(0, 1fr));
			gap: 2rem 1.5rem;
		}
	}
	/* Press feedback, and a focus ring around the picture where the eye already is. */
	@media (prefers-reduced-motion: no-preference) {
		.cat-card {
			transition: transform var(--motion-fast) var(--motion-ease);
		}
		.cat-card:active {
			transform: scale(0.98);
		}
	}
	.cat-card:focus-visible .cat-media {
		outline: 2px solid currentColor;
		outline-offset: 2px;
	}
</style>
