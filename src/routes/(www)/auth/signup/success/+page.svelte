<script lang="ts">
	import { page } from '$app/state'
	import AuthButton from '$lib/core/components/auth/auth-button.svelte'
</script>

<svelte:head>
	<title>Signup Success - {page?.data?.store?.name || ''}</title>
	<meta name="description" content="Thank you for signing up! Please verify your email to complete registration." />
</svelte:head>

<main class="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-white p-4 dark:from-gray-900 dark:to-gray-800">
	<div class="w-full max-w-md space-y-8 rounded-lg bg-white/80 p-8 text-center shadow-xl backdrop-blur-sm dark:bg-gray-800/90">
		<div class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
			<svg
				class="h-10 w-10 text-green-600 dark:text-green-400"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
			</svg>
		</div>

		<div class="space-y-4">
			<h1 class="text-3xl font-bold text-gray-900 dark:text-white">Welcome aboard!</h1>
			<p class="text-lg text-gray-600 dark:text-gray-300">
				Hi {page.url.searchParams.get('email')}, Thank you for creating an account with {page?.data?.store?.name}. Please verify your email to
				complete registration.
			</p>
		</div>

		<div class="rounded-lg bg-blue-50 p-6 dark:bg-blue-900/20">
			<h2 class="mb-4 text-xl font-semibold text-blue-900 dark:text-blue-100">Verify your email</h2>
			<p class="text-blue-700 dark:text-blue-200">
				We've sent a verification link to <span class="font-medium">{page.url.searchParams.get('email')}</span>
			</p>
			<p class="mt-2 text-sm text-blue-600 dark:text-blue-300">Please check your inbox and click the link to activate your account.</p>
		</div>

		<div class="space-y-4 pt-4">
			<p class="text-sm text-gray-500 dark:text-gray-400">
				Didn't receive the email? Check your spam folder
				<!-- or <button
					class="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
					on:click={() => {
						// Add resend verification email logic here
						toast.success('Verification email resent!')
					}}
				>
					click here to resend
				</button> -->
			</p>

			<div class="space-y-2">
				<AuthButton type="login" extraqueries={{ redirect: '/' }}>
					<button
						class="inline-block w-full rounded-lg bg-gray-900 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
					>
						Continue to Login
					</button>
				</AuthButton>
				<!-- <a
					href="/"
					class="inline-block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-center text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
				>
					Return to Home
				</a> -->
			</div>
		</div>
	</div>
</main>
