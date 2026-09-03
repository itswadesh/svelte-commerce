<script lang="ts">
	import type { CartProduct } from '$lib/core/types/index.js'
	import { getCartState, getUserState } from '$lib/core/stores/index.js'
	import { Minus, Plus, Trash2 } from '@lucide/svelte'
	import { Button } from '$lib/components/ui/button'
	import LazyImg from '$lib/core/components/image/lazy-img.svelte'
	import Spinner from '$lib/components/common/spinner.svelte'
	import { formatPrice, fireGTagEvent } from '$lib/core/utils/index.js'
	import { page } from '$app/state'

	const cartState = getCartState()
	const userState = getUserState()

	let loading = $state(false)

	type Props = {
		cartProduct: CartProduct
		removeItem: (id: string) => void
	}

	let { cartProduct = $bindable(), removeItem }: Props = $props()

	let totalPrice = $derived((cartProduct?.price || 0) * (cartProduct?.qty || 0))
	const currencyCode = $derived(page?.data?.store?.currency?.code)

	// The store flips `updatingItem[lineId]` around every mutation, so a change started from the
	// cart page while the drawer is open is reflected here too, not only the one this row started.
	const isBusy = $derived(loading || !!cartState?.updatingItem?.[cartProduct?.id as string])

	function analyticsProduct() {
		const categoryNames = cartProduct?.product?.categories?.flatMap?.((c: { category?: { name?: string } }) => c.category?.name) || []
		return { ...(cartProduct || {}), categoryNames }
	}

	function closeDrawer() {
		if (cartState) cartState.isOpen = false
	}

	async function setQty(next: number) {
		loading = true
		try {
			await cartState?.update({
				qty: next,
				lineId: cartProduct.id,
				productId: cartProduct.productId,
				variantId: cartProduct.variantId
			})
		} finally {
			loading = false
		}
	}

	async function decrease(e: Event) {
		e.stopPropagation()
		fireGTagEvent('remove_from_cart', { items: [analyticsProduct()], price: cartProduct.price })
		await setQty(cartProduct.qty - 1)
	}

	async function increase(e: Event) {
		e.stopPropagation()
		const me = userState?.user
		fireGTagEvent('add_to_cart', {
			items: [{ ...analyticsProduct(), qty: cartProduct?.qty + 1 }],
			total: cartProduct?.price * (cartProduct?.qty + 1),
			qty: cartProduct?.qty + 1,
			vendorBusinessName: cartProduct?.vendor?.businessName,
			// Only the pseudonymous id: name and email are PII and must not reach GA4.
			user: { id: me?._id || me?.id }
		})
		await setQty(cartProduct.qty + 1)
	}

	async function remove(e: Event) {
		e?.preventDefault()
		e?.stopPropagation()
		fireGTagEvent('remove_from_cart', { items: [analyticsProduct()], price: cartProduct.price })
		await setQty(0)
	}
</script>

<div class="flex gap-3 py-4">
	<!-- Reserved box: a missing image is demo data, but a row that collapses to nothing because of
	     one is a layout defect, so the thumbnail keeps its dimensions either way. -->
	<a href="/products/{cartProduct?.slug}" class="block h-24 w-[4.5rem] shrink-0 overflow-hidden rounded-md bg-muted" onclick={closeDrawer}>
		<LazyImg src={cartProduct?.thumbnail} alt={cartProduct?.title || 'Product'} class="h-full w-full object-contain" />
	</a>

	<div class="flex min-w-0 flex-1 flex-col gap-2">
		<div class="flex items-start justify-between gap-2">
			<div class="min-w-0 flex-1">
				<a href="/products/{cartProduct?.slug}" onclick={closeDrawer} class="block">
					<h4 class="line-clamp-2 text-sm font-medium text-foreground">{cartProduct?.title}</h4>
				</a>
				{#if cartProduct?.variantTitle}
					<p class="mt-0.5 truncate text-xs text-muted-foreground">{cartProduct.variantTitle}</p>
				{/if}
			</div>

			<p class="shrink-0 text-sm font-semibold text-foreground">
				{formatPrice(totalPrice, currencyCode)}
			</p>
		</div>

		{#if cartProduct.qty > 1}
			<!-- `text-muted` painted this in the surface colour at 2.27:1 on the panel; the unit price
			     is the one figure a shopper holding two of something needs to be able to read. -->
			<p class="text-xs text-muted-foreground">
				{formatPrice(cartProduct.price, currencyCode)} each
			</p>
		{/if}

		<!-- The stepper and remove used to be 22px and 32px boxes 11px apart, so a mis-tap deleted the
		     line instead of adding one. `size="icon"` is the shared 44px-on-phone / 36px-from-md box
		     the cart page uses, and the remove button is pushed to the far end of the row. -->
		<div class="mt-auto flex items-center justify-between gap-3 pt-1">
			<div class="flex items-center rounded-radius border border-border bg-background">
				<Button
					variant="ghost"
					size="icon"
					data-testid="decrease-quantity"
					onclick={decrease}
					class="rounded-r-none border-0"
					aria-label="Decrease quantity of {cartProduct?.title}"
					disabled={isBusy || cartProduct.qty <= 1}
				>
					<Minus class="size-4" />
				</Button>

				<span
					data-testid="item-quantity"
					class="flex min-w-[2.25rem] items-center justify-center px-1 text-sm font-semibold tabular-nums text-foreground"
					aria-live="polite"
					aria-atomic="true"
				>
					{#if isBusy}
						<Spinner size={4} label="Updating quantity" />
					{:else}
						{cartProduct.qty}
					{/if}
				</span>

				<Button
					variant="ghost"
					size="icon"
					data-testid="increase-quantity"
					class="rounded-l-none border-0"
					aria-label="Increase quantity of {cartProduct?.title}"
					disabled={isBusy}
					onclick={increase}
				>
					<Plus class="size-4" />
				</Button>
			</div>

			<Button
				variant="ghost"
				size="icon"
				data-testid="remove-item"
				class="text-muted-foreground hover:border-transparent hover:bg-destructive/10 hover:text-destructive"
				aria-label="Remove {cartProduct?.title} from bag"
				disabled={isBusy}
				onclick={remove}
			>
				<Trash2 class="size-4" />
			</Button>
		</div>
	</div>
</div>
