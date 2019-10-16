<script>
  import Header from "./../components/Header.svelte";
  import { stores, goto } from "@sapper/app";
  const { session } = stores();
  import { currency } from "./../lib";
  import { fadeIn, fadeOut } from "./../actions/pageFade";
</script>

<main in:fadeIn out:fadeOut>
<Header />
<h1>Cart</h1>
<!-- {JSON.stringify($session.cart)} -->
<div class="cart-items">
  {#each $session.cart.items as i}
    {JSON.stringify(i.product.name)} {i.variant.size}
    {currency(i.variant.price)}
  {/each}
</div>
<div class="cart-summary">{$session.cart.subtotal}={$session.cart.total}</div>
</main>