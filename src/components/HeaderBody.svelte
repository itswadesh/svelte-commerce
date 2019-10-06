<script>
  import Checkbox from "./ui/Checkbox.svelte";
  import { constructURL2 } from "./../lib";
  import { sorts } from "./../config";
  import { goto, stores } from "@sapper/app";
  const { session, page } = stores();

  export let sortBy = null,
    count = 0,
    showFilters = false;
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

<div class="flex-none lg:flex justify-between px-2 py-6 text-sm items-center">
  <div class="font-semibold flex p-1">
    <div class="font-hairline">{count} laptops found</div>
  </div>
  <div class="flex-wrap p-1 hidden md:block">
    <div class="text-sm">
      <div class="inline-block relative">
        <select
          bind:value={sortBy}
          class="text-black border-gray-100 cursor-pointer cursor-pointer block
          appearance-none bg-white border border-gray-400 hover:border-gray-500
          px-4 py-2 pr-8 leading-tight focus:outline-none focus:none"
          on:change={sort}>
          {#each sorts as s, ix}
            <option class="bg-white" value={s.val}>{s.name}</option>
          {/each}
        </select>
        <div
          class="pointer-events-none absolute inset-y-0 right-0 flex
          items-center px-2 text-gray-700">
          <i class="fa fa-caret-down px-1" />
        </div>
      </div>
    </div>
  </div>
</div>
<div class="xs:block lg:hidden flex shadow-md py-4 bg-white w-full mb-1">
  <div
    class="flex-1 text-gray-700 text-left text-pink-500"
    on:click={() => (showFilters = !showFilters)}>
    <i class="fa fa-sliders px-3 mr-2" aria-hidden="true" />
    Filter
  </div>
  <div class="flex-1 text-gray-700 text-center font-normal px-4">
    {count} laptops
  </div>
  <div class="flex-1 text-gray-700 text-center px-4 text-pink-500">
    <i class="fa fa-sort mr-2" aria-hidden="true" />
    Sort
  </div>
</div>
