<script lang="ts">
import { CDN_URL } from '../../../config'
import { currency } from '../../util'
import { cart, fetchCart, addToCart } from '../../../store/cart'
export let item
$: discount = Math.round(((item?.variant?.mrp - item?.variant?.price) * 100) / item?.variant?.mrp)

function addToBag(item, qty) {
	addToCart({ pid: item.product._id, vid: item.variant._id, qty })
	// goto('/cart')
}
</script>

<!-- Product detail start  -->
<div class="flex items-start py-5 my-5 border-b border-gray-200">
	<img
		href="{`${item?.product?.slug}?id=${item?.product?._id}`}"
		src="{`${CDN_URL}/${item.product?.img[0]}`}"
		alt=""
		class="w-32 h-32 bg-gray-100 rounded-lg cursor-pointer" />
	<div class="w-full ml-4">
		<div class="flex items-center justify-between">
			<a
				href="{`${item?.product?.slug}?id=${item?.product?._id}`}"
				class="text-lg text-gray-600 truncate cursor-pointer w-72 hover:underline">
				{item?.product?.name}
			</a>
			<h2 class="ml-5 text-lg whitespace-nowrap">Arrives in 4 days</h2>
		</div>
		<h5 class="text-gray-600">{item.product?.vendor_name}</h5>
		<div class="flex items-center my-2">
			<h5 class="text-sm">One size</h5>
			<div class="w-1 h-1 mx-3 bg-gray-200 rounded-full"></div>
			<span class="text-red-500">2 left</span>
		</div>
		<div class="flex items-center">
			<span class="text-xl font-bold">{currency(item?.variant?.price)}</span>
			<span class="ml-2 font-light text-gray-400 ">
				<span class="line-through">{currency(item?.variant?.mrp)}</span>
			</span>
			<span class="ml-2 text-green-500 "> {discount}% off </span>
		</div>
		<div class="flex justify-between my-2">
			<div class="flex items-center justify-center">
				<button
					on:click="{() => addToBag(item, -1)}"
					type="button"
					class="flex items-center justify-center w-8 h-8 text-xs bg-gray-200 rounded-full shadow hover:bg-gray-300 focus:outline-none hover:opacity-80">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="w-4 h-4"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"
						></path>
					</svg>
				</button>
				<button
					class="flex items-center justify-center w-8 h-8 text-xs rounded-full focus:outline-none hover:opacity-80">
					<span>{item?.qty}</span>
				</button>
				<button
					on:click="{() => addToBag(item, 1)}"
					type="button"
					class="flex items-center justify-center w-8 h-8 text-xs bg-gray-200 rounded-full hover:bg-gray-300 focus:outline-none hover:opacity-80">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="w-4 h-4"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
					</svg>
				</button>
			</div>
			<div>
				<button
					on:click="{() => addToBag(item, -100000)}"
					class="p-3 bg-gray-200 rounded-md hover:opacity-80 focus:outline-none">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="w-5 h-5 text-gray-500"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
						></path>
					</svg>
				</button>
			</div>
		</div>
	</div>
</div>
