<script lang="ts">
	import { LoaderIcon, X } from '@lucide/svelte'
	import Button from '$lib/components/ui/button/button.svelte'
	import Textbox from '$lib/components/form/textbox.svelte'
	import Modal from '../common/modal.svelte'
	import { AuthButton } from '$lib/core/components/index.js'
	import { SignupRenderer } from '$lib/core/composables/index.js'
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
		<Modal {show} rounded={false} hideHeader hideFooter useMaxHeight class="p-0 max-sm:h-screen max-sm:w-screen max-sm:!rounded-none" hAuto wAuto>
			<div
				class="w-full transform space-y-6 border border-gray-100/50 bg-white/70 p-6 shadow-2xl backdrop-blur-xl transition-all dark:border-gray-700/50 dark:bg-gray-900/80 sm:max-w-[480px] sm:rounded-2xl sm:p-8 ring-1 ring-white/20 dark:ring-white/5"
			>
				<!-- Close Icon -->
				<div class="sticky top-3 z-50 flex items-center justify-end sm:absolute sm:right-5 sm:top-5">
					<button
						aria-label="Close modal button"
						class="rounded-full bg-gray-100/50 p-2 text-gray-600 transition-all hover:bg-gray-200 hover:text-gray-900 dark:bg-gray-800/50 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
						onclick={closeModal}
					>
						<X class="h-5 w-5" />
					</button>
				</div>

				<div class="flex flex-col items-center space-y-3 text-center">
					{#if page?.data?.store?.logo}
						<div class="mb-2 flex h-12 items-center justify-center">
							<img src={page.data.store.logo} alt={page.data.store.name} class="h-10 object-contain dark:brightness-110" />
						</div>
					{:else}
						<div class="mb-2 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 shadow-sm ring-1 ring-gray-200 dark:from-gray-800 dark:to-gray-900 dark:ring-gray-700">
							<span class="text-2xl font-bold text-gray-900 dark:text-white">{page?.data?.store?.name?.charAt(0) || 'L'}</span>
						</div>
					{/if}
					<div class="space-y-1.5">
						<h1 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Create your account</h1>
						<p class="text-sm font-medium text-gray-500 dark:text-gray-400">Join us and start your shopping journey</p>
					</div>
				</div>

				<form class="space-y-4" onsubmit={handleSubmit} aria-label="Sign up form">
					<div class="grid grid-cols-2 gap-4">
						<Textbox
							name="firstName"
							bind:value={info.firstName}
							placeholder="John"
							schema={schemas.firstName}
							label="First Name"
							class="h-12"
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
							class="h-12"
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
						class="h-12"
						required
						aria-label="Email address"
						autocomplete="email"
					/>

					<Textbox
						name="password"
						type="password"
						bind:value={info.password}
						placeholder="••••••••"
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
						bind:value={info.confirmPassword}
						placeholder="••••••••"
						schema={schemas.confirmPassword}
						label="Confirm password"
						class="h-12"
						required
						aria-label="Confirm password"
						autocomplete="new-password"
					/>

					<Button
						type="submit"
						class="mt-2 h-12 w-full text-wrap px-4 py-2 text-base font-medium shadow-md transition-transform hover:scale-[1.02] active:scale-[0.98]"
						disabled={isLoading || info.password !== info.confirmPassword}
						aria-label={isLoading ? 'Creating account...' : info.password !== info.confirmPassword ? 'Passwords do not match' : 'Create account'}
					>
						{#if isLoading}
							<LoaderIcon class="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
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
		</Modal>
	{/snippet}
</SignupRenderer>
