<style>
.dashes {
	border-top: dashed 1px;
}
</style>

<script lang="ts">
export let selected = null
</script>

<section class=" flex flex-wrap justify-center">
	<div
		class=" flex w-full justify-between text-center text-xs font-semibold tracking-widest text-zinc-800 md:w-2/3 lg:w-1/3">
		<a
			href="/cart"
			aria-label="Click to go inside cart"
			class="mx-2 flex flex-col"
			data-sveltekit-preload-data>
			<div
				class="mx-auto flex h-8 w-8 items-center justify-center rounded-full border border-primary-500 text-center {selected ===
				'cart'
					? 'bg-primary-500  text-white'
					: 'bg-white text-primary-500 '}">
				1
			</div>

			<div class="mt-1 text-primary-500">Cart</div>
		</a>

		<hr class="dashes mx-3 my-4 flex-1 text-primary-500" />

		<!-- {#if isPrescription}
			{#if selected == 'prescription'}
				<div class="flex flex-col items-center text-center">
					<div
						class="mx-auto flex h-8 w-8 items-center justify-center  rounded-full border border-primary-500 text-center
						{selected === 'prescription' ? 'bg-primary-500  text-white' : 'bg-white text-primary-500  '}">
						2
					</div>

					<span class="mt-1 text-center text-primary-500">Prescription</span>
				</div>
			{:else}
				<a href="/products/cart/prescription" aria-label="Click to go inside prescription" class="flex flex-col items-center text-center">
					<div
						class="mx-auto flex h-8 w-8 items-center justify-center  rounded-full border border-primary-500 text-center
						{selected === 'prescription' ? 'bg-primary-500  text-white' : 'bg-white text-primary-500'}">
						2
					</div>

					<span class="mt-1 text-center text-primary-500">Prescription</span>
				</a>
			{/if}

			<hr class="dashes mx-3 my-4 flex-1 text-primary-500" />
		{/if} -->

		{#if selected == 'address'}
			<div class="flex flex-col items-center text-center">
				<div
					class="mx-auto flex h-8 w-8 items-center justify-center rounded-full border border-primary-500 text-center {selected ===
					'address'
						? 'bg-primary-500  text-white'
						: 'bg-white text-primary-500  '}">
					<!-- {#if isPrescription}
						3
					{:else}
						2
					{/if} -->
					2
				</div>

				<span class="mt-1 text-center text-primary-500">Address</span>
			</div>
		{:else}
			<a
				href="/checkout/address"
				aria-label="Click to go inside address"
				class="flex flex-col items-center text-center">
				<div
					class="mx-auto flex h-8 w-8 items-center justify-center rounded-full border border-primary-500 text-center {selected ===
					'address'
						? 'bg-primary-500  text-white'
						: 'bg-white text-primary-500'}">
					<!-- {#if isPrescription}
						3
					{:else}
						2
					{/if} -->
					2
				</div>

				<span class="mt-1 text-center text-primary-500">Address</span>
			</a>
		{/if}

		<hr class="dashes mx-3 my-4 flex-1 text-primary-500" />

		{#if selected == 'payment'}
			<div class="flex flex-col items-center text-center">
				<div
					class="mx-auto flex h-8 w-8 items-center justify-center rounded-full border border-primary-500 text-center {selected ===
					'payment'
						? 'bg-primary-500  text-white '
						: 'bg-white text-primary-500 '}">
					<!-- {#if isPrescription}
						4
					{:else}
						3
					{/if} -->
					3
				</div>

				<span class="mt-1 text-center text-primary-500">Payment</span>
			</div>
		{:else}
			<div class="flex flex-col items-center text-center">
				<div
					class="mx-auto flex h-8 w-8 items-center justify-center rounded-full border border-primary-500 text-center {selected ===
					'payment'
						? 'bg-primary-500  text-white'
						: 'bg-white text-primary-500'}">
					<!-- {#if isPrescription}
						4
					{:else}
						3
					{/if} -->
					3
				</div>

				<span class="mt-1 text-center text-primary-500">Payment</span>
			</div>
		{/if}
	</div>
</section>
