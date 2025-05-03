<script lang="ts">
	import { Button } from '$lib/components/ui/button'
	import { Dialog, DialogContent, DialogHeader, DialogTitle } from '$lib/components/ui/dialog'
	import { AddressListState } from '$lib/core/composables/use-address-list-form.svelte'
	import { LoaderCircle, PencilIcon as PencilSimple, Plus, Trash2 } from 'lucide-svelte'

	let {
		show = $bindable(),
		paginateAddress,
		addresses,
		onedit,
		onselect,
		onaddnew,
		ondelete
	}: {
		show: boolean
		addresses: any[]
		paginateAddress?: (pageNo: number) => Promise<boolean>
		onedit?: (address: any) => void
		onselect?: (address: any) => void
		onaddnew?: () => void
		ondelete?: (address: any) => void
	} = $props()
	const addressState = new AddressListState({ paginateAddress, onaddnew, onedit, onselect })
</script>

<Dialog bind:open={show}>
	<DialogContent class="sm:max-w-[425px]">
		<DialogHeader>
			<DialogTitle>Select Address</DialogTitle>
		</DialogHeader>
		<div class="grid max-h-[400px] gap-4 overflow-y-auto py-4">
			<Button variant="outline" class="w-full" onclick={addressState.handleAddNew}>
				<Plus class="mr-2 h-4 w-4" />
				Add New Address
			</Button>
			{#each addresses as address (address.id)}
				<div class="group flex items-center justify-between rounded-lg border p-4">
					<div class="flex-1">
						<p class="font-medium">{address.firstName} {address.lastName}</p>
						<p class="text-sm text-gray-500">{address.address_1}</p>
						<p class="text-sm text-gray-500">{address.address_2}</p>
						<p class="text-sm text-gray-500">
							{address.city}, {address.state}
							{address.zip}
						</p>
						<p class="text-sm text-gray-500">{address.phone}</p>
					</div>
					<div class="flex flex-col gap-2">
						<div class="flex justify-between gap-2">
							<Button variant="ghost" onclick={() => addressState.handleEdit(address)} class="w-fit opacity-0 group-hover:opacity-100">
								<PencilSimple class="h-4 w-4" />
							</Button>
							{#if addressState.cartState.cart?.shippingAddress?.id !== address.id}
								<Button type="button" variant="ghost" onclick={() => ondelete?.(address)} class="w-fit opacity-0 group-hover:opacity-100">
									<Trash2 class="h-4 w-4" />
								</Button>
							{/if}
						</div>
						<Button variant="secondary" onclick={() => addressState.handleSelect(address)}>Select</Button>
					</div>
				</div>
			{/each}
			<div bind:this={addressState.loadMoreTrigger} class="flex h-12 w-full items-center justify-center">
				{#if addressState.loading}
					<LoaderCircle class="animate-spin" />
				{/if}
			</div>
		</div>
	</DialogContent>
</Dialog>
