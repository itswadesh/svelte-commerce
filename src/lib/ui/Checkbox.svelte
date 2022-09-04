<style>
.filter-container {
	max-height: 400px;
	overflow: auto;
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

let show = true
let showit = true
function goto(url) {}
function toggle() {
	show = !show
}
function Showit() {
	showit
}
function changed() {
	dispatch('change', model)
}
function clearFilters() {
	let url = '/stores'
	goto(url)
}
function selectallFilters() {}
</script>

<div class="border-graey-300 border-b pl-3 pb-3">
	{#if title}
		<div class="flex items-center justify-between pr-3">
			<div
				on:click="{toggle}"
				on:mouseenter="{Showit}"
				class="flex w-full cursor-pointer items-center justify-between">
				<h5 class="mr-2 text-sm font-semibold ">
					{title}
				</h5>

				{#if show}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						viewBox="0 0 20 20"
						fill="currentColor">
						<path
							fill-rule="evenodd"
							d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
							clip-rule="evenodd"></path>
					</svg>
				{:else}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
					</svg>
				{/if}
			</div>

			<!-- {#if showit}
				<div>
					<h5 class="text-xs flex items-center gap-2">
        		  <button
        		    on:click={selectallFilters}
        		    class="border-r pr-2 border-blue-500 text-purple-500 cursor-pointer hover:underline focus:outline-none"
        		  >
        		    Select All
        		  </button>
        		  <button
        		    on:click={clearFilters}
        		    class="text-purple-500 cursor-pointer hover:underline focus:outline-none"
        		  >
        		    Clear All
        		  </button>
        		</h5> 
				</div>
			{/if} -->
		</div>
	{/if}

	{#if show}
		<ul class="filter-container mostly-customized-scrollbar mt-2 flex flex-col gap-2">
			{#each items as i}
				{#if i}
					<li>
						<label class="flex items-start gap-1">
							<input
								type="checkbox"
								name="{name}"
								disabled="{disabled}"
								required="{required}"
								color="{color}"
								bind:group="{selectedItems}"
								value="{i._source.slug}"
								on:change="{() => dispatch('go', { model, selectedItems })}"
								class="mt-0.5 h-4 w-4 flex-shrink-0 focus:ring-0 focus:ring-offset-0" />

							<div class="flex flex-1 flex-wrap items-center">
								<span class="flex-1 text-sm text-gray-800">{i._source.name}</span>
							</div>
						</label>
					</li>
				{/if}
			{/each}
		</ul>
	{/if}
</div>
