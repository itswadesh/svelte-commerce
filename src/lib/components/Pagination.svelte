<style>
.active {
	color: #fff;
	background-color: #282c3f;
}
</style>

<script>
import { goto } from '$app/navigation'
import { page } from '$app/stores'
// import { createEventDispatcher } from 'svelte'

// const dispatch = createEventDispatcher()

export let count = 10,
	current = 1

count = +count
$: pages = +count
$: startTab = 5 - current <= 5 && 5 - current >= 0 ? 1 : current - 4
$: endTab = startTab + 9
function changePage(e) {
	current = e || '1'
	// dispatch('change', current)
	// $page.url.searchParams.set('page', current.toString())
	// let query = {}
	let u = new URL($page.url)
	u.searchParams.set('page', current.toString())
	goto(u.toString())
	window.scroll({ top: 0, behavior: 'smooth' })
	// goto($page.url.pathname + $page.url.search)
	// const r = $page.url.searchParams.get('r')

	// console.log('rrrrrrrrrrrrrrr', r)

	// if (r) $page.url.searchParams.delete('r')
	// else $page.url.searchParams.set('r', Math.random().toString())
	// // scrollToTop();
}
</script>

{#if count > 1}
	<div class="items-center justify-between border-t border-gray-200 lg:flex lg:pt-5">
		<div class="items-center whitespace-nowrap py-4 text-xs text-gray-500 sm:text-base">
			Page {current} of {count}
		</div>

		<div class="flex items-center justify-center gap-2 text-center xl:mx-2">
			{#if +current > 1}
				<button
					class="inline-flex items-center rounded border border-gray-300 p-0.5 font-bold tracking-wide text-gray-800 hover:border-gray-800 focus:outline-none sm:p-2 lg:py-2 lg:px-4"
					on:click="{() => changePage(+current - 1)}">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-4 w-4 sm:mr-2"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 19l-7-7 7-7"></path>
					</svg>

					<span class="hidden text-xs sm:block">Previous</span>
				</button>
			{/if}

			<div class="flex flex-wrap gap-1">
				{#each { length: pages } as _, i}
					{#if startTab <= i + 1 && endTab - 1 >= i}
						<button
							class="mx-auto h-5 w-5 rounded border-gray-800 text-xs hover:border hover:border-gray-800 focus:outline-none sm:h-8 sm:w-8 sm:text-base"
							class:active="{+current === i + 1}"
							on:click="{() => changePage(i + 1)}">
							{i + 1}
						</button>
					{/if}
				{/each}
			</div>

			{#if +current < count}
				<button
					class="inline-flex items-center rounded border border-gray-300 p-0.5 text-center font-bold tracking-wide text-gray-800 hover:border-gray-800  focus:outline-none sm:p-2 lg:py-2 lg:px-4"
					on:click="{() => changePage(+current + 1)}">
					<span class="hidden text-xs sm:block">Next</span>

					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-4 w-4 sm:ml-2"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"
						></path>
					</svg>
				</button>
			{/if}
		</div>
	</div>
{/if}
