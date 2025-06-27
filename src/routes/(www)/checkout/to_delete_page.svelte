<script lang="ts">
import { getCartState } from '$lib/core/stores/cart.svelte'
import { getProductState } from '$lib/core/stores/product.svelte'
import { Button } from '$lib/components/ui/button'
import Input from '$lib/components/ui/input/input.svelte'
import Select from '$lib/components/form/select.svelte'
import { Separator } from '$lib/components/ui/separator'
import { onMount } from 'svelte'
import { Minus, Plus, Save } from 'lucide-svelte'
import { goto } from '$app/navigation'
import { MapPin, Pencil, ShoppingBag } from 'lucide-svelte'
import { formatPrice } from '$lib/core/utils'
import LoadingDots from '$lib/core/components/common/loading-dots.svelte'
import { toast } from 'svelte-sonner'
import { getUserState } from '$lib/core/stores/auth.svelte'
import { addressService, checkoutService } from '$lib/core/services'
import { browser } from '$app/environment'
import AddressListModal from '$lib/components/address/address-list-modal.svelte'
import AddressFormModal from '$lib/components/address/address-form-modal.svelte'
import { paymentMethodService } from '$lib/core/services'
import { page } from '$app/state'
import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte'
import { fireGTagEvent } from '$lib/core/utils/gtag'
import AuthButton from '$lib/core/components/auth/auth-button.svelte'

let SELECTED_PG_NAME: string = $state('')
let listOfPaymentMethods = $state([])
const userState = getUserState()
const cartState = getCartState()
const productState = getProductState()
let email = $state('')
let phone = $state('')
let paymentLoader = $state(false)
let loadingForCart = $state(false)
let payment_sessions = []
let editAddress = $state(false)
let editEmail = $state(false)
let razorpayReady = $state(false)
let order_no = $state('')
let isBillingAddressSameAsShipping = $state(true)
let shippingAddress: Record<string, any> = $state({
	id: 'new',
	firstName: '',
	lastName: '',
	phone: '',
	address_1: '',
	address_2: '',
	city: '',
	state: '',
	zip: '',
	countryCode: ''
})
let billingAddress = $state({
	id: 'new',
	firstName: '',
	lastName: '',
	phone: '',
	address_1: '',
	address_2: '',
	city: '',
	state: '',
	zip: '',
	countryCode: ''
})
let showAddressList = $state(false)
let showAddressForm = $state(false)
let showBillingAddressForm = $state(false)
let isEditingAddress = $state(false)
let currentAddress = $state<Record<string, any>>({})
let addresses = $state([{ ...shippingAddress }])
let showError = $state(false)
let errorMessage = $state('')
let checkoutDisabled = $state(false)
let showPaymentMethods = $state(false)
let currentCheckoutStep = $state(1)

declare global {
	interface Window {
		Razorpay: any
	}
}
async function saveEmail(e) {
	e.preventDefault()
	await cartState.updateEmail({ email, phone })
	editEmail = false
}

async function saveShippingAddress(e) {
	e.preventDefault()
	// if (isBillingAddressSameAsShipping) {
	// 	billingAddress = { ...shippingAddress, id: 'new' }
	// }
	await cartState.updateShippingAddress({
		shippingAddress,
		billingAddress,
		isBillingAddressSameAsShipping
	})
	editAddress = false
}

function cancelSaveShippingAddress(e) {
	e.preventDefault()
	editAddress = false
}

async function saveBillingAddress(e) {
	e.preventDefault()
	// console.log(billingAddress, 'Biling address......', shippingAddress)
	await cartState.updateShippingAddress({
		shippingAddress,
		billingAddress,
		isBillingAddressSameAsShipping
	})
	editAddress = false
	showBillingAddressForm = false
}

function cancelSaveBillingAddress(e) {
	e.preventDefault()
	editAddress = false
	showBillingAddressForm = false
}

const handleDetailsChange = () => {
	// detailsChanged = true
}

// const mount = async () => {}

// $effect(() => {
// 	mount()
// })

onMount(async () => {
	if (browser) {
		const allPaymentMethods = await paymentMethodService.list({})
		listOfPaymentMethods = allPaymentMethods?.data || []
		if (listOfPaymentMethods.length === 0) {
			showError = true
			errorMessage = 'No payment methods available'
			checkoutDisabled = true
		} else if (listOfPaymentMethods.length === 1) {
			SELECTED_PG_NAME = listOfPaymentMethods[0]?.name?.toUpperCase?.()
			showPaymentMethods = false
		} else {
			showPaymentMethods = true
		}
		if (listOfPaymentMethods.find(f => f?.name?.toUpperCase?.() === 'RAZORPAY')) {
			const razorpayScript = document.createElement('script')
			razorpayScript.src = 'https://checkout.razorpay.com/v1/checkout.js'
			razorpayScript.async = true
			razorpayScript.onload = () => {
				// Add a small delay to ensure the script is fully initialized
				setTimeout(() => {
					razorpayReady = true
				}, 1000)
			}
			document.head.appendChild(razorpayScript)
		}
	}

	if (userState.user?.email) {
		try {
			const res = await addressService.list({})
			addresses = res?.data
		} catch (e) {
			console.log(e)
			// toast.error((e as any)?.message)
		}
	}
})

$effect(() => {
	// When checkbox is toggled, update billing address
	if (isBillingAddressSameAsShipping) {
		if (cartState.cart.billingAddress) {
			billingAddress = {
				id: cartState.cart.billingAddress.id || 'new',
				firstName: cartState.cart.billingAddress.firstName,
				lastName: cartState.cart.billingAddress.lastName,
				phone: cartState.cart.billingAddress.phone,
				address_1: cartState.cart.billingAddress.address_1,
				address_2: cartState.cart.billingAddress.address_2,
				city: cartState.cart.billingAddress.city,
				state: cartState.cart.billingAddress.state,
				zip: cartState.cart.billingAddress.zip,
				countryCode: cartState.cart.billingAddress.countryCode || 'in'
			}
		} else {
			billingAddress = {
				...shippingAddress,
				id: 'new' // Always set id to 'new' when copying
			}
		}
	}
})

const handleManualPayment = async providerId => {
	try {
		// console.log('🚀 ~ Manual Payment ~ handlePayment ~ providerId:', providerId)
		await productState.setPaymentSession(providerId)

		goto('/checkout/success')
	} catch (e) {
		console.log(e)
	}
}

const placeOrder = async () => {
	if (!SELECTED_PG_NAME) {
		toast.error('Please select a payment method')
		return
	}

	paymentLoader = true
	if (SELECTED_PG_NAME?.toUpperCase?.() == 'RAZORPAY') {
		// Razorpay checkout
		if (!razorpayReady) {
			toast.error('Please wait till payment gateway is ready')
		} else {
			try {
				const rp = await checkoutService.checkoutRazorpay({
					cartId: cartState.cart.id,
					origin: page.url.origin
				})
				order_no = rp?.order_no || ''
				if (rp && rp !== null) {
					const options = {
						key: rp.key_id, // Enter the Key ID generated from the Dashboard
						description: `Order #${order_no}`,
						amount: rp.amount * 80,
						order_id: rp.id,
						async handler(response) {
							// console.log('🚀 ~ captureRazorpayPayment ~ response:', response)
							try {
								const capture = await checkoutService.captureRazorpayPayment({
									razorpay_order_id: response.razorpay_order_id,
									razorpay_payment_id: response.razorpay_payment_id
								})
								goto(`/checkout/process?pg=razorpay&order_no=${capture?.order_no}&cart_id=${cartState.cart.id}`)
							} catch (e) {
								toast.error(e.message)
							} finally {
								paymentLoader = false
							}
						},
						prefill: {
							name: 'Litekart',
							phone: cartState.cart.phone || '8249028220',
							email: cartState.cart.email || 'help@litekart.in'
						}
					}

					if (typeof window.Razorpay === 'undefined') {
						toast.error('Payment gateway is not ready yet')
						return
					}
					const rzp1 = new window.Razorpay(options)
					rzp1.open()
				} else {
					toast.error('Something went wrong')
				}
			} catch (e) {
				toast.error(e.message)
			} finally {
			}
		}
	} else if (SELECTED_PG_NAME?.toUpperCase?.() == 'PHONEPE') {
		// Phonepe checkout
		try {
			const pp = await checkoutService.checkoutPhonepe({
				cartId: cartState.cart.id,
				email: cartState.cart.email,
				phone: '8249028220',
				origin: page.url.origin
			})
			if (!pp) {
				toast.error('Something went wrong')
				return
			}
			const redirectUrl = pp?.redirectUrl
			// console.log('🚀 ~ placeOrder ~ orders', pp)
			if (redirectUrl && redirectUrl !== null) {
				window.location.href = redirectUrl
			} else {
			}
		} catch (e) {
			console.log(e)
		} finally {
			paymentLoader = false
		}
	} else if (SELECTED_PG_NAME?.toUpperCase?.() == 'STRIPE') {
		try {
			// Stripe chekout
			const sp = await checkoutService.checkoutStripe({
				cartId: cartState.cart.id,
				origin: page.url.origin
			})
			// console.log('🚀 ~ placeOrder ~ sp', sp)
			if (sp.url) {
				window.location.href = sp.url
			} else {
				toast.error('Something went wrong, please check if order is placed by checking your email or contact support')
			}
		} catch (e) {
			toast.error(e.message)
		} finally {
			paymentLoader = false
		}
	} else if (SELECTED_PG_NAME?.toUpperCase?.() == 'COD') {
		try {
			// COD chekout
			const cp = await checkoutService.checkoutCOD({
				cartId: cartState.cart.id,
				origin: page.url.origin
			})
			goto(`/checkout/process?pg=COD&order_no=${cp?.order_no}&cart_id=${cartState.cart.id}`)
		} catch (e) {
			toast.error(e.message)
		} finally {
			paymentLoader = false
		}
	}
}
// const handleEditAddress = async (address: any) => {
// 	shippingAddress = address
// 	editAddress = true
// }
const handleEditEmail = async () => {
	editEmail = true
}

function handleAddNewAddress() {
	isEditingAddress = false
	currentAddress = {
		id: 'new',
		firstName: '',
		lastName: '',
		phone: '',
		address_1: '',
		address_2: '',
		city: '',
		state: '',
		zip: '',
		countryCode: 'in'
	}
	showAddressList = false
	showAddressForm = true
}

function handleEditAddress(address: any) {
	isEditingAddress = true
	currentAddress = { ...address }
	showAddressList = false
	showAddressForm = true
}

async function handleSelectAddress(address: any) {
	// if (address.isNew) {
	// 	address.id = 'new'
	// 	delete address.isNew
	// }

	shippingAddress = { ...address }

	if (isBillingAddressSameAsShipping) {
		billingAddress = shippingAddress
	} else {
		billingAddress.id = 'new'
	}
	// console.log('🚀 ~ handleSelectAddress ~ shippingAddress:', shippingAddress)
	await cartState.updateShippingAddress({
		shippingAddress,
		billingAddress,
		isBillingAddressSameAsShipping
	})
	showAddressList = false
}

function handleBackToList() {
	showAddressForm = false
	showAddressList = true
}

function removeUndefinedProperties(obj: any) {
	return Object.keys(obj).reduce((acc, key) => {
		if (obj[key] !== undefined && obj[key] !== null) {
			acc[key] = obj[key]
		}
		return acc
	}, {})
}

async function handleSaveAddress(address: any) {
	// console.log('🚀 ~ handleSaveAddress ~ address:', address)
	const newAddress = removeUndefinedProperties(address)

	if (isEditingAddress) {
		addresses = addresses.map(addr => (addr.id === newAddress.id ? newAddress : addr))
		await addressService.saveAddress(newAddress)
	} else {
		// newAddress.id = (addresses.length + 1).toString()
		// newAddress.isNew = true
		const res = await addressService.saveAddress(newAddress)
		addresses = [...addresses, res]
	}

	shippingAddress = { ...newAddress }
	showAddressForm = false
	showAddressList = true
}

let partialCheckoutEnabled = $derived(page?.data?.store?.plugins?.isPartialCheckout?.active)
let allItemsChecked = $derived(cartState?.cart?.lineItems?.every((item: any) => item.isSelectedForCheckout))
let isIndeterminate = $derived(
	cartState?.cart?.lineItems?.some((item: any) => item.isSelectedForCheckout) && !cartState?.cart?.lineItems?.every(item => item.isSelectedForCheckout)
)
</script>

<svelte:head>
	<title>Checkout - Secure Payment</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 py-8">
	<div class="container mx-auto px-4">
		<!-- Checkout Progress -->
		<div class="mb-8">
			<div class="flex items-center justify-center space-x-8">
				<button
					onclick={() => (currentCheckoutStep = 1)}
					class="flex cursor-pointer items-center {currentCheckoutStep === 1 ? 'text-primary' : 'text-gray-400'}"
				>
					<div
						class="flex h-8 w-8 items-center justify-center rounded-full {currentCheckoutStep === 1
							? 'bg-primary text-white'
							: 'border-2 border-gray-300'}"
					>
						1
					</div>
					<span class="ml-2 font-medium">Cart</span>
				</button>
				<div class="hidden h-px w-16 bg-gray-300 sm:block"></div>
				<button
					onclick={() => (currentCheckoutStep = 2)}
					class="flex cursor-pointer items-center {currentCheckoutStep === 2 ? 'text-primary' : 'text-gray-400'}"
				>
					<div
						class="flex h-8 w-8 items-center justify-center rounded-full {currentCheckoutStep === 2
							? 'bg-primary text-white'
							: 'border-2 border-gray-300'}"
					>
						2
					</div>
					<span class="ml-2 font-medium">Address</span>
				</button>
				<div class="hidden h-px w-16 bg-gray-300 sm:block"></div>
				<div class="flex items-center text-gray-400">
					<div class="flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300">3</div>
					<span class="ml-2 font-medium">Payment</span>
				</div>
			</div>
		</div>

		<div class="grid gap-8 lg:grid-cols-[1fr_400px]">
			<!-- Left Column -->
			{#if currentCheckoutStep === 1}
				<div class="space-y-6 rounded-lg bg-white p-6 shadow">
					<!-- Root checkbox -->
					{#if partialCheckoutEnabled}
						<div class="flex items-center justify-between">
							<div class="flex items-center space-x-2">
								<Checkbox
									checked={allItemsChecked}
									indeterminate={isIndeterminate}
									onCheckedChange={(checked) => {
										if (checked) {
											cartState.cart?.lineItems?.forEach?.((item: any) => {
												item.isSelectedForCheckout = true
												cartState?.update({
													qty: item.qty,
													lineId: item.id,
													productId: item.productId,
													variantId: item.variantId,
													isSelectedForCheckout: true
												})
											})
										} else {
											cartState.cart?.lineItems?.forEach?.((item: any) => {
												item.isSelectedForCheckout = false
												cartState?.update({
													qty: item.qty,
													lineId: item.id,
													productId: item.productId,
													variantId: item.variantId,
													isSelectedForCheckout: false
												})
											})
										}
									}}
								/>
								<label for="allItemsChecked" class="text-sm text-gray-700">Select all items</label>
							</div>
						</div>
					{/if}
					{#each cartState.cart.lineItems || [] as item}
						<div class="flex items-start gap-2">
							{#if partialCheckoutEnabled}
								<Checkbox
									bind:checked={item.isSelectedForCheckout}
									onCheckedChange={(checked) => {
										cartState?.update({
											qty: item.qty,
											lineId: item.id,
											productId: item.productId,
											variantId: item.variantId,
											isSelectedForCheckout: checked
										})
									}}
								/>
							{/if}
							<a class="flex flex-1 gap-4 border-b py-3" href={`/products/${item.slug}`} target="_blank">
								<div class="relative">
									<img src={item.thumbnail} alt={item.title} class="h-20 w-16 rounded object-cover" />
									<div class="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-gray-500 text-xs text-white">
										{item.qty}
									</div>
								</div>
								<div class="flex-1">
									<p class="line-clamp-2 font-medium">
										{item.title}
									</p>
									<!-- <p class="mt-1 text-sm text-gray-500">Qty: {item.qty}</p> -->
									<div class="relative z-50 my-2">
										<button
											onclick={(e) => {
												e?.preventDefault()
												e?.stopPropagation()
												fireGTagEvent('remove_from_cart', {
													items: [{ ...item, qty: 1 }],
													price: item.price
												})
												cartState.update({
													qty: item.qty - 1,
													lineId: item.id,
													productId: item.productId,
													variantId: item.variantId
												})
											}}
											class="rounded border p-1"
											aria-label="Subtract 1 from qty"
										>
											<Minus class="size-4" />
										</button>
										<span class="mx-2">
											{#if cartState.updatingItem[item.id]}
												<LoadingDots />
											{:else}
												{item.qty}
											{/if}
										</span>
										<button
											class="rounded border p-1"
											aria-label="Add 1 to qty"
											onclick={(e) => {
												e?.preventDefault()
												e?.stopPropagation()
												cartState.update({
													qty: item.qty + 1,
													lineId: item.id,
													productId: item.productId,
													variantId: item.variantId
												})
											}}
										>
											<Plus class="size-4" />
										</button>
									</div>
									<p class="mt-1 font-semibold">
										{formatPrice(item.price * item.qty, page?.data?.store?.currency?.code)}
									</p>
								</div>
							</a>
						</div>
					{/each}
				</div>
			{:else if currentCheckoutStep === 2}
				<div class="space-y-6">
					<!-- Contact Details -->
					<div class="rounded-lg bg-white p-6 shadow">
						<div class="mb-4 flex items-center justify-between">
							<h2 class="text-xl font-semibold">Contact Details</h2>
							{#if cartState.cart.email && !editEmail && !userState.user?.userId}
								<button class="text-primary hover:text-primary/80" onclick={handleEditEmail}>
									<Pencil class="size-4" />
								</button>
							{/if}
						</div>

						{#if cartState.cart.email && !editEmail}
							<div class="space-y-2">
								{#if cartState.cart.email}
									<p class="text-gray-600">
										Email: {cartState.cart.email}
									</p>
								{/if}
								{#if cartState.cart.phone}
									<p class="text-gray-600">
										Phone: {cartState.cart.phone}
									</p>
								{/if}
							</div>
						{:else if !cartState.cart.email || editEmail}
							<form class="space-y-4" onsubmit={saveEmail}>
								<div>
									<label for="email" class="mb-1 block text-sm font-medium text-gray-700">Email</label>
									<Input type="email" id="email" bind:value={email} required class="w-full" />
								</div>
								<div>
									<label for="phone" class="mb-1 block text-sm font-medium text-gray-700">Phone</label>
									<Input type="tel" id="phone" bind:value={phone} required class="w-full" />
								</div>
								<div class="flex justify-end space-x-3">
									{#if cartState.cart.email}
										<Button variant="ghost" onclick={() => (editEmail = false)}>Cancel</Button>
									{/if}
									<Button type="submit" disabled={cartState.isUpdatingCart}>
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
					<div class="rounded-lg bg-white p-6 shadow">
						{#if cartState.cart.shippingAddress && !editAddress}
							<div class="mb-6">
								<div class="flex items-center justify-between">
									<h2 class="text-xl font-semibold">Delivery Address</h2>
									<Button
										onclick={() => {
											if (!userState.user?.role) {
												// Map existing address to form when clicking change address
												if (cartState.cart.shippingAddress) {
													shippingAddress = {
														id: cartState.cart.shippingAddress.id || 'new',
														firstName: cartState.cart.shippingAddress.firstName,
														lastName: cartState.cart.shippingAddress.lastName,
														phone: cartState.cart.shippingAddress.phone,
														address_1: cartState.cart.shippingAddress.address_1,
														address_2: cartState.cart.shippingAddress.address_2,
														city: cartState.cart.shippingAddress.city,
														state: cartState.cart.shippingAddress.state,
														zip: cartState.cart.shippingAddress.zip,
														countryCode: cartState.cart.shippingAddress.countryCode || 'in'
													}
												}
												editAddress = true
											} else {
												showAddressList = true
											}
										}}
										variant="ghost"
										class="text-primary hover:text-primary/80"
									>
										Change Address
									</Button>
								</div>
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
										{cartState.cart.shippingAddress?.city}, {cartState.cart.shippingAddress?.state}
										{cartState.cart.shippingAddress?.zip}
									</p>
									<p class="mt-2 text-gray-600">
										{cartState.cart.shippingAddress?.phone}
									</p>
								</div>
							</div>
						{:else}
							<div class="space-y-4">
								<div class="flex justify-between">
									<h2 class="text-xl font-semibold">Shipping Address</h2>

									{#if !userState?.user?.role}
										<AuthButton type="login" extraqueries={{ ref: page.url?.pathname }}>
											<button class="text-primary-500 hover:text-primary-700 block text-sm underline"> Login to view your saved address </button>
										</AuthButton>
									{/if}
								</div>
								<form onsubmit={saveShippingAddress} class="space-y-4">
									<div class="grid grid-cols-2 gap-4">
										<div>
											<label for="firstName" class="mb-1 block text-sm font-medium text-gray-700">First Name</label>
											<Input type="text" id="firstName" bind:value={shippingAddress.firstName} required />
										</div>
										<div>
											<label for="lastName" class="mb-1 block text-sm font-medium text-gray-700">Last Name</label>
											<Input type="text" id="lastName" bind:value={shippingAddress.lastName} required />
										</div>
									</div>
									<div>
										<label for="address1" class="mb-1 block text-sm font-medium text-gray-700">Address Line 1</label>
										<Input type="text" id="address1" bind:value={shippingAddress.address_1} required />
									</div>
									<div>
										<label for="address2" class="mb-1 block text-sm font-medium text-gray-700">Address Line 2 (Optional)</label>
										<Input type="text" id="address2" bind:value={shippingAddress.address_2} />
									</div>
									<div class="grid grid-cols-2 gap-4">
										<div>
											<label for="city" class="mb-1 block text-sm font-medium text-gray-700">City</label>
											<Input type="text" id="city" bind:value={shippingAddress.city} required />
										</div>
										<div>
											<label for="state" class="mb-1 block text-sm font-medium text-gray-700">State</label>
											<Input type="text" id="state" bind:value={shippingAddress.state} required />
										</div>
									</div>
									<div class="grid grid-cols-2 gap-4">
										<div>
											<label for="zip" class="mb-1 block text-sm font-medium text-gray-700">ZIP Code</label>
											<Input type="text" id="zip" bind:value={shippingAddress.zip} required />
										</div>
										<div>
											<label for="countryCode" class="mb-1 block text-sm font-medium text-gray-700">Country</label>
											<Select
												id="countryCode"
												title="Select Country"
												label=""
												value={shippingAddress.countryCode || page?.data?.store?.country?.code || 'AU'}
												data={page?.data?.store?.countries || []}
												optionSelected={(v: any) => {
													shippingAddress.countryCode = v
													handleDetailsChange()
												}}
											/>
										</div>
										<div>
											<label for="phone" class="mb-1 block text-sm font-medium text-gray-700">Phone</label>
											<Input type="tel" id="phone" bind:value={shippingAddress.phone} required />
										</div>
									</div>
									<div class="flex items-center space-x-2">
										<input type="checkbox" id="sameAsBilling" bind:checked={isBillingAddressSameAsShipping} class="rounded border-gray-300" />
										<label for="sameAsBilling" class="text-sm text-gray-700">Billing address same as shipping</label>
									</div>
									<div class="flex justify-end space-x-3">
										<Button variant="ghost" onclick={cancelSaveShippingAddress}>Cancel</Button>
										<Button type="submit" disabled={cartState.isUpdatingCart}>
											{#if cartState.isUpdatingCart}
												<LoadingDots />
											{:else}
												<Save class="mr-2 h-4 w-4" />
												Save Address
											{/if}
										</Button>
									</div>
								</form>
							</div>
						{/if}
					</div>

					{#if !isBillingAddressSameAsShipping}
						<div class="rounded-lg bg-white p-6 shadow">
							{#if !showBillingAddressForm}
								<div class="mb-6">
									<div class="flex items-center justify-between">
										<h2 class="text-xl font-semibold">Billing Address</h2>
										<Button
											onclick={() => {
												if (!userState.user?.role) {
													showBillingAddressForm = true
												} else {
													showAddressList = true
												}
											}}
											variant="ghost"
											class="text-primary hover:text-primary/80"
										>
											Change Address
										</Button>
									</div>
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
											{cartState.cart.billingAddress?.city}, {cartState.cart.billingAddress?.state}
											{cartState.cart.billingAddress?.zip}
										</p>
										<p class="mt-2 text-gray-600">
											{cartState.cart.billingAddress?.phone}
										</p>
									</div>
								</div>
							{:else}
								<!-- Billing address form here -->
								<form onsubmit={saveBillingAddress} class="space-y-4">
									<div class="grid grid-cols-2 gap-4">
										<div>
											<label for="firstName" class="mb-1 block text-sm font-medium text-gray-700">First Name</label>
											<Input type="text" id="firstName" bind:value={billingAddress.firstName} required />
										</div>
										<div>
											<label for="lastName" class="mb-1 block text-sm font-medium text-gray-700">Last Name</label>
											<Input type="text" id="lastName" bind:value={billingAddress.lastName} required />
										</div>
									</div>
									<div>
										<label for="address1" class="mb-1 block text-sm font-medium text-gray-700">Address Line 1</label>
										<Input type="text" id="address1" bind:value={billingAddress.address_1} required />
									</div>
									<div>
										<label for="address2" class="mb-1 block text-sm font-medium text-gray-700">Address Line 2 (Optional)</label>
										<Input type="text" id="address2" bind:value={billingAddress.address_2} />
									</div>
									<div class="grid grid-cols-2 gap-4">
										<div>
											<label for="city" class="mb-1 block text-sm font-medium text-gray-700">City</label>
											<Input type="text" id="city" bind:value={billingAddress.city} required />
										</div>
										<div>
											<label for="state" class="mb-1 block text-sm font-medium text-gray-700">State</label>
											<Input type="text" id="state" bind:value={billingAddress.state} required />
										</div>
									</div>
									<div class="grid grid-cols-2 gap-4">
										<div>
											<label for="zip" class="mb-1 block text-sm font-medium text-gray-700">ZIP Code</label>
											<Input type="text" id="zip" bind:value={billingAddress.zip} required />
										</div>
										<div>
											<label for="countryCode" class="mb-1 block text-sm font-medium text-gray-700">Country</label>
											<Select
												id="countryCode"
												title="Select Country"
												label=""
												value={billingAddress.countryCode}
												data={page?.data?.store?.countries || []}
												optionSelected={(v: any) => {
													billingAddress.countryCode = v
													handleDetailsChange()
												}}
											/>
										</div>
										<div>
											<label for="phone" class="mb-1 block text-sm font-medium text-gray-700">Phone</label>
											<Input type="tel" id="phone" bind:value={billingAddress.phone} required />
										</div>
									</div>
									<!-- <div class="flex items-center space-x-2">
								<input type="checkbox" id="sameAsBilling" bind:checked={isBillingAddressSameAsShipping} class="rounded border-gray-300" />
								<label for="sameAsBilling" class="text-sm text-gray-700">Billing address same as shipping</label>
							</div> -->
									<div class="flex justify-end space-x-3">
										<Button variant="ghost" onclick={cancelSaveBillingAddress}>Cancel</Button>
										<Button type="submit" disabled={cartState.isUpdatingCart}>
											{#if cartState.isUpdatingCart}
												<LoadingDots />
											{:else}
												<Save class="mr-2 h-4 w-4" />
												Save Address
											{/if}
										</Button>
									</div>
								</form>
							{/if}
						</div>
					{/if}
				</div>
			{/if}

			<!-- Right Column - Order Summary -->
			<div class="space-y-6">
				<div class="rounded-lg bg-white p-6 shadow">
					<h2 class="mb-4 text-xl font-semibold">Order Summary</h2>
					{#if loadingForCart}
						<div class="flex items-center justify-center py-8">
							<LoadingDots />
						</div>
					{:else}
						<div class="space-y-4">
							<!-- {#each cartState.cart.lineItems || [] as item}
								<a class="flex gap-4 border-b py-3" href={`/products/${item.slug}`} target="_blank">
									<div class="relative">
										<img src={item.thumbnail} alt={item.title} class="h-20 w-16 rounded object-cover" />
										<div class="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-gray-500 text-xs text-white">
											{item.qty}
										</div>
									</div>
									<div class="flex-1">
										<p class="line-clamp-2 font-medium">{item.title}</p>
										<p class="mt-1 text-sm text-gray-500">Qty: {item.qty}</p>
										<p class="mt-1 font-semibold">{formatPrice(item.price * item.qty, page?.data?.store?.currency?.code)}</p>
									</div>
								</a>
							{/each} -->

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
								<div class="flex justify-between">
									<span class="text-gray-600">Shipping</span>
									<span
										>{cartState.cart.shippingCharges ? formatPrice(cartState.cart.shippingCharges, page?.data?.store?.currency?.code) : 'FREE'}</span
									>
								</div>
							</div>

							<div class="flex items-center justify-between py-4 text-lg font-semibold">
								<span>Total</span>
								<span>{formatPrice(cartState.cart.total, page?.data?.store?.currency?.code)}</span>
							</div>

							{#if showError}
								<div class="mb-4 text-red-500">
									{errorMessage}
								</div>
							{/if}

							{#if showPaymentMethods}
								<div class="mb-4">
									<label class="mb-2 block text-sm font-medium text-gray-700" for="paymentMethod">Select Payment Method</label>

									<select
										id="paymentMethod"
										bind:value={SELECTED_PG_NAME}
										class="focus:border-primary-500 focus:ring-primary-500 border-inputmt-1 block w-full rounded border px-3 py-2"
									>
										{#each listOfPaymentMethods as method}
											<option value={method.name}>{method.name}</option>
										{/each}
									</select>
								</div>
							{/if}

							{#if currentCheckoutStep === 1}
								<Button
									class="w-full py-6 text-lg"
									onclick={() => {
										currentCheckoutStep = 2
									}}
								>
									Continue to Address
								</Button>
							{:else if cartState.cart.email && cartState.cart.shippingAddress && !editAddress}
								<Button class="w-full py-6 text-lg" onclick={placeOrder} disabled={checkoutDisabled}>
									{#if paymentLoader}
										<LoadingDots />
									{:else}
										Place Order
									{/if}
								</Button>
							{/if}
						</div>
					{/if}
				</div>

				<div class="rounded-lg bg-white p-4 shadow">
					<div class="flex items-center text-sm text-gray-600">
						<ShoppingBag class="mr-2 size-4" />
						<span>Your order is secured with 256-bit encryption</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<AddressListModal bind:show={showAddressList} {addresses} onaddnew={handleAddNewAddress} onedit={handleEditAddress} onselect={handleSelectAddress} />

<AddressFormModal
	bind:show={showAddressForm}
	bind:address={currentAddress}
	isEdit={isEditingAddress}
	onback={handleBackToList}
	onsave={handleSaveAddress}
/>
