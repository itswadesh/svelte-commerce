<script>
  export let product, variant;
  let loading = false;
  import { cart } from "./../../store/cart.js";

  async function addToBag(qty) {
    if (!this.variant) this.$store.commit("setErr", "Please select a size");
    else {
      this.loading = true;
      await this.addToCart({
        pid: this.product._id,
        vid: this.variant._id,
        qty
      });
      this.loading = false;
    }
  }
  async function checkCart({ pid, vid }) {
    const c = await cart.fetch();
    let found = c.items.some(function(el) {
      return el.product._id === pid && el.variant._id === vid;
    });
    return found;
  }
  async function getQty({ pid, vid }) {
    // Gets cart qty of that item
    const c = await cart.fetch();
    for (let i of c.items) {
      if (i.product._id === pid && i.variant._id === vid) {
        return i.qty;
      }
    }
  }
  function toggle(item) {
    if (item == "details") showDetails = !showDetails;
    else if (item == "about") showAbout = !showAbout;
  }
</script>

<style>
  .cart-button {
    border: 1px solid transparent;
    color: #32325d;
    cursor: pointer;
    justify-content: center;
    text-align: center;
    white-space: nowrap;
    box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.23);
  }
</style>

<div class="flex">
  <span class="mt-1">Quantity: &nbsp;</span>
  {#if !checkCart({ pid: product._id, vid: variant._id })}
    <div
      disabled={!variant || variant.price < 1 || variant.stock < 1}
      on:click={() => addToBag(1)}>
      <button class="text-gray-600 bg-gray-200 rounded px-2 rounded">
        <img src="/plus.svg" alt="plus icon" />
      </button>
    </div>
  {:else}
    <div>
      <div class="flex flex-wrap">
        <button
          class="muted rounded-full w-8 h-8"
          on:click={() => addToBag(-1)}>
          <i class="fa fa-minus m-auto" aria-hidden="true" />
        </button>
        <div class="px-2 flex items-center text-center">
          {#if !loading}
            <div>{getQty({ pid: product._id, vid: variant._id })}</div>
          {:else}
            <img alt="loading svg" class="w-3 h-4" src="/loading.svg" />
          {/if}
        </div>
        <button
          class="primary rounded-full w-8 h-8"
          :disabled="!variant || variant.price<1 || variant.stock<1 || loading"
          on:click={() => addToBag(1)}>
          <i class="fa fa-plus m-auto" aria-hidden="true" />
        </button>
      </div>
    </div>
  {/if}
</div>
