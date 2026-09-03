<script lang="ts">
	import { Dialog, DialogContent, DialogHeader, DialogTitle } from '$lib/components/ui/dialog'
	import { Button } from '$lib/components/ui/button/index.js'
	import { ArrowLeft, Trash2 } from '@lucide/svelte'
	import Textbox from '$lib/components/form/textbox.svelte'
	import Select from '../form/select.svelte'
	import { page } from '$app/state'
	import Label from '../ui/label/label.svelte'
	import { AddressSchema } from '$lib/core/components/index.js'
	// Local shadow of the vendored renderer — it never passed `isSaving` through, never awaited
	// `onsave` and closed the dialog even when the save failed. See the file header.
	import AddressFormRenderer from './address-form-renderer.svelte'
	import Spinner from '$lib/components/common/spinner.svelte'

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
		<!-- `onclose` was accepted and never called, so Escape, the overlay and the X left the page's
		     `editAddress` flag set — which is exactly what greys out Continue to Payment. Every close
		     route now runs the same handler as Save and Back (UX-080). -->
		<Dialog bind:open={show} onOpenChange={(next: boolean) => !next && onclose?.()}>
			<!-- The dialog is a centred fixed box with no height cap, so on a phone the address fields
			     ran past the bottom of the screen and Save went with them. Cap it, scroll the fields,
			     and keep the actions pinned as the dialog's last grid row. -->
			<DialogContent class="max-h-[90dvh] grid-rows-[auto_minmax(0,1fr)] sm:max-w-[425px] [&>button]:!bg-transparent">
				<DialogHeader>
					<div class="flex items-center gap-2">
						<Button variant="ghost" size="icon" aria-label="Back to address list" onclick={handleBack}>
							<ArrowLeft class="h-4 w-4" />
						</Button>
						<DialogTitle>{isEdit ? 'Edit Address' : 'Add New Address'}</DialogTitle>
					</div>
				</DialogHeader>
				<form onsubmit={handleSubmit} class="flex min-h-0 flex-col">
					<div class="grid min-h-0 flex-1 overflow-y-auto py-4">
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
						<Textbox
							info={page?.data?.store?.isPhoneMandatory ? '' : 'Phone number is recommended for delivery updates.'}
							required={page.data?.store?.isPhoneMandatory}
							name="phone"
							type="tel"
							bind:value={address.phone}
							placeholder="+1234567890"
							schema={AddressSchema.phone}
							label="Phone"
						/>
						<Textbox
							name="address_1"
							bind:value={address.address_1}
							placeholder="Street Address"
							schema={AddressSchema.address_1}
							label="Address Line 1"
							required
						/>
						<Textbox name="address_2" bind:value={address.address_2} placeholder="Apartment, suite, etc." label="Address Line 2" />
						<div class="grid grid-cols-2 gap-x-2">
							<Textbox name="city" bind:value={address.city} placeholder="City" schema={AddressSchema.city} label="City" required />
							<Textbox name="state" bind:value={address.state} placeholder="State" schema={AddressSchema.state} label="State" required />
							<Select
								id="countryCode"
								title="Select Country"
								label="Country"
								showSearch={true}
								value={address.countryCode || page?.data?.store?.country?.code || 'AU'}
								data={page?.data?.store?.countries || []}
								valueField="code"
								optionSelected={(v: any) => {
									address.countryCode = v
								}}
							/>
							<Textbox name="zip" bind:value={address.zip} placeholder="12345" schema={AddressSchema.zip} label="ZIP Code" required />
						</div>
					</div>
					<div class="flex flex-col gap-2 border-t border-border bg-background pb-[env(safe-area-inset-bottom)] pt-3">
						<Button type="submit" class="w-full" disabled={isSaving}>
							{#if isSaving}
								<Spinner label="Saving address" />
							{:else}
								Save address
							{/if}
						</Button>
						{#if isEdit}
							<Button type="button" variant="link" onclick={handleDelete} class="w-full text-destructive">
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
