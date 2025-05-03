<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte'
	import Button from '$lib/components/ui/button/button.svelte'
	import Label from '$lib/components/ui/label/label.svelte'
	import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '$lib/components/ui/card'
	import { AlertCircle, ArrowLeft, LoaderIcon } from 'lucide-svelte'
	import AuthButton from '$lib/core/components/auth/auth-button.svelte'
	import { ResetPasswordModule } from '$lib/core/composables/use-reset-password.svelte'

	const resetPasswordModule = new ResetPasswordModule()
	const userState = resetPasswordModule.userState
</script>

<svelte:head>
	<title>Reset Password</title>
</svelte:head>

<Card class="mx-auto w-full max-w-md">
	<CardHeader>
		<CardTitle>Reset Password</CardTitle>
		<CardDescription>Enter your new password to set.</CardDescription>
	</CardHeader>
	<CardContent>
		{#if !resetPasswordModule.success}
			<form onsubmit={resetPasswordModule.handleSubmit}>
				<div class="space-y-4">
					<div class="space-y-2">
						<Label for="password">New Password</Label>
						<Input
							id="password"
							bind:value={resetPasswordModule.password}
							placeholder="********"
							type="password"
							disabled={!!userState.loading}
							class="bg-white text-gray-900 dark:bg-gray-700 dark:text-white"
						/>
					</div>
					<div class="space-y-2">
						<Label for="password">Confirm Password</Label>
						<Input
							id="retypepassword"
							bind:value={resetPasswordModule.retype}
							placeholder="********"
							type="password"
							disabled={!!userState.loading}
							class="bg-white text-gray-900 dark:bg-gray-700 dark:text-white"
						/>
					</div>
					{#if resetPasswordModule.error}
						<div class="flex items-center space-x-2 text-red-600" role="alert">
							<AlertCircle size={16} />
							<span class="text-sm">{resetPasswordModule.error}</span>
						</div>
					{/if}
					<Button type="submit" class="w-full" disabled={resetPasswordModule.isLoading}>
						{#if resetPasswordModule.isLoading}
							<LoaderIcon class="mr-2 h-4 w-4 animate-spin" />
							Loading...
						{:else}
							Reset Password
						{/if}
					</Button>
				</div>
			</form>
		{:else}
			<div class="space-y-4 text-center">
				<p class="text-green-600">Password reset link sent! Check your email.</p>
				<Button variant="outline" class="w-full" onclick={() => (resetPasswordModule.success = false)}>Send another link</Button>
			</div>
		{/if}
	</CardContent>
	<CardFooter>
		<AuthButton type="login">
			<button class="flex items-center text-sm text-muted-foreground hover:text-primary">
				<ArrowLeft size={16} class="mr-2" />
				Back to Login
			</button>
		</AuthButton>
	</CardFooter>
</Card>
