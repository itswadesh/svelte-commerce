<script lang="ts">
	import { Check, LoaderIcon, X } from '@lucide/svelte'
	import Button from '$lib/components/ui/button/button.svelte'
	import Textbox from '$lib/components/form/textbox.svelte'
	import Modal from '../common/modal.svelte'
	import AuthButton from '$lib/components/auth/auth-button.svelte'
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
			class="p-0 max-sm:h-[100dvh] max-sm:w-screen max-sm:!rounded-none"
			hAuto
			wAuto
		>
			<!-- Same shell, rhythm and control sizes as the login modal: a shopper moves between the
			     two in one click, so they cannot be two different scales. Five fields means this one
			     scrolls, hence the flex column and max height the login dialog does not need. -->
			<div
				class="flex max-h-[100dvh] w-full flex-col space-y-5 overflow-y-auto border bg-card p-5 text-foreground shadow-z-10 max-sm:min-h-[100dvh] max-sm:pb-[max(1.25rem,env(safe-area-inset-bottom))] max-sm:pt-[max(0.75rem,env(safe-area-inset-top))] sm:max-h-[92vh] sm:w-[400px] sm:rounded-radius sm:p-6"
			>
				<div class="flex shrink-0 items-center justify-between gap-3">
					{#if page?.data?.store?.logo}
						<img src={page.data.store.logo} alt={page.data.store.name} class="h-7 w-auto object-contain" />
					{:else}
						<span class="flex size-8 items-center justify-center rounded-radius border bg-muted text-sm font-semibold">
							{page?.data?.store?.name?.charAt(0) || 'L'}
						</span>
					{/if}
					<button
						type="button"
						aria-label="Close"
						class="-mr-1.5 inline-flex size-9 items-center justify-center rounded-radius text-muted-foreground transition-colors hover:bg-muted hover:text-foreground max-md:size-11"
						onclick={closeModal}
					>
						<X class="size-5" />
					</button>
				</div>

				<!-- The header used to stack two badges before the heading: the store mark, and under it
				     a 48px primary-tinted circle holding a UserPlus icon. The icon said nothing the
				     heading did not, so it is gone and the store mark stands alone. -->
				<div class="shrink-0">
					<h2 class="text-xl font-semibold">Create account</h2>
					<p class="mt-1 text-sm text-muted-foreground">Save your details for faster checkout and order tracking.</p>
				</div>

				<form class="space-y-4" onsubmit={handleSubmit} aria-label="Sign up form">
					<div class="space-y-3 [&>div]:mb-0">
						<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 [&>div]:mb-0">
							<Textbox
								name="firstName"
								bind:value={info.firstName}
								placeholder="John"
								schema={schemas.firstName}
								label="First name"
								class="h-11 md:h-10"
								required
								autocomplete="given-name"
							/>
							<Textbox
								name="lastName"
								bind:value={info.lastName}
								placeholder="Doe"
								schema={schemas.lastName}
								label="Last name"
								class="h-11 md:h-10"
								required
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
							class="h-11 md:h-10"
							required
							autocomplete="email"
						/>

						<Textbox
							name="password"
							type="password"
							bind:value={info.password}
							placeholder="At least 8 characters"
							schema={schemas.password}
							label="Password"
							class="h-11 md:h-10"
							required
							autocomplete="new-password"
						/>

						<!-- The mismatch used to share a filled, ring-bordered card with a standing password
						     hint, so a card sat inside the dialog to hold one line of text that was usually
						     reassurance nobody asked for. The requirement now lives in the field's own
						     placeholder, and this space is used only when something is actually wrong. -->
						<Textbox
							name="confirmPassword"
							type="password"
							bind:value={info.confirmPassword}
							placeholder="Repeat your password"
							schema={schemas.confirmPassword}
							label="Confirm password"
							error={passwordsMismatch ? 'Passwords do not match yet.' : undefined}
							class="h-11 md:h-10"
							required
							autocomplete="new-password"
						/>
					</div>

					<Button type="submit" class="h-11 w-full text-sm font-semibold md:h-10" disabled={isLoading || passwordsMismatch}>
						{#if isLoading}
							<LoaderIcon class="mr-2 size-4 animate-spin" aria-hidden="true" />
							Creating account…
						{:else}
							Create account
						{/if}
					</Button>

					<!-- One route back to sign-in, not two. A mobile-only ghost "Login" button used to sit
					     in the header row as well as this line, so a phone showed the same action twice. -->
					<p class="text-center text-sm text-muted-foreground">
						Already have an account?
						<AuthButton
							type="login"
							aria-label="Sign in to your account"
							class="inline cursor-pointer font-medium text-foreground underline-offset-4 hover:underline">Sign in</AuthButton
						>
					</p>

					{#if page?.data?.store?.plugins?.isMultiVendor?.active}
						<!-- Was an "or" divider above a full-width bordered button, which gave a secondary
						     link the visual weight of a second call to action. -->
						<p class="text-center text-xs leading-relaxed text-muted-foreground">
							Selling with us?
							<a
								href="/auth/join-as-vendor"
								class="inline-flex items-center gap-1 font-medium text-foreground underline-offset-4 hover:underline"
								aria-label="Join as a vendor"
							>
								<Check class="size-3.5" aria-hidden="true" /> Join as a vendor
							</a>
						</p>
					{/if}
				</form>
			</div>
		</Modal>
	{/snippet}
</SignupRenderer>
