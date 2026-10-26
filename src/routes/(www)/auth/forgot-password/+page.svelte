<script lang="ts">
	import { LoaderIcon } from '@lucide/svelte'
	import Button from '$lib/components/ui/button/button.svelte'
	import Textbox from '$lib/components/form/textbox.svelte'
	import AuthButton from '$lib/components/auth/auth-button.svelte'
	import { ForgotPasswordModule, forgotPasswordSchema as schemas } from '$lib/core/composables/index.js'

	const forgotPasswordModule = new ForgotPasswordModule()
</script>

<svelte:head>
	<title>Forgot password</title>
</svelte:head>
<div class="flex justify-center bg-background px-4 py-8 sm:py-16">
	<div class="flex w-full items-center justify-center gap-8 p-4">
		<!-- Left side - Illustration and message -->
		<!-- <div class="hidden space-y-6 p-8 md:block">
			<div class="space-y-4">
				<h1 class="page-heading">Reset password</h1>
				<p class="text-lg text-muted-foreground">Don't worry! It happens to the best of us.</p>
			</div>
			<div class="space-y-4">
				<div class="flex items-center space-x-3">
					<div class="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6 text-muted-foreground"
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
					<p class="text-muted-foreground">We'll send you reset instructions</p>
				</div>
				<div class="flex items-center space-x-3">
					<div class="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6 text-muted-foreground"
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
					<p class="text-muted-foreground">Quick & secure password reset</p>
				</div>
			</div>
		</div> -->

		<!-- Right side - Form -->
		<div class="w-full max-w-md transform space-y-6 rounded-lg border bg-card p-8 transition-all">
			<div class="space-y-2 text-center">
				<h2 class="page-heading">Forgot password?</h2>
				<p class="text-muted-foreground">Enter your email to receive reset instructions</p>
			</div>

			<form class="space-y-4" onsubmit={(e) => forgotPasswordModule.handleSubmit(e, true)}>
				<Textbox
					name="email"
					type="email"
					autocomplete="email"
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
					<span class="bg-card px-2 text-muted-foreground">Or</span>
				</div>
			</div>

			<div class="text-center">
				<AuthButton type="login">
					<Button variant="link" class="inline-flex items-center text-sm text-muted-foreground hover:text-muted-foreground">
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
