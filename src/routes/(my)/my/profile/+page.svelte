<script lang="ts">
	import Input from '$lib/components/form/textbox.svelte'
	import Button from '$lib/components/ui/button/button.svelte'
	import { Save, ArrowLeft, InfoIcon, Loader } from 'lucide-svelte'
	import { goto } from '$app/navigation'
	import { MyProfileModule } from '$lib/core/composables/use-my-profile.svelte'

	const profileModule = new MyProfileModule()
</script>

<svelte:head>
	<title>My Profile</title>
</svelte:head>

<div class="">
	<div class="w-full max-w-4xl transform space-y-6 rounded-xl border border-gray-200 p-8 transition-all dark:bg-gray-800">
		<div class="space-y-2 text-center">
			<!-- <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Update Vendor: {profile.name}</h1> -->
		</div>
		<form onsubmit={profileModule.saveProfile} class="w-full space-y-4" oninput={profileModule.handleDetailsChange}>
			<!-- Logo Field: Full Row -->
			<div>
				<h2 class="text-2xl font-bold text-gray-900 dark:text-white">Profile</h2>
				<!-- <div class="mt-3 flex flex-row items-center justify-start rounded-lg overflow-hidden w-fit" id="logo">
					<LazyImg src={profile.avatar} alt={`Logo Image`} width="90" height="90" class="rounded-lg" />
				</div> -->
			</div>
			<br />
			<!-- Grid Layout for Other Fields -->
			<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
				<Input label="First Name" placeholder="Enter first name" error="" info="This will be public" bind:value={profileModule.profile.firstName} />
				<Input label="Last Name" placeholder="Enter last name" error="" info="This will be public" bind:value={profileModule.profile.lastName} />
				<Input
					id="phone"
					name="phone"
					label="Phone"
					type="phone"
					placeholder="Enter phone number"
					error=""
					info="This will be hidden from public"
					bind:value={profileModule.profile.phone}
				/>
				<Input
					id="email"
					type="email"
					name="email"
					label="Email"
					info="This will be hidden from public"
					bind:value={profileModule.profile.email}
					placeholder="Enter Email"
					required
					class="mt-1 block w-full rounded-md px-3 py-2 shadow-sm focus:outline-none sm:text-sm"
				/>
			</div>
			<!-- <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
				<Input
					id="address1"
					name="address1"
					label="Address Line 1"
					type="text"
					placeholder="Enter address line 1"
					error=""
					info="This will be public"
					bind:value={profile.address_1}
				/>
				<Input
					id="address2"
					name="address2"
					label="Address Line 2"
					type="text"
					placeholder="Enter address line 2"
					error=""
					info="This will be public"
					bind:value={profile.address_2}
				/>
				<Input
					id="city"
					name="city"
					label="City"
					type="text"
					placeholder="Enter city"
					error=""
					info="This will be public"
					bind:value={profile.city}
				/>
				<Input
					id="state"
					name="state"
					label="State"
					type="text"
					placeholder="Enter state"
					error=""
					info="This will be public"
					bind:value={profile.state}
				/>
				<Input
					id="zipCode"
					name="zipCode"
					label="Zip Code"
					type="number"
					placeholder="Enter zip code"
					error=""
					info="This will be public"
					bind:value={profile.zipCode}
				/>

				<div class="flex flex-col gap-1 space-y-2">
					<Label for="originCountry">Country</Label>
					<Select
						id="country"
						title="Select Country"
						label=""
						value={profile.country}
						data={page?.data?.store?.countries || []}
						optionSelected={(v: any) => {
							profile.country = v
							handleDetailsChange()
						}}
					/>
				</div>
			</div> -->

			<!-- Submit Button -->
		</form>
	</div>
</div>

<!-- Danger Zone -->
<div class="my-5 w-full max-w-4xl transform space-y-6 rounded-xl border border-gray-200 p-8 transition-all dark:bg-gray-800">
	<div class="space-y-2 text-start">
		<h1 class="text-xl font-bold text-red-500">Danger Zone</h1>
	</div>

	<div class="space-y-3">
		<!-- Delete account -->
		<div class="flex items-center justify-between">
			<h2 class="text-sm">Request Account Deletion</h2>
			<Button variant="destructive" size="sm" onclick={() => goto('/my/profile/delete')}>Delete Account</Button>
		</div>
	</div>
</div>
<div
	class="ease-[cubic-bezier(1,.32,.52,.67)] fixed left-0 right-0 top-10 z-50 mx-auto flex w-1/2 max-w-[1000px] flex-row justify-between rounded-lg border border-gray-300 bg-gray-50 p-2 text-xs font-semibold text-black shadow transition-all duration-150 hover:bg-gray-100"
	style={profileModule.detailsChanged ? 'display: flex' : 'display: none'}
>
	<div class="flex flex-row items-center gap-2">
		<InfoIcon class="h-4 w-4" />
		<span>Unsaved changes</span>
	</div>

	<button onclick={profileModule.saveProfile} class="rounded bg-white px-2 py-1 text-xs text-black shadow">
		{#if profileModule.isLoading}
			<Loader class="h-4 w-4 animate-spin" />
		{:else}
			Save
		{/if}
	</button>
</div>

