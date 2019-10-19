<script>
  import Button from "./../../components/ui/Button.svelte";
  import { currency } from "./../../lib";
  import { cart } from "./../../store/cart.js";
  export let product = {};
  function calculateOffPercent(price, mrp) {
    let percent = ((mrp - price) * 100) / mrp;
    return Math.round(percent);
  }
  function addToCart(qty) {
    cart.add({ pid: product._id, vid: product.variants[0]._id, qty });
  }
</script>

<div class="w-full md:w-6/12 lg:w-7/12 leading-relaxed">
  <div class="pb-4 border-b border-gray-200 px-3">
    <p class="text-2xl text-gray-700 font-semibold">{product.brandName}</p>
    <p>{product.name}</p>
  </div>
  {#if product}
    <div class="flex flex-wrap">
      {#if product.flipkart}
        <div class=" text-gray-700 py-3">
          <div class="flex items-center px-3 font-semibold tracking-wider">
            <span class="text-lg mr-2">
              <img
                src="flipkart.jfif"
                alt="flipkart"
                style="width: 30px; height: 30px;" />
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
              <img
                src="amazon.jfif"
                alt="amazon"
                style="width: 30px; height: 30px;" />
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
              <img
                src="store.svg"
                alt="amazon"
                style="width: 30px; height: 30px;" />
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
          class="w-1/2 lg:w-1/3 mr-2 bg-red-600 hover:bg-red-500 text-white py-2
          px-3 rounded font-bold text-xs lg:text-lg text-center">
          BUY FROM
          <img
            src="amazon.jfif"
            alt="amazon"
            style="display:inline-block;width: 30px; height: 30px;" />
        </a>
      {/if}
      {#if product.flipkart && product.flipkart.price}
        <a
          target="blank"
          href={product.productUrl}
          class="w-1/2 lg:w-1/3 mr-2 bg-white border border-yellow-700
          text-black py-2 px-3 rounded font-bold text-xs lg:text-lg text-center">
          BUY FROM
          <img
            src="/flipkart.jfif"
            alt="flipkart"
            style="display:inline-block;width: 30px; height: 30px;" />
        </a>
      {/if}
      {#if product.localPrice}
        <button
          target="blank"
          on:click={() => addToCart(1)}
          class="w-1/2 lg:w-1/3 bg-white border border-green-600 text-black py-2
          px-3 rounded font-bold text-xs lg:text-lg text-center">
          ADD TO CART
          <img
            src="/store.svg"
            alt="local"
            style="display:inline-block;width: 30px; height: 30px;" />
        </button>
      {/if}
    </div>
    <div class="py-8 border-b border-gray-300 px-3">
      <p class="font-bold text-lg">
        TOP FEATURES
        <i class="fa fa-tag ml-2 text-gray-600" aria-hidden="true" />
      </p>
      <div>
        {#if product.keyFeatures}
          {#each product.keyFeatures as k}
            <div
              class="w-full my-2 lg:w-3/5 relative text-left px-3 py-2 rounded
              border hover:border-gray-500">
              <div class="font-bold">{k}</div>
            </div>
          {/each}
        {/if}
      </div>
    </div>
    <div class="py-8 border-b border-gray-300 px-3">
      <p class="font-bold text-lg">
        PRODUCT DETAILS
        <i class="fa fa-list-alt ml-2 text-gray-600" aria-hidden="true" />
      </p>
      <span class="text-gray-500">{product.description}</span>
      {#if product.features}
        {#each product.features as f}
          <p class="font-bold text-lg">{f.key}</p>
          <div class="flex flex-wrap">
            <div class="border-b border-gray-400 mr-4 w-1/2">
              <span class="text-gray-700 text-sm">{f.val}</span>
            </div>
          </div>
        {/each}
      {/if}
    </div>
  </div>
</div>
