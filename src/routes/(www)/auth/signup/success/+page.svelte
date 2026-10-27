<script lang="ts">
	import { goto } from '$app/navigation'
	import { page } from '$app/state'
	import AuthButton from '$lib/components/auth/auth-button.svelte'
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
			<p class="text-lg text-muted-foreground">
				Hi {page.url.searchParams.get('email')}, Thank you for creating an account with {page?.data?.store?.name}. Please verify your email to
				complete registration.
			</p>
		</div>

		<div class="rounded-lg bg-primary/10 p-6">
			<h2 class="mb-4 text-xl font-semibold text-primary">Verify your email</h2>
			<p class="text-primary">
				We've sent a verification link to <span class="font-medium">{page.url.searchParams.get('email')}</span>
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
