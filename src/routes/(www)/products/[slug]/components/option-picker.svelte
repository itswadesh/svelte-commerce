<script lang="ts">
	import { Check, ChevronsUpDown } from '@lucide/svelte'
	import * as Command from '$lib/components/ui/command'
	import * as Popover from '$lib/components/ui/popover'
	import type { PickerChoice } from '$lib/product/conversion'

	/**
	 * A long option as a searchable picker (GoCommerce D134): "Choose model" over hundreds of phone
	 * models, where a wall of pills is unusable on a phone. The choices arrive already cross-filtered
	 * against what is chosen on the other options, so after "Brand: Samsung" only Samsung's models
	 * are listed; a sold-out one stays, disabled, so the shopper learns it is sold out rather than
	 * missing. Choosing one is the same `onchoose` the pills call.
	 */
	let {
		title,
		choices,
		selected = '',
		onchoose
	}: {
		title: string
		choices: PickerChoice[]
		selected?: string
		onchoose: (value: string, trigger: HTMLElement | null) => void
	} = $props()

	let open = $state(false)
	let trigger = $state<HTMLButtonElement | null>(null)
	const listId = $derived(`picker-${title.replace(/\W+/g, '-').toLowerCase()}`)
</script>

<Popover.Root bind:open>
	<Popover.Trigger bind:ref={trigger}>
		{#snippet child({ props })}
			<button
				{...props}
				type="button"
				role="combobox"
				aria-expanded={open}
				aria-controls={listId}
				aria-label={selected ? `${title}: ${selected}` : `Choose ${title.toLowerCase()}`}
				data-testid="option-picker"
				class="op-trigger flex h-11 w-full items-center justify-between gap-2 rounded-radius border border-border-strong bg-background px-3 text-left text-sm text-foreground transition-colors duration-fast hover:border-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:h-10"
			>
				<span class="min-w-0 truncate {selected ? 'font-medium' : 'text-muted-foreground'}">{selected || `Choose ${title.toLowerCase()}`}</span>
				<ChevronsUpDown class="size-4 shrink-0 opacity-60 transition-transform duration-fast {open ? 'rotate-180' : ''}" aria-hidden="true" />
			</button>
		{/snippet}
	</Popover.Trigger>
	<!-- The trigger's width, capped to the screen: at 360px the list must not run off the edge. -->
	<Popover.Content class="z-popover w-[var(--bits-popover-anchor-width)] max-w-[calc(100vw-2rem)] p-0 duration-fast" align="start" sideOffset={6}>
		<Command.Root>
			<Command.Input placeholder={`Search ${title.toLowerCase()}`} aria-label={`Search ${title.toLowerCase()}`} />
			<Command.List id={listId} class="max-h-72">
				<Command.Empty>No {title.toLowerCase()} matches.</Command.Empty>
				<Command.Group>
					{#each choices as c (c.id)}
						<Command.Item
							value={c.value}
							disabled={c.disabled}
							data-testid="option-picker-item"
							class="min-h-11 transition-colors duration-fast md:min-h-9"
							onSelect={() => {
								open = false
								onchoose(c.value, trigger)
							}}
						>
							<Check class="size-4 {c.selected ? '' : 'text-transparent'}" aria-hidden="true" />
							<span class="min-w-0 flex-1 truncate">{c.value}</span>
							{#if c.disabled}<span class="text-xs text-muted-foreground">Sold out</span>{/if}
						</Command.Item>
					{/each}
				</Command.Group>
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
