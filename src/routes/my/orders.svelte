<script>
  import { get, put, post } from './../../lib/api'
  import { goto, stores } from '@sapper/app'
  import { date } from './../../lib'
  import CartItem from './../cart/_CartItem.svelte'
  import { fadeIn, fadeOut } from './../../actions/pageFade'

  let orders
  async function getOrders() {
    try {
      let o = await get('orders/my')
      return (orders = o.data)
    } catch (e) {
      goto('/login')
    }
  }
  getOrders()
</script>

<main in:fadeIn out:fadeOut>
  <div class="px-2 lg:px-10">
    <div class="flex items-center justify-between my-4">
      <a href="/my">
        <i class="fa fa-arrow-left" />
      </a>
      <div class="text-2xl font-bold text-center lg:p-6 lg:text-left">
        Orders
      </div>
    </div>
    <!-- {JSON.stringify(orders)} -->
    {#await getOrders()}
      <div class="mb-2 text-xl font-bold text-gray-700">
        Please wait. Order being processed.
      </div>
    {:then orders}
      {#if orders.length == 0}
        <div class="mb-2 text-xl font-bold text-gray-700">
          No order placed yet.
        </div>
      {:else}
        {#each orders as o}
          {o.orderNo} -
          <span class="text-xs mute">{date(o.createdAt)}</span>
          <div
            class="flex flex-wrap justify-between px-8 py-3 bg-white rounded shadow hover:shadow-xl">
            {#each o.items as item}
              <CartItem
                product={{ name: item.name, slug: item.slug, _id: item.pid, img: item.img }}
                variant={{ sku: item.sku, size: item.size, img: item.img, mrp: item.mrp, price: item.price, _id: item.vid }}
                qty={item.qty}
                cartButton={false} />
            {/each}
          </div>
        {/each}
      {/if}
    {:catch error}
      <p style="color: red">{error.message}</p>
    {/await}
  </div>
</main>
