<script>
import Footer from '$lib/Footer.svelte'
import SEO from '$lib/components/SEO/index.svelte'

const seoProps = {
	title: 'Product-List',
	metadescription: 'The list of all products',
}
</script>

<SEO {...seoProps} />

<section class="mx-2 my-2 text-gray-900">
	<!-- Search bar section start  -->
	<div class="relative w-full text-gray-600 ">
		<input
			type="search"
			name="search"
			placeholder="What are you looking for ?"
			v-model="search"
			class=" rounded-lg w-full py-1.5 pl-8 pr-1 border-2 hover:text-gray-800 focus:outline-none border-gray-200 bg-white  placeholder-gray-400" />
		<button type="submit" class="absolute top-3 left-2.5">
			<svg
				class="w-4 h-4  text-gray-400 focus:outline-none fill-current"
				xmlns="http://www.w3.org/2000/svg"
				xmlns:xlink="http://www.w3.org/1999/xlink"
				version="1.1"
				id="Capa_1"
				x="0px"
				y="0px"
				viewBox="0 0 56.966 56.966"
				style="enable-background: new 0 0 56.966 56.966"
				xml:space="preserve"
				width="512px"
				height="512px">
				<path
					d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z"
				></path>
			</svg>
		</button>
		<button></button>
	</div>
	<!-- Search bar section end  -->

	<div
		class="bg-gray-200 p-1 -mt-2 rounded-md text-gray-500 flex justify-between items-center font-semibold tracking-wide">
		<div class="bg-white py-2 px-4 shadow-md rounded-md">Women</div>
		<div class="px-4">Men</div>
		<div class="px-4">Kid</div>
	</div>
	<div class="my-5">
		<div class="flex items-center justify-between ">
			<div class="flex items-center ">
				<div class="mt-2 bg-gray-200 h-16 w-16 p-2 rounded-md">
					<img src="/nike-shoe.png" alt="" class="h-14 w-14 rounded-md" />
				</div>
				<div class="ml-5">
					<h5 class="font-semibold font-serif">New Arrivals</h5>
					<h6 class="text-gray-400 text-xs">Upcomming drop: June 2019</h6>
				</div>
			</div>
			<div>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5 text-gray-600 hover:text-gray-800 transform hover:translate-x-1 mr-1"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"
					></path>
				</svg>
			</div>
		</div>

		<div class="my-5">
			<div class="flex items-center justify-between ">
				<div class="flex items-center ">
					<div class="mt-2 bg-gray-200 h-16 w-16 p-2 rounded-md">
						<img src="/nike-shoe.png" alt="" class="h-14 w-14 rounded-md" />
					</div>
					<div class="ml-5">
						<h5 class="font-semibold font-serif">New Arrivals</h5>
						<h6 class="text-gray-400 text-xs">Upcomming drop: June 2019</h6>
					</div>
				</div>
				<div>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5 text-gray-600 hover:text-gray-800 transform hover:translate-x-1 mr-1"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"
						></path>
					</svg>
				</div>
			</div>
		</div>

		<div class="my-5">
			<div class="flex items-center justify-between ">
				<div class="flex items-center ">
					<div class="mt-2 bg-gray-200 h-16 w-16 p-2 rounded-md">
						<img src="/nike-shoe.png" alt="" class="h-14 w-14 rounded-md" />
					</div>
					<div class="ml-5">
						<h5 class="font-semibold font-serif">New Arrivals</h5>
						<h6 class="text-gray-400 text-xs">Upcomming drop: June 2019</h6>
					</div>
				</div>
				<div>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5 text-gray-600 hover:text-gray-800 transform hover:translate-x-1 mr-1"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"
						></path>
					</svg>
				</div>
			</div>
		</div>

		<div class="my-5">
			<div class="flex items-center justify-between ">
				<div class="flex items-center ">
					<div class="mt-2 bg-gray-200 h-16 w-16 p-2 rounded-md">
						<img src="/nike-shoe.png" alt="" class="h-14 w-14 rounded-md" />
					</div>
					<div class="ml-5">
						<h5 class="font-semibold font-serif">New Arrivals</h5>
						<h6 class="text-gray-400 text-xs">Upcomming drop: June 2019</h6>
					</div>
				</div>
				<div>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5 text-gray-600 hover:text-gray-800 transform hover:translate-x-1 mr-1"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"
						></path>
					</svg>
				</div>
			</div>
		</div>

		<div class="my-5">
			<div class="flex items-center justify-between ">
				<div class="flex items-center ">
					<div class="mt-2 bg-gray-200 h-16 w-16 p-2 rounded-md">
						<img src="/nike-shoe.png" alt="" class="h-14 w-14 rounded-md" />
					</div>
					<div class="ml-5">
						<h5 class="font-semibold font-serif">New Arrivals</h5>
						<h6 class="text-gray-400 text-xs">Upcomming drop: June 2019</h6>
					</div>
				</div>
				<div>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5 text-gray-600 hover:text-gray-800 transform hover:translate-x-1 mr-1"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"
						></path>
					</svg>
				</div>
			</div>
		</div>

		<div class="my-5">
			<div class="flex items-center justify-between ">
				<div class="flex items-center ">
					<div class="mt-2 bg-gray-200 h-16 w-16 p-2 rounded-md">
						<img src="/nike-shoe.png" alt="" class="h-14 w-14 rounded-md" />
					</div>
					<div class="ml-5">
						<h5 class="font-semibold font-serif">New Arrivals</h5>
						<h6 class="text-gray-400 text-xs">Upcomming drop: June 2019</h6>
					</div>
				</div>
				<div>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5 text-gray-600 hover:text-gray-800 transform hover:translate-x-1 mr-1"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"
						></path>
					</svg>
				</div>
			</div>
		</div>
	</div>
</section>
<Footer />
