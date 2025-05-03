<script lang="ts">
	import { LoaderIcon } from 'lucide-svelte'
	import * as InputOTP from '$lib/components/ui/input-otp/index'
	import Button from '$lib/components/ui/button/button.svelte'
	import { Label } from '$lib/components/ui/label'
	import { env } from '$env/dynamic/public'
	import Textbox from '$lib/components/form/textbox.svelte'
	import { page } from '$app/state'
	import { LoginModule, schemas } from '$lib/core/composables/use-login.svelte'

	const loginModule = new LoginModule()
</script>

<svelte:head>
	<title>Login</title>
</svelte:head>

<div
	class="-mt-24 flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 sm:items-center"
>
	<div class="mt-12 flex items-center justify-center px-4 py-8 sm:mt-0 sm:py-0">
		<div
			class="w-full max-w-md transform space-y-8 rounded-lg border border-gray-100 bg-white/80 p-8 transition-all dark:border-gray-700 dark:bg-gray-800/90"
		>
			{#if loginModule.step === 1}
				<div class="space-y-4 text-center">
					<h1 class="text-3xl font-bold text-gray-900 dark:text-white">Login</h1>
					<p class="mt-2 text-xs text-gray-600 dark:text-gray-400">
						{page?.data?.store?.name}
					</p>
				</div>
				<form onsubmit={loginModule.handleSubmit} class="flex flex-col space-y-4">
					<div class="space-y-2">
						<div class="space-y-2">
							<div class="flex items-center justify-between gap-2">
								<Label for="identifier" class="text-sm font-medium text-gray-700 dark:text-gray-300">
									{#if loginModule.identifier.length === 0}
										{#if env.PUBLIC_LOGIN_TYPE === 'PHONE'}
											Phone
										{:else if env.PUBLIC_LOGIN_TYPE === 'EMAIL'}
											Email
										{:else}
											<!-- Email/Phone -->
											{loginModule.isPhoneNumber ? 'Phone Number' : 'Email'}
										{/if}
									{:else}
										{loginModule.isPhoneNumber ? 'Phone Number' : 'Email'}
									{/if}
								</Label>

								{#if !env.PUBLIC_LOGIN_TYPE}
									<button type="button" class="text-xs text-gray-600 hover:text-gray-500 hover:underline" onclick={loginModule.switchLoginType}>
										Switch to {loginModule.isPhoneNumber ? 'Email' : 'Phone'}
									</button>
								{/if}
							</div>
							<Textbox
								name="identifier"
								bind:value={loginModule.identifier}
								placeholder={loginModule.isPhoneNumber ? '1234567890' : 'johndoe@gmail.com'}
								type={loginModule.isPhoneNumber ? 'tel' : 'email'}
								schema={loginModule.isPhoneNumber ? schemas.phone : schemas.email}
								required
							/>
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
									required
								/>
							</div>
						{/if}
					</div>

					{#if !loginModule.isPhoneNumber}
						<div class="flex items-center justify-end">
							<a href="/auth/forgot-password" class="text-sm text-gray-600 hover:text-gray-500"> Forgot password? </a>
						</div>
					{/if}

					<Button type="submit" class="h-11 w-full text-sm font-medium" disabled={loginModule.isLoading}>
						{#if loginModule.isLoading}
							<LoaderIcon class="mr-2 h-4 w-4 animate-spin" />
						{:else}
							{loginModule.isPhoneNumber ? 'Send OTP' : 'Sign In'}
						{/if}
					</Button>

					{#if loginModule.showSignupButton}
						<div class="space-y-4 text-center">
							<p class="text-sm text-gray-500">
								New to {page?.data?.store?.name}?
							</p>
							<Button variant="link" href="/auth/signup">Create an account</Button>
						</div>
					{/if}

					<p class="text-center text-xs text-gray-500 dark:text-gray-400">
						By continuing, you are accepting our
						<a href="/terms-and-conditions" target="_blank" class="text-gray-600 hover:underline">Terms & Conditions</a>
					</p>

					{#if page?.data?.store?.plugins?.isMultiVendor?.active}
						<Button class="self-center" type="button" variant="link" href="/auth/join-as-vendor">Join as a Vendor</Button>
					{/if}

					<!-- <div class="relative">
                        <div class="absolute inset-0 flex items-center">
                            <span class="w-full border-t dark:border-gray-700" />
                        </div>
                        <div class="relative flex justify-center text-xs uppercase">
                            <span class="bg-white px-2 text-gray-500 dark:bg-gray-800 dark:text-gray-400">Or continue with</span>
                        </div>
                    </div> -->

					<!-- <div class="grid grid-cols-3 gap-3">
                        <Button variant="outline" class="h-11">
                            <GithubLogo class="h-5 w-5" />
                        </Button>
                        <Button variant="outline" class="h-11">
                            <svg class="h-5 w-5" viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M21.35 10.04A9 9 0 0 0 9.04 2.64A8.98 8.98 0 0 0 2.64 9.04A9 9 0 0 0 9.04 21.36A8.98 8.98 0 0 0 21.36 9.04h-2v2H17.5v-2h2c0-4.42-3.58-8-8-8s-8 3.58-8 8s3.58 8 8 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6s6 2.69 6 6h-2v-2h2v2z"
                                />
                            </svg>
                        </Button>
                        <Button variant="outline" class="h-11">
                            <svg class="h-5 w-5" viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                        </Button>
                    </div> -->
				</form>
			{:else if loginModule.step === 2}
				<div class="space-y-6">
					<div class="text-center">
						<h2 class="text-2xl font-bold text-gray-900 dark:text-white">Enter OTP</h2>
						<p class="mt-2 text-xs text-gray-600 dark:text-gray-400">Enter the OTP code sent to your phone number.</p>
					</div>

					<div class="flex justify-center">
						<InputOTP.Root maxlength={4} bind:value={loginModule.otp}>
							{#snippet children({ cells })}
								<InputOTP.Group>
									{#each cells as cell}
										<InputOTP.Slot {cell} />
									{/each}
								</InputOTP.Group>
							{/snippet}
						</InputOTP.Root>
					</div>

					<p class="text-center text-sm">
						Didn't receive the OTP?{' '}
						<button type="button" class="text-gray-600 hover:underline dark:text-gray-400" onclick={() => (loginModule.step = 1)}>
							Resend OTP
						</button>
					</p>

					<Button class="h-11 w-full" onclick={loginModule.handleVerifyOtp} disabled={loginModule.otp.length !== 4}>
						{#if loginModule.isLoading}
							<LoaderIcon class="mr-2 h-4 w-4 animate-spin" />
						{:else}
							Verify OTP
						{/if}
					</Button>
				</div>
			{/if}
		</div>
	</div>
</div>

