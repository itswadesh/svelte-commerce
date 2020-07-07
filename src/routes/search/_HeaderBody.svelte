<script>
  import Checkbox from './../../components/ui/Checkbox.svelte'
  import { constructURL2 } from './../../lib'
  import { sorts } from './../../config'
  import { goto, stores } from '@sapper/app'
  const { session, page } = stores()
  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()
  export let sortBy = null,
    count = 0,
    showFilters = false
  let query = {}
  page.subscribe(page => {
    query = page.query
  })
  function sort() {
    query.sort = sortBy
    let url = constructURL2('/search', query)
    goto(url)
  }
</script>

<div class="items-center justify-between flex-none px-2 py-2 text-sm lg:flex">
  <div class="flex items-center justify-center p-1 mt-12 lg:mt-8">
    {#if !count}
      <div class="">Will just take a moment...</div>
    {:else}
      <div class="ml-4 ">
        <span class="font-bold ">{count}</span>
        <span class="font-thin">laptops found</span>
      </div>
    {/if}
  </div>
  <div class="flex-wrap hidden p-1 mt-4 md:block">
    <div class="text-sm">
      <div class="relative inline-block">
        <select
          bind:value={sortBy}
          class="block px-4 py-2 text-black border border-gray-100 cursor-pointer hover:border-gray-500 focus:outline-none"
          on:change={sort}>
          {#each sorts as s, ix}
            <option class="bg-white" value={s.val}>{s.name}</option>
          {/each}
        </select>
        <div
          class="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 pointer-events-none"
          aria-label="sort">
          <i class="px-1 fa fa-caret-down" />
        </div>
      </div>
    </div>
  </div>
</div>
<div class="flex w-full py-4 mb-1 shadow-md md:hidden">
  <button
    class="flex items-center flex-1 text-left text-primary"
    on:click={() => dispatch('hide', !showFilters)}>
    <i class="px-3 fa fa-sliders-h" />
    Filter
  </button>
  <div class="hidden px-4 font-normal text-center text-gray-700 md:block">
    {count} laptops
  </div>
  <div class="px-4 text-center text-gray-700">
    <i class="mr-2 fa fa-sort text-primary" aria-hidden="true" />
    <select
      aria-label="sort"
      bind:value={sortBy}
      class="flex-1 px-4 py-2 border border-gray-400 cursor-pointer text-primary hover:border-gray-500 focus:outline-none"
      on:change={sort}>
      {#each sorts as s, ix}
        <option class="bg-white" value={s.val}>{s.name}</option>
      {/each}
    </select>
  </div>
</div>
