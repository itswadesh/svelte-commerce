<script lang="ts">
	import { page } from '$app/state'
	import { themeOptions } from '$lib/composer/theme-options.js'
	import type { Subcategory } from './subcategories.js'

	/**
	 * The category's own sub-categories as a row of round pictures, the quickest way into a narrower
	 * shelf on a phone. From the store's category tree (the slug load); a category without children,
	 * or a store that switched the row off (list_subcategories), draws nothing.
	 */
	const items = $derived<Subcategory[]>(themeOptions(page.data?.themeSettings).list_subcategories ? (page.data?.subcategories ?? []) : [])
	const parent = $derived(page.data?.products?.categoryHierarchy?.at(-1)?.name ?? '')
</script>

{#if items.length}
	<nav class="sub-row -mx-1 overflow-x-auto px-1 scrollbar-none" aria-label={parent ? `Shop ${parent} by category` : 'Shop by category'}>
		<ul class="flex gap-3 md:gap-4">
			{#each items as item (item.href)}
				<li class="shrink-0">
					<a href={item.href} class="sub-row__link group flex w-[72px] flex-col items-center gap-1.5 md:w-20">
						<span class="sub-row__pic block aspect-square w-16 overflow-hidden rounded-full border bg-muted md:w-[72px]">
							{#if item.image}
								<img src={item.image} alt="" loading="lazy" decoding="async" width="72" height="72" class="h-full w-full object-cover" />
							{/if}
						</span>
						<span class="line-clamp-2 text-center text-[length:var(--type-dense,0.8125rem)] font-medium text-foreground">{item.name}</span>
					</a>
				</li>
			{/each}
		</ul>
	</nav>
{/if}

<style>
	.sub-row__pic {
		transition:
			transform var(--motion-fast) var(--motion-ease),
			border-color var(--motion-fast) var(--motion-ease);
	}

	@media (hover: hover) and (pointer: fine) {
		.sub-row__link:hover .sub-row__pic {
			border-color: hsl(var(--primary-ink));
			transform: translateY(-2px);
		}
	}

	.sub-row__link:active .sub-row__pic {
		transform: scale(0.96);
	}

	@media (prefers-reduced-motion: reduce) {
		.sub-row__pic {
			transform: none !important;
		}
	}
</style>
