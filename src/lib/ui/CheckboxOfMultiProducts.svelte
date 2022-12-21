<style>
@media (max-width: 768px) {
	.filter-container {
		max-height: 515px;
		overflow: auto;
	}
}
@media (min-width: 768px) {
	.filter-container {
		max-height: 400px;
		overflow: auto;
	}
}
input[type='search']::-webkit-search-cancel-button {
	display: none;
}
</style>

<script>
import LazyImg from '$lib/components/Image/LazyImg.svelte'
import { currency } from '$lib/util'
import { createEventDispatcher } from 'svelte'
import { page } from '$app/stores'
const dispatch = createEventDispatcher()

export let items = [],
	selectedItems = [],
	name = '',
	required = false,
	disabled = false

// console.log('items', items)
// console.log('selectedItems', selectedItems)
</script>

<ul class="flex flex-col gap-2">
	{#each items as i}
		{#if i._id}
			<li>
				<label class="inline-flex items-center gap-2">
					<input
						type="checkbox"
						name="{name}"
						id="{i._id}"
						disabled="{disabled}"
						required="{required}"
						bind:group="{selectedItems}"
						value="{i._id}"
						class="inputcheckbox h-3.5 w-3.5 rounded-md border border-gray-200 bg-transparent text-primary-500"
						on:change="{() => dispatch('change', selectedItems)}" />

					<div class="flex-1 text-sm first-letter:uppercase flex items-center gap-2">
						<LazyImg src="{i.img}" alt=" " class="w-8 h-auto object-contain object-center" />

						<span class="flex-1">
							{i.name} at
							{currency(i.price, $page.data?.store?.currencySymbol)}
						</span>
					</div>
				</label>
			</li>
		{/if}
	{/each}
</ul>
