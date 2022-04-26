<style>
@media (max-width: 1024px) {
	.h-rem {
		height: 55rem;
	}
}
@media (min-width: 1024px) {
	.h-rem {
		height: 30rem;
	}
}
</style>

<script>
import Image from '$lib/components/Image/Image.svelte'
import ImageLoader from '$lib/components/Image/ImageLoader.svelte'
import SEO from '$lib/components/SEO/index.svelte'
import HeadingUnderline from '$lib/HeadingUnderline.svelte'
import PrimaryButton from '$lib/ui/PrimaryButton.svelte'

const seoProps = {
	title: 'About ',
	metadescription:
		'This is a business directory and listing Platform, it provides features like unlimited-level categories, custom fields, listing etc.'
}
</script>

<SEO {...seoProps} />
<div class="bg-white min-h-screen text-center">
	<div class="container mx-auto max-w-7xl">
		<div class="p-3 py-5 sm:p-10">
			<div
				class="mb-5 sm:mb-10 text-gray-800 max-w-max mx-auto flex flex-col items-center justify-center">
				<h1 class="mb-2 text-primary-500 text-xl sm:text-2xl lg:text-3xl font-bold">About</h1>

				<HeadingUnderline />
			</div>

			<h2 class="text-lg sm:text-xl tracking-wide text-center font-semibold">
				Helping You Build An Online Brand
			</h2>
		</div>

		<div class="mb-10 sm:mb-20 px-4 sm:px-10">
			<p class="mb-5">
				Misiki is a product of India based Javascript e-commerce Solution. It offers an javascript
				fullstack ecommerce website to startups to strengthen their footprints in the ecommerce
				space.
			</p>

			<p class="mb-5">
				Started in 2019, Misiki Technologies LLP has acquired 800+ happy clients to date. If you are
				an ecommerce listing owner, all you need to do is choose your goal and we will help you
				develop the optimal technology platform for your listing.
			</p>

			<p>
				We are continuously evolving to drive ecommerce for global merchants so that they can enable
				a better experience for their customers using our technology and analytics at every stage of
				the cycle.
			</p>
		</div>

		<div class="mb-10 sm:mb-20 grid grid-cols-1 sm:grid-cols-3 gap-5  px-4 sm:px-10">
			<div class="col-span-1 bg-white text-center rounded-lg shadow-md">
				<div>
					<ImageLoader
						src="/about/about1.png"
						alt="-"
						class="h-44 lg:h-60 object-cover w-full rounded-t-lg" />
				</div>

				<p class="p-4 lg:p-6 text-sm text-gray-500">
					With a mission of “Amazing customer experience” Misiki aims to offer an easy ecommerce
					enablement platform where small retailers and SME’s can start their online store with
					their brand name, at the best prices.
				</p>
			</div>

			<div class="col-span-1 bg-white text-center rounded-lg shadow-md">
				<div>
					<ImageLoader
						src="/about/about2.png"
						alt="-"
						class="h-44 lg:h-60 object-cover w-full rounded-t-lg" />
				</div>

				<p class="p-4 lg:p-6 text-sm text-gray-500">
					To simplify administration, cart checkout and payments for merchants by offering the
					complete ecommerce solution, so that they can easily come up with their online store and
					start selling online.
				</p>
			</div>

			<div class="col-span-1 bg-white text-center rounded-lg shadow-md">
				<div>
					<ImageLoader
						src="/about/about3.png"
						alt="-"
						class="h-44 lg:h-60 object-cover w-full rounded-t-lg" />
				</div>

				<p class="p-4 lg:p-6 text-sm text-gray-500">
					Misiki wants to reduce ecommerce to its bare bones for small retailers. We bridge the gap
					between technology and innovation by providing an easy yet powerful ecommerce enablement
					platform
				</p>
			</div>
		</div>
	</div>

	<div class="relative h-rem bg-gray-800 overflow-hidden">
		<div class="w-full h-full">
			<ImageLoader src="/mumbai.jpg" alt="mumbai" class="z-0 object-cover w-full h-full" />
		</div>

		<div
			class="absolute top-0 left-0 right-0 bottom-0 z-10 text-white font-semibold"
			style="background-color: rgba(0, 0, 0,0.5);">
			<div
				class="container max-w-7xl mx-auto p-2 flex flex-col space-y-5 items-center justify-center tracking-wide h-full">
				<div class="mb-5">
					<h1 class="mb-3 text-3xl sm:text-4xl">Misiki Technologies LLP</h1>

					<h1 class="mb-2 text-xl sm:text-2xl">Rourkela</h1>

					<h1 class="text-sm sm:text-base">770039</h1>
				</div>

				<div class="grid grid-cols-1 lg:grid-cols-5 gap-5 items-start justify-between px-5">
					<!-- Address -->

					<div class="col-span-1 flex flex-col items-center justify-center font-normal">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="mb-3 w-10 h-10"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
							></path>
						</svg>

						<h3 class="mb-2 text-base md:text-lg">Mailing Address</h3>

						<h4 class="text-sm text-gray-200">
							C/12, Kuarmunda, Rourkela, Sundergarh, Odisha, India
						</h4>
					</div>

					<!-- Zip Code -->

					<div class="col-span-1 flex flex-col items-center justify-center font-normal">
						<svg
							fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="1.5"
							viewBox="0 0 24 24"
							class="mb-3 w-10 h-10">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="1.5"
								d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
							></path>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="1.5"
								d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
						</svg>

						<h3 class="mb-2 text-base md:text-lg">Zip Code</h3>

						<h4 class="text-sm text-gray-200">770039</h4>
					</div>

					<!-- Contact Number -->

					<div class="col-span-1 flex flex-col items-center justify-center font-normal ">
						<svg
							fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="1.5"
							viewBox="0 0 24 24"
							class="mb-3 w-10 h-10">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="1.5"
								d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
							></path>
						</svg>

						<h3 class="mb-2 text-base md:text-lg">Contact Number</h3>

						<h4 class="text-sm text-gray-200">+855-</h4>
					</div>

					<!--  Email Address -->

					<div class="col-span-1 flex flex-col items-center justify-center font-normal">
						<svg
							fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="1.5"
							viewBox="0 0 24 24"
							class="mb-3 w-10 h-10">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="1.5"
								d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
							></path>
						</svg>

						<h3 class="mb-2 text-base md:text-lg">Email Address</h3>

						<h4 class="text-sm text-gray-200">hi@misiki.in</h4>
					</div>

					<!--  WebSite -->

					<div class="col-span-1 flex flex-col items-center justify-center  font-normal">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="mb-3 w-10 h-10"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
							></path>
						</svg>

						<h3 class="mb-2 text-base md:text-lg">WebSite</h3>

						<a href="https://misiki.in/" class="text-gray-200">misiki.in</a>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="p-3 py-5 sm:p-10 sm:py-20">
		<div class="container max-w-7xl mx-auto">
			<h2 class="text-2xl md:text-4xl font-medium text-center">Experience Work As A Innovator!</h2>

			<p class="my-3 flex justify-center">----- ¤ ----- ¤ ----- ¤ -----</p>

			<p class="mb-10 flex justify-center tracking-wide text-center">
				At Misiki, we don’t just offer jobs, but a career. If you are crazy about work and party,
				then we are waiting for you, eagerly!
			</p>

			<div class="relative max-w-max mx-auto">
				<PrimaryButton type="submit">Apply Now</PrimaryButton>

				<div class="absolute top-0 right-0 -m-0.5 bg-primary-500 animate-ping h-3 w-3 rounded-full">
				</div>
			</div>
		</div>
	</div>
</div>
