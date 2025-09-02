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
			 => {
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
