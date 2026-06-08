<script lang="ts">
	import { ArrowUpRight, Search, X } from '@lucide/svelte'
	import { Input } from '$lib/components/ui/input/index.js'
	import { MsSearchRenderer } from '$lib/core/composables/index.js'
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
		handleResultClick
	})}
		<button variant="ghost" size="icon" class="flex rounded-full px-2" aria-label="Toggle Cart" onclick={showSearch}>
			<Search class="h-5 w-5" />
		</button>

		{#if expandSearch && showSearchResults}
			<!-- Search Trigger Button -->

			<!-- Search Popup/Modal -->
			<div
				class="fixed inset-0 z-[100] flex items-start justify-center bg-black/40 backdrop-blur-sm transition-all"
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
					<div class="flex max-h-[80vh] flex-col overflow-hidden bg-white shadow-2xl ring-1 ring-black/5">
						<!-- Search Header -->
						<div class="flex items-center gap-3 border-b border-gray-100 p-4">
							<Search class="h-5 w-5 text-gray-400" />
							<Input
								type="text"
								class="flex-1 border-none bg-transparent text-sm sm:text-lg shadow-none focus-visible:ring-0"
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
								class="rounded-full text-gray-400 hover:text-gray-600"
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
										<div class="h-16 w-full animate-pulse bg-gray-50"></div>
									{/each}
								</div>
							{:else if searchResults.length > 0}
								<ul class="space-y-1">
									{#each searchResults as result}
										<li>
											<Button
												variant="ghost"
												class="flex w-full h-auto items-center justify-start gap-4 p-3 text-left"
												onclick={() => {
													handleResultClick(result)
													handleCloseSearch()
												}}
											>
												<div class="h-14 w-14 flex-shrink-0 overflow-hidden bg-gray-100 ring-1 ring-black/5">
													{#if result.thumbnail}
														<img src={result.thumbnail} alt="" class="h-full w-full object-cover" />
													{:else}
														<div class="flex h-full w-full items-center justify-center">
															<Search class="h-5 w-5 text-gray-200" />
														</div>
													{/if}
												</div>
												<div class="min-w-0 flex-1 text-left">
													<p class="truncate font-semibold text-gray-900">
														{result.name || result.title}
													</p>
													{#if result.price}
														<p class="text-sm font-medium text-primary">
															{priceRoundUp(result?.price, page?.data?.store?.currency?.code)}
														</p>
													{/if}
												</div>
												<ArrowUpRight class="h-5 w-5 text-gray-300" />
											</Button>
										</li>
									{/each}
								</ul>
							{:else}
								<div class="flex flex-col items-center justify-center py-16 text-center">
									<div class="mb-4 rounded-full bg-gray-50 p-4">
										<Search class="h-8 w-8 text-gray-300" />
									</div>
									<p class="text-lg font-medium text-gray-900">No products found</p>
									<p class="text-sm text-gray-500">We couldn't find any results matching "{search}".</p>
								</div>
							{/if}
						</div>
					</div>
				</div>
			</div>
		{/if}
	{/snippet}
</MsSearchRenderer>
