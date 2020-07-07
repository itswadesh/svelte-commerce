<script>
  import Checkbox from './../../components/ui/Checkbox.svelte'
  import Radio from './../../components/ui/Radio.svelte'
  import { constructURL2 } from './../../lib'
  import { goto, stores } from '@sapper/app'
  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()
  const { session, page } = stores()
  let query
  page.subscribe(page => {
    query = page.query
  })
  export let facets = []
  let selected = 'brands',
    loadingPrice = true, // Required because after loading finished then only we will initiate the price slider component
    showMobileFilter = true
  function hide() {
    dispatch('hide')
  }
  function clearFilters() {
    dispatch('hide')
    let url = constructURL2('/search', {})
    goto(url)
  }
  function changed(e) {
    query[e.model] = e.checked
    let url = constructURL('/search', query)
    goto(url)
  }
  function checkCategory() {}
  function go(slug) {
    goto('/' + slug)
  }
  function goCheckbox(e) {
    query[e.detail.model] = e.detail.selectedItems
    let url = constructURL2('/search', query)
    goto(`${url}page=${query.page || 1}`)
  }
  let features = [
    'Processor Brand',
    'Processor Name',
    'Screen Size',
    'RAM',
    'Touchscreen',
    'RAM Type',
    'Screen Resolution',
    'SSD',
    'Processor Generation',
    'Keyboard',
    'Weight',
    'HDD Capacity',
    'Mic In',
    'Battery Backup',
    'Expandable Memory',
    'SSD Capacity',
    'Finger Print Sensor',
    'Backlit Keyboard',
    'NFC Support',
    'Face Recognition',
    'Optane Memory'
  ]
  function checkFeature(k) {
    return features.includes(k)
  }
  function stringToArray(v) {
    let a = (query[v.key] && query[v.key].split(',')) || []
    return a
  }
</script>

<style>
  .selected {
    color: #da1c5f;
    background-color: white;
    border-left: 4px solid #da1c5f;
  }
  ul > li {
    font: bold;
    color: gray;
    padding: 10px;
    font-size: 1.1rem;
  }
  ul > li {
    font: bold;
    color: gray;
    padding: 10px;
    font-size: 1.1rem;
  }
</style>

{#if facets}
  <div
    class="py-2\1 bg-white-800 shadow bg-white w-screen top-0 left-0 fixed
    h-screen max-w-lg">
    <!-- Mobile version starts here -->

    <div class="block h-full md:hidden">
      <div class="flex w-full py-4 bg-white shadow-md">
        <div class="flex-1 text-left text-gray-700" on:click={hide}>
          <i class="ml-2 fa fa-times" aria-hidden="true" />
        </div>
        <div class="flex-1 font-bold text-center text-gray-700">FILTER</div>
        <div
          class="flex-1 mr-2 text-right text-gray-700"
          on:click={clearFilters}>
          Clear all
        </div>
      </div>
      <div class="flex w-full h-full mt-1">
        <div class="w-2/5 overflow-y-scroll">
          <ul class="h-full bg-gray-200">
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
              {#if checkFeature(f.key)}
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
                  selectedItems={stringToArray(v)}
                  on:go={goCheckbox} />
              {/if}
            {/each}
          {/if}
        </div>
      </div>
      <div class="absolute bottom-0 w-full text-center primary">
        <button
          class="w-full p-4 font-bold cursor-pointer focus:outline-none"
          on:click={hide}>
          APPLY
        </button>
      </div>
    </div>
  </div>
{/if}
