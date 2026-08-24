<script lang="ts">
	import AuthButton from '$lib/components/auth/auth-button.svelte'
	import { Button } from '$lib/components/ui/button/index.js'
	import { onMount } from 'svelte'
	import { page } from '$app/state'
	import { authService } from '@misiki/kitcommerce-core/services'
	import { LoaderCircle } from '@lucide/svelte'
	import { getUserState } from '@misiki/kitcommerce-core/stores'
	import { goto } from '$app/navigation'

  let status = $state<"loading" | "success" | "failed">("loading")
  let failureReason = $state('')
  const userState = getUserState()

  onMount(async () => {
	  try {
      status = "loading"
	  	// Only the token is required. Litekart's verification links carry the address too, but
	  	// Vendure's carry `?token=` alone (its `verifyCustomerAccount` mutation takes just the token),
	  	// and demanding an email here rejected every Vendure link before it reached the backend.
	  	const email = page.url.searchParams.get('email') ?? ''
	  	const token = page.url.searchParams.get('token')
	  	if (!token) {
	  		throw Error('This link is missing its verification token.')
	  	}
	  	const result = (await authService.verifyEmail(email, token)) as { errorCode?: string; message?: string } | undefined
	  	// Vendure answers a bad or expired token with an ErrorResult rather than throwing.
	  	if (result?.errorCode) {
	  		throw Error(result.message || 'This verification link is no longer valid.')
	  	}
      if (!userState.user?.role) {
        const { me } = userState.retrieveUserId()
			  if (me?.userId) {
				  userState.user = me
			  } else {
				  userState.user = null
				}
      }
      status = "success"
	  } catch (e) {
      console.error(e)
      failureReason = e instanceof Error ? e.message : ''
      status = "failed"
	  }
  })
</script>

<svelte:head>
	<title>Email Verification Successful</title>
</svelte:head>

{#if status === 'loading'}
	<div class="flex min-h-[70vh] items-center justify-center px-4">
    <LoaderCircle class="animate-spin" />
  </div>
{:else if status === 'success'}
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
				<Button onclick={() => goto('/')} variant="default" class="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600">Continue Shopping</Button>
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
				<p class="text-gray-600">{failureReason || 'The link you clicked is invalid or expired. Please try again.'}</p>
			</div>

			<div class="pt-4">
			  <Button onclick={() => goto('/')} variant="default" class="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600">Log in</Button>
			</div>
		</div>
	</div>
{/if}
