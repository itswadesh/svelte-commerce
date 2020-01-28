<script>
  import { get, put, post } from "./../lib/api";
  import { createEventDispatcher } from "svelte";
  import { lazyload } from "./../actions/lazyload";
  import { currency } from "./../lib";
  import { stores } from "@sapper/app";
  const { session } = stores();
  const dispatch = createEventDispatcher();
  export let product = {};
  async function submit(product) {
    try {
      // product = await patch("electronics/" + product.id, product);
      product = await post("electronics/amazon", product);
      dispatch("update");
    } catch (e) {
      console.log("err...", e.toString());
    }
  }
</script>

<div class="w-full md:w-1/2 lg:w-1/3 px-3 mb-4">
  <div class="relative pb-5/6">
    {#if product.img}
      <img
        use:lazyload
        src={$session.settings.CDN_URL + product.img[0] + '?tr=w-3,h-2'}
        data-src={$session.settings.CDN_URL + product.img[0] + '?tr=w-300,h-200'}
        alt=""
        class="absolute h-full w-full object-contain rounded-lg shadow-md" />
    {/if}
    <a
      class="absolute right-0 top-0 mr-2 mt-2"
      rel="prefetch"
      href={`/${product.slug}?id=${product._id}`}>
      <i class="fa fa-eye" />
    </a>
  </div>
  <div class="relative px-4 -mt-8 w-full">
    <div class="bg-white p-6 rounded-lg shadow-lg">
      <h4 class="mt-2 text-xs">
        <code>{product.name}</code>
      </h4>
      <div class="mt-2 flex w-full">
        <div>{currency(product.flipkart.price)}</div>
        <div>
          <input type="text" bind:value={product.amazonUrl} class="mx-8" />
        </div>
        <button type="button" on:click={() => submit(product)}>
          <i class="fa fa-save" />
        </button>
      </div>
    </div>
  </div>
</div>
