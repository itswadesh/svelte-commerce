<script lang="ts">
	const { items } = $props()
</script>

<div class="flex-1">
	<div class="grid grid-cols-2 gap-8 sm:grid-cols-3">
		{#each items as item}
			<div class="flex flex-col gap-4">
				<h4 class="text-xs font-bold uppercase tracking-widest text-foreground">{item?.name}</h4>
				{#if item?.items?.length > 0}
					<ul class="flex flex-col gap-0">
						{#each item.items as child}
							<li>
								{#if child.link}
									<a
										href={child.link || '#'}
										class="text-sm text-muted-foreground transition-colors hover:text-foreground"
									>
										{child.name}
									</a>
								{:else}
									<span class="text-sm text-muted-foreground">{child.name}</span>
								{/if}
							</li>
						{/each}
					</ul>
				{/if}
			</div>
		{/each}
	</div>
</div>
