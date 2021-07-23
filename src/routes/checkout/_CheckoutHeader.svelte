<style>
.dashes {
	border-top: dashed 1px;
}
</style>

<script>
export let selected = null
</script>

<section class=" flex flex-wrap justify-center">
	<div
		class=" flex justify-between  w-full text-xs font-semibold tracking-widest text-center text-gray-700 md:w-2/3 lg:w-1/3">
		<a href="/cart" class="flex flex-col mx-2">
			<div
				class="flex items-center justify-center w-8 h-8 mx-auto  text-center bg-white border rounded-full border-primary-500 {selected ===
				'cart'
					? 'bg-primary-500  text-white'
					: 'bg-white text-primary-500 '}">
				1
			</div>

			<div class="mt-1 text-primary-500">Cart</div>
		</a>

		<hr class="flex-1 mx-3 my-4 dashes text-primary-500" />

		{#if selected == 'address'}
			<div class="flex flex-col items-center text-center">
				<div
					class="flex items-center justify-center w-8 h-8 mx-auto  text-center bg-white border rounded-full border-primary-500 {selected ===
					'address'
						? 'bg-primary-500  text-white'
						: 'bg-white text-primary-500  '}">
					2
				</div>

				<span class="mt-1 text-center text-primary-500">Address</span>
			</div>
		{:else}
			<a href="/checkout/address" class="flex flex-col items-center text-center">
				<div
					class="flex items-center justify-center w-8 h-8 mx-auto  text-center bg-white border rounded-full border-primary-500 {selected ===
					'address'
						? 'bg-primary-500  text-white'
						: 'bg-white text-primary-500'}">
					2
				</div>

				<span class="mt-1 text-center text-primary-500">Address</span>
			</a>
		{/if}

		<hr class="flex-1 mx-3 my-4 dashes text-primary-500" />

		{#if selected == 'payment'}
			<div class="flex flex-col items-center text-center">
				<div
					class="flex items-center justify-center w-8 h-8 mx-auto  text-center bg-white border rounded-full border-primary-500 {selected ===
					'payment'
						? 'bg-primary-500  text-white '
						: 'bg-white text-primary-500 '}">
					3
				</div>

				<span class="mt-1 text-center text-primary-500">Payment</span>
			</div>
		{:else}
			<div class="flex flex-col items-center text-center">
				<div
					class="flex items-center justify-center w-8 h-8 mx-auto  text-center bg-white border rounded-full border-primary-500 {selected ===
					'payment'
						? 'bg-primary-500  text-white'
						: 'bg-white text-primary-500'}">
					3
				</div>

				<span class="mt-1 text-center text-primary-500">Payment</span>
			</div>
		{/if}
	</div>
</section>
