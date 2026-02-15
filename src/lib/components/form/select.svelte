<script lang="ts">
	import { Check, ChevronsUpDown } from '@lucide/svelte'
	import * as Command from '$lib/components/ui/command'
	import * as Popover from '$lib/components/ui/popover'
	import { Button } from '$lib/components/ui/button'
	import { cn } from '$lib/core/utils'
	import Label from '../ui/label/label.svelte'
	import { Search } from '@lucide/svelte'
	import Input from '../ui/input/input.svelte'
	import { FormSelectRenderer } from '$lib/core/composables/index.js'

	let {
		error = '',
		optional = false,
		info = '',
		class: klass = '',
		showSearch = false,
		success = false,
		optionSelected = (value: any) => {},
		data,
		id = '',
		title = '',
		errors = {},
		value = '',
		label = '',
		valueField = 'value',
		...rest
	} = $props()

	let triggerRef = $state<HTMLButtonElement>(null!)
	let open = $state(false)
	let searchQuery = $state('')
</script>

<FormSelectRenderer bind:open bind:triggerRef bind:searchQuery {data} {value} {valueField} {title}>
	{#snippet content({ filteredData, selectedValue, closeAndFocusTrigger })}
		<div class={cn('mb-3 space-y-2', klass)}>
			{#if label}
				<Label class="block text-sm font-medium text-gray-700">
					{label}
					{#if optional}<span class="text-xs text-muted-foreground">(Optional)</span>{/if}
				</Label>
			{/if}
			<div class="relative w-full" {...rest}>
				<Popover.Root bind:open>
					<Popover.Trigger bind:ref={triggerRef} asChild>
						{#snippet child({ props })}
							<Button
								aria-label="Open Select Options"
								variant="outline"
								class="w-full justify-between font-normal"
								{...props}
								role="combobox"
								aria-expanded={open}
							>
								<span class="min-w-0 truncate">{selectedValue || 'Select...'}</span>
								<ChevronsUpDown class="ml-2 size-4 shrink-0 opacity-50" />
							</Button>
						{/snippet}
					</Popover.Trigger>
					<Popover.Content class="relative z-[1000000000] p-0" align="start">
						<Command.Root>
							{#if showSearch}
								<div class="flex items-center px-3">
									<Search class="mr-2 size-4 shrink-0 opacity-50" />
									<Input
										bind:value={searchQuery}
										placeholder="Search..."
										class={cn(
											'flex h-10 w-full rounded-md border-none bg-transparent py-3 text-sm shadow-none outline-none placeholder:text-muted-foreground focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50'
										)}
									/>
								</div>
							{/if}
							<Command.List>
								<Command.Empty>Not found.</Command.Empty>
								<Command.Group>
									{#each filteredData as d}
										<Command.Item
											value={d[valueField]}
											class="aria-selected:bg-primary aria-selected:text-primary-foreground"
											onSelect={() => {
												optionSelected(d[valueField])
												value = d[valueField]
												closeAndFocusTrigger()
											}}
										>
											<Check class={cn('mr-2 size-4', value !== d[valueField] && 'text-transparent')} />
											{d.name}
										</Command.Item>
									{/each}
								</Command.Group>
							</Command.List>
						</Command.Root>
					</Popover.Content>
				</Popover.Root>
			</div>
		</div>
		{#if errors && errors[id]}
			<span class="text-red-500">{errors[id]}</span>
		{/if}
	{/snippet}
</FormSelectRenderer>
