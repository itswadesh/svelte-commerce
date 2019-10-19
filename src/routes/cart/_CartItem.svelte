<script>
  import CartButtons from "./_CartButtons.svelte";
  import { currency } from "./../../lib";
  import { cart } from "./../../store/cart.js";

  // import { stores } from "@sapper/app";
  // const { session } = stores();
  export let item = {};
  let loading = false;

  async function addToBag({ pid, vid, qty }) {
    if (!vid) {
      console.log("Please select a size");
    } else {
      loading = true;
      await cart.add({ pid, vid, qty });
      loading = false;
    }
  }

  async function checkAndAddToCart(item) {
    try {
      loading = true;
      await cart.setCart(item);
      loading = false;
    } catch (e) {
      console.log("err...", e.toString());
    }
  }
  function calculateOffPercent(mrp, price) {
    let percent = ((mrp - price) * 100) / mrp;
    return Math.round(percent);
  }
</script>

<div class="flex justify-between pt-5 pb-5 border-b border-gray-300">
  <div class="w-1/2 lg:w-1/3">
    <div>
      <img
        class="lg:rounded xs:rounded-b-none w-64"
        src="/3px.png"
        data-src={item.product.img}
        alt="product image" />
      <!-- <div class="lg:hidden xs:visible text-black p-2 bg-gray-300 rounded rounded-t-none">Arrives 19 Sep</div> -->
    </div>
  </div>
  <div class="lg:w-4/5 right-0 xs:9/12">
    <div class="pl-4 font-hairline">
      <p class="text-black mb-2">
        <a href={`/${item.product.slug}?id=${item.product._id}`}>
          {item.product.name}
        </a>
      </p>
      <div class="flex">
        <p class="text-gray-500 mb-2">
          <span>Size:</span>
          {item.variant.size}
        </p>
        <span class="inline-block rounded-full bg-gray-300 h-2 w-2 m-2" />
        {#if item.variant.stock < 5}
          <span style="color: rgb(237, 113, 0);">
            {item.variant.stock} left
          </span>
        {/if}
      </div>
      <p class="relative mb-2">
        <span class="text-black font-bold mb-2 text-2xl">
          {currency(item.variant.price)}
        </span>
        {#if calculateOffPercent(item.variant.mrp, item.variant.price) > 0}
          <span class="text-gray-400 line-through ml-2 text-xs lg:text-sm">
            {currency(item.variant.mrp)}
          </span>
          <span class="ml-2 text-green-400 text-xs lg:text-sm">
            {calculateOffPercent(item.variant.mrp, item.variant.price)}% off
          </span>
        {/if}
      </p>
      <div class="justify-between text-sm">
        <div class="flex flex-wrap">
          <div class="w-full lg:w-3/5 my-2">
            <CartButtons
              pid={item.product._id}
              vid={item.variant._id}
              qty={item.qty} />
          </div>
          <div class="w-full lg:w-2/5 text-right my-2">
            <div class="flex text-xs">
              <button class="mr-1 focus:outline-none primary rounded p-1">
                MOVE TO WISHLIST
              </button>
              <button
                class="ml-3 muted rounded py-2 px-3"
                on:click={() => addToBag({
                    pid: item.product._id,
                    vid: item.variant._id,
                    qty: -10000
                  })}
                disabled={loading}>
                {#if loading}
                  <img
                    src="/loading.svg"
                    class="w-3 h-3 rotateOutDownLeft"
                    alt="loading icon" />
                {:else}
                  <i class="fa fa-trash" />
                {/if}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
