<script>
import { post } from '$lib/util/api'
import { invalidateAll } from '$app/navigation'
import { page } from '$app/stores'
import { date, currency, delay, toast } from '$lib/util'
import LazyImg from '$lib/components/Image/LazyImg.svelte'
import PrimaryButton from '$lib/ui/PrimaryButton.svelte'

export let product = {}

let loading = false
let cartButtonText = 'Add to Bag'
let bounceItemFromTop = false

async function addToBag(p) {
	loading = true
	cartButtonText = 'Adding...'

	try {
		await post('carts/add-to-cart', {
			pid: p._id,
			vid: p._id,
			qty: 1,
			options: p.options
		})

		await invalidateAll() //$page.url.toString()
		cartButtonText = 'Go to cart'
	} catch (e) {
		cartButtonText = 'Error adding To Cart'
	} finally {
		loading = false
		await delay(5000)
		cartButtonText = 'Add to bag'
		bounceItemFromTop = false
	}
}
</script>

<div class="group relative col-span-1 block w-full overflow-hidden sm:w-48 sm:flex-shrink-0">
	<a href="/product/{product.slug}" target="_blank" rel="noopener noreferrer">
		<div class="mb-2 h-40 overflow-hidden">
			<img
				src="{product.imgCdn}"
				alt="{product.name}"
				width="208"
				height="240"
				class="h-full w-full object-contain object-bottom" />
		</div>

		<div class="flex flex-col gap-1">
			<!-- Brand -->

			{#if product.brand?.name}
				<h6 class="ext-lg sm:text-xl"><b>{product.brand?.name}</b></h6>
			{/if}

			<!-- Name -->

			{#if product.name}
				<p
					class="truncate text-sm text-gray-500 group-hover:text-blue-600 group-hover:underline sm:text-base">
					{product.name}
				</p>
			{/if}

			<!-- prices -->

			<div class="flex items-center gap-2">
				<span class="text-sm"><b>{product.formattedPrice}</b></span>

				{#if product.formattedMrp > product.formattedPrice}
					<span class="text-xs">
						<strike>{product.formattedMrp}</strike>
					</span>
				{/if}

				{#if ((product.formattedMrp - product.formattedPrice) / product.formattedMrp) * 100 > 0}
					<span class="text-xs">
						({((product.formattedMrp - product.formattedPrice) / product.formattedMrp) * 100}%)
					</span>
				{/if}
			</div>
		</div>
	</a>

	<div class="mx-auto mt-2 max-w-max">
		{#if cartButtonText === 'Go to cart'}
			<a
				class="relative flex w-full transform items-center justify-center overflow-hidden rounded-full border border-primary-500 bg-primary-500 px-4 py-2 text-center text-xs font-semibold tracking-wider text-white shadow-md transition duration-700 hover:border-primary-700 hover:bg-primary-700 focus:outline-none focus:ring-0 focus:ring-offset-0"
				href="/cart"
				data-sveltekit-prefetch>
				{cartButtonText}
			</a>
		{:else}
			<PrimaryButton
				type="button"
				loading="{loading}"
				loadingringsize="xs"
				roundedFull
				class="text-xs"
				on:click="{() => addToBag(product)}">
				<span>
					{cartButtonText}
				</span>
			</PrimaryButton>
		{/if}
	</div>
</div>
