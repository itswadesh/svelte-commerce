<script>
  import Checkbox from "./../../components/ui/Checkbox.svelte";
  import { constructURL2 } from "./../../lib";
  import { sorts } from "./../../config";
  import { goto, stores } from "@sapper/app";
  const { session, page } = stores();
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  export let sortBy = null,
    count = 0,
    showFilters = false,
    searchQuery = "";
  let query = {};
  page.subscribe(page => {
    query = page.query;
  });
  function sort() {
    query.sort = sortBy;
    let url = constructURL2("/search", query);
    goto(url);
  }
</script>

<div class="flex-none lg:flex justify-between px-2 py-2 text-sm items-center">
  <div class="font-semibold flex p-1">
    <h1 class="font-hairline">{count} laptops found</h1>
  </div>
  <div class="flex-wrap p-1 hidden md:block">
    <div class="text-sm">
      <div class="inline-block relative">
        <select
          bind:value={sortBy}
          class="text-black border-gray-100 cursor-pointer cursor-pointer block
          border border-gray-400 hover:border-gray-500 px-4 py-2
          focus:outline-none"
          on:change={sort}>
          {#each sorts as s, ix}
            <option class="bg-white" value={s.val}>{s.name}</option>
          {/each}
        </select>
        <div
          class="pointer-events-none absolute inset-y-0 right-0 flex
          items-center px-2 text-gray-700"
          aria-label="sort">
          <i class="fa fa-caret-down px-1" />
        </div>
      </div>
    </div>
  </div>
</div>
<div class="lg:hidden flex shadow-md py-4 w-full mb-1">
  <button
    class="flex-1 flex items-center text-left text-primary"
    on:click={() => dispatch('hide', !showFilters)}>
    <i class="fa fa-sliders-h px-3" />
    Filter
  </button>
  <div class="hidden md:block text-gray-700 text-center font-normal px-4">
    {count} laptops
  </div>
  <div class="text-gray-700 text-center px-4">
    <i class="fa fa-sort mr-2 text-primary" aria-hidden="true" />
    <select
      aria-label="sort"
      bind:value={sortBy}
      class="flex-1 text-primary border-gray-100 cursor-pointer border
      border-gray-400 hover:border-gray-500 px-4 py-2 focus:outline-none"
      on:change={sort}>
      {#each sorts as s, ix}
        <option class="bg-white" value={s.val}>{s.name}</option>
      {/each}
    </select>
  </div>
</div>
