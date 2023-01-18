<style>
.gray-pattern {
	background: linear-gradient(120deg, #b2b2b2, #f2f2f2, #b2b2b2, #f2f2f2, #b2b2b2);
}
</style>

<script>
import { browser } from '$app/environment'
import { constructURL2 } from '$lib/utils'
import { goto } from '$app/navigation'
import BlogPostGrid from './_BlogPostGrid.svelte'
import Pagination from '$lib/components/Pagination.svelte'
import SEO from '$lib/components/SEO/index.svelte'

export let data

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
	delete fl.page
	const url = constructURL2('/stores', fl)
	let page = parseInt(e.detail || 1)
	goto(`${url}page=${page}`)
	scrollToTop()
}
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
</script>

<SEO {...seoProps} />

{#if data?.blogs}
	<main class="min-h-screen">
		<div class="gray-pattern mb-5 border-b shadow-md sm:mb-10">
			<div class="container mx-auto p-4 md:p-10">
				<h1 class="font-hairline my-2 items-center text-xl text-gray-700">
					<span class="text-3xl font-bold">{data.blogs?.length}</span>

					<span>awesome collection articles</span>
				</h1>

				<p class="text-sm font-light">
					Covering ecommerce, business solutions & technology advancements
				</p>
			</div>
		</div>

		<div class="container mx-auto px-4 md:px-10">
			<div class="grid grid-cols-1 gap-2 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
				{#each data.blogs as blog}
					<BlogPostGrid blog="{blog}" />
				{/each}
			</div>
		</div>

		<Pagination
			count="{Math.ceil(data.blogs.length)}"
			current="{parseInt(data?.page || 1)}"
			on:change="{changePage}" />
	</main>
{/if}
