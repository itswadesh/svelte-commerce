<script lang="ts">
import { onMount } from 'svelte'
import { SplideSlide } from '@splidejs/svelte-splide'
import { page } from '$app/stores'
import { invalidateAll } from '$app/navigation'
import PrimaryButton from '$lib/ui/PrimaryButton.svelte'
import { applyAction, enhance } from '$app/forms'
import { fade } from 'svelte/transition'
import { cartStore, updateCartStore } from '$lib/store/cart'
import { browser } from '$app/environment'
import { CartService } from 'lib/services'

export let products = []
export let title = ''

let showMuteButton = true
let isMuted = true
let paused = false
let loadingg = false
$: cart = {}

// share button function

const share = async ({ title, text, url }: any) => {
	if (navigator.share) {
		try {
			await navigator.share({
				title: title,
				text: text,
				url: url
			})
		} catch (error) {
			// console.error('Error sharing:', error)
		}
	} else {
		// console.log('Web Share API not supported.')
	}
}

let autoplay = true
let imgUrl = ''
let imgUnmute = 'https://www.svgrepo.com/show/129402/mute.svg'
let imgMute = 'https://www.svgrepo.com/show/129402/mute.svg'

let cartButtonText = 'Add to Bag'
let loading = {}
let selectedLoadingType = null

let isAddedtoBag = false

function toggleMute(product) {
	product.muted = !product.muted
}

const addToCart = async ({ pid, qty, customizedImg, ix, loadingType }: any) => {
	if (loadingType) {
		selectedLoadingType = loadingType
	}

	loading[ix] = true
	cartButtonText = 'Checkout Cart'
	isAddedtoBag = true
	try {
		await CartService.addToCartService({
			pid: pid,
			vid: pid,
			qty: qty,
			customizedImg: customizedImg || null,
			storeId: $page?.data?.storeId,
			origin: $page.data.origin
		})

		await invalidateAll()
	} catch (e) {
		console.log(e)
	} finally {
		loading[ix] = false
		selectedLoadingType = null
	}
}

$: innerWidth = 0
let responsiveWidth = 0
$: if (innerWidth >= 640) {
	responsiveWidth = innerWidth - 17
}
let productColors = [
	'bg-fuchsia-900',
	'bg-blue-900',
	'bg-green-900',
	'bg-stone-900',
	'bg-indigo-900',
	'bg-amber-900',
	'bg-lime-900',
	'bg-orange-900',
	'bg-teal-900',
	'bg-cyan-900',
	'bg-yellow-900',
	'bg-zinc-800'
]

let Splide
const options = {
	// autoHeight: true,
	pagination: false,
	arrows: false,
	rewind: true,
	heightRatio: 2,
	keyboard: true,
	accessibility: true,
	autoplay: false,
	lazy: true,
	height: 800,
	// type: 'slide',
	perPage: 1,
	direction: 'ttb'
}
onMount(async () => {
	if (browser) {
		cartStore.subscribe((value) => {
			cart = value
		})
	}

	const SplideModule = await import('$lib/components/SplideJs.svelte')
	Splide = SplideModule.default

	const isMobile = window.innerWidth < 768 // set your preferred breakpoint here

	options.arrows = !isMobile
})

function handleMuted(e, ix) {
	showMuteButton = !showMuteButton
	isMuted = !isMuted
}

function handleClick(e) {
	const video = e.target
	if (video.muted) {
		video.muted = false // Unmute the video
	} else {
		video.muted = true // Mute the video
	}
}

function handleMove(e) {
	// console.log(e)

	const ix = e.detail.index
	const preIX = e.detail.prev
	const vID = document.querySelector(`#active${ix}`)
	const vID2 = document.querySelector(`#active${preIX}`)

	if (vID) {
		vID.play()
		// showMuteButton[ix] = true
	}

	// console.log(vID.paused)

	if (vID2) {
		vID2.pause()
		// showMuteButton[preIX] = false
	}

	// console.log('Paused video', vID, 'Played Video', vID2, showMuteButton)
}
</script>

<svelte:window bind:innerWidth />

{#if products}
	<div class="overflow-hidden">
		<svelte:component this="{Splide}" {options} on:handleMove="{(e) => handleMove(e)}">
			{#each products as product, ix (product.id)}
				<SplideSlide>
					<div class="w-full h-full flex">
						<!-- svelte-ignore a11y-media-has-caption -->
						<video autoplay id="active{ix}" class="detail w-full" muted="{isMuted}" loop>
							<source src="{product.video}" type="video/mp4" />
							Your browser does not support the video tag.
						</video>

						<div class="flex absolute top-[69%] ml-[0.5rem] bg-white h-40 rounded-lg">
							<div class="flex-auto w-12 mt-4 mx-1">
								<img src="{product.img}" alt="product" />
							</div>

							<div class="flex-auto">
								<div class="w-60 h-40">
									<p
										class="text-left mt-4 text-base font-bold text-black truncate group-hover:font-semibold sm:text-base">
										{product.name}
									</p>

									<p class="sku text-left mt-1 text-xs font-bold text-slate-600 sm:text-base">
										{product.sku}
									</p>

									<div class="flex flex-wrap gap-2">
										<div>
											<p class="price-tag text-left text-xs font-bold text-black sm:text-base">
												Rs.{product.price}
											</p>
										</div>

										<div>
											<p class="mrp-tag text-left text-xs font-bold text-slate-700 sm:text-base">
												<strike> Rs.{product.mrp}</strike>
											</p>
										</div>

										<div>
											<p class="discount-tag text-xs font-semibold text-amber-500 sm:text-base">
												({product.discount}%) Off
											</p>
										</div>
									</div>

									{#if isAddedtoBag === true}
										<a href="/cart">
											<button
												class="absolute rounded-lg mt-2 w-[280px] left-2 h-12 bg-black text-white">
												{cartButtonText}
											</button>
										</a>
									{:else}
										<form
											id="add_to_cart_1"
											in:fade="{{ duration: 300 }}"
											action="/cart?/add"
											method="POST"
											use:enhance="{() => {
												return async ({ result }) => {
													// console.log('result of add to cart', result)
													updateCartStore({ data: result.data })
													cartButtonText = 'Added To Cart'
													isAddedtoBag = true
													// if (result?.data === 'choose variant') {
													// 	scrollTo('variants_list')
													// 	toast('Please choose a variant', 'warning')
													// 	wiggleVariants = true

													// 	setTimeout(() => {
													// 		wiggleVariants = false
													// 	}, 820)
													// 	return
													// }
													// result?.data?.qty < 0
													// 	? fireGTagEvent('remove_from_cart', result?.data)
													// 	: fireGTagEvent('add_to_cart', result?.data)
													// cartButtonText = 'Added To Cart'
													// bounceItemFromTop = true
													// setTimeout(() => {
													// 	bounceItemFromTop = false
													// 	cartButtonText = 'Add to Bag'
													// }, 3000)
													// cartButtonText = 'Go to Cart'
													// if (customizedImg) {
													// 	goto(`/checkout/address`)
													// }
													// await getCartFromStore({
													// 	origin,
													// 	storeId: $page.data.store.id,
													// 	cartId: $page.data.cartId,
													// 	forceUpdate: true
													// })
													// await invalidateAll()
													await applyAction(result)
												}
											}}">
											<input type="hidden" name="pid" value="{product.id || null}" />

											<input type="hidden" name="vid" value="{product.id || null}" />

											<!-- <input
													type="hidden"
													name="variantsLength"
													value="{product?.variants?.length || null}" />

												<input type="hidden" name="currentVariantId" value="{product?.currentVariantId || null}" />

												<input
													type="hidden"
													name="linkedItems"
													value="{JSON.stringify(product?.selectedLinkiedProducts) || null}" /> -->

											<input type="hidden" name="qty" value="{1}" />

											<!-- <input
													type="hidden"
													name="options"
													value="{JSON.stringify(selectedOptions1) || null}" />

												<input type="hidden" name="customizedImg" value="{customizedImg || null}" /> -->

											<PrimaryButton
												type="submit"
												loading="{loadingg}"
												loadingringsize="sm"
												class="w-full text-sm">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													class="h-5 w-5 shrink-0"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
													stroke-width="2">
													<path
														stroke-linecap="round"
														stroke-linejoin="round"
														d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z">
													</path>
												</svg>

												<span>
													{cartButtonText}
												</span>
											</PrimaryButton>
										</form>
									{/if}
								</div>
							</div>
						</div>
					</div>
					<div class="btn-group absolute inset-y-0 right-5 top-20">
						<ul class="btn-group">
							<li>
								<button
									class="btn-group-fb my-2 py-4 px-4 mx-3 bg-current rounded-full h-13 w-13"
									on:click="{(e) => handleMuted(e, ix)}">
									{#if !showMuteButton}
										<svg
											height="28px"
											width="28px"
											version="1.1"
											id="Layer_1"
											xmlns="http://www.w3.org/2000/svg"
											xmlns:xlink="http://www.w3.org/1999/xlink"
											viewBox="0 0 496.159 496.159"
											xml:space="preserve"
											fill="#000000"
											><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g
												id="SVGRepo_tracerCarrier"
												stroke-linecap="round"
												stroke-linejoin="round"></g
											><g id="SVGRepo_iconCarrier">
												<path
													style="fill:#E04F5F;"
													d="M496.159,248.085c0-137.023-111.07-248.082-248.076-248.082C111.071,0.003,0,111.063,0,248.085 c0,137.001,111.07,248.07,248.083,248.07C385.089,496.155,496.159,385.086,496.159,248.085z"
												></path>
												<g>
													<path
														style="fill:#FFFFFF;"
														d="M284.828,128.917c-3.409-1.851-7.559-1.688-10.813,0.425l-95.137,61.791h-35.164 c-5.845,0-10.583,4.738-10.583,10.582v92.728c0,5.845,4.738,10.583,10.583,10.583h35.164l95.137,61.79 c1.748,1.135,3.754,1.708,5.765,1.708c1.733,0,3.471-0.426,5.049-1.283c3.41-1.852,5.534-5.42,5.534-9.301V138.218 C290.363,134.338,288.239,130.768,284.828,128.917z"
													></path>
													<path
														style="fill:#FFFFFF;"
														d="M319.82,322.937c0.894,0,1.801-0.162,2.685-0.504c24.239-9.412,40.524-38.49,40.524-72.361 c0-29.956-13.2-57.047-33.63-69.018c-3.534-2.072-8.08-0.883-10.153,2.652c-2.072,3.535-0.885,8.082,2.651,10.152 c15.971,9.358,26.291,31.424,26.291,56.213c0,27.36-12.77,51.426-31.055,58.525c-3.82,1.482-5.715,5.783-4.231,9.604 C314.041,321.139,316.847,322.937,319.82,322.937z"
													></path>
												</g>
											</g></svg>
									{:else}
										<svg
											height="28px"
											width="28px"
											version="1.1"
											id="Layer_1"
											xmlns="http://www.w3.org/2000/svg"
											xmlns:xlink="http://www.w3.org/1999/xlink"
											viewBox="0 0 496.159 496.159"
											xml:space="preserve"
											fill="#000000"
											><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g
												id="SVGRepo_tracerCarrier"
												stroke-linecap="round"
												stroke-linejoin="round"></g
											><g id="SVGRepo_iconCarrier">
												<path
													style="fill:#E04F5F;"
													d="M496.159,248.086c0-137.022-111.07-248.082-248.076-248.082C111.071,0.004,0,111.063,0,248.086 c0,137.001,111.07,248.07,248.083,248.07C385.089,496.155,496.159,385.086,496.159,248.086z"
												></path>
												<g>
													<path
														style="fill:#FFFFFF;"
														d="M259.432,128.917c-3.409-1.851-7.559-1.688-10.813,0.425l-95.137,61.791h-35.164 c-5.845,0-10.583,4.738-10.583,10.582v92.728c0,5.845,4.738,10.583,10.583,10.583h35.164l95.137,61.79 c1.748,1.135,3.754,1.708,5.765,1.708c1.733,0,3.471-0.426,5.049-1.283c3.41-1.852,5.534-5.42,5.534-9.301V138.219 C264.966,134.339,262.842,130.768,259.432,128.917z"
													></path>
													<path
														style="fill:#FFFFFF;"
														d="M355.405,248.079l30.384-30.384c3.515-3.516,3.515-9.213,0-12.729 c-3.515-3.514-9.213-3.514-12.728,0l-30.384,30.385l-30.384-30.385c-3.515-3.514-9.213-3.514-12.728,0 c-3.515,3.516-3.515,9.213,0,12.729l30.385,30.384l-30.384,30.384c-3.515,3.516-3.515,9.213,0,12.729 c1.757,1.757,4.061,2.636,6.364,2.636c2.303,0,4.606-0.879,6.364-2.636l30.384-30.385l30.384,30.385 c1.757,1.757,4.061,2.636,6.364,2.636c2.303,0,4.606-0.879,6.364-2.636c3.515-3.516,3.515-9.213,0-12.729L355.405,248.079z"
													></path>
												</g>
											</g></svg>
									{/if}
								</button>
							</li>
							<li>
								<button class="btn-group-fb my-2 py-4 px-4 mx-3 bg-current rounded-full h-13 w-13">
									<img
										class="w-7 h-7 m-0 p-0 mx-0 my-0"
										src="https://www.svgrepo.com/show/231105/like.svg"
										alt="like" />
								</button>
							</li>
							<li>
								{#if isAddedtoBag === true}
									<a href="/cart">
										<button
											class="btn-group-fb relative my-2 py-4 px-4 mx-3 bg-current rounded-full h-13 w-13">
											<img
												class="w-7 h-7 m-0"
												src="https://www.svgrepo.com/show/452178/cart.svg"
												alt="cart" />

											{#if cart?.qty > 0}
												<div
													class="absolute -top-2 -right-1.5 flex items-center justify-center rounded-full bg-primary-500 py-[0.8px] px-[5px] text-center text-xs font-bold uppercase text-white">
													{cart.qty}
												</div>
											{/if}
										</button></a>
								{:else}
									<form
										id="add_to_cart_1"
										in:fade="{{ duration: 300 }}"
										action="/cart?/add"
										method="POST"
										use:enhance="{() => {
											return async ({ result }) => {
												updateCartStore({ data: result.data })
												// console.log('result of add to cart', result)
												// if (result?.data === 'choose variant') {
												// 	scrollTo('variants_list')
												// 	toast('Please choose a variant', 'warning')
												// 	wiggleVariants = true

												// 	setTimeout(() => {
												// 		wiggleVariants = false
												// 	}, 820)
												// 	return
												// }
												// result?.data?.qty < 0
												// 	? fireGTagEvent('remove_from_cart', result?.data)
												// 	: fireGTagEvent('add_to_cart', result?.data)
												cartButtonText = 'Added To Cart'
												isAddedtoBag = true
												// bounceItemFromTop = true
												// setTimeout(() => {
												// 	bounceItemFromTop = false
												// 	cartButtonText = 'Add to Bag'
												// }, 3000)
												// cartButtonText = 'Go to Cart'
												// if (customizedImg) {
												// 	goto(`/checkout/address`)
												// }
												// await invalidateAll()
												await applyAction(result)
											}
										}}">
										<input type="hidden" name="pid" value="{product.id || null}" />

										<input type="hidden" name="vid" value="{product.id || null}" />

										<!-- <input
													type="hidden"
													name="variantsLength"
													value="{product?.variants?.length || null}" />

												<input type="hidden" name="currentVariantId" value="{product?.currentVariantId || null}" />

												<input
													type="hidden"
													name="linkedItems"
													value="{JSON.stringify(product?.selectedLinkiedProducts) || null}" /> -->

										<input type="hidden" name="qty" value="{1}" />

										<button
											class="btn-group-fb relative my-2 py-4 px-4 mx-3 bg-current rounded-full h-13 w-13">
											<img
												class="w-7 h-7"
												src="https://www.svgrepo.com/show/452178/cart.svg"
												alt="cart" />

											{#if cart?.qty > 0}
												<div
													class="absolute -top-2 -right-1.5 flex items-center justify-center rounded-full bg-primary-500 py-[0.8px] px-[5px] text-center text-xs font-bold uppercase text-white">
													{cart.qty}
												</div>
											{/if}
										</button>
									</form>
								{/if}
							</li>
							<li>
								<button
									class="btn-group-fb my-2 py-4 px-4 mx-3 bg-current rounded-full h-13 w-13"
									on:click="{() =>
										share({ title: product.name, text: product.description, url: product.slug })}">
									<img
										class="w-7 h-7"
										src="https://www.svgrepo.com/show/103057/share.svg"
										alt="share" />
								</button>
							</li>
							<li class="btn-group-list my-2 py-4 px-4 mx-3 bg-current rounded-full h-13 w-13">
								<a href="whatsapp://send?text={$page.data.origin}/product/{product.slug}">
									<img
										class="w-7 h-7"
										src="https://www.svgrepo.com/show/475692/whatsapp-color.svg"
										alt="wp" /></a>
							</li>
						</ul>
					</div>
				</SplideSlide>
			{/each}
		</svelte:component>

		<!-- - {#each products as product, ix}
			<video src="{product.video}" on:click="{(e) => handleClick(e, ix)}" autoplay muted loop>
			</video>
		{/each} -->
	</div>
{/if}
