<script lang="ts">
	const { items } = $props()
</script>

<div class="flex-1">
	<div class="grid grid-cols-2 gap-8 sm:grid-cols-3">
		{#each items as item}
			<div class="flex flex-col gap-3">
				<!-- Backend menu groups can have no name; an empty heading is an axe empty-heading violation.
				     <h2>, not <h4>: on a legal page whose only other heading is the <h1>, an h4 here made the
				     outline jump two levels. The small uppercase look stays in the classes. -->
				{#if item?.name}
					<h2 class="text-xs font-bold uppercase tracking-widest text-foreground">{item.name}</h2>
				{/if}
				{#if item?.items?.length > 0}
					<!-- `inline-flex` with a minimum height, not a bare inline link. These sit in a list
					     rather than inside a sentence, so WCAG 2.2's inline exception does not apply and
					     an 18px-tall link fails the 24px target minimum this project targets. The row
					     gap absorbs the extra height, so the footer does not grow. -->
					<ul class="flex flex-col">
						{#each item.items as child}
							<li>
								{#if child.link}
									<a
										href={child.link || '#'}
										class="inline-flex min-h-[32px] items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
									>
										{child.name}
									</a>
								{:else}
									<span class="inline-flex min-h-[32px] items-center text-sm text-muted-foreground">{child.name}</span>
								{/if}
							</li>
						{/each}
					</ul>
				{/if}
			</div>
		{/each}
	</div>
</div>
