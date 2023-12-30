<style>
img {
	opacity: 1;
	animation-name: fadeInOpacity;
	animation-iteration-count: 1;
	animation-timing-function: ease-in;
	animation-duration: 0.3s;
}

@keyframes fadeInOpacity {
	0% {
		opacity: 0;
	}
	100% {
		opacity: 1;
	}
}
.zoom {
	overflow: hidden;
}
.zoom img {
	transition: transform 0.7s;
}
.zoom:hover img {
	transform: scale(1.035);
}
</style>

<script>
import { date } from '$lib/utils'
import { page } from '$app/stores'
import LazyImg from '$lib/components/Image/LazyImg.svelte'
import userEmptyProfile from '$lib/assets/user-empty-profile.png'

export let blog = {}
</script>

{#if blog && blog.active}
	<a
		href="/blogs/{blog.slug}"
		aria-label="Click to visit blog details page"
		class="group w-full overflow-hidden rounded border shadow-md transition duration-300 hover:shadow-xl">
		<div class="overflow-hidden">
			{#if blog.img}
				<LazyImg
					src="{blog.img}"
					height="320"
					alt=""
					class="aspect-video w-full object-cover object-center rounded-t transform transition duration-1000 group-hover:scale-105" />
			{:else}
				<div class="aspect-video h-auto w-full p-5">
					<img
						src="{$page.data.store?.logo}"
						alt=""
						class="h-full w-full transform object-cover object-center transition duration-1000 group-hover:scale-105" />
				</div>
			{/if}
		</div>

		<hr />

		<div class="flex flex-col justify-between p-4">
			{#if blog?.tags?.length}
				<ul class="flex flex-wrap items-center gap-1">
					{#each blog?.tags as tag}
						{#if tag.name}
							<li
								class="max-w-max rounded-full bg-zinc-100 py-1 px-3 text-center text-xs font-semibold uppercase text-zinc-500 transition duration-300 hover:bg-zinc-200 hover:text-zinc-800">
								# {tag.name}
							</li>
						{/if}
					{/each}
				</ul>
			{/if}

			<h6 class="mb-4">{blog.title}</h6>

			<div class="mb-4 flex items-start gap-2">
				<div>
					{#if blog?.user?.avatar}
						<LazyImg
							src="{blog?.user?.avatar}"
							alt=" "
							height="320"
							class="h-10 w-10 object-cover rounded-full" />
					{:else}
						<img
							src="{userEmptyProfile}"
							alt=""
							class="h-10 w-10 object-cover rounded-full border-2 border-zinc-500 text-xs" />
					{/if}
				</div>

				<div class="flex-1">
					{#if blog.user?.firstName || blog.user?.lastName}
						<h6 class="truncate capitalize">
							{#if blog.user?.firstName}
								{blog.user?.firstName}
							{/if}

							{#if blog.user?.lastName}
								{blog.user?.lastName}
							{/if}
						</h6>
					{/if}

					<p>{date(blog.createdAt)}</p>
				</div>
			</div>

			<div
				class="max-w-max bg-zinc-200 py-1 px-3 text-sm font-semibold text-zinc-500 transition duration-300 group-hover:bg-primary-500 group-hover:text-white">
				Read More
			</div>
		</div>
	</a>
{/if}
