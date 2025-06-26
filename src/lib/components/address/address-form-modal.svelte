<script lang="ts">
	import { Dialog, DialogContent, DialogHeader, DialogTitle } from '$lib/components/ui/dialog'
	import { Button } from '$lib/components/ui/button'
	import { ArrowLeft, Trash2 } from 'lucide-svelte'
	import Textbox from '$lib/components/form/textbox.svelte'
	import Select from '../form/select.svelte'
	import { page } from '$app/state'
	import Label from '../ui/label/label.svelte'
	import { AddressSchema } from '$lib/core/components/address/schema'
	import AddressFormRenderer from '$lib/core/composables/address-form-renderer.svelte'
	import LoadingDots from '$lib/core/components/common/loading-dots.svelte'

	let {
		show = $bindable(),
		address = $bindable(),
		isEdit,
		onsave,
		onback,
		onclose,
		ondelete
	}: {
		show: boolean
		address: any
		isEdit: boolean
		onsave?: (address: any) => void
		onback?: () => void
		onclose?: () => void
		ondelete?: (address: any) => void
	} = $props()
</script>

<AddressFormRenderer bind:address bind:show {onback} {ondelete} {onsave}>
	{#snippet content({ isSaving, handleBack, handleSubmit, handleDelete })}
		<Dialog bind:open={show}>
			<DialogContent class="sm:max-w-[425px]">
				<DialogHeader>
					<div class="flex items-center gap-2">
						<Button variant="ghost" size="icon" onclick={handleBack}>
							<ArrowLeft class="h-4 w-4" />
						</Button>
						<DialogTitle>{isEdit ? 'Edit Address' : 'Add New Address'}</DialogTitle>
					</div>
				</DialogHeader>
				<form onsubmit={handleSubmit} class="grid py-4">
					<div class="grid grid-cols-2 gap-2">
						<Textbox
							name="firstName"
							bind:value={address.firstName}
							placeholder="First Name"
							schema={AddressSchema.firstName}
							label="First Name"
							required
						/>
						<Textbox
							name="lastName"
							bind:value={address.lastName}
							placeholder="Last Name"
							schema={AddressSchema.lastName}
							label="Last Name"
							required
						/>
					</div>
					<Textbox name="phone" type="tel" bind:value={address.phone} placeholder="+1234567890" schema={AddressSchema.phone} label="Phone" required />
					<Textbox
						name="address_1"
						bind:value={address.address_1}
						placeholder="Street Address"
						schema={AddressSchema.address_1}
						label="Address Line 1"
						required
					/>
					<Textbox name="address_2" bind:value={address.address_2} placeholder="Apartment, suite, etc." label="Address Line 2" />
					<div class="grid grid-cols-2 gap-2">
						<Textbox name="city" bind:value={address.city} placeholder="City" schema={AddressSchema.city} label="City" required />
						<Textbox name="state" bind:value={address.state} placeholder="State" schema={AddressSchema.state} label="State" required />
						<!-- <Textbox name="countryCode" bind:value={address.countryCode} placeholder="Country" schema={schemas.countryCode} label="Country" required /> -->
						<div class="flex flex-col">
							<Label for="countryCode" class="mb-2 text-sm">Country</Label>
							<Select
								class="w-full justify-between"
								id="countryCode"
								title="Select Country"
								label=""
								value={address.countryCode || page?.data?.store?.country?.code || 'AU'}
								data={page?.data?.store?.countries || []}
								valueField="code"
								optionSelected={(v: any) => {
									address.countryCode = v
								}}
							/>
						</div>
						<Textbox name="zip" bind:value={address.zip} placeholder="12345" schema={AddressSchema.zip} label="ZIP Code" required />
					</div>
					<br />
					<div class="flex flex-col gap-2">
						<Button type="submit" class="w-full">
              {#if isSaving}
							  <LoadingDots />
							{:else}
							  Save Contact
							{/if}
            </Button>
						{#if isEdit}
							<Button type="button" variant="link" onclick={handleDelete} class="w-full">
								<Trash2 class="h-4 w-4" />
								Delete Address
							</Button>
						{/if}
					</div>
				</form>
			</DialogContent>
		</Dialog>
	{/snippet}
</AddressFormRenderer>
