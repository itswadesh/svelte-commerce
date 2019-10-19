<script>
  export let pid, vid, qty;
  let loading = false;
  import { cart } from "./../../store/cart.js";

  async function addToBag(qty) {
    if (!vid) {
      console.log("Please select a size");
    } else {
      loading = true;
      await cart.add({ pid, vid, qty });
      loading = false;
    }
  }
  function checkCart({ pid, vid }) {
    let found = $cart.items.some(function(el) {
      return el.product._id === pid && el.variant._id === vid;
    });
    return found;
  }
</script>

<div class="flex">
  {#if !checkCart({ pid, vid })}
    <div disabled={!vid} on:click={() => addToBag(1)}>
      <button class="primary rounded px-2 rounded">
        <i class="fa fa-plus" />
        Add to Cart
      </button>
    </div>
  {:else}
    <span class="mt-1">Quantity: &nbsp;</span>
    <div>
      <div class="flex flex-wrap">
        <button
          class="muted rounded-full w-8 h-8"
          on:click={() => addToBag(-1)}>
          <i class="fa fa-minus m-auto" aria-hidden="true" />
        </button>
        <div class="px-2 flex items-center text-center">
          {#if !loading}
            <div>{qty}</div>
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
