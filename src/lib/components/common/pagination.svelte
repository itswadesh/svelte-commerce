<script lang="ts">
	import * as Pagination from '$lib/components/ui/pagination'
	import { PaginationRenderer } from '$lib/core/composables/index.js'
	import { cn } from '$lib/core/utils'

	type Props = {
		noOfPage: number
		paginateProducts?: () => void
	}

	let { noOfPage = $bindable(), paginateProducts }: Props = $props()
</script>

<PaginationRenderer bind:noOfPage {paginateProducts}>
	{#snippet content({ pageSize, currentPage, goToPreviousPage, goToNextPage, goToPage, count })}
		{#if count && noOfPage > 1}
			<div class="mt-16 flex flex-col items-center gap-6 border-t border-gray-100 pt-10">
				<Pagination.Root {count} perPage={pageSize}>
					{#snippet children({ pages })}
						<Pagination.Content class="gap-1">
							<Pagination.Item>
								<Pagination.PrevButton
									onclick={goToPreviousPage}
									disabled={currentPage <= 1}
									class="h-10 px-4 rounded-full border-transparent hover:bg-gray-50 transition-colors uppercase tracking-widest text-[10px] font-bold"
								/>
							</Pagination.Item>

							<div class="hidden items-center gap-1 md:flex">
								{#each pages as page (page.key)}
									{#if page.type === 'ellipsis'}
										<Pagination.Item>
											<Pagination.Ellipsis class="text-gray-300" />
										</Pagination.Item>
									{:else}
										<Pagination.Item>
											<Pagination.Link
												{page}
												isActive={page.value === currentPage}
												onclick={() => goToPage(page.value)}
												class={cn(
													'h-10 w-10 rounded-full text-xs font-bold transition-all duration-200',
													page.value === currentPage
														? 'bg-primary text-white'
														: 'text-gray-400 hover:bg-gray-50 hover:text-gray-900'
												)}
											>
												{page.value}
											</Pagination.Link>
										</Pagination.Item>
									{/if}
								{/each}
							</div>

							<div class="flex items-center px-6 text-[10px] font-bold uppercase tracking-widest text-gray-900 md:hidden">
								<span class="text-gray-400 mr-2">Page</span> {currentPage} <span class="text-gray-300 mx-2">/</span> {noOfPage}
							</div>

							<Pagination.Item>
								<Pagination.NextButton
									onclick={goToNextPage}
									disabled={currentPage >= noOfPage}
									class="h-10 px-4 rounded-full border-transparent hover:bg-gray-50 transition-colors uppercase tracking-widest text-[10px] font-bold"
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
