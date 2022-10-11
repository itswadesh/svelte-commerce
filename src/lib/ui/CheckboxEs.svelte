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
/* .common-checkboxIndicator {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    position: absolute;
    top: 0;
    left: 0;
    width: 16px;
    height: 16px;
    border: 1px solid #c3c2c9;
    background: #fff;
    -webkit-border-radius: 2px;
    -moz-border-radius: 2px;
    border-radius: 2px;
    margin-top: 1px;
  }
  .common-customCheckbox {
    position: relative;
    cursor: pointer;
  }
  .common-customCheckbox input:checked ~ .common-checkboxIndicator {
    border: none;
    background: #ff3f6c;
  }
  .common-checkboxIndicator:after {
    content: '';
    position: absolute;
    top: 4px;
    left: 4px;
    width: 8px;
    height: 5px;
    border: 2px solid #fff;
    border-color: #fff;
    border-top-style: none;
    border-right-style: none;
    -webkit-transition: all 0.3s ease-in-out;
    -o-transition: all 0.3s ease-in-out;
    -moz-transition: all 0.3s ease-in-out;
    transition: all 0.3s ease-in-out;
    -webkit-transform: rotate(-45deg);
    -moz-transform: rotate(-45deg);
    -ms-transform: rotate(-45deg);
    -o-transform: rotate(-45deg);
    transform: rotate(-45deg);
  }
  label {
    line-height: 2;
    cursor: pointer;
  } */
</style>

<script>
import { createEventDispatcher } from 'svelte'

const dispatch = createEventDispatcher()

export let model,
	items = [],
	selectedItems = [],
	color = 'none',
	name = '',
	required = false,
	disabled = false,
	title = ''

let showAllList = false,
	noOfitems = 5,
	showSearchBox = false

function toggleShowAllList() {
	showAllList = !showAllList
	if (showAllList === false) {
		noOfitems = 5
	} else {
		noOfitems = items.length
	}
}
let searchTerm
$: filteredTerms = searchTerm
	? items.filter(
			(item) =>
				item.key?.toLowerCase().indexOf(searchTerm?.toLowerCase()) !== -1 ||
				item.key?.toLowerCase().indexOf(searchTerm?.toLowerCase()) !== -1
	  )
	: items

function handleSearchBox() {
	showSearchBox = !showSearchBox
	document.getElementById(`${title}searchText`).focus()
	if (!showSearchBox) {
		searchTerm = ''
		dispatch('go', { model, selectedItems })
	}
}
</script>

<div>
	{#if title}
		<div class="relative mb-3 flex items-center justify-between gap-4">
			{#if title}
				<h6 class="relative z-0 font-bold tracking-wide first-letter:uppercase">
					{title}
				</h6>
			{/if}

			<div class="absolute inset-x-0 right-0 z-10 flex h-8 justify-end">
				<div class="relative mb-3 h-8 rounded-full bg-gray-100 {showSearchBox ? 'w-full' : 'w-8'}">
					<input
						type="search"
						id="{title}searchText"
						placeholder="Search for {title}"
						class="h-8 w-full truncate rounded-full bg-transparent py-2 pl-4 pr-10 text-sm focus:outline-none"
						bind:value="{searchTerm}" />

					<button
						type="button"
						class="absolute inset-y-0 right-2 z-20 flex items-center justify-center text-gray-500 focus:outline-none"
						on:click="{handleSearchBox}">
						{#if !showSearchBox}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-4 w-4"
								viewBox="0 0 20 20"
								fill="currentColor">
								<path
									fill-rule="evenodd"
									d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
									clip-rule="evenodd"></path>
							</svg>
						{:else}
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-4 w-4"
								viewBox="0 0 20 20"
								fill="currentColor">
								<path
									fill-rule="evenodd"
									d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
									clip-rule="evenodd"></path>
							</svg>
						{/if}
					</button>
				</div>
			</div>
		</div>
	{:else}
		<div class="mb-3 flex h-8">
			<div class="relative mb-3 h-8 w-full rounded-md border bg-gray-100">
				<input
					type="search"
					id="{title || model}searchText"
					placeholder="Search for {title || model}..."
					class="h-8 w-full truncate rounded-full bg-transparent py-2 pl-4 pr-10 text-sm focus:outline-none"
					bind:value="{searchTerm}" />

				<button
					type="button"
					class="absolute inset-y-0 right-2 z-20 flex items-center justify-center text-gray-500 focus:outline-none"
					on:click="{handleSearchBox}">
					{#if !showSearchBox}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-4 w-4"
							viewBox="0 0 20 20"
							fill="currentColor">
							<path
								fill-rule="evenodd"
								d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
								clip-rule="evenodd"></path>
						</svg>
					{:else}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-4 w-4"
							viewBox="0 0 20 20"
							fill="currentColor">
							<path
								fill-rule="evenodd"
								d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
								clip-rule="evenodd"></path>
						</svg>
					{/if}
				</button>
			</div>
		</div>
	{/if}

	<ul class="lg:flex flex-col hidden">
		{#each filteredTerms as i, ix}
			{#if ix + 1 <= noOfitems}
				{#if i.key}
					<li>
						<label class="inline-flex items-center">
							<input
								type="checkbox"
								name="{name}"
								id="{i.key}"
								disabled="{disabled}"
								required="{required}"
								color="{color}"
								bind:group="{selectedItems}"
								value="{i.key}"
								on:change="{() => dispatch('go', { model, selectedItems })}"
								class="input-checkbox h-3.5 w-3.5 rounded-md border border-gray-200 bg-transparent text-primary-500" />

							<!-- {`${selectedItems.toString().search(i.key) === i.key}` ? 'font-medium' : 'font-normal'} -->

							<div class="ml-2 flex-1 text-sm leading-tight first-letter:uppercase">
								<span>{i.key}</span>

								<span class="text-xs text-gray-500">({i.doc_count})</span>
							</div>
						</label>
					</li>
				{/if}
			{/if}
		{/each}

		{#if filteredTerms.length > noOfitems}
			<button
				type="button"
				class="text-left text-sm font-semibold text-primary-500 hover:underline focus:outline-none"
				on:click="{toggleShowAllList}">
				See all
			</button>
		{:else if showAllList}
			<button
				type="button"
				class="text-left text-sm font-semibold text-primary-500 hover:underline focus:outline-none"
				on:click="{toggleShowAllList}">
				Close
			</button>
		{/if}
	</ul>

	<ul class="flex flex-col lg:hidden">
		{#each filteredTerms as i, ix}
			{#if i.key && i.doc_count > 0}
				<li>
					<label class="inline-flex items-center">
						<input
							type="checkbox"
							name="{name}"
							id="{i.key}"
							disabled="{disabled}"
							required="{required}"
							color="{color}"
							bind:group="{selectedItems}"
							value="{i.key}"
							on:change="{() => dispatch('go', { model, selectedItems })}"
							class="input-checkbox h-3.5 w-3.5 rounded-md border border-gray-200 bg-transparent text-primary-500" />

						<!-- {`${selectedItems.toString().search(i.key) === i.key}` ? 'font-medium' : 'font-normal'} -->

						<div class="ml-2 flex-1 text-sm leading-tight first-letter:uppercase">
							<span>{i.key}</span>

							<span class="text-xs text-gray-500">({i.doc_count})</span>
						</div>
					</label>
				</li>
			{/if}
		{/each}
	</ul>
</div>
