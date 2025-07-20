<script lang="ts">
	import { Button } from '$lib/components/ui/button'
	import { goto } from '$app/navigation'
	import { ChevronRight, LockKeyhole, MapPin, Pencil, ShoppingBag } from 'lucide-svelte'
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
	import { AddressModule, emptyAddress, schemas } from '$lib/core/composables/use-checkout-address.svelte'
	import { z } from 'zod'

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
		<div class="mb-8">
			<div class="flex items-center justify-center space-x-8">
				<button onclick={() => goto('/checkout/cart')} class="flex cursor-pointer items-center text-gray-400">
					<div class="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300">1</div>
					<span class="ml-2 font-medium">Cart</span>
				</button>
				<div class="hidden h-px w-16 bg-gray-300 sm:block"></div>
				<div class="flex cursor-pointer items-center text-primary">
					<div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">2</div>
					<span class="ml-2 font-medium">Address</span>
				</div>
				<div class="hidden h-px w-16 bg-gray-300 sm:block"></div>
				<div class="flex items-center text-gray-400">
					<div class="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300">3</div>
					<span class="ml-2 font-medium">Payment</span>
				</div>
			</div>
		</div>
		{#if addressModule.noItemsChecked && cartState?.cart?.lineItems?.length > 0}
			<div class="flex h-96 flex-col items-center justify-center gap-3">
				<p class="text-xl text-gray-400">You must select at least one item in cart for checkout</p>
				<Button variant="outline" href="/checkout/cart">Go back to cart</Button>
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
							<p>
								<button
									class="cursor-pointer font-bold"
									onclick={() => {
										showAuthModal('login')
									}}
								>
									Login
								</button> to autofill your details
							</p>
						{/if}
					{/await}
						<div class="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
							<div class="flex items-center justify-between bg-gray-50 px-4 py-3 border-b">
								<div class="flex items-center space-x-2">
									<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary">
										<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
									</svg>
									<h2 class="text-lg font-semibold text-gray-800">Contact Details</h2>
								</div>
								{#if cartState.cart.email && !addressModule.editEmail && !userState.user?.userId}
									<Button
										onclick={addressModule.handleEditEmail}
										variant="ghost"
										size="sm"
										class="text-primary hover:bg-primary/10 flex items-center space-x-1"
									>
										<Pencil class="h-4 w-4" />
										<span>Edit</span>
									</Button>
								{/if}
							</div>

							{#if isEmailOk && isPhoneOk && !addressModule.editEmail}
								<div class="space-y-3 p-5">
									<div class="flex items-start space-x-3">
										<div class="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-600">
											<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
												<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
												<polyline points="22,6 12,13 2,6"></polyline>
											</svg>
										</div>
										<div>
											<p class="text-sm font-medium text-gray-900">Email</p>
											<p class="text-sm text-gray-600">{cartState.cart.email}</p>
										</div>
									</div>
									<div class="flex items-start space-x-3">
										<div class="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-600">
											<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
												<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
											</svg>
										</div>
										<div>
											<p class="text-sm font-medium text-gray-900">Phone</p>
											<p class="text-sm text-gray-600">{cartState.cart.phone}</p>
										</div>
									</div>
								</div>
							{:else if !isEmailOk || !isPhoneOk || addressModule.editEmail}
								<form
									class="space-y-4 p-5"
									onsubmit={addressModule.saveContactInfo}
								>
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
											>
												Cancel
											</Button>
										{/if}
										<Button
											type="submit"
											disabled={cartState.isUpdatingCart}
											class="min-w-[120px]"
										>
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
						<div class="rounded-lg border p-4">
							{#if cartState.cart.shippingAddress}
								<div class="mb-6">
									<div class="flex items-center justify-between">
										<h2 class="text-base font-semibold sm:text-xl">Delivery Address</h2>
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
									  		class="text-primary hover:text-primary/80"
									  	>
									  		Change Address
									  	</Button>
                    {/if}
									</div>
									{#if addressModule.loadingForSaveToCart && addressModule.currentAddressType == 'shipping'}
										<Skeleton class="mt-4 h-[100px] w-full rounded-lg" />
									{:else}
										<div class="mt-4 rounded-lg border border-gray-200 p-4">
											<div class="mb-2 flex items-center">
												<MapPin class="mr-2 h-5 w-5 text-primary" />
												<h3 class="text-lg font-medium">
													{cartState.cart.shippingAddress?.firstName}
													{cartState.cart.shippingAddress?.lastName}
												</h3>
											</div>
											<p class="text-gray-600">
												{cartState.cart.shippingAddress?.address_1}
											</p>
											{#if cartState.cart.shippingAddress?.address_2}
												<p class="text-gray-600">
													{cartState.cart.shippingAddress?.address_2}
												</p>
											{/if}
											<p class="text-gray-600">
												{cartState.cart.shippingAddress?.city}, {cartState.cart.shippingAddress?.state}, {cartState.cart.shippingAddress?.countryCode}
												{cartState.cart.shippingAddress?.zip}
											</p>
											<p class="mt-2 text-gray-600">
												{cartState.cart.shippingAddress?.phone}
											</p>
										</div>
									{/if}
								</div>
							{:else}
								<div class="space-y-4">
									<div class="flex justify-between">
										<h2 class="text-base font-semibold sm:text-xl">Shipping Address</h2>

										{#if !userState?.user?.role}
											<button
												onclick={() => showAuthModal('login')}
												class="text-primary-500 hover:text-primary-700 block text-sm underline"
											>
												Login to view your saved address
											</button>
										{/if}
									</div>
									<form class="space-y-4">
                    {#if addressModule.loadingForSaveToCart && addressModule.currentAddressType == 'shipping'}
										  <Skeleton class="mt-4 h-[100px] w-full rounded-lg" />
									  {:else}
										<div class="flex flex-col items-start gap-3">
											<span class="text-sm text-gray-600"> Add a new address or select from saved addresses </span>
											<Button type="button" variant="default" onclick={addressModule.handleAddNewAddress}>Add Address</Button>
										</div>
                    {/if}
										<!-- <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        for="firstName"
                        class="mb-1 block text-sm font-medium text-gray-700"
                        >First Name</label
                      >
                      <Input
                        type="text"
                        id="firstName"
                        bind:value={currentAddress.firstName}
                        required
                      />
                    </div>
                    <div>
                      <label
                        for="lastName"
                        class="mb-1 block text-sm font-medium text-gray-700"
                        >Last Name</label
                      >
                      <Input
                        type="text"
                        id="lastName"
                        bind:value={currentAddress.lastName}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      for="address1"
                      class="mb-1 block text-sm font-medium text-gray-700"
                      >Address Line 1</label
                    >
                    <Input
                      type="text"
                      id="address1"
                      bind:value={currentAddress.address_1}
                      required
                    />
                  </div>
                  <div>
                    <label
                      for="address2"
                      class="mb-1 block text-sm font-medium text-gray-700"
                      >Address Line 2 (Optional)</label
                    >
                    <Input
                      type="text"
                      id="address2"
                      bind:value={currentAddress.address_2}
                    />
                  </div>
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        for="city"
                        class="mb-1 block text-sm font-medium text-gray-700"
                        >City</label
                      >
                      <Input
                        type="text"
                        id="city"
                        bind:value={currentAddress.city}
                        required
                      />
                    </div>
                    <div>
                      <label
                        for="state"
                        class="mb-1 block text-sm font-medium text-gray-700"
                        >State</label
                      >
                      <Input
                        type="text"
                        id="state"
                        bind:value={currentAddress.state}
                        required
                      />
                    </div>
                  </div>
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        for="zip"
                        class="mb-1 block text-sm font-medium text-gray-700"
                        >ZIP Code</label
                      >
                      <Input
                        type="text"
                        id="zip"
                        bind:value={currentAddress.zip}
                        required
                      />
                    </div>
                    <div>
                      <label
                        for="countryCode"
                        class="mb-1 block text-sm font-medium text-gray-700"
                        >Country</label
                      >
                      <Select
                        id="countryCode"
                        title="Select Country"
                        label=""
                        value={currentAddress.countryCode ||
                          page?.data?.store?.country?.code ||
                          "AU"}
                        data={page?.data?.store?.countries || []}
                        valueField="code"
                        optionSelected={(v: any) => {
                          currentAddress.countryCode = v;
                          console.log("🚀 ~ v:", v);
                          handleDetailsChange();
                        }}
                      />
                    </div>
                    <div>
                      <label
                        for="phone"
                        class="mb-1 block text-sm font-medium text-gray-700"
                        >Phone</label
                      >
                      <Input
                        type="tel"
                        id="phone"
                        bind:value={currentAddress.phone}
                        required
                      />
                    </div>
                  </div>
                  <div class="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="sameAsBilling"
                      bind:checked={isBillingAddressSameAsShipping}
                      class="rounded border-gray-300"
                    />
                    <label for="sameAsBilling" class="text-sm text-gray-700"
                      >Billing address same as shipping</label
                    >
                  </div>
                  <div class="flex justify-end space-x-3">
                    <Button variant="ghost" onclick={cancelSaveShippingAddress}
                      >Cancel</Button
                    >
                    <Button type="submit" disabled={cartState.isUpdatingCart}>
                      {#if cartState.isUpdatingCart}
                        <LoadingDots />
                      {:else}
                        <Save class="mr-2 h-4 w-4" />
                        Save Address
                      {/if}
                    </Button>
                  </div> -->
									</form>
								</div>
							{/if}
						</div>

						{#if !addressModule.isBillingAddressSameAsShipping}
							<div class="rounded-lg border p-4">
								<div class="mb-6">
									<div class="flex items-center justify-between">
										<h2 class="text-base font-semibold sm:text-xl">Billing Address</h2>
                    {#if !addressModule.loadingForSaveToCart}
										  <Button
										  	onclick={addressModule.handleBilingAddOrChangeClick}
										  	variant="ghost"
										  	class="text-primary hover:text-primary/80"
										  >
                        {#if cartState.cart.billingAddress?.address_1}
  									  		Change Address
                        {:else}
                          Add Address
                        {/if}
										  </Button>
                    {/if}
									</div>
                  {#if addressModule.loadingForSaveToCart && addressModule.currentAddressType == 'billing'}
										<Skeleton class="mt-4 h-[100px] w-full rounded-lg" />
									{:else if cartState.cart?.billingAddress?.address_1}
										<div class="mt-4 rounded-lg border border-gray-200 p-4">
											<div class="mb-2 flex items-center">
												<MapPin class="mr-2 h-5 w-5 text-primary" />
												<h3 class="text-lg font-medium">
													{cartState.cart.billingAddress?.firstName}
													{cartState.cart.billingAddress?.lastName}
												</h3>
											</div>
											<p class="text-gray-600">
												{cartState.cart.billingAddress?.address_1}
											</p>
											{#if cartState.cart.billingAddress?.address_2}
												<p class="text-gray-600">
													{cartState.cart.billingAddress?.address_2}
												</p>
											{/if}
											<p class="text-gray-600">
												{cartState.cart.billingAddress?.city}, {cartState.cart.billingAddress?.state}, {cartState.cart.billingAddress?.countryCode}
												{cartState.cart.billingAddress?.zip}
											</p>
											<p class="mt-2 text-gray-600">
												{cartState.cart.billingAddress?.phone}
											</p>
										</div>
									{:else}
										<p class="text-gray-600">No billing address saved. Please add a billing address.</p>
									{/if}
								</div>
							</div>
						{/if}
						<div class="flex items-center justify-start gap-1">
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
								class="rounded border-gray-300"
							/>
							<label for="isBillingAddressSameAsShipping" class="text-sm text-gray-700">Billing address same as shipping</label>
						</div>
					{/if}
				</div>

				<!-- Right Column - Order Summary -->
				<div class="space-y-6">
					<div class="space-y-6 rounded-md border p-4">
						<h2 class="text-xl font-semibold">Price Summary</h2>
						<span class="mb-4 text-sm text-gray-400">Includes all government taxes</span>
						{#if addressModule.loadingForCart}
							<div class="flex items-center justify-center py-8">
								<LoadingDots />
							</div>
						{:else}
							<div class="space-y-4 max-sm:text-sm">
								<div class="space-y-3 border-b py-4">
									<div class="flex justify-between">
										<span class="text-gray-600">Subtotal</span>
										<span>{formatPrice(cartState.cart.subtotal, page?.data?.store?.currency?.code)}</span>
									</div>
									{#if cartState.cart.discountAmount > 0}
										<div class="flex justify-between text-green-600">
											<span>Discount</span>
											<span>- {formatPrice(cartState.cart.discountAmount, page?.data?.store?.currency?.code)}</span>
										</div>
									{/if}
									<div class="flex flex-col justify-between">
										<div class="flex justify-between">
											<span class="text-gray-600">Shipping</span>
											<!-- {#if cartState.cart.total > freeShippingOn}
												<span class="rounded border border-green-500 px-1.5 text-xs text-green-500 sm:text-sm">FREE</span>
											{:else} -->
											<!-- <span
                        >{cartState.cart.shippingCharges
                          ? formatPrice(
                              cartState.cart.shippingCharges,
                              page?.data?.store?.currency?.code
                            )
                          : shippingCharges
                            ? formatPrice(
                                shippingCharges,
                                page?.data?.store?.currency?.code
                              )
                            : "FREE"}</span> -->
											{#if !cartState.cart.shippingAddress}
												<span class="text-gray-600"> will be calulcated after entering address. </span>
											{:else if cartState.cart.shippingCharges}
												<span>{formatPrice(cartState.cart.shippingCharges, page?.data?.store?.currency?.code)}</span>
											{:else}
												<span class="rounded border border-green-500 px-1.5 text-xs text-green-500 sm:text-sm">FREE</span>
											{/if}
											<!-- {/if} -->
										</div>
										{#if cartState.cart.shippingAddress}
											<p class="text-xs text-zinc-500">Shipping in 7 - 12 days</p>
										{/if}
									</div>
								</div>

								<div class="flex items-center justify-between py-4 text-base font-semibold sm:text-lg">
									<span>Total</span>
									<span>{formatPrice(cartState.cart.total, page?.data?.store?.currency?.code)}</span>
								</div>

								{#if addressModule.showError}
									<div class="mb-4 text-red-500">
										{addressModule.errorMessage}
									</div>
								{/if}

								<div class="w-full rounded-lg bg-slate-100 p-4 shadow-sm">
									<div class="flex items-center justify-center gap-3">
										<LockKeyhole class="h-5 w-5 text-slate-600" />
										<p class="font-medium text-slate-700">Your order is secured with 256-bit encryption</p>
									</div>
								</div>

								{#if isPhoneOk && isEmailOk && cartState.cart.shippingAddress && !addressModule.editAddress}
									<Button
										class="group bottom-0 left-0 right-0 z-[45] w-full py-6 text-lg hover:bg-primary max-sm:fixed max-sm:h-16 max-sm:rounded-none"
										onclick={addressModule.handleProceedToPayment}
									>
										{#if addressModule.loadingForCheckout}
											<LoadingDots />
										{:else}
											Continue to Payment <ChevronRight class="size-4 duration-300 group-hover:translate-x-2" />
										{/if}
									</Button>
								{/if}
							</div>
						{/if}
					</div>

					<!-- <div class="rounded-lg bg-white p-4 shadow">
            <div class="flex items-center text-sm text-gray-600">
              <ShoppingBag class="mr-2 size-4" />
              <span>Your order is secured with 256-bit encryption</span>
            </div>
          </div> -->

					<OrderTrustBadges />

					<!-- <div
            class="mt-5 bg-white shadow flex items-start justify-between gap-3 p-5 rounded"
          >
            <div
              class="flex flex-col items-center justify-center gap-2 text-center text-[0.5em] text-zinc-500 uppercase"
            >
              <img
                src="/cart-badge-trust.svg"
                alt="cart badge trust"
                class="h-8 w-8 object-contain object-bottom"
              /> <span>100% secure payments</span>
            </div>
            <div
              class="flex flex-col items-center justify-center gap-2 text-center text-[0.5em] text-zinc-500 uppercase"
            >
              <img
                src="/cart-easy-return.svg"
                alt="cart badge trust"
                class="h-8 w-8 object-contain object-bottom"
              /> <span>Easy return &amp; quick refunds</span>
            </div>
            <div
              class="flex flex-col items-center justify-center gap-2 text-center text-[0.5em] text-zinc-500 uppercase"
            >
              <img
                src="/quality-check.svg"
                alt="cart badge trust"
                class="h-8 w-8 object-contain object-bottom"
              /> <span>Quality assurance</span>
            </div>
          </div> -->
				</div>
			</div>
		{/if}
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
