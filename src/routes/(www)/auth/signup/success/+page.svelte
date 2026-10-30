<script lang="ts">
	import { goto } from '$app/navigation'
	import { page } from '$app/state'
	import AuthButton from '$lib/components/auth/auth-button.svelte'
	import { onMount } from 'svelte'

	// The sign-up form hands the address over in the navigation's state, never the URL: every
	// analytics tag records the URL, and the history keeps it. A reload or a link from elsewhere has
	// none, and the page then speaks to the shopper without it.
	const email = $derived(page.state.signupEmail ?? '')

	// An address an older link still carries leaves the address bar at once.
	onMount(() => {
		if (!page.url.searchParams.has('email')) return
		const url = new URL(location.href)
		url.searchParams.delete('email')
		history.replaceState(history.state, '', url)
	})
</script>

<svelte:head>
	<title>Signup Success - {page?.data?.store?.name || ''}</title>
	<meta name="description" content="Thank you for signing up! Please verify your email to complete registration." />
</svelte:head>

<div class="flex justify-center bg-background px-4 py-8 sm:py-16">
	<div class="border w-full max-w-md space-y-8 rounded-lg bg-card p-8 text-center">
		<div class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
			<svg
				class="h-10 w-10 text-success"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
			</svg>
		</div>

		<div class="space-y-4">
			<h1 class="page-heading">Welcome aboard!</h1>
			<!-- break-words: an address is one long word, and pushed the page wider than a phone. -->
			<p class="break-words text-lg text-muted-foreground">
				{#if email}Hi {email}, thank{:else}Thank{/if} you for creating an account with {page?.data?.store?.name}. Please verify your
				email to complete registration.
			</p>
		</div>

		<div class="rounded-lg bg-primary/10 p-6">
			<h2 class="mb-4 text-xl font-semibold text-primary">Verify your email</h2>
			<p class="break-words text-primary">
				{#if email}
					We've sent a verification link to <span class="font-medium">{email}</span>
				{:else}
					We've sent a verification link to your email address.
				{/if}
			</p>
			<p class="mt-2 text-sm text-primary">Please check your inbox and click the link to activate your account.</p>
		</div>

		<div class="space-y-4 pt-4">
			<p class="text-sm text-muted-foreground">
				Didn't receive the email? Check your spam folder
				<!-- or <button
					class="font-medium text-primary hover:text-primary"
					on:click={() => {
						// Add resend verification email logic here
						toast.success('Verification email resent!')
					}}
				>
					click here to resend
				</button> -->
			</p>

			<div class="space-y-2">
					<button
            onclick={() => goto('/')}
						class="inline-block w-full rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-medium text-primary-foreground hover:bg-primary-hover"
					>
						Continue shopping
					</button>
				<!-- <a
					href="/"
					class="inline-block w-full rounded-lg border border-border-strong px-4 py-2.5 text-center text-sm font-medium text-foreground hover:bg-muted"
				>
					Return to home
				</a> -->
			</div>
		</div>
	</div>
</div>
