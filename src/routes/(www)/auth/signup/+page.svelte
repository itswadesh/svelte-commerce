<script lang="ts">
	import { LoaderIcon } from '@lucide/svelte'
	import Button from '$lib/components/ui/button/button.svelte'
	import { toast } from '@misiki/kitcommerce-core'
	import Textbox from '$lib/components/form/textbox.svelte'
	import { z } from 'zod'
	import { getUserState } from '$lib/core/stores/index.js'
	const userState = getUserState()
	import { goto } from '$app/navigation'
	import { page } from '$app/state'
	import { AuthButton } from '$lib/core/components/index.js'
	const IS_DEV = import.meta.env.DEV

	let firstName = $state(IS_DEV ? 'Swadesh' : '')
	let lastName = $state(IS_DEV ? 'Behera' : '')
	let email = $state(IS_DEV ? 'hi@litekart.in' : '')
	// let phone = $state(IS_DEV ? '+918249028220' : '')
	let password = $state(IS_DEV ? 'litekart1' : '')
	let confirmPassword = $state(IS_DEV ? 'litekart1' : '')
	let isLoading = $state(false)

	const schemas = {
		firstName: z
			.string()
			.min(2, 'First name must be at least 2 characters')
			.max(50, 'First name must be less than 50 characters')
			.regex(/^[a-zA-Z\s]*$/, 'First name can only contain letters and spaces'),
		lastName: z
			.string()
			.min(2, 'Last name must be at least 2 characters')
			.max(50, 'Last name must be less than 50 characters')
			.regex(/^[a-zA-Z\s]*$/, 'Last name can only contain letters and spaces'),
		email: z
			.string()
			.email('Please enter a valid email address')
			.min(5, 'Email must be at least 5 characters')
			.max(100, 'Email must be less than 100 characters'),
		// phone: z
		// 	.string()
		// 	.regex(/^(\+?\d{1,3}[- ]?)?\d{10}$/, 'Please enter a valid 10-digit phone number')
		// 	.refine((val) => {
		// 		// Remove any non-digit characters
		// 		const digits = val.replace(/\D/g, '')
		// 		// Check if it's exactly 10 digits or if it starts with country code
		// 		return digits.length === 10 || (digits.length > 9 && digits.length <= 17)
		// 	}, 'Phone number must be 10 digits'),
		password: z
			.string()
			.min(8, 'Password must be at least 8 characters')
			.max(100, 'Password must be less than 100 characters')
			.regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
			.regex(/[a-z]/, 'Password must contain at least one lowercase letter')
			.regex(/[0-9]/, 'Password must contain at least one number')
			.regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
		confirmPassword: z
			.string()
			.min(8, 'Password must be at least 8 characters')
			.max(100, 'Password must be less than 100 characters')
			.refine((val) => val === password, {
				message: 'Passwords do not match'
			})
	}

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault()
		try {
			isLoading = true
			await userState.signup({
				firstName,
				lastName,
				email,
				// phone,
				password,
				origin: page.url.origin
			})
			toast.success('Account created successfully')
			goto(`/auth/signup/success?email=${encodeURIComponent(email)}`)
		} catch (e: any) {
			toast.error(e.message)
		} finally {
			isLoading = false
		}
	}
</script>

<svelte:head>
	<title>Create Account - {page?.data?.store?.name || ''}</title>
	<meta name="description" content="Create your account at {page?.data?.store?.name} to start shopping and discover amazing products." />
</svelte:head>

<main class="flex min-h-screen items-center justify-center border bg-gray-50 p-3 dark:bg-gray-950 sm:p-4">
	<div class="w-full max-w-[420px] space-y-4 rounded-radius border bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
		<div class="space-y-1 text-center">
			<h2 class="text-2xl font-bold tracking-tight text-gray-950 dark:text-white">Create account</h2>
			<p class="text-sm text-gray-600 dark:text-gray-300">Save details for faster checkout.</p>
		</div>

		<form class="space-y-3" onsubmit={handleSubmit} aria-label="Sign up form">
			<div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
				<Textbox
					name="firstName"
					bind:value={firstName}
					placeholder="John"
					schema={schemas.firstName}
					label="First name"
					class="h-12"
					required
					aria-label="First name"
					autocomplete="given-name"
				/>
				<Textbox
					name="lastName"
					bind:value={lastName}
					placeholder="Doe"
					schema={schemas.lastName}
					label="Last name"
					class="h-12"
					required
					aria-label="Last name"
					autocomplete="family-name"
				/>
			</div>

			<Textbox
				name="email"
				type="email"
				bind:value={email}
				placeholder="you@example.com"
				schema={schemas.email}
				label="Email address"
				class="h-12"
				required
				aria-label="Email address"
				autocomplete="email"
			/>

			<Textbox
				name="password"
				type="password"
				bind:value={password}
				placeholder="Enter a password"
				schema={schemas.password}
				label="Password"
				class="h-12"
				required
				aria-label="Password"
				autocomplete="new-password"
			/>

			<Textbox
				name="confirmPassword"
				type="password"
				bind:value={confirmPassword}
				placeholder="Confirm your password"
				schema={schemas.confirmPassword}
				label="Confirm password"
				class="h-12"
				required
				aria-label="Confirm password"
				autocomplete="new-password"
			/>

			<Button
				type="submit"
				class="h-12 w-full text-wrap px-4 py-2 text-base font-semibold shadow-sm transition-colors"
				disabled={isLoading}
				aria-label={isLoading ? 'Creating account...' : 'Create account'}
			>
				{#if isLoading}
					<LoaderIcon class="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
				{/if}
				{isLoading ? 'Creating account...' : 'Create account'}
			</Button>
		</form>

		<div class="text-center">
			<p class="text-sm text-gray-600 dark:text-gray-300">
				Already have an account?
				<AuthButton type="login">
					<Button
						variant="link"
						class="ml-1 inline-flex min-h-10 px-0 font-semibold text-gray-950 transition-colors hover:underline dark:text-white"
						aria-label="Sign in to your account"
					>
						Sign in
					</Button>
				</AuthButton>
			</p>
		</div>

		{#if page?.data?.store?.plugins?.isMultiVendor?.active}
			<div class="space-y-3">
				<div class="relative">
					<div class="absolute inset-0 flex items-center">
						<div class="w-full border-t border-gray-200 dark:border-gray-700"></div>
					</div>
					<div class="relative flex justify-center text-xs">
						<span class="bg-white px-2 text-gray-500 dark:bg-gray-900 dark:text-gray-400">or</span>
					</div>
				</div>

				<a
					href="/auth/join-as-vendor"
					class="inline-flex min-h-11 w-full items-center justify-center rounded-radius border border-gray-300 px-4 py-2 text-center text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-950 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
					aria-label="Join as a vendor"
				>
					Join as a Vendor
				</a>
			</div>
		{/if}
	</div>
</main>
