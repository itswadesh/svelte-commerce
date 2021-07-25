<style>
.frosted {
	backdrop-filter: blur(15px);
	background-color: hsla(0, 0%, 100%, 0.75);
}
</style>

<script>
import MobFilter from '$lib/MobFilter.svelte'

let show = false
function toggle() {
	show = !show
}
</script>

<nav class="relative w-full shadow-md frosted">
	<div class="p-2 flex items-center justify-between">
		<div on:click="{toggle}">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6 text-gray-800 cursor-pointer"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M4 6h16M4 12h16M4 18h16"></path>
			</svg>
			{#if show}
				<div class="absolute z-40 left-0 top-0 bg-black bg-opacity-60">
					<MobFilter />
				</div>
			{/if}
		</div>

		<a href="/" class="flex items-center max-w-max">
			<img alt="" class=" h-8" src="/logo.svg" />
			<!-- <div class="">
				<h2 class="ml-2 text-xl font-bold tracking-wide">LITEKART</h2>
				<div class="ml-auto h-0.5 w-10 bg-pink-700"></div>
			</div> -->
		</a>
		<div>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6 text-gray-800"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="1.5"
					d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
				></path>
			</svg>
		</div>
	</div>
	<!-- <div class="px-2 pt-2 pb-4">
		<label class="relative flex items-center">
			<input
				type="text"
				placeholder="Search for products..."
				class="w-full bg-transparent py-1.5 pdl focus:outline-none rounded-full border border-gray-800" />
			<div class="absolute ml-4">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5 "
					viewBox="0 0 20 20"
					fill="currentColor">
					<path
						fill-rule="evenodd"
						d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
						clip-rule="evenodd"></path>
				</svg>
			</div>
		</label>
	</div> -->
</nav>
