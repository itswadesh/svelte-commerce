<script lang="ts">
	import { showAuthModal } from '$lib/core/components/auth/auth-utils'
	import { Button } from '$lib/components/ui/button'
	import { CheckCircle2 } from 'lucide-svelte'
</script>

<div class="flex min-h-screen w-full items-center justify-center">
	<div class="mx-auto w-full max-w-md p-4">
		<div class="mb-8 text-center">
			<div class="mb-4 flex justify-center">
				<CheckCircle2 class="h-16 w-16 text-green-500" />
			</div>
			<h1 class="mb-2 text-2xl font-bold">Password Changed Successfully!</h1>
			<p class="text-sm text-gray-600">Your password has been updated. You can now log in with your new password.</p>
		</div>

		<div class="flex justify-center">
			<Button
				class="w-full"
				onclick={() => {
					showAuthModal('login')
				}}
			>
				Go to Login
			</Button>
		</div>
	</div>
</div>
