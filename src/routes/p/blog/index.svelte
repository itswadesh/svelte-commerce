<script context="module">
export async function load({ url, params, fetch, session, context }) {
	let search, sort, query, blogs, err, page, count
	try {
		search = url.searchParams.get('search')
		page = url.searchParams.get('page') || 1
		sort = url.searchParams.get('sort')
		query = url.searchParams.toString()
		GQL_blogs.fetch({ fetch, variables: { search, sort, page } })
		// count = res?.count
		// console.log(res)
	} catch (e) {
		err = e
		toast(e, 'error')
	} finally {
	}
	return {
		props: { err, blogs, page, count }
	}
}
</script>

<script>
import SEO from '$lib/components/SEO/index.svelte'
import { toast } from '$lib/util'
import ImageLoader from '$lib/components/Image/ImageLoader.svelte'
import TimeAgo from 'svelte-timeago'
import Errors from '$lib/components/alerts/Errors.svelte'
import { GQL_blogs } from '$houdini'
import Pagination from './../../search/_Pagination.svelte'

const seoProps = {
	title: 'Blogs ',
	metadescription: 'My Blogs'
}

export let blogs, page, count
</script>

<SEO {...seoProps} />

<div class="min-h-screen bg-white">
	<div class="container mx-auto max-w-7xl p-8 sm:p-10">
		<div class="mx-auto mb-5 max-w-max text-gray-800 sm:mb-10">
			<h1 class="mb-1 text-xl font-bold text-primary-500 sm:text-2xl lg:text-3xl">Blogs</h1>

			<hr class="w-10 border-t-4 border-primary-500" />
		</div>

		{#if $GQL_blogs?.isFetching}
			Loading...
		{:else if $GQL_blogs?.errors}
			<Errors errors="{$GQL_blogs.errors}" />
		{:else if $GQL_blogs.data?.blogs.count > 0}
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
				{#each blogs as b, i}
					<a
						href="/p/blog/{b.id}"
						class="group col-span-1 -rotate-6 transform rounded-md bg-gray-100 p-4 shadow-md">
						<div class="mb-4 h-48 w-full overflow-hidden rounded-md">
							<ImageLoader
								src="{b.img}"
								alt=""
								class="h-full w-full transform object-cover transition duration-300 group-hover:scale-105" />
						</div>

						<div>
							<h6 class="text-lg font-semibold text-primary-500 first-letter:uppercase">
								{b.title}
							</h6>

							<p class="mb-1 text-sm text-gray-500 first-letter:uppercase">
								{b.content}
							</p>

							<h6 class="text-right text-xs text-gray-500">
								<TimeAgo date="{b.updatedAt}" />
							</h6>
						</div>
					</a>
				{/each}
			</div>

			<Pagination count="{Math.ceil(count / 40)}" current="{+page}" />
		{:else}
			<div class="h-rem-empty flex flex-col items-center justify-center text-center">
				<div>
					<ImageLoader
						src="/no/empty-blog.svg"
						alt="empty blog"
						class="mb-10 h-80 object-contain" />
				</div>

				<span class="mb-3 text-xl font-medium md:text-3xl">Empty Blogs!!</span>

				<span class="mb-5 text-xs">
					We didn't find any blog, Add a blog by clicking the plus icon
				</span>
			</div>
		{/if}
	</div>
</div>
