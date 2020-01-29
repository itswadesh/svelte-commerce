<script>
  import Button from "./../../components/ui/Button.svelte";
  import { currency } from "./../../lib";
  import { cart } from "./../../store/cart.js";
  import { goto } from "@sapper/app";
  export let product = {};
  function calculateOffPercent(price, mrp) {
    let percent = ((mrp - price) * 100) / mrp;
    return Math.round(percent);
  }
  function addToCart(qty) {
    cart.add({ pid: product._id, vid: product.variants[0]._id, qty });
    goto("/cart");
  }
</script>

<div class="w-full md:w-6/12 lg:w-7/12 leading-relaxed">
  <div class="pb-4 border-b border-gray-200 px-3">
    <p class="text-2xl text-gray-700 font-semibold">{product.brandName}</p>
    <p class="leading-loose">{product.name}</p>
  </div>
  {#if product}
    <div class="flex flex-wrap">
      {#if product.flipkart}
        <div class=" text-gray-700 py-3">
          <div class="flex items-center px-3 font-semibold tracking-wider">
            <span class="text-lg mr-2">
              <img src="/flipkart-512.png" alt="" class="w-8" />
            </span>
            <span class="text-lg mr-2">
              {currency(product.flipkart.specialPrice || product.flipkart.price)}
              {#if product.flipkart.shippingCharge}
                +{currency(product.flipkart.shippingCharge)}
              {/if}
            </span>
            {#if product.flipkart.mrp > (product.flipkart.specialPrice || product.flipkart.price)}
              <span class="font-hairline line-through mr-2">
                {currency(product.flipkart.mrp)}
              </span>
            {/if}
            {#if calculateOffPercent(product.flipkart.specialPrice || product.flipkart.price, product.flipkart.mrp) > 0}
              <span class="text-orange-500 text-xs">
                ({calculateOffPercent(product.flipkart.specialPrice || product.flipkart.price, product.flipkart.mrp)}%
                OFF)
              </span>
            {/if}
          </div>
          <div class="pl-3">3 day delivery</div>
        </div>
      {/if}
      {#if product.amazon}
        <div class=" text-gray-700 py-3">
          <div class="flex items-center px-3 font-semibold tracking-wider">
            <span class="text-lg mr-2">
              <i class="fab fa-amazon mt-2" />
            </span>
            <span class="text-lg mr-2">
              {currency(product.amazon.specialPrice || product.amazon.price)}
            </span>
            {#if product.amazon.mrp > (product.amazon.specialPrice || product.amazon.price)}
              <span class="font-hairline line-through mr-2">
                {currency(product.amazon.mrp)}
              </span>
            {/if}
            {#if calculateOffPercent(product.amazon.specialPrice || product.amazon.price, product.amazon.mrp) > 0}
              <span class="text-orange-500 text-xs">
                ({calculateOffPercent(product.amazon.specialPrice || product.amazon.price, product.amazon.mrp)}%
                OFF)
              </span>
            {/if}
          </div>
          <br />
          <div class="pl-3">3 day delivery</div>
        </div>
      {/if}
      {#if product.localPrice}
        <div class=" py-3 text-green-700">
          <div class="flex items-center px-3 font-semibold tracking-wider">
            <span class="text-lg mr-2">
              <i class="fas fa-store mt-2" />
            </span>
            <span class="text-lg mr-2">{currency(product.localPrice)}</span>
            {#if product.flipkart.mrp > product.localPrice}
              <span class="font-hairline line-through mr-2">
                {currency(product.flipkart.mrp)}
              </span>
            {/if}
            {#if calculateOffPercent(product.localPrice, product.flipkart.mrp) > 0}
              <span class="text-orange-500 text-xs">
                ({calculateOffPercent(product.localPrice, product.flipkart.mrp)}%
                OFF)
              </span>
            {/if}
          </div>
          <div class="pl-3">same day delivery</div>
        </div>
      {/if}
    </div>
  {/if}
  <div>
    <div
      class="flex mt-4 fixed bottom-0 lg:relative bg-white lg:px-3 p-2 w-full"
      style="z-index:9999;">
      {#if product.amazonUrl}
        <a
          target="blank"
          href={product.amazonUrl}
          class="w-full lg:mx-64 text-center items-center justify-center h-14
          text-2xl outline-none font-bold mr-2 py-2 rounded primary">
          Get it from
          <i class="fab fa-amazon mt-2" />
        </a>
      {:else if product.flipkart && product.flipkart.price}
        <a
          target="blank"
          href={product.productUrl}
          class="flex w-full lg:mx-64 text-center items-center justify-center
          h-14 text-2xl outline-none font-bold mr-2 py-2 rounded primary">
          Get it from
          <img src="/flipkart-512.png" alt="" class="w-8" />
        </a>
      {:else if product.localPrice}
        <button
          target="blank"
          on:click={() => addToCart(1)}
          class="w-full lg:mx-64 items-center w-1/2 lg:w-1/3 bg-white border
          border-red-600 text-primary py-2 px-3 rounded font-bold lg:text-lg
          text-2xl text-center">
          Add to cart
          <i class="fas fa-shopping-cart" />
        </button>
      {/if}
    </div>
    <div class="py-4 border-b border-gray-300 px-3">
      <h4 class="font-bold text-xl">Top Features</h4>
      <ul class="text-xs">
        {#if product.keyFeatures}
          {#each product.keyFeatures as k}
            <li
              class="w-full inline lg:w-3/5 pr-3 hover:text-gray-600
              tracking-widest leading-loose">
              &bull; {k}
            </li>
          {/each}
        {/if}
      </ul>
    </div>
    {#if product.description}
      <br />
      <h4 class="mt-2 font-bold text-xl my-4">Description</h4>
      <div class="text-xs tracking-widest">{product.description}</div>
    {/if}
    <div class="ml-4">
      <h4 class="font-bold text-xl my-4">Attributes</h4>
      {#if product.features}
        {#each product.features as f}
          <div class="flex flex-wrap items-center">
            <div
              class="text-sm font-semibold w-1/3 tracking-widest leading-loose">
              {f.key}
            </div>
            <div class="text-gray-700 text-xs tracking-widest leading-loose">
              {f.val}
            </div>
          </div>
        {/each}
      {/if}
    </div>
  </div>
</div>
