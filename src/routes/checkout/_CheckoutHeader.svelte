<style>
.dashes {
	border-top: dashed 1px;
}
</style>

<script>
export const selected = null
let className =
	' flex items-center justify-center w-8 h-8 mx-auto font-normal text-center bg-white border rounded-full border-primary-500'

{
	selected == 'cart' ? 'bg-primary-500  text-white' : 'bg-white text-primary-500'
}

{
	selected == 'address' ? 'bg-primary-500  text-white' : 'bg-white text-primary-500'
}

{
	selected == 'payment'
		? 'bg-white text-primary-500 font-normal'
		: 'bg-primary-500  text-white font-semibold'
}
</script>

<div class=" flex flex-wrap justify-center p-2 px-5 md:mt-10 xl:mt-20 lg:px-8 lg:pb-4">
	<div class="mt-2 order-0 lg:order-0"></div>

	<div
		class=" flex justify-between order-2 w-full pt-3 text-xs font-bold tracking-widest text-center text-gray-700 lg:order-1 lg:w-1/3">
		<a href="/cart" class="flex flex-col mx-2">
			<div class="{className}">1</div>

			<div class="mt-1 text-primary-500">Cart</div>
		</a>

		<hr class="flex-1 mx-3 my-4 dashes text-primary-500" />

		{#if selected == 'cart'}
			<div class="flex flex-col items-center text-center">
				<div class="{className}">2</div>

				<span class="mt-1 text-center text-primary-500">Address</span>
			</div>
		{:else}
			<a href="/checkout/address" class="flex flex-col items-center text-center">
				<div
					class=" flex items-center justify-center w-8 h-8 font-normal text-center border rounded-full border-primary-500">
					2
				</div>

				<span class="mt-1 text-center text-primary-500">Address</span>
			</a>
		{/if}

		<hr class="flex-1 mx-3 my-4 dashes text-primary-500" />

		<div class="items-center text-center">
			<div class="{className}">3</div>

			<span class="mt-1 text-center text-primary-500">Payment</span>
		</div>
	</div>
</div>
