<script lang="ts">
	import { page } from '$app/state'
	import { afterNavigate } from '$app/navigation'
	import { tick } from 'svelte'
	import { ChevronDown } from '@lucide/svelte'
	import { getImageCDNUrl } from '@misiki/kitcommerce-core/utils'
	import { chromeMenuItems } from '$lib/composer/chrome-draft.svelte.js'
	import { isMega, megaColumns, menuKey, promoImage } from './mega-menu-columns'

	// The store's header menu: the one the shop chose in the theme editor's header (D131), which the
	// connector already files under `header`, or a draft's choice while the editor is open.
	const headerItems = $derived(chromeMenuItems('header', page?.data?.store?.menu))

	// False when the shop hid the header menu: the logo stays, the links go.
	let { menu = true }: { menu?: boolean } = $props()

	// The header draws this component twice (one per width band), so ids are per instance.
	const uid = $props.id()

	// The open panel. One at a time; every panel is in the server's HTML, hidden by CSS, so the
	// links are crawlable and nothing arrives late.
	let openIndex = $state(-1)
	let navEl: HTMLElement | undefined = $state()

	// Hover intent: a pointer that only crosses an item on its way somewhere does not open it, and
	// one moving diagonally from a trigger into the panel briefly leaves both without closing it.
	const OPEN_MS = 150
	const CLOSE_MS = 200
	let timer: ReturnType<typeof setTimeout> | undefined
	const later = (fn: () => void, ms: number) => {
		clearTimeout(timer)
		timer = setTimeout(fn, ms)
	}
	const close = () => {
		clearTimeout(timer)
		openIndex = -1
	}

	function enter(e: PointerEvent, i: number) {
		if (e.pointerType !== 'mouse') return
		// Back over the open item (its panel is inside it): stay. Another item opens after the same
		// pause, even with a panel already open, so a diagonal path into this panel that crosses the
		// next trigger does not swap panels on the way.
		if (i === openIndex) clearTimeout(timer)
		else later(() => (openIndex = i), OPEN_MS)
	}
	function leave(e: PointerEvent) {
		if (e.pointerType === 'mouse') later(close, CLOSE_MS)
	}

	// The last pointer that pressed a trigger. A mouse click follows the link (hover already showed
	// the panel); a tap or a keyboard Enter opens the panel first and follows on the second go.
	let pointer = ''
	function activate(e: MouseEvent, i: number) {
		const viaMouse = pointer === 'mouse' && e.detail > 0
		pointer = ''
		if (viaMouse || openIndex === i) return
		e.preventDefault()
		clearTimeout(timer)
		openIndex = i
	}

	const triggers = () => [...(navEl?.querySelectorAll<HTMLElement>(':scope > .mm-item > a, :scope > a') ?? [])]
	const panelLinks = (i: number) => [...(navEl?.querySelectorAll<HTMLElement>(`#${uid}-mm-${i} a`) ?? [])]

	async function triggerKey(e: KeyboardEvent, i: number, hasPanel: boolean) {
		if (hasPanel && (e.key === ' ' || e.key === 'ArrowDown')) {
			e.preventDefault()
			if (e.key === ' ' && openIndex === i) return close()
			openIndex = i
			if (e.key === 'ArrowDown') {
				await tick()
				panelLinks(i)[0]?.focus()
			}
			return
		}
		if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'Home' && e.key !== 'End') return
		const all = triggers()
		const next = menuKey(e.key, all.indexOf(e.currentTarget as HTMLElement), all.length)
		if (next === -1) return
		e.preventDefault()
		if (openIndex !== -1) close()
		all[next]?.focus()
	}

	function panelKey(e: KeyboardEvent, i: number) {
		const links = panelLinks(i)
		const next = menuKey(e.key, links.indexOf(document.activeElement as HTMLElement), links.length)
		if (next === -1) return
		e.preventDefault()
		links[next]?.focus()
	}

	function escape(e: KeyboardEvent) {
		if (e.key !== 'Escape' || openIndex === -1) return
		const i = openIndex
		close()
		// Back to the trigger, so a keyboard user is not dropped onto <body> when the panel hides.
		if (navEl?.contains(document.activeElement))
			triggers()
				.find((t) => t.getAttribute('aria-controls') === `${uid}-mm-${i}`)
				?.focus()
	}

	afterNavigate(close)
</script>

<svelte:window
	onclick={(e) => {
		if (openIndex !== -1 && !navEl?.contains(e.target as Node)) close()
	}}
/>

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
			<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
			<nav aria-label="Main navigation" class="ml-6 hidden items-center space-x-6 lg:flex" bind:this={navEl} onkeydown={escape}>
				<!-- The 32px box is deliberate: these are standalone navigation targets, not links inside a
				     sentence, so WCAG 2.2's inline exception does not cover them and a bare 20px text link
				     misses the 24px minimum. -->
				{#each headerItems as item, i}
					{@const columns = megaColumns(item)}
					{#if columns.length}
						{@const open = openIndex === i}
						{@const promo = promoImage(item)}
						{@const mega = isMega(columns)}
						<!-- A grouped top item opens a full-width panel under the header: each second-level
						     item a column heading, its third-level links under it. The wrapper is not
						     positioned, so the panel spans the sticky header, not this item. A plain
						     two-level item opens a compact dropdown under itself instead (mm-dd). -->
						<div
							class="mm-item"
							class:mm-dd={!mega}
							role="presentation"
							onpointerenter={(e) => enter(e, i)}
							onpointerleave={leave}
							onfocusout={(e) => {
								if (open && !e.currentTarget.contains(e.relatedTarget as Node | null)) close()
							}}
						>
							<a
								href={item.link}
								class="ed-nav-link motion-underline inline-flex min-h-[32px] items-center gap-1 text-sm font-bold text-muted-foreground transition-[color,transform] duration-fast ease-standard hover:text-foreground motion-safe:active:scale-95"
								class:text-foreground={open}
								style="font-family: var(--font-body);"
								aria-expanded={open ? 'true' : 'false'}
								aria-controls="{uid}-mm-{i}"
								data-current={open}
								onpointerdown={(e) => (pointer = e.pointerType)}
								onclick={(e) => activate(e, i)}
								onkeydown={(e) => triggerKey(e, i, true)}
							>
								{item?.name}
								<ChevronDown class="mm-chevron h-3.5 w-3.5" aria-hidden="true" />
							</a>
							<div
								id="{uid}-mm-{i}"
								class="mm-panel border-t border-border bg-background"
								class:mm-open={open}
								class:border={!mega}
								class:rounded-md={!mega}
								role="region"
								aria-label={item?.name}
								onkeydown={(e) => panelKey(e, i)}
							>
								{#if !mega}
									<ul class="m-0 list-none p-2">
										{#each columns as col}
											<li>
												<a
													href={col.link}
													class="mm-ddlink rounded px-3 text-sm text-foreground transition-colors duration-fast ease-standard hover:bg-muted focus-visible:bg-muted"
													>{col.name}</a
												>
											</li>
										{/each}
									</ul>
								{:else}
								<div class="page-width mm-body">
									<div class="mm-cols">
										{#each columns as col}
											<div class="mm-col">
												<a
													href={col.link}
													class="mm-head text-sm font-bold text-foreground transition-colors duration-fast ease-standard hover:text-primary-ink"
													>{col.name}</a
												>
												{#if col.links.length}
													<ul class="m-0 list-none p-0">
														{#each col.links as link}
															<li>
																<a
																	href={link.link}
																	class="mm-link text-sm text-muted-foreground transition-[color,transform] duration-fast ease-standard hover:text-foreground"
																	>{link.name}</a
																>
															</li>
														{/each}
													</ul>
												{/if}
											</div>
										{/each}
									</div>
									{#if promo}
										<a href={item.link} class="mm-promo" tabindex="-1" aria-hidden="true">
											<img
												src={getImageCDNUrl(promo, 480, 0)}
												alt=""
												width="240"
												height="300"
												loading="lazy"
												class="h-full w-full rounded object-cover"
											/>
										</a>
									{/if}
								</div>
								<div class="page-width mm-foot border-t border-border">
									<a
										href={item.link}
										class="mm-all text-sm font-semibold text-foreground transition-colors duration-fast ease-standard hover:text-primary-ink"
										>View all {item?.name}</a
									>
								</div>
								{/if}
							</div>
						</div>
					{:else}
						<a
							href={item.link}
							class="ed-nav-link motion-underline inline-flex min-h-[32px] items-center text-sm font-bold text-muted-foreground transition-[color,transform] duration-fast ease-standard hover:text-foreground motion-safe:active:scale-95"
							style="font-family: var(--font-body);"
							onkeydown={(e) => triggerKey(e, i, false)}
						>
							{item?.name}
						</a>
					{/if}
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
	/* The mega panel: full width under the sticky header, overlaying the page so nothing below moves.
	   Hidden (and out of the tab order) until opened; it fades and drops 6px, transform and opacity
	   only. Under reduced motion it simply appears. */
	.mm-panel {
		position: absolute;
		left: 0;
		right: 0;
		top: 100%;
		max-height: calc(100vh - 7rem);
		overflow-y: auto;
		visibility: hidden;
		opacity: 0;
		box-shadow: 0 24px 48px -24px rgb(0 0 0 / 0.28);
	}
	.mm-panel.mm-open {
		visibility: visible;
		opacity: 1;
	}
	@media (prefers-reduced-motion: no-preference) {
		.mm-panel {
			transform: translateY(-6px);
			transition:
				opacity var(--motion-panel) var(--motion-ease),
				transform var(--motion-panel) var(--motion-ease),
				visibility 0s linear var(--motion-panel);
		}
		.mm-panel.mm-open {
			transform: none;
			transition:
				opacity var(--motion-panel) var(--motion-ease),
				transform var(--motion-panel) var(--motion-ease),
				visibility 0s;
		}
		.mm-item :global(.mm-chevron) {
			transition: transform var(--motion-fast) var(--motion-ease);
		}
		.mm-link:hover {
			transform: translateX(2px);
		}
	}
	.mm-item:has(.mm-open) :global(.mm-chevron) {
		transform: rotate(180deg);
	}
	/* The compact dropdown: under its own item, as wide as its longest link. */
	.mm-dd {
		position: relative;
	}
	.mm-dd .mm-panel {
		right: auto;
		min-width: 12rem;
		max-width: 20rem;
	}
	.mm-ddlink {
		display: flex;
		align-items: center;
		min-height: 36px;
		white-space: nowrap;
	}
	.mm-body {
		display: flex;
		gap: 2.5rem;
		padding-block: 1.75rem;
	}
	/* Columns of headings fill across, then wrap into rows, with as many as fit at 1024-1440px. */
	.mm-cols {
		flex: 1;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(11rem, 1fr));
		gap: 1.5rem 2.5rem;
		align-content: start;
	}
	.mm-col {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		min-width: 0;
	}
	.mm-head,
	.mm-link {
		display: inline-flex;
		align-items: center;
		min-height: 32px;
	}
	.mm-head {
		margin-bottom: 0.25rem;
	}
	.mm-promo {
		flex: 0 0 15rem;
		aspect-ratio: 4 / 5;
	}
	.mm-foot {
		padding-block: 0.75rem;
	}

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
