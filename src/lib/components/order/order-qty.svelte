<script lang="ts">
	// One row's control on the quick-order page (D255): Add, then − and + on the bag line it made.
	// It drives the same cart store as the bag, so the drawer and the checkout see the same lines.
	import type { MenuRow } from '$lib/order/menu'
	import { getCartState } from '$lib/core/stores/index.js'
	import { Minus, Plus } from '@lucide/svelte'
	import { Button } from '$lib/components/ui/button'
	import Spinner from '$lib/components/common/spinner.svelte'
	import { fireGTagEvent } from '$lib/core/utils/index.js'

	let { row }: { row: MenuRow } = $props()

	const cartState = getCartState()
	const name = $derived(row.label ? `${row.title}, ${row.label}` : row.title)
	const line = $derived(cartState?.cart?.lineItems?.find((l: any) => String(l?.variantId) === row.variantId))
	const qty = $derived(Number(line?.qty) || 0)

	let working = $state(false)
	const busy = $derived(working || !!(line && cartState?.updatingItem?.[line.id]))

	const analytics = (units: number) => ({
		items: [{ id: row.productId, productId: row.productId, variantId: row.variantId, title: row.title, price: row.price, qty: units }],
		total: row.price * units,
		qty: units
	})

	async function change(next: number) {
		working = true
		const before = qty
		try {
			const ok = line
				? await cartState?.update({ qty: next, lineId: line.id, productId: row.productId, variantId: row.variantId })
				: await cartState?.add({ qty: next, productId: row.productId, variantId: row.variantId })
			// The store toasts a refused change and resolves anyway; only a line that moved is counted.
			if (ok && qty !== before) fireGTagEvent(qty > before ? 'add_to_cart' : 'remove_from_cart', analytics(Math.abs(qty - before)))
		} finally {
			working = false
		}
	}
</script>

{#if row.soldOut}
	<span class="inline-flex h-9 min-w-[7.5rem] items-center justify-center text-xs font-medium text-muted-foreground max-md:min-h-11">Sold out</span>
{:else if qty === 0}
	<Button
		variant="outline"
		class="min-w-[7.5rem] transition-transform duration-fast ease-standard motion-safe:active:scale-[0.97]"
		disabled={busy}
		aria-busy={busy}
		aria-label="Add {name}"
		onclick={() => change(1)}
	>
		{#if busy}<Spinner size={4} label="Adding {name}" />{:else}Add{/if}
	</Button>
{:else}
	<div class="flex min-w-[7.5rem] items-center justify-between rounded-radius border border-primary bg-background">
		<Button variant="ghost" size="icon" class="rounded-r-none border-0" aria-label="One fewer {name}" disabled={busy} onclick={() => change(qty - 1)}>
			<Minus class="size-4" />
		</Button>
		<span
			class="flex min-w-[2rem] items-center justify-center text-sm font-semibold tabular-nums text-foreground"
			aria-live="polite"
			aria-atomic="true"
		>
			{#if busy}<Spinner size={4} label="Updating {name}" />{:else}{qty}<span class="sr-only"> {name} in your order</span>{/if}
		</span>
		<Button variant="ghost" size="icon" class="rounded-l-none border-0" aria-label="One more {name}" disabled={busy} onclick={() => change(qty + 1)}>
			<Plus class="size-4" />
		</Button>
	</div>
{/if}
