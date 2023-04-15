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
import userEmptyProfile from '$lib/assets/user-empty-profile.png'

export let blog = {}
</script>

{#if blog}
	<a
		href="/blogs/{blog._id}"
		aria-label="Click to route blog details page"
		class="group w-full overflow-hidden rounded border shadow-md transition duration-300 hover:shadow-xl">
		<div class="overflow-hidden">
			{#if blog.img}
				<img
					src="{blog.img}"
					alt=""
					class="aspect-video w-full transform object-contain object-center transition duration-1000 group-hover:scale-105" />
			{:else}
				<div class="aspect-video h-auto w-full p-5">
					<img
						src="{$page.data.store?.logo}"
						alt=""
						class="h-full w-full transform object-contain object-center transition duration-1000 group-hover:scale-105" />
				</div>
			{/if}
		</div>

		<hr />

		<div class="flex flex-col justify-between p-4">
			{#if blog.tags?.length}
				<ul class="mb-2 flex flex-wrap items-center gap-2">
					{#each blog.tags as t}
						<li
							class="rounded-full bg-zinc-100 py-1 px-3 text-xs font-semibold uppercase text-zinc-400">
							{t}
						</li>
					{/each}
				</ul>
			{/if}

			<h6 class="mb-4 text-lg font-semibold">{blog.title}</h6>

			<div class="mb-4 flex items-start gap-2">
				<div>
					{#if blog?.user?.avatar}
						<img
							src="{blog?.user?.avatar}"
							alt=" "
							class="h-10 w-10 rounded-full border-2 border-primary-500 text-xs" />
					{:else}
						<img
							src="{userEmptyProfile}"
							alt=""
							class="h-10 w-10 rounded-full border-2 border-zinc-500 text-xs" />
					{/if}
				</div>

				<div class="flex-1">
					{#if blog.user?.firstName || blog.user?.lastName}
						<h6 class="truncate text-sm font-semibold capitalize">
							{#if blog.user?.firstName}
								{blog.user?.firstName}
							{/if}

							{#if blog.user?.lastName}
								{blog.user?.lastName}
							{/if}
						</h6>
					{/if}

					<p class="text-xs text-zinc-500">{date(blog.createdAt)}</p>
				</div>
			</div>

			<div
				class="max-w-max bg-zinc-200 py-1 px-3 text-sm font-semibold text-zinc-500 transition duration-300 group-hover:bg-primary-500 group-hover:text-white">
				Read More
			</div>
		</div>
	</a>
{/if}
