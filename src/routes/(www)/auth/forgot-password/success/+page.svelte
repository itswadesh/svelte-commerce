<script lang="ts">
	import { Button } from '$lib/components/ui/button'
	import { Mail } from 'lucide-svelte'
	import AuthButton from '$lib/core/components/auth/auth-button.svelte'
</script>

<svelte:head>
	<title>Forgot Password</title>
</svelte:head>
<div class="container mx-auto flex min-h-[calc(100vh-4rem)] max-w-lg flex-col items-center justify-center px-4">
	<div class="w-full space-y-6 text-center">
		<div class="flex flex-col items-center space-y-4">
			<div class="rounded-full bg-gray-100 p-3">
				<Mail class="h-6 w-6 text-gray-600" />
			</div>
			<div class="space-y-2">
				<h1 class="text-2xl font-bold tracking-tight">Check your email</h1>
				<p class="text-gray-500">We've sent you a password reset link. Please check your email and follow the instructions to reset your password.</p>
			</div>
		</div>

		<div class="space-y-4">
			<AuthButton type="login">
				<Button variant="outline" class="w-full">Back to Login</Button>
			</AuthButton>
		</div>
	</div>
</div>
