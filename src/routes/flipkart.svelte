<script>
  import { get, put, post } from "./../lib/api";
  import { goto, stores } from "@sapper/app";
  import Textbox from "./../components/ui/Textbox.svelte";
  import Button from "./../components/ui/Button.svelte";
  import { currency } from "./../lib";

  let sku = "",
    product = {},
    q = "",
    products = [];
  async function getFromFlipkart(sku) {
    try {
      product = await get("electronics/flipkart/" + sku);
    } catch (e) {
      console.log("err...", e.toString());
    }
  }
  async function searchFromFlipkart() {
    try {
      products = await get("electronics/flipkart/search?q=" + q);
    } catch (e) {
      console.log("err...", e.toString());
    }
  }
  // async function submit() {
  //   try {
  //     product = await put("electronics/" + product._id, product);
  //     goto("/" + product.slug + "?id=" + product._id);
  //   } catch (e) {
  //     console.log("err...", e.toString());
  //   }
  // }
</script>

<div class="m-5">
  <div class="flex">
    <Textbox label="SKU" bind:value={sku} cls="flex-1" />
    <Button rounded={true} on:click={() => getFromFlipkart(sku)}>
      Fetch From Flipkart
    </Button>
  </div>
  {#if product && product.name}
    {product.name}
    <br />
    <!-- <form on:submit|preventDefault={submit}>
      <input
        class="text-base text-base rounded-sm pb-4 border-b-2
        hover:border-purple-500 shadow-md pt-3 pl-1"
        placeholder="Price"
        bind:value={product.price} />
      <button
        on:click={getFromFlipkart}
        class="uppercase bg-purple-500 width text-white h-10 rounded">
        Save
      </button>
    </form> -->
  {/if}
  <br />
  <form
    class="flex"
    novalidate
    autocomplete="off"
    on:submit|preventDefault={searchFromFlipkart}>
    <Textbox label="Search" bind:value={q} cls="flex-1" />
    <Button rounded={true} size="xl">Search From Flipkart</Button>
  </form>
  {#if products && products.length > 0}
    <div class="flex flex-wrap">
      {#each products as p}
        <div class="m-2 p-2 border border-gray-400 w-64">
          <img src={p.productBaseInfoV1.imageUrls['200x200']} alt="" />
          {p.productBaseInfoV1.productBrand} - {p.productBaseInfoV1.title}
          <!-- <li>SKU: {p.productBaseInfoV1.productId}</li> -->
          Deal Price:
          <b>{currency(p.productBaseInfoV1.flipkartSpecialPrice.amount)}</b>
          <del>{currency(p.productBaseInfoV1.flipkartSellingPrice.amount)}</del>
          <del>{currency(p.productBaseInfoV1.maximumRetailPrice.amount)}</del>
          <!-- <li>Link: {p.productBaseInfoV1.productUrl}</li> -->
          <Button
            rounded={true}
            on:click={() => getFromFlipkart(p.productBaseInfoV1.productId)}>
            Fetch
          </Button>
        </div>
      {/each}
    </div>
  {/if}
</div>
