<script>
import Footer from '$lib/Footer.svelte'
import SEO from '$lib/components/SEO/index.svelte'

const seoProps = {
	title: 'Search-Items-List',
	metadescription: 'searched items list',
}
</script>

<SEO {...seoProps} />

<section class="mx-2 my-5 text-gray-800">
	<div>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-5 w-5 text-gray-800"
			viewBox="0 0 20 20"
			fill="currentColor">
			<path
				fill-rule="evenodd"
				d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
				clip-rule="evenodd"></path>
		</svg>
	</div>

	<!-- Heading start  -->
	<div>
		<h2 class="my-2 font-bold tracking-wide text-2xl font-serif">Clothing</h2>
	</div>
	<!-- Heading end -->

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
