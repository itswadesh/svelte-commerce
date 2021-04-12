<script>
import { date } from '$lib/utils'
import { page } from '$app/stores'
import LazyImg from '$lib/components/Image/LazyImg.svelte'
import SEO from '$lib/components/SEO/index.svelte'
import userEmptyProfile from '$lib/assets/user-empty-profile.png'

export let data

let seoProps = {
	title: `Blog Detail`,
	description: `Blog Detail`
}
</script>

<SEO {...seoProps} />

{#if data.blog}
	<section class="min-h-screen px-3 py-5 sm:p-10">
		<div class="container mx-auto grid grid-cols-1 gap-10 lg:grid-cols-5">
			<div class="col-span-1 p-4 pt-0 lg:col-span-3">
				<h1 class="mb-5 text-2xl font-black leading-tight sm:mb-10 sm:text-4xl md:text-5xl">
					{data.blog?.title}
				</h1>

				{#if data.blog?.user}
					<div class="mb-5 flex items-center gap-5 sm:mb-10 sm:gap-10">
						<div class="h-10 w-10 overflow-hidden rounded-full border-2 sm:h-16 sm:w-16">
							{#if data.blog?.user?.avatar}
								<img src="{data.blog?.user?.avatar}" alt=" " class="h-full w-full text-xs" />
							{:else}
								<img src="{userEmptyProfile}" alt="" class="h-full w-full text-xs" />
							{/if}
						</div>

						<div class="flex-1">
							{#if data.blog.user?.firstName || data.blog.user?.lastName}
								<h6 class="truncate text-lg font-semibold capitalize">
									{#if data.blog.user?.firstName}
										{data.blog.user?.firstName}
									{/if}

									{#if data.blog.user?.lastName}
										{data.blog.user?.lastName}
									{/if}
								</h6>
							{/if}

							<p class="text-zinc-500">{date(data.blog.createdAt)}</p>
						</div>
					</div>
				{/if}

				<div class="mb-5 sm:mb-10">
					{#if data.blog?.img}
						<div class="mb-5 sm:mb-10">
							<LazyImg
								aspect_ratio="2x1"
								height="200"
								class="h-full w-full rounded object-contain object-top"
								src="{data.blog?.img}"
								alt="" />
						</div>
					{/if}

					<div class="prose mb-5 max-w-none text-justify sm:mb-10">
						{@html data.blog?.content}
					</div>

					{#if data.blog?.tags?.length}
						<ul class="flex flex-wrap gap-2 sm:gap-4">
							{#each data.blog?.tags as f}
								<button
									class="rounded-full border bg-zinc-100 px-4 py-2 text-xs shadow hover:bg-zinc-200">
									{f}
								</button>
							{/each}
						</ul>
					{/if}
				</div>
			</div>

			{#if data.latestBlogs?.count > 0}
				<div class="col-span-1 lg:col-span-2">
					<h3 class="mb-1 text-3xl font-bold underline sm:mb-6">Latest Blogs</h3>

					<ul class="flex flex-col divide-y">
						{#each data.latestBlogs?.data as blog, index}
							<li>
								<a
									href="/blogs/{blog._id}"
									aria-label="Click to route blog details page"
									data-sveltekit-preload-data
									class="group flex items-start gap-4 py-4">
									<div class="h-16 w-24 overflow-hidden rounded border">
										{#if blog.img}
											<LazyImg
												src="{blog.img}"
												height="64"
												alt=""
												class="h-16 w-full object-cover object-center" />
										{:else}
											<img
												src="{$page.data.store?.logo}"
												alt=""
												class="h-16 w-24 object-contain object-center p-2" />
										{/if}
									</div>

									<div class="flex flex-1 flex-col gap-1 text-xs text-zinc-400">
										<h6 class="text-base font-semibold text-zinc-800 group-hover:underline">
											{blog.title}
										</h6>

										{#if blog.tags?.length}
											<ul class="flex flex-wrap items-center gap-1">
												{#each blog.tags as tag}
													{#if tag.name && tag.name !== 'SCHOOL BOARDS'}
														<li>
															<a
																href="/blog/{tag.slug}"
																aria-label="{tag.name || '##'}"
																class="block max-w-max rounded bg-zinc-100 py-0.5 px-2 text-center text-xs font-semibold uppercase text-zinc-500 transition duration-300 hover:bg-zinc-200 hover:text-zinc-800">
																{tag.name}
															</a>
														</li>
													{/if}
												{/each}
											</ul>
										{/if}

										<p>
											{date(blog.createdAt)}
										</p>
									</div>
								</a>
							</li>
						{/each}
					</ul>
				</div>
			{/if}
		</div>
	</section>
{/if}
