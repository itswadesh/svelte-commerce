<script>
import { Deals } from '$lib/theme-config'

export let data = {}
</script>

{#await data.streamed.collections}
	<div class="flex flex-wrap w-[98vw] items-start justify-start gap-3 overflow-x-auto">
		{#each { length: 8 } as _}
			<div class="w-52 h-60 animate-pulse rounded bg-zinc-200"></div>
		{/each}
	</div>
{:then collections}
	{#if collections.data?.length > 0}
		{#each collections.data as collection}
			<div class="mb-5 sm:mb-10">
				<h2
					class="p-3 py-5 text-center font-serif text-xl font-medium tracking-wider sm:px-10 sm:text-2xl md:py-10 md:text-3xl xl:text-4xl uppercase">
					{collection.name}
				</h2>

				<Deals deal="{collection}" />
			</div>
		{/each}
	{/if}
{/await}
