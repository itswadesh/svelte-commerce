<style>
.link-underline {
	border-bottom-width: 0;
	background-image: linear-gradient(transparent, transparent),
		linear-gradient(rgb(249 250 251), rgb(249 250 251));
	background-size: 0 1px;
	background-position: 0 100%;
	background-repeat: no-repeat;
	transition: background-size 0.5s ease-in-out;
}

.link-underline-gray {
	background-image: linear-gradient(transparent, transparent),
		linear-gradient(rgb(107 114 128), rgb(107 114 128));
}

.link-underline:hover {
	background-size: 100% 1px;
	background-position: 0 100%;
}
</style>

<script>
// import { getMegamenuFromStore } from '$lib/store/megamenu-old'
import { browser } from '$app/environment'
import { CategoryService } from '$lib/services'
import { fly } from 'svelte/transition'
import { navigateToProperPath, toast } from '$lib/utils'
import { onMount } from 'svelte'
import { page } from '$app/stores'

export let height = 40

let megamenu = $page.data.megamenu || []
let selectedCategory = ''
let showFifthLevel = []
let showFirstLevel = false
let showFourthLevel = []
let showSecondLevel = []
let showSixthLevel = []
let showThirdLevel = []

onMount(() => {
	getMegaMenu()
})

async function getMegaMenu() {
	if (browser && $page.data.isDesktop) {
		try {
			// megamenu = await getMegamenuFromStore({
			// 	sid: null,
			// 	storeId: $page?.data?.store?.id,
			// 	isCors: $page?.data?.store?.isCors,
			// 	origin: $page.data.origin
			// })

			const localMegamenu = localStorage.getItem('megamenu')

			if (!!localMegamenu && localMegamenu !== 'undefined') {
				megamenu = JSON.parse(localMegamenu)
			} else {
				megamenu = await CategoryService.fetchMegamenuData({
					storeId: $page?.data?.store?.id,
					origin: $page.data.origin
				})
			}
		} catch (e) {
			toast(e, 'error')
		} finally {
		}
	} else {
	}
}
</script>

<div
	class="relative whitespace-pre-line max-w-max h-full"
	on:mouseenter="{() => (showFirstLevel = true)}"
	on:mouseleave="{() => (showFirstLevel = false)}">
	<div
		class="flex items-center justify-center gap-2 font-bold text-sm cursor-pointer bg-zinc-50 px-4 w-60 border-l border-r"
		style="height: {height}px;">
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
			<path
				fill-rule="evenodd"
				d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10zm0 5.25a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z"
				clip-rule="evenodd"></path>
		</svg>

		<span class="uppercase">Categories</span>
	</div>

	{#if showFirstLevel}
		<ul
			transition:fly="{{ y: 10, duration: 300 }}"
			class="absolute left-0 z-10 flex flex-col text-sm bg-white border divide-y shadow-md"
			style="top: {height}px;">
			{#each megamenu as m1, index1}
				<li
					class="relative hover:bg-primary-100"
					on:mouseenter="{() => (showSecondLevel[index1] = true)}"
					on:mouseleave="{() => (showSecondLevel[index1] = false)}">
					<a
						href="{navigateToProperPath(m1.link || m1.slug)}?sort=-updatedAt"
						class="flex items-center justify-between gap-2 p-2 transition duration-300 cursor-pointer w-60 link-underline link-underline-gray">
						<span>
							{m1.name}
						</span>

						{#if m1.children?.length}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
								fill="currentColor"
								class="shrink-0 w-4 h-4">
								<path
									fill-rule="evenodd"
									d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
									clip-rule="evenodd"></path>
							</svg>
						{/if}
					</a>

					{#if m1.children?.length && showSecondLevel[index1]}
						<ul
							transition:fly="{{ y: 10, duration: 300 }}"
							class="absolute top-0 z-10 flex flex-col text-sm bg-white border divide-y shadow-md w-60 left-60">
							{#each m1.children as m2, index2}
								<li
									class="relative hover:bg-primary-100"
									on:mouseenter="{() => (showThirdLevel[index2] = true)}"
									on:mouseleave="{() => (showThirdLevel[index2] = false)}">
									<a
										href="{navigateToProperPath(m2.link || m2.slug)}?sort=-updatedAt"
										class="flex items-center justify-between gap-2 p-2 transition duration-300 cursor-pointer w-60 link-underline link-underline-gray">
										<span>
											{m2.name}
										</span>

										{#if m2.children?.length}
											<svg
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 20 20"
												fill="currentColor"
												class="shrink-0 w-4 h-4">
												<path
													fill-rule="evenodd"
													d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
													clip-rule="evenodd"></path>
											</svg>
										{/if}
									</a>

									{#if m2.children?.length && showThirdLevel[index2]}
										<ul
											transition:fly="{{ y: 10, duration: 300 }}"
											class="absolute top-0 z-10 flex flex-col text-sm bg-white border divide-y shadow-md w-60 left-60">
											{#each m2.children as m3, index3}
												<li
													class="relative hover:bg-primary-100"
													on:mouseenter="{() => (showFourthLevel[index3] = true)}"
													on:mouseleave="{() => (showFourthLevel[index3] = false)}">
													<a
														href="{navigateToProperPath(m3.link || m3.slug)}?sort=-updatedAt"
														class="flex items-center justify-between gap-2 p-2 transition duration-300 cursor-pointer w-60 link-underline link-underline-gray">
														<span>
															{m3.name}
														</span>

														{#if m3.children?.length}
															<svg
																xmlns="http://www.w3.org/2000/svg"
																viewBox="0 0 20 20"
																fill="currentColor"
																class="shrink-0 w-4 h-4">
																<path
																	fill-rule="evenodd"
																	d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
																	clip-rule="evenodd"></path>
															</svg>
														{/if}
													</a>

													{#if m3.children?.length && showFourthLevel[index3]}
														<ul
															transition:fly="{{ y: 10, duration: 300 }}"
															class="absolute top-0 z-10 flex flex-col text-sm bg-white border divide-y shadow-md w-60 left-60">
															{#each m3.children as m4, index4}
																<li
																	class="relative hover:bg-primary-100"
																	on:mouseenter="{() => (showFifthLevel[index4] = true)}"
																	on:mouseleave="{() => (showFifthLevel[index4] = false)}">
																	<a
																		href="{navigateToProperPath(
																			m4.link || m4.slug
																		)}?sort=-updatedAt"
																		class="flex items-center justify-between gap-2 p-2 transition duration-300 cursor-pointer w-60 link-underline link-underline-gray">
																		<span>
																			{m4.name}
																		</span>

																		{#if m4.children?.length}
																			<svg
																				xmlns="http://www.w3.org/2000/svg"
																				viewBox="0 0 20 20"
																				fill="currentColor"
																				class="shrink-0 w-4 h-4">
																				<path
																					fill-rule="evenodd"
																					d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
																					clip-rule="evenodd"></path>
																			</svg>
																		{/if}
																	</a>

																	{#if m4.children?.length && showFifthLevel[index4]}
																		<ul
																			transition:fly="{{ y: 10, duration: 300 }}"
																			class="absolute top-0 z-10 flex flex-col text-sm bg-white border divide-y shadow-md w-60 left-60">
																			{#each m4.children as m5, index5}
																				<li
																					class="relative hover:bg-primary-100"
																					on:mouseenter="{() => (showSixthLevel[index5] = true)}"
																					on:mouseleave="{() => (showSixthLevel[index5] = false)}">
																					<a
																						href="{navigateToProperPath(
																							m5.link || m5.slug
																						)}?sort=-updatedAt"
																						class="flex items-center justify-between gap-2 p-2 transition duration-300 cursor-pointer w-60 link-underline link-underline-gray">
																						<span>
																							{m5.name}
																						</span>

																						{#if m5.children?.length}
																							<svg
																								xmlns="http://www.w3.org/2000/svg"
																								viewBox="0 0 20 20"
																								fill="currentColor"
																								class="shrink-0 w-4 h-4">
																								<path
																									fill-rule="evenodd"
																									d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
																									clip-rule="evenodd"></path>
																							</svg>
																						{/if}
																					</a>
																				</li>
																			{/each}
																		</ul>
																	{/if}
																</li>
															{/each}
														</ul>
													{/if}
												</li>
											{/each}
										</ul>
									{/if}
								</li>
							{/each}
						</ul>
					{/if}
				</li>
			{/each}
		</ul>
	{/if}
</div>
