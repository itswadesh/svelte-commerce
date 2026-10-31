<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte'
	import { Input } from '$lib/components/ui/input/index.js'
	import { Label } from '$lib/components/ui/label/index.js'
	import type { PageProps } from './$types'

	let { data }: PageProps = $props()

	const store = $derived(data.store as { name?: string; logo?: string; closed?: { message?: string; password?: boolean } } | undefined)
	const name = $derived(store?.name ?? '')

	const PENDING = `<script>
document.addEventListener('submit', function (event) {
	var button = event.target.querySelector('[type=submit]')
	if (button.hasAttribute('aria-busy')) return event.preventDefault()
	button.setAttribute('aria-busy', 'true')
})
addEventListener('pageshow', function () {
	document.querySelectorAll('[aria-busy]').forEach(function (button) { button.removeAttribute('aria-busy') })
})
<\/script>`
</script>

<svelte:head>
	<title>{name}</title>
	<meta name="robots" content="noindex" />
	{@html PENDING}
</svelte:head>

<main class="flex min-h-screen items-center justify-center px-4 py-10">
	<div class="grid w-full max-w-sm gap-4 text-center">
		<h1 class="page-heading">
			{#if store?.logo}
				<img src={store.logo} alt={name} width="192" height="48" fetchpriority="high" class="mx-auto block h-12 w-48 object-contain" />
			{:else}
				{name}
			{/if}
		</h1>
		{#if store?.closed?.message}
			<p class="whitespace-pre-line">{store.closed.message}</p>
		{/if}
		{#if store?.closed?.password}
			<form method="POST" class="grid w-full gap-3 text-left">
				<div class="grid gap-2">
					<Label for="store-password">Password</Label>
					<Input
						id="store-password"
						name="store_password"
						type="password"
						autocomplete="current-password"
						required
						autofocus={!!data.error}
						aria-invalid={data.error ? 'true' : undefined}
						aria-describedby={data.error ? 'store-password-error' : undefined}
					/>
					{#if data.error}
						<p id="store-password-error" class="refusal text-sm text-destructive duration-fast ease-standard animate-in fade-in-0">
							{data.error}
						</p>
					{/if}
				</div>
				<Button type="submit" class="w-full">Enter</Button>
			</form>
		{/if}
	</div>
</main>

<!-- Here rather than in utilities: every page inlines the shared stylesheet, and these serve this page alone. -->
<style>
	@media (prefers-reduced-motion: no-preference) {
		.refusal {
			--tw-enter-translate-y: 0.125rem;
		}
	}

	form :global([aria-busy='true']) {
		opacity: 0.6;
		pointer-events: none;
	}
</style>
