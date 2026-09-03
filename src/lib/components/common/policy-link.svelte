<script lang="ts">
	import { page } from '$app/state'
	import { CMS_BACKED_PATHS } from './cms-pages.js'
	import type { Snippet } from 'svelte'

	/**
	 * A link to a CMS-authored policy page, which renders as plain text when the store has not
	 * published that page.
	 *
	 * The consent lines under the contact form, the sign-in modal and the account-deletion screen
	 * all pointed at `/terms-and-conditions` and `/privacy-policy`. On a store with no CMS those are
	 * bare 404s, so a shopper was asked to agree to terms they could not read. Naming the document
	 * without linking it is the honest fallback; the link returns the moment the merchant publishes
	 * the page.
	 */
	interface Props {
		href: string
		class?: string
		children: Snippet
		[key: string]: unknown
	}

	// Call sites pass their own handlers — the sign-in modal closes itself on click — so anything
	// beyond href/class/children is forwarded to whichever element ends up rendering.
	const { href, class: className = '', children, ...rest }: Props = $props()

	const slug = $derived(href.replace(/^\/+/, '').replace(/\/+$/, ''))
	const resolvable = $derived(!CMS_BACKED_PATHS.has(href) || (page?.data?.cmsPages ?? []).includes(slug))
</script>

{#if resolvable}
	<a {href} class={className} {...rest}>{@render children()}</a>
{:else}
	<span class={className}>{@render children()}</span>
{/if}
