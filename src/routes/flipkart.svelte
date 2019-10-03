<script>
  import { get, put, post } from "./../lib/api";
  import { goto, stores } from "@sapper/app";
  import Textbox from "./../components/ui/Textbox.svelte";
  import Button from "./../components/ui/Button.svelte";
  let sku = "",
    product = {};
  async function getFromFlipkart() {
    try {
      product = await get("electronics/flipkart/" + sku);
    } catch (e) {
      console.log("err...", e.toString());
    }
  }
  async function submit() {
    try {
      product = await put("electronics/" + product._id, product);
      goto("/" + product.slug + "?id=" + product._id);
    } catch (e) {
      console.log("err...", e.toString());
    }
  }
</script>

<div class="m-5">
  <Textbox label="SKU" bind:value={sku} />
  <Button on:click={getFromFlipkart} text="Grab From Flipkart" />
  {#if product.variants}
    {product.name}
    <br />
    <form on:submit|preventDefault={submit}>
      <input
        class="text-base text-base rounded-sm pb-4 border-b-2
        hover:border-pink-500 shadow-md pt-3 pl-1"
        placeholder="Price"
        bind:value={product.variants[0].price} />
      <button
        on:click={getFromFlipkart}
        class="uppercase bg-pink-500 width text-white h-10 rounded">
        Save
      </button>
    </form>
  {/if}
  <br />
</div>
