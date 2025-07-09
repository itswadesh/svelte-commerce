<script lang="ts">
	import { CheckCircle2 } from 'lucide-svelte'
  import { page } from '$app/state'
	import { Button } from '$lib/components/ui/button'
	import { goto } from '$app/navigation'
	const enquiryPlugin = $derived(page.data?.store?.plugins?.enquiryMode)
</script>

<svelte:head>
	<title>Enquiry Submitted Successfully</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 py-12">
	<div class="container mx-auto max-w-3xl px-4">
		<div class="rounded-lg bg-white p-6 shadow-lg md:p-8">
			<!-- Success Header -->
			<div class="mb-8 text-center">
				<div class="mb-4 flex justify-center">
					<div class="rounded-full bg-green-100 p-3">
						<CheckCircle2 class="h-12 w-12 text-green-500" />
					</div>
				</div>
				<h1 class="mb-2 text-2xl font-bold text-gray-900 md:text-3xl">{enquiryPlugin?.successHeader || "Thank You For Your Enquiry!"}</h1>
				<p class="text-gray-600">{ enquiryPlugin?.successMessage || "We will get back to you soon!" }</p>
        <Button class="mt-5" onclick={() => goto('/products')}> Continue Shopping </Button>
			</div>
		</div>
	</div>
</div>

