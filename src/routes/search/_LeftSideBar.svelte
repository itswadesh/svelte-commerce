<script>
  import Checkbox from "./../../components/ui/Checkbox.svelte";
  import Radio from "./../../components/ui/Radio.svelte";
  import { constructURL } from "./../../lib";
  import { goto, stores } from "@sapper/app";
  const { session, page } = stores();
  export let clear = false,
    fl = {},
    facets = {},
    query = {},
    loadingPrice = true; // Required because after loading finished then only we will initiate the price slider component

  page.subscribe(({ query }) => {
    query = query;
  });
  function categoryChanged(i) {
    console.error("categoryChanged", i);
  }
  function changed(e) {
    this.fl[e.model] = e.checked;
    let url = constructURL("/search", this.fl);
    goto(url);
  }
  function remove(k, i) {
    let ix = this.fl[k].indexOf(i);
    this.fl[k].splice(ix, 1);
    let url = constructURL("/search", this.fl);
    goto(url);
  }
  function checkCategory() {}
  function go(slug) {
    goto("/" + slug);
  }
</script>

<style>
  .filter-container {
    max-height: 400px;
    overflow: auto;
  }
</style>

<div class="py-6 w-1/5">
  <div
    class="font-bold flex justify-between md:px-3 lg:px-4 items-center pt-3
    text-sm md:text-xs"
    style="margin-top:1px;">
    <div class="text-gray">FILTERS</div>
    <div class="text-right text-pink-500 cursor-pointer">CLEAR ALL</div>
  </div>
  {#each fl as v, k}
    {#if v && v.length > 0 && k != 'page' && k != 'sort'}
      <div class="flex flex-wrap items-center text-xs">
        {#each v as i, ix}
          <div class="rnd-mnt">
            {i}
            <i
              class="fa fa-times cursor-pointer ml-1"
              aria-hidden="true"
              on:click={remove(k, i)} />
          </div>
        {/each}
      </div>
    {/if}
  {/each}
  {#if facets.categories && facets.categories.all.buckets && facets.categories.all.buckets.length > 0}
    <div>
      <p class="ml-2 py-2 font-semibold text-sm px-2">CATEGORY</p>
      <ul class="ml-2 py-2 px-2 filter-container">
        {#each facets.categories && facets.categories.all.buckets as b}
          <li>
            <Checkbox count={b.doc_count} value={b.key}>{b.key}</Checkbox>
          </li>
        {/each}
      </ul>
    </div>
  {/if}
  {#if facets.brands && facets.brands.all.buckets && facets.brands.all.buckets.length > 0}
    <div>
      <p class="ml-2 py-2 font-semibold text-sm px-2">BRAND</p>
      <ul class="ml-2 py-2 px-2 filter-container">
        {#each facets.brands && facets.brands.all.buckets as b}
          <li>
            <Checkbox count={b.doc_count} value={b.key}>{b.key}</Checkbox>
          </li>
        {/each}
      </ul>
    </div>
  {/if}
  {#if facets.sizes && facets.sizes.all.buckets && facets.sizes.all.buckets.length > 0}
    <div>
      <p class="ml-2 py-2 font-semibold text-sm px-2">SIZES</p>
      <ul class="ml-2 py-2 px-2 filter-container">
        {#each facets.sizes && facets.sizes.all.buckets as b}
          <li>
            <Checkbox count={b.doc_count} value={b.key}>{b.key}</Checkbox>
          </li>
        {/each}
      </ul>
    </div>
  {/if}
  <!-- {#each facets.features && facets.features.name && facets.features.name.buckets as v, k}
    {#if v.key != 'Color' && v.val && v.val.buckets && v.val.buckets.length > 0}
      <div>
        <p class="ml-2 py-2 font-semibold text-sm px-2">{v.key}</p>
        <ul class="ml-2 py-2 px-2 filter-container">
          {#each v.val.buckets as f}
            <li>
               <Checkbox
            count="{f.doc_count}"
            value="{f.key}"
          >{f.key}</Checkbox>
            </li>
          {/each}
        </ul>
      </div>
    {/if}
  {/each} -->
  {#if facets.colors && facets.colors.colors && facets.colors.colors.name && facets.colors.colors.name.buckets && facets.colors.colors.name.buckets.length > 0}
    <div>
      <p class="ml-2 py-2 font-semibold text-sm px-2">COLOR</p>
      <ul class="ml-2 py-2 px-2 filter-container">
        {#each facets.colors && facets.colors.colors && facets.colors.colors.name && facets.colors.colors.name.buckets as b}
          <li class="colour-listItem">
            <Checkbox
              color={b.val.buckets[0] && b.val.buckets[0].key}
              count={b.doc_count}
              value={b.key}>
              {b.key}
            </Checkbox>
          </li>
        {/each}
      </ul>
    </div>
  {/if}
</div>
