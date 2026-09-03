<script lang="ts">
	import { ArrowUpRight, Clock, Search, Tag } from '@lucide/svelte'
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
				class="ed-search-trigger rounded-full"
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
			<Dialog.Content
				class="ed-search-panel top-4 block w-[calc(100%-2rem)] max-w-2xl translate-y-0 gap-0 overflow-hidden p-0 sm:top-[10vh] {className}"
			>
				<Dialog.Title class="sr-only">Search products</Dialog.Title>
				<Dialog.Description class="sr-only">Type to see matching categories and products, or press Enter for the full result list.</Dialog.Description
				>

				<!-- `shouldFilter={false}`: the store has already matched the term server-side, so a
				     second client-side pass would only drop hits it does not recognise. -->
				<Command.Root shouldFilter={false} loop class="ed-search-cmd max-h-[80vh] bg-transparent">
					<div class="ed-search-head border-b pr-12">
						<Command.Input
							data-testid="search-input"
							class="h-12 text-base sm:text-lg"
							bind:value={search}
							placeholder={searchPlugin?.placeholder || placeholder || 'Search products...'}
							aria-label={searchPlugin?.placeholder || 'Search products'}
							autocomplete="off"
							enterkeyhint="search"
						/>
					</div>

					<Command.List class="max-h-[min(65vh,28rem)] p-2 scrollbar-thin scrollbar-track-transparent">
						<!-- First on purpose. The list's first row is the one Enter activates, so the panel's
						     exit to the full result set is always what the Enter key does — including while
						     suggestions are still loading, and on a term the store carries nothing for. -->
						{#if search.trim()}
							<Command.Group class="p-0">
								<Command.Item
									value="see-all-results"
									class="h-11 justify-between gap-3 px-3 font-medium aria-selected:bg-muted aria-selected:text-foreground"
									onSelect={() => {
										submitSearch()
										handleCloseSearch()
									}}
								>
									<span class="flex min-w-0 items-center gap-3">
										<Search class="text-muted-foreground" />
										<span class="truncate">See all results for “{search.trim()}”</span>
									</span>
									<ArrowUpRight class="text-muted-foreground" />
								</Command.Item>
							</Command.Group>
							<Command.Separator class="my-1" />
						{/if}

						{#if loading}
							<!-- Same row height as a real suggestion, so the panel does not pump between the
							     loading and loaded states on every keystroke. -->
							<div class="space-y-2 p-1" aria-label="Loading suggestions">
								{#each Array(4) as _}
									<Skeleton class="h-16 w-full rounded-md" />
								{/each}
							</div>
						{:else}
							{#if !search.trim() && recentSearches.length}
								<div class="flex items-center justify-between gap-2 px-3 pb-1 pt-2">
									<p class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Recent searches</p>
									<Button
										variant="ghost"
										class="h-8 px-2 text-xs font-medium text-muted-foreground hover:text-foreground"
										onclick={clearRecentSearches}
									>
										Clear
									</Button>
								</div>
								<Command.Group class="p-0">
									{#each recentSearches as term}
										<Command.Item
											value={`recent-${term}`}
											class="h-11 gap-3 px-3 aria-selected:bg-muted aria-selected:text-foreground"
											onSelect={() => {
												runSearch(term)
												handleCloseSearch()
											}}
										>
											<Clock class="text-muted-foreground" />
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
											class="h-11 gap-3 px-3 aria-selected:bg-muted aria-selected:text-foreground"
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
											class="gap-4 px-3 py-2 aria-selected:bg-muted aria-selected:text-foreground"
											onclick={() => {
												closeSearch()
												handleCloseSearch()
											}}
										>
											<span class="h-14 w-14 flex-shrink-0 overflow-hidden rounded-md border bg-muted">
												{#if result.thumbnail}
													<img src={result.thumbnail} alt="" class="h-full w-full object-cover" />
												{:else}
													<span class="flex h-full w-full items-center justify-center">
														<Search class="h-5 w-5 text-muted-foreground" />
													</span>
												{/if}
											</span>
											<span class="min-w-0 flex-1 text-left">
												<span class="block truncate font-medium text-foreground">
													{result.name || result.title}
												</span>
												{#if result.price}
													<span class="block text-sm font-medium text-primary">
														{priceRoundUp(result?.price, page?.data?.store?.currency?.code)}
													</span>
												{/if}
											</span>
											<ArrowUpRight class="size-5 shrink-0 text-muted-foreground" />
										</Command.LinkItem>
									{/each}
								</Command.Group>
							{:else if search.trim()}
								<div class="flex flex-col items-center justify-center px-6 py-10 text-center">
									<div class="mb-4 rounded-full bg-muted p-4">
										<Search class="h-7 w-7 text-muted-foreground" />
									</div>
									<p class="text-base font-medium text-foreground">No suggestions for “{search.trim()}”</p>
									<p class="mt-1 text-sm text-muted-foreground">Check the spelling, or try a shorter, more general word.</p>
									<Button
										variant="outline"
										href="/products"
										class="mt-4 h-11"
										onclick={() => {
											closeSearch()
											handleCloseSearch()
										}}
									>
										Browse all products
									</Button>
								</div>
							{:else if !recentSearches.length}
								<div class="flex flex-col items-center justify-center py-12 text-center">
									<div class="mb-4 rounded-full bg-muted p-4">
										<Search class="h-7 w-7 text-muted-foreground" />
									</div>
									<p class="text-sm text-muted-foreground">Start typing to search products.</p>
								</div>
							{/if}
						{/if}
					</Command.List>
				</Command.Root>
			</Dialog.Content>
		</Dialog.Root>
	{/snippet}
</MsSearchRenderer>

<!-- Editorial search styling for the default theme only (scoped via [data-theme='default']).
     The panel is portalled to <body>, which sits outside the shell's [data-theme] wrapper but
     inside <html>'s copy of it, so each rule is written fully global. -->
<style>
	:global([data-theme='default'] .ed-search-trigger) {
		color: var(--ed-ink);
		transition: color 0.25s ease;
	}

	:global([data-theme='default'] .ed-search-trigger:hover) {
		color: hsl(var(--primary));
	}

	:global([data-theme='default'] .ed-search-panel) {
		background: var(--ed-surface);
		border: 1px solid var(--ed-line);
		border-radius: var(--ed-radius);
		box-shadow: 0 30px 60px -30px rgba(27, 26, 23, 0.35);
	}

	:global([data-theme='default'] .ed-search-head) {
		border-color: var(--ed-line);
	}

	@media (prefers-reduced-motion: reduce) {
		:global([data-theme='default'] .ed-search-trigger) {
			transition: none;
		}
	}
</style>
