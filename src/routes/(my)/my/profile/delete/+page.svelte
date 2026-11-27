<script lang="ts">
	import { page } from '$app/state'
	import PolicyLink from '$lib/components/common/policy-link.svelte'
	import { isCmsPageResolvable } from '$lib/components/common/cms-pages.js'

	// A shopper cannot close their own account: the engine has no shopper-side route for it, only the
	// store's own erasure in the panel, and the connector's deleteUser throws NotSupportedError. So
	// the page says how to ask the store, with the store's own email when it has published one,
	// rather than a button that fails every time. The same email the contact page uses.
	const store = $derived(page?.data?.store)
	const email = $derived(String(store?.contact?.email || store?.businessEmail || '').trim())

	// Dropping the sentence rather than the link: "Please review our Privacy Policy" with the name
	// sitting there unclickable is an instruction the shopper cannot follow.
	const privacyOk = $derived(isCmsPageResolvable('/privacy-policy', page.data?.cmsPages ?? []))

	const link = 'font-semibold text-primary underline underline-offset-4 transition-opacity duration-200 hover:opacity-70'
</script>

<svelte:head>
	<title>Close your account | {store?.name || 'Svelte Commerce'}</title>
</svelte:head>

<div class="mx-auto max-w-3xl py-8 md:py-12">
	<h1 class="page-heading">Close your account</h1>

	<div class="mt-8 rounded-md border bg-card p-6 md:p-8">
		<p class="text-base leading-relaxed text-foreground" data-testid="account-closure">
			To close your account,
			{#if email}
				email the store at <a href="mailto:{email}" class="{link} break-all">{email}</a>, or use the
			{:else}
				use the
			{/if}
			<a href="/contact-us" class={link}>contact page</a>.
		</p>
		{#if privacyOk}
			<p class="mt-4 text-sm leading-relaxed text-muted-foreground">
				How the store handles your details is set out in its
				<PolicyLink href="/privacy-policy" class={link}>Privacy Policy</PolicyLink>.
			</p>
		{/if}
	</div>
</div>
