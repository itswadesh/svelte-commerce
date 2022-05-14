<script context="module">
export async function load({ url, params, fetch, session, context }) {
	let blog, err
	try {
		await KQL_Blog.queryLoad({ fetch, variables: { id: params.id } })
		// console.log(res)
	} catch (e) {
		err = e
		toast(e, 'error')
	} finally {
	}
	return {
		props: { err }
	}
}
</script>

<script>
import SEO from '$lib/components/SEO/index.svelte'
import { toast } from '$lib/util'
import ImageLoader from '$lib/components/Image/ImageLoader.svelte'
import TimeAgo from 'svelte-timeago'
import { KQL_Blog, KQL_Blogs } from '$lib/graphql/_kitql/graphqlStores'

const seoProps = {
	title: 'Blogs ',
	metadescription: 'My Blogs'
}

export let err

$: blog = $KQL_Blog.data.blog
</script>

<SEO {...seoProps} />

{#if blog}
	<div class="min-h-screen text-gray-800">
		<div class="container mx-auto max-w-4xl p-3 py-5 sm:p-10">
			<div class="mb-5 h-96 w-full overflow-hidden rounded-3xl border sm:mb-10">
				<ImageLoader src="{blog.imgCdn}" alt=" " class="h-full w-full object-cover" />
			</div>

			<h1 class="mb-2 text-2xl font-bold sm:text-3xl">
				{blog.title}
			</h1>

			<p class="mb-5 text-sm text-gray-500">
				{@html blog.excerpt}
			</p>

			<div class="mb-5 sm:mb-10">
				{@html blog.content}
			</div>

			<h6 class="text-right text-xs text-gray-500">
				Posted
				<TimeAgo date="{blog.updatedAt}" />
			</h6>
		</div>
	</div>
{/if}
