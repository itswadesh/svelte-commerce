<script lang="ts">
	import { taxonomy } from '$lib/core/connectors/taxonomy'
	import Canonical from '$lib/components/seo/canonical.svelte'
	import EmptyImage from '$lib/core/components/image/empty-image.svelte'
	import { ChevronRight } from '@lucide/svelte'

	let { data } = $props()
</script>

<svelte:head>
	<title>{taxonomy.many}</title>
</svelte:head>
<div class="container max-w-6xl px-4 py-4 md:py-10">
	<h1 class="mb-6 text-xl font-medium md:text-2xl">Shop by {taxonomy.one}</h1>

	<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
		<!-- The card used to be one link to the parent, with the first two subcategories as plain text
		     inside it: "Dresses" led to /women, and the rest were not shown at all. The parent's name now
		     stretches its link over the card, and every subcategory is a link of its own above it. -->
		{#each data.categories as category (category.id ?? category.slug)}
			<div
				class="group relative flex flex-col overflow-hidden rounded-lg border bg-card transition-[border-color,box-shadow] duration-fast ease-standard focus-within:border-border-strong hover:border-border-strong hover:shadow-sm"
			>
				<div class="relative aspect-square overflow-hidden bg-muted">
					{#if category.img}
						<img
							src={category.img}
							alt=""
							loading="lazy"
							decoding="async"
							class="h-full w-full object-cover transition-transform duration-emphasis ease-standard motion-safe:group-hover:scale-105"
						/>
					{:else}
						<!-- `+page.server.ts` blanks the core loader's guessed litekart.in S3 URLs, so a
						     category with no thumbnail of its own lands here rather than on a broken image. -->
						<EmptyImage class="h-full w-full" />
					{/if}
				</div>

				<div class="flex flex-1 flex-col p-3">
					<h2 class="font-medium">
						<a href="/{category.slug}" class="flex min-h-11 items-center gap-0.5 after:absolute after:inset-0">
							{category.name}
							<ChevronRight class="size-4 shrink-0 text-muted-foreground transition-transform duration-fast ease-standard motion-safe:group-hover:translate-x-0.5" aria-hidden="true" />
						</a>
					</h2>

					{#if category.children?.length}
						<ul class="mt-1 flex flex-wrap gap-1.5" aria-label="{category.name} {taxonomy.many.toLowerCase()}">
							{#each category.children as child (child.id ?? child.slug)}
								<li>
									<a
										href="/{child.slug}"
										class="relative z-10 inline-flex min-h-11 items-center rounded-full border bg-background px-3 text-xs text-muted-foreground transition-[color,border-color,transform] duration-fast ease-standard hover:border-border-strong hover:text-foreground active:scale-95 motion-reduce:active:scale-100"
									>
										{child.name}
									</a>
								</li>
							{/each}
						</ul>
					{/if}
				</div>
			</div>
		{/each}
	</div>
</div>

<Canonical />
