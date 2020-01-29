<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  export let count = 10,
    current = 1;
  count = parseInt(count);
  $: pages =(count > 10) ? 10 : count;
</script>

<style>
  .active {
    color: #fff;
    background-color: #282c3f;
  }
</style>
{#if count>1}
<div class="flex justify-between items-center">
  <div class="text-gray-500 items-center">Page {current} of {count}</div>
  <div class="flex-1 flex items-center text-center justify-center">
    {#if current > 1}
      <button
        class="lg:mx-5 bg-white hover:bg-gray-100 text-gray-800 font-semibold
        lg:py-2 p-2 lg:px-4 border border-gray-400 rounded shadow rounded-full
        inline-flex items-center"
        on:click={() => dispatch('change', current - 1)}>
        <i class="fa fa-caret-left" />
        &nbsp;
        <span>Previous</span>
      </button>
    {/if}
    {#each { length: pages } as _, i}
      <button
        class="py-1 px-2 lg:mx-2 w-8 h-8 rounded-full border
        hover:border-gray-500"
        class:active={current === i + 1}
        on:click={() => dispatch('change', i + 1)}>
        {i + 1}
      </button>
    {/each}
    {#if current < count}
      <button
        class="lg:mx-5 bg-white hover:bg-gray-100 text-gray-800 font-semibold
        lg:py-2 p-2 lg:px-4 border border-gray-400 rounded-full shadow rounded
        inline-flex items-center"
        on:click={() => dispatch('change', current + 1)}>
        <span>Next</span>
        &nbsp;
        <i class="fa fa-caret-right" />
      </button>
    {/if}
  </div>
</div>
{/if}
