import { getCartState } from '../stores/cart.svelte'
import { toast } from '../utils'

export class AddressListState {
	cartState = getCartState()

	loading = $state(false)
	loadMoreTrigger = $state<HTMLDivElement | null>(null)
	pageNo = $state(1)
	hasMore = $state(true)
	onaddnew = $state<() => void>()
	onedit = $state<(address: any) => void>()
	onselect = $state<(address: any) => void>()
	paginateAddress = $state<(pageNo: number) => Promise<boolean>>()
	show = $state(false)

	handleAddNew = () => {
		this.onaddnew?.()
	}

	handleEdit = (address: any) => {
		this.onedit?.(address)
	}

	handleSelect = (address: any) => {
		this.onselect?.(address)
		this.show = false
	}

	constructor({
		paginateAddress,
		onaddnew,
		onedit,
		onselect
	}: {
		paginateAddress?: (pageNo: number) => Promise<boolean>
		onaddnew?: () => void
		onedit?: (address: any) => void
		onselect?: (address: any) => void
	}) {
		paginateAddress && (this.paginateAddress = paginateAddress)
		onaddnew && (this.onaddnew = onaddnew)
		onedit && (this.onedit = onedit)
		onselect && (this.onselect = onselect)

		$effect(() => {
			const observer = new IntersectionObserver(
				async (entries) => {
					const first = entries[0]
					if (first.isIntersecting && paginateAddress && this.hasMore && !this.loading) {
						try {
							this.loading = true
							this.hasMore = await paginateAddress(++this.pageNo)
						} catch (e: any) {
							toast(e.message || 'Failed to load more addresses', 'error')
						} finally {
							this.loading = false
						}
					}
				},
				{ threshold: 0.1 }
			)

			if (this.loadMoreTrigger) observer.observe(this.loadMoreTrigger)

			return () => {
				observer.disconnect()
			}
		})
	}
}
