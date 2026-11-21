<script lang="ts">
	import { page } from '$app/state'
	import PolicyLink from '$lib/components/common/policy-link.svelte'
	import { isCmsPageResolvable } from '$lib/components/common/cms-pages.js'
	import Button from '$lib/components/ui/button/button.svelte'
	import { MyProfileDeleteModule } from '$lib/core/composables/index.js'

	const deleteModule = new MyProfileDeleteModule()

	// Dropping the sentence rather than the link: "Please review our Privacy Policy" with the name
	// sitting there unclickable is an instruction the shopper cannot follow.
	const deletePrivacyOk = $derived(isCmsPageResolvable('/privacy-policy', page.data?.cmsPages ?? []))
</script>

<svelte:head>
	<title>Delete Account | Svelte Commerce</title>
</svelte:head>

<div class="mx-auto max-w-3xl py-8 md:py-12">
	<div class="mb-10">
		<h1 class="page-heading">Delete account</h1>
		<p class="mt-2 text-lg text-muted-foreground">We're sorry to see you go. Please review the following information carefully.</p>
	</div>

	<div class="overflow-hidden rounded-md border border-destructive/30 bg-card">
		<div class="bg-destructive/10 p-6 md:p-8">
			<h2 class="text-xl font-bold text-destructive">Is this goodbye?</h2>
			<p class="mt-2 text-sm font-medium text-destructive">Are you sure you want to delete your account? This action is permanent.</p>
		</div>

		<div class="p-6 md:p-8">
			<ul class="space-y-6">
				<li class="flex gap-4">
					<div class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-[10px] font-bold text-destructive">1</div>
					<div class="space-y-1">
						<p class="font-bold text-foreground">Forfeit all benefits</p>
						<p class="text-sm leading-relaxed text-muted-foreground">
							You'll lose your order history, saved details, coupons, and benefits. These cannot be recovered.{#if deletePrivacyOk}
								Please review our
								<PolicyLink href="/privacy-policy" class="font-semibold text-primary hover:underline">Privacy Policy</PolicyLink>.{/if}
						</p>
					</div>
				</li>
				<li class="flex gap-4">
					<div class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-[10px] font-bold text-destructive">2</div>
					<div class="space-y-1">
						<p class="font-bold text-foreground">Pending transactions</p>
						<p class="text-sm leading-relaxed text-muted-foreground">
							Any pending orders, exchanges, returns, or refunds will no longer be accessible via your account. We will attempt to complete open
							transactions within 30 days.
						</p>
					</div>
				</li>
				<li class="flex gap-4">
					<div class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-[10px] font-bold text-destructive">3</div>
					<div class="space-y-1">
						<p class="font-bold text-foreground">Coupon restrictions</p>
						<p class="text-sm leading-relaxed text-muted-foreground">
							We may not extend New User coupons if a new account is created with the same mobile number or email ID.
						</p>
					</div>
				</li>
				<li class="flex gap-4">
					<div class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-[10px] font-bold text-destructive">4</div>
					<div class="space-y-1">
						<p class="font-bold text-foreground">Data retention</p>
						<p class="text-sm leading-relaxed text-muted-foreground">
							Certain data may be retained for legitimate reasons such as security, fraud prevention, and regulatory compliance.
						</p>
					</div>
				</li>
			</ul>

			<div class="mt-12 flex items-center gap-3 rounded-md bg-muted p-4">
				<input
					type="checkbox"
					id="deleteAccount"
					class="h-5 w-5 rounded border-border-strong text-primary focus:ring-primary"
					bind:checked={deleteModule.iAgree}
				/>
				<label for="deleteAccount" class="text-sm font-semibold text-foreground"> I understand and agree to all the terms and conditions* </label>
			</div>

			<div class="mt-8 flex justify-end">
				<Button onclick={deleteModule.deleteUser} variant="destructive" class="h-12 px-10" disabled={!deleteModule.iAgree}>
					Permanently delete my account
				</Button>
			</div>
		</div>
	</div>
</div>
