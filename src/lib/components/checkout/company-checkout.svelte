<script lang="ts">
	import type { Snippet } from 'svelte'
	import { afterNavigate } from '$app/navigation'
	import { page } from '$app/state'
	import { Building2 } from '@lucide/svelte'
	import { services } from 'kitcommerce.config'
	import { getCartState } from '$lib/core/stores/index.js'
	import { Button } from '$lib/components/ui/button'
	import { fade } from '$lib/motion'

	/**
	 * A company's buyer cannot check out here: the engine refuses their order with
	 * `company_checkout_required`, because a company's prices come with its limits and approvals
	 * (GoCommerce D66, D67). Asked before they fill in an address and choose a payment, rather than
	 * after, so nobody works through checkout to reach a refusal. Asked again at each step, as a
	 * shopper can sign in along the way.
	 */
	let { children }: { children?: Snippet } = $props()

	type B2b = { me?: () => Promise<{ company?: { name?: string } } | null | undefined> }

	const cartState = getCartState()
	let company = $state('')

	afterNavigate(async () => {
		// A store with no company has no such buyers, so a retail checkout never asks.
		if (!page.data?.trade?.companies) return
		const b2b = Reflect.get(services, 'b2bService') as B2b | undefined
		try {
			company = (await b2b?.me?.())?.company?.name ?? ''
		} catch {
			// Not signed in, or not a company's buyer: checkout is theirs.
			company = ''
		}
	})

	// The fragment keeps the bag's token out of server logs. The portal moves the lines across.
	const bag = $derived(cartState?.cart?.id)
	const portal = $derived(bag ? `/portal/basket#cart=${encodeURIComponent(bag)}` : '/portal/basket')
</script>

{#if company}
	<div in:fade class="page-width py-8 md:py-12">
		<section class="mx-auto max-w-xl rounded-lg border bg-card p-5 md:p-6" aria-labelledby="company-checkout-title">
			<Building2 class="mb-3 h-6 w-6 text-muted-foreground" aria-hidden="true" />
			<h1 id="company-checkout-title" class="text-lg font-semibold text-foreground">Order through {company}'s trade account</h1>
			<p class="mt-2 text-sm text-muted-foreground">
				You're signed in as a buyer for {company}. Its orders are placed in the trade account, on your company's prices and terms, so they can't be paid for here.
			</p>
			<p class="mt-2 text-sm text-muted-foreground">
				Your bag comes with you, and the trade account will ask you to sign in once if it hasn't already.
			</p>
			<div class="mt-5 flex flex-col gap-3 sm:flex-row">
				<Button href={portal} size="lg" data-sveltekit-reload>Continue to the trade account</Button>
				<Button href="/cart" variant="outline" size="lg">Back to your bag</Button>
			</div>
		</section>
	</div>
{:else}
	{@render children?.()}
{/if}
