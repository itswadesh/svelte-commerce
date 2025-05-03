<script lang="ts">
	import AuthButton from '$lib/core/components/auth/auth-button.svelte'
	import { Button } from '$lib/components/ui/button'
	let { data } = $props()
</script>

<svelte:head>
	<title>Email Verification Successful</title>
</svelte:head>

{#if data.status === 'success'}
	<div class="flex min-h-[70vh] items-center justify-center px-4">
		<div class="w-full max-w-md space-y-6 text-center">
			<div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 p-3">
				<svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
				</svg>
			</div>

			<div class="space-y-4">
				<h1 class="text-2xl font-bold text-gray-900 md:text-3xl">Email Verification Successful!</h1>
				<p class="text-gray-600">Thank you for verifying your email. you can now login into your account and start shopping!.</p>
			</div>

			<div class="pt-4">
				<AuthButton type="login" extraqueries={{ redirect: '/' }}>
					<Button variant="default" class="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600">Log in</Button>
				</AuthButton>
			</div>
		</div>
	</div>
{:else}
	<div class="flex min-h-[70vh] items-center justify-center px-4">
		<div class="w-full max-w-md space-y-6 text-center">
			<div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 p-3">
				<svg class="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</div>

			<div class="space-y-4">
				<h1 class="text-2xl font-bold text-gray-900 md:text-3xl">Email Verification Failed!</h1>
				<p class="text-gray-600">The link you clicked is invalid or expired. Please try again.</p>
			</div>

			<div class="pt-4">
				<AuthButton type="login" extraqueries={{ redirect: '/' }}>
					<Button variant="default" class="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600">Log in</Button>
				</AuthButton>
			</div>
		</div>
	</div>
{/if}
