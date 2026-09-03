<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js'
	import { goto } from '$app/navigation'
	import { ChevronRight, LoaderCircle, LockKeyhole, MapPin, Pencil, ShoppingBag, Truck } from '@lucide/svelte'
	import { formatPrice } from '$lib/core/utils/index.js'
	import Spinner from '$lib/components/common/spinner.svelte'
	import AddressListModal from '$lib/components/address/address-list-modal.svelte'
	import AddressFormModal from '$lib/components/address/address-form-modal.svelte'
	import { page } from '$app/state'
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte'
	import { Skeleton } from '$lib/components/ui/skeleton/index.js'
	import OrderTrustBadges from '$lib/core/components/plugins/order-trust-badges.svelte'
	import { showAuthModal } from '$lib/core/components/index.js'
	import Textbox from '$lib/components/form/textbox.svelte'
	import { AddressModule, emptyAddress, checkoutAddressSchema as schemas } from '$lib/core/composables/index.js'
	import CheckoutHeader from '$lib/components/checkout/checkout-header.svelte'
	import PriceSummary from '$lib/components/checkout/price-summary.svelte'
	import { appendOneTimeCartId } from '$lib/core/utils/index.js'
	import CheckoutButton from '$lib/components/buttons/checkout-button.svelte'
	import AddressForm from './address-form.svelte'
	import { authService } from '$lib/core/services/index.js'
	import { toast } from '@misiki/kitcommerce-core'
	import { onMount } from 'svelte'
	import { replaceState } from '$app/navigation'

	const addressModule = new AddressModule()
	const cartState = addressModule.cartState
	const userState = addressModule.userState

	const isEmailOk = $derived(addressModule.isEmailOk)
	const isPhoneOk = $derived(addressModule.isPhoneOk)

	// `saveContactInfo` runs its zod `.parse()` calls BEFORE opening its own try block, so an
	// invalid or missing email/phone throws straight out of the handler: no toast, no inline
	// error, the button just does nothing and the shopper is stuck at the first step of checkout.
	async function saveContactInfo(e: Event) {
		try {
			await addressModule.saveContactInfo(e)
		} catch (err: any) {
			toast.error(err?.issues?.[0]?.message || err?.message || 'Please check your email and phone number')
		}
	}

	// Two problems with the raw handler: a saved address disappeared on a single tap with no
	// confirmation, and it filters the address out of the list OUTSIDE its try/catch — so a failed
	// delete still removed it from the UI and it reappeared on the next reload. `paginateAddress`
	// merges the server list back in (deduped by id), which self-corrects: a delete that failed
	// puts the row back, one that succeeded leaves it gone.
	async function deleteAddress(address: any) {
		const where = [address?.address_1, address?.city].filter(Boolean).join(', ')
		if (!confirm(`Delete this address?${where ? `\n\n${where}` : ''}`)) return
		await addressModule.handleDeleteAddress(address)
		await addressModule.paginateAddress(1)
	}

	const isGuestCheckout = $derived(!userState?.user?.role)

	// The payment step's Change link routes here as `?showEditAddress=true`, and the core module's
	// mount() answers it with `handleAddressChangeClick()` — which for a guest opens the address
	// dialog on top of the inline form that already holds the very same address, with no email
	// field, a Delete Address link, and `editAddress` left true so Continue to Payment greys out
	// whichever way the dialog is dismissed. A guest edits in place: close it, drop the flag so a
	// reload cannot re-open it, and put the cursor in the prefilled form (UX-080).
	let guestEditFlagHandled = false

	$effect(() => {
		if (guestEditFlagHandled || !isGuestCheckout || !page.url.searchParams.has('showEditAddress')) return
		if (!addressModule.showAddressForm) return
		guestEditFlagHandled = true
		addressModule.showAddressForm = false
		addressModule.editAddress = false
		addressModule.currentAddressType = null
		const url = new URL(page.url)
		url.searchParams.delete('showEditAddress')
		try {
			replaceState(url, page.state)
		} catch {
			// replaceState is unavailable before hydration finishes; the flag is already neutralised.
		}
		requestAnimationFrame(() => {
			const form = document.getElementById('checkout-address-form')
			;(form?.querySelector('[name="firstName"]') as HTMLElement | null)?.focus()
		})
	})

	// What the order still needs before Continue to Payment can fire. It used to live inside the
	// button as its disabled label, which is both the least legible text in the flow and a moving
	// target where the shopper expects one constant forward action (UX-301).
	const continueBlocker = $derived(
		!isEmailOk
			? 'Add an email address to continue.'
			: !isPhoneOk
				? 'Add a phone number to continue.'
				: !cartState.cart?.shippingAddress
					? 'Add a delivery address to continue.'
					: addressModule.editAddress
						? 'Save your address to continue.'
						: ''
	)

	// The pinned footer carries whichever action actually moves the shopper forward. Until the guest
	// address is saved that is Save Address — Continue to Payment cannot fire without a shipping
	// address, so offering it there was a dead end, and the form's own Save sat below the fold.
	// Anything Continue needs and the cart lacks — email included, now that it is mandatory. Keying
	// this on the address alone left a guest with a saved address but no email staring at a
	// permanently disabled "Select Address" while the only control that could fix it sat below the
	// fold.
	const fillingGuestAddress = $derived(isGuestCheckout && !(isEmailOk && isPhoneOk && cartState.cart?.shippingAddress))

	// Submitting through the form element runs its own validation and error display; the footer
	// button is outside the form, so it cannot be a plain submit button.
	const submitAddressForm = () => (document.getElementById('checkout-address-form') as HTMLFormElement | null)?.requestSubmit()
	let loadingForGuestCheckout = $state(false)

	// Coming back from the payment step: prefill the guest form with the saved
	// address so it can be edited in place.
	onMount(async () => {
		await cartState.hasLoaded
		if (isGuestCheckout) {
			if (cartState.cart.shippingAddress) {
				addressModule.currentAddress = cartState.cart.shippingAddress
				addressModule.currentAddressType = 'shipping'
				addressModule.isBillingAddressSameAsShipping = true
			}
		}
	})

	async function handleGuestSubmit(address: any) {
		try {
			loadingForGuestCheckout = true

			await cartState.updateEmail({ email: address.email, phone: address.phone })
			// saveAddressToCart (not handleFormSave) so the save is actually awaited.
			await addressModule.saveAddressToCart()
			if (!cartState.cart.shippingAddress) {
				// A stale auth session (connect.sid) makes the API stamp user_id=0 on the
				// address insert and 500. Guests don't need that session — drop it and retry.
				await authService.logout().catch(() => {})
				await addressModule.saveAddressToCart()
			}
			if (isPhoneOk && isEmailOk && cartState.cart.shippingAddress && !addressModule.editAddress) {
				await addressModule.handleProceedToPayment()
			}
		} finally {
			loadingForGuestCheckout = false
		}
	}
</script>

<svelte:head>
	<title>Address - {page?.data?.store?.name || ''}</title>
</svelte:head>

<div class="min-h-screen py-8 max-sm:pb-[calc(9rem_+_env(safe-area-inset-bottom))]">
	<div class="container mx-auto px-4">
		<CheckoutHeader step={2} />

		<!-- Same as the cart step: the progress indicator is a control, not the page heading. -->
		<h1 class="sr-only">Delivery address</h1>
		<!-- <div class="mb-8 flex justify-between lg:px-4 items-center">
		  <div>
				<p class="font-semibold tracking-tight text-xl">My Addresses</p>
			</div>
			<Button variant="link" onclick={() => {
				goto("/checkout/cart")
			}} >
				Back to Cart
			</Button>
		</div> -->

		{#await cartState.hasLoaded}
			<!-- The shape of the page that is coming, not a spinner in an empty region. This step used
			     to render a single small spinner for around two and a half seconds, so the checkout
			     read as a blank page between the step indicator and the footer at the exact moment a
			     shopper is deciding whether to trust it. -->
			<div class="grid gap-8 lg:grid-cols-[1fr_400px]" aria-busy="true" aria-label="Loading checkout">
				<div class="min-w-0 space-y-6">
					<Skeleton class="h-24 w-full rounded-lg" />
					<div class="space-y-3 rounded-lg border p-6">
						<Skeleton class="h-4 w-40" />
						<div class="grid gap-3 sm:grid-cols-2">
							{#each Array(6) as _}
								<Skeleton class="h-11 w-full rounded-md" />
							{/each}
						</div>
						<Skeleton class="h-11 w-40 rounded-md" />
					</div>
				</div>
				<div class="space-y-3 rounded-lg border p-6">
					<Skeleton class="h-4 w-32" />
					{#each Array(4) as _}
						<Skeleton class="h-4 w-full" />
					{/each}
					<Skeleton class="mt-4 h-11 w-full rounded-md" />
				</div>
			</div>
		{:then}
			{#if addressModule.noItemsChecked && cartState?.cart?.lineItems?.length > 0}
				<div class="flex h-96 flex-col items-center justify-center gap-3">
					<p class="text-xl text-muted-foreground">You must select at least one item in cart for checkout</p>
					<Button variant="outline" href={appendOneTimeCartId('/checkout/cart')}>Go back to cart</Button>
				</div>
			{:else if cartState?.cart?.lineItems?.length === 0 && !cartState?.isUpdatingCart}
				<div class="flex h-96 flex-col items-center justify-center gap-3">
					<p class="text-xl text-muted-foreground">Your cart is empty</p>
					<Button variant="outline" href="/">Continue Shopping</Button>
				</div>
			{:else}
				<div class="grid gap-8 lg:grid-cols-[1fr_400px]">
					<!-- Left Column. `min-w-0`: a grid item's default `min-width: auto` lets a wide
					     min-content child (a nowrap button, a long token) stretch the column past the
					     viewport, which scrolls the whole page sideways on a phone. -->
					<div class="min-w-0 space-y-6">
						<!-- Contact Details -->
						{#await userState.hasLoaded then _}
							<!-- Every logged-out visitor sees the guest-checkout banner. -->
							{#if !userState.user?.userId}
								<div class="rounded-lg border border-blue-100 bg-blue-50 p-4">
									<div class="flex items-start gap-3">
										<ShoppingBag class="mt-0.5 size-5 shrink-0 text-blue-600" />
										<div>
											<p class="text-sm font-semibold text-blue-900">You're checking out as a guest</p>
											<p class="mt-1 text-sm text-blue-800">
												No account needed — just enter your details below. Optionally,
												<button
													class="font-bold underline hover:text-blue-900"
													onclick={() => {
														showAuthModal('login')
													}}
												>
													log in
												</button>
												to use your saved addresses and speed up checkout.
											</p>
										</div>
									</div>
								</div>
							{/if}
						{/await}
						<!-- Logged-in shoppers only. The guest form below already collects email and phone —
						     `handleGuestSubmit` pushes both onto the cart before saving the address — so asking
						     for them in a separate Contact Details step first made guests fill two forms with
						     the same fields. -->
						{#if !isGuestCheckout && (addressModule.isPhoneRequired || addressModule.isEmailRequired)}
							<div class="overflow-hidden rounded-lg border border-border bg-background shadow-sm">
								<div class="flex items-center justify-between border-b border-border px-5 py-4">
									<div class="flex items-center space-x-3">
										<h2 class="text-base font-bold uppercase text-foreground" style="font-family: var(--font-body);">Contact Details</h2>
									</div>
									{#if cartState.cart.email && !addressModule.editEmail && !userState.user?.userId}
										<Button onclick={addressModule.handleEditEmail} variant="ghost" size="sm" class="h-8">
											<Pencil class="mr-1.5 h-3 w-3" />
											<span>Edit</span>
										</Button>
									{/if}
								</div>

								{#if isEmailOk && isPhoneOk && !addressModule.editEmail}
									<div class="grid grid-cols-1 gap-6 p-6 transition-all duration-500 sm:grid-cols-2">
										<div class="flex flex-col gap-1">
											<p class="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">Email Address</p>
											<p class="text-sm font-medium text-foreground">{cartState.cart.email}</p>
										</div>
										<div class="flex flex-col gap-1">
											<p class="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">Phone Number</p>
											<p class="text-sm font-medium text-foreground">{cartState.cart.phone}</p>
										</div>
									</div>
								{:else if !isEmailOk || !isPhoneOk || addressModule.editEmail}
									<form class="space-y-4 p-5 transition-all duration-500" onsubmit={saveContactInfo}>
										<div class="space-y-1">
											<label for="email" class="block text-sm font-medium text-foreground">
												Email address {#if !addressModule.isEmailRequired}<span class="text-muted-foreground">(optional)</span>{/if}
											</label>
											<Textbox
												type="email"
												bind:value={addressModule.email}
												required={addressModule.isEmailRequired}
												class="w-full"
												schema={schemas.email}
												placeholder="your@email.com"
											/>
											<p class="mt-1 text-xs text-muted-foreground">We'll send order confirmation to this email</p>
										</div>
										<div class="space-y-1">
											<label for="phone" class="block text-sm font-medium text-foreground">
												Phone number {#if !addressModule.isPhoneRequired}<span class="text-muted-foreground">(optional)</span>{/if}
											</label>
											<Textbox
												type="tel"
												bind:value={addressModule.phone}
												required={addressModule.isPhoneRequired}
												class="w-full"
												schema={schemas.phone}
												placeholder="XXXXXXXXXX"
											/>
											<p class="mt-1 text-xs text-muted-foreground">For delivery updates</p>
										</div>
										<div class="flex justify-end space-x-3 pt-2">
											{#if cartState.cart.email}
												<Button variant="outline" onclick={() => (addressModule.editEmail = false)} type="button">Cancel</Button>
											{/if}
											<Button type="submit" disabled={cartState.isUpdatingCart} class="min-w-[120px]">
												{#if cartState.isUpdatingCart}
													<Spinner label="Saving contact details" />
												{:else}
													Save Contact
												{/if}
											</Button>
										</div>
									</form>
								{/if}
							</div>
						{/if}
						<!-- Shipping Address. Guests reach this straight away: their email and phone are fields
						     of this form, so gating it on `isEmailOk && isPhoneOk` would hide the only place
						     they can be entered. -->
						{#if isGuestCheckout || (isEmailOk && isPhoneOk)}
							<div class="overflow-hidden rounded-lg border border-border bg-background shadow-sm">
								{#if isGuestCheckout}
									<!-- Guest checkout: inline address form, no login required -->
									<div class="p-6">
										<div class="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
											<h2 class="text-base font-bold uppercase text-foreground" style="font-family: var(--font-body);">Delivery Address</h2>
											<Button variant="link" onclick={() => showAuthModal('login')} class="h-auto whitespace-normal p-0 text-left">
												Login to view your saved addresses
											</Button>
										</div>
										<AddressForm bind:address={addressModule.currentAddress} isLoading={loadingForGuestCheckout} onsave={handleGuestSubmit} />
									</div>
								{:else if cartState.cart.shippingAddress}
									<div class="">
										<div class="flex items-center justify-between border-b border-border px-5 py-4">
											<h2 class="text-base font-bold uppercase text-foreground" style="font-family: var(--font-body);">Delivery Address</h2>
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
													<h3 class="text-sm font-bold uppercase tracking-tight text-foreground">
														{cartState.cart.shippingAddress?.firstName}
														{cartState.cart.shippingAddress?.lastName}
													</h3>
												</div>
												<div class="space-y-1 text-sm leading-relaxed text-muted-foreground">
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
														<span class="mr-2 text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">Phone</span>
														{cartState.cart.shippingAddress?.phone}
													</p>
												</div>
											</div>
										{/if}
									</div>
								{:else}
									<div class="p-6">
										<div class="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
											<h2 class="text-base font-bold uppercase tracking-widest text-foreground" style="font-family: var(--font-body);">
												Shipping Address
											</h2>

											{#if !userState?.user?.role}
												<Button variant="link" onclick={() => showAuthModal('login')} class="h-auto p-0">Login to view saved addresses</Button>
											{/if}
										</div>
										<form class="">
											{#if addressModule.loadingForSaveToCart && addressModule.currentAddressType == 'shipping'}
												<Skeleton class="h-[100px] w-full rounded-lg" />
											{:else}
												<div
													class="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-background py-8 text-center"
												>
													<p class="mb-6 text-sm text-muted-foreground">No shipping address selected</p>
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
											<h2 class="text-base font-bold uppercase text-foreground" style="font-family: var(--font-body);">Billing Address</h2>
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
													<h3 class="text-sm font-bold uppercase tracking-tight text-foreground">
														{cartState.cart.billingAddress?.firstName}
														{cartState.cart.billingAddress?.lastName}
													</h3>
												</div>
												<div class="space-y-1 text-sm leading-relaxed text-muted-foreground">
													<p>{cartState.cart.billingAddress?.address_1}</p>
													{#if cartState.cart.billingAddress?.address_2}
														<p>{cartState.cart.billingAddress?.address_2}</p>
													{/if}
													<p>{cartState.cart.billingAddress?.city}, {cartState.cart.billingAddress?.state}</p>
													<p>{cartState.cart.billingAddress?.countryCode} {cartState.cart.billingAddress?.zip}</p>
													<p class="mt-4 border-t border-border pt-4 font-medium">
														<span class="mr-2 text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">Phone</span>
														{cartState.cart.billingAddress?.phone}
													</p>
												</div>
											</div>
										{:else}
											<div class="bg-background p-8 text-center transition-all duration-500">
												<p class="text-sm text-muted-foreground">No billing address saved.</p>
											</div>
										{/if}
									</div>
								</div>
							{/if}
							{#if !isGuestCheckout}
								<div class="flex items-center justify-start gap-2 p-4 transition-colors hover:bg-muted/20">
									<Checkbox
										checked={addressModule.isBillingAddressSameAsShipping}
										onCheckedChange={addressModule?.handleBillingAddressSameCheck}
										id="isBillingAddressSameAsShipping"
									/>
									<label for="isBillingAddressSameAsShipping" class="cursor-pointer text-xs font-bold uppercase tracking-tight text-foreground"
										>Billing address same as shipping</label
									>
								</div>
							{/if}
						{/if}
					</div>

					<!-- Right Column - Order Summary -->
					<div class="space-y-4">
						<div class="space-y-4 rounded-lg border border-border bg-background p-6 shadow-sm">
							<div class="mb-6 flex flex-col gap-1">
								<h2 class="text-base font-bold uppercase text-foreground" style="font-family: var(--font-body);">Price Summary</h2>
								<div class="h-1 w-12 bg-primary"></div>
							</div>
							{#if addressModule.loadingForCart}
								<PriceSummary loading />
							{:else}
								<div class="space-y-4">
									<PriceSummary
										subtotal={cartState.cart.subtotal}
										discount={cartState.cart.discountAmount}
										shipping={cartState.cart.shippingCharges}
										tax={cartState.cart.tax}
										total={cartState.cart.total}
										currencyCode={page?.data?.store?.currency?.code}
										shippingResolved={!!cartState.cart.shippingAddress}
									/>

									{#if addressModule.showError}
										<div class="mt-4 rounded-radius border border-destructive/40 bg-destructive/5 p-3 text-sm font-medium text-destructive">
											{addressModule.errorMessage}
										</div>
									{/if}

									<div class="mt-6 flex items-center justify-center gap-2 rounded-radius border border-border bg-background px-4 py-3">
										<LockKeyhole class="h-3.5 w-3.5 text-muted-foreground" />
										<p class="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Secure 256-bit encryption</p>
									</div>

									{#if !addressModule.showAddressList && !addressModule.showAddressForm}
										{#if fillingGuestAddress}
											<!-- Named for what it does. The in-form control saves; this one saves and moves the
											     order on, so the two full-width buttons on the step no longer carry the same
											     label in the same weight (UX-081). -->
											<CheckoutButton
												text="Save & Continue"
												onclick={submitAddressForm}
												loading={loadingForGuestCheckout}
												total={formatPrice(cartState.cart.total, page?.data?.store?.currency?.code)}
											/>
										{:else}
											{#if continueBlocker}
												<p class="text-sm text-muted-foreground">{continueBlocker}</p>
											{/if}
											<CheckoutButton
												text="Continue to Payment"
												disabled={!!continueBlocker}
												onclick={addressModule.handleProceedToPayment}
												loading={addressModule.loadingForCheckout}
												total={formatPrice(cartState.cart.total, page?.data?.store?.currency?.code)}
											/>
										{/if}
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
	ondelete={deleteAddress}
/>

<!-- Shipping & Biling address -->
<AddressFormModal
	bind:show={addressModule.showAddressForm}
	bind:address={addressModule.currentAddress}
	isEdit={addressModule.isEditingAddress}
	onback={addressModule.handleFormBack}
	onclose={addressModule.handleFormClose}
	onsave={addressModule.handleFormSave}
	ondelete={deleteAddress}
/>
