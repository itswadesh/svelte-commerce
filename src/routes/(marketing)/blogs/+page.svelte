<!-- <style>
.zinc-pattern {
	background: linear-gradient(120deg, #b2b2b2, #f2f2f2, #b2b2b2, #f2f2f2, #b2b2b2);
}
</style> -->

<script>
import { browser } from '$app/environment'
import { constructURL2 } from '$lib/utils'
import { goto } from '$app/navigation'
import { Pagination } from '$lib/components'
import { PrimaryButton } from '$lib/ui'
import blogBackground from '$lib/assets/blogs/white-gray-blogs-background.png'
import BlogPostGrid from './_BlogPostGrid.svelte'
import emptyBlog from '$lib/assets/no/empty-blog.svg'
import SEO from '$lib/components/SEO/index.svelte'

export let data
// console.log('zzzzzzzzzzzzzzzzzz', data)

const seoProps = {
	title: ' Blog & Collections',
	meta: [
		{
			hid: 'description',
			name: 'description',
			content: 'Comes with most essential ecommerce features pre-built. Go live under a week'
		},
		{
			hid: 'keywords',
			name: 'keywords',
			property: 'keywords',
			content:
				'javasctipt ecommerce, image optimization, lazy loading, seo, fast ,search engine optimization, easy, headless, authentication, cart & checkout,tailwindcss, server rendered, proxy + api integrated, animations, stores, lazy loading, loading indicators, carousel, instant search, faceted filters'
		},

		// OpenGraph data
		{
			hid: 'og:title',
			name: 'og_title',
			property: 'og:title',
			content: 'Blog & Collections'
		},
		{
			hid: 'og:description',
			name: 'og_description',
			property: 'og:description',
			content: 'Comes with most essential ecommerce features pre-built. Go live under a week'
		},

		// Twitter
		{
			name: 'twitter:title',
			content: 'Comes with most essential ecommerce features pre-built. Go live under a week'
		},
		{
			name: 'twitter:description',
			content: 'Comes with most essential features pre-built. Go live under a week'
		}
	]
}

function scrollToTop() {
	if (browser) {
		window.scroll({
			behavior: 'smooth',
			left: 0,
			top: 0
		})
	}
}

function changePage(e, p) {
	let fl = { ...data.query }
	delete fl?.page
	const url = constructURL2('/stores', fl)
	let page = parseInt(e.detail || 1)
	goto(`${url}page=${page}`)
	scrollToTop()
}
</script>

<SEO {...seoProps} />

<main class="min-h-screen">
	{#if data?.blogs?.count}
		<div>
			<div
				class="mb-5 border-b shadow sm:mb-10 bg-cover bg-left"
				style="background-image: url({blogBackground});">
				<div class="container mx-auto p-4 md:p-10">
					<h1 class="my-2 items-center">
						<span class="text-3xl font-bold">{data?.blogs?.count}</span>

						<span>
							awesome {#if data?.blogs?.count > 1} articles collection {:else} article {/if}
						</span>
					</h1>

					<p>Covering ecommerce, business solutions & technology advancements</p>
				</div>
			</div>

			<div class="container mx-auto px-4 md:px-10">
				<div class="grid grid-cols-1 gap-2 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
					{#each data?.blogs?.data as blog}
						<BlogPostGrid blog="{blog}" />
					{/each}
				</div>
			</div>

			<Pagination
				count="{Math.ceil((data.blogs?.count || 1) / data.blogs?.pageSize)}"
				current="{data?.currentPage || 1}"
				on:change="{changePage}" />
		</div>
	{:else}
		<div class="flex items-center justify-center" style="height: 60vh;">
			<div class="m-10 flex flex-col items-center justify-center text-center">
				<h1 class="mb-10 capitalize">Oops!!, No blog found</h1>

				<div class="mb-5">
					<img
						src="{emptyBlog}"
						alt="no data available"
						class="h-60 w-auto object-contain text-xs" />
				</div>

				<p class="mb-5 text-center">No data found</p>

				<PrimaryButton class="text-sm" on:click="{() => goto('/')}">Back to Home</PrimaryButton>
			</div>
		</div>
	{/if}
</main>
