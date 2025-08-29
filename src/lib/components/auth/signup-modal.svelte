<script lang="ts">
	import { LoaderIcon, X } from 'lucide-svelte'
	import Button from '$lib/components/ui/button/button.svelte'
	import Textbox from '$lib/components/form/textbox.svelte'
	import Modal from '../common/modal.svelte'
	import AuthButton from '$lib/core/components/auth/auth-button.svelte'
	import SignupRenderer from '$lib/core/composables/signup-renderer.svelte'
	import { page } from '$app/state'

	let { show = $bindable() } = $props()

	let info = $state({
		firstName: '',
		lastName: '',
		email: '',
		password: '',
		confirmPassword: ''
	})
</script>

<SignupRenderer bind:show bind:info>
	{#snippet content({ isLoading, handleSubmit, closeModal, schemas })}
		<Modal {show} hideHeader hideFooter useMaxHeight class="p-0 max-sm:h-screen max-sm:w-screen" hAuto wAuto rounded={false}>
			<main
				class="w-full max-w-md transform space-y-8 rounded-2xl border border-gray-100 bg-white/80 shadow-lg backdrop-blur-sm transition-all dark:border-gray-700 dark:bg-gray-800/90"
			>
				<!-- Right side - Sign up form -->
				<div class="w-full max-w-md transform space-y-4 rounded-lg bg-white/80 p-8 backdrop-blur-sm transition-all dark:bg-gray-800/90">
					<!-- Close Icon -->
					<div class="sticky top-3 flex items-center justify-end sm:absolute sm:right-4 sm:top-4">
						<button aria-label="Close modal button" class="bg-white p-2" onclick={closeModal}>
							<X class="h-6 w-6 text-gray-700 dark:text-gray-300" />
						</button>
					</div>

					<div class="space-y-2 text-center">
						<h2 class="text-2xl font-bold text-gray-900 dark:text-white">Create your account</h2>
						<p class="text-gray-500 dark:text-gray-400">Join us and start your shopping journey</p>
					</div>

					<form class="space-y-4" onsubmit={handleSubmit} aria-label="Sign up form">
						<div class="grid grid-cols-2 gap-4">
							<Textbox
								name="firstName"
								bind:value={info.firstName}
								placeholder="John"
								schema={schemas.firstName}
								label="First Name"
								required
								aria-label="First name"
								autocomplete="given-name"
							/>
							<Textbox
								name="lastName"
								bind:value={info.lastName}
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
							bind:value={info.email}
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
							bind:value={info.password}
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
							bind:value={info.confirmPassword}
							placeholder="••••••••"
							schema={schemas.confirmPassword}
							label="Confirm password"
							required
							aria-label="Confirm password"
							autocomplete="new-password"
						/>

						<Button 
							type="submit" 
							class="w-full" 
							disabled={isLoading || info.password !== info.confirmPassword}
							aria-label={isLoading ? 'Creating account...' : info.password !== info.confirmPassword ? 'Passwords do not match' : 'Create account'}
						>
							{#if isLoading}
								<LoaderIcon class="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
								<span class="sr-only">Creating account...</span>
							{/if}
							{isLoading ? 'Creating account...' : info.password !== info.confirmPassword ? 'Passwords do not match' : 'Create account'}
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
		</Modal>
	{/snippet}
</SignupRenderer>
