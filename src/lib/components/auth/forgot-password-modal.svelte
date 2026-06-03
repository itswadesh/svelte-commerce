<script lang="ts">
	import { LoaderIcon, Mail, X } from '@lucide/svelte'
	import Button from '$lib/components/ui/button/button.svelte'
	import Textbox from '$lib/components/form/textbox.svelte'
	import Modal from '$lib/components/common/modal.svelte'
	import { AuthButton } from '$lib/core/components/index.js'
	import { ForgotPasswordModule, forgotPasswordSchema as schemas } from '$lib/core/composables/index.js'

	import { page } from '$app/state'

	let { show = $bindable() } = $props()

	const forgotPasswordModule = new ForgotPasswordModule()
</script>

<svelte:head>
	<title>Forgot Password</title>
</svelte:head>
<Modal {show} rounded={false} hideHeader hideFooter useMaxHeight class="p-0 max-sm:h-screen max-sm:w-screen max-sm:!rounded-none" hAuto wAuto>
	{#if !forgotPasswordModule.success}
		<div
			class="w-full transform space-y-6 border border-gray-100/50 bg-white/70 p-6 shadow-2xl backdrop-blur-xl transition-all dark:border-gray-700/50 dark:bg-gray-900/80 sm:max-w-[480px] sm:rounded-2xl sm:p-8 ring-1 ring-white/20 dark:ring-white/5"
		>
			<!-- Close Icon -->
			<div class="sticky top-3 z-50 flex items-center justify-end sm:absolute sm:right-5 sm:top-5">
				<button
					aria-label="Close modal button"
					class="rounded-full bg-gray-100/50 p-2 text-gray-600 transition-all hover:bg-gray-200 hover:text-gray-900 dark:bg-gray-800/50 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
					onclick={() => {
						show = false
						forgotPasswordModule.removeUrlParams()
					}}
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
					<h1 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Forgot Password?</h1>
					<p class="text-sm font-medium text-gray-500 dark:text-gray-400">Enter your email to receive reset instructions</p>
				</div>
			</div>

			<form class="space-y-4" onsubmit={(e) => forgotPasswordModule.handleSubmit(e, false)}>
				<Textbox
					name="email"
					type="email"
					bind:value={forgotPasswordModule.email}
					placeholder="swadesh@litekart.in"
					schema={schemas.email}
					label="Email"
					class="h-12"
					required
				/>

				<Button
					type="submit"
					class="mt-2 h-12 w-full text-wrap px-4 py-2 text-base font-medium shadow-md transition-transform hover:scale-[1.02] active:scale-[0.98]"
					disabled={forgotPasswordModule.isLoading}
				>
					{#if forgotPasswordModule.isLoading}
						<LoaderIcon class="mr-2 h-5 w-5 animate-spin" />
					{/if}
					Send Reset Link
				</Button>
			</form>

			<div class="relative py-2">
				<div class="absolute inset-0 flex items-center">
					<div class="w-full border-t border-gray-200 dark:border-gray-700"></div>
				</div>
				<div class="relative flex justify-center text-sm">
					<span class="bg-white px-2 text-gray-500 dark:bg-gray-900 dark:text-gray-400">or</span>
				</div>
			</div>

			<div class="text-center">
				<AuthButton type="login">
					<Button variant="link" class="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
						<svg xmlns="http://www.w3.org/2000/svg" class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
						</svg>
						Back to Login
					</Button>
				</AuthButton>
			</div>
		</div>
	{:else}
		<div class="flex-col items-center justify-center p-4">
			<div class="w-full space-y-6 text-center">
				<div class="flex flex-col items-center space-y-4">
					<div class="rounded-full bg-gray-100 p-3">
						<Mail class="h-6 w-6 text-gray-600" />
					</div>
					<div class="space-y-2">
						<h1 class="text-2xl font-bold tracking-tight">Check your email</h1>
						<p class="max-w-sm text-gray-500">
							We've sent you a password reset link. Please check your email and follow the instructions to reset your password.
						</p>
					</div>
				</div>

				<div class="space-y-4">
					<AuthButton type="login">
						<Button variant="outline" class="w-full">Back to Login</Button>
					</AuthButton>
				</div>
			</div>
		</div>
	{/if}
</Modal>
