<script>
  export let count
</script>

<div class="flex overflow-hidden">
  {#each Array(count) as _, i}
    <div class="flex flex-col w-1/2 h-56 px-2 pb-2 mt-2 lg:w-1/4">
      <div class="h-48 bg-gray-100 lg:p-2" style="min-width:150px;" />
      <div class="h-6 p-1 mt-2 text-center bg-gray-100 text-1" />
    </div>
  {/each}
</div>
