<script context="module">
export async function load({ url, params, fetch, session, context }) {
	let blog, err
	try {
		const blog = (await KQL_Blog.query({ fetch, variables: { id: params.id } })).data?.blog
		// console.log(res)
	} catch (e) {
		err = e
		toast(e, 'error')
	} finally {
	}
	return {
		props: { err, blog }
	}
}
</script>

<script>
import SEO from '$lib/components/SEO/index.svelte'
import { toast } from './../../../util'
import ImageLoader from '$lib/components/Image/ImageLoader.svelte'
import TimeAgo from 'svelte-timeago'
import { KQL_Blog, KQL_Blogs } from '$lib/graphql/_kitql/graphqlStores'

const seoProps = {
	title: 'Blogs ',
	metadescription: 'My Blogs'
}

export let err, blog
</script>

<SEO {...seoProps} />

{#if blog}
	<div class="min-h-screen text-gray-800">
		<div class="container mx-auto max-w-4xl p-3 py-5 sm:p-10">
			<div class="mb-5 sm:mb-10 h-96 w-full rounded-3xl border overflow-hidden">
				<ImageLoader src="{blog.imgCdn}" alt=" " class="h-full w-full object-cover" />
			</div>

			<h1 class="mb-2 text-2xl sm:text-3xl font-bold">
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
