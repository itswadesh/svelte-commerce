<script lang="ts">
	import { blogService } from '$lib/core/services'
	import type { Blog } from '$lib/core/types'
	import { onMount, type Snippet } from 'svelte'
	import SeoHeader from '$lib/core/components/plugins/seo-header.svelte'

	const { content }: { content: Snippet<[SnippetParams]> } = $props()

  interface SnippetParams {
    loading: boolean
    error: string
    posts: { data: Blog[] }
    formatDate: (key: string) => string
    loadBlogPosts: () => void
  }

	let loading = $state(true)
	let error = $state('')
	let posts = $state<{ data: Blog[] }>({ data: [] })

	function formatDate(dateString: string): string {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		})
	}

	async function loadBlogPosts() {
		try {
			loading = true
			error = ''
			posts = await blogService.list({ page: 1 })
		} catch (err) {
			console.error(err)
			error = 'Failed to load blog posts. Please try again later.'
		} finally {
			loading = false
		}
	}

	onMount(loadBlogPosts)
</script>

<SeoHeader metaTitle="Blog" />

{@render content?.({ loading, error, posts, formatDate, loadBlogPosts })}
