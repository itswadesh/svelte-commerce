<script lang="ts">
	import { LoaderCircle, Plus, Trash } from 'lucide-svelte'
	import { Button } from '$lib/components/ui/button'
	import { PencilIcon } from 'lucide-svelte'
	import AddressFormModal from '$lib/components/address/address-form-modal.svelte'
	import Pagination from '$lib/components/common/pagination.svelte'
	import { MyAddressesModule } from '$lib/core/composables/use-my-addresses.svelte'

	const addressesModule = new MyAddressesModule()
</script>

<svelte:head>
	<title>Addresses</title>
</svelte:head>

<!-- Button to add new addresses -->
<Button variant="default" onclick={addressesModule.handleAddNew}>
	<Plus class="mr-2 h-4 w-4" />
	Add Addresses
</Button>

{#if addressesModule.loading}
	<div class="flex min-h-[100vh] w-full items-center justify-center">
		<LoaderCircle class="animate-spin" />
	</div>
{:else if addressesModule.addresses}
	<div class="grid grid-cols-1 gap-4 overflow-y-auto py-4 md:grid-cols-2 xl:grid-cols-3">
		{#if addressesModule.addresses?.data?.length === 0}
			<p class="text-center text-gray-500">No addresses found.</p>
		{:else}
			{#each addressesModule.addresses?.data as address (address.id)}
				<div class="flex items-center justify-between rounded-lg border p-4">
					<div class="flex-1">
						<p class="font-medium">{address.firstName} {address.lastName}</p>
						<p class="text-sm text-gray-500">{address.address_1}</p>
						<p class="text-sm text-gray-500">{address.address_2}</p>
						<p class="text-sm text-gray-500">{address.city}, {address.state} {address.zip}</p>
						<p class="text-sm text-gray-500">{address.phone}</p>
					</div>
					<div class="flex flex-col gap-2">
						<Button variant="ghost" size="icon" onclick={() => addressesModule.handleEdit(address)}>
							<PencilIcon class="h-4 w-4" />
						</Button>
						<Button variant="ghost" size="icon" onclick={() => addressesModule.handleDelete(address)}>
							<Trash class="h-4 w-4" />
						</Button>
					</div>
				</div>
			{/each}
		{/if}
	</div>

	<AddressFormModal
		bind:show={addressesModule.showAddressFormModal}
		bind:address={addressesModule.selectedAddress}
		isEdit={addressesModule.isEditing}
		onsave={addressesModule.handleSave}
		ondelete={addressesModule.handleDelete}
	/>

	<Pagination
		noOfPage={Math.ceil(addressesModule.addresses.count / addressesModule.addresses.pageSize)}
		paginateProducts={addressesModule.paginateAddress}
	/>
{/if}

