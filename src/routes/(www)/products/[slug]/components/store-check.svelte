<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet'
	import { useProductState } from '$lib/core/composables/product'
	import { AlertTriangle, Check, Clock, StoreIcon } from 'lucide-svelte'

	const productState = useProductState()
</script>

{#if productState.wareHousePluginEnabled}
	<Sheet.Root>
		<div class="my-5 flex flex-col gap-2">
			<div class="flex items-center gap-2">
				<StoreIcon class="h-5 w-5" />
				<span class="font-semibold">Looking to pickup this item?</span>
			</div>

			<span class="text-sm text-gray-500">
				You can pick up this item from our store. Please check the availability of this item at your nearest store.
			</span>

			<Sheet.Trigger class="self-start text-sm underline">Check Availability</Sheet.Trigger>
		</div>

		<Sheet.Content class="p-0">
			<Sheet.Header class="p-6 pb-0">
				<Sheet.Title>Availability at Stores</Sheet.Title>
			</Sheet.Header>

			<div class="mt-5 flex flex-col divide-y border-y">
				{#each productState?.warehouses as house}
					<div class="flex items-center justify-between p-6 py-4">
						<div class="flex w-full flex-col gap-2">
							<div class="flex w-full items-center justify-between gap-2">
								<h3 class="font-medium text-gray-900">{house.location}</h3>

								{#if Number(house.stock) > 0}
									<span class="flex w-fit items-center gap-1 self-start rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-600">
										<Check size={12} />
										<span class="whitespace-nowrap">In Stock</span>
									</span>
								{:else}
									<span class="flex w-fit items-center gap-1 self-start rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600">
										<AlertTriangle size={12} />
										<span class="whitespace-nowrap">Out of Stock</span>
									</span>
								{/if}
							</div>

							<div class="flex items-center gap-1 text-xs text-gray-500">
								<Clock size={12} />
								<span>Lead Time: <span class="font-medium text-gray-700">{house.leadTime} hours</span></span>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</Sheet.Content>
	</Sheet.Root>
{/if}
