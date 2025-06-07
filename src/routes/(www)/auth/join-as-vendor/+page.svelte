<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte'
	import Textbox from '$lib/components/form/textbox.svelte'
	import { page } from '$app/state'
	import AuthButton from '$lib/core/components/auth/auth-button.svelte'
	import { JoinAsVendorModule } from '$lib/core/composables/use-join-as-vendor.svelte'
	import { LoaderCircle } from 'lucide-svelte'

	const joinAsVendorModule = new JoinAsVendorModule()
	const schemas = joinAsVendorModule.schemas
</script>

<svelte:head>
	<title>Signup</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
	<div class="w-full max-w-md space-y-8">
		<div class="space-y-6 rounded-lg bg-white p-8 shadow dark:bg-gray-800">
			<div class="space-y-2 text-center">
				<h2 class="text-2xl font-bold text-gray-900 dark:text-white">Create your vendor account</h2>
				<p class="text-gray-500 dark:text-gray-400">Start selling on {page?.data?.store?.name} today</p>
			</div>

			<form class="space-y-4" onsubmit={joinAsVendorModule.handleSubmit}>
				<Textbox
					name="firstName"
					bind:value={joinAsVendorModule.firstName}
					placeholder="John"
					schema={schemas.firstName}
					label="First Name"
					required
				/>

				<Textbox name="lastName" bind:value={joinAsVendorModule.lastName} placeholder="Doe" schema={schemas.lastName} label="Last Name" required />

				<Textbox
					name="email"
					type="email"
					bind:value={joinAsVendorModule.email}
					placeholder="m@example.com"
					schema={schemas.email}
					label="Email"
					required
				/>

				<Textbox
					name="phone"
					type="tel"
					bind:value={joinAsVendorModule.phone}
					placeholder="+1234567890"
					schema={schemas.phone}
					label="Phone"
					required
				/>

				<Textbox
					name="businessName"
					bind:value={joinAsVendorModule.businessName}
					placeholder="e.g., Varni Jewels"
					schema={schemas.businessName}
					label="Business Name"
					required
				/>

				<Textbox
					name="password"
					type="password"
					bind:value={joinAsVendorModule.password}
					placeholder="••••••••"
					schema={schemas.password}
					label="Password"
					required
				/>

				<Textbox
					name="confirmPassword"
					type="password"
					bind:value={joinAsVendorModule.confirmPassword}
					placeholder="••••••••"
					schema={schemas.confirmPassword}
					label="Confirm Password"
					required
				/>

				<Button type="submit" class="w-full">
					{#if joinAsVendorModule.isLoading}
						<LoaderCircle class="animate-spin" />
					{:else}
						Create Account
					{/if}
				</Button>
			</form>

			<div class="text-center text-sm text-gray-600">
				Already have an account?{' '}
				<AuthButton type="login">
					<Button variant="link" class="h-auto p-0 text-primary-600 hover:text-primary-500">
						Sign in
					</Button>
				</AuthButton>
			</div>
		</div>
	</div>
</div>
