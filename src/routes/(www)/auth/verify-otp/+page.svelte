<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte'
	import Button from '$lib/components/ui/button/button.svelte'
	import { toast } from 'svelte-sonner'
	import { goto } from '$app/navigation'
	import { onMount } from 'svelte'
	import { userService } from '$lib/core/services'
	let otp: any = ''
	const handleSubmit = () => {
		toast.info('OTP Verification Success')
		goto('/reset-password')
	}

	const mount = async () => {
		try {
			let me = await userService.getMe()
			if (me.id) {
				goto('/')
			}
		} catch (e: any) {
			console.log('This is error:', e)
		}
	}
	$effect(() => {
		mount()
	})
	// onMount()
</script>

<svelte:head>
	<title>Verify Otp</title>
</svelte:head>
<div class="flex min-h-screen items-center justify-center">
	<div class="w-full max-w-md transform space-y-6 rounded-xl bg-white p-8 shadow-2xl transition-all dark:bg-gray-800">
		<form class="w-full space-y-4">
			<div>
				<label for="otp" class="text-gray-700 dark:text-gray-300">Enter OTP:</label>
				<Input
					id="otp"
					type="otp"
					name="otp"
					bind:value={otp}
					placeholder="Enter your otp"
					required
					class="mt-1 block w-full rounded-md border px-3  py-2 shadow-sm focus:outline-none  sm:text-sm"
				/>
			</div>
			<br />
			<a href="/verify-otp">Resend OTP</a>
		</form>
		<Button
			onclick={handleSubmit}
			type="submit"
			class="flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium shadow-sm  focus:outline-none focus:ring-2 focus:ring-offset-2 "
		>
			Verify OTP
		</Button>
	</div>
</div>
s
