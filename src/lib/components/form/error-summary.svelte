<script lang="ts">
	import { AlertCircle } from '@lucide/svelte'
	import { fly, prefersReducedMotion } from '$lib/motion'

	type Item = { message: string; field?: string }

	let { items = [], title = 'Please check the form', class: className = '' }: { items?: Item[]; title?: string; class?: string } = $props()

	// The heading introduces field errors; a lone server message stands on its own.
	const showTitle = $derived(!!title && items.some((item) => item.field))

	let ref = $state<HTMLDivElement | null>(null)

	/**
	 * Called by the form after a failed submit, so keyboard and screen-reader users land on the
	 * list of what went wrong instead of staying on the submit button.
	 */
	export function focus() {
		ref?.focus()
	}

	// Each entry moves focus to its field, which a bare #id link does not do for inputs.
	function jump(event: MouseEvent, field: string) {
		const el = document.getElementById(field)
		if (!el) return
		event.preventDefault()
		el.focus({ preventScroll: true })
		el.scrollIntoView({ block: 'center', behavior: prefersReducedMotion.current ? 'auto' : 'smooth' })
	}
</script>

{#if items.length}
	<!-- Same tone as the forms' own error box. It rises 4px into place; under reduced motion
	     $lib/motion turns that into a fade of the same length. -->
	<div
		bind:this={ref}
		tabindex="-1"
		role="alert"
		in:fly={{ y: 4 }}
		class="flex items-start gap-3 rounded-md bg-destructive/10 p-4 text-sm text-destructive {className}"
	>
		<AlertCircle class="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
		<div>
			{#if showTitle}
				<p class="font-semibold">{title}</p>
			{/if}
			<ul class={showTitle ? 'mt-1 space-y-0.5' : 'space-y-0.5'}>
				{#each items as item (item.field ?? item.message)}
					<li class="font-medium">
						{#if item.field}
							<a
								href="#{item.field}"
								onclick={(e) => jump(e, item.field!)}
								class="underline decoration-destructive/40 underline-offset-4 transition-colors duration-fast hover:decoration-destructive"
								>{item.message}</a
							>
						{:else}
							{item.message}
						{/if}
					</li>
				{/each}
			</ul>
		</div>
	</div>
{/if}
