<script>
import ImageLoader from '$lib/Image/ImageLoader.svelte'
import { CDN_URL } from '$lib/config'
export let p
</script>

{#if p}
	<!-- 2nd product start  -->
	<div class=" group">
		<!-- Image section start  -->
		<div class="bg-gray-200 rounded-lg">
			<div class=" p-2 flex justify-between ">
				<button
					class="bg-white focus:outline-none px-2 hover:bg-gray-400 hover:text-white py-1 text-sm rounded-md font-semibold tracking-wide"
					>NEW</button>
				<button
					class="bg-white focus:outline-none px-2 hover:bg-gray-400 py-1 text-sm  hover:text-white rounded-md font-semibold tracking-wide"
					><svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
						></path>
					</svg></button>
			</div>
			<div>
				<img src="/addidas1.png" alt="" class="px-2 h-60 mx-auto" />
			</div>
		</div>
		<!-- Image section end -->
		<!-- Text section start  -->
		<div class="mt-1 ">
			<h2 class="font-semibold group-hover:underline">Addidas Originals</h2>
			<h5 class="font-bold font-serif group-hover:underline">Have a good time...</h5>
			<h5 class="text-sm font-semibold text-gray-400">$105.00</h5>
			<h5 class="text-sm space-x-1  font-semibold text-gray-400">
				<span>8.5</span> <span>9</span> <span>10</span>
			</h5>
		</div>
	</div>
	<!-- 2nd product end  -->
{/if}
