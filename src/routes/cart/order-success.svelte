<script>
  import { onMount } from "svelte";
  import Header from "./../../components/Header.svelte";
  import { currency } from "./../../lib";
  import { fadeIn, fadeOut } from "./../../actions/pageFade";
  import { get, put, post } from "./../../lib/api";
  import { stores, goto } from "@sapper/app";
  import CartItem from "./_CartItem.svelte";
  const { page } = stores();
  let order = {};
  async function getOrderDetail() {
    try {
      order = await get("orders/public/" + $page.query.id);
      return order;
    } catch (e) {}
  }
  getOrderDetail();
</script>

<main in:fadeIn out:fadeOut>
  <Header home={true} />
  <div class="flex flex-wrap justify-center">
    {#await getOrderDetail()}
      <div class="text-gray-700 font-bold text-xl mb-2">
        Please wait. Order being processed.
      </div>
    {:then order}
      <!-- {JSON.stringify(order)} -->
      <div class="xs:w-full lg:w-1/3 mt-10 px-2">
        <div
          class="px-28 py-16 rounded bg-green-600 text-white font-bold text-xl
          mb-4 text-center">
          <i class="fa fa-check" />
          All done
        </div>
        <div class="font-hairline text-lg">
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
            class="mt-2 py-3 px-12 tracking-wide primary tet-2xl font-bold
            rounded">
            SHOP MORE
          </button>
        </div>
      </div>
      <div class="lg:w-1/4 mt-2 lg:mt-10 w-full px-4">
        <div class="4/5 right-0 pb-3 bb">
          <div>
            <p class="text-black font-normal text-sm">Price Summary</p>
          </div>
        </div>
        <div class="4/5 right-0 pb-10 pt-2 border-b border-gray-300">
          <div class="flex justify-between mt-2 text-sm">
            <div class="w-1/2 font-bold text-left">Total</div>
            <div class="ml-2 w-1/2 font-bold text-black-400 text-right">
              {currency(order.amount.total)}
            </div>
          </div>
          <div class="flex justify-between mt-2 text-xs">
            <div class=" text-left">Pay by {order.payment.method}</div>
            <div class="text-black-400 text-right">
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
