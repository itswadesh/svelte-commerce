import { goto } from '$app/navigation'
import { page } from '$app/state'
import { addressService } from '$lib/core/services'
import { getUserState } from '$lib/core/stores/auth.svelte'
import { Cart2State, getCartState } from '$lib/core/stores/cart.svelte'
import type { Address, Cart } from '$lib/core/types'
import { onMount } from 'svelte'
import { toast } from 'svelte-sonner'
import { z } from 'zod'

interface CartExtended extends Cart {
	shippingAddress?: Address
	billingAddress?: Address
}

interface CartState extends Cart2State {
	cart: CartExtended
}

export const schemas = {
	email: z
		.string()
		.email('Please enter a valid email address')
		.min(5, 'Email must be at least 5 characters')
		.max(100, 'Email must be less than 100 characters'),
	phone: z
		.string()
		.regex(/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number')
		.min(9, 'Please enter a valid phone number')
		.max(17, 'Please enter a valid phone number')
}

export class AddressModule {
	userState = getUserState()
	cartState = getCartState() as CartState

	noItemsChecked = $derived(this.cartState?.cart?.lineItems?.every((item: any) => !item.isSelectedForCheckout))

	email = $state('')
	phone = $state('')
	loadingForCart = $state(false)
	loadingForCheckout = $state(false)
	editAddress = $state(false)
	editEmail = $state(false)
	isBillingAddressSameAsShipping = $state(true)
	currentAddress: Record<string, any> = $state({
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
	billingAddress: Record<string, any> = $state({
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
	isLoggedIn = $state(false)
	showAddressList = $state(false)
	showAddressForm = $state(false)
	showBillingAddressForm = $state(false)
	isEditingAddress = $state(false)
	addresses: any[] = $state([])
	showError = $state(false)
	errorMessage = $state('')
	showLoginModal = $state(false)
	loadingForShippingAddressSaveToCart = $state(false)

	constructor() {
		$effect(() => {
			if (this.cartState?.cart?.shippingAddressId && this.cartState?.cart?.billingAddressId) {
				this.isBillingAddressSameAsShipping = this.cartState.cart.shippingAddressId === this.cartState.cart.billingAddressId
			} else {
				this.isBillingAddressSameAsShipping = true
			}
		})

		// handle case where user logs in the current page
		$effect(() => {
			if (!this.isLoggedIn && this.userState?.user?.userId) this.mount()
		})

		onMount(this.mount)

		$effect(() => {
			// When checkbox is toggled, update billing address
			if (this.isBillingAddressSameAsShipping) {
				if (this.cartState.cart.billingAddress) {
					this.billingAddress = {
						id: this.cartState.cart.billingAddress.id || 'new',
						firstName: this.cartState.cart.billingAddress.firstName,
						lastName: this.cartState.cart.billingAddress.lastName,
						phone: this.cartState.cart.billingAddress.phone,
						address_1: this.cartState.cart.billingAddress.address_1,
						address_2: this.cartState.cart.billingAddress.address_2,
						city: this.cartState.cart.billingAddress.city,
						state: this.cartState.cart.billingAddress.state,
						zip: this.cartState.cart.billingAddress.zip,
						countryCode: this.cartState.cart.billingAddress.countryCode || page?.data?.store?.country?.code || 'IN'
					}
				} else {
					this.billingAddress = {
						...this.currentAddress,
						id: 'new' // Always set id to 'new' when copying
					}
				}
			}
		})
	}

	saveEmail = async (e: any) => {
		e.preventDefault()

		try {
			schemas.email.parse(this.email)
			schemas.phone.parse(this.phone)
			await this.cartState.updateEmail({ email: this.email, phone: this.phone })

			if (this.addresses.length === 0) {
				this.showAddressForm = true
			} else {
				this.currentAddress = this.addresses[0]
				this.saveShippingAddress({})
			}
		} catch (e) {
			toast.error('Failed to save contact details')
		}
		this.editEmail = false
	}

	saveShippingAddress = async (e: any) => {
		e?.preventDefault?.()
		// if (isBillingAddressSameAsShipping) {
		// 	billingAddress = { ...currentAddress, id: 'new' }
		// }
		try {
			this.loadingForShippingAddressSaveToCart = true
			await this.cartState.updateShippingAddress({
				shippingAddress: this.currentAddress,
				billingAddress: this.billingAddress,
				isBillingAddressSameAsShipping: this.isBillingAddressSameAsShipping
			})
		} catch (e: any) {
			console.error(e)
			toast.error(e.message)
		} finally {
			this.loadingForShippingAddressSaveToCart = false
		}
		this.editAddress = false
	}

	cancelSaveShippingAddress = (e: any) => {
		e.preventDefault()
		this.editAddress = false
	}

	saveBillingAddress = async (e: any) => {
		e?.preventDefault?.()
		// console.log(billingAddress, 'Biling address......', currentAddress)
		await this.cartState.updateShippingAddress({
			shippingAddress: null,
			billingAddress: this.billingAddress,
			isBillingAddressSameAsShipping: false
		})
		this.editAddress = false
		this.showBillingAddressForm = false
	}

	cancelSaveBillingAddress = (e: any) => {
		e.preventDefault()
		this.editAddress = false
		this.showBillingAddressForm = false
	}

	paginateAddress = async (pageNo: number) => {
		const res: any = await addressService.list({
			page: pageNo,
			user: this.userState.user.userId
		})
		const addressIds = new Set()
		this.addresses = [...this.addresses, ...res?.data].filter((x) => {
			if (addressIds.has(x.id)) return false
			addressIds.add(x.id)
			return true
		})
		return res.pageSize == res.data?.length
	}

	mount = async () => {
		await this.userState.hasLoaded
		if (this.userState?.user?.email) {
			this.isLoggedIn = true
			try {
				this.email = this.userState.user.email
				this.phone = this.userState.user.phone

				this.paginateAddress(1)

				await this.cartState.hasLoaded
				if (!this.cartState.cart.shippingAddress && this.addresses?.[0]) {
					this.currentAddress = { ...this.addresses[0] }
					this.saveShippingAddress({})
				}

				if (this.cartState.cart.shippingAddress && !this.addresses.find((x) => x?.id === this.cartState.cart?.shippingAddress?.id)) {
					this.addresses = [this.cartState.cart?.shippingAddress, ...this.addresses]
				}
			} catch (e) {
				console.log(e)
				toast.error((e as any)?.message)
			}
		} else {
			this.isLoggedIn = false
		}
	}

	handleEditEmail = async () => {
		this.editEmail = true
	}

	handleAddNewAddress = () => {
		this.isEditingAddress = false
		if (this.addresses.length > 0) {
			this.currentAddress = { ...this.addresses[0] }
			this.showAddressList = true
		} else {
			this.currentAddress = {
				id: 'new',
				firstName: '',
				lastName: '',
				phone: '',
				address_1: '',
				address_2: '',
				city: '',
				state: '',
				zip: '',
				countryCode: page?.data?.store?.country?.code || 'IN'
			}
			this.showAddressList = false
			this.showAddressForm = true
		}
	}

	handleAddNewAddressFromModal = () => {
		this.isEditingAddress = false
		this.currentAddress = {
			id: 'new',
			firstName: '',
			lastName: '',
			phone: '',
			address_1: '',
			address_2: '',
			city: '',
			state: '',
			zip: '',
			countryCode: page?.data?.store?.country?.code || 'IN'
		}
		this.showAddressList = false
		this.showAddressForm = true
	}

	handleEditAddress = (address: any) => {
		this.isEditingAddress = true
		this.currentAddress = { ...address }
		this.showAddressList = false
		this.showAddressForm = true
	}

	handleSelectAddress = async (address: any) => {
		// if (address.isNew) {
		// 	address.id = 'new'
		// 	delete address.isNew
		// }

		this.currentAddress = { ...address }

		if (this.isBillingAddressSameAsShipping) {
			this.billingAddress = this.currentAddress
		} else {
			this.billingAddress.id = 'new'
		}
		// console.log('🚀 ~ handleSelectAddress ~ currentAddress:', currentAddress)
		await this.cartState.updateShippingAddress({
			shippingAddress: this.currentAddress,
			billingAddress: this.billingAddress,
			isBillingAddressSameAsShipping: this.isBillingAddressSameAsShipping
		})
		this.showAddressList = false
	}

	handleBackToList = () => {
		this.showAddressForm = false
		this.showAddressList = true
	}

	removeUndefinedProperties = (obj: any): Record<string, any> => {
		return Object.keys(obj).reduce((acc: any, key) => {
			if (obj[key] !== undefined && obj[key] !== null) {
				acc[key] = obj[key]
			}
			return acc
		}, {})
	}

	handleDeleteAddress = async (address: any) => {
		if (!address.id) {
			return
		}

		await addressService.deleteAddress(address.id)
		this.addresses = this.addresses.filter((addr) => addr.id !== address.id)
	}

	handleSaveAddress = async (address: any, saveToCart = false) => {
		if (saveToCart) {
			this.saveShippingAddress({})
			this.showAddressForm = false
			return
		}

		// console.log('🚀 ~ handleSaveAddress ~ address:', address)
		const newAddress = this.removeUndefinedProperties(address)

		if (this.isEditingAddress) {
			this.addresses = this.addresses.map((addr) => (addr.id === newAddress.id ? newAddress : addr))
			await addressService.saveAddress(newAddress as any)
		} else {
			// newAddress.id = (addresses.length + 1).toString()
			// newAddress.isNew = true
			const res = await addressService.saveAddress(newAddress as any)
			this.addresses = [...this.addresses, res]
		}

		this.currentAddress = { ...newAddress }
		this.showAddressForm = false
		this.showAddressList = true
	}

	handleProceedToPayment = async () => {
		if (!this.isBillingAddressSameAsShipping && !this.cartState.cart.billingAddress?.address_1) {
			toast.error('Enter billing address to proceed')
			return
		}

		this.loadingForCheckout = true
		await goto('/checkout/payment')
		this.loadingForCheckout = false
	}
}

