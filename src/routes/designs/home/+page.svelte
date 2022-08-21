<style>
</style>

<!-- <Nav/> -->
<script>
// import Nav from '$lib/Nav.svelte';
import Footer from '$lib/Footer.svelte'
import SEO from '$lib/components/SEO/index.svelte'

let categories = [
	{
		name: 'Shirt',
		img: '/nologo-navy-casual-shirt.jpg'
	},
	{
		name: 'Shoes',
		img: '/shoe.webp'
	},
	{
		name: 'Hoodies',
		img: '/hoodie.webp'
	},
	{
		name: 'Pant',
		img: '/pant.jpg'
	},
	{
		name: 'Electronic',
		img: '/electronic.webp'
	},
	{
		name: 'Kitchen',
		img: '/kitchen.jpg'
	}
]

const seoProps = {
	title: 'Home',
	metadescription: 'search result of home'
}
</script>

<SEO {...seoProps} />

<section class="mx-2 my-2  text-gray-800 bg-white">
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

	<!-- Catagory section start  -->
	<div class="mb-5 mx-2 justify-between flex space-x-2 items-center">
		{#each categories as item, i}
			<div class="  transform hover:scale-105">
				<img
					src="{item.img}"
					alt=""
					class="border  object-cover object-center border-gray-500 rounded-full  w-16 h-16" />

				<h5 class="text-center font-semibold">{item.name}</h5>
			</div>
		{/each}
	</div>
	<!-- Catagory section end -->

	<!-- Background image section start  -->

	<div class="" style="background-image: url(/sale.jpg); height: 250px; ">
		<div class="bg-gray-900 bg-opacity-25 text-center  h-full">
			<h2 class="pt-10 font-bold tracking-wide  bg-transparent text-white text-5xl">Sale</h2>
			<h5 class="font-bold tracking-wide bg-transparent text-white">Up to 40% off</h5>

			<div class=" ">
				<button
					class="font-bold mt-10 tracking-wide mx-auto focus:outline-none bg-black transform hover:scale-105 text-white rounded shadow-md py-2 px-4">
					SHOP NOW
				</button>
			</div>
		</div>
	</div>
	<!-- Background image section end -->

	<!-- Recomended for you section start  -->
	<div class="my-5">
		<h4 class="font-bold">Recomended for you</h4>
		<div class="my-5 space-x-2 flex">
			<!-- 1st product start  -->
			<div class=" group">
				<!-- Image section start  -->
				<div class="bg-gray-200 rounded-lg">
					<div class=" p-2 flex justify-between ">
						<button
							class="bg-white focus:outline-none px-2 hover:bg-gray-400 hover:text-white py-1 text-sm rounded-md font-semibold tracking-wide"
							>NEW</button>
						<button
							class="bg-white focus:outline-none px-2 hover:bg-gray-400 py-1   hover:text-white rounded-md "
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
			<!-- 1st product end -->
			<!-- 2nd product start  -->
			<div class=" group">
				<!-- Image section start  -->
				<div class="bg-gray-200 rounded-lg">
					<div class=" p-2 flex justify-between ">
						<button
							class="bg-white focus:outline-none px-2 hover:bg-gray-400 hover:text-white py-1 text-sm rounded-md font-semibold tracking-wide"
							>NEW</button>
						<button
							class="bg-white focus:outline-none px-2 hover:bg-gray-400 py-1   hover:text-white rounded-md "
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
		</div>
	</div>
	<!-- Recomended for you section end -->

	<!-- Fresh collection section start  -->
	<div class="mt-5 mb-10">
		<h4 class="font-bold">Fresh collection</h4>
		<div class="my-3 flex space-x-3">
			<!-- 1st product start  -->
			<div class=" group">
				<!-- Image section start  -->
				<div class="bg-gray-200 rounded-lg">
					<div class=" p-2 flex justify-between ">
						<button
							class="bg-white focus:outline-none px-2 hover:bg-gray-400 hover:text-white py-1 text-sm rounded-md font-semibold tracking-wide"
							>NEW</button>
						<button
							class="bg-white focus:outline-none px-2 hover:bg-gray-400 py-1   hover:text-white rounded-md "
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
			<!-- 1st product end -->
			<!-- 2nd product start  -->
			<div class=" group">
				<!-- Image section start  -->
				<div class="bg-gray-200 rounded-lg">
					<div class=" p-2 flex justify-between ">
						<button
							class="bg-white px-2 hover:bg-gray-400 hover:text-white py-1 text-sm rounded-md font-semibold tracking-wide"
							>NEW</button>
						<button
							class="bg-white focus:outline-none px-2 hover:bg-gray-400 py-1   hover:text-white rounded-md "
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
		</div>
	</div>
	<!-- Fresh collection section end -->
</section>
