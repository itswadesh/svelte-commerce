<script lang="ts">
	import * as Pagination from '$lib/components/ui/pagination'
	import PaginationRenderer from '$lib/core/composables/pagination-renderer.svelte'

	type Props = {
		noOfPage: number
		paginateProducts?: () => void
	}

	let { noOfPage = $bindable(), paginateProducts }: Props = $props()
</script>

<PaginationRenderer bind:noOfPage {paginateProducts}>
	{#snippet content({ pageSize, currentPage, goToPreviousPage, goToNextPage, goToPage, count })}
		<!-- Pagination -->
		{#if count && noOfPage > 1}
			<Pagination.Root {count} perPage={pageSize}>
				{#snippet children({ pages })}
					<Pagination.Content>
						<!-- <Pagination.Item>
					<Pagination.PrevButton onclick={goToPreviousPage} disabled={currentPage <= 1}>Previous</Pagination.PrevButton>
				</Pagination.Item> -->
						Page:
						{#each pages as page (page.key)}
							{#if page.type === 'ellipsis'}
								<Pagination.Item>
									<Pagination.Ellipsis />
								</Pagination.Item>
							{:else}
								<Pagination.Item>
									<Pagination.Link {page} isActive={page.value === currentPage} onclick={() => goToPage(page.value)}>
										{page.value}
									</Pagination.Link>
								</Pagination.Item>
							{/if}
						{/each}

						<Pagination.Item>
							<Pagination.NextButton onclick={goToNextPage} disabled={currentPage >= noOfPage}>Next</Pagination.NextButton>
						</Pagination.Item>
					</Pagination.Content>
				{/snippet}
			</Pagination.Root>
		{/if}
	{/snippet}
</PaginationRenderer>
