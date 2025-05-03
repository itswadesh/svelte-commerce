<script lang="ts">
	import { page } from '$app/state'
	import { onMount } from 'svelte'
	import { fade } from 'svelte/transition'
	import { blogService } from '$lib/core/services'
	import type { BlogPost } from '$lib/core/types'
	import SeoHeader from '$lib/core/components/plugins/seo-header.svelte'

	let loading = $state(false)
	let error = $state('')
	let post = $state<BlogPost | null>(null)

	function formatDate(dateString: string): string {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		})
	}

	async function loadBlogPost(slug: string) {
		try {
			loading = true
			error = ''
			post = await blogService.getOne(slug)
		} catch (err) {
			console.error(err)
			error = 'Failed to load blog post. Please try again later.'
		} finally {
			loading = false
		}
	}

	$effect(() => {
		if (page.params.slug) {
			loadBlogPost(page.params.slug)
		}
	})
</script>

<SeoHeader metaTitle={post?.title} />

<div class="mx-auto max-w-4xl px-4 py-8">
	{#if loading}
		<div class="animate-pulse" transition:fade>
			<div class="mb-8 h-64 rounded-lg bg-gray-100"></div>
			<div class="mb-4 h-8 w-3/4 rounded bg-gray-100"></div>
			<div class="mb-8 h-4 w-1/2 rounded bg-gray-100"></div>
			<div class="space-y-4">
				{#each Array(4) as _}
					<div class="h-4 w-full rounded bg-gray-100"></div>
				{/each}
			</div>
		</div>
	{:else if error}
		<div class="py-8 text-center text-red-600" transition:fade>
			<p>{error}</p>
			<button class="mt-4 rounded-lg bg-gray-100 px-4 py-2 transition-colors hover:bg-gray-200" onclick={() => loadBlogPost($page.params.slug)}>
				Try Again
			</button>
		</div>
	{:else if post}
		<article class="prose prose-lg max-w-none" transition:fade>
			{#if post.imageUrl}
				<img src={post.imageUrl} alt={post.title} class="mb-8 h-64 w-full rounded-lg object-cover" />
			{/if}

			<header class="mb-8">
				<h1 class="mb-4 text-4xl font-bold text-gray-900">{post.title}</h1>
				<div class="flex items-center gap-4 text-gray-600">
					<div class="flex items-center gap-2">
						<span class="font-medium">{post.author}</span>
					</div>
					<span>•</span>
					<time datetime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
				</div>
			</header>

			<div class="mb-8">
				{#each post.tags as tag}
					<span class="mr-2 inline-block rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">
						{tag}
					</span>
				{/each}
			</div>

			<div class="prose prose-lg prose-gray">
				{@html post.content}
			</div>
		</article>

		<div class="mt-12 border-t pt-8">
			<a href="/blog" class="inline-flex items-center text-blue-600 transition-colors hover:text-blue-800"> ← Back to Blog </a>
		</div>
	{:else}
		<div class="py-8 text-center text-gray-500" transition:fade>
			<p>Blog post not found.</p>
			<a href="/blog" class="mt-4 inline-block text-blue-600 transition-colors hover:text-blue-800"> ← Back to Blog </a>
		</div>
	{/if}
</div>

