<script lang="ts">
	import { fade } from 'svelte/transition'
	import BlogRenderer from '$lib/core/composables/blog-renderer.svelte'
</script>

<BlogRenderer>
	{#snippet content({ loading, error, posts, formatDate, loadBlogPosts })}
		<div class="mx-auto max-w-4xl px-4 py-8">
			<h1 class="mb-8 text-center text-4xl font-bold text-gray-900">Blog</h1>

			{#if loading}
				<div class="flex flex-col gap-8" transition:fade>
					{#each Array(2) as _}
						<div class="animate-pulse">
							<div class="mb-4 h-64 rounded-lg bg-gray-100"></div>
							<div class="mb-2 h-8 w-3/4 rounded bg-gray-100"></div>
							<div class="h-4 w-1/2 rounded bg-gray-100"></div>
						</div>
					{/each}
				</div>
			{:else if error}
				<div class="py-8 text-center text-red-600" transition:fade>
					<p>{error}</p>
					<button class="mt-4 rounded-lg bg-gray-100 px-4 py-2 transition-colors hover:bg-gray-200" onclick={loadBlogPosts}> Try Again </button>
				</div>
			{:else if posts.data.length}
				<div class="grid gap-8 md:grid-cols-2">
					{#each posts.data as post (post.id)}
						<article class="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md">
							{#if post.imageUrl}
								<img src={post.imageUrl} alt={post.title} class="h-48 w-full object-cover" />
							{/if}
							<div class="p-6">
								<div class="mb-3 flex items-center gap-2 text-sm text-gray-600">
									<span>{post.author}</span>
									<span>•</span>
									<time datetime={post.createdAt}>{formatDate(post.createdAt)}</time>
								</div>
								<h2 class="mb-2 text-xl font-semibold text-gray-900">
									<a href={`/blog/${post.id}`} class="transition-colors hover:text-blue-600">
										{post.title}
									</a>
								</h2>
								<p class="mb-4 text-gray-600">{post.excerpt}</p>
								<div class="flex gap-2">
									{#each post.tags as tag}
										<span class="rounded-full bg-gray-100 px-2 py-1 text-sm text-gray-600">
											{tag}
										</span>
									{/each}
								</div>
							</div>
						</article>
					{/each}
				</div>
			{:else}
				<div class="py-8 text-center text-gray-500" transition:fade>
					<p>No blog posts available at the moment.</p>
				</div>
			{/if}
		</div>
	{/snippet}
</BlogRenderer>

