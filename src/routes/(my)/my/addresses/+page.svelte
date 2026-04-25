<script lang="ts">
	import { LoaderCircle, Plus, Trash2, MapPin, Pencil, Home, Briefcase, Phone, MoreVertical } from '@lucide/svelte'
	import { Button } from '$lib/components/ui/button'
	import AddressFormModal from '$lib/components/address/address-form-modal.svelte'
	import Pagination from '$lib/components/common/pagination.svelte'
	import { MyAddressesModule } from '$lib/core/composables/index.js'
	import { fade, fly } from 'svelte/transition'

	const addressesModule = new MyAddressesModule()
</script>

<svelte:head>
	<title>Addresses | Svelte Commerce</title>
</svelte:head>

<div class="mx-auto max-w-7xl px-4 py-8 md:py-12">
	<!-- Header -->
	<div class="mb-10 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
		<div>
			<h1 class="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">Your Addresses</h1>
			<p class="mt-2 text-lg text-gray-500">Manage your shipping and billing addresses.</p>
		</div>
		<Button onclick={addressesModule.handleAddNew} class="h-12 px-6 font-semibold shadow-lg transition-all hover:scale-105 active:scale-95">
			<Plus class="mr-2 h-4 w-4" />
			Add New Address
		</Button>
	</div>

	{#if addressesModule.loading}
		<div class="flex min-h-[400px] items-center justify-center">
			<LoaderCircle class="h-8 w-8 animate-spin text-primary" />
		</div>
	{:else if addressesModule.addresses}
		<div in:fade class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#if addressesModule.addresses?.data?.length === 0}
				<div class="col-span-full flex flex-col items-center justify-center py-20 text-center">
					<div class="relative mb-6">
						<div class="absolute inset-0 scale-150 animate-pulse rounded-full bg-gray-50"></div>
						<div class="relative flex h-24 w-24 items-center justify-center rounded-full border border-gray-100 bg-white shadow-sm">
							<MapPin class="h-10 w-10 text-gray-300" />
						</div>
					</div>
					<h2 class="text-2xl font-bold text-gray-900">No addresses yet</h2>
					<p class="mt-2 max-w-xs text-gray-500">Add an address to speed up your checkout process.</p>
				</div>
			{:else}
				{#each addressesModule.addresses?.data as address, i (address.id)}
					<div
						in:fly={{ y: 20, duration: 400, delay: i * 50 }}
						class="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
					>
						<!-- Address Type Indicator -->
						<div class="flex items-center justify-between border-b border-gray-50 bg-gray-50/50 p-5">
							<div class="flex items-center gap-2">
								<div class="flex h-8 w-8 items-center justify-center rounded-full bg-white text-primary shadow-sm">
									<Home class="h-4 w-4" />
								</div>
								<span class="text-sm font-bold text-gray-900">Address</span>
							</div>

							<div class="flex items-center gap-2">
								<Button
									variant="ghost"
									size="icon"
									class="h-8 w-8 rounded-full transition-colors hover:bg-white hover:text-primary"
									onclick={() => addressesModule.handleEdit(address)}
								>
									<Pencil class="h-4 w-4" />
								</Button>
								<Button
									variant="ghost"
									size="icon"
									class="h-8 w-8 rounded-full transition-colors hover:bg-white hover:text-red-500"
									onclick={() => addressesModule.handleDelete(address)}
								>
									<Trash2 class="h-4 w-4" />
								</Button>
							</div>
						</div>

						<!-- Address Details -->
						<div class="flex flex-1 flex-col p-6">
							<div class="mb-4">
								<p class="text-lg font-bold text-gray-900">{address.firstName} {address.lastName}</p>
							</div>

							<div class="space-y-1.5 text-sm leading-relaxed text-gray-600">
								<p>{address.address_1}</p>
								{#if address.address_2}
									<p>{address.address_2}</p>
								{/if}
								<p>{address.city}, {address.state} {address.zip}</p>
							</div>

							<div class="mt-auto pt-6">
								<div class="flex items-center gap-2 text-sm font-medium text-gray-500">
									<Phone class="h-4 w-4" />
									{address.phone}
								</div>
							</div>
						</div>
					</div>
				{/each}
			{/if}
		</div>

		<div class="mt-12 flex justify-center">
			<Pagination
				noOfPage={Math.ceil(addressesModule.addresses.count / addressesModule.addresses.pageSize)}
				paginateProducts={addressesModule.paginateAddress}
			/>
		</div>
	{/if}

	<AddressFormModal
		bind:show={addressesModule.showAddressFormModal}
		bind:address={addressesModule.selectedAddress}
		isEdit={addressesModule.isEditing}
		onsave={addressesModule.handleSave}
		ondelete={addressesModule.handleDelete}
	/>
</div>

<style>
	:global(body) {
		background-color: #fafafa;
	}
</style>
