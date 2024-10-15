<script lang="ts">
	import Input from '$lib/components/form/textbox.svelte'
	import { Button } from '$lib/components/ui/button'
	import { Save, ArrowLeft, InfoIcon, Loader, User, Mail, Phone, Trash2, AlertCircle } from '@lucide/svelte'
	import { goto } from '$app/navigation'
	import { MyProfileModule } from '$lib/core/composables/index.js'
	import { fly, fade } from 'svelte/transition'

	const profileModule = new MyProfileModule()
</script>

<svelte:head>
	<title>My Profile | Svelte Commerce</title>
</svelte:head>

<div class="mx-auto max-w-4xl py-8 md:py-12">
	<div in:fly={{ y: 20, duration: 600 }} class="space-y-10">
		<!-- Profile Header -->
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">Profile Settings</h1>
				<p class="mt-2 text-lg text-gray-500">Manage your personal information and account security.</p>
			</div>
		</div>

		<!-- Main Profile Form -->
		<div class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05),0_20px_40px_rgba(0,0,0,0.02)]">
			<div class="border-b border-gray-100 bg-gray-50/50 p-6 md:p-8">
				<div class="flex items-center gap-3">
					<div class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
						<User class="h-5 w-5" />
					</div>
					<h2 class="text-xl font-bold text-gray-900">Personal Information</h2>
				</div>
			</div>

			<div class="p-6 md:p-8">
				<form onsubmit={profileModule.saveProfile} class="space-y-8" oninput={profileModule.handleDetailsChange}>
					<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
						<div class="space-y-2">
							<Input label="First Name" placeholder="Enter first name" bind:value={profileModule.profile.firstName} class="h-12" />
						</div>
						<div class="space-y-2">
							<Input label="Last Name" placeholder="Enter last name" bind:value={profileModule.profile.lastName} class="h-12" />
						</div>
						<div class="space-y-2">
							<Input
								id="phone"
								name="phone"
								label="Phone Number"
								type="phone"
								placeholder="Enter phone number"
								bind:value={profileModule.profile.phone}
								class="h-12"
							/>
						</div>
						<div class="space-y-2">
							<Input
								id="email"
								type="email"
								name="email"
								label="Email Address"
								bind:value={profileModule.profile.email}
								placeholder="Enter Email"
								required
								class="h-12"
							/>
						</div>
					</div>
				</form>
			</div>
		</div>

		<!-- Danger Zone -->
		<div class="overflow-hidden rounded-2xl border border-red-100 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
			<div class="border-b border-red-50 bg-red-50/30 p-6 md:p-8">
				<div class="flex items-center gap-3">
					<div class="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
						<AlertCircle class="h-5 w-5" />
					</div>
					<h2 class="text-xl font-bold text-red-600">Danger Zone</h2>
				</div>
			</div>

			<div class="p-6 md:p-8">
				<div class="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
					<div class="max-w-md">
						<h3 class="text-lg font-bold text-gray-900">Delete Account</h3>
						<p class="mt-1 text-sm text-gray-500">Permanently delete your account and all associated data. This action cannot be undone.</p>
					</div>
					<Button
						variant="destructive"
						class="h-12 px-6 font-semibold transition-all hover:scale-105 active:scale-95"
						onclick={() => goto('/my/profile/delete')}
					>
						Request Deletion
					</Button>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Floating Save Bar -->
{#if profileModule.detailsChanged}
	<div in:fly={{ y: 50, duration: 400 }} out:fade={{ duration: 200 }} class="fixed bottom-8 left-1/2 z-50 w-full max-w-lg -translate-x-1/2 px-4">
		<div class="flex items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white/90 p-4 shadow-2xl backdrop-blur-md">
			<div class="flex items-center gap-3 px-2">
				<div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
					<InfoIcon class="h-4 w-4" />
				</div>
				<span class="text-sm font-semibold text-gray-900">Unsaved changes</span>
			</div>

			<Button onclick={profileModule.saveProfile} class="h-10 px-6 font-semibold shadow-lg transition-all hover:scale-105 active:scale-95">
				{#if profileModule.isLoading}
					<Loader class="mr-2 h-4 w-4 animate-spin" />
					Saving...
				{:else}
					<Save class="mr-2 h-4 w-4" />
					Save Changes
				{/if}
			</Button>
		</div>
	</div>
{/if}

<style>
	:global(body) {
		background-color: #fafafa;
	}
</style>
