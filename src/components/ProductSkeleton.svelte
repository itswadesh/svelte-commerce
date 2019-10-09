<script>
  export let count;
</script>

<div class="flex overflow-hidden">
  {#each Array(count) as _, i}
    <div class="flex flex-col px-2 pb-2 w-1/2 lg:w-1/4 mt-2 h-56">
      <div class="h-48 lg:p-2 bg-gray-100" style="min-width:150px;" />
      <div class="mt-2 p-1 text-center text-1 bg-gray-100 h-6" />
    </div>
  {/each}
</div>
