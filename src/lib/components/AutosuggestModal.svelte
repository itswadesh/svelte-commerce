<script lang="ts">
import { createEventDispatcher, onMount } from 'svelte'
import { goto } from '$app/navigation'
import { navigateToProperPath } from '$lib/utils'
import { page } from '$app/stores'
import { slide } from 'svelte/transition'
import LazyImg from '$lib/components/Image/LazyImg.svelte'
import { AutocompleteService, CategoryService } from '$lib/services'
import { getCategoriesFromStore } from '$lib/store/categories'

const dispatch = createEventDispatcher()

export let show = false

let autocomplete: { img: string; name: string }[] = []
let categories: any = []
let err
let popular = []
let popularSearches = null
let product
let q = ''
let query = ''
let searchInput: any
let trending = []
let typingTimer: any

function submit() {
	show = false

	if (autocomplete?.length && autocomplete[0].slug && autocomplete[0].type === 'products') {
		goto(`/product/${autocomplete[0].slug}`)
	} else if (
		autocomplete?.length &&
		autocomplete[0].slug &&
		autocomplete[0].type === 'categories'
	) {
		goto(`/${autocomplete[0].slug}`)
	} else {
		goto(`/search?q=${q}`)
	}
}

function handleRouteToCategorySlug(link: string, slug: string) {
	show = false
	goto(navigateToProperPath(link || slug))
}

function onselect(v: any) {
	if (v) {
		if (v.type === 'products') {
			goto(`/product/${v.slug}`)
		} else if (v.type === 'categories') {
			goto(`/${v.slug}`)
		} else {
			goto(`/search?q=${encodeURIComponent(v.key)}`)
		}
	}
}

function fillValue(val: string) {
	product = val
}

async function getData(e: any) {
	if (e) {
		if (e.isComposing) {
			if (e.target.value === '') {
				q = query.slice(0, -1)
			} else {
				q = e.target.value
			}
		} else {
			q = e.target.value
		}
	}

	clearTimeout(typingTimer)

	typingTimer = setTimeout(async () => {
		try {
			autocomplete = await AutocompleteService.fetchAutocompleteData({
				q: q,
				origin: $page?.data?.origin,
				storeId: $page?.data?.storeId
			})
		} catch (e) {}
	}, 200)
}

function resetInput() {
	searchInput.focus()
	q = ''
}

onMount(async () => {
	searchInput.focus()
	try {
		const categoriesRes = await getCategoriesFromStore({
			origin: $page?.data?.origin,
			storeId: $page?.data?.storeId
		})
		console.log('zzzzzzzzzzzzzzzzzzzzzzzzzzz', categoriesRes)
		categories = categoriesRes.data
		// categories = (
		// 	await CategoryService.fetchAllCategories({
		// 		featured: true,
		// 		storeId: $page?.data?.storeId,
		// 		origin: $page.data.origin
		// 	})
		// ).data
	} catch (e) {
		err = e
	} finally {
	}
})
</script>

{#if show}
	<section class="fixed inset-0 z-[100] h-screen w-screen bg-white">
		<!-- Searching box -->

		<div class="fixed inset-x-0 top-0 z-[101]">
			<button
				type="button"
				class="absolute z-[102] my-auto mt-4 px-2 focus:outline-none"
				on:click="{() => (show = false)}">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="h-6 w-6">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"></path>
				</svg>
			</button>

			<div class="w-full">
				<div class="w-full">
					<div class="z-50 flex w-full flex-col justify-start">
						<div class="flex flex-wrap">
							<!--  Input anv Value method used for handling keyup in mobile -->

							<form
								autocomplete="off"
								class="flex w-full flex-row"
								on:submit|preventDefault="{submit}">
								<input
									bind:this="{searchInput}"
									placeholder="{$page?.data?.store?.searchbarText || 'Search...'}"
									class="text-normal relative h-14 w-full truncate border px-10 font-light focus:outline-none focus:ring-2 focus:ring-primary-500"
									on:input="{getData}" />

								<div class=" flex h-full cursor-pointer justify-end">
									<button on:click="{resetInput}" type="button">
										{#if q}
											<svg
												class="absolute my-auto mr-2 mt-4 flex h-6 w-6 justify-end text-sm text-zinc-500"
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 20 20"
												fill="currentColor">
												<path
													fill-rule="evenodd"
													d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
													clip-rule="evenodd"></path>
											</svg>
										{:else}
											<svg
												class="absolute my-auto mr-2 mt-4 flex h-6 w-6 justify-end text-sm text-zinc-500"
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor">
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
											</svg>
										{/if}
									</button>
								</div>
							</form>

							{#if autocomplete?.length}
								<ul
									transition:slide="{{ duration: 300 }}"
									class="mt-1 m-0 p-0 list-none w-full overflow-auto rounded border-zinc-400 bg-white scrollbar-none">
									{#each autocomplete || [] as v}
										<li>
											<button
												type="button"
												class="p-3 flex w-full items-center justify-between text-left border-b text-zinc-500 hover:bg-zinc-100"
												on:click="{() => onselect(v)}">
												<div class="flex-1 flex items-center gap-2 justify-start">
													{#if v.img}
														<LazyImg
															src="{v.img}"
															alt=""
															height="40"
															class="h-10 object-contain w-auto object-center" />
													{/if}

													<span class="w-full truncate text-sm capitalize">{v.key}</span>
												</div>

												<svg
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 24 24"
													stroke-width="1.5"
													stroke="currentColor"
													class="w-5 h-5">
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"></path>
												</svg>
											</button>
										</li>
									{/each}
								</ul>
							{/if}
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Categories -->

		{#if categories && categories?.data?.length}
			<div class="mt-20 px-4">
				<h6 class="mb-4 uppercase text-zinc-500">
					Categories on {$page?.data?.store?.websiteName}
				</h6>

				<div class="flex flex-col gap-4">
					{#each categories?.data as c}
						<button
							type="button"
							aria-label="Click to browse category"
							class="flex items-center gap-4 text-left"
							on:click="{() => handleRouteToCategorySlug(c.link, c.slug)}">
							{#if c.img}
								<div class="my-auto w-1/6">
									<LazyImg
										src="{c.img}"
										alt=""
										height="40"
										class="mx-auto my-auto h-10 object-contain" />
								</div>
							{/if}

							<div class="w-full flex-1 text-sm">
								{#if c.brand}
									<h6>{c.brand}</h6>
								{/if}

								{#if c.name}
									<p>{c.name}</p>
								{/if}
							</div>

							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5 shrink-0"
								viewBox="0 0 20 20"
								fill="currentColor">
								<path
									fill-rule="evenodd"
									d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
									clip-rule="evenodd"></path>
							</svg>
						</button>
					{/each}
				</div>
			</div>
		{/if}
	</section>
{/if}
