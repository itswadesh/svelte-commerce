<script lang="ts">
	import { Clock, Search, Tag } from '@lucide/svelte'
	import * as Command from '$lib/components/ui/command/index.js'
	import * as Dialog from '$lib/components/ui/dialog/index.js'
	// Local renderer: Enter goes to the listing route, `loading` tracks every query, and recent
	// searches and category matches come back without costing a request.
	import MsSearchRenderer from './ms-search-renderer.svelte'
	import Button from '../ui/button/button.svelte'
	import Skeleton from '../ui/skeleton/skeleton.svelte'
	import { priceRoundUp } from '@misiki/kitcommerce-core/utils'
	import { page } from '$app/state'

	let { class: className = '', placeholder = 'Search...', handleCloseSearch = () => {} } = $props()

	let search = $state('')
</script>

<MsSearchRenderer bind:search>
	{#snippet content({
		searchResults,
		showSearchResults,
		loading,
		searchPlugin,
		expandSearch,
		showSearch,
		closeSearch,
		submitSearch,
		recentSearches,
		clearRecentSearches,
		runSearch,
		categoryMatches
	})}
		<!-- `plugins.search.active === false` means the store has no search backend (e.g. the
		     non-Litekart connectors serve empty autocomplete) — hide the trigger entirely.
		     `undefined` keeps the icon for stores that predate the plugin toggle. -->
		{#if searchPlugin?.active !== false}
			<Button
				variant="ghost"
				size="icon"
				class="rounded-full text-foreground transition-colors hover:text-primary"
				aria-label="Open search"
				aria-haspopup="dialog"
				aria-expanded={expandSearch && showSearchResults}
				onclick={showSearch}
			>
				<Search class="h-5 w-5" />
			</Button>
		{/if}

		<!-- The dialog primitive, not a hand-rolled fixed overlay. The old panel carried the dialog
		     ARIA but none of the behaviour: Tab walked out of it into the cart and hero links
		     underneath, Escape only worked while focus sat in the input, the page behind it still
		     scrolled, and closing never returned focus to the trigger. -->
		<!-- `manageHistory={false}`: the shared Dialog wrapper otherwise pushes a duplicate history
		     entry on open and pops it with `history.back()` on close. Every close in this panel
		     coincides with a navigation — a product link, a category link, the see-all row — so that
		     pop landed on top of the navigation and put the shopper straight back where they were.
		     Escape, the close control and the backdrop all still dismiss the panel. -->
		<Dialog.Root
			manageHistory={false}
			open={expandSearch && showSearchResults}
			onOpenChange={(open: boolean) => {
				if (open) return
				closeSearch()
				handleCloseSearch()
			}}
		>
			<!-- One surface. This used to carry a scoped stylesheet block painting the panel from
			     `--ed-surface`, `--ed-line`, `--ed-radius` and a hard-coded rgba shadow — but those
			     three are literal aliases of `--card`, `--border` and `--radius`, so the block was a
			     second vocabulary for tokens that already exist, and the shadow was the only value in
			     it that was not. The portal lands outside the shell's [data-theme] wrapper but inside
			     <html>'s copy of it, so plain utilities resolve correctly here. -->
			<Dialog.Content
				class="top-4 block w-[calc(100%-2rem)] max-w-xl translate-y-0 gap-0 overflow-hidden rounded-radius border bg-popover p-0 shadow-z-10 sm:top-[12vh] {className}"
			>
				<Dialog.Title class="sr-only">Search products</Dialog.Title>
				<Dialog.Description class="sr-only">Type to see matching categories and products, or press Enter for the full result list.</Dialog.Description
				>

				<!-- `shouldFilter={false}`: the store has already matched the term server-side, so a
				     second client-side pass would only drop hits it does not recognise. -->
				<Command.Root shouldFilter={false} loop class="max-h-[80vh] bg-transparent">
					<!-- The query is the panel's header, not a field sitting inside it. The input drew its
					     own border and then the global :focus-visible ring added `ring-2 ring-offset-2` on
					     top, so the top of the panel was a box inside a box inside a box, with the close
					     control stranded in the gutter beside it. The rule under the header is the focus
					     indicator instead: it thickens and takes the ring colour on focus-within, which is
					     visible across the full width and belongs to the surface rather than fighting it. -->
					<div class="border-b border-border pr-14 transition-colors focus-within:border-ring">
						<Command.Input
							data-testid="search-input"
							class="h-14 text-base focus-visible:ring-0 focus-visible:ring-offset-0"
							bind:value={search}
							placeholder={searchPlugin?.placeholder || placeholder || 'Search products...'}
							aria-label={searchPlugin?.placeholder || 'Search products'}
							autocomplete="off"
							enterkeyhint="search"
						/>
					</div>

					<Command.List class="max-h-[min(65vh,26rem)] p-1.5 scrollbar-thin scrollbar-track-transparent">
						<!-- First in the DOM on purpose, and that is a behaviour rather than a layout choice:
						     the list's first row is the one Enter activates, so the exit to the full result
						     set is always what Enter does — while suggestions are still loading, and on a
						     term the store carries nothing for. What changed is its weight. cmdk selects the
						     first row automatically, and with `aria-selected:bg-muted` that made a filled
						     grey bar the heaviest thing in the panel: the fallback outranked the answer. The
						     selected state is now a tint and a left accent, so you can still see what Enter
						     will do without it shouting over the product you were looking for. -->
						{#if search.trim()}
							<Command.Group class="p-0">
								<Command.Item
									value="see-all-results"
									class="h-11 justify-between gap-3 rounded-radius border-l-2 border-transparent px-2.5 text-sm aria-selected:border-l-primary aria-selected:bg-muted/60 aria-selected:text-foreground"
									onSelect={() => {
										submitSearch()
										handleCloseSearch()
									}}
								>
									<span class="min-w-0 truncate">See all results for “{search.trim()}”</span>
									<!-- Which key does this, shown where there is a keyboard to press it. -->
									<kbd
										class="hidden shrink-0 rounded border bg-muted px-1.5 py-0.5 font-sans text-[11px] font-medium text-muted-foreground sm:inline-block"
										>Enter</kbd
									>
								</Command.Item>
							</Command.Group>
						{/if}

						{#if loading}
							<!-- Same row height as a real suggestion, so the panel does not pump between the
							     loading and loaded states on every keystroke. -->
							<div class="space-y-1 p-1" aria-label="Loading suggestions">
								{#each Array(4) as _}
									<Skeleton class="h-12 w-full rounded-radius" />
								{/each}
							</div>
						{:else}
							{#if !search.trim() && recentSearches.length}
								<!-- Styled as a group heading rather than as its own thing. This row used to be
								     `text-xs font-semibold uppercase tracking-wide` while the Categories and
								     Products headings below it came from `Command.Group heading` — two heading
								     treatments in one short list, one of them shouting. -->
								<div class="flex items-center justify-between gap-2 px-2.5 pb-1 pt-2">
									<p class="text-xs font-medium text-muted-foreground">Recent searches</p>
									<button
										type="button"
										class="rounded-radius px-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
										onclick={clearRecentSearches}
									>
										Clear
									</button>
								</div>
								<Command.Group class="p-0">
									{#each recentSearches as term}
										<Command.Item
											value={`recent-${term}`}
											class="h-12 gap-3 rounded-radius border-l-2 border-transparent px-2.5 text-sm aria-selected:border-l-primary aria-selected:bg-muted/60 aria-selected:text-foreground"
											onSelect={() => {
												runSearch(term)
												handleCloseSearch()
											}}
										>
											<Clock class="size-4 shrink-0 text-muted-foreground" />
											<span class="truncate">{term}</span>
										</Command.Item>
									{/each}
								</Command.Group>
							{/if}

							{#if categoryMatches.length}
								<Command.Group heading="Categories" class="p-0">
									{#each categoryMatches as category}
										<Command.LinkItem
											href={category.href}
											value={`category-${category.href}`}
											class="h-12 gap-3 rounded-radius border-l-2 border-transparent px-2.5 text-sm aria-selected:border-l-primary aria-selected:bg-muted/60 aria-selected:text-foreground"
											onclick={() => {
												closeSearch()
												handleCloseSearch()
											}}
										>
											<Tag class="size-4 shrink-0 text-muted-foreground" />
											<span class="truncate capitalize">{category.name}</span>
										</Command.LinkItem>
									{/each}
								</Command.Group>
							{/if}

							{#if searchResults.length}
								<Command.Group heading={search.trim() ? 'Products' : 'Popular right now'} class="p-0">
									{#each searchResults as result}
										<!-- Real anchors, so a shopper comparing two suggestions can middle-click or
										     long-press them into background tabs and a screen reader can list them. -->
										<Command.LinkItem
											href={`/products/${result?.slug}`}
											value={`product-${result?.slug}`}
											class="h-12 gap-3 rounded-radius border-l-2 border-transparent px-2.5 aria-selected:border-l-primary aria-selected:bg-muted/60 aria-selected:text-foreground"
											onclick={() => {
												closeSearch()
												handleCloseSearch()
											}}
										>
											<!-- 40px, down from 56px. The panel held three magnifiers before this: one
											     labelling the input, one on the see-all row, and one standing in for a
											     missing product image — which is every product on a store with no
											     images, so the result list read as a column of search icons. The
											     placeholder is the product's initial now, the same mark the auth
											     dialogs use for a store with no logo. -->
											<span class="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-radius border bg-muted">
												{#if result.thumbnail}
													<img src={result.thumbnail} alt="" class="size-full object-cover" />
												{:else}
													<span class="text-sm font-medium text-foreground/70">{(result.name || result.title || '?').charAt(0)}</span>
												{/if}
											</span>
											<span class="min-w-0 flex-1 truncate text-left text-sm font-medium text-foreground">
												{result.name || result.title}
											</span>
											{#if result.price}
												<!-- Right-aligned, so a scanning eye gets one price column instead of a
												     price that starts wherever the title happened to end. -->
												<span class="shrink-0 text-sm tabular-nums text-muted-foreground">
													{priceRoundUp(result?.price, page?.data?.store?.currency?.code)}
												</span>
											{/if}
										</Command.LinkItem>
									{/each}
								</Command.Group>
							{:else if search.trim()}
								<!-- Both empty states used to open with a 60px tinted circle holding a magnifier.
								     An empty result is a moment for direction, not for a medallion. -->
								<div class="px-3 py-8 text-center">
									<p class="text-sm font-medium text-foreground">No suggestions for “{search.trim()}”</p>
									<p class="mt-1 text-sm text-muted-foreground">Check the spelling, or try a shorter word.</p>
									<Button
										variant="outline"
										href="/products"
										class="mt-4 h-10 text-sm"
										onclick={() => {
											closeSearch()
											handleCloseSearch()
										}}
									>
										Browse all products
									</Button>
								</div>
							{:else if !recentSearches.length}
								<p class="px-3 py-8 text-center text-sm text-muted-foreground">Start typing to search products.</p>
							{/if}
						{/if}
					</Command.List>
				</Command.Root>
			</Dialog.Content>
		</Dialog.Root>
	{/snippet}
</MsSearchRenderer>
