<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet/index.js'
	import { useProductState } from '$lib/core/composables/index.js'
	import { AlertTriangle, Check, Clock, Home, MapPin, StoreIcon } from '@lucide/svelte'
	import { Button } from '$lib/components/ui/button/index.js'

	const productState = useProductState()
</script>

{#if productState.wareHousePluginEnabled && productState.warehouses?.length > 0}
	<Sheet.Root>
		<div class="edp-store my-5 flex flex-col gap-2">
			<div class="flex items-center gap-2">
				<StoreIcon class="h-5 w-5" />

				<span class="edp-store-title font-semibold">Looking to pickup this item?</span>
			</div>

			<span class="edp-store-text text-sm text-muted-foreground">
				You can pick up this item from our store. Please check the availability of this item at your nearest store.
			</span>

			<Sheet.Trigger>
				<Button variant="link" class="h-auto self-start p-0">Check Availability</Button>
			</Sheet.Trigger>
		</div>

		<Sheet.Content class="p-0">
			<Sheet.Header class="p-6 pb-0">
				<Sheet.Title>Availability at Stores</Sheet.Title>
			</Sheet.Header>

			<div class="mt-5 flex flex-col divide-y border-y">
				{#each productState.warehouses as house}
					<div class="flex items-center justify-between p-6 py-4">
						<div class="flex w-full flex-col gap-2">
							<div class="flex w-full items-center justify-between gap-2">
								<h3 class="text-lg font-semibold text-foreground">{house.name}</h3>

								{#if Number(house.stock) > 0}
									<span class="flex w-fit items-center gap-1 self-start rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
										<Check size={12} />

										<span class="whitespace-nowrap">In Stock</span>
									</span>
								{:else}
									<span class="flex w-fit items-center gap-1 self-start rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
										<AlertTriangle size={12} />

										<span class="whitespace-nowrap">Out of Stock</span>
									</span>
								{/if}
							</div>

							<!-- Address Information -->

							<div class="flex flex-col gap-1 text-sm">
								<div class="flex items-center gap-1 text-muted-foreground">
									<MapPin size={12} />

									<span class="text-foreground">{house.address_1}{house.address_2 ? `, ${house.address_2}` : ''}</span>
								</div>

								<div class="flex items-center gap-1 pl-4 text-muted-foreground">
									<span>{house.city}, {house.state} {house.zip}</span>
								</div>
							</div>

							<div class="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
								<Clock size={12} />

								<span>Lead Time: <span class="font-medium text-foreground">{house.leadTime} hours</span></span>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</Sheet.Content>
	</Sheet.Root>
{/if}

<style>
	/* Refined Editorial — default theme only. In-flow block only (Sheet is portaled). */
	:global([data-theme='default'] .edp-store) {
		border-top: 1px solid var(--ed-line);
		padding-top: 16px;
	}

	:global([data-theme='default'] .edp-store-title) {
		font-family: var(--ed-body);
		font-weight: 600;
		letter-spacing: 0.01em;
		color: var(--ed-ink);
	}

	:global([data-theme='default'] .edp-store-text) {
		color: var(--ed-soft);
		line-height: 1.6;
	}
</style>
