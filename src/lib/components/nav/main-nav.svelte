<script lang="ts">
	import { page } from '$app/state'
	import { Home } from '@lucide/svelte'
	import type { Menu } from '$lib/core/types/index.js'
	import { getImageCDNUrl } from '@misiki/kitcommerce-core/utils'
</script>

<div class="mr-4 md:flex">
	<div class="flex gap-3">
		{#if page?.data?.store?.logo}
			<a href="/">
				<!-- Renders 40px tall; serve a sized, format=auto asset rather than the raw upload. -->
				<img src={getImageCDNUrl(page?.data?.store?.logo, 300, 0)} class="h-10 object-contain" alt="{page?.data?.store?.name || 'Store'} logo" />
			</a>
		{:else}
			<a href="/" class="flex items-center space-x-2">
				<span class="font-bold"> {page?.data?.store?.name || ''} </span>
			</a>
		{/if}

		<!-- Navigation menu with consistent styling.
		     Only render the header menu here when the megamenu is OFF — when it's on, <MegaMenu>
		     already renders these same `header` menu items, which would otherwise show twice. -->
		<!-- The header's navigation landmark. Exactly one renders: this list when the megamenu is
		     off, and the MegaMenu's own <nav> when it is on, so a screen reader gets one "Main
		     navigation" region either way. Before this the header exposed no landmark at all. -->
		{#if !page?.data?.store?.plugins?.megamenu?.active}
			<nav aria-label="Main navigation" class="ml-6 hidden items-center space-x-6 lg:flex">
				<!-- Home link only when not on home page -->
				<!-- {#if page?.url?.pathname !== '/'}
				<a
					href="/"
					class="relative text-sm font-bold uppercase tracking-widest text-gray-500 transition-all
					after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:text-gray-900 hover:after:w-full active:scale-95"
					style="font-family: var(--font-body);"
				>
					<Home />
				</a>
			{/if} -->

				<!-- Dynamic menu items with same styling -->
				{#each page?.data?.store?.menu?.find?.((menu: Menu) => menu?.menuId === 'header')?.items || [] as item}
					<a
						href={item.link}
						class="ed-nav-link relative text-sm font-bold uppercase tracking-widest text-muted-foreground transition-all after:absolute after:bottom-[-4px]
					after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:text-foreground hover:after:w-full active:scale-95"
						style="font-family: var(--font-body);"
					>
						{item?.name}
					</a>
				{/each}
			</nav>
		{/if}
		<!-- {#if userState?.user?.role === 'ADMIN'}
			<div class="flex flex-row gap-3">
				{#each menuItems as item}
					<a href={item.link} class="block w-full cursor-default">
						{item?.name}
					</a>
				{/each}
			</div>
		{/if} -->
	</div>
</div>

<!-- Editorial menu links for the default theme only (scoped via [data-theme='default']).
     Wine/organic keep the current styling untouched. -->
<style>
	:global([data-theme='default'] .ed-nav-link) {
		color: var(--ed-soft);
		font-weight: 600;
		font-size: 0.75rem;
		letter-spacing: 0.18em;
		transition: color 0.25s ease;
	}

	:global([data-theme='default'] .ed-nav-link:hover) {
		color: var(--ed-ink);
	}

	@media (prefers-reduced-motion: reduce) {
		:global([data-theme='default'] .ed-nav-link) {
			transition: none;
		}
	}
</style>
