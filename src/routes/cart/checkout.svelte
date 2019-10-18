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
        Checkout
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
</main>
