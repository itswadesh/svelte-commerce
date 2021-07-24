<script>
import SEO from '$lib/components/SEO/index.svelte'

const seoProps = {
	title: 'Payment',
	metadescription: 'Check payment status',
}
</script>

<SEO {...seoProps} />

<section class="mx-2 my-5 h-screen text-gray-800">
	<!-- Heading start  -->
	<div class="flex items-center">
		<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
			<path
				fill-rule="evenodd"
				d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
				clip-rule="evenodd"></path>
		</svg>
		<h4 class="font-bold tracking-wide  mx-auto">Checkout</h4>
	</div>
	<!-- Heading end -->
	<!-- Button section start  -->
	<div class="flex items-center justify-between my-5">
		<div class="flex items-center space-x-1 ">
			<div
				class="border border-gray-400 hover:bg-gray-400 hover:text-white text-center text-gray-400 font-semibold h-5 w-5 rounded-md">
				<h5 class="-mt-1">1</h5>
			</div>
			<span class="font-bold tracking-wide ">Shipping</span>
		</div>

		<div class="flex items-center space-x-1 ">
			<div
				class="border border-gray-400 bg-black hover:bg-gray-400 hover:text-white text-center text-white  h-5 w-5 font-semibold rounded-md">
				<h5 class="-mt-1">1</h5>
			</div>
			<span class="font-bold tracking-wide ">Payment</span>
		</div>

		<div class="flex items-center space-x-1 ">
			<div
				class="border border-gray-400 hover:bg-gray-400 hover:text-white text-center text-gray-400 font-semibold h-5 w-5 rounded-md">
				<h5 class="-mt-1">1</h5>
			</div>
			<span class="font-bold tracking-wide ">Review</span>
		</div>
	</div>
	<!-- Button section end -->
	<div class="border-b-8 border-gray-200"></div>
	<!-- Payment method start  -->
	<div class="flex items-center my-5 justify-between">
		<h5 class="text-sm text-gray-400 font-semibold">Select shipping address</h5>
		<h5 class="text-black tracking-wide font-bold">Change</h5>
	</div>
	<!-- Payment method end -->

	<div
		class="border-2 my-4 rounded-md p-2 flex justify-between border-gray-400 hover:border-blue-500">
		<div class="flex items-center">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-5 w-5"
				viewBox="0 0 20 20"
				fill="currentColor">
				<path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"></path>
				<path
					fill-rule="evenodd"
					d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
					clip-rule="evenodd"></path>
			</svg>

			<div class="ml-5">
				<h5 class="text-sm font-bold text-black tracking-wide">Adam Kalin</h5>
				<h5 class="text-xs mt-1  font-semibold text-gray-400">Wilcza 46,</h5>
				<h5 class="text-xs mt-1  font-semibold text-gray-400">00-679 warsaw, Poland</h5>
			</div>
		</div>
		<div>
			<input type="checkbox" class="focus:ring-0 focus:ring-offset-0" />
		</div>
	</div>

	<div class="border-b-8 mt-5 border-gray-200"></div>
	<!-- Payment method start  -->
	<div class="flex items-center my-5 justify-between">
		<h5 class="text-sm text-gray-400 font-semibold">Select shipping address</h5>
		<h5 class="text-black tracking-wide font-bold">Change</h5>
	</div>
	<!-- Payment method end -->

	<div
		class="border-2 my-4 rounded-md p-2 flex justify-between border-gray-400 hover:border-blue-500">
		<div class="flex items-center">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-5 w-5"
				viewBox="0 0 20 20"
				fill="currentColor">
				<path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"></path>
				<path
					fill-rule="evenodd"
					d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
					clip-rule="evenodd"></path>
			</svg>

			<div class="ml-5">
				<h5 class="text-sm font-bold text-black tracking-wide">Credit Card</h5>
				<h5 class="text-xs mt-1 font-semibold text-gray-400">**** **** **** 6543</h5>
			</div>
		</div>
		<div>
			<input type="checkbox" class="focus:ring-0 focus:ring-offset-0" />
		</div>
	</div>

	<div class="border-b-8 mt-5 border-gray-200"></div>

	<div class="mt-72">
		<button
			class="bg-blue-600 hover:bg-blue-700 py-2 w-full text-white font-bold tracking-wide rounded-md shadow-md focus:outline-none "
			>Continue</button>
	</div>
</section>
