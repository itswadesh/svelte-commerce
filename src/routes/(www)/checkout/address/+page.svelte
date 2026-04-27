<script lang="ts">
	import { Button } from '$lib/components/ui/button'
	import { goto } from '$app/navigation'
	import { ChevronRight, LoaderCircle, LockKeyhole, MapPin, Pencil, ShoppingBag, Truck } from '@lucide/svelte'
	import { formatPrice } from '$lib/core/utils'
	import LoadingDots from '$lib/core/components/common/loading-dots.svelte'
	import AddressListModal from '$lib/components/address/address-list-modal.svelte'
	import AddressFormModal from '$lib/components/address/address-form-modal.svelte'
	import { page } from '$app/state'
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte'
	import { Skeleton } from '$lib/components/ui/skeleton'
	import OrderTrustBadges from '$lib/core/components/plugins/order-trust-badges.svelte'
	import { showAuthModal } from '$lib/core/components/auth/auth-utils'
	import Textbox from '$lib/components/form/textbox.svelte'
	import { AddressModule, emptyAddress, checkoutAddressSchema as schemas } from '$lib/core/composables/index.js'
	import { z } from 'zod'
	import { appendOneTimeCartId } from '$lib/core/utils/index.js'

	const addressModule = new AddressModule()
	const cartState = addressModule.cartState
	const userState = addressModule.userState

	const isEmailOk = $derived(addressModule.isEmailOk)
	const isPhoneOk = $derived(addressModule.isPhoneOk)
</script>

<svelte:head>
	<title>Checkout - Address</title>
</svelte:head>

<div class="min-h-screen py-8">
	<div class="container mx-auto px-4">
		<!-- Checkout Progress -->
		<div class="mb-12">
			<div class="flex items-center justify-center space-x-4 sm:space-x-12">
				<button
					onclick={() => goto(appendOneTimeCartId('/checkout/cart'))}
					class="flex items-center text-gray-400 transition-colors hover:text-gray-900"
				>
					<div class="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 text-[11px] font-bold tracking-tight">1</div>
					<span class="ml-2 text-xs font-bold uppercase tracking-widest">Cart</span>
				</button>
				<div class="h-px w-8 bg-gray-200 sm:w-16"></div>
				<div class="flex items-center text-primary">
					<div class="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[11px] font-bold tracking-tight text-white">2</div>
					<span class="ml-2 text-xs font-bold uppercase tracking-widest">Address</span>
				</div>
				<div class="h-px w-8 bg-gray-200 sm:w-16"></div>
				<div class="flex items-center text-gray-400">
					<div class="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 text-[11px] font-bold tracking-tight">3</div>
					<span class="ml-2 text-xs font-bold uppercase tracking-widest">Payment</span>
				</div>
			</div>
		</div>

		{#await cartState.hasLoaded}
			<div class="flex min-h-96 items-center justify-center py-8">
				<LoaderCircle class="animate-spin" />
			</div>
		{:then}
			{#if addressModule.noItemsChecked && cartState?.cart?.lineItems?.length > 0}
				<div class="flex h-96 flex-col items-center justify-center gap-3">
					<p class="text-xl text-gray-400">You must select at least one item in cart for checkout</p>
					<Button variant="outline" href={appendOneTimeCartId('/checkout/cart')}>Go back to cart</Button>
				</div>
			{:else if cartState?.cart?.lineItems?.length === 0 && !cartState?.isUpdatingCart}
				<div class="flex h-96 flex-col items-center justify-center gap-3">
					<p class="text-xl text-gray-400">Your cart is empty</p>
					<Button variant="outline" href="/">Continue Shopping</Button>
				</div>
			{:else}
				<div class="grid gap-8 lg:grid-cols-[1fr_400px]">
					<!-- Left Column -->
					<div class="space-y-6">
						<!-- Contact Details -->
						{#await userState.hasLoaded then _}
							{#if (!isPhoneOk || !isEmailOk) && !userState.user?.userId}
								<p class="text-sm text-gray-600">
									<button
										class="cursor-pointer font-bold text-primary hover:underline"
										onclick={() => {
											showAuthModal('login')
										}}
									>
										Login
									</button> to autofill your details
								</p>
							{/if}
						{/await}
						<div class="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm">
							<div class="flex items-center justify-between border-b border-gray-50 px-5 py-4">
								<div class="flex items-center space-x-3">
									<h2 class="text-base font-bold uppercase tracking-widest text-gray-900" style="font-family: 'Montserrat', sans-serif;">
										Contact Details
									</h2>
								</div>
								{#if cartState.cart.email && !addressModule.editEmail && !userState.user?.userId}
									<Button
										onclick={addressModule.handleEditEmail}
										variant="ghost"
										size="sm"
										class="h-8 text-[10px] font-bold uppercase tracking-widest text-primary transition-all hover:bg-primary/5 active:scale-95"
									>
										<Pencil class="mr-1.5 h-3 w-3" />
										<span>Edit</span>
									</Button>
								{/if}
							</div>

							{#if isEmailOk && isPhoneOk && !addressModule.editEmail}
								<div class="grid grid-cols-1 gap-6 p-6 transition-all duration-500 sm:grid-cols-2">
									<div class="flex flex-col gap-1">
										<p class="text-[10px] font-bold uppercase tracking-tighter text-gray-400">Email Address</p>
										<p class="text-sm font-medium text-gray-900">{cartState.cart.email}</p>
									</div>
									<div class="flex flex-col gap-1">
										<p class="text-[10px] font-bold uppercase tracking-tighter text-gray-400">Phone Number</p>
										<p class="text-sm font-medium text-gray-900">{cartState.cart.phone}</p>
									</div>
								</div>
							{:else if !isEmailOk || !isPhoneOk || addressModule.editEmail}
								<form class="space-y-4 p-5 transition-all duration-500" onsubmit={addressModule.saveContactInfo}>
									<div class="space-y-1">
										<label for="email" class="block text-sm font-medium text-gray-700">
											Email address {#if !addressModule.isEmailRequired}<span class="text-gray-400">(optional)</span>{/if}
										</label>
										<Textbox
											type="email"
											bind:value={addressModule.email}
											required={addressModule.isEmailRequired}
											class="w-full"
											schema={schemas.email}
											placeholder="your@email.com"
										/>
										<p class="mt-1 text-xs text-gray-500">We'll send order confirmation to this email</p>
									</div>
									<div class="space-y-1">
										<label for="phone" class="block text-sm font-medium text-gray-700">
											Phone number {#if !addressModule.isPhoneRequired}<span class="text-gray-400">(optional)</span>{/if}
										</label>
										<Textbox
											type="tel"
											bind:value={addressModule.phone}
											required={addressModule.isPhoneRequired}
											class="w-full"
											schema={schemas.phone}
											placeholder="XXXXXXXXXX"
										/>
										<p class="mt-1 text-xs text-gray-500">For delivery updates</p>
									</div>
									<div class="flex justify-end space-x-3 pt-2">
										{#if cartState.cart.email}
											<Button
												variant="outline"
												onclick={() => (addressModule.editEmail = false)}
												type="button"
												class="transition-transform active:scale-95"
											>
												Cancel
											</Button>
										{/if}
										<Button type="submit" disabled={cartState.isUpdatingCart} class="min-w-[120px] transition-all active:scale-95">
											{#if cartState.isUpdatingCart}
												<LoadingDots />
											{:else}
												Save Contact
											{/if}
										</Button>
									</div>
								</form>
							{/if}
						</div>
						<!-- Shipping Address -->
						{#if isEmailOk && isPhoneOk}
							<div class="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-md">
								{#if cartState.cart.shippingAddress}
									<div class="">
										<div class="flex items-center justify-between border-b border-gray-50 px-5 py-4">
											<h2 class="text-base font-bold uppercase tracking-widest text-gray-900" style="font-family: 'Montserrat', sans-serif;">
												Delivery Address
											</h2>
											{#if !addressModule.loadingForSaveToCart}
												<Button
													onclick={() => {
														if (!userState?.user?.role && !cartState?.cart?.shippingAddress) {
															addressModule.openAddressForm(emptyAddress('new'), 'shipping', true)
														} else if (!userState.user?.role) {
															addressModule.openAddressForm({ ...cartState.cart.shippingAddress }, 'shipping', true)
														} else {
															addressModule.openAddressList('shipping')
														}
													}}
													variant="ghost"
													class="h-8 text-[10px] font-bold uppercase tracking-widest text-primary transition-all hover:bg-primary/5 active:scale-95"
												>
													Change
												</Button>
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
													<p class="mt-4 border-t border-gray-50 pt-4 font-medium">
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
											<h2 class="text-base font-bold uppercase tracking-widest text-gray-900" style="font-family: 'Montserrat', sans-serif;">
												Shipping Address
											</h2>

											{#if !userState?.user?.role}
												<button
													onclick={() => showAuthModal('login')}
													class="text-left text-[10px] font-bold uppercase tracking-widest text-primary transition-all hover:underline active:scale-95"
												>
													Login to view saved addresses
												</button>
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
													<Button
														type="button"
														variant="default"
														class="bg-primary px-8 text-[10px] font-bold uppercase tracking-widest transition-all hover:bg-black active:scale-95"
														onclick={addressModule.handleAddNewAddress}>Add New Address</Button
													>
												</div>
											{/if}
										</form>
									</div>
								{/if}
							</div>

							{#if !addressModule.isBillingAddressSameAsShipping}
								<div class="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-md">
									<div class="">
										<div class="flex items-center justify-between border-b border-gray-50 px-5 py-4">
											<h2 class="text-base font-bold uppercase tracking-widest text-gray-900" style="font-family: 'Montserrat', sans-serif;">
												Billing Address
											</h2>
											{#if !addressModule.loadingForSaveToCart}
												<Button
													onclick={addressModule.handleBilingAddOrChangeClick}
													variant="ghost"
													class="h-8 text-[10px] font-bold uppercase tracking-widest text-primary transition-all hover:bg-primary/5 active:scale-95"
												>
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
							<div class="flex items-center justify-start gap-2 rounded-lg border border-gray-100 bg-gray-50 p-4 transition-all hover:bg-gray-100">
								<Checkbox
									checked={addressModule.isBillingAddressSameAsShipping}
									onCheckedChange={(val) => {
										addressModule.isBillingAddressSameAsShipping = val
										if (val) {
											cartState.updateShippingAddress({
												shippingAddress: cartState?.cart?.shippingAddress,
												billingAddress: null,
												isBillingAddressSameAsShipping: true
											})
										}
									}}
									id="isBillingAddressSameAsShipping"
								/>
								<label for="isBillingAddressSameAsShipping" class="cursor-pointer text-xs font-bold uppercase tracking-tight text-gray-700"
									>Billing address same as shipping</label
								>
							</div>
						{/if}
					</div>

					<!-- Right Column - Order Summary -->
					<div class="space-y-4">
						<div class="space-y-4 rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
							<div class="mb-6 flex flex-col gap-1">
								<h2 class="text-base font-bold uppercase tracking-widest text-gray-900" style="font-family: 'Montserrat', sans-serif;">
									Price Summary
								</h2>
								<div class="h-1 w-12 bg-primary"></div>
							</div>
							{#if addressModule.loadingForCart}
								<div class="flex items-center justify-center py-8">
									<LoadingDots />
								</div>
							{:else}
								<div class="space-y-4">
									<div class="space-y-3 border-b border-gray-50 pb-6">
										<div class="flex justify-between text-sm">
											<span class="font-medium text-gray-500">Subtotal</span>
											<span class="font-bold text-gray-900">{formatPrice(cartState.cart.subtotal, page?.data?.store?.currency?.code)}</span>
										</div>
										{#if cartState.cart.discountAmount > 0}
											<div class="flex justify-between text-sm">
												<span class="font-medium text-gray-500">Discount</span>
												<span class="font-bold uppercase tracking-tight text-orange-600"
													>- {formatPrice(cartState.cart.discountAmount, page?.data?.store?.currency?.code)}</span
												>
											</div>
										{/if}
										<div class="flex flex-col gap-1">
											<div class="flex justify-between text-sm">
												<span class="font-medium text-gray-500">Shipping</span>
												{#if !cartState.cart.shippingAddress}
													<span class="text-[10px] font-bold uppercase tracking-tighter text-gray-400"> Address required </span>
												{:else if cartState.cart.shippingCharges}
													<span class="font-bold text-gray-900">{formatPrice(cartState.cart.shippingCharges, page?.data?.store?.currency?.code)}</span
													>
												{:else}
													<span
														class="rounded bg-green-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-green-600 ring-1 ring-green-100"
														>FREE</span
													>
												{/if}
											</div>
										</div>
									</div>

									<div class="flex items-center justify-between pt-2">
										<span class="text-sm font-bold uppercase tracking-widest text-gray-900">Total</span>
										<span class="text-xl font-bold text-gray-900">{formatPrice(cartState.cart.total, page?.data?.store?.currency?.code)}</span>
									</div>

									{#if addressModule.showError}
										<div class="mt-4 rounded bg-red-50 p-3 text-[11px] font-bold uppercase tracking-tight text-red-600 ring-1 ring-red-100">
											{addressModule.errorMessage}
										</div>
									{/if}

									<div
										class="mt-6 flex items-center justify-center gap-2 rounded-md border border-gray-100 bg-gray-50/50 px-4 py-3 transition-all hover:bg-gray-100/80"
									>
										<LockKeyhole class="h-3.5 w-3.5 text-gray-400" />
										<p class="text-[10px] font-bold uppercase tracking-widest text-gray-500">Secure 256-bit encryption</p>
									</div>

									{#if isPhoneOk && isEmailOk && cartState.cart.shippingAddress && !addressModule.editAddress}
										<Button
											class="ease-out-expo group w-full bg-primary py-7 text-sm font-bold uppercase tracking-[0.2em] shadow-lg transition-all duration-300 hover:bg-black hover:shadow-xl active:scale-[0.98] max-sm:fixed max-sm:bottom-0 max-sm:left-0 max-sm:right-0 max-sm:z-[60] max-sm:h-20 max-sm:rounded-none"
											onclick={addressModule.handleProceedToPayment}
										>
											{#if addressModule.loadingForCheckout}
												<LoadingDots />
											{:else}
												<span>Continue to Payment</span>
												<ChevronRight class="ml-2 size-4 transition-transform duration-300 group-hover:translate-x-1" />
											{/if}
										</Button>
									{/if}
								</div>
							{/if}
						</div>

						<OrderTrustBadges />
					</div>
				</div>
			{/if}
		{/await}
	</div>
</div>

<AddressListModal
	bind:show={addressModule.showAddressList}
	addresses={addressModule.addresses}
	paginateAddress={addressModule.paginateAddress}
	onaddnew={addressModule.handleAddNewAddressFromModal}
	onedit={addressModule.handleEditAddress}
	onselect={addressModule.handleSelectAddress}
	ondelete={addressModule.handleDeleteAddress}
/>

<!-- Shipping & Biling address -->
<AddressFormModal
	bind:show={addressModule.showAddressForm}
	bind:address={addressModule.currentAddress}
	isEdit={addressModule.isEditingAddress}
	onback={addressModule.handleFormBack}
	onclose={addressModule.handleFormClose}
	onsave={addressModule.handleFormSave}
	ondelete={addressModule.handleDeleteAddress}
/>
