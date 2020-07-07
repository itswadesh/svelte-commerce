<script>
  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()
  export let count = 10,
    current = 1
  count = parseInt(count)
  $: pages = count > 10 ? 10 : count
</script>

<style>
  .active {
    color: #fff;
    background-color: #282c3f;
  }
</style>

{#if count > 1}
  <div class="flex items-center justify-between">
    <div class="items-center text-gray-500">Page {current} of {count}</div>
    <div class="flex items-center justify-center flex-1 text-center">
      {#if current > 1}
        <button
          class="inline-flex items-center p-2 font-semibold text-gray-800 bg-white border border-gray-400 rounded-full shadow lg:mx-5 hover:bg-gray-100 lg:py-2 lg:px-4"
          on:click={() => dispatch('change', current - 1)}>
          <i class="fa fa-caret-left" />
          &nbsp;
          <span>Previous</span>
        </button>
      {/if}
      {#each { length: pages } as _, i}
        <button
          class="w-8 h-8 px-2 py-1 border rounded-full lg:mx-2 hover:border-gray-500"
          class:active={current === i + 1}
          on:click={() => dispatch('change', i + 1)}>
          {i + 1}
        </button>
      {/each}
      {#if current < count}
        <button
          class="inline-flex items-center p-2 font-semibold text-gray-800 bg-white border border-gray-400 rounded-full shadow lg:mx-5 hover:bg-gray-100 lg:py-2 lg:px-4"
          on:click={() => dispatch('change', current + 1)}>
          <span>Next</span>
          &nbsp;
          <i class="fa fa-caret-right" />
        </button>
      {/if}
    </div>
  </div>
{/if}
