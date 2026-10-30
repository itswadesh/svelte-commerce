<script lang="ts">
	import { BriefcaseBusiness, House, MapPin } from '@lucide/svelte'
	import { ADDRESS_LABELS } from '$lib/product/conversion'

	/**
	 * "Save address as Home / Work / Other" (GoCommerce D134): the name the address book shows the
	 * address under. A radio group, so the keyboard and a screen reader treat it as one choice;
	 * choosing the one already chosen clears it, since a label is optional.
	 */
	let { value = $bindable() }: { value?: string | null } = $props()

	const icons = { Home: House, Work: BriefcaseBusiness, Other: MapPin } as const
	const current = $derived(String(value ?? ''))
</script>

<fieldset class="mt-1 flex flex-col gap-2" data-testid="address-label">
	<legend class="mb-2 text-sm font-medium text-foreground">Save address as</legend>
	<div class="flex flex-wrap gap-2" role="radiogroup" aria-label="Save address as">
		{#each ADDRESS_LABELS as label (label)}
			{@const on = current.toLowerCase() === label.toLowerCase()}
			{@const Icon = icons[label]}
			<button
				type="button"
				role="radio"
				aria-checked={on}
				class="alc-chip inline-flex h-10 items-center gap-1.5 rounded-full border px-4 text-sm font-medium transition-[background-color,border-color,color,transform] duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-95 motion-reduce:active:scale-100 {on
					? 'border-primary bg-primary text-primary-foreground'
					: 'border-border-strong bg-background text-foreground hover:border-foreground'}"
				onclick={() => (value = on ? '' : label)}
			>
				<Icon class="size-4" aria-hidden="true" />
				{label}
			</button>
		{/each}
	</div>
</fieldset>
