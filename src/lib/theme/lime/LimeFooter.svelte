<script lang="ts">
	import { version } from '$app/environment'
	import { Plus } from '@lucide/svelte'
	import { onMount } from 'svelte'
	import type { ThemeHomepageContent } from '$lib/theme/index.js'

	type ThemeFooter = NonNullable<ThemeHomepageContent['footer']>

	let { footer, brandName = '' }: { footer?: ThemeFooter; brandName?: string } = $props()

	// Footer columns are open on desktop, tap-to-expand accordions on mobile.
	// onMount (client-only, always in a valid context) sets up the media query;
	// using $effect here can throw effect_orphan depending on how the footer is
	// instantiated, and this listener doesn't depend on reactive state anyway.
	let footerColsOpen = $state(true)

	onMount(() => {
		const mq = window.matchMedia('(min-width: 901px)')
		const sync = () => (footerColsOpen = mq.matches)
		sync()
		mq.addEventListener('change', sync)
		return () => mq.removeEventListener('change', sync)
	})
</script>

<footer class="lime-footer">
	{#if footer?.logo}
		<img src={footer.logo} alt={footer.logoAlt || brandName} />
	{:else if brandName}
		<!-- No uploaded logo: the brand name carries the mark, same as the header. -->
		<p class="lime-footer-wordmark">{brandName}</p>
	{/if}

	{#if footer?.assistance}
		<div class="lime-assistance">
			<span>{footer.assistance.label}</span>
			{#each footer.assistance.links as link}
				<a href={link.href}>{link.label}</a>
			{/each}
		</div>
	{/if}

	<div class="lime-footer-grid">
		{#each footer?.columns || [] as column}
			<details class="lime-footer-col" open={footerColsOpen}>
				<summary><h3>{column.title}</h3><Plus class="lime-foot-plus" /></summary>
				{#each column.links || [] as link}
					<a href={link.href}>{link.label}</a>
				{/each}
				{#each column.text || [] as text}
					<p>{text}</p>
				{/each}
			</details>
		{/each}
	</div>

	{#if footer?.copyright}
		<p class="lime-copyright">{footer.copyright}</p>
	{/if}

	<p class="lime-version">v{version}</p>
</footer>

<style>
	.lime-footer {
		padding: 55px 40px 30px;
		background: linear-gradient(127deg, #2a7b9b 0%, #806363 0%, #57033c 19%, #460032 100%);
		color: #fff;
		text-align: center;
		font-family: var(--font-body);
	}

	.lime-footer a {
		color: inherit;
	}

	.lime-footer > img {
		width: 521px;
		max-width: 80%;
		margin: 0 auto 48px;
	}

	.lime-footer-wordmark {
		margin: 0 auto 48px;
		font-family: var(--font-heading);
		font-size: 34px;
		line-height: 1.1;
		letter-spacing: 0.04em;
	}

	.lime-assistance {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 24px;
		margin-bottom: 70px;
		text-transform: uppercase;
	}

	.lime-assistance span {
		font-family: var(--font-heading);
		font-size: 20px;
	}

	.lime-assistance a {
		min-width: 190px;
		border: 1px solid rgb(255 255 255 / 0.9);
		padding: 8px 18px;
		font-size: 14px;
	}

	.lime-footer-grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		width: min(1120px, 100%);
		margin: 0 auto;
		gap: 70px;
		text-align: left;
	}

	.lime-footer-grid h3 {
		margin: 0 0 22px;
		color: #fff;
		font-family: var(--font-heading);
		font-size: 20px;
		font-weight: 400;
	}

	.lime-footer-col summary {
		list-style: none;
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
	}

	.lime-footer-col summary::-webkit-details-marker {
		display: none;
	}

	.lime-foot-plus {
		display: none;
	}

	@media (min-width: 901px) {
		.lime-footer-col summary {
			pointer-events: none;
			cursor: default;
		}
	}

	.lime-footer-grid a,
	.lime-footer-grid p {
		display: block;
		margin: 0 0 10px;
		color: #fff;
		font-size: 15px;
		line-height: 25px;
	}

	.lime-copyright {
		margin: 60px 0 0;
		color: #fff;
		font-size: 13px;
	}

	.lime-version {
		margin: 8px 0 0;
		color: rgb(255 255 255 / 0.55);
		font-size: 11px;
		letter-spacing: 0.04em;
	}

	@media (max-width: 900px) {
		.lime-footer {
			padding: 42px 24px 28px;
		}

		.lime-assistance {
			flex-wrap: wrap;
			gap: 12px;
			margin-bottom: 36px;
		}

		.lime-assistance span {
			width: 100%;
		}

		.lime-assistance a {
			flex: 1;
			min-width: 0;
			text-align: center;
		}

		.lime-footer-grid {
			grid-template-columns: 1fr;
			gap: 0;
			text-align: left;
		}

		.lime-footer-col {
			border-top: 1px solid rgb(255 255 255 / 0.22);
		}

		.lime-footer-col summary {
			align-items: center;
			padding: 15px 0;
			cursor: pointer;
		}

		.lime-footer-col summary h3 {
			margin: 0;
		}

		.lime-foot-plus {
			display: block;
			width: 18px;
			height: 18px;
			flex: none;
			stroke-width: 1.5;
			transition: transform 0.2s ease;
		}

		.lime-footer-col[open] .lime-foot-plus {
			transform: rotate(45deg);
		}

		.lime-footer-col > a,
		.lime-footer-col > p {
			margin: 0 0 12px;
		}

		.lime-footer-col > a:last-child,
		.lime-footer-col > p:last-child {
			margin-bottom: 16px;
		}
	}
</style>
