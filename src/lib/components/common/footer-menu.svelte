<script lang="ts">
	const { items } = $props()
</script>

<div class="md:min-w-[40%]">
	<div class="intra-gap grid grid-cols-2 sm:grid-cols-3">
		{#each items as item}
			<div>
				<h1 class="text-black-200 text-lg font-semibold">{item?.name}</h1>
				{#if item?.items?.length > 0}
					<ul class="intra-pt">
						{#each item.items as child}
							<li>
								{#if child.link}
									<a
										href={child.link || '#'}
										target="_blank"
										class="text-sm text-gray-400 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-900"
										rel="noopener noreferrer"
									>
										{child.name}
									</a>
								{:else}
									<span class="text-sm text-gray-400">{child.name}</span>
								{/if}
							</li>
						{/each}
					</ul>
				{:else}
					<p class="text-sm text-gray-400">No links available</p>
				{/if}
			</div>
		{/each}
	</div>
</div>
