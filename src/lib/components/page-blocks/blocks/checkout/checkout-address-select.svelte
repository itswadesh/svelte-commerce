<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js'
	import { Checkbox } from '$lib/components/ui/checkbox/index.js'
	import { Skeleton } from '$lib/components/ui/skeleton/index.js'
	import { showAuthModal } from '$lib/core/components/index.js'
	import { MapPin } from '@lucide/svelte'
	import { AddressModule } from '@misiki/kitcommerce-core/composables'
	import { getContext } from 'svelte'

	const { block } = $props()

	const addressModule: InstanceType<typeof AddressModule> = getContext('checkout-address-module')

	const cartState = addressModule.cartState
	const userState = addressModule.userState

	const isEmailOk = $derived(addressModule.isEmailOk)
	const isPhoneOk = $derived(addressModule.isPhoneOk)
</script>

<!-- Shipping Address -->
{#if isEmailOk && isPhoneOk}
	<div class="overflow-hidden rounded-lg border border-border bg-background shadow-sm">
		{#if cartState.cart.shippingAddress}
			<div class="">
				<div class="flex items-center justify-between border-b border-border px-5 py-4">
					<h2 class="text-base font-bold uppercase text-gray-900" style="font-family: 'Montserrat', sans-serif;">Delivery Address</h2>
					{#if !addressModule.loadingForSaveToCart}
						<Button onclick={addressModule.handleAddressChangeClick} variant="ghost" class="h-8">Change</Button>
					{/if}
				</div>
				{#if addressModule.loadingForSaveToCart && addressModule.currentAddressType == 'shipping'}
					<div class="p-6">
						<Skeleton class="h-[100px] w-full rounded-lg" />
					</div>
				{:else}
					<div class="p-6 transition-all duration-500">
						<div class="mb-4 flex items-center">
							<MapPin class="mr-2 h-4 w-4 text-primary" />
							<h3 class="text-sm font-bold uppercase tracking-tight text-gray-900">
								{cartState.cart.shippingAddress?.firstName}
								{cartState.cart.shippingAddress?.lastName}
							</h3>
						</div>
						<div class="space-y-1 text-sm leading-relaxed text-gray-600">
							<p>{cartState.cart.shippingAddress?.address_1}</p>
							{#if cartState.cart.shippingAddress?.address_2}
								<p>{cartState.cart.shippingAddress?.address_2}</p>
							{/if}
							<p>
								{cartState.cart.shippingAddress?.city}, {cartState.cart.shippingAddress?.state}
							</p>
							<p>
								{cartState.cart.shippingAddress?.countryCode}
								{cartState.cart.shippingAddress?.zip}
							</p>
							<p class="mt-4 border-border pt-4 font-medium">
								<span class="mr-2 text-[10px] font-bold uppercase tracking-tighter text-gray-400">Phone</span>
								{cartState.cart.shippingAddress?.phone}
							</p>
						</div>
					</div>
				{/if}
			</div>
		{:else}
			<div class="p-6">
				<div class="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
					<h2 class="text-base font-bold uppercase tracking-widest text-gray-900" style="font-family: 'Montserrat', sans-serif;">Shipping Address</h2>

					{#if !userState?.user?.role}
						<Button variant="link" onclick={() => showAuthModal('login')} class="h-auto p-0">Login to view saved addresses</Button>
					{/if}
				</div>
				<form class="">
					{#if addressModule.loadingForSaveToCart && addressModule.currentAddressType == 'shipping'}
						<Skeleton class="h-[100px] w-full rounded-lg" />
					{:else}
						<div
							class="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50 py-8 text-center transition-all duration-300 hover:bg-gray-100/50"
						>
							<p class="mb-6 text-sm text-gray-500">No shipping address selected</p>
							<Button type="button" variant="default" class="px-8" onclick={addressModule.handleAddNewAddress}>Add New Address</Button>
						</div>
					{/if}
				</form>
			</div>
		{/if}
	</div>

	{#if !addressModule.isBillingAddressSameAsShipping}
		<div class="overflow-hidden rounded-lg border border-border bg-background shadow-sm transition-all duration-300">
			<div class="">
				<div class="flex items-center justify-between border-b border-border px-5 py-4">
					<h2 class="text-base font-bold uppercase text-gray-900" style="font-family: 'Montserrat', sans-serif;">Billing Address</h2>
					{#if !addressModule.loadingForSaveToCart}
						<Button onclick={addressModule.handleBilingAddOrChangeClick} variant="ghost" class="h-8">
							{#if cartState.cart.billingAddress?.address_1}
								Change
							{:else}
								Add Address
							{/if}
						</Button>
					{/if}
				</div>
				{#if addressModule.loadingForSaveToCart && addressModule.currentAddressType == 'billing'}
					<div class="p-6">
						<Skeleton class="h-[100px] w-full rounded-lg" />
					</div>
				{:else if cartState.cart?.billingAddress?.address_1}
					<div class="p-6 transition-all duration-500">
						<div class="mb-4 flex items-center">
							<MapPin class="mr-2 h-4 w-4 text-primary" />
							<h3 class="text-sm font-bold uppercase tracking-tight text-gray-900">
								{cartState.cart.billingAddress?.firstName}
								{cartState.cart.billingAddress?.lastName}
							</h3>
						</div>
						<div class="space-y-1 text-sm leading-relaxed text-gray-600">
							<p>{cartState.cart.billingAddress?.address_1}</p>
							{#if cartState.cart.billingAddress?.address_2}
								<p>{cartState.cart.billingAddress?.address_2}</p>
							{/if}
							<p>{cartState.cart.billingAddress?.city}, {cartState.cart.billingAddress?.state}</p>
							<p>{cartState.cart.billingAddress?.countryCode} {cartState.cart.billingAddress?.zip}</p>
							<p class="mt-4 border-t border-gray-50 pt-4 font-medium">
								<span class="mr-2 text-[10px] font-bold uppercase tracking-tighter text-gray-400">Phone</span>
								{cartState.cart.billingAddress?.phone}
							</p>
						</div>
					</div>
				{:else}
					<div class="bg-gray-50 p-8 text-center transition-all duration-500">
						<p class="text-sm text-gray-500">No billing address saved.</p>
					</div>
				{/if}
			</div>
		</div>
	{/if}
	<div class="flex items-center justify-start gap-2 p-4 transition-all hover:bg-gray-100">
		<Checkbox
			checked={addressModule.isBillingAddressSameAsShipping}
			onCheckedChange={addressModule?.handleBillingAddressSameCheck}
			id="isBillingAddressSameAsShipping"
		/>
		<label for="isBillingAddressSameAsShipping" class="cursor-pointer text-xs font-bold uppercase tracking-tight text-gray-700"
			>Billing address same as shipping</label
		>
	</div>
{/if}
