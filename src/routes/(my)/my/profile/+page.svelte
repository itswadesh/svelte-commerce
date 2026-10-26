<script lang="ts">
	import Input from '$lib/components/form/textbox.svelte'
	import { Button } from '$lib/components/ui/button'
	import { Save, ArrowLeft, InfoIcon, Loader, User, Mail, Phone, Trash2, AlertCircle, CheckCircle } from '@lucide/svelte'
	import { goto } from '$app/navigation'
	import { page } from '$app/state'
	import * as InputOTP from '$lib/components/ui/input-otp/index.js'
	import { MyProfileModule } from '$lib/core/composables/index.js'
	import { profileService } from '$lib/core/services/index.js'
	import { fly, fade } from '$lib/motion'

	const profileModule = new MyProfileModule()

	// A phone proved with a code signs in to this account too (D118), when the
	// store signs customers in by phone. The phone typed on the profile is only
	// a contact detail until then.
	const phoneSignIn = $derived(['PHONE', 'BOTH'].includes(page.data.store?.loginType))
	const emailSignIn = $derived(page.data.store?.loginType !== 'PHONE')
	let provedPhone = $state('')
	$effect(() => {
		if (profileModule.profile?.phoneVerified && profileModule.profile?.phone) provedPhone = profileModule.profile.phone
	})
	const phoneProved = $derived(!!profileModule.profile?.phone && profileModule.profile.phone === provedPhone)

	let codeSent = $state(false)
	let otp = $state('')
	let busy = $state(false)
	let phoneError = $state('')

	const message = (e: unknown) => (e as { message?: string })?.message || 'Something went wrong. Please try again.'

	async function sendPhoneCode() {
		if (busy || !profileModule.profile?.phone) return
		busy = true
		phoneError = ''
		try {
			await profileService.requestPhoneLink({ phone: profileModule.profile.phone })
			otp = ''
			codeSent = true
		} catch (e) {
			phoneError = message(e)
		} finally {
			busy = false
		}
	}

	async function verifyPhone() {
		if (busy || otp.length !== 4) return
		busy = true
		phoneError = ''
		try {
			const me = await profileService.verifyPhoneLink({ phone: profileModule.profile.phone, otp })
			profileModule.profile.phone = me.phone
			profileModule.profile.phoneVerified = true
			provedPhone = me.phone
			codeSent = false
		} catch (e) {
			phoneError = message(e)
			otp = ''
		} finally {
			busy = false
		}
	}

	// The fourth digit checks the code, as on the sign-in form.
	$effect(() => {
		if (otp.length === 4) verifyPhone()
	})
</script>

<svelte:head>
	<title>My Profile | Svelte Commerce</title>
</svelte:head>

<div class="mx-auto max-w-6xl md:py-8 md:py-12">
	<div in:fly={{ y: 12 }} class="space-y-10">
		<!-- Profile Header -->
		<div class="flex items-center justify-between">
			<div>
				<h1 class="page-heading">Profile settings</h1>
				<p class="mt-2 text-sm text-muted-foreground">Manage your personal information and account security.</p>
			</div>
		</div>

		<!-- Main Profile Form -->
		<div class="overflow-hidden bg-card">
			<!-- <div class="border-b pb-5 border-border bg-muted/50 ">
				<div class="flex items-center gap-3">
					<div class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
						<User class="h-5 w-5" />
					</div>
					<h2 class="section-heading">Personal information</h2>
				</div>
			</div> -->

			<div class="">
				<form onsubmit={profileModule.saveProfile} class="space-y-8" oninput={profileModule.handleDetailsChange}>
					<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
						<div class="space-y-2">
							<Input label="First name" placeholder="Enter first name" bind:value={profileModule.profile.firstName} class="h-12" />
						</div>
						<div class="space-y-2">
							<Input label="Last name" placeholder="Enter last name" bind:value={profileModule.profile.lastName} class="h-12" />
						</div>
						<div class="space-y-2">
							<Input
								id="phone"
								name="phone"
								label="Phone number"
								type="phone"
								placeholder="Enter phone number"
								bind:value={profileModule.profile.phone}
								class="h-12"
							/>
							{#if phoneProved}
								<p class="flex items-center gap-1.5 text-sm text-success" in:fade>
									<CheckCircle class="size-4 shrink-0" aria-hidden="true" />
									Verified. You can sign in with this phone.
								</p>
							{:else if phoneSignIn && profileModule.profile.phone}
								{#if !codeSent}
									<Button type="button" variant="outline" size="sm" disabled={busy} onclick={sendPhoneCode}>
										{busy ? 'Sending…' : 'Verify this phone'}
									</Button>
									<p class="text-xs text-muted-foreground">Verify it to sign in with your phone as well. Include the country code, such as +91.</p>
								{:else}
									<div class="space-y-2" in:fade>
										<p class="text-sm text-muted-foreground">Enter the 4-digit code we texted to {profileModule.profile.phone}.</p>
										<InputOTP.Root aria-label="Four digit code" maxlength={4} pattern="\d*" bind:value={otp} disabled={busy}>
											{#snippet children({ cells })}
												<InputOTP.Group class="gap-2">
													{#each cells as cell}
														<InputOTP.Slot
															{cell}
															class="h-12 w-11 rounded-radius border bg-background text-lg font-semibold transition-colors {cell.isActive
																? 'border-primary ring-2 ring-ring/35'
																: ''}"
														/>
													{/each}
												</InputOTP.Group>
											{/snippet}
										</InputOTP.Root>
										<div class="flex gap-3 text-sm">
											<button type="button" class="underline" disabled={busy} onclick={sendPhoneCode}>Send a new code</button>
											<button type="button" class="underline" onclick={() => ((codeSent = false), (phoneError = ''))}>Cancel</button>
										</div>
									</div>
								{/if}
							{/if}
							{#if phoneError}
								<p class="text-sm text-destructive" role="alert">{phoneError}</p>
							{/if}
						</div>
						<div class="space-y-2">
							<Input
								id="email"
								type="email"
								name="email"
								label="Email address"
								bind:value={profileModule.profile.email}
								placeholder="Enter email"
								required={!profileModule.profile?.phoneVerified}
								class="h-12"
							/>
							{#if profileModule.profile?.phoneVerified && emailSignIn}
								<p class="text-xs text-muted-foreground">
									To sign in with your email too, save it here, then choose "Forgot password" on the email sign-in to set a password.
								</p>
							{/if}
						</div>
					</div>
				</form>
			</div>
		</div>

		<!-- Danger Zone -->
		<div class="overflow-hidden rounded-md border border-destructive/30 bg-card shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
			<div class="border-b border-destructive/30 bg-destructive/10 p-6 md:p-8">
				<div class="flex items-center gap-3">
					<div class="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10 text-destructive">
						<AlertCircle class="h-5 w-5" />
					</div>
					<h2 class="text-xl font-bold text-destructive">Danger zone</h2>
				</div>
			</div>

			<div class="p-6 md:p-8">
				<div class="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
					<div class="max-w-md">
						<h3 class="text-lg font-bold text-foreground">Delete account</h3>
						<p class="mt-1 text-sm text-muted-foreground">Permanently delete your account and all associated data. This action cannot be undone.</p>
					</div>
					<Button
						variant="destructive"
						class="h-12 px-6"
						onclick={() => goto('/my/profile/delete')}
					>
						Request deletion
					</Button>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Floating Save Bar -->
{#if profileModule.detailsChanged}
	<div in:fly={{ y: 24 }} out:fade class="fixed bottom-8 left-1/2 z-50 w-full max-w-lg -translate-x-1/2 px-4">
		<div class="flex items-center justify-between gap-4 rounded-md border border-border bg-card p-4">
			<div class="flex items-center gap-3 px-2">
				<div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
					<InfoIcon class="h-4 w-4" />
				</div>
				<span class="text-sm font-semibold text-foreground">Unsaved changes</span>
			</div>

			<Button onclick={profileModule.saveProfile} class="h-10 px-6">
				{#if profileModule.isLoading}
					<Loader class="mr-2 h-4 w-4 animate-spin" />
					Saving...
				{:else}
					<Save class="mr-2 h-4 w-4" />
					Save changes
				{/if}
			</Button>
		</div>
	</div>
{/if}

