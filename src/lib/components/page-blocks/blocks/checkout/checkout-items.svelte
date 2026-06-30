<script lang="ts">
	import { CartModule } from '@misiki/kitcommerce-core/composables'
	import { Button } from '$lib/components/ui/button/index.js'
	import { Check, Minus, Plus, Trash } from '@lucide/svelte'
	import { formatPrice } from '$lib/core/utils/index.js'
	import LoadingDots from '$lib/core/components/common/loading-dots.svelte'
	import { page } from '$app/state'
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte'
	import LazyImg from '$lib/core/components/image/lazy-img.svelte'

	import { getCartState } from '@misiki/kitcommerce-core/stores'

	const { block } = $props()

	const cartModule = new CartModule()
	const cartState = getCartState()
</script>

{#snippet quantitySelector(item: any)}
	<div class="flex items-center rounded-radius border border-border bg-background p-1 shadow-sm transition-all duration-300 hover:shadow-md">
		<Button
			variant="ghost"
			size="icon"
			onclick={(e) => cartModule.decreaseQty(e, item)}
			class="flex h-7 w-7 items-center justify-center"
			aria-label="Decrease quantity"
		>
			<Minus class="size-3 text-gray-900" />
		</Button>
		<span class="flex min-w-[2.5rem] items-center justify-center px-1 text-xs font-bold text-gray-900">
			{#if cartState.updatingItem[item.id]}
				<LoadingDots />
			{:else}
				{item.qty}
			{/if}
		</span>
		<Button
			variant="ghost"
			size="icon"
			class="flex h-7 w-7 items-center justify-center"
			aria-label="Increase quantity"
			onclick={(e) => cartModule.increaseQty(e, item)}
		>
			<Plus class="size-3 text-gray-900" />
		</Button>
	</div>
{/snippet}

<div
	class="h-fit divide-y divide-gray-200 overflow-hidden rounded-radius sm:border {cartModule.partialCheckoutEnabled
		? '[&>div:nth-child(2)]:max-sm:!border-t-0'
		: ''}"
>
	<!-- Root checkbox -->
	{#if cartModule.partialCheckoutEnabled}
		<div class="flex items-center justify-between">
			<div class="flex h-full items-stretch gap-2">
				<div class="flex min-h-full items-center justify-center px-1">
					<Checkbox
						id="allItemsChecked"
						checked={cartModule.allItemsChecked}
						indeterminate={cartModule.isIndeterminate}
						onCheckedChange={cartModule.handleRootCheckedChange}
					/>
				</div>
				<label for="allItemsChecked" class="py-1.5 text-sm text-gray-700 hover:cursor-pointer">Select all items</label>
			</div>
		</div>
	{/if}

	{#each cartState.cart.lineItems || [] as item}
		<div class="group relative flex">
			{#if cartModule.partialCheckoutEnabled}
				<label
					for={item.id}
					class="flex min-h-full items-center border-transparent px-4 hover:cursor-pointer {item.isSelectedForCheckout
						? 'bg-gray-100'
						: 'hover:bg-gray-50'}"
				>
					<Checkbox
						id={item.id}
						class="invisible absolute"
						bind:checked={item.isSelectedForCheckout}
						onCheckedChange={(e) => cartModule.handleCheckedChange(e, item)}
					/>

					<div>
						{#if item.isSelectedForCheckout}
							<Check class="size-5" strokeWidth={2.5} />
						{:else}
							<Check class="size-5 text-gray-300" strokeWidth={2.5} />
						{/if}
					</div>
				</label>
			{/if}

			<a class="flex flex-1 gap-3 py-5 sm:p-3 sm:px-4 md:gap-6 md:p-5" href={`/products/${item.slug}`} target="_blank">
				<div class="flex flex-col items-center gap-3">
					<div class="relative flex items-center justify-center">
						<div class="overflow-hidden bg-gray-50 ring-gray-100">
							<LazyImg src={item.thumbnail || '/placeholder.svg'} alt={item.title} class="w-24 object-contain object-top sm:w-32" />
						</div>
					</div>

					<div class="sm:hidden">
						{@render quantitySelector(item)}
					</div>
				</div>

				<div class="flex flex-1 flex-col">
					<div class="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
						<div class="flex-1">
							<h3 class="line-clamp-2 text-base font-bold tracking-tight text-gray-900 sm:text-lg">{item.title}</h3>

							<div class="mt-2 flex flex-wrap gap-2">
								<span class="inline-flex items-center rounded-radius border border-primary px-2 py-0.5 text-xs font-semibold ring-1 ring-gray-100">
									Qty: {item.qty}
								</span>
								{#if item.variant && item.variant.options && item.variant.options.length > 0}
									{#each item.variant.options as option}
										{#if option?.option?.title && option?.value}
											<span
												class="inline-flex items-center rounded-radius border border-primary px-2 py-0.5 text-xs font-semibold ring-1 ring-primary/10"
											>
												{option.option?.title}: {option?.value}
											</span>
										{/if}
									{/each}
								{/if}
							</div>
						</div>

						<div class="flex justify-between">
							<div class="text-left lg:hidden">
								<div class="flex items-baseline gap-2">
									<p class="text-base font-bold text-gray-900 sm:text-lg">
										{formatPrice(item.price * item.qty, page?.data?.store?.currency?.code)}
									</p>
									{#if item.mrp > item.price}
										<span class="text-xs text-gray-400 line-through">
											{formatPrice(item.mrp * item.qty, page?.data?.store?.currency?.code)}
										</span>
									{/if}
								</div>
								{#if item.mrp > item.price}
									<p class="text-xs font-medium tracking-tight text-green-600">
										You saved {formatPrice(item.mrp * item.qty - item.price * item.qty, page?.data?.store?.currency?.code)}
									</p>
								{:else}
									<p class="text-[10px] font-bold uppercase tracking-tighter text-gray-400">
										{formatPrice(item.price, page?.data?.store?.currency?.code)} each
									</p>
								{/if}
							</div>
							<div class="hidden lg:block">
								<Button
									variant="ghost"
									size="icon"
									class="h-auto w-auto p-1.5 text-gray-400"
									aria-label="Remove item"
									onclick={(e) => cartModule.removeItem(e, item)}
								>
									<Trash class="size-3.5 text-destructive" />
								</Button>
							</div>
						</div>
					</div>

					<div class="mt-auto flex items-center justify-between pt-6">
						<div
							class="hidden items-center rounded-radius border border-border bg-background p-1 shadow-sm transition-all duration-300 hover:shadow-md sm:flex"
						>
							<Button
								variant="ghost"
								size="icon"
								onclick={(e) => cartModule.decreaseQty(e, item)}
								class="flex h-7 w-7 items-center justify-center rounded-full"
								aria-label="Decrease quantity"
							>
								<Minus class="size-3 text-gray-900" />
							</Button>
							<span class="flex min-w-[2.5rem] items-center justify-center px-1 text-xs font-bold text-gray-900">
								{#if cartState.updatingItem[item.id]}
									<LoadingDots />
								{:else}
									{item.qty}
								{/if}
							</span>
							<Button
								variant="ghost"
								size="icon"
								class="flex h-7 w-7 items-center justify-center rounded-full"
								aria-label="Increase quantity"
								onclick={(e) => cartModule.increaseQty(e, item)}
							>
								<Plus class="size-3 text-gray-900" />
							</Button>
						</div>
						<div class="hidden sm:block lg:hidden">
							<Button
								variant="ghost"
								size="icon"
								class="h-auto w-auto p-1.5 text-gray-400"
								aria-label="Remove item"
								onclick={(e) => cartModule.removeItem(e, item)}
							>
								<Trash class="size-3.5 text-destructive" />
							</Button>
						</div>

						<div class="hidden text-right lg:block">
							<div class="flex items-baseline justify-end gap-2">
								<p class="text-base font-bold text-gray-900 sm:text-lg">
									{formatPrice(item.price * item.qty, page?.data?.store?.currency?.code)}
								</p>
								{#if item.mrp > item.price}
									<span class="text-xs line-through">
										{formatPrice(item.mrp * item.qty, page?.data?.store?.currency?.code)}
									</span>
								{/if}
							</div>
							{#if item.mrp > item.price}
								<p class="text-xs font-medium tracking-tight text-success">
									You saved {formatPrice(item.mrp * item.qty - item.price * item.qty, page?.data?.store?.currency?.code)}
								</p>
							{:else}
								<p class="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">
									{formatPrice(item.price, page?.data?.store?.currency?.code)} each
								</p>
							{/if}
						</div>
					</div>

					<Button
						variant="ghost"
						size="icon"
						class="mb-1.5 h-auto w-auto self-end p-1.5 text-gray-400"
						aria-label="Remove item"
						onclick={(e) => cartModule.removeItem(e, item)}
					>
						<Trash class="size-3.5" />
					</Button>
				</div>
			</a>
		</div>
	{/each}
</div>
