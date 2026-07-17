<script lang="ts">
	import { page } from '$app/state'
	import { SeoHeader } from '$lib/core/components/index.js'

	const blog = $derived(page.data.blog)
	const store = $derived(page.data.store)

	function formatDate(dateString: string): string {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		})
	}

	// Meta description: prefer explicit meta/excerpt if the API provides them,
	// otherwise strip HTML from the post content and trim to a sane length.
	const metaDescription = $derived(
		(blog?.metaDescription || blog?.excerpt || (blog?.content ?? '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim())
			.slice(0, 160)
			.trim()
	)

	const blogImage = $derived(blog?.banner || blog?.imageUrl || blog?.thumbnail || '')

	// BlogPosting/Article structured data — only include fields that actually exist.
	const articleJsonLd = $derived(
		JSON.stringify({
			'@context': 'https://schema.org',
			'@type': 'BlogPosting',
			headline: blog?.title,
			mainEntityOfPage: { '@type': 'WebPage', '@id': page.url.origin + page.url.pathname },
			...(metaDescription ? { description: metaDescription } : {}),
			...(blogImage ? { image: [blogImage] } : {}),
			...(blog?.createdAt ? { datePublished: blog.createdAt } : {}),
			...(blog?.updatedAt ? { dateModified: blog.updatedAt } : {}),
			author: { '@type': 'Organization', name: store?.name || 'Litekart' },
			publisher: {
				'@type': 'Organization',
				name: store?.name || 'Litekart',
				...(store?.logo ? { logo: { '@type': 'ImageObject', url: store.logo } } : {})
			}
		})
	)
</script>

<SeoHeader metaTitle={blog?.metaTitle || blog?.title || 'Blog'} {metaDescription} image={blogImage} />

<svelte:head>
	{@html `<script type="application/ld+json">${articleJsonLd}</script>`}
</svelte:head>

<div class="mx-auto max-w-4xl px-4 py-8">
	{#if blog}
		<article class="prose prose-lg max-w-none">
			{#if blogImage}
				<img src={blogImage} alt={blog.title} class="mb-8 h-64 w-full rounded-lg object-cover" />
			{/if}

			<header class="mb-8">
				<h1 class="mb-4 text-4xl font-bold text-gray-900">{blog.title}</h1>
				<div class="flex items-center gap-4 text-gray-600">
					{#if blog.author}
						<div class="flex items-center gap-2">
							<span class="font-medium">{blog.author}</span>
						</div>
						<span>•</span>
					{/if}
					{#if blog.publishedAt || blog.createdAt}
						<time datetime={blog.publishedAt || blog.createdAt}>{formatDate(blog.publishedAt || blog.createdAt)}</time>
					{/if}
				</div>
			</header>

			{#if blog.tags?.length}
				<div class="mb-8">
					{#each blog.tags as tag}
						<span class="mr-2 inline-block rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">
							{tag}
						</span>
					{/each}
				</div>
			{/if}

			<div class="prose prose-lg prose-gray prose-p:my-0 prose-li:my-0">
				{@html blog.content}
			</div>
		</article>

		<div class="mt-12 border-t pt-8">
			<a href="/blog" class="inline-flex items-center text-blue-600 transition-colors hover:text-blue-800"> ← Back to Blog </a>
		</div>
	{:else}
		<div class="py-8 text-center text-gray-500">
			<p>Blog post not found.</p>
			<a href="/blog" class="mt-4 inline-block text-blue-600 transition-colors hover:text-blue-800"> ← Back to Blog </a>
		</div>
	{/if}
</div>
