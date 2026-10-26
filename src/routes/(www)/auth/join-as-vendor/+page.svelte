<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte'

	import Textbox from '$lib/components/form/textbox.svelte'

	import { page } from '$app/state'

	import AuthButton from '$lib/components/auth/auth-button.svelte'

	import { JoinAsVendorModule } from '$lib/core/composables/index.js'

	import { LoaderCircle } from '@lucide/svelte'

	const joinAsVendorModule = new JoinAsVendorModule()

	const schemas = joinAsVendorModule.schemas
</script>

<svelte:head>
	<title>Signup</title>
</svelte:head>

<div class="flex justify-center bg-background px-4 py-8 sm:py-16">
	<div class="w-full max-w-md space-y-8">
		<div class="space-y-6 rounded-lg bg-card p-8 shadow">
			<div class="space-y-2 text-center">
				<h2 class="page-heading">Create your vendor account</h2>

				<p class="text-muted-foreground">Start selling on {page?.data?.store?.name} today</p>
			</div>

			<form class="space-y-4" onsubmit={joinAsVendorModule.handleSubmit}>
				<Textbox
					name="firstName"
					bind:value={joinAsVendorModule.firstName}
					autocomplete="given-name"
					placeholder="John"
					schema={schemas.firstName}
					label="First name"
					required
				/>

				<Textbox name="lastName" autocomplete="family-name" bind:value={joinAsVendorModule.lastName} placeholder="Doe" schema={schemas.lastName} label="Last name" required />

				<Textbox
					name="email"
					type="email"
					bind:value={joinAsVendorModule.email}
					autocomplete="email"
					placeholder="m@example.com"
					schema={schemas.email}
					label="Email"
					required
				/>

				<Textbox
					name="phone"
					type="tel"
					bind:value={joinAsVendorModule.phone}
					autocomplete="tel"
					placeholder="+1234567890"
					schema={schemas.phone}
					label="Phone"
					required
				/>

				<Textbox
					name="businessName"
					bind:value={joinAsVendorModule.businessName}
					autocomplete="organization"
					placeholder="e.g., Varni Jewels"
					schema={schemas.businessName}
					label="Business name"
					required
				/>

				<Textbox
					name="password"
					type="password"
					bind:value={joinAsVendorModule.password}
					autocomplete="new-password"
					placeholder="••••••••"
					schema={schemas.password}
					label="Password"
					required
				/>

				<Textbox
					name="confirmPassword"
					type="password"
					bind:value={joinAsVendorModule.confirmPassword}
					autocomplete="new-password"
					placeholder="••••••••"
					schema={schemas.confirmPassword}
					label="Confirm password"
					required
				/>

				<Button type="submit" class="w-full">
					{#if joinAsVendorModule.isLoading}
						<LoaderCircle class="animate-spin" />
					{:else}
						Create account
					{/if}
				</Button>
			</form>

			<div class="text-center text-sm text-muted-foreground">
				Already have an account?{' '}

				<AuthButton type="login">
					<Button variant="link" class="text-primary hover:underline h-auto p-0">Sign in</Button>
				</AuthButton>
			</div>
		</div>
	</div>
</div>
