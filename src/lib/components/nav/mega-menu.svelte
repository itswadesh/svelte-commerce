<script lang="ts">
	import { MegaMenuRenderer } from '$lib/core/composables/index.js'
	import { fade } from 'svelte/transition'
</script>

<MegaMenuRenderer>
	{#snippet content({ menuItems, toggleMenuItemChildren, selectedCategory, openChildMenu, closeChildMenu })}
		{#if menuItems?.length}
			<ul class="flex max-w-[65vw] flex-row items-center overflow-x-auto scrollbar-none gap-2">
				{#each menuItems as category, index}
					<li
						class="hoverable"
						onmousemove={() => {
              openChildMenu(category.name, index)
						}}
						onmouseleave={() => {
              closeChildMenu(index, true)
						}}
					>
						<a
							href={category.link || '/' + category.slug}
							aria-label="Visit {category.name}"
							class="relative flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap px-4 py-3 text-xs font-bold uppercase tracking-widest text-gray-500 transition-all duration-300 hover:text-primary active:scale-95
								{selectedCategory === category.name ? 'text-primary after:scale-x-100' : 'after:scale-x-0'}
								after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-primary after:transition-transform after:duration-300 after:ease-out-expo hover:after:scale-x-100"
							style="font-family: 'Montserrat', sans-serif;"
							onclick={() => closeChildMenu(index, false)}
						>
							<span>{category.name}</span>

							{#if category.children?.length}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									class="h-3.5 w-3.5 shrink-0 transition-transform duration-300 ease-out-expo
              {selectedCategory === category.name ? '-rotate-180 transform' : ''}"
								>
									<path
										fill-rule="evenodd"
										d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
										clip-rule="evenodd"
									></path>
								</svg>
							{/if}
						</a>

						{#if toggleMenuItemChildren[index] && category.children?.length}
							<div class="mega-menu absolute left-1/2 top-full -translate-x-1/2 w-[90vw] max-w-screen-xl overflow-hidden rounded-b-xl border-x border-b border-gray-100 bg-white shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] transition-all duration-500 ease-out-expo">
								<div class="grid grid-cols-4 gap-8 p-10">
									{#each category.children as c}
										<div class="flex flex-col gap-5">
											<a
												href={c.link || '/' + c.slug}
												class="text-xs font-black uppercase tracking-[0.2em] text-primary transition-all hover:translate-x-1"
												style="font-family: 'Montserrat', sans-serif;"
												onclick={() => closeChildMenu(index, false)}
											>
												{c.name}
											</a>

											{#if c && c.children}
												<ul class="flex flex-col gap-2.5">
													{#each c.children as c1}
														<li>
															<a
																href={c1.link || '/' + c1.slug}
																class="text-[13px] font-medium text-gray-500 transition-all hover:text-primary hover:translate-x-1 block"
																onclick={() => closeChildMenu(index, false)}
															>
																{c1.name}
															</a>
														</li>
													{/each}
												</ul>
											{/if}
										</div>
									{/each}
								</div>
								
								<div class="bg-gray-50 px-10 py-4 border-t border-gray-100">
									<a href={category.link || '/' + category.slug} class="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 hover:text-primary transition-colors">
										View all {category.name}
									</a>
								</div>
							</div>
						{/if}
					</li>
				{/each}
			</ul>
		{/if}
	{/snippet}
</MegaMenuRenderer>

<style>
	.mega-menu {
		visibility: hidden;
		opacity: 0;
		transform: translate(-50%, 10px);
		z-index: 9999;
	}

	.hoverable:hover .mega-menu {
		visibility: visible;
		opacity: 1;
		transform: translate(-50%, 0);
	}

	.hoverable {
		position: static;
	}
</style>
