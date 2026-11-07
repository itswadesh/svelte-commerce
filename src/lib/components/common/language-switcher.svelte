<script lang="ts">
	import { page } from '$app/state'
	import { onMount } from 'svelte'

	/**
	 * Which of the store's languages its products and pages are read in. Drawn only for a store with
	 * more than one. The cookie is read by the connector on the server and in the browser alike, so a
	 * full reload is what brings the whole page over in one go.
	 */
	const languages = $derived((page.data?.store?.languages ?? []) as string[])
	let chosen = $state('')

	onMount(() => {
		chosen = /(?:^|;\s*)gc_lang=([^;]+)/.exec(document.cookie)?.[1] ?? ''
	})
	const current = $derived(chosen || page.data?.store?.language || languages[0])

	// Each language by its own name, since that is the name its speakers look for.
	function nameOf(code: string) {
		try {
			return new Intl.DisplayNames([code], { type: 'language' }).of(code) ?? code
		} catch {
			return code
		}
	}

	function change(event: Event) {
		const code = (event.currentTarget as HTMLSelectElement).value
		document.cookie = `gc_lang=${code}; path=/; max-age=31536000; samesite=lax`
		location.reload()
	}
</script>

{#if languages.length > 1}
	<label class="inline-flex items-center gap-2 text-xs text-muted-foreground">
		<span>Language</span>
		<select
			class="h-9 rounded-md border bg-background px-2 text-foreground transition-colors duration-200 hover:border-foreground focus-visible:outline-2 focus-visible:outline-primary"
			value={current}
			onchange={change}
		>
			{#each languages as code (code)}
				<option value={code}>{nameOf(code)}</option>
			{/each}
		</select>
	</label>
{/if}
