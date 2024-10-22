<script lang="ts">
	import { ArrowUpRight, Search, X, Loader2, ShoppingBag, ArrowRight } from '@lucide/svelte'
	import { Input } from '$lib/components/ui/input'
	import { cn } from '$lib/core/utils'
	import { MsSearchRenderer } from '$lib/core/composables/index.js'
	import { fade, fly, scale } from 'svelte/transition'

	let { class: className = '', placeholder = 'Search products...' } = $props()

	let search = $state('')
</script>

<MsSearchRenderer bind:search>
	{#snippet content({
		searchPlugin,
		searchResults,
		showSearchResults,
		expandSearch,
		loading,
		showSearch,
		closeSearch,
		handleResultClick,
		toggleSearchResults,
		handleKeyDown
	})}
		{#if searchPlugin.active}
			<div class="relative font-['Inter',_sans-serif]">
				<!-- Search Trigger Button -->
				<button
					aria-label="Show search bar"
					class={cn(
						'flex items-center justify-center rounded-full p-2 text-gray-500 transition-all duration-300 ease-out hover:bg-gray-100 hover:text-primary hover:scale-110 active:scale-95',
						expandSearch ? 'scale-90 opacity-0' : 'scale-100 opacity-100'
					)}
					onclick={showSearch}
				>
					<Search class="size-5" />
				</button>

				{#if expandSearch}
					<!-- Desktop Search Overlay -->
					<div class="fixed inset-0 z-[100] hidden items-start justify-center pt-24 sm:flex" in:fade={{ duration: 200 }}>
						<!-- Backdrop -->
						<button class="absolute inset-0 bg-white/80 backdrop-blur-md transition-opacity" onclick={closeSearch} aria-label="Close search"></button>

						<!-- Search Container -->
						<div
							class="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
							in:fly={{ y: -20, duration: 400 }}
						>
							<div class="relative flex items-center border-b border-gray-50 px-4 py-4">
								<Search class="mr-4 h-5 w-5 text-gray-800" />
								<input
									type="text"
									autofocus
									class="h-10 w-full bg-transparent text-lg font-medium text-gray-900 placeholder-gray-400 focus:outline-none"
									bind:value={search}
									placeholder={searchPlugin?.placeholder || placeholder}
									onkeydown={handleKeyDown}
									onfocusin={() => toggleSearchResults(true)}
								/>
								<button
									class="ml-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900"
									onclick={closeSearch}
								>
									<X class="h-4 w-4" />
								</button>
							</div>

							<!-- Results Area -->
							<div class="max-h-[60vh] overflow-y-auto">
								{#if loading}
									<div class="flex flex-col gap-3 p-6">
										{#each Array(3) as _}
											<div class="flex items-center gap-4">
												<div class="h-12 w-12 animate-pulse rounded-lg bg-gray-100"></div>
												<div class="flex-1 space-y-2">
													<div class="h-4 w-3/4 animate-pulse rounded bg-gray-100"></div>
													<div class="h-3 w-1/2 animate-pulse rounded bg-gray-50"></div>
												</div>
											</div>
										{/each}
									</div>
								{:else if searchResults.length > 0}
									<div class="divide-y divide-gray-50">
										{#each searchResults as result}
											
											<button
												class="group flex w-full items-center gap-4 px-6 py-4 text-left transition-colors hover:bg-gray-50/50"
												onclick={() => handleResultClick(result)}
											>
												<div
													class="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 text-gray-400 transition-colors group-hover:bg-white group-hover:text-primary group-hover:shadow-sm"
												>
													{#if result.thumbnail}
														<img src={result.thumbnail} alt="" class="h-full w-full rounded-xl object-cover" />
													{:else}
														<ShoppingBag class="h-5 w-5" />
													{/if}
												</div>
												<div class="flex-1">
													<p class="text-sm font-bold text-gray-900 transition-colors group-hover:text-primary">
														{result.name || result.title}
													</p>
													{#if result?.price}
														<p class="text-xs uppercase tracking-widest text-gray-700">${result.price}</p>
													{/if}
												</div>
												<ArrowRight class="h-4 w-4 text-gray-300 transition-all group-hover:translate-x-1 group-hover:text-primary" />
											</button>
										{/each}
									</div>
								{:else if search.length > 2}
									<div class="flex flex-col items-center justify-center py-12 text-center" in:fade>
										<div class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 text-gray-300">
											<Search class="h-8 w-8" />
										</div>
										<p class="text-gray-500">No results found for "<span class="font-bold text-gray-900">{search}</span>"</p>
									</div>
								{:else}
									<div class="p-8 text-center">
										<p class="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">Start typing to search products</p>
									</div>
								{/if}
							</div>
						</div>
					</div>

					<!-- Mobile Search Overlay -->
					<div class="fixed inset-0 z-[10000] flex flex-col bg-white sm:hidden" in:fly={{ y: 20, duration: 400 }}>
						<div class="flex items-center border-b border-gray-100 px-4 py-3">
							<div class="relative flex-1">
								<Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
								<input
									type="text"
									autofocus
									class="h-10 w-full rounded-xl bg-gray-50 pl-10 pr-4 text-sm font-medium focus:outline-none"
									bind:value={search}
									placeholder={searchPlugin?.placeholder || placeholder}
									onkeydown={handleKeyDown}
								/>
							</div>
							<button class="ml-4 text-sm font-bold text-gray-500" onclick={closeSearch}> Cancel </button>
						</div>

						<div class="flex-1 overflow-y-auto">
							{#if loading}
								<div class="flex flex-col gap-4 p-4">
									{#each Array(5) as _}
										<div class="flex items-center gap-4">
											<div class="h-14 w-14 animate-pulse rounded-xl bg-gray-50"></div>
											<div class="flex-1 space-y-2">
												<div class="h-4 w-3/4 animate-pulse rounded bg-gray-50"></div>
												<div class="h-3 w-1/2 animate-pulse rounded bg-gray-50/50"></div>
											</div>
										</div>
									{/each}
								</div>
							{:else if searchResults.length > 0}
								<div class="divide-y divide-gray-50">
									{#each searchResults as result}
									
										<button class="flex w-full items-center gap-4 p-4 active:bg-gray-50" onclick={() => handleResultClick(result)}>
											<div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-gray-400">
												{#if result.thumbnail}
													<img src={result.thumbnail} alt="" class="h-full w-full rounded-xl object-cover" />
												{:else}
													<ShoppingBag class="h-6 w-6" />
												{/if}
											</div>
											<div class="flex-1">
												<p class="line-clamp-1 text-sm font-bold text-gray-900">
													{result.name || result.title}
												</p>
												{#if result.price}
													<p class="text-xs font-medium text-gray-500">{result.price}</p>
												{/if}
												<!-- {#if result.mrp}
													<p class="text-xs font-medium text-gray-500">{result.mrp}</p>
												{/if} -->
											</div>
											<ArrowUpRight class="h-4 w-4 text-gray-300" />
										</button>
									{/each}
								</div>
							{:else if search.length > 2}
								<div class="flex flex-col items-center justify-center py-20 text-center">
									<p class="text-sm text-gray-500">No results found</p>
								</div>
							{/if}
						</div>
					</div>
				{/if}
			</div>
		{/if}
	{/snippet}
</MsSearchRenderer>
