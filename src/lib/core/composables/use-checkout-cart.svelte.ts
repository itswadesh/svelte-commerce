import { goto } from '$app/navigation'
import { page } from '$app/state'
import { wishlistService, type Address, type Cart, type CartLineItem, type Variant } from '$lib/core/services'
import { getCartState, type Cart2State } from '$lib/core/stores/cart.svelte'
import { fireGTagEvent } from '$lib/core/utils/gtag'
import { appendOneTimeCartId } from '$lib/core/utils/one-time-cart'

interface CartLineItemExtended extends CartLineItem {
	isSelectedForCheckout: boolean
	thumbnail: string
	title: string
	slug: string
	variant: Variant
}

interface CartExtended extends Cart {
	shippingAddress?: Address
	billingAddress?: Address
	lineItems: CartLineItemExtended[]
}

interface CartStateExtended extends Cart2State {
	cart: CartExtended
}

export class CartModule {
  isMovingToWishlist = $state<Record<string, boolean>>({})

	cartState = getCartState() as CartStateExtended
	loadingForCart = $state(false)
	loadingForCheckout = $state(false)
	showError = $state(false)
	errorMessage = $state('')

	partialCheckoutEnabled = $derived(page?.data?.store?.plugins?.isPartialCheckout?.active)
	allItemsChecked = $derived(this.cartState?.cart?.lineItems?.every((item: any) => item.isSelectedForCheckout))
	isIndeterminate = $derived(
		this.cartState?.cart?.lineItems?.some((item: any) => item.isSelectedForCheckout) &&
			!this.cartState?.cart?.lineItems?.every((item: any) => item.isSelectedForCheckout)
	)
	noItemsChecked = $derived(this.cartState?.cart?.lineItems?.every((item: any) => !item.isSelectedForCheckout))

	handleRootCheckedChange = (checked: boolean) => {
		if (checked) {
			this.cartState.cart?.lineItems?.forEach?.((item: any) => {
				item.isSelectedForCheckout = true
				this.cartState?.update({
					qty: item.qty,
					lineId: item.id,
					productId: item.productId,
					variantId: item.variantId,
					isSelectedForCheckout: true
				})
			})
		} else {
			this.cartState.cart?.lineItems?.forEach?.((item: any) => {
				item.isSelectedForCheckout = false
				this.cartState?.update({
					qty: item.qty,
					lineId: item.id,
					productId: item.productId,
					variantId: item.variantId,
					isSelectedForCheckout: false
				})
			})
		}
	}

	handleCheckedChange = (checked: boolean, item: CartLineItem) => {
		this.cartState?.update({
			qty: item.qty,
			lineId: item.id,
			productId: item.productId,
			variantId: item.variantId,
			isSelectedForCheckout: checked
		})
	}

	increaseQty = (e: Event, item: CartLineItem) => {
		e?.preventDefault()
		e?.stopPropagation()
		this.cartState.update({
			qty: item.qty + 1,
			lineId: item.id,
			productId: item.productId,
			variantId: item.variantId
		})
	}

	decreaseQty = (e: Event, item: CartLineItem) => {
		e?.preventDefault()
		e?.stopPropagation()
		fireGTagEvent('remove_from_cart', {
			items: [{ ...item, qty: 1 }],
			price: item.price
		})
		this.cartState.update({
			qty: item.qty - 1,
			lineId: item.id,
			productId: item.productId,
			variantId: item.variantId
		})
	}

	removeItem = (e: Event | null, item: CartLineItem) => {
    if (e) {
		  e?.preventDefault?.()
		  e?.stopPropagation?.()
    }
		fireGTagEvent('remove_from_cart', {
			items: [{ ...item }],
			price: item.price
		})
		this.cartState.update({
			qty: 0,
			lineId: item.id,
			productId: item.productId,
			variantId: item.variantId
		})
	}

	gotoCheckout = async () => {
		this.loadingForCheckout = true
		await goto(appendOneTimeCartId('/checkout/address'))
		this.loadingForCheckout = false
	}

  addToWishlist = async (item: CartLineItemExtended) => {
    try {
      const res = await wishlistService.toggleWishlist({
        productId: item.productId,
        variantId: item.variantId
      })

      return res?.active || false
    } catch (error) {
      console.log(error)
    }
  }

  checkIfInWishlist = async (item: CartLineItemExtended) => {
    try {
      const res = await wishlistService.checkWishlist({
        productId: item.productId,
        variantId: item.variantId
      })

      return res
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * Move a single product to wishlist and remove from cart
   * @param item
   * @note This is a temporary way of moving items to wishlist until we have a separate route for it
   */
  moveToWishlist = async (item: CartLineItemExtended) => {
    this.isMovingToWishlist[item.productId] = true
    try {
      const isWishlisted = await this.checkIfInWishlist(item)

      if (!isWishlisted) {
        const res = await this.addToWishlist(item)

        if (res) {
          this.removeItem(null, item)
        }
      } else {
        this.removeItem(null, item)
      }
    } catch (error) {
      console.log(error)
    }
    setTimeout(() => {
      delete this.isMovingToWishlist[item.productId]
    }, 2000)
  }
}

