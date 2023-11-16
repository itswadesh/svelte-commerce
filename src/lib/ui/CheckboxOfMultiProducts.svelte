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
import { createEventDispatcher, onMount } from 'svelte'
import { currency } from '$lib/utils'
import { page } from '$app/stores'
import LazyImg from '$lib/components/Image/LazyImg.svelte'
import { browser } from '$app/environment'
// import { storeStore } from '$lib/store/store'

const dispatch = createEventDispatcher()

export let disabled = false
export let items = []
export let name = ''
export let required = false
export let selectedItems = []
// let store = {}
$: store = $page.data?.store

// onMount(() => {
// 	if (browser) {
// 		storeStore.subscribe((value) => (store = value))
// 	}
// })
</script>

{#if items?.length}
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
							class="inputcheckbox h-3.5 w-3.5 rounded border border-zinc-200 bg-transparent text-primary-500"
							on:change="{() => dispatch('change', selectedItems)}" />

						<div class="flex-1 text-sm first-letter:uppercase flex items-center gap-2">
							<LazyImg
								src="{i.img}"
								alt=" "
								aspect_ratio="3:4"
								width="32"
								height="42"
								class="w-8 h-10 object-contain object-center" />

							<p class="flex-1">
								{i.name} at
								{currency(i.price, store?.currencySymbol)}
							</p>
						</div>
					</label>
				</li>
			{/if}
		{/each}
	</ul>
{/if}
