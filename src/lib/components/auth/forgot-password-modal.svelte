<script lang="ts">
	import { LoaderIcon, Mail, X } from '@lucide/svelte'
	import Button from '$lib/components/ui/button/button.svelte'
	import Textbox from '$lib/components/form/textbox.svelte'
	import Modal from '$lib/components/common/modal.svelte'
	import AuthButton from '$lib/components/auth/auth-button.svelte'
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
	class="p-0 max-sm:h-[100dvh] max-sm:w-screen max-sm:!rounded-none"
	hAuto
	wAuto
>
	<!-- Same shell, rhythm and control sizes as the login and signup dialogs. A shopper reaches this
	     one from "Forgot password?" inside the login modal, so a different scale here would read as
	     a different product one click into the same flow. -->
	<div
		class="w-full space-y-5 border bg-card p-5 text-foreground shadow-z-10 max-sm:flex max-sm:min-h-[100dvh] max-sm:flex-col max-sm:pb-[max(1.25rem,env(safe-area-inset-bottom))] max-sm:pt-[max(0.75rem,env(safe-area-inset-top))] sm:w-[380px] sm:rounded-radius sm:p-6"
	>
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
				onclick={closeModal}
			>
				<X class="size-5" />
			</button>
		</div>

		{#if !forgotPasswordModule.success}
			<!-- The header used to stack the store mark and, under it, a 48px tinted circle holding a
			     ShieldCheck. Two badges before the heading, and the shield only restated the copy. -->
			<div>
				<h2 class="text-xl font-semibold">Reset password</h2>
				<p class="mt-1 text-sm text-muted-foreground">Enter your account email and we'll send a reset link.</p>
			</div>

			<form class="space-y-4" onsubmit={(e) => forgotPasswordModule.handleSubmit(e, false)}>
				<div class="[&>div]:mb-0">
					<Textbox
						name="email"
						type="email"
						bind:value={forgotPasswordModule.email}
						placeholder="you@example.com"
						schema={schemas.email}
						label="Email address"
						info="The link expires shortly. If it does not arrive, check your spam folder."
						class="h-11 md:h-10"
						required
					/>
				</div>

				<Button type="submit" class="h-11 w-full text-sm font-semibold md:h-10" disabled={forgotPasswordModule.isLoading}>
					{#if forgotPasswordModule.isLoading}
						<LoaderIcon class="mr-2 size-4 animate-spin" />
						Sending reset link…
					{:else}
						Send reset link
					{/if}
				</Button>

				<!-- One route back, not two. A mobile-only ghost "Login" button used to sit in the header
				     row while this line was hidden below sm, so the same action appeared in two places
				     depending on width instead of once in the same place at every width. -->
				<p class="text-center text-sm text-muted-foreground max-sm:!mt-auto max-sm:pt-6">
					Remembered it?
					<AuthButton
						type="login"
						aria-label="Back to sign in"
						class="inline cursor-pointer font-medium text-foreground underline-offset-4 hover:underline">Sign in</AuthButton
					>
				</p>
			</form>
		{:else}
			<!-- No store mark competing with it here, so this one circle is the only mark on the screen
			     and can carry the moment. The overlaid second badge it used to wear is gone. -->
			<div class="flex flex-col items-center text-center">
				<span class="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
					<Mail class="size-5" />
				</span>
				<h2 class="mt-3 text-xl font-semibold">Check your email</h2>
				<p class="mt-1 text-sm text-muted-foreground">
					We sent a reset link to <span class="font-medium text-foreground">{forgotPasswordModule.email}</span>. It can take a minute to arrive —
					check spam if it does not.
				</p>
			</div>

			<div class="space-y-2 max-sm:!mt-auto max-sm:pt-6">
				<AuthButton type="login" aria-label="Back to sign in" class="block">
					<Button class="h-11 w-full text-sm font-semibold md:h-10">Back to sign in</Button>
				</AuthButton>
				<Button variant="ghost" class="h-11 w-full text-sm md:h-10" onclick={() => (forgotPasswordModule.success = false)}
					>Use a different email</Button
				>
			</div>
		{/if}
	</div>
</Modal>
