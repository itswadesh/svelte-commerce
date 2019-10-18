<script>
  import Header from "./../../components/Header.svelte";
  import Button from "./../../components/ui/Button.svelte";
  import EmptyCart from "./_EmptyCart.svelte";
  import CartSummary from "./_CartSummary.svelte";
  import CartBanners from "./_CartBanners.svelte";
  import CartItemSkeleton from "./_CartItemSkeleton.svelte";
  import CartItem from "./_CartItem.svelte";
  import { stores, goto } from "@sapper/app";
  const { session } = stores();
  import { cart } from "./../../store/cart.js";
  import { currency } from "./../../lib";
  import { fadeIn, fadeOut } from "./../../actions/pageFade";
</script>

<main in:fadeIn out:fadeOut>
  <Header home={true} />
  <div>
    {#if !$session.cart || !$session.cart.qty || $session.cart.qty == 0}
      <EmptyCart />
    {/if}
    <div class="flex flex-wrap justify-between" v-else>
      <div class="lg:w-16 xs:w-0" />
      <div class="w-full lg:w-2/4 px-2">
        <div class="w-full hr-line justify-between pb-2">
          <!-- <Offers /> -->
          <div
            class="hidden lg:block font-bold headings w-full text-lg bg-white
            mt-10">
            <div class="flex flex-wrap">
              <div class="text-left w-1/2">
                My Shopping Bag ({$session.cart.qty} Items)
              </div>
              <div class="text-right w-1/2">
                Total {currency($session.cart.total)}
              </div>
            </div>
          </div>

          <div class="block lg:hidden w-full p-3 bg-white mt-3 flex flex-wrap">
            <div
              class="text-left headings text-3xl w-20 border-r border-gray-200
              font-bold">
              Cart
            </div>
            <span class="text-sm mx-4 text-gray-500">
              {$session.cart.qty} items
              <br />
              Total {currency($session.cart.total)}
            </span>
          </div>
        </div>
        {#each $session.cart.items as item, index}
          <CartItem {item} />
        {/each}
        <!-- <CartItemSkeleton /> -->
        <div class="hidden lg:block">
          <nuxt-link
            to="wishlist"
            class="w-full shadow flex flex-wrap justify-between p-4 mt-6 mb-6">
            <div>
              <i class="fa fa-bookmark-o mt-1 mr-2" aria-hidden="true" />
              Add More From Wishlist
            </div>
            <i class="fa fa-angle-right mt-1 ml-2" aria-hidden="true" />
          </nuxt-link>
        </div>
        <CartBanners />
      </div>
      <CartSummary cart={$session.cart}>
        <Button
          full={true}
          on:click={() => goto('/checkout/address')}
          rounded={true}
          size="xl"
          color="primary">
          PLACE ORDER
        </Button>
      </CartSummary>
      <div class="w-8" />
    </div>
  </div>
  <!-- {JSON.stringify($session.cart)}
  <div class="cart-items">
    {#each $session.cart.items as i}
      {JSON.stringify(i.product.name)} {i.variant.size}
      {currency(i.variant.price)}
    {/each}
  </div>
  <div class="cart-summary">{$session.cart.subtotal}={$session.cart.total}</div> -->
</main>
