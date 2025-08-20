import { page } from '$app/state'
import { addressService, type Address, type PaginatedResponse } from '$lib/core/services'
import { getUserState } from '$lib/core/stores/auth.svelte'
import { toast } from 'svelte-sonner'
import { showAuthModal } from '$lib/core/components/auth/auth-utils'

export class MyAddressesModule {
	userState = getUserState()
	loading = $state(false)
	addresses = $state<PaginatedResponse<Address> | null>(null)
	error = $state(null)
	showAddressFormModal = $state(false)
	isEditing = $state(false)
	selectedAddress = $state<Record<string, any>>({})

	constructor() {
		$effect(() => {
			this.paginateAddress()
		})
	}

	handleSave = async (address: Address) => {
		try {
			if (this.isEditing) {
				await addressService.saveAddress(address)
				await this.paginateAddress()
			} else {
				address.id = 'new'
				const res = await addressService.saveAddress(address)
				await this.paginateAddress()
			}
			toast.success('Address saved')
		} catch (e) {
			toast.error('Failed to save address')
			console.error('Error saving address:', e)
		}
	}

	handleDelete = async (address: any) => {
		try {
			await addressService.deleteAddress(address.id)
			toast.success('Address Deleted')
			await this.paginateAddress()
		} catch (e) {
			// also happens when address is used in cart
			toast.error('Failed to delete address')
			console.error('Error deleting address:', e)
		}
	}

	handleEdit = (address: any) => {
		this.selectedAddress = address
		this.showAddressFormModal = true
		this.isEditing = true
	}

	handleAddNew = () => {
		this.isEditing = false
		this.showAddressFormModal = true
		this.selectedAddress = {}
	}

	paginateAddress = async () => {
		try {
			this.loading = true
			const obj: any = {
				page: page.url.searchParams.get('page') || 1,
				q: page.url.searchParams.get('q'),
				sort: page.url.searchParams.get('sort') || 'createdAt'
			}

			const { me } = this.userState?.retrieveUserId()
			this.addresses = await addressService.list({ page: obj.page, user: me?.userId })
		} catch (e: any) {
			this.error = e
			console.error(e)
			const msg = e?.message || e?.toString?.() || ''
			if (e?.status === 401 || e?.status === 403 || /invalid jwt/i.test(msg)) {
				toast.error('Session expired. Please log in again.')
				showAuthModal('login')
			} else {
				toast.error('Failed to load addresses')
			}
		} finally {
			this.loading = false
		}
	}
}

