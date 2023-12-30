<script>
import { date } from '$lib/utils'
import { LazyImg } from '$lib/components'
import { page } from '$app/stores'
import SEO from '$lib/components/SEO/index.svelte'
import userEmptyProfile from '$lib/assets/user-empty-profile.png'
import BackButton from '$lib/ui/BackButton.svelte'

export let data

let seoProps = {
	title: `Blog Detail`,
	description: `Blog Detail`
}
</script>

<SEO {...seoProps} />

<div class="min-h-screen px-3 py-5 sm:p-10">
	<div class="container mx-auto max-w-6xl">
		<BackButton to="/blogs" class="hidden sm:block mb-5" />

		<div class="grid grid-cols-1 gap-10 lg:grid-cols-5">
			<section class="col-span-1 lg:col-span-3">
				{#if data.blog}
					<div class="flex flex-col gap-5">
						<h1>
							{data.blog?.title}
						</h1>

						{#if data.blog?.user}
							<div class="flex items-center gap-5 sm:gap-10">
								<div class="h-10 w-10 overflow-hidden rounded-full border-2 sm:h-16 sm:w-16">
									{#if data.blog?.user?.avatar}
										<LazyImg
											src="{data.blog?.user?.avatar}"
											alt=" "
											height="320"
											class="h-full w-full object-cover rounded-full" />
									{:else}
										<img
											src="{userEmptyProfile}"
											alt=""
											class="h-full w-full object-cover text-xs" />
									{/if}
								</div>

								<div class="flex-1">
									{#if data.blog.user?.firstName || data.blog.user?.lastName}
										<h6 class="truncate capitalize">
											{#if data.blog.user?.firstName}
												{data.blog.user?.firstName}
											{/if}

											{#if data.blog.user?.lastName}
												{data.blog.user?.lastName}
											{/if}
										</h6>
									{/if}

									<p>{date(data.blog.createdAt)}</p>
								</div>
							</div>
						{/if}

						{#if data.blog?.img}
							<LazyImg
								src="{data.blog?.img}"
								height="320"
								alt=""
								class="aspect-video w-full object-cover object-center rounded" />
						{/if}

						{#if data.blog?.content}
							<div class="prose max-w-none">
								{@html data.blog?.content}
							</div>
						{/if}

						{#if data.blog?.tags?.length}
							<ul class="flex flex-wrap items-center gap-1">
								{#each data.blog?.tags as tag}
									{#if tag.name}
										<li
											class="max-w-max rounded-full bg-zinc-100 py-1 px-3 text-center text-xs font-semibold uppercase text-zinc-500 transition duration-300 hover:bg-zinc-200 hover:text-zinc-800">
											# {tag.name}
										</li>
									{/if}
								{/each}
							</ul>
						{/if}
					</div>
				{:else}
					<div class="bg-zinc-200 p-5 text-center rounded">
						<p>Oops! Blog not found.</p>
					</div>
				{/if}
			</section>

			{#if data.latestBlogs?.length}
				<section class="col-span-1 lg:col-span-2">
					<h3 class="mb-5 underline">Latest Blogs</h3>

					<ul class="flex flex-col divide-y">
						{#each data.latestBlogs as blog, index}
							<li>
								<a
									href="/blogs/{blog.slug}"
									aria-label="Click to visit blog details page"
									data-sveltekit-preload-data
									class="group flex items-start gap-4 py-4">
									<div class="h-16 w-24 overflow-hidden rounded border">
										{#if blog.img}
											<LazyImg
												src="{blog.img}"
												width="96"
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

									<div class="flex flex-1 flex-col items-start gap-1 text-xs text-zinc-400">
										<h6 class="line-clamp-2 text-zinc-800 group-hover:underline">
											{blog.title}
										</h6>

										{#if blog?.tags?.length}
											<ul class="flex flex-wrap items-center gap-1">
												{#each blog?.tags as tag}
													{#if tag.name}
														<li
															class="max-w-max rounded-full bg-zinc-100 py-0.5 px-2 text-center text-xs font-semibold uppercase text-zinc-500 transition duration-300 hover:bg-zinc-200 hover:text-zinc-800">
															# {tag.name}
														</li>
													{/if}
												{/each}
											</ul>
										{/if}

										<span>
											{date(blog.createdAt)}
										</span>
									</div>
								</a>
							</li>
						{/each}
					</ul>
				</section>
			{/if}
		</div>
	</div>
</div>
