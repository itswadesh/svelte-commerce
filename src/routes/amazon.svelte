<script>
  import { fadeIn, fadeOut } from "./../actions/pageFade";
  import Textbox from "./../components/ui/Textbox.svelte";
  import Textarea from "./../components/ui/Textarea.svelte";
  import { get, put, post } from "./../lib/api";
  import { onMount } from "svelte";
  import Product from "./../components/ProductNew.svelte";

  let amazonUrl = "",
    products = [];
  async function getData() {
    try {
      let res = await get("electronics/no/amazon");
      products = res.data;
    } catch (e) {
      console.log("err...", e.toString());
    }
  }
  onMount(async () => {
    await getData();
  });
</script>

<main in:fadeIn out:fadeOut style="min-height:94vh">
  <div class="mb-8 mx-2 lg:mx-64">
    <!-- <h1 class="text-5xl mt-8 text-center font-bold">
      <span class="underline">Amazon</span>
      Pricing
    </h1> -->
    <!-- <div>
      <form
        novalidate
        on:submit|preventDefault={submit}
        class="px-2 lg:px-24 flex flex-col leading-loose">
        <Textbox bind:value={amazonUrl} label="Url" />
      </form>
    </div> -->
    <div class="flex flex-wrap">
      {#each products as p}
        <Product product={p} on:update={getData} />
      {/each}
    </div>
  </div>
</main>
