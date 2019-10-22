<script>
  import { get, put, post } from "./../../lib/api";
  import { goto, stores } from "@sapper/app";
  import { date } from "./../../lib";
  import CartItem from "./../cart/_CartItem.svelte";
  import { fadeIn, fadeOut } from "./../../actions/pageFade";
  let orders;
  async function getOrders() {
    try {
      let o = await get("orders/my");
      return (orders = o.data);
    } catch (e) {
      console.log("err...", e.toString());
    }
  }
  getOrders();
</script>

<main in:fadeIn out:fadeOut>
  <div class="mt-0 lg:mt-10 w-full lg:px-10 px-2">
    <div class="flex justify-between items-center my-4">
      <a href="/my">
        <i class="fa fa-arrow-left" />
      </a>
      <div class="text-2xl font-bold p-6 text-center lg:text-left">Orders</div>
    </div>
    <!-- {JSON.stringify(orders)} -->
    {#await getOrders()}
      <div class="text-gray-700 font-bold text-xl mb-2">
        Please wait. Order being processed.
      </div>
    {:then orders}
      {#if orders.length == 0}
        <div class="text-gray-700 font-bold text-xl mb-2">
          No order placed yet.
        </div>
      {:else}
        {#each orders as o}
          {o.orderNo} -
          <span class="text-xs mute">{date(o.createdAt)}</span>
          <div
            class="bg-white shadow rounded flex flex-wrap py-3 px-8
            justify-between hover:shadow-xl">
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
