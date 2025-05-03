<script lang="ts">
	import { toast } from 'svelte-sonner'
	import Textbox from '$lib/components/form/textbox.svelte'
	import { z } from 'zod'
	import { userService } from '$lib/core/services'
	import { goto } from '$app/navigation'
	import { page } from '$app/state'
	import AuthButton from '$lib/core/components/auth/auth-button.svelte'

	let email = $state('')
	let isLoading = $state(false)

	const schemas = {
		email: z
			.string()
			.email('Please enter a valid email address')
			.min(5, 'Email must be at least 5 characters')
			.max(100, 'Email must be less than 100 characters')
	}

	async function handleSubmit(e) {
		e.preventDefault()
		try {
			isLoading = true

			// Validate email before proceeding
			const validatedEmail = schemas.email.parse(email)

			// Check if email is available
			const emailCheck = await userService.checkEmail(validatedEmail)

			if (emailCheck?.exists) {
				toast.error('This email is already registered')
				return
			}

			// Only proceed if validation passes and email is available
			sessionStorage.setItem('signup_email', validatedEmail)
			goto('/auth/signup/store/details')
		} catch (e: any) {
			toast.error(e.message)
		} finally {
			isLoading = false
		}
	}
</script>

<svelte:head>
	<title>Create Store - {page?.data?.store?.name || ''}</title>
	<meta name="description" content="Start your online business with {page?.data?.store?.name}. Create your store and reach customers worldwide." />
</svelte:head>

<main
	class="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-white p-4 dark:from-gray-900 dark:to-gray-800"
	role="main"
>
	<div class="grid w-full max-w-4xl items-center gap-8 md:grid-cols-2">
		<!-- Left side - Welcome message -->
		<div class="hidden space-y-6 p-8 md:block" aria-hidden="true">
			<div class="space-y-4">
				<h1 class="text-4xl font-bold tracking-tighter text-[#1E293B] sm:text-5xl xl:text-6xl/none">Start your business journey</h1>
				<p class="text-lg text-gray-600 dark:text-gray-300">Create your online store and start selling to customers worldwide.</p>
			</div>
			<div class="space-y-4">
				<div class="flex items-center space-x-3">
					<div class="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-900">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
						</svg>
					</div>
					<p class="text-gray-600 dark:text-gray-300">Reach millions of customers</p>
				</div>
				<div class="flex items-center space-x-3">
					<div class="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-900">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					</div>
					<p class="text-gray-600 dark:text-gray-300">Powerful tools to grow your business</p>
				</div>
				<div class="flex items-center space-x-3">
					<div class="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-900">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
							/>
						</svg>
					</div>
					<p class="text-gray-600 dark:text-gray-300">Secure and reliable platform</p>
				</div>
			</div>
		</div>

		<!-- Right side - Email form -->
		<div class="w-full max-w-md transform space-y-6 rounded-xl bg-white/80 p-8 shadow-2xl backdrop-blur-sm transition-all dark:bg-gray-800/90">
			<div class="space-y-2">
				<h2 class="text-2xl font-bold text-gray-900 dark:text-white">Create your store</h2>
				<p class="text-gray-500 dark:text-gray-400">Enter your email to get started</p>
			</div>

			<form class="space-y-4" onsubmit={handleSubmit} aria-label="Store creation form">
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

				<Button type="submit" class="w-full" disabled={isLoading} aria-label={isLoading ? 'Creating store...' : 'Signup'}>
					{#if isLoading}
						<LoaderIcon class="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
						<span class="sr-only">Creating store...</span>
					{/if}
					{isLoading ? 'Creating store...' : 'Signup'}
				</Button>
			</form>

			<div class="space-y-4 text-center">
				<p class="text-sm text-gray-500">Already have a store?</p>

				<AuthButton type="login">
					<button
						class="inline-block text-gray-600 transition-colors hover:text-gray-900 dark:hover:text-gray-300"
						aria-label="Sign in to your store"
					>
						Sign in to your store
					</button>
				</AuthButton>
			</div>

			<div class="text-center text-xs text-gray-500">
				<p>By creating a store, you agree to our</p>
				<div class="space-x-1">
					<a href="/terms" class="text-gray-600 hover:text-gray-900 dark:hover:text-gray-300">Terms of Service</a>
					<span>and</span>
					<a href="/privacy" class="text-gray-600 hover:text-gray-900 dark:hover:text-gray-300">Privacy Policy</a>
				</div>
			</div>
		</div>
	</div>
</main>
