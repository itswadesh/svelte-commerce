<script lang="ts">
import { onMount } from 'svelte'
import { SplideSlide } from '@splidejs/svelte-splide'
import LazyImg from '$lib/components/Image/LazyImg.svelte'
import { currency } from '$lib/utils'
import { currencySymbol } from '$lib/config'
import { CartService } from '$lib/services'
import { page } from '$app/stores'
import { invalidateAll } from '$app/navigation'
import { dataset_dev } from 'svelte/internal'


export let products = []
export let title = ''


let autoplay = true

let imgUrl = ''
let imgUnmute = 'https://filebin.net/xe3w7kf6nzuu1ta4/unmute.svg'
let imgMute = 'https://filebin.net/fqn93tp24gijqgou/mute.svg'


let cartButtonText = 'Add to Bag'
let loading = {}
let selectedLoadingType = null

let muted = true


function handleMute({ix}) {
	if(muted){
	muted = false;
   } else {
	muted = true;
   }
   console.log(ix);
}




const addToCart = async ({ pid, qty, customizedImg, ix, loadingType }: any) => {
	if (loadingType) {
		selectedLoadingType = loadingType
	}
	
	
	loading[ix] = true
	cartButtonText = 'Added to Cart'
	await CartService.addToCartService({
		pid: pid,
		vid: pid,
		qty: qty,
		customizedImg: customizedImg || null,
		storeId: $page.data.store?.id,
		origin: $page.data.origin
	})

	await invalidateAll()

	loading[ix] = false
	selectedLoadingType = null
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
	pagination: false,
	arrows: false,
	autoplay: true,
	lazy: true,
	height: 800,
	type: 'loop',
	perPage: 1,
	direction: 'ttb'
}
onMount(async () => {
	const SplideModule = await import('$lib/components/SplideJs.svelte')
	Splide = SplideModule.default
	const isMobile = window.innerWidth < 768 // set your preferred breakpoint here

	options.arrows = !isMobile
})
</script>

<svelte:window bind:innerWidth="{innerWidth}" />

{#if products}
	<div class="overflow-hidden">
		<svelte:component this="{Splide}" options="{options}">
			{#each products as product, ix}
				<SplideSlide>
					<div class="w-full h-full">
								
						<!-- svelte-ignore a11y-media-has-caption -->
						<video autoplay="{true}" id="active{ix}" class="detail" loop muted="{muted}">
							<source src="{product.video}" type="video/mp4" />
						</video>


						
						<div class="flex absolute top-[54%] ml-6  bg-white h-40 rounded-lg">
							<div class="flex-auto w-12 mt-4 mx-1">
								<img src="{product.img}" alt="product">
							</div>
							<div class="flex-auto">
								<div class="w-60 h-40">
									<p class="text-left mt-4 text-base font-bold text-black truncate group-hover:font-semibold sm:text-base">
										{product.name}
									</p>
									<p class="sku text-left mt-1 text-base font-bold text-slate-600 sm:text-base">{product.sku}</p>
								<div class="flex flex-wrap gap-2">
									<div>
										<p class="price-tag text-left text-base font-bold text-black sm:text-base">
											Rs.{product.price}
										</p>
									</div>
									<div>
										<p class="mrp-tag  text-left text-base font-bold text-slate-700 sm:text-base">
											<strike> Rs.{product.mrp}</strike>
										</p>
									</div>
									<div>
										<p class="discount-tag text-base font-semibold text-amber-500 sm:text-base">
											({product.discount}%) Off
										</p>
									</div>
								</div>

									<button class=" absolute rounded-lg mt-2 w-[280px] left-2 h-12 bg-black text-white" on:click="{() =>
															addToCart({
																pid: product.id,
																qty: +1,
																customizedImg: product.customizedImg,
																ix: ix
															})}"> {cartButtonText} </button>
								</div>
								
							</div>
						</div>
					</div>
					<div class="btn-group absolute inset-y-0 right-0 top-20">
						<ul class="btn-group">
							<li>
								<button class="btn-group-fb opacity-50 my-2 py-4 px-4 mx-3 bg-current rounded-full h-13 w-13" on:click={()=>handleMute({ix: ix})}>
								   {#if muted}
								      <img src="{imgMute}" alt="mute" />
									 {:else}
								   <img src="{imgUnmute}" alt="unmute" />
								  {/if}
								
								</button>
							</li>
							<li
								class="btn-group-fb opacity-50 my-2 py-4 px-4 mx-3 bg-current rounded-full h-13 w-13">
								<img src="https://filebin.net/9mzp2tdfrtgsiuck/like.svg" alt="like" />
							</li>
							<li>
				
								<button class="btn-group-fb relative opacity-50 my-2 py-4 px-4 mx-3 bg-current rounded-full h-13 w-13" on:click="{() =>
															addToCart({
																pid: product.id,
																qty: +1,
																customizedImg: product.customizedImg,
																ix: ix
															})}">
								<img src="https://filebin.net/9mzp2tdfrtgsiuck/cart.svg" alt="cart" />
				
								{#if $page.data.cartQty > 0}
					<div
						class="absolute -top-2 -right-1.5 flex items-center justify-center rounded-full bg-primary-500 py-[0.8px] px-[5px] text-center text-xs font-bold uppercase text-white">
						{$page.data.cartQty}
					</div>
				{/if}
						      </button>
							</li>
							<li>
								<button class="btn-group-fb opacity-50 my-2 py-4 px-4 mx-3 bg-current rounded-full h-13 w-13">
								<img src="https://filebin.net/9mzp2tdfrtgsiuck/share.svg" alt="share" />
							</button>
							<li
								class="btn-group-list opacity-50 my-2 py-4 px-4 mx-3 bg-current rounded-full h-13 w-13">
								<a href="whatsapp://send?text={$page.data.origin}/product/{product.slug}">
								<img src="https://filebin.net/9mzp2tdfrtgsiuck/wpapp.svg" alt="wp" /></a>
							</li>
						</ul>
					</div>
				</SplideSlide>
			{/each}
		</svelte:component>
	</div>
{/if}
