<script lang="ts">
	import { ArrowLeft, Check, LoaderIcon, X, Phone, Mail } from '@lucide/svelte'
	import * as InputOTP from '$lib/components/ui/input-otp/index.js'
	import Button from '$lib/components/ui/button/button.svelte'
	import { Label } from '$lib/components/ui/label/index.js'
	import { env } from '$env/dynamic/public'
	import Textbox from '$lib/components/form/textbox.svelte'
	import Modal from '../common/modal.svelte'
	import { page } from '$app/state'
	import { dev } from '$app/environment'
	import { AuthButton } from '$lib/core/components/index.js'
	import { LoginModule, loginModuleSchema as schemas } from '$lib/core/composables/index.js'
	import { z } from 'zod'
	import { toast } from '@misiki/kitcommerce-core'
	import { authService, type User } from '$lib/core/services/index.js'

	let { show = $bindable(false) } = $props()

	const customPhoneSchema = z.string().refine((val) => schemas.phone.safeParse(val.replace(/\s+/g, '')).success, 'Please enter a valid phone number')

	const loginModule = new LoginModule()
	const userState = loginModule.userState
  $inspect(page.data)
	let resendSeconds = $state(0)
	let otpCooldownStarted = $state(false)
	let resendTimer: ReturnType<typeof setInterval> | undefined

	const recipient = $derived(
		loginModule.identifier.length > 4
			? `${loginModule.identifier.slice(0, Math.min(4, loginModule.identifier.length - 4))}${'•'.repeat(4)}${loginModule.identifier.slice(-2)}`
			: loginModule.identifier
	)
	const loginPrompt = $derived(
		loginModule.isPhoneNumber ? 'Use your phone number to receive a one-time code.' : 'Use your email and password to continue.'
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
			// Purge any dev-session mock cookies to avoid remote API validation errors
			if (document.cookie.includes('connect.sid=dev-session')) {
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

	$effect(() => {
		if (loginModule.otp.length === 4 && loginModule.otp !== verifiedOtp && !loginModule.isLoading && !userState.loading) {
			verifiedOtp = loginModule.otp
			loginModule.handleVerifyOtp()
		} else if (loginModule.otp.length !== 4) {
			verifiedOtp = ''
		}
	})
</script>

<Modal
	bind:show
	manageHistory={false}
	rounded={false}
	hideHeader
	hideFooter
	useMaxHeight
	class="p-0 max-sm:h-screen max-sm:w-screen max-sm:!rounded-none"
	hAuto
	wAuto
>
	<div
		class="w-full transform space-y-6 border border-gray-100/50 bg-white p-6 shadow-2xl ring-1 ring-white/20 transition-all dark:border-gray-700 dark:bg-gray-900 dark:ring-white/5 max-sm:min-h-[100dvh] max-sm:px-5 max-sm:pb-[max(1.5rem,env(safe-area-inset-bottom))] max-sm:pt-[max(1rem,env(safe-area-inset-top))] sm:max-w-[480px] sm:rounded-radius sm:p-8"
	>
		<!-- Close Icon -->
		<div class="z-50 flex min-h-11 items-center justify-end sm:absolute sm:right-5 sm:top-5">
			<button
				aria-label="Close modal button"
				class="inline-flex h-11 w-11 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
				onclick={() => {
					show = false
					loginModule.removeUrlParams()
				}}
			>
				<X class="h-5 w-5" />
			</button>
		</div>

		{#if loginModule.step === 1}
			<div class="flex flex-col items-center space-y-3 pb-2 text-center max-sm:pt-5">
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
					<h1 class="text-3xl font-bold tracking-tight text-gray-950 dark:text-white">Welcome back</h1>
					<p class="mx-auto max-w-[30ch] text-sm leading-6 text-gray-600 dark:text-gray-300">{loginPrompt}</p>
				</div>
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
					if (success) show = false
				}}
				class="flex flex-col space-y-5 max-sm:pt-2"
			>
				<div class="space-y-4">
					<div class="space-y-4">
						{#if !page.data.store?.loginType || page.data.store?.loginType == 'BOTH'}
							<div class="relative flex w-full rounded-radius bg-gray-100/80 p-1.5 shadow-inner dark:bg-gray-800/80">
								<!-- Active Background Indicator -->
								<div
									class="absolute left-1.5 top-1.5 flex h-[calc(100%-12px)] w-[calc(50%-6px)] rounded-radius bg-white shadow-sm transition-transform duration-300 ease-in-out dark:bg-gray-700"
									style:transform={loginModule.isPhoneNumber ? 'translateX(0)' : 'translateX(100%)'}
								></div>

								<button
									type="button"
									class="relative z-10 flex min-h-11 flex-1 items-center justify-center gap-2 rounded-radius py-2.5 text-sm font-semibold transition-colors {loginModule.isPhoneNumber
										? 'text-gray-900 dark:text-white'
										: 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}"
									onclick={() => !loginModule.isPhoneNumber && loginModule.switchLoginType()}
								>
									<Phone class="h-4 w-4" />
									Phone
								</button>

								<button
									type="button"
									class="relative z-10 flex min-h-11 flex-1 items-center justify-center gap-2 rounded-radius py-2.5 text-sm font-semibold transition-colors {!loginModule.isPhoneNumber
										? 'text-gray-900 dark:text-white'
										: 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}"
									onclick={() => loginModule.isPhoneNumber && loginModule.switchLoginType()}
								>
									<Mail class="h-4 w-4" />
									Email
								</button>
							</div>
						{/if}
						<div class="mt-2 space-y-2">
							<Label for="identifier" class="mb-1 block text-sm font-semibold text-gray-800 dark:text-gray-200">
								{#if loginModule.identifier.length === 0}
									{#if page.data.store?.loginType === 'PHONE'}
										Phone Number
									{:else if page.data.store?.loginType === 'EMAIL'}
										Email Address
									{:else}
										{loginModule.isPhoneNumber ? 'Phone Number' : 'Email Address'}
									{/if}
								{:else}
									{loginModule.isPhoneNumber ? 'Phone Number' : 'Email Address'}
								{/if}
							</Label>
							{#key loginModule.isPhoneNumber}
								<Textbox
									name="identifier"
									bind:value={loginModule.identifier}
									placeholder={loginModule.isPhoneNumber ? '+91234567890' : 'johndoe@gmail.com'}
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
									class="h-14 text-base"
									required
								/>
							{/key}
						</div>

						{#if !loginModule.isPhoneNumber}
							<div class="space-y-2">
								<Label for="password" class="text-sm font-medium text-gray-700 dark:text-gray-300">Password</Label>
								<Textbox
									name="password"
									type="password"
									bind:value={loginModule.password}
									placeholder="Enter your password"
									schema={schemas.password}
									class="h-12"
									required
								/>
							</div>
						{/if}
					</div>
					{#if !loginModule.isPhoneNumber}
						<div class="flex items-center justify-center gap-2">
							<!-- <div>
							{#if env.PUBLIC_IS_DEMO_MODE}
								<Button
									variant="secondary"
									type="button"
									class="border border-green-600 bg-green-50 text-sm text-green-600 hover:bg-green-100 hover:text-green-500"
									onclick={loginModule.useDemoCredentials}
								>
									Use demo credentials
								</Button>
							{/if}
						</div> -->
							<div class="flex items-center justify-end">
								<AuthButton type="forgot-password" extraqueries={{ email: loginModule.identifier }}>
									<Button variant="link" class="-mr-4 text-sm text-gray-600 hover:text-gray-500">Forgot password?</Button>
								</AuthButton>
							</div>
						</div>
					{/if}

					<Button
						type="submit"
						class="mt-2 h-14 w-full text-wrap px-4 py-2 text-base font-semibold shadow-sm transition-colors"
						disabled={userState.loading || loginModule.isLoading}
					>
						{#if loginModule.isPhoneNumber && (loginModule.isLoading || userState.loading)}
							<LoaderIcon class="mr-2 h-5 w-5 animate-spin" />
							Sending OTP...
						{:else if userState.loading && !loginModule.isPhoneNumber}
							<LoaderIcon class="mr-2 h-5 w-5 animate-spin" />
							Signing in...
						{:else}
							{loginModule.isPhoneNumber ? 'Send OTP' : 'Sign In'}
						{/if}
					</Button>

					{#if loginModule.showSignupButton && page.data.store?.loginType !== 'PHONE'}
						<div class="pt-2 text-center">
							<p class="text-sm text-gray-500 dark:text-gray-400">
								New to {page?.data?.store?.name}?
								<AuthButton type="signup" class="ml-1 font-semibold text-gray-900 hover:underline dark:text-white">Create an account</AuthButton>
							</p>
						</div>
					{/if}

					<div class="space-y-1 pt-1.5 text-center text-xs leading-5 text-gray-500 dark:text-gray-400">
						<p>
							By continuing, you agree to our
							<a href="/terms-and-conditions" class="font-medium text-gray-700 hover:underline dark:text-gray-300" onclick={() => (show = false)}
								>Terms & Conditions</a
							>
						</p>

						{#if page?.data?.store?.plugins?.isMultiVendor?.active}
							<div class="pt-0.5">
								<a
									href="/auth/join-as-vendor"
									class="font-medium text-gray-600 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-white"
									onclick={() => (show = false)}>Join as a Vendor</a
								>
							</div>
						{/if}
					</div>
				</div>
			</form>
		{:else if loginModule.step === 2}
			<div class="flex min-h-[min(540px,100dvh)] flex-col py-1 sm:min-h-0">
				<div class="flex items-center justify-between">
					<button
						type="button"
						class="-ml-2 inline-flex min-h-11 items-center gap-1 rounded-md px-2 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
						onclick={() => (loginModule.step = 1)}
					>
						<ArrowLeft class="h-4 w-4" /> Change number
					</button>
					<span class="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400"
						><Check class="h-3.5 w-3.5 text-primary" /> Code sent</span
					>
				</div>

				<div class="mt-10 space-y-2 text-center sm:mt-8">
					<h2 class="text-3xl font-bold tracking-tight text-gray-950 dark:text-white">Check your phone</h2>
					<p class="text-sm leading-6 text-gray-600 dark:text-gray-300">
						Enter the 4-digit code sent to <span class="font-semibold text-gray-950 dark:text-white">{recipient}</span>.
					</p>
					{#if dev}
						<p class="text-xs font-semibold text-amber-700 dark:text-amber-300">Dev mode: use 1111</p>
					{/if}
				</div>

				<div class="flex flex-1 items-center justify-center py-10 sm:py-8">
					<InputOTP.Root
						aria-label="Four digit verification code"
						maxlength={4}
						pattern="\d*"
						bind:value={loginModule.otp}
						bind:ref={loginModule.otpInputRef}
					>
						{#snippet children({ cells })}
							<InputOTP.Group class="gap-2.5 sm:gap-3">
								{#each cells as cell}
									<InputOTP.Slot
										{cell}
										class="h-14 w-12 rounded-md border border-gray-300 bg-white text-xl font-bold shadow-sm transition-colors dark:border-gray-600 dark:bg-gray-900 {cell.isActive
											? 'border-primary ring-2 ring-primary/35'
											: ''}"
									/>
								{/each}
							</InputOTP.Group>
						{/snippet}
					</InputOTP.Root>
				</div>
				<input type="hidden" name="otp" bind:value={loginModule.otp} />

				<div class="space-y-4 text-center">
					<Button
						class="h-12 w-full text-base font-semibold shadow-sm"
						onclick={loginModule.handleVerifyOtp}
						disabled={loginModule.otp.length !== 4 || userState.loading}
					>
						{#if userState.loading}
							<LoaderIcon class="mr-2 h-5 w-5 animate-spin" /> Verifying...
						{:else}
							Continue
						{/if}
					</Button>
					<p class="text-sm text-gray-600 dark:text-gray-300">
						{#if resendSeconds > 0}
							Resend code in {resendSeconds}s
						{:else}
							Didn't get it? <button
								type="button"
								class="min-h-11 font-semibold text-gray-950 underline-offset-4 transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:text-white"
								onclick={handleResendOtp}>Resend code</button
							>
						{/if}
					</p>
				</div>
			</div>
		{/if}
	</div>
</Modal>
