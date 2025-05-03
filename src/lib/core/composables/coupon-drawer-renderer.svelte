<script lang="ts">
	import { toast } from 'svelte-sonner'
	import { onMount, type Snippet } from 'svelte'
	import { couponService } from '$lib/core/services'
	import { getCartState } from '$lib/core/stores/cart.svelte'
	import { browser } from '$app/environment'

  interface Props {
    code: string
    content: Snippet<[SnippetParams]> 
  }

	let { content, code = $bindable() }: Props = $props()

	interface SnippetParams {
	  coupons: Coupon[]
	  isChecking: boolean
	  show: boolean
    innerWidth: number
    handleCheck: () => void
    handleCouponClick: (couponCode: string) => void
    handleCopy: (couponCode: string) => void
	}

	interface Coupon {
		code: string
		minAmount: number
		amount: number
		validTill: Date
		isPercent: boolean
		description?: string
	}

	let cartState = getCartState()

	let coupons: Coupon[] = $state([])
	let isChecking = $state(false)
	let show = $state(false)

	onMount(async () => {
		try {
			const res = await couponService.listCoupons({ page: 1 })
			if (res?.data?.length) {
				coupons = res.data
				show = true
			}
		} catch (error) {
			console.error(error)
		}
	})

	const handleCheck = async () => {
		try {
			isChecking = true
			const c = await cartState?.applyCoupon(code)
			if (c?.couponCode) {
				toast.success('Coupon applied successfully')
			} else {
				toast.error('Invalid coupon code')
			}
		} catch (error) {
			// toast.error(error.message)
		} finally {
			isChecking = false
		}
	}

	const handleCopy = (couponCode: string) => {
		navigator.clipboard.writeText(couponCode)
		toast.success('The coupon code has been copied to your clipboard.')
	}

	let innerWidth = $derived.by(() => {
		if (browser) {
			return window.innerWidth
		}
		return 0
	})

	const handleCouponClick = (couponCode: string) => {
		// handleCopy(couponCode)
		code = couponCode
		handleCheck()
	}
</script>

{@render
  content({ isChecking, innerWidth, coupons, show, handleCopy, handleCouponClick, handleCheck  })
}
