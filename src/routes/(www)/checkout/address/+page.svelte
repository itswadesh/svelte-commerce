<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js'
	import { LoaderCircle, ShoppingBag } from '@lucide/svelte'
	import AddressListModal from '$lib/components/address/address-list-modal.svelte'
	import AddressFormModal from '$lib/components/address/address-form-modal.svelte'
	import { page } from '$app/state'
	import { AddressModule } from '$lib/core/composables/index.js'
	import { setContext } from 'svelte'
	import Blocks from '$lib/components/page-blocks/blocks.svelte'

	const addressModule = new AddressModule()
  setContext('checkout-address-module', addressModule)
	const cartState = addressModule.cartState
</script>

<svelte:head>
	<title>Address - {page?.data?.store?.name || ''}</title>
</svelte:head>

{#await cartState.hasLoaded}
	<div class="flex min-h-96 items-center justify-center py-8">
		<LoaderCircle class="animate-spin" />
	</div>
{:then _}
	{#if cartState.cart?.lineItems?.length === 0}
		<div class="min-h-screen py-8">
			<div class="container mx-auto px-4">
				<div class="flex h-[60vh] flex-col items-center justify-center text-center">
					<div class="mb-6 rounded-full bg-gray-50 p-8 ring-1 ring-gray-100">
						<ShoppingBag class="h-12 w-12 text-gray-300" />
					</div>
					<h2 class="mb-2 text-xl font-bold uppercase tracking-widest text-gray-900">Your bag is empty</h2>
					<p class="mb-8 max-w-xs text-sm text-gray-500">Looks like you haven't added anything to your bag yet.</p>
					<Button href="/" variant="default" class="rounded-full px-8 py-3 text-xs font-bold uppercase tracking-[0.2em]">Start Shopping</Button>
				</div>
			</div>
		</div>
	{:else}
		<Blocks layouts={page.data.page.layouts} />
	{/if}
{/await}

<AddressListModal
	bind:show={addressModule.showAddressList}
	addresses={addressModule.addresses}
	paginateAddress={addressModule.paginateAddress}
	onaddnew={addressModule.handleAddNewAddressFromModal}
	onedit={addressModule.handleEditAddress}
	onselect={addressModule.handleSelectAddress}
	ondelete={addressModule.handleDeleteAddress}
/>

<!-- Shipping & Biling address -->
<AddressFormModal
	bind:show={addressModule.showAddressForm}
	bind:address={addressModule.currentAddress}
	isEdit={addressModule.isEditingAddress}
	onback={addressModule.handleFormBack}
	onclose={addressModule.handleFormClose}
	onsave={addressModule.handleFormSave}
	ondelete={addressModule.handleDeleteAddress}
/>
