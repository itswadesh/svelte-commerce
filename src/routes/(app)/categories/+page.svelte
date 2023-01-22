<script>
import { browser } from '$app/environment'
import { onMount } from 'svelte'
import { page } from '$app/stores'
import { toast } from '$lib/utils'
import LazyImg from '$lib/components/Image/LazyImg.svelte'
import MobileFooter from '$lib/MobileFooter.svelte'
import SEO from '$lib/components/SEO/index.svelte'
import { fetchMegamenuData } from '$lib/services/CategoryService'

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
	'bg-gray-200'
]

onMount(() => {
	getMegaMenu()
})

async function getMegaMenu() {
	loading = true
	if (browser) {
		try {
			const localMegamenu = localStorage.getItem('megamenu')
			if (!localMegamenu || localMegamenu === 'undefined') {
				megamenu = await fetchMegamenuData({origin:$page?.data?.origin, storeId:$page?.data?.store?.id})
			} else {
				megamenu = JSON.parse(localMegamenu)
			}
			megamenu = megamenu.filter((e) => {
				return e.name !== 'New Arrivals'
			})
		} catch (e) {
			toast(e, 'error')
		} finally {
		}
	}
	loading = false
}

function toggle(mx) {
	if (showChild[mx] === true) {
		showChild[mx] = false
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

		{#if megamenu.length}
			<ul class="flex flex-col divide-y-2 divide-white tracking-wider">
				{#each megamenu as m, mx}
					{#if m}
						<li>
							{#if m.children?.length}
								<button
									type="button"
									class="flex h-24 w-full items-end justify-between focus:outline-none 
									{bgColors[mx]}">
									<div class="flex h-full w-full flex-1 items-center gap-2 px-6">
										<a href="/{m.slug}" class="flex-1 text-left text-xl font-bold uppercase">
											{m.name}
										</a>

										<button
											type="button"
											class="overflow-hidden rounded-full p-2 focus:outline-none"
											on:click="{() => toggle(mx)}">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												class="h-6 w-6 flex-shrink-0 transition duration-300
													{showChild[mx] ? 'transform -rotate-180' : ''}"
												viewBox="0 0 20 20"
												fill="currentColor">
												<path
													fill-rule="evenodd"
													d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
													clip-rule="evenodd"></path>
											</svg>
										</button>
									</div>

									{#if m.img}
										<div class="flex-shrink-0">
											<img src="{m.img}" alt="" class="h-auto w-20 object-contain object-bottom" />
										</div>
									{/if}
								</button>
							{:else}
								<a
									href="/{m.slug}"
									class="flex h-24 w-full items-end justify-between {bgColors[mx]}">
									<div class="flex h-full w-full flex-1 items-center px-6">
										<h1 class="flex-1 text-xl font-bold uppercase">
											{m.name}
										</h1>
									</div>

									{#if m.img}
										<div class="flex-shrink-0">
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
														class="flex w-full items-center gap-4 py-3 px-8 text-left font-medium focus:outline-none">
														<a href="/{c.slug}" class="flex flex-1 items-center gap-4">
															{#if c.img}
																<div class="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full">
																	<LazyImg
																		src="{c.img}"
																		alt=""
																		width="48"
																		height="48"
																		class="h-full w-full" />
																</div>
															{:else}
																<div
																	class="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-gray-200">
																</div>
															{/if}

															<h2 class="flex-1">
																{c.name}
															</h2>
														</a>

														<button
															type="button"
															class="overflow-hidden rounded-full p-2 focus:outline-none"
															on:click="{() => toggle2(cx)}">
															<svg
																xmlns="http://www.w3.org/2000/svg"
																class="h-5 w-5 flex-shrink-0 transition duration-300
																	{showChild2[cx] ? 'transform -rotate-180' : ''}"
																viewBox="0 0 20 20"
																fill="currentColor">
																<path
																	fill-rule="evenodd"
																	d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
																	clip-rule="evenodd"></path>
															</svg>
														</button>
													</button>
												{:else}
													<a href="/{c.slug}" class="flex items-center gap-4 py-3 px-8 font-medium">
														{#if c.img}
															<div class="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full">
																<LazyImg
																	src="{c.img}"
																	alt=""
																	width="48"
																	height="48"
																	class="h-full w-full" />
															</div>
														{:else}
															<div
																class="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-gray-200">
															</div>
														{/if}

														<h6>{c.name}</h6>
													</a>
												{/if}

												<!-- 3rd level categories -->

												{#if showChild2[cx]}
													{#if c.children?.length}
														<ul class="flex flex-col divide-y bg-gray-100">
															{#each c.children as cc}
																<li>
																	<a
																		href="/{cc.slug}"
																		class="flex w-full items-center gap-4 py-3 px-8 font-medium">
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

	<div class="block sm:hidden">
		<MobileFooter />
	</div>
</div>
