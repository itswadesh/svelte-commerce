<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte'
	import Button from '$lib/components/ui/button/button.svelte'
	import { Lock, KeyRound, Eye, EyeOff } from 'lucide-svelte'
	import { ChangePasswordModule } from '$lib/core/composables/use-change-password.svelte'

	const changePasswordModule = new ChangePasswordModule()
</script>

<svelte:head>
	<title>Change Password</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
	<div class="w-full max-w-md transform space-y-6 rounded-xl bg-white p-8 shadow-2xl transition-all dark:bg-gray-800">
		<div class="text-center">
			<div class="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
				<KeyRound class="h-6 w-6 text-primary" />
			</div>
			<h1 class="text-2xl font-bold text-gray-900 dark:text-white">Change Password</h1>
			<p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Please enter your old password and choose a new one</p>
		</div>

		<form class="space-y-4" onsubmit={changePasswordModule.handleSubmit}>
			<div>
				<label for="old" class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Old Password</label>
				<div class="relative">
					<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
						<Lock class="h-5 w-5 text-gray-400" />
					</div>
					<Input
						id="old"
						type={changePasswordModule.showOld ? 'text' : 'password'}
						name="old"
						bind:value={changePasswordModule.old}
						placeholder="Enter your current password"
						required
						class="pl-10 pr-10"
					/>
					<button
						type="button"
						class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
						onclick={() => (changePasswordModule.showOld = !changePasswordModule.showOld)}
					>
						{#if changePasswordModule.showOld}
							<EyeOff class="h-5 w-5" />
						{:else}
							<Eye class="h-5 w-5" />
						{/if}
					</button>
				</div>
				{#if changePasswordModule.errors.old && changePasswordModule.old.length > 0}
					<p class="mt-1 text-sm text-red-500">{changePasswordModule.errors.old}</p>
				{/if}
			</div>

			<div>
				<label for="password" class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
				<div class="relative">
					<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
						<Lock class="h-5 w-5 text-gray-400" />
					</div>
					<Input
						id="password"
						type={changePasswordModule.showNew ? 'text' : 'password'}
						name="password"
						bind:value={changePasswordModule.password}
						placeholder="Enter your new password"
						required
						class="pl-10 pr-10"
					/>
					<button
						type="button"
						class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
						onclick={() => (changePasswordModule.showNew = !changePasswordModule.showNew)}
					>
						{#if changePasswordModule.showNew}
							<EyeOff class="h-5 w-5" />
						{:else}
							<Eye class="h-5 w-5" />
						{/if}
					</button>
				</div>
				{#if changePasswordModule.errors.password && changePasswordModule.password.length > 0}
					<p class="mt-1 text-sm text-red-500">{changePasswordModule.errors.password}</p>
				{/if}
			</div>

			<div>
				<label for="retype" class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm New Password</label>
				<div class="relative">
					<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
						<Lock class="h-5 w-5 text-gray-400" />
					</div>
					<Input
						id="retype"
						type={changePasswordModule.showRetype ? 'text' : 'password'}
						name="retype"
						bind:value={changePasswordModule.retype}
						placeholder="Confirm your new password"
						required
						class="pl-10 pr-10"
					/>
					<button
						type="button"
						class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
						onclick={() => (changePasswordModule.showRetype = !changePasswordModule.showRetype)}
					>
						{#if changePasswordModule.showRetype}
							<EyeOff class="h-5 w-5" />
						{:else}
							<Eye class="h-5 w-5" />
						{/if}
					</button>
				</div>
				{#if changePasswordModule.errors.retype && changePasswordModule.retype.length > 0}
					<p class="mt-1 text-sm text-red-500">{changePasswordModule.errors.retype}</p>
				{/if}
			</div>

			<Button type="submit" class="w-full" disabled={!changePasswordModule.isValid || changePasswordModule.loading}>
				{#if changePasswordModule.loading}
					<div class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
				{/if}
				{changePasswordModule.loading ? 'Changing Password...' : 'Change Password'}
			</Button>
		</form>
	</div>
</div>

