<script lang="ts">
	import { ArrowLeft, Check, LoaderIcon, ShieldCheck, UserPlus, X } from '@lucide/svelte'
	import Button from '$lib/components/ui/button/button.svelte'
	import Textbox from '$lib/components/form/textbox.svelte'
	import Modal from '../common/modal.svelte'
	import { AuthButton } from '$lib/core/components/index.js'
	import { SignupRenderer } from '$lib/core/composables/index.js'
	import { page } from '$app/state'

	let { show = $bindable(), manageHistory = true } = $props()

	let info = $state({
		firstName: '',
		lastName: '',
		email: '',
		password: '',
		confirmPassword: ''
	})

	const passwordsMismatch = $derived(info.confirmPassword.length > 0 && info.password !== info.confirmPassword)
</script>

<SignupRenderer bind:show bind:info>
	{#snippet content({ isLoading, handleSubmit, closeModal, schemas })}
		<Modal
			bind:show
			{manageHistory}
			rounded={false}
			hideHeader
			hideFooter
			useMaxHeight
			class="p-0 max-sm:h-screen max-sm:w-screen max-sm:!rounded-none"
			hAuto
			wAuto
		>
			<div
				class="flex max-h-[100dvh] w-full transform flex-col overflow-y-auto border border-gray-100/50 bg-white p-6 shadow-2xl ring-1 ring-white/20 transition-all dark:border-gray-700 dark:bg-gray-900 dark:ring-white/5 max-sm:min-h-[100dvh] max-sm:px-5 max-sm:pb-[max(1.5rem,env(safe-area-inset-bottom))] max-sm:pt-[max(1rem,env(safe-area-inset-top))] sm:max-h-[92vh] sm:max-w-[480px] sm:rounded-radius sm:p-8"
			>
				<!-- Close Icon -->
				<div class="z-50 flex min-h-11 shrink-0 items-center justify-between sm:absolute sm:right-5 sm:top-5 sm:justify-end">
					<AuthButton type="login">
						<Button
							type="button"
							variant="ghost"
							class="-ml-3 inline-flex min-h-11 items-center gap-1.5 px-3 text-sm font-semibold text-gray-600 hover:text-gray-950 dark:text-gray-300 dark:hover:text-white sm:hidden"
						>
							<ArrowLeft class="h-4 w-4" />
							Login
						</Button>
					</AuthButton>
					<button
						aria-label="Close modal button"
						class="inline-flex h-11 w-11 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
						onclick={closeModal}
					>
						<X class="h-5 w-5" />
					</button>
				</div>

				<div class="flex shrink-0 flex-col items-center space-y-3 pb-1 text-center max-sm:pt-3">
					{#if page?.data?.store?.logo}
						<div class="mb-1 flex h-10 items-center justify-center">
							<img src={page.data.store.logo} alt={page.data.store.name} class="h-9 object-contain dark:brightness-110" />
						</div>
					{:else}
						<div class="mb-1 flex h-12 w-12 items-center justify-center rounded-radius bg-muted shadow-sm ring-1 ring-border">
							<span class="text-lg font-bold text-gray-900 dark:text-white">{page?.data?.store?.name?.charAt(0) || 'L'}</span>
						</div>
					{/if}
					<div class="space-y-2">
						<div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/15">
							<UserPlus class="h-6 w-6" />
						</div>
						<h1 class="text-3xl font-bold tracking-tight text-gray-950 dark:text-white">Create account</h1>
						<p class="mx-auto max-w-[31ch] text-sm leading-6 text-gray-600 dark:text-gray-300">
							Save your details for faster checkout and easier order tracking.
						</p>
					</div>
				</div>

				<form class="space-y-4 max-sm:pt-2" onsubmit={handleSubmit} aria-label="Sign up form">
					<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<Textbox
							name="firstName"
							bind:value={info.firstName}
							placeholder="John"
							schema={schemas.firstName}
							label="First name"
							class="h-14 text-base sm:h-12"
							required
							aria-label="First name"
							autocomplete="given-name"
						/>
						<Textbox
							name="lastName"
							bind:value={info.lastName}
							placeholder="Doe"
							schema={schemas.lastName}
							label="Last name"
							class="h-14 text-base sm:h-12"
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
						class="h-14 text-base sm:h-12"
						required
						aria-label="Email address"
						autocomplete="email"
					/>

					<Textbox
						name="password"
						type="password"
						bind:value={info.password}
						placeholder="Enter a password"
						schema={schemas.password}
						label="Password"
						class="h-14 text-base sm:h-12"
						required
						aria-label="Password"
						autocomplete="new-password"
					/>

					<Textbox
						name="confirmPassword"
						type="password"
						bind:value={info.confirmPassword}
						placeholder="Confirm your password"
						schema={schemas.confirmPassword}
						label="Confirm password"
						class="h-14 text-base sm:h-12"
						required
						aria-label="Confirm password"
						autocomplete="new-password"
					/>

					<div
						class="flex items-start gap-2 rounded-radius bg-gray-50 p-3 text-xs leading-5 text-gray-600 ring-1 ring-gray-100 dark:bg-gray-800/70 dark:text-gray-300 dark:ring-gray-700"
					>
						{#if passwordsMismatch}
							<X class="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
							<span>Passwords do not match yet.</span>
						{:else}
							<ShieldCheck class="mt-0.5 h-4 w-4 shrink-0 text-primary" />
							<span>Use at least 8 characters. Your password is only used to secure your account.</span>
						{/if}
					</div>

					<Button
						type="submit"
						class="h-14 w-full text-wrap px-4 py-2 text-base font-semibold shadow-sm transition-colors"
						disabled={isLoading || passwordsMismatch}
						aria-label={isLoading ? 'Creating account...' : passwordsMismatch ? 'Passwords do not match' : 'Create account'}
					>
						{#if isLoading}
							<LoaderIcon class="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
							Creating account...
						{:else if passwordsMismatch}
							Passwords do not match
						{:else}
							Create account
						{/if}
					</Button>
				</form>

				<div class="space-y-2 text-center">
					<p class="text-sm text-gray-600 dark:text-gray-300">Already have an account?</p>
					<AuthButton type="login">
						<Button
							variant="link"
							class="inline-flex min-h-11 items-center font-semibold text-gray-950 transition-colors hover:underline dark:text-white"
							aria-label="Sign in to your account"
						>
							<ArrowLeft class="mr-2 h-4 w-4" />
							Sign in
						</Button>
					</AuthButton>
				</div>

				{#if page?.data?.store?.plugins?.isMultiVendor?.active}
					<div class="relative py-4">
						<div class="absolute inset-0 flex items-center">
							<div class="w-full border-t border-gray-200 dark:border-gray-700"></div>
						</div>
						<div class="relative flex justify-center text-sm">
							<span class="bg-white px-2 text-gray-500 dark:bg-gray-900 dark:text-gray-400">or</span>
						</div>
					</div>

					<a
						href="/auth/join-as-vendor"
						class="inline-flex min-h-12 w-full items-center justify-center rounded-radius border border-gray-300 px-4 py-2 text-center text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-950 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
						aria-label="Join as a vendor"
					>
						<Check class="mr-2 h-4 w-4" />
						Join as a Vendor
					</a>
				{/if}
			</div>
		</Modal>
	{/snippet}
</SignupRenderer>
