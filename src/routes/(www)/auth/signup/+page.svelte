<script lang="ts">
	import { LoaderIcon } from 'lucide-svelte'
	import Button from '$lib/components/ui/button/button.svelte'
	import { authService } from '$lib/core/services'
	import { toast } from 'svelte-sonner'
	import Textbox from '$lib/components/form/textbox.svelte'
	import { z } from 'zod'
	import { getUserState } from '$lib/core/stores/auth.svelte'
	const userState = getUserState()
	import { goto } from '$app/navigation'
	import { page } from '$app/state'
	import AuthButton from '$lib/core/components/auth/auth-button.svelte'
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

	async function handleSubmit(e) {
		e.preventDefault()
		try {
			isLoading = true
			const res = await userState.signup({
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

<main class="flex min-h-screen items-center justify-center border bg-gradient-to-br from-gray-50 to-white p-4 dark:from-gray-900 dark:to-gray-800">
	<!-- Right side - Sign up form -->
	<div class="w-full max-w-md transform space-y-4 rounded-lg rounded-xl border bg-white/80 p-8 backdrop-blur-sm transition-all dark:bg-gray-800/90">
		<div class="space-y-2 text-center">
			<h2 class="text-2xl font-bold text-gray-900 dark:text-white">Create your account</h2>
			<p class="text-gray-500 dark:text-gray-400">Join us and start your shopping journey</p>
		</div>

		<form class="space-y-4" onsubmit={handleSubmit} aria-label="Sign up form">
			<div class="grid grid-cols-2 gap-4">
				<Textbox
					name="firstName"
					bind:value={firstName}
					placeholder="John"
					schema={schemas.firstName}
					label="First Name"
					required
					aria-label="First name"
					autocomplete="given-name"
				/>
				<Textbox
					name="lastName"
					bind:value={lastName}
					placeholder="Doe"
					schema={schemas.lastName}
					label="Last Name"
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
				required
				aria-label="Email address"
				autocomplete="email"
			/>

			<!-- <Textbox 
					name="phone" 
					type="tel" 
					bind:value={phone} 
					placeholder="+1234567890" 
					schema={schemas.phone} 
					label="Phone number" 
					required 
					aria-label="Phone number"
					autocomplete="tel"
				/> -->

			<Textbox
				name="password"
				type="password"
				bind:value={password}
				placeholder="••••••••"
				schema={schemas.password}
				label="Password"
				required
				aria-label="Password"
				autocomplete="new-password"
			/>

			<Textbox
				name="confirmPassword"
				type="password"
				bind:value={confirmPassword}
				placeholder="••••••••"
				schema={schemas.confirmPassword}
				label="Confirm password"
				required
				aria-label="Confirm password"
				autocomplete="new-password"
			/>

			<Button type="submit" class="w-full" disabled={isLoading} aria-label={isLoading ? 'Creating account...' : 'Create account'}>
				{#if isLoading}
					<LoaderIcon class="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
					<span class="sr-only">Creating account...</span>
				{/if}
				{isLoading ? 'Creating account...' : 'Create account'}
			</Button>
		</form>

		<div class="space-y-4 text-center">
			<p class="text-sm text-gray-500">Already have an account?</p>
			<AuthButton type="login">
				<Button
					variant="link"
					class="inline-block text-gray-600 transition-colors hover:text-gray-900 dark:hover:text-gray-300"
					aria-label="Sign in to your account"
				>
					Sign in to your account
				</Button>
			</AuthButton>
		</div>

		{#if page?.data?.store?.plugins?.isMultiVendor?.active}
			<div class="relative py-4">
				<div class="absolute inset-0 flex items-center">
					<div class="w-full border-t border-gray-200 dark:border-gray-700"></div>
				</div>
				<div class="relative flex justify-center text-sm">
					<span class="bg-white px-2 text-gray-500 dark:bg-gray-800 dark:text-gray-400">or</span>
				</div>
			</div>

			<a
				href="/auth/join-as-vendor"
				class="inline-block w-full rounded-lg border border-gray-600 px-4 py-2 text-center text-gray-600 transition-colors hover:bg-gray-50 dark:border-gray-500 dark:text-gray-300 dark:hover:bg-gray-900/20"
				aria-label="Join as a vendor"
			>
				Join as a Vendor
			</a>
		{/if}
	</div>
</main>
