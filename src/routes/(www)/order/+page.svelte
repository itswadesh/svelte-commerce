<script lang="ts">
	// The quick-order page (GoCommerce D255, owner's choice of layout: a menu list, 2026-11-12):
	// every product on one page, a row per size with Add and − / +, and a pinned bar with the order
	// so far. It is the link a shop puts in its WhatsApp status and prints as a QR code.
	import { goto } from '$app/navigation'
	import { page } from '$app/state'
	import { Search, X } from '@lucide/svelte'
	import { getCartState } from '$lib/core/stores/index.js'
	import LazyImg from '$lib/core/components/image/lazy-img.svelte'
	import { Input } from '$lib/components/ui/input'
	import { Button } from '$lib/components/ui/button'
	import CheckoutButton from '$lib/components/buttons/checkout-button.svelte'
	import OrderQty from '$lib/components/order/order-qty.svelte'
	import { filterMenu, type MenuGroup } from '$lib/order/menu'
	import { formatPrice } from '$lib/utils/price'

	let { data } = $props()

	const cartState = getCartState()
	const storeName = $derived(page.data?.store?.name || '')
	const currency = $derived(page.data?.store?.currency?.code)
	const menu: MenuGroup[] = $derived(data.menu ?? [])
	// Chips and headings only when the store sorts its products into more than one group.
	const grouped = $derived(menu.length > 1)

	let query = $state('')
	const shown = $derived(filterMenu(menu, query))

	const lines = $derived(cartState?.cart?.lineItems ?? [])
	const count = $derived(lines.reduce((n: number, l: any) => n + (Number(l?.qty) || 0), 0))
	const total = $derived(lines.reduce((n: number, l: any) => n + (Number(l?.price) || 0) * (Number(l?.qty) || 0), 0))
	const countLabel = $derived(`${count} ${count === 1 ? 'item' : 'items'}`)

	let leaving = $state(false)
	async function next() {
		leaving = true
		try {
			await goto('/checkout/address')
		} finally {
			leaving = false
		}
	}
</script>

<svelte:head>
	<title>{storeName ? `Order from ${storeName}` : 'Order'}</title>
	<meta name="description" content="Pick what you want and the sizes on one page, then place your order." />
</svelte:head>

<div class="page-width max-w-3xl py-4 sm:py-8">
	<h1 class="page-heading">{storeName ? `Order from ${storeName}` : 'Order'}</h1>
	<p class="mt-1 text-sm text-muted-foreground">Pick what you want, then tap Next to place your order.</p>

	{#if menu.length}
		<label class="relative mt-4 block">
			<span class="sr-only">Search items</span>
			<Search class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
			<Input type="search" bind:value={query} placeholder="Search items" class="h-11 pl-9" autocomplete="off" />
		</label>

		{#if grouped && !query}
			<nav aria-label="Categories" class="-mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none]">
				{#each menu as group (group.slug)}
					<a
						href="#{group.slug}"
						class="shrink-0 rounded-full border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors duration-fast ease-standard hover:border-primary hover:bg-muted max-md:min-h-11 max-md:py-2.5"
						>{group.name || 'Other items'}</a
					>
				{/each}
			</nav>
		{/if}
	{/if}

	{#each shown as group (group.slug)}
		<section id={group.slug} class="mt-6 scroll-mt-24" aria-labelledby={grouped ? `${group.slug}-heading` : undefined}>
			{#if grouped}
				<h2 id="{group.slug}-heading" class="text-base font-semibold text-foreground">{group.name || 'Other items'}</h2>
			{/if}
			<ul class="divide-y divide-border">
				{#each group.items as item (item.productId)}
					{@const single = item.rows.length === 1 && !item.rows[0].label}
					<li class="py-3">
						<div class="flex items-center gap-3">
							<a href="/products/{item.slug}" class="size-12 shrink-0 overflow-hidden rounded-md bg-muted" tabindex="-1" aria-hidden="true">
								{#if item.image}<LazyImg src={item.image} alt="" class="h-full w-full object-cover" />{/if}
							</a>
							<div class="min-w-0 flex-1">
								<a href="/products/{item.slug}" class="line-clamp-2 text-sm font-medium text-foreground underline-offset-4 hover:underline"
									>{item.title}</a
								>
								{#if single}
									<p class="text-sm tabular-nums text-muted-foreground">{formatPrice(item.rows[0].price, currency)}</p>
								{/if}
							</div>
							{#if single}<OrderQty row={item.rows[0]} />{/if}
						</div>
						{#if !single}
							<ul class="mt-2 space-y-2 pl-[3.75rem]">
								{#each item.rows as row (row.variantId)}
									<li class="flex items-center gap-3">
										<p class="min-w-0 flex-1 text-sm">
											<span class="text-foreground">{row.label}</span>
											<span class="ml-2 tabular-nums text-muted-foreground">{formatPrice(row.price, currency)}</span>
										</p>
										<OrderQty {row} />
									</li>
								{/each}
							</ul>
						{/if}
					</li>
				{/each}
			</ul>
		</section>
	{:else}
		<div class="mt-10 text-center text-sm text-muted-foreground" aria-live="polite">
			{#if query}
				<p>Nothing matches “{query}”.</p>
				<Button variant="link" class="mt-1" onclick={() => (query = '')}><X class="size-4" aria-hidden="true" />Clear the search</Button>
			{:else}
				<p>There is nothing to order here right now.</p>
			{/if}
		</div>
	{/each}

	{#if count > 0}
		<div class="sm:sticky sm:bottom-0 sm:z-sticky sm:mt-6 sm:border-t sm:border-border sm:bg-background sm:py-3">
			<div class="sm:flex sm:items-center sm:justify-end sm:gap-6">
				<p class="hidden text-sm sm:block">
					<span class="font-semibold text-foreground">{countLabel}</span>
					<span class="tabular-nums text-muted-foreground">· {formatPrice(total, currency)}</span>
				</p>
				<CheckoutButton text="Next" total={formatPrice(total, currency)} totalLabel={countLabel} loading={leaving} onclick={next} class="sm:w-56" />
			</div>
		</div>
	{/if}
</div>
