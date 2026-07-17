<script lang="ts">
	import LazyImg from '$lib/core/components/image/lazy-img.svelte'
	import { MegaMenuRenderer } from '$lib/core/composables/index.js'
	import { getImageCDNUrl } from '$lib/core/utils/index.js'
	import { page } from '$app/state'
	import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte'
	import { fade } from 'svelte/transition'
	import { onMount } from 'svelte'

	// Admin-configured header menu takes priority over the raw category megamenu.
	// Menu-builder nodes keep their children under `items`; category nodes use `children`.
	const headerMenuItems = $derived(page.data.store?.menu?.find((x: any) => x.menuId === 'header')?.items)

	// The renderer doesn't expose loading state, so settle the same megamenu promise here
	// to tell "still loading" (skeleton) apart from "loaded but empty" (empty nav).
	let megamenuSettled = $state(false)
	onMount(() => {
		Promise.resolve(page?.data?.store?.megamenu)
			.catch(() => {})
			.finally(() => (megamenuSettled = true))
	})

	function childrenOf(node: any) {
		return node?.items ?? node?.children
	}

	function sortByRank(nodes: any[]) {
		return nodes?.toSorted((a: any, b: any) => (a.rank ?? 0) - (b.rank ?? 0))
	}

	function getThumbnailURL(x: string, width?: number) {
		if (page?.data?.store?.plugins?.imageCdn?.active) return getImageCDNUrl(x, width)
		return x
	}
</script>

<MegaMenuRenderer>
	{#snippet content({ headerItems: menuItems, toggleMenuItemChildren, selectedCategory, openChildMenu, closeChildMenu })}
		{@const items = headerMenuItems ?? menuItems}
		{#if items?.length}
			<ul class="intra-gap flex max-w-[65vw] flex-row items-center justify-evenly overflow-x-auto scrollbar-none">
				{#each items as category, index}
					<li
						class="hoverable"
						onmousemove={() => {
							openChildMenu(category.name, index)
						}}
						onmouseleave={() => {
							//closeChildMenu(index, true)
						}}
					>
						<a
							href={category.link || '/' + category.slug}
							class="relative flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap py-3 text-sm font-semibold uppercase  text-gray-900 transition-all duration-300 hover:text-gray-900 active:scale-95
								{selectedCategory === category.name ? 'text-primary after:scale-x-100' : 'after:scale-x-0'}
								after:ease-out-expo after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-primary after:transition-transform after:duration-300 hover:after:scale-x-100"
							style="font-family: var(--font-body);"
							onclick={() => closeChildMenu(index, false)}
						>
							<span>{category.name}</span>

							{#if childrenOf(category)?.length}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									class="ease-out-expo h-3.5 w-3.5 shrink-0 transition-transform duration-300
            {selectedCategory === category.name ? '-rotate-180 transform' : ''}"
								>
									<path
										fill-rule="evenodd"
										d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
										clip-rule="evenodd"
									></path>
								</svg>
							{/if}
						</a>

						{#if toggleMenuItemChildren[index] && childrenOf(category)?.length}
							<div
								class="mega-menu ease-out-expo absolute left-1/2 top-full w-[90vw] max-w-screen-xl -translate-x-1/2 overflow-hidden rounded-b-xl border-x border-b border-gray-100 bg-white shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] transition-all duration-500"
							>
								<div class="flex">
									<div class="grid max-h-[70vh] flex-1 grid-cols-4 gap-8 overflow-y-auto p-10 scrollbar-thin">
										{#each sortByRank(childrenOf(category)) as c}
											<div class="flex flex-col gap-5">
												<a
													href={c.link || '/' + c.slug}
													class="flex items-center gap-2 text-sm font-semibold text-gray-900 transition-all hover:translate-x-1"
													onclick={() => closeChildMenu(index, false)}
												>
													{#if c?.thumbnail}
														<img
															src={getThumbnailURL(c.thumbnail, 40)}
															alt={c?.name}
															loading="lazy"
															class="h-6 w-6 shrink-0 rounded-full object-cover"
															onerror={(e) => {
																const img = e.currentTarget as HTMLImageElement
																if (img.src !== c.thumbnail) img.src = c.thumbnail
															}}
														/>
													{/if}
													{c.name}
												</a>

												{#if childrenOf(c)}
													<ul class="flex flex-col gap-2.5">
														{#each sortByRank(childrenOf(c)) as c1}
															<li>
																<a
																	href={c1.link || '/' + c1.slug}
																	class="flex items-center gap-2 text-[13px] font-medium text-gray-700 transition-all hover:translate-x-1 hover:text-primary"
																	onclick={() => closeChildMenu(index, false)}
																>
																	{#if c1?.thumbnail}
																		<img
																			src={getThumbnailURL(c1?.thumbnail, 40)}
																			alt={c1?.name}
																			loading="lazy"
																			class="h-8 w-8 shrink-0 rounded object-cover"
																			onerror={(e) => {
																				const img = e.currentTarget as HTMLImageElement
																				if (img.src !== c1.thumbnail) img.src = c1.thumbnail
																			}}
																		/>
																	{/if}
																	{c1.name}
																</a>
															</li>
														{/each}
													</ul>
												{/if}
											</div>
										{/each}
									</div>

									{#if category?.thumbnail}
										<a
											href={category.link || '/' + category.slug}
											class="hidden w-72 shrink-0 self-center p-6 lg:block"
											onclick={() => closeChildMenu(index, false)}
										>
											<LazyImg src={category.thumbnail} alt={category.name} class="" />
										</a>
									{/if}
								</div>

								<div class="border-t border-gray-100 bg-gray-50 px-10 py-4">
									<a
										href={category.link || '/' + category.slug}
										class="text-xs font-semibold text-muted-foreground transition-colors"
									>
										View all {category.name}
									</a>
								</div>
							</div>
						{/if}
					</li>
				{/each}
			</ul>
		{:else if headerMenuItems === undefined && !megamenuSettled}
			<!-- Only while the category megamenu is still loading; a settled-but-empty menu renders nothing. -->
			<ul class="intra-gap flex max-w-[65vw] flex-row items-center justify-evenly overflow-x-auto scrollbar-none" transition:fade={{ duration: 100 }}>
				{#each Array(6) as _}
					<li class="py-3">
						<Skeleton class="h-5 w-24 rounded-full" />
					</li>
				{/each}
			</ul>
		{/if}
	{/snippet}
</MegaMenuRenderer>

<style>
	.mega-menu {
		visibility: hidden;
		opacity: 0;
		transform: translate(-50%, 10px);
		z-index: 9999;
	}

	.hoverable:hover .mega-menu {
		visibility: visible;
		opacity: 1;
		transform: translate(-50%, 0);
	}

	.hoverable {
		position: static;
	}
</style>
