<script lang="ts">
	import { ArrowUpRight, Search, X } from '@lucide/svelte'
	import { Input } from '$lib/components/ui/input/index.js'
	// Local renderer: Enter goes to the clean slug route and `loading` tracks every query.
	import MsSearchRenderer from './ms-search-renderer.svelte'
	import { fade, scale } from 'svelte/transition'
	import Button from '../ui/button/button.svelte'
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
		handleKeyDown,
		handleResultClick,
		submitSearch,
		searchUrl
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

		{#if expandSearch && showSearchResults}
			<!-- Search Trigger Button -->

			<!-- Search Popup/Modal -->
			<div
				class="fixed inset-0 z-modal flex items-start justify-center bg-black/40 backdrop-blur-sm transition-all"
				role="presentation"
				onclick={() => {
					closeSearch()
					handleCloseSearch()
				}}
				transition:fade={{ duration: 200 }}
			>
				<div
					class="mt-4 w-full max-w-2xl px-4 sm:mt-20"
					onclick={(e) => e.stopPropagation()}
					transition:scale={{ duration: 200, start: 0.95, opacity: 0 }}
				>
					<div
						class="ed-search-panel flex max-h-[80vh] flex-col overflow-hidden rounded-lg bg-popover text-popover-foreground shadow-z-10"
						role="dialog"
						aria-modal="true"
						aria-label="Search products"
					>
						<!-- Search Header -->
						<div class="ed-search-head flex items-center gap-3 border-b p-4">
							<Search class="h-5 w-5 text-muted-foreground" />
							<Input
								type="text"
								class="flex-1 border-none bg-transparent text-sm shadow-none focus-visible:ring-0 sm:text-lg"
								bind:value={search}
								placeholder={searchPlugin?.placeholder || 'Search products...'}
								aria-label={searchPlugin?.placeholder || 'Search products'}
								autocomplete="off"
								enterkeyhint="search"
								autofocus
								onkeydown={handleKeyDown}
							/>
							<Button
								variant="ghost"
								size="icon"
								onclick={() => {
									closeSearch()
									handleCloseSearch()
								}}
								class="rounded-full text-muted-foreground hover:text-foreground"
								aria-label="Close search"
							>
								<X class="h-5 w-5" />
							</Button>
						</div>

						<!-- Search Results -->
						<div class="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-track-transparent">
							{#if loading}
								<div class="space-y-2 p-2">
									{#each Array(5) as _}
										<div class="h-16 w-full animate-pulse rounded-md bg-muted"></div>
									{/each}
								</div>
							{:else if searchResults.length > 0}
								<p id="ms-search-group-products" class="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
									{search.trim() ? 'Products' : 'Popular right now'}
								</p>
								<ul class="space-y-1" aria-labelledby="ms-search-group-products">
									{#each searchResults as result}
										<li>
											<Button
												variant="ghost"
												class="flex h-auto w-full items-center justify-start gap-4 p-3 text-left"
												onclick={() => {
													handleResultClick(result)
													handleCloseSearch()
												}}
											>
												<div class="h-14 w-14 flex-shrink-0 overflow-hidden rounded-md border border-border bg-muted">
													{#if result.thumbnail}
														<img src={result.thumbnail} alt="" class="h-full w-full object-cover" />
													{:else}
														<div class="flex h-full w-full items-center justify-center">
															<Search class="h-5 w-5 text-muted-foreground" />
														</div>
													{/if}
												</div>
												<div class="min-w-0 flex-1 text-left">
													<p class="truncate font-semibold text-foreground">
														{result.name || result.title}
													</p>
													{#if result.price}
														<p class="text-sm font-medium text-primary">
															{priceRoundUp(result?.price, page?.data?.store?.currency?.code)}
														</p>
													{/if}
												</div>
												<ArrowUpRight class="h-5 w-5 text-muted-foreground" />
											</Button>
										</li>
									{/each}
								</ul>
								<!-- The panel's exit to a full result set. Without it the only way out of eight
								     suggestions was the Enter key, which is easy to miss and, until this slice,
								     landed on a 404. -->
								{#if search.trim()}
									<div class="mt-1 border-t border-border pt-1">
										<Button
											variant="ghost"
											class="flex h-auto w-full items-center justify-between gap-4 p-3 text-left"
											onclick={() => {
												submitSearch()
												handleCloseSearch()
											}}
										>
											<span class="text-sm font-medium">See all results for “{search.trim()}”</span>
											<ArrowUpRight class="h-4 w-4 text-muted-foreground" />
										</Button>
									</div>
								{/if}
							{:else if search.trim()}
								<div class="flex flex-col items-center justify-center px-6 py-12 text-center">
									<div class="mb-4 rounded-full bg-muted p-4">
										<Search class="h-8 w-8 text-muted-foreground" />
									</div>
									<p class="text-lg font-medium text-foreground">No results for “{search.trim()}”</p>
									<p class="mt-1 text-sm text-muted-foreground">Check the spelling, or try a shorter, more general word.</p>
									<Button
										variant="outline"
										class="mt-4"
										onclick={() => {
											submitSearch()
											handleCloseSearch()
										}}
									>
										Search all products
									</Button>
								</div>
							{:else}
								<div class="flex flex-col items-center justify-center py-16 text-center">
									<div class="mb-4 rounded-full bg-muted p-4">
										<Search class="h-8 w-8 text-muted-foreground" />
									</div>
									<p class="text-sm text-muted-foreground">Start typing to search products.</p>
								</div>
							{/if}
						</div>
					</div>
				</div>
			</div>
		{/if}
	{/snippet}
</MsSearchRenderer>

<!-- Editorial search styling for the default theme only (scoped via [data-theme='default']). -->
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
