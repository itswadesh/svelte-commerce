<script lang="ts">
import { goto } from '$app/navigation'
import { createEventDispatcher, onMount } from 'svelte'
import { page } from '$app/stores'
import LazyImg from '$lib/components/Image/LazyImg.svelte'
import { fetchAutocompleteData } from '$lib/services/AutocompleteService'
import { fetchAllCategories } from './services/CategoryService'

const dispatch = createEventDispatcher()

export let show = false

let popularSearches = null
let searchInput:any
let q = ''
let query = ''
let product
let categories:any = []
let trending = []
let popular = []
let autocomplete:{img:string, name:string}[] = []
let typingTimer:any
let err

// console.log('popular = ', popular?.data?.length)

function submit() {
	show = false
	goto(`/search?q=${q}`)
}

function handleRouteToCategorySlug(link:string, slug:string) {
	show = false
	goto(`/${link || slug}`)
}

function onselect(v:any) {
	if (v) goto(`/search?q=${encodeURIComponent(v.name)}`)
}

function fillValue(val:string) {
	product = val
}

async function getData(e:any) {
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
			autocomplete = await fetchAutocompleteData({
				q: q,
				origin: $page?.data?.origin,
				storeId: $page?.data?.store?.id
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
		categories = (
			await fetchAllCategories({
				featured: true,
				storeId: $page?.data?.store?.id,
				origin: $page.data.origin
			})
		).data
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
				on:click="{() => (show = false)}"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="h-6 w-6"
				>
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
								on:submit|preventDefault="{submit}"
							>
								<input
									bind:this="{searchInput}"
									placeholder="{$page?.data?.store?.searchbarText || 'Search...'}"
									class="text-normal relative h-14 w-full truncate border px-10 font-light focus:outline-none focus:ring-2 focus:ring-primary-500"
									on:input="{getData}"
								/>

								<div class=" flex h-full cursor-pointer justify-end">
									<button on:click="{resetInput}" type="button">
										{#if q}
											<svg
												class="absolute my-auto mr-2 mt-4 flex h-6 w-6 justify-end text-sm text-gray-500"
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 20 20"
												fill="currentColor"
											>
												<path
													fill-rule="evenodd"
													d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
													clip-rule="evenodd"></path>
											</svg>
										{:else}
											<svg
												class="absolute my-auto mr-2 mt-4 flex h-6 w-6 justify-end text-sm text-gray-500"
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
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

							<div
								class="mt-1 w-full overflow-auto rounded border-gray-400 bg-white scrollbar-none"
							>
								{#each autocomplete || [] as v}
									<button
										type="button"
										class="flex w-full cursor-pointer flex-row items-center justify-between border-b text-base font-light text-gray-500 hover:bg-gray-100"
										on:click="{() => onselect(v)}"
									>
										<div class="flex w-10/12 flex-row">
											{#if v.img}
												<div class="my-auto w-1/6">
													<LazyImg
														src="{v.img}"
														alt=""
														height="40"
														class="mx-auto my-auto h-10 object-contain"
													/>
												</div>
											{/if}

											<span class="w-5/6 truncate p-3">{v.name}</span>
										</div>

										<svg class="mx-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
											<g fill="none" fill-rule="evenodd">
												<path d="M0 0h24v24H0z"></path>

												<path
													fill="#000"
													fill-opacity=".54"
													fill-rule="nonzero"
													d="M16.631 19.015l1.384-1.45-9.55-9.62h6.59v-2h-10v10h2v-6.59z"></path>
											</g>
										</svg>
									</button>
								{/each}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Categories -->

		{#if categories && categories?.data?.length}
			<div class="mt-20 px-4">
				<h6 class="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-600">
					Categories on {$page?.data?.store?.websiteName}
				</h6>

				<div class="flex flex-col gap-4">
					{#each categories?.data as c}
						<button
							type="button"
							aria-label="Click to browse category"
							class="flex items-center gap-4 text-left"
							on:click="{() => handleRouteToCategorySlug(c.link, c.slug)}"
						>
							{#if c.img}
								<div class="my-auto w-1/6">
									<LazyImg
										src="{c.img}"
										alt=""
										height="40"
										class="mx-auto my-auto h-10 object-contain"
									/>
								</div>
							{/if}

							<div class="w-full flex-1 text-sm">
								{#if c.brand}
									<h6 class="font-medium">{c.brand}</h6>
								{/if}

								{#if c.name}
									<p>{c.name}</p>
								{/if}
							</div>

							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5 flex-shrink-0"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
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
