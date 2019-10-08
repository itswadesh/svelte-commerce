<script>
  import { onMount } from "svelte";
  import { get, put, post } from "./../lib/api";
  let products = [],
    loading = false,
    pageSize,
    productCount;
  onMount(async () => {
    try {
      loading = true;
      const p = await get("electronics");
      pageSize = p.pageSize;
      productCount = p.count;
      products = p.data;
    } catch (e) {
    } finally {
      loading = false;
    }
  });
</script>

<div class="mt-15 mx-10">
  <h1 class="text-gray-800 text-2xl">i7 laptops</h1>
  <div>
    <ul class="flex">
      {#each products as p}
        <li class="h4 w-64 h-48 flex flex-col justify-center items-center">
          <img class="" src={p.imgUrls[0]['200x200']} alt="matebook" />
          <h3 class="text-gray-600">{p.name}</h3>
        </li>
      {/each}
    </ul>
  </div>
</div>
