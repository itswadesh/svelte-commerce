<script lang="ts">
	import Textbox from '$lib/components/form/textbox.svelte'
	import { Button } from '$lib/components/ui/button/index.js'
	import { LoadingDots, showAuthModal } from '$lib/core/components/index.js'
	import { type AddressModule, checkoutAddressSchema as schemas } from '$lib/core/composables/index.js'
	import { Pencil } from '@lucide/svelte'

	import { getContext } from 'svelte'

	const { block } = $props()

	const addressModule: InstanceType<typeof AddressModule> = getContext('checkout-address-module')

	const cartState = addressModule.cartState
	const userState = addressModule.userState

	const isEmailOk = $derived(addressModule.isEmailOk)
	const isPhoneOk = $derived(addressModule.isPhoneOk)
</script>

<div class="flex flex-col gap-2">
	{#await userState.hasLoaded then _}
		{#if (!isPhoneOk || !isEmailOk) && !userState.user?.userId}
			<p class="text-sm text-gray-600">
				<Button
					variant="link"
					class="h-auto p-0"
					onclick={() => {
						showAuthModal('login')
					}}
				>
					Login
				</Button> to autofill your details
			</p>
		{/if}
	{/await}

	<div class="overflow-hidden rounded-lg border border-border bg-background shadow-sm">
		<div class="flex items-center justify-between border-b border-border px-5 py-4">
			<div class="flex items-center space-x-3">
				<h2 class="text-base font-bold uppercase text-gray-900" style="font-family: 'Montserrat', sans-serif;">Contact Details</h2>
			</div>
			{#if cartState.cart.email && !addressModule.editEmail && !userState.user?.userId}
				<Button onclick={addressModule.handleEditEmail} variant="ghost" size="sm" class="h-8">
					<Pencil class="mr-1.5 h-3 w-3" />
					<span>Edit</span>
				</Button>
			{/if}
		</div>

		{#if isEmailOk && isPhoneOk && !addressModule.editEmail}
			<div class="grid grid-cols-1 gap-6 p-6 transition-all duration-500 sm:grid-cols-2">
				<div class="flex flex-col gap-1">
					<p class="text-[10px] font-bold uppercase tracking-tighter text-gray-400">Email Address</p>
					<p class="text-sm font-medium text-gray-900">{cartState.cart.email}</p>
				</div>
				<div class="flex flex-col gap-1">
					<p class="text-[10px] font-bold uppercase tracking-tighter text-gray-400">Phone Number</p>
					<p class="text-sm font-medium text-gray-900">{cartState.cart.phone}</p>
				</div>
			</div>
		{:else if !isEmailOk || !isPhoneOk || addressModule.editEmail}
			<form class="space-y-4 p-5 transition-all duration-500" onsubmit={addressModule.saveContactInfo}>
				<div class="space-y-1">
					<label for="email" class="block text-sm font-medium text-gray-700">
						Email address {#if !addressModule.isEmailRequired}<span class="text-gray-400">(optional)</span>{/if}
					</label>
					<Textbox
						type="email"
						bind:value={addressModule.email}
						required={addressModule.isEmailRequired}
						class="w-full"
						schema={schemas.email}
						placeholder="your@email.com"
					/>
					<p class="mt-1 text-xs text-gray-500">We'll send order confirmation to this email</p>
				</div>
				<div class="space-y-1">
					<label for="phone" class="block text-sm font-medium text-gray-700">
						Phone number {#if !addressModule.isPhoneRequired}<span class="text-gray-400">(optional)</span>{/if}
					</label>
					<Textbox
						type="tel"
						bind:value={addressModule.phone}
						required={addressModule.isPhoneRequired}
						class="w-full"
						schema={schemas.phone}
						placeholder="XXXXXXXXXX"
					/>
					<p class="mt-1 text-xs text-gray-500">For delivery updates</p>
				</div>
				<div class="flex justify-end space-x-3 pt-2">
					{#if cartState.cart.email}
						<Button variant="outline" onclick={() => (addressModule.editEmail = false)} type="button">Cancel</Button>
					{/if}
					<Button type="submit" disabled={cartState.isUpdatingCart} class="min-w-[120px]">
						{#if cartState.isUpdatingCart}
							<LoadingDots />
						{:else}
							Save Contact
						{/if}
					</Button>
				</div>
			</form>
		{/if}
	</div>
</div>
