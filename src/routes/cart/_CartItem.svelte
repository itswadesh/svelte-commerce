<script>
  import CartButtons from './_CartButtons.svelte'
  import { currency } from './../../lib'
  import { cart } from './../../store/cart.js'
  import { lazyload } from '../../actions/lazyload'
  import { stores } from '@sapper/app'
  const { preloading, page, session } = stores()

  export let product = {},
    variant = {},
    qty,
    cartButton = true
  let loading = false

  async function addToBag({ pid, vid, qty }) {
    if (!vid) {
      console.log('Please select a size')
    } else {
      loading = true
      await cart.add({ pid, vid, qty })
      loading = false
    }
  }

  function calculateOffPercent(mrp, price) {
    let percent = ((mrp - price) * 100) / mrp
    return Math.round(percent)
  }
</script>

<div class="flex justify-between pt-5 pb-5">
  <div class="w-1/2 lg:w-1/3">
    <div>
      <img
        use:lazyload
        class="w-64 lg:rounded xs:rounded-b-none"
        src="/3px.png"
        data-src={$session.settings.CDN_URL + product.img}
        alt="" />
      <!-- <div class="p-2 text-black bg-gray-300 rounded rounded-t-none lg:hidden xs:visible">Arrives 19 Sep</div> -->
    </div>
  </div>
  <div class="right-0 lg:w-4/5 xs:9/12">
    <div class="pl-4 font-hairline">
      <p class="mb-2 text-xs text-black">
        <a href={`/${product.slug}?id=${product._id}`}>{product.name}</a>
      </p>
      <div class="flex">
        <p class="mb-2 text-gray-500">
          <span>Size:</span>
          {variant.size}
        </p>
        <span class="inline-block w-2 h-2 m-2 bg-gray-300 rounded-full" />
        {#if variant.stock < 5}
          <span style="color: rgb(237, 113, 0);">{variant.stock} left</span>
        {/if}
      </div>
      <p class="relative mb-2">
        <span class="mb-2 font-bold text-black">{currency(variant.price)}</span>
        {#if calculateOffPercent(variant.mrp, variant.price) > 0}
          <span class="ml-2 text-xs text-gray-400 line-through lg:text-sm">
            {currency(variant.mrp)}
          </span>
          <span class="ml-2 text-xs text-green-400 lg:text-sm">
            {calculateOffPercent(variant.mrp, variant.price)}% off
          </span>
        {/if}
      </p>
      {#if cartButton}
        <div class="justify-between text-sm">
          <div class="flex flex-wrap justify-between">
            <div class="w-full my-2 lg:w-3/5">
              <CartButtons pid={product._id} vid={variant._id} {qty} />
            </div>
            <div class="w-full my-2 text-right lg:w-2/5">
              <div class="">
                <button
                  class="px-3 py-2 ml-3 rounded muted"
                  on:click={() => addToBag({
                      pid: product._id,
                      vid: variant._id,
                      qty: -10000
                    })}
                  disabled={loading}>
                  {#if loading}
                    <img
                      src="/loading.svg"
                      class="w-3 h-3 rotateOutDownLeft"
                      alt="..." />
                  {:else}
                    <i class="fa fa-trash" />
                  {/if}
                </button>
              </div>
            </div>
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>
