<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte'
	import Button from '$lib/components/ui/button/button.svelte'
	import { ChangePasswordModule } from '$lib/core/composables/index.js'
	import { Lock, KeyRound, Eye, EyeOff } from '@lucide/svelte'

	const changePasswordModule = new ChangePasswordModule()

	// Each message was a sibling paragraph painted red and nothing else: the input never carried
	// `aria-invalid`, nothing pointed at the text, and colour was the only signal. A screen-reader
	// user who typed a short password heard nothing and could not find out why the form would not
	// proceed. One stable id per field ties the three together.
	const oldInvalid = $derived(!!changePasswordModule.errors.old && changePasswordModule.old.length > 0)
	const passwordInvalid = $derived(!!changePasswordModule.errors.password && changePasswordModule.password.length > 0)
	const retypeInvalid = $derived(!!changePasswordModule.errors.retype && changePasswordModule.retype.length > 0)
</script>

<svelte:head>
	<title>Change password</title>
</svelte:head>

<div class="flex justify-center bg-background px-4 py-8 sm:py-16">
	<div class="border w-full max-w-md transform space-y-6 rounded-xl bg-card p-8 transition-all">
		<div class="text-center">
			<div class="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
				<KeyRound class="h-6 w-6 text-primary" />
			</div>
			<h1 class="page-heading">Change password</h1>
			<p class="mt-2 text-sm text-muted-foreground">Please enter your old password and choose a new one</p>
		</div>

		<form
			class="space-y-4"
			onsubmit={(e) => {
				// The composable's handler takes no event, so stop the native GET submit here —
				// otherwise the passwords end up in the URL, history and referrer.
				e.preventDefault()
				changePasswordModule.handleSubmit()
			}}
		>
			<div>
				<label for="old" class="mb-2 block text-sm font-medium text-foreground">Old password</label>
				<div class="relative">
					<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
						<Lock class="h-5 w-5 text-muted-foreground" />
					</div>
					<Input
						id="old"
						type={changePasswordModule.showOld ? 'text' : 'password'}
						name="old"
						autocomplete="current-password"
						bind:value={changePasswordModule.old}
						placeholder="Enter your current password"
						required
						aria-invalid={oldInvalid ? 'true' : undefined}
						aria-describedby={oldInvalid ? 'old-error' : undefined}
						class="pl-10 pr-12 {oldInvalid ? 'border-destructive focus-visible:ring-destructive' : ''}"
					/>
					<button
						type="button"
						aria-label={changePasswordModule.showOld ? 'Hide current password' : 'Show current password'}
						aria-pressed={changePasswordModule.showOld}
						class="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted-foreground hover:text-foreground"
						onclick={() => (changePasswordModule.showOld = !changePasswordModule.showOld)}
					>
						{#if changePasswordModule.showOld}
							<EyeOff class="h-5 w-5" />
						{:else}
							<Eye class="h-5 w-5" />
						{/if}
					</button>
				</div>
				{#if oldInvalid}
					<p id="old-error" class="mt-1 text-sm text-destructive">{changePasswordModule.errors.old}</p>
				{/if}
			</div>

			<div>
				<label for="password" class="mb-2 block text-sm font-medium text-foreground">New password</label>
				<div class="relative">
					<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
						<Lock class="h-5 w-5 text-muted-foreground" />
					</div>
					<Input
						id="password"
						type={changePasswordModule.showNew ? 'text' : 'password'}
						name="password"
						autocomplete="new-password"
						bind:value={changePasswordModule.password}
						placeholder="Enter your new password"
						required
						aria-invalid={passwordInvalid ? 'true' : undefined}
						aria-describedby={passwordInvalid ? 'password-error' : undefined}
						class="pl-10 pr-12 {passwordInvalid ? 'border-destructive focus-visible:ring-destructive' : ''}"
					/>
					<button
						type="button"
						aria-label={changePasswordModule.showNew ? 'Hide new password' : 'Show new password'}
						aria-pressed={changePasswordModule.showNew}
						class="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted-foreground hover:text-foreground"
						onclick={() => (changePasswordModule.showNew = !changePasswordModule.showNew)}
					>
						{#if changePasswordModule.showNew}
							<EyeOff class="h-5 w-5" />
						{:else}
							<Eye class="h-5 w-5" />
						{/if}
					</button>
				</div>
				{#if passwordInvalid}
					<p id="password-error" class="mt-1 text-sm text-destructive">{changePasswordModule.errors.password}</p>
				{/if}
			</div>

			<div>
				<label for="retype" class="mb-2 block text-sm font-medium text-foreground">Confirm new password</label>
				<div class="relative">
					<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
						<Lock class="h-5 w-5 text-muted-foreground" />
					</div>
					<Input
						id="retype"
						type={changePasswordModule.showRetype ? 'text' : 'password'}
						name="retype"
						autocomplete="new-password"
						bind:value={changePasswordModule.retype}
						placeholder="Confirm your new password"
						required
						aria-invalid={retypeInvalid ? 'true' : undefined}
						aria-describedby={retypeInvalid ? 'retype-error' : undefined}
						class="pl-10 pr-12 {retypeInvalid ? 'border-destructive focus-visible:ring-destructive' : ''}"
					/>
					<button
						type="button"
						aria-label={changePasswordModule.showRetype ? 'Hide confirmed password' : 'Show confirmed password'}
						aria-pressed={changePasswordModule.showRetype}
						class="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted-foreground hover:text-foreground"
						onclick={() => (changePasswordModule.showRetype = !changePasswordModule.showRetype)}
					>
						{#if changePasswordModule.showRetype}
							<EyeOff class="h-5 w-5" />
						{:else}
							<Eye class="h-5 w-5" />
						{/if}
					</button>
				</div>
				{#if retypeInvalid}
					<p id="retype-error" class="mt-1 text-sm text-destructive">{changePasswordModule.errors.retype}</p>
				{/if}
			</div>

			<Button type="submit" class="w-full" disabled={!changePasswordModule.isValid || changePasswordModule.loading}>
				{#if changePasswordModule.loading}
					<div class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
				{/if}
				{changePasswordModule.loading ? 'Changing Password...' : 'Change password'}
			</Button>
		</form>
	</div>
</div>
