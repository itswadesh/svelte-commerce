<script lang="ts">
	import { LoaderIcon } from 'lucide-svelte'
	import Button from '$lib/components/ui/button/button.svelte'
	import Textbox from '$lib/components/form/textbox.svelte'
	import AuthButton from '$lib/core/components/auth/auth-button.svelte'
	import { ForgotPasswordModule, schemas } from '$lib/core/composables/use-forgot-password.svelte'

	const forgotPasswordModule = new ForgotPasswordModule()
</script>

<svelte:head>
	<title>Forgot Password</title>
</svelte:head>
<div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
	<div class="-mt-24 flex w-full items-center justify-center gap-8 p-4">
		<!-- Left side - Illustration and message -->
		<!-- <div class="hidden space-y-6 p-8 md:block">
			<div class="space-y-4">
				<h1 class="bg-gradient-to-r from-gray-600 to-gray-500 bg-clip-text text-4xl font-bold text-transparent">Reset Password</h1>
				<p class="text-lg text-gray-600 dark:text-gray-300">Don't worry! It happens to the best of us.</p>
			</div>
			<div class="space-y-4">
				<div class="flex items-center space-x-3">
					<div class="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-900">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6 text-gray-600 dark:text-gray-300"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
							/>
						</svg>
					</div>
					<p class="text-gray-600 dark:text-gray-300">We'll send you reset instructions</p>
				</div>
				<div class="flex items-center space-x-3">
					<div class="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-900">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6 text-gray-600 dark:text-gray-300"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
							/>
						</svg>
					</div>
					<p class="text-gray-600 dark:text-gray-300">Quick & secure password reset</p>
				</div>
			</div>
		</div> -->

		<!-- Right side - Form -->
		<div class="w-full max-w-md transform space-y-6 rounded-lg border bg-white/80 p-8 backdrop-blur-sm transition-all dark:bg-gray-800/90">
			<div class="space-y-2 text-center">
				<h2 class="text-2xl font-bold text-gray-900 dark:text-white">Forgot Password?</h2>
				<p class="text-gray-500 dark:text-gray-400">Enter your email to receive reset instructions</p>
			</div>

			<form class="space-y-4" onsubmit={(e) => forgotPasswordModule.handleSubmit(e, true)}>
				<Textbox
					name="email"
					type="email"
					bind:value={forgotPasswordModule.email}
					placeholder="swadesh@litekrat.in"
					schema={schemas.email}
					label="Email"
					required
				/>

				<Button type="submit" class="w-full" disabled={forgotPasswordModule.isLoading}>
					{#if forgotPasswordModule.isLoading}
						<LoaderIcon class="mr-2 h-4 w-4 animate-spin" />
					{/if}
					Send Reset Link
				</Button>
			</form>

			<div class="relative">
				<div class="absolute inset-0 flex items-center">
					<span class="w-full border-t"></span>
				</div>
				<div class="relative flex justify-center text-xs uppercase">
					<span class="bg-white px-2 text-gray-500 dark:bg-gray-800">Or</span>
				</div>
			</div>

			<div class="text-center">
				<AuthButton type="login">
					<Button variant="link" class="inline-flex items-center text-sm text-gray-600 hover:text-gray-500">
						<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
						</svg>
						Back to Login
					</Button>
				</AuthButton>
			</div>
		</div>
	</div>
</div>
