<script lang="ts">
import { LoaderIcon, X } from 'lucide-svelte'
import * as InputOTP from '$lib/components/ui/input-otp/index'
import Button from '$lib/components/ui/button/button.svelte'
import { Label } from '$lib/components/ui/label'
import { env } from '$env/dynamic/public'
import Textbox from '$lib/components/form/textbox.svelte'
import Modal from '../common/modal.svelte'
import { page } from '$app/state'
import AuthButton from '$lib/core/components/auth/auth-button.svelte'
import { LoginModule, schemas } from '$lib/core/composables/use-login.svelte'
import { PUBLIC_LOGIN_TYPE } from '$env/static/public'

let { show = $bindable(false) } = $props()

const loginModule = new LoginModule()
const userState = loginModule.userState
</script>

<Modal {show} rounded={false} hideHeader hideFooter useMaxHeight class="p-0 max-sm:h-screen max-sm:w-screen max-sm:!rounded-none" hAuto wAuto>
	<div
		class="w-full transform space-y-8 border border-gray-100 bg-white/80 p-8 shadow-lg backdrop-blur-sm transition-all dark:border-gray-700 dark:bg-gray-800/90 sm:max-w-md sm:rounded-2xl"
	>
		<!-- Close Icon -->
		<div class="sticky top-3 flex items-center justify-end sm:absolute sm:right-4 sm:top-4">
			<button
				aria-label="Close modal button"
				class="bg-white p-2"
				onclick={() => {
					show = false
					loginModule.removeUrlParams()
				}}
			>
				<X class="h-6 w-6 text-gray-700 dark:text-gray-300" />
			</button>
		</div>

		{#if loginModule.step === 1}
			<div class="space-y-4 text-center">
				<h1 class="text-3xl font-bold text-gray-900 dark:text-white">Login</h1>
				<p class="mt-2 text-xs text-gray-600 dark:text-gray-400">{page?.data?.store?.name}</p>
			</div>
			<form
				onsubmit={async (e) => {
					const success = await loginModule.handleSubmit(e)
					if (success) show = false
				}}
				class="flex flex-col space-y-4"
			>
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
							placeholder={loginModule.isPhoneNumber ? '+91234567890' : 'johndoe@gmail.com'}
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
					<div class="flex items-center justify-between gap-2">
						<div>
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
						</div>
						<div class="flex items-center justify-end">
							<AuthButton type="forgot-password" extraqueries={{ email: loginModule.identifier }}>
								<Button variant="link" class="-mr-4 text-sm text-gray-600 hover:text-gray-500">Forgot password?</Button>
							</AuthButton>
						</div>
					</div>
				{/if}

				<Button type="submit" class="h-11 w-full text-sm font-medium" disabled={userState.loading || loginModule.isLoading}>
					{#if userState.loading || (loginModule.isLoading && loginModule.isPhoneNumber)}
						<LoaderIcon class="mr-2 h-4 w-4 animate-spin" />
						Sending OTP...
					{:else if userState.loading && !loginModule.isPhoneNumber}
						<LoaderIcon class="mr-2 h-4 w-4 animate-spin" />
						Signing in...
					{:else}
						{loginModule.isPhoneNumber ? 'Send OTP' : 'Sign In'}
					{/if}
				</Button>

				{#if loginModule.showSignupButton && PUBLIC_LOGIN_TYPE !== 'PHONE'}
					<div class="space-y-4 text-center">
						<p class="text-sm text-gray-500">New to {page?.data?.store?.name}?</p>
						<AuthButton
							type="signup"
							class="inline-block w-full rounded-lg bg-gray-50 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 dark:bg-gray-900/20 dark:hover:bg-gray-900/30"
						>
							Create an account
						</AuthButton>
					</div>
				{/if}

				<p class="text-center text-xs text-gray-500 dark:text-gray-400">
					By continuing, you are accepting our
					<a href="/terms-and-conditions" target="_blank" class="text-gray-600 hover:underline">Terms & Conditions</a>
				</p>

				{#if page?.data?.store?.plugins?.isMultiVendor?.active}
					<Button class="self-center" type="button" variant="link" onclick={() => (show = false)} href="/auth/join-as-vendor">Join as a Vendor</Button
					>
				{/if}
			</form>
		{:else if loginModule.step === 2}
			<!-- Keep OTP section styling consistent -->
			<div class="space-y-6">
				<div class="text-center">
					<h2 class="text-2xl font-bold text-gray-900 dark:text-white">Enter OTP</h2>
					<p class="mt-2 text-xs text-gray-600 dark:text-gray-400">Enter the OTP code sent to your phone number.</p>
				</div>
				<div class="flex justify-center gap-2">
					<InputOTP.Root maxlength={4} pattern="\d*" bind:value={loginModule.otp}>
						{#snippet children({ cells })}
							<InputOTP.Group>
								{#each cells as cell}
									<InputOTP.Slot {cell} class="border-gray-300 dark:border-gray-600" />
								{/each}
							</InputOTP.Group>
						{/snippet}
					</InputOTP.Root>
				</div>
				<input type="hidden" name="otp" bind:value={loginModule.otp} />
				<p class="text-center text-sm">
					Didn't receive the OTP?{' '}
					<button type="button" class="text-gray-600 hover:underline" onclick={() => (loginModule.step = 1)}> Resend OTP </button>
				</p>

				<Button class="h-11 w-full" onclick={loginModule.handleVerifyOtp}>
					{#if userState.loading}
						<LoaderIcon class="mr-2 h-4 w-4 animate-spin" />
					{:else}
						Verify OTP
					{/if}
				</Button>
			</div>
		{/if}
	</div>
</Modal>
