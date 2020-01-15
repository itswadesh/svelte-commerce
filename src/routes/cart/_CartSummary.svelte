<script>
  export let cart = {};
  import { stores, goto } from "@sapper/app";
  const { session } = stores();
  import { currency } from "./../../lib";
</script>

<div class="lg:w-1/4 mt-10 lg:pr-20 xs:w-full px-3">
  <div class="4/5 right-0 border-b border-dotted lg:mb-0">
    <div>
      <p class="text-black mt-4 font-normal text-xl">Price Summary</p>
      <span class="text-gray-400 text-xs">
        Includes GST and all government taxes
      </span>
      <div class="flex justify-between mt-1">
        <div class="w-1/2 text-sm text-left">Total item price</div>
        <div class="ml-2 w-1/2 text-black-400 text-right">
          {currency(cart.subtotal)}
        </div>
      </div>
      <div class="flex justify-between mt-1">
        <div class="w-1/2 text-sm text-left">Item discount</div>
        <div class="ml-2 w-1/2 text-black-400 text-right">
          {currency(cart.discount)}
        </div>
      </div>
      {#if $session.settings && $session.settings.shipping}
        <div class="flex justify-between mt-1">
          <div class="w-1/2 text-sm text-left">Shipping fee</div>
          {#if $session.settings.shipping.charge > 0}
            <div class="ml-2 w-1/2 text-black-400 text-right">
              {currency($session.settings.shipping.charge)}
            </div>
          {:else}
            <div class="ml-2 w-1/2 text-black-400 text-right">FREE</div>
          {/if}
        </div>
      {/if}
      <div class="mt-1">
        <p class="text-xs text-gray-400 pb-2">
          Free shipping on orders of ₹999 or more. For first purchase,
          <a href class="underline">See Offer</a>
        </p>
      </div>
    </div>
    <div class="text-xs bg-red-100 rounded p-2 text-gray-500 my-2">
      <div class="flex items-center">
        <img src="/shield.png" class="w-12 pr-2" alt="" />
        <div class="ml-1 justify">
          Genuine products. 15 day returns. 100% secure payments.
          <span class="text-black">Know More</span>
        </div>
      </div>
    </div>
  </div>
  <div
    class="w-full right-0 lg:relative fixed bottom-0 bg-white px-2 lg:px-0
    lg:py-0 py-4 shadow lg:shadow-none">
    <div class="flex justify-between mt-2">
      <div class="w-1/2 text-lg font-bold text-left">Total</div>
      <div class="ml-2 w-1/2 font-bold text-black-400 text-right">
        {currency(cart.total)}
      </div>
    </div>
    <slot />
  </div>
</div>
