<script lang="ts">
	import { page } from '$app/state'
	import SeoHeader from '$lib/components/seo/seo-header.svelte'
	import Pagination from '$lib/components/common/pagination.svelte'
	import { Button } from '$lib/components/ui/button'
	import LazyImg from '$lib/core/components/image/lazy-img.svelte'
	import { dateOnly } from '$lib/core/utils'

	const posts = $derived(page.data.blogs)
	// The loader already reads `?page`, but nothing on the page could set it, so a store with more
	// than one page of posts published a second page nobody could reach.
	const noOfPage = $derived(Number(posts?.noOfPage) || 0)
</script>

<SeoHeader metaTitle="Blog | Insights & News" />

<div class="page-width py-10 md:py-16">
	<h1 class="mb-8 text-center text-3xl font-bold tracking-tight text-foreground md:text-4xl">Blog</h1>

	{#if posts?.data?.length}
		<div class="grid gap-8 md:grid-cols-2">
			{#each posts.data as post (post.id)}
				<article class="overflow-hidden rounded-lg border bg-card shadow-xs transition-shadow hover:shadow-z-1">
					{#if post.imageUrl || post.thumbnail}
						<a href={`/blog/${post.slug || post.id}`}>
							<!-- Reserved 16:9 box: the cards used to jump as each image arrived. -->
							<LazyImg src={post.imageUrl || post.thumbnail} alt={post.title} aspectRatio="16:9" class="h-full w-full object-cover" />
						</a>
					{/if}
					<div class="p-6">
						<div class="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
							{#if post.author}
								<span>{post.author}</span>
								<span aria-hidden="true">•</span>
							{/if}
							<!-- The shared date helper, not a hard-coded en-US format. -->
							<time datetime={post.createdAt}>{dateOnly(post.createdAt)}</time>
						</div>
						<h2 class="mb-2 text-xl font-semibold text-foreground">
							<a href={`/blog/${post.slug || post.id}`} class="transition-colors hover:text-primary">
								{post.title}
							</a>
						</h2>
						{#if post.excerpt}
							<p class="mb-4 text-muted-foreground">{post.excerpt}</p>
						{/if}
						{#if post.tags?.length}
							<div class="flex flex-wrap gap-2">
								{#each post.tags as tag}
									<span class="rounded-md bg-muted px-2 py-1 text-sm text-muted-foreground">
										{tag}
									</span>
								{/each}
							</div>
						{/if}
					</div>
				</article>
			{/each}
		</div>

		{#if noOfPage > 1}
			<div class="mt-10">
				<Pagination {noOfPage} />
			</div>
		{/if}
	{:else}
		<!-- An empty list used to end in one grey sentence with nowhere to go next. -->
		<div class="mx-auto max-w-md py-10 text-center">
			<p class="text-muted-foreground">There are no posts here yet.</p>
			<p class="mt-2 text-sm text-muted-foreground">
				New writing is published here as it goes out. In the meantime, the shop and the FAQs are the quickest way to find what you need.
			</p>
			<div class="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
				<Button href="/products" class="h-11">Browse products</Button>
				<Button href="/faqs" variant="outline" class="h-11">Read the FAQs</Button>
			</div>
		</div>
	{/if}
</div>
