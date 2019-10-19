<script>
  import Header from "./../../components/Header.svelte";
  import Button from "./../../components/ui/Button.svelte";
  import EmptyCart from "./_EmptyCart.svelte";
  import CartSummary from "./_CartSummary.svelte";
  import CartBanners from "./_CartBanners.svelte";
  import CartItemSkeleton from "./_CartItemSkeleton.svelte";
  import CartItem from "./_CartItem.svelte";
  import Textarea from "./../../components/ui/Textarea.svelte";
  import { cart } from "./../../store/cart.js";
  import { stores, goto } from "@sapper/app";
  // const { session } = stores();
  import { currency } from "./../../lib";
  import { fadeIn, fadeOut } from "./../../actions/pageFade";
  let address;
</script>

<main in:fadeIn out:fadeOut>
  <Header home={true} />
  <div>
    {#if !$cart || !$cart.qty || $cart.qty == 0}
      <EmptyCart />
    {:else}
      <div class="flex flex-wrap justify-between">
        <div class="lg:w-16 xs:w-0" />
        <div class="w-full lg:w-2/4 px-2">
          <div class="w-full hr-line justify-between pb-2">
            <div class="w-full p-3 bg-white mt-3 flex flex-wrap">
              <div
                class="text-left headings text-3xl w-20 border-r border-gray-200
                font-bold">
                Cart
              </div>
              <span class="text-sm mx-4 text-gray-500">
                {$cart.qty} items
                <br />
                Total {currency($cart.total)}
              </span>
            </div>
          </div>
          <Textarea bind:value={address} label="Address" />
          <div class="hidden lg:block" />
          <CartBanners />
        </div>
        <CartSummary cart={$cart}>
          <Button
            full={true}
            on:click={() => goto('/cart/checkout')}
            rounded={true}
            size="xl"
            color="primary">
            PLACE ORDER
          </Button>
        </CartSummary>
        <div class="w-8" />
      </div>
    {/if}
  </div>
</main>
