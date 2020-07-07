<script>
  import Nav from './../../components/Nav.svelte'
  import Button from './../../components/ui/Button.svelte'
  import EmptyCart from './_EmptyCart.svelte'
  import CartSummary from './_CartSummary.svelte'
  import CartBanners from './_CartBanners.svelte'
  import Textarea from './../../components/ui/Textarea.svelte'
  import { cart } from './../../store/cart.js'
  import { stores, goto } from '@sapper/app'
  // const { session } = stores();
  import { currency } from './../../lib'
  import { fadeIn, fadeOut } from './../../actions/pageFade'
  let address
  async function placeOrder() {
    try {
      const o = await cart.checkout({ address })
      goto('/cart/order-success?id=' + o._id)
    } catch (e) {
      goto('/login')
    }
  }
</script>

<main in:fadeIn out:fadeOut>
  <Nav home={true} />
  <div>
    {#if !$cart || !$cart.qty || $cart.qty == 0}
      <EmptyCart />
    {:else}
      <div class="flex flex-wrap justify-between">
        <div class="lg:w-16 xs:w-0" />
        <div class="w-full px-2 lg:w-2/4">
          <div class="justify-between w-full pb-2 hr-line">
            <div class="flex flex-wrap w-full p-3 mt-3 bg-white">
              <div
                class="text-3xl font-bold text-left border-r border-gray-200 headings">
                Checkout
              </div>
              <span class="mx-4 text-sm text-gray-500">
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
            on:click={placeOrder}
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
