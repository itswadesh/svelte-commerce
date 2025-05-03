<script lang="ts">
	import { ArrowUpRight, Search, X } from 'lucide-svelte'
	import { Input } from '$lib/components/ui/input'
	import { cn } from '$lib/core/utils'
	import MsSearchRenderer from '$lib/core/composables/ms-search-renderer.svelte'

	let { class: className = '', placeholder = 'Search...' } = $props()

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
			<div class="relative top-0">
				{#if expandSearch}
					<!-- Desktop View -->
					<div class={cn('absolute right-[calc(100%-4rem)] top-0 hidden items-center rounded-full bg-white sm:flex', className)}>
						<!-- Background layer to handle outside click -->
						{#if showSearchResults}
							<button
								class="fixed inset-0 z-10 h-screen w-[100%] overflow-hidden"
								aria-label="Close Search"
								onclick={closeSearch}
							>
								<div class="bg-black opacity-50"></div>
								<span class="sr-only">Close search</span>
							</button>
						{/if}

						<div class="relative">
							<Input
								type="text"
								autofocus
								class="relative z-50 w-40 rounded-full border border-gray-200 px-4 py-2 focus:border-primary focus:outline-none sm:w-96"
								bind:value={search}
								placeholder={searchPlugin.placeholder || placeholder}
								onkeydown={handleKeyDown}
								onfocusin={() => toggleSearchResults(true)}
							/>
							{#if showSearchResults}
								{#if loading}
									<div class="absolute z-50 mt-1 flex w-full flex-col gap-3 rounded-lg border bg-white p-4 shadow-lg">
										<div class="h-8 w-full animate-pulse rounded-lg bg-gray-200"></div>
										<div class="h-8 w-full animate-pulse rounded-lg bg-gray-200"></div>
										<div class="h-8 w-full animate-pulse rounded-lg bg-gray-200"></div>
										<div class="h-8 w-full animate-pulse rounded-lg bg-gray-200"></div>
										<div class="h-8 w-full animate-pulse rounded-lg bg-gray-200"></div>
									</div>
								{:else if searchResults.length > 0}
									<div class="absolute z-10 mt-1 max-h-96 w-full overflow-y-auto rounded-lg border bg-white shadow-lg">
										{#each searchResults as result}
											<button
												class="w-full cursor-pointer px-4 py-2 text-left text-sm hover:bg-gray-100"
												aria-label="Goto {result.title}"
												onclick={() => handleResultClick(result)}
											>
												<p class="truncate">
													{result.name || result.title}
												</p>
											</button>
										{/each}
									</div>
								{/if}
							{/if}
							<button class="absolute right-0 top-0 z-50 h-full px-4" aria-label="Close Search" onclick={closeSearch}>
								<X class="h-6 w-6" />
							</button>
						</div>
					</div>

					<!-- Mobile View -->
					<div class="fixed inset-0 z-[10000] h-screen w-screen bg-white sm:hidden">
						<Input
							type="text"
							autofocus
							class="h-12 rounded-none border-0 border-b !border-gray-200 px-4 py-2 shadow-none focus:outline-none"
							bind:value={search}
							placeholder={searchPlugin.placeholder || placeholder}
							onkeydown={handleKeyDown}
						/>
						{#if loading}
							<div class="flex w-full flex-col gap-2 p-4">
								<div class="h-8 w-full animate-pulse rounded-lg bg-gray-200"></div>
								<div class="h-8 w-full animate-pulse rounded-lg bg-gray-200"></div>
								<div class="h-8 w-full animate-pulse rounded-lg bg-gray-200"></div>
								<div class="h-8 w-full animate-pulse rounded-lg bg-gray-200"></div>
								<div class="h-8 w-full animate-pulse rounded-lg bg-gray-200"></div>
							</div>
						{:else if searchResults.length > 0}
							<div class="max-h-[85vh] w-full divide-y divide-gray-200 overflow-y-auto">
								{#each searchResults as result}
									<button
										class="flex w-full cursor-pointer items-center justify-between p-3 text-left text-sm hover:bg-gray-100"
										aria-label="Goto {result.title}"
										onclick={() => handleResultClick(result)}
									>
										<p class="truncate text-sm font-medium capitalize text-[#71717A]">
											{result.name || result.title}
										</p>

										<ArrowUpRight class="h-5 w-5 text-gray-300" />
									</button>
								{/each}
							</div>
						{/if}

						<button class="absolute right-0 top-3 px-4" aria-label="Close search" onclick={closeSearch}>
							<X class="h-6 w-6" />
						</button>
					</div>
				{/if}
				<button aria-label="Show search bar" class="items-center rounded-full {expandSearch ? 'invisible' : 'flex'}" onclick={showSearch}>
					<Search class="size-5" />
				</button>
			</div>
		{/if}
	{/snippet}
</MsSearchRenderer>
