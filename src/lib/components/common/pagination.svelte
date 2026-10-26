<script lang="ts">
	import * as Pagination from '$lib/components/ui/pagination'
	import { Pagination as PaginationPrimitive } from 'bits-ui'
	import { buttonVariants } from '$lib/components/ui/button/index.js'
	import { PaginationRenderer } from '$lib/core/composables/index.js'
	import { cn } from '$lib/core/utils'
	import { page as appPage } from '$app/state'
	import { goto } from '$app/navigation'

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
	// and only catches up in an effect — i.e. never on the server. Every control below reads this,
	// so the page window, the Previous/Next links and the "page N of M" text are right in the SSR
	// HTML instead of always describing page 1.
	const activePage = $derived(Math.max(1, Math.floor(Number(appPage.url.searchParams.get('page'))) || 1))

	// Real hrefs that keep the active filters and sort. bits-ui renders Pagination.Page as a
	// <button>, so without them no crawler could reach page 2 of any listing. Page 1 drops the
	// parameter so it is the same URL as the listing's canonical.
	const pageHref = (value: number) => {
		const url = new URL(appPage.url)
		if (value > 1) url.searchParams.set('page', String(value))
		else url.searchParams.delete('page')
		return url.pathname + url.search
	}

	// The renderer's goToPage, except that it navigates to pageHref, so page 1 loses `?page` here too.
	const goToPage = async (value: number) => {
		await goto(pageHref(value), { replaceState: true, invalidateAll: true })
		paginateProducts?.()
	}

	// A plain click navigates client-side; a modified click (new tab, new window) is left to the
	// browser, which follows the href.
	const follow = (e: MouseEvent, value: number) => {
		if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
		// preventDefault also stops SvelteKit's own anchor handler from navigating a second time.
		e.preventDefault()
		goToPage(value)
	}

	// Hands a key event back to bits-ui's own roving-focus handler.
	const forwardKeydown = (props: any, e: KeyboardEvent) => props?.onkeydown?.(e)
</script>

<PaginationRenderer bind:noOfPage {paginateProducts}>
	{#snippet content({ pageSize, count })}
		{#if count && cappedNoOfPage > 1}
			<div class="mt-5 flex flex-col items-center gap-6 border-border pt-5">
				<Pagination.Root count={Math.min(count, LAST_REACHABLE_PAGE * (pageSize || 1))} perPage={pageSize} page={activePage}>
					{#snippet children({ pages })}
						<Pagination.Content class="gap-1">
							<Pagination.Item>
								<!-- A link only while there is a page to go back to; never one past either end. -->
								{#if activePage > 1}
									{@const previous = Math.min(activePage - 1, cappedNoOfPage)}
									<Pagination.PrevButton href={pageHref(previous)} onclick={(e: MouseEvent) => follow(e, previous)} class="h-10 px-4" />
								{:else}
									<Pagination.PrevButton disabled class="h-10 px-4" />
								{/if}
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
														onclick={(e) => follow(e, page.value)}
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

							<div class="flex items-center px-6 text-[10px] font-bold uppercase tracking-widest text-foreground md:hidden">
								<span class="mr-2 text-muted-foreground">Page</span>
								{activePage} <span class="mx-2 text-muted-foreground">/</span>
								{noOfPage}
							</div>

							<Pagination.Item>
								{#if activePage < cappedNoOfPage}
									<Pagination.NextButton href={pageHref(activePage + 1)} onclick={(e: MouseEvent) => follow(e, activePage + 1)} class="h-10 px-4" />
								{:else}
									<Pagination.NextButton disabled class="h-10 px-4" />
								{/if}
							</Pagination.Item>
						</Pagination.Content>
					{/snippet}
				</Pagination.Root>

				<div class="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
					Showing page {activePage} of {noOfPage}
				</div>
			</div>
		{/if}
	{/snippet}
</PaginationRenderer>
