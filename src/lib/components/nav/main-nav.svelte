<script lang="ts">
	import { page } from '$app/state'
	import { Home } from '@lucide/svelte'
	import { getImageCDNUrl } from '@misiki/kitcommerce-core/utils'
	import { chromeMenuItems } from '$lib/composer/chrome-draft.svelte.js'

	// The store's header menu: the one the shop chose in the theme editor's header (D131), which the
	// connector already files under `header`, or a draft's choice while the editor is open.
	const headerItems = $derived(chromeMenuItems('header', page?.data?.store?.menu))

	// False when the shop hid the header menu: the logo stays, the links go.
	let { menu = true }: { menu?: boolean } = $props()
</script>

<div class="mr-4 md:flex">
	<div class="flex gap-3">
		{#if page?.data?.store?.logo}
			<a href="/" class="flex min-h-11 min-w-11 items-center">
				<!-- Renders 40px tall; serve a sized, format=auto asset rather than the raw upload. -->
				<img
					src={getImageCDNUrl(page?.data?.store?.logo, 300, 0)}
					width="120"
					height="40"
					class="h-10 w-auto object-contain"
					alt="{page?.data?.store?.name || 'Store'} logo"
				/>
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
		{#if menu && !page?.data?.store?.plugins?.megamenu?.active}
			<nav aria-label="Main navigation" class="ml-6 hidden items-center space-x-6 lg:flex">
				<!-- Home link only when not on home page -->
				<!-- {#if page?.url?.pathname !== '/'}
				<a
					href="/"
					class="relative text-sm font-bold text-muted-foreground transition-all
					after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:text-foreground hover:after:w-full motion-safe:active:scale-95"
					style="font-family: var(--font-body);"
				>
					<Home />
				</a>
			{/if} -->

				<!-- Dynamic menu items. The 32px box is deliberate: these are standalone navigation
				     targets, not links inside a sentence, so WCAG 2.2's inline exception does not cover
				     them and a bare 20px text link misses the 24px minimum. -->
				{#each headerItems as item}
					<a
						href={item.link}
						class="ed-nav-link motion-underline inline-flex min-h-[32px] items-center text-sm font-bold text-muted-foreground transition-[color,transform] duration-fast ease-standard hover:text-foreground motion-safe:active:scale-95"
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
		/* The label step, 12px. One row holds every link of the store's menu, and at 13px a ten-link
		   menu already broke its labels over two lines at 1280px. */
		font-size: var(--type-label);
		transition:
			color var(--motion-fast) var(--motion-ease),
			transform var(--motion-fast) var(--motion-ease);
	}

	:global([data-theme='default'] .ed-nav-link:hover) {
		color: var(--ed-ink);
	}
</style>
