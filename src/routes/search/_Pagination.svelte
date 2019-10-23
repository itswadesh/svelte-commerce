<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  export let count = 10,
    current = 1;
  count = parseInt(count);
  if (count > 10) count = 10;
</script>

<style>
  /* .active {
    @apply bg-black font-medium text-white tracking-wide rounded-sm;
  } */
  .pagination-container {
    list-style: none;
    text-align: center;
    border-top: 1px solid #edebef;
    padding: 20px 0px;
    color: #282c3f;
  }
  .pagination-paginationMeta {
    color: #535766;
    font-size: 14px;
    float: left;
    margin: 10px;
    cursor: default;
    font-weight: 400;
  }
</style>

<div class="flex flex-row w-full px-1">
  <div
    class="flex-1 pagination-container justify-start w-full text-xs lg:text-sm">
    <div class="pagination-paginationMeta w-full lg:w-auto">
      Page {current} of {count}
    </div>
    <div class="flex-1 justify-start w-full lg:w-auto">
      {#if current > 1}
        <button
          class="lg:mx-5 bg-white hover:bg-gray-100 text-gray-800 font-semibold
          lg:py-2 p-2 lg:px-4 border border-gray-400 rounded shadow rounded
          inline-flex items-center"
          on:click={() => dispatch('change', current - 1)}>
          <i class="fa fa-caret-left" />
          &nbsp;
          <span>Previous</span>
        </button>
      {/if}
      {#each { length: count } as _, i}
        <div
          class="lg:py-2 lg:px-3 py-2 px-1 lg:mx-2"
          class:active={current === i}
          on:click={() => dispatch('change', i + 1)}>
          {i + 1}
        </div>
      {/each}
      <button
        class="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4
        border border-gray-400 rounded shadow rounded inline-flex items-center"
        on:click={() => dispatch('change', current + 1)}>
        <span>Next</span>
        &nbsp;
        <i class="fa fa-caret-right" />
      </button>
    </div>
  </div>
</div>
