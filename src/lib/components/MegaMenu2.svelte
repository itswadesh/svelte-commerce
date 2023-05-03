<script lang="ts">
import { page } from '$app/stores'
import { fly } from 'svelte/transition'

let showDropdownMegaMenu = []
</script>

{#if $page.data.megamenu?.length}
	<div class="hidden lg:flex">
		<ul class="flex flex-row items-center justify-center font-semibold uppercase tracking-wide">
			{#each $page.data.megamenu as m, mx}
				<li
					class="relative"
					on:mouseenter="{() => (showDropdownMegaMenu[mx] = true)}"
					on:mouseleave="{() => (showDropdownMegaMenu[mx] = false)}">
					<a
						href="/{m.slug}"
						aria-label="Click to visit this page"
						class="flex h-20 items-center gap-1 border-b-4 px-4 uppercase focus:outline-none
						{showDropdownMegaMenu[mx] ? 'border-primary-500' : 'border-white'}">
						<span>{m.name}</span>

						{#if m.children?.length}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="w-5"
								viewBox="0 0 20 20"
								fill="currentColor">
								<path
									fill-rule="evenodd"
									d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
									clip-rule="evenodd"></path>
							</svg>
						{/if}

						{#if m.new}
							<span
								class="absolute top-5 -right-3 rounded bg-white text-[0.6rem] font-bold tracking-wider text-accent-900">
								NEW
							</span>
						{/if}
					</a>

					{#if m.children?.length}
						{#if showDropdownMegaMenu[mx]}
							<ul
								transition:fly="{{ y: 5, duration: 700 }}"
								class="absolute top-20 left-0 z-[100] flex min-w-max flex-col rounded-b border bg-white p-2 text-sm uppercase shadow-inner">
								{#each m.children as c}
									<li class="h-auto w-full flex-1">
										<a href="{c.link}" aria-label="Click to visit this page">
											<h6
												class="w-full cursor-pointer rounded py-2 px-4 text-left transition duration-300 focus:outline-none hover:bg-primary-50">
												{c.name}
											</h6>
										</a>
									</li>
								{/each}
							</ul>
						{/if}
					{/if}
				</li>
			{/each}
		</ul>
	</div>
{/if}
