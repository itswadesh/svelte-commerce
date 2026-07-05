<script lang="ts">
	import { version } from '$app/environment'
	import { Plus } from '@lucide/svelte'
	import { onMount } from 'svelte'
	import type { ThemeHomepageContent } from '$lib/theme/index.js'

	type ThemeFooter = NonNullable<ThemeHomepageContent['footer']>

	let { footer, brandName = 'Store' }: { footer?: ThemeFooter; brandName?: string } = $props()

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

<footer class="limelight-footer">
	{#if footer?.logo}
		<img src={footer.logo} alt={footer.logoAlt || brandName} />
	{/if}

	{#if footer?.assistance}
		<div class="limelight-assistance">
			<span>{footer.assistance.label}</span>
			{#each footer.assistance.links as link}
				<a href={link.href}>{link.label}</a>
			{/each}
		</div>
	{/if}

	<div class="limelight-footer-grid">
		{#each footer?.columns || [] as column}
			<details class="limelight-footer-col" open={footerColsOpen}>
				<summary><h3>{column.title}</h3><Plus class="limelight-foot-plus" /></summary>
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
		<p class="limelight-copyright">{footer.copyright}</p>
	{/if}

	<p class="limelight-version">v{version}</p>
</footer>

<style>
	.limelight-footer {
		padding: 55px 40px 30px;
		background: linear-gradient(127deg, #2a7b9b 0%, #806363 0%, #57033c 19%, #460032 100%);
		color: #fff;
		text-align: center;
		font-family: var(--font-body);
	}

	.limelight-footer a {
		color: inherit;
	}

	.limelight-footer > img {
		width: 521px;
		max-width: 80%;
		margin: 0 auto 48px;
	}

	.limelight-assistance {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 24px;
		margin-bottom: 70px;
		text-transform: uppercase;
	}

	.limelight-assistance span {
		font-family: var(--font-heading);
		font-size: 20px;
	}

	.limelight-assistance a {
		min-width: 190px;
		border: 1px solid rgb(255 255 255 / 0.9);
		padding: 8px 18px;
		font-size: 14px;
	}

	.limelight-footer-grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		width: min(1120px, 100%);
		margin: 0 auto;
		gap: 70px;
		text-align: left;
	}

	.limelight-footer-grid h3 {
		margin: 0 0 22px;
		color: #fff;
		font-family: var(--font-heading);
		font-size: 20px;
		font-weight: 400;
	}

	.limelight-footer-col summary {
		list-style: none;
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
	}

	.limelight-footer-col summary::-webkit-details-marker {
		display: none;
	}

	.limelight-foot-plus {
		display: none;
	}

	@media (min-width: 901px) {
		.limelight-footer-col summary {
			pointer-events: none;
			cursor: default;
		}
	}

	.limelight-footer-grid a,
	.limelight-footer-grid p {
		display: block;
		margin: 0 0 10px;
		color: #fff;
		font-size: 15px;
		line-height: 25px;
	}

	.limelight-copyright {
		margin: 60px 0 0;
		color: #fff;
		font-size: 13px;
	}

	.limelight-version {
		margin: 8px 0 0;
		color: rgb(255 255 255 / 0.55);
		font-size: 11px;
		letter-spacing: 0.04em;
	}

	@media (max-width: 900px) {
		.limelight-footer {
			padding: 42px 24px 28px;
		}

		.limelight-assistance {
			flex-wrap: wrap;
			gap: 12px;
			margin-bottom: 36px;
		}

		.limelight-assistance span {
			width: 100%;
		}

		.limelight-assistance a {
			flex: 1;
			min-width: 0;
			text-align: center;
		}

		.limelight-footer-grid {
			grid-template-columns: 1fr;
			gap: 0;
			text-align: left;
		}

		.limelight-footer-col {
			border-top: 1px solid rgb(255 255 255 / 0.22);
		}

		.limelight-footer-col summary {
			align-items: center;
			padding: 15px 0;
			cursor: pointer;
		}

		.limelight-footer-col summary h3 {
			margin: 0;
		}

		.limelight-foot-plus {
			display: block;
			width: 18px;
			height: 18px;
			flex: none;
			stroke-width: 1.5;
			transition: transform 0.2s ease;
		}

		.limelight-footer-col[open] .limelight-foot-plus {
			transform: rotate(45deg);
		}

		.limelight-footer-col > a,
		.limelight-footer-col > p {
			margin: 0 0 12px;
		}

		.limelight-footer-col > a:last-child,
		.limelight-footer-col > p:last-child {
			margin-bottom: 16px;
		}
	}
</style>
