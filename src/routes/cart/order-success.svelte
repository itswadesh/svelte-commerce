<script>
  import { onMount } from 'svelte'
  import Nav from './../../components/Nav.svelte'
  import { currency } from './../../lib'
  import { fadeIn, fadeOut } from './../../actions/pageFade'
  import { get, put, post } from './../../lib/api'
  import { stores, goto } from '@sapper/app'
  import CartItem from './_CartItem.svelte'
  const { page } = stores()
  let order = {}
  async function getOrderDetail() {
    try {
      order = await get('orders/public/' + $page.query.id)
      return order
    } catch (e) {}
  }
  getOrderDetail()
</script>

<main in:fadeIn out:fadeOut>
  <Nav home={true} />
  <div class="flex flex-wrap justify-center">
    {#await getOrderDetail()}
      <div class="mb-2 text-xl font-bold text-gray-700">
        Please wait. Order being processed.
      </div>
    {:then order}
      <!-- {JSON.stringify(order)} -->
      <div class="px-2 mt-10 xs:w-full lg:w-1/3">
        <div
          class="py-16 mb-4 text-xl font-bold text-center text-white bg-green-600 rounded px-28">
          <i class="fa fa-check" />
          All done
        </div>
        <div class="text-lg font-hairline">
          Your Order number is
          <span class="font-semibold">{order.orderNo}</span>
        </div>
        <div class="flex justify-between pt-5 pb-5">
          {#each order.items as item, index}
            <CartItem
              product={{ name: item.name, slug: item.slug, _id: item.pid, img: item.img }}
              variant={{ sku: item.sku, size: item.size, img: item.img, mrp: item.mrp, price: item.price, _id: item.vid }}
              qty={item.qty}
              cartButton={false} />
          {/each}
        </div>
        <div class="flex justify-center">
          <button
            on:click={() => goto('/search')}
            class="px-12 py-3 mt-2 font-bold tracking-wide rounded primary tet-2xl">
            SHOP MORE
          </button>
        </div>
      </div>
      <div class="w-full px-4 mt-2 lg:w-1/4 lg:mt-10">
        <div class="right-0 pb-3 4/5 bb">
          <div>
            <p class="text-sm font-normal text-black">Price Summary</p>
          </div>
        </div>
        <div class="right-0 pt-2 pb-10 border-b border-gray-300 4/5">
          <div class="flex justify-between mt-2 text-sm">
            <div class="w-1/2 font-bold text-left">Total</div>
            <div class="w-1/2 ml-2 font-bold text-right text-black-400">
              {currency(order.amount.total)}
            </div>
          </div>
          <div class="flex justify-between mt-2 text-xs">
            <div class="text-left ">Pay by {order.payment.method}</div>
            <div class="text-right text-black-400">
              {currency(order.amount.total)}
            </div>
          </div>
        </div>
        <div>
          <div class="py-3 font-semibold text-gray-700">Shipping address</div>
          <div class="text-sm">
            <div class="py-2 pb-6">{order.address}</div>
          </div>
        </div>
      </div>
    {/await}
  </div>
</main>
