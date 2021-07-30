<style scoped>
.frosted {
	backdrop-filter: blur(15px);
	background-color: hsla(0, 0%, 100%, 0.75);
}
</style>

<script>
import { currency, toast } from './../util'
import { lazyload } from './../actions/lazyload'
import { CDN_URL } from './../../config'
import { addToCart } from '../../store/cart'
import { get, post, del } from './../util/api'
let CartButtonText = 'MOVE TO BAG'

function addToBag(product, variant) {
	addToCart({ pid: product._id, vid: variant._id, qty: 1 })
	CartButtonText = 'GO TO BAG'
}
async function removeFromWishlist(id) {
	await del(`wishlists/my/${id}`)
	wishlist = (await get(`wishlists/my`)).data
	toast('Removed from wishlist', 'success')
}
export let wishlist
</script>

<section class="sm:flex sm:items-start sm:justify-start sm:space-x-5 ">
	{#if wishlist}
		{#each wishlist as w}
			<div
				class="flex md:flex-wrap items-start space-x-5 justify-start overflow-x-auto md:overflow-x-hidden">
				<div
					class="flex-shrink-0 w-40 sm:w-60 mb-4 group bg-white shadow hover:shadow-md text-gray-800">
					<div class="block overflow-hidden hover:shadow-lg">
						<div class="relative">
							<a href="{`/${w.product?.slug}?id=${w.product?._id}`}">
								<img
									alt=""
									use:lazyload
									src="{`${CDN_URL}/${w.product?.img && w.product?.img[0]}?tr=w-3,h-3`}"
									data-src="{`${CDN_URL}/${w.product?.img && w.product?.img[0]}`}"
									class="object-cover object-top w-full h-72  bg-gray-100 " />
							</a>
							<button
								on:click="{() => removeFromWishlist(w._id)}"
								class="absolute top-0 right-0 m-2 h-6 w-6 rounded-full frosted flex items-center justify-center border border-gray-400 transform active:scale-95 ">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-4 w-4 text-gray-600"
									viewBox="0 0 20 20"
									fill="currentColor">
									<path
										fill-rule="evenodd"
										d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
										clip-rule="evenodd"></path>
								</svg>
							</button>
						</div>
						<div class="p-4 ">
							<h4 class="font-semibold mb-1.5">{''}</h4>
							<h6 class="text-sm font-medium overflow-hidden whitespace-nowrap overflow-ellipsis">
								{w.product?.name}
							</h6>

							<div class="mt-2.5 mb-1.5 leading-4 flex items-baseline justify-center ">
								<span class="mr-1 text-sm font-semibold whitespace-nowrap ">
									{currency(w.variant?.price)}
								</span>
								<span class="ml-1 text-xs text-gray-500 whitespace-nowrap line-through">
									{w.variant?.price}
								</span>
								<span class="ml-1 text-xs text-green-500 whitespace-nowrap">
									( {Math.round((w?.variant?.price * 100) / w?.variant?.mrp)}% off )
								</span>
							</div>
						</div>

						<div class="border">
							{#if CartButtonText == 'MOVE TO BAG'}
								<button
									on:click="{() => addToBag(w.product, w.variant)}"
									class="w-full p-3 frosted text-sm font-semibold text-primary-500 tracking-wide focus:outline-none">
									{CartButtonText}
								</button>
							{:else}
								<a
									href="/cart"
									class="block text-center bg-purple-800 py-2 w-full font-semibold tracking-wide text-white transform  rounded-md hover:scale-105 focus:outline-none">
									<span>
										{CartButtonText}
									</span>
								</a>
							{/if}
						</div>
					</div>
				</div>

				<!-- <div
					class="flex-shrink-0 w-40 sm:w-60 mb-4 group bg-white shadow hover:shadow-md text-gray-800">
					<a href="##" class="block overflow-hidden hover:shadow-lg">
						<div class="relative">
							<img
								alt=""
								src="/nike-shoe.png"
								class="object-cover object-top w-full h-72  bg-gray-100 " />

							<button
								class="absolute top-0 right-0 m-2 h-6 w-6 rounded-full frosted flex items-center justify-center border border-gray-400 transform active:scale-95 "
								><svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-4 w-4 text-gray-600"
									viewBox="0 0 20 20"
									fill="currentColor">
									<path
										fill-rule="evenodd"
										d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
										clip-rule="evenodd"></path>
								</svg></button>
						</div>

						<div class="p-4 ">
							<h4 class="font-semibold mb-1.5">ROADSTER</h4>
							<h6
								href="##"
								class="text-sm font-medium overflow-hidden whitespace-nowrap overflow-ellipsis">
								Men Navy Blue Skinny Fit Mid-Rise Low Distress Stretchable Jeans
							</h6>

							<div class="mt-2.5 mb-1.5 leading-4 flex items-baseline justify-center ">
								<span class="mr-1 text-sm font-semibold whitespace-nowrap "> $1500 </span>
								<span class="ml-1 text-xs text-gray-500 whitespace-nowrap line-through">
									$750
								</span>
								<span class="ml-1 text-xs text-green-500 whitespace-nowrap"> ( 50% off ) </span>
							</div>
						</div>

						<div class="border">
							<button
								class="w-full p-3 frosted text-sm font-semibold text-primary-500 tracking-wide focus:outline-none">
								MOVE TO BAG
							</button>
						</div>
					</a>
				</div> -->
			</div>
		{/each}

		<hr class="border-t-8 border-gray-200 my-2 sm:hidden" />
		<div class="sm:hidden pt-2 flex items-center justify-between text-sm font-semibold ">
			<h5>Out of Stock Items</h5>
			<button
				class="focus:outline-none font-semibold border border-gray-400 py-1 px-2 tracking-wide "
				>REMOVE ALL</button>
		</div>
		<!-- 
		<div
			class="mt-5 flex md:flex-wrap items-start space-x-5 justify-start overflow-x-auto md:overflow-x-hidden">
			<div
				class="flex-shrink-0 w-40 sm:w-60 mb-4 group bg-white shadow hover:shadow-md text-gray-800">
				<a href="##" class="block overflow-hidden hover:shadow-lg">
					<div class="relative">
						<img
							alt=""
							src="/nike-shoe.png"
							class="object-cover object-top w-full h-72  bg-gray-100 filter grayscale opacity-50" />

						<button
							class="absolute top-0 right-0 m-2 h-6 w-6 rounded-full frosted flex items-center justify-center border border-gray-400 transform active:scale-95 "
							><svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-4 w-4 text-gray-600"
								viewBox="0 0 20 20"
								fill="currentColor">
								<path
									fill-rule="evenodd"
									d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
									clip-rule="evenodd"></path>
							</svg></button>

						<div class="absolute bottom-0 inset-x-0">
							<div class="mx-auto max-w-max">
								<div class="py-2 px-4 frosted text-sm font-semibold text-red-500 tracking-wide">
									Out of stock
								</div>
							</div>
						</div>
					</div>

					<div class="p-4 ">
						<h6
							href="##"
							class="text-sm font-medium overflow-hidden whitespace-nowrap overflow-ellipsis">
							Men Navy Blue Skinny Fit Mid-Rise Low Distress Stretchable Jeans
						</h6>

						<div class="mt-2.5 mb-1.5 leading-4 flex items-baseline justify-center ">
							<span class="mr-1 text-sm font-semibold whitespace-nowrap "> $1500 </span>
						</div>
					</div>

					<div class="border">
						<button
							class="w-full p-3 frosted text-sm font-semibold text-primary-500 tracking-wide focus:outline-none">
							SHOW SIMILAR
						</button>
					</div>
				</a>
			</div>
		</div> -->
	{/if}
</section>
