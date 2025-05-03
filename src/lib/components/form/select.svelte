<script lang="ts">
	import { Check, ChevronsUpDown } from 'lucide-svelte'
	import * as Command from '$lib/components/ui/command'
	import * as Popover from '$lib/components/ui/popover'
	import { Button } from '$lib/components/ui/button'
	import { cn } from '$lib/core/utils'
	import Label from '../ui/label/label.svelte'
	import { Search } from 'lucide-svelte'
	import Input from '../ui/input/input.svelte'
	import FormSelectRenderer from '$lib/core/composables/form-select-renderer.svelte'

	let {
		error = '',
		optional = false,
		info = '',
		class: klass = '',
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
		<div class="mb-3 space-y-2 {klass}">
			<Label class=" block text-sm text-gray-700">
				{label}
				{#if optional}<span class="text-xs text-muted-foreground">(Optional)</span>{/if}
				<div class="relative h-full" {...rest}>
					<Popover.Root bind:open>
						<Popover.Trigger bind:ref={triggerRef} class="flex w-full justify-between {klass}">
							{#snippet child({ props })}
								<Button aria-label="Open Select Options" variant="outline" class=" justify-between" {...props} role="combobox" aria-expanded={open}>
									{selectedValue || 'Select...'}
									<ChevronsUpDown class="ml-2 size-4 shrink-0 opacity-50" />
								</Button>
							{/snippet}
						</Popover.Trigger>
						<Popover.Content class="relative z-[1000000000] p-0">
							<Command.Root>
								<!-- <Command.Input placeholder="Search..." /> -->

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
								<Command.List>
									<Command.Empty>Not found.</Command.Empty>
									<Command.Group>
										{#each filteredData as d}
											<Command.Item
												value={d[valueField]}
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
			</Label>
		</div>
		{#if errors && errors[id]}
			<span class="text-red-500">{errors[id]}</span>
		{/if}
	{/snippet}
</FormSelectRenderer>
