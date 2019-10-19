<script>
  import { goto } from "@sapper/app";
</script>

<style>
  .fa-truck {
    transform: scaleX(-1);
  }
  .fa-truck,
  .fa-undo,
  .fa-shield {
    font-size: 2rem;
  }
</style>

<div>
  <div class="flex flex-wrap justify-between">
    <div class="lg:w-16 xs:w-0" />
    <div class="xs:w-full lg:w-2/4 px-2">
      <div class="block lg:hidden w-full p-3 bg-white flex flex-wrap">
        <div
          class="text-left headings text-3xl w-20 border-r border-gray-200
          font-bold">
          Cart
        </div>
        <div class="text-sm mx-2 mt-3 text-gray-500">is empty</div>
      </div>
      <div class="pb-5">
        <div class="w-full left-0">
          <div class="mt-16 flex justify-center">
            <img
              class="containerr w-1/2"
              src="/emptycart.png"
              alt="empty cary image" />
          </div>
        </div>
        <div class="w-full left-0">
          <div>
            <p class="text-center font-bold text-lg text-black">
              There's nothing in here
            </p>
            <p class="text-center font-hairline text-lg text-black">
              You have not added any items to your cart yet.
            </p>
          </div>
        </div>
        <div class="mt-2 margin-0 flex justify-center">
          <button
            on:click={() => goto('/search')}
            class="mt-10 py-3 px-12 tracking-wide primary tet-2xl font-bold
            rounded">
            SHOP NOW
          </button>
        </div>
      </div>
    </div>
    <div class="lg:w-1/4 mt-10 lg:pr-20 xs:w-full px-3">
      <div class="hidden lg:block">
        <div class="w-full">
          <div class="w-full">
            <div
              class="bg-gray-200 rounded pl-3 pr-3 pt-8 pb-8 mt-3 mb-3 mr-1 mr-1">
              <i class="fa fa-truck text-gray-500" />
              <p class="text-gray-500 text-lg font-normal">Free Shipping*</p>
              <p class="text-gray-500 text-xs">
                On orders of ₹500 and above.Details
              </p>
            </div>
          </div>
          <div class="w-full">
            <div
              class="bg-gray-200 rounded pl-3 pr-3 pt-8 pb-8 mt-3 mb-3 mr-1 mr-1">
              <i class="fa fa-undo text-gray-500" />
              <p class="text-gray-500 text-lg font-normal">Easy returns</p>
              <p class="text-gray-500 text-xs">
                Send items back for free within 15 days
              </p>
            </div>
          </div>
          <div class="w-full">
            <div class="bg-gray-200 rounded pl-3 pr-3 pt-8 pb-8 mt-3 mb-3 mr-1">
              <i class="fa fa-shield text-gray-500" />
              <p class="text-gray-500 text-lg font-normal">Secure shopping</p>
              <p class="text-gray-500 text-xs">
                Your payment details are fully encrypted
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="w-8" />
  </div>
</div>
