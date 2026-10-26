<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte'
	import { goto } from '$app/navigation'
</script>

<svelte:head>
	<title>Signup Successful</title>
</svelte:head>
<div class="flex min-h-[70vh] items-center justify-center">
	<div class="border w-full max-w-md space-y-8 rounded-lg bg-card p-6 text-center">
		<div class="space-y-4">
			<h1 class="text-2xl font-bold text-foreground">Application Submitted Successfully!</h1>

			<div class="space-y-2">
				<p class="text-lg text-muted-foreground">Thank you for your interest!</p>
				<p class="text-xs text-muted-foreground">
					Your application has been received. Our onboarding team will contact you within 48 working hours to proceed with the verification process.
				</p>
			</div>

			<div class="pt-4">
				<Button class="w-full" onclick={() => goto('/')}>Back to Home</Button>
			</div>
		</div>
	</div>
</div>
