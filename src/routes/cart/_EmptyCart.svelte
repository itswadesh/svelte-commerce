<script>
  import { goto } from '@sapper/app'
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
    <div class="px-2 xs:w-full lg:w-2/4">
      <div class="flex flex-wrap w-full p-3 bg-white lg:hidden">
        <div
          class="w-20 text-3xl font-bold text-left border-r border-gray-200 headings">
          Cart
        </div>
        <div class="mx-2 mt-3 text-sm text-gray-500">is empty</div>
      </div>
      <div class="pb-5">
        <div class="left-0 w-full">
          <div class="flex justify-center mt-16">
            <img class="w-1/2 containerr" src="/emptycart.png" alt="" />
          </div>
        </div>
        <div class="left-0 w-full">
          <div>
            <p class="text-lg font-bold text-center text-black">
              There's nothing in here
            </p>
            <p class="text-lg font-hairline text-center text-black">
              You have not added any items to your cart yet.
            </p>
          </div>
        </div>
        <div class="flex justify-center mt-2 margin-0">
          <button
            on:click={() => goto('/search')}
            class="px-12 py-3 mt-10 font-bold tracking-wide rounded primary tet-2xl">
            SHOP NOW
          </button>
        </div>
      </div>
    </div>
    <div class="px-3 mt-10 lg:w-1/4 lg:pr-20 xs:w-full">
      <div class="hidden lg:block">
        <div class="w-full">
          <div class="w-full">
            <div class="pt-8 pb-8 pl-3 pr-3 mt-3 mb-3 mr-1 bg-gray-200 rounded">
              <i class="text-gray-500 fa fa-truck" />
              <p class="text-lg font-normal text-gray-500">Free Shipping*</p>
              <p class="text-xs text-gray-500">
                On orders of ₹500 and above.Details
              </p>
            </div>
          </div>
          <div class="w-full">
            <div class="pt-8 pb-8 pl-3 pr-3 mt-3 mb-3 mr-1 bg-gray-200 rounded">
              <i class="text-gray-500 fa fa-undo" />
              <p class="text-lg font-normal text-gray-500">Easy returns</p>
              <p class="text-xs text-gray-500">
                Send items back for free within 15 days
              </p>
            </div>
          </div>
          <div class="w-full">
            <div class="pt-8 pb-8 pl-3 pr-3 mt-3 mb-3 mr-1 bg-gray-200 rounded">
              <i class="text-gray-500 fa fa-shield" />
              <p class="text-lg font-normal text-gray-500">Secure shopping</p>
              <p class="text-xs text-gray-500">
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
