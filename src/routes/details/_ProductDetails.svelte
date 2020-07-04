<script>
  import Button from './../../components/ui/Button.svelte'
  import { currency } from './../../lib'
  import { cart } from './../../store/cart.js'
  import { goto } from '@sapper/app'
  export let product = {}
  function calculateOffPercent(price, mrp) {
    let percent = ((mrp - price) * 100) / mrp
    return Math.round(percent)
  }
  function addToCart(qty) {
    cart.add({ pid: product._id, vid: product.variants[0]._id, qty })
    goto('/cart')
  }
</script>

<div class="w-full leading-relaxed md:w-6/12 lg:w-7/12">
  <div class="px-3 pb-4 border-b border-gray-200">
    <p class="text-2xl font-semibold text-gray-700">{product.brandName}</p>
    <p class="">{product.name}</p>
  </div>
  {#if product}
    <div class="flex flex-wrap">
      {#if product.flipkart}
        <div class="py-3 text-gray-700 ">
          <div class="flex items-center px-3 font-semibold tracking-wider">
            <span class="mr-2 text-lg">
              <img src="/flipkart-512.png" alt="" class="w-8" />
            </span>
            <span class="mr-2 text-lg">
              {currency(product.flipkart.specialPrice || product.flipkart.price)}
              {#if product.flipkart.shippingCharge}
                +{currency(product.flipkart.shippingCharge)}
              {/if}
            </span>
            {#if product.flipkart.mrp > (product.flipkart.specialPrice || product.flipkart.price)}
              <span class="mr-2 font-hairline line-through">
                {currency(product.flipkart.mrp)}
              </span>
            {/if}
            {#if calculateOffPercent(product.flipkart.specialPrice || product.flipkart.price, product.flipkart.mrp) > 0}
              <span class="text-xs text-orange-500">
                ({calculateOffPercent(product.flipkart.specialPrice || product.flipkart.price, product.flipkart.mrp)}%
                OFF)
              </span>
            {/if}
          </div>
          <div class="pl-3">3 day delivery</div>
        </div>
      {/if}
      {#if product.amazon}
        <div class="py-3 text-gray-700 ">
          <div class="flex items-center px-3 font-semibold tracking-wider">
            <span class="mr-2 text-lg">
              <i class="mt-2 fab fa-amazon" />
            </span>
            <span class="mr-2 text-lg">
              {currency(product.amazon.specialPrice || product.amazon.price)}
            </span>
            {#if product.amazon.mrp > (product.amazon.specialPrice || product.amazon.price)}
              <span class="mr-2 font-hairline line-through">
                {currency(product.amazon.mrp)}
              </span>
            {/if}
            {#if calculateOffPercent(product.amazon.specialPrice || product.amazon.price, product.amazon.mrp) > 0}
              <span class="text-xs text-orange-500">
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
        <div class="py-3 text-green-700 ">
          <div class="flex items-center px-3 font-semibold tracking-wider">
            <span class="mr-2 text-lg">
              <i class="mt-2 fas fa-store" />
            </span>
            <span class="mr-2 text-lg">{currency(product.localPrice)}</span>
            {#if product.flipkart.mrp > product.localPrice}
              <span class="mr-2 font-hairline line-through">
                {currency(product.flipkart.mrp)}
              </span>
            {/if}
            {#if calculateOffPercent(product.localPrice, product.flipkart.mrp) > 0}
              <span class="text-xs text-orange-500">
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
      class="fixed bottom-0 flex w-full p-2 mt-4 bg-white lg:relative lg:px-3"
      style="z-index:9999;">
      {#if product.amazonUrl}
        <a
          target="blank"
          href={product.amazonUrl}
          class="items-center justify-center w-full py-2 mr-2 text-2xl font-bold text-center rounded outline-none md:w-72 h-14 primary">
          Get it from Amazon
        </a>
      {:else if product.flipkart && product.flipkart.price}
        <a
          target="blank"
          href={product.productUrl}
          class="flex items-center justify-center w-full py-2 mr-2 text-2xl font-bold text-center rounded outline-none md:w-72 h-14 primary">
          Get it from Flipkart
        </a>
      {:else if product.localPrice}
        <button
          target="blank"
          on:click={() => addToCart(1)}
          class="items-center w-full px-3 py-2 text-2xl font-bold text-center bg-white border border-red-600 rounded lg:w-1/3 text-primary lg:text-lg">
          Add to cart
          <i class="fas fa-shopping-cart" />
        </button>
      {/if}
    </div>
    <div class="px-3 py-4 border-b border-gray-300">
      <h4 class="text-xl font-bold">Top Features</h4>
      <ul class="text-xs">
        {#if product.keyFeatures}
          {#each product.keyFeatures as k}
            <li
              class="inline w-full pr-3 leading-loose lg:w-3/5 hover:text-gray-600">
              &bull; {k}
            </li>
          {/each}
        {/if}
      </ul>
    </div>
    {#if product.description}
      <br />
      <h4 class="my-4 mt-2 text-xl font-bold">Description</h4>
      <div class="text-xs tracking-widest">{product.description}</div>
    {/if}
    <div class="ml-4">
      <h4 class="my-4 text-xl font-bold">Attributes</h4>
      {#if product.features}
        {#each product.features as f}
          <div class="flex flex-wrap items-center">
            <div
              class="w-1/3 text-sm font-semibold leading-loose tracking-widest">
              {f.key}
            </div>
            <div class="text-xs leading-loose tracking-widest text-gray-700">
              {f.val}
            </div>
          </div>
        {/each}
      {/if}
    </div>
  </div>
</div>
