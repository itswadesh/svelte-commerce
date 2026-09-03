<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte'
	import Button from '$lib/components/ui/button/button.svelte'
	import Label from '$lib/components/ui/label/label.svelte'
	import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '$lib/components/ui/card'
	import { AlertCircle, ArrowLeft, LoaderIcon } from '@lucide/svelte'
	import AuthButton from '$lib/components/auth/auth-button.svelte'
	import { ResetPasswordModule } from '$lib/core/composables/index.js'

	const resetPasswordModule = new ResetPasswordModule()
	const userState = resetPasswordModule.userState

	// The composable's handleSubmit takes no event, never sets isLoading and never catches, so
	// wrap it here: stop the native GET submit, block double-submits and surface failures inline.
	let submitting = $state(false)
	let error = $state('')

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault()
		if (submitting) return
		submitting = true
		error = ''
		try {
			await resetPasswordModule.handleSubmit()
		} catch (err: any) {
			error = err?.message || 'We could not reset your password. The link may have expired — request a new one.'
		} finally {
			submitting = false
		}
	}
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
			<form onsubmit={handleSubmit}>
				<div class="space-y-4">
					<div class="space-y-2">
						<Label for="password">New Password</Label>
						<Input
							id="password"
							bind:value={resetPasswordModule.password}
							placeholder="********"
							type="password"
							autocomplete="new-password"
							disabled={!!userState.loading}
							class="bg-white text-gray-900 dark:bg-gray-700 dark:text-white"
						/>
					</div>
					<div class="space-y-2">
						<Label for="retypepassword">Confirm Password</Label>
						<Input
							id="retypepassword"
							bind:value={resetPasswordModule.retype}
							placeholder="********"
							type="password"
							autocomplete="new-password"
							disabled={!!userState.loading}
							class="bg-white text-gray-900 dark:bg-gray-700 dark:text-white"
						/>
					</div>
					{#if error || resetPasswordModule.error}
						<div class="flex items-center space-x-2 text-red-600" role="alert">
							<AlertCircle size={16} />
							<span class="text-sm">{error || resetPasswordModule.error}</span>
						</div>
					{/if}
					<Button type="submit" class="w-full" disabled={submitting}>
						{#if submitting}
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
				<!-- This branch runs after the password has actually been reset, not after a link was
				     sent. It told the shopper to check their email and offered to send another link, so a
				     successful reset read as an unfinished one. -->
				<p class="font-medium text-success">Your password has been reset.</p>
				<p class="text-sm text-muted-foreground">You can sign in with your new password now.</p>
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
