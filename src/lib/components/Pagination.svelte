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

export let count = 10
export let current = 1
export let providePaddingOnMobile = false

count = +count
$: pages = +count > 50 ? 50 : +count
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
	<div
		class="flex flex-wrap items-center justify-between gap-4 border-t border-gray-300 text-sm
		{providePaddingOnMobile ? 'p-5 sm:pt-5' : 'pt-5'}">
		<div class="whitespace-nowrap text-gray-500">
			Page {current} of {count}
		</div>

		<div class="flex w-full max-w-max flex-wrap items-center gap-2">
			{#if +current > 1}
				<button
					class="flex h-8 items-center justify-center gap-2 rounded-md border border-gray-300 px-3 focus:outline-none hover:border-gray-800"
					on:click="{() => changePage(+current - 1)}">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="h-4 w-4">
						<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"
						></path>
					</svg>

					<span class="hidden sm:block">Previous</span>
				</button>
			{/if}

			{#each { length: pages } as _, i}
				{#if startTab <= i + 1 && endTab - 1 >= i}
					<button
						class="h-8 w-8 rounded border-gray-800 focus:outline-none hover:border hover:border-gray-800"
						class:active="{+current === i + 1}"
						on:click="{() => changePage(i + 1)}">
						{i + 1}
					</button>
				{/if}
			{/each}

			{#if +current < pages}
				<button
					class="flex h-8 items-center justify-center gap-2 rounded-md border border-gray-300 px-3 focus:outline-none hover:border-gray-800"
					on:click="{() => changePage(+current + 1)}">
					<span class="hidden sm:block">Next</span>

					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="h-4 w-4">
						<path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"
						></path>
					</svg>
				</button>
			{/if}
		</div>
	</div>
{/if}
