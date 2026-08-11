<script lang="ts">
	import * as Pagination from '$lib/components/ui/pagination'
	import { Pagination as PaginationPrimitive } from 'bits-ui'
	import { buttonVariants } from '$lib/components/ui/button/index.js'
	import { PaginationRenderer } from '$lib/core/composables/index.js'
	import { cn } from '$lib/core/utils'
	import { page as appPage } from '$app/state'

	type Props = {
		noOfPage: number
		paginateProducts?: () => void
	}

	let { noOfPage = $bindable(), paginateProducts }: Props = $props()

	// ponytail: interim guard, not the fix. The listing API returns zero results past page 50,
	// so offering page 51+ lands shoppers on a false "No products match your search". Capping
	// here (the one component every listing paginates through) stops that, but the rest of a
	// large catalogue stays unreachable until the API ceiling is raised or paging goes cursor-based.
	const LAST_REACHABLE_PAGE = 50
	const cappedNoOfPage = $derived(Math.min(noOfPage ?? 0, LAST_REACHABLE_PAGE))

	// Derived from the URL rather than from PaginationRenderer's `currentPage`, which is $state(1)
	// and only catches up in an effect — i.e. never on the server. Feeding it to Pagination.Root
	// makes the rendered page window (and the prev/next disabled state) correct in the SSR HTML
	// instead of always being the window around page 1.
	const activePage = $derived(Number(appPage.url.searchParams.get('page')) || 1)

	// Real hrefs. bits-ui renders Pagination.Page as a <button>, so before this the only way to
	// reach page 2 of any listing was JavaScript — no crawler could follow it, and with the
	// catalogue's sitemap being the only other discovery path, deep pages were effectively orphaned.
	const pageHref = (value: number) => {
		const url = new URL(appPage.url)
		url.searchParams.set('page', String(value))
		return url.pathname + url.search
	}

	// Hands a key event back to bits-ui's own roving-focus handler.
	const forwardKeydown = (props: any, e: KeyboardEvent) => props?.onkeydown?.(e)
</script>

<PaginationRenderer bind:noOfPage {paginateProducts}>
	{#snippet content({ pageSize, currentPage, goToPreviousPage, goToNextPage, goToPage, count })}
		{#if count && cappedNoOfPage > 1}
			<div class="mt-5 flex flex-col items-center gap-6 border-gray-200 pt-5">
				<Pagination.Root count={Math.min(count, LAST_REACHABLE_PAGE * (pageSize || 1))} perPage={pageSize} page={activePage}>
					{#snippet children({ pages })}
						<Pagination.Content class="gap-1">
							<Pagination.Item>
								<Pagination.PrevButton
									onclick={goToPreviousPage}
									disabled={currentPage <= 1}
									class="h-10 px-4"
								/>
							</Pagination.Item>

							<div class="hidden items-center gap-1 md:flex">
								{#each pages as page (page.key)}
									{#if page.type === 'ellipsis'}
										<Pagination.Item>
											<Pagination.Ellipsis />
										</Pagination.Item>
									{:else}
										<Pagination.Item>
											<!-- Pagination.Link is bypassed here only because its props type strips
											     `child`; the classes below are exactly what it applies. -->
											<PaginationPrimitive.Page
												{page}
												aria-current={page.value === activePage ? 'page' : undefined}
												class={cn(buttonVariants({ variant: page.value === activePage ? 'default' : 'ghost', size: 'icon' }), 'h-10 w-10')}
											>
												{#snippet child({ props })}
													{@const anchorProps = { ...props, type: undefined }}
													<a
														{...anchorProps}
														href={pageHref(page.value)}
														onclick={(e) => {
															// The href is what makes this crawlable; navigation itself stays
															// client-side, so preventDefault stops SvelteKit's own anchor
															// handler from navigating a second time.
															e.preventDefault()
															goToPage(page.value)
														}}
														onkeydown={(e) => {
															// bits-ui preventDefaults Enter (to run its own page setter), which
															// would otherwise swallow the anchor's native activation. Everything
															// else — arrow keys, Home/End — stays with its roving-focus handler.
															if (e.key === 'Enter') {
																e.preventDefault()
																goToPage(page.value)
															} else {
																forwardKeydown(props, e)
															}
														}}
													>
														{page.value}
													</a>
												{/snippet}
											</PaginationPrimitive.Page>
										</Pagination.Item>
									{/if}
								{/each}
							</div>

							<div class="flex items-center px-6 text-[10px] font-bold uppercase tracking-widest text-gray-900 md:hidden">
								<span class="mr-2 text-gray-400">Page</span>
								{currentPage} <span class="mx-2 text-gray-300">/</span>
								{noOfPage}
							</div>

							<Pagination.Item>
								<Pagination.NextButton
									onclick={goToNextPage}
									disabled={currentPage >= cappedNoOfPage}
									class="h-10 px-4"
								/>
							</Pagination.Item>
						</Pagination.Content>
					{/snippet}
				</Pagination.Root>

				<div class="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
					Showing page {currentPage} of {noOfPage}
				</div>
			</div>
		{/if}
	{/snippet}
</PaginationRenderer>
