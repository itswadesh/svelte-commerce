<script lang="ts">
	import { page } from '$app/state'
	import { SeoHeader } from '$lib/core/components/index.js'

	const posts = $derived(page.data.blogs)

	function formatDate(dateString: string): string {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		})
	}
</script>

<SeoHeader metaTitle="Blog | Insights & News" />

<div class="mx-auto max-w-4xl px-4 py-8">
	<h1 class="mb-8 text-center text-4xl font-bold text-gray-900">Blog</h1>

	{#if posts?.data?.length}
		<div class="grid gap-8 md:grid-cols-2">
			{#each posts.data as post (post.id)}
				<article class="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md">
					{#if post.imageUrl || post.thumbnail}
						<a href={`/blog/${post.slug || post.id}`}>
							<img src={post.imageUrl || post.thumbnail} alt={post.title} class="h-48 w-full object-cover" />
						</a>
					{/if}
					<div class="p-6">
						<div class="mb-3 flex items-center gap-2 text-sm text-gray-600">
							{#if post.author}
								<span>{post.author}</span>
								<span>•</span>
							{/if}
							<time datetime={post.createdAt}>{formatDate(post.createdAt)}</time>
						</div>
						<h2 class="mb-2 text-xl font-semibold text-gray-900">
							<a href={`/blog/${post.slug || post.id}`} class="transition-colors hover:text-blue-600">
								{post.title}
							</a>
						</h2>
						{#if post.excerpt}
							<p class="mb-4 text-gray-600">{post.excerpt}</p>
						{/if}
						{#if post.tags?.length}
							<div class="flex gap-2">
								{#each post.tags as tag}
									<span class="rounded-full bg-gray-100 px-2 py-1 text-sm text-gray-600">
										{tag}
									</span>
								{/each}
							</div>
						{/if}
					</div>
				</article>
			{/each}
		</div>
	{:else}
		<div class="py-8 text-center text-gray-500">
			<p>No blog posts available at the moment.</p>
		</div>
	{/if}
</div>
