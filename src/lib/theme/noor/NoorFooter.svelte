<script lang="ts">
	import { page } from '$app/state'
	import type { ThemeHomepageContent } from '$lib/theme/index.js'
	import CookieSettingsLink from '$lib/components/common/cookie-settings-link.svelte'
	import { footerCredit } from '$lib/components/common/powered-by.js'
	import { chromeSettings } from '$lib/composer/chrome-draft.svelte.js'

	type ThemeFooter = NonNullable<ThemeHomepageContent['footer']>

	let {
		footer,
		description = '',
		brandName = ''
	}: {
		footer?: ThemeFooter
		description?: string
		brandName?: string
	} = $props()

	const credit = $derived(footerCredit(page.data?.store?.poweredBy, page.url.hostname, chromeSettings('footer', page.data)))
</script>

<footer class="noor-footer">
	<div class="noor-footer-brand">
		{#if footer?.logo || page.data?.store?.logo}
			<img src={footer?.logo || page.data.store.logo} alt={footer?.logoAlt || brandName} />
		{:else if brandName}
			<!-- No uploaded logo: the brand name carries the mark, same as the header. -->
			<p class="noor-footer-wordmark">{brandName}</p>
		{/if}
		{#if description}
			<p>{description}</p>
		{/if}
		<CookieSettingsLink class="noor-cookies" />
		{#if credit?.label}
			<p class="noor-credit">
				{#if credit.link}<a href={credit.link} target="_blank" rel="noopener noreferrer">{credit.label}</a>{:else}{credit.label}{/if}
			</p>
		{/if}
	</div>

	{#each footer?.columns || [] as column}
		<div class="noor-footer-column">
			<h3>{column.title}</h3>
			{#each column.links || [] as link}
				<a href={link.href}>{link.label}</a>
			{/each}
			{#each column.text || [] as text}
				<p>{text}</p>
			{/each}
		</div>
	{/each}
</footer>

<style>
	.noor-footer {
		--ink: #151515;
		--line: #ded8cf;
		--muted: #6d6760;
		display: grid;
		grid-template-columns: 1.4fr repeat(3, 1fr);
		gap: 48px;
		padding: 58px max(32px, calc((100vw - 1360px) / 2));
		background: #f8f6f2;
		border-top: 1px solid var(--line);
		color: var(--ink);
		font-family: var(--font-body);
	}

	.noor-footer-brand img {
		width: 118px;
		height: auto;
		margin-bottom: 18px;
	}

	.noor-footer-wordmark {
		margin: 0 0 18px;
		color: var(--ink);
		font-family: var(--font-heading);
		font-size: 20px;
		line-height: 1.1;
		letter-spacing: 0.14em;
		text-transform: uppercase;
	}

	.noor-footer p {
		max-width: 360px;
		margin: 0;
		color: var(--muted);
		font-size: 13px;
		line-height: 1.8;
	}

	.noor-footer h3 {
		margin: 0 0 18px;
		color: var(--ink);
		font-family: var(--font-body);
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
	}

	.noor-footer a {
		display: block;
		margin-top: 10px;
		color: var(--muted);
		font-size: 13px;
		text-decoration: none;
		transition: color 0.2s ease;
	}

	.noor-footer a:hover,
	.noor-footer a:focus-visible {
		color: var(--ink);
	}

	.noor-footer .noor-credit {
		margin-top: 8px;
	}

	.noor-credit a {
		display: inline;
		margin: 0;
	}

	/* The button is CookieSettingsLink's, so the rule reaches it as a global under this footer. */
	.noor-footer :global(.noor-cookies) {
		margin-top: 14px;
		padding: 6px 0;
		background: none;
		border: 0;
		color: var(--muted);
		font-size: 13px;
		text-decoration: underline;
		text-underline-offset: 3px;
		cursor: pointer;
		transition: color 0.2s ease;
	}

	.noor-footer :global(.noor-cookies:hover),
	.noor-footer :global(.noor-cookies:focus-visible) {
		color: var(--ink);
	}

	.noor-footer :global(.noor-cookies:focus-visible) {
		outline: 2px solid var(--ink);
		outline-offset: 2px;
	}

	@media (max-width: 900px) {
		.noor-footer {
			grid-template-columns: 1fr;
			gap: 28px;
			padding: 42px 18px;
		}
	}
</style>
