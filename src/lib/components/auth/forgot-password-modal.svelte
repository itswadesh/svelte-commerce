<script lang="ts">
	import { ArrowLeft, CheckCircle2, LoaderIcon, Mail, ShieldCheck, X } from '@lucide/svelte'
	import Button from '$lib/components/ui/button/button.svelte'
	import Textbox from '$lib/components/form/textbox.svelte'
	import Modal from '$lib/components/common/modal.svelte'
	import { AuthButton } from '$lib/core/components/index.js'
	import { ForgotPasswordModule, forgotPasswordSchema as schemas } from '$lib/core/composables/index.js'

	import { page } from '$app/state'

	let { show = $bindable(), manageHistory = true } = $props()

	const forgotPasswordModule = new ForgotPasswordModule()

	function closeModal() {
		show = false
		forgotPasswordModule.success = false
		forgotPasswordModule.removeUrlParams()
	}
</script>

<svelte:head>
	<title>Forgot Password</title>
</svelte:head>
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
	{#if !forgotPasswordModule.success}
		<div
			class="w-full transform space-y-6 border border-gray-100/50 bg-white p-6 shadow-2xl ring-1 ring-white/20 transition-all dark:border-gray-700 dark:bg-gray-900 dark:ring-white/5 max-sm:min-h-[100dvh] max-sm:px-5 max-sm:pb-[max(1.5rem,env(safe-area-inset-bottom))] max-sm:pt-[max(1rem,env(safe-area-inset-top))] sm:max-w-[480px] sm:rounded-radius sm:p-8"
		>
			<!-- Close Icon -->
			<div class="z-50 flex min-h-11 items-center justify-between sm:absolute sm:right-5 sm:top-5 sm:justify-end">
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

			<div class="flex flex-col items-center space-y-3 pb-1 text-center max-sm:pt-5">
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
						<ShieldCheck class="h-6 w-6" />
					</div>
					<h1 class="text-3xl font-bold tracking-tight text-gray-950 dark:text-white">Reset password</h1>
					<p class="mx-auto max-w-[31ch] text-sm leading-6 text-gray-600 dark:text-gray-300">
						Enter your account email and we’ll send a secure reset link.
					</p>
				</div>
			</div>

			<form class="space-y-5 max-sm:pt-2" onsubmit={(e) => forgotPasswordModule.handleSubmit(e, false)}>
				<Textbox
					name="email"
					type="email"
					bind:value={forgotPasswordModule.email}
					placeholder="you@example.com"
					schema={schemas.email}
					label="Email address"
					class="h-14 text-base"
					required
				/>

				<Button
					type="submit"
					class="h-14 w-full text-wrap px-4 py-2 text-base font-semibold shadow-sm transition-colors"
					disabled={forgotPasswordModule.isLoading}
				>
					{#if forgotPasswordModule.isLoading}
						<LoaderIcon class="mr-2 h-5 w-5 animate-spin" />
						Sending reset link...
					{:else}
						Send reset link
					{/if}
				</Button>
			</form>

			<div
				class="rounded-radius bg-gray-50 p-3 text-sm leading-5 text-gray-600 ring-1 ring-gray-100 dark:bg-gray-800/70 dark:text-gray-300 dark:ring-gray-700"
			>
				For your security, the reset link may expire after a short time. Check spam if it doesn’t arrive.
			</div>

			<div class="hidden text-center sm:block">
				<AuthButton type="login">
					<Button
						variant="link"
						class="inline-flex min-h-11 items-center text-sm font-semibold text-gray-600 hover:text-gray-950 dark:text-gray-300 dark:hover:text-white"
					>
						<ArrowLeft class="mr-2 h-4 w-4" />
						Back to login
					</Button>
				</AuthButton>
			</div>
		</div>
	{:else}
		<div
			class="w-full transform space-y-6 border border-gray-100/50 bg-white p-6 shadow-2xl ring-1 ring-white/20 transition-all dark:border-gray-700 dark:bg-gray-900 dark:ring-white/5 max-sm:flex max-sm:min-h-[100dvh] max-sm:flex-col max-sm:justify-center max-sm:px-5 max-sm:pb-[max(1.5rem,env(safe-area-inset-bottom))] max-sm:pt-[max(1rem,env(safe-area-inset-top))] sm:max-w-[480px] sm:rounded-radius sm:p-8"
		>
			<div class="z-50 flex min-h-11 items-center justify-end sm:absolute sm:right-5 sm:top-5">
				<button
					aria-label="Close modal button"
					class="inline-flex h-11 w-11 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
					onclick={closeModal}
				>
					<X class="h-5 w-5" />
				</button>
			</div>

			<div class="w-full space-y-6 text-center">
				<div class="flex flex-col items-center space-y-4">
					<div class="relative flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/20">
						<Mail class="h-7 w-7" />
						<span class="absolute -right-1 -top-1 rounded-full bg-white text-primary shadow-sm dark:bg-gray-900">
							<CheckCircle2 class="h-6 w-6" />
						</span>
					</div>
					<div class="space-y-2">
						<h1 class="text-3xl font-bold tracking-tight text-gray-950 dark:text-white">Check your email</h1>
						<p class="mx-auto max-w-[33ch] text-sm leading-6 text-gray-600 dark:text-gray-300">
							We sent a password reset link to
							<span class="font-semibold text-gray-950 dark:text-white">{forgotPasswordModule.email}</span>.
						</p>
					</div>
				</div>

				<div
					class="rounded-radius bg-gray-50 p-3 text-sm leading-5 text-gray-600 ring-1 ring-gray-100 dark:bg-gray-800/70 dark:text-gray-300 dark:ring-gray-700"
				>
					The link may take a minute to arrive. If you don’t see it, check spam or try again.
				</div>

				<div class="space-y-3">
					<AuthButton type="login">
						<Button class="h-12 w-full text-base font-semibold">Back to login</Button>
					</AuthButton>
					<Button variant="ghost" class="min-h-11 w-full text-sm font-semibold" onclick={() => (forgotPasswordModule.success = false)}>
						Use a different email
					</Button>
				</div>
			</div>
		</div>
	{/if}
</Modal>
