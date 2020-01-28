<script>
  import { get, put, post } from "./../lib/api";
  import { currency } from "./../lib";
  import { createEventDispatcher } from "svelte";
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

<button class="w-1/2 lg:w-1/3 xl:w-1/4 px-3 mb-4">
  <div class="relative pb-5/6">
    <img
      v-if="product._source.img"
      src={product.imgUrls[0]['400x400']}
      alt=""
      class="absolute h-full w-full object-contain rounded-lg shadow-md" />
  </div>
  <div class="relative px-4 -mt-8 w-full">
    <div class="bg-white p-6 rounded-lg shadow-lg">
      <h4 class="mt-2 text-sm leading-tight truncate">
        <input type="text" bind:value={product.name} class="w-full" />
      </h4>
      <div class="mt-2 flex">
        <div>{currency(product.flipkart.price)}</div>
        <div>
          <input
            type="text"
            bind:value={product.amazonUrl}
            class="w-full font-bold text-xs" />
        </div>
        <button type="button" on:click={() => submit(product)}>
          <i class="fa fa-save" />
        </button>
      </div>
    </div>
  </div>
</button>
