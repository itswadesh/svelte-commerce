<script lang="ts">
	import { page } from '$app/state'
	import Select from '$lib/components/form/select.svelte'
	import { goto } from '$app/navigation'
	import LazyImg from '$lib/core/components/image/lazy-img.svelte'
	import Pagination from '$lib/components/common/pagination.svelte'
	import SeoHeader from '$lib/components/seo/seo-header.svelte'

	// The route's +page.ts (wwwCollectonsLoad) already fetches the collection list server-side.
	// This page used to ignore it and re-run a *product* search in an $effect, which never runs
	// during SSR — so crawlers were served "0 Collections found" above an empty grid.
	const collections = $derived(page.data?.data || [])
	const count = $derived(page.data?.count ?? 0)
	const noOfPage = $derived(page.data?.noOfPage)

	let selectedSort = $state(page.url.searchParams.get('sort') || '-createdAt')

	const storeName = $derived(page.data?.store?.name)

	const selectSort = (value: string) => {
		goto(`/collections?sort=${value}`)
	}
</script>

<SeoHeader
	metaTitle={storeName ? `Collections | ${storeName}` : 'Collections'}
	metaDescription="Browse every curated product collection in the store."
/>

<div class="container mx-auto mt-2 flex h-full min-h-screen flex-col max-md:px-4 md:gap-2">
	<div class="flex-1">
		<div class="mb-4 flex flex-col items-start gap-2">
			<h1 class="text-2xl font-bold">All Collections</h1>
			<span class="text-sm text-muted-foreground">{count} {count === 1 ? 'Collection' : 'Collections'} found</span>
		</div>

		<div class="hidden flex-row items-center gap-2 md:flex">
			<span class="text-sm font-normal text-muted-foreground">Sort by:</span>
			<Select
				class="!mb-0"
				id="sort-by"
				value={selectedSort}
				data={[
					{ value: '-createdAt', name: "What's New" },
					{ value: 'createdAt', name: 'Oldest First' },
					{ value: 'name', name: 'Name: A-Z' },
					{ value: '-name', name: 'Name: Z-A' }
				]}
				optionSelected={(value: string) => {
					selectedSort = value
					selectSort(value)
				}}
			/>
		</div>

		{#if !collections.length}
			<div class="flex h-96 items-center justify-center">
				<p class="text-sm text-muted-foreground">No collections found</p>
			</div>
		{:else}
			<ul class="mt-4 grid grid-cols-2 gap-5 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
				{#each collections as collection, i}
					<li>
						<a href="/collections/{collection.slug || collection.id}" class="group flex flex-col gap-2">
							<div class="aspect-square overflow-hidden rounded-md border border-border bg-muted">
								<LazyImg
									src={collection.img || collection.images?.[0]}
									alt={collection.name}
									width={400}
									height={400}
									class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
									priority={i < 4}
								/>
							</div>
							<h2 class="text-sm font-medium text-foreground group-hover:underline">{collection.title || collection.name}</h2>
							{#if collection.subTitle}
								<p class="text-xs text-muted-foreground">{collection.subTitle}</p>
							{/if}
						</a>
					</li>
				{/each}
			</ul>

			<div class="mt-20">
				<Pagination {noOfPage} />
			</div>
		{/if}
	</div>
</div>
