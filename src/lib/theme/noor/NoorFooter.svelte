<script lang="ts">
	import type { ThemeHomepageContent } from '$lib/theme/index.js'

	type ThemeFooter = NonNullable<ThemeHomepageContent['footer']>

	let {
		footer,
		description = ''
	}: {
		footer?: ThemeFooter
		description?: string
	} = $props()
</script>

<footer class="noor-footer">
	<div class="noor-footer-brand">
		{#if footer?.logo}
			<img src={footer.logo} alt={footer.logoAlt || 'Noor'} />
		{/if}
		{#if description}
			<p>{description}</p>
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

	.noor-footer a:hover {
		color: var(--ink);
	}

	@media (max-width: 900px) {
		.noor-footer {
			grid-template-columns: 1fr;
			gap: 28px;
			padding: 42px 18px;
		}
	}
</style>
