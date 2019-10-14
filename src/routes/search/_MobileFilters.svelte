<script>
  import Checkbox from "./../../components/ui/Checkbox.svelte";
  import Radio from "./../../components/ui/Radio.svelte";
  import { constructURL2 } from "./../../lib";
  import { goto, stores } from "@sapper/app";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  const { session, page } = stores();
  let query;
  page.subscribe(page => {
    query = page.query;
  });
  export let clear = Boolean,
    facets = [];
  let selected = "brands",
    loadingPrice = true, // Required because after loading finished then only we will initiate the price slider component
    showMobileFilter = true;
  function hide() {
    dispatch("hide");
  }
  function clearFilters() {
    dispatch("hide");
    let url = constructURL2("/search", {});
    goto(url);
  }
  function changed(e) {
    query[e.model] = e.checked;
    let url = constructURL("/search", query);
    goto(url);
  }
  function checkCategory() {}
  function go(slug) {
    goto("/" + slug);
  }
  function goCheckbox(e) {
    query[e.detail.model] = e.detail.selectedItems;
    let url = constructURL2("/search", query);
    goto(`${url}page=${query.page || 1}`);
  }
</script>

<style>
  .selected {
    color: purple;
    background-color: white;
    border-left: 4px solid purple;
  }
  ul > li {
    font: bold;
    color: gray;
    padding: 10px;
    font-size: 1.1rem;
  }
  /* .show-for-small-only {
  background: #f5f5f5;
  height: 1px;
  position: relative;
  top: 13px;
  margin-left: 15px;
  width: calc(100% + 16px);
} */
  ul > li {
    cursor: pointer;
    font-size: 1rem;
  }
</style>

{#if facets}
  <div
    class="py-2\1 bg-white-800 shadow bg-white w-screen top-0 left-0 fixed
    h-screen max-w-lg">
    <!-- Mobile version starts here -->

    <div class="block md:hidden h-full">
      <div class="flex shadow-md py-4 bg-white w-full">
        <div class="flex-1 text-gray-700 text-left" on:click={hide}>
          <i class="fa fa-times ml-2" aria-hidden="true" />
        </div>
        <div class="flex-1 text-gray-700 text-center font-bold">FILTER</div>
        <div
          class="flex-1 text-gray-700 text-right mr-2"
          on:click={clearFilters}>
          Clear all
        </div>
      </div>
      <div class="w-full flex mt-1 h-full">
        <div class="w-2/5 overflow-y-scroll">
          <ul class="bg-gray-200 h-full">
            <!-- <li
              on:click="{()=>selected='categories'}"
              class:selected={selected=='categories'}
            >
              Category
            </li> -->
            <li
              on:click={() => (selected = 'brands')}
              class:selected={selected == 'brands'}>
              Brands
            </li>
            <li
              on:click={() => (selected = 'colors')}
              class:selected={selected == 'colors'}>
              Colour
            </li>
            {#each facets.features && facets.features.name && facets.features.name.buckets && facets.features.name.buckets as f}
              {#if f.key != 'Color'}
                <li
                  on:click={() => (selected = f.key)}
                  class:selected={selected == f.key}>
                  {f.key}
                </li>
              {/if}
            {/each}
            <!-- <li
              on:click="{()=>selected='Price'}"
              class:selected={selected=='Price'}
            >
              Price
            </li> -->
          </ul>
        </div>
        <div class="w-full overflow-y-scroll">
          {#if selected == 'categories' && facets.categories && facets.categories.all && facets.categories.all.buckets}
            <Checkbox
              items={facets.categories.all.buckets}
              title="CATEGORY"
              model="categories"
              selectedItems={query.categories || []}
              on:go={goCheckbox} />
          {/if}
          {#if selected == 'brands' && facets.brands && facets.brands.all && facets.brands.all.buckets}
            <Checkbox
              items={facets.brands.all.buckets}
              title="BRANDS"
              model="brands"
              selectedItems={query.brands || []}
              on:go={goCheckbox} />
          {/if}
          {#if selected == 'colors' && facets.colors && facets.colors.colors && facets.colors.colors.name && facets.colors.colors.name.buckets && facets.colors.colors.name.buckets.length > 0}
            <Checkbox
              items={facets.colors.colors.name.buckets}
              title="COLOR"
              model="color"
              selectedItems={query.colors || []}
              on:go={goCheckbox} />
          {/if}
          {#if facets.features && facets.features.name && facets.features.name.buckets && facets.features.name.buckets.length > 0}
            {#each facets.features.name.buckets as v, k}
              {#if selected == v.key && v.key != 'Color' && v.val && v.val.buckets && v.val.buckets.length > 0}
                <Checkbox
                  items={v.val.buckets}
                  title={v.key.toUpperCase()}
                  model={v.key}
                  selectedItems={query[v.key] || []}
                  on:go={goCheckbox} />
              {/if}
            {/each}
          {/if}
        </div>
      </div>
      <div class="w-full text-center bg-purple-500 text-white absolute bottom-0">
        <button class="w-full p-4 cursor-pointer font-bold focus:outline-none">
          APPLY
        </button>
      </div>
    </div>
  </div>
{/if}
