<script lang="ts">
	import PolicyLink from '$lib/components/common/policy-link.svelte'
	import { isCmsPageResolvable } from '$lib/components/common/cms-pages.js'
	import { ArrowLeft, Check, LoaderIcon, X, Phone, Mail } from '@lucide/svelte'
	import * as InputOTP from '$lib/components/ui/input-otp/index.js'
	import Button from '$lib/components/ui/button/button.svelte'
	import { env } from '$env/dynamic/public'
	import Textbox from '$lib/components/form/textbox.svelte'
	import Modal from '../common/modal.svelte'
	import { page } from '$app/state'
	import { goto } from '$app/navigation'
	import { dev } from '$app/environment'
	import AuthButton from '$lib/components/auth/auth-button.svelte'
	import { LoginModule, loginModuleSchema as schemas } from '$lib/core/composables/index.js'
	import { z } from 'zod'
	import { toast } from '@misiki/kitcommerce-core'
	import { authService, type User } from '$lib/core/services/index.js'

	let { show = $bindable(false), manageHistory = true } = $props()

	const customPhoneSchema = z.string().refine((val) => schemas.phone.safeParse(val.replace(/\s+/g, '')).success, 'Please enter a valid phone number')

	const loginModule = new LoginModule()
	const userState = loginModule.userState
	let resendSeconds = $state(0)
	let otpCooldownStarted = $state(false)
	let resendTimer: ReturnType<typeof setInterval> | undefined

	const recipient = $derived(
		loginModule.identifier.length > 4
			? `${loginModule.identifier.slice(0, Math.min(4, loginModule.identifier.length - 4))}${'•'.repeat(4)}${loginModule.identifier.slice(-2)}`
			: loginModule.identifier
	)
	const loginPrompt = $derived(loginModule.isPhoneNumber ? 'We will text you a code to sign in.' : 'Enter your email and password.')

	// The old markup branched on `identifier.length === 0` before falling back to isPhoneNumber, so
	// a store locked to one login type showed its configured label only while the field was empty.
	// The store's setting does not change as the shopper types, so it wins outright when it is set.
	// Not "can this be linked?" but "can this be read?" — see the consent block in the markup.
	const termsResolvable = $derived(isCmsPageResolvable('/terms-and-conditions', page.data?.cmsPages ?? []))

	const identifierLabel = $derived(
		page.data.store?.loginType === 'PHONE'
			? 'Phone number'
			: page.data.store?.loginType === 'EMAIL'
				? 'Email address'
				: loginModule.isPhoneNumber
					? 'Phone number'
					: 'Email address'
	)

	function startResendCooldown() {
		resendSeconds = 30
		if (resendTimer) clearInterval(resendTimer)
		resendTimer = setInterval(() => {
			resendSeconds = Math.max(0, resendSeconds - 1)
			if (resendSeconds === 0 && resendTimer) {
				clearInterval(resendTimer)
				resendTimer = undefined
			}
		}, 1000)
	}

	async function handleResendOtp() {
		if (resendSeconds > 0) return
		try {
			if (dev) {
				toast.success('OTP resent successfully (Dev Mode: 1111)')
				startResendCooldown()
				return
			}
			await authService.getOtp({ phone: loginModule.identifier })
			toast.success('OTP resent successfully')
			startResendCooldown()
		} catch (e: any) {
			toast.error(e.message || 'Failed to resend OTP')
		}
	}

	$effect(() => {
		if (loginModule.step === 2 && loginModule.otpInputRef) {
			const el = loginModule.otpInputRef as HTMLElement
			const input = el.querySelector('input') as HTMLInputElement | null
			if (input) {
				input.focus()
			} else {
				el.focus()
			}
		}
	})

	$effect(() => {
		if (loginModule.step === 2 && !otpCooldownStarted) {
			otpCooldownStarted = true
			startResendCooldown()
		} else if (loginModule.step !== 2) {
			otpCooldownStarted = false
		}
	})

	$effect(() => {
		if (show) {
			loginModule.step = 1
			loginModule.otp = ''
			loginModule.identifier = ''
			verifiedOtp = ''
		}
	})

	import { onDestroy, onMount } from 'svelte'

	onMount(() => {
		if (dev) {
			// Purge any dev-session mock cookies to avoid remote API validation errors.
			// Keyed off `me`, since a real connect.sid is httpOnly and unreadable here.
			if (document.cookie.includes('dev_user')) {
				document.cookie = 'connect.sid=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
				document.cookie = 'me=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
			}

			// Monkey patch send OTP to intercept rate limit error
			const originalGetOtp = authService.getOtp
			authService.getOtp = async (args) => {
				try {
					return await originalGetOtp.call(authService, args)
				} catch (err: any) {
					if (err.message?.includes('Please wait') || err.message?.includes('cooldown') || err.status === 429) {
						toast.success('Dev Mode: Rate limit bypassed. Use OTP 1111')
						loginModule.step = 2
						setTimeout(() => {
							loginModule.otpInputRef?.focus()
						}, 100)
						return { success: true, message: 'Bypassed' } as unknown as User
					}
					throw err
				}
			}

			// Monkey patch verify OTP to support 1111 bypass on rate limit failover
			const originalVerifyOtp = authService.verifyOtp
			authService.verifyOtp = async (args) => {
				if (args.otp === '1111') {
					const mockUser = {
						id: 'dev_user',
						// UserState gates on me.userId, so the mock must carry one too
						userId: 'dev_user',
						phone: args.phone,
						firstName: 'Dev',
						lastName: 'User',
						role: 'user'
					}
					document.cookie = `connect.sid=dev-session; path=/; max-age=${60 * 60 * 24 * 30}`
					document.cookie = `me=${encodeURIComponent(JSON.stringify(mockUser))}; path=/; max-age=${60 * 60 * 24 * 30}`
					userState.user = mockUser as unknown as User
					show = false
					return mockUser as unknown as User
				}
				return await originalVerifyOtp.call(authService, args)
			}
		}
	})

	onDestroy(() => {
		if (resendTimer) clearInterval(resendTimer)
	})

	let verifiedOtp = $state('')

	// userState.verifyOtp ends in a hardcoded `goto('/')` for the USER role and never reads
	// `?redirect=`, so every shopper who logged in by phone — including from the "log in to use
	// your saved addresses" prompt at checkout, and anyone bounced off /my/* — was dumped on the
	// homepage and had to find their way back. The password path already honours `redirect`; this
	// re-applies it for OTP. Issuing the second goto as soon as verification resolves supersedes
	// the in-flight one rather than landing on the homepage first.
	async function verifyOtpThenRedirect() {
		const redirectTo = new URLSearchParams(window.location.search).get('redirect')
		await loginModule.handleVerifyOtp()
		if (redirectTo && userState.user) goto(decodeURIComponent(redirectTo))
	}

	$effect(() => {
		if (loginModule.otp.length === 4 && loginModule.otp !== verifiedOtp && !loginModule.isLoading && !userState.loading) {
			verifiedOtp = loginModule.otp
			verifyOtpThenRedirect()
		} else if (loginModule.otp.length !== 4) {
			verifiedOtp = ''
		}
	})
</script>

<Modal
	bind:show
	{manageHistory}
	rounded={false}
	hideHeader
	hideFooter
	useMaxHeight
	class="p-0 max-sm:h-[100dvh] max-sm:w-screen max-sm:!rounded-none"
	rootClass="shadow-z-10 sm:rounded-radius"
	hAuto
	wAuto
>
	<!-- One rhythm for the whole dialog. Every vertical gap comes from this `space-y-5`, from the
	     field group's `space-y-3`, or from a component's own margin — never from a second scope
	     nested inside the first. The previous markup stacked five of them (space-y-6 > space-y-5 >
	     space-y-4 > space-y-4 > space-y-2, plus mt-2/pt-2/pt-1.5), which is where the dialog's
	     height came from. Sizes are dialog scale, not page scale: this is a doorway a shopper
	     passes through mid-purchase, not a screen to be read. -->
	<div
		class="w-full space-y-5 bg-card p-5 text-foreground max-sm:flex max-sm:min-h-[100dvh] max-sm:flex-col max-sm:pb-[max(1.25rem,env(safe-area-inset-bottom))] max-sm:pt-[max(0.75rem,env(safe-area-inset-top))] sm:w-[380px] sm:p-6"
	>
		<!-- The brand mark and the close control share one row, so the dialog no longer spends a
		     44px band on the close button before any content starts. -->
		<div class="flex items-center justify-between gap-3">
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
				onclick={() => {
					show = false
					loginModule.removeUrlParams()
				}}
			>
				<X class="size-5" />
			</button>
		</div>

		{#if loginModule.step === 1}
			<!-- h2, not h1: the page underneath already owns the h1, and a dialog that opens over it
			     must not give the document a second one. -->
			<div>
				<h2 class="text-xl font-semibold">Sign in</h2>
				<p class="mt-1 text-sm text-muted-foreground">{loginPrompt}</p>
			</div>

			<form
				onsubmit={async (e) => {
					if (loginModule.isPhoneNumber) {
						let phone = loginModule.identifier.replace(/\s+/g, '')
						if (phone && !phone.startsWith('+')) {
							const dialCode = page?.data?.store?.storeCountry?.dialCode || '+91'
							phone = dialCode + phone
						}
						loginModule.identifier = phone
					}
					const success = await loginModule.handleSubmit(e)
					if (success) {
						loginModule.removeUrlParams()
						show = false
					}
				}}
				class="space-y-4 max-sm:flex max-sm:flex-1 max-sm:flex-col"
			>
				<!-- Textbox ships its own `mb-3`, so the group zeroes it and sets the gap once. Without
				     that, the space between fields was the component's margin plus the parent's rhythm. -->
				<div class="space-y-3 [&>div]:mb-0">
					{#if !page.data.store?.loginType || page.data.store?.loginType == 'BOTH'}
						<div class="relative flex rounded-radius bg-muted p-1" role="group" aria-label="Sign-in method">
							<div
								class="absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-radius border bg-background shadow-xs transition-transform duration-200 ease-out motion-reduce:transition-none"
								style:transform={loginModule.isPhoneNumber ? 'translateX(0)' : 'translateX(100%)'}
							></div>

							<button
								type="button"
								aria-pressed={loginModule.isPhoneNumber}
								class="relative z-10 flex h-9 flex-1 items-center justify-center gap-1.5 rounded-radius text-sm font-medium transition-colors max-md:h-11 {loginModule.isPhoneNumber
									? 'text-foreground'
									: 'text-foreground/70 hover:text-foreground'}"
								onclick={() => !loginModule.isPhoneNumber && loginModule.switchLoginType()}
							>
								<Phone class="size-4" />
								Phone
							</button>

							<button
								type="button"
								aria-pressed={!loginModule.isPhoneNumber}
								class="relative z-10 flex h-9 flex-1 items-center justify-center gap-1.5 rounded-radius text-sm font-medium transition-colors max-md:h-11 {!loginModule.isPhoneNumber
									? 'text-foreground'
									: 'text-foreground/70 hover:text-foreground'}"
								onclick={() => loginModule.isPhoneNumber && loginModule.switchLoginType()}
							>
								<Mail class="size-4" />
								Email
							</button>
						</div>
					{/if}

					{#key loginModule.isPhoneNumber}
						<Textbox
							name="identifier"
							label={identifierLabel}
							bind:value={loginModule.identifier}
							placeholder={loginModule.isPhoneNumber ? '+91 234 567 890' : 'you@example.com'}
							type={loginModule.isPhoneNumber ? 'tel' : 'email'}
							schema={loginModule.isPhoneNumber ? customPhoneSchema : schemas.email}
							oninput={(e) => {
								if (loginModule.isPhoneNumber) {
									const target = e.target as HTMLInputElement
									const current = target.value
									const cleaned = current.replace(/[^\d\+\s]/g, '')
									if (current !== cleaned) {
										const start = target.selectionStart
										target.value = cleaned
										loginModule.identifier = cleaned
										if (start !== null) {
											target.setSelectionRange(start - 1, start - 1)
										}
									} else {
										loginModule.identifier = current
									}
								}
							}}
							class="h-11 md:h-10"
							required
						/>
					{/key}

					{#if !loginModule.isPhoneNumber}
						<Textbox
							name="password"
							label="Password"
							type="password"
							bind:value={loginModule.password}
							placeholder="Enter your password"
							schema={schemas.password}
							class="h-11 md:h-10"
							required
						/>
						<div class="flex justify-end">
							<AuthButton
								type="forgot-password"
								extraqueries={{ email: loginModule.identifier }}
								aria-label="Reset your password"
								class="inline-flex cursor-pointer items-center rounded-radius text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
							>
								Forgot password?
							</AuthButton>
						</div>
					{/if}
				</div>

				<Button type="submit" class="h-11 w-full text-sm font-semibold md:h-10" disabled={userState.loading || loginModule.isLoading}>
					{#if loginModule.isPhoneNumber && (loginModule.isLoading || userState.loading)}
						<LoaderIcon class="mr-2 size-4 animate-spin" />
						Sending code…
					{:else if userState.loading && !loginModule.isPhoneNumber}
						<LoaderIcon class="mr-2 size-4 animate-spin" />
						Signing in…
					{:else}
						{loginModule.isPhoneNumber ? 'Send code' : 'Sign in'}
					{/if}
				</Button>

				<!-- One tail block, so the bottom-pinning on a phone survives whichever lines render. -->
				<div class="space-y-3 max-sm:!mt-auto max-sm:pt-6">
					{#if loginModule.showSignupButton && page.data.store?.loginType !== 'PHONE'}
						<p class="text-center text-sm text-muted-foreground">
							New to {page?.data?.store?.name}?
							<AuthButton
								type="signup"
								aria-label="Create an account"
								class="inline cursor-pointer font-medium text-foreground underline-offset-4 hover:underline">Create an account</AuthButton
							>
						</p>
					{/if}

					<!-- The consent sentence is gated on whether the terms can actually be read, not just
					     on whether they can be linked. PolicyLink degrades a dead link to plain text, which
					     is the honest thing to do with a link — but applied here it left the storefront
					     telling a shopper they had agreed to a document it could not show them, with the
					     name of that document sitting there unclickable. A claim nobody can check is worse
					     than no claim, so when the page is not published the sentence does not appear. It
					     returns, as a working link, the moment the merchant writes the page.
					     The vendor link used to be its own stacked block beneath this one. -->
					{#if termsResolvable || page?.data?.store?.plugins?.isMultiVendor?.active}
						<p class="text-center text-xs leading-relaxed text-muted-foreground">
							{#if termsResolvable}
								By continuing you agree to our
								<PolicyLink href="/terms-and-conditions" class="text-foreground hover:underline" onclick={() => (show = false)}
									>Terms &amp; Conditions</PolicyLink
								>.
							{/if}
							{#if page?.data?.store?.plugins?.isMultiVendor?.active}
								Selling with us?
								<a href="/auth/join-as-vendor" class="text-foreground hover:underline" onclick={() => (show = false)}>Join as a vendor</a>.
							{/if}
						</p>
					{/if}
				</div>
			</form>
		{:else if loginModule.step === 2}
			<div class="space-y-5">
				<div class="flex items-center justify-between gap-3">
					<button
						type="button"
						class="-ml-2 inline-flex h-9 items-center gap-1 rounded-radius px-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground max-md:h-11"
						onclick={() => (loginModule.step = 1)}
					>
						<ArrowLeft class="size-4" /> Change number
					</button>
					<span class="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
						<Check class="size-3.5 text-primary" /> Code sent
					</span>
				</div>

				<div>
					<h2 class="text-xl font-semibold">Check your phone</h2>
					<p class="mt-1 text-sm text-muted-foreground">
						Enter the 4-digit code sent to <span class="font-medium text-foreground">{recipient}</span>.
					</p>
					{#if dev}
						<p class="mt-1 text-xs font-medium text-warning">Dev mode: use 1111</p>
					{/if}
				</div>

				<!-- The code row used to sit in a 540px-tall flex column with py-10 above and below it,
				     which is most of why this step scrolled on a phone. It is four boxes. -->
				<div class="flex justify-center">
					<InputOTP.Root
						aria-label="Four digit verification code"
						maxlength={4}
						pattern="\d*"
						bind:value={loginModule.otp}
						bind:ref={loginModule.otpInputRef}
					>
						{#snippet children({ cells })}
							<InputOTP.Group class="gap-2">
								{#each cells as cell}
									<InputOTP.Slot
										{cell}
										class="h-12 w-11 rounded-radius border bg-background text-lg font-semibold transition-colors {cell.isActive
											? 'border-primary ring-2 ring-ring/35'
											: ''}"
									/>
								{/each}
							</InputOTP.Group>
						{/snippet}
					</InputOTP.Root>
				</div>
				<input type="hidden" name="otp" bind:value={loginModule.otp} />

				<div class="space-y-3">
					<Button
						class="h-11 w-full text-sm font-semibold md:h-10"
						onclick={loginModule.handleVerifyOtp}
						disabled={loginModule.otp.length !== 4 || userState.loading}
					>
						{#if userState.loading}
							<LoaderIcon class="mr-2 size-4 animate-spin" /> Verifying…
						{:else}
							Continue
						{/if}
					</Button>
					<p class="text-center text-sm text-muted-foreground">
						{#if resendSeconds > 0}
							Resend code in {resendSeconds}s
						{:else}
							Didn't get it? <button
								type="button"
								class="font-medium text-foreground underline-offset-4 transition-colors hover:underline"
								onclick={handleResendOtp}>Resend code</button
							>
						{/if}
					</p>
				</div>
			</div>
		{/if}
	</div>
</Modal>
