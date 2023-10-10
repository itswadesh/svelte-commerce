<script>
import { browser } from '$app/environment'
import { getAllMegamenuFromStore } from '$lib/store/megamenu'
import { LazyImg, MobileFooter } from '$lib/components'
import { navigateToProperPath, toast } from '$lib/utils'
import { onMount } from 'svelte'
import { page } from '$app/stores'
import SEO from '$lib/components/SEO/index.svelte'

let seoProps = {
	title: `Categories`,
	description: `Categories`
}

let loading = false
let megamenu = []
let showChild = []
let showChild2 = []
let bgColors = [
	'bg-fuchsia-200',
	'bg-blue-200',
	'bg-green-200',
	'bg-stone-200',
	'bg-indigo-200',
	'bg-amber-200',
	'bg-lime-200',
	'bg-orange-200',
	'bg-teal-200',
	'bg-cyan-200',
	'bg-yellow-200',
	'bg-zinc-200'
]

onMount(() => {
	getMegamenu()
})

async function getMegamenu() {
	if (browser) {
		try {
			megamenu = await getAllMegamenuFromStore({
				storeId: $page?.data?.store?.id,
				isCors: $page?.data?.store?.isCors,
				origin: $page.data.origin
			})
		} catch (e) {
			toast(e, 'error')
		} finally {
		}
	}
}

function toggle(mx) {
	if (showChild[mx] === true) {
		showChild[mx] = false
		toggle2(mx)
	} else {
		showChild[mx] = true
	}
}

function toggle2(cx) {
	if (showChild2[cx] === true) {
		showChild2[cx] = false
	} else {
		showChild2[cx] = true
	}
}
</script>

<SEO {...seoProps} />

<div>
	<div class="mb-20 bg-white">
		<!-- 1st level categories -->

		{#if megamenu?.length}
			<ul class="flex flex-col divide-y-2 divide-white">
				{#each megamenu as m, mx}
					{#if m}
						<li>
							{#if m.children?.length}
								<button
									type="button"
									class="flex h-24 w-full items-end justify-between focus:outline-none
									{bgColors[mx]}"
									on:click="{() => toggle(mx)}">
									<div class="flex h-full w-full flex-1 items-center gap-2 px-6">
										<h2 class="flex-1 text-left uppercase">
											{m.name}
										</h2>

										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-6 w-6 shrink-0 transition duration-300
													{showChild[mx] ? 'transform -rotate-180' : ''}"
											viewBox="0 0 20 20"
											fill="currentColor">
											<path
												fill-rule="evenodd"
												d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
												clip-rule="evenodd"></path>
										</svg>
									</div>

									{#if m.img}
										<div class="shrink-0">
											<img src="{m.img}" alt="" class="h-auto w-20 object-contain object-bottom" />
										</div>
									{/if}
								</button>
							{:else}
								<a
									href="/{m.slug}"
									aria-label="Click to visit {m.name || '##'}"
									class="text-left flex h-24 w-full items-end justify-between {bgColors[mx]}">
									<div class="flex h-full w-full flex-1 items-center px-6">
										<h2 class="flex-1 uppercase">
											{m.name}
										</h2>
									</div>

									{#if m.img}
										<div class="shrink-0">
											<img src="{m.img}" alt="" class="h-auto w-20 object-contain object-bottom" />
										</div>
									{/if}
								</a>
							{/if}

							<!-- 2nd level categories -->

							{#if showChild[mx]}
								{#if m.children?.length}
									<ul class="flex flex-col divide-y">
										{#each m.children as c, cx}
											<li>
												{#if c.children?.length}
													<button
														type="button"
														class="flex w-full items-center gap-4 py-3 px-8 text-left font-medium focus:outline-none"
														on:click="{() => toggle2(cx)}">
														{#if c.img}
															<div class="h-12 w-12 shrink-0 overflow-hidden rounded-full">
																<LazyImg
																	src="{c.img}"
																	alt=""
																	width="48"
																	height="48"
																	class="h-full w-full" />
															</div>
														{:else}
															<div
																class="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-zinc-200">
															</div>
														{/if}

														<h5 class="flex-1">
															{c.name}
														</h5>

														<svg
															xmlns="http://www.w3.org/2000/svg"
															class="h-5 w-5 shrink-0 transition duration-300
																	{showChild2[cx] ? 'transform -rotate-180' : ''}"
															viewBox="0 0 20 20"
															fill="currentColor">
															<path
																fill-rule="evenodd"
																d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
																clip-rule="evenodd"></path>
														</svg>
													</button>
												{:else}
													<a
														href="{navigateToProperPath(c.link || c.slug)}"
														aria-label="Click to visit {c.name || '##'}"
														class="flex items-center gap-4 py-3 px-8 font-medium">
														{#if c.img}
															<div class="h-12 w-12 shrink-0 overflow-hidden rounded-full">
																<LazyImg
																	src="{c.img}"
																	alt=""
																	width="48"
																	height="48"
																	class="h-full w-full" />
															</div>
														{:else}
															<div
																class="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-zinc-200">
															</div>
														{/if}

														<h5>{c.name}</h5>
													</a>
												{/if}

												<!-- 3rd level categories -->

												{#if showChild2[cx]}
													{#if c.children?.length}
														<ul class="flex flex-col divide-y bg-zinc-100">
															{#each c.children as cc}
																<li>
																	<a
																		href="{navigateToProperPath(cc.link || cc.slug)}"
																		aria-label="Click to visit {cc.name || '##'}"
																		class="flex w-full items-center gap-4 py-3 px-8 text-sm">
																		{cc.name}
																	</a>
																</li>
															{/each}
														</ul>
													{/if}
												{/if}
											</li>
										{/each}
									</ul>
								{/if}
							{/if}
						</li>
					{/if}
				{/each}
			</ul>
			<!-- {:else if !loading}
			<div>No categories found</div> -->
		{/if}
	</div>

	<!-- MOBILE FOOTER -->

	<div class="block lg:hidden">
		<MobileFooter />
	</div>
</div>
